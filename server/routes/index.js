'use strict';

module.exports = function(app) {

  const request = require('request');
  const util = require('../_lib/util');
  const passport = require('passport');

  // API catchall
  app.get('/api/*', function(req, res) {
    console.log(req.url);
    var signed = util.sign(req.url);
    req.pipe(request(signed)).pipe(res);
  });

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate('saml'),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/opportunities');
    });
  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  app.post('/auth/callback',
    passport.authenticate('saml', {failureRedirect: 'http://deloitte.com'}),
    function(req, res) {
      res.redirect('/opportunities');
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
