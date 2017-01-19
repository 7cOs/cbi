'use strict';

module.exports = /*  @ngInject */
  function encodingService($window) {
    var cryptoJs = $window.CryptoJS;

    return {
      /**
       * @name base64Decode
       * @desc Decodes a base64 string to UTF-8. Uses cryptoJS implementation to support Unicode (which window.atob() does not).
       * @params {String} encodedValue - An ASCII string which is a base64-encoded representation of a UTF-8 string.
       * @returns {String} The UTF-8 string resulting from decoding the base64 input string.
       * @memberOf cf.common.services
       */
      base64Decode: function (encodedValue) {
        return cryptoJs.enc.Base64.parse(encodedValue).toString(cryptoJs.enc.Utf8);
      }
    };
  };
