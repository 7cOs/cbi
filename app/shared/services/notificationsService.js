'use strict';

module.exports = /*  @ngInject */
  function notificationsService($http, $q, apiHelperService) {

    return {
      status: {
        UNSEEN: 'UNSEEN',
        SEEN: 'SEEN',
        READ: 'READ'
      },
      markNotifications: markNotifications
    };

    /**
     * @name markNotification
     * @desc mark a notification as read
     * @params {String} notificationId - id of notification for that user
     * @returns {Object} - Status object
     * @memberOf cf.common.services
     */
    function markNotifications(notifications) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/v2/notifications');

      $http.patch(url, notifications)
        .then(
          notificationsPromise.resolve,
          notificationsPromise.reject
        );

      return notificationsPromise.promise;
    }
  };
