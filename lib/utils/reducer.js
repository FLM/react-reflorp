'use strict';

exports.__esModule = true;
exports.reset = exports.decreaseCount = exports.increaseCount = exports.refreshing = exports.appendAllLists = exports.updateBatch = exports.updateMulti = exports.updateAllLists = exports.update = exports.remove = exports.create = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactRefetch = require('react-refetch');

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefix = 'reflorp/';

var reducer = function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case prefix + 'RESET':
      return {};
    case prefix + 'UPDATE':
      if (typeof action.data !== 'undefined') {
        var newState = (0, _extend2.default)(false, {}, state);
        newState[action.name] = action.data;

        return newState;
      }

      return state;
    case prefix + 'CREATE':
      if (typeof action.data !== 'undefined') {
        if (typeof state[action.name] === 'undefined') {
          var _newState = (0, _extend2.default)(false, {}, state);
          _newState[action.name] = action.data;

          return _newState;
        } else {
          var _newState2 = (0, _extend2.default)(true, {}, state);
          _newState2[action.name] = _reactRefetch.PromiseState.refresh(_newState2[action.name]);

          return _newState2;
        }
      }

      return state;
    case prefix + 'REMOVE':
      if (typeof state[action.name] !== 'undefined') {
        var _newState3 = (0, _extend2.default)(false, {}, state);
        delete _newState3[action.name];

        return _newState3;
      }

      return state;
    case prefix + 'UPDATE_MULTI':
      if (typeof action.data !== 'undefined') {
        var _ret = function () {
          var newState = (0, _extend2.default)(false, {}, state);
          Object.keys(action.data).forEach(function (hash) {
            newState[hash] = action.data[hash];
          });

          return {
            v: newState
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      return state;
    case prefix + 'UPDATE_BATCH':
      if (typeof action.data !== 'undefined') {
        var _ret2 = function () {
          var newState = (0, _extend2.default)(false, {}, state);
          Object.keys(action.data).forEach(function (hash) {
            newState = reducer(newState, action.data[hash]);
          });

          return {
            v: newState
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      }

      return state;
    case prefix + 'UPDATE_ALL_LISTS':
      if (typeof action.data !== 'undefined') {
        var _ret3 = function () {
          var newState = (0, _extend2.default)(false, {}, state);
          var entityName = action.entityName;
          var id = action.id;
          var parentId = action.parentId;
          var data = action.data;


          Object.keys(state).forEach(function (hash) {
            if (newState[hash] && newState[hash].value && newState[hash].value.map) {
              var parentMatch = parentId && hash.match(new RegExp('^' + entityName + '\-list\-' + parentId + '\-'));
              var regularMatch = !parentId && hash.match(new RegExp('^' + entityName + '\-list\-'));

              if (parentMatch || regularMatch) {
                (function () {
                  var extra = newState[hash + 'Extra'];
                  var newValue = newState[hash].value.map(function (item) {
                    if (item.id === id) {
                      var match = true;
                      Object.keys(extra).forEach(function (e) {
                        if (typeof data[e] !== 'undefined' && extra[e] != data[e]) {
                          match = false;
                        }
                      });

                      if (match) {
                        return data;
                      }

                      return false;
                    }

                    return item;
                  }).filter(function (item) {
                    return item !== false;
                  });

                  newState[hash] = _reactRefetch.PromiseState.resolve(newValue, newState[hash].meta);
                })();
              }
            }
          });

          return {
            v: newState
          };
        }();

        if ((typeof _ret3 === 'undefined' ? 'undefined' : _typeof(_ret3)) === "object") return _ret3.v;
      }

      return state;
    case prefix + 'APPEND_ALL_LISTS':
      if (typeof action.data !== 'undefined') {
        var _ret5 = function () {
          var newState = (0, _extend2.default)(false, {}, state);
          var entityName = action.entityName;
          var parentId = action.parentId;
          var data = action.data;


          Object.keys(state).forEach(function (hash) {
            if (newState[hash] && newState[hash].value && newState[hash].value.map) {
              var parentMatch = parentId && hash.match(new RegExp('^' + entityName + '\-list\-' + parentId + '\-'));
              var regularMatch = !parentId && hash.match(new RegExp('^' + entityName + '\-list\-'));

              if (parentMatch || regularMatch) {
                (function () {
                  var extra = newState[hash + 'Extra'];
                  var done = [];
                  var newValue = newState[hash].value.concat(data).filter(function (item) {
                    if (done.indexOf(item.id) === -1) {
                      var match = true;
                      Object.keys(extra).forEach(function (e) {
                        if (typeof item[e] !== 'undefined' && extra[e] != item[e]) {
                          match = false;
                        }
                      });
                      if (match) {
                        done.push(item.id);

                        return true;
                      }
                    }

                    return false;
                  });

                  newState[hash] = _reactRefetch.PromiseState.resolve(newValue, newState[hash].meta);
                })();
              }
            }
          });

          return {
            v: newState
          };
        }();

        if ((typeof _ret5 === 'undefined' ? 'undefined' : _typeof(_ret5)) === "object") return _ret5.v;
      }

      return state;
    case prefix + 'REFRESHING':
      if (state[action.name] && state[action.name].value) {
        var _newState4 = (0, _extend2.default)(true, {}, state);
        _newState4[action.name] = _reactRefetch.PromiseState.refresh(_newState4[action.name]);

        return _newState4;
      }

      return state;
    case prefix + 'INCREASE_COUNT':
      if (state[action.name] && state[action.name].value && state[action.name].value[action.key]) {
        var _newState5 = (0, _extend2.default)(true, {}, state);
        _newState5[action.name].value[action.key]++;

        return _newState5;
      }

      return state;
    case prefix + 'DECREASE_COUNT':
      if (state[action.name] && state[action.name].value && state[action.name].value[action.key]) {
        var _newState6 = (0, _extend2.default)(true, {}, state);
        _newState6[action.name].value[action.key]--;

        return _newState6;
      }

      return state;
    default:
      return state;
  }
};

exports.default = reducer;
var create = exports.create = function create(name, data) {
  return {
    type: prefix + 'CREATE',
    name: name,
    data: data
  };
};

var remove = exports.remove = function remove(name) {
  return {
    type: prefix + 'REMOVE',
    name: name
  };
};

var update = exports.update = function update(name, data) {
  return {
    type: prefix + 'UPDATE',
    name: name,
    data: data
  };
};

var updateAllLists = exports.updateAllLists = function updateAllLists(entityName, id, parentId, data) {
  return {
    type: prefix + 'UPDATE_ALL_LISTS',
    entityName: entityName,
    id: id,
    parentId: parentId,
    data: data
  };
};

var updateMulti = exports.updateMulti = function updateMulti(data) {
  return {
    type: prefix + 'UPDATE_MULTI',
    data: data
  };
};

var updateBatch = exports.updateBatch = function updateBatch(data) {
  return {
    type: prefix + 'UPDATE_BATCH',
    data: data
  };
};

var appendAllLists = exports.appendAllLists = function appendAllLists(entityName, parentId, data) {
  return {
    type: prefix + 'APPEND_ALL_LISTS',
    entityName: entityName,
    parentId: parentId,
    data: data
  };
};

var refreshing = exports.refreshing = function refreshing(name) {
  return {
    type: prefix + 'REFRESHING',
    name: name
  };
};

var increaseCount = exports.increaseCount = function increaseCount(name, key) {
  return {
    type: prefix + 'INCREASE_COUNT',
    name: name,
    key: key
  };
};

var decreaseCount = exports.decreaseCount = function decreaseCount(name, key) {
  return {
    type: prefix + 'DECREASE_COUNT',
    name: name,
    key: key
  };
};

var reset = exports.reset = function reset() {
  return {
    type: prefix + 'RESET'
  };
};