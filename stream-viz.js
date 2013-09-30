'use strict';

var xtend = require('xtend')

// readables
var nebraska  =  require('nebraska')
  , chunkRate =  require('chunk-rate-readable')

// transforms
var pluckWritableBufferLen =  require('./lib/transforms/pluck-writable-buffer-len-transform')
  , pluckReadableBufferLen =  require('./lib/transforms/pluck-readable-buffer-len-transform')
  , pluckWritableState     =  require('./lib/transforms/pluck-writable-state-transform')
  , pluckReadableState     =  require('./lib/transforms/pluck-readable-state-transform')

module.exports = exports = StreamViz;

// renderers which are exposed separately for more customized use
var gauge     =  exports.gauge     =  require('./lib/gauge')
  , lineChart =  exports.lineChart =  require('./lib/line-chart')
  , tabject   =  exports.tabject   =  require('./lib/tabject')
  , ticker    =  exports.ticker    =  require('./lib/ticker')

var defaultReadableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'pipesCount'
  , 'flowing'
  , 'reading' 
  , 'objectMode'
]

var defaultWritableProps = [
    'highWaterMark'
  , 'bufferLength'
  , 'objectMode'
  , 'needDrain'
  , 'writing'
  , 'bufferProcessing'
  , 'writelen'
]

var defaultTicker = {
    element: document.body
  , clazz: 'ticker'
}

// may also contain options specific to the rendered line chart that depicts the rate over time 
var defaultRate = {
    interval :  2000
  , element  :  document.body
}

var defaultWritableGauge = {
    label   :  'writable'
  , size    :  150
  , element :  document.body
}

var defaultReadableGauge = {
    label   :  'readable'
  , size    :  150
  , element :  document.body
}

var defaultWritableState = {
    label      :  'Writable State'
  , properties :  defaultWritableProps
  , element    :  document.body
}

var defaultReadableState = {
    label      :  'Readable State'
  , properties :  defaultReadableProps
  , element    :  document.body
}

var proto = StreamViz.prototype;
function StreamViz (stream, opts) {
  if (!(this instanceof StreamViz)) return new StreamViz(stream, opts);

  this.stream = stream;
  this.streamReadableState =  stream._readableState
  this.streamWritableState =  stream._writableState

  // options
  opts               =  opts || {};
  this.stateInterval =  opts.stateInterval || 400;
  this.rate          =  xtend(defaultRate, opts.rate);
  this.ticker        =  xtend(defaultTicker, opts.ticker);
  this.writableGauge =  xtend(defaultWritableGauge, opts.writableGauge);
  this.readableGauge =  xtend(defaultReadableGauge, opts.readableGauge);
  this.writableState =  xtend(defaultWritableState, opts.writableState);
  this.readableState =  xtend(defaultReadableState, opts.readableState);

  this._initStreamStateStream();

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
proto._initStreamStateStream = function () {
  this.streamStateStream = nebraska(this.stream, { 
      interval: this.stateInterval
    , readable: this.readableState.properties 
    , writable: this.writableState.properties 
  })
}

// Writable only
proto._initWritableBufferLenGauge = function () {
  this.writableBufferLenStream = this.streamStateStream.pipe(pluckWritableBufferLen())
  this.writableBufferLenStream
    .pipe(gauge(
        this.writableGauge.element
      , { label :  this.writableGauge.label
        , size  :  this.writableGauge.size
        , max   :  this.streamWritableState.highWaterMark
        }
      , true
    ))
}

proto._initWritableStateTabject = function () {
  this.writableStateStream = this.streamStateStream.pipe(pluckWritableState())
  this.writableStateStream
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
  this.readableBufferLenStream = this.streamStateStream.pipe(pluckReadableBufferLen())
  this.readableBufferLenStream
    .pipe(gauge(
        this.readableGauge.element
      , { label :  this.readableGauge.label
        , size  :  this.readableGauge.size
        , max   :  this.streamReadableState.highWaterMark
        }
      , true
    ))
}

proto._initReadableStateTabject = function () {
  this.readableStateStream = this.streamStateStream.pipe(pluckReadableState())
  this.readableStateStream
    .pipe(tabject(
        this.readableState.element
      , { tabject: { label: this.readableState.label } }
    ))
}
