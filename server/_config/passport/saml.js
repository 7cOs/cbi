'use strict';

module.exports = function(app) {
  const SamlStrategy = require('passport-saml').Strategy,
        util = require('../../_lib/util')(app),
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

    var signed = util.sign('/api/auth');
    request.post(signed, {body: req.body.SAMLResponse}, function(err, httpResponse, body) {
      if (err) {
        console.log('error ' + err);
        return done(null, false);
      } else {
        var user = JSON.parse(body);
        return done(null, user);
      }
    });
  });
};

