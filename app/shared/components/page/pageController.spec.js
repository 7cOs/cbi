describe('Unit: page controller', function() {
  var scope, ctrl, q, state, filtersService, loaderService, opportunitiesService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.page');

    inject(function($rootScope, _$q_, _$state_, $controller, _filtersService_, _loaderService_, _opportunitiesService_) {
      scope = $rootScope.$new();
      q = _$q_;
      state = _$state_;

      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;

      ctrl = $controller('pageController', {$scope: scope});
    });
  });

  it('should have variables defined', () => {
    expect(ctrl.loadingList).not.toBeUndefined();
    expect(ctrl.firstPage).not.toBeUndefined();
    expect(ctrl.currentPage).not.toBeUndefined();
  });

  describe('displayPagination', function() {
    beforeEach(function() {
      filtersService.model.appliedFilter.pagination.totalPages = 1;
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
  });

  describe('totalPages watcher', function() {
    beforeEach(function() {
      filtersService.model.appliedFilter.pagination.currentPage = 0;
      filtersService.model.appliedFilter.pagination.totalPages = 0;
    });

    it('results in pageNumbers being set to an array of 8 items', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 0;
      filtersService.model.appliedFilter.pagination.totalPages = 7;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('results in pageNumbers being set to an array of 8 items even if current page is 5', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 5;
      filtersService.model.appliedFilter.pagination.totalPages = 7;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('results in pageNumbers being set to an array of 8 items even if current page is 7', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 7;
      filtersService.model.appliedFilter.pagination.totalPages = 7;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('results in pageNumbers being set to an array of 10 items', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 0;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 2 when current page is 6', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 6;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 4 when current page is 8', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 8;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 6 when current page is 10', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 10;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 6 when current page is 12', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 12;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });

    it('results in pageNumbers being set to an array of 10 items, but start at 6 when current page is 15', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 15;
      filtersService.model.appliedFilter.pagination.totalPages = 15;
      scope.$digest();
      expect(ctrl.pageNumbers).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    });
  });

  describe('pageChanged', function() {
    it('should be defined', function() {
      expect(ctrl.pageChanged).not.toBeUndefined();
      expect(typeof (ctrl.pageChanged)).toEqual('function');
    });

    beforeEach(() => {
      filtersService.model.appliedFilter.pagination.currentPage = 0;

      spyOn(opportunitiesService, 'getOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should update the current page', function() {
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(0);
      ctrl.pageChanged(2);
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(2);
    });

    it('should set loadingList', function() {
      expect(ctrl.loadingList).toBeFalsy();
      ctrl.pageChanged(2);
      expect(ctrl.loadingList).toBeTruthy();
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
