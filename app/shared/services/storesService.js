'use strict';

module.exports = /*  @ngInject */
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
     * @memberOf cf.common.services
     */
    function getStores(tdlinxNumber) {
      var storesPromise = $q.defer(),
          params = {
            type: 'stores',
            /* lowerRightBound: '38.820450,-77.050552',
            upperLeftBound: '44.986656,-93.258133' */
            lowerRightBound: '47,-122',
            upperLeftBound: '46,-120'
          },
          // {{url}}/v2/stores?signature={{generatedSignature}}&apiKey={{apiKey}}&upperLeftBound=47,-122&lowerRightBound=46,-120`
          url = tdlinxNumber ? apiHelperService.request('/api/stores/' + tdlinxNumber) : apiHelperService.request('/api/stores', params);

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        // response.data = data; // mock data

        /* for (var i = 0; i < 6; i++) {
          if (response.data[i].store_rank_wine.delta > 0) {
            response.data[i].positiveValue = true;
          } else if (response.data[i].store_rank_wine.delta < 0) {
            response.data[i].negativeValue = true;
          }
        } */
        storesPromise.resolve(response.data.slice(0, 5));
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
  };
