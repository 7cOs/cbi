'use strict';

module.exports = /*  @ngInject */
  function myperformanceService($filter, filtersService) {

    var service = {
      getFilteredTopBottomData: getFilteredTopBottomData,
      getTopBottomDataSorted: getTopBottomDataSorted,
      getChartData: getChartData,
      getChartOptions: getChartOptions
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

    function getTopBottomDataSorted(topBottomData, trendType, categoryType) {
      var sortedList = {
            topValues: [],
            bottomValues: [],
            topTrends: [],
            bottomTrends: []
          }, queryLimit = 10,
          valuesArr, trendsArr, tempArr = [];

      valuesArr = $filter('orderBy')(topBottomData, categoryType.propertyName);
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
      trendsArr = $filter('orderBy')(topBottomData, filtersService.trendPropertyNames[categoryType.propertyName][trendType.value - 1]);
      if (len > queryLimit) {
        tempArr = trendsArr.slice(0, queryLimit - 1);
        sortedList.topTrends = getIndexPositionsArr(valuesArr, tempArr);
        tempArr = trendsArr.slice(len - queryLimit, len);
        sortedList.bottomTrends = tempArr;
      } else {
        tempArr =  getIndexPositionsArr(trendsArr, trendsArr);
        sortedList.topTrends = tempArr;
        sortedList.bottomTrends = tempArr;
      }
      // console.log('sortedList', sortedList);
      return sortedList;
    }

    /**
      * Gets an array of data matching the distirubution or depletion time period
      * @param {Object} topBottomData Package or Brand
      * @param {String} categoryType depletions or Distribution
      * @param {String} depletionOption L90, L120 etc
      * @returns {Object} currentTrendVal Returns the trend display value as string and the actual float value
      */
    function getFilteredTopBottomData(topBottomData, categoryType, depletionOption, distirbutionOption) {
      var data, filteredData = [], matchedMeasure = null;
      switch (categoryType.value) {
        case filtersService.accountFilters.accountMarketsEnums.depletions:
          for (var i = 0, len = topBottomData.length; i < len; i++) {
            data = topBottomData[i];
            matchedMeasure = data.measures.filter(function (measure) {
              return measure.timeframe === depletionOption.name;
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
          break;
        default:
          for (var j = 0, length = topBottomData.length; j < length; j++) {
            data = topBottomData[i];
            matchedMeasure = data.measures.filter(function (measure) {
              return measure.timeframe === distirbutionOption.name;
            });
            if (matchedMeasure[0]) {
              var distirbutionObj = {
                title: data.name,
                type: data.type,
                measure: matchedMeasure[0]
              };
              filteredData.push(distirbutionObj);
            }
          }
          break;
      }
      return filteredData;
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
