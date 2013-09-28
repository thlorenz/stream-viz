'use strict';

var d3 = require('d3');
var nv = require('nvd3');

function sinAndCos() {
  var sin =  [],
    cos   =  [],
    rand  =  [],
    rand2 =  []
    ;

  for (var i = 0; i < 100; i++) {
    sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
    cos.push({x: i, y: 0.5 * Math.cos(i/10)});
    rand.push({x:i, y: Math.random() / 10});
    rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
  }

  return [
    { area: true,
      values: sin,
      key: "Sine Wave",
      color: "#ff7f0e"
    },
    { values: cos,
      key: "Cosine Wave",
      color: "#2ca02c"
    },
    { values: rand,
      key: "Random Points",
      color: "#2222ff"
    } ,
    { values: rand2,
      key: "Random Cosine",
      color: "#667711"
    }
  ];
}

function createGraph (id) {
  var chart;

  nv.addGraph(function() {
      chart = nv.models.lineChart()
      .options({
        margin: { left: 100, bottom: 100},
        x: function(d,i) { return i},
        showXAxis: true,
        showYAxis: true,
        transitionDuration: 250
      })

    // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
    chart.xAxis
      .axisLabel("Time (s)")
      .tickFormat(d3.format(',.1f'));

    chart.yAxis
      .axisLabel('Voltage (v)')
      .tickFormat(d3.format(',.2f'))
      ;

    d3.select('#' + id + ' svg')
      .datum(sinAndCos())
      .call(chart);

    chart.dispatch.on('stateChange', function(e) { nv.log('New State:', JSON.stringify(e)); });

    return chart;
  })
}

createGraph('line-chart');
