/* module.exports =
  function storesService() {
    return {
      get: function() {
        return {id: 0};
      }
    };
  };*/

'use strict';

module.exports =
  function storesService($http, $q) {
    var data = [{
      'account': 'Walmart',
      'sub_account': 'Walmart Northwest',
      'tdlinx_number': '2063528',
      'store_name': 'PITTSFIELD RESTAURANT',
      'store_number': 'UNKNOWN',
      'address': '55 E WASHINGTON ST',
      'city': 'CHICAGO',
      'state': 'IL',
      'postal_cd': '606022103',
      'phone_no': '3126411806',
      'latitude': 41.8831,
      'longitude': -87.6259,
      'last_update': 201512,
      'high_impact': 'N',
      'unsold_account': 'N',
      'premise_type': 'ON PREMISE',
      'trade_classification': 'CASUAL DINING',
      'planning_group': 'REGIONAL',
      'store_rank_wine': {
        'rank': 3,
        'delta': -21.3576,
        'depl_fytd': 1.496,
        'depl_pts_fytd': 8.976,
        'depl_l12_mth_ty': 1.496,
        'depl_pts_fytd_1ya': 30.3336
      }
    }, {
      'account': 'Aramark',
      'sub_account': 'Aramark Midwest',
      'tdlinx_number': '2716566',
      'store_name': 'ARAMARK HARRIS BANK',
      'store_number': '1525',
      'address': '111 W MONROE ST',
      'city': 'CHICAGO',
      'state': 'IL',
      'postal_cd': '606034096',
      'phone_no': '13122936006',
      'latitude': 41.8807,
      'longitude': -87.6311,
      'last_update': 201512,
      'high_impact': 'N',
      'unsold_account': 'N',
      'premise_type': 'ON PREMISE',
      'trade_classification': 'CATERER',
      'planning_group': 'OPSA',
      'store_rank_wine': {
        'rank': 3,
        'delta': -297.32,
        'depl_fytd': 0,
        'depl_pts_fytd': 0,
        'depl_l12_mth_ty': 0,
        'depl_pts_fytd_1ya': 297.32
      }
    }];

    return {
      all: function() {
        return data;
      },
      getStores: getStores,
      getStoreOpportunities: getStoreOpportunities
    };

    /**
     * @name getStores
     * @desc Get stores from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} tdlinxNumber - store id [optional]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStores(url, tdlinxNumber) {
      var storesPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        console.log('[storesService.getStores] response: ', response);
        // storesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        storesPromise.resolve(data);
      }

      function getStoresFail(error) {
        storesPromise.resolve(error);
      }

      return storesPromise.promise;
    }

    /**
     * @name getStoreOpportunities
     * @desc Get store opportunities from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} tdlinxNumber - store id [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStoreOpportunities(url, tdlinxNumber) {
      var storesOpportunitiesPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getStoreOpportunitiesSuccess)
      .catch(getStoreOpportunitiesFail);

      function getStoreOpportunitiesSuccess(response) {
        console.log('[storesService.getStoreOpportunities] response: ', response);
        // storesOpportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        storesOpportunitiesPromise.resolve(data);
      }

      function getStoreOpportunitiesFail(error) {
        storesOpportunitiesPromise.resolve(error);
      }

      return storesOpportunitiesPromise.promise;
    }
  };
