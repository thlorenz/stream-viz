'use strict';

var util = require('util')
  , stream = require('stream')
  , Readable = stream.Readable

module.exports = RandomNumberReadable;

util.inherits(RandomNumberReadable, Readable);

function RandomNumberReadable (opts) {
  if (!(this instanceof RandomNumberReadable)) return new RandomNumberReadable(opts);
  opts = opts || {};
  opts.objectMode = true;
  Readable.call(this, opts);

  this._min = opts.min || 0;
  this._max = opts.max || 100;
  this.throttle = opts.throttle;
}

RandomNumberReadable.prototype._read = function () {
  if (this.idx > this.to) return this.push(null);
  var push = function () { this.push(this._next()); }.bind(this);
  setTimeout(push, this.throttle);
}

RandomNumberReadable.prototype._next = function () {
  return Math.floor(Math.random() * (this._max - this._min + 1)) + this._min
}

// Test
if (typeof window === 'undefined' && !module.parent) {
  var numbers = new RandomNumberReadable();
  numbers
    .on('data', console.log)
    .on('end', function () { console.error('ended') })
}
