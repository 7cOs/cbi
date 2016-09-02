'use strict';

module.exports = function(app) {
  const git = require('git-rev-sync'),
        pjson = require('../../package');

  app.get('/ext/iq', function (req, res) {
    res.redirect(app.get('config').iq);
  });

  app.get('/version', function (req, res) {
    var data = {
      hash: git.short(),
      version: pjson.version,
      branch: git.branch()
    };
    res.send(JSON.stringify(data));

  });

  //  Angular routes
  app.get('*', function (req, res) {
    if (req.isAuthenticated()) {
      res.render('main', {
        config: app.get('config')
      });
    } else {
      res.redirect('/auth/login');
    }
  });
};
