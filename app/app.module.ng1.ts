import * as angular from 'angular';
import { IDirectiveFactory } from 'angular';
import 'textangular/dist/textAngular-sanitize.min';

import { AppUpgradeAdapter } from './app.module';
import { AppComponent } from './shared/containers/app/app.component';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

(<any>window).CryptoJS = require('crypto-js');

export default angular.module('cf', [
  require('angular-ui-router'),
  require('angular-cookies'),
  require('angular-material'),
  require('angular-animate'),
  require('./lib/v-accordion/index'),
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
  // make ng2 components/services available to ng1 code & templates
  .directive('appRoot', AppUpgradeAdapter.downgradeNg2Component(AppComponent) as IDirectiveFactory)
  .directive('greeting', AppUpgradeAdapter.downgradeNg2Component(GreetingComponent) as IDirectiveFactory)
  .directive('settings', AppUpgradeAdapter.downgradeNg2Component(SettingsComponent) as IDirectiveFactory)

  .config(require('./config'))
  .run(require('./run'));
