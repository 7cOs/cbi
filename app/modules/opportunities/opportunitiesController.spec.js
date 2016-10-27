describe('Unit: opportunitiesController', function() {
  var scope, q, ctrl, userService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.opportunities');

    inject(function($rootScope, $controller, $q, opportunitiesService, _userService_, _chipsService_, _filtersService_) {
      scope = $rootScope.$new();
      q = $q;
      userService = _userService_;
      // Currently not required but will be in future test cases
      // filtersService = _filtersService_;

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
});
