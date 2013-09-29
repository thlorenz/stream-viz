'use strict';

var numbers    =  require('../streams/number-readable')
  , sviz       =  require('../../')
  , nebraska   =  require('nebraska')
  , chunkRate  =  require('chunk-rate-readable')
  , through    =  require('through2')

var numsEl     =  document.getElementById('numbers')
  , numsRow1   =  numsEl.getElementsByClassName('row1')[0]
  , numsRow2   =  numsEl.getElementsByClassName('row2')[0]
  , numsRow3   =  numsEl.getElementsByClassName('row3')[0]

  , powersEl   =  document.getElementById('powers')
  , powersRow1 =  powersEl.getElementsByClassName('row1')[0]
  , powersRow2 =  powersEl.getElementsByClassName('row2')[0]
  , powersRow3 =  powersEl.getElementsByClassName('row3')[0]
  
function pluckReadableBufferLen (chunk, encoding, cb) {
  this.push(chunk.readable.bufferLength);
  cb()
}

function pluckWritableBufferLen (chunk, encoding, cb) {
  this.push(chunk.writable.bufferLength);
  cb()
}

function pluckReadable (chunk, encoding, cb) {
  this.push(chunk.readable);
  cb()
}

function pluckWritable (chunk, encoding, cb) {
  this.push(chunk.readable);
  cb()
}

var readableProps = [
      'highWaterMark'
    , 'length'
    , 'pipesCount'
    , 'flowing'
    , 'ended'
    , 'endEmitted',
    , 'reading' 
    , 'calledRead'
    , 'objectMode'
    , 'defaultEncoding'
];

var nums       =  numbers({ to: 5000, throttle: 50 })
  , numsRate   =  chunkRate(nums)
  , numsState  =  nebraska(nums, { 
        interval: 400
      , readable: readableProps 
    })
  , numsReadableState = numsState
      .pipe(through({ objectMode: true }, pluckReadable))

  , rbufferLen = numsState
      .pipe(through({ objectMode: true }, pluckReadableBufferLen))

nums
  .pipe(sviz.ticker(numsRow1))

numsRate
  .pipe(sviz.lineChart(numsRow1))

rbufferLen
  .pipe(sviz.gauge(numsRow2, { label: 'readable', max: 16, size: 150 }, true))

numsReadableState
  .pipe(sviz.tabject(numsRow3, { tabject: { label: 'Readable State' } }))

