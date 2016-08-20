'use strict';

// Endpoints used for sfdc authorization
var saml2 = require('saml2-js');
var nameId, sessionIndex;

function isConnected (app, req, res) {
  console.log('Connecting to SFDC through sfdc.isConnected');
  var sfdcConfig = app.get('config').sfdcSec;
  console.log('sfdcConfig is: ' + sfdcConfig);
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
    console.log('spOptions are: ' + spOptions);
    console.log('idpOptions are: ' + idpOptions);
  } else {
    return {'isSuccess': false,
            'ErrorMessage': 'The configuration for this service could not be found.'};
  }

  if (saml2 !== null) {
    console.log('Creating service provider proxy');
    var sp = new saml2.ServiceProvider(spOptions);
    if (sp !== null) console.log('Service Provider is created: ' + sp);
    console.log('Creating identity provider proxy');
    var idp = new saml2.IdentityProvider(idpOptions);
    if (idp !== null) console.log('Identity Provider is created: ' + idp);

    return {'isSuccess': true,
             'sp': sp,
             'idp': idp
           };
  } else {
    return {'isSuccess': false,
            'ErrorMessage': 'The saml2 library is not installed properly.  Please check with your portal\'s administrator.'};
  }
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
          console('sp is:' + sp);
          console('idp is: ' + idp);
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

exports.login = function(app, req, res) {
  console.log('In /sfdc/login');
  var spIdp = isConnected(app, req, res);
  spIdp.sp.create_login_request_url(spIdp.idp, {}, function(err, loginUrl, requestId) {
    if (err != null) {
      return res.sendStatus(500);
    }
    console.log('returned ' + loginUrl);
    res.redirect(loginUrl);
  });
};

exports.assert =  function(app, req, res) {
  var options = {request_body: req.body};
  var spIdp = this.isConnected(app, req, res);
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
  var spIdp = this.isConnected(app, req, res);
  spIdp.sp.create_logout_request_url(spIdp.idp, options, function(err, logoutUrl) {
    if (err != null) {
      return res.send(500);
    }
    res.redirect(logoutUrl);
  });
};
