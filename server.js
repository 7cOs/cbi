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

  // pull in environment variables from .env file when running locally
  if (process.env.NODE_ENV === 'local') {
    const dotenv = require('dotenv');
    dotenv.config();
    console.log('Loaded local .env file for configuration variables.');
  } else {
    console.log('Expecting configuration to be set via environment variables.');
  }

  // Define our constants
  const express  = require('express'),
        app      = express();

  // EXPRESS SETTINGS
  require(__dirname + '/server/_config/express')(app);

  // START THE APP BY LISTENING ON <PORT>
  app.server = app.listen(process.env.PORT || 1980, function(err) {
    if (err) {
      console.error('error', err);
    }

    process.on('uncaughtException', function (er) {
      console.error(er.stack);
      process.exit(1);
    });
  });
};
