'use strict';

module.exports =
  function storesService($http, $q, apiHelperService) {

    return {
      getStores: getStores,
      getStoreOpportunities: getStoreOpportunities
    };

    /**
     * @name getStores
     * @desc Get stores from API
     * @params {String} tdlinxNumber - store id [optional]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStores(tdlinxNumber) {
      var storesPromise = $q.defer(),
          url = tdlinxNumber ? apiHelperService.request('/api/stores/' + tdlinxNumber) : apiHelperService.request('/api/stores/');

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        console.log('[storesService.getStores] response: ', response);
        storesPromise.resolve(response.data);
      }

      function getStoresFail(error) {
        storesPromise.resolve(error);
      }

      return storesPromise.promise;
    }

    /**
     * @name getStoreOpportunities
     * @desc Get store opportunities from API
     * @params {String} tdlinxNumber - store id [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStoreOpportunities(tdlinxNumber) {
      var storesOpportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/stores/' + tdlinxNumber + '/opportunities');

      $http.get(url, {
        headers: {}
      })
      .then(getStoreOpportunitiesSuccess)
      .catch(getStoreOpportunitiesFail);

      function getStoreOpportunitiesSuccess(response) {
        console.log('[storesService.getStoreOpportunities] response: ', response);
        storesOpportunitiesPromise.resolve(response.data);
      }

      function getStoreOpportunitiesFail(error) {
        storesOpportunitiesPromise.resolve(error);
      }

      return storesOpportunitiesPromise.promise;
    }
  };
