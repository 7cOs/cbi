'use strict';

module.exports = {

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
    var en = '/v2/' + uri.split('api/')[1];
    var key = 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=';
    var apiKey = 'test';
    var baseUrl = 'http://cbrands-deloitte-dev.herokuapp.com';
    var signature = crypto.enc.Base64.stringify(crypto.HmacSHA256(en + apiKey, key));
    // var url = baseUrl + en + '?signature=' + signature + '&apiKey=' + apiKey + '&useTestData=true';
    var url = baseUrl + en + '?signature=' + signature + '&apiKey=' + apiKey;
    if (params) {
      url = url + '&' + params;
    }
    console.log(url);
    return url;
  }

};
