'use strict';

module.exports = function(app) {
  const util = require('../_lib/util')(app);
  const request = require('request');

  app.route('/api/*')
    .all(function apiAuth(req, res, next) {
      if (util.isAuthenticated(req)) {
        app.locals.apiAuth = {
          signed: util.sign(req.url),
          jwtToken: req.user ? req.user.jwt : app.get('config').api.jwt
        };
        next();
      } else {
        res.sendStatus(403);
      }
    })
    .get(function(req, res) {
      const auth = app.locals.apiAuth;

      req.pipe(request(auth.signed).auth(null, null, true, auth.jwtToken))
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .delete(function(req, res) {
      const auth = app.locals.apiAuth;

      request.del(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .post(function(req, res) {
      const auth = app.locals.apiAuth;

      request.post(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .put(function(req, res) {
      const auth = app.locals.apiAuth;

      request.put(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    })

    .patch(function(req, res) {
      const auth = app.locals.apiAuth;

      request.patch(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken)
      .on('err', function(err) {
        console.log(err);
      })
      .pipe(res);
    });
};
