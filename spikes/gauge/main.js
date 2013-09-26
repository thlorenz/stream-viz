'use strict';

var numbers = require('../streams/number-readable')
  , d3gauge = require('d3-gauge')
  ;

var gauge = d3gauge(document.body, { max: 500, clazz: 'simple', label: 'numbers' });
gauge.on = function () {};
gauge.once = function () {};
gauge.emit = function () {};
gauge._events = {};
numbers({ to: 500, throttle: 200 }).pipe(gauge);
