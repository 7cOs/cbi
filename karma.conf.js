// Karma configuration

module.exports = function(config) {
  var testReporters = ['mocha', 'nyan', 'coverage'],
    coverageReporters = [
      {type: 'html', dir: 'coverage/'}
    ];

  // check for CircleCI environment
  if (process.env.CIRCLE_TEST_REPORTS) {
    testReporters.push('junit');
    coverageReporters.push({type: 'html', dir: process.env.CIRCLE_ARTIFACTS});
  }

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/main.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/angular-material/angular-material-mocks.js',
      'app/**/*.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/main.js': ['browserify']
    },

    browserify: {
      debug: true,
      transform: ['browserify-istanbul']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: testReporters,

    // used for CircleCI output only
    junitReporter: {
      outputDir: process.env.CIRCLE_TEST_REPORTS + '/junit'
    },

    nyanReporter: {
      numberOfRainbowLines: 4,
      renderOnRunCompleteOnly: true
    },

    mochaReporter: {
      output: 'minimal'
    },

    coverageReporter: {
      reporters: coverageReporters
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],

    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
