'use strict';

module.exports = function(app) {
  const urllib = require('url'),
        concat = require('concat-stream'),
        logfmt = require('logfmt'),

        GENERIC_ERROR_MSG = 'An error has occurred. Check application server log for details.';

  // delete signature and apiKey from url prior to logging
  function stripSigned(uri) {
    let urlObj = urllib.parse(uri, true);

    // delete parts of the object that conflict when we modify the query
    delete urlObj.search;
    delete urlObj.path;
    delete urlObj.href;

    // delete the query params we want to strip
    delete urlObj.query.signature;
    delete urlObj.query.apiKey;

    return urllib.format(urlObj);
  }

  // format log messages consistently
  function formatAPILogMessage(requestId, apiRequestMethod, apiRequestUrl, statusCode, appServerMessage, responseBody) {
    let logMsg = {
      'request_id': requestId,
      'api_request_method': apiRequestMethod,
      'api_request_url': stripSigned(apiRequestUrl),
      'code': statusCode,
      'app_server_message': appServerMessage
    };

    if (responseBody) {
      logMsg['response_body'] = responseBody;
    }

    return logMsg;
  }

  function scrubErrorObject(errorObj) {
    if (errorObj) {
      if (errorObj.description) {
        errorObj.description = null;
      }

      if (errorObj.objectIdentifier) {
        errorObj.objectIdentifier = null;
      }

      if (errorObj.stackTrace) {
        errorObj.stackTrace = null;
      }
    }
  }

  // remove certain details from error object returned to client
  function modifyErrorForClient(errorResponse) {
    // sometimes error is an array
    if (errorResponse.constructor === Array && errorResponse.length) {
      for (let i = 0; i < errorResponse.length; i++) {
        scrubErrorObject(errorResponse[i]);
      }
    } else {
      scrubErrorObject(errorResponse);
    }
  }

  // Handle proxied API response (HTTP response received, but may not include all data yet)
  function handleAPIResponse(req, res, apiRequestStream) {
    // Returning this anonymous callback function with closure-bound req/res/apiRequestStream vars
    // performs better than using handleResponse.bind(this, req, res, apiRequestStream) below (http://stackoverflow.com/a/17638540/4618864)
    return function(response) {
      if (response.statusCode < 400) {
        apiRequestStream.pipe(res);
      } else {
        // concat entire API response entire stream so we can inspect and modify the error it contains
        apiRequestStream.pipe(concat(function (fullResponseBody) {
          let errorObj = {code: response.statusCode, message: GENERIC_ERROR_MSG},
            body,
            serverMessage;

          if (!fullResponseBody) {
            serverMessage = 'Could not decode API response body.';
          } else {
            body = fullResponseBody.toString();

            try {
              errorObj = JSON.parse(body);

              if (errorObj) {
                modifyErrorForClient(errorObj);
                serverMessage = 'Received API response with error status code; modified error for client.';
              } else {
                serverMessage = 'API response body empty or not JSON.';
              }
            } catch (ex) {
              serverMessage = 'API response body empty or not JSON.';
            }
          }

          // server log
          logfmt.log(formatAPILogMessage(req.headers['x-request-id'], response.request.method, response.request.href, response.statusCode, serverMessage, body));

          // send to client
          res.status(response.statusCode).send(errorObj);
        }));
      }
    };
  }

  // Handle proxied API timeout, host not found, etc (no HTTP response)
  function handleAPIRequestError(req, res, requestMethod, requestUrl) {
    return function(err) {
      let errorObj = {code: 500, message: GENERIC_ERROR_MSG},
        logObj = Object.assign(
          formatAPILogMessage(req.headers['x-request-id'], requestMethod, requestUrl, null, 'Error making API request.'),
          err);

      // server log
      logfmt.log(logObj);

      // send to client
      res.status(500).send(errorObj);
    };
  }

  return {
    // APPLY TITLE CASING
    titleCase: function(str) {
      var newstr = str.split(' ');
      for (let i = 0; i < newstr.length; i++) {
        let copy = newstr[i].substring(1).toLowerCase();
        newstr[i] = newstr[i][0].toUpperCase() + copy;
      }
      return newstr.join(' ');
    },

    // URL Signing
    sign: function(uri) {
      const crypto = require('crypto-js');
      var params = uri.split('?')[1];
      uri = uri.split('?')[0];
      var en = '/' + app.get('config').api.version + '/' + uri.split('api/')[1];
      var signature = crypto.enc.Base64.stringify(crypto.HmacSHA256(en + app.get('config').api.apiKey, app.get('config').api.key));
      // Adedd encodeURIComponent as signature is supposed to be encoded - WJAY 10/3
      var url = app.get('config').api.url + en + '?signature=' + encodeURIComponent(signature) + '&apiKey=' + app.get('config').api.apiKey;
      if (params) {
        url = url + '&' + params;
      }

      return url;
    },

    formatLogMessage: formatAPILogMessage,

    handleAPIResponse: handleAPIResponse,

    handleAPIRequestError: handleAPIRequestError
  };
};
