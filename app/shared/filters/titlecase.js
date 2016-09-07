'use strict';

module.exports = /*  @ngInject */
  function titlecase() {
    /**
     * @name titlecase
     * @desc convert string to title case
     * @params {String} str - string to be converted
     * @returns {String} - capitalized string
     * @memberOf cf.common.filters
     */
    return function(str) {
      if (!str || str === '') return '';

      var newStr = '',
          strArr = str.split(' ');

      for (var i = 0; i < strArr.length; i++) {
        newStr += strArr[i].charAt(0).toUpperCase() + strArr[i].substr(1).toLowerCase();
        newStr += i !== strArr.length - 1 ? ' ' : '';
      }

      return newStr;
    };
  };
