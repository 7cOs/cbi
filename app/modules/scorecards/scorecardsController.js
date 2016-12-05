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
    vm.distributionSelectOptions = {
      selected: ''
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

    vm.updateEndingTimePeriod = updateEndingTimePeriod;
    vm.changeDistirbutionTimePeriod = changeDistirbutionTimePeriod;
    vm.changeDepletionOption = changeDepletionOption;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function updateEndingTimePeriod(value) {
      vm.distributionSelectOptions.selected = vm.filtersService.model.distributionTimePeriod[value][0].name;
      vm.depletionSelect = vm.filtersService.model.depletionsTimePeriod[value][0].name;
      updatedSelectionValuesInFilter(value, vm.depletionSelect, vm.distributionSelectOptions.selected);
    }

    // TODO The models that are hooked up for depletion and distirbution need to be changed to use an object instead of a string in the next sprint
    function updatedSelectionValuesInFilter(endingPeriod, depletionPeriod, distirbutionPeriod) {
      if (endingPeriod) {
        vm.filtersService.lastEndingTimePeriod.endingPeriodType = endingPeriod;
      }

      if (depletionPeriod) {
        var depletionObj = filtersService.model.depletionsTimePeriod[vm.filtersService.lastEndingTimePeriod.endingPeriodType];
        var matchedObj = depletionObj.filter(function(val) {
          return val.name === depletionPeriod;
        });

        vm.filtersService.lastEndingTimePeriod.depletionValue = matchedObj[0];
      }

      if (distirbutionPeriod) {
        var distObj = filtersService.model.distributionTimePeriod[vm.filtersService.lastEndingTimePeriod.endingPeriodType];
        var matchedDistObj = distObj.filter(function(val) {
          return val.name === distirbutionPeriod;
        });
        vm.filtersService.lastEndingTimePeriod.timePeriodValue = matchedDistObj[0];
      }
    }

    function changeDistirbutionTimePeriod(value) {
      updatedSelectionValuesInFilter(null, null, value);
    }

    function changeDepletionOption(value) {
      updatedSelectionValuesInFilter(null, value, null);
    }

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
      var performanceDepletionPromise = userService.getPerformanceDepletion();
      var performanceDistributionPromise = userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': 'off'});

      // serial http request -- we need all to complete before running init functions
      $q.all([performanceDepletionPromise, performanceDistributionPromise]).then(function(values) {
        userService.model.depletion = values[0];
        userService.model.distribution = values[1];

        // init vars when all requests are finished
        // depletions
        vm.depletionRadio = 'year';
        vm.depletionSelect = 'FYTD';
        vm.distributionSelectOptions.selected = vm.filtersService.model.distributionTimePeriod[vm.depletionRadio][0].name;
        updateTotalRowDepletions();

        // distribution
        vm.distributionRadioOptions.selected.placementType = 'Simple';
        vm.distributionRadioOptions.selected.onOffPremise = 'Off Premise';
        updatedSelectionValuesInFilter(vm.depletionRadio, vm.depletionSelect, vm.distributionSelectOptions.selected);

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
    }
  };
