/**
 * Module Dependencies
 */

var crawler = require('x-ray-crawler');
var driver = require('./');

/**
 * Setup the driver
 */

function *phantom(ctx, nightmare) {
  nightmare.goto(ctx.url)
  return nightmare;
}

/**
 * Crawl google
 */

crawler('http://google.com')
  .driver(driver(phantom))
  .on('response', function($, ctx) {
    console.log('%s - %s', ctx.status, $('title').text().trim());
  })
  .crawl(function(err) {
    if (err) throw err;
  })
