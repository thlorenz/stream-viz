'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = LoggerTransform;

util.inherits(LoggerTransform, Transform);

function LoggerTransform (objectMode) {
  if (!(this instanceof LoggerTransform)) return new LoggerTransform(objectMode);

  var opts = { objectMode: objectMode };
  
  Transform.call(this, opts);
}

LoggerTransform.prototype._transform = function (chunk, encoding, cb) {
  console.log(chunk);  
  this.push(chunk);
  cb();
};
