import './polyfills';
import './app.module.ng1';  // legacy ng1 code
import './main.scss';       // global+ng1 styles
import { AppUpgradeAdapter } from './app.module';

AppUpgradeAdapter.bootstrap(document.documentElement, ['cf']);
