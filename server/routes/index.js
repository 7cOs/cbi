'use strict';

module.exports = function(app) {

  const request = require('request');
  const util = require('../_lib/util');
  const passport = require('passport');

  // API catchall
  app.route('/api/*')
    .get(function(req, res) {
      // console.log(req.url);
      var signed = util.sign(req.url);
      req.pipe(request(signed)).pipe(res);
    })
    .post(function(req, res) {
      var signed = util.sign(req.url);
      request.post(signed, {body: req.body, json: true}).pipe(res);
    })
    .put(function(req, res) {
      var signed = util.sign(req.url);
      request.put(signed, {body: req.body, json: true}).pipe(res);
    })
    .patch(function(req, res) {
      var signed = util.sign(req.url);
      request.patch(signed, {body: req.body, json: true}).pipe(res);
    });

  // Auth stuff
  app.get('/auth/login',
    passport.authenticate('saml'),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    });
  app.get('/auth/logout', function (req, res) {
    req.logout();
    res.redirect('https://ssodev.cbrands.com/oam/server/logout?end_url=http://orion-dev.cbrands.com');
  });
  app.post('/auth/callback',
    passport.authenticate('saml', {failureRedirect: '/auth/login'}),
    function(req, res) {
      res.redirect('/');
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
