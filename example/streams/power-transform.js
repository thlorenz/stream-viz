'use strict';

var util      =  require('util')
  , stream    =  require('stream')
  , Transform =  stream.Transform
  ;

module.exports = PowerTransform;

util.inherits(PowerTransform, Transform);

function PowerTransform (opts) {
  if (!(this instanceof PowerTransform)) return new PowerTransform(opts);

  opts = opts || {};
  Transform.call(this, opts);
  this._throttle = opts.throttle;
  this._opts = opts;
}

PowerTransform.prototype._transform = function (chunk, encoding, cb) {
  var self = this;
  function respond () {
    var objectMode = false; self._opts.objectMode;
    var num = objectMode ? chunk : parseInt(chunk, 10)
      , pow = num * num

    self.push(objectMode ? pow : '' + pow)
    cb();
  }
  return this._throttle ? setTimeout(respond, this._throttle) : respond();
}
