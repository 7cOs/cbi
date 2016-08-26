'use strict';

module.exports = function(app) {
  const util = require('../_lib/util')(app);
  const request = require('request');

  app.route('/api/*')
    .get(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      req.pipe(request(signed).auth(null, null, true, jwtToken))
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .delete(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.del(signed, {body: req.body, json: true}).auth(null, null, true, jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .post(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.post(signed, {body: req.body, json: true}).auth(null, null, true, jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .put(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.put(signed, {body: req.body, json: true}).auth(null, null, true, jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .patch(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.patch(signed, {body: req.body, json: true}).auth(null, null, true, jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    });
};
