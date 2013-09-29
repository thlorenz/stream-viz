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
  this._opts = opts;
}

NumberReadable.prototype._read = function () {
  var self = this;
  if (self.idx > self.to) return self.push(null);
  function push () { 
    self.push(self._opts.objectMode ? self.idx++ : '' + self.idx++); 
  }

  setTimeout(push, self.throttle);
}
