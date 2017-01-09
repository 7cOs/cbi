'use strict';

module.exports = /*  @ngInject */
  function httpInterceptorService($q) {
    var responseError = function (rejection) {
      if (rejection.status === 401) {
        console.log('redirecting');
        window.location.href = '/auth/expired';
      }
      return $q.reject(rejection);
    };

    return {
      responseError: responseError
    };
  };
