'use strict';

module.exports = /*  @ngInject */
  function scorecardsController($rootScope, $scope, $q, $filter, $state, filtersService, myperformanceService, opportunitiesService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.depletionSelect;
    vm.depletionRadio;
    vm.depletionSelectOptions = {
      month: [{
        name: 'CMTH'
      }, {
        name: 'CYTM'
      }, {
        name: 'FYTM'
      }],
      year: [{
        name: 'MTD'
      }, {
        name: 'CYTD'
      }, {
        name: 'FYTD'
      }]
    };
    vm.distributionRadioOptions = {
      placementType: [{
        name: 'Simple'
      }, {
        name: 'Effective'
      }],
      premises: [{
        name: 'Off Premise'
      }, {
        name: 'On Premise'
      }],
      selected: {}
    };
    vm.distributionSelectOptions = {
      values: [
        {name: 'Last 3 Months', value: 'L03'},
        {name: 'Last 60 Days', value: 'L60'},
        {name: 'Last 90 Days', value: 'L90'},
        {name: 'Last 120 Days', value: 'L120'}
      ],
      selected: {}
    };
    vm.totalRowTemplate = {
      depletions: 0,
      depletionsBU: 0,
      gap: 0,
      percentTrend: 0,
      percentBUTrend: 0,
      gapVsPlan: 0,
      percentGapVsPlan: 0,
      volumePercent: 100,
      volumeBU: 0,
      growthPercent: 100,
      growthBU: 0
    };

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.performanceData = myperformanceService.model();
    vm.depletionsData = myperformanceService.depletionModel();
    vm.distributionData = myperformanceService.distributionModel();
    vm.filters = myperformanceService.filter();
    vm.filtersService = filtersService;
    vm.userService = userService;

    // Expose public methods
    vm.changeDepletionScorecard = changeDepletionScorecard;
    vm.changePremise = changePremise;
    vm.isPositive = isPositive;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function changeDepletionScorecard(bool) {
      if (bool) vm.depletionSelect = vm.depletionSelectOptions[vm.depletionRadio][0].name;

      updateTotalRowDepletions();
    }

    function changePremise() {
      var payload = {'type': 'noencode'};
      if (vm.distributionRadioOptions.selected.onOffPremise === 'On Premise') payload.premiseType = 'on';
      else payload.premiseType = 'off';

      userService.getPerformanceDistribution(payload).then(function(data) {
        userService.model.distribution = data;

        updateTotalRowDistributions();
      });
    }

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      var performanceSummaryPromise = userService.getPerformanceSummary();
      var performanceDepletionPromise = userService.getPerformanceDepletion();
      var performanceDistributionPromise = userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'});

      // serial http request -- we need all to complete before running init functions
      $q.all([performanceSummaryPromise, performanceDepletionPromise, performanceDistributionPromise]).then(function(values) {
        userService.model.summary = values[0];
        userService.model.depletion = values[1];
        userService.model.distribution = values[2];

        // init vars when all requests are finished
        // depletions
        vm.depletionRadio = 'year';
        vm.depletionSelect = 'FYTD';

        updateTotalRowDepletions();

        // distribution
        vm.distributionRadioOptions.selected.placementType = 'Simple';
        vm.distributionRadioOptions.selected.onOffPremise = 'Off Premise';
        vm.distributionSelectOptions.selected = 'L03';

        updateTotalRowDistributions();

        console.log('[scorecardsController.init - userService.model.distribution]', userService.model.distribution);
      });
    }

    function updateTotalRowDepletions() {
      vm.totalRow = angular.copy(vm.totalRowTemplate);

      for (var i = 0; i < userService.model.depletion.length; i++) {
        angular.forEach(userService.model.depletion[i].measures, function(item, key) {
          if (item.timeframe === vm.depletionSelect) {
            // sum
            vm.totalRow.depletions += item.depletions;
            vm.totalRow.depletionsBU += item.depletionsBU;
            vm.totalRow.gap += item.depletionsGap;
            vm.totalRow.gapVsPlan += item.vsPlan;
            vm.volumneBU = 0;
            vm.growthBU = 0;
          }
        });
      }

      vm.totalRow.percentTrend = (vm.totalRow.gap / vm.totalRow.depletions) * 100;
      vm.totalRow.percentBUTrend = (vm.totalRow.gap / vm.totalRow.depletions) * 100;
      vm.totalRow.percentGapVsPlan = (vm.totalRow.gapVsPlan / vm.totalRow.depletions) * 100;
    }

    function updateTotalRowDistributions() {
      var totalObj = $filter('filter')(userService.model.distribution, {type: 'Total'});
      vm.totalDistributions = $filter('filter')(totalObj[0].measures, {timeframe: vm.distributionSelectOptions.selected});
      console.log(vm.totalDistributions);
    }
  };
