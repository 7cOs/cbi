'use strict';

module.exports = function (config) {
  const fs = require('fs');

  // global settings
  config.domain = 'compass-loadtest.cbrands.com';
  config.env = 'test';
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
    url: 'http://cbi-api-internal-loadtest.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IldJTExJQU1TIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDEyMTM1IiwiZmlyc3ROYW1lIjoiQ0hSSVNUT1BIRVIiLCJncm91cGluZ0NvZGUiOiIyMzQiLCJjb3Jwb3JhdGVVc2VyIjp0cnVlLCJwZXJzb25JRCI6NTU0NSwiZXhwIjoxNDc5MDc5MDA2NDc5LCJpYXQiOjE0NzM4OTUwMDY0NzksInVzZXJHcm91cCI6WyJjYmktcm9sZS1pcS1hcHAtdXNlcnMiLCJjYmkgZW1wbG95ZWVzIiwidWctY2JpZ2RjLWJpei1yb2xlLWJ1c3VuaXR2cCIsImNiaSB1c2VycyIsImNiaS1hZGVuYWJsZWRhY2NvdW50cyJdLCJlbWFpbCI6IkNIUklTLldJTExJQU1TQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIlNBTEVTX0hJRVIiXX0.qVSQ-dRcq0cMf7AuO8e9_Sjp_hseij5Z6pPinRSt4T8'
  };

  config.auth = {
    strategy: 'saml',
    user: {
      jwt: config.api.jwt,
      jwtmap: {
        firstName: 'CHRISTOPHER',
        lastName: 'WILLIAMS',
        groupingCode: '133',
        iss: 'https://orion.cbrands.com',
        personID: 5545,
        employeeID: '1012135',
        exp: 1477332952290,
        iat: 1472148952296,
        email: 'CHRIS.WILLIAMS@CBRANDS.COM',
        srcTypeCd: [
          'ON_HIER',
          'OFF_HIER',
          'SALES_HIER'
        ]
      }
    }
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    issuer: 'https://compass-loadtest.cbrands.com',
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
