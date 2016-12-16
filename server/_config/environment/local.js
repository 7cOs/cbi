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

  // if you change this server, you need to get a different JWT.
  config.api = {
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    // url: 'http://cbi-api-test.herokuapp.com',
    // jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6Ik8nTkVJTCIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwMjQxNyIsImZpcnN0TmFtZSI6IkpBTUVTIiwiZ3JvdXBpbmdDb2RlIjoiMTMzIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBlcnNvbklEIjoxNjAxLCJleHAiOjE0Nzc1MjgzMTQyMDcsImlhdCI6MTQ3MjM0NDMxNDIwNywidXNlckdyb3VwIjpbImNiaS1yb2xlLWlxLWFwcC11c2VycyIsImNiaSBlbXBsb3llZXMiLCJ1Zy1jYmlnZGMtYml6LXJvbGUtYnVzdW5pdHZwIiwiY2JpIHVzZXJzIiwiY2JpLWFkZW5hYmxlZGFjY291bnRzIl0sImVtYWlsIjoiamltLm9uZWlsQGNicmFuZHMuY29tIiwic3JjVHlwZUNkIjpbIk9GRl9ISUVSIiwiU0FMRVNfSElFUiJdfQ.YFHMTCRWTHyaarudBhBhMbRsmSo7Xlla8_m4ioXb66Q'
    // url: 'http://cbrands-deloitte-dev.herokuapp.com',
    // jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6Ik8nTkVJTCIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwMjQxNyIsImZpcnN0TmFtZSI6IkpBTUVTIiwiZ3JvdXBpbmdDb2RlIjoiMTMzIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBlcnNvbklEIjo1NDU5LCJleHAiOjE0ODA3OTE5OTUzMzYsImlhdCI6MTQ3NTYwNzk5NTMzNiwidXNlckdyb3VwIjpbImNiaS1yb2xlLWlxLWFwcC11c2VycyIsImNiaSBlbXBsb3llZXMiLCJ1Zy1jYmlnZGMtYml6LXJvbGUtYnVzdW5pdHZwIiwiY2JpIHVzZXJzIiwiY2JpLWFkZW5hYmxlZGFjY291bnRzIl0sImVtYWlsIjoiSklNLk9ORUlMQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIlNBTEVTX0hJRVIiXX0.PJq-Y5A4OzAKPJV0UF7ns8PKhF3LHwzd6_STHN0mq9g'
    url: 'http://cbi-api-internal-qa.herokuapp.com',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IktFTExFUiIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwNzY2NSIsImZpcnN0TmFtZSI6IlNIQVdOIiwiZ3JvdXBpbmdDb2RlIjoiMjM0IiwiY29ycG9yYXRlVXNlciI6dHJ1ZSwicGVyc29uSUQiOjU3NTIsImV4cCI6MTQ3OTY5Njk1NDc2NywiaWF0IjoxNDc0NTEyOTU0NzY3LCJ1c2VyR3JvdXAiOlsiY2JpIGVtcGxveWVlcyIsImNiaSB1c2VycyIsInVnLWNiaWdkYy1iaXotcm9sZS1ta3RkZXZtZ3IiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJTSEFXTi5LRUxMRVJAQ0JSQU5EUy5DT00iLCJzcmNUeXBlQ2QiOlsiT0ZGX0hJRVIiXX0.9ZbRIQ-CxP2YzFbfQ5u-uQfZcX1BDZ5rAPTJiHATJik'
  };

  config.analytics = {
    id: ''
  };

  config.auth = {
    strategy: 'no-auth',
    user: {
      // 'OFF_HEIR'
      /* 'personId': 5699,
      'employeeID': '1009707',
      'firstName': 'ERIC',
      'lastName': 'RAMEY',
      'email': 'ERIC.RAMEY@CBRANDS.COM',
      'srcTypeCd': [
        'OFF_HIER'
      ],
      'groupingCode': null,
      'corporateUser': true,
      'userGroup': [
        'cbi employees',
        'cbi users',
        'ug-cbigdc-biz-role-mktdevmgr',
        'cbi-adenabledaccounts'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlJBTUVZIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiIxMDA5NzA3IiwiZmlyc3ROYW1lIjoiRVJJQyIsImdyb3VwaW5nQ29kZSI6bnVsbCwiY29ycG9yYXRlVXNlciI6dHJ1ZSwicGVyc29uSUQiOjU2OTksImV4cCI6MTQ4NjE0NzYzMjY5MiwiaWF0IjoxNDgwOTYzNjMyNjkyLCJ1c2VyR3JvdXAiOlsiY2JpIGVtcGxveWVlcyIsImNiaSB1c2VycyIsInVnLWNiaWdkYy1iaXotcm9sZS1ta3RkZXZtZ3IiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJFUklDLlJBTUVZQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIk9GRl9ISUVSIl19.Gy-SZrPgg7oxCgYCc-8YWA2BIwlFO0E3Htu6vzufVh4',
      'jwtmap': {
        'firstName': 'ERIC',
        'lastName': 'RAMEY',
        'groupingCode': null,
        'corporateUser': true,
        'iss': 'https://orion.cbrands.com',
        'personID': 5699,
        'employeeID': '1009707',
        'exp': 1486147632692,
        'iat': 1480963632694,
        'userGroup': [
          'cbi employees',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'email': 'ERIC.RAMEY@CBRANDS.COM',
        'srcTypeCd': [
          'OFF_HIER'
        ]
      },
      'issuedAt': 1480963632694 */
      // 'SALES-HIER'
      'personId': 5649,
      'employeeID': '1009529',
      'firstName': 'CARRIE',
      'lastName': 'REID',
      'email': 'CARRIE.REID@CBRANDS.COM',
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'groupingCode': '132',
      'corporateUser': true,
      'userGroup': [
        'cbi-role-iq-app-users',
        'cbi employees',
        'ug-cbigdc-role-ecrownappusercorporateview',
        'cbi users',
        'cbi-adenabledaccounts'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IlJFSUQiLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwiZW1wbG95ZWVJRCI6IjEwMDk1MjkiLCJmaXJzdE5hbWUiOiJDQVJSSUUiLCJncm91cGluZ0NvZGUiOiIxMzIiLCJjb3Jwb3JhdGVVc2VyIjp0cnVlLCJwZXJzb25JRCI6NTY0OSwiZXhwIjoxNDg3MTEwMDM5OTc1LCJpYXQiOjE0ODE5MjYwMzk5NzUsInVzZXJHcm91cCI6WyJjYmktcm9sZS1pcS1hcHAtdXNlcnMiLCJjYmkgZW1wbG95ZWVzIiwidWctY2JpZ2RjLXJvbGUtZWNyb3duYXBwdXNlcmNvcnBvcmF0ZXZpZXciLCJjYmkgdXNlcnMiLCJjYmktYWRlbmFibGVkYWNjb3VudHMiXSwiZW1haWwiOiJDQVJSSUUuUkVJREBDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl19.PE8LXUhVUadA-jpF2mG8R_DQ28WGvVKr4VhmMplsUb8',
      'jwtmap': {
        'firstName': 'CARRIE',
        'lastName': 'REID',
        'groupingCode': '132',
        'corporateUser': true,
        'iss': 'https://orion.cbrands.com',
        'personID': 5649,
        'employeeID': '1009529',
        'exp': 1487110039975,
        'iat': 1481926039976,
        'userGroup': [
          'cbi-role-iq-app-users',
          'cbi employees',
          'ug-cbigdc-role-ecrownappusercorporateview',
          'cbi users',
          'cbi-adenabledaccounts'
        ],
        'email': 'CARRIE.REID@CBRANDS.COM',
        'srcTypeCd': [
          'SALES_HIER'
        ]
      }
      // 'ON_HEIR'
      /* 'personId': 5527,
      'employeeID': '1010009',
      'firstName': 'ANDREW',
      'lastName': 'KEEFNER',
      'email': 'ANDY.KEEFNER@CBRANDS.COM',
      'srcTypeCd': [
        'ON_HIER'
      ],
      'groupingCode': '176',
      'corporateUser': true,
      'userGroup': [
        'cbi employees',
        'cbi users',
        'ug-cbigdc-biz-role-mktdevmgr',
        'cbi-adenabledaccounts'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IktFRUZORVIiLCJpc3MiOiJodHRwczovL29yaW9uLmNicmFuZHMuY29tIiwiZW1wbG95ZWVJRCI6IjEwMTAwMDkiLCJmaXJzdE5hbWUiOiJBTkRSRVciLCJncm91cGluZ0NvZGUiOiIxNzYiLCJjb3Jwb3JhdGVVc2VyIjp0cnVlLCJwZXJzb25JRCI6NTUyNywiZXhwIjoxNDg2MTUzMjc1NzQwLCJpYXQiOjE0ODA5NjkyNzU3NDAsInVzZXJHcm91cCI6WyJjYmkgZW1wbG95ZWVzIiwiY2JpIHVzZXJzIiwidWctY2JpZ2RjLWJpei1yb2xlLW1rdGRldm1nciIsImNiaS1hZGVuYWJsZWRhY2NvdW50cyJdLCJlbWFpbCI6IkFORFkuS0VFRk5FUkBDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJPTl9ISUVSIl19.5X1lLcNYunxZde9HcS8Buf4tiCpHs23yyjfdgKJXYSQ',
      'jwtmap': {
        'firstName': 'ANDREW',
        'lastName': 'KEEFNER',
        'groupingCode': '176',
        'corporateUser': true,
        'iss': 'https://orion.cbrands.com',
        'personID': 5527,
        'employeeID': '1010009',
        'exp': 1486153275740,
        'iat': 1480969275741,
        'userGroup': [
          'cbi employees',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'email': 'ANDY.KEEFNER@CBRANDS.COM',
        'srcTypeCd': [
          'ON_HIER'
        ]
      } */
      // 'Corporate user'
      /* 'personId': -1,
      'employeeID': '7002806',
      'firstName': null,
      'lastName': null,
      'email': null,
      'srcTypeCd': [],
      'groupingCode': null,
      'corporateUser': true,
      'userGroup': [
        'cbi employees',
        'cbi users',
        'ug-cbigdc-biz-role-mktdevmgr',
        'cbi-adenabledaccounts'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6bnVsbCwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbSIsImVtcGxveWVlSUQiOiI3MDAyODA2IiwiZmlyc3ROYW1lIjpudWxsLCJncm91cGluZ0NvZGUiOm51bGwsImNvcnBvcmF0ZVVzZXIiOnRydWUsInBlcnNvbklEIjotMSwiZXhwIjoxNDg2MTUzNTIyOTg4LCJpYXQiOjE0ODA5Njk1MjI5ODgsInVzZXJHcm91cCI6WyJjYmkgZW1wbG95ZWVzIiwiY2JpIHVzZXJzIiwidWctY2JpZ2RjLWJpei1yb2xlLW1rdGRldm1nciIsImNiaS1hZGVuYWJsZWRhY2NvdW50cyJdLCJlbWFpbCI6bnVsbCwic3JjVHlwZUNkIjpbXX0.9P5Exp4yRSy_rRm9C6MHlqqvbX41w8jgQSBmuE9NnO8',
      'jwtmap': {
        'firstName': null,
        'lastName': null,
        'groupingCode': null,
        'corporateUser': true,
        'iss': 'https://orion.cbrands.com',
        'personID': -1,
        'employeeID': '7002806',
        'exp': 1486153522988,
        'iat': 1480969522989,
        'userGroup': [
          'cbi employees',
          'cbi users',
          'ug-cbigdc-biz-role-mktdevmgr',
          'cbi-adenabledaccounts'
        ],
        'email': null,
        'srcTypeCd': []
      } */
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
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/signingKey.pem').toString(),
    certfile: fs.readFileSync('./server/_config/environment/sfdcsecurity/' + config.env + '/certificate.crt').toString(),
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

  return config;

};
