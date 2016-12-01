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

    vm.topBottomData = {
      distributors: null,
      accounts: null,
      subAccounts: null,
      stores: null
    };

    // Set selected tabs
    vm.selected = null;
    vm.previous = null;
    vm.brandSelectedIndex = 0;
    vm.marketSelectedIndex = 0;
    vm.topBottomLevelIndex = 0;

    // top bottom public methods
    vm.currentTopBottomAcctType = null;
    vm.currentTopBottomDataForFilter = null;
    vm.getValueBoundForAcctType = getValueBoundForAcctType;
    vm.filterByTopBottomSortCategory = filterByTopBottomSortCategory;

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
<<<<<<< 94cada375e7fa30277288dc6fef3100438b96710
<<<<<<< 9a6a8700b7307a49aae3a967d8b06f758f4f38fe
    vm.loadingTopBottom = true;
    vm.marketStoresView = false;
    vm.marketIdSelected = false;
    vm.overviewOpen = false;
    vm.selectedStore = null;
    vm.selectOpen = false;
=======
    vm.currentTopBottomAcctType = null;
    vm.currentTopBottomDataForFilter = null;
    vm.getValueBoundForAcctType = getValueBoundForAcctType;
>>>>>>> depletions hooked up
=======
>>>>>>> Chart data hookup needs to be done

    // Chart Setup
    vm.chartOptions = null;
    // Expose public methods
    vm.allOpportunitiesDisabled = allOpportunitiesDisabled;
    vm.apply = apply;
    vm.checkForDepletionCount = checkForDepletionCount;
    vm.checkIfVelocityPresent = checkIfVelocityPresent;
    vm.currentTopBottomView = null;
    vm.currentTotalsObject = null;
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
    vm.setFilter = setFilter;
<<<<<<< 4a5d4d4da89a24dfa9d94607844beea21498e972
    vm.setMarketTab = setMarketTab;
    vm.setTopBottomAcctTypeSelection = setTopBottomAcctTypeSelection;
=======
>>>>>>> Initial bindings to chart completed
    vm.updateBrandSnapshot = updateBrandSnapshot;
    vm.updateChip = updateChip;
    vm.updateDistributionTimePeriod = updateDistributionTimePeriod;
<<<<<<< d0b36292b6a345ca2ebbb4b436814c97deaf1ebf
    vm.updateTopBottom = updateTopBottom;
=======
    vm.getTrendValues = getTrendValues;
    vm.isPackageView = false;
    vm.checkIfVelocityPresent = checkIfVelocityPresent;
    vm.currentTotalsObject = null;
    vm.checkForDepletionCount = checkForDepletionCount;
    vm.updateChip = updateChip;
    vm.setTopBottomAcctTypeSelection = setTopBottomAcctTypeSelection;
<<<<<<< 4a5d4d4da89a24dfa9d94607844beea21498e972
>>>>>>> Another stable commit
=======
    vm.getCurrentChartData = getCurrentChartData;
>>>>>>> Initial bindings to chart completed

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
<<<<<<< 4a5d4d4da89a24dfa9d94607844beea21498e972

      if (widget === 'markets') { getActiveTab(); }
=======
>>>>>>> Initial bindings to chart completed
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

<<<<<<< 4a5d4d4da89a24dfa9d94607844beea21498e972
    function setTopBottomAcctTypeSelection(currentAcctType) {
      var params = filtersService.getAppliedFilters();
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        userService.getTopBottomSnapshot(currentAcctType, params).then(function(data) {
          vm.currentTopBottomView = userService.getCurrentTopBottomView(data);
        });
      }
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

=======
>>>>>>> Initial bindings to chart completed
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

<<<<<<< d0b36292b6a345ca2ebbb4b436814c97deaf1ebf
    function updateTopBottom() {
      var params = filtersService.getAppliedFilters('brandSnapshot');
      vm.loadingTopBottom = true;
      userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params).then(function(data) {
        // update model
        vm.loadingTopBottom = false;
      });
=======
    function setTopBottomAcctTypeSelection(currentAcctType) {
      var params = filtersService.getAppliedFilters();
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        userService.getTopBottomSnapshot(currentAcctType, params).then(function(data) {
          vm.currentTopBottomView = userService.getCurrentTopBottomView(data);
        });
      }
>>>>>>> Another stable commit
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

<<<<<<< 4a5d4d4da89a24dfa9d94607844beea21498e972
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

<<<<<<< 6606e2289235f174218890caff6c1ae9e3508aee
=======
=======
>>>>>>> Initial bindings to chart completed
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

    function setDefaultDropDownOptions() {
      setDefaultEndingPeriodOptions();
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      vm.filtersService.model.accountSelected.accountMarkets = vm.filtersService.accountFilters.accountMarkets[0];
      vm.filtersService.model.selected.valuesVsTrend =  vm.filtersService.accountFilters.valuesVsTrend[1];
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      vm.filtersService.model.selected.premiseType = 'all';
      vm.chartOptions = myperformanceService.getChartOptions();
    }

    function init() {
      // reset all chips and filters on page init
      chipsService.resetChipsFilters(chipsService.model);
      var params = filtersService.getAppliedFilters('brandSnapshot');
      setDefaultDropDownOptions();
      var promiseArr = [
        userService.getPerformanceSummary(),
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getPerformanceBrand(params),
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params)
      ];

      $q.all(promiseArr).then(function(data) {
        userService.model.summary = data[0];
        userService.model.depletion = data[1];
        userService.model.distribution = data[2];
        vm.brandTabs.brands = data[3].performance;
        setCurrentTotalsObject();
        if (data[4]) {
          setTopBottomInitData(data[4].performance);
        }
        vm.loadingBrandSnapshot = false;
      });
    }

>>>>>>> Primary commits for top bottom
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
      // reset all chips and filters on page init
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      vm.filtersService.model.accountSelected.accountMarkets = vm.filtersService.accountFilters.accountMarkets[0];
      chipsService.resetChipsFilters(chipsService.model);
      setDefaultEndingPeriodOptions();
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      vm.filtersService.model.selected.premiseType = 'all';
      var params = filtersService.getAppliedFilters('brandSnapshot');

      var promiseArr = [
        userService.getPerformanceSummary(),
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getPerformanceBrand(params),
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params)
      ];

      $q.all(promiseArr).then(function(data) {
        userService.model.summary = data[0];
        userService.model.depletion = data[1];
        userService.model.distribution = data[2];
        vm.brandTabs.brands = data[3].performance;
        setCurrentTotalsObject();
        // vm.currentTopBottomDataForFilter = userService.getFilteredTopBottomData(data[4].performance);
        vm.loadingBrandSnapshot = false;
        vm.loadingTopBottom = false;
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

    // Handle required formatting for chart data
    function setChartData(data) {
      vm.chartData = [{'values': data}];
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
    function setTopBottomInitData(performanceData) {
      var topBottomIndices, filteredByTimePeriodData, chartData;
      filteredByTimePeriodData = myperformanceService.getFilteredTopBottomData(performanceData, vm.filtersService.model.accountSelected.accountMarkets, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);

      if (filteredByTimePeriodData) {
        topBottomIndices = myperformanceService.getTopBottomDataSorted(filteredByTimePeriodData, vm.filterModel.trend, vm.filtersService.model.accountSelected.accountMarkets);
        chartData = myperformanceService.getChartData(filteredByTimePeriodData, vm.filterModel.trend, vm.filtersService.model.accountSelected.accountMarkets);
        setDataForCorrespondingTopDownLevel(performanceData, filteredByTimePeriodData, topBottomIndices, chartData);
      }
    }

    function setDataForCorrespondingTopDownLevel(performanceData, filteredByTimePeriodData, topBottomIndices, chartData) {
      var accountTypes = filtersService.accountFilters.accountTypesEnums;
      var updatedObjectForLevel = {
        performanceData: performanceData,
        timePeriodFilteredData: filteredByTimePeriodData,
        topBottomIndices: topBottomIndices,
        chartData: chartData,
        isPerformanceDataChanged: false,
        isFilterCategoryChanged: false
      };
      switch (vm.currentTopBottomAcctType.value) {
        case accountTypes.distributors:
          vm.topBottomData.distributors = updatedObjectForLevel;
          console.log('Top Bottom Distirbutors', vm.topBottomData.distributors);
          break;
        case accountTypes.accounts:
          vm.topBottomData.accounts = updatedObjectForLevel;
          console.log('Top Bottom Accts', vm.topBottomData.accounts);
          break;
        case accountTypes.subAccounts:
          vm.topBottomData.subAccounts = updatedObjectForLevel;
          console.log('Top Bottom SubAccts', vm.topBottomData.subAccounts);
          break;
        case accountTypes.stores:
          vm.topBottomData.stores = updatedObjectForLevel;
          console.log('Top Bottom Stores', vm.topBottomData.stores);
          break;
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

    function filterByTopBottomSortCategory(currentIndex, topBottomIndices) {
      var sortCategory = vm.filtersService.model.selected.valuesVsTrend.value;
      var result = false;
      switch (sortCategory) {
        case filtersService.accountFilters.topBottomSortTypeEnum.topValues:
          result = topBottomIndices.topValues.indexOf(currentIndex) !== -1;
          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.topTrends:
          result = topBottomIndices.topTrends.indexOf(currentIndex) !== -1;
          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.bottomValues:
          result = topBottomIndices.bottomValues.indexOf(currentIndex) !== -1;
          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.bottomTrends:
          result = topBottomIndices.bottomTrends.indexOf(currentIndex) !== -1;
          break;
      }
      return result;
    }
  };
