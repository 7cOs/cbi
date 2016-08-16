'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, $log, $window, myperformanceService, chipsService, filtersService, userService) {

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
    vm.filters = myperformanceService.filter();
    vm.distributionData = myperformanceService.distributionModel();
    vm.marketData = myperformanceService.marketData();
    vm.brandSkus = myperformanceService.brandSkus();

    // Widget / tab contents
    vm.brandTabs = {
      brands: vm.distributionData.performance,
      skus: vm.brandSkus
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
    vm.filtersService.model.selected.accountBrands = 'Distribution (simple)';
    vm.filtersService.model.selected.accountMarkets = 'Depletions';
    vm.selectOpen = false;
    vm.disableAnimation = false;
    vm.marketStoresView = false;
    vm.marketIdSelected = false;
    vm.selectedStore = null;

    // Chart Setup
    vm.chartData = [{'values': vm.marketData.distributors}];
    vm.chartOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        groupSpacing: 0.65,
        x: function(d) { return d.label; },
        y: function(d) { return d.value; },
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
    vm.isPositive = isPositive;
    vm.overviewOpen = false;
    vm.idSelected = null;
    vm.brandIdSelected = null;
    vm.openSelect = openSelect;
    vm.setMarketTab = setMarketTab;
    vm.selectItem = selectItem;
    vm.prevTab = prevTab;
    vm.openNotes = openNotes;

    // **************
    // PUBLIC METHODS
    // **************

    // When a row item is clicked in brands / market widgets
    function selectItem(widget, item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;
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

    // Move to next indexed tab
    function nextTab(widget) {
      vm.disableAnimation = false;
      if (widget === 'brands') { vm.brandSelectedIndex = vm.brandSelectedIndex + 1; }
      if (widget === 'markets') { vm.marketSelectedIndex = vm.marketSelectedIndex + 1; }
    }

    // Move to previously indexed tab (only used for brands)
    function prevTab() {
      if (vm.brandSelectedIndex > 0) {
        vm.brandSelectedIndex = vm.brandSelectedIndex - 1;
        vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
        vm.brandIdSelected = null;
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

    // Set variable when select box is open (for bug in scroll binding)
    function openSelect(value) {
      vm.selectOpen = value;
    }

    // Check if sales data value is positive (for display in UI)
    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };

    // Make notes available to the page
    function openNotes(val) {
      $rootScope.$broadcast('notes:opened', val);
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    // Checks active tab, updates model, passes data to chart (markets only)
    function getActiveTab() {
      if (vm.marketSelectedIndex === 0) { vm.filtersService.model.selected.accountTypes = 'Distributors'; setChartData(vm.marketData.distributors); deselectMarketId(); }
      if (vm.marketSelectedIndex === 1) { vm.filtersService.model.selected.accountTypes = 'Accounts'; setChartData(vm.marketData.accounts); deselectMarketId(); }
      if (vm.marketSelectedIndex === 2) { vm.filtersService.model.selected.accountTypes = 'Sub-Accounts'; setChartData(vm.marketData.subAccounts); deselectMarketId(); }
      if (vm.marketSelectedIndex === 3) { vm.filtersService.model.selected.accountTypes = 'Stores'; setChartData(vm.marketData.stores); }
    }

    // Handle required formatting for chart data
    function setChartData(data) {
      vm.chartData = [{'values': data}];
    }

    // Add 'selected' class to item furthest possible drill-down tab level
    function setSelected(idSelected, widget) {
      vm.idSelected = idSelected;
      if (vm.selectedStore) { vm.selectedStore = null; }
      if (widget === 'brands') { vm.brandIdSelected = idSelected; }
      if (widget === 'markets') { vm.marketIdSelected = true; vm.selectedStore = idSelected; prevTab(); }
    }

    function deselectMarketId() {
      if (vm.marketIdSelected === true) {
        vm.idSelected = null;
        vm.marketIdSelected = false;
      }
    }

    // Set element class for market overview
    function setOverviewDisplay(value) {
      vm.overviewOpen = value;
      $scope.$apply();
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
