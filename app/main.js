'use strict';

const angular = require('angular');

angular
  .module('andromeda', [require('angular-material')])
  .controller('WelcomeController', require('./components/welcome/welcome.controller.js'))
  .controller('GridDemoController', require('./components/grid-demo/grid-demo.controller.js'))
  .controller('DatepickerController', require('./components/datepicker/datepicker.controller.js'));
