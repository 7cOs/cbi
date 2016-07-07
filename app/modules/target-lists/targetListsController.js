'use strict';

module.exports =
  function targetListsController($scope, targetListService) {
    $scope.targetList = targetListService.get();
    $scope.opportunityList = targetListService.all();
  };
