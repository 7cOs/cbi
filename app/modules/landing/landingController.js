'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, filtersService) {
    var vm = this;

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    vm.filter = filtersService.model;
  };
