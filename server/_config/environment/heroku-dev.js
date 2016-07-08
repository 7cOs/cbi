'use strict';

module.exports = function (config) {

  // global settings
  config.domain = 'andromeda-dev.herokuapp.com';
  config.env = 'heroku-dev';
  config.address = 'https://' + config.domain + '/'; // base url

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