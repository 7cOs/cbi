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
      notificationPatchResponse: {'status': 200},
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
      deleteHiddenOpportunityDeleteResponse: {'status': 200}
    };

    return {
      getUsers: getUsers,
      getNotifications: getNotifications,
      markNotificationAsRead: markNotificationAsRead,
      getHiddenOpportunities: getHiddenOpportunities,
      hideOpportunity: hideOpportunity,
      deleteHiddenOpportunity: deleteHiddenOpportunity
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
          url = apiHelperService.formatUrl({
            'baseUrl': '',
            'signature': '',
            'apiKey': ''
          });

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
     * @name markNotificationAsRead
     * @desc mark a notification as read
     * @params {String} id - id of a user
     * @params {String} notificationId - id of notification for that user
     * @returns {Object} - Status object
     * @memberOf andromeda.common.services
     */
    function markNotificationAsRead(id, notificationId) {
      var notificationsPromise = $q.defer(),
          url = 'http://jsonplaceholder.typicode.com/posts';

      $http.patch(url, {'read': true}, {
        headers: {}
      })
      .then(markNotificationAsReadSuccess)
      .catch(markNotificationAsReadFail);

      function markNotificationAsReadSuccess(response) {
        console.log('[userService.markNotificationAsRead] response: ', response);
        // notificationsPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        notificationsPromise.resolve(tempData.notificationPatchResponse);
      }

      function markNotificationAsReadFail(error) {
        notificationsPromise.reject(error);
      }

      return notificationsPromise.promise;
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

  };
