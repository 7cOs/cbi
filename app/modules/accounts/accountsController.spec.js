describe('Unit: accountsController', function() {
  var scope, ctrl, $state, $q, filtersService, chipsService, userService, packageSkuData, brandSpy, brandPerformanceData;
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
  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.accounts');

    inject(function($rootScope, $controller, _$state_, _$q_, _chipsService_, _filtersService_, _userService_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $state = _$state_;
      $q = _$q_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;
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
      spyOn(userService, 'getTopBottomSnapshot').and.returnValue(fakePromise);
      brandSpy = spyOn(userService, 'getPerformanceBrand');
      brandSpy.and.returnValue($q.when(brandPerformanceData));
      // Create Controller
      ctrl = $controller('accountsController', {$scope: scope});
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
      expect(ctrl.marketSelectedIndex).toEqual(0);
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

      expect(ctrl.updateTopBottom).not.toBeUndefined();
      expect(typeof (ctrl.updateTopBottom)).toEqual('function');
    });

    it('Should get default radio button options on init', function () {
      expect(ctrl.filterModel.endingTimePeriod).toEqual('year');
      expect(ctrl.filterModel.depletionsTimePeriod.name).toEqual('FYTD');
      expect(ctrl.filterModel.distributionTimePeriod.name).toEqual('L90');
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

  describe('[Method] goToOpportunities', function() {
    var e = {
      preventDefault: function() {
        return true;
      }
    };

    beforeEach(function() {
      spyOn(filtersService, 'resetFilters').and.callThrough();
      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('Should go to opportunities page with params if conditions are met', function() {
      filtersService.model.selected.premiseType = 'on';
      filtersService.model.selected.chain = ['01110000 01101100 01110011'];

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

  describe('[Method] updateDistributionTimePeriod', function() {
    it('Should set ctrl.filterModel.distributionTimePeriod', function() {
      ctrl.updateDistributionTimePeriod('year');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['year'][0]);

      ctrl.updateDistributionTimePeriod('month');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['month'][0]);
    });
  });

  describe('[Method] updateDistributionTimePeriod', function() {
    it('Should set ctrl.filterModel.distributionTimePeriod', function() {
      ctrl.updateDistributionTimePeriod('year');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['year'][0]);

      ctrl.updateDistributionTimePeriod('month');
      expect(ctrl.filterModel.distributionTimePeriod).toEqual(filtersService.model.distributionTimePeriod['month'][0]);
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

    it('Should move to Package/SKU view', function () {
      brandSpy.and.returnValue($q.when(packageSkuData));
      ctrl.selectItem(widget, item, parent, parentIndex);
      scope.$digest();
      expect(ctrl.brandSelectedIndex).toEqual(1);
    });

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
      var val = ctrl.removeDistOptionsBasedOnView(distSimple);
      expect(val).toBeFalsy();
    });

    it('Should hide distirbution Effective in brand view ', function () {
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionEffective);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple);
      expect(val).toBeTruthy();
    });

    it('Should hide distirbution Simple in package view ', function () {
      ctrl.brandSelectedIndex++;
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionSimple);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple);
      expect(val).toBeTruthy();
    });

    it('Should show distirbution Effective in package view ', function () {
      ctrl.brandSelectedIndex++;
      var distSimple = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.distirbutionEffective);
      var val = ctrl.removeDistOptionsBasedOnView(distSimple);
      expect(val).toBeFalsy();
    });

    it('Should show Velocity in brand and package view ', function () {
      var velocity = getDistirbutionBasedOnValue(ctrl.filtersService.accountFilters.accountBrandEnum.velocity);
      var val = ctrl.removeDistOptionsBasedOnView(velocity);
      expect(val).toBeFalsy();

      ctrl.brandSelectedIndex++;
      val = ctrl.removeDistOptionsBasedOnView(velocity);
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

  });

  describe('[Method] goToOpportunities', function() {
    beforeEach(function() {
      spyOn(chipsService, 'updateChip').and.callThrough();
      spyOn(chipsService, 'addChip').and.callThrough();
      spyOn(ctrl, 'apply').and.callThrough();
    });

    it('Should update my accounts only chip', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(0);
      expect(ctrl.apply).not.toHaveBeenCalled();
      // run
      ctrl.updateChip('My Accounts Only', 'myAccountsOnly');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(1);
      expect(chipsService.updateChip).toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(1);
      expect(ctrl.apply).toHaveBeenCalled();
    });

    it('Should update premise type chip', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(0);
      expect(ctrl.apply).not.toHaveBeenCalled();
      // run
      ctrl.updateChip('On-Premise', 'premiseType');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(1);
      expect(chipsService.addChip).toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(1);
      expect(ctrl.apply).toHaveBeenCalled();
    });

    it('Should update premise type chip and remove the existing one if it already exists (off -> on)', function() {
      // init
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(0);
      expect(chipsService.addChip).not.toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(0);
      expect(ctrl.apply).not.toHaveBeenCalled();
      expect(chipsService.model.length).toEqual(3);
      expect(chipsService.model[1].name).toEqual('Off-Premise');
      // run
      ctrl.updateChip('On-Premise', 'premiseType');
      // assert
      expect(chipsService.updateChip.calls.count()).toEqual(0);
      expect(chipsService.updateChip).not.toHaveBeenCalled();
      expect(chipsService.addChip.calls.count()).toEqual(1);
      expect(chipsService.addChip).toHaveBeenCalled();
      expect(ctrl.apply.calls.count()).toEqual(1);
      expect(ctrl.apply).toHaveBeenCalled();
      expect(chipsService.model.length).toEqual(3);
      expect(chipsService.model[2].name).toEqual('On-Premise');
    });

  });

  describe('[Method] setDefaultFilterOptions', function() {
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

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('all');
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

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('Off-Premise', 'premiseType');
    });

    it('Should disable premise type and set default as off premise if OFF_SPEC', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser.srcTypeCd = ['OFF_SPEC'];

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('off');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('Off-Premise', 'premiseType');
    });

    it('Should disable premise type and set default as on premise if ON_HIER', function() {
      filtersService.model.selected.myAccountsOnly = true;
      userService.model.currentUser.srcTypeCd = ['ON_HIER'];

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('on');
      expect(ctrl.premiseTypeDisabled).toEqual(true);
      expect(ctrl.updateChip.calls.count()).toEqual(1);
      expect(ctrl.updateChip).toHaveBeenCalledWith('On-Premise', 'premiseType');
    });

    it('Should go to default if SALES_HIER', function() {
      filtersService.model.selected.myAccountsOnly = true;

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('all');
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

      ctrl.setDefaultFilterOptions();

      expect(filtersService.model.selected.premiseType).toEqual('all');
      expect(ctrl.premiseTypeDisabled).toEqual(false);
      expect(ctrl.updateChip.calls.count()).toEqual(0);
      expect(ctrl.updateChip).not.toHaveBeenCalled();
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
      filtersService.model.selected.chain = ['222222'];
      expect(ctrl.disableStoreType()).toEqual(false);
    });
    it('Should return false if there is a distributor but no chain or store', function() {
      filtersService.model.selected.distributor = ['222222'];
      expect(ctrl.disableStoreType()).toEqual(false);
    });
  });

  describe('[Method] updateTopBottom', function() {
    beforeEach(function() {
    });

    it('Should update top bottom', function() {
      ctrl.loadingTopBottom = true;
      var categoryBound = filtersService.model.accountSelected.accountMarkets;
      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(1);

      ctrl.getDataForTopBottom(ctrl.topBottomData, categoryBound);

      expect(userService.getTopBottomSnapshot.calls.count()).toEqual(2);
    });

  });

});
