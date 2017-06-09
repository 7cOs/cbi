import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { IDirectiveFactory } from 'angular';
import 'textangular/dist/textAngular-sanitize.min';

import { AppComponent } from './shared/containers/app/app.component';
import { AppUpgradeAdapter } from './app.module';
import { DateRangeService } from './services/date-range.service';
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
  require('./modules').name
])
  // make ng2 components/services available to ng1 code & templates
  .directive('settings', AppUpgradeAdapter.downgradeNg2Component(SettingsComponent) as IDirectiveFactory)
  .directive('appRoot', AppUpgradeAdapter.downgradeNg2Component(AppComponent) as IDirectiveFactory)
  .factory('dateRangeService', downgradeInjectable(DateRangeService))

  .config(require('./config'))
  .run(require('./run'));
