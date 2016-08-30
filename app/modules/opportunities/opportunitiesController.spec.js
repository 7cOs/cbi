describe('Unit: opportunitiesController', function() {
  var scope, q, ctrl, userService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.opportunities');

    inject(function($rootScope, $controller, $q, opportunitiesService, _userService_) {
      scope = $rootScope.$new();
      q = $q;
      userService = _userService_;
      spyOn(userService, 'getOpportunityFilters').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
      ctrl = $controller('opportunitiesController', {$scope: scope});
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
    // expect(ctrl.accountQuerySearch).not.toBeUndefined();
    expect(ctrl.applyFilter).not.toBeUndefined();
    // expect(ctrl.brandQuerySearch).not.toBeUndefined();
    // expect(ctrl.distributorQuerySearch).not.toBeUndefined();
  });

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
  });  */

  it('[init], it should call userService.getOpportunityFilters on init', function() {
    /* expect(ctrl.userService.getOpportunityFilters).toHaveBeenCalled();
    expect(ctrl.userService.getOpportunityFilters.calls.count()).toEqual(1); */
  });

});
