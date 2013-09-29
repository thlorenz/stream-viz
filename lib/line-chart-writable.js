'use strict';

var stream = require('stream');
var util = require('util');
var xtend = require('xtend');

var smoothie   =  require('smoothie')
  , TimeSeries =  smoothie.TimeSeries
  , Chart      =  smoothie.SmoothieChart;

var Writable = stream.Writable;

module.exports = LineChartWritable;

util.inherits(LineChartWritable, Writable);

var chartDefaults = {
    millisPerPixel: 33
  , scaleSmoothing: 0.197
  , minValue: 0
  , grid: {
      millisPerLine: 1000
    , verticalSections: 7
  }
  , labels: {
      fontSize: 12
    }
  , timestampFormatter : function(date) {
      function pad2(number) { return (number < 10 ? '0' : '') + number }
      return pad2(pad2(date.getMinutes()) + ':' + pad2(date.getSeconds()));
    }
}

var timeSeriesDefaults = {
    lineWidth: 4
  , strokeStyle: 'rgba(0, 255, 0, 1)'
  , fillStyle: 'rgba(0, 255, 0, 0.2)'
}

/**
 * Creates a stream that visualizes values piped into it as a line chart.
 * 
 * @name LineChartWritable
 * @function
 * @param el {DOMElement} to which the canvas that renders the line chart is attached
 * @param opts {Options} with the following properties (aside from the ones relevant for the stream itself)
 *  **Note:** these can be tweaked most easily via the smoothie chars builder: http://smoothiecharts.org/builder/
 *
 *  - timeSeries: {Object} options applied to smoothie TimeSeries
 *    - resetBounds:  true        - enables/disables automatic scaling of the y-axis
 *    - resetBoundsInterval: 3000 - the period between scaling calculations, in millis
 *    - additionly multiple canvas specific properties that affect the way the line is rendered like
 *      - lineWidth: 4
 *      - strokeStyle: 'rgba(0, 255, 0, 1)'
 *      - fillStyle: 'rgba(0, 255, 0, 0.2)'
 *
 *  - chart: {Object} applied to the SmoothieChart 
 *
 *    - width: 400                  - width set on the canvas
 *    - height: 150                 - height set on the canvas
 *    
 *    - minValue: 0,                - specify to clamp the lower y-axis to a given value
 *    - maxValue: undefined,        - specify to clamp the upper y-axis to a given value
 *    - maxValueScale: 1,           - allows proportional padding to be added above the chart. for 10% padding, specify 1.1.
 *    - yRangeFunction: undefined,  - function({min: , max: }) { return {min: , max: }; }
 *    - scaleSmoothing: 0.125,      - controls the rate at which y-value zoom animation occurs
 *    - millisPerPixel: 20,         - sets the speed at which the chart pans by
 *    - maxDataSetLength: 2,
 *    - interpolation: 'bezier'     - or 'linear'
 *    - timestampFormatter: null,   - Optional function to format time stamps for bottom of chart. You may use SmoothieChart.timeFormatter, or your own: function(date) { return ''; }
 *    - horizontalLines: [],        - [ { value: 0, color: '#ffffff', lineWidth: 1 } ],
 *    - grid: {
 *       - fillStyle: '#000000',     - the background colour of the chart
 *       - lineWidth: 1,             - the pixel width of grid lines
 *       - strokeStyle: '#777777',   - colour of grid lines
 *       - millisPerLine: 1000,      - distance between vertical grid lines
 *       - sharpLines: false,        - controls whether grid lines are 1px sharp, or softened
 *       - verticalSections: 2,      - number of vertical sections marked out by horizontal grid lines
 *       - borderVisible: true       - whether the grid lines trace the border of the chart or not
 *     }
 *   - labels {
 *      - disabled: false,          - enables/disables labels showing the min/max values
 *      - fillStyle: '#ffffff',     - colour for text of labels,
 *      - fontSize: 15,
 *      - fontFamily: 'sans-serif',
 *      - precision: 2
 *   }
 * @return {WritableStream} that will render values piped to it in the line chart
 */
function LineChartWritable (el, opts) {
  if (!(this instanceof LineChartWritable)) return new LineChartWritable(el, opts);

  opts = opts || {};
  opts.objectMode = true;
  Writable.call(this, opts);
  
  this._canvas = document.createElement('canvas');
  el.appendChild(this._canvas);

  this._timeSeriesOpts = xtend(timeSeriesDefaults, opts.timeSeries)
  this._timeSeries = new TimeSeries();

  this._chartOpts = xtend(chartDefaults, opts.chart);
  this._chart = new Chart(this._chartOpts);
  this._chart.addTimeSeries(this._timeSeries, this._timeSeriesOpts);
  this._chart.streamTo(this._canvas, 100);
}

// TODO: code duplicated from d3-gauge-writable.js
//       resolve the issue there and/or make a module, i.e. x-to-number
function isBuffer (chunk) {
  // it seems like chunks emitted from a readable are considered not to be buffers by the browserify-buffer module
  // mainly because instanceof chunk !== Buffer although chunk is actually a Buffer
  // however these Buffers have an .offset and .get, and numerous .read methods, so if we find these we'll assume it's a buffer
  return Buffer.isBuffer(chunk)
    || ( typeof chunk.offset === 'number'
      && typeof chunk.get === 'function'
      && typeof chunk.readDoubleBE === 'function'
      && typeof chunk.readInt32BE === 'function')
}

LineChartWritable.prototype._write = function (chunk, encoding, cb) {
  var val;
  try {
         if (typeof chunk === 'number') val = chunk; 
    else if (isBuffer(chunk))  val = parseInt(chunk.toString(), 10);
    else if(typeof chunk === 'string')  val = parseInt(chunk, 10);
    else cb(new Error('Stream needs to emit numbers in object mode or stringified or buffered numbers otherwise'));

    this._timeSeries.append(new Date().getTime(), val);
    cb();
  } catch (err) {
    cb(err);
  }
};

