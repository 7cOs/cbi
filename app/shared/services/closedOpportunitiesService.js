'use strict';

module.exports = /*  @ngInject */
  function closedOpportunitiesService($q, $http, apiHelperService) {

    var service = {
      closeOpportunity: closeOpportunity
    };

    return service;

    /**
     * @name closeOpportunity
     * @desc closes opportunity
     * @params {String} oId - opportunity id
     * @returns promise
     * @memberOf cf.common.services
     */
    function closeOpportunity(oId) {
      var closeOpportunityPromise = $q.defer(),
          url = apiHelperService.request('/closedOpportunities/' + oId);

      $http.patch(url)
        .then(closeOpportunitySuccess)
        .catch(closeOpportunityFail);

      function closeOpportunitySuccess(response) {
        closeOpportunityPromise.resolve(response.data);
      }

      function closeOpportunityFail(error) {
        closeOpportunityPromise.resolve(error);
      }

      return closeOpportunityPromise.promise;
    }

  };
