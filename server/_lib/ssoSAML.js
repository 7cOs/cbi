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
exports.getSAMLAssertion = function(encoding, empId) {

  var request = require('request');
  var cheerio = require('cheerio');
  var he = require('he');
  var urlencode = require('urlencode');
  var b64url = require('base64url');
  var b, raw, b64, u64, b64u;

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
       'idpConfig.additionalAttributes': '' },
    headers:
     { 'postman-token': 'ba6870cc-5a9c-0746-c136-9c028b2ed51c',
       'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var $ = cheerio.load(body);

    var s = $('textarea').html();
    b = new Buffer(he.decode(s));
    raw = b;
    b64 = b.toString('base64');
    u64 = urlencode(b64);
    b64u = b64url(raw);
    var enc = 'u64';

    if (enc === 'raw') {
      return raw;
    } else if (enc === 'base64') {
      return b64;
    } else if (enc === 'base64+URL') {
      return u64;
    } else if (enc === 'base64Url') {
      return b64u;
    } else  {
      return ('Invalid encoding: ' + enc);
    }
  });
};
