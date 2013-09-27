'use strict';

var d3gauge = require('d3-gauge-writable');

var go = module.exports = function (viztype, el, opts) {
  switch (viztype) {
    case 'gauge': return d3gauge(el, { gauge: opts });
    default: throw new Error('Unkown viztype: ' + viztype);
  }
};
