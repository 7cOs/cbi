'use strict';

module.exports = /*  @ngInject */
  function targetListsController($rootScope, $state, chipsService, filtersService, listsApiService, title) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    title.setTitle($state.current.title);

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.listsApiService = listsApiService;
  };
