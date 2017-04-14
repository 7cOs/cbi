'use strict';

const path = require('path'),
      rootPath = path.normalize(__dirname + '/../..');

process.env.NODE_ENV = process.env.NODE_ENV || 'local'; // SET DEFAULT ENVIRONMENT

let config = {

  // NAME OF APPLICATION
  name: 'cf',

  // CACHE
  cache: false,

  namespace: 'cf',

  // PORT TO RUN ON
  port: 1980,

  // PRETTIFY OUTPUT
  prettify: true,

  // REDIS
  redis: {
    use: true,
    url: 'redis://127.0.0.1:6379'
  },

  // SECURITY
  security: {
    digest: 'sha512',
    length: 512,
    iterations: 10000,
    secret: 'weac8hixtrno2ch378rt2no3r78x354tro237r5hox37r3to27'
  },

  session: {
    name: 'cf.sid',
    secret: '2l3kj4l2hcic991101CaTfAnCY2mfkj#L#JFeAsT$J4lk3rAtuLplSj2lk21j1jj',
    httpOnly: true,
    cookie: {
      maxAge: 7200000,
      secure: true
    },
    resave: true,
    rolling: true,
    saveUninitialized: true
  }

};

config.auth = {
  strategy: 'saml'
};

// DIRECTORY MAP
config.dir = {
  public: rootPath + '/public/',
  server: {
    controllers: rootPath + '/server/controllers/',
    models: rootPath + '/server/models/',
    router: rootPath + '/server/_lib/router.js',
    routes: rootPath + '/server/routes/',
    script: 'server.js',
    index: rootPath + '/public/app/index.html',
    views: {
      engine: 'pug',
      dir: [rootPath + '/server/views/']
    }
  },
  root: rootPath
};

// PULL IN ENVIRONMENT SETTING & APPEND TO MAIN CONFIG
config = require(rootPath + '/server/_config/environment/' + process.env.NODE_ENV + '.js')(config);

module.exports = config;
