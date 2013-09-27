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
}

PowerTransform.prototype._transform = function (chunk, encoding, cb) {
  var self = this;
  function respond () {
    var num = parseInt(chunk, 10);
    self.push('' + (num * num))
    cb();
  }
  return this._throttle ? setTimeout(respond, this._throttle) : respond();
}
