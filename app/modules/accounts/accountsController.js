'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, $log, $window, myperformanceService, chipsService, filtersService, userService) {
    var vm = this;

    // Services available in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;

    vm.filters = myperformanceService.filter();
    vm.distributionData = myperformanceService.distributionModel();
    vm.marketData = myperformanceService.marketData();
    vm.chartData = [{'values': vm.marketData.distributors}];
    vm.brandSkus = myperformanceService.brandSkus();

    // Expose public methods
    vm.isNegative = isNegative;
    vm.isPositive = isPositive;
    vm.removeTab = removeTab;
    vm.overviewOpen = false;
    vm.idSelected = null;
    vm.setSelected = setSelected;
    vm.openSelect = openSelect;
    vm.setChartData = setChartData;
    vm.selectItem = selectItem;

    // Tab content
    vm.brandTabs = {
      brands: vm.distributionData.performance,
      skus: vm.brandSkus
    };
    // vm.marketTabs = [
    //   'distributors': [],
    //   'accounts': [],
    //   'sub-accounts': [],
    //   'stores': []
    // ];

    vm.selected = null;
    vm.previous = null;
    vm.selectedIndex = 0;
    vm.nextTab = nextTab;
    vm.prevTab = prevTab;
    vm.newTabContent = '';

    // Set default values
    vm.accountTypesDefault = 'Distributors';
    vm.brandWidgetTitleDefault = 'All Brands';
    vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
    vm.filtersService.model.selected.accountMarkets = 'Depletions';
    vm.selectOpen = false;
    vm.brandDrillDown = null;
    vm.disableAnimation = false;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    // Chart Options
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

    // Public methods

    // When a row item is clicked in brands / market widgets
    function selectItem(item, parent, parentIndex) {
      var parentLength = Object.keys(parent).length;
      if (parentIndex + 1 === parentLength) {
        // We're on the deepest level of current tab list
        setSelected(item.name);
      }
      nextTab();
    }

    function nextTab() {
      vm.selectedIndex = vm.selectedIndex + 1;
    }

    function prevTab() {
      vm.selectedIndex = vm.selectedIndex - 1;
    }

    function removeTab(tabList) {
      var lastItem = vm.brandTabs.length - 1;
      vm.brandWidgetTitle = vm.brandWidgetTitleDefault;
      vm.brandTabs.splice(lastItem, 1);
      vm.idSelected = null;
      vm.brandDrillDown = null;
    }

    function setSelected(idSelected) {
      vm.idSelected = idSelected;
      vm.brandDrillDown = vm.idSelected;
    }

    function isNegative(salesData) {
      if (salesData >= 0) {
        return false;
      }
      return true;
    };

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };

    // Used to set element class for market overview
    function setOverviewDisplay(value) {
      vm.overviewOpen = value;
      $scope.$apply();
    }

    function openSelect(value) {
      vm.selectOpen = value;
    }

    function setChartData() {
      var dataSet = vm.filtersService.model.selected.accountTypes;
      if (dataSet === 'Distributors') { vm.chartData = [{'values': vm.marketData.distributors}]; }
      if (dataSet === 'Accounts') { vm.chartData = [{'values': vm.marketData.accounts}]; }
      if (dataSet === 'Sub-Accounts') { vm.chartData = [{'values': vm.marketData.subAccounts}]; }
      if (dataSet === 'Stores') { vm.chartData = [{'values': vm.marketData.stores}]; }
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
