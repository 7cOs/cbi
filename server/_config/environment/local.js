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
  config.session.cookie.secure = false;

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
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IldJTFNPTiIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwOTMxMiIsImZpcnN0TmFtZSI6IkJSSVRUQU5ZIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBvc2l0aW9uSWQiOiI0NTAyIiwicGVyc29uSUQiOjU0MDQsImV4cCI6MTQ5MDU3NTA2Nzg1MCwiaWF0IjoxNDg1MzkxMDY3ODUwLCJ1c2VyR3JvdXAiOltdLCJlbWFpbCI6IkJSSVRUQU5ZLldJTFNPTkBDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl0sImJ1UG9zaXRpb25JZCI6IjAifQ.BJ5ffy5rZFmVWSOu1mMY-qHXKmgQfAgWuoVfnozgdJQ'
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
      'personId': 5404,
      'employeeID': '1009312',
      'firstName': 'FRED',
      'lastName': 'BERRIOS',
      'email': 'FRED.BERRIOS@CBRANDS.COM',
      'srcTypeCd': [
        'SALES_HIER'
      ],
      'groupingCode': '133',
      'corporateUser': true,
      'userGroup': [
        'cbi-role-iq-app-users',
        'cbi employees',
        'cbi users',
        'cbi-adenabledaccounts',
        'ug-cbigdc-biz-role-genmgr'
      ],
      'issuer': 'https://orion.cbrands.com',
      'jwt': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6IldJTFNPTiIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwOTMxMiIsImZpcnN0TmFtZSI6IkJSSVRUQU5ZIiwiY29ycG9yYXRlVXNlciI6ZmFsc2UsInBvc2l0aW9uSWQiOiI0NTAyIiwicGVyc29uSUQiOjU0MDQsImV4cCI6MTQ5MDU3NTA2Nzg1MCwiaWF0IjoxNDg1MzkxMDY3ODUwLCJ1c2VyR3JvdXAiOltdLCJlbWFpbCI6IkJSSVRUQU5ZLldJTFNPTkBDQlJBTkRTLkNPTSIsInNyY1R5cGVDZCI6WyJTQUxFU19ISUVSIl0sImJ1UG9zaXRpb25JZCI6IjAifQ.BJ5ffy5rZFmVWSOu1mMY-qHXKmgQfAgWuoVfnozgdJQ',
      'jwtmap': {
        'firstName': 'FRED',
        'lastName': 'BERRIOS',
        'groupingCode': '133',
        'corporateUser': true,
        'iss': 'https://orion.cbrands.com',
        'personId': 5404,
        'employeeID': '1009312',
        'exp': 1480707641150,
        'iat': 1475523641152,
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
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };
  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: fs.readFileSync('./server/_config/environment/sfdcsecurity/dev/signingKey.pem').toString(),
    certfile: fs.readFileSync('./server/_config/environment/sfdcsecurity/dev/certificate.crt').toString(),
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
