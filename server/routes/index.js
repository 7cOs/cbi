'use strict';

module.exports = function(app) {
  const util = require('../_lib/util');

  app.get('/ext/iq', function (req, res) {
    res.redirect(app.get('config').iq);
  });

  //  Angular routes
  app.get('*', function (req, res) {
    if (util.isAuthenticated()) {
      res.render('main', {
        config: app.get('config')
      });
    } else {
      res.redirect('/auth/login');
    }
  });
};
