'use strict';

module.exports = /*  @ngInject */
  function hispanicMarketTypeFormat() {
    /**
     * @name hispanicMarketTypeFormat
     * @desc maps string to hispanic market type format
     * @params {String} str - string to be converted
     * @returns {String} - converted string if match found, else str
     * @memberOf cf.common.filters
     */
    return function(str) {
      switch (str) {
        case 'GM':
          return 'General Market';
        case 'HISPANIC':
          return 'Hispanic';
        case 'UNASSIGNED':
          return 'Unassigned';
        default:
          return str;
      }
    };
  };
