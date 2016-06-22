'use strict';

const angular = require('angular');

angular
  .module('welcome', [require('angular-material')])
  .controller('welcomeController', require('./components/welcome/welcome.controller.js'));
