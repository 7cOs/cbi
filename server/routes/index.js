'use strict';

module.exports = function(app) {

  const request = require('request');
  const util = require('../_lib/util');
  const passport = require('passport');

  app.get('/api/*', function(req, res) {
    console.log(req.url);
    var signed = util.sign(req.url);
    req.pipe(request(signed)).pipe(res);
  });

  app.get('/auth/login',
    passport.authenticate('saml'),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/opportunities');
    });
  app.post('/login/callback',
    passport.authenticate('saml', {failureRedirect: 'http://deloitte.com'}),
    function(req, res) {
      res.redirect('/opportunities');
    });
  app.get('*', passport.authenticate('saml'), function (req, res) {
    res.render('main', {
      config: app.get('config')
    });
  });

};
