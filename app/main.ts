import './polyfills';
import { IDirectiveFactory } from 'angular';
import cfModule from './app.module.ng1';
import { AppUpgradeAdapter } from './app.module';

import { SettingsComponent } from './shared/components/settings/settings.component';
import { AppComponent } from './shared/containers/app/app.component';
// import { AngularTwoDemoService } from './shared/services/angular-two-demo.service';

// include global+ng1 styles
import './main.scss';

// make ng2 components/services available to ng1 code & templates
cfModule
  .directive('settings', AppUpgradeAdapter.downgradeNg2Component(SettingsComponent) as IDirectiveFactory)
  .directive('appRoot', AppUpgradeAdapter.downgradeNg2Component(AppComponent) as IDirectiveFactory);
  // .factory('angularTwoService', AppUpgradeAdapter.downgradeNg2Provider(AngularTwoDemoService));

AppUpgradeAdapter.bootstrap(document.documentElement, ['cf']);
