'use strict';

module.exports = /*  @ngInject */
  function notificationsService($http, $q, apiHelperService) {

    var tempData = {
      notificationPatchResponse: {'status': 200},
      notifications: [
        {
          'read': false,
          'type': 'share',
          'title': 'An opportunity has been shared with you',
          'date': 'Today, 11:30 am',
          'user': 'Bil Pacifico',
          'source': 'Walmart #2327',
          'sku': 'Corona LT 12pk - 12oz BT',
          'status': 'At risk'
        }, {
          'read': true,
          'type': 'note',
          'title': 'A new note was added to your account',
          'date': 'Yesterday, 5:30 pm',
          'user': 'John Cervesa',
          'source': 'Fareway #9812'
        }, {
          'read': false,
          'type': 'share',
          'title': 'An opportunity has been shared with you',
          'date': 'July 19, 5:12 pm',
          'user': 'Rudolf Modelo',
          'source': 'Walmart #2327',
          'sku': 'Corona LT 12pk - 12oz BT',
          'status': 'Nonbuy'
        }, {
          'read': false,
          'type': 'collaboration',
          'title': 'You\'ve been added as a collaborator',
          'date': 'July 19, 10:03 am',
          'user': 'Rudolf Modelo',
          'source': 'Walmart East Bay'
        }
      ]
    };

    return {
      tempData: function() {
        return tempData;
      },
      markNotificationAsRead: markNotificationAsRead
    };

    /**
     * @name markNotificationAsRead
     * @desc mark a notification as read
     * @params {String} notificationId - id of notification for that user
     * @returns {Object} - Status object
     * @memberOf orion.common.services
     */
    function markNotificationAsRead(notificationId) {
      var notificationsPromise = $q.defer(),
          url = apiHelperService.request('/api/notifications/' + notificationId),
          data = {'read': true};

      $http.patch(url, data)
        .then(markNotificationAsReadSuccess)
        .catch(markNotificationAsReadFail);

      function markNotificationAsReadSuccess(response) {
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
