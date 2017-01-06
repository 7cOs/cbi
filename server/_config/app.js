'use strict';

const path = require('path'),
      rootPath = path.normalize(__dirname + '/../..');

process.env.NODE_ENV = process.env.NODE_ENV || 'local'; // SET DEFAULT ENVIRONMENT

let config = {

  // NAME OF APPLICATION
  name: 'cf',

  // CACHE
  cache: false,

  // CORS
  cors: false,

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
    httpOnly: false,
    cookie: {
      maxAge: 5000,
      secure: false
    },
    resave: true,
    rolling: false,
    saveUninitialized: true
  },

  socket: true

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
    socket: rootPath + '/server/socket',
    views: {
      engine: 'pug',
      dir: [rootPath + '/app/', rootPath + '/server/views/']
    }
  },
  root: rootPath
};

// GULP SETTINGS
config.gulp = {
  browserSync: {
    baseDir: 'public',
    files: 'public/*',
    // files: [ 'app/**/*.scss', 'server/**/*.*', 'app/**/*.js', 'app/**/*.pug' ],
    // ignore: [ 'public' ],
    open: false,
    port: 3000,
    reloadDelay: 500
  },
  src: {
    assets: {
      angular: {
        css: ['./app/**/*.scss']
      },
      fonts: ['./app/assets/fonts/**/*.{ttf,woff,woff2,eof,svg}'],
      img: ['./app/assets/img/**/*.jpg', './app/assets/img/**/*.jpg', './app/assets/img/**/*.png', './app/assets/img/**/*.svg'],
      js: ['./app/**/*.js'],
      jsMain: './app/main.js',
      pug: {
        templates: ['./app/**/*.pug', './app/modules/**/*.pug', '!./app/templates']
      },
      sass: ['./app/**/*.scss', '!./app/common/**/*.scss', './app/main.scss'],
      sassLint: ['./app/**/*.scss', '!./app/assets/styles/lib/**/*.scss', './app/main.scss'],
      sassMain: './app/main.scss',
      ts: ['./app/**/*.ts']
    },
    app: rootPath + 'server/**/*',
    lib: rootPath + 'lib/**/*'
  },
  dest: {
    app: './public',
    assets: {
      angular: {
        css: './public/app/'
      },
      css: './public/css/',
      fonts: './public/assets/fonts/',
      img: './public/assets/img/',
      js: './public/app/',
      jsMain: './public/app/main.min.js',
      dir: './public/',
      pug: {
        templates: './public/app'
      },
      sass: './public/app/',
      sassMain: './public/css/main.css',
      ts: ['./public/app/']
    },
    build: './public/app',
    dir: './public/',
    lib: './public/lib/'
  },
  npm: './node_modules/'
};

// PULL IN ENVIRONMENT SETTING & APPEND TO MAIN CONFIG
config = require(rootPath + '/server/_config/environment/' + process.env.NODE_ENV + '.js')(config);

module.exports = config;
