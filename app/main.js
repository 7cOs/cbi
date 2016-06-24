'use strict';

const angular = require('angular');

angular
  .module('andromeda', [require('angular-material')])
  .controller('WelcomeController', require('./components/welcome/welcome.controller.js'));
