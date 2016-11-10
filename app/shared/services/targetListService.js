'use strict';

module.exports = /*  @ngInject */
  function targetListService($http, $q, apiHelperService, opportunitiesService, filtersService) {

    var model = {
      currentList: {}
    };

    var service = {
      model: model,
      getTargetList: getTargetList,
      updateTargetList: updateTargetList,
      deleteTargetList: deleteTargetList,
      getTargetListOpportunities: getTargetListOpportunities,
      addTargetListOpportunities: addTargetListOpportunities,
      deleteTargetListOpportunities: deleteTargetListOpportunities,
      getTargetListShares: getTargetListShares,
      addTargetListShares: addTargetListShares,
      updateTargetListShares: updateTargetListShares,
      deleteTargetListShares: deleteTargetListShares
    };

    return service;

    /**
     * @name getTargetList
     * @desc get target list from web service
     * @params {String} targetListId - id of target list
     * @params {Object} p - query parameters
     * @returns {Object} - target list
     * @memberOf cf.common.services
     */
    function getTargetList(targetListId, p) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId, p);

      $http.get(url)
        .then(getTargetListSuccess)
        .catch(getTargetListFail);

      function getTargetListSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function getTargetListFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name updateTargetList
     * @desc update target list
     * @params {String} targetListId - id of target list
     * @returns {Object} - updated target list
     * @memberOf cf.common.services
     */
    function updateTargetList(targetListId, p) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId),
          payload = {};

      if (p.archived) payload.archived = p.archived;
      if (p.deleted) payload.deleted = p.deleted;
      if (p.description) payload.description = p.description;
      if (p.name) payload.name = p.name;

      $http.patch(url, payload)
        .then(updateTargetListSuccess)
        .catch(updateTargetListFail);

      function updateTargetListSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function updateTargetListFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name deleteTargetList
     * @desc delete target list
     * @params {String} targetListId - id of target list
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function deleteTargetList(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId);

      $http.delete(url)
        .then(deleteTargetListSuccess)
        .catch(deleteTargetListFail);

      function deleteTargetListSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function deleteTargetListFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name getTargetListOpportunities
     * @desc get target list opportunities
     * @params {String} targetListId - id of target list
     * @returns {Object} - target list opportunities
     * @memberOf cf.common.services
     */
    function getTargetListOpportunities(targetListId, params) {
      var filterPayload;
      if (params) filterPayload = filtersService.getAppliedFilters('opportunities');

      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/opportunities', filterPayload);

      // reset opportunities counts
      filtersService.model.appliedFilter.pagination.totalOpportunities = 0;
      filtersService.model.appliedFilter.pagination.totalStores = 0;

      $http.get(url)
        .then(getTargetListOpportunitiesSuccess)
        .catch(getTargetListOpportunitiesFail);

      function getTargetListOpportunitiesSuccess(response) {
        // Group opportunities by store
        var newOpportunityArr = [],
            store,
            storePlaceholder;
        opportunitiesService.model.opportunities = [];

        for (var i = 0; i < response.data.opportunities.length; i++) {
          var item = response.data.opportunities[i];

          // Set depletionsCurrentYearToDateYAPercent
          item = setVsYAPercent(item);
          item.store = setVsYAPercent(item.store);

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

          // if its a new store
          if (!storePlaceholder || (storePlaceholder.address !== item.store.address || storePlaceholder.id !== item.store.id)) {
            // push previous store in newOpportunityArr
            if (i !== 0) {
              newOpportunityArr.push(store);
              filtersService.model.appliedFilter.pagination.totalStores += 1;
            }

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
          /*
          item.impact = item.impact.toLowerCase();
          if (item.impact === 'high') store.highImpactSum += 1;
          */

          // sum depletions - not in api yet - WJAY 8/8
          // store.depletionSum += item.depletions

          // push last store into newOpportunityArr
          if (i + 1 === response.data.opportunities.length) {
            newOpportunityArr.push(store);
            filtersService.model.appliedFilter.pagination.totalStores += 1;
          }

          // opportunitiesService.model.opportunitiesSum += 1;
          filtersService.model.appliedFilter.pagination.totalOpportunities += 1;
        }; // end for each

        opportunitiesService.model.opportunities = newOpportunityArr;
        targetListPromise.resolve(newOpportunityArr);
      }

      function getTargetListOpportunitiesFail(error) {
        targetListPromise.reject(error);
      }

      function setVsYAPercent(item) {
        // defined in DE2970
        var vsYAPercent = 0,
            negative = false;
        if (item.depletionsCurrentYearToDateYA === 0) {
          vsYAPercent = '100%';
        } else if (item.depletionsCurrentYearToDate === 0) {
          vsYAPercent = '-100%';
          negative = true;
        } else {
          // vsYAPercent = -100 + ((item.depletionsCurrentYearToDate / item.depletionsCurrentYearToDateYA) * 100);
          vsYAPercent = ((item.depletionsCurrentYearToDate - item.depletionsCurrentYearToDateYA) / item.depletionsCurrentYearToDateYA) * 100;
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

      return targetListPromise.promise;
    }

    /**
     * @name addTargetListOpportunities
     * @desc add target list opportunities
     * @params {String} targetListId - id of target list
     * @params {Object} opportunityIds - array of opportunity ids
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function addTargetListOpportunities(targetListId, opportunityIds) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/opportunities/'),
          payload = opportunityIds;

      $http.post(url, payload)
        .then(addTargetListOpportunitiesSuccess)
        .catch(addTargetListOpportunitiesFail);

      function addTargetListOpportunitiesSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function addTargetListOpportunitiesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name deleteTargetListOpportunities
     * @desc delete target list opportunities
     * @params {String} targetListId - id of target list
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function deleteTargetListOpportunities(targetListId, opportunityIds) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/opportunities/'),
          payload = opportunityIds;

      $http({ url: url,
        method: 'DELETE',
        data: payload,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      }).then(deleteTargetListOpportunitiesSuccess)
        .catch(deleteTargetListOpportunitiesFail);

      function deleteTargetListOpportunitiesSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function deleteTargetListOpportunitiesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name deleteTargetListOpportunities
     * @desc delete target list opportunities
     * @params {String} targetListId - id of target list
     * @params {Number} int - int to be returned [Optional]
     * @returns {Object} - shares object
     * @memberOf cf.common.services
     */
    function getTargetListShares(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/shares/');

      $http.get(url)
        .then(getTargetListSharesSuccess)
        .catch(getTargetListSharesFail);

      function getTargetListSharesSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function getTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name addTargetListShares
     * @desc add target list shares
     * @params {String} targetListId - id of target list
     * @params {Object} p - payload information
     * @returns {Object} - target shares including new object
     * @memberOf cf.common.services
     */
    function addTargetListShares(targetListId, collaborators) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/shares'),
          payload = collaborators;

      $http.post(url, payload)
        .then(addTargetListSharesSuccess)
        .catch(addTargetListSharesFail);

      function addTargetListSharesSuccess(response) {
        targetListPromise.resolve(response);
      }

      function addTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name updateTargetListShares
     * @desc update collaborator permission level
     * @params {String} targetListId - id of target list
     * @params {String} employeeId - id of employee
     * @params {Boolean} updateLastViewed - update last viewed status
     * @returns {Object} - collaborator response
     * @memberOf cf.common.services
     */
    function updateTargetListShares(targetListId, employeeId, updateLastViewed) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/shares'),
          payload = [{
            employeeId: employeeId,
            updateLastViewed: updateLastViewed
          }];

      $http.patch(url, payload)
        .then(updateTargetListSharesSuccess)
        .catch(updateTargetListSharesFail);

      function updateTargetListSharesSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function updateTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name deleteTargetListShares
     * @desc delete target list shares
     * @params {String} targetListId - id of target list
     * @params {String} id - array of user ids of collaborators to be removed
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function deleteTargetListShares(targetListId, id) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId + '/shares'),
          payload = [id];

      $http({ url: url,
        method: 'DELETE',
        data: payload,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      })
        .then(deleteTargetListSharesSuccess)
        .catch(deleteTargetListSharesFail);

      function deleteTargetListSharesSuccess(response) {
        targetListPromise.resolve(response.data);
      }

      function deleteTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }
  };
