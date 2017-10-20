const webpackConfig = require('./webpack.test');

module.exports = function (config) {
  const _config = {
    basePath: '',

    frameworks: [ 'jasmine' ],

    files: [
      './config/karma-spec-bundle.js',
      './node_modules/@angular/material/prebuilt-themes/indigo-pink.css' // Include a Material theme in the test suite
    ],

    preprocessors: {
      './config/karma-spec-bundle.js': [ 'coverage', 'webpack', 'sourcemap' ]
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: false,
      stats: {
        assets: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: false
      }
    },

    webpackServer: {
      noInfo: true
    },

    reporters: [ 'jasmine-diff', 'mocha', 'super-dots', 'coverage', 'remap-coverage' ],

    jasmineDiffReporter: {
      pretty: false,
      multiline: false,
      verbose: false
    },

    mochaReporter: {
      output: 'minimal'
    },

    coverageReporter: {
      type: 'in-memory'
    },

    remapCoverageReporter: {
      'text-summary': null,
      html: 'coverage/',
      lcovonly: 'coverage/lcov.info'
    },

    // used for CircleCI output only
    junitReporter: {
      outputDir: process.env.CIRCLE_TEST_REPORTS + '/junit'
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: [ 'PhantomJS' ],

    autoWatch: false,
    singleRun: true
  };

  // check for CircleCI environment
  if (process.env.CIRCLE_TEST_REPORTS) {
    _config.reporters.unshift('junit');
  }

  config.set(_config);
};
