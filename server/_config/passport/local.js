'use strict';

module.exports = function(app) {

  const passport      = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  return new LocalStrategy(
    function(username, password, done) {

      if (username === 'user' && password === 'password') {
        return done(null, {
          name: 'Jane Doe'
        });
      } else {
        return done(null, false, { message: 'Incorrect login.' });
      }
    }
  );
};
