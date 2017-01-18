'use strict';

module.exports = /*  @ngInject */
  function myperformanceService($filter, filtersService) {
    var queryLimit = 10;

    var service = {
      getTopBottomDataSorted: getTopBottomDataSorted,
      getChartOptions: getChartOptions,
      updateDataForCurrentTopDownLevel: updateDataForCurrentTopDownLevel,
      initDataForAllTbLevels: initDataForAllTbLevels,
      resetFilterFlags: resetFilterFlags,
      resetPerformanceDataFlags: resetPerformanceDataFlags,
      getFilterParametersForStore: getFilterParametersForStore,
      setStoreTopBottomData: setStoreTopBottomData,
      appendFilterParametersForTopBottom: appendFilterParametersForTopBottom,
      resetFiltersForLevelsAboveCurrent: resetFiltersForLevelsAboveCurrent,
      initChartData: initChartData,
      getAcctTypeObjectBasedOnTabIndex: getAcctTypeObjectBasedOnTabIndex,
      resetFilters: resetFilters,
      isValidValues: isValidValues,
      checkForInconsistentIds: checkForInconsistentIds,
      parseStoreFilterFromOpps: parseStoreFilterFromOpps
    };

    return service;

    function getIndexPositionsArr(originalArr, arrToGetIndex) {
      var indexPos = -1;
      var indexedArr = [];
      angular.forEach(arrToGetIndex, function(obj) {
        indexPos = originalArr.indexOf(obj);
        if (indexPos !== -1) {
          indexedArr.push(indexPos);
        }
      });
      return indexedArr;
    }

    function getSortedObjects(tbData, queryLimit, propertyName) {
      var sortedList = {
            topValues: [],
            bottomValues: []
          },
          valuesArr, tempArr = [];
      var j = 0;
      valuesArr = $filter('orderBy')(tbData, function(data) {
        if (data && data.measure) {
          if (isValidValues(data.measure[propertyName])) {
            return data.measure[propertyName];
          } else {
            j++;
            return -1 * 9999999;
          }
        }
      });
      valuesArr = valuesArr.reverse();
      valuesArr = valuesArr.slice(0, valuesArr.length - j);
      var len = valuesArr.length;
      if (len > queryLimit) {
        tempArr = valuesArr.slice(0, queryLimit);
        sortedList.topValues = getIndexPositionsArr(tbData, tempArr);
        tempArr = valuesArr.slice(len - queryLimit, len);
        sortedList.bottomValues = getIndexPositionsArr(tbData, tempArr);
      } else {
        tempArr =  getIndexPositionsArr(tbData, valuesArr);
        sortedList.topValues = tempArr;
        sortedList.bottomValues = angular.copy(tempArr).reverse();
      }
      return sortedList;
    }

    function getFilterParametersForStore(queryParams, depletionsTimePeriod, distTimePeriod, metric, topBottomSelection, trendSelection) {
      // TODO Trend selection sort has not been implemented by API yet and this function can be refactored
      var acctEnum = filtersService.accountFilters.accountMarketsEnums;
      var timePeriodVal = '';
      switch (metric.value) {
        case acctEnum.depletions:
          timePeriodVal = 'DEPL';
          queryParams.timePeriod = depletionsTimePeriod.name;
          break;
        case acctEnum.distEffective:
          timePeriodVal = 'EPOD';
          queryParams.timePeriod = distTimePeriod.name;
          break;
        case acctEnum.velocity:
          timePeriodVal = 'VEL';
          queryParams.timePeriod = distTimePeriod.name;
          break;
        case acctEnum.distSimple:
          timePeriodVal = 'SPOD';
          queryParams.timePeriod = distTimePeriod.name;
          break;
      }

      switch (topBottomSelection.value) {
        case filtersService.accountFilters.topBottomSortTypeEnum.topValues:
          queryParams.top = true;
          queryParams.trend = 'NONE';
          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.topTrends:
          queryParams.top = true;
          queryParams.trend = trendSelection.value === 1 ? 'YA' : 'PLAN';

          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.bottomValues:
          queryParams.top = false;
          queryParams.trend = 'NONE';
          break;
        case filtersService.accountFilters.topBottomSortTypeEnum.bottomTrends:
          queryParams.top = false;
          queryParams.trend = trendSelection.value === 1 ? 'YA' : 'PLAN';
          break;
      }
      queryParams.metric = timePeriodVal;
      return queryParams;
    }

    function getTopBottomDataSorted(topBottomData, trendType, categoryType) {
      var sortedList = {
        topValues: [],
        bottomValues: [],
        topTrends: [],
        bottomTrends: []
      };
      var valuesSort = getSortedObjects(topBottomData, queryLimit, categoryType.propertyName);
      var trendPropertyName = filtersService.trendPropertyNames[categoryType.propertyName][trendType.value - 1];

      sortedList.topValues = valuesSort.topValues;
      sortedList.bottomValues = valuesSort.bottomValues;

      var trendSort = getSortedObjects(topBottomData, queryLimit, trendPropertyName);
      sortedList.topTrends = trendSort.topValues;
      sortedList.bottomTrends = trendSort.bottomValues;
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
      currentTbData.isFilterUpdateRequired = filterIndicator;
      currentTbData.isPerformanceDataUpdateRequired = performanceDataIndicator;
    }

    function updateDataForCurrentTopDownLevel(currentTbData, categoryType, depletionOption, distirbutionOption, trendOption) {
      var filteredData = getFilteredTopBottomData(currentTbData, categoryType, depletionOption, distirbutionOption);
      currentTbData.timePeriodFilteredData = filteredData;
      currentTbData.topBottomIndices = getTopBottomDataSorted(currentTbData.timePeriodFilteredData, trendOption, categoryType);
      getChartData(currentTbData, categoryType, trendOption);
      // console.log('currentTbData', currentTbData);
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

    function setStoreTopBottomData(data, storeTopBottomObj, depOption, distOption, accountMarketSelection, trendSelection) {
      var mergedDataForAllTopDownSorts = [];
      mergedDataForAllTopDownSorts = data[0].performance.concat(data[1].performance, data[2].performance, data[3].performance);
      storeTopBottomObj.performanceData = mergedDataForAllTopDownSorts;
      var timePeriodFilteredData = getFilteredTopBottomData(storeTopBottomObj, accountMarketSelection, depOption, distOption);
      storeTopBottomObj.timePeriodFilteredData = timePeriodFilteredData;
      storeTopBottomObj.topBottomIndices = {
        topValues: [],
        topTrends: [],
        bottomValues: [],
        bottomTrends: []
      };

      var startingIndex = 0;
      storeTopBottomObj.topBottomIndices.topValues = insertNumbersInRange(startingIndex, data[0].performance.length);
      startingIndex += data[0].performance.length;
      storeTopBottomObj.topBottomIndices.topTrends = insertNumbersInRange(startingIndex, data[1].performance.length);
      startingIndex += data[1].performance.length;
      storeTopBottomObj.topBottomIndices.bottomValues = insertNumbersInRange(startingIndex, data[2].performance.length);
      startingIndex +=  data[2].performance.length;
      storeTopBottomObj.topBottomIndices.bottomTrends = insertNumbersInRange(startingIndex, data[3].performance.length);
      getChartData(storeTopBottomObj, accountMarketSelection, trendSelection);
      return storeTopBottomObj;
    }

    function initDataForAllTbLevels(tbData) {
      for (var property in tbData) {
        var initObjectForEachLevel = {
          performanceData: null,
          timePeriodFilteredData: null,
          topBottomIndices: null,
          chartData: null,
          isPerformanceDataUpdateRequired: true,
          isFilterUpdateRequired: true
        };

        if (tbData.hasOwnProperty(property)) {
          tbData[property] = initObjectForEachLevel;
        }
      }
      return tbData;
    }

    function getChartOptions() {
      var chartOptions = {
        chart: {
          type: 'multiBarHorizontalChart',
          groupSpacing: 0.65,
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
      return chartOptions;
    }

    function isValidValues(value) {
      var isValid = typeof value === 'number' && !isNaN(value);
      return isValid;
    }

    function resetFilterFlags(topBottomObj) {
      for (var prop in topBottomObj) {
        if (topBottomObj.hasOwnProperty(prop)) {
          topBottomObj[prop].isFilterUpdateRequired = true;
        }
      }
    }

    function resetPerformanceDataFlags(topBottomObj) {
      topBottomObj.isFilterUpdateRequired = true;
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
      tbData.chartData.topValues = getChartDataForSortCategory(tbData.timePeriodFilteredData, tbData.topBottomIndices.topValues, trendPropertyName);

      tbData.chartData.bottomValues = getChartDataForSortCategory(tbData.timePeriodFilteredData, tbData.topBottomIndices.bottomValues, trendPropertyName);

      tbData.chartData.topTrends = getChartDataForSortCategory(tbData.timePeriodFilteredData, tbData.topBottomIndices.topTrends, trendPropertyName);

      tbData.chartData.bottomTrends = getChartDataForSortCategory(tbData.timePeriodFilteredData, tbData.topBottomIndices.bottomTrends, trendPropertyName);
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
        params.distributor = currentTopBottomFilters.distributors.id;
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
          if (myAccountsOnly === true) {
            storeIdCollection.splice(1, 1);
          } else {
            storeIdCollection.splice(0, 1);
          }
          params.store = storeIdCollection;
        } else {
          params.store = currentTopBottomFilters.stores.id;
        }
      }
      return params;
    }

    function resetFiltersForLevelsAboveCurrent(currentLevel, topBottomFiltersObj, topBottomObj) {
      if (!isValidValues(currentLevel.value)) {
        topBottomFiltersObj.distributors = '';
        topBottomFiltersObj.accounts = '';
        topBottomFiltersObj.subAccounts = '';
        topBottomFiltersObj.stores = '';
        resetPerformanceDataFlags(topBottomObj.distributors);
        resetPerformanceDataFlags(topBottomObj.accounts);
        resetPerformanceDataFlags(topBottomObj.subAccounts);
        resetPerformanceDataFlags(topBottomObj.stores);
      } else {
        switch (currentLevel.value) {
          case filtersService.accountFilters.accountTypesEnums.distributors:
            topBottomFiltersObj.accounts = '';
            topBottomFiltersObj.subAccounts = '';
            topBottomFiltersObj.stores = '';
            resetPerformanceDataFlags(topBottomObj.distributors);
            resetPerformanceDataFlags(topBottomObj.accounts);
            resetPerformanceDataFlags(topBottomObj.subAccounts);
            resetPerformanceDataFlags(topBottomObj.stores);
            break;
          case filtersService.accountFilters.accountTypesEnums.accounts:
            topBottomFiltersObj.subAccounts = '';
            topBottomFiltersObj.stores = '';
            resetPerformanceDataFlags(topBottomObj.accounts);
            resetPerformanceDataFlags(topBottomObj.subAccounts);
            resetPerformanceDataFlags(topBottomObj.stores);
            break;
          case filtersService.accountFilters.accountTypesEnums.subAccounts:
            topBottomFiltersObj.stores = '';
            resetPerformanceDataFlags(topBottomObj.subAccounts);
            resetPerformanceDataFlags(topBottomObj.stores);
            break;
        }
      }
    }

    function resetFilters(topBottomFilters) {
      var isReset = false;
      for (var prop in topBottomFilters) {
        if (topBottomFilters[prop] !== '') {
          topBottomFilters[prop] = '';
          if (!isReset) {
            isReset = true;
          }
        }
      }
      return isReset;
    }

    function getAcctTypeObjectBasedOnTabIndex(tabIndex, isGetNextLevel) {
      var currentAccountTypeLevel = null;
      if (isGetNextLevel === true) {
        // the tab index is 0  based whereas the values assigned to levels start from 1. So the current level value is tabIndex + 1. If I need the level after that I use tabIndex + 1 + 1.
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

    function checkForInconsistentIds(performanceData) {
      if (!performanceData.id || performanceData.id.toLowerCase() === 'id missing') {
        return true;
      } else {
        return false;
      }
    }

    function parseStoreFilterFromOpps(storeParams) {
      var storeFilter = null;
      if (storeParams) {
        var result = storeParams.split('|');
        if (result[0] && result[1]) {
          storeFilter = {
            storeId: result[0],
            storeName: result[1]
          };
        }
      }
      return storeFilter;
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
