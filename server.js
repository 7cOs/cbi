'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // SET DEFAULT ENVIRONMENT

// Define our constants
const express  = require('express'),
      app      = express();

// Authentication module.
var auth = require('http-auth');
var basic = auth.basic({
  file: __dirname + '/server/_config/users.htpasswd'
});

if (process.env.NODE_ENV === 'heroku-dev') {
  app.use(auth.connect(basic));
};

// EXPRESS SETTINGS
require(__dirname + '/server/_config/express')(app);

// START THE APP BY LISTENING ON <PORT>
app.server = app.listen(process.env.PORT || 1980, function(err) {
  if (err) { // IF THERE'S AN ERROR
    console.error('error', err);
  } else {
    let config = app.get('config');
    if (config.socket) {
      require(config.dir.server.socket)(app);
    }
  }

  process.on('uncaughtException', function (er) {
    console.error(er.stack);
    process.exit(1);
  });

});
