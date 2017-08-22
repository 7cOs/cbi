'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, $analytics, userService, encodingService) {

    const userEncoded = $cookies.get('user');
    let userProfile = '{}';

    if (userEncoded) {
      userProfile = encodingService.base64Decode(userEncoded);
    }

    userService.model.currentUser = JSON.parse(userProfile);
  };
