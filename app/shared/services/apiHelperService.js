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
<<<<<<< 910171c05e26e3ad2545420b7db09910a630f8e3
          z = Object.keys(obj).length - 1;
=======
          z = Object.keys(obj).length;
>>>>>>> added api helper service

      for (var key in obj) {
        url += key + ':' + obj[key];
        if (i !== z) url += ',';
        i++;
      }

      return encodeURIComponent(url);
    }

  };
