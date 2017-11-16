'use strict';

module.exports = function(app) {
  const git   = require('git-rev-sync'),
        pjson = require('../../package'),
        xmlParser = require('xml2json'),
        logutil = require('./logutil'),
        crypto = require('crypto-js'),
        apiBase = app.get('config').api.url,
        apiKey = encodeURIComponent(app.get('config').api.apiKey),
        v3BaseUrls = app.get('config').api.v3BaseUrls,
        apiSecret = app.get('config').api.key;

  return {
    // Compass Beers API URL Signing:
    //  - Add 'apiKey' query param
    //  - Add 'signature' query param based on path, apiKey, and secret key
    signApiUrl: function(uri, v3URLKey) {
      const uriSplit = uri.split('?');
      const urlPath = uriSplit[0];
      const decodedUrlPath = decodeURIComponent(urlPath);
      const params = uriSplit[1];
      const signature = encodeURIComponent(crypto.enc.Base64.stringify(crypto.HmacSHA256(decodedUrlPath + apiKey, apiSecret)));

      // TODO: remove ternary expression & update base url when api gateway is in place
      const signedUrl = `${v3URLKey ? v3BaseUrls[v3URLKey] : apiBase}${urlPath}?signature=${signature}&apiKey=${apiKey}`;
      return params ? `${signedUrl}&${params}` : signedUrl;
    },

    // API Analytics headers
    agentHeader: function() {
      let version = pjson.version;
      let hash    = process.env.HEROKU_SLUG_DESCRIPTION || git.short();
      return JSON.stringify({app: {version: version, build: hash, platform: 'web'}});
    },

    userHeader: function(employeeID) {
      return JSON.stringify({loggedInEmployeeId: employeeID});
    },

    userHeaderFromSaml: function(samlResponse) {
      let samlJson;
      let uniqueId;
      try {
        // convert base64 into JSON
        samlJson = xmlParser.toJson(Buffer.from(samlResponse, 'base64').toString('utf-8'), {object: true});
        uniqueId = samlJson['samlp:Response']['saml:Assertion']['saml:Subject']['saml:NameID']['$t'];
      } catch (e) {
        logutil.logError(e);
        uniqueId = '';
      }
      return JSON.stringify({loggedInEmployeeId: uniqueId});
    }
  };
};
