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
    url: 'http://cbi-api-test.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJST0JFUlQiLCJsYXN0TmFtZSI6IlNIQU5OT04iLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwicGVyc29uSUQiOjE4NzUsImVtcGxveWVlSUQiOiIxMDA5MjkzIiwiZXhwIjoxNDc2OTkwNjQzNzAwLCJpYXQiOjE0NzE4MDY2NDM3MDAsImVtYWlsIjoiYm9iLnNoYW5ub25AY2JyYW5kcy5jb20ifQ.8fOc38TRqIk7Yv7s5KH2-fdGLQBRDjFkqoC_AUlj6qU'
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
        personID: 1601,
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
// sfdc parameters
    sfUserName: 'scromie@deloitte.com.cbeerdev',
    sfPassword: 'P455w0rd',
    sfSecToken: 'bWwvZxEPdoCzd14l7YJC82bOZ',
    sfLoginEndpoint: 'test.salesforce.com',

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
