'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');
  var utility = require('util');
  var request = require('request');
  var jsdom = require('jsdom');
  var DOMParser = require('xmldom').DOMParser;
//  var base64util = require('base64util');

//  var sfdcauth = require('../controllers/sfdcauth');
  var sfdcConfig = app.get('config').sfdcSec;
  var saml = require('express-saml2');

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
// https://github.com/request/request#forms
  app.get('/sfdcauth/login', function(req, res) {
    console.log('----------------------> In /sfdcauth/login <----------------');
    console.log('---------> Calling ' + sfdcConfig.spSAMLRequestEndpoint + ' <---------');
    request.debug = true;
    try {
      request(sfdcConfig.spSAMLRequestEndpoint, function (error, response, body) {
        if (error) {
          console.Error(error);
        } else {
          var doc = new DOMParser().parseFromString(body);
          console.log(utility.inspect(doc, null, ''));
        }
      });
    } catch (Error) {
      console.log(Error);
    };
  });
};
