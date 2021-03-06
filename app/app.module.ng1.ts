import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { IDirectiveFactory } from 'angular';
import { Title } from '@angular/platform-browser';
import 'textangular/dist/textAngular-sanitize.min';
import '@uirouter/angularjs';

import { AnalyticsService } from './services/analytics.service';
import { AppComponent } from './shared/containers/app/app.component';
import { AppUpgradeAdapter } from './app.module';
import { CompassCardComponent } from './shared/components/compass-card/compass-card.component';
import { CompassAlertModalComponent } from './shared/components/compass-alert-modal/compass-alert-modal.component';
import { CompassModalService } from './services/compass-modal.service';
import { CompassTooltipComponent } from './shared/components/compass-tooltip/compass-tooltip.component';
import { DateRangeComponent } from './shared/components/date-ranges/date-ranges.component';
import { DateRangeService } from './services/date-range.service';
import { GreetingComponent } from './shared/components/greeting/greeting.component';
import { MyPerformanceComponent } from './containers/my-performance/my-performance.component';
import { ListDetailComponent } from './containers/lists/list-detail.component';
import { ListsApiService } from './services/api/v3/lists-api.service';
import { ListsTransformerService } from './services/lists-transformer.service';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
import { SettingsComponent } from './shared/components/settings/settings.component';

(<any>window).CryptoJS = require('crypto-js');

export default angular.module('cf', [
  'ui.router',
  require('angular-cookies'),
  require('angular-material'),
  require('angular-animate'),
  require('./lib/v-accordion/index'),
  require('angular-nvd3'),
  require('ng-file-upload'),
  require('textangular'),
  require('ng-csv'),
  require('angular-moment'),
  require('./shared').name,
  require('./modules').name
])
  // make ng2 components/services available to ng1 code & templates
  .directive('appRoot', AppUpgradeAdapter.downgradeNg2Component(AppComponent) as IDirectiveFactory)
  .directive('compassCard', AppUpgradeAdapter.downgradeNg2Component(CompassCardComponent) as IDirectiveFactory)
  .directive('compassTooltip', AppUpgradeAdapter.downgradeNg2Component(CompassTooltipComponent) as IDirectiveFactory)
  .directive('dateRanges', AppUpgradeAdapter.downgradeNg2Component(DateRangeComponent) as IDirectiveFactory)
  .directive('greeting', AppUpgradeAdapter.downgradeNg2Component(GreetingComponent) as IDirectiveFactory)
  .directive('listDetail', AppUpgradeAdapter.downgradeNg2Component(ListDetailComponent) as IDirectiveFactory)
  .directive('myPerformance', AppUpgradeAdapter.downgradeNg2Component(MyPerformanceComponent) as IDirectiveFactory)
  .directive('settings', AppUpgradeAdapter.downgradeNg2Component(SettingsComponent) as IDirectiveFactory)
  .directive('notifications', AppUpgradeAdapter.downgradeNg2Component(NotificationsComponent) as IDirectiveFactory)
  .directive('compassAlertModal', AppUpgradeAdapter.downgradeNg2Component(CompassAlertModalComponent) as IDirectiveFactory)
  .factory('analyticsService', downgradeInjectable(AnalyticsService))
  .factory('compassModalService', downgradeInjectable(CompassModalService))
  .factory('dateRangeService', downgradeInjectable(DateRangeService))
  .factory('listsApiService', downgradeInjectable(ListsApiService))
  .factory('listsTransformerService', downgradeInjectable(ListsTransformerService))
  .factory('title', downgradeInjectable(Title))
  .config(require('./config'))
  .run(require('./run'));
