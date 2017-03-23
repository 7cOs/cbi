const webpackConfig = require('./webpack.test');

module.exports = function (config) {
  const _config = {
    basePath: '',

    frameworks: [ 'jasmine' ],

    files: [
      './config/karma-source-bundle.js',  // include ng1 sources (through JS as workaround for remap-coverage)
      './config/karma-spec-bundle.js'
    ],

    preprocessors: {
      './config/karma-source-bundle.js': [ 'coverage', 'webpack', 'sourcemap' ],
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
      html: 'coverage/'
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
