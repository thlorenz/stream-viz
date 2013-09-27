'use strict';

var numbers  =  require('../streams/number-readable')
  , sviz     =  require('../../')
  , nebraska =  require('nebraska')
  , through  =  require('through2')
  , el       =  document.getElementById('numbers')

var nums       =  numbers({ to: 500, throttle: 200 });
var numsState  =  nebraska(nums, { interval: 400 })
var rbufferLen =  numsState.pipe(through({ objectMode: true }, pluckReadableBufferLen))
//var wbufferLen =  numsState.pipe(through({ objectMode: true }, pluckWritableBufferLen))

function pluckReadableBufferLen (chunk, encoding, cb) {
  console.log(chunk.readable.bufferLength);
  this.push(chunk.readable.bufferLength);
  cb()
}

function pluckWritableBufferLen (chunk, encoding, cb) {
  this.push(chunk.writable.bufferLength);
  cb()
}

nums.pipe(sviz('gauge', el, { label: 'nums', max: 500, clazz: 'simple' }))

rbufferLen.pipe(sviz('gauge', el, { label: 'r-buffer', max: 16, clazz: 'simple' }, true))
