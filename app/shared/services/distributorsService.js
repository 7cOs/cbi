'use strict';

module.exports = /*  @ngInject */
  function distributorsService($http, $q, apiHelperService) {

    return {
      getDistributors: getDistributors
    };

    /**
     * @name getDistributors
     * @desc Get distributors from API
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getDistributors() {
      var distributorsPromise = $q.defer(),
          url = apiHelperService.request('/v2/distributors/');

      $http.get(url, {
        headers: {}
      })
      .then(getDistributorsSuccess)
      .catch(getDistributorsFail);

      function getDistributorsSuccess(response) {
        distributorsPromise.resolve(response.data);
      }

      function getDistributorsFail(error) {
        distributorsPromise.reject(error);
      }

      return distributorsPromise.promise;
    }
  };
