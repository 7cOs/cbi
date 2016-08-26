'use strict';

module.exports = /*  @ngInject */
  function(userService) {
    userService.initCurrentUser().then(function(data) {
      userService.model.currentUser = data;
    });
  };
