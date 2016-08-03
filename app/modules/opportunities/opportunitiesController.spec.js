describe('Unit: opportunitiesController', function() {
  require('angular-mocks/ngMock');
  require('angular-ui-router');

  var scope, q, ctrl, oService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('andromeda.common.services');
    angular.mock.module('andromeda.modules.opportunities');

    angular.mock.inject(function GetDependencies(opportunitiesService) {
      oService = opportunitiesService;
    });

    inject(function($rootScope, $controller, opportunitiesService, $q) {
      scope = $rootScope.$new();
      q = $q;
      ctrl = $controller('opportunitiesController', {$scope: scope, opportunitiesService: oService});
    });

  });

  it('should have services defined', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof (ctrl.chipsService)).toEqual('object');
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');
    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');
  });

  it('should have controller variables defined', function() {
    expect(ctrl.depletionsChevron).not.toBeUndefined();
    expect(typeof (ctrl.depletionsChevron)).toEqual('boolean');

    expect(ctrl.expandedOpportunities).not.toBeUndefined();
    expect(typeof (ctrl.expandedOpportunities)).toEqual('object');

    expect(ctrl.opportunitiesChevron).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesChevron)).toEqual('boolean');

    expect(ctrl.reverse).not.toBeUndefined();
    expect(typeof (ctrl.reverse)).toEqual('boolean');

    expect(ctrl.segmentationChevron).not.toBeUndefined();
    expect(typeof (ctrl.segmentationChevron)).toEqual('boolean');

    expect(ctrl.selected).not.toBeUndefined();
    expect(typeof (ctrl.selected)).toEqual('object');

    expect(ctrl.sortProperty).not.toBeUndefined();
    expect(typeof (ctrl.sortProperty)).toEqual('string');

    expect(ctrl.storeChevron).not.toBeUndefined();
    expect(typeof (ctrl.storeChevron)).toEqual('boolean');
  });

  it('should have controller methods accessible', function() {
    expect(ctrl.accountQuerySearch).not.toBeUndefined();
    expect(ctrl.addOpportunity).not.toBeUndefined();
    expect(ctrl.applyFilter).not.toBeUndefined();
    expect(ctrl.brandQuerySearch).not.toBeUndefined();
    expect(ctrl.collapseCallback).not.toBeUndefined();
    expect(ctrl.distributorQuerySearch).not.toBeUndefined();
    expect(ctrl.exists).not.toBeUndefined();
    expect(ctrl.expandCallback).not.toBeUndefined();
    expect(ctrl.isChecked).not.toBeUndefined();
    expect(ctrl.saveFilter).not.toBeUndefined();
    expect(ctrl.sortBy).not.toBeUndefined();
    expect(ctrl.toggle).not.toBeUndefined();
    expect(ctrl.toggleAll).not.toBeUndefined();
  });

  /* need to mock services before we test these methods
  it('[accountQuerySearch], it should return a filtered store list', function() {
  });*/

  it('[addOpportunity], it should call opportunitiesService.createOpportunity()', function() {
    // create service method spy
    spyOn(ctrl.opportunitiesService, 'createOpportunity').and.callFake(function() {
      var deferred = q.defer();
      return deferred.promise;
    });

    // run controller function
    ctrl.addOpportunity();

    // assertions
    expect(ctrl.opportunitiesService.createOpportunity).toHaveBeenCalled();
    expect(ctrl.opportunitiesService.createOpportunity.calls.count()).toEqual(1);
  });

});
