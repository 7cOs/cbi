'use strict';

module.exports = /*  @ngInject */
  function httpInterceptorService($q) {
    var responseError = function (rejection) {
      if (rejection.status === 403) {
        console.log('redirecting');
        window.location.href = '/auth/login';
      }
      return $q.reject(rejection);
    };

    return {
      responseError: responseError
    };
  };
