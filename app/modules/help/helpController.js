'use strict';

module.exports = /*  @ngInject */
  function helpController($rootScope, $scope, $state, title) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    title.setTitle($state.current.title);

    // Defaults
    vm.helpPage = 'This can be removed when vm is used for something';

  };
