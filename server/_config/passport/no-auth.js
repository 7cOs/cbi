'use strict';

module.exports = function(app) {
  const NoAuthStrategy = require('./strategies/no-auth');

  return new NoAuthStrategy({
    user: app.get('config').auth.user
  });
};
