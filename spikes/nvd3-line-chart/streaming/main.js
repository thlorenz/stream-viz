'use strict';
var nv = require('nvd3');
var d3 = require('d3');

var chart;
var data = [{
	key: "Stream 1",
	color: "orange",
	values: [
		{x: 1, y: 1}
	]
}];

nv.addGraph(function() {
  
  chart = nv.models.historicalBarChart();

  chart
      .x(function(d,i) { return d.x });

  chart.xAxis // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
      .tickFormat(d3.format(',.1f'))
      .axisLabel("Time")
      ;

  chart.yAxis
      .axisLabel('Random Number')
      .tickFormat(d3.format(',.4f'));

  chart.showXAxis(true).showYAxis(true).rightAlignYAxis(true).margin({right: 90});

  d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});

var x = 2;
var run = true;
setInterval(function(){
	if (!run) return;
	
	var spike = (Math.random() > 0.95) ? 10: 1;
	data[0].values.push({
		x: x,
		y: Math.random() * spike
	});

	if (data[0].values.length > 70) {
		data[0].values.shift();
	}
	x++;

	chart.update();
}, 500);

d3.select("#start-stop-button").on("click",function() {
	run = !run;
});
