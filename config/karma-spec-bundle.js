Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('reflect-metadata');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// include ng1 sources (through JS as workaround for remap-coverage)
require('../app/app.module.ng1');

// angular 1 mocks
require('../node_modules/angular-mocks/angular-mocks.js');
require('../node_modules/angular-material/angular-material-mocks.js');

const appContext = require.context('../app', true, /\.spec\.(ts|js)/);
appContext.keys().forEach(appContext);

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');

testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);
