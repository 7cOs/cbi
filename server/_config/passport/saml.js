'use strict';

module.exports = function(app) {

  const passport      = require('passport'),
        SamlStrategy = require('passport-saml').Strategy,
        fs = require('fs'),
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
    req.session.assertion = req.body.SAMLResponse;

    var signed = util.sign('/api/auth');
    console.log(req.body.SAMLResponse);
    request.post(signed, {body: req.body.SAMLResponse, json: true}, function(err, httpResponse, body) {
      if (err) {
        console.log(httpResponse);
        console.log(err);
        return done(err);
      } else {
        console.log(body);
        req.session.authKey = body;
        return done(null, body);
      }
    });

    /* app.set('config').saml.assertion = req.body.SAMLResponse;
    console.log(app.get('config').saml.assertion);
    */
  });

};
