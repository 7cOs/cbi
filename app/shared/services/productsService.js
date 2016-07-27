'use strict';

module.exports =
  function productsService($http, $q, apiHelperService) {

    return {
      getProducts: getProducts
    };

    /**
     * @name getProducts
     * @desc Get products from API
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getProducts() {
      var productsPromise = $q.defer(),
          url = apiHelperService.request('/api/products/');

      $http.get(url, {
        headers: {}
      })
      .then(getProductsSuccess)
      .catch(getProductsFail);

      function getProductsSuccess(response) {
        console.log('[productsService.getProducts] response: ', response);
        productsPromise.resolve(response.data);
      }

      function getProductsFail(error) {
        productsPromise.resolve(error);
      }

      return productsPromise.promise;
    }
  };
