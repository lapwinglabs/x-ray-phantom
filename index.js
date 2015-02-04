/**
 * Module Dependencies
 */

var debug = require('debug')('x-ray:phantom');
var Nightmare = require('nightmare');
var delegates = require('delegates');

/**
* Custom methods
*/

var methods = [
'useragent',
'viewport',
'scrollTo',
'forward',
'refresh',
'upload',
'click',
'check',
'type',
'back',
'wait'
];

/**
* Export `driver`
*/

module.exports = driver;

/**
* Initialize the `driver`
* with the following `opts`
*
* @param {Object} opts
* @return {Function}
* @api public
*/

function driver(opts) {
var nightmare = Nightmare(opts);

return function plugin(xray) {
  var nightmare = Nightmare(opts);
  var page = 0;

  // plugins
  nightmare
    .on('error', error)
    .goto(xray.url)

  // add methods that can be setters w/o arguments
  methods.forEach(function(method) {
    xray[method] = function() {
      nightmare[method].apply(nightmare, arguments);
      return xray;
    };
  });

  // setup request
  xray.request = function(url, fn) {
    if (page) nightmare.on('error', error).goto(url);

    nightmare.evaluate(function() {
      return document.documentElement.outerHTML;
    }, function(body) {
      page++;
      return fn(null, body);
    })
    .run(function(err) {
      page++;
      if (err) return fn(err);
    });
  }

  return xray;
}
}

/**
* Phantom errors go here
*
* @param {String} msg
*/

function error(msg) {
debug('javascript error %s', msg);
}
