'use strict';

module.exports =
  function scorecardsController($scope, myperformanceService, opportunitiesService) {

    $scope.filter = opportunitiesService.model();
  };
