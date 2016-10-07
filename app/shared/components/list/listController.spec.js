describe('Unit: list controller', function() {
  var scope, ctrl, q, filtersService, loaderService, opportunitiesService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.list');
    // filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService
    inject(function($rootScope, _$q_, $controller, _filtersService_, _loaderService_, _opportunitiesService_) {
      scope = $rootScope.$new();
      q = _$q_;

      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;

      ctrl = $controller('listController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');
  });

  describe('sortBy method', function() {
    it('should exist', function() {
      expect(ctrl.sortBy).not.toBeUndefined();
      expect(typeof (ctrl.sortBy)).toEqual('function');
    });

    it('should have default sort settings applied (store ascending)', function() {
      expect(filtersService.model.appliedFilter.sort.sortArr[0].str).toEqual('store');
      expect(filtersService.model.appliedFilter.sort.sortArr[0].asc).toEqual(true);
    });

    beforeEach(function() {
      filtersService.model.appliedFilter.sort.sortArr[0] = {str: 'store', asc: true};

      // Spies
      spyOn(loaderService, 'openLoader').and.callFake(function() {
        return true;
      });
      spyOn(opportunitiesService, 'getOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should toggle asc when the same sort is applied', function() {
      ctrl.sortBy('store');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'store', asc: false});
    });

    it('should switch the sort string and set asc to true when a new sort is applied', function() {
      ctrl.sortBy('segmentation');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'segmentation', asc: true});
    });

    it('should open loader when the sort is applied', function() {
      ctrl.sortBy('store');

      expect(loaderService.openLoader).toHaveBeenCalled();
    });

    it('should send request to get opportunities when sort is applied', function() {
      ctrl.sortBy('store');

      expect(opportunitiesService.getOpportunities).toHaveBeenCalled();
    });
  });
});
