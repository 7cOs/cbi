describe('Unit: opportunitiesController', function() {
  /* require('angular-mocks/ngMock');
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

  it('should have controller methods accessible', function() {
    expect(ctrl.accountQuerySearch).not.toBeUndefined();
    expect(ctrl.addOpportunity).not.toBeUndefined();
    expect(ctrl.applyFilter).not.toBeUndefined();
    expect(ctrl.brandQuerySearch).not.toBeUndefined();
    expect(ctrl.distributorQuerySearch).not.toBeUndefined();
  });*/

  /* need to mock services before we test these methods
  it('[accountQuerySearch], it should return a filtered store list', function() {
  });*/

  /* it('[addOpportunity], it should call opportunitiesService.createOpportunity()', function() {
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
  });*/

  /* it('[expandCallback], it should add an item from the vm.expandedOpportunities array', function() {
    // check init
    expect(ctrl.expandedOpportunities).not.toBeUndefined();
    expect(ctrl.expandedOpportunities.length).toEqual(0);

    // run method
    ctrl.expandCallback()
  });

  it('[collapseCallback], it should remove an item from the vm.expandedOpportunities array', function() {
    expect(ctrl.expandedOpportunities).not.toBeUndefined();
    expect(ctrl.expandedOpportunities.length).toEqual(1);
  });*/

});
