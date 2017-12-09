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
      'positionId': '4903',
      'buPositionId': '0',
      'employeeID': '1002705',
      'firstName': 'JOHN',
      'lastName': 'UTTER',
      'email': 'JOHN.UTTER@CBRANDS.COM',
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'corporateUser': false,
      'userGroup': [
        'cbi-role-iq-app-users',
        'ug-cbigdc-role-abpanaplancorporateview',
        'cbi employees',
        'ug-cbigdc-biz-role-busunitvp',
        'ug-cbigdc-triana-role-ecrownappuser',
        'cbi users',
        'cbi-adenabledaccounts',
        'ug-cbigdc-role-ecrownappusercimemployeeview'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlVUVEVSIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDAyNzA1IiwiZmlyc3ROYW1lIjoiSk9ITiIsImNvcnBvcmF0ZVVzZXIiOmZhbHNlLCJwb3NpdGlvbklkIjoiNDkwMyIsInBlcnNvbklEIjo1NTc5LCJleHAiOjE1MTQzMjExMTAwMjQsImlhdCI6MTUwOTEzNzExMDAyNCwidXNlckdyb3VwIjpbXSwiZW1haWwiOiJKT0hOLlVUVEVSQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIlNBTEVTX0hJRVIiXSwiYnVQb3NpdGlvbklkIjoiMCJ9.4AnAx0d75cj-B5wqXADOwGOf2DncyeVLnkNCrQ40nTo',
      'jwtmap': {
        'firstName': 'JOHN',
        'lastName': 'UTTER',
        'corporateUser': false,
        'iss': 'https://orion.cbrands.com',
        'personId': 5579,
        'positionId': '4903',
        'buPositionId': '0',
        'employeeID': '1002705',
        'exp': 1509132101428,
        'iat': 1503948101433,
        'userGroup': [
          'cbi-role-iq-app-users',
          'ug-cbigdc-role-abpanaplancorporateview',
          'cbi employees',
          'ug-cbigdc-biz-role-busunitvp',
          'ug-cbigdc-triana-role-ecrownappuser',
          'cbi users',
          'cbi-adenabledaccounts',
          'ug-cbigdc-role-ecrownappusercimemployeeview'
        ],
        'email': 'JOHN.UTTER@CBRANDS.COM',
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
