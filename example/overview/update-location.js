'use strict';

var query = require('./query');
var root = getRoot();

function getRoot() {
  var loc = window.location;
  return loc.protocol + '//' + loc.host + loc.pathname;
}

module.exports = function (throttles) {
  window.location = root + '?' + query.stringify(throttles);
}
