'use strict';

module.exports =
  function opportunityFiltersService($http, $q, apiHelperService) {

    var tempData = {
      deleteOpportunityFilterPayload: '',
      deleteOpportunityFilterResponse: {'status': 200}
    };

    return {
      deleteOpportunityFilter: deleteOpportunityFilter
    };

    /**
     * @name deleteOpportunityFilter
     * @desc mark a notification as read
     * @params {String} filterId - id of filter
     * @returns {Object} - Status object
     * @memberOf orion.common.services
     */
    function deleteOpportunityFilter(filterId) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.formatQueryString(),
          payload = tempData.deleteOpportunityFilterPayload;

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteOpportunityFilterSuccess)
      .catch(deleteOpportunityFilterFail);

      function deleteOpportunityFilterSuccess(response) {
        console.log('[notificationsService.deleteOpportunityFilter] response: ', response);
        // opportunityFilterPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunityFilterPromise.resolve(tempData.deleteOpportunityFilterResponse);
      }

      function deleteOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }
  };
