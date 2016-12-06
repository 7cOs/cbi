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

    // Set selected tabs
    vm.selected = null;
    vm.previous = null;
    vm.brandSelectedIndex = 0;
    vm.marketSelectedIndex = 0;

    // Set default values
    vm.accountTypesDefault = 'Distributors';
    vm.brandIdSelected = null;
    vm.brandWidgetTitleDefault = 'All Brands';
    vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
    vm.currentTopBottomAcctType = null;
    vm.currentTopBottomDataForFilter = null;
    vm.disableAnimation = false;
    vm.disableApply = false;
    vm.filtersService.model.accountSelected.accountBrands = 'Distribution (simple)';
    vm.filtersService.model.accountSelected.accountMarkets = 'Depletions';
    vm.hintTextPlaceholder = 'Account or Subaccount Name';
    vm.idSelected = null;
    vm.loadingBrandSnapshot = true;
    vm.loadingTopBottom = true;
    vm.marketStoresView = false;
    vm.marketIdSelected = false;
    vm.overviewOpen = false;
    vm.premiseTypeDisabled = false;
    vm.selectedStore = null;
    vm.selectOpen = false;

    // top bottom public methods
    vm.topBottomData = {
      distributors: null,
      accounts: null,
      subAccounts: null,
      stores: null
    };
    vm.getDataForTopBottom = getDataForTopBottom;
    vm.currentChartData = null;
    vm.getSortedArrIndex = getSortedArrIndex;
    vm.currentTopBottomObj = null;
    vm.currentTopBottomAcctType = null;
    vm.currentTopBottomDataForFilter = null;
    vm.getValueBoundForAcctType = getValueBoundForAcctType;
    vm.setTopBottomAcctTypeSelection = setTopBottomAcctTypeSelection;
    vm.getCurrentChartData = getCurrentChartData;
    vm.topBottomInitData = true;

    // Expose public methods
    vm.allOpportunitiesDisabled = allOpportunitiesDisabled;
    vm.apply = apply;
    vm.checkForDepletionCount = checkForDepletionCount;
    vm.checkIfVelocityPresent = checkIfVelocityPresent;
    vm.currentTopBottomView = null;
    vm.currentTotalsObject = null;
    vm.disablePremiseType = disablePremiseType;
    vm.disableStoreType = disableStoreType;
    vm.displayBrandValue = displayBrandValue;
    vm.goToOpportunities = goToOpportunities;
    vm.getClassBasedOnValue = getClassBasedOnValue;
    vm.getTrendValues = getTrendValues;
    vm.isPackageView = false;
    vm.openNotes = openNotes;
    vm.openSelect = openSelect;
    vm.placeholderSelect = placeholderSelect;
    vm.prevTab = prevTab;
    vm.removeDistOptionsBasedOnView = removeDistOptionsBasedOnView;
    vm.resetFilters = resetFilters;
    vm.selectItem = selectItem;
    vm.setDefaultFilterOptions = setDefaultFilterOptions;
    vm.setFilter = setFilter;
    vm.updateBrandSnapshot = updateBrandSnapshot;
    vm.updateChip = updateChip;
    vm.updateDistributionTimePeriod = updateDistributionTimePeriod;
    vm.updateTopBottom = updateTopBottom;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function allOpportunitiesDisabled() {
      if ((filtersService.model.selected.premiseType && filtersService.model.selected.premiseType !== 'all') && ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.chain && filtersService.model.selected.chain.length > 0))) return false;

      return true;
    }

    function apply(bool) {
      vm.disableApply = bool;
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

    function disablePremiseType(bool) {
      vm.premiseTypeDisabled = bool;
    }

    function disableStoreType() {
      if ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.chain && filtersService.model.selected.chain.length > 0)) {
        return false;
      } else {
        return true;
      }
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

    function goToOpportunities(e) {
      if (!allOpportunitiesDisabled()) {
        $state.go('opportunities', {
          resetFiltersOnLoad: false,
          applyFiltersOnLoad: true,
          referrer: 'accounts'
        });
      } else {
        e.preventDefault();
      }
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
        vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
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

    function resetFilters() {
      vm.filterModel = angular.copy(filterModelTemplate);
      chipsService.resetChipsFilters(chipsService.model);
      setDefaultFilterOptions();
      apply(false);
    }

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;

      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
      } else {
        if (widget === 'brands') { vm.brandWidgetTitle = item.name; }
        vm.loadingBrandSnapshot = true;
        var params = filtersService.getAppliedFilters('brandSnapshot');
        params.brand = item.id;
        vm.brandIdSelected = item.id;
        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.skus = data.performance;
          nextTab(widget);
          $timeout(function () {
            vm.loadingBrandSnapshot = false;
          }, 500);
        });
      }
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

    function setDefaultFilterOptions() {
      if (!filtersService.model.selected.myAccountsOnly) {
        defaultPremise();
      } else if (userService.model.currentUser && userService.model.currentUser.srcTypeCd) {
        switch (userService.model.currentUser.srcTypeCd[0]) {
          case 'OFF_HIER':
          case 'OFF_SPEC':
            offPremise();
            break;
          case 'ON_HIER':
            onPremise();
            break;
          default:
            defaultPremise();
            break;
        }
      }

      function defaultPremise() {
        disablePremiseType(false);
      }
      function onPremise() {
        filtersService.model.selected.premiseType = 'on';
        vm.updateChip('On-Premise', 'premiseType');
        disablePremiseType(true);
      }
      function offPremise() {
        filtersService.model.selected.premiseType = 'off';
        vm.updateChip('Off-Premise', 'premiseType');
        disablePremiseType(true);
      }
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

    function updateBrandSnapshot() {
      var params = filtersService.getAppliedFilters('brandSnapshot');
      vm.loadingBrandSnapshot = true;
      prevTab();

      userService.getPerformanceBrand(params).then(function(data) {
        vm.brandTabs.brands = data.performance;
        setCurrentTotalsObject();
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

    // ***************
    // PRIVATE METHODS
    // ***************

    /**
     * Checks if value of Depletions for a Pacakge or Brand is greater than 0
     * @param {Number} item Package or Brand
     * @returns Returns true if value greater than 0
     */
    function checkForDepletionCount(item) {
      var val = vm.displayBrandValue(item.measures, 'depletions', 'depletionsTimePeriod');
      return val && val > 0;
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

    function init() {
      // reset all chips and filters on page init if no brand is specified
      if (!$state.params.applyFiltersOnLoad) {
        chipsService.resetChipsFilters(chipsService.model);
      } else {
        vm.topBottomInitData = false;
        vm.brandIdSelected = filtersService.model.selected.brand[0];
        vm.brandWidgetTitle = $state.params.pageData.brandTitle;
        chipsService.addAutocompleteChip(vm.brandWidgetTitle, 'brand', false);
      }

      setDefaultDropDownOptions();
      setDefaultFilterOptions();
      var params = filtersService.getAppliedFilters('brandSnapshot');
      vm.filtersService.model.valuesVsTrend = vm.filtersService.accountFilters.valuesVsTrend[1];

      var promiseArr = [
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getPerformanceBrand(params),
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params)
      ];

      $q.all(promiseArr).then(function(data) {
        userService.model.depletion = data[0];
        userService.model.distribution = data[1];
        vm.brandTabs.brands = data[2].performance;
        setCurrentTotalsObject();
        if (data[3]) {
          var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
          vm.currentTopBottomObj.performanceData = data[3].performance;
          vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
          getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
          $scope.$watchGroup(['a.filtersService.model.accountSelected.accountMarkets', 'a.filterModel.depletionsTimePeriod',
          'a.filterModel.distributionTimePeriod', 'a.filterModel.trend'], onFilterPropertiesChange);
          if (vm.topBottomInitData === true) {
            vm.topBottomInitData = false;
          }
        }
        vm.loadingBrandSnapshot = false;
        vm.loadingTopBottom = false;

        // reset state params
        $state.params.applyFiltersOnLoad = false;
        $state.params.resetFiltersOnLoad = true;
      });
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

    /**
     * Gets the default selections or the selections chosen in the Scorecard page
     * @returns {Object} Sets the ending, depletion and distirbution optios
     */
    function setDefaultEndingPeriodOptions() {
      vm.filterModel.endingTimePeriod = vm.filtersService.lastEndingTimePeriod.endingPeriodType;
      vm.filterModel.depletionsTimePeriod = vm.filtersService.lastEndingTimePeriod.depletionValue;
      vm.filterModel.distributionTimePeriod = vm.filtersService.lastEndingTimePeriod.timePeriodValue;
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

    // Top Bottom Specific Functions
    // TODO Needs to be refactored
    function updateTopBottom() {
      getDataForTopBottom();
    }

    function setTopBottomAcctTypeSelection(currentAcctType) {
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        vm.currentTopBottomAcctType = currentAcctType;
        vm.currentTopBottomObj = getCurrentTopBottomObject(currentAcctType);
        var propertyBoundToTable = vm.filtersService.model.accountSelected.accountMarkets;
        getDataForTopBottom(vm.currentTopBottomObj, propertyBoundToTable);
        vm.marketSelectedIndex = vm.currentTopBottomAcctType.value - 1;
        // vm.marketSelectedIndex++;
      }
    }

    function setDefaultDropDownOptions() {
      setDefaultEndingPeriodOptions();
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      vm.filtersService.model.accountSelected.accountMarkets = vm.filtersService.accountFilters.accountMarkets[0];
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      vm.filtersService.model.selected.premiseType = 'all';
      vm.chartOptions = myperformanceService.getChartOptions();
      vm.topBottomData = myperformanceService.initDataForAllTbLevels(vm.topBottomData);
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
    }

    function getCurrentTopBottomObject(acctType) {
      var currentObj;
      var accountTypes = filtersService.accountFilters.accountTypesEnums;
      switch (acctType.value) {
        case accountTypes.distributors:
          currentObj = vm.topBottomData.distributors;
          break;
        case accountTypes.accounts:
          currentObj = vm.topBottomData.accounts;
          break;
        case accountTypes.subAccounts:
          currentObj = vm.topBottomData.subAccounts;
          break;
        case accountTypes.stores:
          currentObj = vm.topBottomData.stores;
          break;
      }
      return currentObj;
    }

    function getDataForTopBottom(topBottomObj, categoryBound) {
      if (!topBottomObj.performanceData || topBottomObj.isPerformanceDataUpdateRequired === true) {
        vm.loadingTopBottom = true;
        var params = filtersService.getAppliedFilters('brandSnapshot');
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params).then(function(data) {
          vm.currentTopBottomObj.performanceData = data.performance;
          vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
          vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
          vm.loadingTopBottom = false;
        });
      } else {
        if (!topBottomObj.timePeriodFilteredData || topBottomObj.isFilterUpdateRequired === true) {
          vm.loadingTopBottom = true;
          vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
          vm.loadingTopBottom = false;
        }
      }
    }

    function getValueBoundForAcctType(measures) {
      if (measures) {
        var propName = vm.filtersService.model.accountSelected.accountMarkets.propertyName;
        var matchedMeasure = measures[propName];
        if (userService.isValidValues(matchedMeasure)) {
          return Math.round(matchedMeasure);
        } else {
          return '-';
        }
      }
    }

    function getCurrentChartData() {
      var currentObj = vm.topBottomData[Object.keys(vm.topBottomData)[vm.marketSelectedIndex]];
      if (currentObj && currentObj.chartData) {
        return currentObj.chartData;
      }
    }

    function  getSortedArrIndex(data) {
      if (data && data.topBottomIndices) {
        var sortCategory = vm.filtersService.model.valuesVsTrend.value;
        var result;
        switch (sortCategory) {
          case filtersService.accountFilters.topBottomSortTypeEnum.topValues:
            result = data.topBottomIndices.topValues;
            vm.currentChartData = data.chartData.topValues;
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.topTrends:
            result = data.topBottomIndices.topTrends;
            vm.currentChartData = data.chartData.topTrends;
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomValues:
            result = data.topBottomIndices.bottomValues;
            vm.currentChartData = data.chartData.bottomValues;
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomTrends:
            result = data.topBottomIndices.bottomTrends;
            vm.currentChartData = data.chartData.bottomTrends;
            break;
        }
        return result;
      }
    }

    function onFilterPropertiesChange(newValues, oldValues) {
      if (vm.topBottomInitData === false) {
        myperformanceService.resetFilterFlags(vm.topBottomData);
        var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
        vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
        getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
      }
    }
  };
