'use strict';

exports.__esModule = true;

var _reflorpRefetch = require('../components/reflorpRefetch');

var getUrl = function getUrl(entity) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var parentId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var first = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

  var entities = (0, _reflorpRefetch.getEntities)();

  if (!entities[entity]) {
    return false;
  }

  var entityConfiguration = entities[entity];
  var url = '';

  if (entityConfiguration.parent && parentId) {
    url += getUrl(entityConfiguration.parent, parentId, false, {}, false) + '/';
  } else {
    url += '/';
  }

  if (entityConfiguration.plural) {
    url += entityConfiguration.plural;
  } else {
    url += entity + 's';
  }

  if (id) {
    url += '/' + id;
  }

  if (Object.keys(extra).length > 0) {
    url += '?';
    Object.keys(extra).forEach(function (k) {
      url += k + '=' + extra[k] + '&';
    });
  }

  if (first) {
    url = (0, _reflorpRefetch.getBaseUrl)() + url;
  }

  return url;
};

exports.default = getUrl;