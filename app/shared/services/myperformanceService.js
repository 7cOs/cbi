'use strict';

module.exports = /*  @ngInject */
  function myperformanceService($filter, filtersService, userService) {
    var service = {
      getTopBottomDataSorted: getTopBottomDataSorted,
      getChartOptions: getChartOptions,
      updateDataForCurrentTopDownLevel: updateDataForCurrentTopDownLevel,
      initDataForAllTbLevels: initDataForAllTbLevels,
      resetPerformanceDataFlags: resetPerformanceDataFlags,
      appendFilterParametersForTopBottom: appendFilterParametersForTopBottom,
      resetFiltersForLevelsAboveCurrent: resetFiltersForLevelsAboveCurrent,
      initChartData: initChartData,
      getAcctTypeObjectBasedOnTabIndex: getAcctTypeObjectBasedOnTabIndex,
      resetFilters: resetFilters,
      isValidValues: isValidValues,
      hasInconsistentIds: hasInconsistentIds,
      setAcctDashboardFiltersOnInit: setAcctDashboardFiltersOnInit
    };

    return service;

    function getTopBottomDataSorted(topBottomData, trendType, categoryType) {
      // This needs to be refactored. This approach was followed because of our old api parameters where all the sorting was performed on client side
      var sortedList = {
        topValues: [],
        bottomValues: [],
        topTrends: [],
        bottomTrends: []
      };
      sortedList.topValues = insertNumbersInRange(0, topBottomData.length);
      sortedList.bottomValues = insertNumbersInRange(0, topBottomData.length);
      sortedList.topTrends = insertNumbersInRange(0, topBottomData.length);
      sortedList.bottomTrends = insertNumbersInRange(0, topBottomData.length);
      return sortedList;
    }

    function getFilteredArr (tbData, filterOption) {
      var data, filteredData = [], matchedMeasure = null;
      for (var i = 0, len = tbData.length; i < len; i++) {
        data = tbData[i];

        matchedMeasure = data.measures.filter(function (measure) {
          return measure.timeframe === filterOption.name;
        });

        if (matchedMeasure[0]) {
          var depletionObj = {
            title: data.name,
            type: data.type,
            measure: matchedMeasure[0]
          };
          filteredData.push(depletionObj);
        }
      }
      return filteredData;
    }

    function getFilteredTopBottomData(topBottomData, categoryType, depletionOption, distirbutionOption) {
      var filteredArr = [];
      switch (categoryType.value) {
        case filtersService.accountFilters.accountMarketsEnums.depletions:
          filteredArr = getFilteredArr(topBottomData.performanceData, depletionOption);
          break;
        default:
          filteredArr = getFilteredArr(topBottomData.performanceData, distirbutionOption);
          break;
      }
      return filteredArr;
    }

    function setUpdatedDataIndicator(currentTbData, filterIndicator, performanceDataIndicator) {
      currentTbData.isPerformanceDataUpdateRequired = performanceDataIndicator;
    }

    function updateDataForCurrentTopDownLevel(currentTbData, categoryType, depletionOption, distirbutionOption, trendOption) {
      var filteredData = getFilteredTopBottomData(currentTbData, categoryType, depletionOption, distirbutionOption);
     currentTbData.timePeriodFilteredData = filteredData;
      currentTbData.topBottomIndices = getTopBottomDataSorted(currentTbData.timePeriodFilteredData, trendOption, categoryType);
      getChartData(currentTbData, categoryType, trendOption);
      setUpdatedDataIndicator(currentTbData, false, false);
      return currentTbData;
    }

    function insertNumbersInRange(lowerIndex, numOfElements) {
      var arr = [];
      for (var i = lowerIndex; numOfElements > 0; i++) {
        arr.push(i);
        numOfElements--;
      }
      return arr;
    }

    function initDataForAllTbLevels(tbData) {
      for (var property in tbData) {
        var initObjectForEachLevel = {
          performanceData: null,
          timePeriodFilteredData: null,
          topBottomIndices: null,
          chartData: null,
          isPerformanceDataUpdateRequired: true
        };

        if (tbData.hasOwnProperty(property)) {
          tbData[property] = initObjectForEachLevel;
        }
      }
      return tbData;
    }

    function getChartOptions() {
      return {
        chart: {
          type: 'multiBarHorizontalChart',
          groupSpacing: 0.55,
          x: function(d) {
            return  d.label;
          },
          y: function(d) {
            if (isValidValues(Number(d.value))) {
              return d.value;
            } else {
              return;
            }
          },
          xAxis: {
            showMaxMin: false
          },
          yAxis: {
            showMaxMin: false
          },
          yDomain: [-60, 60],
          showControls: false,
          showValues: true,
          duration: 500,
          valueFormat: function(d) {
            if (d === null) {
              return '';
            } else {
              if (d % 1 !== 0) {
                return $filter('number')(d, 1) + '%';
              } else {
                return $filter('number')(d, 0) + '%';
              }
            }
          },
          tooltip: {
            enabled: false,
            valueFormatter: function(d) {
              if (isValidValues(Number(d))) {
                if (d % 1 !== 0) {
                  return $filter('number')(d, 1) + '%';
                } else {
                  return $filter('number')(d, 0) + '%';
                }
              }
            }
          },
          margin: {
            top: 0,
            right: 0,
            bottom: 30,
            left: 0
          },
          valuePadding: 80,
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
    }

    function isValidValues(value) {
      var isValid = typeof value === 'number' && !isNaN(value);
      return isValid;
    }

    function resetPerformanceDataFlags(topBottomObj) {
      topBottomObj.isPerformanceDataUpdateRequired = true;
      topBottomObj.performanceData = null;
      topBottomObj.timePeriodFilteredData = null;
      topBottomObj.chartData = null;
    }

    function getChartData(tbData, categoryType, trendType) {
      tbData.chartData = {
        topValues: null,
        bottomValues: null,
        topTrends: null,
        bottomTrends: null
      };
      var trendPropertyName = filtersService.trendPropertyNames[categoryType.propertyName][trendType.value - 1];
      var chartDataVal = getChartDataForSortCategory(tbData.timePeriodFilteredData, tbData.topBottomIndices.topValues, trendPropertyName);
      // This needs to be refactored. This approach was followed because of our old api parameters where all the sorting was performed on client side
      tbData.chartData.topValues = chartDataVal;
      tbData.chartData.bottomValues = chartDataVal;
      tbData.chartData.topTrends = chartDataVal;
      tbData.chartData.bottomTrends = chartDataVal;
    }

    function getChartDataForSortCategory(orginalArr, indexesArr, propName) {
      var matchedArr = [], chartData = [{'values': null}], categoryChartData = [], obj;
      angular.forEach(indexesArr, function (data) {
        matchedArr.push(orginalArr[data]);
      });

      var i = 1;
      angular.forEach(matchedArr, function (data, key) {
        if (data) {
          if (isValidValues(data.measure[propName])) {
            obj = {
              'label': i + '. ' + data.title
            };
            obj.value = Math.round(data.measure[propName]);
          } else {
            obj = {
              label: '',
              value: null
            };
          }
        }
        categoryChartData.push(obj);
        i++;
      });
      chartData[0].values = categoryChartData;
      return chartData;
    }

    function appendFilterParametersForTopBottom (params, currentTopBottomFilters, myAccountsOnly) {
      params = angular.copy(params);
      // Need to remove filter parameters from filtersService.model that are in params. vm.currentTopBottomFilter should always reflect the most refreshed copy of those filters
      delete params.distributor;
      delete params.account;
      delete params.subaccount;
      delete params.store;

      if (currentTopBottomFilters.distributors) {
        params.distributor = [currentTopBottomFilters.distributors];
      }

      if (currentTopBottomFilters.accounts) {
        params.account = currentTopBottomFilters.accounts.id;
      }

      if (currentTopBottomFilters.subAccounts) {
        params.subaccount = currentTopBottomFilters.subAccounts.id;
      }

      if (currentTopBottomFilters.stores) {
        var storeIdCollection = angular.copy(currentTopBottomFilters.stores.id);
        if (storeIdCollection.length === 2) {
          // Set 9 digit versioned store id
          storeIdCollection.splice(1, 1);
          params.store = storeIdCollection;
        } else {
          params.store = currentTopBottomFilters.stores.id;
        }
      }
      return params;
    }

    function resetFiltersForLevelsAboveCurrent(currentLevel, topBottomFiltersObj, topBottomObj) {
      if (isValidValues(currentLevel.value)) {
        switch (currentLevel.value) {
          case filtersService.accountFilters.accountTypesEnums.distributors:
            topBottomFiltersObj.accounts = '';
            topBottomFiltersObj.subAccounts = '';
            topBottomFiltersObj.stores = '';
            break;
          case filtersService.accountFilters.accountTypesEnums.accounts:
            topBottomFiltersObj.subAccounts = '';
            topBottomFiltersObj.stores = '';
            break;
          case filtersService.accountFilters.accountTypesEnums.subAccounts:
            topBottomFiltersObj.stores = '';
            break;
        }
      }
    }

    function resetFilters(topBottomFilters) {
      for (var prop in topBottomFilters) {
        if (topBottomFilters[prop] !== '') {
          topBottomFilters[prop] = '';
        }
      }
    }

    function getAcctTypeObjectBasedOnTabIndex(tabIndex, isGetNextLevel) {
      var currentAccountTypeLevel = null;
      if (isGetNextLevel === true) {
        var levelToNavigate = tabIndex + 1;
        currentAccountTypeLevel = filtersService.accountFilters.accountTypes.filter(function(market) {
          return market.value === levelToNavigate;
        });
      } else {
        var previousAcctIndex = tabIndex;
        currentAccountTypeLevel = filtersService.accountFilters.accountTypes.filter(function(market) {
          return market.value === previousAcctIndex;
        });
      }
      return currentAccountTypeLevel[0];
    }

    function hasInconsistentIds(performanceData) {
      return !performanceData.id || performanceData.id.toLowerCase() === 'id missing';
    }

    function setAcctDashboardFiltersOnInit(filterToApply, currentTopBottomFilters) {
      var filter = {
        id: filterToApply.id[0],
        name: filterToApply.name
      };
      var levelToNavigate = null;
      if (filterToApply.type.toLowerCase() === 'distributor') {
        currentTopBottomFilters.distributors = filter;
        // accts level
        levelToNavigate = filtersService.accountFilters.accountTypes[0];
      }

      if (filterToApply.type.toLowerCase() === 'account') {
        currentTopBottomFilters.accounts = filter;
        levelToNavigate = filtersService.accountFilters.accountTypes[1];
      }

      if (filterToApply.type.toLowerCase() === 'subaccount') {
        currentTopBottomFilters.subAccounts = filter;
        levelToNavigate = filtersService.accountFilters.accountTypes[2];
      }

      if (filterToApply.type.toLowerCase() === 'store') {
        currentTopBottomFilters.stores = filter;
        levelToNavigate = filtersService.accountFilters.accountTypes[3];
      }
      return levelToNavigate;
    }

    function initChartData() {
      var data = [
        {
          'values': [
            {
              'label': '',
              'value': null,
              'series': 0
            }
          ]
        }
      ];
      return data;
    }
  };
