'use strict';

module.exports = /* @ngInject */
  function zipcode() {
    /**
    * @name zipcode
    * @desc convert nine digit zipcodes to four with a dash
    * @params {string} str - string to be converted
    * @returns {string} - transformed string
    * @memberOf cf.common.filtersService
    */
    return function(str) {
      var tempStr = '';

      if (!str || str === '') return '';

      if (str.length === 5) return str;

      if (str.length === 9) {
        tempStr = str.slice(0, 5) + '-' + str.slice(5);
        return tempStr;
      }

      return str;

    };
  };
