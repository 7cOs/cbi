'use strict';

module.exports = /*  @ngInject */
  function opportunityFiltersService($http, $q, apiHelperService) {

    var service = {
      deleteOpportunityFilter: deleteOpportunityFilter
    };

    return service;

    /**
     * @name deleteOpportunityFilter
     * @desc mark a notification as read
     * @params {String} filterId - id of filter
     * @returns {Object} - Status object
     * @memberOf cf.common.services
     */
    function deleteOpportunityFilter(filterId) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('api/opportunityFilters/' + filterId);

      $http.delete(url)
        .then(deleteOpportunityFilterSuccess)
        .catch(deleteOpportunityFilterFail);

      function deleteOpportunityFilterSuccess(response) {
        console.log('[notificationsService.deleteOpportunityFilter] response: ', response);
        opportunityFilterPromise.resolve(response.data);
      }

      function deleteOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }
  };
