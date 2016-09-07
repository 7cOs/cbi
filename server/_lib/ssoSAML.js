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
// var u = require('util');
// var $scope;
var rp = require('request-promise');

module.exports = {
  getSFDCSession: getSFDCSession
};

function getSFDCSession(app, req, res) {
//  console.log('\n\n In getSFDCSession \n');
  var cheerio = require('cheerio');
  var he = require('he');
  var urlencode = require('urlencode');
  var b64url = require('base64url');
  var b, raw, b64, u64, b64u;
  var sfdcConfig = app.get('config').sfdcSec;
  var empId = req.user.jwtmap.employeeID;
  var encoding = sfdcConfig.baseEncoding;
  var idpConfig = sfdcConfig.idpConfig;
  var theAssertion = '';

  var loadAssertion = function(empId) {
        var options = { method: 'POST',
    url: idpConfig.url,
    qs:
     { 'idpConfig.samlVersion': idpConfig.samlVersion,
       'idpConfig.userId': empId,
       'idpConfig.samlUserIdLocation': idpConfig.samlUserIdLocation,
       'idpConfig.issuer': idpConfig.issuer,
       'idpConfig.recipient': idpConfig.recipient,
       'idpConfig.ssoStartPage': idpConfig.ssoStartPage,
       'idpConfig.startURL': idpConfig.startURL,
       'idpConfig.logoutURL': idpConfig.logoutURL,
       'idpConfig.userType': idpConfig.userType,
       'idpConfig.additionalAttributes': idpConfig.additionalAttributes
     }
    };
        return rp(options);
      },

      loadSession = function(body) {
//        console.log('\n\nin loadSession\n');
        var $ = cheerio.load(body);

        var s = $('textarea').html();
        console.log('<--------------------------Assertion is------------------------>');
        console.log(s);
        console.log('<-------------------------------------------------------------->');
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
//          console.log('The encoding was invalid: ' + encoding);
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
        var sessionPromise = rp(SessionIDOptions);
        return sessionPromise;
      };
  var returnThisPromise = loadAssertion(empId)
    .then(function(body) {
      return loadSession(body);
    });
  return returnThisPromise;
};
