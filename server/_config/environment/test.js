'use strict';

module.exports = function (config) {
  console.log('Using server config for TEST environment.');

  // global settings
  config.domain = 'compass-qa.cbrands.com';
  config.env = 'test';
  config.address = 'https://' + config.domain + ''; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.analytics = {
    id: 'UA-77300343-6'
  };

  config.api = {
    url: 'https://cbi-api-internal-qa.herokuapp.com',
    key: process.env.API_SECRET,
    apiKey: 'compass-beer-portal',

    // TODO: remove when api gateway is in place
    v3BaseUrls: {
      dateRangeCodes: 'https://cbi-product-metrics-api-qa.herokuapp.com',
      positions: 'https://api-position-internal-qa.herokuapp.com'
    }
  };

  config.saml = {
    entryPoint: 'https://stage-sso.cbrands.com/oamfed/idp/samlv20',
    logoutBase: 'https://stage-sso.cbrands.com/oam/server/logout',
    issuer: 'https://compass-qa.cbrands.com',
    cert: process.env.SSO_CERT,
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands--CBeerDev.cs20.my.salesforce.com/services/oauth2/token?so=00Dm00000008fCJ',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: process.env.SFDC_SIGNING_KEY,
    certfile: process.env.SFDC_CERTIFICATE,
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: 'compass-portal',
    recipient: 'https://cbrands--CBeerDev.cs20.my.salesforce.com?so=00Dm00000008fCJ',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: 'compass-portal'
  };

  config.sfdcSettings = {
    noteRecordTypeId: '012m00000004plsAAA'
  };

  return config;

};
