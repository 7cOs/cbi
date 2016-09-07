'use strict';

const os = require('os'),
      fs = require('fs');

module.exports = function (config) {

  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }

  if (typeof addresses[0] === 'undefined') addresses[0] = 'localhost';

  // global settings
  config.domain = addresses[0];
  config.env = 'development';
  config.address = 'http://' + config.domain + ':'  + config.port + '/'; // base url

  config.iq = 'http://iqweb.cbrands.com';

  // if you change this server, you need to get a different JWT.
  config.api = {
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    // url: 'http://cbi-api-test.herokuapp.com',
    // jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6Ik8nTkVJTCIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwMjQxNyIsImZpcnN0TmFtZSI6IkpBTUVTIiwiZ3JvdXBpbmdDb2RlIjoiMTMzIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBlcnNvbklEIjoxNjAxLCJleHAiOjE0Nzc1MjgzMTQyMDcsImlhdCI6MTQ3MjM0NDMxNDIwNywidXNlckdyb3VwIjpbImNiaS1yb2xlLWlxLWFwcC11c2VycyIsImNiaSBlbXBsb3llZXMiLCJ1Zy1jYmlnZGMtYml6LXJvbGUtYnVzdW5pdHZwIiwiY2JpIHVzZXJzIiwiY2JpLWFkZW5hYmxlZGFjY291bnRzIl0sImVtYWlsIjoiamltLm9uZWlsQGNicmFuZHMuY29tIiwic3JjVHlwZUNkIjpbIk9GRl9ISUVSIiwiU0FMRVNfSElFUiJdfQ.YFHMTCRWTHyaarudBhBhMbRsmSo7Xlla8_m4ioXb66Q'
    url: 'http://cbi-api-internal-qa.herokuapp.com',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IldJTExJQU1TIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDEyMTM1IiwiZmlyc3ROYW1lIjoiQ0hSSVNUT1BIRVIiLCJncm91cGluZ0NvZGUiOiIyMzQiLCJjb3Jwb3JhdGVVc2VyIjp0cnVlLCJwZXJzb25JRCI6NTU0NSwiZXhwIjoxNDc4MTMyMzI1NTg0LCJpYXQiOjE0NzI5NDgzMjU1ODQsInVzZXJHcm91cCI6WyJjYmktcm9sZS1pcS1hcHAtdXNlcnMiLCJjYmkgZW1wbG95ZWVzIiwidWctY2JpZ2RjLXJvbGUtZWNyb3duYXBwdXNlcmNvcnBvcmF0ZXZpZXciLCJjYmkgdXNlcnMiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJDSFJJUy5XSUxMSUFNU0BDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl19.uf7r00Cf55PINR5rFfP4BJY50hRl5HMrd0QGje387X8'
  };

  config.analytics = {
    id: ''
  };

  config.auth = {
    strategy: 'no-auth',
    user: {
      jwt: config.api.jwt,
      jwtmap: {
        firstName: 'JAMES',
        lastName: 'O\'NEIL',
        groupingCode: '133',
        iss: 'https://orion.cbrands.com',
        personID: 5545,
        employeeID: '1002417',
        exp: 1477332952290,
        iat: 1472148952296,
        email: 'JIM.ONEIL@CBRANDS.COM',
        srcTypeCd: [
          'ON_HIER',
          'OFF_HIER',
          'SALES_HIER'
        ]
      }
    }
  };

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.sfdcSec = {
    /**/  baseEncoding: 'base64+URL',
// sfdc parameters
//  SAML Configuration Parameters
    idpConfig: {
      url: 'http://axiomsso.herokuapp.com/GenerateSamlResponse.action',
      samlVersion: '_2_0',
      userId: '',
      samlUserIdLocation: 'SUBJECT',
      issuer: 'compass-portal',
      recipient: 'https://cbrands-CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
      ssoStartPage: 'RequestSamlResponse.action',
      startURL: '',
      logoutURL: '',
      userType: 'STANDARD',
      additionalAttributes: ''
    },

// SP (Service Provider (i.e. Salesforce.com)) details
    spEntityId: 'https://dev-salesforce.cbrands.com',
    spPrivateKey: [fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/key-file.pem').toString()],
    spCertificate: [fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/cert-file.crt').toString()],
    spAssertEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    spSAMLRequestEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
    spSAMLRequestServer: 'cbrands--CBeerDev.cs20.my.salesforce.com',
    spSAMLRequestSO: 'so=00Dm00000008fCJ',
    spMetadataLocation: './server/_config/environment/sfdcsecurity/' + config.env + '/sp.xml',
    idpMetadataLocation: './server/_config/environment/sfdcsecurity/' + config.env + '/idp.xml',

// IDP (Identity Provider (i.e. OAM)) details
    idpSSOLoginURL: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    idpSSOLogoutURL: 'https://ssodev.cbrands.com/oam/server/logout?end_url=http://www.cbrands.com',
    idpCert: [fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/idp-public-cert.pem').toString()],
    idpPrivateKey: [fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/idp-private-key.pem').toString()],
    idpForceAuthn: true,
    idpSignGetRequest: true,
    idpAllowUnencryptedAssertion: true,

// oAuth details
    clientID: '3MVG9RHx1QGZ7OsgFDGg9AANEHmXyFGysbxOwi9Sg4.8o5ocZmlElMbhO36DRBmT8otkqgxiJX7P5PCFoYvUQ',
    clientSecret: '5793586792947030890',
    callbackURL: 'https://orion-dev.cbrands.com/sfdc/token',
    profileURL: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/userinfo'
  };

  return config;

};
