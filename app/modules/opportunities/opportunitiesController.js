'use strict';

module.exports =
  function opportunitiesController($scope, $log, opportunitiesService) {
    $scope.toggle = toggle;
    $scope.exists = exists;
    $scope.isChecked = isChecked;
    $scope.toggleAll = toggleAll;
    $scope.expandCallback = expandCallback;
    $scope.collapseCallback = collapseCallback;

    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    $scope.selected = [];
    $scope.expandedOpportunities = [];

    function expandCallback(item) {
      $scope.expandedOpportunities.push(item);
    };

    function collapseCallback(item) {
      var index = $scope.expandedOpportunities.indexOf(item);
      if (index > -1) {
        $scope.expandedOpportunities.splice(index, 1);
      };
    };

    function exists(item, list) {
      return list.indexOf(item) > -1;
    };

    function isChecked() {
      return $scope.selected.length === $scope.opportunities.length;
    };

    function toggleAll() {
      if ($scope.selected.length === $scope.opportunities.length) {
        $scope.selected = [];
      } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
        $scope.selected = $scope.opportunities.slice(0);
      }
    };

    function toggle(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };
  };
