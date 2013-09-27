'use strict';

var numbers  =  require('../streams/number-readable')
  , sviz     =  require('../../')
  , nebraska =  require('nebraska')
  , through  =  require('through2')
  , el       =  document.getElementById('numbers')

var nums       =  numbers({ to: 500, throttle: 200 });
var numsState  =  nebraska(nums, { interval: 400 })
var numsReadableState =  numsState.pipe(through({ objectMode: true }, pluckReadable))

function pluckReadable (chunk, encoding, cb) {
  this.push(chunk.readable);
  cb()
}

numsReadableState.pipe(sviz('table', el, { label: 'rstate', max: 16, clazz: 'simple' }, true))
