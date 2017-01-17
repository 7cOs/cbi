'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, userService, encodingService, $analytics) {

    var userEncoded = $cookies.get('user'),
      gaEncoded = $cookies.get('ga'),
      user = '{}',
      ga = '{}';

    if (userEncoded) {
      user = encodingService.base64Decode(userEncoded);
    }

    if (gaEncoded) {
      ga = encodingService.base64Decode(gaEncoded);
    }

    userService.model.currentUser = JSON.parse(user);
    $rootScope.analytics = JSON.parse(ga);

    // set GA userId (handles possibility of a race condition where ga('create') happens before run completes)
    $analytics.setUsername(userService.model.currentUser.employeeID);
  };
