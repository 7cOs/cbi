'use strict';

const urllib = require('url'),
      concat = require('concat-stream'),
      logfmt = require('logfmt'),
      GENERIC_ERROR_MSG = 'An error has occurred. Check application server log for details.';

module.exports = {
  logError: logError,
  buildError: buildError,
  buildAPIError: buildAPIError,
  handleAPIResponse: handleAPIResponse,
  handleAPIRequestError: handleAPIRequestError
};

function logError(error) {
  logfmt.log(error);
}

// delete signature and apiKey from url (for logging purposes)
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
function buildError(requestId, appServerMessage, errorString) {
  let logMsg = {
    'request_id': requestId,
    'app_server_message': appServerMessage
  };

  if (errorString) {
    logMsg['error'] = errorString;
  }

  return logMsg;
}

// format log messages consistently
function buildAPIError(requestId, apiRequestMethod, apiRequestUrl, statusCode, appServerMessage, responseBody, errorString) {
  let logMsg = {
    'request_id': requestId,
    'api_request_method': apiRequestMethod,
    'api_request_url': apiRequestUrl ? stripSigned(apiRequestUrl) : null,
    'code': statusCode,
    'app_server_message': appServerMessage
  };

  if (responseBody) {
    logMsg['response_body'] = responseBody;
  }

  if (errorString) {
    logMsg['error'] = errorString;
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
        logError(buildAPIError(req.headers['x-request-id'], response.request.method, response.request.href, response.statusCode, serverMessage, body));

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
        buildAPIError(req.headers['x-request-id'], requestMethod, requestUrl, null, 'Error making API request.'),
        err);

    // server log
    logError(logObj);

    // send to client
    res.status(500).send(errorObj);
  };
}
