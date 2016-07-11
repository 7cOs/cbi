'use strict';

module.exports =
  function opportunitiesController($scope, $log, opportunitiesService) {
    $scope.getProducts = getProducts;
    $scope.toggle = toggle;
    $scope.exists = exists;
    $scope.isIndeterminate = isIndeterminate;
    $scope.isChecked = isChecked;

    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    $scope.items = [];
    $scope.selected = [];

    $scope.$on('opportunities:onReady', function () {
      $scope.opportunities[0].isExpanded = true;
    });

    function exists(item, list) {
      return list.indexOf(item) > -1;
    };

    function isIndeterminate() {
      return ($scope.selected.length !== 0 && $scope.selected.length !== $scope.items.length);
    };

    function isChecked() {
      return $scope.selected.length === $scope.items.length;
    };

    function getProducts(id) {
      $log.info('ID is ' + id);
    };

    function toggle(item, list) {
      $log.info('Item is ' + item);
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };
  };
