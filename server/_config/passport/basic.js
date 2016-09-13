'use strict';

module.exports = function(app) {
  var Strategy = require('passport-http').BasicStrategy;

  return new Strategy(
    function(username, password, cb) {
      if (username === 'ratul' && password === 'pls') {
        return cb(null, app.get('config').auth.user);
      } else {
        return cb(null, false);
      }
    });
};
