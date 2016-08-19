'use strict';

module.exports =
  function searchService($http, $q, apiHelperService) {

    return {
      getDistributors: getDistributors
    };

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
