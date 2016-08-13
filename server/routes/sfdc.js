'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');

  app.post('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.get('/sfdc/deleteNote', function (req, res) {
    sfdc['promiseDeleteNote'](app, req, res);
  });

  app.get('/sfdc/undeleteNote', function (req, res) {
    sfdc['promiseUnDeleteNote'](app, req, res);
  });

  app.get('/sfdc/deleteAttach', function (req, res) {
    sfdc['promiseDeleteAttach'](app, req, res);
  });

  app.get('/sfdc/searchAccounts', function (req, res) {
    sfdc['promiseSearchAccounts'](app, req, res);
  });

  app.get('/sfdc/accountNotes', function (req, res) {
    sfdc['promiseAccountNotes'](app, req, res);
  });

  app.get('/sfdc/getAttachments', function(req, res) {
    sfdc['promiseAttachmentData'](app, req, res);
  });

};
