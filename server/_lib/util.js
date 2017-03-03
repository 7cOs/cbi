'use strict';

module.exports = function(app) {
  // for analytics
  const git   = require('git-rev-sync'),
        pjson = require('../../package'),
        xmlParser = require('xml2json'),
        logutil = require('./logutil');

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
      // Adedd encodeURIComponent as signature is supposed to be encoded - WJAY 10/3
      var url = app.get('config').api.url + en + '?signature=' + encodeURIComponent(signature) + '&apiKey=' + app.get('config').api.apiKey;
      if (params) {
        url = url + '&' + params;
      }

      return url;
    },

    // API Analytics headers
    agentHeader: function() {
      let version = pjson.version;
      let hash    = process.env.HEROKU_SLUG_DESCRIPTION || git.short();
      return JSON.stringify({app: {version: version, build: hash}});
    },

    userHeader: function(employeeID) {
      return JSON.stringify({loggedInEmployeeId: employeeID});
    },

    userHeaderFromSaml: function(samlResponse) {
      let samlJson;
      let uniqueId;
      try {
        // convert base64 into JSON
        samlJson = xmlParser.toJson(Buffer.from(samlResponse, 'base64').toString("ascii"), {object: true});
        uniqueId = samlJson['thing']['samlp:Response']['saml:Assertion']['saml:Subject']['saml:NameID']['$t'];
      } catch (e) {
        logutil.logError(e);
        uniqueId = '';
      }
      return JSON.stringify({loggedInEmployeeId: uniqueId});
    }
  };
};
