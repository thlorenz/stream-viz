'use strict';

var numbers  =  require('stream-spectrum/readable/random-number')
  , sviz     =  require('../../')
  , el       =  document.getElementById('numbers')

var nums = numbers({ throttle: 400 });
nums.pipe(sviz.lineChart(el));
