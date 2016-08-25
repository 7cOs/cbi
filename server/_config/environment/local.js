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

  return config;

};
