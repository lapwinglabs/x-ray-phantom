/**
 * Module Dependencies
 */

var crawler = require('x-ray-crawler');
var driver = require('./');

/**
 * Setup the driver
 */

function phantom(ctx, nightmare, fn) {
  nightmare.goto(ctx.url)
  return fn(null, nightmare);
}



crawler('http://google.com')
  .driver(driver(phantom))
  .on('response', function($, ctx) {
    console.log(ctx.status);
  })
  .crawl(function(err) {
    if (err) throw err;
    console.log('done');
  })
