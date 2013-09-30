'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = PluckWritableBufferLenTransform;

util.inherits(PluckWritableBufferLenTransform, Transform);

function PluckWritableBufferLenTransform (opts) {
  if (!(this instanceof PluckWritableBufferLenTransform)) return new PluckWritableBufferLenTransform(opts);

  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

PluckWritableBufferLenTransform.prototype._transform = function (chunk, encoding, cb) {
  this.push(chunk.writable.bufferLength);
  cb()
};
