'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, $log, $window, opportunitiesService, myperformanceService, chipsService, filtersService, userService) {
    var vm = this;

    // Services available in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;

    vm.filters = myperformanceService.filter();
    vm.distributionData = myperformanceService.distributionModel();

    // Expose public methods
    vm.isNegative = isNegative;
    vm.isPositive = isPositive;

    vm.overviewOpen = false;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    // Simulated returned user data to show saved filters
    vm.userData = {
      savedFilters: [{
        name: 'Saved Filter 1',
        filters: ['Filter 1', 'Filter 2', 'Filter 3', 'Filter 4']
      }, {
        name: 'Saved Filter 2',
        filters: ['Filter 1', 'Filter 2']
      }]
    };

    // Chart data

    vm.chartOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 400,
        x: function(d) { return d.label; },
        y: function(d) { return d.value; },
        showControls: false,
        showValues: true,
        duration: 500
      }
    };

    vm.chartData = [
      {
        'values': [
          {
            'label': 'Walmart #1167',
            'value': 15
          }, {
            'label': 'Walmart #2872',
            'value': -4
          }, {
            'label': 'Walmart #166',
            'value': 9
          }, {
            'label': 'Walmart #3395',
            'value': 4
          }, {
            'label': 'Walmart #1471',
            'value': -10
          }, {
            'label': 'Walmart #1685',
            'value': -1
          }, {
            'label': 'Walmart #2738',
            'value': -3
          }, {
            'label': 'Walmart #2089',
            'value': 11
          }, {
            'label': 'Walmart #1198',
            'value': 2
          }
        ]
      }
    ];

    // Public methods

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

    // Check if market overview is scrolled out of view
    angular.element($window).bind('scroll', function() {
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
