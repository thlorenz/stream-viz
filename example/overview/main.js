'use strict';

var numbers   =  require('../streams/number-readable')
  , powers    =  require('../streams/power-transform')
  , tarpit    =  require('../streams/tarpit-writable')
  , sviz      =  require('../../')
  , nebraska  =  require('nebraska')
  , chunkRate =  require('chunk-rate-readable')
  , through   =  require('through2')

var numsEl   =  document.getElementById('numbers')
  , powersEl =  document.getElementById('powers')
  , tarpitEl =  document.getElementById('tarpit')
  
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
  this.push(chunk.writable);
  cb()
}

var readableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'pipesCount'
  , 'flowing'
  , 'reading' 
  , 'calledRead'
  , 'objectMode'
]

var writableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'objectMode'
  , 'needDrain'
  , 'writing'
  , 'bufferProcessing'
  , 'writelen'
]

var objectMode = true

function vizOverview (rootEl, stream) {
  var rootRow1      =  rootEl.getElementsByClassName('row1')[0]
    , rootRow2      =  rootEl.getElementsByClassName('row2')[0]
    , rootRow3      =  rootEl.getElementsByClassName('row3')[0]
    , readableState =  stream._readableState
    , writableState =  stream._writableState

  var streamRate   =  chunkRate(stream)
    , streamState  =  nebraska(stream, { 
          interval: 400
        , readable: readableProps 
        , writable: writableProps 
      })

  if (writableState) {
    streamState
      .pipe(through({ objectMode: true }, pluckWritableBufferLen))
      .pipe(sviz.gauge(rootRow2, { label: 'writable', max: writableState.highWaterMark, size: 150 }, true))

    streamState
      .pipe(through({ objectMode: true }, pluckWritable))
      .pipe(sviz.tabject(rootRow3, { tabject: { label: 'Writable State' } }))
  }

  if (readableState) {
    stream
      .pipe(sviz.ticker(rootRow1, objectMode))

    streamRate
      .pipe(sviz.lineChart(rootRow1))

    streamState
      .pipe(through({ objectMode: true }, pluckReadableBufferLen))
      .pipe(sviz.gauge(rootRow2, { label: 'readable', max: readableState.highWaterMark, size: 150 }, true))

    streamState
      .pipe(through({ objectMode: true }, pluckReadable))
      .pipe(sviz.tabject(rootRow3, { tabject: { label: 'Readable State' } }))
  }
  return stream;
}

function log () {
  function logit (d) {
    console.log('data', d)
  }

  // logit does not occur whith through2, but when lower line is used, it works (tarpit is a simple write stream that calls back delayed)
  // also some other through maps seem to break in object mode
  return through( { objectMode: objectMode }, logit)
  //return tarpit( { objectMode: objectMode, throttle: 200, highWaterMark: 40, debug: true }) 
}

var nums   =  numbers({ objectMode: objectMode, throttle: 200,  highWaterMark: 20 , to: 5000})
  , powers =  powers( { objectMode: objectMode, throttle: 1000, highWaterMark: 20 })
  , pit    =  tarpit( { objectMode: objectMode, throttle: 2000, highWaterMark: 40 })

nums.pipe(log())

vizOverview(numsEl, nums)
vizOverview(powersEl, powers)
vizOverview(tarpitEl, pit)

nums.pipe(powers).pipe(pit)


