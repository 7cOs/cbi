describe('Unit: target list controller', function() {
  var scope, ctrl, userService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.target');

    inject(function($controller, $rootScope, _userService_) {
      scope = $rootScope.$new();

      userService = _userService_;

      spyOn(userService, 'getTargetLists').and.callFake(function() {
       return {
         then: function(callback) {
             return callback({
                 owned: [
                     {id: '1', deleted: false, archived: false},
                     {id: '2', deleted: false, archived: false},
                     {id: '3', deleted: false, archived: true},
                     {id: '4', deleted: true, archived: true}
                     ],
                 sharedWithMe: [
                     {id: '5', deleted: false, archived: false},
                     {id: '6', deleted: false, archived: false},
                     {id: '7', deleted: true, archived: false},
                     {id: '8', deleted: false, archived: true}
                 ]
            });
        }
       };
     });

      userService.model.currentUser.employeeID = '1234567';
      ctrl = $controller('targetListController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.loaderService).not.toBeUndefined();
  });

  it('should have updated the model', function() {
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
      expect(ctrl.types.archived.total).toEqual(2);
      expect(ctrl.types.archived.name).toEqual('Archived');
      expect(ctrl.types.archived.records).toEqual([]);
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
