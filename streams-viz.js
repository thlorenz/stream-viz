'use strict';

var d3gauge = require('d3-gauge-writable');
var tabjectWritable = require('./lib/tabject-writable');

var go = module.exports = function (viztype, el, opts, objectMode) {
  switch (viztype) {
    case 'gauge': 
      return d3gauge(el, { gauge: opts, objectMode: objectMode });
    case 'table': 
      return tabjectWritable(el, { tabject: opts }, true);
    default: 
      throw new Error('Unkown viztype: ' + viztype);
  }
};
