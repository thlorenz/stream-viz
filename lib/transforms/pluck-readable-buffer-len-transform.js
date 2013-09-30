'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = PluckReadableBufferLenTransform;

util.inherits(PluckReadableBufferLenTransform, Transform);

function PluckReadableBufferLenTransform (opts) {
  if (!(this instanceof PluckReadableBufferLenTransform)) return new PluckReadableBufferLenTransform(opts);

  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

PluckReadableBufferLenTransform.prototype._transform = function (chunk, encoding, cb) {
  this.push(chunk.readable.bufferLength);
  cb()
};
