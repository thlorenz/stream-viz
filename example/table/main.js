'use strict';

var numbers  =  require('../streams/number-readable')
  , sviz     =  require('../../')
  , nebraska =  require('nebraska')
  , through  =  require('through2')
  , el       =  document.getElementById('numbers')

var nums       =  numbers({ to: 500, throttle: 2000 });
var numsState  =  nebraska(nums, { interval: 400, readable: nebraska.properties.readable })
var numsReadableState =  numsState.pipe(through({ objectMode: true }, pluckReadable))

function pluckReadable (chunk, encoding, cb) {
  this.push(chunk.readable);
  cb()
}

numsReadableState.pipe(sviz('table', el))

setTimeout(pipenums, 2000);

function pipenums () {
  nums.pipe(through());
}
