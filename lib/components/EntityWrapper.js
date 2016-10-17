'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dec, _dec2, _class, _class2, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRefetch = require('react-refetch');

var _reflorpRedux = require('./reflorpRedux');

var _reflorpRedux2 = _interopRequireDefault(_reflorpRedux);

var _reflorpRefetch = require('./reflorpRefetch');

var _reflorpRefetch2 = _interopRequireDefault(_reflorpRefetch);

var _lodash = require('lodash.debounce');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EntityWrapper = (_dec = (0, _reflorpRefetch2.default)(function (props) {
  var mapping = {};
  var entityList = props.entities || {};
  if (props.entity) {
    entityList[props.entity] = { id: props.id, parentId: props.parentId, load: props.load, edit: props.edit, extra: props.extra };
  }

  Object.keys(entityList).forEach(function (entity) {
    var entityData = entityList[entity];
    if (entityData.load) {
      mapping[entity] = { id: entityData.id, parentId: entityData.parentId, extra: entityData.extra };
    }
  });

  return mapping;
}), _dec2 = (0, _reflorpRedux2.default)(function (state, props) {
  var mapping = {};
  var entityList = props.entities || {};
  if (props.entity) {
    entityList[props.entity] = { id: props.id, parentId: props.parentId, edit: props.edit, create: props.create, extra: props.extra, defaults: props.defaults };
  }

  Object.keys(entityList).forEach(function (entity) {
    var entityData = entityList[entity];

    if (entityData.create) {
      entityData.id = '0';
    }

    if (entityData.edit !== false) {
      mapping[entity] = { id: entityData.id, parentId: entityData.parentId, edit: true, extra: entityData.extra, defaults: entityData.defaults };
      mapping[entity + 'Original'] = { id: entityData.id, parentId: entityData.parentId, extra: entityData.extra, defaults: entityData.defaults };
      mapping[entity + 'Edit'] = { id: entityData.id, parentId: entityData.parentId };
      mapping[entity + 'EditDraft'] = { id: entityData.id, parentId: entityData.parentId };
      mapping[entity + 'EditResponse'] = { id: entityData.id, parentId: entityData.parentId };
      mapping[entity + 'Delete'] = { id: entityData.id, parentId: entityData.parentId };
      mapping[entity + 'DeleteResponse'] = { id: entityData.id, parentId: entityData.parentId };
    } else {
      mapping[entity] = { id: entityData.id, parentId: entityData.parentId, then: entityData.then, extra: entityData.extra, defaults: entityData.defaults };
      mapping[entity + 'Original'] = { id: entityData.id, parentId: entityData.parentId, then: entityData.then, extra: entityData.extra, defaults: entityData.defaults };
    }
    if (entityData.create) {
      mapping[entity + 'Create'] = true;
      mapping[entity + 'CreateResponse'] = { id: entityData.id, parentId: entityData.parentId };
    }
    if (!entityData.id) {
      mapping[entity + 'LoadMore'] = { id: entityData.id || false, parentId: entityData.parentId || false, extra: entityData.extra };
      mapping[entity + 'LoadMoreResponse'] = { id: entityData.id || false, parentId: entityData.parentId || false, extra: entityData.extra };
    }
  });

  return mapping;
}), _dec(_class = _dec2(_class = (_temp = _class2 = function (_Component) {
  _inherits(EntityWrapper, _Component);

  function EntityWrapper() {
    _classCallCheck(this, EntityWrapper);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this.state = {
      created: {},
      edited: {},
      deleted: {}
    };
    return _this;
  }

  EntityWrapper.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this2 = this;

    var onCreate = nextProps.onCreate;
    var onEdit = nextProps.onEdit;
    var onDelete = nextProps.onDelete;
    var entity = nextProps.entity;
    var entities = nextProps.entities;
    var id = nextProps.id;
    var parentId = nextProps.parentId;
    var _state = this.state;
    var edited = _state.edited;
    var deleted = _state.deleted;
    var created = _state.created;


    var entityList = entities || {};
    if (entity) {
      entityList[entity] = { id: id, parentId: parentId };
    }

    Object.keys(entityList).forEach(function (entityKey) {
      var createResponse = nextProps[entityKey + 'CreateResponse'];
      var editResponse = nextProps[entityKey + 'EditResponse'];
      var deleteResponse = nextProps[entityKey + 'DeleteResponse'];

      if (createResponse) {
        if (createResponse.fulfilled) {
          if (onCreate && !created[entityKey]) {
            (function () {
              var newCreated = _extends({}, created);
              var value = createResponse.value;
              newCreated[entityKey] = true;
              _this2.setState({
                created: newCreated
              }, function () {
                return onCreate(value);
              });
            })();
          }
        } else {
          var _newCreated = _extends({}, created);
          delete _newCreated[entityKey];
          _this2.setState({
            created: _newCreated
          });
        }
      }

      if (editResponse) {
        if (editResponse.fulfilled) {
          if (onEdit && !edited[entityKey]) {
            (function () {
              var newEdited = _extends({}, edited);
              var value = editResponse.value;
              newEdited[entityKey] = true;
              _this2.setState({
                edited: newEdited
              }, function () {
                return onEdit(value);
              });
            })();
          }
        } else {
          var _newEdited = _extends({}, edited);
          delete _newEdited[entityKey];
          _this2.setState({
            edited: _newEdited
          });
        }
      }

      if (deleteResponse) {
        if (deleteResponse.fulfilled) {
          if (onDelete && !deleted[entityKey]) {
            (function () {
              var newDeleted = _extends({}, deleted);
              var value = entityList[entityKey];
              newDeleted[entityKey] = true;
              _this2.setState({
                deleted: newDeleted
              }, function () {
                return onDelete(value);
              });
            })();
          }
        } else {
          var _newDeleted = _extends({}, deleted);
          delete _newDeleted[entityKey];
          _this2.setState({
            deleted: _newDeleted
          });
        }
      }
    });
  };

  EntityWrapper.prototype.render = function render() {
    var _this3 = this;

    var _props = this.props;
    var children = _props.children;
    var entity = _props.entity;
    var entities = _props.entities;
    var id = _props.id;
    var parentId = _props.parentId;
    var className = _props.className;
    var hideUntilLoaded = _props.hideUntilLoaded;


    var entityList = entities || {};
    if (entity) {
      entityList[entity] = { id: id, parentId: parentId };
    }

    var datas = {};
    var saved = {};
    var loadMores = {};
    var loadMoreResponses = {};
    var edits = {};
    var editDrafts = {};
    var deletes = {};
    var responses = [];
    var dataResponses = [];
    var createResponses = [];
    var deleteResponses = [];
    var editResponses = [];

    var debounces = [];

    var flush = function flush() {
      debounces.forEach(function (d) {
        if (d.flush) {
          d.flush();
        }
      });
    };

    Object.keys(entityList).forEach(function (entityKey) {
      var createResponse = _this3.props[entityKey + 'CreateResponse'];
      var editResponse = _this3.props[entityKey + 'EditResponse'];
      var deleteResponse = _this3.props[entityKey + 'DeleteResponse'];
      var data = _this3.props[entityKey];

      if (data) {
        datas[entityKey] = data.value;
        saved[entityKey] = data.saved;
        responses.push(data);
        dataResponses.push(data);
      }

      if (_this3.props[entityKey + 'LoadMore']) {
        loadMores[entityKey] = _this3.props[entityKey + 'LoadMore'];
        var loadMoreResponse = _this3.props[entityKey + 'LoadMoreResponse'];
        if (loadMoreResponse) {
          loadMoreResponses[entityKey] = loadMoreResponse;
          responses.push(loadMoreResponse);
        }
      }
      if (_this3.props[entityKey + 'Edit']) {
        if (_this3.props[entityKey + 'Original']) {
          datas[entityKey + 'Original'] = _this3.props[entityKey + 'Original'].value;
        }
        edits[entityKey] = function () {
          var _props2;

          flush();return (_props2 = _this3.props)[entityKey + 'Edit'].apply(_props2, arguments);
        };
        editDrafts[entityKey] = function () {
          var _props3;

          flush();return (_props3 = _this3.props)[entityKey + 'EditDraft'].apply(_props3, arguments);
        };
        deletes[entityKey] = _this3.props[entityKey + 'Delete'];
      }
      if (createResponse) {
        createResponses.push(createResponse);
        responses.push(createResponse);
      }
      if (editResponse) {
        editResponses.push(editResponse);
        responses.push(editResponse);
      }
      if (deleteResponse) {
        deleteResponses.push(deleteResponse);
        responses.push(deleteResponse);
      }
    });

    var allResponses = _reactRefetch.PromiseState.all(responses);
    var dataResponsesPs = _reactRefetch.PromiseState.all(dataResponses);
    var error = allResponses && allResponses.rejected ? allResponses.reason ? allResponses.reason.message : 'Unknown error' : '';

    if (!children) {
      return null;
    }

    var childProps = {
      data: entity ? datas[entity] : datas,
      saved: entity ? saved[entity] : saved,
      error: error,
      loading: allResponses && (allResponses.pending || allResponses.refreshing) ? true : false,
      hasData: dataResponsesPs && dataResponsesPs.fulfilled ? true : false
    };

    if (entity) {
      childProps.doLoadMore = loadMores[entity];
      childProps.doEdit = edits[entity];
      childProps.doEditDraft = editDrafts[entity];
      childProps.doDelete = deletes[entity];
    } else {
      childProps.doLoadMore = loadMores;
      childProps.doEdit = edits;
      childProps.doEditDraft = editDrafts;
      childProps.doDelete = deletes;
    }
    childProps.loadMoreResponse = loadMoreResponses ? _reactRefetch.PromiseState.all(loadMoreResponses) : false;
    childProps.deleteResponse = deleteResponses ? _reactRefetch.PromiseState.all(deleteResponses) : false;
    childProps.editResponse = editResponses ? _reactRefetch.PromiseState.all(editResponses) : false;

    childProps.saveAll = function () {
      Object.keys(edits).forEach(function (entityKey) {
        edits[entityKey](datas[entityKey]);
      });
    };

    childProps.handleChange = function (e) {
      var name = void 0;
      var value = void 0;
      if (e.target) {
        name = e.target.name;

        if (e.target.type === 'checkbox') {
          value = !!e.target.checked;
        } else {
          value = e.target.value;
        }
      } else {
        name = e.name;
        value = e.value;
      }

      if (name) {
        if (name.indexOf('.') !== -1) {
          var _name$split = name.split('.');

          var myEntity = _name$split[0];
          var field = _name$split[1];
          var field2 = _name$split[2];

          var newData = _extends({}, datas[myEntity]);
          if (field2) {
            newData[field][field2] = value;
          } else {
            newData[field] = value;
          }
          editDrafts[myEntity](newData);
        } else {
          var _newData = _extends({}, datas[entity]);
          _newData[name] = value;
          editDrafts[entity](_newData);
        }
      }
    };

    childProps.handleChangeDebouncedCustom = function () {
      var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;

      var debouncedChange = (0, _lodash2.default)(childProps.handleChange, wait);

      debounces.push(debouncedChange);

      return function (e) {
        if (e.persist) {
          e.persist();
        }

        debouncedChange(e);
      };
    };

    childProps.handleChangeDebounced = childProps.handleChangeDebouncedCustom(50);

    if (navigator.product === 'ReactNative') {
      return childProps.hasData || !hideUntilLoaded ? _react2.default.cloneElement(_react2.default.Children.only(children), childProps) : null;
    }

    return _react2.default.createElement(
      'div',
      { className: [className ? className : '', 'reflorp-loader', allResponses && (allResponses.pending || allResponses.refreshing) ? 'reflorp-loader-loading' : ''].join(' ') },
      childProps.hasData || !hideUntilLoaded ? _react2.default.cloneElement(_react2.default.Children.only(children), childProps) : _react2.default.createElement('noscript', null)
    );
  };

  return EntityWrapper;
}(_react.Component), _class2.propTypes = {
  onEdit: _react.PropTypes.func,
  onDelete: _react.PropTypes.func,
  onCreate: _react.PropTypes.func,
  children: _react.PropTypes.node,
  parentId: _react.PropTypes.any,
  id: _react.PropTypes.any,
  entity: _react.PropTypes.string,
  entities: _react.PropTypes.object,
  hideUntilLoaded: _react.PropTypes.bool
}, _class2.defaultProps = {
  hideUntilLoaded: false
}, _temp)) || _class) || _class);
exports.default = EntityWrapper;