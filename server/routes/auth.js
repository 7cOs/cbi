'use strict';

module.exports = function(app) {
  const passport = require('passport');
  const authType = app.get('config').auth.strategy;
  const logoutUrl = 'https://ssodev.cbrands.com/oam/server/logout?end_url=' + app.get('config').address;

  function setCookies (req, res) {
    res.cookie('user', JSON.stringify(req.user.jwtmap), { path: '/', maxAge: 5000 }); // 2 hours
    res.cookie('ga', JSON.stringify(app.get('config').analytics), { path: '/', maxAge: 5000 }); // 2 hours
  }

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate(authType, {session: true}), function(req, res) {
      // Successful authentication, redirect home.
      setCookies(req, res);
      res.redirect('/');
    });

  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect(logoutUrl);
  });

  app.get('/auth/expired', function (req, res) {
    console.log(logoutUrl);
    res.redirect(logoutUrl);
  });

  app.post('/auth/callback',
    passport.authenticate(authType, {failureRedirect: logoutUrl}),
    function(req, res) {
      setCookies(req, res);
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
