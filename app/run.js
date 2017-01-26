'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, $analytics, userService, encodingService, analyticsHelperService) {

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

    // GA tracker is normally created right after analytics script loads, but
    // the angulartics GA plugin requires GA to load load prior to angular, so
    // we create the tracker separately here after obtaining analytics ID & user ID
    analyticsHelperService.createTracker($rootScope.analytics.id, userService.model.currentUser.employeeID);

    // custom page view tracking
    analyticsHelperService.trackPageViews();

    // fetch additional user info from SFDC and set as custom GA dimensions
    analyticsHelperService.setCustomDimensions();
  };
