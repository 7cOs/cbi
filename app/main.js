'use strict';
const angular = require('angular');

angular.module('andromeda', [
  require('angular-ui-router'),
  require('angular-material'),
  require('angular-animate'),
  require('v-accordion'),
  require('./shared').name,
  require('./modules').name
])
.config(require('./config'));
