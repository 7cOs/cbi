'use strict';

module.exports = function (config) {
  console.log('Using server config for PRODUCTION environment.');

  // global settings
  config.domain = 'compass.cbrands.com';
  config.env = 'production';
  config.address = 'https://' + config.domain + '/'; // base url

  // directories
  config.public = {
    css: config.address + 'css/',
    img: config.address + 'img/',
    lib: config.address + 'lib/',
    js: config.address + 'js/'
  };

  config.analytics = {
    id: 'UA-77300343-7'
  };

  config.api = {
    url: 'https://internal.api.cbrands.com',
    key: process.env.API_SECRET,
    apiKey: 'compass-beer-portal',

    // TODO: remove when api gateway is in place
    v3BaseUrls: {
      accounts: 'https://api-account-internal-prod.herokuapp.com',
      distributors: 'https://api-distributors-internal-prod.herokuapp.com',
      lists: 'https://api-lists-internal-prod.herokuapp.com',
      opportunities: 'https://api-opportunity-internal-prod.herokuapp.com',
      positions: 'https://api-position-internal-prod.herokuapp.com',
      productMetrics: 'https://cbi-product-metrics-api-prod.herokuapp.com'
    }
  };

  config.saml = {
    entryPoint: 'https://sso.cbrands.com/oamfed/idp/samlv20',
    logoutBase: 'https://sso.cbrands.com/oam/server/logout',
    issuer: 'https://compass.cbrands.com',
    cert: process.env.SSO_CERT,
    privateCert: '',
    signatureAlgorithm: 'sha1'
  };

  config.sfdcSec = {
    // assertionEndpoint: the endpoint you connect to in order to get the session token.
    assertionEndpoint: 'https://cbrands.my.salesforce.com/services/oauth2/token?so=00DA0000000Iy9s',
    // privateKey and certfile: keys generated from SFDC's Key and Certificate Management area
    privateKey: process.env.SFDC_SIGNING_KEY,
    certfile: process.env.SFDC_CERTIFICATE,
    // issuer, recipient: can be anything, but must match between the SFDC Single Sign-On Configuration and this value.
    issuer: process.env.SFDC_ISSUER,
    recipient: 'https://cbrands.my.salesforce.com?so=00DA0000000Iy9s',
    // This value matches with the Entity Id value in the SFDC Single Sign-On Configuration
    audience: 'https://saml.salesforce.com',
    // These algorithms should not be touched.  They are used to encrypt the certificates.
    signatureAlgorithm: 'rsa-sha256',
    digestAlgorithm: 'sha256',
    // Used in samlBuilder as an attribute in the Assertion creation.
    ssoStartPage: process.env.SFDC_ISSUER
  };

  config.sfdcSettings = {
    noteRecordTypeId: '012G0000001BSRRIA4'
  };

  return config;

};
