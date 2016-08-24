'use strict';

module.exports = function(app) {
  const util = require('../_lib/util')(app);

  app.get('/ext/iq', function (req, res) {
    res.redirect(app.get('config').iq);
  });

  //  Angular routes
  app.get('*', function (req, res) {
    // silly kevin, reqs are needed for isAuthenticated for kids
    if (util.isAuthenticated(req)) {
      res.render('main', {
        config: app.get('config')
      });
    } else {
      res.redirect('/auth/login');
    }
  });
};
