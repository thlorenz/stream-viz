'use strict';

var util = require('util')
  , stream = require('stream')
  , Writable = stream.Writable

module.exports = TarpitWritable;

util.inherits(TarpitWritable, Writable);

function TarpitWritable (opts) {
  if (!(this instanceof TarpitWritable)) return new TarpitWritable(opts);
  Writable.call(this, opts);

  this._debug = opts.debug;
  this.throttle = opts.throttle || 0;
}

TarpitWritable.prototype._write = function (chunk, encoding, cb) {
  if (this._debug) console.error('writing ', chunk);

  setTimeout(cb, this.throttle);
}
