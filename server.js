'use strict';

var throng = require('throng');
var WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start: start
});

function start() {
  process.env.NODE_ENV = process.env.NODE_ENV || 'local'; // SET DEFAULT ENVIRONMENT

  // Define our constants
  const express  = require('express'),
        app      = express();

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
};
