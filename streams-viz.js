'use strict';

var d3gauge = require('d3-gauge-writable')
  , tabject = require('./lib/tabject-writable')
  , ticker = require('./lib/ticker-writable')
  , lineChart = require('./lib/line-chart-writable')

var go = module.exports = function (viztype, el, opts, objectMode) {
  switch (viztype) {
    case 'gauge': 
      return d3gauge(el, { gauge: opts, objectMode: objectMode });
    case 'table': 
      return tabject(el, opts, true);
    case 'ticker': 
      return ticker(el, opts, objectMode);
    case 'line-chart':
      return lineChart(el, opts, true);
    default: 
      throw new Error('Unkown viztype: ' + viztype);
  }
};
