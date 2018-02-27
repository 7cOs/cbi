'use strict';

module.exports = /*  @ngInject */
  function versionService($http, $q) {

    var model = {
      version: {}
    };

    var service = {
      model: model,
      getVersion: getVersion
    };

    return service;

    function getVersion() {
      var versionsPromise = $q.defer(),
          url =  '/version';

      $http.get(url)
        .then(getversionSuccess)
        .catch(getversionFail);

      function getversionSuccess(response) {
        versionsPromise.resolve(response.data);
      }

      function getversionFail(error) {
        versionsPromise.reject(error);
      }

      return versionsPromise.promise;
    }
  };
