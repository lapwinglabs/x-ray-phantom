/**
 * Module Dependencies
 */

var debug = require('debug')('x-ray:phantom');
var Nightmare = require('nightmare');

/**
* Export `driver`
*/

module.exports = driver;

/**
* Initialize the `driver`
* with the following `options`
*
* @param {Object} options
* @param {Function} fn
* @return {Function}
* @api public
*/

function driver(options, fn) {
  if ('function' == typeof options) fn = options, options = {};
  options = options || {};
  fn = fn || phantom;

  var nightmare = new Nightmare(options);
  nightmare.on('error', error);

  return function phantom_driver(ctx, done) {
    debug('===> request')
    fn(ctx, nightmare, function(err, nightmare) {
      if (err) return done(err);
      debug('<=== response');

      nightmare.evaluate(function() {
        return document.documentElement.outerHTML;
      }, function(body) {
        return done(null, body);
      })
      .run(done);
    });
  }
}

/**
 * Default phantom driver
 *
 * @param {HTTP Context} ctx
 * @param {Nightmare} nightmare
 * @param {Function} fn
 */

function phantom(ctx, nightmare, fn) {
  debug('going to %s', ctx.url);
  nightmare.goto(ctx.url)
  fn(null, nightmare);
}

/**
* Phantom errors go here
*
* @param {String} msg
*/

function error(msg) {
  debug('javascript error %s', msg);
}
