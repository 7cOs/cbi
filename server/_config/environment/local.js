'use strict';

const os = require('os');

module.exports = function (config) {
  console.log('Using server config for LOCAL environment.');

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
  config.session.cookie.secure = false;

  // if you change this server, you need to get a different JWT.
  config.api = {
    url: 'http://cbi-api-internal-qa.herokuapp.com',
    key: process.env.API_SECRET,
    apiKey: 'compass-beer-portal',

    // TODO: remove when api gateway is in place
    v3BaseUrls: {
      accounts: 'https://api-account-internal-qa.herokuapp.com',
      distributors: 'https://api-distributors-internal-qa.herokuapp.com',
      lists: 'https://api-lists-internal-qa.herokuapp.com',
      opportunities: 'https://api-opportunity-internal-qa.herokuapp.com',
      positions: 'https://api-position-internal-qa.herokuapp.com',
      productMetrics: 'https://cbi-product-metrics-api-qa.herokuapp.com'
    }
  };

  config.saml = {
    logoutBase: 'https://ssodev.cbrands.com/oam/server/logout'  // used during logout process
  };

  config.analytics = {
    id: ''
  };

  config.auth = {
    strategy: 'no-auth',
    user: {
      'personId': 5579,
      'employeeID': '1002705',
      'firstName': 'JOHN',
      'lastName': 'UTTER',
      'email': 'JOHN.UTTER@CBRANDS.COM',
      'expiresAt': {
        'era': 1,
        'dayOfYear': 177,
        'dayOfWeek': 2,
        'dayOfMonth': 26,
        'year': 2018,
        'centuryOfEra': 20,
        'yearOfEra': 2018,
        'yearOfCentury': 18,
        'weekyear': 2018,
        'monthOfYear': 6,
        'weekOfWeekyear': 26,
        'millisOfSecond': 978,
        'millisOfDay': 58253978,
        'secondOfMinute': 53,
        'secondOfDay': 58253,
        'minuteOfHour': 10,
        'minuteOfDay': 970,
        'hourOfDay': 16,
        'chronology': {
          'zone': {
            'fixed': true,
            'id': 'Etc/UTC'
          }
        },
        'zone': {
          'fixed': true,
          'id': 'Etc/UTC'
        },
        'millis': 1530029453978,
        'afterNow': true,
        'beforeNow': false,
        'equalNow': false
      },
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'positionId': '4903',
      'buPositionId': '0',
      'corporateUser': false,
      'userGroup': [],
      'issuer': 'https://orion.cbrands.com',
      'jwtmap': {
        'lastName': 'UTTER',
        'iss': 'https://orion.cbrands.com',
        'employeeID': '1002705',
        'firstName': 'JOHN',
        'corporateUser': false,
        'positionId': '4903',
        'personID': 5579,
        'exp': 1530029453978,
        'iat': 1524845453979,
        'userGroup': [],
        'email': 'JOHN.UTTER@CBRANDS.COM',
        'srcTypeCd': [
          'SALES_HIER'
        ],
        'buPositionId': '0'
      },
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlVUVEVSIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDAyNzA1IiwiZmlyc3ROYW1lIjoiSk9ITiIsImNvcnBvcmF0ZVVzZXIiOmZhbHNlLCJwb3NpdGlvbklkIjoiNDkwMyIsInBlcnNvbklEIjo1NTc5LCJleHAiOjE1MzAwMjk0NTM5NzgsImlhdCI6MTUyNDg0NTQ1Mzk3OCwidXNlckdyb3VwIjpbXSwiZW1haWwiOiJKT0hOLlVUVEVSQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIlNBTEVTX0hJRVIiXSwiYnVQb3NpdGlvbklkIjoiMCJ9.i5YtFwPr1buWfBW7MJp8CbXm9PrsgZkyrz0lXdpxxwA',
      'issuedAt': 1524845453979
    }
  };

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: process.env.SFDC_SIGNING_KEY,
    certfile: process.env.SFDC_CERTIFICATE,
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: process.env.SFDC_ISSUER,
    recipient: 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: process.env.SFDC_ISSUER
  };

  config.sfdcSettings = {
    noteRecordTypeId: '012m00000004plsAAA'
  };

  return config;

};
