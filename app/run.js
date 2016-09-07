'use strict';

module.exports = /*  @ngInject */
  function($rootScope, $cookies, userService) {

    var user = $cookies.get('user');
    userService.model.currentUser = JSON.parse(user);
    $rootScope.analytics = JSON.parse($cookies.get('ga'));
  };
