'use strict';

module.exports = function (config) {

  // global settings
  config.domain = 'compass-loadtest.cbrands.com';
  config.env = 'test';
  config.address = 'https://' + config.domain + ''; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.analytics = {
    id: ''
  };

  config.iq = 'http://test-iqweb.cbrands.com/MicroStrategy/servlet/mstrWeb?server=CBIGDC-IMSTK801&project=Beer+Analytics&evt=2001&folderID=DC6B34544F13E47DFEA3AEB328B149A3';

  config.api = {
    url: 'http://cbi-api-internal-loadtest.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsYXN0TmFtZSI6Ik8nTkVJTCIsImlzcyI6Imh0dHBzOi8vb3Jpb24uY2JyYW5kcy5jb20iLCJlbXBsb3llZUlEIjoiMTAwMjQxNyIsImZpcnN0TmFtZSI6IkpBTUVTIiwiZ3JvdXBpbmdDb2RlIjoiMTMzIiwiY29ycG9yYXRlVXNlciI6dHJ1ZSwicGVyc29uSUQiOjU0NTksImV4cCI6MTQ3ODkxMzE3NDY2NywiaWF0IjoxNDczNzI5MTc0NjY3LCJ1c2VyR3JvdXAiOlsiY2JpLXJvbGUtaXEtYXBwLXVzZXJzIiwiY2JpIGVtcGxveWVlcyIsInVnLWNiaWdkYy1yb2xlLWVjcm93bmFwcHVzZXJjb3Jwb3JhdGV2aWV3IiwiY2JpIHVzZXJzIiwiY2JpLWFkZW5hYmxlZGFjY291bnRzIl0sImVtYWlsIjoiSklNLk9ORUlMQENCUkFORFMuQ09NIiwic3JjVHlwZUNkIjpbIlNBTEVTX0hJRVIiXX0.TBC1TVC0hG91P5RrEx3lMKoeGaL4oqt9RKNg1LaQ3NY'
  };

  config.auth = {
    strategy: 'basic',
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

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    issuer: 'https://compass-loadtest.cbrands.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  return config;

};
