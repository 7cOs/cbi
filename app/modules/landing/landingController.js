'use strict';

module.exports =
  function accountsController($scope, opportunitiesService) {
    $scope.filter = opportunitiesService.model();
  };
