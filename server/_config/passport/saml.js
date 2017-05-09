'use strict';

module.exports = function(app) {
  const SamlStrategy = require('passport-saml').Strategy,
        util = require('../../_lib/util')(app),
        logutil = require('../../_lib/logutil'),
        request = require('request');

  return new SamlStrategy({
    protocol: 'https://',
    path: '/auth/callback',
    logoutUrl: '/auth/logout',
    issuer: app.get('config').saml.issuer,
    passReqToCallback: true,
    entryPoint: app.get('config').saml.entryPoint,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    cert: app.get('config').saml.cert,
    signatureAlgorithm: app.get('config').saml.signatureAlgorithm
  }, function(req, profile, done) {

    const headers = {
      'X-CBI-API-AGENT': util.agentHeader(),
      'X-CBI-API-USER': util.userHeaderFromSaml(req.body.SAMLResponse)
    };
    const signed = util.signApiUrl('/v2/auth');

    request.post(signed, {headers: headers, body: req.body.SAMLResponse}, function(err, httpResponse, body) {
      if (err) {  // request error
        const logObj = Object.assign(
          logutil.buildAPIError(req.headers['x-request-id'], httpResponse.req.method, signed, null, 'Error occurred in SAML auth process when making API request.'),
          err);
        logutil.logError(logObj);

        return done(null, false);
      } else if (httpResponse.statusCode >= 400) {  // error response
        const logObj = logutil.buildAPIError(req.headers['x-request-id'], httpResponse.req.method, signed, httpResponse.statusCode, 'Error occurred in SAML auth process - Error response received when making API request.', body);
        logutil.logError(logObj);

        return done(null, false);
      } else {
        const user = JSON.parse(body);
        return done(null, user);
      }
    });
  });
};

