'use strict';

module.exports = function (config) {

  const fs = require('fs');

  // global settings
  config.domain = 'app-orion-prod.herokuapp.com';
  config.env = 'app-orion-prod';
  config.address = 'https://' + config.domain + '/'; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.analytics = {
    id: 'UA-77300343-7'
  };

  config.iq = 'http://iqweb.cbrands.com/MicroStrategy/servlet/mstrWeb?server=CBIGDC-PMSTK801&project=Beer+Analytics&evt=2001&folderID=DC6B34544F13E47DFEA3AEB328B149A3';

  // change all of this to env variables for security.
  config.api = {
    url: 'http://cbi-api-test.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2'
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    issuer: 'https://orion-dev.cbrands.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };
  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands.my.salesforce.com/services/oauth2/token?so=00DA0000000Iy9s',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: fs.readFileSync('./server/_config/environment/sfdcsecurity/production/signingKey.pem').toString(),
    certfile: fs.readFileSync('./server/_config/environment/sfdcsecurity/production/certificate.crt').toString(),
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: 'compass-portal',
    recipient: 'https://cbrands.my.salesforce.com?so=00DA0000000Iy9s',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: 'compass-portal'
  };

  return config;

};
