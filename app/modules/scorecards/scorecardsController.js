'use strict';

module.exports =
  function scorecardsController($scope, myperformanceService, opportunitiesService) {

    $scope.performanceData = myperformanceService.model();
    $scope.depletionsData = myperformanceService.depletionModel();
    $scope.distributionData = myperformanceService.distributionModel();
    $scope.filters = myperformanceService.filter();

    $scope.isNegative = function(salesData) {
      if (salesData >= 0) {
        return false;
      }
      return true;
    };

    $scope.isPositive = function(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };
  };
