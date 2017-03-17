'use strict';

module.exports = function(app) {
  const git   = require('git-rev-sync'),
        pjson = require('../../package'),
        xmlParser = require('xml2json'),
        logutil = require('./logutil'),
        crypto = require('crypto-js'),

        apiBase = app.get('config').api.url,
        apiVersion = app.get('config').api.version,
        apiKey = encodeURIComponent(app.get('config').api.apiKey),
        apiSecret = app.get('config').api.key;

  return {
    // Compass Beers API URL Signing:
    //  - Replace /api/ in path with /<version>/
    //  - Add 'apiKey' query param
    //  - Add 'signature' query param based on path, apiKey, and secret key
    signApiUrl: function(uri) {
      let uriSplit =  uri.split('?'),
          path = uriSplit[0],
          params = uriSplit[1],
          nonVersionedPath = path.split('api/')[1],
          versionedPath = `/${apiVersion}/${nonVersionedPath}`,
          signature = encodeURIComponent(crypto.enc.Base64.stringify(crypto.HmacSHA256(versionedPath + apiKey, apiSecret))),
          signedUrl = `${apiBase}${versionedPath}?signature=${signature}&apiKey=${apiKey}`;

      if (params) {
        signedUrl = `${signedUrl}&${params}`;
      }

      return signedUrl;
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
