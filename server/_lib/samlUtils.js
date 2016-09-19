/* **********************************************
J. Scott Cromie - 9/8/2016

Helper utility functions to assist in generating
a SAML Assertion for SFDC

************************************************/
exports.samlStrConvert = function(str) {
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/"/g, '&quot;');
  // str = str.replace(/&/g, '&amp;');
  str = str.replace(/'/g, '&apos;');
  return str;
};
/**
 * Returns the pure cert without the BEGIN and END lines.
 *
 *     utils.pemToCert(<pem formatted certificate data>)
 *
 *
 * @param {String} pem
 * @return {String}
 * @api private
 */

exports.pemToCert = function(pem) {
  var cert = /-----BEGIN CERTIFICATE-----([^-]*)-----END CERTIFICATE-----/g.exec(pem.toString());
  if (cert.length > 0) {
    return cert[1].replace(/[\n|\r\n]/g, '');
  }

  return null;
};

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */

exports.uid = function(len) {
  var buf = [],
      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }
  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
