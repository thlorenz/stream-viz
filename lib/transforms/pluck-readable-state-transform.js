'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = PluckReadableStateTransform;

util.inherits(PluckReadableStateTransform, Transform);

function PluckReadableStateTransform (opts) {
  if (!(this instanceof PluckReadableStateTransform)) return new PluckReadableStateTransform(opts);

  opts = opts || {};
  opts.objectMode = true;
  Transform.call(this, opts);
}

PluckReadableStateTransform.prototype._transform = function (chunk, encoding, cb) {
  this.push(chunk.readable);
  cb()
};
