const listsApiServiceMock = require('../../../services/api/v3/lists-api.service.mock').listApiServiceMock;
const listsTransformerServiceMock = require('../../../services/lists-transformer.service.mock').listsTransformerServiceMock;

describe('Unit: target list controller', function() {
  let q, scope, ctrl, userService, listsApiService, listsTransformerService;

  beforeEach(function() {
    listsApiService = listsApiServiceMock;
    listsTransformerService = listsTransformerServiceMock;
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.target');

    angular.mock.module(($provide) => {
      $provide.value('listsApiService', listsApiService);
      $provide.value('listsTransformerService', listsTransformerService);
    });
    spyOn(listsTransformerService, 'getV2ListsSummary').and.returnValue({
      ownedNotArchivedTargetLists: [
          {id: '1', deleted: false, archived: false},
          {id: '2', deleted: false, archived: false}
      ],
      sharedWithMe: [
          {id: '5', deleted: false, archived: false},
          {id: '6', deleted: false, archived: false}
      ],
      ownedNotArchived: 2,
      sharedNotArchivedCount: 3
    });

    spyOn(listsApiService, 'getListsPromise').and.callFake(() => {
      const defer = q.defer();
      defer.resolve();
      return defer.promise;
    });

    inject(function($q, $controller, $rootScope, _userService_, _listsApiService_, _listsTransformerService_) {
      scope = $rootScope.$new();
      q = $q;
      userService = _userService_;
      listsApiService = _listsApiService_;
      listsTransformerService = _listsTransformerService_;
      ctrl = $controller('targetListController', {$scope: scope});
    });

    userService.model.currentUser.employeeID = '1234567';
  });

  it('should have services defined', function() {
    expect(ctrl.loaderService).not.toBeUndefined();
  });

  it('should have updated the model', function() {
    scope.$apply();
    expect(ctrl.types.mine.total).toEqual(2);
    expect(ctrl.types.mine.name).toEqual('My Lists');
    expect(ctrl.types.mine.records).toEqual([
                    {id: '1', deleted: false, archived: false},
                    {id: '2', deleted: false, archived: false}
    ]);
    expect(ctrl.types.shared.total).toEqual(3);
    expect(ctrl.types.shared.name).toEqual('Shared with Me');
    expect(ctrl.types.shared.records).toEqual([
                    {id: '5', deleted: false, archived: false},
                    {id: '6', deleted: false, archived: false}
    ]);
  });

  it('test records shown length', function() {
      expect(ctrl.recordsShownLength(5)).toEqual(5);
      expect(ctrl.recordsShownLength(6)).toEqual(5);
      expect(ctrl.recordsShownLength(4)).toEqual(4);
  });

  it('test ratio', function() {
      expect(ctrl.ratio(5, 2)).toEqual(250);
      expect(ctrl.ratio(2, 5)).toEqual(40);
  });

  it('test analytics action type', function() {
      expect(ctrl.analyticsActionForType('Shared with Me')).toEqual('Shared List');
      expect(ctrl.analyticsActionForType('Shared With Me')).toEqual('My List');
  });

  it('test tab filter', function() {
      expect(ctrl.tabFilter({name: 'Archived'})).toEqual(false);
      expect(ctrl.tabFilter({name: 'Shared with Me'})).toEqual(true);
      expect(ctrl.tabFilter({name: 'My Lists'})).toEqual(true);
  });

});
