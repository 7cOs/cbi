'use strict';

module.exports = function(app) {

  const request = require('request');
  const util = require('../_lib/util');

  app.get('/api/*', function(req, res) {
    console.log(req.url);
    var signed = util.sign(req.url);
    req.pipe(request(signed)).pipe(res);
  });

  app.get('/auth/test', function (req, res) {
    request.post('https://ssodev.cbrands.com/ms_oauth/oauth2/endpoints/oauthservice/tokens', {
      headers: {Authorization: 'Basic UG9ydGFsQ2xpZW50OllOeldhTEtKTkdaNXZ2bGdpWg=='},
      form: {grant_type: 'client_credentials', scope: 'API.All'}
    }).pipe(res);
  });

  app.get('*', function (req, res) {
    res.render('main', {
      config: app.get('config')
    });
  });

};

