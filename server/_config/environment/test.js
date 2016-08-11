'use strict';

module.exports = function (config) {

  // global settings
  config.domain = 'app-orion-qa.herokuapp.com';
  config.env = 'test';
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
    entryPoint: 'https://ssodev.cbrands.com/oamfed/idp/initiatesso?providerid=SP-Orion-QA',
    issuer: 'https://app-orion-qa.herokuapp.com',
    cert: '',
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  return config;

};
