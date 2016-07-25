'use strict';

module.exports =
  function apiHelperService() {

    return {
      formatQueryString: formatQueryString
    };

    /**
     * @name formatQueryString
     * @desc transforms object in key-value pairs to a string to be submitted to api
     * @params {Object} obj - object to be mapped
     * @returns {String} - formatted query
     * @memberOf andromeda.common.services
     */
    function formatQueryString(obj) {
      var queryParams = '',
          i = 0,
          z = Object.keys(obj).length - 1;

      for (var key in obj) {
        queryParams += key + ':' + obj[key];
        if (i !== z) queryParams += ',';
        i++;
      }

      // return encodeURIComponent(queryParams);
      // uncomment above when API is ready
      return 'http://jsonplaceholder.typicode.com/posts';
    }

  };
