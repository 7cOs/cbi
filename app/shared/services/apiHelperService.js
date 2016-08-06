'use strict';

module.exports =
  function apiHelperService() {

    return {
      formatQueryString: formatQueryString,
      request: request
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

      if (obj.type && obj.type === 'stores') {
        // remove type obj
        delete obj.type;

        for (var key in obj) {
          queryParams += key + '=' + obj[key];
          if (i !== z) queryParams += '&';
          i++;
        }

        return '?' + queryParams;
      } else {
        queryParams += 'filter=';

        // remove type obj
        delete obj.type;

        for (var k in obj) {
          queryParams += k + ':' + obj[k];
          if (i !== z) queryParams += ',';
          i++;
        }

        encodeURIComponent(queryParams);

        return '?' + queryParams;
      }
    }

    /**
     * @name request
     * @desc generate request url
     * @params {String} base - base api url to hit [required]
     * @params {Object} paramsObj - filter params [optional]
     * @returns {String} - formatted url
     * @memberOf andromeda.common.services
     */
    function request(base, paramsObj) {
      var q = '';

      if (paramsObj) q = formatQueryString(paramsObj);

      return base + q;
    }
  };
