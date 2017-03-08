'use strict';

module.exports =  function(app) {

  const bodyParser    = require('body-parser'), // ENABLE FORM DATA
        config        = require('../../server/_config/app.js'), // GLOBAL APP CONFIG
        express       = require('express'), // INCLUDE EXPRESS
        multer        = require('multer'), // ENABLE MULTI-PART FORM UPLOADS
        session       = require('express-session'), // ENABLE SESSIONS
        uuid          = require('uuid'), // CONTENFUL API CONFIG
        compression   = require('compression'),
        enforce = require('express-sslify');

  // SAVE CONFIG AS GLOBAL APP VARIABLE
  app.set('config', config);

  // MIDDLEWARE
  app.use(compression());

  // SET PUBLIC DIR (STATIC CONTENT)
  app.use('/', express.static(config.dir.public));

  // SAVE SOME SETTING TO APP CONFIG FOR EASY ACCESS LATER
  app.set('controllers', config.dir.server.controllers);
  app.set('routes', config.dir.server.routes);
  app.set('views', config.dir.server.views.dir);
  app.set('view engine', config.dir.server.views.engine);
  app.set('case sensitive routing', false);
  app.set('security', config.security);
  app.set('index', config.dir.server.index);
  app.set('upload', multer()); // ENABLE MULTI-PART FORMS
  app.use(bodyParser.json()); // ENABLE application/json
  app.use(bodyParser.urlencoded({ extended: false })); // ENABLE application/x-www-form-urlencoded
  app.locals.pretty = config.prettify;

  //  Forces SSL for production
  if (config.session.cookie.secure) {
    app.set('trust proxy', 1);  // trust "first" proxy
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  // ENABLE REDIS
  let sessionStore = null;
  if (process.env.REDIS_URL) {
    const redis         = require('redis'),
          redisClient   = redis.createClient(process.env.REDIS_URL),
          RedisStore    = require('connect-redis')(session);

    sessionStore = new RedisStore({
      client: redisClient,
      ttl: 7200000
    });
  }

  // SESSION
  app.use(session({
    genid: function(req) {
      return uuid.v4(); // use UUIDs for session IDs
    },
    name: 'cf.sid',
    resave: config.session.resave,
    rolling: config.session.rolling,
    maxAge: config.session.maxAge,
    httpOnly: config.session.httpOnly,
    cookie: config.session.cookie,
    saveUninitialized: config.session.saveUninitialized,
    secret: config.session.secret,
    store: sessionStore
  }));

  // PASSPORT
  const passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  app.set('passport', passport);

  passport.use(require('../../server/_config/passport/' + config.auth.strategy)(app));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

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
