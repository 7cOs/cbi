'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');
  var lazyproxy = require('lazy-proxy');
  var port = process.env.PORT || 3000;
  var sfdcPassport = require('passport');
  var ForceDotComStrategy = require('passport-forcedotcom').Strategy;
  var Pptsfdc = require('passport-salesforce').Strategy;
  var jsforce = require('jsforce');

  var config = app.get('config').sfdcSec;
  console.log('config is: ' + config);
  var oauth2  = new jsforce.OAuth2({
    loginUrl: config.authorizationURL,
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    redirectUri: config.callbackURL
  }
  );

// define passport usage
  function checkSession(req) {
    var logins = {
      fdc_user: false,
      fdc_user_id: null,
      fb_user: false,
      fb_user_id: null,
      tw_user: false,
      tw_user_id: null
    };

    if (req.session['forcedotcom']) { logins.fdc_user = true; logins.fdc_user_id = req.session['forcedotcom']['id'].split('/')[5]; }
    return logins;
  }

/*  sfdcPassport.use(new ForceDotComStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: 'https://lvh.me:' + port + '/sfdc/token',
    authorizationURL: config.authorizationURL,
    tokenURL: config.tokenURL
  }, function(token, tokenSecret, profile, done) {
    console.log(profile);
    return done(null, profile);
  }
  ));
*/

  sfdcPassport.serializeUser(function(user, done) {
    done(null, user);
  });

  sfdcPassport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(null); }
    res.redirect('/sfdc/login');
  }

  app.post('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.get('/sfdc/deleteNote', function (req, res) {
    sfdc['deleteNote'](app, req, res);
  });

  app.get('/sfdc/undeleteNote', function (req, res) {
    sfdc['unDeleteNote'](app, req, res);
  });

  app.get('/sfdc/deleteAttach', function (req, res) {
    sfdc['deleteAttach'](app, req, res);
  });

  app.get('/sfdc/searchAccounts', function (req, res) {
    sfdc['searchAccounts'](app, req, res);
  });

  app.get('/sfdc/accountNotes', function (req, res) {
    sfdc['accountNotes'](app, req, res);
  });

  app.get('/sfdc/getAttachments', function(req, res) {
    sfdc['getAttachmentData'](app, req, res);

  });

// example found at https://github.com/joshbirk/passport-forcedotcom
  sfdcPassport.use(new ForceDotComStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    authorizationURL: config.authorizationURL,
    tokenURL: config.tokenURL
  }, function verify(token, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
  }
  ));

  app.get('/sfdc/login', sfdcPassport.authenticate('forcedotcom', { failureRedirect: '/sfdc/error',
                                                                    successRedirect: 'https://www.google.com' }), function (req, res) {});

  app.get('/sfdc/error', function (req, res) {
    res.send('<HTML><HEAD><TITLE>Testing</TITLE></HEAD><BODY><H1>YOU JUST GOT AN ERROR.</H1></BODY></HTML>');
  });

  app.get('/sfdc/token',
    sfdcPassport.authenticate('forcedotcom', { failureRedirect: '/sfdc/error',
                                               successRedirect: 'https://www.google.com' }),
    function(req, res) {
      res.send('<HTML><HEAD></HEAD><BODY>You have connected successfully</BODY></HTML>');
    }
  );

/*
    function(req, res) {

    var conn = new jsforce.Connection({oauth2: oauth2});
    var code = req.param('code');
    conn.authorize(code, function(err, userInfo) {
      if (err) { return console.error(err); }

      console.log(conn.accessToken);
      console.log(conn.refreshToken);
      console.log(conn.instanceUrl);
      console.log('User ID: ' + userInfo.id);
      console.log('Org ID: ' + userInfo.organization);
    });

// example found at https://github.com/joshbirk/passport-forcedotcom
/*
    console.log(req);
    res.send('<HTML><HEAD><TITLE>The End</TITLE></HEAD><BODY><H1>Testing the token endpoint.</H1></BODY></HTML>');
    sfdcPassport.authenticate('salesforce', { failureRedirect: '/error' }),
    function(req, res) {
      req.session['forcedotcom'] = req.session['passport']['user'];
     console.log(req);
   }
  });
*/
  app.all('/:label/yahoo',
    // ensureAuthenticated,
    function(req, res) {
      console.log(req.session);

      // forcedotcom
      if (req.session['salesforce'] && req.params.label === 'sfdc') {
        var restOptions = {
          useHTTPS: true,
          host: req.session['salesforce'].instance_url.replace('https://', ''),
          headers: {
            'Authorization': 'OAuth ' + req.session['forcedotcom'].access_token,
            'Accept': 'application/jsonrequest',
            'Cache-Control': 'no-cache,no-store,must-revalidate'
          }
        };
      }
      lazyproxy.send(restOptions, req, res);
    }
  );
};
