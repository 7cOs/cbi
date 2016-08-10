'use strict';

module.exports =
  function helpController($rootScope, $scope, $state) {

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

  };
