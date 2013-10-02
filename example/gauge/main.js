'use strict';

var numbers  =  require('stream-spectrum/readable/numbers')
  , sviz     =  require('../../')
  , el       =  document.getElementById('numbers')

var nums = numbers({ to: 500, throttle: 200 });
nums.pipe(sviz.gauge(el, { label: 'nums', max: 500, clazz: 'simple' }))
