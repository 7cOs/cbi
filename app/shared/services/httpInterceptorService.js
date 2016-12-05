'use strict';

module.exports = /*  @ngInject */
  function httpInterceptorService($q, $location) {
    var responseError = function (rejection) {
      if (rejection.status === 403) {
        $location.path('/auth/login');
      }
      return $q.reject(rejection);
    };

    return {
      responseError: responseError
    };
  };
