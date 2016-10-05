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
        'CUSTOM': 'Custom',
        'AT_RISK': 'At Risk',
        'NON_BUY': 'Non-Buy',
        'NEW_PLACEMENT_NO_REBUY': 'New Placement No Rebuy',
        'NEW_PLACEMENT_QUALITY': 'New Placement Quality',
        'LOW_VELOCITY': 'Low Velocity'
      };

      return map[str];
    };
  };
