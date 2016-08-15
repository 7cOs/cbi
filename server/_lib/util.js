'use strict';

module.exports = function(app) {
  return {
    // APPLY TITLE CASING
    titleCase: function(str) {
      var newstr = str.split(' ');
      for (let i = 0; i < newstr.length; i++) {
        let copy = newstr[i].substring(1).toLowerCase();
        newstr[i] = newstr[i][0].toUpperCase() + copy;
      }
      return newstr.join(' ');
    },

    // URL Signing
    sign: function(uri) {
      const crypto = require('crypto-js');
      var params = uri.split('?')[1];
      uri = uri.split('?')[0];
      var en = '/' + app.get('config').api.version + '/' + uri.split('api/')[1];
      var signature = crypto.enc.Base64.stringify(crypto.HmacSHA256(en + app.get('config').api.apiKey, app.get('config').api.key));
      var url = app.get('config').api.url + en + '?signature=' + signature + '&apiKey=' + app.get('config').api.apiKey;
      if (params) {
        url = url + '&' + params;
      }
      console.log(url);
      return url;
    }
  };
};
