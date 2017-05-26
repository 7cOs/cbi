import './polyfills';
import { IDirectiveFactory } from 'angular';
import cfModule from './app.module.ng1';
import { AppUpgradeAdapter } from './app.module';

import { SettingsComponent } from './shared/components/settings/settings.component';
import { NotificationsComponent } from './shared/components/Notifications/notifications.component';
// import { AngularTwoDemoService } from './shared/services/angular-two-demo.service';

// include global+ng1 styles
import './main.scss';

// make ng2 components/services available to ng1 code & templates
cfModule
  .directive('settings', AppUpgradeAdapter.downgradeNg2Component(SettingsComponent) as IDirectiveFactory)
  .directive('notifications', AppUpgradeAdapter.downgradeNg2Component(NotificationsComponent) as IDirectiveFactory);
  // .factory('angularTwoService', AppUpgradeAdapter.downgradeNg2Provider(AngularTwoDemoService));

AppUpgradeAdapter.bootstrap(document.documentElement, ['cf']);
