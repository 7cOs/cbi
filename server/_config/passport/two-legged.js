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
    tokenURL: app.get('config').oauth.tokenURL,
    clientID: app.get('config').oauth.clientID,
    clientSecret: app.get('config').oauth.clientSecret,
    scope: app.get('config').oauth.scope
  }, function(token, done) {
    return done(null, token);
  });

};
