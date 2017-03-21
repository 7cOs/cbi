import './polyfills';
// import { IDirectiveFactory } from 'angular';

// import cfModule from './app.module.ng1';
import './app.module.ng1';
import { AppUpgradeAdapter } from './app.module';
// import { AngularTwoDemoComponent } from './shared/components-ng2/angular-two-demo/angular-two-demo.component';
// import { AngularTwoDemoService } from './shared/services/angular-two-demo.service';

// include global+ng1 styles
import './main.scss';

// make ng2 components/services available to ng1 code
// cfModule
//   .directive('ng2Demo', AppUpgradeAdapter.downgradeNg2Component(AngularTwoDemoComponent) as IDirectiveFactory)
//   .factory('angularTwoService', AppUpgradeAdapter.downgradeNg2Provider(AngularTwoDemoService));

AppUpgradeAdapter.bootstrap(document.documentElement, ['cf']);
