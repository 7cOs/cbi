'use strict';

module.exports = /*  @ngInject */
  function targetListService($http, $q, apiHelperService, opportunitiesService, filtersService) {

    var model = {
      currentList: {}
    };

    const maxChars = 255;

    var service = {
      model: model,
      getTargetList: getTargetList,
      updateTargetList: updateTargetList,
      deleteTargetList: deleteTargetList,
      getTargetListOpportunities: getTargetListOpportunities,
      getFormattedTargetListOpportunities: getFormattedTargetListOpportunities,
      getAndUpdateTargetListStoresWithOpportunities: getAndUpdateTargetListStoresWithOpportunities,
      addTargetListOpportunities: addTargetListOpportunities,
      deleteTargetListOpportunities: deleteTargetListOpportunities,
      getTargetListShares: getTargetListShares,
      addTargetListShares: addTargetListShares,
      updateTargetListShares: updateTargetListShares,
      deleteTargetListShares: deleteTargetListShares,
      getAnalyticsCategory: getAnalyticsCategory,
      maxChars: maxChars,
      moreThanMaxCharsNewList: moreThanMaxCharsNewList,
      isSaveNewListDisabled: isSaveNewListDisabled
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId, p);

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
          url = apiHelperService.request('/v2/targetLists/' + targetListId),
          payload = {};

      if (p.archived) payload.archived = p.archived;
      if (p.unarchived) payload.archived = false;
      if (p.deleted) payload.deleted = p.deleted;
      if (p.description) payload.description = p.description;
      if (p.name) payload.name = p.name;
      if (p.newOwnerUserId) payload.newOwnerUserId = p.newOwnerUserId;
      payload.collaborateAndInvite = p.collaborateAndInvite;

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
          url = apiHelperService.request('/v2/targetLists/' + targetListId);

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
     * @name getAndUpdateTargetListStoresWithOpportunities
     * @desc get target list opportunities
     * @params {String} targetListId - id of target list
     * @returns {Object} - target list opportunities
     * @memberOf cf.common.services
     */
    function getAndUpdateTargetListStoresWithOpportunities(targetListId, params) {
      var targetListPromise = $q.defer();

      getFormattedTargetListOpportunities(targetListId, params)
      .then(getAndUpdateTargetListStoresWithOpportunitiesSuccess)
      .catch(getAndUpdateTargetListStoresWithOpportunitiesFail);

      function getAndUpdateTargetListStoresWithOpportunitiesSuccess(opportunities) {
        const storesWithOpportunties = opportunitiesService.groupOpportunitiesByStore(opportunities);

        opportunitiesService.model.opportunities = storesWithOpportunties;
        targetListPromise.resolve(storesWithOpportunties);
      }

      function getAndUpdateTargetListStoresWithOpportunitiesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name getFormattedTargetListOpportunities
     * @desc get all opportunity for given target list, massages the data with populateOpportunityData
     * @param {String} targetListID - ID of target list
     * @returns {Array}
     * @memberOf cf.common.services
     */
    function getFormattedTargetListOpportunities(targetListId, params) {
      const opportunitiesPromise = $q.defer();

      service.getTargetListOpportunities(targetListId, params)
      .then(opportunities => {
        opportunitiesPromise.resolve(opportunities.map(opportunitiesService.populateOpportunityData));
      })
      .catch(error => opportunitiesPromise.reject(error));

      return opportunitiesPromise.promise;
    }

    /**
     * @name getTargetListOpportunities
     * @desc get all opportunity for given target list
     * @params {String} targetListID - ID of target list
     * @returns {Array} - target list opportunities
     * @memberOf cf.common.services
     */
    function getTargetListOpportunities(targetListId, params) {
      let filterPayload;
      if (params) filterPayload = filtersService.getAppliedFilters('targetListOpportunities');

      const opportunitiesPromise = $q.defer();
      const url = apiHelperService.request('/v2/targetLists/' + targetListId + '/opportunities', filterPayload);

      $http.get(url)
      .then(getTargetListOpportunitiesSuccess)
      .catch(getTargetListOpportunitiesFail);

      function getTargetListOpportunitiesSuccess(response) {
        opportunitiesPromise.resolve(response.data.opportunities);
      }

      function getTargetListOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/opportunities/'),
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/opportunities/'),
          payload = opportunityIds;

      $http({ url: url,
        method: 'DELETE',
        data: payload,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      })
      .then(deleteTargetListOpportunitiesSuccess)
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/shares/');

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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/shares'),
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/shares'),
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
          url = apiHelperService.request('/v2/targetLists/' + targetListId + '/shares'),
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

    /**
     * @name getAnalyticsCategory
     * @desc get analytics 'category' field for target list google analytics events
     * @params {String} listPermissionLevel - current users' permission for target list
     * @params {Boolean} listIsArchived - if target list is archived
     * @returns {String} - string for google analytics event
     * @memberOf cf.common.services
     */
    function getAnalyticsCategory(listPermissionLevel, listIsArchived) {
      return `Lists - ${listIsArchived
        ? 'Archived'
        : listPermissionLevel === 'author'
          ? 'My Lists'
          : 'Shared With Me'}`;
    }

    /**
     * @name moreThanMaxCharsNewList
     * @desc Validates the create new list modal if the Description is more than allowed limit
     * @param  {Number} descriptionLength - Length of description field of create new list modal
     * @param  {Number} max - Max allowed number of characters
     * @returns {Boolean} - Boolean
     */
    function moreThanMaxCharsNewList(descriptionLength, max) {
      return descriptionLength > max;
    }

    /**
     * @name isSaveDisabledNewList
     * @desc Validates the create new list modal if the Description is more than allowed limit
     * @param  {String} name - name of the new list in create list modal
     * @param  {Boolean} buttonDisabled - Boolean value to determine if the button is already disabled
     * @param  {Number} descriptionLength - Length of description field of create new list modal
     * @param  {Number} max - Max allowed number of characters
     * @returns {Boolean} - Boolean
     */
    function isSaveNewListDisabled(name, buttonDisabled, moreThanMaxCharsNewList, descriptionLength, max) {
      return !name || buttonDisabled || moreThanMaxCharsNewList(descriptionLength, max);
    }
  };
