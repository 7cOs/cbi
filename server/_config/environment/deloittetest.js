'use strict';

module.exports = function (config) {
  const fs = require('fs');
  // global settings
  config.domain = 'app-compass-deloitte-qa.herokuapp.com';
  config.env = 'deloittetest';
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
    id: ''
  };

  config.iq = 'http://test-iqweb.cbrands.com/MicroStrategy/servlet/mstrWeb?server=CBIGDC-IMSTK801&project=Beer+Analytics&evt=2001&folderID=DC6B34544F13E47DFEA3AEB328B149A3';

  // change all of this to env variables for security.
  config.api = {
    url: 'https://cbi-api-internal-qa.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2'
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    issuer: 'https://app-compass-deloitte-qa.herokuapp.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--full.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008hN8',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/signingKey.pem').toString(),
    certfile: fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/certificate.crt').toString(),
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: 'compass-portal',
    recipient: 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008hN8',
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
