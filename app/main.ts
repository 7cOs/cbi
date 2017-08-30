import { enableProdMode } from '@angular/core';

import './polyfills';
import './app.module.ng1';  // legacy ng1 code
import './main.scss';       // global+ng1 styles
import { Environment } from './environment';
import { AppUpgradeAdapter } from './app.module';

if (!Environment.isLocal()) {
  enableProdMode();
}

AppUpgradeAdapter.bootstrap(document.documentElement, ['cf']);
