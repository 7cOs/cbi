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
    vm.brandWidgetSkuTitle = null;
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
    vm.getDataForTopBottom = getDataForTopBottom;
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
    vm.isStoreLevel = false;
    vm.isHighlightStore = isHighlightStore;
    var topBottomInitData = true;
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

      var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;

      // change tab index
      if (vm.currentTopBottomFilters.stores && vm.currentTopBottomFilters.stores.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
        // to do: highlight store
      } else if (vm.currentTopBottomFilters.subAccounts && vm.currentTopBottomFilters.subAccounts.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[3];
      } else if (vm.currentTopBottomFilters.accounts && vm.currentTopBottomFilters.accounts.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[2];
      } else if (vm.currentTopBottomFilters.distributors && vm.currentTopBottomFilters.distributors.id) {
        vm.currentTopBottomAcctType = vm.filtersService.accountFilters.accountTypes[1];
      }

      setUpdatedFilters();
      vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
      // update data
      getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
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
        vm.brandWidgetSkuTitle = null;
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
      var categoryBound;
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
            categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
            getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
          }
        } else if (accountObj.value === filtersService.accountFilters.accountMarketsEnums.distEffective && vm.brandSelectedIndex === 0) {
          isOptionHidden = true;
          if (vm.filtersService.model.accountSelected.accountMarkets.value === filtersService.accountFilters.accountMarketsEnums.distEffective) {
            var distSimpleObj = filtersService.accountFilters.accountMarkets.filter(function (market) {
              return market.value === filtersService.accountFilters.accountMarketsEnums.distSimple;
            });
            vm.filtersService.model.accountSelected.accountMarkets = distSimpleObj[0];
            myperformanceService.resetFilterFlags(vm.topBottomData);
            categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
            getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
          }
        }
      }
      return isOptionHidden;
    }

    function removeInlineSearch(type) {
      vm[type] = '';

      if (type === 'selectedStore') {
        filtersService.model.selected.account = [];
        filtersService.model.selected.store = [];
      } else if (type === 'selectedDistributor') {
        filtersService.model.selected.distributor = [];
      }

      apply(false);
    }

    function resetFilters() {
      // Remove all filters asssociated with top bottom
      removeAllTopBottomAccountTypeFilters();
      vm.filterModel = angular.copy(filterModelTemplate);
      setDefaultDropDownOptions();
      apply(false);
      // Go back to distributor level. Get the updated data for distributors
      resetTopBottom();
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
      var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
      getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
    }

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;

      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        vm.brandWidgetSkuTitle = item.name;
        if (widget === 'brands') { setSelected(item.name, 'brands'); }
      } else {
        vm.brandWidgetSkuTitle = null;
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

      // model uses .distributor but this uses .distributors
      var topBottomProp = '';
      switch (filterModelProperty) {
        case 'account':
          topBottomProp = 'accounts';
          break;
        case 'subAccount':
          topBottomProp = 'subAccounts';
          break;
        case 'store':
          topBottomProp = 'stores';
          break;
        default:
          topBottomProp = 'distributors';
          break;
      };
      vm.currentTopBottomFilters[topBottomProp] = {
        id: result.id,
        name: result.name
      };

      if (filterModelProperty === 'store') {
        filtersService.model.selected.account = [];
        filtersService.model.account = '';
        chipsService.removeChip('chain');
        vm.showXStore = true;
      } else if (filterModelProperty === 'account') {
        filtersService.model.selected.store = [];
        filtersService.model.store = '';
        chipsService.removeChip('store');
        vm.showXChain = true;
      } else if (filterModelProperty === 'distributor') {
        vm.showXDistributor = true;
      }

      for (var i = 0; i < chipsService.model.length; i++) {
        if (chipsService.model[i].type === filterModelProperty) {
          chipsService.model.splice(i, 1);
          break;
        }
      }
      chipsService.addAutocompleteChip(result.name, filterModelProperty, false);
      apply(false);

      filtersService.model[filterModelProperty] = result.name;

      // Update display model
      filterModelProperty === 'distributor' ? vm.selectedDistributor = result.name : vm.selectedStore = result.name;
    }

    function updateBrandSnapshot() {
      var params = filtersService.getAppliedFilters('brandSnapshot');
      myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
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

    function init() {
      // reset all chips and filters on page init if no brand is specified
      if (!$state.params.applyFiltersOnLoad) {
        chipsService.resetChipsFilters(chipsService.model);
      } else {
        topBottomInitData = false;
        if ($state.params.pageData.brandTitle) {
          vm.brandIdSelected = filtersService.model.selected.brand[0];
          vm.brandWidgetTitle = $state.params.pageData.brandTitle;

          chipsService.addAutocompleteChip(vm.brandWidgetTitle, 'brand', false);
        }
      }

      setDefaultDropDownOptions();
      setDefaultFilterOptions();

      if ($state.params.pageData && $state.params.pageData.premiseType) vm.filtersService.model.selected.premiseType = $state.params.pageData.premiseType;

      var params = filtersService.getAppliedFilters('brandSnapshot');

      var promiseArr = [
        userService.getPerformanceDepletion(),
        userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'}),
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params)
      ];

      // brand snapshot returns sku data instead of just the brand if you add brand:xxx
      if (params.brand && params.brand.length) delete params.brand;
      promiseArr.push(userService.getPerformanceBrand(params));

      $q.all(promiseArr).then(function(data) {
        userService.model.depletion = data[0];
        userService.model.distribution = data[1];
        vm.brandTabs.brands = data[3].performance;

        if ($state.params.applyFiltersOnLoad) {
          // select brand that was clicked in score card
          for (var i = 0; i < vm.brandTabs.brands.length; i++) {
            if (vm.brandTabs.brands[i].name === vm.brandWidgetTitle) {
              selectItem('brands', vm.brandTabs.brands[i], vm.brandTabs, 0);
            }
          }
        }

        setCurrentTotalsObject();
        if (data[2]) {
          var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
          vm.currentTopBottomObj.performanceData = data[2].performance;
          vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
          getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
          if (topBottomInitData === true) {
            topBottomInitData = false;
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
    /**
     * Sets the current top bottom acct type (1.Distirrbutor , 2.Accounts, 3.Sub Accounts, 4.Stores)
     * @param {Object} currentAcctType The new account type to be set
     * @returns Sets the data for the currently selected top bottom account type
     */
    function setTopBottomAcctTypeSelection(currentAcctType) {
      if (vm.currentTopBottomAcctType !== currentAcctType) {
        vm.currentTopBottomAcctType = currentAcctType;
        vm.currentTopBottomObj = getCurrentTopBottomObject(currentAcctType);
        var propertyBoundToTable = vm.filtersService.model.accountSelected.accountMarkets;
        // We need to reset all filters if dropdown is directly selected
        if (myperformanceService.resetFilters(vm.currentTopBottomFilters)) {
          removeAllTopBottomAccountTypeFilters();
          for (var topBottomObj in vm.topBottomData) {
            myperformanceService.resetPerformanceDataFlags(vm.topBottomData[topBottomObj]);
          }
        }
        getDataForTopBottom(vm.currentTopBottomObj, propertyBoundToTable);
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
      vm.filtersService.model.selected.premiseType = 'all';
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

    function getCurrentStoreData() {
      vm.loadingTopBottom = true;
      if (vm.currentTopBottomObj.isFilterUpdateRequired === false) {
        setSortedArrIndex();
        return;
      }
      var params = filtersService.getAppliedFilters('topbottom');
      myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
      var depletionOption = vm.filterModel.depletionsTimePeriod;
      var distirbutionOption = vm.filterModel.distributionTimePeriod;
      var acctMarketSelection = vm.filtersService.model.accountSelected.accountMarkets;

      var promiseArr = [], queryParamsForAllSorts = [];
      angular.forEach(filtersService.accountFilters.valuesVsTrend, function (sortType) {
        var sortParams = {
          filterQueryParams: params,
          otherQueryParams: {
            timePeriod: '',
            top: false,
            trend: false,
            metric: ''
          }
        };
        myperformanceService.getFilterParametersForStore(sortParams.otherQueryParams, depletionOption,  distirbutionOption, acctMarketSelection, sortType, vm.filterModel.trend);
        queryParamsForAllSorts.push(sortParams);
      });
      for (var i = 0; i < queryParamsForAllSorts.length; i++) {
        promiseArr.push(userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, queryParamsForAllSorts[i]));
      }
      $q.all(promiseArr).then(function(data) {
        if (data) {
          vm.currentTopBottomObj = myperformanceService.setStoreTopBottomData(data, vm.currentTopBottomObj, depletionOption,  distirbutionOption, acctMarketSelection, vm.filterModel.trend);
          vm.currentTopBottomObj.isFilterUpdateRequired = false;
          setSortedArrIndex();
        }
      }, function(error) {
        console.log('[getCurrentStoreData]', error);
        vm.loadingTopBottom = 'error';
        vm.currentChartData = myperformanceService.initChartData();
      });
    }

    /**
     * Updates the topbottom object passed with the correct data based on whether performance data needs to be updated or the filtered data needs to be updated or if none needs to be updated sets the sort order (top 10 values etc)
     * @param {Object} topBottomObj Can be either topBottomData.distirbutor, topBottomData.account etc
     * @param {Object} categoryBound It is one of the objects from vm.filtersService.accountFilters.accountMarkets
     * @returns Updates the object with the correct data
     */
    function getDataForTopBottom(topBottomObj, categoryBound) {
      if (vm.isStoreLevel === true) {
        getCurrentStoreData();
      } else if (!topBottomObj.performanceData || topBottomObj.isPerformanceDataUpdateRequired === true) {
        var params = filtersService.getAppliedFilters('topBottom');
        myperformanceService.appendFilterParametersForTopBottom(params, vm.currentTopBottomFilters);
        vm.loadingTopBottom = true;
        userService.getTopBottomSnapshot(vm.currentTopBottomAcctType, params).then(function(data) {
          vm.currentTopBottomObj.performanceData = data.performance;
          vm.currentTopBottomObj.isPerformanceDataUpdateRequired = false;
          vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
          setSortedArrIndex();
        }, function(error) {
          console.log('[getDataForTopBottom]', error);
          vm.loadingTopBottom = 'error';
          vm.currentChartData = myperformanceService.initChartData();
        });
      } else if (!topBottomObj.timePeriodFilteredData || topBottomObj.isFilterUpdateRequired === true) {
          vm.loadingTopBottom = true;
          vm.currentTopBottomObj = myperformanceService.updateDataForCurrentTopDownLevel(vm.currentTopBottomObj, categoryBound, vm.filterModel.depletionsTimePeriod, vm.filterModel.distributionTimePeriod, vm.filterModel.trend);
          setSortedArrIndex();
        } else {
          vm.loadingTopBottom = true;
          setSortedArrIndex();
      }
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
          return Math.round(matchedMeasure);
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
      // console.log('Current Top Bottom Obj', vm.currentTopBottomObj);
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
      vm.filterModel.distributionTimePeriod = selectedVal;
      onFilterPropertiesChange();
    }

    /**
     * Fires when depletion time period options change
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function depletionOptionChanged(selectedVal) {
      vm.filterModel.depletionsTimePeriod = selectedVal;
      onFilterPropertiesChange();
    }

    /**
     * Fires when trend options change
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function trendOptionChanged(selectedVal) {
      vm.filterModel.trend = selectedVal;
      onFilterPropertiesChange();
    }

    /**
     * Fires when vategory bound changes (Can be depletions, distirbution(simple), distirbution(effective), Velocity)
     * @param {Object} selectedVal Updates the current distirbution time period
     * @returns Set the filter flag on topBottom(topBottomData.distirbutor etc) objects to be updated and sets the updated data in the corresponding object
     */
    function acctMarketChanged(selectedVal) {
      vm.filtersService.model.accountSelected.accountMarkets = selectedVal;
      onFilterPropertiesChange();
    }

    /**
     * Fires when top bottom sort order changes
     * @param {Object} selectedVal Current top bottom sort order (top10 values/trends etc)
     * @returns Sets the current sort order indices
     */
    function changeTopBottomSortOrder(selectedVal) {
      vm.loadingTopBottom = true;
      vm.filtersService.model.valuesVsTrend = selectedVal;
      setSortedArrIndex();
    }

    // Currently not used. If the functionality to go to previous level is present can be enabled
    // function prevLevelInTopBottom() {
    //   // vm.marketSelectedIndex is zero index based and acct type selections start from 1
    //   var previousLevelInTopBottom = vm.marketSelectedIndex;
    //   vm.currentTopBottomAcctType = myperformanceService.getAcctTypeObjectBasedOnTabIndex(previousLevelInTopBottom);
    //   vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
    //   updateTopBottom();
    // }

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
          var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
          getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
          // updateBrandSnapshot();
        } else {
          // Just setting current top bottom object to store
          vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
        }
      }
    }

    function setUpdatedFilters() {
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

    function onFilterPropertiesChange() {
      if (topBottomInitData === false) {
        myperformanceService.resetFilterFlags(vm.topBottomData);
        var categoryBound = vm.filtersService.model.accountSelected.accountMarkets;
        vm.currentTopBottomObj = getCurrentTopBottomObject(vm.currentTopBottomAcctType);
        getDataForTopBottom(vm.currentTopBottomObj, categoryBound);
      }
    }
  };
