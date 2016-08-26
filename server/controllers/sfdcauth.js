'use strict';

// Endpoints used for sfdc authorization
// var saml2 = require('saml2-js');
const util = require('util');
var request = require('request');
var ssoSAML = require('../_lib/ssoSAML.js'')

var nameId, sessionIndex;

function isConnected(app, req, res) {
  console.log('-----> in isConnected');
  var sfdcConfig =  app.get('config').sfdcSec;
  console.log('-----> sfdcConfig is ' + JSON.stringify(sfdcConfig, null, '') + '\r\n');
  var sp = saml.ServiceProvider(sfdcConfig.spMetadataLocation);
  console.log('-----> sp is ' + JSON.stringify(sp, null, '') + '\r\n');
  var idp = saml.IdentityProvider(sfdcConfig.idpMetadataLocation);
  console.log('-----> idp is ' + JSON.stringify(sp, null, '') + '\r\n');
  sp.sendLoginRequest(idp, 'post', function(request) {
    res.render('templates/sfdcLoginForm.pug', request);
  });
};

function getSessionId(app, req, res) {
  var sessionId = '';

  var sfdcConfig = app.get('config').sfdcSec;

  var options = {
    'grant_type': sfdcConfig.grant_type,
    'assertion_type': sfdcConfig.assertion_type,
    'assertion': getAssertion(sfdcConfig)
  };

exports.login = function(app, req, res) {
  console.log('-----> In /sfdc/login');
  var loginPromise = new Promise(function (resolve, reject) {
    try {
      console.log('-----> Attempting to login by calling isConnected.');
      isConnected(app, req, res);
      console.log('-----> After login, res is: ');
      console.log('----->' + util.inspect(res, false, null));
    } catch (Error) {
      console.Error('There was an error getting connected' + Error);
      res.send(500);
    }
    loginPromise.then(function(result) {
      console.log(util.inspect(result, false, null));
//      res.write(strResponse);
//      res.end();
    }, function (err) {
      console.log('There was an error getting connected' + err);
    });
  });
  console.log('Returned from isConnected with: ' + util.inspect(res, false, null));
};

exports.getMetadata = function(app, req, res) {
  console.log('in sfdcauth.getMetadata');
  var mdPromise = new Promise(function (resolve, reject) {
    try {
      console.log('Attempting to get connected by calling isConnected.');
      var spIdp = isConnected(app, req, res);
      if (spIdp.isSuccess) {
        console.log('Back from this.isConnected.');
        if (spIdp) {
          var sp = spIdp.sp;
          var idp = spIdp.idp;
          console('\n\nsp is:' + JSON.stringify(sp, null, '\t') + '\n\n');
          console('\n\nidp is: ' + JSON.stringify(idp, null, '\t') + '\n\n');
          console.log('Both sides created.  Now creating the Service Provider metadata');
          var md = sp.create_metadata();  // can this be asynchronous or do I have to use a promise for it?
          if (md !== null) {
            console.log('Metadata is created: ' + md);
            resolve(md);
          } else {
            reject(Error('No metadata was found: '));
          };
          mdPromise.then(function (result) {
            var strResponse = JSON.stringify(result, null, '\t');
            res.write(strResponse);
            res.end();
          }, function (err) {
            console.log('There was an error getting metadata for the idP: ' + err);
          });
        } else {
          res.write('<div>There was an error using the saml2-js library.</div>');
          res.end();
        }
      } else {
        console.log('There was an error getting connected: ' + spIdp.ErrorMessage);
        res.send('<div>There was an error getting connects: ' + spIdp.ErrorMessage);
      }
    } catch (Error) {
      console.log('There was an error using the saml2-js library: ' + Error.getMessage());
      res.send('<div>There was an error using the saml2-js library: ' + Error.getMessage() + '</div>');
    }
  });
};




exports.assert =  function(app, req, res) {
  var options = {request_body: req.body};
  var spIdp = isConnected(app, req, res);
  spIdp.sp.post_assert(spIdp.idp, options, function(err, samlResponse) {
    if (err !== null) {
      nameId = samlResponse.user.name_id;
      sessionIndex = samlResponse.user.session_index;
      res.send('Hello #{saml_response.user.name_id}!');
      return res.send(500);
    };
  });
};

exports.logout = function(app, req, res) {
  var options = {
    name_id: nameId,
    session_index: sessionIndex
  };
  var spIdp = isConnected(app, req, res);
  spIdp.sp.create_logout_request_url(spIdp.idp, options, function(err, logoutUrl) {
    if (err != null) {
      return res.send(500);
    }
    res.redirect(logoutUrl);
  });
};