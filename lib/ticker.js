'use strict';

var ticker = require('./writables/ticker-writable')

var go = module.exports = function(el, opts, objectMode) {
  return ticker(el, { ticker: opts, objectMode: objectMode });
}
