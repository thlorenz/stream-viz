'use strict';

var stream = require('stream')
  , util = require('util')
  , tabject = require('tabject')
  , xtend = require('xtend')

var Writable = stream.Writable;

module.exports = TabjectWritable;

function wrapKey (k, valType) {
  return '<div style="white-space: pre;"' + valType + '"><span class="tabject-key">' + k + ':</span>';
}

function wrapValue (v, valType) {
  return '<span class="tabject-value ' + valType + '">' + v + '</div>';
}

function wrapInDiv (el, opts) {
  var div = document.createElement('div');
  div.setAttribute('class', opts.clazz || 'tabject');
  el.appendChild(div);
  return div;
}

var tabjectDefaults = { wrapKey: wrapKey, wrapValue: wrapValue };
var tableDefaults = { hsep: '    ' };

util.inherits(TabjectWritable, Writable);

function TabjectWritable (el, opts) {
  if (!(this instanceof TabjectWritable)) return new TabjectWritable(el, opts);

  opts = opts || {};
  opts.objectMode = true;

  this._tabjectOpts = xtend(tabjectDefaults, opts.tabject);
  this._tabjectOpts.table = xtend(tableDefaults, this._tabjectOpts.table);
  this._label = this._tabjectOpts.label ? '<h2>' +  this._tabjectOpts.label + '</h2>' : '';

  opts = opts || {};

  this._el = wrapInDiv(el, this._tabjectOpts);
  Writable.call(this, opts);
}

TabjectWritable.prototype._write = function (chunk, encoding, cb) {
  var s;
  try {
    s = tabject(chunk, this._tabjectOpts);
  } catch (err) {
    this._el.innerHTML= this._label + err.toString();
    return cb(err);
  }
  this._el.innerHTML = this._label + s;
  cb();
};
