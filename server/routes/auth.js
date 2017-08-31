'use strict';

module.exports = function(app) {
  const crypto = require('crypto-js');
  const passport = require('passport');
  const uuid = require('uuid');

  const appConfig = app.get('config');
  const sfdc = require('../_lib/sfdc');
  const logutil = require('../_lib/logutil');
  const authType = appConfig.auth.strategy;
  const logoutUrl = appConfig.saml.logoutBase + '?end_url=' + appConfig.address;
  const secure = appConfig.session.cookie.secure;
  const maxAgeMillis = appConfig.session.cookie.maxAge;
  const userCookieName = 'user';

  function objectToBase64(obj) {
    return crypto.enc.Base64.stringify(crypto.enc.Utf8.parse(JSON.stringify(obj)));
  }

  function buildAnalyticsProfile() {
    return {
      trackerId: appConfig.analytics.id,
      sessionId: uuid.v4() // unique analytics session ID for duration of login session
    };
  }

  function getSFDCUserInfo(req) {
    return new Promise((resolve, reject) => {
      sfdc.userInfo(app, req)
        .then((userInfo) => {
          if (userInfo.isSuccess) {
            resolve(userInfo.successReturnValue);
          } else {
            logutil.logError(logutil.buildSFDCError(req.headers['x-request-id'], 'userInfo', 'SFDC error fetching user info during login. Login will continue.', JSON.stringify(userInfo)));
            resolve({});
          }
        }).catch((sfdcErr) => {
          logutil.logError(logutil.buildSFDCError(req.headers['x-request-id'], 'userInfo', 'SFDC error fetching user info during login. Login will continue.', JSON.stringify(sfdcErr)));
          resolve({});
        });
    });
  }

  function buildUserProfile(req) {
    return Object.assign(
      {},
      req.user.jwtmap,
      { sfdcUserInfo: req.session.sfdcUserInfo },
      { analytics: req.session.analytics }
    );
  }

  function setSessionCookies(req, res) {
    res.cookie(userCookieName, objectToBase64(buildUserProfile(req)), { path: '/', maxAge: maxAgeMillis, secure: secure });
  }

  function removeSessionCookies(req, res) {
    res.clearCookie(userCookieName, { path: '/', maxAge: maxAgeMillis, secure: secure });
    res.clearCookie(appConfig.session.name, {
      path: '/',
      maxAge: maxAgeMillis,
      secure: secure,
      httpOnly: appConfig.session.httpOnly
    });
  }

  function login(req, res) {
    getSFDCUserInfo(req).then((sfdcUserInfo) => {
      req.session.sfdcUserInfo = sfdcUserInfo;
      req.session.analytics = buildAnalyticsProfile();

      // manual save is required for non GET reqs
      req.session.save(() => {
        setSessionCookies(req, res);
        res.redirect('/');
      });
    });
  }

  function logout(req, res) {
    req.logout();                // passport auth destroys req.user
    req.session.destroy(() => {  // express-session destroys req.session and cf-sid
      // clear client cookies explicitly to prevent session restoration via
      // long-running API requests: https://stackoverflow.com/a/33786899/4618864
      removeSessionCookies(req, res);
      res.redirect(logoutUrl);
    });
  }

  app.get('/auth/login', passport.authenticate(authType, {session: true}), login);

  app.post('/auth/callback', passport.authenticate(authType, {failureRedirect: logoutUrl}), login);

  app.get('/auth/logout', logout);

  app.get('/auth/expired', logout);

  app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(buildUserProfile(req));
    } else {
      res.redirect('/auth/login');
    }
  });
};
