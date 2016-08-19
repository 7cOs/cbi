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

  config.api = {
    url: 'https://cbi-api-internal-qa.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2',
    jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJKQU1FUyIsImxhc3ROYW1lIjoiTydORUlMIiwiaXNzIjoiaHR0cHM6Ly9vcmlvbi5jYnJhbmRzLmNvbS8iLCJwZXJzb25JRCI6MTYwMSwiZW1wbG95ZWVJRCI6IjEwMDI0MTciLCJleHAiOjE0NzQyNTk2MTAsImlhdCI6MTQ3MTY2NzYxMCwiZW1haWwiOiJqaW0ub25laWxAY2JyYW5kcy5jb20ifQ.Ka6cbtODyMiaV_PsQeK8cTKIofX3_9rhNm04rXuhwQE'
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/samlv20',
    issuer: 'https://orion-dev.cbrands.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
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
