'use strict';

module.exports = function(app) {
  const passport = require('passport');
  const authType = app.get('config').auth.strategy;
  const logoutUrl = 'https://ssodev.cbrands.com/oam/server/logout?end_url=' + app.get('config').address;

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate(authType, {session: true}), function(req, res) {
      // Successful authentication, redirect home.
      res.cookie('user', JSON.stringify(req.user.jwtmap), { path: '/', maxAge: 604800000 }); // 7 days
      res.redirect('/');
    });

  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect(logoutUrl);
  });

  app.post('/auth/callback',
    passport.authenticate(authType, {failureRedirect: logoutUrl}),
    function(req, res) {
      res.cookie('user', JSON.stringify(req.user.jwtmap), { path: '/', maxAge: 604800000 }); // 7 days
      res.redirect('/');
    });

  app.get('/auth/user', function (req, res) {
    if (req.isAuthenticated()) {
      res.send(req.user.jwtmap);
    } else {
      res.redirect('/auth/login');
    }
  });
};
