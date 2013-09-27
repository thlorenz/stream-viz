'use strict';

var tabject = require('tabject');
var stream = require('stream');
var util = require('util');

var Writable = stream.Writable;

module.exports = TabjectWritable;

util.inherits(TabjectWritable, Writable);

function TabjectWritable (el, opts) {
  if (!(this instanceof TabjectWritable)) return new TabjectWritable(el, opts);

  opts = opts || {};
  opts.objectMode = true;
  this._tabjectOpts = opts.tabject || {};
  this._tabjectOpts.hsep = ' :: ';
  this._el = el;
  Writable.call(this, opts);
}

TabjectWritable.prototype._write = function (chunk, encoding, cb) {
  var s;
  try {
    s = tabject(chunk, this._tabjectOpts);
  } catch (err) {
    this._el.innerHtml = err.toString();
    return cb(err);
  }
  this._el.innerText = s;
  cb();
};
