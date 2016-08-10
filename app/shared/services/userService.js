'use strict';

module.exports =
  function userService($http, $q, apiHelperService) {

    var tempData = {
      hideOpportunityPostResponse: {'status': 200},
      deleteHiddenOpportunityDeleteResponse: {'status': 200},
      postOpportunityFilterResponse: {'status': 200},
      postTargetListPayload: {
        'type': 'object',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'id': 'targetListCreateSchema',
        'required': true,
        'properties': {
          'name': {
            'type': 'string',
            'required': 'true',
            'description': 'Name of the Target List.'
          },
          'opportunities': {
            '$ref': 'opportunityIDListSchema'
          }
        }
      },
      postTargetListResponse: {
        'id': '1323ss',
        'name': 'Pacific Northwest Opportunities',
        'archived:': false,
        'opportunitiesSummary': {
          'storesCount': 12,
          'targetedOpportunitiesCount': 20,
          'committedOpportunitiesCount': 5,
          'closedOpportunitiesCount': 10,
          'totalClosedDepletions': 352
        }
      }
    };

    /* var model = {
      id: 'A1B2',
      firstName: 'Joe',
      lastName: 'Cerveza',
      email: 'jCerveza@cbrands.com',
      phone: '1234567890',
      role: 'CBBD MDM',
      accounts: ['Wal-mart', 'PCC']
    };*/
    var model = {},
        service = {
          model: model,
          getUsers: getUsers,
          getHiddenOpportunities: getHiddenOpportunities,
          hideOpportunity: hideOpportunity,
          deleteHiddenOpportunity: deleteHiddenOpportunity,
          getNotifications: getNotifications,
          getOpportunityFilters: getOpportunityFilters,
          saveOpportunityFilter: saveOpportunityFilter,
          getPerformanceSummary: getPerformanceSummary,
          getPerformanceDepletion: getPerformanceDepletion,
          getPerformanceDistribution: getPerformanceDistribution,
          getPerformanceBrand: getPerformanceBrand,
          getPerformanceTopBottom: getPerformanceTopBottom,
          getTargetLists: getTargetLists,
          addTargetList: addTargetList
        };

    return service;

    /**
     * @name getUsers
     * @desc get data for all users or one user
     * @params {String} id - id of a user [Optional]
     * @returns {Array or Object} - Array of all users or object of one user
     * @memberOf orion.common.services
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
     * @memberOf orion.common.services
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
     * @memberOf orion.common.services
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
        // hideOpportunityPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        hideOpportunityPromise.resolve(tempData.hideOpportunityPostResponse);
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
     * @memberOf orion.common.services
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
        // deleteHiddenOpportunityPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        deleteHiddenOpportunityPromise.resolve(tempData.deleteHiddenOpportunityDeleteResponse);
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
     * @memberOf orion.common.services
     */
    function getNotifications(id) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/notifications/');

      $http.get(url, {
        headers: {}
      })
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
     * @name getOpportunityFilters
     * @desc get all opportunity filters for a user
     * @params {String} id - id of a user
     * @returns {Array} - Array of all opportunity filters for a user
     * @memberOf orion.common.services
     */
    function getOpportunityFilters(id) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/opportunityFilters/');

      $http.get(url, {
        headers: {}
      })
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
     * @params {String} id - id of a user
     * @params {Object} payload - filter settings to be saved
     * @returns {Object} - Status Object
     * @memberOf orion.common.services
     */
    function saveOpportunityFilter(id) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/opportunityFilters/'),
          payload = {};

      $http.post(url, payload, {
        headers: {}
      })
      .then(saveOpportunityFilterSuccess)
      .catch(saveOpportunityFilterFail);

      function saveOpportunityFilterSuccess(response) {
        console.log('[userService.saveOpportunityFilter] response: ', response);
        // opportunityFilterPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunityFilterPromise.resolve(tempData.postOpportunityFilterResponse);
      }

      function saveOpportunityFilterFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }

    /**
     * @name getPerformanceSummary
     * @desc get performance summary for a user
     * @params {String} id - id of a user
     * @returns {Object} - performance summary
     * @memberOf orion.common.services
     */
    function getPerformanceSummary(id) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/performance/summary/');

      $http.get(url, {
        headers: {}
      })
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
     * @params {String} id - id of a user
     * @returns {Object} - user performance depletion
     * @memberOf orion.common.services
     */
    function getPerformanceDepletion(id) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/performance/depletionScorecard/');

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceDepletionSuccess)
      .catch(getPerformanceDepletionFail);

      function getPerformanceDepletionSuccess(response) {
        console.log('[userService.getPerformanceDepletion] response: ', response);
        performancePromise.resolve(response.data);
      }

      function getPerformanceDepletionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceDistribution
     * @desc get performance distribution for a user
     * @params {String} id - id of a user
     * @returns {Object} - user performance distribution
     * @memberOf orion.common.services
     */
    function getPerformanceDistribution(id) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/performance/distributionScorecard/');

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceDistributionSuccess)
      .catch(getPerformanceDistributionFail);

      function getPerformanceDistributionSuccess(response) {
        console.log('[userService.getPerformanceDistribution] response: ', response);
        performancePromise.resolve(response.data);
      }

      function getPerformanceDistributionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceBrand
     * @desc get performance brand for a user
     * @params {String} id - id of a user
     * @returns {Object} - user performance brand
     * @memberOf orion.common.services
     */
    function getPerformanceBrand(id) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/performance/brandSnapshot/');

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceBrandSuccess)
      .catch(getPerformanceBrandFail);

      function getPerformanceBrandSuccess(response) {
        console.log('[userService.getPerformanceBrand] response: ', response);
        performancePromise.resolve(response.data);
      }

      function getPerformanceBrandFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceTopBottom
     * @desc get performance top bottom snapshot for a user
     * @params {String} id - id of a user
     * @returns {Object} - user performance top bottom snapshot
     * @memberOf orion.common.services
     */
    function getPerformanceTopBottom(id) {
      var performancePromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/performance/topBottomSnapshot/');

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceTopBottomSuccess)
      .catch(getPerformanceTopBottomFail);

      function getPerformanceTopBottomSuccess(response) {
        console.log('[userService.getPerformanceTopBottom] response: ', response);
        performancePromise.resolve(response.data);
      }

      function getPerformanceTopBottomFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getTargetLists
     * @desc get target list for a user
     * @params {String} id - id of a user
     * @returns {Object} - user target lists
     * @memberOf orion.common.services
     */
    function getTargetLists(id) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/targetLists/');

      $http.get(url, {
        headers: {}
      })
      .then(getTargetListsSuccess)
      .catch(getTargetListsFail);

      function getTargetListsSuccess(response) {
        console.log('[userService.getTargetLists] response: ', response);
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
     * @params {String} id - id of a user
     * @returns {Object} - newly added target list
     * @memberOf orion.common.services
     */
    function addTargetList(id) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/users/' + id + '/targetLists/'),
          payload = tempData.postTargetListPayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(addTargetListSuccess)
      .catch(addTargetListFail);

      function addTargetListSuccess(response) {
        console.log('[userService.addTargetList] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.postTargetListResponse);
      }

      function addTargetListFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }
  };
