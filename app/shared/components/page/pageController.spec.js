describe('Unit: page controller', function() {
  var scope, ctrl, q, filtersService, loaderService, opportunitiesService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.page');

    inject(function($rootScope, _$q_, $controller, _filtersService_, _loaderService_, _opportunitiesService_) {
      scope = $rootScope.$new();
      q = _$q_;

      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;

      ctrl = $controller('pageController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
  });

  describe('displayPagination', function() {
    beforeEach(function() {
      opportunitiesService.model.opportunities = [{
        'id': 'SbBGk',
        'product': {
          'id': '2234gg',
          'name': 'Corona',
          'type': 'package',
          'brand': 'CORONA EXTRA',
          'brandCode': '228'
        },
        'type': 'MANUAL',
        'subType': 'ND_001',
        'impact': 'H',
        'impactDescription': 'HIGH',
        'status': 'OPEN',
        'rationale': 'Rationale 1',
        'store': {
          'id': 'dsd82',
          'name': 'Store 1',
          'address': '1221 11th St NE, City, ST 12345',
          'onPremise': true,
          'segmentation': 'A',
          'latitude': 41.8831,
          'longitude': -87.6259,
          'distributionL90Simple': 2,
          'distributionL90SimpleYA': 0,
          'distributionL90Effective': 5,
          'distributionL90EffectiveYA': 0,
          'velocity': 11,
          'velocityYA': 0,
          'depletionsCurrentYearToDate': 86,
          'depletionsCurrentYearToDateYA': 0
        },
        'itemAuthorizationCode': 'SP',
        'depletionsCurrentYearToDate': 0,
        'depletionsCurrentYearToDateYA': 0,
        'lastDepletionDate': null,
        'dismissed': true,
        'itemAuthorizationDesc': 'Authorized - Select Planogram',
        'featureTypeCode': null,
        'featureTypeDesc': null,
        'priorityPackageFlag': 'Y'
      }, {
        'id': 'sdsd12',
        'product': {
          'id': '9878dj',
          'name': 'Budweiser',
          'type': 'package',
          'brand': 'CORONA EXTRA',
          'brandCode': '228'
        },
        'type': 'AT_RISK',
        'subType': 'ND_001',
        'impact': 'M',
        'impactDescription': 'MEDIUM',
        'status': 'TARGETED',
        'rationale': 'Rationale 1',
        'store': {
          'id': 'dsd82',
          'name': 'Store 1',
          'address': '1221 11th St NE, City, ST 12345',
          'onPremise': true,
          'segmentation': 'B',
          'latitude': 41.8831,
          'longitude': -87.6259,
          'distributionL90Simple': 2,
          'distributionL90SimpleYA': 0,
          'distributionL90Effective': 5,
          'distributionL90EffectiveYA': 0,
          'velocity': 11,
          'velocityYA': 0,
          'depletionsCurrentYearToDate': 86,
          'depletionsCurrentYearToDateYA': 0
        },
        'itemAuthorizationCode': 'SP',
        'depletionsCurrentYearToDate': 0,
        'depletionsCurrentYearToDateYA': 0,
        'lastDepletionDate': null,
        'dismissed': false,
        'itemAuthorizationDesc': 'Authorized - Select Planogram',
        'featureTypeCode': null,
        'featureTypeDesc': null,
        'priorityPackageFlag': 'N'
      }];
    });

    it('should be defined', function() {
      expect(ctrl.displayPagination).not.toBeUndefined();
      expect(typeof (ctrl.displayPagination)).toEqual('function');
    });

    it('should return true if there are opportunities', function() {
      expect(ctrl.displayPagination()).toEqual(true);
    });

    it('should return false if there are opportunities', function() {
      opportunitiesService.model.opportunities = [];
      expect(ctrl.displayPagination()).toEqual(false);
    });
  });

  describe('getNumber', function() {
    it('should be defined', function() {
      expect(ctrl.getNumber).not.toBeUndefined();
      expect(typeof (ctrl.getNumber)).toEqual('function');
    });

    beforeEach(function() {
      filtersService.model.appliedFilter.pagination.currentPage = 1;
      filtersService.model.appliedFilter.pagination.totalPages = 8;
    });

    it('should return an arr of 8 items', function() {
      var array = ctrl.getNumber();
      expect(array.length).toEqual(8);
      expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return an arr of 8 items even if current page is 5', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 5;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(8);
      expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return an arr of 8 items even if current page is 8', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 8;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(8);
      expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should return an arr of 10 items', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 1;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should return an arr of 10 items, but start at 2 when current page is 6', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 6;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it('should return an arr of 10 items, but start at 4 when current page is 8', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 8;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    it('should return an arr of 10 items, but start at 6 when current page is 10', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 10;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('should return an arr of 10 items, but start at 6 when current page is 12', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 12;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('should return an arr of 10 items, but start at 6 when current page is 15', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 15;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      var array = ctrl.getNumber();
      expect(array.length).toEqual(10);
      expect(array).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
  });

  describe('pageChanged', function() {
    it('should be defined', function() {
      expect(ctrl.pageChanged).not.toBeUndefined();
      expect(typeof (ctrl.pageChanged)).toEqual('function');
    });

    beforeEach(function() {
      filtersService.model.appliedFilter.pagination.currentPage = 1;

      // Spies
      spyOn(loaderService, 'openLoader').and.callFake(function() {
        return true;
      });
      spyOn(opportunitiesService, 'getOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should update the current page', function() {
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(1);

      ctrl.pageChanged(2);

      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(2);
    });

    it('should call loaderService.openLoader', function() {
      expect(loaderService.openLoader).not.toHaveBeenCalled();
      ctrl.pageChanged(2);
      expect(loaderService.openLoader).toHaveBeenCalledWith(true);
    });

    it('should call opportunitiesService.getOpportunities', function() {
      expect(opportunitiesService.getOpportunities).not.toHaveBeenCalled();
      ctrl.pageChanged(2);
      expect(opportunitiesService.getOpportunities).toHaveBeenCalled();
    });

    // To Do: Find better way to test .then() of promise

    afterEach(function() {
      filtersService.model.appliedFilter.pagination.currentPage = 1;
    });
  });
});
