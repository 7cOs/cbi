'use strict';

module.exports = /*  @ngInject */
  function searchService($http, $q, $state, apiHelperService, userService) {

    var model = {
      searchActive: false
    };

    var service = {
      model: model,
      setSearchActive: setSearchActive,
      getUsers: getUsers,
      getProducts: getProducts,
      getStores: getStores,
      getDistributors: getDistributors,
      getChains: getChains,
      getLocations: getLocations
    };

    return service;

    function setSearchActive(value) {
      model.searchActive = value;
    }

    /**
     * @name getUsers
     * @desc Get users from API via Inline Search
     * @returns [array]
     * @memberOf cf.common.services
     */
    function getUsers(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/v2/search/users?searchTerm=' + encodeURIComponent(searchTerm));

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
     * @memberOf cf.common.services
     */
    function getProducts(searchTerm, variety) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/v2/search/products?searchTerm=' + encodeURIComponent(searchTerm));

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
     * @params searchTerm - String - term to search
     * @returns [array]
     * @memberOf cf.common.services
     */
    function getStores(searchTerm) {
      var searchPromise = $q.defer(),
          url = '';

      // Send down allVersions=true when using /search/stores from the my performance page when the user is non-corporate.
      if (!userService.model.currentUser.corporateUser && $state.current.name === 'accounts') {
        url = apiHelperService.request('/v2/search/stores?allVersions=true&searchTerm=' + encodeURIComponent(searchTerm));
      } else {
        url = apiHelperService.request('/v2/search/stores?allVersions=true&searchTerm=' + encodeURIComponent(searchTerm));
      }

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getStoresFail(error) {
        console.warn('[searchService.getStoresFail.error] ', error);
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }

    /**
     * @name getDistributors
     * @desc Get distributors from API via Inline Search
     * @returns [array]
     * @memberOf cf.common.services
     */
    function getDistributors(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/v2/search/distributors?searchTerm=' + encodeURIComponent(searchTerm));

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

    /**
     * @name getChains
     * @desc Get chains from API via Inline Search
     * @returns [array]
     * @memberOf cf.common.services
     */
    function getChains(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/v2/search/chains?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url, {
        headers: {}
      })
      .then(getChainsSuccess)
      .catch(getChainsFail);

      function getChainsSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getChainsFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }

    /**
     * @name getLocations
     * @desc Get locations from API via Inline Search
     * @returns [array]
     * @memberOf cf.common.services
     */
    function getLocations(searchTerm) {
      var searchPromise = $q.defer(),
          url = apiHelperService.request('/v2/search/locations?searchTerm=' + encodeURIComponent(searchTerm));

      $http.get(url)
        .then(getLocationsSuccess)
        .catch(getLocationsFail);

      function getLocationsSuccess(response) {
        searchPromise.resolve(response.data);
      }

      function getLocationsFail(error) {
        searchPromise.reject(error);
      }

      return searchPromise.promise;
    }
  };
