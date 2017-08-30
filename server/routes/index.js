'use strict';

module.exports = function(app) {
  const git = require('git-rev-sync'),
        pjson = require('../../package');

  app.get('/version', function (req, res) {
    if (req.isAuthenticated()) {
      var hash = process.env.HEROKU_SLUG_DESCRIPTION || git.short();
      var data = {
        hash: hash,
        version: pjson.version
      };
      res.send(JSON.stringify(data));
    } else {
      res.status(403).end();
    }
  });

  //  Angular routes
  app.get('*', function (req, res) {
    if (req.isAuthenticated()) {
      res.sendFile(app.get('index'));
    } else {
      res.redirect('/auth/login');
    }
  });
};
