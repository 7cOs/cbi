'use strict';

module.exports = function(app) {
  const util    = require('../_lib/util')(app),
        logutil = require('../_lib/logutil'),
        request = require('request');

  app.route('/api/*')
    .all(function apiAuth(req, res, next) {
      req.headers['X-CBI-API-AGENT'] = util.agentHeader();

      if (req.isAuthenticated()) {
        req.headers['X-CBI-API-USER'] = util.userHeader(req.user.employeeID);
        util.logRequest(req);

        app.locals.apiAuth = {
          signed: util.sign(req.url),
          jwtToken: req.user.jwt
        };
        next();
      } else {
        res.status(401).end();
      }
    })

    .get(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request(auth.signed).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'GET', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .delete(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.del(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'DELETE', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .post(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.post(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'POST', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .put(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.put(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'PUT', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .patch(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.patch(auth.signed, {body: req.body, json: true}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'PATCH', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .head(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.head(auth.signed).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'HEAD', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    });
};
