/**
 * Module Dependencies
 */

var Crawler = require('x-ray-crawler');
var cheerio = require('cheerio');
var join = require('path').join;
var assert = require('assert');
var phantom = require('../');
var fs = require('fs');

/**
 * Tests
 */

describe('phantom driver', function() {

  it('should have sensible defaults', function(done) {
    var crawler = Crawler(phantom());

    crawler('http://google.com', function(err, ctx) {
      if (err) return done(err);
      var $ = cheerio.load(ctx.body);
      var title = $('title').text();
      assert.equal('Google', title);
      done();
    })
  });

  it.skip('should work with client-side pages', function(done) {
    var crawler = Crawler(phantom());

    crawler('https://exchange.coinbase.com/trade', function(err, ctx) {
      if (err) return done(err);
      var $ = cheerio.load(ctx.body);
      var price = $('.market-num').text();
      assert.equal(false, isNaN(+price));
      done();
    })
  });

  it('should support custom functions', function(done) {
    var crawler = Crawler(phantom(runner));

    crawler('http://www.npmjs.com', function(err, ctx) {
      if (err) return done(err);
      var $ = cheerio.load(ctx.body);
      var title = $('title').text();
      assert.equal('npm Documentation', title);
      done();
    });

    function runner(ctx, nightmare) {
      return nightmare
          .goto(ctx.url)
          .click('#nav-docs-link')
          .wait()
    }
  });
});

/**
 * Read
 */

function get(path) {
  return require(join(__dirname, 'fixtures', path));
}
