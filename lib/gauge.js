'use strict';

var d3gauge = require('d3-gauge-writable')

var go = module.exports = function(el, opts) {
  return d3gauge(el, { gauge: opts, objectMode: true });
}
