'use strict';

module.exports =
  function scorecardsController($rootScope, $scope, $state, myperformanceService, opportunitiesService) {
    var vm = this;

    vm.isNegative = isNegative;
    vm.isPositive = isPositive;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);
    $rootScope.pageTitle = $state.current.title;

    vm.performanceData = myperformanceService.model();
    vm.depletionsData = myperformanceService.depletionModel();
    vm.distributionData = myperformanceService.distributionModel();
    vm.filters = myperformanceService.filter();

    function isNegative(salesData) {
      if (salesData >= 0) {
        return false;
      }
      return true;
    };

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };
  };
