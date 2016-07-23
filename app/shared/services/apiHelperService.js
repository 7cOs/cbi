'use strict';

module.exports =
  function apiHelperService() {

    return {
      formatUrl: formatUrl
    };

    /**
     * @name formatUrl
     * @desc transforms object in key-value pairs to a string to be submitted to api
     * @params {Object} obj - object to be mapped
     * @returns {String} - formatted api url
     * @memberOf andromeda.common.services
     */
    function formatUrl(obj) {
      var url = '',
          i = 0,
          z = Object.keys(obj).length - 1;

      for (var key in obj) {
        url += key + ':' + obj[key];
        if (i !== z) url += ',';
        i++;
      }

      return encodeURIComponent(url);
    }

  };
