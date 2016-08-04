'use strict';
var angular = require('angular');
window.nv = require('nvd3');

angular.module('andromeda', [
  require('angular-ui-router'),
  require('angular-material'),
  require('angular-animate'),
  require('v-accordion'),
  require('angular-nvd3'),
  require('./shared').name,
  require('./modules').name,
  require('angular-mocks/ngMock')
])
.config(require('./config'));
