'use strict';

var numbers  =  require('../streams/number-readable')
  , sviz     =  require('../../')
  , nebraska =  require('nebraska')
  , through  =  require('through2')
  , el       =  document.getElementById('numbers')

var nums = numbers({ to: 500, throttle: 2000 });
nums.pipe(sviz('ticker', el));
