module.exports = /*  @ngInject */
  function opportunitiesService($http, $q, distributorsService, apiHelperService, filtersService) {

    var model = {
      filterApplied: false,
      opportunities: [],
      opportunitiesSum: 0
    };

    var service = {
      model: model,
      getOpportunities: getOpportunities,
      createOpportunity: createOpportunity,
      getOpportunitiyFeedback: getOpportunityFeedback,
      createOpportunityFeedback: createOpportunityFeedback,
      deleteOpportunityFeedback: deleteOpportunityFeedback
    };

    return service;

    // Opportunities Methods
    /**
     * @name getOpportunities
     * @desc Get opportunities from API
     * @params {String} opportunityID - ID of opportunity [optional]
     * @returns {Object}
     * @memberOf orion.common.services
     */
    function getOpportunities(opportunityID) {
      // reset opportunities
      model.opportunitiesSum = 0;

      // get applied filters
      var filterPayload = filtersService.getAppliedFilters('opportunities');

      // create promise, build url based on filters and if there is an opp id
      var opportunitiesPromise = $q.defer(),
          url = opportunityID ? apiHelperService.request('/api/opportunities/' + opportunityID, filterPayload) : apiHelperService.request('/api/opportunities/', filterPayload);

      $http.get(url)
        .then(getOpportunitiesSuccess)
        .catch(getOpportunitiesFail);

      function getOpportunitiesSuccess(response) {
        // Group opportunities by store
        var newOpportunityArr = [],
            store,
            storePlaceholder;

        for (var i = 0; i < response.data.opportunities.length; i++) {
          var item = response.data.opportunities[i];

          // if its a new store
          if (!storePlaceholder || (storePlaceholder.address !== item.store.address || storePlaceholder.id !== item.store.id)) {
            // push previous store in newOpportunityArr
            if (i !== 0) newOpportunityArr.push(store);

            // create grouped store object
            store = angular.copy(item);
            store.highImpactSum = 0;
            store.depletionSum = 0;
            store.brands = [];

            // set store placeholder to new store
            storePlaceholder = item.store;

            // Set positive or negative label for trend values for store
            store.trend = store.currentYTDStoreVolume - store.lastYTDStoreVolume;
            if (store.trend > 0) {
              store.positiveValue = true;
            } else if (store.trend < 0) {
              store.negativeValue = true;
            }

            // create groupedOpportunities arr so all opportunities for one store will be in a row
            store.groupedOpportunities = [];
            store.groupedOpportunities.push(item);
          } else {
            store.groupedOpportunities.push(item);
          }

          // add brand to array
          store.brands.push(item.product.brand.toLowerCase());

          // sum high opportunities
          item.impact = item.impact.toLowerCase();
          if (item.impact === 'high') store.highImpactSum += 1;

          // sum depletions - not in api yet - WJAY 8/8
          // store.depletionSum += item.depletions

          // push last store into newOpportunityArr
          if (i + 1 === response.data.opportunities.length) newOpportunityArr.push(store);

          model.opportunitiesSum += 1;
        }; // end for each

        console.log(newOpportunityArr);

        opportunitiesPromise.resolve(newOpportunityArr);
      }

      function getOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * @name createOpportunity
     * @desc create an opportunity
     * @returns {Object}
     * @memberOf orion.common.services
     */
    function createOpportunity() {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/opportunities/'),
          payload = {};

      $http.post(url, payload, {
        headers: {}
      })
      .then(createOpportunitiesSuccess)
      .catch(createOpportunitiesFail);

      function createOpportunitiesSuccess(response) {
        console.log('[opportunitiesService.createOpportunity] response: ', response);
        opportunitiesPromise.resolve(response.data);
        // opportunitiesPromise.resolve(data.opportunitiesPostResponse); // Mock Data
      }

      function createOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback
     * @name getOpportunityFeedback
     * @desc Get opportunity feedback from API
     * @params {String} opportunityID - ID of opportunity [required]
     * @returns {Object}
     * @memberOf orion.common.services
     */
    function getOpportunityFeedback(opportunityID) {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/opportunities/' + opportunityID + '/feedback/');

      $http.get(url, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        opportunitiesPromise.resolve(response.data);
      }

      function getOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback
     * @name createOpportunityFeedback
     * @desc Create opportunity feedback from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [required]
     * @returns {Object}
     * @memberOf orion.common.services
     */
    function createOpportunityFeedback(url, opportunityID, data) {
      var opportunitiesPromise = $q.defer();
      var payload = {};

      $http.post(url, payload, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        opportunitiesPromise.resolve(response.data);
      }

      function getOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback/{feedbackId}
     * @name deleteOpportunityFeedback
     * @desc Delete opportunity feedback from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [required]
     * @params {String} feedbackID - ID of feedback [required]
     * @returns {Object}
     * @memberOf orion.common.services
     */
    function deleteOpportunityFeedback(url, opportunityID, feedbackID) {
      var opportunitiesPromise = $q.defer(),
          payload = {};

      $http.post(url, payload)
        .then(deleteOpportunitiesFeedbackSuccess)
        .catch(deleteOpportunitiesFeedbackFail);

      function deleteOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        opportunitiesPromise.resolve(response.data);
      }

      function deleteOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }
  };
