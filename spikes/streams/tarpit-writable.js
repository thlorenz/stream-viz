'use strict';

var util = require('util')
  , stream = require('stream')
  , Writable = stream.Writable

module.exports = TarpitWritable;

util.inherits(TarpitWritable, Writable);

function TarpitWritable (opts) {
  if (!(this instanceof TarpitWritable)) return new TarpitWritable(opts);
  Writable.call(this, opts);

  this.debug = opts.debug;
  // could be useful to test buffer length output over time
  this.interval = opts.interval || null;
}

TarpitWritable.prototype._write = function (chunk, encoding, cb) {
  if (this.debug) console.error('writing ', chunk);

  setTimeout(cb, this.interval);
}
