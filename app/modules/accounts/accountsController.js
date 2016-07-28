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

    vm.options = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 450,
        x: function(d) { return d.label; },
        y: function(d) { return d.value; },
        // yErr: function(d){ return [-Math.abs(d.value * Math.random() * 0.3), Math.abs(d.value * Math.random() * 0.3)] },
        showControls: true,
        showValues: true,
        duration: 500,
        xAxis: {
          showMaxMin: false
        },
        yAxis: {
          axisLabel: 'Values',
          tickFormat: function(d) {
            return d3.format(',.2f')(d);
          }
        }
      }
    };

    vm.data = [
      {
        'key': 'Series1',
        'color': '#d62728',
        'values': [
          {
            'label': 'Group A',
            'value': -1.8746444827653
          }, {
            'label': 'Group B',
            'value': -8.0961543492239
          }, {
            'label': 'Group C',
            'value': -0.57072943117674
          }, {
            'label': 'Group D',
            'value': -2.4174010336624
          }, {
            'label': 'Group E',
            'value': -0.72009071426284
          }, {
            'label': 'Group F',
            'value': -0.77154485523777
          }, {
            'label': 'Group G',
            'value': -0.90152097798131
          }, {
            'label': 'Group H',
            'value': -0.91445417330854
          }, {
            'label': 'Group I',
            'value': -0.055746319141851
          }
        ]
      }, {
        'key': 'Series2',
        'color': '#1f77b4',
        'values': [
          {
            'label': 'Group A',
            'value': 25.307646510375
          }, {
            'label': 'Group B',
            'value': 16.756779544553
          }, {
            'label': 'Group C',
            'value': 18.451534877007
          }, {
            'label': 'Group D',
            'value': 8.6142352811805
          }, {
            'label': 'Group E',
            'value': 7.8082472075876
          }, {
            'label': 'Group F',
            'value': 5.259101026956
          }, {
            'label': 'Group G',
            'value': 0.30947953487127
          }, {
            'label': 'Group H',
            'value': 0
          }, {
            'label': 'Group I',
            'value': 0
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
