'use strict';

exports.__esModule = true;
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dec, _class, _class2, _temp;

var _react = require('react');

var _reflorpRefetch = require('./reflorpRefetch');

var _reflorpRefetch2 = _interopRequireDefault(_reflorpRefetch);

var _reducer = require('../utils/reducer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReflorpWrapper = (_dec = (0, _reflorpRefetch2.default)(function () {
  var create = {};
  var edit = {};
  var editDraft = {};
  var myDelete = {};
  var loadMore = {};
  Object.keys((0, _reflorpRefetch.getEntities)()).forEach(function (entity) {
    create[entity + 'Create'] = true;
    edit[entity + 'Edit'] = true;
    editDraft[entity + 'EditDraft'] = true;
    myDelete[entity + 'Delete'] = true;
    loadMore[entity + 'LoadMore'] = true;
  });

  return _extends({}, create, edit, editDraft, myDelete, loadMore);
}), _dec(_class = (_temp = _class2 = function (_Component) {
  _inherits(ReflorpWrapper, _Component);

  function ReflorpWrapper() {
    _classCallCheck(this, ReflorpWrapper);

    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
  }

  ReflorpWrapper.prototype.componentWillMount = function componentWillMount() {
    this.refresh(this.props);
  };

  ReflorpWrapper.prototype.refresh = function refresh(props) {
    var store = (0, _reflorpRefetch.getStore)();

    Object.keys((0, _reflorpRefetch.getEntities)()).forEach(function (entity) {
      store.dispatch((0, _reducer.update)(entity + 'Create', props[entity + 'Create']));
      store.dispatch((0, _reducer.update)(entity + 'Edit', props[entity + 'Edit']));
      store.dispatch((0, _reducer.update)(entity + 'EditDraft', props[entity + 'EditDraft']));
      store.dispatch((0, _reducer.update)(entity + 'Delete', props[entity + 'Delete']));
      store.dispatch((0, _reducer.update)(entity + 'LoadMore', props[entity + 'LoadMore']));
    });
  };

  ReflorpWrapper.prototype.render = function render() {
    return this.props.children ? this.props.children : null;
  };

  return ReflorpWrapper;
}(_react.Component), _class2.propTypes = {
  children: _react.PropTypes.node
}, _temp)) || _class);
exports.default = ReflorpWrapper;