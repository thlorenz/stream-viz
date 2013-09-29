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
  this._throttle = opts.throttle || null;
}

TarpitWritable.prototype._write = function (chunk, encoding, cb) {
  if (this._debug) console.error('writing ', chunk);

  setTimeout(cb, this._throttle);
}
