'use strict';

var numbers            =  require('stream-spectrum/readable/number')
  , tarpit             =  require('stream-spectrum/writable/tarpit')
  , sviz               =  require('../../')
  , nebraska           =  require('nebraska')
  , el                 =  document.getElementById('numbers')
  , pluckReadableState =  require('../../lib/transforms/pluck-readable-state-transform')

var nums              =  numbers({ to: 5000, throttle: 200, objectMode: true, highWaterMark: 10 });
var numsState         =  nebraska(nums, { interval: 400, readable: nebraska.properties.readable })
var numsReadableState =  numsState.pipe(pluckReadableState())

numsReadableState.pipe(sviz.tabject(el, { tabject: { label: 'Readable State' } }));
nums.pipe(tarpit({ objectMode: true, throttle: 800 }))
