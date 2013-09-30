'use strict';

var numbers          =  require('../streams/number-readable')
  , powers           =  require('../streams/power-transform')
  , tarpit           =  require('../streams/tarpit-writable')
  , sviz             =  require('../../')
  , addThrottleRange =  require('./add-throttle-range-input')

// DOM elements
var numsEl   =  document.getElementById('numbers')
  , powersEl =  document.getElementById('powers')
  , tarpitEl =  document.getElementById('tarpit')
  
// this also works in non-object mode, but then the highWaterMark is related to actual
// length of emitted data instead of 1/object and thus it is harder to reason about
// what's going on
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
      rate          :  { element :  rows[1] }
    , ticker        :  { element :  rows[1] }
    , writableGauge :  { element :  rows[2] }
    , readableGauge :  { element :  rows[2] }
    , writableState :  { element :  rows[3] }
    , readableState :  { element :  rows[3] }
  }
}

// we'll use the default opts, but specify the DOM element to attach the pieces to in order to 
// get a nicely layed out overview of all of them
var numsOpts   =  getOpts(getRows(numsEl))
  , powersOpts =  getOpts(getRows(powersEl))
  , tarpitOpts =  getOpts(getRows(tarpitEl))

// visualize the separate streams
// passing no opts at all also works, but we loose the layout
sviz(nums, numsOpts)
sviz(powers, powersOpts)
sviz(pit, tarpitOpts)

// Allow user to configure stream throttle via a range slider
addThrottleRange(numsEl, nums)
addThrottleRange(powersEl, powers)
addThrottleRange(tarpitEl, pit)

nums.pipe(powers).pipe(pit)
