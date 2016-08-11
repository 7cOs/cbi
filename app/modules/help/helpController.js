'use strict';

module.exports =
  function helpController($rootScope, $scope, $state) {

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

  };
