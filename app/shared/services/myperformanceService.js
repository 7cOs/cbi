'use strict';

module.exports = /*  @ngInject */
  function myperformanceService($filter, filtersService) {

    var service = {
      getTopBottomDataSorted: getTopBottomDataSorted,
      getChartOptions: getChartOptions,
      updateDataForCurrentTopDownLevel: updateDataForCurrentTopDownLevel,
      initDataForAllTbLevels: initDataForAllTbLevels,
      resetFilterFlags: resetFilterFlags,
      resetPerformanceDataFlags: resetPerformanceDataFlags
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
      valuesArr = $filter('orderBy')(tbData, function(data) {
        return data.measure[propertyName];
      });
      var len = valuesArr.length;
      if (len > queryLimit) {
        tempArr = valuesArr.slice(0, queryLimit);
        sortedList.topValues = getIndexPositionsArr(tbData, tempArr);

        tempArr = valuesArr.slice(len - queryLimit, len);
        sortedList.bottomValues = getIndexPositionsArr(tbData, tempArr);
      } else {
        tempArr =  getIndexPositionsArr(tbData, valuesArr);
        sortedList.topValues = tempArr;
        sortedList.bottomValues = tempArr;
      }
      return sortedList;
    }

    function getTopBottomDataSorted(topBottomData, trendType, categoryType) {
      var sortedList = {
            topValues: [],
            bottomValues: [],
            topTrends: [],
            bottomTrends: []
          }, queryLimit = 10;
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
      console.log('currentTbData', currentTbData);
      setUpdatedDataIndicator(currentTbData, false, false);
      return currentTbData;
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
          x: function(d) { return d.label; },
          y: function(d) { return d.value; },
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
            if (isValidValues(Number(d))) {
              return d + '%';
            } else {
              return;
            }
          },
          tooltip: {
            valueFormatter: function(d) {
              if (isValidValues(Number(d))) {
                return d + '%';
              } else {
                return;
              }
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

      angular.forEach(matchedArr, function (data) {
        obj = {
          'label': data.title
        };
        if (isValidValues(Number(data.measure[propName]))) {
          obj.value = Math.round(data.measure[propName]);
        }
        categoryChartData.push(obj);
      });
      chartData[0].values = categoryChartData;
      return chartData;
    }
  };
