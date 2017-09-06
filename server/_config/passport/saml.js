'use strict';

module.exports = function(app) {
  const SamlStrategy = require('passport-saml').Strategy;
  const request = require('request');

  const appConfig = app.get('config');
  const util = require('../../_lib/util')(app);
  const logutil = require('../../_lib/logutil');
  const apiAuthUrl = util.signApiUrl('/v2/auth');

  return new SamlStrategy({
    protocol: 'https://',
    path: '/auth/callback',
    logoutUrl: '/auth/logout',
    issuer: appConfig.saml.issuer,
    passReqToCallback: true,
    entryPoint: appConfig.saml.entryPoint,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    cert: appConfig.saml.cert,
    signatureAlgorithm: appConfig.saml.signatureAlgorithm
  }, function(req, profile, done) {

    const headers = {
      'X-CBI-API-AGENT': util.agentHeader(),
      'X-CBI-API-USER': util.userHeaderFromSaml(req.body.SAMLResponse)
    };

    request.post(apiAuthUrl, {headers: headers, body: req.body.SAMLResponse}, function(err, httpResponse, body) {
      if (err) {  // error making request (no response)
        const logObj = Object.assign(
          logutil.buildAPIError(req.headers['x-request-id'], httpResponse.req.method, apiAuthUrl, null, 'Error occurred in SAML auth process when making API request.'),
          err);
        logutil.logError(logObj);

        return done(null, false);
      } else if (httpResponse.statusCode >= 400) {  // error in response
        const logObj = logutil.buildAPIError(req.headers['x-request-id'], httpResponse.req.method, apiAuthUrl, httpResponse.statusCode, 'Error occurred in SAML auth process - Error response received when making API request.', body);
        logutil.logError(logObj);

        return done(null, false);
      } else {
        const userProfile = JSON.parse(body);
        return done(null, userProfile);
      }
    });
  });
};

