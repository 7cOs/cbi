'use strict';

module.exports = function(app) {
  const passport = require('passport');
  const authType = app.get('config').auth.strategy;
  const crypto = require('crypto-js');
  const logoutUrl = app.get('config').saml.logoutBase + '?end_url=' + app.get('config').address;
  const secure = app.get('config').session.cookie.secure;

  // for analytics
  const git   = require('git-rev-sync'),
        pjson = require('../../package');

  function objectToBase64(obj) {
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(JSON.stringify(obj)));
  }

  function setCookies (req, res) {
    res.cookie('user', objectToBase64(req.user.jwtmap), { path: '/', maxAge: 720000000, secure: secure });
    res.cookie('ga', objectToBase64(app.get('config').analytics), { path: '/', maxAge: 720000000, secure: secure });
  }

  app.route('/auth/*')
    .all(function (req, res, next) {
      let version = pjson.version;
      let hash    = process.env.HEROKU_SLUG_DESCRIPTION || git.short();
      let agentObject = {app: {version: version, build: hash}};

      req.headers['X-CBI-API-AGENT'] = agentObject;
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      console.log('route : url, headers');
      console.log('AUTH/* : ', req.url, req.headers);

      next();
    });

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate(authType, {session: true}), function(req, res) {
      let employeeId = req.user.employeeID;
      let userObject = {loggedInEmployeeId: employeeId};

      req.headers['X-CBI-API-USER'] = userObject;
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      console.log('route : url, headers');
      console.log('AUTH/LOGIN SUCCESS: ', req.url, req.headers);

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
