'use strict';

module.exports = function (config) {
  var fs = require('fs');

  // global settings
  config.domain = 'orion-dev.cbrands.com';
  config.env = 'development';
  config.address = 'https://' + config.domain + ''; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.analytics = {
    id: 'UA-77300343-6'
  };

  config.api = {
    url: 'https://cbi-api-internal-dd-qa.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2'
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    logoutBase: 'https://ssodev.cbrands.com/oam/server/logout',
    issuer: 'https://orion-dev.cbrands.com',
    cert: fs.readFileSync('./server/_config/passport/certs/development.crt', 'utf-8'),
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--Full.cs17.my.salesforce.com/services/oauth2/token?so=00Dg0000006Hhfi',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: fs.readFileSync('./server/_config/environment/sfdcsecurity/test/signingKey.pem').toString(),
    certfile: fs.readFileSync('./server/_config/environment/sfdcsecurity/test/certificate.crt').toString(),
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: 'compass-portal',
    recipient: 'https://cbrands--Full.cs17.my.salesforce.com?so=00Dg0000006Hhfi',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: 'compass-portal'
  };

  config.sfdcSettings = {
    noteRecordTypeId: '012G0000001BSRRIA4'
  };

  return config;

};
