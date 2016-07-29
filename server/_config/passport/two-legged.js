'use strict';

module.exports = function(app) {

  const passport      = require('passport'),
        TwoLeggedStrategy = require('passport-two-legged').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return new TwoLeggedStrategy({
    tokenURL: 'https://ssodev.cbrands.com/ms_oauth/oauth2/endpoints/oauthservice/tokens',
    clientID: 'PortalClient',
    clientSecret: 'YNzWaLKJNGZ5vvlgiZ',
    scope: 'API.All'
  }, function(err, done) {
    console.log(err);
    console.log(done);
  });

};
