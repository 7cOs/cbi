'use strict';

module.exports = /*  @ngInject */
  function apiHelperService(filtersService) {

    return {
      formatQueryString: formatQueryString,
      request: request
    };

    /**
     * @name formatQueryString
     * @desc transforms object in key-value pairs to a string to be submitted to api
     * @params {Object} obj - object to be mapped
     * @returns {String} - formatted query
     * @memberOf cf.common.services
     */
    function formatQueryString(obj) {
      var queryParams = '',
          i = 0,
          z = Object.keys(obj).length - 1;

      if (obj.type && obj.type === 'store') {
        // remove type obj
        delete obj.type;

        for (var key1 in obj) {
          queryParams += key1 + '=' + obj[key1];
          if (i !== (z - 1)) queryParams += '&';
          i++;
        }

        return '?' + queryParams;
      } else if (obj.type && obj.type === 'opportunities') {
        queryParams += '';

        // remove type obj
        delete obj.type;
        for (var key2 in obj) {
          var somethingAdded = false;
          if (obj[key2].constructor === Array && obj[key2].length > 0) {

            if (key2 === 'cbbdChain') { // Both selected and None, leave blank
              if (obj[key2].length === 1 && obj[key2][0] === 'Independent') {
                queryParams += 'cbbdChain:false';
                somethingAdded = true;
              } else if (obj[key2].length === 1 && obj[key2][0] === 'CBBD Chain') {
                queryParams += 'cbbdChain:true';
                somethingAdded = true;
              }
            } else {
              // iterate over arrays
              for (var k = 0; k < obj[key2].length; k++) {
                if (obj[key2][k].toUpperCase() === 'ALL TYPES') break;
                if (k === 0) queryParams += key2 + ':';

                // transform opp types to db format
                if (key2 === 'opportunityType') {
                  queryParams += obj[key2][k].replace(/["'()]/g, '').replace(/[__-\s]/g, '_').toUpperCase();
                } else if (key2 === 'impact') {
                  queryParams += obj[key2][k].slice(0, 1);
                } else if (key2 === 'opportunityStatus') {
                  if (obj[key2][k] === 'closed') {
                    queryParams += 'targeted'; // closed is the same thing as targeted in api.
                  } else {
                    queryParams += obj[key2][k].toLowerCase();
                  }
                } else if (key2 === 'tradeChannel') {
                  var tradeChannelValue = filtersService.model.tradeChannels[filtersService.model.selected.premiseType].map(function(e) {
                    if (e.name === obj[key2][k]) return e.value;
                  });
                  for (var l = 0; l < tradeChannelValue.length; l++) {
                    if (tradeChannelValue[l]) queryParams += tradeChannelValue[l];
                  }
                } else {
                  queryParams += obj[key2][k];
                }

                // add separator if it's not last item
                if (obj[key2].length - 1 !== k) queryParams += '|';

                somethingAdded = true;
              }
            }
          } else if (obj[key2].constructor !== Array) {
            queryParams += key2 + ':' + obj[key2];
            somethingAdded = true;
          }

          if (i !== (z - 1) && somethingAdded) queryParams += ',';
          i++;
        }

        console.log('[apiHelperService.formatQueryString]', queryParams);

        return '?limit=2000&sort=store&filter=' + encodeURIComponent(queryParams);
      } else if (obj.type && obj.type === 'targetLists') {
        delete obj.type;

        queryParams += '?archived=true';

        return queryParams;
      } else if (obj.type && obj.type === 'noencode') {
        queryParams += 'filter=';

        // remove type obj
        delete obj.type;

        for (var key4 in obj) {
          queryParams += key4 + ':' + obj[key4];
          if (i !== z) queryParams += ',';
          i++;
        }

        return '?' + queryParams;
      } else {
        queryParams += 'filter=';

        // remove type obj
        delete obj.type;

        for (var key5 in obj) {
          queryParams += key5 + ':' + obj[key5];
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
     * @memberOf cf.common.services
     */
    function request(base, paramsObj) {
      var q = '';

      if (paramsObj) q = formatQueryString(paramsObj);

      return base + q;
    }
  };
