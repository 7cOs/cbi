'use strict';

module.exports = /*  @ngInject */
  function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, myperformanceService, chipsService, filtersService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;

    vm.filters = {
      placementType: [{
        name: 'Simple'
      }, {
        name: 'Effective'
      }],
      trend: [{
        name: 'vs YA'
      }, {
        name: 'vs ABP'
      }],
      premises: [{
        name: 'All'
      }, {
        name: 'Off-Premise'
      }, {
        name: 'On-Premise'
      }],
      accountBrands: [{
        name: 'Distribution (simple)'
      }, {
        name: 'Velocity'
      }],
      accountMarkets: [{
        name: 'Depletions'
      }, {
        name: 'Distribution (simple)'
      }, {
        name: 'Distribution (effective)'
      }, {
        name: 'Velocity'
      }],
      valuesVsTrend: [{
        name: 'Top 10 (Values)'
      }, {
        name: 'Top 10 (Trend)'
      }, {
        name: 'Bottom 10 (Values)'
      }, {
        name: 'Bottom 10 (Trend)'
      }],
      accountTypes: [{
        name: 'Distributors'
      }, {
        name: 'Accounts'
      }, {
        name: 'Sub-Accounts'
      }, {
        name: 'Stores'
      }],
      storeTypes: [{
        name: 'Chain'
      }, {
        name: 'Independent'
      }]
    };

    var trendPropertyNames = {
      'distributions': [
        'planDistirbutionSimpleTrend',
        'distributionsSimpleTrend'
      ],
      'depletions': [
        'depletionsTrend',
        'planDepletionTrend'
      ]

    };
    /* Need to remove this */
    vm.marketData = myperformanceService.marketData();

    // Filter Model - Keeping this out of filtersService as its not needed anywhere else
    var filterModelTemplate = {
      trend: filtersService.model.trend[0].name,
      endingTimePeriod: filtersService.model.timePeriod[0].value,
      depletionsTimePeriod: filtersService.model.depletionsTimePeriod.month[0].name,
      distributionTimePeriod: filtersService.model.distributionTimePeriod.month[0].name
    };
    vm.filterModel = angular.copy(filterModelTemplate);

    // Widget / tab contents
    vm.brandTabs = {
      brands: [],
      skus: []
    };
    vm.marketTabs = {
      distributors: vm.marketData.distributors,
      accounts: vm.marketData.accounts,
      subAccounts: vm.marketData.subAccounts,
      stores: vm.marketData.stores
    };

    // Set selected tabs
    vm.selected = null;
    vm.previous = null;
    vm.brandSelectedIndex = 0;
    vm.marketSelectedIndex = 0;

    // Set default values
    vm.accountTypesDefault = 'Distributors';
    vm.brandWidgetTitleDefault = 'All Brands';
    vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
    vm.filtersService.model.accountSelected.accountBrands = 'Distribution (simple)';
    vm.filtersService.model.accountSelected.accountMarkets = 'Depletions';
    vm.selectOpen = false;
    vm.disableAnimation = false;
    vm.marketStoresView = false;
    vm.marketIdSelected = false;
    vm.selectedStore = null;
    vm.hintTextPlaceholder = 'Account or Subaccount Name';
    vm.overviewOpen = false;
    vm.idSelected = null;
    vm.brandIdSelected = null;
    vm.loadingBrandSnapshot = true;

    // Chart Setup
    vm.chartData = [{'values': vm.marketData.distributors}];
    vm.chartOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        groupSpacing: 0.65,
        x: function(d) { return d.label; },
        y: function(d) { return d.value; },
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          showMaxMin: false
        },
        showControls: false,
        showValues: true,
        duration: 500,
        valueFormat: function(d) {
          return d + '%';
        },
        tooltip: {
          valueFormatter: function(d) {
            return d + '%';
          }
        },
        margin: {
          top: 0,
          right: 0,
          bottom: 30,
          left: 0
        },
        legend: {
          width: 0,
          height: 0
        },
        controls: {
          width: 0,
          height: 0
        }
      }
    };

    // Expose public methods
    vm.brandTotal = brandTotal;
    vm.displayBrandValue = displayBrandValue;
    vm.goToOpportunities = goToOpportunities;
    vm.isPositive = isPositive;
    vm.openNotes = openNotes;
    vm.openSelect = openSelect;
    vm.placeholderSelect = placeholderSelect;
    vm.prevTab = prevTab;
    vm.resetFilters = resetFilters;
    vm.selectItem = selectItem;
    vm.setFilter = setFilter;
    vm.setMarketTab = setMarketTab;
    vm.updateBrandSnapshot = updateBrandSnapshot;
    vm.updateDistributionTimePeriod = updateDistributionTimePeriod;
    vm.updateTopBottom = updateTopBottom;
    vm.getTrendValues = getTrendValues;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function brandTotal(measure, percentageBool) {
      for (var i = 0; i < vm.brandTabs.brands.length; i++) {
        if (vm.brandTabs.brands[i].type === 'Total') {
          for (var j = 0; j < vm.brandTabs.brands[i].measures.length; j++) {
            if (measure === 'depletions') {
              if (vm.brandTabs.brands[i].measures[j].timeframe === vm.filterModel.depletionsTimePeriod) {
                // return percentage if percentageBool
                if (percentageBool) return vm.brandTabs.brands[i].measures[j].depletionsTrend;
                else return vm.brandTabs.brands[i].measures[j].depletions;
              }
            } else if (measure === 'distributions') {
              if (vm.brandTabs.brands[i].measures[j].timeframe === vm.filterModel.distributionTimePeriod) {
                // return percentage if percentageBool
                if (percentageBool) return vm.brandTabs.brands[i].measures[j].distributionsSimpleTrend;
                else return vm.brandTabs.brands[i].measures[j].distributionsSimple;
              }
            } else if (measure === 'velocity') {
              if (vm.brandTabs.brands[i].measures[j].timeframe === vm.filterModel.distributionTimePeriod) {
                // return percentage if percentageBool
                if (percentageBool) return vm.brandTabs.brands[i].measures[j].velocityTrend;
                else return vm.brandTabs.brands[i].measures[j].velocity;
              }
            }
          }
        }
      }
    }

    /*
    ** @param {Array} brandMeasures - array of measures for a brand
    ** @param {String} property - property to fetch from object depletions, depletionsTrend
    ** @param {String} timePeriod - property to get from filterModel
    */
    function displayBrandValue(brandMeasures, property, timePeriod) {
      for (var i = 0; i < brandMeasures.length; i++) {
        if (brandMeasures[i].timeframe === vm.filterModel[timePeriod]) {
          return brandMeasures[i][property];
        }
      }

      // return brandMeasures.[property]
    }

    function goToOpportunities() {
      $state.go('opportunities', {
        resetFiltersOnLoad: false,
        getDataOnLoad: true
      });
    }

    // Check if sales data value is positive (for display in UI)
    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    }

    // Make notes available to the page
    function openNotes(val) {
      $rootScope.$broadcast('notes:opened', val);
    }

    // Set variable when select box is open (for bug in scroll binding)
    function openSelect(value) {
      vm.selectOpen = value;
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    // Move to previously indexed tab (only used for brands)
    function prevTab() {
      if (vm.brandSelectedIndex > 0) {
        vm.brandSelectedIndex = vm.brandSelectedIndex - 1;
        vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
        vm.brandIdSelected = null;
        vm.filterModel.brand = '';
      }
    }

    function resetFilters() {
      vm.filterModel = angular.copy(filterModelTemplate);
    }

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;

      vm.loadingBrandSnapshot = true;
      vm.filterModel.brand = item.id;
      userService.getPerformanceBrand({premiseType: filtersService.model.selected.premiseType, brand: item.id}).then(function(data) {
        vm.brandTabs.skus = data.performance;
        console.log('Brand Selection Performance');
        console.log(data.performance);
        vm.loadingBrandSnapshot = false;
      });

      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
        if (widget === 'markets') { setSelected(item.label, 'markets'); }
      } else {
        if (widget === 'brands') { vm.brandWidgetTitle = item.name; }
        nextTab(widget);
      }
      if (widget === 'markets') { getActiveTab(); }
    }

    function setFilter(result, filterModelProperty) {
      filtersService.model.selected[filterModelProperty] = [result.id];

      if (filterModelProperty === 'store') {
        filtersService.model.selected.chain = [];
        filtersService.model.chain = '';
      } else if (filterModelProperty === 'chain') {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
      }

      console.log('[filtersService.model]', filtersService.model);
    }

    // Set proper tab and skip animation when chosen from market select box
    function setMarketTab(selectValue) {
      vm.disableAnimation = true;
      if (selectValue === 'Distributors') { vm.marketSelectedIndex = 0; }
      if (selectValue === 'Accounts') { vm.marketSelectedIndex = 1; }
      if (selectValue === 'Sub-Accounts') { vm.marketSelectedIndex = 2; }
      if (selectValue === 'Stores') { vm.marketSelectedIndex = 3; }
      getActiveTab();
    }

    function updateBrandSnapshot() {
      if (vm.brandTabs.brands.length === 0) {
        userService.getPerformanceBrand().then(function(data) {
          vm.brandTabs.brands = data.performance;
          console.log('[vm.brandTabs.brands]', vm.brandTabs.brands);
        });
      }
    }

    function updateDistributionTimePeriod(value) {
      vm.filterModel.depletionsTimePeriod = filtersService.model.depletionsTimePeriod[value][0].name;
      vm.filterModel.distributionTimePeriod = filtersService.model.distributionTimePeriod[value][0].name;
    }

    function updateTopBottom() {
      var route = filtersService.model.selected.accountTypes.replace(/\W/g, '').toLowerCase();
      userService.getTopBottom(route).then(function(data) {
        userService.model.topBottom[route] = data;
        console.log(userService.model.topBottom);
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function deselectMarketId() {
      if (vm.marketIdSelected === true) {
        vm.idSelected = null;
        vm.marketIdSelected = false;
      }
    }

    // Checks active tab, updates model, passes data to chart (markets only)
    function getActiveTab() {
      if (vm.marketSelectedIndex === 0) { vm.filtersService.model.selected.accountTypes = 'Distributors'; setChartData(vm.marketData.distributors); deselectMarketId(); }
      if (vm.marketSelectedIndex === 1) { vm.filtersService.model.selected.accountTypes = 'Accounts'; setChartData(vm.marketData.accounts); deselectMarketId(); }
      if (vm.marketSelectedIndex === 2) { vm.filtersService.model.selected.accountTypes = 'Sub-Accounts'; setChartData(vm.marketData.subAccounts); deselectMarketId(); }
      if (vm.marketSelectedIndex === 3) { vm.filtersService.model.selected.accountTypes = 'Stores'; setChartData(vm.marketData.stores); }
    }

    // Move to next indexed tab
    function nextTab(widget) {
      vm.disableAnimation = false;
      if (widget === 'brands') { vm.brandSelectedIndex = vm.brandSelectedIndex + 1; }
      if (widget === 'markets') { vm.marketSelectedIndex = vm.marketSelectedIndex + 1; }
    }

    function init() {
      // reset all chips and filters on page init
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      setDefaultEndingPeriodOptions();
      chipsService.resetChipsFilters(chipsService.model);

      var promiseArr = [
        userService.getPerformanceSummary(),
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getPerformanceBrand()
      ];

      $q.all(promiseArr).then(function(data) {
        userService.model.summary = data[0];
        userService.model.depletion = data[1];
        userService.model.distribution = data[2];
        vm.brandTabs.brands = data[3].performance;
        console.log('Brands');
        console.log(data[3]);

        vm.loadingBrandSnapshot = false;
      });
    }

    function getTrendValues(measures, measureType, timePeriod) {
      var currentTrendVal = {
        value: null,
        displayValue: ''
      };
      var measurePropertyName;
      switch (vm.filterModel.trend.value) {
        case 1:
        // For YA
          measurePropertyName = trendPropertyNames[measureType][0];
          currentTrendVal.value = displayBrandValue(measures, measurePropertyName, timePeriod);
          break;
        case 2:
          // For ABP
          measurePropertyName = trendPropertyNames[measureType][1];
          currentTrendVal.value = displayBrandValue(measures, measurePropertyName, timePeriod);
          break;
        case 3:
        // TODO
        // For Select Stores
          break;
      }

      if (currentTrendVal.value) {
        currentTrendVal.displayValue = currentTrendVal.value.toFixed(1).toString() + '%';
      } else {
        currentTrendVal.displayValue = '-';
      }
      return currentTrendVal;
    }

    function setDefaultEndingPeriodOptions() {
      vm.filterModel.endingTimePeriod = vm.filtersService.lastEndingTimePeriod.endingPeriodType;
      vm.filterModel.depletionsTimePeriod = vm.filtersService.lastEndingTimePeriod.depletionValue;
      vm.filterModel.distributionTimePeriod = vm.filtersService.lastEndingTimePeriod.timePeriodValue;
    }

    // Handle required formatting for chart data
    function setChartData(data) {
      vm.chartData = [{'values': data}];
    }

    // Set element class for market overview
    function setOverviewDisplay(value) {
      vm.overviewOpen = value;
      $scope.$apply();
    }

    // Add 'selected' class to item furthest possible drill-down tab level
    function setSelected(idSelected, widget) {
      vm.idSelected = idSelected;
      if (vm.selectedStore) { vm.selectedStore = null; }
      if (widget === 'brands') { vm.brandIdSelected = idSelected; }
      if (widget === 'markets') { vm.marketIdSelected = true; vm.selectedStore = idSelected; prevTab(); }
    }

    $scope.$watch('a.filterModel.depletionsTimePeriod', function (newVal) {
      console.log(newVal);
    });

    // Check if market overview is scrolled out of view
    angular.element($window).bind('scroll', function() {

      if (vm.selectOpen) {
        return;
      }

      vm.st = this.pageYOffset;

      if (vm.st >= 230) {
        // Only set element class if state has changed
        if (!vm.scrolledBelowHeader) {
          setOverviewDisplay(true);
        }
        vm.scrolledBelowHeader = true;
      } else {
        // Only set element class if state has changed
        if (vm.scrolledBelowHeader) {
          setOverviewDisplay(false);
        }
        vm.scrolledBelowHeader = false;
      }
    });
  };
