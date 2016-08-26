'use strict';

module.exports = function(app) {
  app.get('/ext/iq', function (req, res) {
    res.redirect(app.get('config').iq);
  });

  //  Angular routes
  app.get('*', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('main', {
        config: app.get('config')
      });
    } else {
      res.redirect('/auth/login');
    }
  });
};
