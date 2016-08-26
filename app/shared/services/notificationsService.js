'use strict';

module.exports = /*  @ngInject */
  function notificationsService($http, $q, apiHelperService) {

    return {
      status: {
        UNSEEN: 'UNSEEN',
        SEEN: 'SEEN',
        READ: 'READ'
      },
      markNotification: markNotification
    };

    /**
     * @name markNotification
     * @desc mark a notification as read
     * @params {String} notificationId - id of notification for that user
     * @returns {Object} - Status object
     * @memberOf cf.common.services
     */
    function markNotification(notificationId, state) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/api/notifications'),
          data = [
            {
              'id': notificationId,
              'status': state
            }
          ];

      $http.patch(url, data)
        .then(
          notificationsPromise.resolve,
          notificationsPromise.reject
        );

      return notificationsPromise.promise;
    }
  };
