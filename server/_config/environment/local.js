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
      "personId": 5608,
      "employeeID": "1009609",
      "firstName": "STASH",
      "lastName": "ROWLEY",
      "email": "STASH.ROWLEY@CBRANDS.COM",
      "expiresAt": {
          "era": 1,
          "dayOfYear": 110,
          "dayOfWeek": 5,
          "dayOfMonth": 20,
          "year": 2018,
          "millisOfDay": 56336477,
          "secondOfMinute": 56,
          "secondOfDay": 56336,
          "minuteOfHour": 38,
          "minuteOfDay": 938,
          "hourOfDay": 15,
          "centuryOfEra": 20,
          "yearOfEra": 2018,
          "yearOfCentury": 18,
          "weekyear": 2018,
          "monthOfYear": 4,
          "weekOfWeekyear": 16,
          "millisOfSecond": 477,
          "chronology": {
              "zone": {
                  "fixed": true,
                  "id": "Etc/UTC"
              }
          },
          "zone": {
              "fixed": true,
              "id": "Etc/UTC"
          },
          "millis": 1524238736477,
          "beforeNow": false,
          "equalNow": false,
          "afterNow": true
      },
      "srcTypeCd": [
          "SALES_HIER"
      ],
      "positionId": "4503",
      "buPositionId": "0",
      "corporateUser": false,
      "userGroup": [],
      "issuer": "https://orion.cbrands.com",
      "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlJPV0xFWSIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwOTYwOSIsImZpcnN0TmFtZSI6IlNUQVNIIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBvc2l0aW9uSWQiOiI0NTAzIiwicGVyc29uSUQiOjU2MDgsImV4cCI6MTUyNDIzODczNjQ3NywiaWF0IjoxNTE5MDU0NzM2NDc3LCJ1c2VyR3JvdXAiOltdLCJlbWFpbCI6IlNUQVNILlJPV0xFWUBDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl0sImJ1UG9zaXRpb25JZCI6IjAifQ.vN-dRwM5ikrPeSXEtdQSlOAHUZksBJsmrxWm1dA-TEM",
      "issuedAt": 1519054736479,
      "jwtmap": {
          "lastName": "ROWLEY",
          "iss": "https://orion.cbrands.com",
          "employeeID": "1009609",
          "firstName": "STASH",
          "corporateUser": false,
          "positionId": "4503",
          "personID": 5608,
          "exp": 1524238736477,
          "iat": 1519054736479,
          "userGroup": [],
          "email": "STASH.ROWLEY@CBRANDS.COM",
          "srcTypeCd": [
              "SALES_HIER"
          ],
          "buPositionId": "0"
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
