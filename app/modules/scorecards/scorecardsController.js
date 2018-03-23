'use strict';

module.exports = /*  @ngInject */
  function scorecardsController(dateRangeService, filtersService, opportunitiesService, userService, $filter, $q, $rootScope, $scope, $state, title) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    const vm = this;
    let dateRangeSubscription;

    vm.depletionSelect;
    vm.depletionSelectDisplayName;
    vm.depletionSelectApiCode;
    vm.depletionRadio;
    vm.distributionSelectOptions = {
      selected: '',
      v3ApiCode: ''
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
    vm.depletionSort = {
      sortDescending: false,
      query: 'name'
    };
    vm.distributionSort = {
      sortDescending: false,
      query: 'name'
    };
    vm.initialized = false;
    vm.calculatingDepletionTotals;
    vm.calculatingDistributionTotals;
    vm.ctvTooltipInputData = {
      title: 'Contribution to Volume',
      text: ['Contribution to Volume (CTV) indicates the brand mix, or the % contribution of a brand to Total volume.']
    };

    // Set page title for head and nav
    title.setTitle($state.current.title);
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.depletionSelectOpen = false;
    vm.distributionSelectOpen = false;
    vm.dateRanges = {};

    // Expose public methods
    vm.changeDepletionOption = changeDepletionOption;
    vm.changeDepletionScorecard = changeDepletionScorecard;
    vm.changeDistributionTimePeriod = changeDistributionTimePeriod;
    vm.changePremise = changePremise;
    vm.goToAccountDashboard = goToAccountDashboard;
    vm.isPositive = isPositive;
    vm.updateEndingTimePeriod = updateEndingTimePeriod;
    vm.toggleSelected = toggleSelected;
    vm.getValidValue = getValidValue;
    vm.vsYAPercent = vsYAPercent;
    vm.setDefaultFilterOptions = setDefaultFilterOptions;
    vm.premiseTypeDisabled = '';
    vm.parseInt = parseInt;
    vm.sortBy = sortBy;
    vm.setSortQuery = setSortQuery;
    vm.getFilteredValue = getFilteredValue;
    vm.scorecardsFilter = scorecardsFilter;
    vm.updatedSelectionValuesInFilter = updatedSelectionValuesInFilter;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function getValidValue(value, fractionSize) {
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

    function changeDepletionOption(value, v3ApiCode) {
      vm.calculatingDepletionTotals = true;
      vm.depletionSelectApiCode = v3ApiCode;
      updatedSelectionValuesInFilter(null, value, null);
    }

    function changeDepletionScorecard(changeDepletions) {
      if (changeDepletions) {
        vm.depletionSelect = vm.depletionSelectOptions[vm.depletionRadio][0].name;
        vm.depletionSelectDisplayName = vm.depletionSelectOptions[vm.depletionRadio][0].displayValue;
      }
      updateTotalRowDepletions();
      userService.model.depletion = getRemodeledCollection(userService.model.depletion, 'depletion');
      vm.calculatingDepletionTotals = false;
    }

    function changeDistributionTimePeriod(value, v3ApiCode) {
      vm.calculatingDistributionTotals = true;
      vm.distributionSelectOptions.selected = value;
      vm.distributionSelectOptions.v3ApiCode = v3ApiCode;
      updatedSelectionValuesInFilter(null, null, value);
      updateTotalRowDistributions();
      userService.model.distribution = getRemodeledCollection(userService.model.distribution, 'distribution');
      vm.calculatingDistributionTotals = false;
    }

    function changePremise() {
      var payload = {'type': 'noencode'};
      payload.premiseType = vm.distributionRadioOptions.selected.onOffPremise === 'on' ? 'on' : 'off';

      userService.getPerformanceDistribution(payload).then(function(data) {
        userService.model.distribution = getRemodeledCollection(data, 'distribution');
        updateTotalRowDistributions();
        userService.model.distribution = getRemodeledCollection(userService.model.distribution, 'distribution');
      }, function(err) {
        updateTotalRowDistributions();
        userService.model.distribution = getRemodeledCollection(userService.model.distribution, 'distribution');
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
      return parseInt(salesData) >= 0;
    }

    function updateEndingTimePeriod(value) {
      vm.distributionSelectOptions.selected = vm.filtersService.model.scorecardDistributionTimePeriod[value][0].name;
      vm.distributionSelectOptions.v3ApiCode = vm.filtersService.model.scorecardDistributionTimePeriod[value][0].v3ApiCode;
      vm.depletionSelect = vm.filtersService.model.depletionsTimePeriod[value][2].name;
      vm.depletionSelectDisplayName = vm.filtersService.model.depletionsTimePeriod[value][2].displayValue;
      vm.depletionSelectApiCode = vm.filtersService.model.depletionsTimePeriod[value][2].v3ApiCode;
      updatedSelectionValuesInFilter(value, vm.depletionSelect, vm.distributionSelectOptions.selected);
      updateTotalRowDepletions();
      updateTotalRowDistributions();
      userService.model.distribution = getRemodeledCollection(userService.model.distribution, 'distribution');
      userService.model.depletion = getRemodeledCollection(userService.model.depletion, 'depletion');
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
        vm.depletionSelectDisplayName = matchedObj[0].displayValue;
      }

      if (distirbutionPeriod) {
        var distObj = filtersService.model.distributionTimePeriod[vm.filtersService.lastEndingTimePeriod.endingPeriodType];
        var matchedDistObj = distObj.filter(function(val) {
          return val.name === distirbutionPeriod;
        });
        vm.filtersService.lastEndingTimePeriod.timePeriodValue = matchedDistObj[0];
      }
    }

    function setSortQuery(sort, query) {
      vm[sort].query === query
        ? vm[sort].sortDescending = !vm[sort].sortDescending
        : vm[sort].query = query;
    }

    function sortBy(sortType) {
      let filteredValueType = '';
      sortType === 'distributionSort' ? filteredValueType = 'distribution' : filteredValueType = 'depletion';

      return model => {
        if (vm[sortType].query === 'name') return model.name;

        return getFilteredValue(vm[sortType].query, model, filteredValueType) !== '-'
          ? parseFloat(getFilteredValue(vm[sortType].query, model, filteredValueType).replace(/[,$]/g, ''))
          : -1;
      };
    }

    function getFilteredValue(key, model, modelType) {
      if (!vm.initialized) return '';

      return modelType === 'distribution'
        ? model[vm.distributionSelectOptions.selected][key][vm.distributionRadioOptions.selected.placementType]
        : model[vm.depletionSelect][key];
    }

    function scorecardsFilter(rowType) {
      return function(row) {
        return row.type !== 'Total' && hasRelevantValues(row);
      };

      function hasRelevantValues(row) {
        const filteredTimeValue = getFilteredValue('timeFrameTotal', row, rowType);
        const filteredYAValue = getFilteredValue('vsYa', row, rowType);

        return (filteredTimeValue !== '-' && filteredTimeValue !== '0') || filteredYAValue !== '0';
      }
    }

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      if (userService.model.currentUser.srcTypeCd === undefined) userService.model.currentUser.srcTypeCd = [''];

      setDefaultFilterOptions();
      initDateRanges();

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
        vm.depletionSelectDisplayName = 'FYTD';
        vm.depletionSelectApiCode = 'FYTDBDL';
        vm.distributionSelectOptions = {
          selected: vm.filtersService.model.distributionTimePeriod[vm.depletionRadio][1].name,
          v3ApiCode: vm.filtersService.model.distributionTimePeriod[vm.depletionRadio][1].v3ApiCode
        };
        updateTotalRowDepletions();

        // distribution
        vm.distributionRadioOptions.selected.placementType = 'simple';
        updatedSelectionValuesInFilter(vm.depletionRadio, vm.depletionSelect, vm.distributionSelectOptions.selected);

        updateTotalRowDistributions();

        vm.initialized = true;
        userService.model.distribution = getRemodeledCollection(userService.model.distribution, 'distribution');
        userService.model.depletion = getRemodeledCollection(userService.model.depletion, 'depletion');
      });
    }

    function updateTotalRowDepletions() {
      vm.totalRow = angular.copy(vm.totalRowTemplate);
      userService.model.depletion.forEach(depletion => {
        const measure = depletion.measures.find(measure => measure.timeframe === vm.depletionSelect);
        if (measure) {
          vm.totalRow.depletions += measure.depletions;
          vm.totalRow.depletionsLastYear += measure.depletionsLastYear;
          vm.totalRow.depletionsBU += measure.depletionsBU;
          vm.totalRow.depletionsBULastYear += measure.depletionsBULastYear;
          vm.totalRow.gapVsPlan += (measure.depletions - measure.plan);
          vm.volumeBU = 0;
          vm.growthBU = 0;
        }
      });

      vm.totalRow.gap = vm.totalRow.depletions - vm.totalRow.depletionsLastYear;
      vm.totalRow.percentTrend = vsYAPercent(vm.totalRow.depletions, vm.totalRow.depletionsLastYear, ((vm.totalRow.depletions / vm.totalRow.depletionsLastYear - 1) * 100));
      vm.totalRow.percentBUTrend = vsYAPercent(vm.totalRow.depletionsBU, vm.totalRow.depletionsBULastYear, ((vm.totalRow.depletionsBU / vm.totalRow.depletionsBULastYear - 1) * 100));
      vm.totalRow.percentGapVsPlan = vm.totalRow.depletions
        ? $filter('number')((vm.totalRow.gapVsPlan / vm.totalRow.depletions) * 100, 1)
        : vm.totalRow.percentGapVsPlan = 0;
  }

    function updateTotalRowDistributions() {
      let totalObj = $filter('filter')(userService.model.distribution, {type: 'Total'}) || {};
      vm.totalDistributions = totalObj[0]
        ? $filter('filter')(totalObj[0].measures, {timeframe: vm.distributionSelectOptions.selected})
        : {};
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

    function getRemodeledCollection(collection, type) {
      const processedCollection = getProcessedData(type, collection);
      const transformedModel = getTransformedModel(processedCollection);
      return transformedModel;
    }

    function getTransformedModel(modelCollection) {
      return modelCollection.map(model => {
        model.measures.forEach(measure => {
          model[measure.timeframe] = measure;
        });
        return model;
      });
    }

    function getProcessedData(type, modelCollection) {
      if (type === 'distribution') {
        return modelCollection.map(model => {
          model.measures.forEach(measure => {
            measure['timeFrameTotal'] = {
              simple: getValidValue(measure.distributionsSimple, 0),
              effective: getValidValue(measure.distributionsEffective, 0)
            };

            measure['vsYa'] = {
              simple: getValidValue(measure.distributionsSimple - measure.distributionsSimpleLastYear),
              effective: getValidValue(measure.distributionsEffective - measure.distributionsEffectiveLastYear)
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
              simple: getValidValue(vm.totalDistributions[0] ? ((measure.distributionsSimple / vm.totalDistributions[0].distributionsSimple) * 100) : null, 1),
              effective: getValidValue(vm.totalDistributions[0] ? ((measure.distributionsEffective / vm.totalDistributions[0].distributionsEffective) * 100) : null, 1)
            };

            measure['percentBuTotal'] = {
              simple: getValidValue(vm.totalDistributions[0] ? ((measure.distributionsSimpleBU / vm.totalDistributions[0].distributionsSimpleBU) * 100) : null, 1),
              effective: getValidValue(vm.totalDistributions[0] ? ((measure.distributionsEffectiveBU / vm.totalDistributions[0].distributionsEffectiveBU) * 100) : null, 1)
            };
          });

          return model;
        });
      } else {
        return modelCollection.map(model => {
          model.measures.forEach(measure => {
            measure['timeFrameTotal'] = getValidValue(measure.depletions, 0);
            measure['vsYa'] = getValidValue(measure.depletions - measure.depletionsLastYear, 0);
            measure['vsYaPercent'] = vsYAPercent(measure.depletions, measure.depletionsLastYear, measure.depletionsTrend);
            measure['buVsYaPercent'] = vsYAPercent(measure.depletionsBU, measure.depletionsBULastYear, measure.depletionsBUTrend);
            measure['percentTotal'] = getValidValue((measure.depletions / vm.totalRow.depletions) * 100, 1);
            measure['percentBuTotal'] = getValidValue((measure.depletionsBU / vm.totalRow.depletionsBU) * 100, 1);
          });

          return model;
        });
      }
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
