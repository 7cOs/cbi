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
var u = require('util');

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
  var theAssertion = '';

  var loadAssertion = function(empId) {
//        console.log('\n\nin loadAssertion\n');
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
        return rp(options);
      },

      loadSession = function(body) {
//        console.log('\n\nin loadSession\n');
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
        return rp(SessionIDOptions)
             .then(function(body) {
               console.log('\n\nsession is: \n' + u.inspect(body, null, '\t'));
               return body;
             });
      };
//  console.log('loading the Assertion now');
  loadAssertion(empId)
    .then(function(body) {
      return loadSession(body);
    });
};
