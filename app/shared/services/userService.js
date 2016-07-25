'use strict';

module.exports =
  function userService($http, $q, apiHelperService) {

    var tempData = {
      users: [{
        'id': 'A1B2',
        'firstName': 'Joe',
        'lastName': 'Cerveza',
        'email': 'jCerveza@cbrands.com',
        'phone': '1234567890',
        'role': 'CBBD MDM',
        'accounts': ['Wal-mart', 'PCC']
      }, {
        'id': 'A1B2',
        'firstName': 'Joe',
        'lastName': 'Cerveza',
        'email': 'jCerveza@cbrands.com',
        'phone': '1234567890',
        'role': 'CBBD MDM',
        'accounts': ['Wal-mart', 'PCC']
      }],
      notifications: [{
        'id': 'A68YR',
        'title': 'You\'ve been added as a collaborator',
        'objectType': 'Target List',
        'objectID': 'A59XY',
        'description': 'Joe Cerveza has added you as a collaborator on his target list, `West Philadelphia Bars`.'
      }, {
        'id': 'A92XZ',
        'objectType': 'Target List',
        'objectID': '75TJ3',
        'title': 'Opportunity added to list',
        'description': 'John Smith has added an opportunity to your target list, `Modelo`.'
      }],
      hiddenOpportunitiesGetResponse: {
        'count': 351,
        'storesCount': 42,
        'opportunities': [{
          'id': 'SbBGk',
          'product': {
            'id': '2234gg',
            'name': 'Corona',
            'type': 'package',
            'brand': 'Brand Name',
            'description': 'Product description Lorem ipsum sit dolor amet',
            'price': 12.11,
            'quantity': 233
          },
          'type': 'Non-Buy',
          'rank': 1,
          'impact': 'High',
          'status': 'Discussed',
          'rationale': 'Rationale 1',
          'store': {
            'id': 'dsd82',
            'name': 'Store 1',
            'address': '1221 11th St NE, City, ST 12345',
            'premise': true,
            'segmentation': 'A',
            'latitude': 41.8831,
            'longitude': -87.6259
          },
          'itemAuthorizationCode': 'jij23',
          'currentYTDStoreVolume': 54.11,
          'lastYTDStoreVolume': 29.12,
          'volumeTrend': 32.33,
          'storeVelocity': 50.50,
          'storeDistribution': 12.0,
          'last90DaysVolume': 33.11,
          'lastInvoiceDate': '2016-11-05T13:15:30Z'
        }, {
          'id': 'sdsd12',
          'product': {
            'id': '9878dj',
            'name': 'Budweiser',
            'type': 'package',
            'brand': 'Brand Name',
            'description': 'Product description Lorem ipsum sit dolor amet',
            'price': 12.11,
            'quantity': 233
          },
          'type': 'AtRisk',
          'rank': 2,
          'impact': 'Medium',
          'status': 'Discussed',
          'rationale': 'Rationale 1',
          'store': {
            'id': 'dsd82',
            'name': 'Store 1',
            'address': '1221 11th St NE, City, ST 12345',
            'premise': true,
            'segmentation': 'B',
            'latitude': 41.8831,
            'longitude': -87.6259
          },
          'itemAuthorizationCode': 'jij23',
          'currentYTDStoreVolume': 54.11,
          'lastYTDStoreVolume': 29.12,
          'volumeTrend': 32.33,
          'storeVelocity': 50.50,
          'storeDistribution': 12.0,
          'last90DaysVolume': 33.11,
          'lastInvoiceDate': '2016-11-05T13:15:30Z'
        }]
      },
      hideOpportunityPostResponse: {'status': 200},
      deleteHiddenOpportunityDeleteResponse: {'status': 200},
      getOpportunityFilterResponse: [{
        'id': 'A57K3',
        'name': 'Corona in PNW',
        'filterString': 'productname%3Acorona%2Cregion%3Apacificnorthwest'
      }, {
        'id': 'S25T8',
        'name': 'Modelo in Texas',
        'filterString': 'productname%3Amodelo%2Cregion%3Atexas'
      }],
      postOpportunityFilterResponse: {'status': 200},
      getPerformanceSummaryResponse: {
        'performance': [
          {
            'type': 'Depletions CE',
            'measures': [
              {
                'timeframe': 'L30',
                'value': 273400,
                'percentChange': 7.5
              }, {
                'timeframe': 'L60',
                'value': 273400,
                'percentChange': 7.5
              }, {
                'timeframe': 'L90',
                'value': 273400,
                'percentChange': 7.5
              }, {
                'timeframe': 'L120',
                'value': 273400,
                'percentChange': 7.5
              }
            ]
          }, {
            'type': 'Distribution Points - Off Premise, Simple',
            'measures': [
              {
                'timeframe': 'L30',
                'value': 3017,
                'percentChange': -7.5
              }, {
                'timeframe': 'L60',
                'value': 3017,
                'percentChange': -7.5
              }, {
                'timeframe': 'L90',
                'value': 3017,
                'percentChange': -7.5
              }, {
                'timeframe': 'L120',
                'value': 3017,
                'percentChange': -7.5
              }
            ]
          }, {
            'type': 'Distribution Points - Off Premise, Effective',
            'measures': [
              {
                'timeframe': 'L30',
                'value': 8256,
                'percentChange': 9.9
              }, {
                'timeframe': 'L60',
                'value': 8256,
                'percentChange': 9.9
              }, {
                'timeframe': 'L90',
                'value': 8256,
                'percentChange': 9.9
              }, {
                'timeframe': 'L120',
                'value': 8256,
                'percentChange': 9.9
              }
            ]
          }, {
            'type': 'Distribution Points - On Premise, Simple',
            'measures': [
              {
                'timeframe': 'L30',
                'value': 548,
                'percentChange': -3.2
              }, {
                'timeframe': 'L60',
                'value': 548,
                'percentChange': -3.2
              }, {
                'timeframe': 'L90',
                'value': 548,
                'percentChange': -3.2
              }, {
                'timeframe': 'L120',
                'value': 548,
                'percentChange': -3.2
              }
            ]
          }, {
            'type': 'Distribution Points - On Premise, Effective',
            'measures': [
              {
                'timeframe': 'L30',
                'value': 5876,
                'percentChange': 8.7
              }, {
                'timeframe': 'L60',
                'value': 5876,
                'percentChange': 8.7
              }, {
                'timeframe': 'L90',
                'value': 5876,
                'percentChange': 8.7
              }, {
                'timeframe': 'L120',
                'value': 5876,
                'percentChange': 8.7
              }
            ]
          }
        ]
      },
      getPerformanceDepletionResponse: {
        'performance': [
          {
            'type': 'Brand',
            'name': 'Corona',
            'measures': [
              {
                'timeframe': 'L30',
                'depletions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L60',
                'depletions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L90',
                'depletions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L120',
                'depletions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }
            ]
          }
        ]
      },
      getPerformanceDistributionResponse: {
        'performance': [
          {
            'type': 'Brand',
            'name': 'Corona',
            'measures': [
              {
                'timeframe': 'L30',
                'distributions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L60',
                'distributions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L90',
                'distributions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }, {
                'timeframe': 'L120',
                'distributions': 273400,
                'percent_change': 7.5,
                'trend': -1.2,
                'bu_trend': 10.0,
                'ctv': 7,
                'ctg': 5,
                'ctv_to_bu_rank': 1,
                'ctg_to_bu_rank': 3
              }
            ]
          }
        ]
      },
      getPerformanceBrandResponse: {
        'pod_simple': 12,
        'pod_simple_percent': 5,
        'pod_effective': 10,
        'pod_effective_percent': 7.1,
        'performance': [
          {
            'type': 'Brand',
            'name': 'Corona',
            'measures': [
              {
                'timeframe': 'L30',
                'depletions': 273400,
                'depletions_percent': 7.5,
                'distributions': -1.2,
                'distributions_percent': 10.0,
                'velocity': 7,
                'velocity_percent': 5
              }, {
                'timeframe': 'L60',
                'depletions': 273400,
                'depletions_percent': 7.5,
                'distributions': -1.2,
                'distributions_percent': 10.0,
                'velocity': 7,
                'velocity_percent': 5
              }, {
                'timeframe': 'L90',
                'depletions': 273400,
                'depletions_percent': 7.5,
                'distributions': -1.2,
                'distributions_percent': 10.0,
                'velocity': 7,
                'velocity_percent': 5
              }, {
                'timeframe': 'L120',
                'depletions': 273400,
                'depletions_percent': 7.5,
                'distributions': -1.2,
                'distributions_percent': 10.0,
                'velocity': 7,
                'velocity_percent': 5
              }
            ]
          }
        ]
      },
      getPerformanceTopBottomResponse: {
        'performance': [
          {
            'type': 'Account',
            'name': 'Walmart',
            'measures': [
              {
                'timeframe': 'L30',
                'depletions': 273400,
                'depletions_trend': 7.5,
                'distributions_simple': 1000,
                'distributions_simple_trend': -1.2,
                'distributions_effective': 1200,
                'distributions_effective_trend': 10.0,
                'velocity': 7,
                'velocity_trend': 5
              }, {
                'timeframe': 'L60',
                'depletions': 273400,
                'depletions_trend': 7.5,
                'distributions_simple': 1000,
                'distributions_simple_trend': -1.2,
                'distributions_effective': 1200,
                'distributions_effective_trend': 10.0,
                'velocity': 7,
                'velocity_trend': 5
              }, {
                'timeframe': 'L90',
                'depletions': 273400,
                'depletions_trend': 7.5,
                'distributions_simple': 1000,
                'distributions_simple_trend': -1.2,
                'distributions_effective': 1200,
                'distributions_effective_trend': 10.0,
                'velocity': 7,
                'velocity_trend': 5
              }, {
                'timeframe': 'L120',
                'depletions': 273400,
                'depletions_trend': 7.5,
                'distributions_simple': 1000,
                'distributions_simple_trend': -1.2,
                'distributions_effective': 1200,
                'distributions_effective_trend': 10.0,
                'velocity': 7,
                'velocity_trend': 5
              }
            ]
          }
        ]
      },
      getTargetListsResponse: {
        'owned': [
          {
            'id': '1323ss',
            'name': 'Pacific Northwest Opportunities',
            'opportunities': 41,
            'archived:': false,
            'opportunitiesSummary': {
              'storesCount': 12,
              'targetedOpportunitiesCount': 20,
              'committedOpportunitiesCount': 5,
              'closedOpportunitiesCount': 10,
              'totalClosedDepletions': 352
            },
            'created_at': '2016-11-05T13:15:30Z'
          }, {
            'id': '1323ss',
            'name': 'Pacific Northwest Opportunities',
            'opportunities': 211,
            'archived:': false,
            'opportunitiesSummary': {
              'storesCount': 12,
              'targetedOpportunitiesCount': 20,
              'committedOpportunitiesCount': 5,
              'closedOpportunitiesCount': 10,
              'totalClosedDepletions': 352
            },
            'created_at': '2016-11-05T13:15:30Z'
          }
        ],
        'sharedWithMe': [
          {
            'id': '1323ss',
            'name': 'Pacific Northwest Opportunities',
            'opportunities': 41,
            'archived:': false,
            'opportunitiesSummary': {
              'storesCount': 12,
              'targetedOpportunitiesCount': 20,
              'committedOpportunitiesCount': 5,
              'closedOpportunitiesCount': 10,
              'totalClosedDepletions': 352
            },
            'created_at': '2016-11-05T13:15:30Z'
          }
        ]
      },
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

    var model = {
      id: 'A1B2',
      firstName: 'Joe',
      lastName: 'Cerveza',
      email: 'jCerveza@cbrands.com',
      phone: '1234567890',
      role: 'CBBD MDM',
      accounts: ['Wal-mart', 'PCC']
    };

    return {
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

    /**
     * @name getUsers
     * @desc get data for all users or one user
     * @params {String} id - id of a user [Optional]
     * @returns {Array or Object} - Array of all users or object of one user
     * @memberOf andromeda.common.services
     */
    function getUsers(id) {
      var usersPromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      if (id && id !== '') url += encodeURIComponent('userID:' + id);

      $http.get(url, {
        headers: {}
      })
      .then(getUsersSuccess)
      .catch(getUsersFail);

      function getUsersSuccess(response) {
        console.log('[userService.getUsers] response: ', response);
        // usersPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        id && id !== '' ? usersPromise.resolve(tempData.users[0]) : usersPromise.resolve(tempData.users);
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
     * @memberOf andromeda.common.services
     */
    function getHiddenOpportunities(id) {
      var hiddenOpportunitiesPromise = $q.defer(),
          url = apiHelperService.formatUrl({
            'baseUrl': '',
            'signature': '',
            'apiKey': '',
            'id': id
          });

      $http.get(url, {
        headers: {}
      })
      .then(getHiddenOpportunitiesSuccess)
      .catch(getHiddenOpportunitiesFail);

      function getHiddenOpportunitiesSuccess(response) {
        console.log('[userService.getHiddenOpportunities] response: ', response);
        // hiddenOpportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        hiddenOpportunitiesPromise.resolve(tempData.hiddenOpportunitiesGetResponse);
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
     * @memberOf andromeda.common.services
     */
    function hideOpportunity(id) {
      var hideOpportunityPromise = $q.defer(),
          url = apiHelperService.formatUrl({
            'baseUrl': '',
            'signature': '',
            'apiKey': '',
            'id': id
          }),
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
     * @memberOf andromeda.common.services
     */
    function deleteHiddenOpportunity(id, opportunityId) {
      var deleteHiddenOpportunityPromise = $q.defer(),
          url = apiHelperService.formatUrl({
            'baseUrl': '',
            'signature': '',
            'apiKey': '',
            'id': id
          }),
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
     * @params {String} url - API Url
     * @params {String} id - id of a user
     * @returns {Array} - Array of all notifications for a user
     * @memberOf andromeda.common.services
     */
    function getNotifications(url, id) {
      var notificationsPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getNotificationsSuccess)
      .catch(getNotificationsFail);

      function getNotificationsSuccess(response) {
        console.log('[userService.getNotifications] response: ', response);
        // notificationsPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        notificationsPromise.resolve(tempData.notifications);
      }

      function getNotificationsFail(error) {
        notificationsPromise.reject(error);
      }

      return notificationsPromise.promise;
    }

    /**
     * @name getOpportunityFilters
     * @desc get all opportunity filters for a user
     * @params {String} userId - id of a user
     * @returns {Array} - Array of all opportunity filters for a user
     * @memberOf andromeda.common.services
     */
    function getOpportunityFilters(userId) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.formatQueryString({'foo': 'bar'});

      $http.get(url, {
        headers: {}
      })
      .then(getOpportunityFiltersSuccess)
      .catch(getOpportunityFiltersFail);

      function getOpportunityFiltersSuccess(response) {
        console.log('[userService.getOpportunityFilters] response: ', response);
        // opportunityFilterPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunityFilterPromise.resolve(tempData.getOpportunityFilterResponse);
      }

      function getOpportunityFiltersFail(error) {
        opportunityFilterPromise.reject(error);
      }

      return opportunityFilterPromise.promise;
    }

    /**
     * @name saveOpportunityFilter
     * @desc save new filter for a user
     * @params {String} userId - id of a user
     * @params {Object} payload - filter settings to be saved
     * @returns {Object} - Status Object
     * @memberOf andromeda.common.services
     */
    function saveOpportunityFilter(userId, payload) {
      var opportunityFilterPromise = $q.defer(),
          url = apiHelperService.formatQueryString();

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
     * @params {String} userId - id of a user
     * @returns {Object} - performance summary -- will this still be an object with an array? Seems like we can cut out the object and just return the array - WAJ 07/25
     * @memberOf andromeda.common.services
     */
    function getPerformanceSummary(userId) {
      var performancePromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceSummarySuccess)
      .catch(getPerformanceSummaryFail);

      function getPerformanceSummarySuccess(response) {
        console.log('[userService.getPerformanceSummary] response: ', response);
        // performancePromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        performancePromise.resolve(tempData.getPerformanceSummaryResponse);
      }

      function getPerformanceSummaryFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceDepletion
     * @desc get performance depletion for a user
     * @params {String} userId - id of a user
     * @returns {Object} - user performance depletion
     * @memberOf andromeda.common.services
     */
    function getPerformanceDepletion(userId) {
      var performancePromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceDepletionSuccess)
      .catch(getPerformanceDepletionFail);

      function getPerformanceDepletionSuccess(response) {
        console.log('[userService.getPerformanceDepletion] response: ', response);
        // performancePromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        performancePromise.resolve(tempData.getPerformanceDepletionResponse);
      }

      function getPerformanceDepletionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceDistribution
     * @desc get performance distribution for a user
     * @params {String} userId - id of a user
     * @returns {Object} - user performance distribution
     * @memberOf andromeda.common.services
     */
    function getPerformanceDistribution(userId) {
      var performancePromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceDistributionSuccess)
      .catch(getPerformanceDistributionFail);

      function getPerformanceDistributionSuccess(response) {
        console.log('[userService.getPerformanceDistribution] response: ', response);
        // performancePromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        performancePromise.resolve(tempData.getPerformanceDistributionResponse);
      }

      function getPerformanceDistributionFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceBrand
     * @desc get performance brand for a user
     * @params {String} userId - id of a user
     * @returns {Object} - user performance brand
     * @memberOf andromeda.common.services
     */
    function getPerformanceBrand(userId) {
      var performancePromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceBrandSuccess)
      .catch(getPerformanceBrandFail);

      function getPerformanceBrandSuccess(response) {
        console.log('[userService.getPerformanceBrand] response: ', response);
        // performancePromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        performancePromise.resolve(tempData.getPerformanceBrandResponse);
      }

      function getPerformanceBrandFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getPerformanceTopBottom
     * @desc get performance top bottom snapshot for a user
     * @params {String} userId - id of a user
     * @returns {Object} - user performance top bottom snapshot
     * @memberOf andromeda.common.services
     */
    function getPerformanceTopBottom(userId) {
      var performancePromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getPerformanceTopBottomSuccess)
      .catch(getPerformanceTopBottomFail);

      function getPerformanceTopBottomSuccess(response) {
        console.log('[userService.getPerformanceTopBottom] response: ', response);
        // performancePromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        performancePromise.resolve(tempData.getPerformanceTopBottomResponse);
      }

      function getPerformanceTopBottomFail(error) {
        performancePromise.reject(error);
      }

      return performancePromise.promise;
    }

    /**
     * @name getTargetLists
     * @desc get target list for a user
     * @params {String} userId - id of a user
     * @returns {Object} - user target lists
     * @memberOf andromeda.common.services
     */
    function getTargetLists(userId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.get(url, {
        headers: {}
      })
      .then(getTargetListsSuccess)
      .catch(getTargetListsFail);

      function getTargetListsSuccess(response) {
        console.log('[userService.getTargetLists] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.getTargetListsResponse);
      }

      function getTargetListsFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name addTargetList
     * @desc add target list for a user
     * @params {String} userId - id of a user
     * @returns {Object} - newly added target list
     * @memberOf andromeda.common.services
     */
    function addTargetList(userId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.formatQueryString(),
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
