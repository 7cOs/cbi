'use strict';

module.exports = /*  @ngInject */
  function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, myperformanceService, chipsService, filtersService, userService, $timeout) {

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
    vm.disableApply = false;
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
    vm.apply = apply;
    vm.removeDistOptionsBasedOnView = removeDistOptionsBasedOnView;
    vm.displayBrandValue = displayBrandValue;
    vm.goToOpportunities = goToOpportunities;
    vm.getClassBasedOnValue = getClassBasedOnValue;
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
    vm.isPackageView = false;
    vm.checkIfVelocityPresent = checkIfVelocityPresent;
    vm.currentTotalsObject = null;
    vm.checkForDepletionCount = checkForDepletionCount;
    vm.updateChip = updateChip;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function apply(bool) {
      vm.disableApply = bool;
    }

    /**
     * Function gets the 'totals' property from brands web service call or package/sku call
     * @returns Sets the totals object to vm.currentTotalsObject
     */
    function setCurrentTotalsObject() {
      var currentTab = vm.brandSelectedIndex === 0 ? vm.brandTabs.brands : vm.brandTabs.skus;
      if (currentTab.filter) {
        var matchedProperty = currentTab.filter(function (obj) {
          return obj.type === 'Total';
        });
        vm.currentTotalsObject = matchedProperty[0];
      }
    }

    /*
    ** @param {Array} accountBrandObj - 'distirbutionSimple': 1,'distirbutionEffective': 2,'velocity': 3
    ** @param {String} property - property to fetch from object depletions, depletionsTrend
    ** @param {String} timePeriod - property to get from filterModel
    */
    function removeDistOptionsBasedOnView(accountBrandObj) {
      var isOptionHidden = false;
      if (accountBrandObj.value === 1 && vm.brandSelectedIndex === 1) {
        isOptionHidden = true;
      } else if (accountBrandObj.value === 2 && vm.brandSelectedIndex === 0) {
        isOptionHidden = true;
      }
      return isOptionHidden;
    }

    /**
     * Returns the correct property from the measures array
     * @param {Array} brandMeasures - array of measures for a brand
     * @param {String} property - property to fetch from object depletions, depletionsTrend
     * @returns {String}  Property to get from filterModel
     */
    function displayBrandValue(brandMeasures, property, timePeriod) {
      if (brandMeasures) {
        var matchedMeasure = brandMeasures.filter(function(currentMeasure) {
          return currentMeasure.timeframe === vm.filterModel[timePeriod].name;
        });
        if (matchedMeasure[0]) {
          return matchedMeasure[0][property];
        }
      }
    }

    function goToOpportunities() {
      if (!allOpportunitiesDisabled()) {
        $state.go('opportunities', {
          resetFiltersOnLoad: false,
          applyFiltersOnLoad: true,
          referrer: 'accounts'
        });
      } else {
        alert('Ratul, pls add moar filters pls');
      }
      // premise type - still need halp
    }

    /**
     * Checks if a value is positive or negative and returns empty string for null or undefined
     * @param {Number} currentValue Opportunity object
     * @param {String} classToBeAdded Array of all currently selected items
     * @returns Returns 'positive' or 'negative' or ''
     */
    function getClassBasedOnValue(currentValue) {
      var classToBeAdded = '';
      if (userService.isValidValues(currentValue)) {
        if (currentValue >= 0) {
          classToBeAdded = 'positive';
        } else {
          classToBeAdded = 'negative';
        }
      }
      return classToBeAdded;
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
        setCurrentTotalsObject();
        vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
        vm.brandIdSelected = null;
        vm.filterModel.brand = '';
        vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      }
    }

    function resetFilters() {
      vm.filterModel = angular.copy(filterModelTemplate);
      chipsService.resetChipsFilters(chipsService.model);
      apply(false);
    }

    /**
     * Checks if a value is positive or negative and returns empty string for null or undefined
     * @param {Object} currentValue Opportunity object
     * @param {String} classToBeAdded Array of all currently selected items
     * @returns 'positive' or 'negative' or ''
     */
    function checkIfVelocityPresent(item) {
      // Only return true if its YA%. For APB velocityTrend should be blank
      if (item && item.measures) {
        return vm.filterModel.trend.value === 1 && vm.displayBrandValue(item.measures, 'velocityTrend', 'distributionTimePeriod');
      }
    }

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;

      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
        if (widget === 'markets') { setSelected(item.label, 'markets'); }
      } else {
        if (widget === 'brands') { vm.brandWidgetTitle = item.name; }
        vm.loadingBrandSnapshot = true;
        vm.filterModel.brand = item.id;
        var params = filtersService.getAppliedFilters('brandSnapshot');
        params.brand = item.id;
        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.skus = data.performance;
          nextTab(widget);
          $timeout(function () {
            vm.loadingBrandSnapshot = false;
          }, 500);
        });
      }
      if (widget === 'markets') { getActiveTab(); }
    }

    function setFilter(result, filterModelProperty) {
      filtersService.model.selected[filterModelProperty] = [result.id];

      if (filterModelProperty === 'store') {
        filtersService.model.selected.chain = [];
        filtersService.model.chain = '';
        chipsService.removeChip('chain');
      } else if (filterModelProperty === 'chain') {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
        chipsService.removeChip('store');
      }

      for (var i = 0; i < chipsService.model.length; i++) {
        if (chipsService.model[i].type === filterModelProperty) {
          chipsService.model.splice(i, 1);
          break;
        }
      }

      chipsService.addAutocompleteChip(result.name, filterModelProperty, false);

      apply(false);
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
      var params = filtersService.getAppliedFilters('brandSnapshot');
      vm.loadingBrandSnapshot = true;

      userService.getPerformanceBrand(params).then(function(data) {
        vm.brandTabs.brands = data.performance;
        prevTab();
        vm.loadingBrandSnapshot = false;
      });

      apply(true);
    }

    function updateChip(name, chip) {
      if (chip === 'myAccountsOnly') {
        chipsService.updateChip(chip, name);
      } else if (chip === 'premiseType') {
        for (var i = 0; i < chipsService.model.length; i++) {
          if (chipsService.model[i].type === chip) {
            chipsService.model.splice(i, 1);
            break;
          }
        }

        chipsService.addChip(name, chip, true, false);
        // filter.resetTradeChannels() -- do we need to do this so the trade channels are correct based on filter
      }

      vm.apply(false);
    }

    function updateDistributionTimePeriod(value) {
      vm.filterModel.depletionsTimePeriod = filtersService.model.depletionsTimePeriod[value][0];
      vm.filterModel.distributionTimePeriod = filtersService.model.distributionTimePeriod[value][0];
    }

    function updateTopBottom() {
      var route = filtersService.model.selected.accountTypes.replace(/\W/g, '').toLowerCase();
      userService.getTopBottom(route).then(function(data) {
        userService.model.topBottom[route] = data;
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function allOpportunitiesDisabled() {
      if ((filtersService.model.selected.premiseType && filtersService.model.selected.premiseType !== 'all') && ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.chain && filtersService.model.selected.chain.length > 0))) return false;

      return true;
    }

    function deselectMarketId() {
      if (vm.marketIdSelected === true) {
        vm.idSelected = null;
        vm.marketIdSelected = false;
      }
    }

    /**
     * Checks if value of Depletions for a Pacakge or Brand is greater than 0
     * @param {Number} item Package or Brand
     * @returns Returns true if value greater than 0
     */
    function checkForDepletionCount(item) {
      var val = vm.displayBrandValue(item.measures, 'depletions', 'depletionsTimePeriod');
      return val && val > 0;
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
      if (widget === 'brands') {
        vm.brandSelectedIndex = vm.brandSelectedIndex + 1;
        setCurrentTotalsObject();
        vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[1];
      }
      if (widget === 'markets') { vm.marketSelectedIndex = vm.marketSelectedIndex + 1; }
    }

    function init() {
      // reset all chips and filters on page init
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      chipsService.resetChipsFilters(chipsService.model);
      setDefaultEndingPeriodOptions();
      vm.filtersService.model.selected.premiseType = 'all';
      var params = filtersService.getAppliedFilters('brandSnapshot');

      var promiseArr = [
        userService.getPerformanceSummary(),
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getPerformanceBrand(params)
      ];

      $q.all(promiseArr).then(function(data) {
        userService.model.summary = data[0];
        userService.model.depletion = data[1];
        userService.model.distribution = data[2];
        vm.brandTabs.brands = data[3].performance;
        setCurrentTotalsObject();
        vm.loadingBrandSnapshot = false;
      });
    }

    /**
     * Gets the trend values based on whether ABP or YA is selected
     * @param {Array} measures Package or Brand
     * @param {String} measureType depletions or Distribution
     * @param {String} timePeriod L90, L120 etc
     * @returns {Object} currentTrendVal Returns the trend display value as string and the actual float value
     */
    function getTrendValues(measures, measureType, timePeriod) {
      var currentTrendVal = {
        value: null,
        displayValue: ''
      };
      var measurePropertyName;
      switch (vm.filterModel.trend.value) {
        case 1:
        // For YA
          measurePropertyName = vm.filtersService.trendPropertyNames[measureType][0];
          currentTrendVal.value = displayBrandValue(measures, measurePropertyName, timePeriod);
          break;
        case 2:
          // For ABP
          measurePropertyName = vm.filtersService.trendPropertyNames[measureType][1];
          currentTrendVal.value = displayBrandValue(measures, measurePropertyName, timePeriod);
          break;
        case 3:
        // TODO
        // For Select Stores
          break;
      }
      if (!userService.isValidValues(currentTrendVal.value)) {
        currentTrendVal.displayValue = '-';
      } else {
        if (currentTrendVal.value === 0) {
          currentTrendVal.displayValue =   currentTrendVal.value + '%';
        } else {
          currentTrendVal.displayValue = currentTrendVal.value.toFixed(1) + '%';
        }
      }
      return currentTrendVal;
    }

    /**
     * Gets the default selections or the selections chosen in the Scorecard page
     * @returns {Object} Sets the ending, depletion and distirbution optios
     */
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
