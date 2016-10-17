'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _reactRedux = require('react-redux');

var _reactRefetch = require('react-refetch');

var _reflorpRefetch = require('./reflorpRefetch');

var _getName = require('../utils/getName');

var _getName2 = _interopRequireDefault(_getName);

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (mappings) {
  for (var _len = arguments.length, restRedux = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    restRedux[_key - 1] = arguments[_key];
  }

  return _reactRedux.connect.apply(undefined, [function (state, props) {
    var entities = (0, _reflorpRefetch.getEntities)();
    Object.keys(entities).forEach(function (entity) {
      if (entities[entity].plural && !entities[entity].singular) {
        entities[entities[entity].plural] = (0, _extend2.default)(true, {}, entities[entity]);
        entities[entities[entity].plural].singular = entity;
      }
    });

    var entityMappings = mappings(state, props);
    var ret = entityMappings;

    Object.keys(entityMappings).forEach(function (entity) {
      var entityMapping = entityMappings[entity];
      if (!entityMappings[entity] || _typeof(entityMappings[entity]) !== _typeof({})) {
        entityMapping = {
          id: entityMapping
        };
      }

      var id = typeof entityMapping.id === 'undefined' ? false : entityMapping.id;
      var parentId = entityMapping.parentId || false;
      var then = entityMapping.then || function (value) {
        return value;
      };
      var extra = entityMapping.extra || {};
      var defaults = entityMapping.defaults || false;
      var pluralMatches = entity.match(/^(.+)$/);
      var createMatches = entity.match(/^(.+)Create$/);
      var originalMatches = entity.match(/^(.+)Original$/);
      var createResponseMatches = entity.match(/^(.+)CreateResponse$/);
      var editMatches = entity.match(/^(.+)Edit$/);
      var editDraftMatches = entity.match(/^(.+)EditDraft$/);
      var editResponseMatches = entity.match(/^(.+)EditResponse$/);
      var deleteMatches = entity.match(/^(.+)Delete$/);
      var deleteResponseMatches = entity.match(/^(.+)DeleteResponse$/);
      var loadMoreMatches = entity.match(/^(.+)LoadMore$/);

      // Single entity belonging to parent in editing mode (receives draft)
      if (entities[entity] && parentId && entityMapping.edit && entities[entity].plural !== entity) {
        ret[entity] = state.reflorp[(0, _getName2.default)(entity, id, parentId) + 'Draft'];

        // If id is 0 we are creating a new entity, so use default data as a fallback
        if (id == 0 && !ret[entity] && entities[entity]) {
          ret[entity] = _reactRefetch.PromiseState.resolve(defaults || entities[entity].defaults || { id: 0 });
        }
        // Single original entity belonging to parent
      } else if (originalMatches && entities[originalMatches[1]] && parentId) {
        ret[entity] = state.reflorp[(0, _getName2.default)(originalMatches[1], id, parentId)];
        // Single entity belonging to parent
      } else if (entities[entity] && parentId && entities[entity].plural !== entity) {
        ret[entity] = state.reflorp[(0, _getName2.default)(entity, id, parentId)];
        // Simple single entity in editing mode (receives draft)
      } else if (entities[entity] && entityMapping.edit && entities[entity].plural !== entity) {
        ret[entity] = state.reflorp[(0, _getName2.default)(entity, id) + 'Draft'];

        // If id is 0 we are creating a new entity, so use default data as a fallback
        if (id == 0 && !ret[entity] && entities[entity]) {
          ret[entity] = _reactRefetch.PromiseState.resolve(defaults || entities[entity].defaults || { id: 0 });
        }
        // Simple single original entity
      } else if (originalMatches && entities[originalMatches[1]] && entities[originalMatches[1]].plural !== originalMatches[1]) {
        ret[entity] = state.reflorp[(0, _getName2.default)(originalMatches[1], id)];
        // Simple single entity
      } else if (entities[entity] && entities[entity].plural !== entity) {
        ret[entity] = state.reflorp[(0, _getName2.default)(entity, id)];
        // List of entities
      } else if (pluralMatches && entities[pluralMatches[1]] && entities[pluralMatches[1]].singular) {
        var injectHash = (0, _getName2.default)(entities[pluralMatches[1]].singular, id, parentId, extra);
        ret[entity] = state.reflorp[injectHash];
        // Function for creating an entity
      } else if (createMatches && entities[createMatches[1]]) {
        ret[entity] = state.reflorp[entity];
        // Response to entity creation
      } else if (createResponseMatches && entities[createResponseMatches[1]]) {
        ret[entity] = state.reflorp[(0, _getName2.default)(createResponseMatches[1], '0', parentId) + 'CreateResponse'];
        // Function for editing an entity
      } else if (editMatches && entities[editMatches[1]]) {
        if (id == 0) {
          ret[entity] = function (data) {
            return state.reflorp[editMatches[1] + 'Create'](data, parentId);
          };
        } else {
          ret[entity] = state.reflorp[editMatches[1] + 'Edit'].bind(null, id, parentId);
        }
        // Function for editing the draft of an entity
      } else if (editDraftMatches && entities[editDraftMatches[1]]) {
        ret[entity] = state.reflorp[editDraftMatches[1] + 'EditDraft'].bind(null, id, parentId);
        // Response to entity edit
      } else if (editResponseMatches && entities[editResponseMatches[1]]) {
        ret[entity] = state.reflorp[(0, _getName2.default)(editResponseMatches[1], id, parentId) + 'EditResponse'];
        // Function for deleting an entity
      } else if (deleteMatches && entities[deleteMatches[1]]) {
        ret[entity] = state.reflorp[deleteMatches[1] + 'Delete'].bind(null, id, parentId);
        // Response to entity delete
      } else if (deleteResponseMatches && entities[deleteResponseMatches[1]]) {
        ret[entity] = state.reflorp[(0, _getName2.default)(deleteResponseMatches[1], id, parentId) + 'DeleteResponse'];
        // Function for loading next page of a list of entities
      } else if (loadMoreMatches) {
        var name = loadMoreMatches[1];
        if (entities[loadMoreMatches[1]].singular) {
          name = entities[loadMoreMatches[1]].singular;
        }
        var page = state.reflorp[(0, _getName2.default)(name, false, parentId, extra) + 'Page'] || 1;
        if (page === -1) {
          ret[entity] = false;
        } else {
          ret[entity] = state.reflorp[name + 'LoadMore'].bind(null, false, parentId, _extends({ page: page + 1 }, extra));
        }
      }

      if (ret[entity] && ret[entity].value) {
        ret[entity].value = then(ret[entity].value);
      }
      if (ret[entity] && ret[entity].value && entities[entity] && entities[entity].then) {
        ret[entity].value = entities[entity].then(ret[entity].value);
      }
    });

    return ret;
  }].concat(restRedux));
};