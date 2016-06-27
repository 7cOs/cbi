'use strict';
const angular = require('angular');
require('angular-ui-router');
require('angular-material');

angular.module('andromeda', [
  'ui-router',
  'angular-material',
  require('./modules').name
  // require('./common').name,
]);

angular
  .module('andromeda', [require('angular-material')])
  .controller('WelcomeController', require('./components/welcome/welcome.controller.js'))
  .controller('GridDemoController', require('./components/grid-demo/grid-demo.controller.js'))
  .controller('DatepickerController', require('./components/datepicker/datepicker.controller.js'));
