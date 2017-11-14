'use strict';

module.exports = /*  @ngInject */
  function opportunityFiltersService($http, $q, apiHelperService, filtersService) {

    var service = {
      deleteOpportunityFilter: deleteOpportunityFilter,
      updateOpportunityFilter: updateOpportunityFilter
    };

    return service;

    /**
     * @name deleteOpportunityFilter
     * @desc delete an opportunity filter
     * @params {String} filterId - id of filter
     * @returns {Object} - Status object
     * @memberOf cf.common.services
     */
    function deleteOpportunityFilter(filterId) {
      const opportunityFilterPromise = $q.defer();
      const url = apiHelperService.request('/v2/opportunityFilters/' + filterId);

      $http.delete(url)
        .then(deleteOpportunityFilterSuccess)
        .catch(deleteOpportunityFilterFail);

      function deleteOpportunityFilterSuccess(response) {
        opportunityFilterPromise.resolve(response.data);
      }

      function deleteOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }

    /**
     * @name updateOpportunityFilter
     * @desc update filter str of a saved opp filter
     * @params {String} filterId - id of filter
     * @returns {Object} - Status object
     * @memberOf cf.common.services
     */
    function updateOpportunityFilter(filterId, payloadKey, payloadValue) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunityFilters/' + filterId),
          payload = {};

      payload['filterString'] = encodeURIComponent(filtersService.model.appliedFilter.appliedFilter);
      payload[payloadKey] = payloadValue;

      $http.patch(url, payload)
        .then(updateOpportunityFilterSuccess)
        .catch(updateOpportunityFilterFail);

      function updateOpportunityFilterSuccess(response) {
        console.log('[notificationsService.updateOpportunityFilter] response: ', response);
        opportunityFilterPromise.resolve(response);
      }

      function updateOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }
  };
