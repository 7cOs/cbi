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

    // Chart Options
    vm.chartOptions = {
      chart: {
        type: 'multiBarHorizontalChart',
        height: 350,
        x: function(d) { return d.label; },
        y: function(d) { return d.value; },
        showControls: false,
        showValues: true,
        showXAxis: false,
        showYAxis: false,
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

    // Chart Data
    vm.chartData = [
      {
        'values': [
          {
            'label': 'Walmart #1167',
            'value': 15,
            'title': 'Walmart',
            'address': '3500 Brumb... Kenosha, WA',
            'storeNum': 1167,
            'depletions': 47560
          }, {
            'label': 'Walmart #2872',
            'value': -4,
            'title': 'Walmart',
            'address': '10562 Bell... , Belleville, MI',
            'storeNum': 2872,
            'depletions': 65879
          }, {
            'label': 'Walmart #166',
            'value': 9,
            'title': 'Walmart',
            'address': '1433 S Sam... , Houston, MO',
            'storeNum': 166,
            'depletions': 45500
          }, {
            'label': 'Walmart #3395',
            'value': 4,
            'title': 'Walmart',
            'address': '3501 S Loc... , Grand Island, NE',
            'storeNum': 3395,
            'depletions': 64329
          }, {
            'label': 'Walmart #1471',
            'value': -10,
            'title': 'Walmart',
            'address': '1717 N Sha... , New London, WI',
            'storeNum': 1471,
            'depletions': 42943
          }, {
            'label': 'Walmart #1685',
            'value': -1,
            'title': 'Walmart',
            'address': '1730 N Gar... , Pierre, SD',
            'storeNum': 1685,
            'depletions': 51211
          }, {
            'label': 'Walmart #2738',
            'value': -3,
            'title': 'Walmart',
            'address': '400 Juncti... , Glen Carbon, IL',
            'storeNum': 2738,
            'depletions': 71200
          }, {
            'label': 'Walmart #2089',
            'value': 11,
            'title': 'Walmart',
            'address': '3001 W Bro... , Coumbia, MO',
            'storeNum': 2089,
            'depletions': 61193
          }, {
            'label': 'Walmart #1198',
            'value': 2,
            'title': 'Walmart',
            'address': 'W159S6530... , Muskego, WI',
            'storeNum': 1198,
            'depletions': 55342
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
