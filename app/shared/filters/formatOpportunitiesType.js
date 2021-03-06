'use strict';

module.exports = /*  @ngInject */
  function formatOpportunitiesType() {
    /**
     * @name formatOpportunitiesType
     * @desc convert string to custom format
     * @params {String} str - string to be converted
     * @returns {String} - replace string
     * @memberOf cf.common.filters
     */
    return function(str) {
      var map = {
        'Mixed': 'Custom',
        'ND001': 'New Distribution',
        'ND_001': 'New Distribution',
        'AT_RISK': 'At Risk',
        'NON_BUY': 'Non-Buy',
        'NEW_PLACEMENT_NO_REBUY': 'New Placement No Rebuy',
        'NEW_PLACEMENT_QUALITY': 'New Placement Quality',
        'LOW_VELOCITY': 'Low Velocity'
      };

      if (!map[str]) {
        return str;
      } else {
        return map[str];
      }
    };
  };
