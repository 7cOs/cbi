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
      dateRangeCodes: 'https://cbi-product-metrics-api-qa.herokuapp.com',
      positions: 'https://api-position-internal-qa.herokuapp.com'
    }
  };

  config.saml = {
    logoutBase: 'https://ssodev.cbrands.com/oam/server/logout'  // used during logout process
  };

  config.analytics = {
    id: 'test'
  };

  config.auth = {
    strategy: 'no-auth',
    user: {
      'personId': 5649,
      'employeeID': '1009529',
      'firstName': 'CARRIE',
      'lastName': 'REID',
      'email': 'CARRIE.REID@CBRANDS.COM',
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'positionId': '4311',
      'buPositionId': '4903',
      'corporateUser': false,
      'userGroup': [
        'ug-cbigdc-biz-role-crownmarketing',
        'cbi employees',
        'ug-cbigdc-triana-role-ecrownappuser',
        'ug-cbigdc-biz-role-keyaccountmanager',
        'cbi users',
        'ug-cbigdc-biz-role-mktdevmgr',
        'cbi-adenabledaccounts'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlJFSUQiLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwiZW1wbG95ZWVJRCI6IjEwMDk1MjkiLCJmaXJzdE5hbWUiOiJDQVJSSUUiLCJjb3Jwb3JhdGVVc2VyIjpmYWxzZSwicG9zaXRpb25JZCI6IjQzMTEiLCJwZXJzb25JRCI6NTY0OSwiZXhwIjoxNTA3NjY1NTA4NTAyLCJpYXQiOjE1MDI0ODE1MDg1MDIsInVzZXJHcm91cCI6W10sImVtYWlsIjoiQ0FSUklFLlJFSURAQ0JSQU5EUy5DT00iLCJzcmNUeXBlQ2QiOlsiU0FMRVNfSElFUiJdLCJidVBvc2l0aW9uSWQiOiI0OTAzIn0.AcfUI2Z1ozdXOEE71fZXhYbLZkjCS9oghK4R3G-W43g',
      'jwtmap': {
        'firstName': 'CARRIE',
        'lastName': 'REID',
        'corporateUser': false,
        'iss': 'https://orion.cbrands.com',
        'personId': 5649,
        'positionId': '4311',
        'buPositionId': '4903',
        'employeeID': '1009529',
        'exp': 1507665508502,
        'iat': 1502481508503,
        'userGroup': [
          'ug-cbigdc-biz-role-crownmarketing',
          'cbi employees',
          'ug-cbigdc-triana-role-ecrownappuser',
          'ug-cbigdc-biz-role-keyaccountmanager',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'email': 'CARRIE.REID@CBRANDS.COM',
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
