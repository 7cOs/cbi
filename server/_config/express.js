'use strict';

module.exports =  function(app) {

  const bodyParser    = require('body-parser'), // ENABLE FORM DATA
        config        = require('../../server/_config/app.js'), // GLOBAL APP CONFIG
        express       = require('express'), // INCLUDE EXPRESS
        flash         = require('connect-flash'),
        multer        = require('multer'), // ENABLE MULTI-PART FORM UPLOADS
        session       = require('express-session'), // ENABLE SESSIONS
        uuid          = require('uuid'); // CONTENFUL API CONFIG

  let sessionStore = '';

  // SAVE CONFIG AS GLOBAL APP VARIABLE
  app.set('config', config);

  // SET PUBLIC DIR
  app.use('/', express.static(config.dir.public));

  // SAVE SOME SETTING TO APP CONFIG FOR EASY ACCESS LATER
  app.set('controllers', config.dir.server.controllers);
  app.set('routes', config.dir.server.routes);
  app.set('views', config.dir.server.views.dir);
  app.set('view engine', config.dir.server.views.engine);
  app.set('case sensitive routing', false);
  app.set('security', config.security);
  app.set('upload', multer()); // ENABLE MULTI-PART FORMS
  app.use(bodyParser.json()); // ENABLE application/json
  app.use(bodyParser.urlencoded({ extended: false })); // ENABLE application/x-www-form-urlencoded
  app.locals.pretty = config.prettify;
  app.use(flash());

  // CONFIG BASED SETTINGS
  if (config.cors) app.use(require('cors')()); // ENABLE CORS
  if (config.gzip) app.use(require('compression')()); // ENABLE GZIP

  // ENABLE HTTPAUTH
  if (config.auth.htpasswd.use) {
    const auth = require('http-auth');
    let basic = auth.basic({
      realm: config.auth.htpasswd.realm,
      file: config.auth.htpasswd.file
    });
    app.use(auth.connect(basic));
  }

  // ENABLE REDIS
  if (config.redis.use) {
    const redis         = require('redis'),
          redisClient   = redis.createClient(process.env.REDIS_URL),
          RedisStore    = require('connect-redis')(session);

    sessionStore = new RedisStore({
      client: redisClient
    });
  }

  if (config.session.use) {
    // SESSION
    app.use(session({
      cookie: {
        httpOnly: config.session.httpOnly,
        secret: config.security.secret,
        secure: config.session.secure
      },
      genid: function(req) {
        return uuid.v4(); // use UUIDs for session IDs
      },
      name: 'my-app.sid',
      resave: config.session.resave,
      rolling: config.session.rolling,
      saveUninitialized: config.session.saveUninitialized,
      secret: config.security.secret,
      store: sessionStore
    }));
  }

  // PASSPORT
  if (config.auth.passport.use) {

    const passport = require('passport');

    passport.use(require('../../server/_config/' + config.auth.passport.strategy)(app));
    app.use(passport.initialize());
    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    }));
    app.use(passport.session());
    app.set('passport', passport);
  }

  // INCLUDE APP LEVEL CONFIG
  require('../../server/_config/_custom.js');

  /*  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! DANGER : DO NOT MODIFY BELOW THIS LINE  !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !

  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !
  ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! ! !  */

  // - - - - - - - - - - - - - - - - - - - - - -
  // CAPTURES REQ & RES FOR CONTROLLER USE LATER
  // - - - - - - - - - - - - - - - - - - - - - -
  app.use('*', function (req, res, next) {
    app.set('req', req);
    app.set('res', res);
    next();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // METHOD TO LOAD A CONTROLLER FROM A ROUTE
  // const controller = app.get('controller')();
  // controller.get('product');
  // - - - - - - - - - - - - - - - - - - - - - - - -
  app.set('controller', function() {
    return {
      get: function(which) {
        require(config.dir.server.controllers + which)(app, {
          get: app.get('req'),
          send: app.get('res')
        });
      }
    };
  });

  // - - - - - - - - - - - - - - - - - - - - - - - -
  // METHOD TO LOAD A MODEL FROM A CONTROLLER
  // const Model = app.get('model')('user');
  // Model.get('entry type', id).then(function(data)
  // - - - - - - - - - - - - - - - - - - - - - - - -
  app.set('model', function(which, id) {
    return require(config.dir.server.models + which)(app, id);
  });

  // LOAD OUR ROUTER
  require(config.dir.server.router)(app, config);

};
