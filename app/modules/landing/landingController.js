'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, filtersService, myperformanceService, targetListService) {
    var vm = this;

    // Map public methods to scope
    vm.isNegative = isNegative;
    vm.isPositive = isPositive;
    vm.ratio = ratio;

    vm.filter = filtersService.model;
    vm.performanceData = myperformanceService.model();
    vm.namedFilters = targetListService.list();
    vm.sharedFilters = targetListService.sharedList();

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

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

    function ratio(closed, total) {
      var result = closed / total * 100;
      return result;
    };
  };
