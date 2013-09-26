'use strict';

var util = require('util')
  , stream = require('stream')
  , Readable = stream.Readable

module.exports = NumberReadable;

util.inherits(NumberReadable, Readable);

function NumberReadable (opts) {
  if (!(this instanceof NumberReadable)) return new NumberReadable(opts);
  Readable.call(this, opts);
  this.idx = 0;
  this.to = opts.to;
  this.throttle = opts.throttle;
}

NumberReadable.prototype._read = function () {
  if (this.idx > this.to) return this.push(null);
  var push = function () { this.push('' + this.idx++); }.bind(this);
  setTimeout(push, this.throttle);
}

// Test
if (typeof window === 'undefined' && !module.parent) {
  var numbers = new NumberReadable({ to: 3 });
  numbers
    .on('data', console.log)
    .on('end', function () { console.error('ended') })
}
