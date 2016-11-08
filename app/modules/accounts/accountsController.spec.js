describe('Unit: accountsController', function() {
  var scope, ctrl, $state, $q, filtersService, userService, $httpBackend, performanceBrandObj;
  // function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, chipsService, filtersService, userService) {

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.accounts');

    inject(function($rootScope, $controller, _$state_, _$q_, _filtersService_, _userService_,  _$httpBackend_) {
      // Create scope
      scope = $rootScope.$new();
      // Get Required Services
      $state = _$state_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      // chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;

      var brandPackageData = {
        performance: [
          {
            'type': 'Package/SKU',
            'id': '80013993',
            'name': 'MODELO ESP 24OZ BT',
            'measures': [
              {
                'timeframe': 'MTD',
                'depletions': 2786.4,
                'depletionsTrend': -11.475409836065568,
                'depletionsBU': null,
                'depletionsBUTrend': null,
                'plan': 6544.8
              }
            ]
          }
        ]
      };

      var fakePromise = $q.when();
      spyOn(userService, 'getPerformanceDepletion').and.returnValue(fakePromise);
      spyOn(userService, 'getPerformanceDistribution').and.returnValue(fakePromise);
      spyOn(userService, 'getPerformanceSummary').and.returnValue(fakePromise);
      performanceBrandObj = spyOn(userService, 'getPerformanceBrand');
      performanceBrandObj.and.returnValue($q.when(brandPackageData));

      // Create Controller
      ctrl = $controller('accountsController', {$scope: scope});
    });
  });

  describe('On Init', function() {
    it('Should expose the needed services', function() {
      expect(ctrl.chipsService).not.toBeUndefined();
      expect(typeof (ctrl.chipsService)).toEqual('object');
      expect(ctrl.filtersService).not.toBeUndefined();
      expect(typeof (ctrl.filtersService)).toEqual('object');
      expect(ctrl.userService).not.toBeUndefined();
      expect(typeof (ctrl.userService)).toEqual('object');
    });

    it('Should create a filterModel', function() {
      expect(ctrl.filterModel).toEqual({
        trend: filtersService.model.trend[0],
        endingTimePeriod: filtersService.lastEndingTimePeriod.endingPeriodType,
        depletionsTimePeriod: filtersService.lastEndingTimePeriod.depletionValue,
        distributionTimePeriod: filtersService.lastEndingTimePeriod.timePeriodValue
      });
    });

    it('Should set default tab info', function() {
      expect(ctrl.selected).toEqual(null);
      expect(ctrl.previous).toEqual(null);
      expect(ctrl.brandSelectedIndex).toEqual(0);
      expect(ctrl.marketSelectedIndex).toEqual(0);
    });

    it('Should set default controller variables', function() {
      expect(ctrl.accountTypesDefault).toEqual('Distributors');
      expect(ctrl.brandWidgetTitleDefault).toEqual('All Brands');
      expect(ctrl.brandWidgetTitle).toEqual(ctrl.brandWidgetTitleDefault);
      expect(ctrl.filtersService.model.accountSelected.accountBrands).toEqual({ name: 'Distribution (simple)', value: 1 });
      expect(ctrl.filtersService.model.accountSelected.accountMarkets).toEqual('Depletions');
      expect(ctrl.selectOpen).toEqual(false);
      expect(ctrl.disableAnimation).toEqual(false);
      expect(ctrl.marketStoresView).toEqual(false);
      expect(ctrl.marketIdSelected).toEqual(false);
      expect(ctrl.selectedStore).toEqual(null);
      expect(ctrl.hintTextPlaceholder).toEqual('Account or Subaccount Name');
      expect(ctrl.overviewOpen).toEqual(false);
      expect(ctrl.idSelected).toEqual(null);
      expect(ctrl.brandIdSelected).toEqual(null);
      expect(ctrl.loadingBrandSnapshot).toEqual(true);
    });

    // it('Should expose controller methods', function() {
    //   expect(ctrl.brandTotal).not.toBeUndefined();
    //   expect(typeof (ctrl.brandTotal)).toEqual('function');
    //
    //   expect(ctrl.displayBrandValue).not.toBeUndefined();
    //   expect(typeof (ctrl.displayBrandValue)).toEqual('function');
    //
    //   expect(ctrl.goToOpportunities).not.toBeUndefined();
    //   expect(typeof (ctrl.goToOpportunities)).toEqual('function');
    //
    //   expect(ctrl.isPositive).not.toBeUndefined();
    //   expect(typeof (ctrl.isPositive)).toEqual('function');
    //
    //   expect(ctrl.openSelect).not.toBeUndefined();
    //   expect(typeof (ctrl.openSelect)).toEqual('function');
    //
    //   expect(ctrl.setMarketTab).not.toBeUndefined();
    //   expect(typeof (ctrl.setMarketTab)).toEqual('function');
    //
    //   expect(ctrl.selectItem).not.toBeUndefined();
    //   expect(typeof (ctrl.selectItem)).toEqual('function');
    //
    //   expect(ctrl.prevTab).not.toBeUndefined();
    //   expect(typeof (ctrl.prevTab)).toEqual('function');
    //
    //   expect(ctrl.openNotes).not.toBeUndefined();
    //   expect(typeof (ctrl.openNotes)).toEqual('function');
    //
    //   expect(ctrl.placeholderSelect).not.toBeUndefined();
    //   expect(typeof (ctrl.placeholderSelect)).toEqual('function');
    //
    //   expect(ctrl.resetFilters).not.toBeUndefined();
    //   expect(typeof (ctrl.resetFilters)).toEqual('function');
    //
    //   expect(ctrl.updateBrandSnapshot).not.toBeUndefined();
    //   expect(typeof (ctrl.updateBrandSnapshot)).toEqual('function');
    //
    //   expect(ctrl.updateTopBottom).not.toBeUndefined();
    //   expect(typeof (ctrl.updateTopBottom)).toEqual('function');
    // });
  });

  describe('[Method] brandTotal', function() {
    beforeEach(function() {
      ctrl.brandTabs = [];
    });

    it('Should get totals for depletions', function() {});

    it('Should get totals for distributions', function() {});

    it('Should get totals for velocity', function() {});
  });

  describe('[Method] goToOpportunities', function() {
    beforeEach(function() {
      spyOn(filtersService, 'resetFilters').and.callThrough();
      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('Should go to opportunities page with params', function() {
      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToOpportunities();

      expect($state.go).toHaveBeenCalledWith('opportunities', {
        resetFiltersOnLoad: false,
        getDataOnLoad: true
      });
      expect($state.go.calls.count()).toEqual(1);
    });
  });

  describe('[Method] updateBrandSnapshot', function() {
    beforeEach(function() {
<<<<<<< c99f184f886656777b3c6a054d99e6d0364ae259
      spyOn(userService, 'getPerformanceBrand').and.callFake(function() {
        var deferred = $q.defer();
        return deferred.promise;
      });
      spyOn(filtersService, 'getAppliedFilters').and.callThrough();
=======
>>>>>>> Working spec file
    });

    it('Should get applied filters from filter service', function() {
      /* ctrl.brandTabs.brands = {
        'type': 'Brand',
        'id': '416',
        'name': 'MODELO ESPECIAL',
        'measures': [{
          'timeframe': 'MTD',
          'depletions': 169216.3238,
          'depletionsTrend': -4.467688039055397,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 397461.5977
        }, {
          'timeframe': 'CYTD',
          'depletions': 2800898.6819,
          'depletionsTrend': 3.430630640080394,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 7314905.1623
        }, {
          'timeframe': 'FYTD',
          'depletions': 2226380.265,
          'depletionsTrend': 0.5947959229454935,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 6742588.7227
        }, {
          'timeframe': 'CMTH',
          'depletions': 469085.2109,
          'depletionsTrend': -3.971677256660469,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 1319983.9654
        }, {
          'timeframe': 'CYTM',
          'depletions': 2631682.3581,
          'depletionsTrend': 3.9834168904068137,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 7886888.9828
        }, {
          'timeframe': 'FYTM',
          'depletions': 2057163.9412,
          'depletionsTrend': 1.0352082494789154,
          'depletionsBU': null,
          'depletionsBUTrend': null,
          'plan': 5884445.6922
        }, {
          'timeframe': 'L60',
          'distributionsSimple': 10924,
          'distributionsSimpleTrend': -8.639290792004683,
          'distributionsSimpleBU': null,
          'distributionsSimpleBUTrend': null,
          'distributionsEffective': 31424,
          'distributionsEffectiveTrend': -6.709416933855837,
          'distributionsEffectiveBU': null,
          'distributionsEffectiveBUTrend': null,
          'velocity': 4614.1987,
          'velocityTrend': null,
          'planSimple': 12716,
          'planEffective': 38601
        }, {
          'timeframe': 'L90',
          'distributionsSimple': 11259,
          'distributionsSimpleTrend': -9.493569131832798,
          'distributionsSimpleBU': null,
          'distributionsSimpleBUTrend': null,
          'distributionsEffective': 33545,
          'distributionsEffectiveTrend': -6.720983260107892,
          'distributionsEffectiveBU': null,
          'distributionsEffectiveBUTrend': null,
          'velocity': 9882.9284,
          'velocityTrend': null,
          'planSimple': 12716,
          'planEffective': 38601
        }, {
          'timeframe': 'L120',
          'distributionsSimple': 11666,
          'distributionsSimpleTrend': -10.56424409690279,
          'distributionsSimpleBU': null,
          'distributionsSimpleBUTrend': null,
          'distributionsEffective': 35557,
          'distributionsEffectiveTrend': -6.4904667981591055,
          'distributionsEffectiveBU': null,
          'distributionsEffectiveBUTrend': null,
          'velocity': 23128.6564,
          'velocityTrend': null,
          'planSimple': 12716,
          'planEffective': 38601
        }, {
          'timeframe': 'L03',
          'distributionsSimple': 11436,
          'distributionsSimpleTrend': -8.62895493767977,
          'distributionsSimpleBU': null,
          'distributionsSimpleBUTrend': null,
          'distributionsEffective': 34160,
          'distributionsEffectiveTrend': -4.655576643965613,
          'distributionsEffectiveBU': null,
          'distributionsEffectiveBUTrend': null,
          'velocity': 7869.0204,
          'velocityTrend': null,
          'planSimple': 12716,
          'planEffective': 38601
        }
      ]}; leaving this in for unit tests that need brands. */

      expect(filtersService.getAppliedFilters).not.toHaveBeenCalled();
      expect(filtersService.getAppliedFilters.calls.count()).toEqual(0);

      ctrl.updateBrandSnapshot();

      expect(filtersService.getAppliedFilters).toHaveBeenCalledWith('brandSnapshot');
      expect(filtersService.getAppliedFilters.calls.count()).toEqual(1);
    });

    it('Should call userService.getPerformanceBrand if there are no brands', function() {
      ctrl.brandTabs.brands = [];

      expect(userService.getPerformanceBrand).not.toHaveBeenCalled();
      expect(userService.getPerformanceBrand.calls.count()).toEqual(0);

      ctrl.updateBrandSnapshot();

      expect(userService.getPerformanceBrand).toHaveBeenCalled();
      expect(userService.getPerformanceBrand.calls.count()).toEqual(1);
    });

  });

  describe('[Method] updateDistributionTimePeriod', function() {
    it('Should set ctrl.filterModel.distributionTimePeriod', function() {
      ctrl.updateDistributionTimePeriod('year');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['year'][0].name);

      ctrl.updateDistributionTimePeriod('month');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['month'][0].name);
    });
  });

  describe('[Method] apply', function() {
    it('Should set ctrl.disableApply to whatever is passed in', function() {
      expect(ctrl.disableApply).toEqual(false);

      ctrl.apply(true);

      expect(ctrl.disableApply).toEqual(true);

      ctrl.apply(false);

      expect(ctrl.disableApply).toEqual(false);
    });
  });

  describe('Navigate to Package/SKU view', function() {
    var widget = null, item, parent, parentIndex;
    beforeEach(function() {
      userService.model.currentUser.employeeID = 1;
      widget = 'brands';
      item = {
        'type': 'Brand',
        'id': '416',
        'name': 'MODELO ESPECIAL',
        'measures': []
      };
      parent = {
        'brands': [],
        'skus': []
      };
      parentIndex = 0;
    });

<<<<<<< c99f184f886656777b3c6a054d99e6d0364ae259
=======
    afterEach(function() {
    });

>>>>>>> Working spec file
    it('Should get SKU/Packages for selected brand', function() {
      // performanceBrandObj.and.returnValue($q.when(brandPackageData));
      ctrl.selectItem(widget, item, parent, parentIndex);
      scope.$digest();
      expect(userService.getPerformanceBrand).toHaveBeenCalled();
    });
  });
});
