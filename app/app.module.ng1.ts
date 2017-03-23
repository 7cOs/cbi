import * as angular from 'angular';
import 'textangular/dist/textAngular-sanitize.min';

(<any>window).CryptoJS = require('crypto-js');

export default angular.module('cf', [
  require('angular-ui-router'),
  require('angular-cookies'),
  require('angular-material'),
  require('angular-animate'),
  require('v-accordion'),
  require('angular-nvd3'),
  require('ng-file-upload'),
  require('textangular'),
  require('ng-csv'),
  require('angular-moment'),
  require('angulartics'),
  require('angulartics-google-analytics'),
  require('./shared').name,
  require('./modules').name,
])
  .config(require('./config'))
  .run(require('./run'));
