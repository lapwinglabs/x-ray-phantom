/**
 * Module Dependencies
 */

var crawler = require('x-ray-crawler');
var Swiftly = require('nightmare-swiftly');
var join = require('path').join;
var assert = require('assert');
var phantom = require('../');
var fs = require('fs');

/**
 * Authentication
 */

var auth = {
  linkedin: {
    email: 'x.ray.phantom.driver@gmail.com',
    password: 'x.ray.phantom.driverx.ray.phantom.driver'
  },
  outlook: {
    email: 'x.ray.phantom.driver@outlook.com',
    password: 'phantom.driver'
  }
};

/**
 * Tests
 */

describe('phantom driver', function() {

  it('should have sensible defaults', function(done) {
    crawler('http://google.com')
      .driver(phantom())
      .on('response', response)
      .crawl(function() {

      })

    function response($, ctx) {
      var title = $('title').text();
      assert.equal('Google', title);
      done();
    }
  });

  // TODO: change authentication, linkedin
  // doesn't authenticate consistently
  it('should support complex logins', function(done) {
    crawler('http://linkedin.com')
      .driver(phantom(linkedin))
      .on('response', response)
      .crawl(function() {
      })

    function linkedin(ctx, nightmare) {
      return nightmare
        .type('#session_key-login', auth.linkedin.email)
        .type('#session_password-login', auth.linkedin.password)
        .click('#signin')
          .wait('a.account-toggle')
            .click('a.account-toggle')
              .wait('.full-name')
      }

    function response($, ctx) {
      var name = $('.full-name').text();
      assert.equal('X Ray', name);
      done();
    }
  });

  it('should support pagination', function(done) {
    this.timeout(60000);

    // var Nightmare = require("nightmare");
    // var nightmare = new Nightmare({ cookiesFile: "./cookie.txt"});
    // nightmare
    //   .goto("http://www.hotmail.com")
    //   .type("input[type=\"email\"]", "matthewmueller@outlook.com")
    //   .type("input[type=\"password\"]", "m9jNskfz4AwkqBV")
    //   .screenshot("./beforeLoggedIn.jpg")
    //   .click("input[type=\"submit\"]")
    //   .wait()
    //   .screenshot("./afterLoggedIn.jpg")
    //   .goto("http://www.onedrive.com")
    //   .screenshot("./onedrive.jpg")
    //   .wait()
    //   .run(function(err, nightmare){
    //     if(err) throw new Error(err);
    //     console.log("completed");
    //   });


    crawler('http://www.hotmail.com')
      .driver(phantom(outlook))
      .on('error', done)
      .on('response', response)
      .paginate('#c_hli @ href')
      .limit(1)
      .crawl(function() {
        console.log('calling done....');
        done();
      })

    function outlook(ctx, nightmare) {
      if ('https://account.live.com/' == ctx.url) {
        return nightmare
          .goto("http://www.onedrive.com")
          .wait()
          .screenshot('./nextPage.png')
      } else {
        return nightmare
          .goto(ctx.url)
          .type('input[type="email"]', auth.outlook.email)
          .type('input[type="password"]', auth.outlook.password)
          .click('input[type="submit"]')
          .wait()
          .screenshot('./afterLogin.png')
      }
    }

    function response($, ctx) {
      console.log('AFTER URL: %s', ctx.url);
      var str = $('#c_meun').text();
      assert.equal('X Ray', str);
    }
  });


})

/**
 * Read
 */

function get(path) {
  return require(join(__dirname, 'fixtures', path));
}
