'use strict';
/*jshint asi: true */

var test = require('tape')
var tabject = require('../../lib/writables/tabject-writable')

test('streaming objects will render them as an html table', function (t) {
  var el = document.body
  var stream = tabject(el, { tabject: { clazz: 'tabject-test' } })

  stream.write({ foo: 'bar', uno: 1})

'<div style="white-space: pre;" string"=""><span class="tabject-key">foo:</span>    <span class="tabject-value string">"bar"</span></div>'
  var tabEl = el.getElementsByClassName('tabject-test')[0]
  var lines = tabEl.innerHTML.split('\n')

  var fst = lines[0]
  t.ok(
      ~fst.indexOf('<div style="white-space: pre;" class="tabject-entry string">')
    , 'entry header with correct class including value type and style'
  )
  t.ok(
      ~fst.indexOf('<span class="tabject-key">foo:</span>')
    , 'first key with correct class'
  )
  t.ok(
      ~fst.indexOf('<span class="tabject-value string">"bar"</span>')
    , 'first value with correct class including value type'
  )

  var snd = lines[1]
  t.ok(
      ~snd.indexOf('<div style="white-space: pre;" class="tabject-entry number">')
    , 'entry header with correct class including value type and style'
  )
  t.ok(
      ~snd.indexOf('<span class="tabject-key">uno:</span>')
    , 'second key with correct class'
  )
  t.ok(
      ~snd.indexOf('<span class="tabject-value number">1</span></div>')
    , 'second value with correct class including value type'
  )

  t.end()
})
