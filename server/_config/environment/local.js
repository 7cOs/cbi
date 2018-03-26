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
      "personId": 5545,
      "employeeID": "1012135",
      "firstName": "CHRIS",
      "lastName": "WILLIAMS",
      "email": "CHRIS.WILLIAMS@CBRANDS.COM",
      "expiresAt": {
          "era": 1,
          "dayOfYear": 142,
          "dayOfWeek": 2,
          "dayOfMonth": 22,
          "year": 2018,
          "millisOfSecond": 882,
          "centuryOfEra": 20,
          "yearOfEra": 2018,
          "yearOfCentury": 18,
          "weekyear": 2018,
          "monthOfYear": 5,
          "weekOfWeekyear": 21,
          "millisOfDay": 62045882,
          "secondOfMinute": 5,
          "secondOfDay": 62045,
          "minuteOfHour": 14,
          "minuteOfDay": 1034,
          "hourOfDay": 17,
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
          "millis": 1527009245882,
          "beforeNow": false,
          "equalNow": false,
          "afterNow": true
      },
      "srcTypeCd": [
          "SALES_HIER"
      ],
      "positionId": "3898",
      "buPositionId": "4275",
      "corporateUser": false,
      "userGroup": [],
      "issuer": "https://orion.cbrands.com",
      "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IldJTExJQU1TIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDEyMTM1IiwiZmlyc3ROYW1lIjoiQ0hSSVMiLCJjb3Jwb3JhdGVVc2VyIjpmYWxzZSwicG9zaXRpb25JZCI6IjM4OTgiLCJwZXJzb25JRCI6NTU0NSwiZXhwIjoxNTI3MDA5MjQ1ODgyLCJpYXQiOjE1MjE4MjUyNDU4ODIsInVzZXJHcm91cCI6W10sImVtYWlsIjoiQ0hSSVMuV0lMTElBTVNAQ0JSQU5EUy5DT00iLCJzcmNUeXBlQ2QiOlsiU0FMRVNfSElFUiJdLCJidVBvc2l0aW9uSWQiOiI0Mjc1In0.8vl9oOqiR0tfQT10x3cgCq03l0_ycon1eUs1UoO32Sc",
      "jwtmap": {
          "lastName": "WILLIAMS",
          "iss": "https://orion.cbrands.com",
          "employeeID": "1012135",
          "firstName": "CHRIS",
          "corporateUser": false,
          "positionId": "3898",
          "personID": 5545,
          "exp": 1527009245882,
          "iat": 1521825245883,
          "userGroup": [],
          "email": "CHRIS.WILLIAMS@CBRANDS.COM",
          "srcTypeCd": [
              "SALES_HIER"
          ],
          "buPositionId": "4275"
      },
      "issuedAt": 1521825245883
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
