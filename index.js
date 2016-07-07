/**
 * Module Dependencies
 */

var debug = require('debug')('x-ray:phantom');
var normalize = require('normalizeurl');
var Nightmare = require('nightmare');
var wrapfn = require('wrap-fn');

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


  return function phantom_driver(ctx, done) {
    debug('going to %s', ctx.url);

    fn(ctx, nightmare)
        .evaluate(function() {
            return document.documentElement.outerHTML;
        })
        .end()
        .then(function (body) {
            debug('got response from %s, content length: %s', ctx.url, (body || '').length);
            ctx.body = body;
            done(null, ctx);
        })
        .catch(function (err) {
            debug('nightmare error', err);
            if (err) return done(err);
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

function phantom(ctx, nightmare) {
  return nightmare.goto(ctx.url);
}

/**
* Phantom errors go here
*
* @param {String} msg
*/

function error(msg) {
  debug('client-side javascript error %s', msg);
}
