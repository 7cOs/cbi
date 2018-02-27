import * as Chance from 'chance';

import { getDateRangeMock } from '../../models/date-range.model.mock';
import { Observable } from 'rxjs';

const chance = new Chance();

describe('Unit: accountsController', function() {
  var scope, ctrl, $controller, $state, $q, filtersService, chipsService, userService, packageSkuData, brandSpy, brandPerformanceData, myperformanceService, storesService, $filter, analyticsService, title;
  let promiseGetStores;

  var topBottomSnapshotDistributorData = {
    performance: [{
        'type': 'Distributor',
        'id': '2225193',
        'name': 'MANHATTAN BEER DIST LLC - NY (BRONX - S)',
        'measures': [
          {
            'timeframe': 'MTD',
            'depletions': 375314.3868,
            'depletionsTrend': -61.88196023693025,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 375314.3868,
            'planDepletionTrend': 0
          },
          {
            'timeframe': 'CYTD',
            'depletions': 12491744.3937,
            'depletionsTrend': -16.075459112592508,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 12491744.3937,
            'planDepletionTrend': 0
          },
          {
            'timeframe': 'FYTD',
            'depletions': 10773624.1935,
            'depletionsTrend': -15.938390969559693,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 12816343.0581,
            'planDepletionTrend': -15.938390969559693
          },
          {
            'timeframe': 'CMTH',
            'depletions': 1090734.0057,
            'depletionsTrend': 25.559366815655782,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 1090734.0057,
            'planDepletionTrend': 0
          },
          {
            'timeframe': 'CYTM',
            'depletions': 12116430.0069,
            'depletionsTrend': -12.830714019277742,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 13899884.4267,
            'planDepletionTrend': -12.830714019277742
          },
          {
            'timeframe': 'FYTM',
            'depletions': 10398309.8067,
            'depletionsTrend': -12.115067376404308,
            'depletionsBU': null,
            'depletionsBUTrend': null,
            'plan': 10398309.8067,
            'planDepletionTrend': 0
          },
          {
            'timeframe': 'L60',
            'distributionsSimple': 12413,
            'distributionsSimpleTrend': -9.828563126543658,
            'distributionsSimpleBU': null,
            'distributionsSimpleBUTrend': null,
            'distributionsEffective': 24323,
            'distributionsEffectiveTrend': -9.47897283215482,
            'distributionsEffectiveBU': null,
            'distributionsEffectiveBUTrend': null,
            'velocity': 3433.3869,
            'velocityTrend': null,
            'planSimple': 15783,
            'planEffective': 32344,
            'planDistirbutionSimpleTrend': -21.35208768928594,
            'planDistirbutionEffectiveTrend': -61.621939154093496
          },
          {
            'timeframe': 'L90',
            'distributionsSimple': 14612,
            'distributionsSimpleTrend': -12.055371652121577,
            'distributionsSimpleBU': null,
            'distributionsSimpleBUTrend': null,
            'distributionsEffective': 30104,
            'distributionsEffectiveTrend': -10.287280963166051,
            'distributionsEffectiveBU': null,
            'distributionsEffectiveBUTrend': null,
            'velocity': 7189.6431,
            'velocityTrend': -719136.2136213621,
            'planSimple': 15783,
            'planEffective': 32344,
            'planDistirbutionSimpleTrend': -7.419375277196984,
            'planDistirbutionEffectiveTrend': -54.82315112540193
          },
          {
            'timeframe': 'L120',
            'distributionsSimple': 15783,
            'distributionsSimpleTrend': -14.617257235596428,
            'distributionsSimpleBU': null,
            'distributionsSimpleBUTrend': null,
            'distributionsEffective': 33139,
            'distributionsEffectiveTrend': -12.116792192638167,
            'distributionsEffectiveBU': null,
            'distributionsEffectiveBUTrend': null,
            'velocity': 85686.7231,
            'velocityTrend': -285722.41033333336,
            'planSimple': 15783,
            'planEffective': 32344,
            'planDistirbutionSimpleTrend': 0,
            'planDistirbutionEffectiveTrend': -51.202696017808556
          },
          {
            'timeframe': 'L03',
            'distributionsSimple': 15529,
            'distributionsSimpleTrend': -11.525752051048313,
            'distributionsSimpleBU': null,
            'distributionsSimpleBUTrend': null,
            'distributionsEffective': 32344,
            'distributionsEffectiveTrend': -9.232755233765506,
            'distributionsEffectiveBU': null,
            'distributionsEffectiveBUTrend': null,
            'velocity': 5924.5916,
            'velocityTrend': -153142.76710064063,
            'planSimple': 15783,
            'planEffective': 32344,
            'planDistirbutionSimpleTrend': -1.609326490527783,
            'planDistirbutionEffectiveTrend': -51.98800395745733
          }
        ]
      }, {
          'type': 'Distributor',
          'id': '2225538',
          'name': 'MANHATTAN BEER DIST LLC - NY (RIDGEWOOD)',
          'measures': [
            {
              'timeframe': 'MTD',
              'depletions': 388810.5225,
              'depletionsTrend': 4.4391700939200165,
              'depletionsBU': null,
              'depletionsBUTrend': null,
              'plan': 388810.5225,
              'planDepletionTrend': 0
            }]
        }
    ]
  };
  var topBottomSnapshotAcctData = {
    performance: [{
        'type': 'Account',
        'id': '004497',
        'name': 'CONVENIENT FOOD MART INC/HQ',
        'measures': []
      }, {
        'type': 'Account',
        'id': '004498',
        'name': 'CONVENIENT FOOD MART INC2/HQ',
        'measures': []
      }
    ]
  };

  var topBottomSnapshotSubAcctData = {
    performance: [{
        'type': 'SubAccount',
        'id': '1254678',
        'name': 'Rite Aid',
        'measures': [
        ]
      }, {
          'type': 'CVS',
          'id': '1254679',
          'name': 'CVS',
          'measures': [
            ]
        }
    ]
  };

  var topBottomSnapshotStoreData = {
    performance: [{
        'type': 'Store',
        'id': '4225193',
        'name': 'CVS WTC',
        'measures': [
        ]
      }, {
          'type': 'Account',
          'id': '5225538',
          'name': 'CVS Penn Station',
          'measures': [
            ]
        }
    ]
  };
  var measuresArr = [
    {
      'timeframe': 'MTD',
      'depletions': 169216.3238,
      'depletionsTrend': -4.467688039055397,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 397461.5977,
      'planDepletionTrend': -57.42574256753157
    },
    {
      'timeframe': 'CYTD',
      'depletions': 2800898.6819,
      'depletionsTrend': 3.430630640080394,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 7314905.1623,
      'planDepletionTrend': -61.70970614444271
    },
    {
      'timeframe': 'FYTD',
      'depletions': 2226380.265,
      'depletionsTrend': 0.5947959229454935,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 6742588.7227,
      'planDepletionTrend': -66.98033416298199
    },
    {
      'timeframe': 'CMTH',
      'depletions': 469085.2109,
      'depletionsTrend': -3.971677256660469,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 1319983.9654,
      'planDepletionTrend': -64.46280991316048
    },
    {
      'timeframe': 'CYTM',
      'depletions': 2631682.3581,
      'depletionsTrend': 3.9834168904068137,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 7886888.9828,
      'planDepletionTrend': -66.63218711662782
    },
    {
      'timeframe': 'FYTM',
      'depletions': 2057163.9412,
      'depletionsTrend': 1.0352082494789154,
      'depletionsBU': null,
      'depletionsBUTrend': null,
      'plan': 5884445.6922,
      'planDepletionTrend': -65.04065040608957
    },
    {
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
      'planEffective': 38601,
      'planDistirbutionSimpleTrend': -14.092481912551117,
      'planDistirbutionEffectiveTrend': -71.70021502033626
    },
    {
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
      'planEffective': 38601,
      'planDistirbutionSimpleTrend': -11.45800566215791,
      'planDistirbutionEffectiveTrend': -70.83236185591046
    },
    {
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
      'velocityTrend': 4.5454,
      'planSimple': 12716,
      'planEffective': 38601,
      'planDistirbutionSimpleTrend': -8.25731362063542,
      'planDistirbutionEffectiveTrend': -69.77798502629466
    },
    {
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
      'planEffective': 38601,
      'planDistirbutionSimpleTrend': -10.066058508965083,
      'planDistirbutionEffectiveTrend': -70.37382451231834
    }
  ];

  const mockDateRangeService = {
    getDateRanges: () => Observable.of({L90: getDateRangeMock()})
  };

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.accounts');
    angular.mock.module('angularMoment');

    angular.mock.module(($provide) => {
      analyticsService = {
        trackEvent: () => {}
      };
      $provide.value('analyticsService', analyticsService);
    });

    angular.mock.module(($provide) => {
      title = {
        setTitle: () => {}
      };
      $provide.value('title', title);
    });

    inject(function($rootScope, _$controller_, _$state_, _$q_, _chipsService_, _filtersService_, _userService_, _myperformanceService_, _storesService_, _$filter_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $controller = _$controller_;
      $state = _$state_;
      $q = _$q_;
      $filter = _$filter_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;
      myperformanceService = _myperformanceService_;
      storesService = _storesService_;

      brandPerformanceData = {
        performance: [
          {
            'type': 'Brand',
            'id': '416',
            'name': 'MODELO ESPECIAL',
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
          },
          {
            'type': 'Total',
            'id': null,
            'name': null,
            'measures': []
          }
        ]
      };

      packageSkuData = {
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
          },
          {
            'type': 'Total',
            'id': null,
            'name': null,
            'measures': []
          }
        ]
      };

      var fakePromise = $q.when();
      spyOn(userService, 'getPerformanceDepletion').and.returnValue(fakePromise);
      spyOn(userService, 'getPerformanceDistribution').and.returnValue(fakePromise);
      spyOn(userService, 'getPerformanceSummary').and.returnValue(fakePromise);
      promiseGetStores = spyOn(storesService, 'getStores').and.returnValue(fakePromise);
      spyOn(userService, 'getTopBottomSnapshot').and.callFake(function () {
        var currentLevel = userService.getTopBottomSnapshot.arguments[0].value;
        switch (currentLevel) {
          case 1:
            return $q.when(topBottomSnapshotDistributorData);
          case 2:
            return $q.when(topBottomSnapshotAcctData);
          case 3:
            return $q.when(topBottomSnapshotSubAcctData);
          case 4:
            return $q.when(topBottomSnapshotStoreData);
        };
      });
      spyOn(mockDateRangeService, 'getDateRanges').and.callThrough();

      brandSpy = spyOn(userService, 'getPerformanceBrand');
      brandSpy.and.returnValue($q.when(brandPerformanceData));
      // Create Controller
      ctrl = $controller('accountsController', {$scope: scope, dateRangeService: mockDateRangeService});
      scope.$digest();
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
      // expect(ctrl.marketSelectedIndex).toEqual(0);
    });

    it('Should set default dropdown options', function() {
      // Default trend option should be YA
      expect(ctrl.filterModel.trend).toEqual(ctrl.filtersService.model.trend[0]);
      // Default account brands should be set Distirubution simple
      ctrl.filtersService.model.accountSelected.accountBrands = ctrl.filtersService.accountFilters.accountBrands[0];
      // Default account markets should be set Depeletions
      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      // Default account type should be set Distirubutors
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      // Default sort order should be Top 10 values
      ctrl.filtersService.model.valuesVsTrend = ctrl.filtersService.accountFilters.valuesVsTrend[0];
      // Default premise type to be all
      ctrl.filtersService.model.selected.premiseType = 'all';
      // Default top bottom object should be set to distirbutors
      expect(ctrl.currentTopBottomObj).toEqual(ctrl.topBottomData.distributors);
    });

    it('Should set default controller variables', function() {
      expect(ctrl.accountTypesDefault).toEqual('Distributors');
      expect(ctrl.brandWidgetTitleDefault).toEqual('All Brands');
      expect(ctrl.brandWidgetTitle).toEqual(ctrl.brandWidgetTitleDefault);
      expect(ctrl.filtersService.model.accountSelected.accountBrands).toEqual(ctrl.filtersService.accountFilters.accountBrands[0]);
      expect(ctrl.filtersService.model.accountSelected.accountMarkets.name).toEqual('Depletions');
      expect(ctrl.selectOpen).toEqual(false);
      expect(ctrl.disableAnimation).toEqual(false);
      expect(ctrl.marketStoresView).toEqual(false);
      expect(ctrl.marketIdSelected).toEqual(false);
      expect(ctrl.selectedStore).toEqual(null);
      expect(ctrl.hintTextPlaceholder).toEqual('Account or Subaccount Name');
      expect(ctrl.overviewOpen).toEqual(false);
      expect(ctrl.idSelected).toEqual(null);
      expect(ctrl.brandIdSelected).toEqual(null);
      expect(ctrl.loadingBrandSnapshot).toEqual(false);
    });

    it('Should expose controller methods', function() {
      expect(ctrl.displayBrandValue).not.toBeUndefined();
      expect(typeof (ctrl.displayBrandValue)).toEqual('function');

      expect(ctrl.displayBrandValueAccountBrandVelocity).not.toBeUndefined();
      expect(typeof (ctrl.displayBrandValueAccountBrandVelocity)).toEqual('function');

      expect(ctrl.getTrendValues).not.toBeUndefined();
      expect(typeof (ctrl.getTrendValues)).toEqual('function');

      expect(ctrl.goToOpportunities).not.toBeUndefined();
      expect(typeof (ctrl.goToOpportunities)).toEqual('function');

      expect(ctrl.getClassBasedOnValue).not.toBeUndefined();
      expect(typeof (ctrl.getClassBasedOnValue)).toEqual('function');

      expect(ctrl.openSelect).not.toBeUndefined();
      expect(typeof (ctrl.openSelect)).toEqual('function');

      expect(ctrl.selectItem).not.toBeUndefined();
      expect(typeof (ctrl.selectItem)).toEqual('function');

      expect(ctrl.prevTab).not.toBeUndefined();
      expect(typeof (ctrl.prevTab)).toEqual('function');

      expect(ctrl.openNotes).not.toBeUndefined();
      expect(typeof (ctrl.openNotes)).toEqual('function');

      expect(ctrl.placeholderSelect).not.toBeUndefined();
      expect(typeof (ctrl.placeholderSelect)).toEqual('function');

      expect(ctrl.resetFilters).not.toBeUndefined();
      expect(typeof (ctrl.resetFilters)).toEqual('function');

      expect(ctrl.updateBrandSnapshot).not.toBeUndefined();
      expect(typeof (ctrl.updateBrandSnapshot)).toEqual('function');

      expect(ctrl.filterTopBottom).not.toBeUndefined();
      expect(typeof (ctrl.filterTopBottom)).toEqual('function');

      expect(ctrl.getValueBoundForAcctType).not.toBeUndefined();
      expect(typeof (ctrl.getValueBoundForAcctType)).toEqual('function');
    });

    it('Should get default radio button options on init', function () {
      expect(ctrl.filterModel.endingTimePeriod).toEqual('year');
      expect(ctrl.filterModel.depletionsTimePeriod.name).toEqual('FYTD');
      expect(ctrl.filterModel.distributionTimePeriod.name).toEqual('L90');
    });

    it('Should get the store information when passed in params', function () {
      const mockUnversionedStoreID = chance.string();
      const mockVersionedStoreID = chance.string();
      const mockPremiseType = chance.bool() ? 'on' : 'off';
      $state.params.premiseType = mockPremiseType;
      $state.params.storeid = mockUnversionedStoreID;
      $state.params.versionedStoreID = mockVersionedStoreID;
      $state.params.depletiontimeperiod = 'CYTD';

      promiseGetStores.and.callFake((id) => {
        expect(id).toEqual(mockUnversionedStoreID);

        return {
          account: 'An account',
          tdlinx_number: mockUnversionedStoreID,
          store_name: 'testStore',
          store_number: '456',
          premise_type: 'ON PREMISE',
          id: mockUnversionedStoreID,
          name: 'testStore',
          storeNumber: '456',
          premiseTypeDesc: mockPremiseType
        };
      });

      ctrl = $controller('accountsController', {$scope: scope, dateRangeService: mockDateRangeService});
      expect(ctrl.currentTopBottomFilters.stores.id).toBe(mockVersionedStoreID);

      scope.$digest();

      expect(filtersService.model.selected.premiseType).toEqual(mockPremiseType);
    });

  });

  describe('[Method] brandTotal', function() {
    beforeEach(function() {
      ctrl.brandTabs = [];
    });

    it('Should get totals for depletions', function() {});

    it('Should get totals for distributions', function() {});

    it('Should get totals for velocity', function() {});
  });

  describe('displayBrandValueAccountBrandVelocity', () => {
    it('Should display N/A only when the first depletion is after the beginning of the time period', () => {
      const dateRangeMock = {L90BDL: getDateRangeMock()};
      dateRangeMock.L90BDL.range = '05/14/17 - 08/11/17';
      const dateRangeServiceWithRangeMock = {
        getDateRanges: () => Observable.of(dateRangeMock)
      };

      ctrl = $controller('accountsController', {$scope: scope, dateRangeService: dateRangeServiceWithRangeMock});

      const brandMeasures = [
        {
          timeframe: 'L90',
          velocity: 123.456
        }
      ];

      expect(ctrl.displayBrandValueAccountBrandVelocity(brandMeasures, '2017-05-14')).toBe('123');
      expect(ctrl.displayBrandValueAccountBrandVelocity(brandMeasures, '2017-05-15')).toBe('N/A');
    });
  });

  describe('[Method] goToOpportunities', function() {
    var e = {
      preventDefault: function() {
        return true;
      }
    };

    var chipsArray = [
      {
        'name': 'one',
        'type': 'account',
        'applied': true,
        'removable': false
      },
      {
        'name': 'two',
        'type': 'subaccount',
        'applied': true,
        'removable': false
      }];

    beforeEach(function() {
      spyOn(filtersService, 'resetFilters').and.callThrough();
      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('Should go to opportunities page with params if conditions are met', function() {
      filtersService.model.selected.premiseType = 'on';
      filtersService.model.selected.account = ['01110000 01101100 01110011'];

      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToOpportunities(e);

      expect($state.go).toHaveBeenCalledWith('opportunities', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        referrer: 'accounts'
      });
      expect($state.go.calls.count()).toEqual(1);
    });

    it('Should do nothing if there is no premise type [or all] or chain', function() {
      filtersService.model.selected.premiseType = 'all';
      filtersService.model.selected.chain = ['01110000 01101100 01110011'];

      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToOpportunities(e);

      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);
    });

    it('Should do nothing if there is a premise type but no chain', function() {
      filtersService.model.selected.premiseType = 'on';
      filtersService.model.selected.chain = [];

      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToOpportunities(e);

      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);
    });

    it('should do set idForOppsPage and reset chips', function() {
      chipsService.addChipsArray(chipsArray);
      filtersService.model.selected.premiseType = 'on';
      filtersService.model.selected.account = ['01110000 01101100 01110011'];
      filtersService.model.selected.subaccount = ['01110000 01101100 01110011'];
      ctrl.currentTopBottomAcctType = {value: 4};
      var performanceData = {
        type: 'Store',
        id: '2225193',
        name: 'MANHATTAN BEER DIST LLC - NY (BRONX - S)',
        unversionedStoreCode: '999999999'
      };
      ctrl.navigateTopBottomLevels(performanceData);
      filtersService.model.selected.store = '11111111';
      ctrl.goToOpportunities(e);
      expect(filtersService.model.selected.store).toEqual('999999999');
      expect(filtersService.model.selected.account).toEqual('');
      expect(filtersService.model.selected.subaccount).toEqual('');
      expect(chipsService.model).toEqual([{
        name: 'MANHATTAN BEER DIST LLC - NY (BRONX - S)',
        id: undefined,
        type: 'store',
        search: true,
        applied: false,
        removable: true,
        tradeChannel: false
      }]);
    });

    it('should reset selected account and remove chip', function() {
      filtersService.model.selected.premiseType = 'on';
      filtersService.model.selected.account = ['01110000 01101100 01110011'];
      chipsService.addChipsArray(chipsArray);
      ctrl.currentTopBottomFilters.subAccounts = {id: '12343'};
      ctrl.currentTopBottomFilters.stores = null;
      ctrl.goToOpportunities(e);
      expect(filtersService.model.selected.account).toEqual('');
      expect(chipsService.model).toEqual([{ name: 'two', type: 'subaccount', applied: true, removable: false }]);
    });

    it('Should record all opportunities GA events', function() {
      filtersService.model.selected.premiseType = 'all';
      filtersService.model.selected.chain = ['01110000 01101100 01110011'];
      spyOn(analyticsService, 'trackEvent');

      ctrl.goToOpportunities(e);

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Accounts',
        'Top Opportunities',
        'All Opportunities'
      );
    });
  });

  describe('[Method] updateBrandSnapshot', function() {
    beforeEach(function () {
      brandSpy.calls.reset();
      spyOn(filtersService, 'getAppliedFilters').and.callThrough();
    });

    it('Should get applied filters from filter service', function() {
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

  describe('should record snapshot GA event', function() {
    beforeEach(function () {
      brandSpy.calls.reset();
      spyOn(analyticsService, 'trackEvent');
    });

    it('Check if Snapshot GA is recorded', function() {
      ctrl.updateBrandSnapshot();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Snapshot',
        'All Brands',
        'Distribution (simple)'
      );
    });
  });

  describe('[Method] updateDistributionTimePeriod', function() {
    it('Should set ctrl.filterModel.distributionTimePeriod', function() {
      ctrl.updateDistributionTimePeriod('year');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['year'][1]);

      ctrl.updateDistributionTimePeriod('month');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['month'][0]);
    });
  });

  describe('[Method] updateDistributionTimePeriod', function() {
    it('Should set ctrl.filterModel.distributionTimePeriod', function() {
      ctrl.updateDistributionTimePeriod('year');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['year'][1]);

      ctrl.updateDistributionTimePeriod('month');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['month'][0]);
    });
  });

  describe('[Method] apply', function() {
    it('Should set ctrl.disableApply to whatever is passed in', function() {
      expect(ctrl.disableApply).toEqual(true);

      ctrl.disableApplyFilter(true);

      expect(ctrl.disableApply).toEqual(true);

      ctrl.disableApplyFilter(false);

      expect(ctrl.disableApply).toEqual(false);
    });
  });

  describe('YA and Plan Trend values', function() {
    var depletionValues;
    var distirbutionValues;
    beforeEach(function () {
      depletionValues = {
        'CMTH': {
          name: 'CMTH',
          displayValue: 'Clo Mth',
          id: 1
        },
        'CYTD': {
          name: 'CYTD',
          displayValue: 'CYTD',
          id: 2
        },
        'FYTD': {
          name: 'FYTD',
          displayValue: 'FYTD',
          id: 3
        },
        'CYTM': {
          name: 'CYTM',
          displayValue: 'CYTM',
          id: 4
        }
      };

      distirbutionValues =  {
        'L60': {
          name: 'L60',
          displayValue: 'L60',
          id: 1
        },
        'L90': {
          name: 'L90',
          displayValue: 'L90',
          id: 2
        },
        'L120': {
          name: 'L120',
          displayValue: 'L120',
          id: 3
        }
      };
    });
    it('Should get correct YA% trend values for depletion and distirbution period', function() {
      ctrl.filterModel.depletionsTimePeriod = depletionValues.FYTD;
      var currentTrendVal = ctrl.getTrendValues(measuresArr, 'depletions', 'depletionsTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('0.6%');

      ctrl.filterModel.depletionsTimePeriod = depletionValues.CYTD;
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'depletions', 'depletionsTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('3.4%');

      ctrl.filterModel.depletionsTimePeriod = depletionValues.CYTM;
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'depletions', 'depletionsTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('4.0%');

      ctrl.filterModel.depletionsTimePeriod = depletionValues.CMTH;
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'depletions', 'depletionsTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-4.0%');

      ctrl.filterModel.distributionTimePeriod = distirbutionValues['L90'];
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-9.5%');

      ctrl.filterModel.distributionTimePeriod = distirbutionValues['L120'];
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-10.6%');

      // Negative tests
      ctrl.filterModel.distributionTimePeriod = distirbutionValues['L120'];
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.displayValue).not.toEqual('-10.56424409690279%');

      ctrl.filterModel.distributionTimePeriod = 'L10000';
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-');

      ctrl.filterModel.distributionTimePeriod = 'L10000';
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.value).toBeUndefined();
    });

    it('Should perform correct calculations for ABP% values', function() {
      ctrl.filterModel.trend = {
        name: 'vs ABP',
        value: 2
      };
      ctrl.filterModel.depletionsTimePeriod = depletionValues.FYTD;
      var currentTrendVal = ctrl.getTrendValues(measuresArr, 'depletions', 'depletionsTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-67.0%');

      ctrl.filterModel.distributionTimePeriod = distirbutionValues['L120'];
      currentTrendVal = ctrl.getTrendValues(measuresArr, 'distributionsSimple', 'distributionTimePeriod');
      expect(currentTrendVal.displayValue).toEqual('-8.3%');
    });

    it('Should return positive class', function() {
      var result = ctrl.getClassBasedOnValue(23.5);
      expect(result).toEqual('positive');
    });

    it('Should return negative class', function() {
      var result = ctrl.getClassBasedOnValue(-23.5);
      expect(result).toEqual('negative');
    });

    it('Should return empty string', function() {
      var result = ctrl.getClassBasedOnValue(null);
      expect(result).toEqual('');
    });
  });

  describe('Navigate to Package/SKU view', function () {
    var widget = null, item, parent, parentIndex;

    beforeEach(function () {
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
      brandSpy.calls.reset();
    });

    it('Should get SKU/Packages for selected brand', function () {
      brandSpy.and.returnValue($q.when(packageSkuData));
      ctrl.selectItem(widget, item, parent, parentIndex);
      scope.$digest();
      expect(userService.getPerformanceBrand).toHaveBeenCalled();
      expect(ctrl.brandTabs.skus[0]).toEqual(packageSkuData.performance[0]);
    });

    /* it('Should move to Package/SKU view', function () {
      brandSpy.and.returnValue($q.when(packageSkuData));
      ctrl.selectItem(widget, item, parent, parentIndex);
      scope.$digest();
      expect(ctrl.brandSelectedIndex).toEqual(1);
    }); */

    it('Should move back to Brand view', function () {
      ctrl.brandSelectedIndex = 1;
      ctrl.prevTab();
      expect(ctrl.brandSelectedIndex).toEqual(0);
      // Should reset back to Distirbution simple option
      expect(ctrl.filtersService.model.accountSelected.accountBrands).toEqual(ctrl.filtersService.accountFilters.accountBrands[0]);
    });

    it('Should set the correct totals object on brands view', function () {
      var totalsObj = packageSkuData.performance[1];
      expect(totalsObj).toEqual(ctrl.currentTotalsObject);
    });
  });

  describe('Showing correct distirbution and velocity options', function () {
    function getDistirbutionBasedOnValue(accountEnum) {
      var matchedObj = ctrl.filtersService.accountFilters.accountBrands.filter(function (account) {
        return account.value === accountEnum;
      });
      return matchedObj[0];
    }
    it('Should not hide distirbution Simple in brand view ', function () {
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionSimple);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple, true);
      expect(val).toBeFalsy();
    });

    it('Should hide distirbution Effective in brand view ', function () {
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionEffective);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple, true);
      expect(val).toBeTruthy();
    });

    it('Should hide distirbution Simple in package view ', function () {
      ctrl.brandSelectedIndex++;
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionSimple);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple, true);
      expect(val).toBeTruthy();
    });

    it('Should show distirbution Effective in package view ', function () {
      ctrl.brandSelectedIndex++;
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionEffective);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple, true);
      expect(val).toBeFalsy();
    });

    it('Should show Velocity in brand and package view ', function () {
      var velocity = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.velocity);
      var val = ctrl.removeDistOptionsBasedOnView(velocity, true);
      expect(val).toBeFalsy();

      ctrl.brandSelectedIndex++;
      val = ctrl.removeDistOptionsBasedOnView(velocity, true);
      expect(val).toBeFalsy();
    });

    it('Should check if velocity is present ', function () {
      var item = {
        name: 'Modelo',
        measures: measuresArr
      };
      // Selecting L90
      ctrl.filterModel.distributionTimePeriod = ctrl.filtersService.model.distributionTimePeriod.year[1];
      var val = ctrl.checkIfVelocityPresent(item);
      expect(val).toBeFalsy();

      // Selecting L120 as it has a velocity trend value and velocity
      ctrl.filterModel.distributionTimePeriod = ctrl.filtersService.model.distributionTimePeriod.year[2];
      val = ctrl.checkIfVelocityPresent(item);
      expect(val).toBeTruthy();
    });

    it('should check for dist simple', function() {
      var distSimple = {value: filtersService.accountFilters.accountMarketsEnums.distSimple};
      ctrl.brandSelectedIndex = 1;
      ctrl.filtersService.model.accountSelected.accountMarkets = {value: filtersService.accountFilters.accountMarketsEnums.distSimple};

      expect(ctrl.removeDistOptionsBasedOnView(distSimple, false)).toBeTruthy();
      expect(filtersService.model.accountSelected.accountMarkets).toEqual({ name: 'Distribution (effective)', propertyName: 'distributionsEffective', value: 3 });
    });

    it('should check for dist effective', function() {
      var distSimple = {value: filtersService.accountFilters.accountMarketsEnums.distEffective};
      ctrl.brandSelectedIndex = 0;
      ctrl.filtersService.model.accountSelected.accountMarkets = {value: filtersService.accountFilters.accountMarketsEnums.distEffective};

      expect(ctrl.removeDistOptionsBasedOnView(distSimple, false)).toBeTruthy();
      expect(filtersService.model.accountSelected.accountMarkets).toEqual({ name: 'Distribution (simple)', propertyName: 'distributionsSimple', value: 2 });
    });

  });

  describe('[Method] goToOpportunities', function() {
    beforeEach(function() {
      spyOn(chipsService, 'updateChip').and.callThrough();
      spyOn(chipsService, 'addChip').and.callThrough();
      spyOn(ctrl, 'disableApplyFilter').and.callThrough();
    });

    it('Should update my accounts only chip', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(0);
      expect(ctrl.disableApplyFilter).not.toHaveBeenCalled();
      // run
      ctrl.updateChip('My Accounts Only', 'myAccountsOnly');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(1);
      expect(chipsService.updateChip).toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(1);
      expect(ctrl.disableApplyFilter).toHaveBeenCalled();
    });

    it('Should update premise type chip', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(0);
      expect(ctrl.disableApplyFilter).not.toHaveBeenCalled();
      // run
      ctrl.updateChip('On-Premise', 'premiseType');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(1);
      expect(chipsService.addChip).toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(1);
      expect(ctrl.disableApplyFilter).toHaveBeenCalled();
    });

    it('Should update premise type chip and remove the existing one if it already exists (off -> on)', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(0);
      expect(ctrl.disableApplyFilter).not.toHaveBeenCalled();
      expect(chipsService.model.length).toEqual(4);
      expect(chipsService.model[1].name).toEqual('Off-Premise');
      // run
      ctrl.updateChip('On-Premise', 'premiseType');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(1);
      expect(chipsService.addChip).toHaveBeenCalled();
      expect(ctrl.disableApplyFilter.calls.count()).toEqual(1);
      expect(ctrl.disableApplyFilter).toHaveBeenCalled();
      expect(chipsService.model.length).toEqual(4);
      expect(chipsService.model[3].name).toEqual('On-Premise');
    });

  });

  describe('[Method] setUserSpecificModels', function() {
    beforeEach(function() {
      spyOn(ctrl, 'updateChip').and.callThrough();
    });

    afterEach(function() {
      userService.model.currentUser = {
        'personId': 5648,
        'employeeID': '1012132',
        'firstName': 'FRED',
        'lastName': 'BERRIOS',
        'email': 'FRED.BERRIOS@CBRANDS.COM',
        'srcTypeCd': [
          'SALES_HIER'
        ],
        'groupingCode': '133',
        'corporateUser': true,
        'userGroup': [
          'cbi-role-iq-app-users',
          'cbi employees',
          'cbi users',
          'cbi-adenabledaccounts',
          'ug-cbigdc-biz-role-genmgr'
        ],
        'issuer': 'https://orion.cbrands.com',
        'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IkJFUlJJT1MiLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwiZW1wbG95ZWVJRCI6IjEwMTIxMzIiLCJmaXJzdE5hbWUiOiJGUkVEIiwiZ3JvdXBpbmdDb2RlIjoiMTMzIiwiY29ycG9yYXRlVXNlciI6dHJ1ZSwicGVyc29uSUQiOjU2NDgsImV4cCI6MTQ4NTg5NzAyMzc0MSwiaWF0IjoxNDgwNzEzMDIzNzQxLCJ1c2VyR3JvdXAiOlsiY2JpIGVtcGxveWVlcyIsImNiaSB1c2VycyIsInVnLWNiaWdkYy1iaXotcm9sZS1ta3RkZXZtZ3IiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJGUkVELkJFUlJJT1NAQ0JSQU5EUy5DT00iLCJzcmNUeXBlQ2QiOlsiU0FMRVNfSElFUiJdfQ.WwWIo6ssmepAf-1gOWYnhmSQ4CR2-HByA3PNFj6E8gs',
        'jwtmap': {
          'firstName': 'FRED',
          'lastName': 'BERRIOS',
          'groupingCode': '133',
          'corporateUser': true,
          'iss': 'https://orion.cbrands.com',
          'personID': 5648,
          'employeeID': '1012132',
          'exp': 1480707641150,
          'iat': 1475523641152,
          'userGroup': [
            'cbi-role-iq-app-users',
            'cbi employees',
            'cbi users',
            'cbi-adenabledaccounts',
            'ug-cbigdc-biz-role-genmgr'
          ],
          'email': 'FRED.BERRIOS@CBRANDS.COM',
          'srcTypeCd': [
            'SALES_HIER'
          ]
        }
      };
    });

    it('Should go to default if myAccountsOnly is false', function() {
      filtersService.model.selected.myAccountsOnly = false;

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(false);
      expect(ctrl.updateChip.calls.count()).toEqual(0);
    });

    it('Should disable premise type and set default as off premise if OFF_HIER', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser = {
        'personId': 5699,
        'employeeID': '1009707',
        'firstName': 'ERIC',
        'lastName': 'RAMEY',
        'email': 'ERIC.RAMEY@CBRANDS.COM',
        'srcTypeCd': [
          'OFF_HIER'
        ],
        'groupingCode': null,
        'corporateUser': true,
        'userGroup': [
          'cbi employees',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'issuer': 'https://orion.cbrands.com',
        'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlJBTUVZIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDA5NzA3IiwiZmlyc3ROYW1lIjoiRVJJQyIsImdyb3VwaW5nQ29kZSI6bnVsbCwiY29ycG9yYXRlVXNlciI6dHJ1ZSwicGVyc29uSUQiOjU2OTksImV4cCI6MTQ4NjE0NzYzMjY5MiwiaWF0IjoxNDgwOTYzNjMyNjkyLCJ1c2VyR3JvdXAiOlsiY2JpIGVtcGxveWVlcyIsImNiaSB1c2VycyIsInVnLWNiaWdkYy1iaXotcm9sZS1ta3RkZXZtZ3IiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJFUklDLlJBTUVZQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIk9GRl9ISUVSIl19.Gy-SZrPgg7oxCgYCc-8YWA2BIwlFO0E3Htu6vzufVh4',
        'jwtmap': {
          'firstName': 'ERIC',
          'lastName': 'RAMEY',
          'groupingCode': null,
          'corporateUser': true,
          'iss': 'https://orion.cbrands.com',
          'personID': 5699,
          'employeeID': '1009707',
          'exp': 1486147632692,
          'iat': 1480963632694,
          'userGroup': [
            'cbi employees',
            'cbi users',
            'ug-cbigdc-biz-role-mktdevmgr',
            'cbi-adenabledaccounts'
          ],
          'email': 'ERIC.RAMEY@CBRANDS.COM',
          'srcTypeCd': [
            'OFF_HIER'
          ]
        },
        'issuedAt': 1480963632694
      };

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('Off-Premise', 'premiseType');
    });

    it('Should disable premise type and set default as off premise if OFF_SPEC', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser.srcTypeCd = ['OFF_SPEC'];

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('Off-Premise', 'premiseType');
    });

    it('Should disable premise type and set default as on premise if ON_HIER', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser.srcTypeCd = ['ON_HIER'];

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('on');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('On-Premise', 'premiseType');
    });

    it('Should go to default if SALES_HIER', function() {
      filtersService.model.selected.myAccountsOnly = true;

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(false);
      expect(ctrl.updateChip.calls.count()).toEqual(0);
      expect(ctrl.updateChip).not.toHaveBeenCalled();
    });

    it('Should go to default if admin', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser = {
        'personId': -1,
        'employeeID': '7002806',
        'firstName': null,
        'lastName': null,
        'email': null,
        'srcTypeCd': [],
        'groupingCode': null,
        'corporateUser': true,
        'userGroup': [
          'cbi employees',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'issuer': 'https://orion.cbrands.com',
        'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6bnVsbCwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiI3MDAyODA2IiwiZmlyc3ROYW1lIjpudWxsLCJncm91cGluZ0NvZGUiOm51bGwsImNvcnBvcmF0ZVVzZXIiOnRydWUsInBlcnNvbklEIjotMSwiZXhwIjoxNDg2MTUzNTIyOTg4LCJpYXQiOjE0ODA5Njk1MjI5ODgsInVzZXJHcm91cCI6WyJjYmkgZW1wbG95ZWVzIiwiY2JpIHVzZXJzIiwidWctY2JpZ2RjLWJpei1yb2xlLW1rdGRldm1nciIsImNiaS1hZGVuYWJsZWRhY2NvdW50cyJdLCJlbWFpbCI6bnVsbCwic3JjVHlwZUNkIjpbXX0.9P5Exp4yRSy_rRm9C6MHlqqvbX41w8jgQSBmuE9NnO8',
        'jwtmap': {
          'firstName': null,
          'lastName': null,
          'groupingCode': null,
          'corporateUser': true,
          'iss': 'https://orion.cbrands.com',
          'personID': -1,
          'employeeID': '7002806',
          'exp': 1486153522988,
          'iat': 1480969522989,
          'userGroup': [
            'cbi employees',
            'cbi users',
            'ug-cbigdc-biz-role-mktdevmgr',
            'cbi-adenabledaccounts'
          ],
          'email': null,
          'srcTypeCd': []
        }
      };

      ctrl.setUserSpecificModels();

      expect(filtersService.model.selected.premiseType).toEqual('all');
      expect(ctrl.premiseTypeDisabled).toEqual(false);
      expect(ctrl.updateChip.calls.count()).toEqual(0);
      expect(ctrl.updateChip).not.toHaveBeenCalled();
    });
  });

  describe('[Method] isDisplayBrandSnapshotRow', function() {
    it('should return true isPremiseCheckRequired', function() {
      filtersService.model.accountSelected.accountBrands = {value: 'testCategory'};
      expect(ctrl.isDisplayBrandSnapshotRow('testCategory', false, false)).toEqual(true);
    });

    it('should return false premise type != all', function() {
      filtersService.model.accountSelected.accountBrands = {value: 'testCategory'};
      filtersService.model.selected.premiseType = 'all';
      expect(ctrl.isDisplayBrandSnapshotRow('testCategory', false, true)).toEqual(false);
    });

    it('should return true premise type != all', function() {
      filtersService.model.accountSelected.accountBrands = {value: 'testCategory'};
      filtersService.model.selected.premiseType = 'notall';
      expect(ctrl.isDisplayBrandSnapshotRow('testCategory', false, true)).toEqual(true);
    });

    it('should return true premise type != all', function() {
      expect(ctrl.isDisplayBrandSnapshotRow('testCategory', true)).toEqual(true);
    });

    it('should return false premise type != all', function() {
      expect(ctrl.isDisplayBrandSnapshotRow('testCategory', false)).toEqual(false);
    });
  });

  describe('[Method] disableStoreType', function() {
    afterEach(function() {
      filtersService.model.selected.store = [];
      filtersService.model.selected.chain = [];
      filtersService.model.selected.distributor = [];
    });

    it('Should return true if there is no store, chain or distributor', function() {
      expect(ctrl.disableStoreType()).toEqual(true);
    });
    it('Should return false if there is a store but no chain or distributor', function() {
      filtersService.model.selected.store = ['222222'];
      expect(ctrl.disableStoreType()).toEqual(false);
    });
    it('Should return false if there is a chain but no store or distributor', function() {
      filtersService.model.selected.account = ['222222'];
      expect(ctrl.disableStoreType()).toEqual(false);
    });
    it('Should return false if there is a distributor but no chain or store', function() {
      filtersService.model.selected.distributor = ['222222'];
      expect(ctrl.disableStoreType()).toEqual(false);
    });
    it('should return true & set cbbdChainIndependent', function() {
      spyOn(chipsService, 'applyFilterArr').and.callFake(function() {
        return {
          then: function(callback) { return callback({}); }
        };
      });
      filtersService.model.cbbdChainIndependent = true;
      expect(ctrl.disableStoreType()).toEqual(true);
      expect(filtersService.model.cbbdChainIndependent).toEqual(false);
    });
    it('should return true & set cbbdChainCbbd', function() {
      spyOn(chipsService, 'applyFilterArr').and.callFake(function() {
        return {
          then: function(callback) { return callback({}); }
        };
      });
      filtersService.model.cbbdChainCbbd = true;
      expect(ctrl.disableStoreType()).toEqual(true);
      expect(filtersService.model.cbbdChainCbbd).toEqual(false);
    });
  });

  describe('[Method] updateTopBottom', function() {
    beforeEach(function() {
    });

    it('Should update top bottom', function() {
      ctrl.loadingTopBottom = true;
      ctrl.filtersService.model.accountSelected.accountMarkets = filtersService.model.accountSelected.accountMarkets;
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData);

      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(2);
    });
  });

  describe('Change top bottom dropwdown', function() {
    beforeEach(function() {
      var distObj = filtersService.accountFilters.accountTypes[0];
      ctrl.setTopBottomAcctTypeSelection(distObj);
      userService.getTopBottomSnapshot.calls.reset();
    });

    it('Check if correct objects are set as the current top bottom object', function() {
      var distirbutorObj = filtersService.accountFilters.accountTypes[0];
      ctrl.setTopBottomAcctTypeSelection(distirbutorObj);
      expect(ctrl.currentTopBottomObj).toEqual(ctrl.topBottomData.distributors);

      var accountObj = filtersService.accountFilters.accountTypes[1];
      ctrl.setTopBottomAcctTypeSelection(accountObj);
      expect(ctrl.currentTopBottomObj).toEqual(ctrl.topBottomData.accounts);

      var subAccountObj = filtersService.accountFilters.accountTypes[2];
      ctrl.setTopBottomAcctTypeSelection(subAccountObj);
      expect(ctrl.currentTopBottomObj).toEqual(ctrl.topBottomData.subAccounts);

      var storesObj = filtersService.accountFilters.accountTypes[3];
      ctrl.setTopBottomAcctTypeSelection(storesObj);
      expect(ctrl.currentTopBottomObj).toEqual(ctrl.topBottomData.stores);

      ctrl.setTopBottomAcctTypeSelection(storesObj);
      expect(ctrl.currentTopBottomObj).not.toEqual(ctrl.topBottomData.distributors);
    });
  });

  describe('Get top bottom data', function() {
    beforeEach(function() {
      ctrl.filtersService.model.accountSelected.accountMarkets = filtersService.model.accountSelected.accountMarkets;
      userService.getTopBottomSnapshot.calls.reset();
      ctrl.topBottomData.distributors.performanceData = null;
      ctrl.topBottomData.distributors.isPerformanceDataUpdateRequired = false;
      ctrl.topBottomData.distributors.isFilterUpdateRequired = false;
    });

    it('Should get the updated top bottom data if performance flag is set to true', function() {
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
    });

    it('Should get the updated filtered data if update filter flag is set to true', function() {
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      scope.$digest();
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
      userService.getTopBottomSnapshot.calls.reset();
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
    });

    it('Should not get updated performance data if update performance flag is not set', function() {
      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      scope.$digest();
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
      ctrl.topBottomData.distributors.isFilterUpdateRequired = true;
      ctrl.topBottomData.distributors.timePeriodFilteredData = null;
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      expect(ctrl.topBottomData.distributors.isFilterUpdateRequired).toBeTruthy();
      expect(ctrl.topBottomData.distributors.isFilterUpdateRequired).not.toBeUndefined();
    });

    it('Should not get updated performance data and updated filtered data if update performance flag and update filter flags are not set', function() {
      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      scope.$digest();
      expect(ctrl.topBottomData.distributors.isFilterUpdateRequired).toBeFalsy();
      expect(ctrl.topBottomData.distributors.timePeriodFilteredData).not.toBeUndefined();
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);
    });

    it('Should update the correct tab value in the view', function() {
      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.distributors);
      ctrl.marketSelectedIndex = 0;

      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.accounts);
      ctrl.marketSelectedIndex = 1;

      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.subAccounts);
      ctrl.marketSelectedIndex = 2;

      ctrl.getDataForTopBottomLevel(ctrl.topBottomData.stores);
      ctrl.marketSelectedIndex = 3;
    });
  });

  describe('getValueBoundForAcctType', () => {
    beforeEach(() => {
      const dateRangeMock = {L90BDL: getDateRangeMock()};
      dateRangeMock.L90BDL.range = '05/14/17 - 08/11/17';
      const dateRangeServiceWithRangeMock = {
        getDateRanges: () => Observable.of(dateRangeMock)
      };

      ctrl = $controller('accountsController', {$scope: scope, dateRangeService: dateRangeServiceWithRangeMock});
    });

    it('Should get the correct property from the measure', function() {
      var displayValue;
      // MTD

      const measures0 = topBottomSnapshotDistributorData.performance[0].measures[0];
      const measures1 = topBottomSnapshotDistributorData.performance[0].measures[7];
      const emptyPerformanceData = {
        firstSoldDate: ''
      };

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      displayValue = ctrl.getValueBoundForAcctType(measures0, emptyPerformanceData);
      expect(displayValue).toEqual($filter('number')(375314, 0));

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[1];
      displayValue = ctrl.getValueBoundForAcctType(measures1, emptyPerformanceData);
      expect(displayValue).toEqual($filter('number')(14612, 0));

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[2];
      displayValue = ctrl.getValueBoundForAcctType(measures1, emptyPerformanceData);
      expect(displayValue).toEqual($filter('number')(30104, 0));

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[3];
      displayValue = ctrl.getValueBoundForAcctType(measures1, emptyPerformanceData);
      expect(displayValue).toEqual($filter('number')(7190, 0));

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      displayValue = ctrl.getValueBoundForAcctType(measures0, emptyPerformanceData);
      expect(displayValue).not.toEqual('-');

      ctrl.filtersService.model.accountSelected.accountMarkets = null;
      displayValue = ctrl.getValueBoundForAcctType(measures0, emptyPerformanceData);
      expect(displayValue).toEqual('-');
    });

    it('Should display N/A only when the first depletion is after the beginning of the time period', () => {
      const storeData = {
        measures: topBottomSnapshotDistributorData.performance[0].measures[7],
        performanceData: {
          firstSoldDate: '2017-05-14'
        }
      };

      const storeDataNA = {
        measures: topBottomSnapshotDistributorData.performance[0].measures[7],
        performanceData: {
          firstSoldDate: '2017-05-15'
        }
      };

      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[3];

      let displayValue = ctrl.getValueBoundForAcctType(storeData.measures, storeData.performanceData);
      expect(displayValue).toEqual($filter('number')(7190, 0));

      displayValue = ctrl.getValueBoundForAcctType(storeDataNA.measures, storeDataNA.performanceData);
      expect(displayValue).toEqual('N/A');
    });
  });

  describe('Top Bottom indices', function () {
    beforeEach(function () {
      ctrl.currentTopBottomObj = {
        performanceData: null,
        timePeriodFilteredData: null,
        topBottomIndices: null,
        chartData: null,
        isPerformanceDataUpdateRequired: true,
        isFilterUpdateRequired: true
      };
    });
  });

  describe('Navigate top bottom levels', function() {
    var distributorData, acctData, subAcctData, storeData, anotherStoreData;
    beforeEach(function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.resetFilters();
      distributorData = angular.copy(topBottomSnapshotDistributorData.performance[0]);
      acctData = angular.copy(topBottomSnapshotAcctData.performance[0]);
      subAcctData = angular.copy(topBottomSnapshotSubAcctData.performance[0]);
      storeData = angular.copy(topBottomSnapshotStoreData.performance[0]);
      anotherStoreData = angular.copy(topBottomSnapshotStoreData.performance[1]);
    });

    it('should go to accounts level on selecting distributors', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[1]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('accounts');
    });

    it('should go to sub accounts level on selecting accounts', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[1];
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[2]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('subAccounts');
    });

    it('should go to stores level on selecting sub accounts', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[2];
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[3]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('stores');
    });

    it('should stay at stores level on selecting stores', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[3]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('stores');
    });

    it('should stay at the same level if no performace data is passed', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.navigateTopBottomLevels(null);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[0]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('distributors');
    });

    it('should stay at the same level if id of the selected item is missing or null', function() {
      var tempVal = distributorData.id;
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      distributorData.id = 'id missing';
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[0]);
      expect(ctrl.currentTopBottomObj.currentLevelName).toEqual('distributors');

      distributorData.id = null;
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[0]);
      distributorData.id = tempVal;
    });

    /* it('should update top bottom filter model object', function() {
      // Update distributors filter
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.navigateTopBottomLevels(distributorData);
      expect(ctrl.currentTopBottomFilters.distributors.id).toEqual(distributorData.id);
      expect(ctrl.currentTopBottomFilters.distributors.name).toEqual(distributorData.name);

      // Update accounts filter
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[1];
      ctrl.navigateTopBottomLevels(acctData);
      expect(ctrl.currentTopBottomFilters.distributors.id).toEqual(distributorData.id);
      expect(ctrl.currentTopBottomFilters.distributors.name).toEqual(distributorData.name);
      expect(ctrl.currentTopBottomFilters.accounts.id).toEqual(acctData.id);
      expect(ctrl.currentTopBottomFilters.accounts.name).toEqual(acctData.name);

      // Update sub accounts filter
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[2];
      ctrl.navigateTopBottomLevels(subAcctData);
      // pls fix will ALL THESE TESTS ARE BROKEN
      // expect(ctrl.currentTopBottomFilters.distributors.id).toEqual(distributorData.id);
      // expect(ctrl.currentTopBottomFilters.distributors.name).toEqual(distributorData.name);
      expect(ctrl.currentTopBottomFilters.accounts.id).toEqual(acctData.id);
      expect(ctrl.currentTopBottomFilters.accounts.name).toEqual(acctData.name);
      expect(ctrl.currentTopBottomFilters.subAccounts.id).toEqual(subAcctData.id);
      expect(ctrl.currentTopBottomFilters.subAccounts.name).toEqual(subAcctData.name);

      // // Update stores filter
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      ctrl.navigateTopBottomLevels(storeData);
      expect(ctrl.currentTopBottomFilters.distributors.id).toEqual(distributorData.id);
      expect(ctrl.currentTopBottomFilters.distributors.name).toEqual(distributorData.name);
      expect(ctrl.currentTopBottomFilters.accounts.id).toEqual(acctData.id);
      expect(ctrl.currentTopBottomFilters.accounts.name).toEqual(acctData.name);
      expect(ctrl.currentTopBottomFilters.subAccounts.id).toEqual(subAcctData.id);
      expect(ctrl.currentTopBottomFilters.subAccounts.name).toEqual(subAcctData.name);
      expect(ctrl.currentTopBottomFilters.stores.id).toEqual(storeData.id);
      expect(ctrl.currentTopBottomFilters.stores.name).toEqual(storeData.name);
    }); */

    it('should not update distributor filter unless Apply Filter is selected', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.navigateTopBottomLevels(distributorData);
      ctrl.filtersService.model.distributor = topBottomSnapshotDistributorData.performance[1];
      ctrl.setFilter(topBottomSnapshotDistributorData.performance[1], 'distributor');

      ctrl.navigateTopBottomLevels(acctData);
      expect(ctrl.currentTopBottomAcctType).toEqual(ctrl.filtersService.accountFilters.accountTypes[2]);
      expect(ctrl.currentTopBottomAcctType).not.toEqual(ctrl.filtersService.accountFilters.accountTypes[1]);
    });

    it('should highlight store on store click', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[0];
      ctrl.navigateTopBottomLevels(distributorData);
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[1];
      ctrl.navigateTopBottomLevels(acctData);
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[2];
      ctrl.navigateTopBottomLevels(subAcctData);
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      ctrl.navigateTopBottomLevels(storeData);
      ctrl.navigateTopBottomLevels(anotherStoreData);
      var isHighligted = ctrl.isHighlightStore(anotherStoreData);
      expect(isHighligted).toBeTruthy();
      isHighligted = ctrl.isHighlightStore(storeData);
      expect(isHighligted).toBeFalsy();
    });

    it('should add a chip correctly formatted for click on store', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      storeData.name = 'Test Name';
      storeData.addressLine1 = 'Test Address';
      ctrl.navigateTopBottomLevels(storeData);
      expect(chipsService.model[4].name).toEqual('Test Name - Test Address ');
    });

    it('should add a chip correctly formatted without the address for click on store', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      storeData.name = 'Test Name';
      storeData.addressLine1 = '';
      ctrl.navigateTopBottomLevels(storeData);
      expect(chipsService.model[4].name).toEqual('Test Name');
    });

    it('should add a chip correctly formatted with a multiple parts address for click on store', function() {
      ctrl.currentTopBottomAcctType = ctrl.filtersService.accountFilters.accountTypes[3];
      storeData.name = 'Test Name';
      storeData.addressLine1 = 'Test Address, Should be filtered out';
      ctrl.navigateTopBottomLevels(storeData);
      expect(chipsService.model[4].name).toEqual('Test Name - Test Address');
    });

  });

  describe('filterTopBottom', function() {
    beforeEach(function() {
      ctrl.filtersService.model.accountSelected.accountMarkets = ctrl.filtersService.accountFilters.accountMarkets[0];
      ctrl.getDataForTopBottomLevel(ctrl.topBottomData);
      ctrl.currentTopBottomFilters = {distributors: '', accounts: '', subAccounts: '', stores: ''};
    });

    it('should reset flags for each object', function() {
      spyOn(myperformanceService, 'resetPerformanceDataFlags').and.callFake(function() {
        return true;
      });

      ctrl.filterTopBottom();

      expect(myperformanceService.resetPerformanceDataFlags).toHaveBeenCalled();
      expect(myperformanceService.resetPerformanceDataFlags.calls.count()).toEqual(4); // once for every level
    });

    it('should update top bottom data', function() {
      spyOn(ctrl, 'getDataForTopBottomLevel');

      ctrl.filterTopBottom();

      expect(ctrl.getDataForTopBottomLevel).toHaveBeenCalled();
      expect(ctrl.getDataForTopBottomLevel.calls.count()).toEqual(1);
    });
    it('should set top bottom acct type to stores for stores', function() {
      ctrl.currentTopBottomFilters.stores = {id: '555555'};
      ctrl.filterTopBottom();
      expect(ctrl.currentTopBottomAcctType).toEqual(filtersService.accountFilters.accountTypes[3]);
    });
    it('should set top bottom acct type to stores for subaccounts', function() {
      ctrl.currentTopBottomFilters.subAccounts = {id: '555555'};
      ctrl.filterTopBottom();
      expect(ctrl.currentTopBottomAcctType).toEqual(filtersService.accountFilters.accountTypes[3]);
    });
    it('should set top bottom acct type to accounts', function() {
      ctrl.currentTopBottomFilters.accounts = {id: '555555'};
      ctrl.filterTopBottom();
      expect(ctrl.currentTopBottomAcctType).toEqual(filtersService.accountFilters.accountTypes[2]);
    });
    it('should set top bottom acct type to distributor', function() {
      ctrl.currentTopBottomFilters.distributors = {id: '555555'};
      ctrl.filterTopBottom();
      expect(ctrl.currentTopBottomAcctType).toEqual(filtersService.accountFilters.accountTypes[1]);
    });
  });

   describe('removeInlineSearch', function() {
     it('should remove selectedStore', function() {
       var chipsArray = [
      {
        'name': 'one',
        'type': 'account',
        'applied': true,
        'removable': false
      },
      {
        'name': 'two',
        'type': 'subaccount',
        'applied': true,
        'removable': false
      },
      {
        'name': 'three',
        'type': 'store',
        'applied': true,
        'removable': false
      },
      {
        'name': 'four',
        'type': 'donotremove',
        'applied': true,
        'removable': false
      }
    ];
       filtersService.model.selected.account = [1, 2, 3];
       filtersService.model.selected.subaccount = [1, 2, 3];
       filtersService.model.selected.store = [1, 2, 3];

       filtersService.model.account = 'one';
       filtersService.model.subaccount = 'two';
       filtersService.model.store = 'three';

       ctrl.currentTopBottomFilters.accounts = 'one';
       ctrl.currentTopBottomFilters.subAccounts = 'two';
       ctrl.currentTopBottomFilters.stores = 'three';
       chipsService.addChipsArray(chipsArray);

       ctrl.removeInlineSearch('selectedStore');

       expect(filtersService.model.selected.account).toEqual([]);
       expect(filtersService.model.selected.subaccount).toEqual([]);
       expect(filtersService.model.selected.store).toEqual([]);

       expect(filtersService.model.account).toEqual('');
       expect(filtersService.model.subaccount).toEqual('');
       expect(filtersService.model.store).toEqual('');

       expect(ctrl.currentTopBottomFilters.accounts).toEqual('');
       expect(ctrl.currentTopBottomFilters.subAccounts).toEqual('');
       expect(ctrl.currentTopBottomFilters.stores).toEqual('');
       expect(chipsService.model).toEqual([{
         'name': 'four',
         'type': 'donotremove',
         'applied': true,
         'removable': false
       }]);
     });
     it('should remove selectedDistributor', function() {
       var chipsArray = [{
        'name': 'one',
        'type': 'distributor',
        'applied': true,
        'removable': false
      }, {
        'name': 'two',
        'type': 'subaccount',
        'applied': true,
        'removable': false
       }];
       filtersService.model.selected.distributor = [1, 2, 3];
       filtersService.model.distributor = 'one';
       ctrl.currentTopBottomFilters.distributors = 'two';
       chipsService.addChipsArray(chipsArray);

       ctrl.removeInlineSearch('selectedDistributor');
       expect(filtersService.model.selected.distributor).toEqual([]);
       expect(filtersService.model.distributor).toEqual('');
       expect(chipsService.model).toEqual([{
        'name': 'two',
        'type': 'subaccount',
        'applied': true,
        'removable': false
       }]);
       expect(ctrl.currentTopBottomFilters.distributors).toEqual('');
     });
   });

  describe('[Method] canOpenNote', function() {
    it('should return false if we are not viewing a distributor', function() {
      ctrl.showXDistributor = false;
      ctrl.showXChain       = false;
      ctrl.showXStore       = false;
      expect(ctrl.canOpenNote()).toEqual(false);
    });

    it('should return true if we are viewing a distributor', function() {
      ctrl.showXDistributor = true;
      ctrl.showXChain       = false;
      ctrl.showXStore       = false;
      expect(ctrl.canOpenNote()).toEqual(true);
    });

    it('should return false if we are viewing a distributor that is a chain', function() {
      ctrl.showXDistributor = true;
      ctrl.showXChain       = true;
      ctrl.showXStore       = false;
      expect(ctrl.canOpenNote()).toEqual(false);
    });

    it('should return true if we are viewing a store of a distributor', function() {
      ctrl.showXDistributor = true;
      ctrl.showXChain       = false;
      ctrl.showXStore       = true;
      expect(ctrl.canOpenNote()).toEqual(true);
    });

    it('should return true if we are viewing a store of a chain of a distributor', function() {
      ctrl.showXDistributor = true;
      ctrl.showXChain       = true;
      ctrl.showXStore       = true;
      expect(ctrl.canOpenNote()).toEqual(true);
    });
  });

  describe('[Method] getAccountTypePerformanceData', function() {
    beforeEach(function() {
      ctrl.topBottomData = {
        accounts: {
          performanceData: [
            { name: 'Account 1' },
            { name: 'Account 2' }
          ]
        },
        distributors: {
          performanceData: [
            { name: 'Distributor 1' },
            { name: 'Distributor 2' }
          ]
        },
        subAccounts: {
          performanceData: [
            { name: 'SubAccount 1' },
            { name: 'SubAccount 2' }
          ]
        },
        stores: {
          performanceData: [
            { name: 'Store 1' },
            { name: 'Store 2' }
          ]
        }
      };
      ctrl.accountTypeValues = {
        Distributors: 'distributors',
        Accounts: 'accounts',
        'Sub-Accounts': 'subAccounts',
        Stores: 'stores'
      };
    });

    it('should return performanceData from the current top bottom account type', function() {
      ctrl.currentTopBottomAcctType.name = 'Accounts';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'Account 1'});

      ctrl.currentTopBottomAcctType.name = 'Distributors';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'Distributor 1'});

      ctrl.currentTopBottomAcctType.name = 'Sub-Accounts';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'SubAccount 1'});

      ctrl.currentTopBottomAcctType.name = 'Stores';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'Store 1'});
    });

    it('should return performanceData of the given index', function() {
      ctrl.currentTopBottomAcctType.name = 'Accounts';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'Account 1'});
      expect(ctrl.getAccountTypePerformanceData(1)).toEqual({name: 'Account 2'});

      ctrl.currentTopBottomAcctType.name = 'Distributors';
      expect(ctrl.getAccountTypePerformanceData(0)).toEqual({name: 'Distributor 1'});
      expect(ctrl.getAccountTypePerformanceData(1)).toEqual({name: 'Distributor 2'});
    });
  });
});
