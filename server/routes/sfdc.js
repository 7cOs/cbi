'use strict';

module.exports = function(app) {

  var sfdc = require('../controllers/sfdc');
  var sfdcConfig =  app.get('config').sfdcSec;
  var utility = require('util');

  app.post('/sfdc/createNote', function (req, res) {
    sfdc['createNote'](app, req, res);
  });

  app.get('/sfdc/deleteNote', function (req, res) {
    sfdc['deleteNote'](app, req, res);
  });

  app.get('/sfdc/undeleteNote', function (req, res) {
    sfdc['unDeleteNote'](app, req, res);
  });

  app.get('/sfdc/deleteAttach', function (req, res) {
    sfdc['deleteAttach'](app, req, res);
  });

  app.get('/sfdc/searchAccounts', function (req, res) {
    sfdc['searchAccounts'](app, req, res);
  });

  app.get('/sfdc/accountNotes', function (req, res) {
    sfdc['accountNotes'](app, req, res);
  });

  app.get('/sfdc/getAttachments', function(req, res) {
    sfdc['getAttachmentData'](app, req, res);
  });

  app.get('/sfdcauth/getConfig', function(req, res) {
    if (sfdcConfig !== null) {
      res.type('json');
      res.send(utility.inspect(sfdcConfig, null, '\t'));
    } else {
      res.send('<div>The SFDC Configuration is not present. Please check your configuration file for this environment</div>');
    }
  });

  app.get('/sfdcauth/getSessionId', function(app, req, res) {
    sfdc['getSessionId'](app, req, res);
  });

  app.get('/sfdcauth/getAssertion', function(app, req, res) {
    sfdc['getAssertion'](app, req, res);
  });
};
