'use strict';

module.exports = /*  @ngInject */
  function storesService($http, $q, apiHelperService) {

    return {
      getStores: getStores,
      getStoreOpportunities: getStoreOpportunities,
      getItemAuthorizations: getItemAuthorizations,
      getFeatures: getFeatures
    };

    /**
     * @name getStores
     * @desc Get stores from API
     * @params {String} tdlinxNumber - store id [optional]
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getStores(tdlinxNumber) {
      const storesPromise = $q.defer();
      const url = apiHelperService.request('/v2/stores/' + tdlinxNumber);

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {

        let store = response.data;
        store.id = store.tdlinx_number;
        store.name = store.store_name;
        store.storeNumber = store.store_number;

        const premiseTypeMapping = {
          'OFF PREMISE': 'off',
          'ON PREMISE': 'on'
        };

        store.premiseTypeDesc = premiseTypeMapping[store.premise_type] || null;

        storesPromise.resolve(store);
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
     * @memberOf cf.common.services
     */
    function getStoreOpportunities(tdlinxNumber) {
      var storesOpportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/stores/' + tdlinxNumber + '/opportunities');

      $http.get(url, {
        headers: {}
      })
      .then(getStoreOpportunitiesSuccess)
      .catch(getStoreOpportunitiesFail);

      function getStoreOpportunitiesSuccess(response) {
        storesOpportunitiesPromise.resolve(response.data);
      }

      function getStoreOpportunitiesFail(error) {
        storesOpportunitiesPromise.resolve(error);
      }

      return storesOpportunitiesPromise.promise;
    }

    /**
     * @name getItemAuthorizations
     * @desc Get all item authorizations within a store from API
     * @params {String} tdlinxNumber - store id [required]
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getItemAuthorizations(tdlinxNumber) {
      var itemAuthorizationsPromise = $q.defer(),
          url = apiHelperService.request('/v2/stores/' + tdlinxNumber + '/itemAuthorizations');

      $http.get(url)
        .then(getItemAuthorizationsSuccess)
        .catch(getItemAuthorizationsFail);

      function getItemAuthorizationsSuccess(response) {
        itemAuthorizationsPromise.resolve(response.data);
      }

      function getItemAuthorizationsFail(error) {
        itemAuthorizationsPromise.resolve(error);
      }

      return itemAuthorizationsPromise.promise;
    }

    /**
     * @name getFeatures
     * @desc Get all product features within a store from API
     * @params {String} tdlinxNumber - store id [required]
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getFeatures(tdlinxNumber) {
      var getFeaturesPromise = $q.defer(),
          url = apiHelperService.request('/v2/stores/' + tdlinxNumber + '/features');

      $http.get(url, {
        headers: {}
      })
      .then(getFeaturesSuccess)
      .catch(getFeaturesFail);

      function getFeaturesSuccess(response) {
        getFeaturesPromise.resolve(response.data);
      }

      function getFeaturesFail(error) {
        getFeaturesPromise.resolve(error);
      }

      return getFeaturesPromise.promise;
    }
  };
