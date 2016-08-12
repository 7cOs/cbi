'use strict';

module.exports = function(app) {
  const util = require('../_lib/util');
  const request = require('request');

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
};
