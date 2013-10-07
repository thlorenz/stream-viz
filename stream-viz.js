'use strict';

var xtend = require('xtend')

// readables
var nebraska        =  require('nebraska')
  , chunkRate       =  require('chunk-rate-readable')

module.exports = exports = StreamViz;

// renderers and transforms which are exposed separately for more customized use
var gauge           =  exports.gauge        =  require('./lib/gauge')
  , lineChart       =  exports.lineChart    =  require('./lib/line-chart')
  , tabject         =  exports.tabject      =  require('./lib/tabject')
  , ticker          =  exports.ticker       =  require('./lib/ticker')
  // TODO: probably this should be it's own albeit small module
  , getStateStreams =  exports.stateStreams =  require('./lib/state-streams')

var body = typeof document !== 'undefined'
  ? document.body 
  : 'no document.body server-side';

var defaultTicker = {
    element: body
  , clazz: 'ticker'
}

// may also contain options specific to the rendered line chart that depicts the rate over time 
var defaultRate = {
    interval :  2000
  , element  :  body
}

var defaultWritableGauge = {
    label   :  'writable'
  , size    :  150
  , element :  body
}

var defaultReadableGauge = {
    label   :  'readable'
  , size    :  150
  , element :  body
}

var defaultWritableState = {
    label      :  'Writable State'
  , properties :  undefined
  , element    :  body
}

var defaultReadableState = {
    label      :  'Readable State'
  , properties :  undefined
  , element    :  body
}

var proto = StreamViz.prototype;
function StreamViz (stream, opts) {
  if (!(this instanceof StreamViz)) return new StreamViz(stream, opts);

  this.stream = stream;
  this.streamReadableState =  stream._readableState
  this.streamWritableState =  stream._writableState

  // options
  opts               =  opts || {};
  this.rate          =  xtend(defaultRate, opts.rate);
  this.ticker        =  xtend(defaultTicker, opts.ticker);
  this.writableGauge =  xtend(defaultWritableGauge, opts.writableGauge);
  this.readableGauge =  xtend(defaultReadableGauge, opts.readableGauge);
  this.writableState =  xtend(defaultWritableState, opts.writableState);
  this.readableState =  xtend(defaultReadableState, opts.readableState);

  this._initStreamStateStreams(opts);

  if (this.streamWritableState) {
    this._initWritableBufferLenGauge();
    this._initWritableStateTabject();
  }

  if (this.streamReadableState) {
    this._initTicker();
    this._initChunkRateStream();
    this._initReadableBufferLenGauge();
    this._initReadableStateTabject();
  }
}

// stream state
proto._initStreamStateStreams = function (opts) {
  this.stateStreams = opts.stateStreams
    || getStateStreams(
          this.stream
        , { stateInterval: opts.stateInterval
          , readableStateProperties: this.readableState.properties
          , writableStateProperties: this.writableState.properties
        })
}

// Writable only
proto._initWritableBufferLenGauge = function () {
  this.stateStreams.writable.bufferLen
    .pipe(gauge(
        this.writableGauge.element
      , { label :  this.writableGauge.label
        , size  :  this.writableGauge.size
        , max   :  this.streamWritableState.highWaterMark
        }
    ))
}

proto._initWritableStateTabject = function () {
  this.stateStreams.writable.state
    .pipe(tabject(
        this.writableState.element
      , { tabject: { label: this.writableState.label } }
    ))
}

// Readable only
proto._initChunkRateStream = function () {
  this.chunkRateStream = chunkRate(
      this.stream
    , { interval: this.rate.interval 
  })
  this.chunkRateStream.pipe(lineChart(this.rate.element));
}

proto._initTicker = function () {
  this.stream
    .pipe(ticker(
        this.ticker.element
      , this.ticker
      , this.streamReadableState.objectMode
    ))
}

proto._initReadableBufferLenGauge = function () {
  this.stateStreams.readable.bufferLen
    .pipe(gauge(
        this.readableGauge.element
      , { label :  this.readableGauge.label
        , size  :  this.readableGauge.size
        , max   :  this.streamReadableState.highWaterMark
        }
    ))
}

proto._initReadableStateTabject = function () {
  this.stateStreams.readable.state
    .pipe(tabject(
        this.readableState.element
      , { tabject: { label: this.readableState.label } }
    ))
}
