'use strict';

module.exports =
  function distributorsService($http, $q) {
    var queryObj = {
      url: '',
      protocol: 'https',
      endPoint: 'apigateway.us-west-2.amazonaws.com',
      action: 'GET',
      awsAccessKeyId: '', // From AWS
      signatureMethod: 'HmacSHA256',
      signatureVersion: '2',
      signature: '',
      timestamp: new Date()
    };
    var queryString = '';

    var data = [{
      'id': 'A1B2',
      'name': 'Bob\'s Distribution',
      'address': '555 Pretty Good Ave, Seattle, WA 98103'
    }, {
      'id': 'A1B2',
      'name': 'Alice\'s Distribution',
      'address': '555 Pretty Good Ave, Seattle, WA 98103'
    }];

    return {
      all: function() {
        return data;
      },
      getDistributors: getDistributors
    };

    /**
     * @name getDistributors
     * @desc Get distributors from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getDistributors(url) {
      var distributorsPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getDistributorsSuccess)
      .catch(getDistributorsFail);

      function getDistributorsSuccess(response) {
        console.log('[distributorsService.getDistributors] response: ', response);
        // distributorsPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        distributorsPromise.resolve(data);
      }

      function getDistributorsFail(error) {
        distributorsPromise.reject(error);
      }

      return distributorsPromise.promise;
    }
  };
