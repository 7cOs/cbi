'use strict';

module.exports =
  function productsService($http, $q) {
    var data = [{
      'id': '9878dj',
      'name': 'Product',
      'type': 'package',
      'brand': 'Brand Name',
      'description': 'Product description Lorem ipsum sit dolor amet',
      'price': 12.11,
      'quantity': 233
    }, {
      'id': '9878dj',
      'name': 'Product',
      'type': 'package',
      'brand': 'Brand Name',
      'description': 'Product description Lorem ipsum sit dolor amet',
      'price': 12.11,
      'quantity': 233
    }];

    return {
      getProducts: getProducts
    };

    /**
     * @name getProducts
     * @desc Get products from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getProducts(url) {
      var productsPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getProductsSuccess)
      .catch(getProductsFail);

      function getProductsSuccess(response) {
        console.log('[productsService.getProducts] response: ', response);
        // productsPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        productsPromise.resolve(data);
      }

      function getProductsFail(error) {
        productsPromise.resolve(error);
      }

      return productsPromise.promise;
    }
  };
