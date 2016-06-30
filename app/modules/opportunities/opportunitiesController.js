'use strict';

module.exports =
  function opportunitiesController($scope, opportunitiesService) {
    $scope.opportunity = opportunitiesService.get();
  };
