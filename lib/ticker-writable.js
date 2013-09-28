'use strict';

var stream = require('stream')
  , util = require('util')
  , xtend = require('xtend')

var Writable = stream.Writable;

module.exports = TickerWritable;

function appendTickerSpan (el, opts) {
  var span = document.createElement('span');
  span.setAttribute('class', opts.clazz || 'ticker');
  el.appendChild(span);
  return span;
}

util.inherits(TickerWritable, Writable);

function TickerWritable (el, opts) {
  if (!(this instanceof TickerWritable)) return new TickerWritable(el, opts);

  opts = opts || {};

  this._tickerOpts = opts.ticker || {};
  this._el = appendTickerSpan(el, this._tickerOpts);
  // this._label = this._tickerOpts.label ? '<h2>' +  this._tickerOpts.label + '</h2>' : '';

  Writable.call(this, opts);
}

TickerWritable.prototype._write = function (chunk, encoding, cb) {
  this._el.innerHTML = chunk.toString();
  cb();
};
