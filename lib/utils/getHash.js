"use strict";

exports.__esModule = true;

exports.default = function (str) {
  var hash = 0;
  var i = void 0;
  var chr = void 0;
  var len = void 0;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};