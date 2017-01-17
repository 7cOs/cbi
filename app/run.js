'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, userService, encodingService) {

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
  };
