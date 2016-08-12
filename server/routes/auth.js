'use strict';

module.exports = function(app) {
  const passport = require('passport');

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate('saml'),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('https://ssodev.cbrands.com/oam/server/logout?end_url=' + app.get('config').address);
  });
  app.post('/auth/callback',
    passport.authenticate('saml', {failureRedirect: '/auth/login'}),
    function(req, res) {
      res.redirect('/');
    });
};
