'use strict';
/* **********************************************
J. Scott Cromie - 8/26/2016

This script will produce a valid SAML assertion.  It
runs under node.js, so that, npm, and the node
modules request, cheerio, he, and urlencode must be
installed for it to work.

************************************************/

var builder = require('xmlbuilder'),  // xml parser
    SignedXml = require('xml-crypto').SignedXml, // necessary for signing the cert
    moment = require('moment'), // used to get the time boundaries for the assertion (issueInstant, notOnOrAfter, etc.)
    utils = require('./samlUtils.js'); // useful parsing utilities.
//    u = require('util');

module.exports = {
  // export the function
  getSAMLAssertion: getSAMLAssertion
};

function getSAMLAssertion(app, req, res) {
// generates the SAML Assertion, and then signs the assertion to prepare for presentation to SFDC.
  var sfdcConfig = app.get('config').sfdcSec.samlBuilder;  // All admin-configurable parameters come from /server/_config/environment files.
  var empId = req.user.jwtmap.employeeID;  // The user has already logged in to the IdP at this point.  We use the employee Id to build the assertion.

  var responseID = '_' + utils.uid(8) + '-' + utils.uid(8);
  var assertionID = '_' + utils.uid(8) + '-' + utils.uid(8);

  var certValue = sfdcConfig.certfile;
  var certData = utils.pemToCert(certValue);
  var signingKey = sfdcConfig.privateKey;
  var issuer = sfdcConfig.issuer;  // This corresponds to the IdP, but in this case it is the portal acting as the IdP.
  var recipient = sfdcConfig.recipient; // The target of the assertion (i.e. the SP you are trying to access).
  var audience = sfdcConfig.audience; // This parameter isn't as important for SFDC.  We use the default value of 'https://saml.salesforce.com'

  var now = moment.utc();

  var issueInstant = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  var notOnOrAfter = now.clone().add(600, 'seconds').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  var notBefore = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  var authnInstant = now.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

  var ssoStartPage = sfdcConfig.ssoStartPage; // Unsure if this is necessary.;

  // Build out the assertion XML.  This is what the crypto library will be signing.
  // For an example, head to http://axiom.herokuapp.com and generate an assertion there.
  var assertion = builder.create({
    'saml2p:Response': {
      '@xmlns:saml2p': 'urn:oasis:names:tc:SAML:2.0:protocol',
      '@xmlns:ns': 'http://www.w3.org/2001/XMLSchema',
      '@Destination': recipient,
      '@ID': responseID,
      '@IssueInstant': issueInstant,
      '@Version': '2.0',
      'saml2:Issuer': {
        '@xmlns:saml2': 'urn:oasis:names:tc:SAML:2.0:assertion',
        '#text': issuer
      },
      'saml2p:Status': {
        'saml2p:StatusCode': {
          '@Value': 'urn:oasis:names:tc:SAML:2.0:status:Success'
        }
      },
      'saml2:Assertion': {
        '@xmlns:saml2': 'urn:oasis:names:tc:SAML:2.0:assertion',
        '@ID': assertionID,
        '@IssueInstant': issueInstant,
        '@Version': '2.0',
        'saml2:Issuer': {
          '#text': issuer
        },
        'saml2:Subject': {
          'saml2:NameID': {
            '@Format': 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
            '#text': empId
          },
          'saml2:SubjectConfirmation': {
            '@Method': 'urn:oasis:names:tc:SAML:2.0:cm:bearer',
            'saml2:SubjectConfirmationData': {
              '@NotOnOrAfter': notOnOrAfter,
              '@Recipient': recipient
            }
          }
        },
        'saml2:Conditions': {
          '@NotBefore': notBefore,
          '@NotOnOrAfter': notOnOrAfter,
          'saml2:AudienceRestriction': {
            'saml2:Audience': {
              '#text': audience
            }
          }
        },
        'saml2:AuthnStatement': {
          '@AuthnInstant': authnInstant,
          'saml2:AuthnContext': {
            'samlAuthnContextClassRef': {
              '#text': 'urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified'
            }
          }
        },
        'saml2:AttributeStatement': {
          'saml2:Attribute': [
            {
              '@Name': 'ssoStartPage',
              '@NameFormat': 'urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified',
              'saml2AttributeValue': {
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xsi:type': 'xs:string',
                '#text': ssoStartPage
              }
            },
            {
              '@Name': 'logoutURL',
              '@NameFormat': 'urn:oasis:names:tc:SAML:2.0:attrname-format:unspecified',
              'saml2AttributeValue': {
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xsi:type': 'xs:string'
              }
            }
          ]
        }
      }
    }
  }).dec('1.0', 'UTF-8'); // Put the UTF-8 charset indicator on the XML file.
// Now that we have the assertion in XML format, we need to sign it for transmission
/*  var xmlString = assertion.end({
  // for readability in the console, but not necessary for Prod
    pretty: true,
    indent: '  ',
    newline: '\n',
    allowEmpty: false
  });
*/
  var xmlString = assertion.end({
    allowEmpty: false
  });
// Algorithms in use for encoding the assertion
  var algorithms = {
    signature: {
      'rsa-sha256': 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
      'rsa-sha1': 'http://www.w3.org/2000/09/xmldsig#rsa-sha1'
    },
    digest: {
      'sha256': 'http://www.w3.org/2001/04/xmlenc#sha256',
      'sha1': 'http://www.w3.org/2000/09/xmldsig#sha1'
    }
  };

  var options = {};
  options.signatureAlgorithm = sfdcConfig.signatureAlgorithm || 'rsa-sha256';
  options.digestAlgorithm = sfdcConfig.digestAlgorithm || 'sha256';

  var sig = new SignedXml();
  // Find the Response node and sign it.
  sig.addReference('//*[local-name(.)=\'Response\']',
                  ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#'],
                  algorithms.digest[options.digestAlgorithm]);
  // Use the server's private key to sign the assertion
  sig.signingKey = signingKey;
  // Add the KeyInfo to the assertion (required by SFDC)
  sig.keyInfoProvider = {
    getKeyInfo: function () {
      return '<X509Data><X509Certificate>' + certData + '</X509Certificate></X509Data>';
    }
  };
// Generate the signature and return the XML
  sig.computeSignature(xmlString, {
    location: { reference: '//*[local-name(.)=\'Issuer\']', action: 'after' }
  });
  console.log('<------------------------>The Raw Signed Assertion is:<----------------------------------->');
  console.log(sig.getSignedXml());
  var retValue = utils.samlStrConvert(sig.getSignedXml());
  return retValue;
};
