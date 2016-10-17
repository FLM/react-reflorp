'use strict';

exports.__esModule = true;
exports.getBaseUrl = exports.setBaseUrl = exports.getStore = exports.getEntities = exports.setStore = exports.setEntities = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactRefetch = require('react-refetch');

var _reducer = require('../utils/reducer');

var _getUrl = require('../utils/getUrl');

var _getUrl2 = _interopRequireDefault(_getUrl);

var _getName = require('../utils/getName');

var _getName2 = _interopRequireDefault(_getName);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _buildRequest2 = require('react-refetch/lib/utils/buildRequest');

var _buildRequest3 = _interopRequireDefault(_buildRequest2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var entities = {};
var store = {};
var baseUrl = '';

var setEntities = exports.setEntities = function setEntities(newEntities) {
  entities = newEntities;
};
var setStore = exports.setStore = function setStore(newStore) {
  store = newStore;
};
var getEntities = exports.getEntities = function getEntities() {
  return entities;
};
var getStore = exports.getStore = function getStore() {
  return store;
};
var setBaseUrl = exports.setBaseUrl = function setBaseUrl(newBaseUrl) {
  baseUrl = newBaseUrl;
};
var getBaseUrl = exports.getBaseUrl = function getBaseUrl() {
  return baseUrl;
};

exports.default = function (mapStateToProps) {
  return (0, _reactRefetch.connect)(function (props, context) {
    var realMapStateToProps = mapStateToProps(props, context);
    Object.keys(entities).forEach(function (entity) {
      if (entities[entity].plural && !entities[entity].singular) {
        entities[entities[entity].plural] = (0, _extend2.default)(true, {}, entities[entity]);
        entities[entities[entity].plural].singular = entity;
      }
    });

    Object.keys(realMapStateToProps).forEach(function (key) {
      var realMapConfig = realMapStateToProps[key];
      if ((typeof realMapConfig === 'undefined' ? 'undefined' : _typeof(realMapConfig)) !== _typeof({})) {
        realMapConfig = {
          id: realMapConfig
        };
      }
      var realId = realMapConfig.id || false;
      var parentId = realMapConfig.parentId || false;
      var extra = realMapConfig.extra || {};

      var pluralMatches = key.match(/^(.+)$/);
      var createMatches = key.match(/^(.+)Create$/);
      var editMatches = key.match(/^(.+)Edit$/);
      var editDraftMatches = key.match(/^(.+)EditDraft$/);
      var deleteMatches = key.match(/^(.+)Delete/);
      var loadMoreMatches = key.match(/^(.+)LoadMore$/);

      // Single entity
      if (entities[key] && !entities[key].singular) {
        (function () {
          var hashedName = (0, _getName2.default)(key, realId, parentId);

          var url = (0, _getUrl2.default)(key, realId, parentId);
          realMapStateToProps[key] = {
            url: url,
            comparison: url,
            buildRequest: function buildRequest(mapping) {
              store.dispatch((0, _reducer.create)(hashedName, _reactRefetch.PromiseState.create()));
              store.dispatch((0, _reducer.create)(hashedName + 'Draft', _reactRefetch.PromiseState.create()));

              return (0, _buildRequest3.default)(mapping);
            },
            then: function then(value) {
              store.dispatch((0, _reducer.update)(hashedName, _reactRefetch.PromiseState.resolve(value)));

              var draft = _reactRefetch.PromiseState.resolve(value);
              draft.saved = true;
              store.dispatch((0, _reducer.update)(hashedName + 'Draft', draft));

              return {
                value: value,
                comparison: url,
                force: true
              };
            },
            catch: function _catch(reason, meta) {
              store.dispatch((0, _reducer.update)(hashedName, _reactRefetch.PromiseState.reject(meta.response.statusText)));

              return {
                value: null,
                comparison: url,
                force: true
              };
            }
          };
          // List of entities
        })();
      } else if (pluralMatches && entities[pluralMatches[1]] && entities[pluralMatches[1]].singular) {
        (function () {
          var entityName = entities[pluralMatches[1]].singular;
          var hashedName = (0, _getName2.default)(entityName, realId, parentId, extra);

          var url = (0, _getUrl2.default)(entityName, realId, parentId, extra);
          realMapStateToProps[key] = {
            url: url,
            comparison: url,
            buildRequest: function buildRequest(mapping) {
              store.dispatch((0, _reducer.create)(hashedName, _reactRefetch.PromiseState.create()));
              store.dispatch((0, _reducer.update)(hashedName + 'Page', 1));
              store.dispatch((0, _reducer.update)(hashedName + 'Extra', extra));

              return (0, _buildRequest3.default)(mapping);
            },
            then: function then(value) {
              var updates = {};
              value.forEach(function (item) {
                var itemHash = (0, _getName2.default)(entityName, item.id, parentId);
                updates[itemHash] = _reactRefetch.PromiseState.resolve(item);

                var draft = _reactRefetch.PromiseState.resolve(item);
                draft.saved = true;
                updates[itemHash + 'Draft'] = draft;
              });

              store.dispatch((0, _reducer.updateMulti)(updates));
              store.dispatch((0, _reducer.update)(hashedName, _reactRefetch.PromiseState.resolve(value)));

              return {
                value: value,
                force: true,
                comparison: url
              };
            },
            catch: function _catch(reason, meta) {
              store.dispatch((0, _reducer.update)(hashedName, _reactRefetch.PromiseState.reject(meta.response.statusText)));

              return {
                value: null,
                force: true,
                comparison: url
              };
            }
          };
          // Create entity
        })();
      } else if (createMatches) {
        (function () {
          var entityName = createMatches[1];
          var entityConfiguration = entities[entityName];
          if (entityConfiguration) {
            realMapStateToProps[key] = function (data) {
              var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              var url = void 0;
              var hash = void 0;
              if (entityConfiguration.parent && parentId) {
                url = (0, _getUrl2.default)(entityName, false, parentId);
                hash = (0, _getName2.default)(entityName, '0', parentId);
              } else {
                url = (0, _getUrl2.default)(entityName);
                hash = (0, _getName2.default)(entityName, '0');
              }

              var ret = {};

              // Reset errors if called with data = false
              if (data === false) {
                store.dispatch((0, _reducer.update)(hash + 'CreateResponse', null));

                return ret;
              }

              ret[hash + 'CreateResponse'] = {
                url: url,
                comparison: url,
                method: 'POST',
                body: JSON.stringify(data),
                force: true,
                buildRequest: function buildRequest(mapping) {
                  store.dispatch((0, _reducer.update)(hash + 'CreateResponse', _reactRefetch.PromiseState.create()));

                  return (0, _buildRequest3.default)(mapping);
                },
                then: function then(value) {
                  var multi = [];
                  multi.push((0, _reducer.update)(hash + 'CreateResponse', _reactRefetch.PromiseState.resolve(value)));

                  var singleHash = (0, _getName2.default)(entityName, value.id, parentId);
                  multi.push((0, _reducer.update)(singleHash, _reactRefetch.PromiseState.resolve(value)));

                  var draft = _reactRefetch.PromiseState.resolve(value);
                  draft.saved = true;
                  multi.push((0, _reducer.update)(singleHash + 'Draft', draft));

                  multi.push((0, _reducer.appendAllLists)(entityName, parentId, [value]));

                  if (entityConfiguration.count) {
                    var parentHash = (0, _getName2.default)(entityConfiguration.parent, parentId);
                    multi.push((0, _reducer.increaseCount)(parentHash, entityConfiguration.count));
                  }

                  // There may be a draft here with id = 0, so remove it
                  if (parentId) {
                    multi.push((0, _reducer.remove)((0, _getName2.default)(entityName, '0', parentId) + 'Draft'));
                  } else {
                    multi.push((0, _reducer.remove)((0, _getName2.default)(entityName, '0') + 'Draft'));
                  }

                  store.dispatch((0, _reducer.updateBatch)(multi));

                  return {
                    value: value,
                    comparison: url,
                    force: true,
                    andThen: function andThen(newData) {
                      if (entityConfiguration.onCreate) {
                        entityConfiguration.onCreate(newData);
                      }

                      return {};
                    }
                  };
                },
                catch: function _catch(exception) {
                  store.dispatch((0, _reducer.update)(hash + 'CreateResponse', _reactRefetch.PromiseState.reject({
                    message: exception.cause.error
                  })));

                  return {
                    value: null,
                    comparison: url,
                    force: true
                  };
                }
              };

              return ret;
            };
          }
          // Edit entity
        })();
      } else if (editMatches) {
        (function () {
          var entityName = editMatches[1];
          var entityConfiguration = entities[entityName];
          if (entityConfiguration) {
            realMapStateToProps[key] = function (id) {
              var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              var data = arguments[2];

              var url = void 0;
              var hash = void 0;
              var listHash = void 0;

              if (entityConfiguration.parent && parentId) {
                url = (0, _getUrl2.default)(entityName, id, parentId);
                hash = (0, _getName2.default)(entityName, id, parentId);
                listHash = (0, _getName2.default)(entityName, false, parentId);
              } else {
                url = (0, _getUrl2.default)(entityName, id);
                hash = (0, _getName2.default)(entityName, id);
              }

              var ret = {};

              // Reset errors if called with data = false
              if (data === false) {
                store.dispatch((0, _reducer.update)(hash + 'EditResponse', null));

                return ret;
              }

              ret[hash + 'EditResponse'] = {
                url: url,
                comparison: url,
                method: 'PATCH',
                body: JSON.stringify(data),
                force: true,
                buildRequest: function buildRequest(mapping) {
                  store.dispatch((0, _reducer.update)(hash + 'EditResponse', _reactRefetch.PromiseState.create()));

                  return (0, _buildRequest3.default)(mapping);
                },
                then: function then(value) {
                  store.dispatch((0, _reducer.update)(hash + 'EditResponse', _reactRefetch.PromiseState.resolve(value)));
                  store.dispatch((0, _reducer.update)(hash, _reactRefetch.PromiseState.resolve(value)));

                  var draft = _reactRefetch.PromiseState.resolve(value);
                  draft.saved = true;
                  store.dispatch((0, _reducer.update)(hash + 'Draft', draft));

                  if (listHash) {
                    store.dispatch((0, _reducer.updateAllLists)(entityName, id, parentId, value));
                  }

                  return {
                    value: value,
                    comparison: url,
                    force: true,
                    andThen: function andThen(newData) {
                      if (entityConfiguration.onEdit) {
                        entityConfiguration.onEdit(newData);
                      }

                      return {};
                    }
                  };
                },
                catch: function _catch(exception) {
                  store.dispatch((0, _reducer.update)(hash + 'EditResponse', _reactRefetch.PromiseState.reject({
                    message: exception.cause.error
                  })));

                  return {
                    value: null,
                    comparison: url,
                    force: true
                  };
                }
              };

              return ret;
            };
          }
          // Edit entity draft
        })();
      } else if (editDraftMatches) {
        (function () {
          var entityName = editDraftMatches[1];
          var entityConfiguration = entities[entityName];
          if (entityConfiguration) {
            realMapStateToProps[key] = function (id) {
              var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              var data = arguments[2];

              var hash = void 0;

              if (entityConfiguration.parent && parentId) {
                hash = (0, _getName2.default)(entityName, id, parentId);
              } else {
                hash = (0, _getName2.default)(entityName, id);
              }

              var draft = _reactRefetch.PromiseState.resolve(data);
              draft.saved = false;
              store.dispatch((0, _reducer.update)(hash + 'Draft', draft));

              return {};
            };
          }
          // Delete entity
        })();
      } else if (deleteMatches) {
        (function () {
          var entityName = deleteMatches[1];
          var entityConfiguration = entities[entityName];
          if (entityConfiguration) {
            realMapStateToProps[key] = function (id) {
              var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

              var url = void 0;
              var hash = void 0;
              var listHash = void 0;

              if (entityConfiguration.parent && parentId) {
                url = (0, _getUrl2.default)(entityName, id, parentId);
                hash = (0, _getName2.default)(entityName, id, parentId);
                listHash = (0, _getName2.default)(entityName, false, parentId);
              } else {
                url = (0, _getUrl2.default)(entityName, id);
                hash = (0, _getName2.default)(entityName, id);
              }

              var ret = {};

              ret[hash + 'DeleteResponse'] = {
                url: url,
                comparison: url,
                method: 'DELETE',
                force: true,
                buildRequest: function buildRequest(mapping) {
                  store.dispatch((0, _reducer.update)(hash + 'DeleteResponse', _reactRefetch.PromiseState.create()));

                  return (0, _buildRequest3.default)(mapping);
                },
                then: function then(value) {
                  if (listHash) {
                    store.dispatch((0, _reducer.updateAllLists)(entityName, id, parentId, false));
                  }

                  store.dispatch((0, _reducer.update)(hash + 'DeleteResponse', _reactRefetch.PromiseState.resolve(null)));

                  store.dispatch((0, _reducer.update)(hash, _reactRefetch.PromiseState.resolve(null)));
                  store.dispatch((0, _reducer.update)(hash + 'Draft', _reactRefetch.PromiseState.resolve(null)));

                  if (entityConfiguration.count) {
                    var parentHash = (0, _getName2.default)(entityConfiguration.parent, parentId);
                    store.dispatch((0, _reducer.decreaseCount)(parentHash, entityConfiguration.count));
                  }

                  return {
                    value: value,
                    comparison: url,
                    force: true,
                    andThen: function andThen(newData) {
                      if (entityConfiguration.onDelete) {
                        entityConfiguration.onDelete(newData);
                      }

                      return {};
                    }
                  };
                },
                catch: function _catch(exception) {
                  store.dispatch((0, _reducer.update)(hash + 'DeleteResponse', _reactRefetch.PromiseState.reject({
                    message: exception.cause.error
                  })));

                  return {
                    comparison: url,
                    force: true,
                    value: null
                  };
                }
              };

              return ret;
            };
          }
          // Load more entities
        })();
      } else if (loadMoreMatches) {
        (function () {
          var entityName = loadMoreMatches[1];
          if (entities[entityName] && entities[entityName].singular) {
            entityName = entities[entityName].singular;
          }
          var entityConfiguration = entities[entityName];
          if (entityConfiguration) {
            realMapStateToProps[key] = function (id) {
              var parentId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
              var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { page: 1 };

              var url = void 0;
              var hash = void 0;
              if (entityConfiguration.parent && parentId) {
                url = (0, _getUrl2.default)(entityName, id, parentId, extra);
                hash = (0, _getName2.default)(entityName, id, parentId);
              } else {
                url = (0, _getUrl2.default)(entityName, id, false, extra);
                hash = (0, _getName2.default)(entityName, id, false);
              }

              var ret = {};

              ret[hash] = {
                url: url,
                comparison: url,
                force: true,
                refreshing: true,
                buildRequest: function buildRequest(mapping) {
                  store.dispatch((0, _reducer.refreshing)(hash));
                  store.dispatch((0, _reducer.update)(hash + 'Page', extra.page));

                  return (0, _buildRequest3.default)(mapping);
                },
                then: function then(value) {
                  var updates = {};
                  value.forEach(function (item) {
                    var itemHash = (0, _getName2.default)(entityName, item.id, parentId);
                    updates[itemHash] = _reactRefetch.PromiseState.resolve(item);

                    var draft = _reactRefetch.PromiseState.resolve(item);
                    draft.saved = true;
                    updates[itemHash + 'Draft'] = draft;
                  });

                  if (value.length === 0) {
                    updates[hash + 'Page'] = -1;
                  }

                  store.dispatch((0, _reducer.updateMulti)(updates));

                  store.dispatch((0, _reducer.appendAllLists)(entityName, parentId, value));

                  return {
                    value: value,
                    comparison: url,
                    force: true
                  };
                }
              };

              return ret;
            };
          }
        })();
      }

      Object.keys(realMapConfig).forEach(function (config) {
        if (config !== 'id') {
          realMapStateToProps[key][config] = realMapConfig[config];
        }
      });
    });

    return realMapStateToProps;
  });
};