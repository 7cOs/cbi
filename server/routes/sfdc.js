'use strict';

module.exports = function(app) {
  var sfdc = require('../controllers/sfdc');
  var utility = require('util');
  var request = require('request');
  var jsdom = require('jsdom');
  var DOMParser = require('xmldom').DOMParser;
  var htmlparser = require('htmlparser2');

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
    // request.debug = true;
    try {
      var commands = {};
      // Step 1 - send original SAML Request
      request(sfdcConfig.spSAMLRequestEndpoint, function (error, response, body) {
        if (error) {
          console.Error(error);
        } else {
          var parser = new htmlparser.Parser({
            onopentag: function(name, attribs) {
              if (name === 'form') {
                commands['action'] = attribs.action;
              } else if (name === 'input') {
                if (attribs.name === 'RelayState') {
                  commands['RelayState'] = attribs.value;
                } else if (attribs.name === 'SAMLRequest') {
                  commands['SAMLRequest'] = attribs.value;
                }
              }
            }});
          parser.write(body);
          parser.end();
        };
        console.log(JSON.stringify(commands, null, '\t'));
      });
      // Step 2 - build SAML request submission to OAM
      request.post(commands.action,
                  {form: {'RelayState': commands.RelayState,
                          'SAMLRequest': commands.SAMLRequest}},
                  function (err, httpResponse, body) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log('-----------------> The response from OAM is: <--------------------');
                      console.log(body);
                      console.log('--------------------> End OAM Response <--------------------------');
                    };
                  });
    } catch (Error) {
      console.log(Error);
    };
  });
};
