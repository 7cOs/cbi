'use strict';

// Endpoints used for sfdc authorization
// var saml2 = require('saml2-js');
var saml = require('express-saml2');
var nameId, sessionIndex;

function isConnected(app, req, res) {
  console.log('-----> in isConnected');
  var sfdcConfig =  app.get('config').sfdcSec;
//  console.log('-----> sfdcConfig is ' + JSON.stringify(sfdcConfig, null, '') + '\r\n');
  var sp = saml.ServiceProvider(sfdcConfig.spMetadataLocation);
//  console.log('-----> sp is ' + JSON.stringify(sp, null, '') + '\r\n');
  var idp = saml.IdentityProvider(sfdcConfig.idpMetadataLocation);
//  console.log('-----> idp is ' + JSON.stringify(sp, null, '') + '\r\n');
  sp.sendLoginRequest(idp, 'post', function(request) {
    res.render('templates/sfdcLoginForm.pug', request);
  });
};

exports.login = function(app, req, res) {
  console.log('In /sfdc/login');
  isConnected(app, req, res);
  console.log('Returned from isConnected with: ');
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
/*
function oldIsConnected (app, req, res) {
  console.log('<-------------------------sfdc.isConnected----------------------------->');
  try {
    var sfdcConfig =  app.get('config').sfdcSec;
    console.log('sfdcConfig is: ' + sfdcConfig);
  } catch (Error) {
    console.log('\r\n-------> There was an error getting the configuration: ' + Error);
    return {'isSuccess': false,
            'ErrorMessage': 'The configuration for this service is missing.'};
  }
  if (sfdcConfig !== null) {
    var spOptions = {
      entity_id: sfdcConfig.spEntityId,
      private_key: sfdcConfig.spPrivateKey, // fs.readFileSync('../config/sfdcsecurity/key-file.pem').toString(),
      certificate: sfdcConfig.spCertificate, // fs.readFileSync('../config/sfdcsecurity/cert-file.crt').toString(),
      assert_enddpoint: sfdcConfig.spAssertEndpoint // 'https://ssodev.cbrands.com/oamfed/idp/samlv20'
    };

    var idpOptions = {
      sso_login_url: sfdcConfig.idpSSOLoginURL, //   'https://ssodev.cbrands.com/oamfed/idp/samlv20',
      sso_logout_url: sfdcConfig.idpSSOLogoutURL, // 'https://ssodev.cbrands.com/oam/server/logout?end_url=http://www.cbrands.com',
      certificates: sfdcConfig.idpCertificates, // [fs.readFileSync('./server/_config/passport/certs/development.crt').toString()],
      force_authn: sfdcConfig.idpForceAuthn, // true,
      sign_get_request: sfdcConfig.idpSignGetRequest, // false,
      allow_unencrypted_assertion: sfdcConfig.idpAllowUnencryptedAssertion // true
    };
    console.log('\r\n-------> spOptions are: ' + JSON.stringify(spOptions, null, '\t'));
    console.log('\r\n-------> idpOptions are: ' + JSON.stringify(idpOptions, null, '\t'));
  } else {
    return {'isSuccess': false,
            'ErrorMessage': 'The configuration for this service could not be found.'};
  }

  if (saml2 !== null) {
    console.log('\r\n-------> Creating service provider proxy');
    var sp = new saml2.ServiceProvider(spOptions);
    if (sp !== null) console.log('\r\n-------> Service Provider is created: ' + JSON.stringify(sp, null, ''));
    try {
      if (sp !== null) console.log('\r\n-------> Service Provider Metadata is: \r\n' + sp.create_metadata());
      console.log('\r\n-------> Creating identity provider proxy');
    } catch (Error) {
      console.log('\r\n-------> There was an error creating the SP Metadata: ' + Error);
    }
    var idp = new saml2.IdentityProvider(idpOptions);
    if (idp !== null) console.log('\r\n-------> Identity Provider is created: ' + JSON.stringify(idp, null, ''));

    return {'isSuccess': true,
             'sp': sp,
             'idp': idp
           };
  } else {
    return {'isSuccess': false,
            'ErrorMessage': 'The saml2 library is not installed properly.  Please check with your portal\'s administrator.'};
  }
};
*/
