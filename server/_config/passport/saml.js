'use strict';

module.exports = function(app) {

  const passport      = require('passport'),
        SamlStrategy = require('passport-saml').Strategy,
        fs = require('graceful-fs'),
        util = require('../../_lib/util')(app),
        request = require('request');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return new SamlStrategy({
    protocol: 'https://',
    path: '/auth/callback',
    logoutUrl: '/auth/logout',
    issuer: app.get('config').saml.issuer,
    passReqToCallback: true,
    entryPoint: app.get('config').saml.entryPoint,
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    cert: fs.readFileSync('./server/_config/passport/certs/development.crt', 'utf-8'),
    signatureAlgorithm: app.get('config').saml.signatureAlgorithm
  }, function(req, profile, done) {

    var signed = util.sign('/api/auth');
    request.post(signed, {body: req.body.SAMLResponse}, function(err, httpResponse, body) {
      if (err) {
        console.log('error ' + err);
        return done(null, false);
      } else {
        var user = JSON.parse(body);
        console.log(user);
        return done(null, user);
      }
    });
  });
};

