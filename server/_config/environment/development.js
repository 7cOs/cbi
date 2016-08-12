'use strict';

module.exports = function (config) {

  // global settings
  config.domain = 'orion-dev.cbrands.com';
  config.env = 'development';
  config.address = 'https://' + config.domain + '/'; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    io: config.address + 'socket.io/socket.io.js',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.saml = {
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/initiatesso?providerid=SP-Orion',
    issuer: 'https://orion-dev.cbrands.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  return config;

};
