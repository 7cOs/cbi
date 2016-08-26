'use strict';

module.exports = function(app) {
  const passport = require('passport');
  const logoutUrl = 'https://ssodev.cbrands.com/oam/server/logout?end_url=' + app.get('config').address;

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate('saml', {session: true}), function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });

  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect(logoutUrl);
  });

  app.post('/auth/callback',
    passport.authenticate('saml', {failureRedirect: logoutUrl}),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/auth/user', function (req, res) {
    res.send(req.user.jwtmap);
  });
};
