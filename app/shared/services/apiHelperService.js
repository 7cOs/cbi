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
     * @memberOf orion.common.services
     */
    function formatQueryString(obj) {
      var queryParams = '',
          i = 0,
          z = Object.keys(obj).length - 1;

      if (obj.type && obj.type === 'stores') {
        // remove type obj
        delete obj.type;

        for (var key1 in obj) {
          queryParams += key1 + '=' + obj[key1];
          if (i !== (z - 1)) queryParams += '&';
          i++;
        }

        return '?' + queryParams;
      } else if (obj.type && obj.type === 'opportunities') {
        queryParams += 'filter=limit:500,sort:store,';

        // remove type obj
        delete obj.type;

        for (var key2 in obj) {
          queryParams += key2 + ':' + obj[key2];
          if (i !== (z - 1)) queryParams += ',';
          i++;
        }

        return '?' + encodeURIComponent(queryParams);
      } else {
        queryParams += 'filter=';

        // remove type obj
        delete obj.type;

        for (var key3 in obj) {
          queryParams += key3 + ':' + obj[key3];
          if (i !== z) queryParams += ',';
          i++;
        }

        return '?' + encodeURIComponent(queryParams);
      }
    }

    /**
     * @name request
     * @desc generate request url
     * @params {String} base - base api url to hit [required]
     * @params {Object} paramsObj - filter params [optional]
     * @returns {String} - formatted url
     * @memberOf orion.common.services
     */
    function request(base, paramsObj) {
      var q = '';

      if (paramsObj) q = formatQueryString(paramsObj);

      return base + q;
    }
  };
