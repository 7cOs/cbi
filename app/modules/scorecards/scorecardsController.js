'use strict';

module.exports = /*  @ngInject */
  function scorecardsController($rootScope, $scope, $state, myperformanceService, opportunitiesService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.performanceData = myperformanceService.model();
    vm.depletionsData = myperformanceService.depletionModel();
    vm.distributionData = myperformanceService.distributionModel();
    vm.filters = myperformanceService.filter();

    // Expose public methods
    vm.isPositive = isPositive;

    // **************
    // PUBLIC METHODS
    // **************

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };
  };
