'use strict';

module.exports = function(app) {

  var sfdc = require('../controllers/sfdc');

  app.get('/sfdc/accountNotes', function (req, res) {
    sfdc['accountNotes'](app, req, res);
  });

  app.post('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.delete('/sfdc/deleteNote', function (req, res) {
    sfdc['deleteNote'](app, req, res);
  });

  app.delete('/sfdc/deleteAttach', function (req, res) {
    sfdc['deleteAttach'](app, req, res);
  });

  app.get('/sfdc/searchAccounts', function (req, res) {
    sfdc['searchAccounts'](app, req, res);
  });

  app.get('/sfdc/getAttachments', function(req, res) {
    res.send('<h1>undeleteNote is not functional yet</h1>');
//  sfdc['getAttachmentData'](app, req, res);
  });
  app.get('/sfdc/undeleteNote', function (req, res) {
    res.send('<h1>undeleteNote is not functional yet</h1>');
    //     sfdc['unDeleteNote'](app, req, res);
  });
};
