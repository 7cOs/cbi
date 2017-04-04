'use strict';

module.exports = /*  @ngInject */
  function truncateText() {
    /**
     * @name truncateText
     * @desc truncate string to specified length and add elipses
     * @params {String} str - string to be converted
     * @params {Number} length - length of output string (including elipses)
     * @returns {String} - string with length of number of
     *   characters specified, with elipses for last three digits
     * @memberOf cf.common.filters
     */
    return function(str, length) {
      if (!str || str === '') return '';
      if (str.length <= length) return str;

      var lastIndex = length - 3; // subtract 3 for elipses
      var output = str.substring(0, lastIndex);
      output = output + '...';

      return output;
    };
  };
