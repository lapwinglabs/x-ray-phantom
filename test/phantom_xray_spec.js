/* global it, describe */

'use strict'

var Xray = require('x-ray')
var phantom = require('../')
var assert = require('assert')

describe('Xray.driver(fn)', function () {
  it('should support basic phantom', function (done) {
    var x = Xray()
      .driver(phantom({
        webSecurity: false
      }))

    x('http://www.google.com/ncr', 'title')(function (err, str) {
      if (err) return done(err)
      assert.equal('Google', str)
      done()
    })
  })
})
