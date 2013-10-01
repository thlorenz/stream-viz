'use strict';
/*jshint asi: true */

var test = require('tape')

// TODO: make streams package to resuse for tests and examples
var numbers = require('../../example/streams/number-readable')
var ticker = require('../../lib/writables/ticker-writable')

test('when upstream is in non-object mode ticks stringified values', function (t) {
  var th = 50
  var el = document.body
  numbers({ from: 1, to: 3, throttle: th })
    .pipe(ticker(el, { ticker: { clazz: 'ticker' } }))

  setTimeout(check.bind(null, '1'),     th + th / 2)
  setTimeout(check.bind(null, '2'), 2 * th + th / 2)
  setTimeout(check.bind(null, '3'), 3 * th + th / 2)
  setTimeout(t.end.bind(t), 4 * th)

  function check(val) {
    t.equal(val, el.getElementsByClassName('ticker')[0].innerHTML, val)
  }
})

test('when upstream is in object mode ticks stringified values', function (t) {
  var th = 50
  var el = document.body
  numbers({ from: 1, to: 3, throttle: th, objectMode: true })
    .pipe(ticker(el, { objectMode: true, ticker: { clazz: 'ticker2' } }))

  setTimeout(check.bind(null, 1),     th + th / 2)
  setTimeout(check.bind(null, 2), 2 * th + th / 2)
  setTimeout(check.bind(null, 3), 3 * th + th / 2)
  setTimeout(t.end.bind(t), 4 * th)

  function check(val) {
    t.equal(el.getElementsByClassName('ticker2')[0].innerHTML, '' + val, ''+val)
  }
})
