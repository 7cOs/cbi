'use strict';

module.exports =
  function accountsController($rootScope, $scope, $state, opportunitiesService) {

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    $scope.filter = opportunitiesService.model();
  };
