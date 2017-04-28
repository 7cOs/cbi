'use strict';

module.exports = /*  @ngInject */
  function scorecardsController($rootScope, $scope, $q, $filter, $state, filtersService, opportunitiesService, userService) {

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
        name: 'Simple',
        value: 'simple'
      }, {
        name: 'Effective',
        value: 'effective'
      }],
      premises: [{
        name: 'Off Premise',
        value: 'off'
      }, {
        name: 'On Premise',
        value: 'on'
      }],
      selected: {}
    };
    vm.totalRowTemplate = {
      depletions: 0,
      depletionsLastYear: 0,
      depletionsBU: 0,
      depletionsBULastYear: 0,
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
    vm.selectedIndex = -1;
    vm.selectedList = null;
    vm.distributionSortQuery = 'name';
    vm.distributionSortReverse = false;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;
    vm.filtersService = filtersService;
    vm.userService = userService;

    // Expose public methods
    vm.changeDepletionOption = changeDepletionOption;
    vm.changeDepletionScorecard = changeDepletionScorecard;
    vm.changeDistributionTimePeriod = changeDistributionTimePeriod;
    vm.changePremise = changePremise;
    vm.goToAccountDashboard = goToAccountDashboard;
    vm.isPositive = isPositive;
    vm.updateEndingTimePeriod = updateEndingTimePeriod;
    vm.toggleSelected = toggleSelected;
    vm.checkValidity = checkValidity;
    vm.vsYAPercent = vsYAPercent;
    vm.setDefaultFilterOptions = setDefaultFilterOptions;
    vm.premiseTypeDisabled = '';
    vm.parseInt = parseInt;
    vm.sortBy = sortBy;
    vm.setSortQuery = setSortQuery;
    vm.getFilteredValue = getFilteredValue;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function checkValidity(value, fractionSize) {
      // Check if result is infinity or NaN
      if (isFinite(value) && value !== null && value !== '') {
        return $filter('number')(value, fractionSize || 0);
      } else {
        return '-';
      }
    }

    function vsYAPercent(ty, ya, trend) {
      // Correctly display TY vs YA % values
      if (trend === null && ty === 0 && ya === 0) {
        return 0;
      } else if (trend === null && ty > 0 && ya === 0) {
        return $filter('number')(100, 1);
      } else {
        return $filter('number')(trend, 1);
      }
    }

    function toggleSelected($index, list) {
      vm.selectedList = list;
      vm.selectedIndex = $index;
    }

    function changeDepletionOption(value) {
      updatedSelectionValuesInFilter(null, value, null);
    }

    function changeDepletionScorecard(bool) {
      if (bool) vm.depletionSelect = vm.depletionSelectOptions[vm.depletionRadio][0].name;
      updateTotalRowDepletions();
    }

    function changeDistributionTimePeriod(value) {
      vm.distributionSelectOptions.selected = value;
      updatedSelectionValuesInFilter(null, null, value);
      updateTotalRowDistributions();
    }

    function changePremise() {
      var payload = {'type': 'noencode'};
      if (vm.distributionRadioOptions.selected.onOffPremise === 'on') payload.premiseType = 'on';
      else payload.premiseType = 'off';

      userService.getPerformanceDistribution(payload).then(function(data) {
        userService.model.distribution = getTransformedModel(getProcessedData('distribution', data));
        updateTotalRowDistributions();
      }, function(err) {
        updateTotalRowDistributions();
        console.warn(err);
      });
    }

    function goToAccountDashboard(row, disabled) {
      if (disabled) return false;

      if (row) {
        filtersService.model.selected.brand = [row.id];
        filtersService.model.selected.myAccountsOnly = true;
        filtersService.model.selected.opportunityType = ['All Types'];
        filtersService.model.selected.retailer = 'Chain';

        $state.go('accounts', {
          resetFiltersOnLoad: false,
          applyFiltersOnLoad: true,
          pageData: {
            brandTitle: row.name,
            brandId: row.id,
            premiseType: disabled !== 'undefined' ? vm.distributionRadioOptions.selected.onOffPremise : null
          }
        });
      } else {
        filtersService.model.selected.myAccountsOnly = true;
        $state.go('accounts', {
          resetFiltersOnLoad: false,
          applyFiltersOnLoad: true,
          pageData: {
            premiseType: vm.distributionRadioOptions.selected.onOffPremise
          }
        });
      }
    }

    function isPositive(salesData) {
      if (parseInt(salesData) >= 0) {
        return true;
      }
      return false;
    }

    function updateEndingTimePeriod(value) {
      vm.distributionSelectOptions.selected = vm.filtersService.model.scorecardDistributionTimePeriod[value][0].name;
      vm.depletionSelect = vm.filtersService.model.depletionsTimePeriod[value][2].name;
      updatedSelectionValuesInFilter(value, vm.depletionSelect, vm.distributionSelectOptions.selected);
      updateTotalRowDepletions();
      updateTotalRowDistributions();
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

    function setSortQuery(table, query) {
      if (table === 'distribution') {
        vm.distributionSortQuery === query
          ? vm.distributionSortReverse = !vm.distributionSortReverse
          : vm.distributionSortQuery = query;
      }
    }

    function sortBy(distribution) {
      if (vm.distributionSortQuery === 'name') return distribution.name;
      else {
        if (getFilteredValue(vm.distributionSortQuery, distribution, 'distribution') !== '-') {
          return parseFloat(getFilteredValue(vm.distributionSortQuery, distribution, 'distribution').replace(/[,$]/g, ''));
        } else {
          return 0;
        }
      }
    }

    function getFilteredValue(key, model, type) {
      if (type === 'distribution') {
        return model[vm.distributionSelectOptions.selected][key][vm.distributionRadioOptions.selected.placementType];
      } else {
        return model[vm.depletionSelect][key];
      }
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      if (userService.model.currentUser.srcTypeCd === undefined) userService.model.currentUser.srcTypeCd = [''];
      setDefaultFilterOptions();
      var performanceDepletionPromise = userService.getPerformanceDepletion();
      var performanceDistributionPromise = userService.getPerformanceDistribution({'type': 'noencode', 'premiseType': vm.distributionRadioOptions.selected.onOffPremise});

      // serial http request -- we need all to complete before running init functions
      $q.all([performanceDepletionPromise, performanceDistributionPromise]).then(function(values) {
        userService.model.depletion = values[0];
        userService.model.distribution = values[1];

        // init vars when all requests are finished
        // depletions
        vm.depletionRadio = 'year';
        vm.depletionSelect = 'FYTD';
        vm.distributionSelectOptions.selected = vm.filtersService.model.distributionTimePeriod[vm.depletionRadio][1].name;
        updateTotalRowDepletions();

        // distribution
        vm.distributionRadioOptions.selected.placementType = 'simple';
        updatedSelectionValuesInFilter(vm.depletionRadio, vm.depletionSelect, vm.distributionSelectOptions.selected);

        updateTotalRowDistributions();

        userService.model.distribution = getTransformedModel(getProcessedData('distribution', userService.model.distribution));
        userService.model.depletion = getTransformedModel(getProcessedData('depletion', userService.model.depletion));
      });
    }

    function updateTotalRowDepletions() {
      vm.totalRow = angular.copy(vm.totalRowTemplate);
      for (var i = 0; i < userService.model.depletion.length; i++) {
        angular.forEach(userService.model.depletion[i].measures, function(item, key) {
          if (item.timeframe === vm.depletionSelect) {
            // sum
            vm.totalRow.depletions += item.depletions;
            vm.totalRow.depletionsLastYear += item.depletionsLastYear;
            vm.totalRow.depletionsBU += item.depletionsBU;
            vm.totalRow.depletionsBULastYear += item.depletionsBULastYear;
            vm.totalRow.gapVsPlan += (item.depletions - item.plan);
            vm.volumeBU = 0;
            vm.growthBU = 0;

          }
        });
      }

      vm.totalRow.gap = vm.totalRow.depletions - vm.totalRow.depletionsLastYear;

      vm.totalRow.percentTrend = vsYAPercent(vm.totalRow.depletions, vm.totalRow.depletionsLastYear, ((vm.totalRow.depletions / vm.totalRow.depletionsLastYear - 1) * 100));

      vm.totalRow.percentBUTrend = vsYAPercent(vm.totalRow.depletionsBU, vm.totalRow.depletionsBULastYear, ((vm.totalRow.depletionsBU / vm.totalRow.depletionsBULastYear - 1) * 100));

      if (vm.totalRow.depletions !== 0) {
        vm.totalRow.percentGapVsPlan = $filter('number')((vm.totalRow.gapVsPlan / vm.totalRow.depletions) * 100, 1);
      } else {
        vm.totalRow.percentGapVsPlan = 0;
      }
    }

    function updateTotalRowDistributions() {
      var totalObj = {};
      totalObj = $filter('filter')(userService.model.distribution, {type: 'Total'});
      if (totalObj[0]) {
        vm.totalDistributions = $filter('filter')(totalObj[0].measures, {timeframe: vm.distributionSelectOptions.selected});
      } else {
        vm.totalDistributions = {};
      }
    }

    function setDefaultFilterOptions() {
      if (userService.model.currentUser.personID !== -1) {
        switch (userService.model.currentUser.srcTypeCd[0]) {
          case 'OFF_HIER':
          case 'OFF_SPEC':
            offPremise();
            break;
          case 'ON_HIER':
            onPremise();
            break;
          default:
            vm.distributionRadioOptions.selected.onOffPremise = 'off';
            break;
          }
        }

      function onPremise() {
        vm.distributionRadioOptions.selected.onOffPremise = 'on';
        vm.premiseTypeDisabled = 'Off Premise';
      }
      function offPremise() {
        vm.distributionRadioOptions.selected.onOffPremise = 'off';
        vm.premiseTypeDisabled = 'On Premise';
      }
    }

    function getTransformedModel(modelCollection) {
      return modelCollection.map(model => {
        model.measures.forEach(measure => {
          model[measure.timeframe] = measure;
        });
        return model;
      });
    };

    function getProcessedData(type, modelCollection) {
      if (type === 'distribution') {
        return modelCollection.map(model => {
          model.measures.forEach(measure => {
            measure['timeFrameTotal'] = {
              simple: checkValidity(measure.distributionsSimple, 0),
              effective: checkValidity(measure.distributionsEffective, 0)
            };

            measure['vsYa'] = {
              simple: checkValidity(measure.distributionsSimple - measure.distributionsSimpleLastYear),
              effective: checkValidity(measure.distributionsEffective - measure.distributionsEffectiveLastYear)
            };

            measure['vsYaPercent'] = {
              simple: vsYAPercent(measure.distributionSimple, measure.distributionsSimpleLastYear, measure.distributionsSimpleTrend),
              effective: vsYAPercent(measure.distributionsEffective, measure.distributionsEffectiveLastYear, measure.distributionsEffectiveTrend)
            };

            measure['buVsYaPercent'] = {
              simple: vsYAPercent(measure.distributionsSimpleBU, measure.distributionsSimpleBULastYear, measure.distributionsSimpleBUTrend),
              effective: vsYAPercent(measure.distributionsEffectiveBU, measure.distributionsEffectiveBULastYear, measure.distributionsEffectiveBUTrend)
            };

            measure['percentTotal'] = {
              simple: checkValidity((measure.distributionsSimple / vm.totalDistributions[0].distributionsSimple) * 100, 1),
              effective: checkValidity((measure.distributionsEffective / vm.totalDistributions[0].distributionsEffective) * 100, 1)
            };

            measure['percentBuTotal'] = {
              simple: checkValidity((measure.distributionsSimpleBU / vm.totalDistributions[0].distributionsSimpleBU) * 100, 1),
              effective: checkValidity((measure.distributionsEffectiveBU / vm.totalDistributions[0].distributionsEffectiveBU) * 100, 1)
            };
          });

          return model;
        });
      } else {
        return modelCollection.map(model => {
          model.measures.forEach(measure => {
            measure['timeFrameTotal'] = checkValidity(measure.depletions, 0);
            measure['vsYa'] = checkValidity(measure.depletions - measure.depletionsLastYear, 0);
            measure['vsYaPercent'] = vsYAPercent(measure.depletions, measure.depletionsLastYear, measure.depletionsTrend);
            measure['buVsYaPercent'] = vsYAPercent(measure.depletionsBU, measure.depletionsBULastYear, measure.depletionsBUTrend);
            measure['percentTotal'] = checkValidity((measure.depletions / vm.totalRow.depletions) * 100, 1);
            measure['percentBuTotal'] = checkValidity((measure.depletionsBU / vm.totalRow.depletionsBU) * 100, 1);
          });

          return model;
        });
      }
    }
  };
