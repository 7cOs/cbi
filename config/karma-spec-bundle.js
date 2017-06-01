Error.stackTraceLimit = Infinity;

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
