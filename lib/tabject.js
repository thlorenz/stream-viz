'use strict';

var tabject = require('./writables/tabject-writable')

var go = module.exports = function (el, opts) {
  return tabject(el, { tabject: opts }, true);
}
