'use strict';

module.exports = function(app) {
  const util = require('../_lib/util')(app);
  const request = require('request');

  app.route('/api/*')
    .get(function(req, res) {
      console.log(req.url);
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      req.pipe(request(signed), {headers: {'Authorization': 'Bearer ' + jwtToken}}, function(err) {
        console.log(err);
      }).pipe(res);
    })

    .delete(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.del(signed, {headers: {'Authorization': 'Bearer ' + jwtToken}, body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })

    .post(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.post(signed, {headers: {'Authorization': 'Bearer ' + jwtToken}, body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })

    .put(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.put(signed, {headers: {'Authorization': 'Bearer ' + jwtToken}, body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })

    .patch(function(req, res) {
      var signed = util.sign(req.url);
      var jwtToken = req.user ? req.user.jwt : app.get('config').api.jwt;
      request.patch(signed, {headers: {'Authorization': 'Bearer ' + jwtToken}, body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    });
};
