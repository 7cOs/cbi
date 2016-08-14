'use strict';

module.exports =
  function scorecardsController($rootScope, $scope, $state, myperformanceService, opportunitiesService) {
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    vm.isPositive = isPositive;

    vm.performanceData = myperformanceService.model();
    vm.depletionsData = myperformanceService.depletionModel();
    vm.distributionData = myperformanceService.distributionModel();
    vm.filters = myperformanceService.filter();

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };
  };
