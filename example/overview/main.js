'use strict';

var numbers   =  require('../streams/number-readable')
  , powers    =  require('../streams/power-transform')
  , tarpit    =  require('../streams/tarpit-writable')
  , sviz      =  require('../../')
  , nebraska  =  require('nebraska')
  , chunkRate =  require('chunk-rate-readable')

// transforms
var pluckWritableBufferLen =  require('../../lib/transforms/pluck-writable-buffer-len-transform')
  , pluckReadableBufferLen =  require('../../lib/transforms/pluck-readable-buffer-len-transform')
  , pluckWritableState     =  require('../../lib/transforms/pluck-writable-state-transform')
  , pluckReadableState     =  require('../../lib/transforms/pluck-readable-state-transform')
  , logger                 =  require('../../lib/transforms/logger-transform') 

// DOM elements
var numsEl   =  document.getElementById('numbers')
  , powersEl =  document.getElementById('powers')
  , tarpitEl =  document.getElementById('tarpit')
  
var readableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'pipesCount'
  , 'flowing'
  , 'reading' 
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

  var streamRate   =  chunkRate(stream, { interval: 2000 })
    , streamState  =  nebraska(stream, { 
          interval: 400
        , readable: readableProps 
        , writable: writableProps 
      })

  if (writableState) {
    streamState
      .pipe(pluckWritableBufferLen())
      .pipe(sviz.gauge(rootRow2, { label: 'writable', max: writableState.highWaterMark, size: 150 }, true))

    streamState
      .pipe(pluckWritableState())
      .pipe(sviz.tabject(rootRow3, { tabject: { label: 'Writable State' } }))
  }

  if (readableState) {
    stream
      .pipe(sviz.ticker(rootRow1, objectMode))

    streamRate
      .pipe(sviz.lineChart(rootRow1))

    streamState
      .pipe(pluckReadableBufferLen())
      .pipe(sviz.gauge(rootRow2, { label: 'readable', max: readableState.highWaterMark, size: 150 }, true))

    streamState
      .pipe(pluckReadableState())
      .pipe(sviz.tabject(rootRow3, { tabject: { label: 'Readable State' } }))
  }

}

var nums   =  numbers({ objectMode: objectMode, throttle: 200,  highWaterMark: 20 , to: 5000})
  , powers =  powers( { objectMode: objectMode, throttle: 1000, highWaterMark: 20 })
  , pit    =  tarpit( { objectMode: objectMode, throttle: 2000, highWaterMark: 40 })

vizOverview(numsEl, nums)
vizOverview(powersEl, powers)
vizOverview(tarpitEl, pit)

function throttleRange(el, stream) {
  var range = el.getElementsByClassName('throttle')[0];
  var rangeValue = el.getElementsByClassName('throttle-value')[0];
  range.onchange = onvalueChanged;
  range.min = 0;
  range.max = 2000;
  range.step = 100;
  range.value = stream.throttle;
  rangeValue.innerHTML = stream.throttle;
  window.range = range;

  function onvalueChanged (ev) {
    var range = ev.srcElement;
    rangeValue.innerHTML = range.value;
    stream.throttle = range.valueAsNumber;
  }
}

throttleRange(numsEl, nums)
throttleRange(powersEl, powers)
throttleRange(tarpitEl, pit)

nums.pipe(powers).pipe(pit)

