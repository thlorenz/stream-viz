'use strict';

var numbers   =  require('../streams/number-readable')
  , powers    =  require('../streams/power-transform')
  , tarpit    =  require('../streams/tarpit-writable')
  , addThrottleRange = require('./add-throttle-range-input')
  , sviz      =  require('../../')
  , nebraska  =  require('nebraska')
  , chunkRate =  require('chunk-rate-readable')

// DOM elements
var numsEl   =  document.getElementById('numbers')
  , powersEl =  document.getElementById('powers')
  , tarpitEl =  document.getElementById('tarpit')
  
var objectMode = true;
var nums   =  numbers({ objectMode: objectMode, throttle: 200,  highWaterMark: 20 , to: 5000})
  , powers =  powers( { objectMode: objectMode, throttle: 1000, highWaterMark: 20 })
  , pit    =  tarpit( { objectMode: objectMode, throttle: 2000, highWaterMark: 40 })

function getRows (rootEl) {
  var row1 =  rootEl.getElementsByClassName('row1')[0]
    , row2 =  rootEl.getElementsByClassName('row2')[0]
    , row3 =  rootEl.getElementsByClassName('row3')[0]

  return [ null, row1, row2, row3 ];
}

function getOpts(rows) {
  return {
      rate: { element: rows[1] }
    , writableGauge: { element: rows[2] } 
    , readableGauge: { element: rows[2] } 
    , writableState: { element: rows[3] } 
    , readableState: { element: rows[3] } 
  }
}

var numsOpts = getOpts(getRows(numsEl))
  , powersOpts = getOpts(getRows(powersEl))
  , tarpitOpts = getOpts(getRows(tarpitEl))

sviz(nums, numsOpts)
sviz(powers, powersOpts)
sviz(pit, tarpitOpts)

addThrottleRange(numsEl, nums)
addThrottleRange(powersEl, powers)
addThrottleRange(tarpitEl, pit)

nums.pipe(powers).pipe(pit)
