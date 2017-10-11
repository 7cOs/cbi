'use strict';

module.exports = /*  @ngInject */
function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, $timeout, analyticsService, myperformanceService, chipsService, filtersService, notesService, userService, storesService, dateRangeService, moment) {

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
    vm.currentBrandSkuSelected = null;
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
    vm.loadingUnsoldStore = false;
    vm.marketStoresView = false;
    vm.marketIdSelected = false;
    vm.overviewOpen = false;
    vm.premiseTypeDisabled = false;
    vm.selectedStore = null;
    vm.selectOpen = false;
    vm.showXChain = false;
    vm.showXDistributor = false;
    vm.showXStore = false;
    vm._topPerformersThreshold = 2;
    vm.prevTopBottomObj = {};
    vm.topBottomHistory = {};
    vm.canNavPrevLevel = false;
    vm.currentUserName = null;
    vm._defaultTopLevelForLabel = 'CBBD';
    vm.topLevelForLabel = vm._defaultTopLevelForLabel;
    vm.premiseTypeValue = 'all';
    vm.depletionSelectOpen = false;
    vm.distributionSelectOpen = false;
    vm.dateRanges = {};

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
    vm.accountTypeValues = filtersService.accountFilters.accountTypeValues;
    vm.isChainSelectionComplete = null;
    vm.isDistributorSelectionComplete = null;
    vm.getDataForTopBottomLevel = getDataForTopBottomLevel;
    vm.navigateTopBottomLevels = navigateTopBottomLevels;
    vm.navPrevLevelInTopBottom = navPrevLevelInTopBottom;
    vm.changeTopBottomSortOrder = changeTopBottomSortOrder;
    vm.currentBoundTopBottomIndexes = [];
    vm.distOptionChanged = distOptionChanged;
    vm.acctMarketChanged = acctMarketChanged;
    vm.depletionOptionChanged = depletionOptionChanged;
    vm.trendOptionChanged = trendOptionChanged;
    vm.currentChartData = null;
    vm.currentTopBottomObj = null;
    vm.currentTopBottomDataForFilter = null;
    vm.getValueBoundForAcctType = getValueBoundForAcctType;
    vm.setTopBottomAcctTypeSelection = setTopBottomAcctTypeSelection;
    vm.switchToBrandView = switchToBrandView;
    vm.changeBrandSnapshotCategory = changeBrandSnapshotCategory;
    vm.isDisplayBrandSnapshotRow = isDisplayBrandSnapshotRow;
    vm.isStoreLevel = false;
    vm.isHighlightStore = isHighlightStore;
    vm.getStoreAddress = getStoreAddress;
    // Have to create this variable because vm.selecteStore just has the name..Changing th binding to include Id involves a ton of work
    let currentStore = null;
    let dateRangeSubscription = null;

    // Expose public methods
    vm.allOpportunitiesDisabled = allOpportunitiesDisabled;
    vm.disableApplyFilter = disableApplyFilter;
    vm.checkForDepOrDistValue = checkForDepOrDistValue;
    vm.checkIfVelocityPresent = checkIfVelocityPresent;
    vm.currentTopBottomView = null;
    vm.currentTotalsObject = null;
    vm.disablePremiseType = disablePremiseType;
    vm.disableStoreType = disableStoreType;
    vm.displayBrandValue = displayBrandValue;
    vm.displayBrandValueAccountBrandVelocity = displayBrandValueAccountBrandVelocity;
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
    vm.setUserSpecificModels = setUserSpecificModels;
    vm.setFilter = setFilter;
    vm.updateBrandSnapshot = updateBrandSnapshot;
    vm.updateChip = updateChip;
    vm.updateDistributionTimePeriod = updateDistributionTimePeriod;
    vm.filterTopBottom = filterTopBottom;
    vm.canOpenNote = canOpenNote;
    vm.getAccountTypePerformanceData = getAccountTypePerformanceData;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    /**
     * Returns if brand snapshot row needs to be displayed or not. If it's not the same distribution category as current the row should not be displayed
     * @param {String} distributionCategory - DistSimple or distEffective
     * @returns {Booelan}
     */
    function isDisplayBrandSnapshotRow(distributionCategory, isBlankColumn, isPremiseCheckRequired) {
      if (vm.filtersService.model.accountSelected.accountBrands.value === distributionCategory) {
        if (isPremiseCheckRequired === false) {
          return true;
        } else {
          return vm.filtersService.model.selected.premiseType !== 'all';
        }
      } else {
        return isBlankColumn && isBlankColumn === true;
      }
    }

    function allOpportunitiesDisabled() {
      if ((filtersService.model.selected.premiseType && filtersService.model.selected.premiseType !== 'all') && ((filtersService.model.selected.distributor && filtersService.model.selected.distributor.length > 0) || (filtersService.model.selected.store && filtersService.model.selected.store.length > 0) || (filtersService.model.selected.account && filtersService.model.selected.account.length > 0))) return false;
      return true;
    }

    function disableApplyFilter(bool) {
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
        if (vm.filtersService.model.cbbdChainIndependent === true) {
          vm.chipsService.applyFilterArr(vm.filtersService.model.selected.cbbdChain, 'Independent', 'cbbdChain');
          vm.filtersService.model.cbbdChainIndependent = false;
        }

        if (vm.filtersService.model.cbbdChainCbbd === true) {
          vm.chipsService.applyFilterArr(vm.filtersService.model.selected.cbbdChain, 'Cbbd', 'cbbdChain', 'CBBD Chain');
          vm.filtersService.model.cbbdChainCbbd = false;
        }
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
        const matchedMeasure = getMatchedMeasure(brandMeasures, timePeriod);
        if (matchedMeasure) {
          return matchedMeasure[property];
        }
      }
    }

    /**
     * Returns the measure for the given time period
     * @param {Array} brandMeasures - array of measures for a brand
     * @param {String} timePeriod - the time period
     * @returns {Object} The measures found or undefined
     */
    function getMatchedMeasure(brandMeasures, timePeriod) {
      return brandMeasures.find((currentMeasure) => {
         return vm.filterModel[timePeriod]
           ? currentMeasure.timeframe === vm.filterModel[timePeriod].name
           : false;
      });
    }

    /**
     * Returns the brand mesure for velicity or N/A if the first depletion
     * date is before the start date of the distribution time period
     * @param {Array} brandMeasures - array of measures for a brand
     * @param {String} firstDepletion - the depletion date for the given measures (YYYY-MM-DD)
     * @returns {String} velocity
     */
    function displayBrandValueAccountBrandVelocity(brandMeasures, firstDepletion) {
      if (brandMeasures) {
        const matchedMeasure = getMatchedMeasure(brandMeasures, 'distributionTimePeriod');
        if (matchedMeasure && firstDepletion) {
          return isNonApplicableMeasure(firstDepletion)
            ? 'N/A'
            : $filter('number')(matchedMeasure['velocity'], 0);
        }
      }
    }

    /**
     * Checks if the given first depletion date given is applicable for a velocity measure
     * @param {String} firstDepletionDateRaw - the depletion date for the given measures (YYYY-MM-DD)
     * @returns {Boolean} true if it's applicable, false otherwise
     */
    function isNonApplicableMeasure(firstDepletionDateRaw) {
      const firstDepletionDate = moment(firstDepletionDateRaw, 'YYYY-MM-DD');
      const firstDayTimePeriodDateRaw = vm.dateRanges[vm.filterModel.distributionTimePeriod.v3ApiCode].range.split(' - ')[0];
      const firstDayTimePeriodDate = moment(firstDayTimePeriodDateRaw, 'MM/DD/YY');
      return firstDayTimePeriodDate.isBefore(firstDepletionDate);
    }

    function filterTopBottom() {
      setTopLevelForLabel();
      resetTopBottomHistory();
      try {
        vm.selectedEntityName = vm.selectedStoreInfo.name;
      } catch (e) {
        vm.selectedEntityName = null;
      }
      var previousTopBottomAcctType = vm.currentTopBottomAcctType;

      // reset flags
      for (var topBottomObj in vm.topBottomData) {
        myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
      }
      setUpdatedFilters();

      // change tab index
      if (vm.currentTopBottomFilters.stores && vm.currentTopBottomFilters.stores.id) {
        // if (!currentStore || currentStore.idForOppsPage !== vm.currentTopBottomFilters.stores.id[0]) {
        currentStore = {
          id: vm.currentTopBottomFilters.stores.id,
          name: vm.currentTopBottomFilters.stores.name,
          idForOppsPage: vm.currentTopBottomFilters.stores.id[1]
        };
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

      if (previousTopBottomAcctType.value !== vm.currentTopBottomAcctType.value) {
        sendTopBottomAnalyticsEvent();
      }

      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      // update data
      updateBrandSnapshot(true);
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
        if (vm.currentTopBottomFilters.stores) {
          if (currentStore.idForOppsPage) {
            vm.filtersService.model.selected.store = currentStore.idForOppsPage;
          }
          vm.filtersService.model.selected.account = '';
          chipsService.removeChip('account');
          vm.filtersService.model.selected.subaccount = '';
          chipsService.removeChip('subaccount');
        } else if (vm.currentTopBottomFilters.subAccounts) {
          vm.filtersService.model.selected.account = '';
          chipsService.removeChip('account');
        }
        $state.go('opportunities', {
          resetFiltersOnLoad: false,
          applyFiltersOnLoad: true,
          referrer: 'accounts'
        });
      } else {
        e.preventDefault();
      }
      sendAllOpportunityAnalyticsEvent();
    }

    // Make notes available to the page
    function openNotes(val, accountInfo) {
      if (accountInfo && canOpenNote()) {
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

    function changeBrandSnapshotCategory(currentCategory) {
      vm.filtersService.model.accountSelected.accountBrands = currentCategory;
      updateBrandSnapshot();
    }

    function prevTab() {
      if (vm.brandSelectedIndex > 0) {
        vm.brandWidgetSkuTitle = null;
        vm.currentBrandSkuSelected = null;
        currentBrandSelected = null;
        vm.brandSelectedIndex = vm.brandSelectedIndex - 1;
        setCurrentTotalsObject();
        vm.brandWidgetTitle = angular.copy(vm.brandWidgetTitleDefault);
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
            sendTopBottomAnalyticsEvent();
            getDataForTopBottomLevel(vm.currentTopBottomObj);
          }
        } else if (accountObj.value === filtersService.accountFilters.accountMarketsEnums.distEffective && vm.brandSelectedIndex === 0) {
          isOptionHidden = true;
          if (vm.filtersService.model.accountSelected.accountMarkets.value === filtersService.accountFilters.accountMarketsEnums.distEffective) {
            var distSimpleObj = filtersService.accountFilters.accountMarkets.filter(function (market) {
              return market.value === filtersService.accountFilters.accountMarketsEnums.distSimple;
            });
            vm.filtersService.model.accountSelected.accountMarkets = distSimpleObj[0];
            sendTopBottomAnalyticsEvent();
            getDataForTopBottomLevel(vm.currentTopBottomObj);
          }
        }
      }
      return isOptionHidden;
    }

    function removeInlineSearch(type) {
      vm[type] = '';

      if (type === 'selectedStore') {
        clearAccountModels();
        clearSubAccountModels();
        clearStoreModels();
      } else if (type === 'selectedSubAccount') {
        clearSubAccountModels();
        clearStoreModels();
      } else if (type === 'selectedDistributor') {
        clearDistributorModels();
      }

      disableApplyFilter(false);

      function clearStoreModels() {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
        vm.currentTopBottomFilters.stores = '';
        chipsService.removeChip('store');
      }

      function clearSubAccountModels() {
        filtersService.model.selected.subaccount = [];
        filtersService.model.subaccount = '';
        vm.currentTopBottomFilters.subAccounts = '';
        chipsService.removeChip('subaccount');
      }

      function clearAccountModels() {
        filtersService.model.selected.account = [];
        filtersService.model.account = '';
        vm.currentTopBottomFilters.accounts = '';
        chipsService.removeChip('account');
      }

      function clearDistributorModels() {
        filtersService.model.selected.distributor = [];
        filtersService.model.distributor = '';
        chipsService.removeChip('distributor');
        vm.currentTopBottomFilters.distributors = '';
      }
    }

    function resetFilters() {
      // Remove all filters asssociated with top bottom
      setTopLevelForLabel();
      resetTopBottomHistory();
      removeAllTopBottomAccountTypeFilters();
      chipsService.resetChipsFilters(chipsService.model);
      vm.filterModel = angular.copy(filterModelTemplate);
      filtersService.model.filtersValidCount = 0;
      initDefaultModelValues();
      setUserSpecificModels();
      disableApplyFilter(false);
      // Go back to distributor level. Get the updated data for distributors
      resetTopBottom();
      updateBrandSnapshot();
    }

    function removeAllTopBottomAccountTypeFilters(levelToResetBeyond) {
      levelToResetBeyond = levelToResetBeyond || {value: -1}; // default to no level limit

      // reset brand
      vm.brandWidgetTitle = angular.copy(vm.brandWidgetTitleDefault);
      vm.brandWidgetSkuTitle = null;
      vm.selected = null;
      vm.previous = null;
      vm.brandSelectedIndex = 0;
      currentBrandSelected = null;
      vm.currentBrandSkuSelected = null;
      vm.brandIdSelected = null;
      vm.idSelected = null;

      switch (levelToResetBeyond.value) {
        case filtersService.accountFilters.accountTypesEnums.distributors:
          filtersService.model.account = '';
          vm.showXChain = false;
          vm.selectedStore = null;
          filtersService.model.store = '';
          vm.showXStore = false;
          break;
        case filtersService.accountFilters.accountTypesEnums.accounts:
          // when resetting beyond accounts level, set the selected store to the account name
          // so that the header & top-bottom table header labels are correctly aligned with the account filter
          vm.selectedStore = vm.currentTopBottomFilters.accounts.name;
          filtersService.model.store = '';
          vm.showXStore = false;
          break;
        default:
          vm.selectedDistributor = null;
          vm.selectedStore = null;
          filtersService.model.distributor = '';
          vm.showXDistributor = false;
          filtersService.model.account = '';
          vm.showXChain = false;
          filtersService.model.store = '';
          vm.showXStore = false;
          break;
      }

      chipsService.removeTopBottomChips(levelToResetBeyond);
      if (levelToResetBeyond && levelToResetBeyond.value >= 0) {
        myperformanceService.resetFiltersForLevelsAboveCurrent(levelToResetBeyond, vm.currentTopBottomFilters, vm.topBottomData);
      } else {
        myperformanceService.resetFilters(vm.currentTopBottomFilters);
      }
      currentStore = null;
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
        vm.currentBrandSkuSelected = {
          name: item.name,
          id: item.id
        };
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
      } else {
        vm.brandWidgetSkuTitle = null;
        vm.brandWidgetTitle = item.name;
        vm.loadingBrandSnapshot = true;
        vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[1];
        currentBrandSelected = {
          name: item.name,
          id: item.id
        };
        vm.brandSelectedIndex = vm.brandSelectedIndex + 1;
        var params = getUpdatedFilterQueryParamsForBrand();
        vm.brandIdSelected = currentBrandSelected.id;
        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.skus = data.performance;
          setCurrentTotalsObject();
          $timeout(function () {
            vm.loadingBrandSnapshot = false;
          }, 500);
        });
      }

      sendBrandSnapshotAnalyticsEvent();

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

    function setUserSpecificModels() {
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
            vm.premiseTypeValue = 'all';
            filtersService.model.selected.premiseType = 'all';
            chipsService.removeChip('premiseType');
            disablePremiseType(false);
            break;
        }
      }

      function onPremise() {
        vm.premiseTypeValue = 'on';
        filtersService.model.selected.premiseType = 'on';
        vm.updateChip('On-Premise', 'premiseType');
        disablePremiseType(true);
      }
      function offPremise() {
        vm.premiseTypeValue = 'off';
        filtersService.model.selected.premiseType = 'off';
        vm.updateChip('Off-Premise', 'premiseType');
        disablePremiseType(true);
      }
    }

    function setFilter(result, filterModelProperty) {
      console.log(result, filterModelProperty);
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
          removeInlineSearch('selectedStore');
          break;
        case 'subaccount':
        case 'subAccounts':
          topBottomProp = 'subAccounts';
          filterModelProp = 'subaccount';
          removeInlineSearch('selectedSubAccount');
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
        filtersService.model.selected[filterModelProp] = result.ids;
      } else {
        if (result.id.constructor === Array) {
          filtersService.model.selected[filterModelProp] = result.id;
        } else {
          // Always send the 9 digit code to the my performance endpoints - versionedId for store and a normal id, id for everything else
          filtersService.model.selected[filterModelProp] = result.versionedId ? [result.versionedId, result.id] : [result.id];
        }
      }

      vm.currentTopBottomFilters[topBottomProp] = {
        id: angular.copy(filtersService.model.selected[filterModelProp]),
        name: result.name,
        address: result.address,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode
      };
      notesService.model.address = result.address;
      notesService.model.city = result.city;
      notesService.model.state = result.state;
      notesService.model.zipCode = result.zipCode;

      vm.selectedStoreInfo = vm.currentTopBottomFilters[topBottomProp];
      vm.selectedStoreInfo.type = topBottomProp;
      if (result.name) {
        notesService.model.currentStoreName = result.name.toUpperCase();
        notesService.model.currentStoreProperty = filterModelProp;
      }
      if (filterModelProperty === 'store') {
        vm.currentTopBottomFilters.stores.storeNumber = result.storeNumber;
        filtersService.model.selected.account = [];
        filtersService.model.account = '';
        chipsService.removeChip('chain');
        vm.showXStore = true;
        if (result.id && result.id.constructor === Array) {
          notesService.model.tdlinx = result.id.length > 1 ? result.id[1] : result.id[0];
        } else {
          notesService.model.tdlinx = result.id;
        }
      } else if (filterModelProperty === 'account' || filterModelProperty === 'subaccount') {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
        chipsService.removeChip('store');
        vm.showXChain = true;
        notesService.model.accountId = result.ids && result.ids.length > 0 ? result.ids[0] : result.id;
        notesService.model.tdlinx = undefined;
      } else if (filterModelProperty === 'distributor') {
        vm.showXDistributor = true;
        notesService.model.accountId = result.id;
        notesService.model.tdlinx = undefined;
      }

      chipsService.removeChip(filterModelProp);

      if (filterModelProperty === 'store') {
        chipsService.addAutocompleteChip(result.name + (result.address ? ' - ' + result.address.split(',')[0] : ''), filterModelProp, false);
      } else {
        chipsService.addAutocompleteChip(result.name, filterModelProp, false);
      }
      disableApplyFilter(false);

      filtersService.model[filterModelProperty] = result.name;

      // Update display model
      if (filterModelProperty === 'distributor') {
        vm.selectedDistributor = result.name;
        vm.selectedStore = null;
      } else if (vm.selectedDistributor === result.name) {
        vm.selectedStore = null;
      } else {
        vm.selectedStore = result.name;

        if (result.storeNumber && result.storeNumber.toString().toUpperCase() !== 'UNKNOWN') {
          vm.selectedStore += ' #' + result.storeNumber;
        }
      }

      if (result.premiseType === 'OFF PREMISE') {
        vm.premiseTypeValue = 'off';
      } else if (result.premiseType === 'ON PREMISE') {
        vm.premiseTypeValue = 'on';
      }
    }

    function getUpdatedFilterQueryParamsForBrand() {
      var params = filtersService.getAppliedFilters('brandSnapshot');
      params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters, vm.filtersService.model.selected.myAccountsOnly);
      vm.loadingBrandSnapshot = true;
      var currentMetric = null;
      switch (vm.filtersService.model.accountSelected.accountBrands.value) {
        case vm.filtersService.accountFilters.accountBrandEnum.distirbutionSimple:
          currentMetric = 'SPOD';
          break;
        case vm.filtersService.accountFilters.accountBrandEnum.distirbutionEffective:
          currentMetric = 'EPOD';
          break;
        case vm.filtersService.accountFilters.accountBrandEnum.velocity:
          currentMetric = 'VEL';
          break;
        default:
          currentMetric = 'SPOD';
          break;
      }
      if (vm.brandSelectedIndex === 1) params.brand = currentBrandSelected.id;
      params.additionalParams = {
        deplTimePeriod: vm.filterModel.depletionsTimePeriod.name,
        podAndVelTimePeriod: vm.filterModel.distributionTimePeriod.name,
        metric: currentMetric,
        numberOfRecords: 30
      };
      return params;
    }

    function updateBrandSnapshot(isMoveToPreviousTab) {
      filtersService.model.selected.brand = []; // remove brand from query

      if (isMoveToPreviousTab && isMoveToPreviousTab === true && vm.brandSelectedIndex === 1) {
        prevTab();
      }
      var params = getUpdatedFilterQueryParamsForBrand();

      if (params.subaccount && params.account) delete params.account;

      if (vm.brandSelectedIndex === 0) {
        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.brands = data.performance;
          setCurrentTotalsObject();
          vm.loadingBrandSnapshot = false;
        });
      } else {
        userService.getPerformanceBrand(params).then(function(data) {
          vm.brandTabs.skus = data.performance;
          setCurrentTotalsObject();
          $timeout(function () {
            vm.loadingBrandSnapshot = false;
          }, 500);
        });
      }
      sendBrandSnapshotAnalyticsEvent();
      disableApplyFilter(true);
    }

    function updateChip(name, chip) {
      if (chip === 'myAccountsOnly') {
        chipsService.updateChip(chip, name);
      } else if (chip === 'premiseType') {
        chipsService.addChip(name, chip, true, false);
        // filter.resetTradeChannels() -- do we need to do this so the trade channels are correct based on filter
      }

      vm.disableApplyFilter(false);
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

    function canOpenNote() {
      if (vm.showXDistributor && !vm.showXChain || vm.showXStore) return true;
      else return false;
    }

    function getAccountTypePerformanceData(index) {
      return vm.topBottomData[vm.accountTypeValues[vm.currentTopBottomAcctType.name]].performanceData[index];
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    /**
     * Checks if value of Depletions for a Pacakge or Brand is greater than 0
     * @param {Number} item Package or Brand
     * @returns Returns true if value greater than 0
     */
    function checkForDepOrDistValue(item) {
      if (item) {
        var depletionVal = vm.displayBrandValue(item.measures, 'depletions', 'depletionsTimePeriod');
        var distributionVal = vm.displayBrandValue(item.measures, vm.filtersService.model.accountSelected.accountBrands.propertyName, 'distributionTimePeriod');
        return depletionVal || distributionVal;
      }
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

      if (filtersService.model.valuesVsTrend.value === 1 || filtersService.model.valuesVsTrend.value === 2) {
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
      }

      if (filtersService.model.valuesVsTrend.value === 1 || filtersService.model.valuesVsTrend.value === 3) {
        obj.trend = 'NONE';
      } else {
        switch (vm.filterModel.trend.value) {
          case 1:
            obj.trend = 'YA';
            break;
          case 2:
            obj.trend = 'PLAN';
            break;
          }
      }
      obj.numberOfRecords = 30;
      return obj;
    }

    function init() {
      initDefaultModelValues();
      initDateRanges();

      const isNavigatedFromScorecard = $state.params.applyFiltersOnLoad && $state.params.pageData.brandTitle;
      const isNavigatedFromOpps = $state.params.storeid;
      const isNavigatedFromMyPerformanceDistributorRow = $state.params.distributorid;
      const isNavigatedFromMyPerformanceSubaccountRow = $state.params.subaccountid;
      const isSettingNotes = $state.params.openNotesOnLoad;

      if (!isNavigatedFromScorecard && !(isNavigatedFromOpps || isSettingNotes)) {
        chipsService.resetChipsFilters(chipsService.model);
      }

      setUserSpecificModels();
      setStateParamModels();

      if (isNavigatedFromOpps) {
        setDataForNavigationFromOpps();
      }

      if (isSettingNotes) {
        setNotes();
      }

      if (isNavigatedFromMyPerformanceDistributorRow) {
        setDataForNavigationFromMyPerformanceDistributorRow();
      }

      if (isNavigatedFromMyPerformanceSubaccountRow) {
        setDataForNavigationFromMyPerformanceSubaccountRow();
      }

      if (isNavigatedFromScorecard) {
        setDataForNavigationFromScorecard();
      } else {
        getBrandsAndTopbottomDataOnInit(isNavigatedFromOpps || isSettingNotes);
      }

      resetStateParameters();
      setCurrentUserName();
      setTopLevelForLabel();
      sendTopBottomAnalyticsEvent();
    }

    /**
     * It is called on init and sets the default dropdown options for the entire account dashboard
     * @param {Object} currentAcctType The new account type to be set
     * @returns Sets the data for the currently selected top bottom account type
     */
    function initDefaultModelValues() {
      setDefaultEndingPeriodOptions();
      vm.filterModel.trend = vm.filtersService.model.trend[0];
      vm.filtersService.model.accountSelected.accountBrands = vm.filtersService.accountFilters.accountBrands[0];
      vm.filtersService.model.accountSelected.accountMarkets = vm.filtersService.accountFilters.accountMarkets[0];
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[0];
      vm.filtersService.model.valuesVsTrend = vm.filtersService.accountFilters.valuesVsTrend[0];
      vm.premiseTypeValue = 'off';
      vm.chartOptions = myperformanceService.getChartOptions();
      vm.topBottomData = myperformanceService.initDataForAllTbLevels(vm.topBottomData);
      vm.marketSelectedIndex = 0;
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
    }

    function setDataForNavigationFromScorecard() {
      vm.brandIdSelected = $state.params.pageData.brandId;
      vm.brandWidgetTitle = $state.params.pageData.brandTitle;
      chipsService.addAutocompleteChip(vm.brandWidgetTitle, 'brand', false);

      var brandObj = {
        id: vm.brandIdSelected,
        name: vm.brandWidgetTitle
      };
      selectItem('brands', brandObj, vm.brandTabs, 0);
    }

    function setDataForNavigationFromOpps() {
      vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      var storeData = {id: $state.params.storeid};
      vm.currentTopBottomFilters.stores = storeData;
      vm.filtersService.model.selected.myAccountsOnly = $state.params.myaccountsonly && $state.params.myaccountsonly.toLowerCase() === 'true';
      vm.filterModel.depletionsTimePeriod = filtersService.depletionsTimePeriodFromName($state.params.depletiontimeperiod);
    }

    function setDataForNavigationFromMyPerformanceDistributorRow() {
      setFilter({id: $state.params.distributorid, name: $state.params.distributorname, type: 'distributor'}, 'distributor');
      filtersService.model.distributor = $state.params.distributorname;

      if ($state.params.premisetype === 'On') {
        vm.premiseTypeValue = 'on';
        vm.filtersService.model.selected.premiseType = 'on';
        vm.updateChip('On-Premise', 'premiseType');
      } else if ($state.params.premisetype === 'Off') {
        vm.premiseTypeValue = 'off';
        vm.filtersService.model.selected.premiseType = 'off';
        vm.updateChip('Off-Premise', 'premiseType');
      }
      vm.filtersService.model.selected.myAccountsOnly = $state.params.myaccountsonly && $state.params.myaccountsonly.toLowerCase() === 'true';
      vm.filterModel.depletionsTimePeriod = filtersService.depletionsTimePeriodFromName($state.params.depletiontimeperiod);
      vm.filterModel.distributionTimePeriod = filtersService.distributionTimePeriodFromName($state.params.distributiontimeperiod);
      filterTopBottom();
    }

    function setDataForNavigationFromMyPerformanceSubaccountRow() {
      setFilter({ids: [$state.params.subaccountid], name: 'Las Islas Marias', type: 'subAccounts', premiseType: 'ON PREMISE'}, 'account');

      vm.filtersService.model.selected.myAccountsOnly = $state.params.myaccountsonly && $state.params.myaccountsonly.toLowerCase() === 'true';
      vm.filterModel.depletionsTimePeriod = filtersService.depletionsTimePeriodFromName($state.params.depletiontimeperiod);
      vm.filterModel.distributionTimePeriod = filtersService.distributionTimePeriodFromName($state.params.distributiontimeperiod);

      // Filter top bottom
      // Filter top bottom
      // Filter top bottom
      var previousTopBottomAcctType = vm.currentTopBottomAcctType;

      // change tab index
      if (vm.currentTopBottomFilters.subAccounts && vm.currentTopBottomFilters.subAccounts.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
      }

      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      // update data
      updateBrandSnapshot(true);
      vm.getDataForTopBottomLevel(vm.currentTopBottomObj);
    }

    function setNotes() {
      $timeout(function() {
        $rootScope.$broadcast('notes:opened', true, $state.params.pageData.account);

        notesService.model.accountId = $state.params.pageData.account.id;
        notesService.accountNotes().then(function(success) {
          vm.notes = success;
          vm.loading = false;
        });
      });
      var currentLevel = myperformanceService.setAcctDashboardFiltersOnInit($state.params.pageData.account, vm.currentTopBottomFilters);
      vm.filtersService.model.selected.myAccountsOnly = false;
      vm.currentTopBottomAcctType = currentLevel;
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
    }

    function getBrandsAndTopbottomDataOnInit(isNavigatedToNextLevel) {
      var params = getUpdatedFilterQueryParamsForBrand();
      var promiseArr = [];
      // brand snapshot returns sku data instead of just the brand if you add brand:xxx
      if (params.brand && params.brand.length) delete params.brand;
      params.type = 'brandSnapshot';

      vm.loadingUnsoldStore = true;
      promiseArr.push(userService.getPerformanceBrand(params));

      const id = vm.currentTopBottomFilters.stores.id;
      if (id) promiseArr.push(storesService.getStores(id));

      $q.all(promiseArr).then(function(data) {
        const performanceData = data[0];
        const storeData = data[1];

        if (performanceData) {
          vm.loadingBrandSnapshot = false;
          vm.brandTabs.brands = performanceData.performance;
          setCurrentTotalsObject();
          getDataForTopBottomLevel(vm.currentTopBottomObj, () => {
            // if initializing to stores level, use data in response to set filter model, etc
            if (vm.currentTopBottomAcctType.name === vm.filtersService.accountFilters.accountTypes[3].name) {

              // if unsold store, there will be no performance data, so search for store and set filter directly
              if (vm.topBottomData.stores.performanceData && vm.topBottomData.stores.performanceData.length > 0) {
                setTopBottomFilterModel('stores', vm.topBottomData.stores.performanceData[0]);
                setChainDropdownAndPlaceHolder('stores', vm.topBottomData.stores.performanceData[0]);
                notesService.model.tdlinx = vm.topBottomData.stores.performanceData[0].unversionedStoreCode;
                setUpdatedFilters();
              }
            }
          });

          if (isNavigatedToNextLevel) {
            var topBottomFilterForCurrentLevel = vm.currentTopBottomFilters[vm.currentTopBottomObj.currentLevelName];
            navigateTopBottomLevels(topBottomFilterForCurrentLevel);
          }
        }

        if (storeData && storeData.account) {
          setFilter(storeData, 'store');
          vm.premiseTypeValue = storeData.premiseTypeDesc;
          vm.filtersService.model.selected.premiseType = storeData.premiseTypeDesc;
        }

        vm.loadingUnsoldStore = false;
      });
    }

    function setStateParamModels() {
      if ($state.params.pageData && $state.params.pageData.premiseType && $state.params.applyFiltersOnLoad) {
        vm.premiseTypeValue = $state.params.pageData.premiseType;
        vm.filtersService.model.selected.premiseType = $state.params.pageData.premiseType;
      }
    }

    function resetStateParameters() {
      $state.params.applyFiltersOnLoad = false;
      $state.params.resetFiltersOnLoad = true;
    }

    function setCurrentUserName() {
      try {
        vm.currentUserName = userService.model.currentUser.firstName + ' ' + userService.model.currentUser.lastName;
      } catch (e) {
        vm.currentUserName = null;
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
    function setSelected(name, widget) {
      if (vm.selectedStore) { vm.selectedStore = null; }
      if (widget === 'brands') { vm.brandIdSelected = name; }
    }

    // Top Bottom Specific Functions
    /**
     * Sets the current top bottom acct type (1.Distirrbutor , 2.Accounts, 3.Sub Accounts, 4.Stores)
     * @param {Object} currentAcctType The new account type to be set
     * @returns Sets the data for the currently selected top bottom account type
     */
    function setTopBottomAcctTypeSelection(currentAcctType, levelToResetBeyond) {
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        resetTopBottomHistory();
        vm.currentTopBottomAcctType = currentAcctType;
        vm.currentTopBottomObj = getCurrentTopBottomObject(currentAcctType);
        sendTopBottomAnalyticsEvent();
        removeAllTopBottomAccountTypeFilters(levelToResetBeyond);
        onFilterPropertiesChange();
      }
    }

    /**
     * Based on the acct type passed, this function gives the matching topbottom object
     * @param {Object} acctType Can be either a distirbutor, acct, subacct, store object
     * @returns returns either vm.topBottomData.distirbutor, vm.topBottomData.accounts etc
     */
    function getCurrentTopBottomObject(acctType, setPrev) {
      if (setPrev) {
        vm.prevTopBottomObj = vm.currentTopBottomObj;
        vm.canNavPrevLevel  = true;
      };
      var currentObj;
      var accountTypes = filtersService.accountFilters.accountTypesEnums;
      var selectedTopBottomValue = vm.filtersService.model.valuesVsTrend.value;
      var indexOfNewSortOrder;
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
          /* Exclude bottom (trend) and bottom (value) options at the 'Store' level.
             Manually change sort order from bottom to top when 'bottom' is already selected
             and user subsequently selects 'Store' level metrics. indexOfNewSortOrder subtracts
             2 from currently selected sort order value in order to find the corresponding
             'trend' or 'value' option, and subtracts one more to offset from value to index. */
          if (selectedTopBottomValue > vm._topPerformersThreshold) {
            indexOfNewSortOrder = selectedTopBottomValue - vm._topPerformersThreshold - 1;
            vm.changeTopBottomSortOrder(vm.filtersService.accountFilters.valuesVsTrend[indexOfNewSortOrder]);
          }
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
      if (vm.currentBrandSkuSelected) currentParams.masterSKU = vm.currentBrandSkuSelected.id;
    }

    /**
     * Updates the topbottom object passed with the correct data based on whether performance data needs to be updated or the filtered data needs to be updated or if none needs to be updated sets the sort order (top 10 values etc)
     * @param {Object} topBottomObj Can be either topBottomData.distirbutor, topBottomData.account etc
     * @param {Function} callback Function to invoke after successful retrieval of data
     * @returns Updates the object with the correct data
     */
    function getDataForTopBottomLevel(topBottomObj, callback) {
      const categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
      let params = filtersService.getAppliedFilters('topBottom');
      appendBrandParametersForTopBottom(params);
      params = myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters, vm.filtersService.model.selected.myAccountsOnly);

      if (filtersService.model.selected.retailer === 'Store') {
        delete params['account'];
        delete params['subaccount'];
        delete params['distributor'];
        vm.filtersService.model.distributor = null;
        vm.showXDistributor = false;
      }

      vm.loadingTopBottom = true;
      params.additionalParams = getAppliedFiltersForTopBottom();
      userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params).then(function(data) {
        vm.currentTopBottomObj.performanceData = data.performance;
        vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
        vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
        setSortedArrIndex();
        if (callback) {
          callback();
        }
      }, function(error) {
        console.log('[getDataForTopBottomLevel]', error);
        vm.loadingTopBottom = 'error';
        vm.currentChartData = formatChartData(myperformanceService.initChartData());
      });
      vm.marketSelectedIndex = vm.currentTopBottomAcctType.value - 1;
    }

    /**
     * Gets the value from the measure and performanceData that is passed.
     * @param {Object} measures Can be either
     *                      topBottomData.distirbutor.performanceData.measures,
     *                      topBottomData.distirbutor.timePeriodFilteredData.measures,
     *                      topBottomData.account.performanceData.measures,
     *                      topBottomData.account.timePeriodFilteredData.measures,
     *                      topBottomData.stores.performanceData.measures,
     *                      topBottomData.stores.timePeriodFilteredData.measures etc
     * @param {Object} performanceData The performance data
     * @returns Returns the rounded value or if null returns '-' or if non applicable returns N/A
     */
    function getValueBoundForAcctType(measures, performanceData) {
      let displayValue = '-';

      if (vm.filtersService.model.accountSelected.accountMarkets) {
        const isNonApplicable = vm.filtersService.model.accountSelected.accountMarkets.propertyName === 'velocity'
          ? isNonApplicableMeasure(performanceData.firstSoldDate)
          : false;

        if (isNonApplicable) {
          displayValue = 'N/A';
        } else {
          if (measures) {
            const propName = vm.filtersService.model.accountSelected.accountMarkets.propertyName;
            const matchedMeasure = measures[propName];
            if (userService.isValidValues(matchedMeasure)) {
              displayValue = $filter('number')(matchedMeasure, 0);
            }
          }
        }
      }

      return displayValue;
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
              vm.currentChartData = formatChartData(data.chartData.topValues);
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.topTrends:
            if (data.topBottomIndices.topTrends.length > 0) {
              result = data.topBottomIndices.topTrends;
              vm.currentChartData = formatChartData(data.chartData.topTrends);
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomValues:
            if (data.topBottomIndices.bottomValues.length > 0) {
              result = data.topBottomIndices.bottomValues;
              vm.currentChartData = formatChartData(data.chartData.bottomValues);
            }
            break;
          case filtersService.accountFilters.topBottomSortTypeEnum.bottomTrends:
            if (data.topBottomIndices.bottomTrends.length > 0) {
              result = data.topBottomIndices.bottomTrends;
              vm.currentChartData = formatChartData(data.chartData.bottomTrends);
            }
            break;
        }
        if (result !== null) {
          vm.currentBoundTopBottomIndexes =  result;
          stopTopBottomLoadingIcon();
        } else {
          vm.loadingTopBottom = 'error';
          vm.currentBoundTopBottomIndexes = [];
          vm.currentChartData = formatChartData(myperformanceService.initChartData());
        }

      } else {
        stopTopBottomLoadingIcon();
        console.log('Unable to retrieve any ' + vm.currentTopBottomObj.currentLevelName);
      }
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
        sendTopBottomAnalyticsEvent();
        onFilterPropertiesChange(false);
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
        sendTopBottomAnalyticsEvent();
        onFilterPropertiesChange(false);
      }
    }

    /**
     * Updates vm.currentTopBottomFilters object
     * @param {Object} currentLevelName The level to be updated.. Can be ditrstibutors, acct etc
     * @param {Object} data The filter selected. It's of the format {id:xxx, name: 'sdfsdf'}
     */
    function setTopBottomFilterModel(currentLevelName, data, goingBack) {
      if (goingBack) {
        // when traversing up, we clear the filter for the current level, since we would only have a filter applied for the level above.
        // note that this also affects logic in setUpdatedFilters() -> setFilter(), which sets filtersService.model based on currentTopBottomFilters
        vm.currentTopBottomFilters[currentLevelName] = '';

        // if going to subaccounts, clear store from current filters also, in case a specific store was clicked while on stores level
        if (currentLevelName === 'subAccounts') {
          vm.currentTopBottomFilters['stores'] = '';
        }
      } else {
        vm.currentTopBottomFilters[currentLevelName] = {
          id: currentLevelName === 'stores' && data.unversionedStoreCode ? [data.id, data.unversionedStoreCode] : data.id,
          name: data.name,
          address: formatAddress(data),
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        };
      }

      if (currentLevelName === 'stores' && data.storeNumber) {
        vm.currentTopBottomFilters.stores.storeNumber = data.storeNumber;
      }

      // The term 'vm.filtersService.model.account' needs to be refactored. This variable for is used to hold the text for all types except distributor
      if (currentLevelName === 'distributors') {
        vm.filtersService.model.distributor = data.name;
      } else if (vm.selectedDistributor === data.name) {
        vm.filtersService.model.account = '';
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

    function getStoreAddress() {
      var addressWithStoreNumber = '',
        fullAddress = '',
        cityState =  '';

      if (vm.currentTopBottomFilters.stores.address) {
        fullAddress += vm.currentTopBottomFilters.stores.address.trim();
      }

      if (vm.currentTopBottomFilters.stores.city) {
        cityState += vm.currentTopBottomFilters.stores.city;
      }
      if (vm.currentTopBottomFilters.stores.state) {
        cityState += ', ' + vm.currentTopBottomFilters.stores.state;
      }

      // if address already contains city and state, don't append city, state, zip
      // (search result store address contains full address already)
      if (cityState !== '' && vm.currentTopBottomFilters.stores.address && vm.currentTopBottomFilters.stores.address.indexOf(cityState) < 0) {
        if (vm.currentTopBottomFilters.stores.city) {
          fullAddress += ', ' + vm.currentTopBottomFilters.stores.city;
        }
        if (vm.currentTopBottomFilters.stores.state) {
          fullAddress += ', ' + vm.currentTopBottomFilters.stores.state;
        }
        if (vm.currentTopBottomFilters.stores.zipCode) {
          fullAddress += ' ' + vm.currentTopBottomFilters.stores.zipCode;
        }
      }

      if (fullAddress !== '') {
        addressWithStoreNumber += ' (' + fullAddress + ')';
      }

      return addressWithStoreNumber;
    }

    function resetTopBottomHistory() {
      vm.topBottomHistory = {};
      vm.prevTopBottomObj = {};
      vm.canNavPrevLevel  = false;
    }

    function updateNotesModel(performanceData) {
      notesService.model.tdlinx  = performanceData.unversionedStoreCode;
      notesService.model.address = formatAddress(performanceData);
      notesService.model.city    = performanceData.city;
      notesService.model.state   = performanceData.state;
      notesService.model.zipCode = performanceData.zipCode;
    }

    function navPrevLevelInTopBottom() {
      const currentLevelName = vm.currentTopBottomAcctType.name;
      let performanceData;
      let newLevelName;
      let newAccountType;
      let levelToResetBeyond;

      if (currentLevelName === 'distributors') return;

      switch (currentLevelName) {
        case 'Accounts':
          newAccountType      = { name: 'Distributors', value: 1 };
          vm.premiseTypeValue = vm.topBottomHistory.distributors.prevPremiseType;
          vm.showXDistributor = false;
          break;
        case 'Sub-Accounts':
          newLevelName        = 'accounts';
          performanceData     = vm.topBottomHistory.distributors;
          newAccountType      = { name: 'Accounts', value: 2 };
          levelToResetBeyond  = { name: 'Distributors', value: 1 };
          vm.premiseTypeValue = vm.topBottomHistory[newLevelName].prevPremiseType;
          vm.showXDistributor = true;
          vm.showXChain       = false;
          break;
        case 'Stores':
          newLevelName        = 'subAccounts';
          performanceData     = vm.topBottomHistory.accounts;
          newAccountType      = { name: 'Sub-Accounts', value: 3 };
          levelToResetBeyond  = { name: 'Accounts', value: 2 };
          vm.premiseTypeValue = vm.topBottomHistory[newLevelName].prevPremiseType;
          vm.showXStore       = false;
          break;
      }

      // in case we selected a specific store while at stores level, switch Retailer field back to account display
      vm.filtersService.model.selected.retailer = 'Chain';

      // if performanceData does not exist (when navigating back to upper-most level) treat it like a new request
      if (!performanceData) {
        vm.currentTopBottomObj = getCurrentTopBottomObject(newAccountType);
        vm.filtersService.model.selected.premiseType = vm.premiseTypeValue;
        if (newLevelName === 'subAccounts') {
          // when switching back to subaccount level, set the account filter back to the account name
          // because account filter is changed to subaccount name when on stores level
          // (must be set before setTopBottomAcctTypeSelection because of side-effects)
          vm.filtersService.model.account = vm.currentTopBottomFilters.accounts.name;
        }

        setTopBottomAcctTypeSelection(newAccountType, levelToResetBeyond);
        resetTopBottomHistory();
        return;
      }

      if (myperformanceService.hasInconsistentIds(performanceData)) return;
      if (performanceData.name && performanceData.name.toLowerCase() === 'independent' && !vm.currentTopBottomFilters.distributors) return;

      setTopBottomFilterModel(newLevelName, performanceData, true);
      setUpdatedFilters();
      setChainDropdownAndPlaceHolder(newLevelName, performanceData);

      if (newLevelName === 'subAccounts' && vm.currentTopBottomFilters.stores) {
        // when switching back to subaccount level, set the account filter back to the account name
        // (account filter is changed to subaccount name when on stores level)
        vm.filtersService.model.account = vm.currentTopBottomFilters.accounts.name;
      }

      vm.currentTopBottomAcctType = newAccountType;
      myperformanceService.resetFiltersForLevelsAboveCurrent(levelToResetBeyond, vm.currentTopBottomFilters, vm.topBottomData);
      updateBrandSnapshot(true);
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      getDataForTopBottomLevel(vm.prevTopBottomObj);
      sendTopBottomAnalyticsEvent();
      updateNotesModel(performanceData);
    }

    /**
     * Navigates to the level after the current. If distributor ---> Acct, Acct--->SubAcct, SubAcct-->Store, Store click just highlight the store
     * @param {String} currentLevelName Indicates the text indicator of the level. 'distributor', 'account', 'subaccount','store'
     * @param {Object} performanceData get the data associated with the clicked object
     */
    function navigateTopBottomLevels(performanceData) {
      if (!performanceData) return;

      const currentLevelName = getCurrentTopBottomObject(vm.currentTopBottomAcctType).currentLevelName;

      vm.topBottomHistory[currentLevelName] = performanceData;
      vm.topBottomHistory[currentLevelName].prevPremiseType = vm.premiseTypeValue;

      const getNextLevel = currentLevelName !== 'stores';

      if (myperformanceService.hasInconsistentIds(performanceData)) return;

      if (performanceData.name && performanceData.name.toLowerCase() === 'independent' && !vm.currentTopBottomFilters.distributors) return;

      if (performanceData.premiseType) vm.premiseTypeValue = filtersService.accountFilters.premiseTypeValue[performanceData.premiseType];

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
        vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType, true);

        updateBrandSnapshot(true);
        getDataForTopBottomLevel(vm.currentTopBottomObj);
        sendTopBottomAnalyticsEvent();
      } else {
        // Just setting current top bottom object to store
        vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
        vm.currentTopBottomFilters.stores.storeNumber = performanceData.storeNumber;
        updateBrandSnapshot(true);
      }
      updateNotesModel(performanceData);
    }

    function formatAddress(performanceData) {
      var address,
          d = performanceData;

      function ifIsKnown(field) {
        return (field && field !== 'UNKNOWN' && field != null) ? field + ' ' : '';
      }

      address = ifIsKnown(d.addressLine1) + ifIsKnown(d.addressLine2) + ifIsKnown(d.addressLine3) + ifIsKnown(d.addressLine4);

      return address;
    }

    function setUpdatedFilters() {
      filtersService.model.filtersValidCount++;
      filtersService.model.selected.premiseType = vm.premiseTypeValue;

      // The order to be processed is distributor, stores, subaccounts, accounts. So that the last value doesn't get overridden
      if (vm.currentTopBottomFilters.distributors) {
        setFilter(vm.currentTopBottomFilters.distributors, 'distributor');
      }
      if (vm.currentTopBottomFilters.stores) {
        // setFilter(vm.currentTopBottomFilters.stores, 'store');
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
          name: performanceData.name,
          idForOppsPage: performanceData.unversionedStoreCode
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

    function setTopLevelForLabel() {
      vm.topLevelForLabel = filtersService.model.selected.myAccountsOnly && vm.currentUserName
      ? vm.currentUserName
      : vm._defaultTopLevelForLabel;
    }

     function sendTopBottomAnalyticsEvent() {
       analyticsService.trackEvent(
         vm.filtersService.model.valuesVsTrend.name,
         vm.currentTopBottomAcctType.name,
         vm.filtersService.model.accountSelected.accountMarkets.name
       );
     }

    function sendAllOpportunityAnalyticsEvent() {
      analyticsService.trackEvent(
        'Accounts',
        'Top Opportunities',
        'All Opportunities'
      );
    }

    function sendBrandSnapshotAnalyticsEvent() {
      analyticsService.trackEvent(
        'Snapshot',
        getSnapshotAction(),
        vm.filtersService.model.accountSelected.accountBrands.name
      );
    }

    function getSnapshotAction() {
      return vm.brandWidgetSkuTitle
        ? vm.brandWidgetSkuTitle
        : (currentBrandSelected ? currentBrandSelected.name : vm.brandWidgetTitleDefault);
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

    function formatChartData(chartData) {
      if (chartData.length && angular.isArray(chartData)) {
        return chartData[0].values.map(data => {
          return [{
            values: [data]
          }];
        });
      } else return [];
    }

    function initDateRanges() {
      dateRangeSubscription = dateRangeService.getDateRanges().subscribe(dateRanges => {
        vm.dateRanges = dateRanges;
      });
    }

    $scope.$on('$destroy', () => {
      dateRangeSubscription.unsubscribe();
    });
  };
