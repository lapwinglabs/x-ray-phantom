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

    nightmare
      .on('error', error)
      .on('timeout', function(timeout) {
        return done(new Error(timeout));
      })
      .on('resourceReceived', function(resource) {
        if (normalize(resource.url) == normalize(ctx.url)) {
          debug('got response from %s: %s', resource.url, resource.status);
          ctx.status = resource.status;
        };
      })
      .on('urlChanged', function(url) {
        debug('redirect: %s', url);
        ctx.url = url;
      })

    wrapfn(fn, select)(ctx, nightmare);

    function select(err, ret) {
      if (err) return done(err);

      nightmare
        .evaluate(function() {
          return document.documentElement.outerHTML;
        }, function(body) {
          ctx.body = body;
        })
        .run(function(err) {
          if (err) return done(err);
          debug('%s - %s', ctx.url, ctx.status);
          done(null, ctx);
        });
    };
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
