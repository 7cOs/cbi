'use strict';
const angular = require('angular');

angular.module('andromeda', [
  require('angular-ui-router'),
  require('angular-material'),
  require('./modules').name
  // require('./shared').name,
]);

