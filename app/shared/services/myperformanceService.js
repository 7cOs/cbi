'use strict';

module.exports = /*  @ngInject */
  function myperformanceService($filter, filtersService) {

    var service = {
      getTopBottomDataSorted: getTopBottomDataSorted,
      getChartData: getChartData,
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
      if (arrToGetIndex === originalArr) {
        angular.forEach(arrToGetIndex, function(obj) {
          indexPos = originalArr.indexOf(obj);
          if (indexPos !== -1) {
            indexedArr.push(indexPos);
          }
        });
      } else {
        for (var i = 0; i < originalArr.length; i++) {
          indexedArr.push(i);
        }
      }

      return indexedArr;
    }

    function getSortedObjects(tbData, queryLimit, propertyName) {
      var sortedList = {
            topValues: [],
            bottomValues: []
          },
          valuesArr, tempArr = [];
      console.log('tbDataPreSort', tbData);
      valuesArr = $filter('orderBy')(tbData, function(data) {
        return data.measure[propertyName];
      });
      console.log('tbDataAfterSort', valuesArr);
      var len = valuesArr.length;
      if (len > queryLimit) {
        tempArr = valuesArr.slice(0, queryLimit - 1);
        sortedList.topValues = getIndexPositionsArr(valuesArr, tempArr);
        tempArr = valuesArr.slice(len - queryLimit, len);
        sortedList.bottomValues = getIndexPositionsArr(valuesArr, tempArr);
      } else {
        tempArr =  getIndexPositionsArr(valuesArr, valuesArr);
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
      currentTbData.chartData = getChartData(currentTbData.timePeriodFilteredData, trendOption, categoryType);
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
      for (var prop in topBottomObj) {
        if (topBottomObj.hasOwnProperty(prop)) {
          topBottomObj[prop].isFilterUpdateRequired = true;
          topBottomObj[prop].isPerformanceDataUpdateRequired = true;
        }
      }
    }

    function getChartData(filteredPerformaceData, trendType, categoryType) {
      var chartData = [{'values': null}], propertyName, categoryChartData = [], obj;
      angular.forEach(filteredPerformaceData, function (data) {
        propertyName = filtersService.trendPropertyNames[categoryType.propertyName][trendType.value - 1];
        obj = {
          'label': data.title,
          'value': isValidValues(Number(data.measure[propertyName])) ? Math.round(data.measure[propertyName]) : null
        };
        categoryChartData.push(obj);
      });
      chartData[0].values = categoryChartData;
      // console.log('chartData', chartData);
      return chartData;
    }
  };
