'use strict';
/* **********************************************
J. Scott Cromie - 8/26/2016

This script will produce a valid SAML assertion.  It
runs under node.js, so that, npm, and the node
modules request, cheerio, he, and urlencode must be
installed for it to work.

Currently it also relies on the webservice from Axiom
to generate the SAML Assertion.  The plan is to port
the generation code over.

************************************************/
module.exports = {
  getSFDCSession: getSFDCSession
};

var u = require('util');

function getSFDCSession (app, req, res) {
  var request = require('request');
  var cheerio = require('cheerio');
  var he = require('he');
  var urlencode = require('urlencode');
  var b64url = require('base64url');
  var b, raw, b64, u64, b64u;
  var sfdcConfig = app.get('config').sfdcSec;
  var empId = req.user.jwtmap.employeeID;
  var encoding = sfdcConfig.baseEncoding;

  var theAssertion;

  var options = { method: 'POST',
    url: 'http://axiomsso.herokuapp.com/GenerateSamlResponse.action',
    qs:
     { 'idpConfig.samlVersion': '_2_0',
       'idpConfig.userId': empId,
       'idpConfig.samlUserIdLocation': 'SUBJECT',
       'idpConfig.issuer': 'https://axiomsso.herokuapp.com',
       'idpConfig.recipient': 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
       'idpConfig.ssoStartPage': 'http://axiomsso.herokuapp.com/RequestSamlResponse.action',
       'idpConfig.startURL': '',
       'idpConfig.logoutURL': '',
       'idpConfig.userType': 'STANDARD',
       'idpConfig.additionalAttributes': ''
     }
  };

  request(options, function (error, response, body) {
    if (error) {
      console.err('Error is: ' + error);
      return {'isSuccess': false,
              'errorMessage': 'request() library error: ' + error};
    } else {
      var $ = cheerio.load(body);

      var s = $('textarea').html();

      b = new Buffer(he.decode(s));

      raw = b;
      b64 = b.toString('base64');
      u64 = urlencode(b64);
      b64u = b64url(raw);

      if (encoding === 'raw') {
        theAssertion = raw;
      } else if (encoding === 'base64') {
        theAssertion = b64;
      } else if (encoding === 'base64+URL') {
        theAssertion = u64;
      } else if (encoding === 'base64Url') {
        theAssertion = b64u;
      } else  {
        console.log('The encoding was invalid: ' + encoding);
        return {
          'isSuccess': false,
          'errorMessage': 'Invalid encoding: ' + encoding};
      }

      var bodyString = 'grant_type=assertion';
      bodyString = bodyString + '&assertion_type=' + urlencode('urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser');
      bodyString = bodyString + '&assertion=' + theAssertion;
      var SessionIDOptions = {method: 'POST',
                              url: sfdcConfig.spAssertEndpoint,
                              headers:
                              {
                                'Content-Type': 'application/x-www-form-urlencoded'
                              },
                              body: bodyString
                             };
      var sfdcPromise = new Promise(function(resolve, reject) {
        request(SessionIDOptions, function (error, response, body) {
          if (error) {
            reject({
              'isSuccess': false,
              'errorMessage': 'SFDC Session error: ' + error
            });
          } else {
            resolve({
              'isSuccess': true,
              'sfdcSession': body
            });
          };
        });
      });

      sfdcPromise.then(function(result) {
        console.log('\n\nOutside Connection scope: \n' + u.inspect(result, null, '\t'));
        req.user.sfdcConn = result;
      }, function(err) {
        console.log('\n\nThere was an error generating the SFDC Connection: \n' + u.inspect(err));
        req.user.sfdcConn = err;
      });
    };
  });
};

