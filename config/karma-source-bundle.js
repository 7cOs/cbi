/* Requiring ng1 TS source through this JS file is a workaround
 * that allows karma-remap-coverage to work properly
 */
require('core-js/es6');
require('reflect-metadata');
require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

require('../app/app.module.ng1');
