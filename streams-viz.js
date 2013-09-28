'use strict';

var d3gauge = require('d3-gauge-writable');
var tabject = require('./lib/tabject-writable');

var go = module.exports = function (viztype, el, opts, objectMode) {
  switch (viztype) {
    case 'gauge': 
      return d3gauge(el, { gauge: opts, objectMode: objectMode });
    case 'table': 
      return tabject(el, opts, true);
    default: 
      throw new Error('Unkown viztype: ' + viztype);
  }
};
