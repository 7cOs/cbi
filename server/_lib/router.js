'use strict';

module.exports = function(app) {

  const fs = require('graceful-fs'),
        routes = fs.readdirSync('./server/routes/');

  // REQUIRE ALL ROUTES IN /ROUTES DIR
  for (var i = 0; i < routes.length; i++) {
    if (routes[i] !== 'error.js' && routes[i] !== 'index.js' && routes[i] !== '.DS_Store') {
      require(app.get('routes') + routes[i])(app);
    }
  }

  // LOAD INDEX CONTROLLER LAST
  require(app.get('routes') + 'index')(app);
  require(app.get('routes') + 'error')(app);

  // DEFAULT ERROR HANDLER IF NOTHING ELSE INTERCEPTS
  app.use(function(err, req, res, next) {
    console.error('An application error has occurred:', err);
    res.render('errors/500', {
      config: app.get('config'),
      error: {
        code: 500,
        title: 'Server Error!',
        message: err
      }
    });
  });

};
