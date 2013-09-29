'use strict';

var numbers  =  require('../streams/random-number-readable')
  , sviz     =  require('../../')
  , el       =  document.getElementById('numbers')

var nums = numbers({ throttle: 400 });
nums.pipe(sviz('line-chart', el));
