'use strict';

module.exports = function(app) {
  const passport = require('passport');
  const appConfig = app.get('config');
  const authType = appConfig.auth.strategy;
  const crypto = require('crypto-js');
  const logoutUrl = appConfig.saml.logoutBase + '?end_url=' + appConfig.address;
  const secure = appConfig.session.cookie.secure;
  const maxAgeMillis = appConfig.session.cookie.maxAge;

  function objectToBase64(obj) {
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(JSON.stringify(obj)));
  }

  function setSessionCookies(req, res) {
    res.cookie('user', objectToBase64(req.user.jwtmap), { path: '/', maxAge: maxAgeMillis, secure: secure });
    res.cookie('ga', objectToBase64(appConfig.analytics), { path: '/', maxAge: maxAgeMillis, secure: secure });
  }

  function removeSessionCookies(req, res) {
    res.clearCookie('user', { path: '/', maxAge: maxAgeMillis, secure: secure });
    res.clearCookie('ga', { path: '/', maxAge: maxAgeMillis, secure: secure });
    res.clearCookie(appConfig.session.name, {
      path: '/',
      maxAge: maxAgeMillis,
      secure: secure,
      httpOnly: appConfig.session.httpOnly
    });
  }

  function logout(req, res) {
    req.logout();                     // passport auth destroys req.user
    req.session.destroy(function() {  // express-session destroys req.session and cf-sid
      // clear client cookies explicitly to prevent session restoration via
      // long-running API requests: https://stackoverflow.com/a/33786899/4618864
      removeSessionCookies(req, res);
      res.redirect(logoutUrl);
    });
  }

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate(authType, {session: true}), function(req, res) {
      setSessionCookies(req, res);
      res.redirect('/');
    });

  app.get('/auth/logout', function (req, res) {
    logout(req, res);
  });

  app.get('/auth/expired', function (req, res) {
    logout(req, res);
  });

  app.post('/auth/callback',
    passport.authenticate(authType, {failureRedirect: logoutUrl}),
    function(req, res) {
      setSessionCookies(req, res);
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
