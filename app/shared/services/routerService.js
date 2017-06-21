'use strict';

module.exports = /*  @ngInject */
  function routerService($state) {
    return {
      go: $state.go
    };
  };
