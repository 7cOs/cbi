'use strict';

module.exports = function(app) {
  app.get('/ext/iq', function (req, res) {
    res.redirect(app.get('config').iq);
  });

  //  Angular routes
  app.get('*', function (req, res) {
    if (req.isAuthenticated() || process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'andromeda-dev') {
      res.render('main', {
        config: app.get('config')
      });
    } else {
      res.redirect('/auth/login');
    }
  });

};
