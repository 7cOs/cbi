'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');
  var sfdcauth = require('../controllers/sfdcauth');
  var sfdcConfig = app.get('config').sfdcSec;

//  var lazyproxy = require('lazy-proxy');
//  var port = process.env.PORT || 3000;
//  var sfdcPassport = require('passport');
//  var ForceDotComStrategy = require('passport-forcedotcom').Strategy;
//  var Pptsfdc = require('passport-salesforce').Strategy;

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
      res.send(sfdcConfig);
    } else {
      res.send('<div>The SFDC Configuration is not present. Please check your configuration file for this environment</div>');
    }
  });

  app.get('/sfdcauth/metadata.xml', function(app, req, res) {
    if (sfdcauth != null) {
      console.log('---> Entering sfdcauth');
      sfdcauth['getMetadata'](app, req, res);
      console.log('---> Finished with sfdcauth');
    } else {
      res.send('<div>The SFDC Authorization module is not installed.  Please contact your administrator.</div>');
    }
  });

  app.get('/sfdcauth/callSFDCLogin', function(req, res) {
    sfdcauth['login'](app, req, res);
  });

  app.get('/sfdcauth/callSFDClogout', function(req, res) {
    sfdcauth['logout'](app, req, res);
  });

  app.get('/sfdcauth/assert', function(req, res) {
    sfdcauth['getAssert'](app, req, res);
  });
};
