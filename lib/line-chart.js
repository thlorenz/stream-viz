'use strict';

var lineChart = require('./writables/line-chart-writable')

var go = module.exports = function (el, opts) {
  return lineChart(el, opts, true);
}
