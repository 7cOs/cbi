'use strict';

module.exports =
  function targetListsController($rootScope, $state, chipsService, filtersService) {
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services available in View
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;

  };
