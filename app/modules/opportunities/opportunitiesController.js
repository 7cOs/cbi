'use strict';

module.exports =
  function opportunitiesController($scope, $log, opportunitiesService) {
    $scope.getProducts = getProducts;
    $scope.openProducts = openProducts;

    $scope.opportunities = opportunitiesService.get('opportunities');
    $scope.products = opportunitiesService.get('products');

    function getProducts(id) {
      $log.info('ID is ' + id);
    }
  };
