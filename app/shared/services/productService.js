'use strict';

// productService.$inject = ['$http', 'q'];

module.exports =
  function productService($http, $q) {
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
      all: function() {
        return data;
      },
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
        return response;
      }

      function getProductsFail(error) {
        return error;
      }

      return productsPromise;
    }
  };
