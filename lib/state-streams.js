'use strict';

var xtend = require('xtend')

// transforms
var pluckWritableBufferLen =  require('./transforms/pluck-writable-buffer-len-transform')
  , pluckReadableBufferLen =  require('./transforms/pluck-readable-buffer-len-transform')
  , pluckWritableState     =  require('./transforms/pluck-writable-state-transform')
  , pluckReadableState     =  require('./transforms/pluck-readable-state-transform')

var nebraska = require('nebraska')

var defaultReadableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'pipesCount'
  , 'flowing'
  , 'reading' 
  , 'objectMode'
]

var defaultWritableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'objectMode'
  , 'needDrain'
  , 'writing'
  , 'bufferProcessing'
  , 'writelen'
]


function readableStateStreams(stateStream) {
  return {
      state: stateStream.pipe(pluckReadableState())
    , bufferLen: stateStream.pipe(pluckReadableBufferLen())
  }
}

function writableStateStreams(stateStream) {
  return {
      state: stateStream.pipe(pluckWritableState())
    , bufferLen: stateStream.pipe(pluckWritableBufferLen())
  }
}

var go = module.exports = function (stream, opts) {
  var streamReadableState = stream._readableState
    , streamWritableState = stream._writableState
    , states = {}

  opts = opts || {};
  var stateInterval = opts.interval || 400;
  var readableStateProps = opts.readableStateProperties || defaultReadableProps
    , writableStateProps = opts.writableStateProperties || defaultWritableProps

  if (!~readableStateProps['bufferLength']) readableStateProps.push('bufferLength');
  if (!~writableStateProps['bufferLength']) writableStateProps.push('bufferLength');

  var streamStateStream = nebraska(stream, { 
      interval: stateInterval
    , readable: readableStateProps
    , writable: writableStateProps
  })

  if (streamReadableState) 
    states.readable = readableStateStreams(streamStateStream)  
  if (streamWritableState) 
    states.writable = writableStateStreams(streamStateStream)  

  return states;
}
