'use strict';

var dc = require('dc');

var el = document.createElement('div');
document.body.appendChild(el);

var xdomain = [new Date(2012, 0, 1), new Date(2012, 11, 31)];

var chart = dc.lineChart(el);

