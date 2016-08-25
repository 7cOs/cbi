/**
 * Module dependencies.
 */
const passport = require('passport-strategy');
const util = require('util');

/**
 * `NoAuthStrategy` constructor.
 *
 * The no-auth authentication strategy authenticates requests to a default
 * user no matter the request.
 *
 * Options:
 *   - `user`  required the user object you want stored in the user session
 *
 * Examples:
 *
 *     passport.use(new NoAuthStrategy(options));
 *
 * @param {Object} options
 * @api public
 */
function NoAuthStrategy(options) {
  if (!options || !options.user) {
    throw new Error('A user object is required.');
  }

  passport.Strategy.call(this);

  this.name = 'no-auth';
  this._user = options.user;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(NoAuthStrategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a HTTP Basic authorization
 * header.
 *
 * @param {Object} req
 * @api protected
 */
NoAuthStrategy.prototype.authenticate = function(req) {
  this.success(this._user);
};

/**
 * Expose `BasicStrategy`.
 */
module.exports = NoAuthStrategy;
