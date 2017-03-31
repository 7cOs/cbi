module.exports = /*  @ngInject */
  function opportunitiesService($http, $q, distributorsService, apiHelperService, filtersService, ieHackService) {

    var model = {
      filterApplied: false,
      opportunities: [],
      opportunityId: null,
      noOpportunitiesFound: false
    };

    var service = {
      model: model,
      getOpportunities: getOpportunities,
      getOpportunitiesHeaders: getOpportunitiesHeaders,
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
     * @memberOf cf.common.services
     */
    function getOpportunities(opportunityID, dontResetList) {
      service.model.noOpportunitiesFound = false;
      if (!opportunityID) {
        // get applied filters
        var filterPayload = filtersService.getAppliedFilters('opportunities');
      }

      // create promise, build url based on filters and if there is an opp id
      var opportunitiesPromise = $q.defer(),
          url = opportunityID ? apiHelperService.request('/api/opportunities/' + opportunityID) : apiHelperService.request('/api/opportunities/', filterPayload);

      if (!dontResetList) {
        service.model.opportunities = [];
      }

      $http.get(url)
        .then(getOpportunitiesSuccess)
        .catch(getOpportunitiesFail);

      function getOpportunitiesSuccess(response) {
        // Group opportunities by store
        var newOpportunityArr = [],
            store,
            storePlaceholder;

        // make opp array instead of obj if oppId provided
        if (opportunityID) { response.data.opportunities = [response.data]; };

        // trigger no opps modal
        if (response.data.opportunities.length < 1) { service.model.noOpportunitiesFound = true; };

        for (var i = 0; i < response.data.opportunities.length; i++) {
          var item = response.data.opportunities[i];

          // Set depletionsCurrentYearToDateYAPercent
          item = setVsYAPercent(item);
          item.store = setVsYAPercent(item.store);

          // Check Authorization/Feature for CSV
          item.isItemAuthorization = 'N';
          if (item.itemAuthorizationCode !== null) {
            item.isItemAuthorization = 'Y';
          }

          item.isChainMandate = 'N';
          if (item.itemAuthorizationCode === 'CM') {
            item.isChainMandate = 'Y';
          }

          item.isOnFeature = 'N';
          if (item.featureTypeCode !== null) {
            item.isOnFeature = 'Y';
          }

          // Check that only specified authorizations show, applicable when 'authorized' filter applied
          item.showAuthorization = '';
          if (item.itemAuthorizationCode === 'CM' || item.itemAuthorizationCode === 'BM' || item.itemAuthorizationCode === 'OS' || item.itemAuthorizationCode === 'SP') {
            item.showAuthorization = 'Y';
          }

          if (filtersService.model.selected.productType[0] !== 'authorized' || (filtersService.model.selected.productType[0] === 'authorized' && item.showAuthorization === 'Y')) {
            // if its a new store
            if (!storePlaceholder || (storePlaceholder.address !== item.store.address || storePlaceholder.id !== item.store.id)) {
              // push previous store in newOpportunityArr
              if (i !== 0) newOpportunityArr.push(store);

              // create grouped store object
              store = angular.copy(item);
              store.depletionSum = 0;
              store.brands = [];
              store.store = setVsYAPercent(store.store);

              // set store placeholder to new store
              storePlaceholder = item.store;

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

              store.groupedOpportunities.push(item);

            } else {
              store.groupedOpportunities.push(item);
            }
          } else {
            service.model.noOpportunitiesFound = true;
            service.model.filterApplied = true;
            return getOpportunitiesFail('No authorized Opportunities');
          }

          // add brand to array
          store.brands.push(item.product.brand.toLowerCase());

          // sum depletions - not in api yet - WJAY 8/8
          // store.depletionSum += item.depletions

          // push last store into newOpportunityArr
          if (i + 1 === response.data.opportunities.length) newOpportunityArr.push(store);
        }; // end for each

        // set data for pagination
        if (!dontResetList) {
          service.model.opportunities = newOpportunityArr;
        }

        opportunitiesPromise.resolve(newOpportunityArr);
      }

      function getOpportunitiesFail(error) {
        console.warn('[opportunitiesService.getOpportunities]... Error getting opportunities... Err: ', error);
        opportunitiesPromise.reject(error);
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

      return opportunitiesPromise.promise;
    }

    /**
     * @name getOpportunityHeaders
     * @desc get the opportunity headers
     * @returns {Object}
     * @memberOf cf.common.services
    */
    function getOpportunitiesHeaders() {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/opportunities/', filtersService.getAppliedFilters('opportunities'));

      $http.head(url)
        .then(getOpportunitiesHeadersSuccess)
        .catch(getOpportunitiesHeadersFail);

      function getOpportunitiesHeadersSuccess(response) {
        filtersService.model.appliedFilter.pagination.totalOpportunities = response.headers()['opportunity-count'];
        filtersService.model.appliedFilter.pagination.totalStores = response.headers()['store-count'];
        filtersService.model.appliedFilter.pagination.roundedStores = Math.ceil(response.headers()['store-count'] / 10) * 10;
        filtersService.model.appliedFilter.pagination.totalPages = (Math.ceil(filtersService.model.appliedFilter.pagination.roundedStores / 20) - 1);

        opportunitiesPromise.resolve(response.headers());
      }

      function getOpportunitiesHeadersFail(error) {
        console.warn('[opportunitiesService.getOpportunitiesHeaders] Failed with err: ', error);
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * @name createOpportunity
     * @desc create an opportunity
     * @returns {Object}
     * @memberOf cf.common.services
     */
    function createOpportunity(payload) {
      var opportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/opportunities');

      $http({ url: url,
        method: 'POST',
        data: payload,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(createOpportunitiesSuccess)
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
          url = apiHelperService.request('/api/opportunities/' + opportunityID + '/feedback/');

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
          url = apiHelperService.request('/api/opportunities/' + opportunityID + '/feedback/'),
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
          url = apiHelperService.request('/api/opportunities/' + opportunityID + '/feedback/'),
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
  };
