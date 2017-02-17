'use strict';

const sfdc = require('../controllers/sfdc');

module.exports = function(app) {
  app.route('/sfdc/*')
    .all(function(req, res, next) {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.status(401).end();
      }
    });

  app.get('/sfdc/userInfo', function (req, res) {
    sfdc['userInfo'](app, req, res);
  });

  app.get('/sfdc/accountNotes', function (req, res) {
    sfdc['accountNotes'](app, req, res);
  });

  app.post('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.delete('/sfdc/deleteNote', function (req, res) {
    sfdc['deleteNote'](app, req, res);
  });

  app.delete('/sfdc/deleteAttachment', function (req, res) {
    sfdc['deleteAttachment'](app, req, res);
  });

  app.post('/sfdc/updateNote', function (req, res) {
    sfdc['updateNote'](app, req, res);
  });

  app.get('/sfdc/getAttachment', function(req, res) {
    sfdc['getAttachmentData'](app, req, res);
  });

  app.post('/sfdc/createAttachment', require('connect-multiparty')(), function(req, res) {
    sfdc['createAttachment'](app, req, res);
  });
};
