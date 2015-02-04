/**
 * Module Dependencies
 */

var rm = require('fs').unlinkSync;
var join = require('path').join;
var assert = require('assert');
var phantom = require('..');
var xray = require('x-ray');
var fs = require('fs');

/**
 * Tests
 */

describe('x-ray', function() {

  describe('phantom', function() {
    it('should select keys', function(done) {
      var fixture = get('select-keys');
      xray('http://mat.io')
        .use(phantom())
        .select(fixture.input)
        .run(function(err, arr) {
          if (err) return done(err);
          assert.deepEqual(arr.pop(), fixture.expected);
          done();
        });
    });

    it('should paginate', function(done) {
      var fixture = get('paginate');
      xray('https://github.com/stars/matthewmueller')
        .use(phantom())
        .select(fixture.input)
        .paginate('.pagination a:last-child[href]')
        .limit(2)
        .run(function(err, arr) {
          if (err) return done(err);
          fixture.expected(arr);
          done();
        });
    });

    it('should perform complex actions', function(done) {
      xray('https://news.google.com')
        .use(phantom())
        .click('.nv-en_us:e')
        .wait()
        .select([{
          $root: '.esc-body',
          title: '.titletext',
          thumb: 'img[src]'
        }])
        .run(function(err, arr) {
          if (err) return done(err);
          arr.forEach(function(item) {
            assert(item.title.length, 'no title');
            assert(~item.thumb.indexOf('data:image') || ~item.thumb.indexOf('//'), 'not an image');
          })
          done();
        });
    });


    it('should stream to a file and paginate', function(done) {
      var fixture = get('paginate');
      var path = join(__dirname, 'out.json');

      xray('https://github.com/stars/matthewmueller')
        .use(phantom())
        .select(fixture.input)
        .paginate('.pagination a:last-child[href]')
        .limit(2)
        .write(path)
        .on('error', done)
        .on('close', function() {
          var str = fs.readFileSync(path, 'utf8');
          var arr = JSON.parse(str);
          fixture.expected(arr);
          rm(path);
          done();
        });
    });
  });


})

/**
 * Read
 */

function get(path) {
  return require(join(__dirname, 'fixtures', path));
}
