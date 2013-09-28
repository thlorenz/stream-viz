'use strict';

var sc = require('smoothie')
  , TimeSeries = sc.TimeSeries
  , SmoothieChart = sc.SmoothieChart

// Randomly add a data point every 500ms
var random = new TimeSeries();
setInterval(function() {
  random.append(new Date().getTime(), Math.random() * 10000);
}, 50);

function createTimeline() {
  var chart = new SmoothieChart();
  chart.addTimeSeries(random, { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.2)', lineWidth: 4 });
  chart.streamTo(document.getElementById("chart"), 50);
}

createTimeline();
