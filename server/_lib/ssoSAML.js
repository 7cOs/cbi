'use strict';

module.exports = {
  getSFDCSession: getSFDCSession
};

/**
* getSFDCSession: This will return a promise which will contain a new SFDC session
*                 This module requires an employee to be authenticated against an
*                 identity provider prior to using it.  The employee Id returned
*                 from the authentication step is used to login and access salesforce
*                 in that user's context.
* @author J. Scott Cromie
* @version 1.0
* @since 2016-09-11
*/

function getSFDCSession(app, req, res) {
  var rp = require('request-promise');          // Combines request and promise.  Very useful!
  var samlBuilder = require('./samlBuilder');   // This builds the SAML Assertion
  var cheerio = require('cheerio');             // Very much like jQuery for node.js
  var he = require('he');                       // html encoding helper class
  var urlencode = require('urlencode');         // used for urlencoding the assertion to get the session id
  var b, b64, u64;
  var sfdcConfig = app.get('config').sfdcSec;   // get the environment variables for this server.
  var empId = req.user.jwtmap.employeeID;       // get the employee Id for the currently logged in user.
  var theAssertion = '';                        // initialize theAssertion

  var loadAssertion = function(empId) {
  // In this first section, get the assertion from samlBuilder.
        return new Promise(function(resolve, reject) {
          var theBuiltAssertion = samlBuilder.getSAMLAssertion(app, req, res);
          if (theBuiltAssertion) {
            resolve(theBuiltAssertion);
          } else {
            reject({
              'isSuccess': false,
              'errorMessage': 'The assertion was not able to be constructed'
            });
          }
        });
      },

      loadSession = function(body) {
      // loadSession gets the session from Salesforce.com using the promised assertion from loadAssertion
      // In order to make this work properly I had to "fake it" as an html document.  If I don't do it this
      // way the assertion becomes invalid.
        var htmlLead = '<html><head></head><body><textarea>';
        var htmlEnd = '</textarea></body></html>';
        var assertionDoc = htmlLead + body + htmlEnd;
        var $ = cheerio.load(assertionDoc);

        var s = $('textarea').html();
        b = new Buffer(he.decode(s));
        b64 = b.toString('base64');
        u64 = urlencode(b64);

    /* //  Use this piece to debug an assertion at http://test.salesforce.com/setup/secur/SAMLValidationPage.apexp

        console.log('<----------------------------------base64url encoded assertion--------------------------------->');
        console.log(b64);
        console.log('<---------------------------------------------------------------------------------------------->');
    */
        theAssertion = u64;

        // Build the options for request-promise.
        var bodyString = 'grant_type=assertion';
        bodyString = bodyString + '&assertion_type=' + urlencode('urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser');
        bodyString = bodyString + '&assertion=' + theAssertion;
        var SessionIDOptions = {method: 'POST',
                              url: sfdcConfig.assertionEndpoint,
                              headers:
                              {
                                'Content-Type': 'application/x-www-form-urlencoded'
                              },
                              body: bodyString
                             };
        var sessionPromise = rp(SessionIDOptions);
        return sessionPromise;
      };
  // Returns the promise to the calling function.
  var returnThisPromise = loadAssertion(empId)
    .then(function(body) {
      return loadSession(body);
    });
  return returnThisPromise;
};
