'use strict';

module.exports =
  function searchService($http, $q, apiHelperService) {

    return {
      getUsers: getUsers,
      getProducts: getProducts,
      getStores: getStores,
      getDistributors: getDistributors
    };

    /**
     * @name getUsers
     * @desc Get users from API via Inline Search
     * @returns [array]
     * @memberOf orion.common.services
     */
    function getUsers(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/api/search/users?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url, {
        headers: {}
      })
      .then(getUsersSuccess)
      .catch(getUsersFail);

      function getUsersSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getUsersFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }

    /**
     * @name getProducts
     * @desc Get products from API via Inline Search
     * @returns [array]
     * @memberOf orion.common.services
     */
    function getProducts(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/api/search/products?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url, {
        headers: {}
      })
      .then(getProductsSuccess)
      .catch(getProductsFail);

      function getProductsSuccess(response) {
        searchPromise.resolve(response.data.products);
      }

      function getProductsFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }

    /**
     * @name getStores
     * @desc Get stores from API via Inline Search
     * @returns [array]
     * @memberOf orion.common.services
     */
    function getStores(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/api/search/stores?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getStoresFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }

    /**
     * @name getDistributors
     * @desc Get distributors from API via Inline Search
     * @returns [array]
     * @memberOf orion.common.services
     */
    function getDistributors(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/api/search/distributors?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url, {
        headers: {}
      })
      .then(getDistributorsSuccess)
      .catch(getDistributorsFail);

      function getDistributorsSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getDistributorsFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }
  };
