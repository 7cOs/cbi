'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, userService, encodingService) {
    const userEncoded = $cookies.get('user');
    const emptyProfile = {analytics: {}, sfdcUserInfo: {}};

    userService.model.currentUser = userEncoded
      ? JSON.parse(encodingService.base64Decode(userEncoded))
      : emptyProfile;
  };
