'use strict';

module.exports =
  function notificationsService($http, $q, apiHelperService) {

    var tempData = {
      notificationPatchResponse: {'status': 200}
    };

    return {
      markNotificationAsRead: markNotificationAsRead
    };

    /**
     * @name markNotificationAsRead
     * @desc mark a notification as read
     * @params {String} notificationId - id of notification for that user
     * @returns {Object} - Status object
     * @memberOf andromeda.common.services
     */
    function markNotificationAsRead(notificationId) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.formatQueryString();

      $http.patch(url, {'read': true}, {
        headers: {}
      })
      .then(markNotificationAsReadSuccess)
      .catch(markNotificationAsReadFail);

      function markNotificationAsReadSuccess(response) {
        console.log('[notificationsService.markNotificationAsRead] response: ', response);
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
