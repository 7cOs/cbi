'use strict';

module.exports =
  function scorecardsController($rootScope, $scope, $state, myperformanceService, opportunitiesService) {

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

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
