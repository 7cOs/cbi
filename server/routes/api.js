'use strict';

module.exports = function(app) {
  const util = require('../_lib/util')(app);
  const request = require('request');

  app.route('/api/*')
    .get(function(req, res) {
      console.log(req.url);
      var signed = util.sign(req.url);
      var jwtToken = req.user.jwt ? req.user.jwt : app.get('config').api;
      req.pipe(request(signed), {headers: {'Authorization': 'Bearer ' + jwtToken}}, function(err) {
        console.log(err);
      }).pipe(res);
    })
    .delete(function(req, res) {
      var signed = util.sign(req.url);
      request.del(signed, {body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })
    .post(function(req, res) {
      var signed = util.sign(req.url);
      request.post(signed, {body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })
    .put(function(req, res) {
      var signed = util.sign(req.url);
      request.put(signed, {body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    })
    .patch(function(req, res) {
      var signed = util.sign(req.url);
      request.patch(signed, {body: req.body, json: true}, function(err) {
        console.log(err);
      }).pipe(res);
    });
};
