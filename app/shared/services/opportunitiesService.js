module.exports = /*  @ngInject */
  function opportunitiesService($http, $q, apiHelperService, filtersService, ieHackService) {

    var model = {
      filterApplied: false,
      opportunities: [],
      opportunityId: null,
      noOpportunitiesFound: false
    };

    var service = {
      model: model,
      getAndUpdateStoresWithOpportunities: getAndUpdateStoresWithOpportunities,
      getFormattedStoresWithOpportunities: getFormattedStoresWithOpportunities,
      getFormattedOpportunities: getFormattedOpportunities,
      getOpportunities: getOpportunities,
      getFormattedSingleOpportunity: getFormattedSingleOpportunity,
      getOpportunitiesHeaders: getOpportunitiesHeaders,
      groupOpportunitiesByStore: groupOpportunitiesByStore,
      populateOpportunityData: populateOpportunityData,
      createOpportunity: createOpportunity,
      getOpportunitiyFeedback: getOpportunityFeedback,
      createOpportunityFeedback: createOpportunityFeedback,
      deleteOpportunityFeedback: deleteOpportunityFeedback,
      clearOpportunitiesModel: clearOpportunitiesModel,
      setPaginationModel: setPaginationModel
    };

    return service;

    // Opportunities Methods
    /**
     * @name getAndUpdateStoresWithOpportunities
     * @desc Get opportunities from API and update the model
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getAndUpdateStoresWithOpportunities() {
      const opportunitiesPromise = $q.defer();

      service.getFormattedStoresWithOpportunities()
      .then(storesWithOpportunities => {
        service.model.opportunities = storesWithOpportunities;

        opportunitiesPromise.resolve(storesWithOpportunities);
      })
      .catch(error => opportunitiesPromise.reject(error));

      return opportunitiesPromise.promise;
    }

    /**
     * @name getFormattedStoresWithOpportunities
     * @desc Get opportunities from API and update the model, massages the data with populateOpportunityData
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function getFormattedStoresWithOpportunities() {
      const opportunitiesPromise = $q.defer();
      service.model.noOpportunitiesFound = false;

      getFormattedOpportunities(false).then(getOpportunitiesSuccess);

      function getOpportunitiesSuccess(opportunities) {
        opportunities = opportunities.map(populateOpportunityData);
        if (!opportunities.length) {
          service.model.noOpportunitiesFound = true;
        } else {
          const storesWithOpportunities = groupOpportunitiesByStore(opportunities);
          opportunitiesPromise.resolve(storesWithOpportunities);
        }
      }

      return opportunitiesPromise.promise;
    }

    /**
     * @name getFormattedOpportunities
     * @desc Get opportunities from API, massages the data with populateOpportunityData
     * @param {Boolean} areAllRequested Send true to disable pagination and request all of them (up to the max limit defined in apiHelperService)
     * @returns {Array}
     * @memberOf cf.common.services
     */
    function getFormattedOpportunities(areAllRequested) {
      const opportunitiesPromise = $q.defer();

      service.getOpportunities(areAllRequested)
      .then(opportunities => {
        const formattedOpportunities = opportunities.map(populateOpportunityData);
        opportunitiesPromise.resolve(formattedOpportunities);
      })
      .catch(error => handleGetOpportunitiesFail(opportunitiesPromise, error));

      return opportunitiesPromise.promise;
    }

    /**
     * @name getOpportunities
     * @desc Get opportunities from API
     * @param {Boolean} areAllRequested Send true to disable pagination and request all of them (up to the max limit defined in apiHelperService)
     * @returns {Array}
     * @memberOf cf.common.services
     */
    function getOpportunities(areAllRequested) {
      apiHelperService.model.bulkQuery = areAllRequested;

      const opportunitiesPromise = $q.defer();
      const filterPayload = filtersService.getAppliedFilters('opportunities');
      const url = apiHelperService.request('/v2/opportunities/', filterPayload);

      $http.get(url)
      .then(response => {
        opportunitiesPromise.resolve(response.data.opportunities);
      })
      .catch(error => handleGetOpportunitiesFail(opportunitiesPromise, error));

      return opportunitiesPromise.promise;
    }

    /**
     * @name getFormattedSingleOpportunity
     * @desc Get one opportunity from API, massages the data with populateOpportunityData
     * @param {String} opportunityID The ID of the opportunity to fetch
     * @returns {Array} the opportunity wrapped in a single element array
     * @memberOf cf.common.services
     */
    function getFormattedSingleOpportunity(opportunityID) {
      const opportunitiesPromise = $q.defer();
      const url = apiHelperService.request('/v2/opportunities/' + opportunityID);

      $http.get(url)
      .then(response => {
        const opportunities = populateOpportunityData(response.data.opportunities);
        opportunitiesPromise.resolve(opportunities);
      })
      .catch(error => handleGetOpportunitiesFail(opportunitiesPromise, error));

      return opportunitiesPromise.promise;
    }

    /**
     * @name handleGetOpportunitiesFail
     * @desc Handles a failing request on get opportunities.
     * @params {String} url - url to hit the api with [this could end up being static]
     */
    function handleGetOpportunitiesFail(opportunitiesPromise, error) {
      console.warn('[opportunitiesService.getOpportunities]... Error getting opportunities... Err: ', error);
      opportunitiesPromise.reject(error);
    }

    function populateOpportunityData(opportunity) {
      opportunity = setVsYAPercent(opportunity);
      opportunity.store = setVsYAPercent(opportunity.store);
      opportunity.store.unsold = opportunity.store.unsold === 'Y';
      opportunity.isItemAuthorization = opportunity.itemAuthorizationCode === null ? 'N' : 'Y';
      opportunity.isChainMandate = opportunity.itemAuthorizationCode === 'CM' ? 'Y' : 'N';
      opportunity.isOnFeature = opportunity.featureTypeCode === null ? 'N' : 'Y';

      return opportunity;
    }

    function setVsYAPercent(item) {
      // defined in DE2970, updated in US/13385
      var vsYAPercent = 0,
          negative = false;
      if (item.depletionsCurrentYearToDate > 0 && item.depletionsCurrentYearToDateYA === 0) {
        vsYAPercent = '100%';
      } else if (item.depletionsCurrentYearToDate === 0 && item.depletionsCurrentYearToDateYA > 0) {
        vsYAPercent = '-100%';
        negative = true;
      } else if (item.depletionsCurrentYearToDate === 0 && item.depletionsCurrentYearToDateYA === 0) {
        vsYAPercent = 0;
        negative = true;
      } else {
        // vsYAPercent = -100 + ((item.depletionsCurrentYearToDate / item.depletionsCurrentYearToDateYA) * 100);
        vsYAPercent = (item.depletionsCurrentYearToDate / item.depletionsCurrentYearToDateYA - 1) * 100;
        if (vsYAPercent > 999) {
          vsYAPercent = '999%';
        } else if (vsYAPercent < -999) {
          vsYAPercent = '-999%';
          negative = true;
        } else {
          if (vsYAPercent.toFixed(0) < 0) negative = true;
          vsYAPercent = vsYAPercent.toFixed(1) + '%';
        }
      }
      item.depletionsCurrentYearToDateYAPercent = negative ? vsYAPercent : '+' + vsYAPercent;
      item.depletionsCurrentYearToDateYAPercentNegative = negative;

      return item;
    }

    function groupOpportunitiesByStore(opportunities) {
      return opportunities.reduce((stores, opportunity) => {
        const storeExists = stores.length && stores[stores.length - 1].store.id === opportunity.store.id;

        if (!storeExists) {
          const store = angular.copy(opportunity);
          store.brands = [];
          store.store = setVsYAPercent(store.store);

          // Set positive or negative label for trend values for store
          // I think this is no longer relevant to the app.
          store.trend = store.currentYTDStoreVolume - store.lastYTDStoreVolume;
          if (store.trend > 0) {
            store.positiveValue = true;
          } else if (store.trend < 0) {
            store.negativeValue = true;
          }

          // create groupedOpportunities arr so all opportunities for one store will be in a row
          store.groupedOpportunities = [];

          stores.push(store);
        }

        const currentStore = stores[stores.length - 1];
        currentStore.groupedOpportunities.push(opportunity);
        currentStore.brands.push(opportunity.product.brand.toLowerCase());

        return stores;
      }, []);
    }

    /**
     * @name getOpportunityHeaders
     * @desc get the opportunity headers
     * @returns {Object}
     * @memberOf cf.common.services
    */
    function getOpportunitiesHeaders() {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunities/', filtersService.getAppliedFilters('opportunities'));

      $http.head(url)
      .then(getOpportunitiesHeadersSuccess)
      .catch(getOpportunitiesHeadersFail);

      function getOpportunitiesHeadersSuccess(response) {
        const numberOfOpps = parseInt(response.headers()['opportunity-count']);
        const numberOfStores = response.headers()['store-count'];

        setPaginationModel(numberOfOpps, numberOfStores);
        opportunitiesPromise.resolve(response.headers());
      }

      function getOpportunitiesHeadersFail(error) {
        console.warn('[opportunitiesService.getOpportunitiesHeaders] Failed with err: ', error);
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    function setPaginationModel(numberOfOpps, numberOfStores) {
      filtersService.model.appliedFilter.pagination.totalOpportunities = numberOfOpps;
      filtersService.model.appliedFilter.pagination.totalStores = numberOfStores;
      filtersService.model.appliedFilter.pagination.roundedStores = Math.ceil(numberOfStores / 10) * 10;
      filtersService.model.appliedFilter.pagination.totalPages = Math.ceil(filtersService.model.appliedFilter.pagination.roundedStores / 20) - 1;
    }

    /**
     * @name createOpportunity
     * @desc create an opportunity
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function createOpportunity(payload) {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunities');

      $http({ url: url,
        method: 'POST',
        data: payload,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      })
      .then(createOpportunitiesSuccess)
      .catch(createOpportunitiesFail);

      function createOpportunitiesSuccess(response) {
        console.log('[opportunitiesService.createOpportunity] response: ', response);
        opportunitiesPromise.resolve(response.data);
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
     * @memberOf cf.common.services
     */
    function getOpportunityFeedback(opportunityID) {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunities/' + opportunityID + '/feedback/');

      $http.get(url, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
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
     * @memberOf cf.common.services
     */
    function createOpportunityFeedback(opportunityID, data) {
      var feedback;
      if (data.type === 'other') {
        feedback = data.feedback;
      } else { feedback = data.type; }
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunities/' + opportunityID + '/feedback/'),
          payload = {
            'feedback': feedback
          };

      $http.post(url, payload, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
        opportunitiesPromise.resolve(response);
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
     * @memberOf cf.common.services
     */
    function deleteOpportunityFeedback(opportunityID) {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/v2/opportunities/' + opportunityID + '/feedback/'),
          payload = {
            'feedback': ''
          };

      $http.delete(url, payload)
        .then(deleteOpportunitiesFeedbackSuccess)
        .catch(deleteOpportunitiesFeedbackFail);

      function deleteOpportunitiesFeedbackSuccess(response) {
        opportunitiesPromise.resolve(response.data);
      }

      function deleteOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    function clearOpportunitiesModel() {
      service.model.noOpportunitiesFound = false;
      service.model.opportunities        = [];
      service.model.filterApplied        = false;
      service.model.opportunityId        = null;
    }

  };
