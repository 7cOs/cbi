'use strict';

const os = require('os');

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
  config.session.cookie.secure = false;

  // if you change this server, you need to get a different JWT.
  config.api = {
    url: 'http://cbi-api-internal-qa.herokuapp.com',
    key: process.env.API_SECRET,
    apiKey: 'compass-beer-portal',

    // TODO: remove when api gateway is in place
    v3BaseUrls: {
      dateRangeCodes: 'https://cbi-product-metrics-api-qa.herokuapp.com',
      performanceTotal: 'https://api-person-resp-internal-test.herokuapp.com',
      responsibilities: 'https://api-person-resp-internal-test.herokuapp.com'
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
      'personId': 5648,
      'employeeID': '1012132',
      'firstName': 'FRED',
      'lastName': 'BERRIOS',
      'email': 'FRED.BERRIOS@CBRANDS.COM',
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'groupingCode': '133',
      'corporateUser': false,
      'userGroup': [
        'cbi-role-iq-app-users',
        'cbi employees',
        'cbi users',
        'cbi-adenabledaccounts',
        'ug-cbigdc-biz-role-genmgr'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IkJFUlJJT1MiLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwiZW1wbG95ZWVJRCI6IjEwMTIxMzIiLCJmaXJzdE5hbWUiOiJGUkVEIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBvc2l0aW9uSWQiOiI0OTA3IiwicGVyc29uSUQiOjU2NDgsImV4cCI6MTUwMjQ2MDgyNzAwMywiaWF0IjoxNDk3Mjc2ODI3MDAzLCJ1c2VyR3JvdXAiOltdLCJlbWFpbCI6IkZSRUQuQkVSUklPU0BDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl0sImJ1UG9zaXRpb25JZCI6IjQwOTMifQ.abN-YMIB_M114fbVVu6N240QWIhppWnGqfsKCIa4Yb0',
      'jwtmap': {
        'firstName': 'FRED',
        'lastName': 'BERRIOS',
        'groupingCode': '133',
        'corporateUser': false,
        'iss': 'https://orion.cbrands.com',
        'personId': 5648,
        'employeeID': '1012132',
        'exp': 1497130738897,
        'iat': 1491946738898,
        'userGroup': [
          'cbi-role-iq-app-users',
          'cbi employees',
          'cbi users',
          'cbi-adenabledaccounts',
          'ug-cbigdc-biz-role-genmgr'
        ],
        'email': 'FRED.BERRIOS@CBRANDS.COM',
        'srcTypeCd': [
          'SALES_HIER'
        ]
      }
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
    issuer: 'compass-portal',
    recipient: 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: 'compass-portal'
  };

  config.sfdcSettings = {
    noteRecordTypeId: '012m00000004plsAAA'
  };

  return config;

};
