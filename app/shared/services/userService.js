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
      notificationPatchResponse: {'status': 200}
    };

    console.log(apiHelperService.formatUrl({'foo': 'bar', 'userId': '1'}));

    return {
      getUsers: getUsers,
      getNotifications: getNotifications,
      markNotificationAsRead: markNotificationAsRead
    };

    /**
     * @name getUsers
     * @desc get data for all users or one user
     * @params {String} url - API Url
     * @params {String} id - id of a user [Optional]
     * @returns {Array or Object} - Array of all users or object of one user
     * @memberOf andromeda.common.services
     */
    function getUsers(url, id) {
      var usersPromise = $q.defer();

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

  };
