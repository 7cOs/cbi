'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');

  app.get('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.get('/sfdc/deleteNote', function (req, res) {
    console.log('calling sfdc.promiseDeleteNote');
    sfdc['promiseDeleteNote'](app, req, res);
  });

  app.get('/sfdc/undeleteNote', function (req, res) {
    console.log('calling.sfdc.promiseUnDeleteNote');
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

};
