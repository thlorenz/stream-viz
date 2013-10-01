'use strict';
/*jshint browser: true */

var qs = require('querystring');

exports.parse = function () {
  var query = window.location.search.substring(1);
  return qs.parse(query);
};

exports.stringify = function (obj) {
  return qs.stringify(obj);
};
