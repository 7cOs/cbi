'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, filtersService, myperformanceService, targetListService) {
    var vm = this;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    vm.filter = filtersService.model;

    vm.performanceData = myperformanceService.model();
    vm.namedFilters = targetListService.list();
    vm.sharedFilters = targetListService.sharedList();

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

    $scope.ratio = function(closed, total) {
      var result = closed / total * 100;
      return result;
    };
  };
