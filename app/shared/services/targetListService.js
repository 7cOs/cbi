'use strict';

module.exports =
  function targetListService($http, $q, apiHelperService) {

    var tempData = {
      getTargetListResponse: {
        'id': '1323ss',
        'name': 'Pacific Northwest Opportunities',
        'archived:': false,
        'opportunitiesSummary': {
          'storesCount': 12,
          'targetedOpportunitiesCount': 20,
          'committedOpportunitiesCount': 5,
          'closedOpportunitiesCount': 10,
          'totalClosedDepletions': 352
        },
        'collaborators': [{
          'id': '13782b',
          'user': {
            'id': 'A1B2',
            'firstName': 'Joe',
            'lastName': 'Cerveza',
            'email': 'jCerveza@cbrands.com',
            'phone': '1234567890',
            'role': 'CBBD MDM',
            'accounts': ['Wal-mart', 'PCC']
          },
          'permissionLevel': 'Author',
          'lastViewed': '2015-07-16T19:20:30.45+01:00'
        }, {
          'id': '1212jf',
          'user': {
            'id': 'A1B3',
            'firstName': 'John',
            'lastName': 'Cerveza',
            'email': 'jCerveza2@cbrands.com',
            'phone': '1234567890',
            'role': 'CBBD MDM',
            'accounts': ['Wal-mart', 'PCC']
          },
          'permissionLevel': 'CollaborateAndInvite',
          'lastViewed': '2015-07-16T19:20:30.45+01:00'
        }, {
          'id': 'hkjl88',
          'user': {
            'id': 'A1B4',
            'firstName': 'Jane',
            'lastName': 'Cerveza',
            'email': 'jCerveza3@cbrands.com',
            'phone': '1234567890',
            'role': 'CBBD MDM',
            'accounts': ['Wal-mart', 'PCC']
          },
          'permissionLevel': 'Collaborate',
          'lastViewed': '2015-07-16T19:20:30.45+01:00'
        }]
      },
      updateTargetListPayload: {
        'type': 'object',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'id': 'targetListEditSchema',
        'required': true,
        'properties': {
          'name': {
            'type': 'string',
            'required': 'false',
            'description': 'Name of the Target List.'
          },
          'lastViewed': {
            'type': 'dateString',
            'required': 'false',
            'description': 'Date this Target List was last viewed by the User.'
          },
          'archived': {
            'type': 'boolean',
            'required': 'false',
            'description': 'Indicates whether or not this Target List has been archived by the User.'
          }
        }
      },
      updateTargetListResponse: {
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
      },
      deleteTargetListResponse: {'status': 200},
      getTargetListOpportunitiesResponse: {
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
      addDeleteTargetListOpportunitiesPayload: {
        'required': 'true',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'id': 'opportunityIDListSchema',
        'type': 'array',
        'items': {
          'type': 'string',
          'description': 'Opportunity ID string'
        }
      },
      addDeleteTargetListOpportunitiesResponse: {'status': 200},
      getTargetListSharesResponse: [{
        'id': '13782b',
        'user': {
          'id': 'A1B2',
          'firstName': 'Joe',
          'lastName': 'Cerveza',
          'email': 'jCerveza@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'Author',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }, {
        'id': '1212jf',
        'user': {
          'id': 'A1B3',
          'firstName': 'John',
          'lastName': 'Cerveza',
          'email': 'jCerveza2@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'CollaborateAndInvite',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }, {
        'id': 'hkjl88',
        'user': {
          'id': 'A1B4',
          'firstName': 'Jane',
          'lastName': 'Cerveza',
          'email': 'jCerveza3@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'Collaborate',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }],
      addTargetListSharesPayload: {
        'type': 'array',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'required': 'true',
        'description': 'List of user profile IDs to share an object with and their corresponding permission levels.',
        'id': 'sharedUsersSchema',
        'items': {
          'type': 'object',
          'required': true,
          'properties': {
            'user': {
              'type': 'string',
              'required': 'true',
              'description': 'User ID'
            },
            'permissionLevel': {
              'enum': ['Author', 'CollaborateAndInvite', 'Collaborate'],
              'required': 'true',
              'description': 'Defines the permission level of the specified user for accessing and editing the target list.'
            }
          }
        }
      },
      addTargetListSharesResponse: [{
        'id': '13782b',
        'user': {
          'id': 'A1B2',
          'firstName': 'Joe',
          'lastName': 'Cerveza',
          'email': 'jCerveza@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'Author',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }, {
        'id': '1212jf',
        'user': {
          'id': 'A1B3',
          'firstName': 'John',
          'lastName': 'Cerveza',
          'email': 'jCerveza2@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'CollaborateAndInvite',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }, {
        'id': 'hkjl88',
        'user': {
          'id': 'A1B4',
          'firstName': 'Jane',
          'lastName': 'Cerveza',
          'email': 'jCerveza3@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        },
        'permissionLevel': 'Collaborate',
        'lastViewed': '2015-07-16T19:20:30.45+01:00'
      }],
      deleteTargetListSharesPayload: {
        'type': 'array',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'required': 'true',
        'description': 'List of user profile IDs to share an object with and their corresponding permission levels.',
        'id': 'sharedUsersSchema',
        'items': {
          'type': 'object',
          'required': true,
          'properties': {
            'user': {
              'type': 'string',
              'required': 'true',
              'description': 'User ID'
            },
            'permissionLevel': {
              'enum': ['Author', 'CollaborateAndInvite', 'Collaborate'],
              'required': 'true',
              'description': 'Defines the permission level of the specified user for accessing and editing the target list.'
            }
          }
        }
      },
      deleteTargetListSharesResponse: {'status': 200}
    };

    var service = {
      getTargetList: getTargetList,
      updateTargetList: updateTargetList,
      deleteTargetList: deleteTargetList,
      getTargetListOpportunities: getTargetListOpportunities,
      addTargetListOpportunities: addTargetListOpportunities,
      deleteTargetListOpportunities: deleteTargetListOpportunities,
      getTargetListShares: getTargetListShares,
      addTargetListShares: addTargetListShares,
      deleteTargetListShares: deleteTargetListShares
    };

    return service;

    /**
     * @name getTargetList
     * @desc get target list from web service
     * @params {String} targetListId - id of target list
     * @returns {Object} - target list
     * @memberOf orion.common.services
     */
    function getTargetList(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.request('/api/targetLists/' + targetListId);

      $http.get(url, {
        headers: {}
      })
      .then(getTargetListSuccess)
      .catch(getTargetListFail);

      function getTargetListSuccess(response) {
        console.log('[targetListService.getTargetList] response: ', response);
        // targetListPromise.resolve(response.data);
        targetListPromise.resolve(tempData.getTargetListResponse);
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
     * @memberOf orion.common.services
     */
    function updateTargetList(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.formatQueryString({'foo': 'bar'}),
          payload = tempData.updateTargetListPayload;

      $http.patch(url, payload, {
        headers: {}
      })
      .then(updateTargetListSuccess)
      .catch(updateTargetListFail);

      function updateTargetListSuccess(response) {
        console.log('[targetListService.updateTargetList] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.updateTargetListResponse);
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
     * @memberOf orion.common.services
     */
    function deleteTargetList(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.formatQueryString({'foo': 'bar'}),
          payload = {targetListID: targetListId};

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteTargetListSuccess)
      .catch(deleteTargetListFail);

      function deleteTargetListSuccess(response) {
        console.log('[targetListService.deleteTargetList] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.deleteTargetListResponse);
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
     * @memberOf orion.common.services
     */
    function getTargetListOpportunities(targetListId) {
      var targetListPromise = $q.defer(),
          url = apiHelperService.formatQueryString({'foo': 'bar'});

      $http.get(url, {
        headers: {}
      })
      .then(getTargetListOpportunitiesSuccess)
      .catch(getTargetListOpportunitiesFail);

      function getTargetListOpportunitiesSuccess(response) {
        console.log('[targetListService.getTargetListOpportunities] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.getTargetListOpportunitiesResponse);
      }

      function getTargetListOpportunitiesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name addTargetListOpportunities
     * @desc add target list opportunities
     * @params {String} targetListId - id of target list
     * @returns {Object} - status object
     * @memberOf orion.common.services
     */
    function addTargetListOpportunities(targetListId) {
      var targetListPromise = $q.defer(),
          url = '',
          payload = tempData.addDeleteTargetListOpportunitiesPayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(addTargetListOpportunitiesSuccess)
      .catch(addTargetListOpportunitiesFail);

      function addTargetListOpportunitiesSuccess(response) {
        console.log('[targetListService.addTargetListOpportunities] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.addDeleteTargetListOpportunitiesResponse);
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
     * @memberOf orion.common.services
     */
    function deleteTargetListOpportunities(targetListId) {
      var targetListPromise = $q.defer(),
          url = '',
          payload = tempData.addDeleteTargetListOpportunitiesPayload;

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteTargetListOpportunitiesSuccess)
      .catch(deleteTargetListOpportunitiesFail);

      function deleteTargetListOpportunitiesSuccess(response) {
        console.log('[targetListService.deleteTargetListOpportunities] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.addDeleteTargetListOpportunitiesResponse);
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
     * @returns {Object} - shares object
     * @memberOf orion.common.services
     */
    function getTargetListShares(targetListId) {
      var targetListPromise = $q.defer(),
          url = '';

      $http.get(url, {
        headers: {}
      })
      .then(getTargetListSharesSuccess)
      .catch(getTargetListSharesFail);

      function getTargetListSharesSuccess(response) {
        console.log('[targetListService.getTargetListShares] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.getTargetListSharesResponse);
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
     * @returns {Object} - target shares including new object
     * @memberOf orion.common.services
     */
    function addTargetListShares(targetListId) {
      var targetListPromise = $q.defer(),
          url = '',
          payload = tempData.addTargetListSharesPayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(addTargetListSharesSuccess)
      .catch(addTargetListSharesFail);

      function addTargetListSharesSuccess(response) {
        console.log('[targetListService.addTargetListShares] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.addTargetListSharesResponse);
      }

      function addTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }

    /**
     * @name deleteTargetListShares
     * @desc delete target list shares
     * @params {String} targetListId - id of target list
     * @returns {Object} - status object
     * @memberOf orion.common.services
     */
    function deleteTargetListShares(targetListId) {
      var targetListPromise = $q.defer(),
          url = '',
          payload = tempData.deleteTargetListSharesPayload;

      $http.delete(url, payload, {
        headers: {}
      })
      .then(deleteTargetListSharesSuccess)
      .catch(deleteTargetListSharesFail);

      function deleteTargetListSharesSuccess(response) {
        console.log('[targetListService.deleteTargetListShares] response: ', response);
        // targetListPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        targetListPromise.resolve(tempData.deleteTargetListSharesResponse);
      }

      function deleteTargetListSharesFail(error) {
        targetListPromise.reject(error);
      }

      return targetListPromise.promise;
    }
  };
