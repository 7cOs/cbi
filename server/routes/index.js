'use strict';

module.exports = function(app) {

  const request = require('request');
  const util = require('../_lib/util');

  app.get('/api/*', function(req, res) {
    console.log(req.url);
    var signed = util.sign(req.url);
    req.pipe(request(signed)).pipe(res);
  });

  app.get('*', function (req, res) {
    res.render('main', {
      config: app.get('config')
    });
  });
};
