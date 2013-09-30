'use strict';

var stream = require('stream');
var util = require('util');

var Transform = stream.Transform;

module.exports = LoggingTransform;

util.inherits(LoggingTransform, Transform);

function LoggingTransform (objectMode) {
  if (!(this instanceof LoggingTransform)) return new LoggingTransform(opts);

  var opts = { objectMode: objectMode };
  
  Transform.call(this, opts);
}

LoggingTransform.prototype._transform = function (chunk, encoding, cb) {
  console.log(chunk);  
  cb();
};
