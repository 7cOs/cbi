'use strict';

module.exports = function(app) {
  const util    = require('../_lib/util')(app),
        logutil = require('../_lib/logutil'),
        request = require('request');

  app.route('/v([2-3])/*')
    .all(function apiAuth(req, res, next) {
      let headers = {};
      let v3BaseURLKey;

      // grabbing hard-coded v3 base url from config
      // TODO: remove once api gateway is in place
      if (req.url.match(/\/v3\/(dateRangeCodes|.+\/productMetrics)/)) {
        v3BaseURLKey = 'productMetrics';
      } else if (req.url.match(/\/v3\/(accounts|subAccounts)/)) {
        v3BaseURLKey = 'accounts';
      } else if (req.url.match(/\/v3\/distributors.+/)) {
        v3BaseURLKey = 'distributors';
      } else if (req.url.match(/\/v3\/positions\/.*\/responsibilities/)) {
        v3BaseURLKey = 'positions';
      } else if (req.url.match(/\/v3\/positions\/.*\/distributors/)) {
        v3BaseURLKey = 'positions';
      } else if (req.url.match(/\/v3\/positions\/.*\/accounts\/.*\/subaccounts/)) {
        v3BaseURLKey = 'positions';
      } else if (req.url.match(/\/v3\/positions\/.*\/accounts/)) {
        v3BaseURLKey = 'positions';
      } else if (req.url.match(/\/v3\/positions\/.*\/alternateHierarchy/)) {
        v3BaseURLKey = 'positions';
      } else if (req.url.match(/\/v3\/positions.+/)) {
        v3BaseURLKey = 'positions';
      }

      headers['X-CBI-API-AGENT'] = util.agentHeader();
      headers['User-Agent'] = req.headers['user-agent'];

      if (req.isAuthenticated()) {
        headers['X-CBI-API-USER'] = util.userHeader(req.user.employeeID);

        app.locals.apiAuth = {
          signed: util.signApiUrl(req.url, v3BaseURLKey),
          jwtToken: req.user.jwt,
          headers: headers
        };
        next();
      } else {
        res.status(401).end();
      }
    })

    .get(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request(auth.signed, {json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'GET', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .delete(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.del(auth.signed, {body: req.body, json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'DELETE', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .post(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.post(auth.signed, {body: req.body, json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'POST', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .put(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.put(auth.signed, {body: req.body, json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'PUT', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .patch(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.patch(auth.signed, {body: req.body, json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'PATCH', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    })

    .head(function(req, res) {
      const auth = app.locals.apiAuth;

      let apiRequestStream = request.head(auth.signed, {json: true, headers: auth.headers}).auth(null, null, true, auth.jwtToken);
      req.pipe(apiRequestStream); // pipe client request to API request so headers are passed through

      apiRequestStream
        .on('error', logutil.handleAPIRequestError(req, res, 'HEAD', auth.signed))
        .on('response', logutil.handleAPIResponse(req, res, apiRequestStream));
    });
};
