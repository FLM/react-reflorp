'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _getUrl = require('./getUrl');

var _getUrl2 = _interopRequireDefault(_getUrl);

var _getHash = require('./getHash');

var _getHash2 = _interopRequireDefault(_getHash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (entity, id, parentId, extra) {
  for (var _len = arguments.length, args = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
    args[_key - 4] = arguments[_key];
  }

  var newExtra = _extends({}, extra);

  if (newExtra.page) {
    delete newExtra.page;
  }

  var url = _getUrl2.default.apply(undefined, [entity, id, parentId, newExtra].concat(args));

  if (id === false) {
    if (parentId === false) {
      return entity + '-list-' + (0, _getHash2.default)(url);
    } else {
      return entity + '-list-' + parentId + '-' + (0, _getHash2.default)(url);
    }
  }

  return entity + '-' + (0, _getHash2.default)(url);
};