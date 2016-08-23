'use strict';

module.exports = /*  @ngInject */
  function helpController($rootScope, $scope, $state) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Defaults
    vm.helpPage = 'This can be removed when vm is used for something';

  };
