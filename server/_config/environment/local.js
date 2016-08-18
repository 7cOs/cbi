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

  config.api = {
    url: 'http://cbi-api-test.herokuapp.com',
    key: 'U1NCc2FXdGxJSFJ2SUVodlpHOXlMQ0JJYjJSdmNpd2dTRzlrYjNJc0lFaHZaRzl5Y3lCaGJtUWdTRzlrYjNKekxnPT0=',
    apiKey: 'test',
    version: 'v2'

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

  config.sfdcSec = {
// sfdc parameters
    clientID: '3MVG9RHx1QGZ7OsgFDGg9AANEHmXyFGysbxOwi9Sg4.8o5ocZmlElMbhO36DRBmT8otkqgxiJX7P5PCFoYvUQ',
    clientSecret: '5793586792947030890',
    callbackURL: 'https://localhost:3000/sfdc/token',
    authorizationURL: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/authorize',
    tokenURL: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    profileURL: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/userinfo'
  };

  return config;

};
