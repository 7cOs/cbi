'use strict';

module.exports = /*  @ngInject */
  function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, $timeout, myperformanceService, chipsService, filtersService, notesService, userService) {

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
    var currentBrandSelected = null;
    var currentBrandSkuSelected = null;
    vm.brandWidgetTitleDefault = 'All Brands';
    vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
    vm.brandWidgetSkuTitle = null;
    vm.currentTopBottomAcctType = null;
    vm.currentTopBottomDataForFilter = null;
    vm.disableAnimation = false;
    vm.disableApply = true;
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
    vm.showXChain = false;
    vm.showXDistributor = false;
    vm.showXStore = false;

    // top bottom public methods
    vm.topBottomData = {
      distributors: null,
      accounts: null,
      subAccounts: null,
      stores: null
    };
    vm.currentTopBottomFilters = {
      distributors: '',
      accounts: '',
      subAccounts: '',
      stores: ''
    };
    vm.isChainSelectionComplete = null;
    vm.isDistributorSelectionComplete = null;
    vm.getDataForTopBottomLevel = getDataForTopBottomLevel;
    vm.navigateTopBottomLevels = navigateTopBottomLevels;
    vm.changeTopBottomSortOrder = changeTopBottomSortOrder;
    vm.currentBoundTopBottomIndexes = [];
    vm.distOptionChanged = distOptionChanged;
    vm.acctMarketChanged = acctMarketChanged;
    vm.depletionOptionChanged = depletionOptionChanged;
    vm.trendOptionChanged = trendOptionChanged;
    vm.checkForStoreLevel = checkForStoreLevel;
    vm.currentChartData = null;
    vm.currentTopBottomObj = null;
    vm.currentTopBottomDataForFilter = null;
    vm.getValueBoundForAcctType = getValueBoundForAcctType;
    vm.setTopBottomAcctTypeSelection = setTopBottomAcctTypeSelection;
    vm.switchToBrandView = switchToBrandView;
    vm.isStoreLevel = false;
    vm.isHighlightStore = isHighlightStore;
    // Have to create this variable because vm.selecteStore just has the name..Changing th binding to include Id involves a ton of work
    var currentStore = null;

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
    vm.removeInlineSearch = removeInlineSearch;
    vm.resetFilters = resetFilters;
    vm.selectItem = selectItem;
    vm.setDefaultFilterOptions = setDefaultFilterOptions;
    vm.setFilter = setFilter;
    vm.updateBrandSnapshot = updateBrandSnapshot;
    vm.updateChip = updateChip;
    vm.updateDistributionTimePeriod = updateDistributionTimePeriod;

    vm.filterTopBottom = filterTopBottom;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function allOpportunitiesDisabled() {
      if ((filtersService.model.selected.premiseType && filtersService.model.selected.premiseType !== 'all') && ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.account && filtersService.model.selected.account.length > 0))) return false;

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
      if ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.account && filtersService.model.selected.account.length > 0)) {
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

    function filterTopBottom() {
      // reset flags
      for (var topBottomObj in vm.topBottomData) {
        myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
      }
      setUpdatedFilters();

      // change tab index
      if (vm.currentTopBottomFilters.stores && vm.currentTopBottomFilters.stores.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
      } else if (vm.currentTopBottomFilters.subAccounts && vm.currentTopBottomFilters.subAccounts.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
      } else if (vm.currentTopBottomFilters.accounts && vm.currentTopBottomFilters.accounts.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[2];
      } else if (vm.currentTopBottomFilters.distributors && vm.currentTopBottomFilters.distributors.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[1];
      } else {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      }

      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      // update data
      updateBrandSnapshot();
      vm.getDataForTopBottomLevel(vm.currentTopBottomObj);
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
    function openNotes(val, accountInfo) {
      if (accountInfo) {
        $rootScope.$broadcast('notes:opened', val, accountInfo);
      }
    }

    // Set variable when select box is open (for bug in scroll binding)
    function openSelect(value) {
      vm.selectOpen = value;
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    // Move to previously indexed tab (only used for brands)
    function switchToBrandView() {
      prevTab();
      onFilterPropertiesChange();
    }

    function prevTab() {
      if (vm.brandSelectedIndex > 0) {
        vm.brandWidgetSkuTitle = null;
        currentBrandSkuSelected = null;
        currentBrandSelected = null;
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
    function removeDistOptionsBasedOnView(accountObj, isBrand) {
      var isOptionHidden = false;
      if (isBrand === true) {
        if (accountObj.value === 1 && vm.brandSelectedIndex === 1) {
          isOptionHidden = true;
        } else if (accountObj.value === 2 && vm.brandSelectedIndex === 0) {
          isOptionHidden = true;
        }
      } else {
        if (accountObj.value === filtersService.accountFilters.accountMarketsEnums.distSimple && vm.brandSelectedIndex === 1) {
          isOptionHidden = true;
          if (vm.filtersService.model.accountSelected.accountMarkets.value === filtersService.accountFilters.accountMarketsEnums.distSimple) {
            var distEffectiveObj = filtersService.accountFilters.accountMarkets.filter(function (market) {
              return market.value === filtersService.accountFilters.accountMarketsEnums.distEffective;
            });
            vm.filtersService.model.accountSelected.accountMarkets = distEffectiveObj[0];
            myperformanceService.resetFilterFlags(vm.topBottomData);
            getDataForTopBottomLevel(vm.currentTopBottomObj);
          }
        } else if (accountObj.value === filtersService.accountFilters.accountMarketsEnums.distEffective && vm.brandSelectedIndex === 0) {
          isOptionHidden = true;
          if (vm.filtersService.model.accountSelected.accountMarkets.value === filtersService.accountFilters.accountMarketsEnums.distEffective) {
            var distSimpleObj = filtersService.accountFilters.accountMarkets.filter(function (market) {
              return market.value === filtersService.accountFilters.accountMarketsEnums.distSimple;
            });
            vm.filtersService.model.accountSelected.accountMarkets = distSimpleObj[0];
            myperformanceService.resetFilterFlags(vm.topBottomData);
            getDataForTopBottomLevel(vm.currentTopBottomObj);
          }
        }
      }
      return isOptionHidden;
    }

    function removeInlineSearch(type) {
      vm[type] = '';

      if (type === 'selectedStore') {
        filtersService.model.selected.account = [];
        filtersService.model.selected.subaccount = [];
        filtersService.model.selected.store = [];

        filtersService.model.account = '';
        filtersService.model.subaccount = '';
        filtersService.model.store = '';

        vm.currentTopBottomFilters.accounts = '';
        vm.currentTopBottomFilters.subAccounts = '';
        vm.currentTopBottomFilters.stores = '';
      } else if (type === 'selectedDistributor') {
        filtersService.model.selected.distributor = [];
        filtersService.model.distributor = '';

        vm.currentTopBottomFilters.distributors = '';
      }

      apply(false);
    }

    function resetFilters() {
      // Remove all filters asssociated with top bottom
      removeAllTopBottomAccountTypeFilters();
      vm.filterModel = angular.copy(filterModelTemplate);
      filtersService.model.filtersValidCount = 0;
      setDefaultDropDownOptions();
      apply(false);
      // Go back to distributor level. Get the updated data for distributors
      resetTopBottom();

      updateBrandSnapshot();
    }

    function removeAllTopBottomAccountTypeFilters() {
      // reset brand
      vm.brandWidgetTitle = angular.copy(vm.brandWidgetTitleDefault);
      vm.brandWidgetSkuTitle = null;
      vm.selected = null;
      vm.previous = null;
      vm.brandSelectedIndex = 0;
      vm.brandIdSelected = null;
      vm.idSelected = null;
      vm.selectedDistributor = null;
      vm.selectedStore = null;

      chipsService.resetChipsFilters(chipsService.model);
      filtersService.model.distributor = '';
      vm.showXDistributor = false;
      filtersService.model.account = '';
      vm.showXChain = false;
      filtersService.model.store = '';
      vm.showXStore = false;
      myperformanceService.resetFilters(vm.currentTopBottomFilters);
      setDefaultFilterOptions();
    }

    /**
     * This function resets all the performance data flags. Set the current account type to distributor level and fetches the data for the distributor level
     */
    function resetTopBottom() {
      // When we reset Im setting the reset data flag on all objects (distirbutor, acct, subacct, store)
      for (var topBottomObj in vm.topBottomData) {
        myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
      }
      // Set current level back to distributors
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];

      // Get the distributors object
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);

      // This function gives me the updated data for whatever level is currently set

      getDataForTopBottomLevel(vm.currentTopBottomObj);
    }

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;

      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        vm.brandWidgetSkuTitle = item.name;
        currentBrandSkuSelected = {
          name: item.name,
          id: item.id
        };
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
      } else {
        vm.brandWidgetSkuTitle = null;
        if (widget === 'brands') { vm.brandWidgetTitle = item.name; }
        vm.loadingBrandSnapshot = true;
        var params = filtersService.getAppliedFilters('brandSnapshot');
        params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
        params.additionalParams = {
          deplTimePeriod: vm.filterModel.depletionsTimePeriod.name,
          podAndVelTimePeriod: vm.filterModel.distributionTimePeriod.name
        };
        currentBrandSelected = {
          name: item.name,
          id: item.id
        };
        params.brand = currentBrandSelected.id;
        vm.brandIdSelected = currentBrandSelected.id;

        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.skus = data.performance;
          nextTab(widget);
          $timeout(function () {
            vm.loadingBrandSnapshot = false;
          }, 500);
        });
      }

      for (var topBottomObj in vm.topBottomData) {
        myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
      }
      setUpdatedFilters();
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      getDataForTopBottomLevel(vm.currentTopBottomObj);
    }

    /**
     * Function gets the 'totals' property from brands web service call or package/sku call
     * @returns Sets the totals object to vm.currentTotalsObject
     */
    function setCurrentTotalsObject() {
      var currentTab = vm.brandSelectedIndex === 0 ? vm.brandTabs.brands : vm.brandTabs.skus;
      if (currentTab.filter) {
        var matchedProperty = currentTab.filter(function (obj) {
          return obj.type === 'Total' || obj.type === 'Totals';
        });
        vm.currentTotalsObject = matchedProperty[0];
      }
    }

    function setDefaultFilterOptions() {
      if (!filtersService.model.selected.myAccountsOnly) {
        disablePremiseType(false);
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
            filtersService.model.selected.premiseType = 'all';
            chipsService.removeChip('premiseType');
            disablePremiseType(false);
            break;
        }
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
      var i = 0;

      // click through result.type is undefined, but on search you need result.type
      var switchStr = filterModelProperty;
      if (result.type) switchStr = result.type;

      // model uses .distributor but this uses .distributors
      var topBottomProp = '',
          filterModelProp = '';
      switch (switchStr) {
        case 'account':
        case 'accounts':
          topBottomProp = 'accounts';
          filterModelProp = 'account';
          break;
        case 'subaccount':
        case 'subAccounts':
          topBottomProp = 'subAccounts';
          filterModelProp = 'subaccount';
          break;
        case 'store':
        case 'stores':
          topBottomProp = 'stores';
          filterModelProp = 'store';
          break;
        default:
          topBottomProp = 'distributors';
          filterModelProp = 'distributor';
          break;
      };

      // set filters service model selected
      if (result.ids) {
        for (i = 0; i < result.ids.length; i++) {
          filtersService.model.selected[filterModelProp].push(result.ids[i]);
        }
      } else {
        if (result.id.constructor === Array) {
          filtersService.model.selected[filterModelProp] = result.id;
        } else {
          // Always send the 9 digit code to the my performance endpoints - versionedId for store, id for everything else
          filtersService.model.selected[filterModelProp] = result.versionedId ? [result.versionedId] : [result.id];
        }
      }

      // set local model
      vm.currentTopBottomFilters[topBottomProp] = {
        id: angular.copy(filtersService.model.selected[filterModelProp]),
        name: result.name
      };
      vm.selectedStoreInfo = vm.currentTopBottomFilters[topBottomProp];
      vm.selectedStoreInfo.type = topBottomProp;
      if (result.name) {
        notesService.model.currentStoreName = result.name.toUpperCase();
        notesService.model.currentStoreProperty = filterModelProp;
      }
      if (filterModelProperty === 'store') {
        filtersService.model.selected.account = [];
        filtersService.model.account = '';
        chipsService.removeChip('chain');
        vm.showXStore = true;
      } else if (filterModelProperty === 'account' || filterModelProperty === 'subaccount') {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
        chipsService.removeChip('store');
        vm.showXChain = true;
      } else if (filterModelProperty === 'distributor') {
        vm.showXDistributor = true;
      }

      for (i = 0; i < chipsService.model.length; i++) {
        if (chipsService.model[i].type === filterModelProp) {
          chipsService.model.splice(i, 1);
          break;
        }
      }
      chipsService.addAutocompleteChip(result.name, filterModelProp, false);
      apply(false);

      filtersService.model[filterModelProperty] = result.name;

      // Update display model
      filterModelProperty === 'distributor' ? vm.selectedDistributor = result.name : vm.selectedStore = result.name;
    }

    function updateBrandSnapshot(isMoveToPreviousTab) {
      filtersService.model.selected.brand = []; // remove brand from query

      var params = filtersService.getAppliedFilters('brandSnapshot');
      params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
      vm.loadingBrandSnapshot = true;
      params.additionalParams = {
        deplTimePeriod: vm.filterModel.depletionsTimePeriod.name,
        podAndVelTimePeriod: vm.filterModel.distributionTimePeriod.name
      };

      if (isMoveToPreviousTab !== false) {
        prevTab();
      }

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
      // deplIndex = 2 is FYTD and FYTM resp
      // distIndex = 1 is L90
      var deplIndex = 2;
      var distIndex = 0;
      if (value === 'year') {
        distIndex = 1;
      }
      vm.filterModel.depletionsTimePeriod = filtersService.model.depletionsTimePeriod[value][deplIndex];
      vm.filterModel.distributionTimePeriod = filtersService.model.distributionTimePeriod[value][distIndex];
      onFilterPropertiesChange();
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

    /**
     * Gets applied filters for top bottom query params
     * @returns {Object} obj Returns the object to be parsed by query builder before any filters
     */
    function getAppliedFiltersForTopBottom() {
      var obj = {};

      obj.timePeriod = filtersService.model.accountSelected.accountMarkets.propertyName === 'depletions' ? vm.filterModel.depletionsTimePeriod.name : vm.filterModel.distributionTimePeriod.name;

      if (filtersService.model.valuesVsTrend.name.split(' ')[0].toLowerCase() === 'top') {
        obj.top = true;
      } else {
        obj.top = false;
      }

      switch (filtersService.model.accountSelected.accountMarkets.propertyName) {
        case 'distributionsSimple':
          obj.metric = 'SPOD';
          break;
        case 'distributionsEffective':
          obj.metric = 'EPOD';
          break;
        case 'velocity':
          obj.metric = 'VEL';
          break;
        default:
          obj.metric = 'DEPL';
          break;
      };

      switch (vm.filterModel.trend.name.split('vs ')[1].toLowerCase()) {
        case 'abp':
          obj.trend = 'PLAN';
          break;
        case 'ya':
          obj.trend = 'YA';
          break;
        default:
          obj.trend = 'NONE';
          break;
      };

      return obj;
    }

    function checkForNavigationFromScorecard() {
      var isNavigatedFromScorecard = false;
      if ($state.params.applyFiltersOnLoad && $state.params.pageData.brandTitle) {
        vm.brandIdSelected = filtersService.model.selected.brand[0];
        vm.brandWidgetTitle = $state.params.pageData.brandTitle;
        chipsService.addAutocompleteChip(vm.brandWidgetTitle, 'brand', false);
        isNavigatedFromScorecard = true;
      }
      if ($state.params.pageData && $state.params.pageData.premiseType) vm.filtersService.model.selected.premiseType = $state.params.pageData.premiseType;
      return isNavigatedFromScorecard;
    }

    function checkForNavigationFromOpps() {
      var isNavigatedFromOpps = false;
      var storeFilter = myperformanceService.parseStoreFilterFromOpps($state.params.store);
      if (storeFilter) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
        vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
        var storeData = {id: storeFilter.storeId, name: storeFilter.storeName};
        vm.currentTopBottomFilters.stores = storeData;
        isNavigatedFromOpps = true;
      }
      return isNavigatedFromOpps;
    }

    function init() {
      setDefaultDropDownOptions();
      setDefaultFilterOptions();
      var isNavigatedFromScorecard = checkForNavigationFromScorecard();
      var isNavigatedFromOpps = checkForNavigationFromOpps();

      if (isNavigatedFromScorecard === false && isNavigatedFromOpps === false) {
        chipsService.resetChipsFilters(chipsService.model);
      }
      var params = filtersService.getAppliedFilters('brandSnapshot');
      params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
      params.additionalParams = getAppliedFiltersForTopBottom();
      var promiseArr = [];
      // brand snapshot returns sku data instead of just the brand if you add brand:xxx
      if (params.brand && params.brand.length) delete params.brand;
      params.additionalParams = {
        deplTimePeriod: vm.filterModel.depletionsTimePeriod.name,
        podAndVelTimePeriod: vm.filterModel.distributionTimePeriod.name
      };
      params.type = 'brandSnapshot';
      promiseArr.push(userService.getPerformanceBrand(params));

      $q.all(promiseArr).then(function(data) {
        if (data[0]) {
          vm.loadingBrandSnapshot = false;
          vm.brandTabs.brands = data[0].performance;
          if (isNavigatedFromScorecard === true) {
             var matchedVal = vm.brandTabs.brands.filter(function(val) {
               return val.name === vm.brandWidgetTitle;
             });
             if (matchedVal[0]) {
               selectItem('brands', matchedVal[0], vm.brandTabs, 0);
             }
          }
          setCurrentTotalsObject();
          if (isNavigatedFromScorecard === false) {
            getDataForTopBottomLevel(vm.currentTopBottomObj);
          }

          if (isNavigatedFromOpps === true) {
            // Directly navigate to store level if navigated from opps
            navigateTopBottomLevels(vm.currentTopBottomFilters.stores);
          }

          // reset state params
          $state.params.applyFiltersOnLoad = false;
          $state.params.resetFiltersOnLoad = true;
        }
      });

      if ($state.params.openNotesOnLoad) {
        $timeout(function() {
          $rootScope.$broadcast('notes:opened', true, $state.params.pageData.account);

          notesService.model.accountId = $state.params.pageData.account.id;
          notesService.accountNotes().then(function(success) {
            vm.notes = success;
            vm.loading = false;
          });
        });
      }
    }

    // Move to next indexed tab
    function nextTab(widget) {
      vm.disableAnimation = false;
      if (widget === 'brands') {
        vm.brandSelectedIndex = vm.brandSelectedIndex + 1;
        setCurrentTotalsObject();
        vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[1];
      }
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

    // Add 'selected' class to item furthest possible drill-down tab level
    function setSelected(idSelected, widget) {
      vm.idSelected = idSelected;
      if (vm.selectedStore) { vm.selectedStore = null; }
      if (widget === 'brands') { vm.brandIdSelected = idSelected; }
    }

    // Top Bottom Specific Functions
    /**
     * Sets the current top bottom acct type (1.Distirrbutor , 2.Accounts, 3.Sub Accounts, 4.Stores)
     * @param {Object} currentAcctType The new account type to be set
     * @returns Sets the data for the currently selected top bottom account type
     */
    function setTopBottomAcctTypeSelection(currentAcctType) {
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        vm.currentTopBottomAcctType = currentAcctType;
        vm.currentTopBottomObj = getCurrentTopBottomObject(currentAcctType);
        onFilterPropertiesChange();
      }
    }

    /**
     * It is called on init and sets the default dropdown options for the entire account dashboard
     * @param {Object} currentAcctType The new account type to be set
     * @returns Sets the data for the currently selected top bottom account type
     */
    function setDefaultDropDownOptions() {
      setDefaultEndingPeriodOptions();
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      vm.filtersService.model.accountSelected.accountMarkets = vm.filtersService.accountFilters.accountMarkets[0];
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      vm.filtersService.model.valuesVsTrend = vm.filtersService.accountFilters.valuesVsTrend[0];
      vm.filtersService.model.selected.premiseType = 'off';
      vm.chartOptions = myperformanceService.getChartOptions();
      vm.topBottomData = myperformanceService.initDataForAllTbLevels(vm.topBottomData);
      vm.marketSelectedIndex = 0;
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
    }

    /**
     * Based on the acct type passed, this function gives the matching topbottom object
     * @param {Object} acctType Can be either a distirbutor, acct, subacct, store object
     * @returns returns either vm.topBottomData.distirbutor, vm.topBottomData.accounts etc
     */
    function getCurrentTopBottomObject(acctType) {
      var currentObj;
      var accountTypes = filtersService.accountFilters.accountTypesEnums;
      switch (acctType.value) {
        case accountTypes.distributors:
          currentObj = vm.topBottomData.distributors;
          currentObj.currentLevelName = 'distributors';
          vm.isStoreLevel = false;
          break;
        case accountTypes.accounts:
          currentObj = vm.topBottomData.accounts;
          vm.isStoreLevel = false;
          currentObj.currentLevelName = 'accounts';
          break;
        case accountTypes.subAccounts:
          currentObj = vm.topBottomData.subAccounts;
          currentObj.currentLevelName = 'subAccounts';
          vm.isStoreLevel = false;
          break;
        case accountTypes.stores:
          currentObj = vm.topBottomData.stores;
          currentObj.currentLevelName = 'stores';
          vm.isStoreLevel = true;
          break;
      }
      return currentObj;
    }

    function stopTopBottomLoadingIcon() {
      $timeout(function() {
        vm.loadingTopBottom = false;
      }, 350);
    }

    function appendBrandParametersForTopBottom(currentParams) {
      if (currentBrandSelected) currentParams.brand = currentBrandSelected.id;
      if (currentBrandSkuSelected) currentParams.masterSKU = currentBrandSkuSelected.id;
    }

    /**
     * Updates the topbottom object passed with the correct data based on whether performance data needs to be updated or the filtered data needs to be updated or if none needs to be updated sets the sort order (top 10 values etc)
     * @param {Object} topBottomObj Can be either topBottomData.distirbutor, topBottomData.account etc
     * @param {Object} categoryBound It is one of the objects from vm.filtersService.accountFilters.accountMarkets
     * @returns Updates the object with the correct data
     */
    function getDataForTopBottomLevel(topBottomObj) {
      var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
      var params = filtersService.getAppliedFilters('topBottom');
      appendBrandParametersForTopBottom(params);
      params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
      vm.loadingTopBottom = true;
      params.additionalParams = getAppliedFiltersForTopBottom();

      userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params).then(function(data) {
        vm.currentTopBottomObj.performanceData = data.performance;
        vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
        vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
        setSortedArrIndex();
      }, function(error) {
        console.log('[getDataForTopBottomLevel]', error);
        vm.loadingTopBottom = 'error';
        vm.currentChartData = myperformanceService.initChartData();
      });
      vm.marketSelectedIndex = vm.currentTopBottomAcctType.value - 1;
    }

    /**
     * Gets the value from the measure that is passed. It can be either Depletions,Dist(simple/effective), velocity
     * @param {Object} measures Can be either topBottomData.distirbutor, topBottomData.account etc
     * @returns Returns the rounded value or if null returns  '-'
     */
    function getValueBoundForAcctType(measures) {
      if (measures && vm.filtersService.model.accountSelected.accountMarkets) {
        var propName = vm.filtersService.model.accountSelected.accountMarkets.propertyName;
        var matchedMeasure = measures[propName];
        if (userService.isValidValues(matchedMeasure)) {
          return $filter('number')(matchedMeasure, 0);
        } else {
          return '-';
        }
      } else {
        return '-';
      }
    }

    /**
     * This function is called if the sort order needs to be changed. The sort orders can be top 10 values/ trend, bottom 10 values/trend
     * @returns Binds the correct sort order to the view
     */
    function  setSortedArrIndex() {
      var data = vm.currentTopBottomObj;
      vm.isChartVisible = true;
      if (data && data.topBottomIndices) {
        var sortCategory = vm.filtersService.model.valuesVsTrend.value;
        var result = null;
        switch (sortCategory) {
          case filtersService.accountFilters.topBottomSortTypeEnum.topValues:
            if (data.topBottomIndices.topValues.length > 0) {
              result = data.topBottomIndices.topValues;
                vm.currentChartData = data.chartData.topValues;
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.topTrends:
            if (data.topBottomIndices.topTrends.length > 0) {
              result = data.topBottomIndices.topTrends;
              vm.currentChartData = data.chartData.topTrends;
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomValues:
            if (data.topBottomIndices.bottomValues.length > 0) {
              result = data.topBottomIndices.bottomValues;
              vm.currentChartData = data.chartData.bottomValues;
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomTrends:
            if (data.topBottomIndices.bottomTrends.length > 0) {
              result = data.topBottomIndices.bottomTrends;
              vm.currentChartData = data.chartData.bottomTrends;
            }
            break;
        }
        if (result !== null) {
          vm.currentBoundTopBottomIndexes =  result;
          stopTopBottomLoadingIcon();
        } else {
          vm.loadingTopBottom = 'error';
          vm.currentBoundTopBottomIndexes = [];
          vm.currentChartData = myperformanceService.initChartData();
        }

      } else {
        stopTopBottomLoadingIcon();
        console.log('Unable to retrieve any ' + vm.currentTopBottomObj.currentLevelName);
      }
    }

    function checkForStoreLevel(trendSelection) {
      var isVisible = true;
      if (vm.isStoreLevel === true) {
        if (trendSelection.showInStoreLevel === false && trendSelection.showInOtherLevels === true) {
          isVisible = false;
          if (vm.filterModel.trend === vm.filtersService.model.trend[1]) {
            vm.filterModel.trend = vm.filtersService.model.trend[2];
          }
        }
      } else {
        if (trendSelection.showInStoreLevel === true && trendSelection.showInOtherLevels === false) {
          isVisible = false;
          if (vm.filterModel.trend === vm.filtersService.model.trend[2]) {
            vm.filterModel.trend = vm.filtersService.model.trend[1];
          }
        }
      }
      return isVisible;
    }

    /**
     * Fires when distirbution time period options change
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function distOptionChanged(selectedVal) {
      if (vm.filterModel.distributionTimePeriod !== selectedVal) {
        vm.filterModel.distributionTimePeriod = selectedVal;
        onFilterPropertiesChange();
      }
    }

    /**
     * Fires when depletion time period options change
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function depletionOptionChanged(selectedVal) {
      if (vm.filterModel.depletionsTimePeriod !== selectedVal) {
        vm.filterModel.depletionsTimePeriod = selectedVal;
        onFilterPropertiesChange();
      }
    }

    /**
     * Fires when trend options change
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function trendOptionChanged(selectedVal) {
      if (vm.filterModel.trend !== selectedVal) {
        vm.filterModel.trend = selectedVal;
        onFilterPropertiesChange(false);
      }
    }

    /**
     * Fires when vategory bound changes (Can be depletions, distirbution(simple), distirbution(effective), Velocity)
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function acctMarketChanged(selectedVal) {
      if (vm.filtersService.model.accountSelected.accountMarkets !== selectedVal) {
        vm.filtersService.model.accountSelected.accountMarkets = selectedVal;
        onFilterPropertiesChange();
      }
    }

    /**
     * Fires when top bottom sort order changes
     * @param {Object} selectedVal Current top bottom sort order (top10 values/trends etc)
     * @returns Sets the current sort order indices
     */
    function changeTopBottomSortOrder(selectedVal) {
      if (vm.filtersService.model.valuesVsTrend !== selectedVal) {
        vm.loadingTopBottom = true;
        vm.filtersService.model.valuesVsTrend = selectedVal;
        onFilterPropertiesChange(false);
      }
    }

    /**
     * Updates vm.currentTopBottomFilters object
     * @param {Object} currentLevelName The level to be updated.. Can be ditrstibutors, acct etc
     * @param {Object} data The filter selected. It's of the format {id:xxx, name: 'sdfsdf'}
     */
    function setTopBottomFilterModel(currentLevelName, data) {
      vm.currentTopBottomFilters[currentLevelName] = {
        id: data.id,
        name: data.name
      };
      // The term 'vm.filtersService.model.account' needs to be refactored. This variable for is used to hold the text for all types except distributor
      if (currentLevelName === 'distributors') {
        vm.filtersService.model.distributor = data.name;
      } else {
        vm.filtersService.model.account = data.name;
      }
    }

    /**
     * On clicking a store in top bottom, it highlights the store
     */
    function isHighlightStore(storeDetails) {
      if (storeDetails && storeDetails.id && vm.isStoreLevel && currentStore) {
        return storeDetails.id === currentStore.id;
      }
    }

    /**
     * Navigates to the level after the current. If distributor ---> Acct, Acct--->SubAcct, SubAcct-->Store, Store click just highlight the store
     * @param {String} currentLevelName Indicates the text indicator of the level. 'distributor', 'account', 'subaccount','store'
     * @param {Object} performanceData get the data associated with the clicked object
     */
    function navigateTopBottomLevels(performanceData) {
      // console.log('Perf data', performanceData);
      if (performanceData) {
        var currentLevelName = getCurrentTopBottomObject(vm.currentTopBottomAcctType).currentLevelName;
        var getNextLevel = currentLevelName !== 'stores';
        if (myperformanceService.checkForInconsistentIds(performanceData)) {
          return;
        }
        if (performanceData.name.toLowerCase() === 'independent' && !vm.currentTopBottomFilters.distributors) {
          return;
        }

        // Updates the top bottom filter object with the selection
        setTopBottomFilterModel(currentLevelName, performanceData);
        // Make sure all the models in filtersService are set correctly and reflect the object in top botom filter
        setUpdatedFilters();
        // Set the chain dropdown and appropriate placeholder text
        setChainDropdownAndPlaceHolder(currentLevelName, performanceData);
        if (getNextLevel) {
          myperformanceService.resetFiltersForLevelsAboveCurrent(vm.currentTopBottomAcctType, vm.currentTopBottomFilters, vm.topBottomData);
          // Get the top bottom level next to the current level.
          vm.currentTopBottomAcctType = myperformanceService.getAcctTypeObjectBasedOnTabIndex(vm.currentTopBottomAcctType.value, getNextLevel);
          vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);

          updateBrandSnapshot();
          getDataForTopBottomLevel(vm.currentTopBottomObj);
        } else {
          // Just setting current top bottom object to store
          vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
          updateBrandSnapshot();
        }
        notesService.model.tdlinx = performanceData.unversionedStoreCode;
        notesService.model.address = formatAddress(performanceData);
        notesService.model.city = performanceData.city;
        notesService.model.state = performanceData.state;
        notesService.model.zipCode = performanceData.zipCode;
      }
    }

    function formatAddress(performanceData) {
      var address,
          d = performanceData;

      function ifIsKnown(field) {
        return (field && field !== 'UNKNOWN' && field !== null) ? field + ' ' : '';
      }

      address = ifIsKnown(d.addressLine1) + ifIsKnown(d.addressLine2) + ifIsKnown(d.addressLine3) + ifIsKnown(d.addressLine4);

      return address;
    }

    function setUpdatedFilters() {
      filtersService.model.filtersValidCount++;
      // The order to be processed is distributor, stores, subaccounts, accounts. So that the last value doesn't get overridden
      if (vm.currentTopBottomFilters.distributors) {
        setFilter(vm.currentTopBottomFilters.distributors, 'distributor');
      }
      if (vm.currentTopBottomFilters.stores) {
        setFilter(vm.currentTopBottomFilters.stores, 'store');
      } else if (vm.currentTopBottomFilters.subAccounts) {
        setFilter(vm.currentTopBottomFilters.subAccounts, 'subaccount');
      } else if (vm.currentTopBottomFilters.accounts) {
        setFilter(vm.currentTopBottomFilters.accounts, 'account');
      }
    }

    function setChainDropdownAndPlaceHolder(currentLevelName, performanceData) {
      if (currentLevelName === 'stores') {
        // Set it to Store
        vm.filtersService.model.selected.retailer = 'Store';
        placeholderSelect(filtersService.model.retailer[0].hintText);
        currentStore = {
          id: performanceData.id,
          name: performanceData.name
        };
      } else {
        currentStore = null;
        if (vm.filtersService.model.selected.retailer !== 'Chain') {
          vm.filtersService.model.selected.retailer = 'Chain';
          placeholderSelect(filtersService.model.retailer[1].hintText);
        }
      }
    }

    function onFilterPropertiesChange(isBrandSnapshotUpdateRequired) {
      // With the new api endpoints the performance flags need to be reset on filter change
      for (var topBottomObj in vm.topBottomData) {
        myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
      }

      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      if (isBrandSnapshotUpdateRequired !== false) {
        updateBrandSnapshot();
      }
      getDataForTopBottomLevel(vm.currentTopBottomObj);
    }

    // Check if market overview is scrolled out of view
      function setOverviewDisplay(value) {
        vm.overviewOpen = value;
        $scope.$apply();
     }

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
