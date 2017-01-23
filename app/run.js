'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, userService, encodingService, $analytics, $window, analyticsHelperService) {

    var userEncoded = $cookies.get('user'),
      gaEncoded = $cookies.get('ga'),
      userObj = '{}',
      gaObj = '{}';

    if (userEncoded) {
      userObj = encodingService.base64Decode(userEncoded);
    }

    if (gaEncoded) {
      gaObj = encodingService.base64Decode(gaEncoded);
    }

    userService.model.currentUser = JSON.parse(userObj);
    $rootScope.analytics = JSON.parse(gaObj);

    // normally tracker is created right after analytics script loads, but
    // analytics must load prior to angular app (angulartics GA plugin requirement),
    // so we create tracker here after obtaining analytics ID & user ID
    $window.ga('create', $rootScope.analytics.id, 'auto', {
      userId: userService.model.currentUser.employeeID || 'undefined'
    });

    // custom page view tracking
    analyticsHelperService.trackPageViews();
  };
