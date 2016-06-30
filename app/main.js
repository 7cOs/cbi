'use strict';
const angular = require('angular');

angular.module('andromeda', [
  require('angular-ui-router'),
  require('angular-material'),
  require('./shared').name,
  require('./modules').name
]).config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey')
    .accentPalette('light-blue');
});
