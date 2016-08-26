'use strict';

module.exports = /*  @ngInject */
  function($cookies, userService) {

    var user = $cookies.get('user');
    userService.model.currentUser = JSON.parse(user);
  };
