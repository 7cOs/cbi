'use strict';

module.exports = function(app) {

  const passport      = require('passport'),
        SamlStrategy = require('passport-saml').Strategy,
        fs = require('fs');

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return new SamlStrategy({
    path: '/auth/callback',
    logoutUrl: '/auth/logout',
    issuer: 'passport-saml',
    passReqToCallback: true,
    entryPoint: app.get('config').saml.entryPoint,
    cert: fs.readFileSync('./server/_config/passport/certs/development.crt', 'utf-8'),
    signatureAlgorithm: app.get('config').saml.signatureAlgorithm
  }, function(req, profile, done) {
    req.session.assertion = req.body.SAMLResponse;
    /* app.set('config').saml.assertion = req.body.SAMLResponse;
    console.log(app.get('config').saml.assertion);
    */
    return done(null, profile);
  });

};
