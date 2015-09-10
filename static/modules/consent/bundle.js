/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _radium = __webpack_require__(2);

	var _radium2 = _interopRequireDefault(_radium);

	var _globalComponentsButton = __webpack_require__(3);

	var _globalComponentsButton2 = _interopRequireDefault(_globalComponentsButton);

	var Consent = (function (_React$Component) {
	  function Consent() {
	    _classCallCheck(this, _Consent);

	    _React$Component.apply(this, arguments);
	  }

	  _inherits(Consent, _React$Component);

	  var _Consent = Consent;

	  _Consent.simulate = function simulate(props) {
	    return null;
	  };

	  _Consent.prototype.render = function render() {
	    var _this = this;

	    return _react2['default'].createElement(
	      'div',
	      { style: [styles.container] },
	      _react2['default'].createElement('div', {
	        dangerouslySetInnerHTML: { __html: this.props.body }
	      }),
	      _react2['default'].createElement(
	        'div',
	        null,
	        _react2['default'].createElement(
	          'label',
	          null,
	          _react2['default'].createElement('input', {
	            type: 'checkbox',
	            style: [styles.checkbox],
	            onChange: function () {
	              return _this.setState({ agreed: !_this.state.agreed });
	            }
	          }),
	          _react2['default'].createElement(
	            'b',
	            null,
	            ' ' + this.props.agree
	          )
	        ),
	        _react2['default'].createElement(
	          'div',
	          { style: [styles.clearfix] },
	          this.state.agreed && _react2['default'].createElement(_globalComponentsButton2['default'], {
	            modStyle: { float: 'right' },
	            text: this.props['continue'],
	            handler: function () {
	              return _this.props.push();
	            }
	          })
	        )
	      )
	    );
	  };

	  _createClass(_Consent, null, [{
	    key: 'propTypes',
	    value: {
	      body: _react.PropTypes.string.isRequired,
	      agree: _react.PropTypes.string.isRequired,
	      'continue': _react.PropTypes.string.isRequired
	    },
	    enumerable: true
	  }]);

	  Consent = _radium2['default'](Consent) || Consent;
	  return Consent;
	})(_react2['default'].Component);

	var styles = {
	  container: {
	    boxSizing: 'border-box',
	    width: '50%',
	    minWidth: 800,
	    borderRadius: 15,
	    boxShadow: '2px 2px 4px #ddd',
	    margin: '15px auto 60px auto',
	    padding: 30,
	    background: '#fff'
	  },
	  checkbox: {
	    fontSize: '2em'
	  },
	  clearfix: {
	    overflow: 'hidden',
	    padding: 5
	  }
	};

	exports['default'] = Consent;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Radium;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _radium = __webpack_require__(2);

	var _radium2 = _interopRequireDefault(_radium);

	var Button = (function (_React$Component) {
	  function Button() {
	    _classCallCheck(this, _Button);

	    _React$Component.apply(this, arguments);
	  }

	  _inherits(Button, _React$Component);

	  var _Button = Button;

	  _Button.prototype.render = function render() {
	    var _props = this.props;
	    var text = _props.text;
	    var handler = _props.handler;
	    var color = _props.color;
	    var background = _props.background;
	    var border = _props.border;
	    var hover = _props.hover;
	    var modStyle = _props.modStyle;

	    return _react2['default'].createElement(
	      'div',
	      {
	        style: [styles.button, {
	          color: color,
	          backgroundColor: background,
	          boxShadow: '0 0 0 1px ' + border,
	          borderRadius: 5,
	          ':hover': hover
	        }, modStyle],
	        onClick: handler
	      },
	      text
	    );
	  };

	  _createClass(_Button, null, [{
	    key: 'defaultProps',
	    value: {
	      color: '#557',
	      background: '#fff',
	      border: '#557',
	      hover: {
	        color: '#fff',
	        backgroundColor: '#557'
	      }
	    },
	    enumerable: true
	  }]);

	  Button = _radium2['default'](Button) || Button;
	  return Button;
	})(_react2['default'].Component);

	var styles = {
	  button: {
	    boxSizing: 'border-box',
	    padding: 15,
	    margin: 0,
	    cursor: 'pointer',
	    textAlign: 'center'
	  }
	};

	exports['default'] = Button;
	module.exports = exports['default'];

/***/ }
/******/ ]);