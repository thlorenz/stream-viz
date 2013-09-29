'use strict';

var d3gauge = require('d3-gauge-writable')
  , tabject = require('./lib/tabject-writable')
  , ticker = require('./lib/ticker-writable')
  , lineChart = require('./lib/line-chart-writable')

exports.gauge = function(el, opts, objectMode) {
  return d3gauge(el, { gauge: opts, objectMode: objectMode });
}

exports.tabject = function (el, opts) {
  return tabject(el, opts, true);
}

exports.ticker = function(el, opts, objectMode) {
  return ticker(el, opts, objectMode);
}

exports.lineChart = function (el, opts) {
  return lineChart(el, opts, true);
}
