'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = PluckWritableStateTransform;

util.inherits(PluckWritableStateTransform, Transform);

function PluckWritableStateTransform (opts) {
  if (!(this instanceof PluckWritableStateTransform)) return new PluckWritableStateTransform(opts);

  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

PluckWritableStateTransform.prototype._transform = function (chunk, encoding, cb) {
  this.push(chunk.writable);
  cb()
};
