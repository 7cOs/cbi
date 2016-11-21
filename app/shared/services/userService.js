'use strict';

module.exports = /*  @ngInject */
  function userService($http, $q, apiHelperService, filtersService, targetListService) {

    var model = {
      currentUser: {},
      summary: [],
      depletion: [],
      distribution: [],
      topBottom: {}
    };
    var service = {
      model: model,
      getUsers: getUsers,
      getHiddenOpportunities: getHiddenOpportunities,
      hideOpportunity: hideOpportunity,
      deleteHiddenOpportunity: deleteHiddenOpportunity,
      getNotifications: getNotifications,
      createNotification: createNotification,
      getOpportunityFilters: getOpportunityFilters,
      saveOpportunityFilter: saveOpportunityFilter,
      getPerformanceSummary: getPerformanceSummary,
      getPerformanceDepletion: getPerformanceDepletion,
      getPerformanceDistribution: getPerformanceDistribution,
      getPerformanceBrand: getPerformanceBrand,
      getTopBottom: getTopBottom,
      getTargetLists: getTargetLists,
      addTargetList: addTargetList,
      sendOpportunity: sendOpportunity,
      isValidValues: isValidValues
    };

    return service;

    /**
     * @name getUsers
     * @desc get data for all users or one user
     * @params {String} id - id of a user [Optional]
     * @returns {Array or Object} - Array of all users or object of one user
     * @memberOf cf.common.services
     */
    function getUsers(id) {
      var usersPromise = $q.defer(),
          url = id ? apiHelperService.request('/api/users/' + id) : apiHelperService.request('/api/users/');

      // only fire request once. otherwise, use model
      if (!service.model) {
        $http.get(url, {
          headers: {}
        })
        .then(getUsersSuccess)
        .catch(getUsersFail);
      } else {
        usersPromise.resolve(service.model);
      }

      function getUsersSuccess(response) {
        usersPromise.resolve(response.data);
      }

      function getUsersFail(error) {
        usersPromise.reject(error);
      }

      return usersPromise.promise;
    }

    /**
     * @name getHiddenOpportunities
     * @desc get hidden opportunities for a user
     * @params {String} id - id of a user [required]
     * @returns {Object} - opportunities object
     * @memberOf cf.common.services
     */
    function getHiddenOpportunities(id) {
      var hiddenOpportunitiesPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/hiddenOpportunities/');

      $http.get(url, {
        headers: {}
      })
      .then(getHiddenOpportunitiesSuccess)
      .catch(getHiddenOpportunitiesFail);

      function getHiddenOpportunitiesSuccess(response) {
        console.log('[userService.getHiddenOpportunities] response: ', response);
        hiddenOpportunitiesPromise.resolve(response.data);
      }

      function getHiddenOpportunitiesFail(error) {
        hiddenOpportunitiesPromise.reject(error);
      }

      return hiddenOpportunitiesPromise.promise;
    }

    /**
     * @name hideOpportunity
     * @desc get hidden opportunities for a user
     * @params {String} id - id of a user [required]
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function hideOpportunity(id) {
      var hideOpportunityPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/hiddenOpportunities/'),
          payload = {
            'required': 'true',
            '$schema': 'http://json-schema.org/draft-03/schema',
            'id': 'opportunityIDListSchema',
            'type': 'array',
            'items': {
              'type': 'string',
              'description': 'Opportunity ID string'
            }
          };

      $http.post(url, payload, {
        headers: {}
      })
      .then(hideOpportunitySuccess)
      .catch(hideOpportunityFail);

      function hideOpportunitySuccess(response) {
        console.log('[userService.hideOpportunity] response: ', response);
        hideOpportunityPromise.resolve(response.data);
      }

      function hideOpportunityFail(error) {
        hideOpportunityPromise.reject(error);
      }

      return hideOpportunityPromise.promise;
    }

    /**
     * @name deleteHiddenOpportunity
     * @desc get hidden opportunities for a user
     * @params {String} id - id of a user [required]
     * @params {String} opportunityId - id of the opportunity to be deleted
     * @returns {Object} - status object
     * @memberOf cf.common.services
     */
    function deleteHiddenOpportunity(id) {
      var deleteHiddenOpportunityPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/hiddenOpportunities/'),
          payload = {
            'required': 'true',
            '$schema': 'http://json-schema.org/draft-03/schema',
            'id': 'opportunityIDListSchema',
            'type': 'array',
            'items': {
              'type': 'string',
              'description': 'Opportunity ID string'
            }
          };

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteHiddenOpportunitySuccess)
      .catch(deleteHiddenOpportunityFail);

      function deleteHiddenOpportunitySuccess(response) {
        console.log('[userService.deleteHiddenOpportunity] response: ', response);
        deleteHiddenOpportunityPromise.resolve(response.data);
      }

      function deleteHiddenOpportunityFail(error) {
        deleteHiddenOpportunityPromise.reject(error);
      }

      return deleteHiddenOpportunityPromise.promise;
    }

    /**
     * @name getNotifications
     * @desc get notifications for a user
     * @params {String} id - id of a user
     * @returns {Array} - Array of all notifications for a user
     * @memberOf cf.common.services
     */
    function getNotifications(id) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/notifications/');

      $http.get(url)
        .then(getNotificationsSuccess)
        .catch(getNotificationsFail);

      function getNotificationsSuccess(response) {
        console.log('[userService.getNotifications] response: ', response);
        notificationsPromise.resolve(response.data);
      }

      function getNotificationsFail(error) {
        notificationsPromise.reject(error);
      }

      return notificationsPromise.promise;
    }

    /**
     * @name createNotification
     * @desc create notifications for a user
     * @params {String} id - id of a user
     * @params {Object} p - params to be used in creation of notification
     * @returns {Array} - Newly created notification
     * @memberOf cf.common.services
     */
    function createNotification(id, p) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/notifications/'),
          payload = {
            creator: id,
            action: p.action,
            objectType: p.objectType
          };

      $http.post(url, payload)
        .then(createNotificationSuccess)
        .catch(createNotificationFail);

      function createNotificationSuccess(response) {
        console.log('[userService.createNotification] response: ', response);
        notificationsPromise.resolve(response.data);
      }

      function createNotificationFail(error) {
        notificationsPromise.reject(error);
      }

      return notificationsPromise.promise;
    }

    /**
     * @name getOpportunityFilters
     * @desc get all opportunity filters for a user
     * @params {String} id - id of a user
     * @returns {Array} - Array of all opportunity filters for a user
     * @memberOf cf.common.services
     */
    function getOpportunityFilters(id) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/opportunityFilters/');

      $http.get(url)
        .then(getOpportunityFiltersSuccess)
        .catch(getOpportunityFiltersFail);

      function getOpportunityFiltersSuccess(response) {
        console.log('[userService.getOpportunityFilters] response: ', response);
        opportunityFilterPromise.resolve(response.data);
      }

      function getOpportunityFiltersFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }

    /**
     * @name saveOpportunityFilter
     * @desc save new filter for a user
     * @param {String} filterDescription Stringified chips object is saved in description
     * @returns {Object} - Status Object
     * @memberOf cf.common.services
     */
    function saveOpportunityFilter(filterDescription) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.employeeID + '/opportunityFilters/'),
          payload = {
            name: filtersService.model.newServiceName,
            filterString: encodeURIComponent(filtersService.model.appliedFilter.appliedFilter),
            description: filterDescription
          };

      $http.post(url, payload)
        .then(saveOpportunityFilterSuccess)
        .catch(saveOpportunityFilterFail);

      function saveOpportunityFilterSuccess(response) {
        // resolve promise
        opportunityFilterPromise.resolve(response.data);
      }

      function saveOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }

    /**
     * @name getPerformanceSummary
     * @desc get performance summary for a user
     * @returns {Object} - performance summary
     * @memberOf cf.common.services
     */
    function getPerformanceSummary() {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.employeeID + '/performance/summary');

      $http.get(url)
        .then(getPerformanceSummarySuccess)
        .catch(getPerformanceSummaryFail);

      function getPerformanceSummarySuccess(response) {
        console.log('[userService.getPerformanceSummary] response: ', response);
        performancePromise.resolve(response.data);
      }

      function getPerformanceSummaryFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceDepletion
     * @desc get performance depletion for a user
     * @returns {Object} - user performance depletion
     * @memberOf cf.common.services
     */
    function getPerformanceDepletion() {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.personID + '/performance/depletionScorecard/');

      if (service.model.depletion.length < 1) {
        $http.get(url)
          .then(getPerformanceDepletionSuccess)
          .catch(getPerformanceDepletionFail);
      } else {
        performancePromise.resolve(service.model.depletion);
      }

      function getPerformanceDepletionSuccess(response) {
        // sum depletions and bu depletions
        for (var i = 0; i < response.data.performance.length; i++) {
          var totalDepletion = 0,
              totalBUDepletion = 0;

          for (var j = 0; j < response.data.performance[i].measures.length; j++) {
            var depletions = response.data.performance[i].measures[j].depletions,
                depletionTrend = response.data.performance[i].measures[j].depletionsTrend,
                plan = response.data.performance[i].measures[j].plan;

            totalDepletion += depletions;
            totalBUDepletion += response.data.performance[i].measures[j].depletionsBU;

            // Add Table Data
            response.data.performance[i].measures[j].depletionsGap = depletions * (depletionTrend / 100);
            response.data.performance[i].measures[j].vsPlan = plan - depletions;
            response.data.performance[i].measures[j].vsPlanPercent = (response.data.performance[i].measures[j].vsPlan / plan) * 100;
          }

          response.data.performance[i].depletionTotal = totalDepletion;
          response.data.performance[i].depletionBUTotal = totalBUDepletion;
        }
        performancePromise.resolve(response.data.performance);
      }

      function getPerformanceDepletionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceDistribution
     * @desc get performance distribution for a user
     * @params {Object} params - &filter=premiseType:off or &filter=premiseType:on
     * @returns {Object} - user performance distribution
     * @memberOf cf.common.services
     */
    function getPerformanceDistribution(params) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.personID + '/performance/distributionScorecard/', params);

      $http.get(url)
        .then(getPerformanceDistributionSuccess)
        .catch(getPerformanceDistributionFail);

      function getPerformanceDistributionSuccess(response) {
        performancePromise.resolve(response.data.performance);
      }

      function getPerformanceDistributionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name calculatePlanDistirbutionTrend
     * @desc Calculates plan(ABP) trend values for both Simple and Effective distirbutions
     * @params {Object} measure - The current measure object in the response
     * @returns {Object} - Returns true if the properties were calculated . Returns false if isNan
     */
    function calculatePlanDistirbutionTrend(measure) {
      var planSimpleVal = Number(measure.planSimple);
      var planEffectiveVal = Number(measure.planEffective);
      var temp = null;

      var distirbutionSimpleVal = Number(measure.distributionsSimple);
      var distirbutionEffectiveVal = Number(measure.distributionsSimple);
      if (isValidValues(planSimpleVal) && isValidValues(distirbutionSimpleVal)) {
        if (planSimpleVal === 0) {
          measure.planDistirbutionSimpleTrend = 0;
        } else {
          temp = ((distirbutionSimpleVal - planSimpleVal) / planSimpleVal);
          measure.planDistirbutionSimpleTrend = (temp * 100);
        }
      }

      if (isValidValues(planEffectiveVal) && isValidValues(distirbutionEffectiveVal)) {
        if (planEffectiveVal === 0) {
          measure.planDistirbutionEffectiveTrend = 0;
        } else {
          temp = ((distirbutionEffectiveVal - planEffectiveVal) / planEffectiveVal);
          measure.planDistirbutionEffectiveTrend = (temp * 100);
        }
      }
    }

    function isValidValues(value) {
      var isValid = typeof value === 'number' && !isNaN(value);
      return isValid;
    }

    function calculatePlanDepletionTrend(measure) {
      var planVal = Number(measure.plan);
      var depletionsVal = Number(measure.depletions);
      if (isValidValues(planVal) && isValidValues(depletionsVal)) {
        if (planVal === 0) {
          measure.planDepletionTrend = '-';
        } else {
          var temp = ((depletionsVal - planVal) / planVal);
          measure.planDepletionTrend = (temp * 100);
        }
      }
    }

    function calculateTrendValuesForPlan(brands) {
      for (var i = 0, len = brands.length; i < len; i++) {
        var currentBrand = brands[i];
        angular.forEach(currentBrand.measures, function(measure, index) {
          if (isValidValues(measure.depletions)) {
            calculatePlanDepletionTrend(measure);
          } else {
            calculatePlanDistirbutionTrend(measure);
          }
        });
      }
      return brands;
    }

    /**
     * @name getPerformanceBrand
     * @desc get brand performance for a user
     * @params {Object} params - params to be added to rest
     * @returns {Object} - user performance brand
     * @memberOf cf.common.services
     */
    function getPerformanceBrand(params) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.employeeID + '/performance/brandSnapshot', params);

      $http.get(url)
        .then(getPerformanceBrandSuccess)
        .catch(getPerformanceBrandFail);

      function getPerformanceBrandSuccess(response) {
        calculateTrendValuesForPlan(response.data.performance);
        console.log('[getPerformanceBrandSuccess.data.performance.length]', response.data.performance.length);
        performancePromise.resolve(response.data);
      }

      function getPerformanceBrandFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getTopBottom
     * @desc get performance top bottom snapshot for a user
     * @params {String} id - id of a user
     * @returns {Object} - user performance top bottom snapshot
     * @memberOf cf.common.services
     */
    function getTopBottom(route) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + service.model.currentUser.employeeID + '/performance/topBottomSnapshot/' + route);

      $http.get(url)
        .then(getTopBottomSuccess)
        .catch(getTopBottomFail);

      function getTopBottomSuccess(response) {
        var responseData = addDisplayProperties(response.data);
        performancePromise.resolve(responseData);
      }

      function getTopBottomFail(error) {
        performancePromise.reject(error);
      }

      function addDisplayProperties(data) {
        for (var i = 0; i < data.length; i++) {
          var depletions = 0,
              distributionsSimple = 0,
              distributionsEffective = 0,
              velocity = 0;

          for (var j = 0; j < data[i].measures.length; j++) {
            if (data[i].measures[j].depletions) depletions += data[i].measures[j].depletions;
            if (data[i].measures[j].distributionsSimple) distributionsSimple += data[i].measures[j].distributionsSimple;
            if (data[i].measures[j].distributionsEffective) distributionsEffective += data[i].measures[j].distributionsEffective;
            if (data[i].measures[j].velocity) velocity += data[i].measures[j].velocity;
          }

          data[i].depletions = depletions;
          data[i].distributionsSimple = distributionsSimple;
          data[i].distributionsEffective = distributionsEffective;
          data[i].velocity = velocity;
        }

        return data;
      }

      return performancePromise.promise;
    }

    /**
     * @name getTargetLists
     * @desc get target list for a user
     * @params {String} id - id of a user
     * @params {Object} p - query params
     * @returns {Object} - user target lists
     * @memberOf cf.common.services
     */
    function getTargetLists(id, p) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/targetLists/', p);

      if (p) {
        url = apiHelperService.request('/api/users/' + id + '/targetLists' + p);
      }

      if (!service.model.targetLists) {
        $http.get(url)
          .then(getTargetListsSuccess)
          .catch(getTargetListsFail);
      } else {
        targetListPromise.resolve(service.model.targetLists);
      }

      function getTargetListsSuccess(response) {
        var sharedArchivedCount = 0,
            sharedNotArchivedCount = 0,
            ownedNotArchived = 0,
            ownedArchived = 0;

        for (var i = 0; i < response.data.owned.length; i++) {
          if (response.data.owned[i].archived) ownedArchived++;
          else ownedNotArchived++;
        }

        for (i = 0; i < response.data.sharedWithMe.length; i++) {
          if (response.data.sharedWithMe[i].archived) sharedArchivedCount++;
          else sharedNotArchivedCount++;
        }

        angular.forEach(response.data.sharedWithMe, function(value, key) {
          var creator,
              newShare;

          angular.forEach(value.collaborators, function(value, key) {

            // Set creator for shared list
            if (value.permissionLevel === 'author') {
              creator = value.user.firstName + ' ' + value.user.lastName;
            }

            // If collaborator is current user, set whether share has been viewed
            if (value.user.employeeId === model.currentUser.employeeID && !value.lastViewed) {
              newShare = true;
            }
          });
          value.creator = creator;
          value.newShare = newShare;
        });

        response.data.ownedArchived = ownedArchived;
        response.data.ownedNotArchived = ownedNotArchived;
        response.data.sharedArchivedCount = sharedArchivedCount;
        response.data.sharedNotArchivedCount = sharedNotArchivedCount;

        targetListPromise.resolve(response.data);
      }

      function getTargetListsFail(error) {
        targetListPromise.reject(error);
      }
      return targetListPromise.promise;
    }

    /**
     * @name addTargetList
     * @desc add target list for a user
     * @params {Object} p - target list information payload
     * @returns {Object} - newly added target list
     * @memberOf cf.common.services
     */
    function addTargetList(p) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + model.currentUser.employeeID + '/targetLists/'),
          payload = {
            name: p.name,
            description: p.description,
            opportunityIds: [], // opportunity id's to be included
            collaborateAndInvite: p.collaborateAndInvite
          };

      $http.post(url, payload)
        .then(addTargetListSuccess)
        .catch(addTargetListFail);

      function addTargetListSuccess(response) {
        // We should be getting these values in the response
        response.data.createdAt = response.dateCreated;
        response.data.opportunitiesSummary = {};
        response.data.opportunitiesSummary.closedOpportunitiesCount = 0;
        response.data.opportunitiesSummary.opportunitiesCount = 0;
        response.data.opportunitiesSummary.totalClosedDepletions = 0;

        service.model.targetLists.ownedNotArchivedTargetLists.unshift(response.data);
        service.model.targetLists.ownedArchived++;
        service.model.targetLists.ownedNotArchived--;

        targetListPromise.resolve(response.data);
      }

      function addTargetListFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * /users/{userID}/sharedOpportunities
     * @name sendOpportunity
     * @desc send an opp to another user
     * @params {Object} uId - user to be sent opp
     * @params {Object} oId - opportunity id
     * @returns {Object} - 201
     * @memberOf orion.common.services
     */
    function sendOpportunity(uId, oId) {
      var oPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + uId + '/sharedOpportunities/'),
          payload = [oId];

      $http.post(url, payload)
        .then(sendOppSuccess)
        .catch(sendOppFail);

      function sendOppSuccess(response) {
        console.log('[userService.sendOpportunity] response: ', response);
        oPromise.resolve(response.data);
      }
      function sendOppFail(error) {
        oPromise.reject(error);
      }

      return oPromise.promise;
    }
  };
