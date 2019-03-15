/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(32)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = axios;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_login_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_register_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_index_vue__ = __webpack_require__(10);
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	},
	components: {
		login: __WEBPACK_IMPORTED_MODULE_0__components_login_vue__["default"],
		register: __WEBPACK_IMPORTED_MODULE_1__components_register_vue__["default"],
		index: __WEBPACK_IMPORTED_MODULE_2__components_index_vue__["default"]
	}
});

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__ = __webpack_require__(6);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10d9df09_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__ = __webpack_require__(35);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(33)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-10d9df09"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10d9df09_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_login_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10d9df09", Component.options)
  } else {
    hotAPI.reload("data-v-10d9df09", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		const validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				callback();
			}
		};
		const validateemail = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('邮箱不能为空'));
			} else {
				const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
				if (!reg.test(value)) {
					callback(new Error('请输入正确邮箱格式'));
				} else {
					callback();
				}
			}
		};
		return {
			ruleForm2: {
				password: '',
				email: ''
			},
			rules2: {
				password: [{
					validator: validatePass,
					trigger: 'blur'
				}],
				email: [{
					validator: validateemail,
					trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const res = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('http://127.0.0.1:3000/session', this.ruleForm2);
					if (res.data.err) {
						return this.$message('用户名或密码错误');
					}
					this.$router.push('/');
				}
			});
		}
	}
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "logo.png";

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__ = __webpack_require__(9);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8f8a1d9a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_register_vue__ = __webpack_require__(38);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(36)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-8f8a1d9a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_register_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8f8a1d9a_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_register_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8f8a1d9a", Component.options)
  } else {
    hotAPI.reload("data-v-8f8a1d9a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		const checkAge = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('用户名不能为空'));
			}
			setTimeout(async () => {
				if (value.length < 2 || value.length > 8) {
					callback(new Error('用户名必须在2-8位'));
				} else {
					const res = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/users?username=' + value);
					if (res.data[0]) {
						return callback(new Error('该用户名已存在'));
					}
					callback();
				}
			}, 200);
		};
		const validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {
				if (this.ruleForm2.checkPass !== '') {
					this.$refs.ruleForm2.validateField('checkPass');
				}
				callback();
			}
		};
		const validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.ruleForm2.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		const validateemail = async (rule, value, callback) => {
			if (value === '') {
				callback(new Error('邮箱不能为空'));
			} else {
				const reg = new RegExp("^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$");
				if (!reg.test(value)) {
					callback(new Error('请输入正确邮箱格式'));
				} else {
					const res = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/users?email=' + value);
					if (res.data[0]) {
						return callback(new Error('该邮箱已被注册'));
					}
					callback();
				}
			}
		};
		const validategendar = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择性别'));
			} else {
				callback();
			}
		};
		return {
			ruleForm2: {
				password: '',
				checkPass: '',
				username: '',
				email: '',
				gendar: ''
			},
			dialogVisible: false,
			rules2: {
				password: [{
					validator: validatePass,
					trigger: 'blur'
				}],
				checkPass: [{
					validator: validatePass2,
					trigger: 'blur'
				}],
				username: [{
					validator: checkAge,
					trigger: 'blur'
				}],
				email: [{
					validator: validateemail,
					trigger: 'blur'
				}],
				gendar: [{
					validator: validategendar,
					trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					delete this.ruleForm2.checkPass;
					if (this.ruleForm2.gendar === '男') {
						this.ruleForm2.gendar = 0;
					} else {
						this.ruleForm2.gendar = 1;
					}
					const res = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('http://127.0.0.1:3000/users', this.ruleForm2);
					if (res.data.err) {
						return;
					}
					this.dialogVisible = true;
				}
			});
		},
		gologin() {
			this.dialogVisible = false;
			this.$router.push('/login');
		}
	}
});

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__ = __webpack_require__(11);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47323bf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__ = __webpack_require__(66);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(39)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_47323bf2_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/index.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-47323bf2", Component.options)
  } else {
    hotAPI.reload("data-v-47323bf2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__list_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__indexheader_vue__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__release_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__details_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__user_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__topicedit_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__useredit_vue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__listbytitle_vue__ = __webpack_require__(25);
//
//
//
//
//
//
//









/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {};
	},
	components: {
		indexheader: __WEBPACK_IMPORTED_MODULE_1__indexheader_vue__["a" /* default */],
		list: __WEBPACK_IMPORTED_MODULE_0__list_vue__["default"],
		release: __WEBPACK_IMPORTED_MODULE_2__release_vue__["default"],
		detailspage: __WEBPACK_IMPORTED_MODULE_3__details_vue__["default"],
		user: __WEBPACK_IMPORTED_MODULE_4__user_vue__["default"],
		useredit: __WEBPACK_IMPORTED_MODULE_6__useredit_vue__["default"],
		listbytitle: __WEBPACK_IMPORTED_MODULE_7__listbytitle_vue__["default"]
	}
});

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_vue__ = __webpack_require__(13);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_227179ae_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_list_vue__ = __webpack_require__(43);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(41)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_list_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_227179ae_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_list_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/list.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-227179ae", Component.options)
  } else {
    hotAPI.reload("data-v-227179ae", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			topics: [],
			currentPage: 1,
			pagesize: 5,
			alllength: 1,
			topictype: '',
			user: null
		};
	},
	methods: {
		handleSizeChange(val) {
			//         console.log(`每页 ${val} 条`);
			// 				console.log(this.currentPage)
			this.pagesize = val;
			this.getlist(`http://127.0.0.1:3000/topics?
				page=${this.currentPage}&size=${this.pagesize}&topictype=${this.topictype}`);
		},
		handleCurrentChange(val) {
			//         console.log(`当前页: ${val}`);
			// 				console.log(this.pagesize)
			this.currentPage = val;
			this.getlist(`http://127.0.0.1:3000/topics?
				page=${val}&size=${this.pagesize}&topictype=${this.topictype}`);
		},
		async getlist(url) {
			const { data: resdata } = await axios.get(url),
			      topicdata = resdata.data;
			topicdata.forEach(function (item, i) {
				switch (item.topictype) {
					case 'technology':
						item.topictype = '技术';
						break;
					case 'literature':
						item.topictype = '文学';
						break;
					case 'Sports':
						item.topictype = '体育';
						break;
					case 'entertainment':
						item.topictype = '娱乐';
						break;
					case 'metaphysics':
						item.topictype = '玄学';
						break;
					default:
						item.topictype = '未知';
				}
			});
			this.topics = topicdata;
			this.alllength = resdata.alllength;
		},
		handleCommand(command) {
			this.topictype = command;
			this.currentPage = 1;
			this.getlist(`http://127.0.0.1:3000/topics?
				page=${this.currentPage}&size=${this.pagesize}&topictype=${this.topictype}`);
		},
		async gorelease() {
			const { data } = await axios.get('http://127.0.0.1:3000/session');
			// console.log(data.state)
			if (!data.state) {
				return this.$message({
					message: '请先登录',
					type: 'warning'
				});
			}
			this.user = data.state;
			this.$router.push('/release');
		}
	},
	async created() {
		this.getlist('http://127.0.0.1:3000/topics');
	},
	computed: {
		topicclass() {
			switch (this.topictype) {
				case 'technology':
					return '技术';
					break;
				case 'literature':
					return '文学';
					break;
				case 'Sports':
					return '体育';
					break;
				case 'entertainment':
					return '娱乐';
					break;
				case 'metaphysics':
					return '玄学';
					break;
				default:
					return '全部';
			}
		}
	}
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


__WEBPACK_IMPORTED_MODULE_0_axios___default.a.defaults.withCredentials = true;
/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			activeIndex: '1',
			activeIndex2: '1',
			login: false,
			user: {},
			keyword: ''
		};
	},
	methods: {
		async logout() {
			const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.delete('http://127.0.0.1:3000/session');
			if (!data.state) {
				this.login = false;
				this.user = data.state;
			}
		},
		querytitle() {
			this.keyword.trim();
			if (this.keyword === '') return this.$router.push('/');
			this.$router.push('/listbytitle?keyword=' + this.keyword);
		}
	},
	async created() {
		const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/session');
		// console.log(data.state)
		if (data.state) {
			this.login = true;
			this.user = data.state;
		}
	}
});

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_release_vue__ = __webpack_require__(16);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3f2b56a7_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_release_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(48)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_release_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3f2b56a7_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_release_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/release.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3f2b56a7", Component.options)
  } else {
    hotAPI.reload("data-v-3f2b56a7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			ruleForm: {
				title: '',
				topictype: '',
				content: ''
			},
			rules: {
				title: [{
					required: true,
					message: '标题不能为空',
					trigger: 'blur'
				}, {
					min: 2,
					max: 30,
					message: '长度在 2 到 30 个字符',
					trigger: 'blur'
				}],
				topictype: [{
					required: true,
					message: '请选择话题类型',
					trigger: 'change'
				}],
				content: [{
					required: true,
					message: '话题内容不能为空',
					trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { data: topicdata } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('http://127.0.0.1:3000/topics', this.ruleForm);
					if (topicdata.err === "没有权限") {
						return this.$message({
							message: '请先登录',
							type: 'warning'
						});
					}
					if (!topicdata.err) {
						this.$message({
							message: '发布成功',
							type: 'success'
						});
						this.$router.push('/');
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
});

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_details_vue__ = __webpack_require__(18);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8d64e93c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_details_vue__ = __webpack_require__(53);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(51)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_details_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8d64e93c_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_details_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/details.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8d64e93c", Component.options)
  } else {
    hotAPI.reload("data-v-8d64e93c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			topic: {},
			author: {},
			comments: [],
			nwemessage: '',
			operation: false,
			stars: 0,
			star: true
		};
	},
	async created() {
		// console.log(this.$route.params)
		let currentuser_id = '';
		const { id } = this.$route.params;
		const { data: topic } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/topics/details?_id=' + id);
		const { data: author } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/users?_id=' + topic.user_id);
		if (!author.err) {
			this.author = author[0];
			const { data: currentuser } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/session');
			if (currentuser.state) {
				currentuser_id = currentuser.state._id;
				if (this.author._id === currentuser.state._id) {
					this.operation = true;
				}
			}
		}
		if (!topic.err) {
			this.topic = topic;
		}
		this.getcomments();
		this.stars = this.topic.stars.length;
		if (currentuser_id) {
			// console.log(this.stars)
			this.star = this.topic.stars.indexOf(currentuser_id) === -1 ? true : false;
			// console.log(this.stars.indexOf(currentuser_id))
		}
	},
	methods: {
		async deletetopic(e) {
			const id = e.target.dataset["id"];
			const { data: topicdata } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.delete(`http://127.0.0.1:3000/topics/${id}`);
			if (topicdata.err === "没有权限") {
				return this.$message({
					message: '请先登录',
					type: 'warning'
				});
			}
			if (!topicdata.err) {
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.$router.go(-1);
			}
		},
		async getcomments() {
			const { id } = this.$route.params;
			const { data: comments } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/comments?article_id=' + id);
			if (!comments.err) {
				this.comments = comments;
				// console.log(this.comments)
			}
		},
		async sendmessage() {
			const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/session');
			// console.log(data.state)
			if (!data.state) {
				return this.$message({
					message: '请先登录!',
					type: 'warning'
				});
			}
			const { id } = this.$route.params;
			const { data: comment } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.post('http://127.0.0.1:3000/comments', {
				content: this.nwemessage,
				article_id: id
			});
			if (!comment.err) {
				this.nwemessage = '';
				this.getcomments();
			}
		},
		async setstar() {
			const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/session');
			// console.log(data.state)
			if (!data.state) {
				return this.$message({
					message: '请先登录',
					type: 'warning'
				});
			}
			const user_id = data.state._id;
			let stars = this.topic.stars;
			const star_idx = stars.indexOf(user_id);
			if (star_idx === -1) {
				stars.push(user_id);
			} else {
				stars.splice(star_idx, 1);
			}
			const { data: newtopic } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.patch(`http://127.0.0.1:3000/topics/star/${this.topic._id}`, { stars: stars });
			if (!newtopic.err) {
				this.stars = stars.length;
				this.star = this.star ? false : true;
			}
		}
	}
});

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__ = __webpack_require__(20);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7b4b534a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_user_vue__ = __webpack_require__(56);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(54)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_user_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7b4b534a_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_user_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/user.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b4b534a", Component.options)
  } else {
    hotAPI.reload("data-v-7b4b534a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			activeName: 'second',
			user: {},
			edit: false,
			topics: [],
			operation: false
		};
	},
	methods: {
		async useredit() {
			const { data: currentuser } = await axios.get('http://127.0.0.1:3000/session');
			if (!currentuser.state) {
				return;
			}
			this.$router.push(`/useredit/${currentuser.state._id}`);
		},
		async deletetopic(e) {
			const id = e.target.dataset["id"];
			const { data: topicdata } = await axios.delete(`http://127.0.0.1:3000/topics/${id}`);
			if (topicdata.err === "没有权限") {
				return this.$message({
					message: '请先登录',
					type: 'warning'
				});
			}
			if (!topicdata.err) {
				this.$message({
					message: '删除成功',
					type: 'success'
				});
				this.getuserone();
			}
		},
		async getuserone() {
			const { id } = this.$route.params;
			const { data } = await axios.get('http://127.0.0.1:3000/users?_id=' + id);
			this.user = data[0];
			const { data: usertopics } = await axios.get('http://127.0.0.1:3000/topics/usertopics?user_id=' + id);
			if (!usertopics.err) {
				usertopics.forEach(function (item, i) {
					switch (item.topictype) {
						case 'technology':
							item.topictype = '技术';
							break;
						case 'literature':
							item.topictype = '文学';
							break;
						case 'Sports':
							item.topictype = '体育';
							break;
						case 'entertainment':
							item.topictype = '娱乐';
							break;
						case 'metaphysics':
							item.topictype = '玄学';
							break;
						default:
							item.topictype = '未知';
					}
				});
				this.topics = usertopics;
			}
			const { data: currentuser } = await axios.get('http://127.0.0.1:3000/session');
			if (!currentuser.state) {
				return;
			}
			if (id === currentuser.state._id) {
				this.edit = true;
				this.operation = true;
			}
		}
	},
	created() {
		this.getuserone();
	}
});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_topicedit_vue__ = __webpack_require__(22);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1a234f59_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_topicedit_vue__ = __webpack_require__(59);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(57)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_topicedit_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1a234f59_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_topicedit_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/topicedit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a234f59", Component.options)
  } else {
    hotAPI.reload("data-v-1a234f59", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			ruleForm: {
				title: '',
				topictype: '',
				content: ''
			},
			rules: {
				title: [{
					required: true,
					message: '标题不能为空',
					trigger: 'blur'
				}, {
					min: 2,
					max: 30,
					message: '长度在 2 到 30 个字符',
					trigger: 'blur'
				}],
				topictype: [{
					required: true,
					message: '请选择话题类型',
					trigger: 'change'
				}],
				content: [{
					required: true,
					message: '话题内容不能为空',
					trigger: 'blur'
				}]
			}
		};
	},
	methods: {
		submitForm(formName) {
			const { id } = this.$route.params;
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { data: topicdata } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.patch(`http://127.0.0.1:3000/topics/${id}`, this.ruleForm);
					if (topicdata.err === "没有权限") {
						return this.$message({
							message: '请先登录',
							type: 'warning',
							customClass: 'message'
						});
					}
					if (!topicdata.err) {
						this.$message({
							message: '更新成功',
							type: 'success'
						});
						this.$router.go(-1);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	},
	async created() {
		const { id } = this.$route.params;
		const { data: topic } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/topics/details?_id=' + id);
		if (topic.err) {
			return;
		}
		this.ruleForm.content = topic.content;
		this.ruleForm.title = topic.title;
		this.ruleForm.topictype = topic.topictype;
	}
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_useredit_vue__ = __webpack_require__(24);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4be215e5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_useredit_vue__ = __webpack_require__(62);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(60)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_useredit_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_4be215e5_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_useredit_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/useredit.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4be215e5", Component.options)
  } else {
    hotAPI.reload("data-v-4be215e5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_axios___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_axios__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		const checkAge = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('用户名不能为空'));
			}
			setTimeout(async () => {
				if (value.length < 2 || value.length > 8) {
					callback(new Error('用户名必须在2-8位'));
				} else {
					const res = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/users?username=' + value);
					if (res.data[0]) {
						const { id } = this.$route.params;
						if (res.data[0]._id === id) {
							return callback();
						}
						return callback(new Error('该用户名已存在'));
					}
					callback();
				}
			}, 200);
		};
		const validategendar = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择性别'));
			} else {
				callback();
			}
		};
		return {
			ruleForm2: {
				username: '',
				gendar: '',
				avatar: ''
			},
			rules2: {
				username: [{
					validator: checkAge,
					trigger: 'blur'
				}],
				gendar: [{
					validator: validategendar,
					trigger: 'blur'
				}]
			},
			imageUrl: ''
		};
	},
	methods: {
		gouser() {
			console.log(1);
			this.$router.back();
		},
		handleAvatarSuccess(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			this.ruleForm2.avatar = res.data;
		},
		beforeAvatarUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
		submitForm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const { id } = this.$route.params;
					const { data: currentuser } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/session');
					// console.log(data.state)
					if (!currentuser.state) {
						return this.$message({
							message: '请先登录',
							type: 'warning'
						});
					}
					if (id !== currentuser.state._id) {
						return this.$message({
							message: '没有权限',
							type: 'warning'
						});
					}
					if (this.ruleForm2.gendar === '男') {
						this.ruleForm2.gendar = 0;
					} else {
						this.ruleForm2.gendar = 1;
					}
					if (!this.ruleForm2.avatar) {
						delete this.ruleForm2.avatar;
					}
					const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.patch(`http://127.0.0.1:3000/users/${id}`, this.ruleForm2);
					if (data.err) {
						return this.$message({
							message: '服务器繁忙',
							type: 'warning'
						});
					}
					this.$message({
						message: '更新成功',
						type: 'warning'
					});
					this.$router.go(-1);
				}
			});
		}
	},
	async created() {
		const { id } = this.$route.params;
		const { data } = await __WEBPACK_IMPORTED_MODULE_0_axios___default.a.get('http://127.0.0.1:3000/users?_id=' + id);
		this.ruleForm2.username = data[0].username;
		this.ruleForm2.gendar = data[0].gendar === 0 ? '男' : '女';
	}
});

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listbytitle_vue__ = __webpack_require__(26);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_528602a3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listbytitle_vue__ = __webpack_require__(65);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(63)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_listbytitle_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_528602a3_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_listbytitle_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/listbytitle.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-528602a3", Component.options)
  } else {
    hotAPI.reload("data-v-528602a3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
	data() {
		return {
			topics: [],
			topictype: ''
		};
	},
	methods: {
		async gettopicsbytitle() {
			const { keyword } = this.$route.query;
			const { data: topics } = await axios.get('http://127.0.0.1:3000/topics/title?keyword=' + keyword);
			topics.forEach(function (item, i) {
				switch (item.topictype) {
					case 'technology':
						item.topictype = '技术';
						break;
					case 'literature':
						item.topictype = '文学';
						break;
					case 'Sports':
						item.topictype = '体育';
						break;
					case 'entertainment':
						item.topictype = '娱乐';
						break;
					case 'metaphysics':
						item.topictype = '玄学';
						break;
					default:
						item.topictype = '未知';
				}
			});
			this.topics = topics;
			// console.log(topics)
		}
	},
	async created() {
		this.gettopicsbytitle();
	},
	computed: {
		topicclass() {
			switch (this.topictype) {
				case 'technology':
					return '技术';
					break;
				case 'literature':
					return '文学';
					break;
				case 'Sports':
					return '体育';
					break;
				case 'entertainment':
					return '娱乐';
					break;
				case 'metaphysics':
					return '玄学';
					break;
				default:
					return '全部';
			}
		}
	},
	watch: {
		'$route'(to, from) {
			this.gettopicsbytitle();
		}
	}
});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _vue = __webpack_require__(28);

var _vue2 = _interopRequireDefault(_vue);

var _app = __webpack_require__(29);

var _app2 = _interopRequireDefault(_app);

var _router = __webpack_require__(68);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue2.default({
	el: '#app',
	data: {
		message: 'test'
	},
	template: '<App />',
	components: {
		App: _app2.default
	},
	router: _router2.default
});

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = Vue;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__ = __webpack_require__(4);
/* empty harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ef48958_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__ = __webpack_require__(67);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(30)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_5ef48958_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/app.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5ef48958", Component.options)
  } else {
    hotAPI.reload("data-v-5ef48958", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(31);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("7d1b5b94", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5ef48958\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-5ef48958\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"app.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a3f3d502", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10d9df09\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10d9df09\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./login.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.login[data-v-10d9df09] {\n\twidth: 400px;\n\tpadding: 30px;\n\tpadding-left: 10px;\n\tpadding-right: 70px;\n\tpadding-bottom: 20px;\n\tmargin: 100px auto;\n\tborder: 1px solid #ccc;\n}\n.loginbtn[data-v-10d9df09]{\n\twidth: 100%;\n}\n.message[data-v-10d9df09] {\n\theight: 40px;\n\tmargin-top: 20px;\n\tpadding-left: 20px;\n  border: 1px solid #d8dee2;\n  border-radius: 5px;\n}\n.message p[data-v-10d9df09]{\n\tpadding: 0;\n\tline-height: 40px;\n\tmargin: 0;\n}\n.login h1[data-v-10d9df09]{\n\ttext-align: center;\n\tmargin: 0;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/login.vue"],"names":[],"mappings":";AA6EA;CACA,aAAA;CACA,cAAA;CACA,mBAAA;CACA,oBAAA;CACA,qBAAA;CACA,mBAAA;CACA,uBAAA;CACA;AACA;CACA,YAAA;CACA;AACA;CACA,aAAA;CACA,iBAAA;CACA,mBAAA;EACA,0BAAA;EACA,mBAAA;CACA;AACA;CACA,WAAA;CACA,kBAAA;CACA,UAAA;CACA;AACA;CACA,mBAAA;CACA,UAAA;CACA","file":"login.vue","sourcesContent":["<template>\n\t<div class=\"login\">\r\n\t\t<h1><a href=\"#/\"><img src=\"../pubic/img/logo.png\" alt=\"\"></a></h1>\r\n\t\t<el-form :model=\"ruleForm2\" status-icon :rules=\"rules2\" ref=\"ruleForm2\" label-width=\"80px\" class=\"demo-ruleForm\">\r\n\t\t\t<el-form-item prop=\"email\" label=\"邮箱\">\r\n\t\t\t\t<el-input v-model=\"ruleForm2.email\" type=\"email\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item label=\"密码\" prop=\"password\">\r\n\t\t\t\t<el-input type=\"password\" v-model=\"ruleForm2.password\" autocomplete=\"off\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item>\r\n\t\t\t\t<el-button class=\"loginbtn\" type=\"primary\" @click=\"submitForm('ruleForm2')\">登录</el-button>\r\n\t\t\t\t<div class=\"message\">\r\n\t\t\t\t  <p>没有账号? <a href=\"#/register\">点击创建</a>.</p>\r\n\t\t\t\t</div>\r\n\t\t\t</el-form-item>\r\n\t\t</el-form>\r\n\t</div>\n</template>\n\n<script>\r\n\timport axios from 'axios'\n\texport default {\r\n\t\tdata() {\r\n\t\t\tconst validatePass = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('请输入密码'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tcallback();\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\tconst validateemail = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('邮箱不能为空'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tconst reg = new RegExp(\"^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\\\.)+[a-z]{2,}$\")\r\n\t\t\t\t\tif (!reg.test(value)) {\r\n\t\t\t\t\t\tcallback(new Error('请输入正确邮箱格式'))\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tcallback()\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\treturn {\r\n\t\t\t\truleForm2: {\r\n\t\t\t\t\tpassword: '',\r\n\t\t\t\t\temail: ''\r\n\t\t\t\t},\r\n\t\t\t\trules2: {\r\n\t\t\t\t\tpassword: [{\r\n\t\t\t\t\t\tvalidator: validatePass,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\temail: [{\r\n\t\t\t\t\t\tvalidator: validateemail,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}]\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t},\r\n\t\tmethods: {\r\n\t\t\t submitForm(formName) {\r\n\t\t\t\tthis.$refs[formName].validate(async (valid) => {\r\n\t\t\t\t\tif (valid) {\r\n\t\t\t\t\t\tconst res = await axios.post('http://127.0.0.1:3000/session', this.ruleForm2)\r\n\t\t\t\t\t\tif(res.data.err){\r\n\t\t\t\t\t\t\treturn this.$message('用户名或密码错误')\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tthis.$router.push('/')\r\n\t\t\t\t\t}\r\n\t\t\t\t})\r\n\t\t\t}\t\r\n\t\t}\r\n\t}\n</script>\n\n<style scoped>\n\t.login {\r\n\t\twidth: 400px;\r\n\t\tpadding: 30px;\r\n\t\tpadding-left: 10px;\r\n\t\tpadding-right: 70px;\r\n\t\tpadding-bottom: 20px;\r\n\t\tmargin: 100px auto;\r\n\t\tborder: 1px solid #ccc;\r\n\t}\r\n\t.loginbtn{\r\n\t\twidth: 100%;\r\n\t}\r\n\t.message {\r\n\t\theight: 40px;\r\n\t\tmargin-top: 20px;\r\n\t\tpadding-left: 20px;\r\n\t  border: 1px solid #d8dee2;\r\n\t  border-radius: 5px;\r\n\t}\r\n\t.message p{\r\n\t\tpadding: 0;\r\n\t\tline-height: 40px;\r\n\t\tmargin: 0;\r\n\t}\r\n\t.login h1{\r\n\t\ttext-align: center;\r\n\t\tmargin: 0;\r\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "login" },
    [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "el-form",
        {
          ref: "ruleForm2",
          staticClass: "demo-ruleForm",
          attrs: {
            model: _vm.ruleForm2,
            "status-icon": "",
            rules: _vm.rules2,
            "label-width": "80px"
          }
        },
        [
          _c(
            "el-form-item",
            { attrs: { prop: "email", label: "邮箱" } },
            [
              _c("el-input", {
                attrs: { type: "email" },
                model: {
                  value: _vm.ruleForm2.email,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "email", $$v)
                  },
                  expression: "ruleForm2.email"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "密码", prop: "password" } },
            [
              _c("el-input", {
                attrs: { type: "password", autocomplete: "off" },
                model: {
                  value: _vm.ruleForm2.password,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "password", $$v)
                  },
                  expression: "ruleForm2.password"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            [
              _c(
                "el-button",
                {
                  staticClass: "loginbtn",
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.submitForm("ruleForm2")
                    }
                  }
                },
                [_vm._v("登录")]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "message" }, [
                _c("p", [
                  _vm._v("没有账号? "),
                  _c("a", { attrs: { href: "#/register" } }, [
                    _vm._v("点击创建")
                  ]),
                  _vm._v(".")
                ])
              ])
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("h1", [
      _c("a", { attrs: { href: "#/" } }, [
        _c("img", { attrs: { src: __webpack_require__(7), alt: "" } })
      ])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-10d9df09", esExports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1d5ae160", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8f8a1d9a\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./register.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8f8a1d9a\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./register.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.register[data-v-8f8a1d9a] {\n\twidth: 500px;\n\tpadding: 40px;\n\tpadding-right: 70px;\n\tmargin: 20px auto;\n\tborder: 1px solid #ccc;\n}\n.register h1[data-v-8f8a1d9a]{\n\ttext-align: center;\n\tmargin: 0;\n}\n.registerbtn[data-v-8f8a1d9a]{\n\twidth: 100%;\n}\n.message[data-v-8f8a1d9a] {\n\theight: 40px;\n\tmargin-top: 20px;\n\tpadding-left: 20px;\n  border: 1px solid #d8dee2;\n  border-radius: 5px;\n}\n.message p[data-v-8f8a1d9a]{\n\tpadding: 0;\n\tline-height: 40px;\n\tmargin: 0;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/register.vue"],"names":[],"mappings":";AAiKA;CACA,aAAA;CACA,cAAA;CACA,oBAAA;CACA,kBAAA;CACA,uBAAA;CACA;AACA;CACA,mBAAA;CACA,UAAA;CACA;AACA;CACA,YAAA;CACA;AACA;CACA,aAAA;CACA,iBAAA;CACA,mBAAA;EACA,0BAAA;EACA,mBAAA;CACA;AACA;CACA,WAAA;CACA,kBAAA;CACA,UAAA;CACA","file":"register.vue","sourcesContent":["<template>\r\n\t<div class=\"register\">\r\n\t\t<h1><img src=\"../pubic/img/logo.png\" alt=\"\"></h1>\r\n\t\t<el-dialog title=\"提示\" :visible.sync=\"dialogVisible\" width=\"30%\" >\r\n\t\t\t<span>注册成功!去登录？</span>\r\n\t\t\t<span slot=\"footer\" class=\"dialog-footer\">\r\n\t\t\t\t<el-button @click=\"dialogVisible = false\">取 消</el-button>\r\n\t\t\t\t<el-button type=\"primary\" @click=\"gologin\">确 定</el-button>\r\n\t\t\t</span>\r\n\t\t</el-dialog>\r\n\t\t<el-form :model=\"ruleForm2\" status-icon :rules=\"rules2\" ref=\"ruleForm2\" label-width=\"100px\" class=\"demo-ruleForm\">\r\n\t\t\t<el-form-item label=\"用户名\" prop=\"username\">\r\n\t\t\t\t<el-input v-model=\"ruleForm2.username\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item prop=\"email\" label=\"邮箱\">\r\n\t\t\t\t<el-input v-model=\"ruleForm2.email\" type=\"email\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item label=\"密码\" prop=\"password\">\r\n\t\t\t\t<el-input type=\"password\" v-model=\"ruleForm2.password\" autocomplete=\"off\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item label=\"确认密码\" prop=\"checkPass\">\r\n\t\t\t\t<el-input type=\"password\" v-model=\"ruleForm2.checkPass\" autocomplete=\"off\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item label=\"性别\" prop=\"gendar\">\r\n\t\t\t\t<el-radio-group v-model=\"ruleForm2.gendar\">\r\n\t\t\t\t\t<el-radio label=\"男\" value=\"0\"></el-radio>\r\n\t\t\t\t\t<el-radio label=\"女\" value=\"1\"></el-radio>\r\n\t\t\t\t</el-radio-group>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item>\r\n\t\t\t\t<el-button class=\"registerbtn\" type=\"primary\" @click=\"submitForm('ruleForm2')\">提交</el-button>\r\n\t\t\t\t<div class=\"message\">\r\n\t\t\t\t  <p>已有账号? <a href=\"#/login\">点击登录</a>.</p>\r\n\t\t\t\t</div>\r\n\t\t\t</el-form-item>\r\n\t\t</el-form>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport axios from 'axios'\r\n\texport default {\r\n\t\tdata() {\r\n\t\t\tconst checkAge = (rule, value, callback) => {\r\n\t\t\t\tif (!value) {\r\n\t\t\t\t\treturn callback(new Error('用户名不能为空'));\r\n\t\t\t\t}\r\n\t\t\t\tsetTimeout(async () => {\r\n\t\t\t\t\tif (value.length < 2 || value.length > 8) {\r\n\t\t\t\t\t\tcallback(new Error('用户名必须在2-8位'));\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconst res = await axios.get('http://127.0.0.1:3000/users?username='+value)\r\n\t\t\t\t\t\tif(res.data[0]){\r\n\t\t\t\t\t\t\treturn callback(new Error('该用户名已存在'))\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tcallback();\r\n\t\t\t\t\t}\r\n\t\t\t\t}, 200);\r\n\t\t\t};\r\n\t\t\tconst validatePass = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('请输入密码'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tif (this.ruleForm2.checkPass !== '') {\r\n\t\t\t\t\t\tthis.$refs.ruleForm2.validateField('checkPass');\r\n\t\t\t\t\t}\r\n\t\t\t\t\tcallback();\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\tconst validatePass2 = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('请再次输入密码'));\r\n\t\t\t\t} else if (value !== this.ruleForm2.password) {\r\n\t\t\t\t\tcallback(new Error('两次输入密码不一致!'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tcallback();\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\tconst validateemail = async (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('邮箱不能为空'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tconst reg = new RegExp(\"^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\\\.)+[a-z]{2,}$\")\r\n\t\t\t\t\tif (!reg.test(value)) {\r\n\t\t\t\t\t\tcallback(new Error('请输入正确邮箱格式'))\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconst res = await axios.get('http://127.0.0.1:3000/users?email='+value)\r\n\t\t\t\t\t\tif(res.data[0]){\r\n\t\t\t\t\t\t\treturn callback(new Error('该邮箱已被注册'))\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tcallback()\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\tconst validategendar = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('请选择性别'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tcallback()\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t\treturn {\r\n\t\t\t\truleForm2: {\r\n\t\t\t\t\tpassword: '',\r\n\t\t\t\t\tcheckPass: '',\r\n\t\t\t\t\tusername: '',\r\n\t\t\t\t\temail: '',\r\n\t\t\t\t\tgendar: ''\r\n\t\t\t\t},\r\n\t\t\t\tdialogVisible: false,\r\n\t\t\t\trules2: {\r\n\t\t\t\t\tpassword: [{\r\n\t\t\t\t\t\tvalidator: validatePass,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tcheckPass: [{\r\n\t\t\t\t\t\tvalidator: validatePass2,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tusername: [{\r\n\t\t\t\t\t\tvalidator: checkAge,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\temail: [{\r\n\t\t\t\t\t\tvalidator: validateemail,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tgendar: [{\r\n\t\t\t\t\t\tvalidator: validategendar,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}]\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t},\r\n\t\tmethods: {\r\n\t\t\tsubmitForm(formName) {\r\n\t\t\t\tthis.$refs[formName].validate(async (valid) => {\r\n\t\t\t\t\tif (valid) {\r\n\t\t\t\t\t\tdelete this.ruleForm2.checkPass\r\n\t\t\t\t\t\tif (this.ruleForm2.gendar === '男') {\r\n\t\t\t\t\t\t\tthis.ruleForm2.gendar = 0\r\n\t\t\t\t\t\t} else {\r\n\t\t\t\t\t\t\tthis.ruleForm2.gendar = 1\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tconst res = await axios.post('http://127.0.0.1:3000/users', this.ruleForm2)\r\n\t\t\t\t\t\tif(res.data.err){\r\n\t\t\t\t\t\t\treturn\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tthis.dialogVisible = true\r\n\t\t\t\t\t}\r\n\t\t\t\t})\r\n\t\t\t},\r\n\t\t\tgologin(){\r\n\t\t\t\tthis.dialogVisible = false\r\n\t\t\t\tthis.$router.push('/login')\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style scoped>\r\n\t.register {\r\n\t\twidth: 500px;\r\n\t\tpadding: 40px;\r\n\t\tpadding-right: 70px;\r\n\t\tmargin: 20px auto;\r\n\t\tborder: 1px solid #ccc;\r\n\t}\r\n\t.register h1{\r\n\t\ttext-align: center;\r\n\t\tmargin: 0;\r\n\t}\r\n\t.registerbtn{\r\n\t\twidth: 100%;\r\n\t}\r\n\t.message {\r\n\t\theight: 40px;\r\n\t\tmargin-top: 20px;\r\n\t\tpadding-left: 20px;\r\n\t  border: 1px solid #d8dee2;\r\n\t  border-radius: 5px;\r\n\t}\r\n\t.message p{\r\n\t\tpadding: 0;\r\n\t\tline-height: 40px;\r\n\t\tmargin: 0;\r\n\t}\r\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "register" },
    [
      _vm._m(0),
      _vm._v(" "),
      _c(
        "el-dialog",
        {
          attrs: { title: "提示", visible: _vm.dialogVisible, width: "30%" },
          on: {
            "update:visible": function($event) {
              _vm.dialogVisible = $event
            }
          }
        },
        [
          _c("span", [_vm._v("注册成功!去登录？")]),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "dialog-footer",
              attrs: { slot: "footer" },
              slot: "footer"
            },
            [
              _c(
                "el-button",
                {
                  on: {
                    click: function($event) {
                      _vm.dialogVisible = false
                    }
                  }
                },
                [_vm._v("取 消")]
              ),
              _vm._v(" "),
              _c(
                "el-button",
                { attrs: { type: "primary" }, on: { click: _vm.gologin } },
                [_vm._v("确 定")]
              )
            ],
            1
          )
        ]
      ),
      _vm._v(" "),
      _c(
        "el-form",
        {
          ref: "ruleForm2",
          staticClass: "demo-ruleForm",
          attrs: {
            model: _vm.ruleForm2,
            "status-icon": "",
            rules: _vm.rules2,
            "label-width": "100px"
          }
        },
        [
          _c(
            "el-form-item",
            { attrs: { label: "用户名", prop: "username" } },
            [
              _c("el-input", {
                model: {
                  value: _vm.ruleForm2.username,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "username", $$v)
                  },
                  expression: "ruleForm2.username"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { prop: "email", label: "邮箱" } },
            [
              _c("el-input", {
                attrs: { type: "email" },
                model: {
                  value: _vm.ruleForm2.email,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "email", $$v)
                  },
                  expression: "ruleForm2.email"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "密码", prop: "password" } },
            [
              _c("el-input", {
                attrs: { type: "password", autocomplete: "off" },
                model: {
                  value: _vm.ruleForm2.password,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "password", $$v)
                  },
                  expression: "ruleForm2.password"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "确认密码", prop: "checkPass" } },
            [
              _c("el-input", {
                attrs: { type: "password", autocomplete: "off" },
                model: {
                  value: _vm.ruleForm2.checkPass,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "checkPass", $$v)
                  },
                  expression: "ruleForm2.checkPass"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "性别", prop: "gendar" } },
            [
              _c(
                "el-radio-group",
                {
                  model: {
                    value: _vm.ruleForm2.gendar,
                    callback: function($$v) {
                      _vm.$set(_vm.ruleForm2, "gendar", $$v)
                    },
                    expression: "ruleForm2.gendar"
                  }
                },
                [
                  _c("el-radio", { attrs: { label: "男", value: "0" } }),
                  _vm._v(" "),
                  _c("el-radio", { attrs: { label: "女", value: "1" } })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            [
              _c(
                "el-button",
                {
                  staticClass: "registerbtn",
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.submitForm("ruleForm2")
                    }
                  }
                },
                [_vm._v("提交")]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "message" }, [
                _c("p", [
                  _vm._v("已有账号? "),
                  _c("a", { attrs: { href: "#/login" } }, [_vm._v("点击登录")]),
                  _vm._v(".")
                ])
              ])
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("h1", [
      _c("img", { attrs: { src: __webpack_require__(7), alt: "" } })
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8f8a1d9a", esExports)
  }
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("79a988a6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-47323bf2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-47323bf2\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./index.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", "", {"version":3,"sources":[],"names":[],"mappings":"","file":"index.vue","sourceRoot":""}]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4baf3d32", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-227179ae\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./list.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-227179ae\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./list.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.list{\n}\n.list .item.star{\n}\n.list .item.star span{\n\t\tcolor: #0074D9;\n}\n.list a{\n\t\ttext-decoration: none;\n\t\tdisplay: inline-block;\n\t\tcolor: #808080;\n}\n.list a:hover{\n\t\tcolor: #0074D9;\n}\n.list .text {\n\tfont-size: 14px;\n}\n.list .release {\n\tfloat: right;\n\ttransform: translateY(-10px);\n}\n.list div.el-card__header{\n\tpadding: 15px;\n\tpadding-left: 20px;\n}\n.list div.el-card__body{\n\tpadding: 5px;\n\tpadding-left: 20px;\n}\n.list .clearfix{\n\theight: 20px;\n}\n.clearfix:before,\n.clearfix:after {\n\tdisplay: table;\n\tcontent: \"\";\n}\n.clearfix:after {\n\tclear: both\n}\n.box-card {\n\twidth: 100%;\n}\n.list .content{\n\ttext-overflow:ellipsis;\n\toverflow: hidden;\n\twhite-space:nowrap;\n\tpadding-right: 300px;\n}\n.list p.ps{\n\tmargin: 10px;\n\tfont-size: 12px;\n\ttext-align: right;\n}\n.list .paging{\n\tmargin: 30px;\n\tfloat: right;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/list.vue"],"names":[],"mappings":";AA6JA;CAEA;AACA;CAEA;AACA;EACA,eAAA;CACA;AACA;EACA,sBAAA;EACA,sBAAA;EACA,eAAA;CACA;AACA;EACA,eAAA;CACA;AACA;CACA,gBAAA;CACA;AAEA;CACA,aAAA;CACA,6BAAA;CACA;AACA;CACA,cAAA;CACA,mBAAA;CACA;AACA;CACA,aAAA;CACA,mBAAA;CACA;AACA;CACA,aAAA;CACA;AACA;;CAEA,eAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA;AAEA;CACA,YAAA;CACA;AACA;CACA,uBAAA;CACA,iBAAA;CACA,mBAAA;CACA,qBAAA;CACA;AACA;CACA,aAAA;CACA,gBAAA;CACA,kBAAA;CACA;AACA;CACA,aAAA;CACA,aAAA;CACA","file":"list.vue","sourcesContent":["<template>\n\t<el-main class=\"list\">\r\n\t\t<el-card class=\"box-card\" >\r\n\t\t\t<div slot=\"header\" class=\"clearfix\">\r\n\t\t\t\t<el-dropdown @command=\"handleCommand\" style=\"text-align: center;\">\r\n\t\t\t\t\t<span class=\"el-dropdown-link\">\r\n\t\t\t\t\t\t{{topicclass}}<i class=\"el-icon-arrow-down el-icon--right\"></i>\r\n\t\t\t\t\t</span>\r\n\t\t\t\t\t<el-dropdown-menu slot=\"dropdown\">\r\n\t\t\t\t\t\t<el-dropdown-item command=\"\">全部</el-dropdown-item>\r\n\t\t\t\t\t\t<el-dropdown-item command=\"technology\">技术</el-dropdown-item>\r\n\t\t\t\t\t\t<el-dropdown-item command=\"literature\">文学</el-dropdown-item>\r\n\t\t\t\t\t\t<el-dropdown-item command=\"Sports\">体育</el-dropdown-item>\r\n\t\t\t\t\t\t<el-dropdown-item command=\"metaphysics\">玄学</el-dropdown-item>\r\n\t\t\t\t\t\t<el-dropdown-item command=\"entertainment\">娱乐</el-dropdown-item>\r\n\t\t\t\t\t</el-dropdown-menu>\r\n\t\t\t\t</el-dropdown>\r\n\t\t\t\t<el-button \r\n\t\t\t\t\tclass=\"release\" \r\n\t\t\t\t\ttype=\"primary\" \r\n\t\t\t\t\t@click = \"gorelease\"\r\n\t\t\t\t\ticon=\"el-icon-edit\">\r\n\t\t\t\t\t发布\r\n\t\t\t\t</el-button>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"text item\" v-for=\"(topic,index) in topics\" :key=\"index\">\r\n\t\t\t\t<div v-show=\"topics[0]\">\r\n\t\t\t\t\t<h3>\r\n\t\t\t\t\t\t<a :href=\"`#/details/${topic._id}`\">{{topic.title}}</a> \r\n\t\t\t\t\t\t<el-button \r\n\t\t\t\t\t\t\tsize=\"mini\"\r\n\t\t\t\t\t\t\tstyle=\"color: #888;\"\r\n\t\t\t\t\t\t\tdisabled>\r\n\t\t\t\t\t\t\t{{ topic.topictype }}\r\n\t\t\t\t\t\t</el-button>\r\n\t\t\t\t\t\t<el-badge :value=\"topic.stars.length\" :max=\"99\" class=\"item star\" type=\"warning\">\r\n\t\t\t\t\t\t\t<el-button size=\"mini\"><span class=\"el-icon-star-on\"></span></el-button>\r\n\t\t\t\t\t\t</el-badge>\r\n\t\t\t\t\t</h3>\r\n\t\t\t\t\t<p class=\"content\">{{ topic.content }}</p>\r\n\t\t\t\t\t<p class=\"ps\">\r\n\t\t\t\t\t\t 发布时间 : {{ topic.create_time }}\r\n\t\t\t\t\t</p>\r\n\t\t\t\t\t<hr/>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t\t<div class=\"block\">\r\n    <el-pagination\r\n\t\t\tv-show=\"topics[0]\"\r\n\t\t\tclass=\"paging\"\r\n      @size-change=\"handleSizeChange\"\r\n      @current-change=\"handleCurrentChange\"\r\n      :current-page=\"currentPage\"\r\n      :page-sizes=\"[5, 10, 20, 30]\"\r\n      :page-size=\"pagesize\"\r\n      layout=\"total, sizes, prev, pager, next, jumper\"\r\n      :total=\"alllength\">\r\n    </el-pagination>\r\n\t\t<h3 style=\"text-align: center;\" v-show=\"!topics[0]\">还没有相关话题....\r\n\t\t\t<a href=\"\" @click.prevent=\"gorelease\">去发布?</a>\r\n\t\t</h3>\r\n  </div>\r\n\t</el-main>\n</template>\n\n<script>\n\texport default {\n\t\tdata() {\n\t\t\treturn {\n\t\t\t\ttopics : [],\r\n        currentPage : 1,\r\n\t\t\t\tpagesize : 5,\r\n\t\t\t\talllength : 1,\r\n\t\t\t\ttopictype : '',\r\n\t\t\t\tuser : null\n\t\t\t};\n\t\t},\r\n\t\tmethods:{\r\n\t\t\thandleSizeChange(val) {\r\n//         console.log(`每页 ${val} 条`);\r\n// \t\t\t\tconsole.log(this.currentPage)\r\n\t\t\t\tthis.pagesize = val\r\n\t\t\t\tthis.getlist(`http://127.0.0.1:3000/topics?\r\n\t\t\t\tpage=${ this.currentPage }&size=${this.pagesize}&topictype=${this.topictype}`)\r\n      },\r\n      handleCurrentChange(val) {\r\n//         console.log(`当前页: ${val}`);\r\n// \t\t\t\tconsole.log(this.pagesize)\r\n\t\t\t\tthis.currentPage = val\r\n\t\t\t\tthis.getlist(`http://127.0.0.1:3000/topics?\r\n\t\t\t\tpage=${ val }&size=${this.pagesize}&topictype=${this.topictype}`)\r\n      },\r\n\t\t\tasync getlist(url){\r\n\t\t\t\tconst {data:resdata} = await axios.get(url),\r\n\t\t\t\ttopicdata = resdata.data\r\n\t\t\t\ttopicdata.forEach(function(item,i){\r\n\t\t\t\t\tswitch(item.topictype){\r\n\t\t\t\t\t\tcase 'technology' : item.topictype = '技术'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'literature' : item.topictype = '文学'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'Sports' : item.topictype = '体育'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'entertainment' : item.topictype = '娱乐'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'metaphysics' : item.topictype = '玄学'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tdefault : item.topictype = '未知'\r\n\t\t\t\t\t}\r\n\t\t\t\t})\r\n\t\t\t\tthis.topics = topicdata\r\n\t\t\t\tthis.alllength = resdata.alllength\r\n\t\t\t},\r\n\t\t\thandleCommand(command) {\r\n        this.topictype = command\r\n\t\t\t\tthis.currentPage = 1\r\n\t\t\t\tthis.getlist(`http://127.0.0.1:3000/topics?\r\n\t\t\t\tpage=${ this.currentPage }&size=${this.pagesize}&topictype=${this.topictype}`)\r\n      },\r\n\t\t\tasync gorelease(){\r\n\t\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\t// console.log(data.state)\r\n\t\t\t\tif(!data.state){\r\n\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t\tthis.user = data.state\r\n\t\t\t\tthis.$router.push('/release')\r\n\t\t\t}\r\n\t\t},\r\n\t\tasync created(){\r\n\t\t\tthis.getlist('http://127.0.0.1:3000/topics')\r\n\t\t},\r\n\t\tcomputed:{\r\n\t\t\ttopicclass(){\r\n\t\t\t\tswitch(this.topictype){\r\n\t\t\t\t\tcase 'technology' : return '技术'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'literature' : return  '文学'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'Sports' : return  '体育'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'entertainment' : return  '娱乐'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'metaphysics' : return  '玄学'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tdefault : return  '全部'\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\n\t}\n</script>\n\n<style>\r\n\t.list{\r\n\t\t\r\n\t}\r\n\t.list .item.star{\r\n\t\t\r\n\t}\r\n\t.list .item.star span{\r\n\t\tcolor: #0074D9;\r\n\t}\r\n\t.list a{\r\n\t\ttext-decoration: none;\r\n\t\tdisplay: inline-block;\r\n\t\tcolor: #808080;\r\n\t}\r\n\t.list a:hover{\r\n\t\tcolor: #0074D9;\r\n\t}\n\t.list .text {\r\n\tfont-size: 14px;\r\n}\r\n\r\n.list .release {\r\n\tfloat: right;\r\n\ttransform: translateY(-10px);\r\n}\r\n.list div.el-card__header{\r\n\tpadding: 15px;\r\n\tpadding-left: 20px;\r\n}\r\n.list div.el-card__body{\r\n\tpadding: 5px;\r\n\tpadding-left: 20px;\r\n}\r\n.list .clearfix{\r\n\theight: 20px;\r\n}\r\n.clearfix:before,\r\n.clearfix:after {\r\n\tdisplay: table;\r\n\tcontent: \"\";\r\n}\r\n.clearfix:after {\r\n\tclear: both\r\n}\r\n\r\n.box-card {\r\n\twidth: 100%;\r\n}\r\n.list .content{\r\n\ttext-overflow:ellipsis;\r\n\toverflow: hidden;\r\n\twhite-space:nowrap;\r\n\tpadding-right: 300px;\r\n}\r\n.list p.ps{\r\n\tmargin: 10px;\r\n\tfont-size: 12px;\r\n\ttext-align: right;\r\n}\r\n.list .paging{\r\n\tmargin: 30px;\r\n\tfloat: right;\r\n}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "list" },
    [
      _c(
        "el-card",
        { staticClass: "box-card" },
        [
          _c(
            "div",
            {
              staticClass: "clearfix",
              attrs: { slot: "header" },
              slot: "header"
            },
            [
              _c(
                "el-dropdown",
                {
                  staticStyle: { "text-align": "center" },
                  on: { command: _vm.handleCommand }
                },
                [
                  _c("span", { staticClass: "el-dropdown-link" }, [
                    _vm._v("\n\t\t\t\t\t\t" + _vm._s(_vm.topicclass)),
                    _c("i", {
                      staticClass: "el-icon-arrow-down el-icon--right"
                    })
                  ]),
                  _vm._v(" "),
                  _c(
                    "el-dropdown-menu",
                    { attrs: { slot: "dropdown" }, slot: "dropdown" },
                    [
                      _c("el-dropdown-item", { attrs: { command: "" } }, [
                        _vm._v("全部")
                      ]),
                      _vm._v(" "),
                      _c(
                        "el-dropdown-item",
                        { attrs: { command: "technology" } },
                        [_vm._v("技术")]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-dropdown-item",
                        { attrs: { command: "literature" } },
                        [_vm._v("文学")]
                      ),
                      _vm._v(" "),
                      _c("el-dropdown-item", { attrs: { command: "Sports" } }, [
                        _vm._v("体育")
                      ]),
                      _vm._v(" "),
                      _c(
                        "el-dropdown-item",
                        { attrs: { command: "metaphysics" } },
                        [_vm._v("玄学")]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-dropdown-item",
                        { attrs: { command: "entertainment" } },
                        [_vm._v("娱乐")]
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "el-button",
                {
                  staticClass: "release",
                  attrs: { type: "primary", icon: "el-icon-edit" },
                  on: { click: _vm.gorelease }
                },
                [_vm._v("\n\t\t\t\t\t发布\n\t\t\t\t")]
              )
            ],
            1
          ),
          _vm._v(" "),
          _vm._l(_vm.topics, function(topic, index) {
            return _c("div", { key: index, staticClass: "text item" }, [
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.topics[0],
                      expression: "topics[0]"
                    }
                  ]
                },
                [
                  _c(
                    "h3",
                    [
                      _c("a", { attrs: { href: "#/details/" + topic._id } }, [
                        _vm._v(_vm._s(topic.title))
                      ]),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          staticStyle: { color: "#888" },
                          attrs: { size: "mini", disabled: "" }
                        },
                        [
                          _vm._v(
                            "\n\t\t\t\t\t\t\t" +
                              _vm._s(topic.topictype) +
                              "\n\t\t\t\t\t\t"
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-badge",
                        {
                          staticClass: "item star",
                          attrs: {
                            value: topic.stars.length,
                            max: 99,
                            type: "warning"
                          }
                        },
                        [
                          _c("el-button", { attrs: { size: "mini" } }, [
                            _c("span", { staticClass: "el-icon-star-on" })
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("p", { staticClass: "content" }, [
                    _vm._v(_vm._s(topic.content))
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "ps" }, [
                    _vm._v(
                      "\n\t\t\t\t\t\t 发布时间 : " +
                        _vm._s(topic.create_time) +
                        "\n\t\t\t\t\t"
                    )
                  ]),
                  _vm._v(" "),
                  _c("hr")
                ]
              )
            ])
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "block" },
        [
          _c("el-pagination", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.topics[0],
                expression: "topics[0]"
              }
            ],
            staticClass: "paging",
            attrs: {
              "current-page": _vm.currentPage,
              "page-sizes": [5, 10, 20, 30],
              "page-size": _vm.pagesize,
              layout: "total, sizes, prev, pager, next, jumper",
              total: _vm.alllength
            },
            on: {
              "size-change": _vm.handleSizeChange,
              "current-change": _vm.handleCurrentChange
            }
          }),
          _vm._v(" "),
          _c(
            "h3",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !_vm.topics[0],
                  expression: "!topics[0]"
                }
              ],
              staticStyle: { "text-align": "center" }
            },
            [
              _vm._v("还没有相关话题....\n\t\t\t"),
              _c(
                "a",
                {
                  attrs: { href: "" },
                  on: {
                    click: function($event) {
                      $event.preventDefault()
                      return _vm.gorelease($event)
                    }
                  }
                },
                [_vm._v("去发布?")]
              )
            ]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-227179ae", esExports)
  }
}

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_indexheader_vue__ = __webpack_require__(14);
/* unused harmony namespace reexport */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e961b702_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_indexheader_vue__ = __webpack_require__(47);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(45)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e961b702"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_indexheader_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_e961b702_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_indexheader_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/indexheader.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e961b702", Component.options)
  } else {
    hotAPI.reload("data-v-e961b702", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a736dff4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e961b702\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./indexheader.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e961b702\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./indexheader.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\t/* .indexheader{\n\t\tposition: fixed;\n\t\ttop: 0;\n\t\tleft: 0;\n\t\twidth: 100%;\n\t\tz-index: 10000;\n\t} */\na[data-v-e961b702]{\n\ttext-decoration: none;\n}\n.user[data-v-e961b702]{\n\tfloat: left;\n\twidth: 50px;\n}\n.user p[data-v-e961b702]{\n\tmargin: 0;\n\theight: 20px;\n\tline-height: 20px;\n\ttext-align: center;\n\tfont-size: 12px;\n}\n.portrait[data-v-e961b702]{\n\tdisplay: block;\n\tborder: 1px solid #ccc;\n\twidth: 35px;\n\theight: 35px;\n\tposition: relative;\n\tborder-radius: 50%;\n\toverflow: hidden;\n\tmargin: 0 auto;\n}\n.portrait img[data-v-e961b702]{\n\twidth: 35px;\n\theight: 35px;\n\tborder-radius: 50%;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/indexheader.vue"],"names":[],"mappings":";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;CAsGA;;;;;;KAMA;AACA;CACA,sBAAA;CACA;AACA;CACA,YAAA;CACA,YAAA;CACA;AACA;CACA,UAAA;CACA,aAAA;CACA,kBAAA;CACA,mBAAA;CACA,gBAAA;CACA;AACA;CACA,eAAA;CACA,uBAAA;CACA,YAAA;CACA,aAAA;CACA,mBAAA;CACA,mBAAA;CACA,iBAAA;CACA,eAAA;CACA;AACA;CACA,YAAA;CACA,aAAA;CACA,mBAAA;CACA,mBAAA;CACA,QAAA;CACA,OAAA;CACA","file":"indexheader.vue","sourcesContent":["<template>\r\n\t<div class=\"indexheader\">\r\n\t\t<el-menu :default-active=\"activeIndex2\"\r\n\t\t\tclass=\"el-menu-demo\"\r\n\t\t\tmode=\"horizontal\"\r\n\t\t\tbackground-color=\"#545c64\"\r\n\t\t\ttext-color=\"#fff\"\r\n\t\t\tactive-text-color=\"#ffd04b\">\r\n\t\t\t<el-menu-item index=\"1\"><a href=\"#/\">阅览大厅</a></el-menu-item>\r\n\t\t\t<el-submenu index=\"2\">\r\n\t\t\t\t<template slot=\"title\">我的工作台</template>\r\n\t\t\t\t<el-menu-item index=\"2-1\">选项1</el-menu-item>\r\n\t\t\t\t<el-menu-item index=\"2-2\">选项2</el-menu-item>\r\n\t\t\t\t<el-menu-item index=\"2-3\">选项3</el-menu-item>\r\n\t\t\t\t<el-submenu index=\"2-4\">\r\n\t\t\t\t\t<template slot=\"title\">选项4</template>\r\n\t\t\t\t\t<el-menu-item index=\"2-4-1\">选项1</el-menu-item>\r\n\t\t\t\t\t<el-menu-item index=\"2-4-2\">选项2</el-menu-item>\r\n\t\t\t\t\t<el-menu-item index=\"2-4-3\">选项3</el-menu-item>\r\n\t\t\t\t</el-submenu>\r\n\t\t\t</el-submenu>\r\n\t\t\t<el-menu-item index=\"6\" style=\"border-bottom: none; background-color: rgb(84,92,100);\">\r\n\t\t\t\t<div class=\"demo-input-suffix\">\r\n\t\t\t\t\t<el-input\r\n\t\t\t\t\t\tplaceholder=\"请输入标题\"\r\n\t\t\t\t\t\tprefix-icon=\"el-icon-search\"\r\n\t\t\t\t\t\tsize=\"small\"\r\n\t\t\t\t\t\tstyle=\"width: 200px; transform: translateY(-1px);\"\r\n\t\t\t\t\t\tv-model=\"keyword\">\r\n\t\t\t\t\t</el-input>\r\n\t\t\t\t\t<el-button\r\n\t\t\t\t\t\ttype=\"primary\"\r\n\t\t\t\t\t\tsize=\"small\" \r\n\t\t\t\t\t\t@click=\"querytitle\"\r\n\t\t\t\t\t\tstyle=\"\">\r\n\t\t\t\t\t\t搜索\r\n\t\t\t\t\t</el-button>\r\n\t\t\t\t</div>\r\n\t\t\t</el-menu-item>\r\n\t\t\t<el-menu-item style=\"float: right;\" index=\"4\" v-if=\"!login\">\r\n\t\t\t\t<el-button type=\"primary\" size=\"mini\"><a href=\"#/login\">登录</a></el-button>\r\n\t\t\t\t<el-button type=\"success\" size=\"mini\"><a href=\"#/register\">注册</a></el-button>\r\n\t\t\t</el-menu-item>\r\n\t\t\t<el-submenu index=\"5\" v-if=\"login\" style=\"float: right;\">\r\n\t\t\t\t<template slot=\"title\">\r\n\t\t\t\t\t<div class=\"user\">\r\n\t\t\t\t\t\t<a href=\"\" class=\"portrait\">\r\n\t\t\t\t\t\t\t<img :src=\"`http://127.0.0.1:3000${user.avatar}`\" alt=\"\">\r\n\t\t\t\t\t\t</a>\r\n\t\t\t\t\t\t<p> <span></span>{{user.username}}</p>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</template>\r\n\t\t\t\t<el-menu-item index=\"5-1\">\r\n\t\t\t\t\t<span class=\"el-icon-info\"> </span> \r\n\t\t\t\t\t<a :href=\"`#/user/${user._id}`\" style=\"color: white;\"> 个人主页</a>\r\n\t\t\t\t</el-menu-item>\r\n\t\t\t\t<el-menu-item index=\"5-2\"><span class=\"el-icon-document\"> </span> 我的话题</el-menu-item>\r\n\t\t\t\t<el-menu-item index=\"5-3\" @click=\"logout\"><span class=\"el-icon-error\"> </span> 退出登录</el-menu-item>\r\n\t\t\t</el-submenu>\r\n\t\t</el-menu>\r\n\t</div>\r\n</template>\r\n\r\n<script>\r\n\timport axios from 'axios'\r\n\taxios.defaults.withCredentials = true\r\n\texport default {\r\n    data() {\r\n      return {\r\n        activeIndex: '1',\r\n        activeIndex2: '1',\r\n\t\t\t\tlogin : false,\r\n\t\t\t\tuser : {},\r\n\t\t\t\tkeyword : ''\r\n      };\r\n    },\r\n    methods: {\r\n      async logout(){\r\n\t\t\t\tconst {data} = await axios.delete('http://127.0.0.1:3000/session')\r\n\t\t\t\tif(!data.state){\r\n\t\t\t\t\tthis.login = false\r\n\t\t\t\t\tthis.user = data.state\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tquerytitle(){\r\n\t\t\t\tthis.keyword.trim()\r\n\t\t\t\tif(this.keyword === '')\treturn this.$router.push('/')\r\n\t\t\t\tthis.$router.push('/listbytitle?keyword='+this.keyword)\r\n\t\t\t}\r\n    },\r\n\t\tasync created(){\r\n\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t// console.log(data.state)\r\n\t\t\tif(data.state){\r\n\t\t\t\tthis.login = true\r\n\t\t\t\tthis.user = data.state\r\n\t\t\t}\r\n\t\t}\r\n  }\r\n</script>\r\n\r\n<style scoped>\r\n\t/* .indexheader{\r\n\t\tposition: fixed;\r\n\t\ttop: 0;\r\n\t\tleft: 0;\r\n\t\twidth: 100%;\r\n\t\tz-index: 10000;\r\n\t} */\r\na{\r\n\ttext-decoration: none;\r\n}\r\n.user{\r\n\tfloat: left;\r\n\twidth: 50px;\r\n}\r\n.user p{\r\n\tmargin: 0;\r\n\theight: 20px;\r\n\tline-height: 20px;\r\n\ttext-align: center;\r\n\tfont-size: 12px;\r\n}\r\n.portrait{\r\n\tdisplay: block;\r\n\tborder: 1px solid #ccc;\r\n\twidth: 35px;\r\n\theight: 35px;\r\n\tposition: relative;\r\n\tborder-radius: 50%;\r\n\toverflow: hidden;\r\n\tmargin: 0 auto;\r\n}\r\n.portrait img{\r\n\twidth: 35px;\r\n\theight: 35px;\r\n\tborder-radius: 50%;\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n}\r\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "indexheader" },
    [
      _c(
        "el-menu",
        {
          staticClass: "el-menu-demo",
          attrs: {
            "default-active": _vm.activeIndex2,
            mode: "horizontal",
            "background-color": "#545c64",
            "text-color": "#fff",
            "active-text-color": "#ffd04b"
          }
        },
        [
          _c("el-menu-item", { attrs: { index: "1" } }, [
            _c("a", { attrs: { href: "#/" } }, [_vm._v("阅览大厅")])
          ]),
          _vm._v(" "),
          _c(
            "el-submenu",
            { attrs: { index: "2" } },
            [
              _c("template", { slot: "title" }, [_vm._v("我的工作台")]),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "2-1" } }, [
                _vm._v("选项1")
              ]),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "2-2" } }, [
                _vm._v("选项2")
              ]),
              _vm._v(" "),
              _c("el-menu-item", { attrs: { index: "2-3" } }, [
                _vm._v("选项3")
              ]),
              _vm._v(" "),
              _c(
                "el-submenu",
                { attrs: { index: "2-4" } },
                [
                  _c("template", { slot: "title" }, [_vm._v("选项4")]),
                  _vm._v(" "),
                  _c("el-menu-item", { attrs: { index: "2-4-1" } }, [
                    _vm._v("选项1")
                  ]),
                  _vm._v(" "),
                  _c("el-menu-item", { attrs: { index: "2-4-2" } }, [
                    _vm._v("选项2")
                  ]),
                  _vm._v(" "),
                  _c("el-menu-item", { attrs: { index: "2-4-3" } }, [
                    _vm._v("选项3")
                  ])
                ],
                2
              )
            ],
            2
          ),
          _vm._v(" "),
          _c(
            "el-menu-item",
            {
              staticStyle: {
                "border-bottom": "none",
                "background-color": "rgb(84,92,100)"
              },
              attrs: { index: "6" }
            },
            [
              _c(
                "div",
                { staticClass: "demo-input-suffix" },
                [
                  _c("el-input", {
                    staticStyle: {
                      width: "200px",
                      transform: "translateY(-1px)"
                    },
                    attrs: {
                      placeholder: "请输入标题",
                      "prefix-icon": "el-icon-search",
                      size: "small"
                    },
                    model: {
                      value: _vm.keyword,
                      callback: function($$v) {
                        _vm.keyword = $$v
                      },
                      expression: "keyword"
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      attrs: { type: "primary", size: "small" },
                      on: { click: _vm.querytitle }
                    },
                    [_vm._v("\n\t\t\t\t\t搜索\n\t\t\t\t")]
                  )
                ],
                1
              )
            ]
          ),
          _vm._v(" "),
          !_vm.login
            ? _c(
                "el-menu-item",
                { staticStyle: { float: "right" }, attrs: { index: "4" } },
                [
                  _c(
                    "el-button",
                    { attrs: { type: "primary", size: "mini" } },
                    [_c("a", { attrs: { href: "#/login" } }, [_vm._v("登录")])]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    { attrs: { type: "success", size: "mini" } },
                    [
                      _c("a", { attrs: { href: "#/register" } }, [
                        _vm._v("注册")
                      ])
                    ]
                  )
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.login
            ? _c(
                "el-submenu",
                { staticStyle: { float: "right" }, attrs: { index: "5" } },
                [
                  _c("template", { slot: "title" }, [
                    _c("div", { staticClass: "user" }, [
                      _c(
                        "a",
                        { staticClass: "portrait", attrs: { href: "" } },
                        [
                          _c("img", {
                            attrs: {
                              src: "http://127.0.0.1:3000" + _vm.user.avatar,
                              alt: ""
                            }
                          })
                        ]
                      ),
                      _vm._v(" "),
                      _c("p", [_c("span"), _vm._v(_vm._s(_vm.user.username))])
                    ])
                  ]),
                  _vm._v(" "),
                  _c("el-menu-item", { attrs: { index: "5-1" } }, [
                    _c("span", { staticClass: "el-icon-info" }),
                    _vm._v(" "),
                    _c(
                      "a",
                      {
                        staticStyle: { color: "white" },
                        attrs: { href: "#/user/" + _vm.user._id }
                      },
                      [_vm._v(" 个人主页")]
                    )
                  ]),
                  _vm._v(" "),
                  _c("el-menu-item", { attrs: { index: "5-2" } }, [
                    _c("span", { staticClass: "el-icon-document" }),
                    _vm._v(" 我的话题")
                  ]),
                  _vm._v(" "),
                  _c(
                    "el-menu-item",
                    { attrs: { index: "5-3" }, on: { click: _vm.logout } },
                    [
                      _c("span", { staticClass: "el-icon-error" }),
                      _vm._v(" 退出登录")
                    ]
                  )
                ],
                2
              )
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-e961b702", esExports)
  }
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("363e24ee", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3f2b56a7\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./release.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3f2b56a7\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./release.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.releaseconent{\r\n\t/* margin-top: 61px; */\n}\n.demo-ruleForm{\n}\n.nav{\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 20px;\n}\n.el-textarea__inner{\r\n\tmin-height: 250px !important;\n}\r\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/release.vue"],"names":[],"mappings":";AAoGA;CACA,uBAAA;CACA;AACA;CAEA;AACA;CACA,gBAAA;CACA,oBAAA;CACA;AACA;CACA,6BAAA;CACA","file":"release.vue","sourcesContent":["<template>\r\n\t<el-main class=\"releaseconent\">\r\n\t<el-form :model=\"ruleForm\" :rules=\"rules\" ref=\"ruleForm\" label-width=\"100px\" class=\"demo-ruleForm\">\r\n\t\t<el-breadcrumb separator=\"/\" class=\"nav\">\r\n\t\t\t<el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\r\n\t\t\t<el-breadcrumb-item><a href=\"#/release\">话题发布</a></el-breadcrumb-item>\r\n\t\t</el-breadcrumb>\r\n\t\t<hr/>\r\n\t\t<el-form-item label=\"话题分类\" prop=\"topictype\">\r\n\t\t\t<el-select v-model=\"ruleForm.topictype\" placeholder=\"请选择话题分类\">\r\n\t\t\t\t<el-option label=\"技术\" value=\"technology\"></el-option>\r\n\t\t\t\t<el-option label=\"文学\" value=\"literature\"></el-option>\r\n\t\t\t\t<el-option label=\"体育\" value=\"Sports\"></el-option>\r\n\t\t\t\t<el-option label=\"娱乐\" value=\"entertainment\"></el-option>\r\n\t\t\t\t<el-option label=\"玄学\" value=\"metaphysics\"></el-option>\r\n\t\t\t</el-select>\r\n\t\t</el-form-item>\r\n\t\t<el-form-item label=\"标题\" prop=\"title\">\r\n\t\t\t<el-input v-model=\"ruleForm.title\"></el-input>\r\n\t\t</el-form-item>\r\n\t\t<el-form-item label=\"话题内容\" prop=\"content\">\r\n\t\t\t<el-input type=\"textarea\" v-model=\"ruleForm.content\" cols=\"80\" class=\".textarea\"></el-input>\r\n\t\t\t<!-- <textarea name=\"\" id=\"\" cols=\"100\" rows=\"20\" v-model=\"ruleForm.desc\" class=\".textarea\"></textarea> -->\r\n\t\t</el-form-item>\r\n\t\t<el-form-item>\r\n\t\t\t<el-button type=\"primary\" @click=\"submitForm('ruleForm')\">发布</el-button>\r\n\t\t\t<el-button @click=\"resetForm('ruleForm')\">重置</el-button>\r\n\t\t</el-form-item>\r\n\t</el-form>\r\n\t</el-main>\r\n</template>\r\n\r\n<script>\r\n\timport axios from 'axios'\r\n\texport default {\r\n\t\tdata() {\r\n\t\t\treturn {\r\n\t\t\t\truleForm: {\r\n\t\t\t\t\ttitle: '',\r\n\t\t\t\t\ttopictype: '',\r\n\t\t\t\t\tcontent: ''\r\n\t\t\t\t},\r\n\t\t\t\trules: {\r\n\t\t\t\t\ttitle: [{\r\n\t\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\t\tmessage: '标题不能为空',\r\n\t\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\tmin: 2,\r\n\t\t\t\t\t\t\tmax: 30,\r\n\t\t\t\t\t\t\tmessage: '长度在 2 到 30 个字符',\r\n\t\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t],\r\n\t\t\t\t\ttopictype: [{\r\n\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\tmessage: '请选择话题类型',\r\n\t\t\t\t\t\ttrigger: 'change'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tcontent: [{\r\n\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\tmessage: '话题内容不能为空',\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}]\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t},\r\n\t\tmethods: {\r\n\t\t\tsubmitForm(formName) {\r\n\t\t\t\tthis.$refs[formName].validate(async (valid) => {\r\n\t\t\t\t\tif (valid) {\r\n\t\t\t\t\t\tconst {data:topicdata} = await axios.post('http://127.0.0.1:3000/topics',this.ruleForm)\r\n\t\t\t\t\t\tif(topicdata.err === \"没有权限\"){\r\n\t\t\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tif(!topicdata.err){\r\n\t\t\t\t\t\t\tthis.$message({\r\n\t\t\t\t\t\t\t\tmessage: '发布成功',\r\n\t\t\t\t\t\t\t\ttype: 'success'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t\tthis.$router.push('/')\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconsole.log('error submit!!');\r\n\t\t\t\t\t\treturn false;\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t},\r\n\t\t\tresetForm(formName) {\r\n\t\t\t\tthis.$refs[formName].resetFields();\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style>\r\n.releaseconent{\r\n\t/* margin-top: 61px; */\r\n}\r\n.demo-ruleForm{\r\n\t\r\n}\r\n.nav{\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 20px;\r\n}\r\n.el-textarea__inner{\r\n\tmin-height: 250px !important;\r\n}\r\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "releaseconent" },
    [
      _c(
        "el-form",
        {
          ref: "ruleForm",
          staticClass: "demo-ruleForm",
          attrs: {
            model: _vm.ruleForm,
            rules: _vm.rules,
            "label-width": "100px"
          }
        },
        [
          _c(
            "el-breadcrumb",
            { staticClass: "nav", attrs: { separator: "/" } },
            [
              _c("el-breadcrumb-item", { attrs: { to: { path: "/" } } }, [
                _vm._v("首页")
              ]),
              _vm._v(" "),
              _c("el-breadcrumb-item", [
                _c("a", { attrs: { href: "#/release" } }, [_vm._v("话题发布")])
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "话题分类", prop: "topictype" } },
            [
              _c(
                "el-select",
                {
                  attrs: { placeholder: "请选择话题分类" },
                  model: {
                    value: _vm.ruleForm.topictype,
                    callback: function($$v) {
                      _vm.$set(_vm.ruleForm, "topictype", $$v)
                    },
                    expression: "ruleForm.topictype"
                  }
                },
                [
                  _c("el-option", {
                    attrs: { label: "技术", value: "technology" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "文学", value: "literature" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "体育", value: "Sports" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "娱乐", value: "entertainment" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "玄学", value: "metaphysics" }
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "标题", prop: "title" } },
            [
              _c("el-input", {
                model: {
                  value: _vm.ruleForm.title,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm, "title", $$v)
                  },
                  expression: "ruleForm.title"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "话题内容", prop: "content" } },
            [
              _c("el-input", {
                staticClass: ".textarea",
                attrs: { type: "textarea", cols: "80" },
                model: {
                  value: _vm.ruleForm.content,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm, "content", $$v)
                  },
                  expression: "ruleForm.content"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            [
              _c(
                "el-button",
                {
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.submitForm("ruleForm")
                    }
                  }
                },
                [_vm._v("发布")]
              ),
              _vm._v(" "),
              _c(
                "el-button",
                {
                  on: {
                    click: function($event) {
                      _vm.resetForm("ruleForm")
                    }
                  }
                },
                [_vm._v("重置")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3f2b56a7", esExports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("23022b95", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8d64e93c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./details.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8d64e93c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./details.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.details{\n\t\t/* margin-top: 61px; */\n}\n.details a{\n\t\ttext-decoration: none;\n\t\tdisplay: inline-block;\n\t\tcolor: #808080;\n}\n.details a:hover{\n\t\tcolor: #0074D9;\n}\n.details .text {\n    font-size: 17px ;\n\t\ttext-indent: 2em;\n}\n.details .item {\n    margin-bottom: 18px;\n\t\toverflow: hidden;\n}\n.details .operation{\n\t\tmargin-top: 50px;\n}\n.clearfix:before,\n  .clearfix:after {\n    display: table;\n    content: \"\";\n}\n.clearfix:after {\n    clear: both\n}\n.box-card {\n  \twidth: 100%;\n}\n.details .title{\n\t\tfont-size: 30px;\n\t\tfont-weight: bolder;\n}\n.details .box-card div.el-card__header{\n\t\theight: 100px;\n\t\tline-height: 63px;\n\t\tposition: relative;\n}\nspan.author{\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\tbottom: 13px;\n\t\tright: 20px;\n\t\tfont-size: 15px;\n}\nspan.stars{\n\t\tdisplay: block;\n\t\tposition: absolute;\n\t\ttop: 18px;\n\t\tright: 20px;\n\t\tfont-size: 15px;\n\t\tcolor: #0074D9;\n\t\tcursor: pointer;\n}\nspan.create_time{\n\t\tdisplay: block;\n\t\theight: 0px;\n\t\tposition: absolute;\n\t\tbottom: 50px;\n\t\tright: 20px;\n\t\tfont-size: 12px;\n}\n.comment{\n\t\tmargin-top: 30px;\n}\n.details .comment .text{\n\t\tmargin-bottom: 0;\n\t\ttext-indent: 0;\n\t\toverflow: hidden;\n\t\tposition: relative;\n\t\tborder-bottom: 1px solid #ccc;\n\t\tpadding: 10px 0;\n\t\tpadding-bottom: 20px;\n}\n.details .comment .text a.avatar{\n\t\tdisplay: block;\n\t\twidth: 40px;\n\t\theight: 40px;\n\t\tborder-radius: 20px;\n\t\tfloat: left;\n}\n.details .comment .text a img{\n\t\tdisplay: block;\n\t\twidth: 40px;\n\t\theight: 40px;\n\t\tborder-radius: 20px;\n}\n.commentcontent{\n\t\twidth: 100%;\n\t\tpadding-left: 60px;\n}\n.commentcontent h6 ,p{\n\t\tmargin: 0;\n}\n.commentcontent p{\n\t\tmargin-top: 10px;\n\t\tfont-size: 14px;\n\t\ttext-indent: 0;\n\t\tfont-weight: bold;\n}\ndiv.demo-input-size{\n\t\tmargin-top: 30px;\n\t\tpadding-right: 54px;\n\t\tposition: relative;\n}\n.sendmessage{\n\t\tposition: absolute;\n\t\ttop: 0;\n\t\tright: 0;\n}\n.operation a{\n\t\tcolor: white;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/details.vue"],"names":[],"mappings":";AAiLA;EACA,uBAAA;CACA;AACA;EACA,sBAAA;EACA,sBAAA;EACA,eAAA;CACA;AACA;EACA,eAAA;CACA;AACA;IACA,iBAAA;EACA,iBAAA;CACA;AAEA;IACA,oBAAA;EACA,iBAAA;CACA;AACA;EACA,iBAAA;CACA;AACA;;IAEA,eAAA;IACA,YAAA;CACA;AACA;IACA,WAAA;CACA;AAEA;GACA,YAAA;CACA;AACA;EACA,gBAAA;EACA,oBAAA;CACA;AACA;EACA,cAAA;EACA,kBAAA;EACA,mBAAA;CACA;AACA;EACA,eAAA;EACA,mBAAA;EACA,aAAA;EACA,YAAA;EACA,gBAAA;CACA;AACA;EACA,eAAA;EACA,mBAAA;EACA,UAAA;EACA,YAAA;EACA,gBAAA;EACA,eAAA;EACA,gBAAA;CACA;AACA;EACA,eAAA;EACA,YAAA;EACA,mBAAA;EACA,aAAA;EACA,YAAA;EACA,gBAAA;CACA;AACA;EACA,iBAAA;CACA;AACA;EACA,iBAAA;EACA,eAAA;EACA,iBAAA;EACA,mBAAA;EACA,8BAAA;EACA,gBAAA;EACA,qBAAA;CACA;AACA;EACA,eAAA;EACA,YAAA;EACA,aAAA;EACA,oBAAA;EACA,YAAA;CACA;AACA;EACA,eAAA;EACA,YAAA;EACA,aAAA;EACA,oBAAA;CACA;AACA;EACA,YAAA;EACA,mBAAA;CACA;AACA;EACA,UAAA;CACA;AACA;EACA,iBAAA;EACA,gBAAA;EACA,eAAA;EACA,kBAAA;CACA;AACA;EACA,iBAAA;EACA,oBAAA;EACA,mBAAA;CACA;AACA;EACA,mBAAA;EACA,OAAA;EACA,SAAA;CACA;AACA;EACA,aAAA;CACA","file":"details.vue","sourcesContent":["<template>\r\n\t<el-main class=\"details\">\r\n\t\t<el-breadcrumb separator=\"/\" class=\"nav\">\r\n\t\t\t<el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\r\n\t\t\t<el-breadcrumb-item><a href=\"javascript:\">话题详情</a></el-breadcrumb-item>\r\n\t\t</el-breadcrumb>\r\n\t\t<hr/>\n\t\t<el-card class=\"box-card\">\r\n\t\t\t<div slot=\"header\" class=\"clearfix\">\r\n\t\t\t\t<span class=\"title\">{{ topic.title }}</span>\r\n\t\t\t\t<span class=\"author\">作者 : <a style=\"font-weight: bold;\" :href=\"`#/user/${author._id}`\">{{author.username}}</a></span>\r\n\t\t\t\t<span :class=\"star?'el-icon-star-off stars':'el-icon-star-on stars'\" @click=\"setstar\"> \r\n\t\t\t\t\t{{ stars }}\r\n\t\t\t\t</span>\r\n\t\t\t\t<span class=\"create_time\">创建时间 : {{topic.create_time}}</span>\r\n\t\t\t</div>\r\n\t\t\t<div class=\"text item\">\r\n\t\t\t\t<p>\r\n\t\t\t\t\t{{topic.content}}\r\n\t\t\t\t</p>\r\n\t\t\t\t<div class=\"operation\" v-if=\"operation\" style=\"float: right;\">\r\n\t\t\t\t\t<el-button type=\"primary\" icon=\"el-icon-edit-outline\" size=\"mini\">\r\n\t\t\t\t\t\t<a :href=\"`#/topicedit/${topic._id}`\">编辑</a>\r\n\t\t\t\t\t</el-button>\r\n\t\t\t\t\t<el-button type=\"danger\" icon=\"el-icon-delete\" size=\"mini\">\r\n\t\t\t\t\t\t<a href=\"javascript:\" :data-id=\"topic._id\" @click=\"deletetopic\">删除</a>\r\n\t\t\t\t\t</el-button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t\t<el-card class=\"box-card comment\" v-show=\"comments[0]\">\r\n\t\t\t<div class=\"text item\" v-for=\"(comment,index) in comments\" :key=\"index\">\r\n\t\t\t\t<a :href=\"`#/user/${comment.user._id}`\" class=\"avatar\"><img :src=\"`http://127.0.0.1:3000${comment.user.avatar}`\" alt=\"\"></a>\r\n\t\t\t\t<div class=\"commentcontent\">\r\n\t\t\t\t\t<h6>\r\n\t\t\t\t\t\t用户 : <a :href=\"`#/user/${comment.user._id}`\"> {{ comment.user.username }}</a>&nbsp; &nbsp;\r\n\t\t\t\t\t\t<span> {{ comment.create_time }}</span>\r\n\t\t\t\t\t</h6>\r\n\t\t\t\t\t<p>{{ comment.content }}</p>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t\t<el-card class=\"box-card\" v-show=\"!comments[0]\">\r\n\t\t\t<div class=\"text item\">\r\n\t\t\t\t<h5 style=\"text-align: center;\">暂时还没人留言...........</h5>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t\t<div class=\"demo-input-size\">\r\n\t\t\t<el-input\r\n\t\t\t\tplaceholder=\"发表你的看法...\"\r\n\t\t\t\tsuffix-icon=\"el-icon-date\"\r\n\t\t\t\tv-model=\"nwemessage\">\r\n\t\t\t</el-input>\r\n\t\t\t<el-button \r\n\t\t\t\ttype=\"primary\" \r\n\t\t\t\ticon=\"el-icon-edit\" \r\n\t\t\t\tclass=\"sendmessage\"\r\n\t\t\t\t@click=\"sendmessage\">\r\n\t\t\t</el-button>\r\n\t\t</div>\r\n\t</el-main>\n</template>\n\n<script>\r\n\timport axios from 'axios'\n\texport default {\n\t\tdata() {\n\t\t\treturn {\n\t\t\t\ttopic : {},\r\n\t\t\t\tauthor : {},\r\n\t\t\t\tcomments : [],\r\n\t\t\t\tnwemessage : '',\r\n\t\t\t\toperation : false,\r\n\t\t\t\tstars : 0,\r\n\t\t\t\tstar : true\n\t\t\t};\n\t\t},\r\n\t\tasync created(){\r\n\t\t\t// console.log(this.$route.params)\r\n\t\t\tlet currentuser_id = ''\r\n\t\t\tconst {id} = this.$route.params\r\n\t\t\tconst {data : topic} = await axios.get('http://127.0.0.1:3000/topics/details?_id='+id)\r\n\t\t\tconst {data : author} = await axios.get('http://127.0.0.1:3000/users?_id='+topic.user_id)\r\n\t\t\tif(!author.err){\r\n\t\t\t\tthis.author = author[0]\r\n\t\t\t\tconst {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\tif(currentuser.state){\r\n\t\t\t\t\tcurrentuser_id = currentuser.state._id\r\n\t\t\t\t\tif(this.author._id === currentuser.state._id){\r\n\t\t\t\t\t\tthis.operation = true\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\tif(!topic.err){\r\n\t\t\t\tthis.topic = topic\r\n\t\t\t}\r\n\t\t\tthis.getcomments()\r\n\t\t\tthis.stars = this.topic.stars.length\r\n\t\t\tif(currentuser_id){\r\n\t\t\t\t// console.log(this.stars)\r\n\t\t\t\tthis.star = this.topic.stars.indexOf(currentuser_id) === -1 ? true : false\r\n\t\t\t\t// console.log(this.stars.indexOf(currentuser_id))\r\n\t\t\t}\r\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tasync deletetopic(e){\r\n\t\t\t\tconst id = e.target.dataset[\"id\"]\r\n\t\t\t\tconst {data:topicdata} = await axios.delete(`http://127.0.0.1:3000/topics/${id}`)\r\n\t\t\t\tif(topicdata.err === \"没有权限\"){\r\n\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t\tif(!topicdata.err){\r\n\t\t\t\t\tthis.$message({\r\n\t\t\t\t\t\tmessage: '删除成功',\r\n\t\t\t\t\t\ttype: 'success',\r\n\t\t\t\t\t})\r\n\t\t\t\t\tthis.$router.go(-1)\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tasync getcomments(){\r\n\t\t\t\tconst {id} = this.$route.params \r\n\t\t\t\tconst {data : comments} = await axios.get('http://127.0.0.1:3000/comments?article_id='+id)\r\n\t\t\t\tif(!comments.err){\r\n\t\t\t\t\tthis.comments = comments\r\n\t\t\t\t\t// console.log(this.comments)\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tasync sendmessage(){\r\n\t\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\t// console.log(data.state)\r\n\t\t\t\tif(!data.state){\r\n\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\tmessage: '请先登录!',\r\n\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t\tconst {id} = this.$route.params \r\n\t\t\t\tconst {data : comment} = await axios.post('http://127.0.0.1:3000/comments',{\r\n\t\t\t\t\tcontent : this.nwemessage,\r\n\t\t\t\t\tarticle_id : id\r\n\t\t\t\t})\r\n\t\t\t\tif(!comment.err){\r\n\t\t\t\t\tthis.nwemessage = ''\r\n\t\t\t\t\tthis.getcomments()\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tasync setstar(){\r\n\t\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\t// console.log(data.state)\r\n\t\t\t\tif(!data.state){\r\n\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t\tconst user_id = data.state._id\r\n\t\t\t\tlet stars = this.topic.stars\r\n\t\t\t\tconst star_idx = stars.indexOf(user_id)\r\n\t\t\t\tif(star_idx === -1){\r\n\t\t\t\t\tstars.push(user_id)\r\n\t\t\t\t} else {\r\n\t\t\t\t\tstars.splice(star_idx,1)\r\n\t\t\t\t}\r\n\t\t\t\tconst {data : newtopic} = await axios.patch(`http://127.0.0.1:3000/topics/star/${this.topic._id}`,{stars : stars})\r\n\t\t\t\tif(!newtopic.err){\r\n\t\t\t\t\tthis.stars = stars.length\r\n\t\t\t\t\tthis.star = this.star ? false : true\r\n\t\t\t\t}\r\n\t\t\t} \r\n\t\t}\n\t}\n</script>\n\n<style>\r\n\t.details{\r\n\t\t/* margin-top: 61px; */\r\n\t}\r\n\t.details a{\r\n\t\ttext-decoration: none;\r\n\t\tdisplay: inline-block;\r\n\t\tcolor: #808080;\r\n\t}\r\n\t.details a:hover{\r\n\t\tcolor: #0074D9;\r\n\t}\n .details .text {\r\n    font-size: 17px ;\r\n\t\ttext-indent: 2em;\r\n  }\r\n\r\n  .details .item {\r\n    margin-bottom: 18px;\r\n\t\toverflow: hidden;\r\n  }\r\n\t.details .operation{\r\n\t\tmargin-top: 50px;\r\n\t}\r\n  .clearfix:before,\r\n  .clearfix:after {\r\n    display: table;\r\n    content: \"\";\r\n  }\r\n  .clearfix:after {\r\n    clear: both\r\n  }\r\n\r\n  .box-card {\r\n  \twidth: 100%;\r\n  }\r\n\t.details .title{\r\n\t\tfont-size: 30px;\r\n\t\tfont-weight: bolder;\r\n\t}\r\n\t.details .box-card div.el-card__header{\r\n\t\theight: 100px;\r\n\t\tline-height: 63px;\r\n\t\tposition: relative;\r\n\t}\r\n\tspan.author{\r\n\t\tdisplay: block;\r\n\t\tposition: absolute;\r\n\t\tbottom: 13px;\r\n\t\tright: 20px;\r\n\t\tfont-size: 15px;\r\n\t}\r\n\tspan.stars{\r\n\t\tdisplay: block;\r\n\t\tposition: absolute;\r\n\t\ttop: 18px;\r\n\t\tright: 20px;\r\n\t\tfont-size: 15px;\r\n\t\tcolor: #0074D9;\r\n\t\tcursor: pointer;\r\n\t}\r\n\tspan.create_time{\r\n\t\tdisplay: block;\r\n\t\theight: 0px;\r\n\t\tposition: absolute;\r\n\t\tbottom: 50px;\r\n\t\tright: 20px;\r\n\t\tfont-size: 12px;\r\n\t}\r\n\t.comment{\r\n\t\tmargin-top: 30px;\r\n\t}\r\n\t.details .comment .text{\r\n\t\tmargin-bottom: 0;\r\n\t\ttext-indent: 0;\r\n\t\toverflow: hidden;\r\n\t\tposition: relative;\r\n\t\tborder-bottom: 1px solid #ccc;\r\n\t\tpadding: 10px 0;\r\n\t\tpadding-bottom: 20px;\r\n\t}\r\n\t.details .comment .text a.avatar{\r\n\t\tdisplay: block;\r\n\t\twidth: 40px;\r\n\t\theight: 40px;\r\n\t\tborder-radius: 20px;\r\n\t\tfloat: left;\r\n\t}\r\n\t.details .comment .text a img{\r\n\t\tdisplay: block;\r\n\t\twidth: 40px;\r\n\t\theight: 40px;\r\n\t\tborder-radius: 20px;\r\n\t}\r\n\t.commentcontent{\r\n\t\twidth: 100%;\r\n\t\tpadding-left: 60px;\r\n\t}\r\n\t.commentcontent h6 ,p{\r\n\t\tmargin: 0;\r\n\t}\r\n\t.commentcontent p{\r\n\t\tmargin-top: 10px;\r\n\t\tfont-size: 14px;\r\n\t\ttext-indent: 0;\r\n\t\tfont-weight: bold;\r\n\t}\r\n\tdiv.demo-input-size{\r\n\t\tmargin-top: 30px;\r\n\t\tpadding-right: 54px;\r\n\t\tposition: relative;\r\n\t}\r\n\t.sendmessage{\r\n\t\tposition: absolute;\r\n\t\ttop: 0;\r\n\t\tright: 0;\r\n\t}\r\n\t.operation a{\r\n\t\tcolor: white;\r\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "details" },
    [
      _c(
        "el-breadcrumb",
        { staticClass: "nav", attrs: { separator: "/" } },
        [
          _c("el-breadcrumb-item", { attrs: { to: { path: "/" } } }, [
            _vm._v("首页")
          ]),
          _vm._v(" "),
          _c("el-breadcrumb-item", [
            _c("a", { attrs: { href: "javascript:" } }, [_vm._v("话题详情")])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c("el-card", { staticClass: "box-card" }, [
        _c(
          "div",
          {
            staticClass: "clearfix",
            attrs: { slot: "header" },
            slot: "header"
          },
          [
            _c("span", { staticClass: "title" }, [
              _vm._v(_vm._s(_vm.topic.title))
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "author" }, [
              _vm._v("作者 : "),
              _c(
                "a",
                {
                  staticStyle: { "font-weight": "bold" },
                  attrs: { href: "#/user/" + _vm.author._id }
                },
                [_vm._v(_vm._s(_vm.author.username))]
              )
            ]),
            _vm._v(" "),
            _c(
              "span",
              {
                class: _vm.star
                  ? "el-icon-star-off stars"
                  : "el-icon-star-on stars",
                on: { click: _vm.setstar }
              },
              [_vm._v(" \n\t\t\t\t" + _vm._s(_vm.stars) + "\n\t\t\t")]
            ),
            _vm._v(" "),
            _c("span", { staticClass: "create_time" }, [
              _vm._v("创建时间 : " + _vm._s(_vm.topic.create_time))
            ])
          ]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "text item" }, [
          _c("p", [
            _vm._v("\n\t\t\t\t" + _vm._s(_vm.topic.content) + "\n\t\t\t")
          ]),
          _vm._v(" "),
          _vm.operation
            ? _c(
                "div",
                { staticClass: "operation", staticStyle: { float: "right" } },
                [
                  _c(
                    "el-button",
                    {
                      attrs: {
                        type: "primary",
                        icon: "el-icon-edit-outline",
                        size: "mini"
                      }
                    },
                    [
                      _c(
                        "a",
                        { attrs: { href: "#/topicedit/" + _vm.topic._id } },
                        [_vm._v("编辑")]
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      attrs: {
                        type: "danger",
                        icon: "el-icon-delete",
                        size: "mini"
                      }
                    },
                    [
                      _c(
                        "a",
                        {
                          attrs: {
                            href: "javascript:",
                            "data-id": _vm.topic._id
                          },
                          on: { click: _vm.deletetopic }
                        },
                        [_vm._v("删除")]
                      )
                    ]
                  )
                ],
                1
              )
            : _vm._e()
        ])
      ]),
      _vm._v(" "),
      _c(
        "el-card",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.comments[0],
              expression: "comments[0]"
            }
          ],
          staticClass: "box-card comment"
        },
        _vm._l(_vm.comments, function(comment, index) {
          return _c("div", { key: index, staticClass: "text item" }, [
            _c(
              "a",
              {
                staticClass: "avatar",
                attrs: { href: "#/user/" + comment.user._id }
              },
              [
                _c("img", {
                  attrs: {
                    src: "http://127.0.0.1:3000" + comment.user.avatar,
                    alt: ""
                  }
                })
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "commentcontent" }, [
              _c("h6", [
                _vm._v("\n\t\t\t\t\t用户 : "),
                _c("a", { attrs: { href: "#/user/" + comment.user._id } }, [
                  _vm._v(" " + _vm._s(comment.user.username))
                ]),
                _vm._v("   \n\t\t\t\t\t"),
                _c("span", [_vm._v(" " + _vm._s(comment.create_time))])
              ]),
              _vm._v(" "),
              _c("p", [_vm._v(_vm._s(comment.content))])
            ])
          ])
        }),
        0
      ),
      _vm._v(" "),
      _c(
        "el-card",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: !_vm.comments[0],
              expression: "!comments[0]"
            }
          ],
          staticClass: "box-card"
        },
        [
          _c("div", { staticClass: "text item" }, [
            _c("h5", { staticStyle: { "text-align": "center" } }, [
              _vm._v("暂时还没人留言...........")
            ])
          ])
        ]
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "demo-input-size" },
        [
          _c("el-input", {
            attrs: {
              placeholder: "发表你的看法...",
              "suffix-icon": "el-icon-date"
            },
            model: {
              value: _vm.nwemessage,
              callback: function($$v) {
                _vm.nwemessage = $$v
              },
              expression: "nwemessage"
            }
          }),
          _vm._v(" "),
          _c("el-button", {
            staticClass: "sendmessage",
            attrs: { type: "primary", icon: "el-icon-edit" },
            on: { click: _vm.sendmessage }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-8d64e93c", esExports)
  }
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("127ebe46", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b4b534a\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b4b534a\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./user.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.usercontent{\n\t\t/* margin-top: 61px; */\n}\n.usercontent .item.star{\n\t\ttransform: translateY(9px);\n}\n.usercontent .item.star span{\n\t\tcolor: #0074D9;\n}\n.usercontent a{\n\t\ttext-decoration: none;\n\t\tdisplay: inline-block;\n\t\tcolor: #808080;\n}\n.usercontent a:hover{\n\t\tcolor: #0074D9;\n}\n.usercontent .text {\n    font-size: 14px;\n}\n.usercontent .item {\n    margin-bottom: 18px;\n\t\tposition: relative;\n}\n.clearfix:before,\n  .clearfix:after {\n    display: table;\n    content: \"\";\n}\n.clearfix:after {\n    clear: both\n}\n.usercontent .box-card {\n    width: 100%;\n\t\tposition: relative;\n\t\toverflow: hidden;\n}\n.usercontent .clearfix a{\n\t\tdisplay: block;\n\t\twidth: 100px;\n\t\theight: 100px;\n\t\ttransform: translateX(530px);\n\t\tborder-radius: 50px;\n}\n.usercontent .clearfix a img{\n\t\twidth: 100%;\n\t\theight:100%;\n\t\tborder-radius: 50px;\n\t\tdisplay: block;\n}\n.usercontent .information{\n\t\tposition: absolute;\n\t\ttop: 0px;\n\t\tleft: 50%;\n}\n.usercontent .information p{\n\t\tmargin: 10px;\n}\n.usercontent .editbtn{\n\t\tposition: absolute;\n\t\tright: 400px;\n\t\ttop: 45px;\n}\n.usercontent .operation{\n\t\twidth: 200px;\n\t\tposition: absolute;\n\t\tright: 0px;\n\t\ttop: 50%;\n\t\ttransform: translateY(-50%);\n}\n.usercontent .operation a{\n\t\tdisplay: inline-block;\n\t\tcolor: white;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/user.vue"],"names":[],"mappings":";AAiIA;EACA,uBAAA;CACA;AACA;EACA,2BAAA;CACA;AACA;EACA,eAAA;CACA;AACA;EACA,sBAAA;EACA,sBAAA;EACA,eAAA;CACA;AACA;EACA,eAAA;CACA;AACA;IACA,gBAAA;CACA;AAEA;IACA,oBAAA;EACA,mBAAA;CACA;AACA;;IAEA,eAAA;IACA,YAAA;CACA;AACA;IACA,WAAA;CACA;AAEA;IACA,YAAA;EACA,mBAAA;EACA,iBAAA;CACA;AACA;EACA,eAAA;EACA,aAAA;EACA,cAAA;EACA,6BAAA;EACA,oBAAA;CACA;AACA;EACA,YAAA;EACA,YAAA;EACA,oBAAA;EACA,eAAA;CACA;AACA;EACA,mBAAA;EACA,SAAA;EACA,UAAA;CACA;AACA;EACA,aAAA;CACA;AACA;EACA,mBAAA;EACA,aAAA;EACA,UAAA;CACA;AACA;EACA,aAAA;EACA,mBAAA;EACA,WAAA;EACA,SAAA;EACA,4BAAA;CACA;AACA;EACA,sBAAA;EACA,aAAA;CACA","file":"user.vue","sourcesContent":["<template>\n\t<el-main class=\"usercontent\">\r\n\t\t<el-breadcrumb separator=\"/\" class=\"nav\">\r\n\t\t\t<el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\r\n\t\t\t<el-breadcrumb-item><a href=\"javascript:\">{{ edit?'我': user.username }}的个人中心</a></el-breadcrumb-item>\r\n\t\t</el-breadcrumb>\r\n\t\t<hr/>\r\n\t\t<el-card class=\"box-card\">\r\n\t\t\t<div slot=\"header\" class=\"clearfix\">\r\n\t\t\t\t<a href=\"javascript:\"><img :src=\"`http://127.0.0.1:3000${user.avatar}`\" alt=\"\"></a>\r\n\t\t\t\t<div class=\"information\">\r\n\t\t\t\t\t<p><el-tag><span class=\"el-icon-info\"> : {{ user.username }}</span></el-tag> </p>\r\n\t\t\t\t\t<p><el-tag><span class=\"el-icon-message\"> : {{ user.email }}</span></el-tag> </p>\r\n\t\t\t\t\t<p><el-tag><span class=\"el-icon-view\"> : {{ user.gendar?'女':'男' }}</span></el-tag> </p>\r\n\t\t\t\t</div>\r\n\t\t\t\t<div class=\"editbtn\" v-if=\"edit\">\r\n\t\t\t\t\t<el-button type=\"primary\" icon=\"el-icon-edit-outline\" @click=\"useredit\" circle></el-button>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<h3 style=\"text-align: center;\">{{ edit?'我':'他' }}的话题</h3>\r\n\t\t\t<hr/>\r\n\t\t\t<div class=\"text item\" v-for=\"(topic,index) in topics\" :key=\"index\">\r\n\t\t\t\t<div v-show=\"topics[0]\">\r\n\t\t\t\t\t<h3>\r\n\t\t\t\t\t\t<a :href=\"`#/details/${topic._id}`\">{{topic.title}}</a> \r\n\t\t\t\t\t\t<el-button \r\n\t\t\t\t\t\t\tsize=\"mini\"\r\n\t\t\t\t\t\t\tstyle=\"color: #888;\"\r\n\t\t\t\t\t\t\tdisabled>\r\n\t\t\t\t\t\t\t{{ topic.topictype }}\r\n\t\t\t\t\t\t</el-button>\r\n\t\t\t\t\t\t<el-badge :value=\"topic.stars.length\" :max=\"99\" class=\"item star\" type=\"warning\">\r\n\t\t\t\t\t\t\t<el-button size=\"mini\"><span class=\"el-icon-star-on\"></span></el-button>\r\n\t\t\t\t\t\t</el-badge>\r\n\t\t\t\t\t</h3>\r\n\t\t\t\t\t<p class=\"ps\">发布时间 : {{ topic.create_time }}</p>\r\n\t\t\t\t\t<div class=\"operation\" v-if=\"operation\">\r\n\t\t\t\t\t\t<div class=\"operation\" v-if=\"operation\" style=\"float: right;\">\r\n\t\t\t\t\t\t\t<el-button type=\"primary\" icon=\"el-icon-edit-outline\" size=\"mini\">\r\n\t\t\t\t\t\t\t\t<a :href=\"`#/topicedit/${topic._id}`\">编辑</a>\r\n\t\t\t\t\t\t\t</el-button>\r\n\t\t\t\t\t\t\t<el-button type=\"danger\" icon=\"el-icon-delete\" size=\"mini\">\r\n\t\t\t\t\t\t\t\t<a href=\"javascript:\" :data-id=\"topic._id\" @click=\"deletetopic\">删除</a>\r\n\t\t\t\t\t\t\t</el-button>\r\n\t\t\t\t\t\t</div>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t\t<hr/>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t</el-main>\n</template>\n\n<script>\n\texport default {\r\n    data() {\r\n      return {\r\n        activeName: 'second',\r\n\t\t\t\tuser : {},\r\n\t\t\t\tedit : false,\r\n\t\t\t\ttopics : [],\r\n\t\t\t\toperation : false\r\n      };\r\n    },\r\n    methods: {\r\n\t\t\tasync useredit(){\r\n\t\t\t\tconst {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\tif(!currentuser.state){\r\n\t\t\t\t\treturn\r\n\t\t\t\t}\r\n\t\t\t\tthis.$router.push(`/useredit/${currentuser.state._id}`)\r\n\t\t\t},\r\n\t\t\tasync deletetopic(e){\r\n\t\t\t\tconst id = e.target.dataset[\"id\"]\r\n\t\t\t\tconst {data:topicdata} = await axios.delete(`http://127.0.0.1:3000/topics/${id}`)\r\n\t\t\t\tif(topicdata.err === \"没有权限\"){\r\n\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t})\r\n\t\t\t\t}\r\n\t\t\t\tif(!topicdata.err){\r\n\t\t\t\t\tthis.$message({\r\n\t\t\t\t\t\tmessage: '删除成功',\r\n\t\t\t\t\t\ttype: 'success',\r\n\t\t\t\t\t})\r\n\t\t\t\t\tthis.getuserone()\r\n\t\t\t\t}\r\n\t\t\t},\r\n\t\t\tasync getuserone() {\r\n\t\t\t\tconst {id} = this.$route.params\r\n\t\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/users?_id='+id)\r\n\t\t\t\tthis.user = data[0]\r\n\t\t\t\tconst {data : usertopics} = await axios.get('http://127.0.0.1:3000/topics/usertopics?user_id='+id)\r\n\t\t\t\tif(!usertopics.err){\r\n\t\t\t\t\tusertopics.forEach(function(item,i){\r\n\t\t\t\t\t\tswitch(item.topictype){\r\n\t\t\t\t\t\t\tcase 'technology' : item.topictype = '技术'\r\n\t\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\t\tcase 'literature' : item.topictype = '文学'\r\n\t\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\t\tcase 'Sports' : item.topictype = '体育'\r\n\t\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\t\tcase 'entertainment' : item.topictype = '娱乐'\r\n\t\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\t\tcase 'metaphysics' : item.topictype = '玄学'\r\n\t\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\t\tdefault : item.topictype = '未知'\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t})\r\n\t\t\t\t\tthis.topics = usertopics\r\n\t\t\t\t}\r\n\t\t\t\tconst {data : currentuser} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\tif(!currentuser.state){\r\n\t\t\t\t\treturn\r\n\t\t\t\t}\r\n\t\t\t\tif(id === currentuser.state._id){\r\n\t\t\t\t\tthis.edit = true\r\n\t\t\t\t\tthis.operation = true\r\n\t\t\t\t}\r\n\t\t\t}\r\n    },\r\n\t\tcreated(){\r\n\t\t\tthis.getuserone()\r\n\t\t}\r\n  }\n</script>\n\n<style>\r\n\t.usercontent{\r\n\t\t/* margin-top: 61px; */\r\n\t}\r\n\t.usercontent .item.star{\r\n\t\ttransform: translateY(9px);\r\n\t}\r\n\t.usercontent .item.star span{\r\n\t\tcolor: #0074D9;\r\n\t}\r\n\t.usercontent a{\r\n\t\ttext-decoration: none;\r\n\t\tdisplay: inline-block;\r\n\t\tcolor: #808080;\r\n\t}\r\n\t.usercontent a:hover{\r\n\t\tcolor: #0074D9;\r\n\t}\n.usercontent .text {\r\n    font-size: 14px;\r\n  }\r\n\r\n  .usercontent .item {\r\n    margin-bottom: 18px;\r\n\t\tposition: relative;\r\n  }\r\n  .clearfix:before,\r\n  .clearfix:after {\r\n    display: table;\r\n    content: \"\";\r\n  }\r\n  .clearfix:after {\r\n    clear: both\r\n  }\r\n\r\n  .usercontent .box-card {\r\n    width: 100%;\r\n\t\tposition: relative;\r\n\t\toverflow: hidden;\r\n  }\r\n\t.usercontent .clearfix a{\r\n\t\tdisplay: block;\r\n\t\twidth: 100px;\r\n\t\theight: 100px;\r\n\t\ttransform: translateX(530px);\r\n\t\tborder-radius: 50px;\r\n\t}\r\n\t.usercontent .clearfix a img{\r\n\t\twidth: 100%;\r\n\t\theight:100%;\r\n\t\tborder-radius: 50px;\r\n\t\tdisplay: block;\r\n\t}\r\n\t.usercontent .information{\r\n\t\tposition: absolute;\r\n\t\ttop: 0px;\r\n\t\tleft: 50%;\r\n\t}\r\n\t.usercontent .information p{\r\n\t\tmargin: 10px;\r\n\t}\r\n\t.usercontent .editbtn{\r\n\t\tposition: absolute;\r\n\t\tright: 400px;\r\n\t\ttop: 45px;\r\n\t}\r\n\t.usercontent .operation{\r\n\t\twidth: 200px;\r\n\t\tposition: absolute;\r\n\t\tright: 0px;\r\n\t\ttop: 50%;\r\n\t\ttransform: translateY(-50%);\r\n\t}\r\n\t.usercontent .operation a{\r\n\t\tdisplay: inline-block;\r\n\t\tcolor: white;\r\n\t}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "usercontent" },
    [
      _c(
        "el-breadcrumb",
        { staticClass: "nav", attrs: { separator: "/" } },
        [
          _c("el-breadcrumb-item", { attrs: { to: { path: "/" } } }, [
            _vm._v("首页")
          ]),
          _vm._v(" "),
          _c("el-breadcrumb-item", [
            _c("a", { attrs: { href: "javascript:" } }, [
              _vm._v(_vm._s(_vm.edit ? "我" : _vm.user.username) + "的个人中心")
            ])
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c(
        "el-card",
        { staticClass: "box-card" },
        [
          _c(
            "div",
            {
              staticClass: "clearfix",
              attrs: { slot: "header" },
              slot: "header"
            },
            [
              _c("a", { attrs: { href: "javascript:" } }, [
                _c("img", {
                  attrs: {
                    src: "http://127.0.0.1:3000" + _vm.user.avatar,
                    alt: ""
                  }
                })
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "information" }, [
                _c(
                  "p",
                  [
                    _c("el-tag", [
                      _c("span", { staticClass: "el-icon-info" }, [
                        _vm._v(" : " + _vm._s(_vm.user.username))
                      ])
                    ])
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "p",
                  [
                    _c("el-tag", [
                      _c("span", { staticClass: "el-icon-message" }, [
                        _vm._v(" : " + _vm._s(_vm.user.email))
                      ])
                    ])
                  ],
                  1
                ),
                _vm._v(" "),
                _c(
                  "p",
                  [
                    _c("el-tag", [
                      _c("span", { staticClass: "el-icon-view" }, [
                        _vm._v(" : " + _vm._s(_vm.user.gendar ? "女" : "男"))
                      ])
                    ])
                  ],
                  1
                )
              ]),
              _vm._v(" "),
              _vm.edit
                ? _c(
                    "div",
                    { staticClass: "editbtn" },
                    [
                      _c("el-button", {
                        attrs: {
                          type: "primary",
                          icon: "el-icon-edit-outline",
                          circle: ""
                        },
                        on: { click: _vm.useredit }
                      })
                    ],
                    1
                  )
                : _vm._e()
            ]
          ),
          _vm._v(" "),
          _c("h3", { staticStyle: { "text-align": "center" } }, [
            _vm._v(_vm._s(_vm.edit ? "我" : "他") + "的话题")
          ]),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _vm._l(_vm.topics, function(topic, index) {
            return _c("div", { key: index, staticClass: "text item" }, [
              _c(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: _vm.topics[0],
                      expression: "topics[0]"
                    }
                  ]
                },
                [
                  _c(
                    "h3",
                    [
                      _c("a", { attrs: { href: "#/details/" + topic._id } }, [
                        _vm._v(_vm._s(topic.title))
                      ]),
                      _vm._v(" "),
                      _c(
                        "el-button",
                        {
                          staticStyle: { color: "#888" },
                          attrs: { size: "mini", disabled: "" }
                        },
                        [
                          _vm._v(
                            "\n\t\t\t\t\t\t" +
                              _vm._s(topic.topictype) +
                              "\n\t\t\t\t\t"
                          )
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "el-badge",
                        {
                          staticClass: "item star",
                          attrs: {
                            value: topic.stars.length,
                            max: 99,
                            type: "warning"
                          }
                        },
                        [
                          _c("el-button", { attrs: { size: "mini" } }, [
                            _c("span", { staticClass: "el-icon-star-on" })
                          ])
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("p", { staticClass: "ps" }, [
                    _vm._v("发布时间 : " + _vm._s(topic.create_time))
                  ]),
                  _vm._v(" "),
                  _vm.operation
                    ? _c("div", { staticClass: "operation" }, [
                        _vm.operation
                          ? _c(
                              "div",
                              {
                                staticClass: "operation",
                                staticStyle: { float: "right" }
                              },
                              [
                                _c(
                                  "el-button",
                                  {
                                    attrs: {
                                      type: "primary",
                                      icon: "el-icon-edit-outline",
                                      size: "mini"
                                    }
                                  },
                                  [
                                    _c(
                                      "a",
                                      {
                                        attrs: {
                                          href: "#/topicedit/" + topic._id
                                        }
                                      },
                                      [_vm._v("编辑")]
                                    )
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "el-button",
                                  {
                                    attrs: {
                                      type: "danger",
                                      icon: "el-icon-delete",
                                      size: "mini"
                                    }
                                  },
                                  [
                                    _c(
                                      "a",
                                      {
                                        attrs: {
                                          href: "javascript:",
                                          "data-id": topic._id
                                        },
                                        on: { click: _vm.deletetopic }
                                      },
                                      [_vm._v("删除")]
                                    )
                                  ]
                                )
                              ],
                              1
                            )
                          : _vm._e()
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _c("hr")
                ]
              )
            ])
          })
        ],
        2
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7b4b534a", esExports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(58);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("ae1d6cc8", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a234f59\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topicedit.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1a234f59\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./topicedit.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.topicedit{\r\n\t/* margin-top: 61px; */\n}\n.demo-ruleForm{\n}\n.nav{\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 20px;\n}\n.el-textarea__inner{\r\n\tmin-height: 250px !important;\n}\r\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/topicedit.vue"],"names":[],"mappings":";AA+GA;CACA,uBAAA;CACA;AACA;CAEA;AACA;CACA,gBAAA;CACA,oBAAA;CACA;AACA;CACA,6BAAA;CACA","file":"topicedit.vue","sourcesContent":["<template>\r\n\t<el-main class=\"topicedit\">\r\n\t<el-form :model=\"ruleForm\" :rules=\"rules\" ref=\"ruleForm\" label-width=\"100px\" class=\"demo-ruleForm\">\r\n\t\t<el-breadcrumb separator=\"/\" class=\"nav\">\r\n\t\t\t<el-breadcrumb-item :to=\"{ path: '/' }\">首页</el-breadcrumb-item>\r\n\t\t\t<el-breadcrumb-item><a href=\"#/release\">话题编辑</a></el-breadcrumb-item>\r\n\t\t</el-breadcrumb>\r\n\t\t<hr/>\r\n\t\t<el-form-item label=\"话题分类\" prop=\"topictype\">\r\n\t\t\t<el-select v-model=\"ruleForm.topictype\" placeholder=\"请选择话题分类\">\r\n\t\t\t\t<el-option label=\"技术\" value=\"technology\"></el-option>\r\n\t\t\t\t<el-option label=\"文学\" value=\"literature\"></el-option>\r\n\t\t\t\t<el-option label=\"体育\" value=\"Sports\"></el-option>\r\n\t\t\t\t<el-option label=\"娱乐\" value=\"entertainment\"></el-option>\r\n\t\t\t\t<el-option label=\"玄学\" value=\"metaphysics\"></el-option>\r\n\t\t\t</el-select>\r\n\t\t</el-form-item>\r\n\t\t<el-form-item label=\"标题\" prop=\"title\">\r\n\t\t\t<el-input v-model=\"ruleForm.title\"></el-input>\r\n\t\t</el-form-item>\r\n\t\t<el-form-item label=\"话题内容\" prop=\"content\">\r\n\t\t\t<el-input type=\"textarea\" v-model=\"ruleForm.content\" cols=\"80\" class=\".textarea\"></el-input>\r\n\t\t\t<!-- <textarea name=\"\" id=\"\" cols=\"100\" rows=\"20\" v-model=\"ruleForm.desc\" class=\".textarea\"></textarea> -->\r\n\t\t</el-form-item>\r\n\t\t<el-form-item>\r\n\t\t\t<el-button type=\"primary\" @click=\"submitForm('ruleForm')\">提交</el-button>\r\n\t\t</el-form-item>\r\n\t</el-form>\r\n\t</el-main>\r\n</template>\r\n\r\n<script>\r\n\timport axios from 'axios'\r\n\texport default {\r\n\t\tdata() {\r\n\t\t\treturn {\r\n\t\t\t\truleForm: {\r\n\t\t\t\t\ttitle: '',\r\n\t\t\t\t\ttopictype: '',\r\n\t\t\t\t\tcontent: ''\r\n\t\t\t\t},\r\n\t\t\t\trules: {\r\n\t\t\t\t\ttitle: [{\r\n\t\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\t\tmessage: '标题不能为空',\r\n\t\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t\t{\r\n\t\t\t\t\t\t\tmin: 2,\r\n\t\t\t\t\t\t\tmax: 30,\r\n\t\t\t\t\t\t\tmessage: '长度在 2 到 30 个字符',\r\n\t\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t],\r\n\t\t\t\t\ttopictype: [{\r\n\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\tmessage: '请选择话题类型',\r\n\t\t\t\t\t\ttrigger: 'change'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tcontent: [{\r\n\t\t\t\t\t\trequired: true,\r\n\t\t\t\t\t\tmessage: '话题内容不能为空',\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}]\r\n\t\t\t\t}\r\n\t\t\t};\r\n\t\t},\r\n\t\tmethods: {\r\n\t\t\tsubmitForm(formName) {\r\n\t\t\t\tconst {id} = this.$route.params\r\n\t\t\t\tthis.$refs[formName].validate(async (valid) => {\r\n\t\t\t\t\tif (valid) {\r\n\t\t\t\t\t\tconst {data:topicdata} = await axios.patch(`http://127.0.0.1:3000/topics/${id}`,this.ruleForm)\r\n\t\t\t\t\t\tif(topicdata.err === \"没有权限\"){\r\n\t\t\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\t\t\ttype: 'warning',\r\n\t\t\t\t\t\t\t\tcustomClass : 'message'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tif(!topicdata.err){\r\n\t\t\t\t\t\t\tthis.$message({\r\n\t\t\t\t\t\t\t\tmessage: '更新成功',\r\n\t\t\t\t\t\t\t\ttype: 'success'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t\tthis.$router.go(-1)\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconsole.log('error submit!!');\r\n\t\t\t\t\t\treturn false;\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t},\r\n\t\t\tresetForm(formName) {\r\n\t\t\t\tthis.$refs[formName].resetFields();\r\n\t\t\t}\r\n\t\t},\r\n\t\tasync created(){\r\n\t\t\tconst {id} = this.$route.params\r\n\t\t\tconst {data : topic} = await axios.get('http://127.0.0.1:3000/topics/details?_id='+id)\r\n\t\t\tif(topic.err){\r\n\t\t\t\treturn\r\n\t\t\t}\r\n\t\t\tthis.ruleForm.content = topic.content\r\n\t\t\tthis.ruleForm.title = topic.title\r\n\t\t\tthis.ruleForm.topictype = topic.topictype\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style>\r\n.topicedit{\r\n\t/* margin-top: 61px; */\r\n}\r\n.demo-ruleForm{\r\n\t\r\n}\r\n.nav{\r\n\tmargin-top: 0px;\r\n\tmargin-bottom: 20px;\r\n}\r\n.el-textarea__inner{\r\n\tmin-height: 250px !important;\r\n}\r\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "topicedit" },
    [
      _c(
        "el-form",
        {
          ref: "ruleForm",
          staticClass: "demo-ruleForm",
          attrs: {
            model: _vm.ruleForm,
            rules: _vm.rules,
            "label-width": "100px"
          }
        },
        [
          _c(
            "el-breadcrumb",
            { staticClass: "nav", attrs: { separator: "/" } },
            [
              _c("el-breadcrumb-item", { attrs: { to: { path: "/" } } }, [
                _vm._v("首页")
              ]),
              _vm._v(" "),
              _c("el-breadcrumb-item", [
                _c("a", { attrs: { href: "#/release" } }, [_vm._v("话题编辑")])
              ])
            ],
            1
          ),
          _vm._v(" "),
          _c("hr"),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "话题分类", prop: "topictype" } },
            [
              _c(
                "el-select",
                {
                  attrs: { placeholder: "请选择话题分类" },
                  model: {
                    value: _vm.ruleForm.topictype,
                    callback: function($$v) {
                      _vm.$set(_vm.ruleForm, "topictype", $$v)
                    },
                    expression: "ruleForm.topictype"
                  }
                },
                [
                  _c("el-option", {
                    attrs: { label: "技术", value: "technology" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "文学", value: "literature" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "体育", value: "Sports" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "娱乐", value: "entertainment" }
                  }),
                  _vm._v(" "),
                  _c("el-option", {
                    attrs: { label: "玄学", value: "metaphysics" }
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "标题", prop: "title" } },
            [
              _c("el-input", {
                model: {
                  value: _vm.ruleForm.title,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm, "title", $$v)
                  },
                  expression: "ruleForm.title"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "话题内容", prop: "content" } },
            [
              _c("el-input", {
                staticClass: ".textarea",
                attrs: { type: "textarea", cols: "80" },
                model: {
                  value: _vm.ruleForm.content,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm, "content", $$v)
                  },
                  expression: "ruleForm.content"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            [
              _c(
                "el-button",
                {
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.submitForm("ruleForm")
                    }
                  }
                },
                [_vm._v("提交")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-1a234f59", esExports)
  }
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(61);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("6e8060e6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4be215e5\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./useredit.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-4be215e5\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./useredit.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.useredit{\n\tpadding: 20px 300px;\n\tpadding-top: 10px;\n\tbackground-color: #ccc;\n\tpadding-bottom: 138px;\n}\n.useredit p{\n\tmargin: 0;\n}\n.useredit a{\n\ttext-decoration: none;\n\tcolor: #000;\n\tdisplay: inline-block;\n\tpadding: 0 5px;\n\tfont-size: 14px;\n}\n.useredit span:first-child a:hover{\n\tcolor: #0074D9;\n}\n.useredit span:last-child a{\n\tcolor: #fff;\n}\n.useredit .register {\n\twidth: 500px;\n\tpadding: 40px;\n\tpadding-right: 70px;\n\tmargin: 20px auto;\n\tborder: 1px solid #ccc;\n}\n.useredit .register h1{\n\ttext-align: center;\n\tmargin: 0;\n}\n.useredit .registerbtn{\n\twidth: 100%;\n}\n.useredit .message {\n\theight: 40px;\n\tmargin: 40px 0;\n\tpadding-left: 20px;\n  border: 1px solid #d8dee2;\n  border-radius: 5px;\n}\n.useredit .message p{\n\tpadding: 0;\n\tline-height: 40px;\n\tmargin: 0;\n}\n.useredit .avatar-uploader .el-upload {\n\tmargin-left: 50%;\n\ttransform: translateX(-50%);\n  border: 1px solid #409EFF;\n\tmargin-bottom: 20px;\n  border-radius: 6px;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n}\n.useredit .avatar-uploader .el-upload:hover {\n  border-color: #409EFF;\n}\n.useredit .avatar-uploader-icon {\n  font-size: 28px;\n  color: #8c939d;\n  width: 178px;\n  height: 178px;\n  line-height: 178px;\n  text-align: center;\n}\n.useredit .avatar {\n  width: 178px;\n  height: 178px;\n  display: block;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/useredit.vue"],"names":[],"mappings":";AAiKA;CACA,oBAAA;CACA,kBAAA;CACA,uBAAA;CACA,sBAAA;CACA;AACA;CACA,UAAA;CACA;AAEA;CACA,sBAAA;CACA,YAAA;CACA,sBAAA;CACA,eAAA;CACA,gBAAA;CACA;AACA;CACA,eAAA;CACA;AACA;CACA,YAAA;CACA;AACA;CACA,aAAA;CACA,cAAA;CACA,oBAAA;CACA,kBAAA;CACA,uBAAA;CACA;AACA;CACA,mBAAA;CACA,UAAA;CACA;AACA;CACA,YAAA;CACA;AACA;CACA,aAAA;CACA,eAAA;CACA,mBAAA;EACA,0BAAA;EACA,mBAAA;CACA;AACA;CACA,WAAA;CACA,kBAAA;CACA,UAAA;CACA;AACA;CACA,iBAAA;CACA,4BAAA;EACA,0BAAA;CACA,oBAAA;EACA,mBAAA;EACA,gBAAA;EACA,mBAAA;EACA,iBAAA;CACA;AACA;EACA,sBAAA;CACA;AACA;EACA,gBAAA;EACA,eAAA;EACA,aAAA;EACA,cAAA;EACA,mBAAA;EACA,mBAAA;CACA;AACA;EACA,aAAA;EACA,cAAA;EACA,eAAA;CACA","file":"useredit.vue","sourcesContent":["<template>\r\n\t<el-main class=\"useredit\">\r\n\t\t<p>\r\n\t\t\t<span @click=\"gouser\">\r\n\t\t\t\t<a href=\"javascript:\">个人中心</a>\r\n\t\t\t</span>\r\n\t\t\t<span>\r\n\t\t\t\t>\r\n\t\t\t\t<a href=\"javascript:\">资料修改</a>\r\n\t\t\t</span>\r\n\t\t</p>\r\n\t\t<hr/>\r\n\t\t<el-upload\r\n\t\t  class=\"avatar-uploader\"\r\n\t\t  action=\"http://localhost:3000/uploadimg\"\r\n\t\t  :show-file-list=\"false\"\r\n\t\t  :on-success=\"handleAvatarSuccess\"\r\n\t\t  :before-upload=\"beforeAvatarUpload\">\r\n\t\t  <img v-if=\"imageUrl\" :src=\"imageUrl\" class=\"avatar\">\r\n\t\t  <i v-else class=\"el-icon-plus avatar-uploader-icon\"></i>\r\n\t\t</el-upload>\r\n\t\t<el-form :model=\"ruleForm2\" status-icon :rules=\"rules2\" ref=\"ruleForm2\" label-width=\"100px\" class=\"demo-ruleForm\">\r\n\t\t\t<el-form-item label=\"用户名\" prop=\"username\">\r\n\t\t\t\t<el-input v-model=\"ruleForm2.username\"></el-input>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item label=\"性别\" prop=\"gendar\">\r\n\t\t\t\t<el-radio-group v-model=\"ruleForm2.gendar\">\r\n\t\t\t\t\t<el-radio label=\"男\" value=\"0\"></el-radio>\r\n\t\t\t\t\t<el-radio label=\"女\" value=\"1\"></el-radio>\r\n\t\t\t\t</el-radio-group>\r\n\t\t\t</el-form-item>\r\n\t\t\t<el-form-item>\r\n\t\t\t\t<el-button class=\"registerbtn\" type=\"primary\" @click=\"submitForm('ruleForm2')\">提交</el-button>\r\n\t\t\t</el-form-item>\r\n\t\t</el-form>\r\n\t</el-main>\r\n</template>\r\n\r\n<script>\r\n\timport axios from 'axios'\r\n\texport default {\r\n\t\tdata() {\r\n\t\t\tconst checkAge = (rule, value, callback) => {\r\n\t\t\t\tif (!value) {\r\n\t\t\t\t\treturn callback(new Error('用户名不能为空'));\r\n\t\t\t\t}\r\n\t\t\t\tsetTimeout(async () => {\r\n\t\t\t\t\tif (value.length < 2 || value.length > 8) {\r\n\t\t\t\t\t\tcallback(new Error('用户名必须在2-8位'));\r\n\t\t\t\t\t} else {\r\n\t\t\t\t\t\tconst res = await axios.get('http://127.0.0.1:3000/users?username='+value)\r\n\t\t\t\t\t\tif(res.data[0]){\r\n\t\t\t\t\t\t\tconst {id} = this.$route.params\r\n\t\t\t\t\t\t\tif(res.data[0]._id === id){\r\n\t\t\t\t\t\t\t\treturn callback()\r\n\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\treturn callback(new Error('该用户名已存在'))\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tcallback()\r\n\t\t\t\t\t}\r\n\t\t\t\t}, 200);\r\n\t\t\t};\r\n\t\t\tconst validategendar = (rule, value, callback) => {\r\n\t\t\t\tif (value === '') {\r\n\t\t\t\t\tcallback(new Error('请选择性别'));\r\n\t\t\t\t} else {\r\n\t\t\t\t\tcallback()\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\treturn {\r\n\t\t\t\truleForm2: {\r\n\t\t\t\t\tusername: '',\r\n\t\t\t\t\tgendar: '',\r\n\t\t\t\t\tavatar : ''\r\n\t\t\t\t},\r\n\t\t\t\trules2: {\r\n\t\t\t\t\tusername: [{\r\n\t\t\t\t\t\tvalidator: checkAge,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}],\r\n\t\t\t\t\tgendar: [{\r\n\t\t\t\t\t\tvalidator: validategendar,\r\n\t\t\t\t\t\ttrigger: 'blur'\r\n\t\t\t\t\t}]\r\n\t\t\t\t},\r\n\t\t\t\timageUrl : ''\r\n\t\t\t};\r\n\t\t},\r\n\t\tmethods: {\r\n\t\t\tgouser() {\r\n\t\t\t\tconsole.log(1)\r\n\t\t\t\tthis.$router.back()\r\n\t\t\t},\r\n\t\t\t handleAvatarSuccess(res, file) {\r\n\t\t\t  this.imageUrl = URL.createObjectURL(file.raw);\r\n\t\t\t\tthis.ruleForm2.avatar = res.data\r\n\t\t\t},\r\n\t\t\tbeforeAvatarUpload(file) {\r\n\t\t\t  const isJPG = file.type === 'image/jpeg';\r\n\t\t\t  const isLt2M = file.size / 1024 / 1024 < 2;\r\n\t\t\t\r\n\t\t\t  if (!isJPG) {\r\n\t\t\t    this.$message.error('上传头像图片只能是 JPG 格式!');\r\n\t\t\t  }\r\n\t\t\t  if (!isLt2M) {\r\n\t\t\t    this.$message.error('上传头像图片大小不能超过 2MB!');\r\n\t\t\t  }\r\n\t\t\t  return isJPG && isLt2M;\r\n\t\t\t},\r\n\t\t\tsubmitForm(formName) {\r\n\t\t\t\tthis.$refs[formName].validate(async (valid) => {\r\n\t\t\t\t\tif (valid) {\r\n\t\t\t\t\t\tconst {id} = this.$route.params\r\n\t\t\t\t\t\tconst {data:currentuser} = await axios.get('http://127.0.0.1:3000/session')\r\n\t\t\t\t\t\t// console.log(data.state)\r\n\t\t\t\t\t\tif(!currentuser.state){\r\n\t\t\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\t\t\tmessage: '请先登录',\r\n\t\t\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tif(id !== currentuser.state._id){\r\n\t\t\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\t\t\tmessage: '没有权限',\r\n\t\t\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tif (this.ruleForm2.gendar === '男') {\r\n\t\t\t\t\t\t\tthis.ruleForm2.gendar = 0\r\n\t\t\t\t\t\t} else {\r\n\t\t\t\t\t\t\tthis.ruleForm2.gendar = 1\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tif(!this.ruleForm2.avatar){\r\n\t\t\t\t\t\t\tdelete this.ruleForm2.avatar\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tconst {data} = await axios.patch(`http://127.0.0.1:3000/users/${id}`, this.ruleForm2)\r\n\t\t\t\t\t\tif(data.err){\r\n\t\t\t\t\t\t\treturn this.$message({\r\n\t\t\t\t\t\t\t\tmessage: '服务器繁忙',\r\n\t\t\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t\t\t})\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t\tthis.$message({\r\n\t\t\t\t\t\t\tmessage: '更新成功',\r\n\t\t\t\t\t\t\ttype: 'warning'\r\n\t\t\t\t\t\t})\r\n\t\t\t\t\t\tthis.$router.go(-1)\r\n\t\t\t\t\t}\r\n\t\t\t\t})\r\n\t\t\t}\r\n\t\t},\r\n\t\tasync created() {\r\n\t\t\tconst {id} = this.$route.params\r\n\t\t\tconst {data} = await axios.get('http://127.0.0.1:3000/users?_id='+id)\r\n\t\t\tthis.ruleForm2.username = data[0].username\r\n\t\t\tthis.ruleForm2.gendar = data[0].gendar === 0?'男':'女'\r\n\t\t}\r\n\t}\r\n</script>\r\n\r\n<style>\r\n\t.useredit{\r\n\t\tpadding: 20px 300px;\r\n\t\tpadding-top: 10px;\r\n\t\tbackground-color: #ccc;\r\n\t\tpadding-bottom: 138px;\r\n\t}\r\n\t.useredit p{\r\n\t\tmargin: 0;\r\n\t}\r\n\t\r\n\t.useredit a{\r\n\t\ttext-decoration: none;\r\n\t\tcolor: #000;\r\n\t\tdisplay: inline-block;\r\n\t\tpadding: 0 5px;\r\n\t\tfont-size: 14px;\r\n\t}\r\n\t.useredit span:first-child a:hover{\r\n\t\tcolor: #0074D9;\r\n\t}\r\n\t.useredit span:last-child a{\r\n\t\tcolor: #fff;\r\n\t}\r\n\t.useredit .register {\r\n\t\twidth: 500px;\r\n\t\tpadding: 40px;\r\n\t\tpadding-right: 70px;\r\n\t\tmargin: 20px auto;\r\n\t\tborder: 1px solid #ccc;\r\n\t}\r\n\t.useredit .register h1{\r\n\t\ttext-align: center;\r\n\t\tmargin: 0;\r\n\t}\r\n\t.useredit .registerbtn{\r\n\t\twidth: 100%;\r\n\t}\r\n\t.useredit .message {\r\n\t\theight: 40px;\r\n\t\tmargin: 40px 0;\r\n\t\tpadding-left: 20px;\r\n\t  border: 1px solid #d8dee2;\r\n\t  border-radius: 5px;\r\n\t}\r\n\t.useredit .message p{\r\n\t\tpadding: 0;\r\n\t\tline-height: 40px;\r\n\t\tmargin: 0;\r\n\t}\r\n\t.useredit .avatar-uploader .el-upload {\r\n\t\tmargin-left: 50%;\r\n\t\ttransform: translateX(-50%);\r\n\t  border: 1px solid #409EFF;\r\n\t\tmargin-bottom: 20px;\r\n\t  border-radius: 6px;\r\n\t  cursor: pointer;\r\n\t  position: relative;\r\n\t  overflow: hidden;\r\n\t}\r\n\t.useredit .avatar-uploader .el-upload:hover {\r\n\t  border-color: #409EFF;\r\n\t}\r\n\t.useredit .avatar-uploader-icon {\r\n\t  font-size: 28px;\r\n\t  color: #8c939d;\r\n\t  width: 178px;\r\n\t  height: 178px;\r\n\t  line-height: 178px;\r\n\t  text-align: center;\r\n\t}\r\n\t.useredit .avatar {\r\n\t  width: 178px;\r\n\t  height: 178px;\r\n\t  display: block;\r\n\t}\r\n</style>\n\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "useredit" },
    [
      _c("p", [
        _c("span", { on: { click: _vm.gouser } }, [
          _c("a", { attrs: { href: "javascript:" } }, [_vm._v("个人中心")])
        ]),
        _vm._v(" "),
        _c("span", [
          _vm._v("\n\t\t\t>\n\t\t\t"),
          _c("a", { attrs: { href: "javascript:" } }, [_vm._v("资料修改")])
        ])
      ]),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c(
        "el-upload",
        {
          staticClass: "avatar-uploader",
          attrs: {
            action: "http://localhost:3000/uploadimg",
            "show-file-list": false,
            "on-success": _vm.handleAvatarSuccess,
            "before-upload": _vm.beforeAvatarUpload
          }
        },
        [
          _vm.imageUrl
            ? _c("img", { staticClass: "avatar", attrs: { src: _vm.imageUrl } })
            : _c("i", { staticClass: "el-icon-plus avatar-uploader-icon" })
        ]
      ),
      _vm._v(" "),
      _c(
        "el-form",
        {
          ref: "ruleForm2",
          staticClass: "demo-ruleForm",
          attrs: {
            model: _vm.ruleForm2,
            "status-icon": "",
            rules: _vm.rules2,
            "label-width": "100px"
          }
        },
        [
          _c(
            "el-form-item",
            { attrs: { label: "用户名", prop: "username" } },
            [
              _c("el-input", {
                model: {
                  value: _vm.ruleForm2.username,
                  callback: function($$v) {
                    _vm.$set(_vm.ruleForm2, "username", $$v)
                  },
                  expression: "ruleForm2.username"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            { attrs: { label: "性别", prop: "gendar" } },
            [
              _c(
                "el-radio-group",
                {
                  model: {
                    value: _vm.ruleForm2.gendar,
                    callback: function($$v) {
                      _vm.$set(_vm.ruleForm2, "gendar", $$v)
                    },
                    expression: "ruleForm2.gendar"
                  }
                },
                [
                  _c("el-radio", { attrs: { label: "男", value: "0" } }),
                  _vm._v(" "),
                  _c("el-radio", { attrs: { label: "女", value: "1" } })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-form-item",
            [
              _c(
                "el-button",
                {
                  staticClass: "registerbtn",
                  attrs: { type: "primary" },
                  on: {
                    click: function($event) {
                      _vm.submitForm("ruleForm2")
                    }
                  }
                },
                [_vm._v("提交")]
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4be215e5", esExports)
  }
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3c540cb4", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-528602a3\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./listbytitle.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js?sourceMap!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-528602a3\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./listbytitle.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(true);
// imports


// module
exports.push([module.i, "\n.list{\n}\n.list .item.star{\n}\n.list .item.star span{\n\t\tcolor: #0074D9;\n}\n.list a{\n\t\ttext-decoration: none;\n\t\tdisplay: inline-block;\n\t\tcolor: #808080;\n}\n.list a:hover{\n\t\tcolor: #0074D9;\n}\n.list .text {\n\tfont-size: 14px;\n}\n.list .release {\n\tfloat: right;\n\ttransform: translateY(-10px);\n}\n.list div.el-card__header{\n\tpadding: 15px;\n\tpadding-left: 20px;\n}\n.list div.el-card__body{\n\tpadding: 5px;\n\tpadding-left: 20px;\n}\n.list .clearfix{\n\theight: 20px;\n}\n.clearfix:before,\n.clearfix:after {\n\tdisplay: table;\n\tcontent: \"\";\n}\n.clearfix:after {\n\tclear: both\n}\n.box-card {\n\twidth: 100%;\n}\n.list .content{\n\ttext-overflow:ellipsis;\n\toverflow: hidden;\n\twhite-space:nowrap;\n\tpadding-right: 300px;\n}\n.list p.ps{\n\tmargin: 10px;\n\tfont-size: 12px;\n\ttext-align: right;\n}\n.list .paging{\n\tmargin: 30px;\n\tfloat: right;\n}\n", "", {"version":3,"sources":["E:/CMS/cms-spa/src/components/src/components/listbytitle.vue"],"names":[],"mappings":";AA6FA;CAEA;AACA;CAEA;AACA;EACA,eAAA;CACA;AACA;EACA,sBAAA;EACA,sBAAA;EACA,eAAA;CACA;AACA;EACA,eAAA;CACA;AACA;CACA,gBAAA;CACA;AAEA;CACA,aAAA;CACA,6BAAA;CACA;AACA;CACA,cAAA;CACA,mBAAA;CACA;AACA;CACA,aAAA;CACA,mBAAA;CACA;AACA;CACA,aAAA;CACA;AACA;;CAEA,eAAA;CACA,YAAA;CACA;AACA;CACA,WAAA;CACA;AAEA;CACA,YAAA;CACA;AACA;CACA,uBAAA;CACA,iBAAA;CACA,mBAAA;CACA,qBAAA;CACA;AACA;CACA,aAAA;CACA,gBAAA;CACA,kBAAA;CACA;AACA;CACA,aAAA;CACA,aAAA;CACA","file":"listbytitle.vue","sourcesContent":["<template>\n\t<el-main class=\"list\">\r\n\t\t<el-card class=\"box-card\" v-show=\"topics[0]\" >\r\n\t\t\t<div class=\"text item\" v-for=\"(topic,index) in topics\" :key=\"index\">\r\n\t\t\t\t<div>\r\n\t\t\t\t\t<h3>\r\n\t\t\t\t\t\t<a :href=\"`#/details/${topic._id}`\">{{topic.title}}</a> \r\n\t\t\t\t\t\t<el-button \r\n\t\t\t\t\t\t\tsize=\"mini\"\r\n\t\t\t\t\t\t\tstyle=\"color: #888;\"\r\n\t\t\t\t\t\t\tdisabled>\r\n\t\t\t\t\t\t\t{{ topic.topictype }}\r\n\t\t\t\t\t\t</el-button>\r\n\t\t\t\t\t\t<el-badge :value=\"topic.stars.length\" :max=\"99\" class=\"item star\" type=\"warning\">\r\n\t\t\t\t\t\t\t<el-button size=\"mini\"><span class=\"el-icon-star-on\"></span></el-button>\r\n\t\t\t\t\t\t</el-badge>\r\n\t\t\t\t\t</h3>\r\n\t\t\t\t\t<p class=\"content\">{{ topic.content }}</p>\r\n\t\t\t\t\t<p class=\"ps\">\r\n\t\t\t\t\t\t 发布时间 : {{ topic.create_time }}\r\n\t\t\t\t\t</p>\r\n\t\t\t\t\t<hr/>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</el-card>\r\n\t\t<div class=\"block\">\r\n\t\t<h3 style=\"text-align: center;\" v-show=\"!topics[0]\">找不到相关话题....\r\n\t\t\t<a href=\"\" @click.prevent=\"gorelease\">去发布?</a>\r\n\t\t</h3>\r\n  </div>\r\n\t</el-main>\n</template>\n\n<script>\n\texport default {\n\t\tdata() {\n\t\t\treturn {\n\t\t\t\ttopics : [],\r\n\t\t\t\ttopictype : ''\n\t\t\t};\n\t\t},\r\n\t\tmethods:{\r\n\t\t\tasync gettopicsbytitle(){\r\n\t\t\t\tconst {keyword} = this.$route.query\r\n\t\t\t\tconst {data : topics} = await axios.get('http://127.0.0.1:3000/topics/title?keyword='+keyword)\r\n\t\t\t\ttopics.forEach(function(item,i){\r\n\t\t\t\t\tswitch(item.topictype){\r\n\t\t\t\t\t\tcase 'technology' : item.topictype = '技术'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'literature' : item.topictype = '文学'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'Sports' : item.topictype = '体育'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'entertainment' : item.topictype = '娱乐'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tcase 'metaphysics' : item.topictype = '玄学'\r\n\t\t\t\t\t\t\tbreak;\r\n\t\t\t\t\t\tdefault : item.topictype = '未知'\r\n\t\t\t\t\t}\r\n\t\t\t\t})\r\n\t\t\t\tthis.topics = topics\r\n\t\t\t\t// console.log(topics)\r\n\t\t\t}\r\n\t\t},\r\n\t\tasync created(){\r\n\t\t\tthis.gettopicsbytitle()\r\n\t\t},\r\n\t\tcomputed:{\r\n\t\t\ttopicclass(){\r\n\t\t\t\tswitch(this.topictype){\r\n\t\t\t\t\tcase 'technology' : return '技术'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'literature' : return  '文学'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'Sports' : return  '体育'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'entertainment' : return  '娱乐'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tcase 'metaphysics' : return  '玄学'\r\n\t\t\t\t\t\tbreak;\r\n\t\t\t\t\tdefault : return  '全部'\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t},\r\n\t\twatch:{\r\n\t\t\t'$route' (to , from){\r\n\t\t\t\tthis.gettopicsbytitle()\r\n\t\t\t}\r\n\t\t}\n\t}\n</script>\n\n<style>\r\n\t.list{\r\n\t\t\r\n\t}\r\n\t.list .item.star{\r\n\t\t\r\n\t}\r\n\t.list .item.star span{\r\n\t\tcolor: #0074D9;\r\n\t}\r\n\t.list a{\r\n\t\ttext-decoration: none;\r\n\t\tdisplay: inline-block;\r\n\t\tcolor: #808080;\r\n\t}\r\n\t.list a:hover{\r\n\t\tcolor: #0074D9;\r\n\t}\n\t.list .text {\r\n\tfont-size: 14px;\r\n}\r\n\r\n.list .release {\r\n\tfloat: right;\r\n\ttransform: translateY(-10px);\r\n}\r\n.list div.el-card__header{\r\n\tpadding: 15px;\r\n\tpadding-left: 20px;\r\n}\r\n.list div.el-card__body{\r\n\tpadding: 5px;\r\n\tpadding-left: 20px;\r\n}\r\n.list .clearfix{\r\n\theight: 20px;\r\n}\r\n.clearfix:before,\r\n.clearfix:after {\r\n\tdisplay: table;\r\n\tcontent: \"\";\r\n}\r\n.clearfix:after {\r\n\tclear: both\r\n}\r\n\r\n.box-card {\r\n\twidth: 100%;\r\n}\r\n.list .content{\r\n\ttext-overflow:ellipsis;\r\n\toverflow: hidden;\r\n\twhite-space:nowrap;\r\n\tpadding-right: 300px;\r\n}\r\n.list p.ps{\r\n\tmargin: 10px;\r\n\tfont-size: 12px;\r\n\ttext-align: right;\r\n}\r\n.list .paging{\r\n\tmargin: 30px;\r\n\tfloat: right;\r\n}\n</style>\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "el-main",
    { staticClass: "list" },
    [
      _c(
        "el-card",
        {
          directives: [
            {
              name: "show",
              rawName: "v-show",
              value: _vm.topics[0],
              expression: "topics[0]"
            }
          ],
          staticClass: "box-card"
        },
        _vm._l(_vm.topics, function(topic, index) {
          return _c("div", { key: index, staticClass: "text item" }, [
            _c("div", [
              _c(
                "h3",
                [
                  _c("a", { attrs: { href: "#/details/" + topic._id } }, [
                    _vm._v(_vm._s(topic.title))
                  ]),
                  _vm._v(" "),
                  _c(
                    "el-button",
                    {
                      staticStyle: { color: "#888" },
                      attrs: { size: "mini", disabled: "" }
                    },
                    [
                      _vm._v(
                        "\n\t\t\t\t\t\t\t" +
                          _vm._s(topic.topictype) +
                          "\n\t\t\t\t\t\t"
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "el-badge",
                    {
                      staticClass: "item star",
                      attrs: {
                        value: topic.stars.length,
                        max: 99,
                        type: "warning"
                      }
                    },
                    [
                      _c("el-button", { attrs: { size: "mini" } }, [
                        _c("span", { staticClass: "el-icon-star-on" })
                      ])
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c("p", { staticClass: "content" }, [
                _vm._v(_vm._s(topic.content))
              ]),
              _vm._v(" "),
              _c("p", { staticClass: "ps" }, [
                _vm._v(
                  "\n\t\t\t\t\t\t 发布时间 : " +
                    _vm._s(topic.create_time) +
                    "\n\t\t\t\t\t"
                )
              ]),
              _vm._v(" "),
              _c("hr")
            ])
          ])
        }),
        0
      ),
      _vm._v(" "),
      _c("div", { staticClass: "block" }, [
        _c(
          "h3",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: !_vm.topics[0],
                expression: "!topics[0]"
              }
            ],
            staticStyle: { "text-align": "center" }
          },
          [
            _vm._v("找不到相关话题....\n\t\t\t"),
            _c(
              "a",
              {
                attrs: { href: "" },
                on: {
                  click: function($event) {
                    $event.preventDefault()
                    return _vm.gorelease($event)
                  }
                }
              },
              [_vm._v("去发布?")]
            )
          ]
        )
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-528602a3", esExports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("indexheader"), _vm._v(" "), _c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-47323bf2", esExports)
  }
}

/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "app" } }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5ef48958", esExports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _vueRouter = __webpack_require__(69);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _login = __webpack_require__(5);

var _login2 = _interopRequireDefault(_login);

var _register = __webpack_require__(8);

var _register2 = _interopRequireDefault(_register);

var _index = __webpack_require__(10);

var _index2 = _interopRequireDefault(_index);

var _list = __webpack_require__(12);

var _list2 = _interopRequireDefault(_list);

var _release = __webpack_require__(15);

var _release2 = _interopRequireDefault(_release);

var _details = __webpack_require__(17);

var _details2 = _interopRequireDefault(_details);

var _user = __webpack_require__(19);

var _user2 = _interopRequireDefault(_user);

var _topicedit = __webpack_require__(21);

var _topicedit2 = _interopRequireDefault(_topicedit);

var _useredit = __webpack_require__(23);

var _useredit2 = _interopRequireDefault(_useredit);

var _listbytitle = __webpack_require__(25);

var _listbytitle2 = _interopRequireDefault(_listbytitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _vueRouter2.default({
	routes: [{
		path: '/',
		component: _index2.default,
		children: [{ path: '/', component: _list2.default }, { path: '/release', component: _release2.default }, { path: '/details/:id', component: _details2.default }, { path: '/user/:id', component: _user2.default }, { path: '/topicedit/:id', component: _topicedit2.default }, { path: '/useredit/:id', component: _useredit2.default }, { path: '/listbytitle', component: _listbytitle2.default }]
	}, {
		path: '/login',
		component: _login2.default
	}, {
		path: '/register',
		component: _register2.default
	}]
});

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = VueRouter;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDc3NjQ0NDdlNzQ4NjhhOTc5YTYiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2NvbXBvbmVudC1ub3JtYWxpemVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vL3NyYy9hcHAudnVlIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2xvZ2luLnZ1ZSIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvbG9naW4udnVlIiwid2VicGFjazovLy8uL3NyYy9wdWJpYy9pbWcvbG9nby5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVnaXN0ZXIudnVlIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudnVlIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9pbmRleC52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdC52dWUiLCJ3ZWJwYWNrOi8vL3NyYy9jb21wb25lbnRzL2xpc3QudnVlIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9pbmRleGhlYWRlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVsZWFzZS52dWUiLCJ3ZWJwYWNrOi8vL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2RldGFpbHMudnVlIiwid2VicGFjazovLy9zcmMvY29tcG9uZW50cy9kZXRhaWxzLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy91c2VyLnZ1ZSIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvdXNlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdG9waWNlZGl0LnZ1ZSIsIndlYnBhY2s6Ly8vc3JjL2NvbXBvbmVudHMvdG9waWNlZGl0LnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy91c2VyZWRpdC52dWUiLCJ3ZWJwYWNrOi8vL3NyYy9jb21wb25lbnRzL3VzZXJlZGl0LnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9saXN0Ynl0aXRsZS52dWUiLCJ3ZWJwYWNrOi8vL3NyYy9jb21wb25lbnRzL2xpc3RieXRpdGxlLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJWdWVcIiIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnZ1ZSIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnZ1ZT8xYjU1Iiwid2VicGFjazovLy8uL3NyYy9hcHAudnVlPzk5ZjQiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2xpc3RUb1N0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWU/ZWU3MCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWU/OTAyMyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWU/YzhlYyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWU/NmI4ZCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWU/OGRjYyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWU/NWI5MCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9pbmRleC52dWU/MGFlZCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9pbmRleC52dWU/MWVlMSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9saXN0LnZ1ZT83ZTY5Iiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2xpc3QudnVlPzc4MDEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdC52dWU/NjQ4YyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9pbmRleGhlYWRlci52dWUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlP2UzMjYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlPzI3YzkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlPzI5NzMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvcmVsZWFzZS52dWU/YWUxNiIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9yZWxlYXNlLnZ1ZT8wZmJkIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlP2VlM2IiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvZGV0YWlscy52dWU/OTBkMyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9kZXRhaWxzLnZ1ZT9iYjUyIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL2RldGFpbHMudnVlPzhiZDciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdXNlci52dWU/NDExMCIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy91c2VyLnZ1ZT9mZDJjIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3VzZXIudnVlPzdjZTQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdG9waWNlZGl0LnZ1ZT9jZjQwIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL3RvcGljZWRpdC52dWU/OWM0YSIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlPzNhNTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlP2Q4NjQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlP2M3MzciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlP2U3NmUiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdGJ5dGl0bGUudnVlPzNlNWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdGJ5dGl0bGUudnVlP2NjZjciLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvbGlzdGJ5dGl0bGUudnVlP2VlNTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudnVlPzMyZDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC52dWU/MjliYyIsIndlYnBhY2s6Ly8vLi9zcmMvcm91dGVyLmpzIiwid2VicGFjazovLy9leHRlcm5hbCBcIlZ1ZVJvdXRlclwiIl0sIm5hbWVzIjpbIlZ1ZSIsImVsIiwiZGF0YSIsIm1lc3NhZ2UiLCJ0ZW1wbGF0ZSIsImNvbXBvbmVudHMiLCJBcHAiLCJyb3V0ZXIiLCJWdWVSb3V0ZXIiLCJyb3V0ZXMiLCJwYXRoIiwiY29tcG9uZW50IiwiaW5kZXgiLCJjaGlsZHJlbiIsImxpc3QiLCJyZWxlYXNlIiwiZGV0YWlsc3BhZ2UiLCJ1c2VyIiwidG9waWNlZGl0IiwidXNlcmVkaXQiLCJsaXN0Ynl0aXRsZSIsImxvZ2luIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEw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QkFBbkMsRUFQUztBQUhYLEVBRFEsRUFjUjtBQUNDVixRQUFPLFFBRFI7QUFFQ0MsYUFBWVU7QUFGYixFQWRRLEVBa0JSO0FBQ0NYLFFBQU8sV0FEUjtBQUVDQyxhQUFZVztBQUZiLEVBbEJRO0FBRG1CLENBQWQsQzs7Ozs7O0FDWGYsMkIiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDc3NjQ0NDdlNzQ4NjhhOTc5YTYiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4gIE1vZGlmaWVkIGJ5IEV2YW4gWW91IEB5eXg5OTA4MDNcbiovXG5cbnZhciBoYXNEb2N1bWVudCA9IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCdcblxuaWYgKHR5cGVvZiBERUJVRyAhPT0gJ3VuZGVmaW5lZCcgJiYgREVCVUcpIHtcbiAgaWYgKCFoYXNEb2N1bWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAndnVlLXN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50LiAnICtcbiAgICBcIlVzZSB7IHRhcmdldDogJ25vZGUnIH0gaW4geW91ciBXZWJwYWNrIGNvbmZpZyB0byBpbmRpY2F0ZSBhIHNlcnZlci1yZW5kZXJpbmcgZW52aXJvbm1lbnQuXCJcbiAgKSB9XG59XG5cbnZhciBsaXN0VG9TdHlsZXMgPSByZXF1aXJlKCcuL2xpc3RUb1N0eWxlcycpXG5cbi8qXG50eXBlIFN0eWxlT2JqZWN0ID0ge1xuICBpZDogbnVtYmVyO1xuICBwYXJ0czogQXJyYXk8U3R5bGVPYmplY3RQYXJ0PlxufVxuXG50eXBlIFN0eWxlT2JqZWN0UGFydCA9IHtcbiAgY3NzOiBzdHJpbmc7XG4gIG1lZGlhOiBzdHJpbmc7XG4gIHNvdXJjZU1hcDogP3N0cmluZ1xufVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0gey8qXG4gIFtpZDogbnVtYmVyXToge1xuICAgIGlkOiBudW1iZXIsXG4gICAgcmVmczogbnVtYmVyLFxuICAgIHBhcnRzOiBBcnJheTwob2JqPzogU3R5bGVPYmplY3RQYXJ0KSA9PiB2b2lkPlxuICB9XG4qL31cblxudmFyIGhlYWQgPSBoYXNEb2N1bWVudCAmJiAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdKVxudmFyIHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsXG52YXIgc2luZ2xldG9uQ291bnRlciA9IDBcbnZhciBpc1Byb2R1Y3Rpb24gPSBmYWxzZVxudmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxudmFyIG9wdGlvbnMgPSBudWxsXG52YXIgc3NySWRLZXkgPSAnZGF0YS12dWUtc3NyLWlkJ1xuXG4vLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cbi8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2VcbnZhciBpc09sZElFID0gdHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiYgL21zaWUgWzYtOV1cXGIvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChwYXJlbnRJZCwgbGlzdCwgX2lzUHJvZHVjdGlvbiwgX29wdGlvbnMpIHtcbiAgaXNQcm9kdWN0aW9uID0gX2lzUHJvZHVjdGlvblxuXG4gIG9wdGlvbnMgPSBfb3B0aW9ucyB8fCB7fVxuXG4gIHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMocGFyZW50SWQsIGxpc3QpXG4gIGFkZFN0eWxlc1RvRG9tKHN0eWxlcylcblxuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG4gICAgdmFyIG1heVJlbW92ZSA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gc3R5bGVzW2ldXG4gICAgICB2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXVxuICAgICAgZG9tU3R5bGUucmVmcy0tXG4gICAgICBtYXlSZW1vdmUucHVzaChkb21TdHlsZSlcbiAgICB9XG4gICAgaWYgKG5ld0xpc3QpIHtcbiAgICAgIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhwYXJlbnRJZCwgbmV3TGlzdClcbiAgICAgIGFkZFN0eWxlc1RvRG9tKHN0eWxlcylcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzID0gW11cbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXVxuICAgICAgaWYgKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGRvbVN0eWxlLnBhcnRzW2pdKClcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMgLyogQXJyYXk8U3R5bGVPYmplY3Q+ICovKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBzdHlsZXNbaV1cbiAgICB2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXVxuICAgIGlmIChkb21TdHlsZSkge1xuICAgICAgZG9tU3R5bGUucmVmcysrXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pXG4gICAgICB9XG4gICAgICBmb3IgKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdKSlcbiAgICAgIH1cbiAgICAgIGlmIChkb21TdHlsZS5wYXJ0cy5sZW5ndGggPiBpdGVtLnBhcnRzLmxlbmd0aCkge1xuICAgICAgICBkb21TdHlsZS5wYXJ0cy5sZW5ndGggPSBpdGVtLnBhcnRzLmxlbmd0aFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGFydHMgPSBbXVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSkpXG4gICAgICB9XG4gICAgICBzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHsgaWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0cyB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAoKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gIHN0eWxlRWxlbWVudC50eXBlID0gJ3RleHQvY3NzJ1xuICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudClcbiAgcmV0dXJuIHN0eWxlRWxlbWVudFxufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqIC8qIFN0eWxlT2JqZWN0UGFydCAqLykge1xuICB2YXIgdXBkYXRlLCByZW1vdmVcbiAgdmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlWycgKyBzc3JJZEtleSArICd+PVwiJyArIG9iai5pZCArICdcIl0nKVxuXG4gIGlmIChzdHlsZUVsZW1lbnQpIHtcbiAgICBpZiAoaXNQcm9kdWN0aW9uKSB7XG4gICAgICAvLyBoYXMgU1NSIHN0eWxlcyBhbmQgaW4gcHJvZHVjdGlvbiBtb2RlLlxuICAgICAgLy8gc2ltcGx5IGRvIG5vdGhpbmcuXG4gICAgICByZXR1cm4gbm9vcFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBoYXMgU1NSIHN0eWxlcyBidXQgaW4gZGV2IG1vZGUuXG4gICAgICAvLyBmb3Igc29tZSByZWFzb24gQ2hyb21lIGNhbid0IGhhbmRsZSBzb3VyY2UgbWFwIGluIHNlcnZlci1yZW5kZXJlZFxuICAgICAgLy8gc3R5bGUgdGFncyAtIHNvdXJjZSBtYXBzIGluIDxzdHlsZT4gb25seSB3b3JrcyBpZiB0aGUgc3R5bGUgdGFnIGlzXG4gICAgICAvLyBjcmVhdGVkIGFuZCBpbnNlcnRlZCBkeW5hbWljYWxseS4gU28gd2UgcmVtb3ZlIHRoZSBzZXJ2ZXIgcmVuZGVyZWRcbiAgICAgIC8vIHN0eWxlcyBhbmQgaW5qZWN0IG5ldyBvbmVzLlxuICAgICAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KVxuICAgIH1cbiAgfVxuXG4gIGlmIChpc09sZElFKSB7XG4gICAgLy8gdXNlIHNpbmdsZXRvbiBtb2RlIGZvciBJRTkuXG4gICAgdmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKytcbiAgICBzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KCkpXG4gICAgdXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpXG4gICAgcmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSlcbiAgfSBlbHNlIHtcbiAgICAvLyB1c2UgbXVsdGktc3R5bGUtdGFnIG1vZGUgaW4gYWxsIG90aGVyIGNhc2VzXG4gICAgc3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KClcbiAgICB1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KVxuICAgIHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudClcbiAgICB9XG4gIH1cblxuICB1cGRhdGUob2JqKVxuXG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqIC8qIFN0eWxlT2JqZWN0UGFydCAqLykge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG4gICAgICAgICAgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcbiAgICAgICAgICBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgdXBkYXRlKG9iaiA9IG5ld09iailcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKClcbiAgICB9XG4gIH1cbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRleHRTdG9yZSA9IFtdXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcbiAgICB0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnRcbiAgICByZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKVxuICB9XG59KSgpXG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG4gIHZhciBjc3MgPSByZW1vdmUgPyAnJyA6IG9iai5jc3NcblxuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcylcbiAgfSBlbHNlIHtcbiAgICB2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcylcbiAgICB2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzXG4gICAgaWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pXG4gICAgaWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICBzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGVFbGVtZW50LCBvYmopIHtcbiAgdmFyIGNzcyA9IG9iai5jc3NcbiAgdmFyIG1lZGlhID0gb2JqLm1lZGlhXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwXG5cbiAgaWYgKG1lZGlhKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBtZWRpYSlcbiAgfVxuICBpZiAob3B0aW9ucy5zc3JJZCkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoc3NySWRLZXksIG9iai5pZClcbiAgfVxuXG4gIGlmIChzb3VyY2VNYXApIHtcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5jaHJvbWUuY29tL2RldnRvb2xzL2RvY3MvamF2YXNjcmlwdC1kZWJ1Z2dpbmdcbiAgICAvLyB0aGlzIG1ha2VzIHNvdXJjZSBtYXBzIGluc2lkZSBzdHlsZSB0YWdzIHdvcmsgcHJvcGVybHkgaW4gQ2hyb21lXG4gICAgY3NzICs9ICdcXG4vKiMgc291cmNlVVJMPScgKyBzb3VyY2VNYXAuc291cmNlc1swXSArICcgKi8nXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcbiAgICBjc3MgKz0gJ1xcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsJyArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyAnICovJ1xuICB9XG5cbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKVxuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSlcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzQ2xpZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qIGdsb2JhbHMgX19WVUVfU1NSX0NPTlRFWFRfXyAqL1xuXG4vLyBJTVBPUlRBTlQ6IERvIE5PVCB1c2UgRVMyMDE1IGZlYXR1cmVzIGluIHRoaXMgZmlsZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGEgcnVudGltZSB1dGlsaXR5IGZvciBjbGVhbmVyIGNvbXBvbmVudCBtb2R1bGUgb3V0cHV0IGFuZCB3aWxsXG4vLyBiZSBpbmNsdWRlZCBpbiB0aGUgZmluYWwgd2VicGFjayB1c2VyIGJ1bmRsZS5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBub3JtYWxpemVDb21wb25lbnQgKFxuICByYXdTY3JpcHRFeHBvcnRzLFxuICBjb21waWxlZFRlbXBsYXRlLFxuICBmdW5jdGlvbmFsVGVtcGxhdGUsXG4gIGluamVjdFN0eWxlcyxcbiAgc2NvcGVJZCxcbiAgbW9kdWxlSWRlbnRpZmllciAvKiBzZXJ2ZXIgb25seSAqL1xuKSB7XG4gIHZhciBlc01vZHVsZVxuICB2YXIgc2NyaXB0RXhwb3J0cyA9IHJhd1NjcmlwdEV4cG9ydHMgPSByYXdTY3JpcHRFeHBvcnRzIHx8IHt9XG5cbiAgLy8gRVM2IG1vZHVsZXMgaW50ZXJvcFxuICB2YXIgdHlwZSA9IHR5cGVvZiByYXdTY3JpcHRFeHBvcnRzLmRlZmF1bHRcbiAgaWYgKHR5cGUgPT09ICdvYmplY3QnIHx8IHR5cGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBlc01vZHVsZSA9IHJhd1NjcmlwdEV4cG9ydHNcbiAgICBzY3JpcHRFeHBvcnRzID0gcmF3U2NyaXB0RXhwb3J0cy5kZWZhdWx0XG4gIH1cblxuICAvLyBWdWUuZXh0ZW5kIGNvbnN0cnVjdG9yIGV4cG9ydCBpbnRlcm9wXG4gIHZhciBvcHRpb25zID0gdHlwZW9mIHNjcmlwdEV4cG9ydHMgPT09ICdmdW5jdGlvbidcbiAgICA/IHNjcmlwdEV4cG9ydHMub3B0aW9uc1xuICAgIDogc2NyaXB0RXhwb3J0c1xuXG4gIC8vIHJlbmRlciBmdW5jdGlvbnNcbiAgaWYgKGNvbXBpbGVkVGVtcGxhdGUpIHtcbiAgICBvcHRpb25zLnJlbmRlciA9IGNvbXBpbGVkVGVtcGxhdGUucmVuZGVyXG4gICAgb3B0aW9ucy5zdGF0aWNSZW5kZXJGbnMgPSBjb21waWxlZFRlbXBsYXRlLnN0YXRpY1JlbmRlckZuc1xuICAgIG9wdGlvbnMuX2NvbXBpbGVkID0gdHJ1ZVxuICB9XG5cbiAgLy8gZnVuY3Rpb25hbCB0ZW1wbGF0ZVxuICBpZiAoZnVuY3Rpb25hbFRlbXBsYXRlKSB7XG4gICAgb3B0aW9ucy5mdW5jdGlvbmFsID0gdHJ1ZVxuICB9XG5cbiAgLy8gc2NvcGVkSWRcbiAgaWYgKHNjb3BlSWQpIHtcbiAgICBvcHRpb25zLl9zY29wZUlkID0gc2NvcGVJZFxuICB9XG5cbiAgdmFyIGhvb2tcbiAgaWYgKG1vZHVsZUlkZW50aWZpZXIpIHsgLy8gc2VydmVyIGJ1aWxkXG4gICAgaG9vayA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgICAvLyAyLjMgaW5qZWN0aW9uXG4gICAgICBjb250ZXh0ID1cbiAgICAgICAgY29udGV4dCB8fCAvLyBjYWNoZWQgY2FsbFxuICAgICAgICAodGhpcy4kdm5vZGUgJiYgdGhpcy4kdm5vZGUuc3NyQ29udGV4dCkgfHwgLy8gc3RhdGVmdWxcbiAgICAgICAgKHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LiR2bm9kZSAmJiB0aGlzLnBhcmVudC4kdm5vZGUuc3NyQ29udGV4dCkgLy8gZnVuY3Rpb25hbFxuICAgICAgLy8gMi4yIHdpdGggcnVuSW5OZXdDb250ZXh0OiB0cnVlXG4gICAgICBpZiAoIWNvbnRleHQgJiYgdHlwZW9mIF9fVlVFX1NTUl9DT05URVhUX18gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnRleHQgPSBfX1ZVRV9TU1JfQ09OVEVYVF9fXG4gICAgICB9XG4gICAgICAvLyBpbmplY3QgY29tcG9uZW50IHN0eWxlc1xuICAgICAgaWYgKGluamVjdFN0eWxlcykge1xuICAgICAgICBpbmplY3RTdHlsZXMuY2FsbCh0aGlzLCBjb250ZXh0KVxuICAgICAgfVxuICAgICAgLy8gcmVnaXN0ZXIgY29tcG9uZW50IG1vZHVsZSBpZGVudGlmaWVyIGZvciBhc3luYyBjaHVuayBpbmZlcnJlbmNlXG4gICAgICBpZiAoY29udGV4dCAmJiBjb250ZXh0Ll9yZWdpc3RlcmVkQ29tcG9uZW50cykge1xuICAgICAgICBjb250ZXh0Ll9yZWdpc3RlcmVkQ29tcG9uZW50cy5hZGQobW9kdWxlSWRlbnRpZmllcilcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdXNlZCBieSBzc3IgaW4gY2FzZSBjb21wb25lbnQgaXMgY2FjaGVkIGFuZCBiZWZvcmVDcmVhdGVcbiAgICAvLyBuZXZlciBnZXRzIGNhbGxlZFxuICAgIG9wdGlvbnMuX3NzclJlZ2lzdGVyID0gaG9va1xuICB9IGVsc2UgaWYgKGluamVjdFN0eWxlcykge1xuICAgIGhvb2sgPSBpbmplY3RTdHlsZXNcbiAgfVxuXG4gIGlmIChob29rKSB7XG4gICAgdmFyIGZ1bmN0aW9uYWwgPSBvcHRpb25zLmZ1bmN0aW9uYWxcbiAgICB2YXIgZXhpc3RpbmcgPSBmdW5jdGlvbmFsXG4gICAgICA/IG9wdGlvbnMucmVuZGVyXG4gICAgICA6IG9wdGlvbnMuYmVmb3JlQ3JlYXRlXG5cbiAgICBpZiAoIWZ1bmN0aW9uYWwpIHtcbiAgICAgIC8vIGluamVjdCBjb21wb25lbnQgcmVnaXN0cmF0aW9uIGFzIGJlZm9yZUNyZWF0ZSBob29rXG4gICAgICBvcHRpb25zLmJlZm9yZUNyZWF0ZSA9IGV4aXN0aW5nXG4gICAgICAgID8gW10uY29uY2F0KGV4aXN0aW5nLCBob29rKVxuICAgICAgICA6IFtob29rXVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBmb3IgdGVtcGxhdGUtb25seSBob3QtcmVsb2FkIGJlY2F1c2UgaW4gdGhhdCBjYXNlIHRoZSByZW5kZXIgZm4gZG9lc24ndFxuICAgICAgLy8gZ28gdGhyb3VnaCB0aGUgbm9ybWFsaXplclxuICAgICAgb3B0aW9ucy5faW5qZWN0U3R5bGVzID0gaG9va1xuICAgICAgLy8gcmVnaXN0ZXIgZm9yIGZ1bmN0aW9hbCBjb21wb25lbnQgaW4gdnVlIGZpbGVcbiAgICAgIG9wdGlvbnMucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyV2l0aFN0eWxlSW5qZWN0aW9uIChoLCBjb250ZXh0KSB7XG4gICAgICAgIGhvb2suY2FsbChjb250ZXh0KVxuICAgICAgICByZXR1cm4gZXhpc3RpbmcoaCwgY29udGV4dClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGVzTW9kdWxlOiBlc01vZHVsZSxcbiAgICBleHBvcnRzOiBzY3JpcHRFeHBvcnRzLFxuICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBheGlvcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImF4aW9zXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHRlbXBsYXRlPlxuXHQ8ZGl2IGlkPVwiYXBwXCI+XHJcblx0XHQ8cm91dGVyLXZpZXc+PC9yb3V0ZXItdmlldz5cclxuXHQ8L2Rpdj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XHJcblx0aW1wb3J0IGxvZ2luIGZyb20gJy4vY29tcG9uZW50cy9sb2dpbi52dWUnXHJcblx0aW1wb3J0IHJlZ2lzdGVyIGZyb20gJy4vY29tcG9uZW50cy9yZWdpc3Rlci52dWUnXHJcblx0aW1wb3J0IGluZGV4IGZyb20gJy4vY29tcG9uZW50cy9pbmRleC52dWUnXG5cdGV4cG9ydCBkZWZhdWx0IHtcblx0XHRkYXRhKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdH0sXHJcblx0XHRjb21wb25lbnRzOiB7XHJcblx0XHRcdGxvZ2luLFxyXG5cdFx0XHRyZWdpc3RlcixcclxuXHRcdFx0aW5kZXhcclxuXHRcdH1cblx0fVxuPC9zY3JpcHQ+XG5cbjxzdHlsZT5cblxuPC9zdHlsZT5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvYXBwLnZ1ZSIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMTBkOWRmMDlcXFwiLFxcXCJzY29wZWRcXFwiOnRydWUsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vbG9naW4udnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vbG9naW4udnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9sb2dpbi52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LTEwZDlkZjA5XFxcIixcXFwiaGFzU2NvcGVkXFxcIjp0cnVlLFxcXCJidWJsZVxcXCI6e1xcXCJ0cmFuc2Zvcm1zXFxcIjp7fX19IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9sb2dpbi52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gXCJkYXRhLXYtMTBkOWRmMDlcIlxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvbG9naW4udnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LTEwZDlkZjA5XCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtMTBkOWRmMDlcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWVcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHRlbXBsYXRlPlxuXHQ8ZGl2IGNsYXNzPVwibG9naW5cIj5cclxuXHRcdDxoMT48YSBocmVmPVwiIy9cIj48aW1nIHNyYz1cIi4uL3B1YmljL2ltZy9sb2dvLnBuZ1wiIGFsdD1cIlwiPjwvYT48L2gxPlxyXG5cdFx0PGVsLWZvcm0gOm1vZGVsPVwicnVsZUZvcm0yXCIgc3RhdHVzLWljb24gOnJ1bGVzPVwicnVsZXMyXCIgcmVmPVwicnVsZUZvcm0yXCIgbGFiZWwtd2lkdGg9XCI4MHB4XCIgY2xhc3M9XCJkZW1vLXJ1bGVGb3JtXCI+XHJcblx0XHRcdDxlbC1mb3JtLWl0ZW0gcHJvcD1cImVtYWlsXCIgbGFiZWw9XCLpgq7nrrFcIj5cclxuXHRcdFx0XHQ8ZWwtaW5wdXQgdi1tb2RlbD1cInJ1bGVGb3JtMi5lbWFpbFwiIHR5cGU9XCJlbWFpbFwiPjwvZWwtaW5wdXQ+XHJcblx0XHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi5a+G56CBXCIgcHJvcD1cInBhc3N3b3JkXCI+XHJcblx0XHRcdFx0PGVsLWlucHV0IHR5cGU9XCJwYXNzd29yZFwiIHYtbW9kZWw9XCJydWxlRm9ybTIucGFzc3dvcmRcIiBhdXRvY29tcGxldGU9XCJvZmZcIj48L2VsLWlucHV0PlxyXG5cdFx0XHQ8L2VsLWZvcm0taXRlbT5cclxuXHRcdFx0PGVsLWZvcm0taXRlbT5cclxuXHRcdFx0XHQ8ZWwtYnV0dG9uIGNsYXNzPVwibG9naW5idG5cIiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cInN1Ym1pdEZvcm0oJ3J1bGVGb3JtMicpXCI+55m75b2VPC9lbC1idXR0b24+XHJcblx0XHRcdFx0PGRpdiBjbGFzcz1cIm1lc3NhZ2VcIj5cclxuXHRcdFx0XHQgIDxwPuayoeaciei0puWPtz8gPGEgaHJlZj1cIiMvcmVnaXN0ZXJcIj7ngrnlh7vliJvlu7o8L2E+LjwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHQ8L2VsLWZvcm0+XHJcblx0PC9kaXY+XG48L3RlbXBsYXRlPlxuXG48c2NyaXB0PlxyXG5cdGltcG9ydCBheGlvcyBmcm9tICdheGlvcydcblx0ZXhwb3J0IGRlZmF1bHQge1xyXG5cdFx0ZGF0YSgpIHtcclxuXHRcdFx0Y29uc3QgdmFsaWRhdGVQYXNzID0gKHJ1bGUsIHZhbHVlLCBjYWxsYmFjaykgPT4ge1xyXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gJycpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKG5ldyBFcnJvcign6K+36L6T5YWl5a+G56CBJykpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjaygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0Y29uc3QgdmFsaWRhdGVlbWFpbCA9IChydWxlLCB2YWx1ZSwgY2FsbGJhY2spID0+IHtcclxuXHRcdFx0XHRpZiAodmFsdWUgPT09ICcnKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhuZXcgRXJyb3IoJ+mCrueuseS4jeiDveS4uuepuicpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y29uc3QgcmVnID0gbmV3IFJlZ0V4cChcIl5bYS16MC05QS1aXStbLSB8IGEtejAtOUEtWiAuIF9dK0AoW2EtejAtOUEtWl0rKC1bYS16MC05QS1aXSspP1xcXFwuKStbYS16XXsyLH0kXCIpXHJcblx0XHRcdFx0XHRpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhuZXcgRXJyb3IoJ+ivt+i+k+WFpeato+ehrumCrueuseagvOW8jycpKVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRydWxlRm9ybTI6IHtcclxuXHRcdFx0XHRcdHBhc3N3b3JkOiAnJyxcclxuXHRcdFx0XHRcdGVtYWlsOiAnJ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cnVsZXMyOiB7XHJcblx0XHRcdFx0XHRwYXNzd29yZDogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiB2YWxpZGF0ZVBhc3MsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXI6ICdibHVyJ1xyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0XHRlbWFpbDogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiB2YWxpZGF0ZWVtYWlsLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdH1dXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHRcdG1ldGhvZHM6IHtcclxuXHRcdFx0IHN1Ym1pdEZvcm0oZm9ybU5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS52YWxpZGF0ZShhc3luYyAodmFsaWQpID0+IHtcclxuXHRcdFx0XHRcdGlmICh2YWxpZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCByZXMgPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicsIHRoaXMucnVsZUZvcm0yKVxyXG5cdFx0XHRcdFx0XHRpZihyZXMuZGF0YS5lcnIpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLiRtZXNzYWdlKCfnlKjmiLflkI3miJblr4bnoIHplJnor68nKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMuJHJvdXRlci5wdXNoKCcvJylcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHRcclxuXHRcdH1cclxuXHR9XG48L3NjcmlwdD5cblxuPHN0eWxlIHNjb3BlZD5cblx0LmxvZ2luIHtcclxuXHRcdHdpZHRoOiA0MDBweDtcclxuXHRcdHBhZGRpbmc6IDMwcHg7XHJcblx0XHRwYWRkaW5nLWxlZnQ6IDEwcHg7XHJcblx0XHRwYWRkaW5nLXJpZ2h0OiA3MHB4O1xyXG5cdFx0cGFkZGluZy1ib3R0b206IDIwcHg7XHJcblx0XHRtYXJnaW46IDEwMHB4IGF1dG87XHJcblx0XHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG5cdH1cclxuXHQubG9naW5idG57XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHR9XHJcblx0Lm1lc3NhZ2Uge1xyXG5cdFx0aGVpZ2h0OiA0MHB4O1xyXG5cdFx0bWFyZ2luLXRvcDogMjBweDtcclxuXHRcdHBhZGRpbmctbGVmdDogMjBweDtcclxuXHQgIGJvcmRlcjogMXB4IHNvbGlkICNkOGRlZTI7XHJcblx0ICBib3JkZXItcmFkaXVzOiA1cHg7XHJcblx0fVxyXG5cdC5tZXNzYWdlIHB7XHJcblx0XHRwYWRkaW5nOiAwO1xyXG5cdFx0bGluZS1oZWlnaHQ6IDQwcHg7XHJcblx0XHRtYXJnaW46IDA7XHJcblx0fVxyXG5cdC5sb2dpbiBoMXtcclxuXHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdG1hcmdpbjogMDtcclxuXHR9XG48L3N0eWxlPlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL2xvZ2luLnZ1ZSIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImxvZ28ucG5nXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcHViaWMvaW1nL2xvZ28ucG5nXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtOGY4YTFkOWFcXFwiLFxcXCJzY29wZWRcXFwiOnRydWUsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vcmVnaXN0ZXIudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vcmVnaXN0ZXIudnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9yZWdpc3Rlci52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LThmOGExZDlhXFxcIixcXFwiaGFzU2NvcGVkXFxcIjp0cnVlLFxcXCJidWJsZVxcXCI6e1xcXCJ0cmFuc2Zvcm1zXFxcIjp7fX19IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9yZWdpc3Rlci52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gXCJkYXRhLXYtOGY4YTFkOWFcIlxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvcmVnaXN0ZXIudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LThmOGExZDlhXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtOGY4YTFkOWFcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWVcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHRlbXBsYXRlPlxyXG5cdDxkaXYgY2xhc3M9XCJyZWdpc3RlclwiPlxyXG5cdFx0PGgxPjxpbWcgc3JjPVwiLi4vcHViaWMvaW1nL2xvZ28ucG5nXCIgYWx0PVwiXCI+PC9oMT5cclxuXHRcdDxlbC1kaWFsb2cgdGl0bGU9XCLmj5DnpLpcIiA6dmlzaWJsZS5zeW5jPVwiZGlhbG9nVmlzaWJsZVwiIHdpZHRoPVwiMzAlXCIgPlxyXG5cdFx0XHQ8c3Bhbj7ms6jlhozmiJDlip8h5Y6755m75b2V77yfPC9zcGFuPlxyXG5cdFx0XHQ8c3BhbiBzbG90PVwiZm9vdGVyXCIgY2xhc3M9XCJkaWFsb2ctZm9vdGVyXCI+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiBAY2xpY2s9XCJkaWFsb2dWaXNpYmxlID0gZmFsc2VcIj7lj5Yg5raIPC9lbC1idXR0b24+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cImdvbG9naW5cIj7noa4g5a6aPC9lbC1idXR0b24+XHJcblx0XHRcdDwvc3Bhbj5cclxuXHRcdDwvZWwtZGlhbG9nPlxyXG5cdFx0PGVsLWZvcm0gOm1vZGVsPVwicnVsZUZvcm0yXCIgc3RhdHVzLWljb24gOnJ1bGVzPVwicnVsZXMyXCIgcmVmPVwicnVsZUZvcm0yXCIgbGFiZWwtd2lkdGg9XCIxMDBweFwiIGNsYXNzPVwiZGVtby1ydWxlRm9ybVwiPlxyXG5cdFx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi55So5oi35ZCNXCIgcHJvcD1cInVzZXJuYW1lXCI+XHJcblx0XHRcdFx0PGVsLWlucHV0IHYtbW9kZWw9XCJydWxlRm9ybTIudXNlcm5hbWVcIj48L2VsLWlucHV0PlxyXG5cdFx0XHQ8L2VsLWZvcm0taXRlbT5cclxuXHRcdFx0PGVsLWZvcm0taXRlbSBwcm9wPVwiZW1haWxcIiBsYWJlbD1cIumCrueusVwiPlxyXG5cdFx0XHRcdDxlbC1pbnB1dCB2LW1vZGVsPVwicnVsZUZvcm0yLmVtYWlsXCIgdHlwZT1cImVtYWlsXCI+PC9lbC1pbnB1dD5cclxuXHRcdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHRcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XCLlr4bnoIFcIiBwcm9wPVwicGFzc3dvcmRcIj5cclxuXHRcdFx0XHQ8ZWwtaW5wdXQgdHlwZT1cInBhc3N3b3JkXCIgdi1tb2RlbD1cInJ1bGVGb3JtMi5wYXNzd29yZFwiIGF1dG9jb21wbGV0ZT1cIm9mZlwiPjwvZWwtaW5wdXQ+XHJcblx0XHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi56Gu6K6k5a+G56CBXCIgcHJvcD1cImNoZWNrUGFzc1wiPlxyXG5cdFx0XHRcdDxlbC1pbnB1dCB0eXBlPVwicGFzc3dvcmRcIiB2LW1vZGVsPVwicnVsZUZvcm0yLmNoZWNrUGFzc1wiIGF1dG9jb21wbGV0ZT1cIm9mZlwiPjwvZWwtaW5wdXQ+XHJcblx0XHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi5oCn5YirXCIgcHJvcD1cImdlbmRhclwiPlxyXG5cdFx0XHRcdDxlbC1yYWRpby1ncm91cCB2LW1vZGVsPVwicnVsZUZvcm0yLmdlbmRhclwiPlxyXG5cdFx0XHRcdFx0PGVsLXJhZGlvIGxhYmVsPVwi55S3XCIgdmFsdWU9XCIwXCI+PC9lbC1yYWRpbz5cclxuXHRcdFx0XHRcdDxlbC1yYWRpbyBsYWJlbD1cIuWls1wiIHZhbHVlPVwiMVwiPjwvZWwtcmFkaW8+XHJcblx0XHRcdFx0PC9lbC1yYWRpby1ncm91cD5cclxuXHRcdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHRcdDxlbC1mb3JtLWl0ZW0+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyYnRuXCIgdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJzdWJtaXRGb3JtKCdydWxlRm9ybTInKVwiPuaPkOS6pDwvZWwtYnV0dG9uPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJtZXNzYWdlXCI+XHJcblx0XHRcdFx0ICA8cD7lt7LmnInotKblj7c/IDxhIGhyZWY9XCIjL2xvZ2luXCI+54K55Ye755m75b2VPC9hPi48L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0PC9lbC1mb3JtPlxyXG5cdDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXHJcblx0ZXhwb3J0IGRlZmF1bHQge1xyXG5cdFx0ZGF0YSgpIHtcclxuXHRcdFx0Y29uc3QgY2hlY2tBZ2UgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdFx0aWYgKCF2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcign55So5oi35ZCN5LiN6IO95Li656m6JykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZS5sZW5ndGggPCAyIHx8IHZhbHVlLmxlbmd0aCA+IDgpIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfnlKjmiLflkI3lv4XpobvlnKgyLTjkvY0nKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjb25zdCByZXMgPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2Vycz91c2VybmFtZT0nK3ZhbHVlKVxyXG5cdFx0XHRcdFx0XHRpZihyZXMuZGF0YVswXSl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcign6K+l55So5oi35ZCN5bey5a2Y5ZyoJykpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2soKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCAyMDApO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb25zdCB2YWxpZGF0ZVBhc3MgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7fovpPlhaXlr4bnoIEnKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnJ1bGVGb3JtMi5jaGVja1Bhc3MgIT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuJHJlZnMucnVsZUZvcm0yLnZhbGlkYXRlRmllbGQoJ2NoZWNrUGFzcycpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGNvbnN0IHZhbGlkYXRlUGFzczIgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7flho3mrKHovpPlhaXlr4bnoIEnKSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmICh2YWx1ZSAhPT0gdGhpcy5ydWxlRm9ybTIucGFzc3dvcmQpIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKG5ldyBFcnJvcign5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0IScpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdGNvbnN0IHZhbGlkYXRlZW1haWwgPSBhc3luYyAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfpgq7nrrHkuI3og73kuLrnqbonKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNvbnN0IHJlZyA9IG5ldyBSZWdFeHAoXCJeW2EtejAtOUEtWl0rWy0gfCBhLXowLTlBLVogLiBfXStAKFthLXowLTlBLVpdKygtW2EtejAtOUEtWl0rKT9cXFxcLikrW2Etel17Mix9JFwiKVxyXG5cdFx0XHRcdFx0aWYgKCFyZWcudGVzdCh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7fovpPlhaXmraPnoa7pgq7nrrHmoLzlvI8nKSlcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP2VtYWlsPScrdmFsdWUpXHJcblx0XHRcdFx0XHRcdGlmKHJlcy5kYXRhWzBdKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCfor6Xpgq7nrrHlt7Looqvms6jlhownKSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRjb25zdCB2YWxpZGF0ZWdlbmRhciA9IChydWxlLCB2YWx1ZSwgY2FsbGJhY2spID0+IHtcclxuXHRcdFx0XHRpZiAodmFsdWUgPT09ICcnKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhuZXcgRXJyb3IoJ+ivt+mAieaLqeaAp+WIqycpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2soKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRydWxlRm9ybTI6IHtcclxuXHRcdFx0XHRcdHBhc3N3b3JkOiAnJyxcclxuXHRcdFx0XHRcdGNoZWNrUGFzczogJycsXHJcblx0XHRcdFx0XHR1c2VybmFtZTogJycsXHJcblx0XHRcdFx0XHRlbWFpbDogJycsXHJcblx0XHRcdFx0XHRnZW5kYXI6ICcnXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRkaWFsb2dWaXNpYmxlOiBmYWxzZSxcclxuXHRcdFx0XHRydWxlczI6IHtcclxuXHRcdFx0XHRcdHBhc3N3b3JkOiBbe1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3I6IHZhbGlkYXRlUGFzcyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlcjogJ2JsdXInXHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdGNoZWNrUGFzczogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiB2YWxpZGF0ZVBhc3MyLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdH1dLFxyXG5cdFx0XHRcdFx0dXNlcm5hbWU6IFt7XHJcblx0XHRcdFx0XHRcdHZhbGlkYXRvcjogY2hlY2tBZ2UsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXI6ICdibHVyJ1xyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0XHRlbWFpbDogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiB2YWxpZGF0ZWVtYWlsLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdH1dLFxyXG5cdFx0XHRcdFx0Z2VuZGFyOiBbe1xyXG5cdFx0XHRcdFx0XHR2YWxpZGF0b3I6IHZhbGlkYXRlZ2VuZGFyLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdH1dXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHRcdG1ldGhvZHM6IHtcclxuXHRcdFx0c3VibWl0Rm9ybShmb3JtTmFtZSkge1xyXG5cdFx0XHRcdHRoaXMuJHJlZnNbZm9ybU5hbWVdLnZhbGlkYXRlKGFzeW5jICh2YWxpZCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHZhbGlkKSB7XHJcblx0XHRcdFx0XHRcdGRlbGV0ZSB0aGlzLnJ1bGVGb3JtMi5jaGVja1Bhc3NcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMucnVsZUZvcm0yLmdlbmRhciA9PT0gJ+eUtycpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPSAwXHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ydWxlRm9ybTIuZ2VuZGFyID0gMVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2VycycsIHRoaXMucnVsZUZvcm0yKVxyXG5cdFx0XHRcdFx0XHRpZihyZXMuZGF0YS5lcnIpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMuZGlhbG9nVmlzaWJsZSA9IHRydWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnb2xvZ2luKCl7XHJcblx0XHRcdFx0dGhpcy5kaWFsb2dWaXNpYmxlID0gZmFsc2VcclxuXHRcdFx0XHR0aGlzLiRyb3V0ZXIucHVzaCgnL2xvZ2luJylcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG5cdC5yZWdpc3RlciB7XHJcblx0XHR3aWR0aDogNTAwcHg7XHJcblx0XHRwYWRkaW5nOiA0MHB4O1xyXG5cdFx0cGFkZGluZy1yaWdodDogNzBweDtcclxuXHRcdG1hcmdpbjogMjBweCBhdXRvO1xyXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcclxuXHR9XHJcblx0LnJlZ2lzdGVyIGgxe1xyXG5cdFx0dGV4dC1hbGlnbjogY2VudGVyO1xyXG5cdFx0bWFyZ2luOiAwO1xyXG5cdH1cclxuXHQucmVnaXN0ZXJidG57XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHR9XHJcblx0Lm1lc3NhZ2Uge1xyXG5cdFx0aGVpZ2h0OiA0MHB4O1xyXG5cdFx0bWFyZ2luLXRvcDogMjBweDtcclxuXHRcdHBhZGRpbmctbGVmdDogMjBweDtcclxuXHQgIGJvcmRlcjogMXB4IHNvbGlkICNkOGRlZTI7XHJcblx0ICBib3JkZXItcmFkaXVzOiA1cHg7XHJcblx0fVxyXG5cdC5tZXNzYWdlIHB7XHJcblx0XHRwYWRkaW5nOiAwO1xyXG5cdFx0bGluZS1oZWlnaHQ6IDQwcHg7XHJcblx0XHRtYXJnaW46IDA7XHJcblx0fVxyXG48L3N0eWxlPlxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvcmVnaXN0ZXIudnVlIiwidmFyIGRpc3Bvc2VkID0gZmFsc2VcbmZ1bmN0aW9uIGluamVjdFN0eWxlIChzc3JDb250ZXh0KSB7XG4gIGlmIChkaXNwb3NlZCkgcmV0dXJuXG4gIHJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4P3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi00NzMyM2JmMlxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vaW5kZXgudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vaW5kZXgudnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9pbmRleC52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LTQ3MzIzYmYyXFxcIixcXFwiaGFzU2NvcGVkXFxcIjpmYWxzZSxcXFwiYnVibGVcXFwiOntcXFwidHJhbnNmb3Jtc1xcXCI6e319fSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vaW5kZXgudnVlXCJcbi8qIHRlbXBsYXRlIGZ1bmN0aW9uYWwgKi9cbnZhciBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18gPSBmYWxzZVxuLyogc3R5bGVzICovXG52YXIgX192dWVfc3R5bGVzX18gPSBpbmplY3RTdHlsZVxuLyogc2NvcGVJZCAqL1xudmFyIF9fdnVlX3Njb3BlSWRfXyA9IG51bGxcbi8qIG1vZHVsZUlkZW50aWZpZXIgKHNlcnZlciBvbmx5KSAqL1xudmFyIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX18gPSBudWxsXG52YXIgQ29tcG9uZW50ID0gbm9ybWFsaXplQ29tcG9uZW50KFxuICBfX3Z1ZV9zY3JpcHRfXyxcbiAgX192dWVfdGVtcGxhdGVfXyxcbiAgX192dWVfdGVtcGxhdGVfZnVuY3Rpb25hbF9fLFxuICBfX3Z1ZV9zdHlsZXNfXyxcbiAgX192dWVfc2NvcGVJZF9fLFxuICBfX3Z1ZV9tb2R1bGVfaWRlbnRpZmllcl9fXG4pXG5Db21wb25lbnQub3B0aW9ucy5fX2ZpbGUgPSBcInNyYy9jb21wb25lbnRzL2luZGV4LnZ1ZVwiXG5cbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChcImRhdGEtdi00NzMyM2JmMlwiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkucmVsb2FkKFwiZGF0YS12LTQ3MzIzYmYyXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9XG4gIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRpc3Bvc2VkID0gdHJ1ZVxuICB9KVxufSkoKX1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50LmV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvaW5kZXgudnVlXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCI8dGVtcGxhdGU+XG5cdDxkaXY+XHJcblx0XHQ8aW5kZXhoZWFkZXI+PC9pbmRleGhlYWRlcj5cclxuXHRcdDxyb3V0ZXItdmlldz48L3JvdXRlci12aWV3PlxyXG5cdDwvZGl2PlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cclxuXHRpbXBvcnQgbGlzdCBmcm9tICcuL2xpc3QudnVlJ1xyXG5cdGltcG9ydCBpbmRleGhlYWRlciBmcm9tICcuL2luZGV4aGVhZGVyLnZ1ZSdcclxuXHRpbXBvcnQgcmVsZWFzZSBmcm9tICcuL3JlbGVhc2UudnVlJ1xyXG5cdGltcG9ydCBkZXRhaWxzcGFnZSBmcm9tICcuL2RldGFpbHMudnVlJ1xyXG5cdGltcG9ydCB1c2VyIGZyb20gJy4vdXNlci52dWUnXHJcblx0aW1wb3J0IHRvcGljZWRpdCBmcm9tICcuL3RvcGljZWRpdC52dWUnXHJcblx0aW1wb3J0IHVzZXJlZGl0IGZyb20gJy4vdXNlcmVkaXQudnVlJ1xyXG5cdGltcG9ydCBsaXN0Ynl0aXRsZSBmcm9tICcuL2xpc3RieXRpdGxlLnZ1ZSdcblx0ZXhwb3J0IGRlZmF1bHQge1xuXHRcdGRhdGEoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcblx0XHRcdH07XG5cdFx0fSxcclxuXHRcdGNvbXBvbmVudHMgOiB7XHJcblx0XHRcdGluZGV4aGVhZGVyLFxyXG5cdFx0XHRsaXN0LFxyXG5cdFx0XHRyZWxlYXNlLFxyXG5cdFx0XHRkZXRhaWxzcGFnZSxcclxuXHRcdFx0dXNlcixcclxuXHRcdFx0dXNlcmVkaXQsXHJcblx0XHRcdGxpc3RieXRpdGxlXHJcblx0XHR9IFxuXHR9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxuXG48L3N0eWxlPlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL2luZGV4LnZ1ZSIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMjI3MTc5YWVcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2xpc3QudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vbGlzdC52dWVcIlxuaW1wb3J0IF9fdnVlX3NjcmlwdF9fIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL2xpc3QudnVlXCJcbi8qIHRlbXBsYXRlICovXG5pbXBvcnQgX192dWVfdGVtcGxhdGVfXyBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXIvaW5kZXg/e1xcXCJpZFxcXCI6XFxcImRhdGEtdi0yMjcxNzlhZVxcXCIsXFxcImhhc1Njb3BlZFxcXCI6ZmFsc2UsXFxcImJ1YmxlXFxcIjp7XFxcInRyYW5zZm9ybXNcXFwiOnt9fX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL2xpc3QudnVlXCJcbi8qIHRlbXBsYXRlIGZ1bmN0aW9uYWwgKi9cbnZhciBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18gPSBmYWxzZVxuLyogc3R5bGVzICovXG52YXIgX192dWVfc3R5bGVzX18gPSBpbmplY3RTdHlsZVxuLyogc2NvcGVJZCAqL1xudmFyIF9fdnVlX3Njb3BlSWRfXyA9IG51bGxcbi8qIG1vZHVsZUlkZW50aWZpZXIgKHNlcnZlciBvbmx5KSAqL1xudmFyIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX18gPSBudWxsXG52YXIgQ29tcG9uZW50ID0gbm9ybWFsaXplQ29tcG9uZW50KFxuICBfX3Z1ZV9zY3JpcHRfXyxcbiAgX192dWVfdGVtcGxhdGVfXyxcbiAgX192dWVfdGVtcGxhdGVfZnVuY3Rpb25hbF9fLFxuICBfX3Z1ZV9zdHlsZXNfXyxcbiAgX192dWVfc2NvcGVJZF9fLFxuICBfX3Z1ZV9tb2R1bGVfaWRlbnRpZmllcl9fXG4pXG5Db21wb25lbnQub3B0aW9ucy5fX2ZpbGUgPSBcInNyYy9jb21wb25lbnRzL2xpc3QudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LTIyNzE3OWFlXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtMjI3MTc5YWVcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9saXN0LnZ1ZVxuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHRlbXBsYXRlPlxuXHQ8ZWwtbWFpbiBjbGFzcz1cImxpc3RcIj5cclxuXHRcdDxlbC1jYXJkIGNsYXNzPVwiYm94LWNhcmRcIiA+XHJcblx0XHRcdDxkaXYgc2xvdD1cImhlYWRlclwiIGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuXHRcdFx0XHQ8ZWwtZHJvcGRvd24gQGNvbW1hbmQ9XCJoYW5kbGVDb21tYW5kXCIgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVsLWRyb3Bkb3duLWxpbmtcIj5cclxuXHRcdFx0XHRcdFx0e3t0b3BpY2NsYXNzfX08aSBjbGFzcz1cImVsLWljb24tYXJyb3ctZG93biBlbC1pY29uLS1yaWdodFwiPjwvaT5cclxuXHRcdFx0XHRcdDwvc3Bhbj5cclxuXHRcdFx0XHRcdDxlbC1kcm9wZG93bi1tZW51IHNsb3Q9XCJkcm9wZG93blwiPlxyXG5cdFx0XHRcdFx0XHQ8ZWwtZHJvcGRvd24taXRlbSBjb21tYW5kPVwiXCI+5YWo6YOoPC9lbC1kcm9wZG93bi1pdGVtPlxyXG5cdFx0XHRcdFx0XHQ8ZWwtZHJvcGRvd24taXRlbSBjb21tYW5kPVwidGVjaG5vbG9neVwiPuaKgOacrzwvZWwtZHJvcGRvd24taXRlbT5cclxuXHRcdFx0XHRcdFx0PGVsLWRyb3Bkb3duLWl0ZW0gY29tbWFuZD1cImxpdGVyYXR1cmVcIj7mloflraY8L2VsLWRyb3Bkb3duLWl0ZW0+XHJcblx0XHRcdFx0XHRcdDxlbC1kcm9wZG93bi1pdGVtIGNvbW1hbmQ9XCJTcG9ydHNcIj7kvZPogrI8L2VsLWRyb3Bkb3duLWl0ZW0+XHJcblx0XHRcdFx0XHRcdDxlbC1kcm9wZG93bi1pdGVtIGNvbW1hbmQ9XCJtZXRhcGh5c2ljc1wiPueOhOWtpjwvZWwtZHJvcGRvd24taXRlbT5cclxuXHRcdFx0XHRcdFx0PGVsLWRyb3Bkb3duLWl0ZW0gY29tbWFuZD1cImVudGVydGFpbm1lbnRcIj7lqLHkuZA8L2VsLWRyb3Bkb3duLWl0ZW0+XHJcblx0XHRcdFx0XHQ8L2VsLWRyb3Bkb3duLW1lbnU+XHJcblx0XHRcdFx0PC9lbC1kcm9wZG93bj5cclxuXHRcdFx0XHQ8ZWwtYnV0dG9uIFxyXG5cdFx0XHRcdFx0Y2xhc3M9XCJyZWxlYXNlXCIgXHJcblx0XHRcdFx0XHR0eXBlPVwicHJpbWFyeVwiIFxyXG5cdFx0XHRcdFx0QGNsaWNrID0gXCJnb3JlbGVhc2VcIlxyXG5cdFx0XHRcdFx0aWNvbj1cImVsLWljb24tZWRpdFwiPlxyXG5cdFx0XHRcdFx05Y+R5biDXHJcblx0XHRcdFx0PC9lbC1idXR0b24+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dCBpdGVtXCIgdi1mb3I9XCIodG9waWMsaW5kZXgpIGluIHRvcGljc1wiIDprZXk9XCJpbmRleFwiPlxyXG5cdFx0XHRcdDxkaXYgdi1zaG93PVwidG9waWNzWzBdXCI+XHJcblx0XHRcdFx0XHQ8aDM+XHJcblx0XHRcdFx0XHRcdDxhIDpocmVmPVwiYCMvZGV0YWlscy8ke3RvcGljLl9pZH1gXCI+e3t0b3BpYy50aXRsZX19PC9hPiBcclxuXHRcdFx0XHRcdFx0PGVsLWJ1dHRvbiBcclxuXHRcdFx0XHRcdFx0XHRzaXplPVwibWluaVwiXHJcblx0XHRcdFx0XHRcdFx0c3R5bGU9XCJjb2xvcjogIzg4ODtcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc2FibGVkPlxyXG5cdFx0XHRcdFx0XHRcdHt7IHRvcGljLnRvcGljdHlwZSB9fVxyXG5cdFx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGVsLWJhZGdlIDp2YWx1ZT1cInRvcGljLnN0YXJzLmxlbmd0aFwiIDptYXg9XCI5OVwiIGNsYXNzPVwiaXRlbSBzdGFyXCIgdHlwZT1cIndhcm5pbmdcIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZWwtYnV0dG9uIHNpemU9XCJtaW5pXCI+PHNwYW4gY2xhc3M9XCJlbC1pY29uLXN0YXItb25cIj48L3NwYW4+PC9lbC1idXR0b24+XHJcblx0XHRcdFx0XHRcdDwvZWwtYmFkZ2U+XHJcblx0XHRcdFx0XHQ8L2gzPlxyXG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJjb250ZW50XCI+e3sgdG9waWMuY29udGVudCB9fTwvcD5cclxuXHRcdFx0XHRcdDxwIGNsYXNzPVwicHNcIj5cclxuXHRcdFx0XHRcdFx0IOWPkeW4g+aXtumXtCA6IHt7IHRvcGljLmNyZWF0ZV90aW1lIH19XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0XHQ8aHIvPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZWwtY2FyZD5cclxuXHRcdDxkaXYgY2xhc3M9XCJibG9ja1wiPlxyXG4gICAgPGVsLXBhZ2luYXRpb25cclxuXHRcdFx0di1zaG93PVwidG9waWNzWzBdXCJcclxuXHRcdFx0Y2xhc3M9XCJwYWdpbmdcIlxyXG4gICAgICBAc2l6ZS1jaGFuZ2U9XCJoYW5kbGVTaXplQ2hhbmdlXCJcclxuICAgICAgQGN1cnJlbnQtY2hhbmdlPVwiaGFuZGxlQ3VycmVudENoYW5nZVwiXHJcbiAgICAgIDpjdXJyZW50LXBhZ2U9XCJjdXJyZW50UGFnZVwiXHJcbiAgICAgIDpwYWdlLXNpemVzPVwiWzUsIDEwLCAyMCwgMzBdXCJcclxuICAgICAgOnBhZ2Utc2l6ZT1cInBhZ2VzaXplXCJcclxuICAgICAgbGF5b3V0PVwidG90YWwsIHNpemVzLCBwcmV2LCBwYWdlciwgbmV4dCwganVtcGVyXCJcclxuICAgICAgOnRvdGFsPVwiYWxsbGVuZ3RoXCI+XHJcbiAgICA8L2VsLXBhZ2luYXRpb24+XHJcblx0XHQ8aDMgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCIgdi1zaG93PVwiIXRvcGljc1swXVwiPui/mOayoeacieebuOWFs+ivnemimC4uLi5cclxuXHRcdFx0PGEgaHJlZj1cIlwiIEBjbGljay5wcmV2ZW50PVwiZ29yZWxlYXNlXCI+5Y675Y+R5biDPzwvYT5cclxuXHRcdDwvaDM+XHJcbiAgPC9kaXY+XHJcblx0PC9lbC1tYWluPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cblx0ZXhwb3J0IGRlZmF1bHQge1xuXHRcdGRhdGEoKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHR0b3BpY3MgOiBbXSxcclxuICAgICAgICBjdXJyZW50UGFnZSA6IDEsXHJcblx0XHRcdFx0cGFnZXNpemUgOiA1LFxyXG5cdFx0XHRcdGFsbGxlbmd0aCA6IDEsXHJcblx0XHRcdFx0dG9waWN0eXBlIDogJycsXHJcblx0XHRcdFx0dXNlciA6IG51bGxcblx0XHRcdH07XG5cdFx0fSxcclxuXHRcdG1ldGhvZHM6e1xyXG5cdFx0XHRoYW5kbGVTaXplQ2hhbmdlKHZhbCkge1xyXG4vLyAgICAgICAgIGNvbnNvbGUubG9nKGDmr4/pobUgJHt2YWx9IOadoWApO1xyXG4vLyBcdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuY3VycmVudFBhZ2UpXHJcblx0XHRcdFx0dGhpcy5wYWdlc2l6ZSA9IHZhbFxyXG5cdFx0XHRcdHRoaXMuZ2V0bGlzdChgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcz9cclxuXHRcdFx0XHRwYWdlPSR7IHRoaXMuY3VycmVudFBhZ2UgfSZzaXplPSR7dGhpcy5wYWdlc2l6ZX0mdG9waWN0eXBlPSR7dGhpcy50b3BpY3R5cGV9YClcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlQ3VycmVudENoYW5nZSh2YWwpIHtcclxuLy8gICAgICAgICBjb25zb2xlLmxvZyhg5b2T5YmN6aG1OiAke3ZhbH1gKTtcclxuLy8gXHRcdFx0XHRjb25zb2xlLmxvZyh0aGlzLnBhZ2VzaXplKVxyXG5cdFx0XHRcdHRoaXMuY3VycmVudFBhZ2UgPSB2YWxcclxuXHRcdFx0XHR0aGlzLmdldGxpc3QoYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3M/XHJcblx0XHRcdFx0cGFnZT0keyB2YWwgfSZzaXplPSR7dGhpcy5wYWdlc2l6ZX0mdG9waWN0eXBlPSR7dGhpcy50b3BpY3R5cGV9YClcclxuICAgICAgfSxcclxuXHRcdFx0YXN5bmMgZ2V0bGlzdCh1cmwpe1xyXG5cdFx0XHRcdGNvbnN0IHtkYXRhOnJlc2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KHVybCksXHJcblx0XHRcdFx0dG9waWNkYXRhID0gcmVzZGF0YS5kYXRhXHJcblx0XHRcdFx0dG9waWNkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcclxuXHRcdFx0XHRcdHN3aXRjaChpdGVtLnRvcGljdHlwZSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ3RlY2hub2xvZ3knIDogaXRlbS50b3BpY3R5cGUgPSAn5oqA5pyvJ1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdsaXRlcmF0dXJlJyA6IGl0ZW0udG9waWN0eXBlID0gJ+aWh+WtpidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnU3BvcnRzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+S9k+iCsidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiBpdGVtLnRvcGljdHlwZSA9ICflqLHkuZAnXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21ldGFwaHlzaWNzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+eOhOWtpidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdCA6IGl0ZW0udG9waWN0eXBlID0gJ+acquefpSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdHRoaXMudG9waWNzID0gdG9waWNkYXRhXHJcblx0XHRcdFx0dGhpcy5hbGxsZW5ndGggPSByZXNkYXRhLmFsbGxlbmd0aFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRoYW5kbGVDb21tYW5kKGNvbW1hbmQpIHtcclxuICAgICAgICB0aGlzLnRvcGljdHlwZSA9IGNvbW1hbmRcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRQYWdlID0gMVxyXG5cdFx0XHRcdHRoaXMuZ2V0bGlzdChgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcz9cclxuXHRcdFx0XHRwYWdlPSR7IHRoaXMuY3VycmVudFBhZ2UgfSZzaXplPSR7dGhpcy5wYWdlc2l6ZX0mdG9waWN0eXBlPSR7dGhpcy50b3BpY3R5cGV9YClcclxuICAgICAgfSxcclxuXHRcdFx0YXN5bmMgZ29yZWxlYXNlKCl7XHJcblx0XHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YS5zdGF0ZSlcclxuXHRcdFx0XHRpZighZGF0YS5zdGF0ZSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMudXNlciA9IGRhdGEuc3RhdGVcclxuXHRcdFx0XHR0aGlzLiRyb3V0ZXIucHVzaCgnL3JlbGVhc2UnKVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YXN5bmMgY3JlYXRlZCgpe1xyXG5cdFx0XHR0aGlzLmdldGxpc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MnKVxyXG5cdFx0fSxcclxuXHRcdGNvbXB1dGVkOntcclxuXHRcdFx0dG9waWNjbGFzcygpe1xyXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnRvcGljdHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlICd0ZWNobm9sb2d5JyA6IHJldHVybiAn5oqA5pyvJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xpdGVyYXR1cmUnIDogcmV0dXJuICAn5paH5a2mJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ1Nwb3J0cycgOiByZXR1cm4gICfkvZPogrInXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiByZXR1cm4gICflqLHkuZAnXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbWV0YXBoeXNpY3MnIDogcmV0dXJuICAn546E5a2mJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQgOiByZXR1cm4gICflhajpg6gnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XG5cdH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XHJcblx0Lmxpc3R7XHJcblx0XHRcclxuXHR9XHJcblx0Lmxpc3QgLml0ZW0uc3RhcntcclxuXHRcdFxyXG5cdH1cclxuXHQubGlzdCAuaXRlbS5zdGFyIHNwYW57XHJcblx0XHRjb2xvcjogIzAwNzREOTtcclxuXHR9XHJcblx0Lmxpc3QgYXtcclxuXHRcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuXHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuXHRcdGNvbG9yOiAjODA4MDgwO1xyXG5cdH1cclxuXHQubGlzdCBhOmhvdmVye1xyXG5cdFx0Y29sb3I6ICMwMDc0RDk7XHJcblx0fVxuXHQubGlzdCAudGV4dCB7XHJcblx0Zm9udC1zaXplOiAxNHB4O1xyXG59XHJcblxyXG4ubGlzdCAucmVsZWFzZSB7XHJcblx0ZmxvYXQ6IHJpZ2h0O1xyXG5cdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTBweCk7XHJcbn1cclxuLmxpc3QgZGl2LmVsLWNhcmRfX2hlYWRlcntcclxuXHRwYWRkaW5nOiAxNXB4O1xyXG5cdHBhZGRpbmctbGVmdDogMjBweDtcclxufVxyXG4ubGlzdCBkaXYuZWwtY2FyZF9fYm9keXtcclxuXHRwYWRkaW5nOiA1cHg7XHJcblx0cGFkZGluZy1sZWZ0OiAyMHB4O1xyXG59XHJcbi5saXN0IC5jbGVhcmZpeHtcclxuXHRoZWlnaHQ6IDIwcHg7XHJcbn1cclxuLmNsZWFyZml4OmJlZm9yZSxcclxuLmNsZWFyZml4OmFmdGVyIHtcclxuXHRkaXNwbGF5OiB0YWJsZTtcclxuXHRjb250ZW50OiBcIlwiO1xyXG59XHJcbi5jbGVhcmZpeDphZnRlciB7XHJcblx0Y2xlYXI6IGJvdGhcclxufVxyXG5cclxuLmJveC1jYXJkIHtcclxuXHR3aWR0aDogMTAwJTtcclxufVxyXG4ubGlzdCAuY29udGVudHtcclxuXHR0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO1xyXG5cdG92ZXJmbG93OiBoaWRkZW47XHJcblx0d2hpdGUtc3BhY2U6bm93cmFwO1xyXG5cdHBhZGRpbmctcmlnaHQ6IDMwMHB4O1xyXG59XHJcbi5saXN0IHAucHN7XHJcblx0bWFyZ2luOiAxMHB4O1xyXG5cdGZvbnQtc2l6ZTogMTJweDtcclxuXHR0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG4ubGlzdCAucGFnaW5ne1xyXG5cdG1hcmdpbjogMzBweDtcclxuXHRmbG9hdDogcmlnaHQ7XHJcbn1cbjwvc3R5bGU+XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvbGlzdC52dWUiLCI8dGVtcGxhdGU+XHJcblx0PGRpdiBjbGFzcz1cImluZGV4aGVhZGVyXCI+XHJcblx0XHQ8ZWwtbWVudSA6ZGVmYXVsdC1hY3RpdmU9XCJhY3RpdmVJbmRleDJcIlxyXG5cdFx0XHRjbGFzcz1cImVsLW1lbnUtZGVtb1wiXHJcblx0XHRcdG1vZGU9XCJob3Jpem9udGFsXCJcclxuXHRcdFx0YmFja2dyb3VuZC1jb2xvcj1cIiM1NDVjNjRcIlxyXG5cdFx0XHR0ZXh0LWNvbG9yPVwiI2ZmZlwiXHJcblx0XHRcdGFjdGl2ZS10ZXh0LWNvbG9yPVwiI2ZmZDA0YlwiPlxyXG5cdFx0XHQ8ZWwtbWVudS1pdGVtIGluZGV4PVwiMVwiPjxhIGhyZWY9XCIjL1wiPumYheiniOWkp+WOhTwvYT48L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0PGVsLXN1Ym1lbnUgaW5kZXg9XCIyXCI+XHJcblx0XHRcdFx0PHRlbXBsYXRlIHNsb3Q9XCJ0aXRsZVwiPuaIkeeahOW3peS9nOWPsDwvdGVtcGxhdGU+XHJcblx0XHRcdFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cIjItMVwiPumAiemhuTE8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0XHQ8ZWwtbWVudS1pdGVtIGluZGV4PVwiMi0yXCI+6YCJ6aG5MjwvZWwtbWVudS1pdGVtPlxyXG5cdFx0XHRcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XCIyLTNcIj7pgInpobkzPC9lbC1tZW51LWl0ZW0+XHJcblx0XHRcdFx0PGVsLXN1Ym1lbnUgaW5kZXg9XCIyLTRcIj5cclxuXHRcdFx0XHRcdDx0ZW1wbGF0ZSBzbG90PVwidGl0bGVcIj7pgInpobk0PC90ZW1wbGF0ZT5cclxuXHRcdFx0XHRcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XCIyLTQtMVwiPumAiemhuTE8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0XHRcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XCIyLTQtMlwiPumAiemhuTI8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0XHRcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XCIyLTQtM1wiPumAiemhuTM8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0XHQ8L2VsLXN1Ym1lbnU+XHJcblx0XHRcdDwvZWwtc3VibWVudT5cclxuXHRcdFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cIjZcIiBzdHlsZT1cImJvcmRlci1ib3R0b206IG5vbmU7IGJhY2tncm91bmQtY29sb3I6IHJnYig4NCw5MiwxMDApO1wiPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJkZW1vLWlucHV0LXN1ZmZpeFwiPlxyXG5cdFx0XHRcdFx0PGVsLWlucHV0XHJcblx0XHRcdFx0XHRcdHBsYWNlaG9sZGVyPVwi6K+36L6T5YWl5qCH6aKYXCJcclxuXHRcdFx0XHRcdFx0cHJlZml4LWljb249XCJlbC1pY29uLXNlYXJjaFwiXHJcblx0XHRcdFx0XHRcdHNpemU9XCJzbWFsbFwiXHJcblx0XHRcdFx0XHRcdHN0eWxlPVwid2lkdGg6IDIwMHB4OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XCJcclxuXHRcdFx0XHRcdFx0di1tb2RlbD1cImtleXdvcmRcIj5cclxuXHRcdFx0XHRcdDwvZWwtaW5wdXQ+XHJcblx0XHRcdFx0XHQ8ZWwtYnV0dG9uXHJcblx0XHRcdFx0XHRcdHR5cGU9XCJwcmltYXJ5XCJcclxuXHRcdFx0XHRcdFx0c2l6ZT1cInNtYWxsXCIgXHJcblx0XHRcdFx0XHRcdEBjbGljaz1cInF1ZXJ5dGl0bGVcIlxyXG5cdFx0XHRcdFx0XHRzdHlsZT1cIlwiPlxyXG5cdFx0XHRcdFx0XHTmkJzntKJcclxuXHRcdFx0XHRcdDwvZWwtYnV0dG9uPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0PGVsLW1lbnUtaXRlbSBzdHlsZT1cImZsb2F0OiByaWdodDtcIiBpbmRleD1cIjRcIiB2LWlmPVwiIWxvZ2luXCI+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIHNpemU9XCJtaW5pXCI+PGEgaHJlZj1cIiMvbG9naW5cIj7nmbvlvZU8L2E+PC9lbC1idXR0b24+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiB0eXBlPVwic3VjY2Vzc1wiIHNpemU9XCJtaW5pXCI+PGEgaHJlZj1cIiMvcmVnaXN0ZXJcIj7ms6jlhow8L2E+PC9lbC1idXR0b24+XHJcblx0XHRcdDwvZWwtbWVudS1pdGVtPlxyXG5cdFx0XHQ8ZWwtc3VibWVudSBpbmRleD1cIjVcIiB2LWlmPVwibG9naW5cIiBzdHlsZT1cImZsb2F0OiByaWdodDtcIj5cclxuXHRcdFx0XHQ8dGVtcGxhdGUgc2xvdD1cInRpdGxlXCI+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwidXNlclwiPlxyXG5cdFx0XHRcdFx0XHQ8YSBocmVmPVwiXCIgY2xhc3M9XCJwb3J0cmFpdFwiPlxyXG5cdFx0XHRcdFx0XHRcdDxpbWcgOnNyYz1cImBodHRwOi8vMTI3LjAuMC4xOjMwMDAke3VzZXIuYXZhdGFyfWBcIiBhbHQ9XCJcIj5cclxuXHRcdFx0XHRcdFx0PC9hPlxyXG5cdFx0XHRcdFx0XHQ8cD4gPHNwYW4+PC9zcGFuPnt7dXNlci51c2VybmFtZX19PC9wPlxyXG5cdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0PC90ZW1wbGF0ZT5cclxuXHRcdFx0XHQ8ZWwtbWVudS1pdGVtIGluZGV4PVwiNS0xXCI+XHJcblx0XHRcdFx0XHQ8c3BhbiBjbGFzcz1cImVsLWljb24taW5mb1wiPiA8L3NwYW4+IFxyXG5cdFx0XHRcdFx0PGEgOmhyZWY9XCJgIy91c2VyLyR7dXNlci5faWR9YFwiIHN0eWxlPVwiY29sb3I6IHdoaXRlO1wiPiDkuKrkurrkuLvpobU8L2E+XHJcblx0XHRcdFx0PC9lbC1tZW51LWl0ZW0+XHJcblx0XHRcdFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cIjUtMlwiPjxzcGFuIGNsYXNzPVwiZWwtaWNvbi1kb2N1bWVudFwiPiA8L3NwYW4+IOaIkeeahOivnemimDwvZWwtbWVudS1pdGVtPlxyXG5cdFx0XHRcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XCI1LTNcIiBAY2xpY2s9XCJsb2dvdXRcIj48c3BhbiBjbGFzcz1cImVsLWljb24tZXJyb3JcIj4gPC9zcGFuPiDpgIDlh7rnmbvlvZU8L2VsLW1lbnUtaXRlbT5cclxuXHRcdFx0PC9lbC1zdWJtZW51PlxyXG5cdFx0PC9lbC1tZW51PlxyXG5cdDwvZGl2PlxyXG48L3RlbXBsYXRlPlxyXG5cclxuPHNjcmlwdD5cclxuXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXHJcblx0YXhpb3MuZGVmYXVsdHMud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxyXG5cdGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgYWN0aXZlSW5kZXg6ICcxJyxcclxuICAgICAgICBhY3RpdmVJbmRleDI6ICcxJyxcclxuXHRcdFx0XHRsb2dpbiA6IGZhbHNlLFxyXG5cdFx0XHRcdHVzZXIgOiB7fSxcclxuXHRcdFx0XHRrZXl3b3JkIDogJydcclxuICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBtZXRob2RzOiB7XHJcbiAgICAgIGFzeW5jIGxvZ291dCgpe1xyXG5cdFx0XHRcdGNvbnN0IHtkYXRhfSA9IGF3YWl0IGF4aW9zLmRlbGV0ZSgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Nlc3Npb24nKVxyXG5cdFx0XHRcdGlmKCFkYXRhLnN0YXRlKXtcclxuXHRcdFx0XHRcdHRoaXMubG9naW4gPSBmYWxzZVxyXG5cdFx0XHRcdFx0dGhpcy51c2VyID0gZGF0YS5zdGF0ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cXVlcnl0aXRsZSgpe1xyXG5cdFx0XHRcdHRoaXMua2V5d29yZC50cmltKClcclxuXHRcdFx0XHRpZih0aGlzLmtleXdvcmQgPT09ICcnKVx0cmV0dXJuIHRoaXMuJHJvdXRlci5wdXNoKCcvJylcclxuXHRcdFx0XHR0aGlzLiRyb3V0ZXIucHVzaCgnL2xpc3RieXRpdGxlP2tleXdvcmQ9Jyt0aGlzLmtleXdvcmQpXHJcblx0XHRcdH1cclxuICAgIH0sXHJcblx0XHRhc3luYyBjcmVhdGVkKCl7XHJcblx0XHRcdGNvbnN0IHtkYXRhfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Nlc3Npb24nKVxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhkYXRhLnN0YXRlKVxyXG5cdFx0XHRpZihkYXRhLnN0YXRlKXtcclxuXHRcdFx0XHR0aGlzLmxvZ2luID0gdHJ1ZVxyXG5cdFx0XHRcdHRoaXMudXNlciA9IGRhdGEuc3RhdGVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG4gIH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGUgc2NvcGVkPlxyXG5cdC8qIC5pbmRleGhlYWRlcntcclxuXHRcdHBvc2l0aW9uOiBmaXhlZDtcclxuXHRcdHRvcDogMDtcclxuXHRcdGxlZnQ6IDA7XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHRcdHotaW5kZXg6IDEwMDAwO1xyXG5cdH0gKi9cclxuYXtcclxuXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbn1cclxuLnVzZXJ7XHJcblx0ZmxvYXQ6IGxlZnQ7XHJcblx0d2lkdGg6IDUwcHg7XHJcbn1cclxuLnVzZXIgcHtcclxuXHRtYXJnaW46IDA7XHJcblx0aGVpZ2h0OiAyMHB4O1xyXG5cdGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG5cdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRmb250LXNpemU6IDEycHg7XHJcbn1cclxuLnBvcnRyYWl0e1xyXG5cdGRpc3BsYXk6IGJsb2NrO1xyXG5cdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcblx0d2lkdGg6IDM1cHg7XHJcblx0aGVpZ2h0OiAzNXB4O1xyXG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuXHRib3JkZXItcmFkaXVzOiA1MCU7XHJcblx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuXHRtYXJnaW46IDAgYXV0bztcclxufVxyXG4ucG9ydHJhaXQgaW1ne1xyXG5cdHdpZHRoOiAzNXB4O1xyXG5cdGhlaWdodDogMzVweDtcclxuXHRib3JkZXItcmFkaXVzOiA1MCU7XHJcblx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdGxlZnQ6IDA7XHJcblx0dG9wOiAwO1xyXG59XHJcbjwvc3R5bGU+XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlIiwidmFyIGRpc3Bvc2VkID0gZmFsc2VcbmZ1bmN0aW9uIGluamVjdFN0eWxlIChzc3JDb250ZXh0KSB7XG4gIGlmIChkaXNwb3NlZCkgcmV0dXJuXG4gIHJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4P3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0zZjJiNTZhN1xcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vcmVsZWFzZS52dWVcIilcbn1cbnZhciBub3JtYWxpemVDb21wb25lbnQgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9jb21wb25lbnQtbm9ybWFsaXplclwiKVxuLyogc2NyaXB0ICovXG5leHBvcnQgKiBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9yZWxlYXNlLnZ1ZVwiXG5pbXBvcnQgX192dWVfc2NyaXB0X18gZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vcmVsZWFzZS52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LTNmMmI1NmE3XFxcIixcXFwiaGFzU2NvcGVkXFxcIjpmYWxzZSxcXFwiYnVibGVcXFwiOntcXFwidHJhbnNmb3Jtc1xcXCI6e319fSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vcmVsZWFzZS52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gbnVsbFxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvcmVsZWFzZS52dWVcIlxuXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7XG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoXCJkYXRhLXYtM2YyYjU2YTdcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnJlbG9hZChcImRhdGEtdi0zZjJiNTZhN1wiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfVxuICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkaXNwb3NlZCA9IHRydWVcbiAgfSlcbn0pKCl9XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudC5leHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCI8dGVtcGxhdGU+XHJcblx0PGVsLW1haW4gY2xhc3M9XCJyZWxlYXNlY29uZW50XCI+XHJcblx0PGVsLWZvcm0gOm1vZGVsPVwicnVsZUZvcm1cIiA6cnVsZXM9XCJydWxlc1wiIHJlZj1cInJ1bGVGb3JtXCIgbGFiZWwtd2lkdGg9XCIxMDBweFwiIGNsYXNzPVwiZGVtby1ydWxlRm9ybVwiPlxyXG5cdFx0PGVsLWJyZWFkY3J1bWIgc2VwYXJhdG9yPVwiL1wiIGNsYXNzPVwibmF2XCI+XHJcblx0XHRcdDxlbC1icmVhZGNydW1iLWl0ZW0gOnRvPVwieyBwYXRoOiAnLycgfVwiPummlumhtTwvZWwtYnJlYWRjcnVtYi1pdGVtPlxyXG5cdFx0XHQ8ZWwtYnJlYWRjcnVtYi1pdGVtPjxhIGhyZWY9XCIjL3JlbGVhc2VcIj7or53popjlj5HluIM8L2E+PC9lbC1icmVhZGNydW1iLWl0ZW0+XHJcblx0XHQ8L2VsLWJyZWFkY3J1bWI+XHJcblx0XHQ8aHIvPlxyXG5cdFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cIuivnemimOWIhuexu1wiIHByb3A9XCJ0b3BpY3R5cGVcIj5cclxuXHRcdFx0PGVsLXNlbGVjdCB2LW1vZGVsPVwicnVsZUZvcm0udG9waWN0eXBlXCIgcGxhY2Vob2xkZXI9XCLor7fpgInmi6nor53popjliIbnsbtcIj5cclxuXHRcdFx0XHQ8ZWwtb3B0aW9uIGxhYmVsPVwi5oqA5pyvXCIgdmFsdWU9XCJ0ZWNobm9sb2d5XCI+PC9lbC1vcHRpb24+XHJcblx0XHRcdFx0PGVsLW9wdGlvbiBsYWJlbD1cIuaWh+WtplwiIHZhbHVlPVwibGl0ZXJhdHVyZVwiPjwvZWwtb3B0aW9uPlxyXG5cdFx0XHRcdDxlbC1vcHRpb24gbGFiZWw9XCLkvZPogrJcIiB2YWx1ZT1cIlNwb3J0c1wiPjwvZWwtb3B0aW9uPlxyXG5cdFx0XHRcdDxlbC1vcHRpb24gbGFiZWw9XCLlqLHkuZBcIiB2YWx1ZT1cImVudGVydGFpbm1lbnRcIj48L2VsLW9wdGlvbj5cclxuXHRcdFx0XHQ8ZWwtb3B0aW9uIGxhYmVsPVwi546E5a2mXCIgdmFsdWU9XCJtZXRhcGh5c2ljc1wiPjwvZWwtb3B0aW9uPlxyXG5cdFx0XHQ8L2VsLXNlbGVjdD5cclxuXHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cIuagh+mimFwiIHByb3A9XCJ0aXRsZVwiPlxyXG5cdFx0XHQ8ZWwtaW5wdXQgdi1tb2RlbD1cInJ1bGVGb3JtLnRpdGxlXCI+PC9lbC1pbnB1dD5cclxuXHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cIuivnemimOWGheWuuVwiIHByb3A9XCJjb250ZW50XCI+XHJcblx0XHRcdDxlbC1pbnB1dCB0eXBlPVwidGV4dGFyZWFcIiB2LW1vZGVsPVwicnVsZUZvcm0uY29udGVudFwiIGNvbHM9XCI4MFwiIGNsYXNzPVwiLnRleHRhcmVhXCI+PC9lbC1pbnB1dD5cclxuXHRcdFx0PCEtLSA8dGV4dGFyZWEgbmFtZT1cIlwiIGlkPVwiXCIgY29scz1cIjEwMFwiIHJvd3M9XCIyMFwiIHYtbW9kZWw9XCJydWxlRm9ybS5kZXNjXCIgY2xhc3M9XCIudGV4dGFyZWFcIj48L3RleHRhcmVhPiAtLT5cclxuXHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0PGVsLWZvcm0taXRlbT5cclxuXHRcdFx0PGVsLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIEBjbGljaz1cInN1Ym1pdEZvcm0oJ3J1bGVGb3JtJylcIj7lj5HluIM8L2VsLWJ1dHRvbj5cclxuXHRcdFx0PGVsLWJ1dHRvbiBAY2xpY2s9XCJyZXNldEZvcm0oJ3J1bGVGb3JtJylcIj7ph43nva48L2VsLWJ1dHRvbj5cclxuXHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdDwvZWwtZm9ybT5cclxuXHQ8L2VsLW1haW4+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5cdGltcG9ydCBheGlvcyBmcm9tICdheGlvcydcclxuXHRleHBvcnQgZGVmYXVsdCB7XHJcblx0XHRkYXRhKCkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHJ1bGVGb3JtOiB7XHJcblx0XHRcdFx0XHR0aXRsZTogJycsXHJcblx0XHRcdFx0XHR0b3BpY3R5cGU6ICcnLFxyXG5cdFx0XHRcdFx0Y29udGVudDogJydcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJ1bGVzOiB7XHJcblx0XHRcdFx0XHR0aXRsZTogW3tcclxuXHRcdFx0XHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAn5qCH6aKY5LiN6IO95Li656m6JyxcclxuXHRcdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdG1pbjogMixcclxuXHRcdFx0XHRcdFx0XHRtYXg6IDMwLFxyXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfplb/luqblnKggMiDliLAgMzAg5Liq5a2X56ymJyxcclxuXHRcdFx0XHRcdFx0XHR0cmlnZ2VyOiAnYmx1cidcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdHRvcGljdHlwZTogW3tcclxuXHRcdFx0XHRcdFx0cmVxdWlyZWQ6IHRydWUsXHJcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7fpgInmi6nor53popjnsbvlnosnLFxyXG5cdFx0XHRcdFx0XHR0cmlnZ2VyOiAnY2hhbmdlJ1xyXG5cdFx0XHRcdFx0fV0sXHJcblx0XHRcdFx0XHRjb250ZW50OiBbe1xyXG5cdFx0XHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0bWVzc2FnZTogJ+ivnemimOWGheWuueS4jeiDveS4uuepuicsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXI6ICdibHVyJ1xyXG5cdFx0XHRcdFx0fV1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9LFxyXG5cdFx0bWV0aG9kczoge1xyXG5cdFx0XHRzdWJtaXRGb3JtKGZvcm1OYW1lKSB7XHJcblx0XHRcdFx0dGhpcy4kcmVmc1tmb3JtTmFtZV0udmFsaWRhdGUoYXN5bmMgKHZhbGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodmFsaWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3Qge2RhdGE6dG9waWNkYXRhfSA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MnLHRoaXMucnVsZUZvcm0pXHJcblx0XHRcdFx0XHRcdGlmKHRvcGljZGF0YS5lcnIgPT09IFwi5rKh5pyJ5p2D6ZmQXCIpe1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcclxuXHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxyXG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighdG9waWNkYXRhLmVycil7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAn5Y+R5biD5oiQ5YqfJyxcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6ICdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0dGhpcy4kcm91dGVyLnB1c2goJy8nKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3Igc3VibWl0ISEnKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZXNldEZvcm0oZm9ybU5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS5yZXNldEZpZWxkcygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG48L3NjcmlwdD5cclxuXHJcbjxzdHlsZT5cclxuLnJlbGVhc2Vjb25lbnR7XHJcblx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cclxufVxyXG4uZGVtby1ydWxlRm9ybXtcclxuXHRcclxufVxyXG4ubmF2e1xyXG5cdG1hcmdpbi10b3A6IDBweDtcclxuXHRtYXJnaW4tYm90dG9tOiAyMHB4O1xyXG59XHJcbi5lbC10ZXh0YXJlYV9faW5uZXJ7XHJcblx0bWluLWhlaWdodDogMjUwcHggIWltcG9ydGFudDtcclxufVxyXG48L3N0eWxlPlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlIiwidmFyIGRpc3Bvc2VkID0gZmFsc2VcbmZ1bmN0aW9uIGluamVjdFN0eWxlIChzc3JDb250ZXh0KSB7XG4gIGlmIChkaXNwb3NlZCkgcmV0dXJuXG4gIHJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4P3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi04ZDY0ZTkzY1xcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vZGV0YWlscy52dWVcIilcbn1cbnZhciBub3JtYWxpemVDb21wb25lbnQgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9jb21wb25lbnQtbm9ybWFsaXplclwiKVxuLyogc2NyaXB0ICovXG5leHBvcnQgKiBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9kZXRhaWxzLnZ1ZVwiXG5pbXBvcnQgX192dWVfc2NyaXB0X18gZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vZGV0YWlscy52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LThkNjRlOTNjXFxcIixcXFwiaGFzU2NvcGVkXFxcIjpmYWxzZSxcXFwiYnVibGVcXFwiOntcXFwidHJhbnNmb3Jtc1xcXCI6e319fSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vZGV0YWlscy52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gbnVsbFxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvZGV0YWlscy52dWVcIlxuXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7XG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoXCJkYXRhLXYtOGQ2NGU5M2NcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnJlbG9hZChcImRhdGEtdi04ZDY0ZTkzY1wiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfVxuICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkaXNwb3NlZCA9IHRydWVcbiAgfSlcbn0pKCl9XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudC5leHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21wb25lbnRzL2RldGFpbHMudnVlXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCI8dGVtcGxhdGU+XHJcblx0PGVsLW1haW4gY2xhc3M9XCJkZXRhaWxzXCI+XHJcblx0XHQ8ZWwtYnJlYWRjcnVtYiBzZXBhcmF0b3I9XCIvXCIgY2xhc3M9XCJuYXZcIj5cclxuXHRcdFx0PGVsLWJyZWFkY3J1bWItaXRlbSA6dG89XCJ7IHBhdGg6ICcvJyB9XCI+6aaW6aG1PC9lbC1icmVhZGNydW1iLWl0ZW0+XHJcblx0XHRcdDxlbC1icmVhZGNydW1iLWl0ZW0+PGEgaHJlZj1cImphdmFzY3JpcHQ6XCI+6K+d6aKY6K+m5oOFPC9hPjwvZWwtYnJlYWRjcnVtYi1pdGVtPlxyXG5cdFx0PC9lbC1icmVhZGNydW1iPlxyXG5cdFx0PGhyLz5cblx0XHQ8ZWwtY2FyZCBjbGFzcz1cImJveC1jYXJkXCI+XHJcblx0XHRcdDxkaXYgc2xvdD1cImhlYWRlclwiIGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cInRpdGxlXCI+e3sgdG9waWMudGl0bGUgfX08L3NwYW4+XHJcblx0XHRcdFx0PHNwYW4gY2xhc3M9XCJhdXRob3JcIj7kvZzogIUgOiA8YSBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkO1wiIDpocmVmPVwiYCMvdXNlci8ke2F1dGhvci5faWR9YFwiPnt7YXV0aG9yLnVzZXJuYW1lfX08L2E+PC9zcGFuPlxyXG5cdFx0XHRcdDxzcGFuIDpjbGFzcz1cInN0YXI/J2VsLWljb24tc3Rhci1vZmYgc3RhcnMnOidlbC1pY29uLXN0YXItb24gc3RhcnMnXCIgQGNsaWNrPVwic2V0c3RhclwiPiBcclxuXHRcdFx0XHRcdHt7IHN0YXJzIH19XHJcblx0XHRcdFx0PC9zcGFuPlxyXG5cdFx0XHRcdDxzcGFuIGNsYXNzPVwiY3JlYXRlX3RpbWVcIj7liJvlu7rml7bpl7QgOiB7e3RvcGljLmNyZWF0ZV90aW1lfX08L3NwYW4+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dCBpdGVtXCI+XHJcblx0XHRcdFx0PHA+XHJcblx0XHRcdFx0XHR7e3RvcGljLmNvbnRlbnR9fVxyXG5cdFx0XHRcdDwvcD5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3BlcmF0aW9uXCIgdi1pZj1cIm9wZXJhdGlvblwiIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O1wiPlxyXG5cdFx0XHRcdFx0PGVsLWJ1dHRvbiB0eXBlPVwicHJpbWFyeVwiIGljb249XCJlbC1pY29uLWVkaXQtb3V0bGluZVwiIHNpemU9XCJtaW5pXCI+XHJcblx0XHRcdFx0XHRcdDxhIDpocmVmPVwiYCMvdG9waWNlZGl0LyR7dG9waWMuX2lkfWBcIj7nvJbovpE8L2E+XHJcblx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdDxlbC1idXR0b24gdHlwZT1cImRhbmdlclwiIGljb249XCJlbC1pY29uLWRlbGV0ZVwiIHNpemU9XCJtaW5pXCI+XHJcblx0XHRcdFx0XHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OlwiIDpkYXRhLWlkPVwidG9waWMuX2lkXCIgQGNsaWNrPVwiZGVsZXRldG9waWNcIj7liKDpmaQ8L2E+XHJcblx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2VsLWNhcmQ+XHJcblx0XHQ8ZWwtY2FyZCBjbGFzcz1cImJveC1jYXJkIGNvbW1lbnRcIiB2LXNob3c9XCJjb21tZW50c1swXVwiPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dCBpdGVtXCIgdi1mb3I9XCIoY29tbWVudCxpbmRleCkgaW4gY29tbWVudHNcIiA6a2V5PVwiaW5kZXhcIj5cclxuXHRcdFx0XHQ8YSA6aHJlZj1cImAjL3VzZXIvJHtjb21tZW50LnVzZXIuX2lkfWBcIiBjbGFzcz1cImF2YXRhclwiPjxpbWcgOnNyYz1cImBodHRwOi8vMTI3LjAuMC4xOjMwMDAke2NvbW1lbnQudXNlci5hdmF0YXJ9YFwiIGFsdD1cIlwiPjwvYT5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiY29tbWVudGNvbnRlbnRcIj5cclxuXHRcdFx0XHRcdDxoNj5cclxuXHRcdFx0XHRcdFx055So5oi3IDogPGEgOmhyZWY9XCJgIy91c2VyLyR7Y29tbWVudC51c2VyLl9pZH1gXCI+IHt7IGNvbW1lbnQudXNlci51c2VybmFtZSB9fTwvYT4mbmJzcDsgJm5ic3A7XHJcblx0XHRcdFx0XHRcdDxzcGFuPiB7eyBjb21tZW50LmNyZWF0ZV90aW1lIH19PC9zcGFuPlxyXG5cdFx0XHRcdFx0PC9oNj5cclxuXHRcdFx0XHRcdDxwPnt7IGNvbW1lbnQuY29udGVudCB9fTwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2VsLWNhcmQ+XHJcblx0XHQ8ZWwtY2FyZCBjbGFzcz1cImJveC1jYXJkXCIgdi1zaG93PVwiIWNvbW1lbnRzWzBdXCI+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJ0ZXh0IGl0ZW1cIj5cclxuXHRcdFx0XHQ8aDUgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+5pqC5pe26L+Y5rKh5Lq655WZ6KiALi4uLi4uLi4uLi48L2g1PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZWwtY2FyZD5cclxuXHRcdDxkaXYgY2xhc3M9XCJkZW1vLWlucHV0LXNpemVcIj5cclxuXHRcdFx0PGVsLWlucHV0XHJcblx0XHRcdFx0cGxhY2Vob2xkZXI9XCLlj5HooajkvaDnmoTnnIvms5UuLi5cIlxyXG5cdFx0XHRcdHN1ZmZpeC1pY29uPVwiZWwtaWNvbi1kYXRlXCJcclxuXHRcdFx0XHR2LW1vZGVsPVwibndlbWVzc2FnZVwiPlxyXG5cdFx0XHQ8L2VsLWlucHV0PlxyXG5cdFx0XHQ8ZWwtYnV0dG9uIFxyXG5cdFx0XHRcdHR5cGU9XCJwcmltYXJ5XCIgXHJcblx0XHRcdFx0aWNvbj1cImVsLWljb24tZWRpdFwiIFxyXG5cdFx0XHRcdGNsYXNzPVwic2VuZG1lc3NhZ2VcIlxyXG5cdFx0XHRcdEBjbGljaz1cInNlbmRtZXNzYWdlXCI+XHJcblx0XHRcdDwvZWwtYnV0dG9uPlxyXG5cdFx0PC9kaXY+XHJcblx0PC9lbC1tYWluPlxuPC90ZW1wbGF0ZT5cblxuPHNjcmlwdD5cclxuXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cdGV4cG9ydCBkZWZhdWx0IHtcblx0XHRkYXRhKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dG9waWMgOiB7fSxcclxuXHRcdFx0XHRhdXRob3IgOiB7fSxcclxuXHRcdFx0XHRjb21tZW50cyA6IFtdLFxyXG5cdFx0XHRcdG53ZW1lc3NhZ2UgOiAnJyxcclxuXHRcdFx0XHRvcGVyYXRpb24gOiBmYWxzZSxcclxuXHRcdFx0XHRzdGFycyA6IDAsXHJcblx0XHRcdFx0c3RhciA6IHRydWVcblx0XHRcdH07XG5cdFx0fSxcclxuXHRcdGFzeW5jIGNyZWF0ZWQoKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2codGhpcy4kcm91dGUucGFyYW1zKVxyXG5cdFx0XHRsZXQgY3VycmVudHVzZXJfaWQgPSAnJ1xyXG5cdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zXHJcblx0XHRcdGNvbnN0IHtkYXRhIDogdG9waWN9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvdG9waWNzL2RldGFpbHM/X2lkPScraWQpXHJcblx0XHRcdGNvbnN0IHtkYXRhIDogYXV0aG9yfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP19pZD0nK3RvcGljLnVzZXJfaWQpXHJcblx0XHRcdGlmKCFhdXRob3IuZXJyKXtcclxuXHRcdFx0XHR0aGlzLmF1dGhvciA9IGF1dGhvclswXVxyXG5cdFx0XHRcdGNvbnN0IHtkYXRhIDogY3VycmVudHVzZXJ9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXHJcblx0XHRcdFx0aWYoY3VycmVudHVzZXIuc3RhdGUpe1xyXG5cdFx0XHRcdFx0Y3VycmVudHVzZXJfaWQgPSBjdXJyZW50dXNlci5zdGF0ZS5faWRcclxuXHRcdFx0XHRcdGlmKHRoaXMuYXV0aG9yLl9pZCA9PT0gY3VycmVudHVzZXIuc3RhdGUuX2lkKXtcclxuXHRcdFx0XHRcdFx0dGhpcy5vcGVyYXRpb24gPSB0cnVlXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCF0b3BpYy5lcnIpe1xyXG5cdFx0XHRcdHRoaXMudG9waWMgPSB0b3BpY1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZ2V0Y29tbWVudHMoKVxyXG5cdFx0XHR0aGlzLnN0YXJzID0gdGhpcy50b3BpYy5zdGFycy5sZW5ndGhcclxuXHRcdFx0aWYoY3VycmVudHVzZXJfaWQpe1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHRoaXMuc3RhcnMpXHJcblx0XHRcdFx0dGhpcy5zdGFyID0gdGhpcy50b3BpYy5zdGFycy5pbmRleE9mKGN1cnJlbnR1c2VyX2lkKSA9PT0gLTEgPyB0cnVlIDogZmFsc2VcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXJzLmluZGV4T2YoY3VycmVudHVzZXJfaWQpKVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0bWV0aG9kczp7XHJcblx0XHRcdGFzeW5jIGRlbGV0ZXRvcGljKGUpe1xyXG5cdFx0XHRcdGNvbnN0IGlkID0gZS50YXJnZXQuZGF0YXNldFtcImlkXCJdXHJcblx0XHRcdFx0Y29uc3Qge2RhdGE6dG9waWNkYXRhfSA9IGF3YWl0IGF4aW9zLmRlbGV0ZShgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy8ke2lkfWApXHJcblx0XHRcdFx0aWYodG9waWNkYXRhLmVyciA9PT0gXCLmsqHmnInmnYPpmZBcIil7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCF0b3BpY2RhdGEuZXJyKXtcclxuXHRcdFx0XHRcdHRoaXMuJG1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiAn5Yig6Zmk5oiQ5YqfJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3N1Y2Nlc3MnLFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdHRoaXMuJHJvdXRlci5nbygtMSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFzeW5jIGdldGNvbW1lbnRzKCl7XHJcblx0XHRcdFx0Y29uc3Qge2lkfSA9IHRoaXMuJHJvdXRlLnBhcmFtcyBcclxuXHRcdFx0XHRjb25zdCB7ZGF0YSA6IGNvbW1lbnRzfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2NvbW1lbnRzP2FydGljbGVfaWQ9JytpZClcclxuXHRcdFx0XHRpZighY29tbWVudHMuZXJyKXtcclxuXHRcdFx0XHRcdHRoaXMuY29tbWVudHMgPSBjb21tZW50c1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2codGhpcy5jb21tZW50cylcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFzeW5jIHNlbmRtZXNzYWdlKCl7XHJcblx0XHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YS5zdGF0ZSlcclxuXHRcdFx0XHRpZighZGF0YS5zdGF0ZSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUhJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zIFxyXG5cdFx0XHRcdGNvbnN0IHtkYXRhIDogY29tbWVudH0gPSBhd2FpdCBheGlvcy5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvY29tbWVudHMnLHtcclxuXHRcdFx0XHRcdGNvbnRlbnQgOiB0aGlzLm53ZW1lc3NhZ2UsXHJcblx0XHRcdFx0XHRhcnRpY2xlX2lkIDogaWRcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdGlmKCFjb21tZW50LmVycil7XHJcblx0XHRcdFx0XHR0aGlzLm53ZW1lc3NhZ2UgPSAnJ1xyXG5cdFx0XHRcdFx0dGhpcy5nZXRjb21tZW50cygpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhc3luYyBzZXRzdGFyKCl7XHJcblx0XHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YS5zdGF0ZSlcclxuXHRcdFx0XHRpZighZGF0YS5zdGF0ZSl7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxyXG5cdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnN0IHVzZXJfaWQgPSBkYXRhLnN0YXRlLl9pZFxyXG5cdFx0XHRcdGxldCBzdGFycyA9IHRoaXMudG9waWMuc3RhcnNcclxuXHRcdFx0XHRjb25zdCBzdGFyX2lkeCA9IHN0YXJzLmluZGV4T2YodXNlcl9pZClcclxuXHRcdFx0XHRpZihzdGFyX2lkeCA9PT0gLTEpe1xyXG5cdFx0XHRcdFx0c3RhcnMucHVzaCh1c2VyX2lkKVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzdGFycy5zcGxpY2Uoc3Rhcl9pZHgsMSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y29uc3Qge2RhdGEgOiBuZXd0b3BpY30gPSBhd2FpdCBheGlvcy5wYXRjaChgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy9zdGFyLyR7dGhpcy50b3BpYy5faWR9YCx7c3RhcnMgOiBzdGFyc30pXHJcblx0XHRcdFx0aWYoIW5ld3RvcGljLmVycil7XHJcblx0XHRcdFx0XHR0aGlzLnN0YXJzID0gc3RhcnMubGVuZ3RoXHJcblx0XHRcdFx0XHR0aGlzLnN0YXIgPSB0aGlzLnN0YXIgPyBmYWxzZSA6IHRydWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gXHJcblx0XHR9XG5cdH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XHJcblx0LmRldGFpbHN7XHJcblx0XHQvKiBtYXJnaW4tdG9wOiA2MXB4OyAqL1xyXG5cdH1cclxuXHQuZGV0YWlscyBhe1xyXG5cdFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG5cdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG5cdFx0Y29sb3I6ICM4MDgwODA7XHJcblx0fVxyXG5cdC5kZXRhaWxzIGE6aG92ZXJ7XHJcblx0XHRjb2xvcjogIzAwNzREOTtcclxuXHR9XG4gLmRldGFpbHMgLnRleHQge1xyXG4gICAgZm9udC1zaXplOiAxN3B4IDtcclxuXHRcdHRleHQtaW5kZW50OiAyZW07XHJcbiAgfVxyXG5cclxuICAuZGV0YWlscyAuaXRlbSB7XHJcbiAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xyXG5cdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcblx0LmRldGFpbHMgLm9wZXJhdGlvbntcclxuXHRcdG1hcmdpbi10b3A6IDUwcHg7XHJcblx0fVxyXG4gIC5jbGVhcmZpeDpiZWZvcmUsXHJcbiAgLmNsZWFyZml4OmFmdGVyIHtcclxuICAgIGRpc3BsYXk6IHRhYmxlO1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICB9XHJcbiAgLmNsZWFyZml4OmFmdGVyIHtcclxuICAgIGNsZWFyOiBib3RoXHJcbiAgfVxyXG5cclxuICAuYm94LWNhcmQge1xyXG4gIFx0d2lkdGg6IDEwMCU7XHJcbiAgfVxyXG5cdC5kZXRhaWxzIC50aXRsZXtcclxuXHRcdGZvbnQtc2l6ZTogMzBweDtcclxuXHRcdGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcblx0fVxyXG5cdC5kZXRhaWxzIC5ib3gtY2FyZCBkaXYuZWwtY2FyZF9faGVhZGVye1xyXG5cdFx0aGVpZ2h0OiAxMDBweDtcclxuXHRcdGxpbmUtaGVpZ2h0OiA2M3B4O1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdH1cclxuXHRzcGFuLmF1dGhvcntcclxuXHRcdGRpc3BsYXk6IGJsb2NrO1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0Ym90dG9tOiAxM3B4O1xyXG5cdFx0cmlnaHQ6IDIwcHg7XHJcblx0XHRmb250LXNpemU6IDE1cHg7XHJcblx0fVxyXG5cdHNwYW4uc3RhcnN7XHJcblx0XHRkaXNwbGF5OiBibG9jaztcclxuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdHRvcDogMThweDtcclxuXHRcdHJpZ2h0OiAyMHB4O1xyXG5cdFx0Zm9udC1zaXplOiAxNXB4O1xyXG5cdFx0Y29sb3I6ICMwMDc0RDk7XHJcblx0XHRjdXJzb3I6IHBvaW50ZXI7XHJcblx0fVxyXG5cdHNwYW4uY3JlYXRlX3RpbWV7XHJcblx0XHRkaXNwbGF5OiBibG9jaztcclxuXHRcdGhlaWdodDogMHB4O1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0Ym90dG9tOiA1MHB4O1xyXG5cdFx0cmlnaHQ6IDIwcHg7XHJcblx0XHRmb250LXNpemU6IDEycHg7XHJcblx0fVxyXG5cdC5jb21tZW50e1xyXG5cdFx0bWFyZ2luLXRvcDogMzBweDtcclxuXHR9XHJcblx0LmRldGFpbHMgLmNvbW1lbnQgLnRleHR7XHJcblx0XHRtYXJnaW4tYm90dG9tOiAwO1xyXG5cdFx0dGV4dC1pbmRlbnQ6IDA7XHJcblx0XHRvdmVyZmxvdzogaGlkZGVuO1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XHJcblx0XHRwYWRkaW5nOiAxMHB4IDA7XHJcblx0XHRwYWRkaW5nLWJvdHRvbTogMjBweDtcclxuXHR9XHJcblx0LmRldGFpbHMgLmNvbW1lbnQgLnRleHQgYS5hdmF0YXJ7XHJcblx0XHRkaXNwbGF5OiBibG9jaztcclxuXHRcdHdpZHRoOiA0MHB4O1xyXG5cdFx0aGVpZ2h0OiA0MHB4O1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogMjBweDtcclxuXHRcdGZsb2F0OiBsZWZ0O1xyXG5cdH1cclxuXHQuZGV0YWlscyAuY29tbWVudCAudGV4dCBhIGltZ3tcclxuXHRcdGRpc3BsYXk6IGJsb2NrO1xyXG5cdFx0d2lkdGg6IDQwcHg7XHJcblx0XHRoZWlnaHQ6IDQwcHg7XHJcblx0XHRib3JkZXItcmFkaXVzOiAyMHB4O1xyXG5cdH1cclxuXHQuY29tbWVudGNvbnRlbnR7XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHRcdHBhZGRpbmctbGVmdDogNjBweDtcclxuXHR9XHJcblx0LmNvbW1lbnRjb250ZW50IGg2ICxwe1xyXG5cdFx0bWFyZ2luOiAwO1xyXG5cdH1cclxuXHQuY29tbWVudGNvbnRlbnQgcHtcclxuXHRcdG1hcmdpbi10b3A6IDEwcHg7XHJcblx0XHRmb250LXNpemU6IDE0cHg7XHJcblx0XHR0ZXh0LWluZGVudDogMDtcclxuXHRcdGZvbnQtd2VpZ2h0OiBib2xkO1xyXG5cdH1cclxuXHRkaXYuZGVtby1pbnB1dC1zaXple1xyXG5cdFx0bWFyZ2luLXRvcDogMzBweDtcclxuXHRcdHBhZGRpbmctcmlnaHQ6IDU0cHg7XHJcblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0fVxyXG5cdC5zZW5kbWVzc2FnZXtcclxuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdHRvcDogMDtcclxuXHRcdHJpZ2h0OiAwO1xyXG5cdH1cclxuXHQub3BlcmF0aW9uIGF7XHJcblx0XHRjb2xvcjogd2hpdGU7XHJcblx0fVxuPC9zdHlsZT5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy9kZXRhaWxzLnZ1ZSIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtN2I0YjUzNGFcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3VzZXIudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vdXNlci52dWVcIlxuaW1wb3J0IF9fdnVlX3NjcmlwdF9fIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL3VzZXIudnVlXCJcbi8qIHRlbXBsYXRlICovXG5pbXBvcnQgX192dWVfdGVtcGxhdGVfXyBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXIvaW5kZXg/e1xcXCJpZFxcXCI6XFxcImRhdGEtdi03YjRiNTM0YVxcXCIsXFxcImhhc1Njb3BlZFxcXCI6ZmFsc2UsXFxcImJ1YmxlXFxcIjp7XFxcInRyYW5zZm9ybXNcXFwiOnt9fX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3VzZXIudnVlXCJcbi8qIHRlbXBsYXRlIGZ1bmN0aW9uYWwgKi9cbnZhciBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18gPSBmYWxzZVxuLyogc3R5bGVzICovXG52YXIgX192dWVfc3R5bGVzX18gPSBpbmplY3RTdHlsZVxuLyogc2NvcGVJZCAqL1xudmFyIF9fdnVlX3Njb3BlSWRfXyA9IG51bGxcbi8qIG1vZHVsZUlkZW50aWZpZXIgKHNlcnZlciBvbmx5KSAqL1xudmFyIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX18gPSBudWxsXG52YXIgQ29tcG9uZW50ID0gbm9ybWFsaXplQ29tcG9uZW50KFxuICBfX3Z1ZV9zY3JpcHRfXyxcbiAgX192dWVfdGVtcGxhdGVfXyxcbiAgX192dWVfdGVtcGxhdGVfZnVuY3Rpb25hbF9fLFxuICBfX3Z1ZV9zdHlsZXNfXyxcbiAgX192dWVfc2NvcGVJZF9fLFxuICBfX3Z1ZV9tb2R1bGVfaWRlbnRpZmllcl9fXG4pXG5Db21wb25lbnQub3B0aW9ucy5fX2ZpbGUgPSBcInNyYy9jb21wb25lbnRzL3VzZXIudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LTdiNGI1MzRhXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtN2I0YjUzNGFcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy91c2VyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiPHRlbXBsYXRlPlxuXHQ8ZWwtbWFpbiBjbGFzcz1cInVzZXJjb250ZW50XCI+XHJcblx0XHQ8ZWwtYnJlYWRjcnVtYiBzZXBhcmF0b3I9XCIvXCIgY2xhc3M9XCJuYXZcIj5cclxuXHRcdFx0PGVsLWJyZWFkY3J1bWItaXRlbSA6dG89XCJ7IHBhdGg6ICcvJyB9XCI+6aaW6aG1PC9lbC1icmVhZGNydW1iLWl0ZW0+XHJcblx0XHRcdDxlbC1icmVhZGNydW1iLWl0ZW0+PGEgaHJlZj1cImphdmFzY3JpcHQ6XCI+e3sgZWRpdD8n5oiRJzogdXNlci51c2VybmFtZSB9feeahOS4quS6uuS4reW/gzwvYT48L2VsLWJyZWFkY3J1bWItaXRlbT5cclxuXHRcdDwvZWwtYnJlYWRjcnVtYj5cclxuXHRcdDxoci8+XHJcblx0XHQ8ZWwtY2FyZCBjbGFzcz1cImJveC1jYXJkXCI+XHJcblx0XHRcdDxkaXYgc2xvdD1cImhlYWRlclwiIGNsYXNzPVwiY2xlYXJmaXhcIj5cclxuXHRcdFx0XHQ8YSBocmVmPVwiamF2YXNjcmlwdDpcIj48aW1nIDpzcmM9XCJgaHR0cDovLzEyNy4wLjAuMTozMDAwJHt1c2VyLmF2YXRhcn1gXCIgYWx0PVwiXCI+PC9hPlxyXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJpbmZvcm1hdGlvblwiPlxyXG5cdFx0XHRcdFx0PHA+PGVsLXRhZz48c3BhbiBjbGFzcz1cImVsLWljb24taW5mb1wiPiA6IHt7IHVzZXIudXNlcm5hbWUgfX08L3NwYW4+PC9lbC10YWc+IDwvcD5cclxuXHRcdFx0XHRcdDxwPjxlbC10YWc+PHNwYW4gY2xhc3M9XCJlbC1pY29uLW1lc3NhZ2VcIj4gOiB7eyB1c2VyLmVtYWlsIH19PC9zcGFuPjwvZWwtdGFnPiA8L3A+XHJcblx0XHRcdFx0XHQ8cD48ZWwtdGFnPjxzcGFuIGNsYXNzPVwiZWwtaWNvbi12aWV3XCI+IDoge3sgdXNlci5nZW5kYXI/J+Wlsyc6J+eUtycgfX08L3NwYW4+PC9lbC10YWc+IDwvcD5cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGJ0blwiIHYtaWY9XCJlZGl0XCI+XHJcblx0XHRcdFx0XHQ8ZWwtYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgaWNvbj1cImVsLWljb24tZWRpdC1vdXRsaW5lXCIgQGNsaWNrPVwidXNlcmVkaXRcIiBjaXJjbGU+PC9lbC1idXR0b24+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8aDMgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+e3sgZWRpdD8n5oiRJzon5LuWJyB9feeahOivnemimDwvaDM+XHJcblx0XHRcdDxoci8+XHJcblx0XHRcdDxkaXYgY2xhc3M9XCJ0ZXh0IGl0ZW1cIiB2LWZvcj1cIih0b3BpYyxpbmRleCkgaW4gdG9waWNzXCIgOmtleT1cImluZGV4XCI+XHJcblx0XHRcdFx0PGRpdiB2LXNob3c9XCJ0b3BpY3NbMF1cIj5cclxuXHRcdFx0XHRcdDxoMz5cclxuXHRcdFx0XHRcdFx0PGEgOmhyZWY9XCJgIy9kZXRhaWxzLyR7dG9waWMuX2lkfWBcIj57e3RvcGljLnRpdGxlfX08L2E+IFxyXG5cdFx0XHRcdFx0XHQ8ZWwtYnV0dG9uIFxyXG5cdFx0XHRcdFx0XHRcdHNpemU9XCJtaW5pXCJcclxuXHRcdFx0XHRcdFx0XHRzdHlsZT1cImNvbG9yOiAjODg4O1wiXHJcblx0XHRcdFx0XHRcdFx0ZGlzYWJsZWQ+XHJcblx0XHRcdFx0XHRcdFx0e3sgdG9waWMudG9waWN0eXBlIH19XHJcblx0XHRcdFx0XHRcdDwvZWwtYnV0dG9uPlxyXG5cdFx0XHRcdFx0XHQ8ZWwtYmFkZ2UgOnZhbHVlPVwidG9waWMuc3RhcnMubGVuZ3RoXCIgOm1heD1cIjk5XCIgY2xhc3M9XCJpdGVtIHN0YXJcIiB0eXBlPVwid2FybmluZ1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxlbC1idXR0b24gc2l6ZT1cIm1pbmlcIj48c3BhbiBjbGFzcz1cImVsLWljb24tc3Rhci1vblwiPjwvc3Bhbj48L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PC9lbC1iYWRnZT5cclxuXHRcdFx0XHRcdDwvaDM+XHJcblx0XHRcdFx0XHQ8cCBjbGFzcz1cInBzXCI+5Y+R5biD5pe26Ze0IDoge3sgdG9waWMuY3JlYXRlX3RpbWUgfX08L3A+XHJcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3BlcmF0aW9uXCIgdi1pZj1cIm9wZXJhdGlvblwiPlxyXG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwib3BlcmF0aW9uXCIgdi1pZj1cIm9wZXJhdGlvblwiIHN0eWxlPVwiZmxvYXQ6IHJpZ2h0O1wiPlxyXG5cdFx0XHRcdFx0XHRcdDxlbC1idXR0b24gdHlwZT1cInByaW1hcnlcIiBpY29uPVwiZWwtaWNvbi1lZGl0LW91dGxpbmVcIiBzaXplPVwibWluaVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGEgOmhyZWY9XCJgIy90b3BpY2VkaXQvJHt0b3BpYy5faWR9YFwiPue8lui+kTwvYT5cclxuXHRcdFx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0XHQ8ZWwtYnV0dG9uIHR5cGU9XCJkYW5nZXJcIiBpY29uPVwiZWwtaWNvbi1kZWxldGVcIiBzaXplPVwibWluaVwiPlxyXG5cdFx0XHRcdFx0XHRcdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6XCIgOmRhdGEtaWQ9XCJ0b3BpYy5faWRcIiBAY2xpY2s9XCJkZWxldGV0b3BpY1wiPuWIoOmZpDwvYT5cclxuXHRcdFx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0XHRcdDxoci8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9lbC1jYXJkPlxyXG5cdDwvZWwtbWFpbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cdGV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGRhdGEoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgYWN0aXZlTmFtZTogJ3NlY29uZCcsXHJcblx0XHRcdFx0dXNlciA6IHt9LFxyXG5cdFx0XHRcdGVkaXQgOiBmYWxzZSxcclxuXHRcdFx0XHR0b3BpY3MgOiBbXSxcclxuXHRcdFx0XHRvcGVyYXRpb24gOiBmYWxzZVxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICAgIG1ldGhvZHM6IHtcclxuXHRcdFx0YXN5bmMgdXNlcmVkaXQoKXtcclxuXHRcdFx0XHRjb25zdCB7ZGF0YSA6IGN1cnJlbnR1c2VyfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Nlc3Npb24nKVxyXG5cdFx0XHRcdGlmKCFjdXJyZW50dXNlci5zdGF0ZSl7XHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy4kcm91dGVyLnB1c2goYC91c2VyZWRpdC8ke2N1cnJlbnR1c2VyLnN0YXRlLl9pZH1gKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhc3luYyBkZWxldGV0b3BpYyhlKXtcclxuXHRcdFx0XHRjb25zdCBpZCA9IGUudGFyZ2V0LmRhdGFzZXRbXCJpZFwiXVxyXG5cdFx0XHRcdGNvbnN0IHtkYXRhOnRvcGljZGF0YX0gPSBhd2FpdCBheGlvcy5kZWxldGUoYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MvJHtpZH1gKVxyXG5cdFx0XHRcdGlmKHRvcGljZGF0YS5lcnIgPT09IFwi5rKh5pyJ5p2D6ZmQXCIpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcclxuXHRcdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighdG9waWNkYXRhLmVycil7XHJcblx0XHRcdFx0XHR0aGlzLiRtZXNzYWdlKHtcclxuXHRcdFx0XHRcdFx0bWVzc2FnZTogJ+WIoOmZpOaIkOWKnycsXHJcblx0XHRcdFx0XHRcdHR5cGU6ICdzdWNjZXNzJyxcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHR0aGlzLmdldHVzZXJvbmUoKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0YXN5bmMgZ2V0dXNlcm9uZSgpIHtcclxuXHRcdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zXHJcblx0XHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvdXNlcnM/X2lkPScraWQpXHJcblx0XHRcdFx0dGhpcy51c2VyID0gZGF0YVswXVxyXG5cdFx0XHRcdGNvbnN0IHtkYXRhIDogdXNlcnRvcGljc30gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MvdXNlcnRvcGljcz91c2VyX2lkPScraWQpXHJcblx0XHRcdFx0aWYoIXVzZXJ0b3BpY3MuZXJyKXtcclxuXHRcdFx0XHRcdHVzZXJ0b3BpY3MuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xyXG5cdFx0XHRcdFx0XHRzd2l0Y2goaXRlbS50b3BpY3R5cGUpe1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgJ3RlY2hub2xvZ3knIDogaXRlbS50b3BpY3R5cGUgPSAn5oqA5pyvJ1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnbGl0ZXJhdHVyZScgOiBpdGVtLnRvcGljdHlwZSA9ICfmloflraYnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdTcG9ydHMnIDogaXRlbS50b3BpY3R5cGUgPSAn5L2T6IKyJ1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiBpdGVtLnRvcGljdHlwZSA9ICflqLHkuZAnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlICdtZXRhcGh5c2ljcycgOiBpdGVtLnRvcGljdHlwZSA9ICfnjoTlraYnXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRkZWZhdWx0IDogaXRlbS50b3BpY3R5cGUgPSAn5pyq55+lJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0dGhpcy50b3BpY3MgPSB1c2VydG9waWNzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNvbnN0IHtkYXRhIDogY3VycmVudHVzZXJ9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXHJcblx0XHRcdFx0aWYoIWN1cnJlbnR1c2VyLnN0YXRlKXtcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihpZCA9PT0gY3VycmVudHVzZXIuc3RhdGUuX2lkKXtcclxuXHRcdFx0XHRcdHRoaXMuZWRpdCA9IHRydWVcclxuXHRcdFx0XHRcdHRoaXMub3BlcmF0aW9uID0gdHJ1ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG4gICAgfSxcclxuXHRcdGNyZWF0ZWQoKXtcclxuXHRcdFx0dGhpcy5nZXR1c2Vyb25lKClcclxuXHRcdH1cclxuICB9XG48L3NjcmlwdD5cblxuPHN0eWxlPlxyXG5cdC51c2VyY29udGVudHtcclxuXHRcdC8qIG1hcmdpbi10b3A6IDYxcHg7ICovXHJcblx0fVxyXG5cdC51c2VyY29udGVudCAuaXRlbS5zdGFye1xyXG5cdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKDlweCk7XHJcblx0fVxyXG5cdC51c2VyY29udGVudCAuaXRlbS5zdGFyIHNwYW57XHJcblx0XHRjb2xvcjogIzAwNzREOTtcclxuXHR9XHJcblx0LnVzZXJjb250ZW50IGF7XHJcblx0XHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcblx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcblx0XHRjb2xvcjogIzgwODA4MDtcclxuXHR9XHJcblx0LnVzZXJjb250ZW50IGE6aG92ZXJ7XHJcblx0XHRjb2xvcjogIzAwNzREOTtcclxuXHR9XG4udXNlcmNvbnRlbnQgLnRleHQge1xyXG4gICAgZm9udC1zaXplOiAxNHB4O1xyXG4gIH1cclxuXHJcbiAgLnVzZXJjb250ZW50IC5pdGVtIHtcclxuICAgIG1hcmdpbi1ib3R0b206IDE4cHg7XHJcblx0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgfVxyXG4gIC5jbGVhcmZpeDpiZWZvcmUsXHJcbiAgLmNsZWFyZml4OmFmdGVyIHtcclxuICAgIGRpc3BsYXk6IHRhYmxlO1xyXG4gICAgY29udGVudDogXCJcIjtcclxuICB9XHJcbiAgLmNsZWFyZml4OmFmdGVyIHtcclxuICAgIGNsZWFyOiBib3RoXHJcbiAgfVxyXG5cclxuICAudXNlcmNvbnRlbnQgLmJveC1jYXJkIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xyXG5cdFx0b3ZlcmZsb3c6IGhpZGRlbjtcclxuICB9XHJcblx0LnVzZXJjb250ZW50IC5jbGVhcmZpeCBhe1xyXG5cdFx0ZGlzcGxheTogYmxvY2s7XHJcblx0XHR3aWR0aDogMTAwcHg7XHJcblx0XHRoZWlnaHQ6IDEwMHB4O1xyXG5cdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVYKDUzMHB4KTtcclxuXHRcdGJvcmRlci1yYWRpdXM6IDUwcHg7XHJcblx0fVxyXG5cdC51c2VyY29udGVudCAuY2xlYXJmaXggYSBpbWd7XHJcblx0XHR3aWR0aDogMTAwJTtcclxuXHRcdGhlaWdodDoxMDAlO1xyXG5cdFx0Ym9yZGVyLXJhZGl1czogNTBweDtcclxuXHRcdGRpc3BsYXk6IGJsb2NrO1xyXG5cdH1cclxuXHQudXNlcmNvbnRlbnQgLmluZm9ybWF0aW9ue1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0dG9wOiAwcHg7XHJcblx0XHRsZWZ0OiA1MCU7XHJcblx0fVxyXG5cdC51c2VyY29udGVudCAuaW5mb3JtYXRpb24gcHtcclxuXHRcdG1hcmdpbjogMTBweDtcclxuXHR9XHJcblx0LnVzZXJjb250ZW50IC5lZGl0YnRue1xyXG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xyXG5cdFx0cmlnaHQ6IDQwMHB4O1xyXG5cdFx0dG9wOiA0NXB4O1xyXG5cdH1cclxuXHQudXNlcmNvbnRlbnQgLm9wZXJhdGlvbntcclxuXHRcdHdpZHRoOiAyMDBweDtcclxuXHRcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuXHRcdHJpZ2h0OiAwcHg7XHJcblx0XHR0b3A6IDUwJTtcclxuXHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcclxuXHR9XHJcblx0LnVzZXJjb250ZW50IC5vcGVyYXRpb24gYXtcclxuXHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuXHRcdGNvbG9yOiB3aGl0ZTtcclxuXHR9XG48L3N0eWxlPlxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHNyYy9jb21wb25lbnRzL3VzZXIudnVlIiwidmFyIGRpc3Bvc2VkID0gZmFsc2VcbmZ1bmN0aW9uIGluamVjdFN0eWxlIChzc3JDb250ZXh0KSB7XG4gIGlmIChkaXNwb3NlZCkgcmV0dXJuXG4gIHJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4P3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0xYTIzNGY1OVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vdG9waWNlZGl0LnZ1ZVwiKVxufVxudmFyIG5vcm1hbGl6ZUNvbXBvbmVudCA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL2NvbXBvbmVudC1ub3JtYWxpemVyXCIpXG4vKiBzY3JpcHQgKi9cbmV4cG9ydCAqIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL3RvcGljZWRpdC52dWVcIlxuaW1wb3J0IF9fdnVlX3NjcmlwdF9fIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL3RvcGljZWRpdC52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LTFhMjM0ZjU5XFxcIixcXFwiaGFzU2NvcGVkXFxcIjpmYWxzZSxcXFwiYnVibGVcXFwiOntcXFwidHJhbnNmb3Jtc1xcXCI6e319fSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vdG9waWNlZGl0LnZ1ZVwiXG4vKiB0ZW1wbGF0ZSBmdW5jdGlvbmFsICovXG52YXIgX192dWVfdGVtcGxhdGVfZnVuY3Rpb25hbF9fID0gZmFsc2Vcbi8qIHN0eWxlcyAqL1xudmFyIF9fdnVlX3N0eWxlc19fID0gaW5qZWN0U3R5bGVcbi8qIHNjb3BlSWQgKi9cbnZhciBfX3Z1ZV9zY29wZUlkX18gPSBudWxsXG4vKiBtb2R1bGVJZGVudGlmaWVyIChzZXJ2ZXIgb25seSkgKi9cbnZhciBfX3Z1ZV9tb2R1bGVfaWRlbnRpZmllcl9fID0gbnVsbFxudmFyIENvbXBvbmVudCA9IG5vcm1hbGl6ZUNvbXBvbmVudChcbiAgX192dWVfc2NyaXB0X18sXG4gIF9fdnVlX3RlbXBsYXRlX18sXG4gIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyxcbiAgX192dWVfc3R5bGVzX18sXG4gIF9fdnVlX3Njb3BlSWRfXyxcbiAgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfX1xuKVxuQ29tcG9uZW50Lm9wdGlvbnMuX19maWxlID0gXCJzcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LTFhMjM0ZjU5XCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtMWEyMzRmNTlcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCI8dGVtcGxhdGU+XHJcblx0PGVsLW1haW4gY2xhc3M9XCJ0b3BpY2VkaXRcIj5cclxuXHQ8ZWwtZm9ybSA6bW9kZWw9XCJydWxlRm9ybVwiIDpydWxlcz1cInJ1bGVzXCIgcmVmPVwicnVsZUZvcm1cIiBsYWJlbC13aWR0aD1cIjEwMHB4XCIgY2xhc3M9XCJkZW1vLXJ1bGVGb3JtXCI+XHJcblx0XHQ8ZWwtYnJlYWRjcnVtYiBzZXBhcmF0b3I9XCIvXCIgY2xhc3M9XCJuYXZcIj5cclxuXHRcdFx0PGVsLWJyZWFkY3J1bWItaXRlbSA6dG89XCJ7IHBhdGg6ICcvJyB9XCI+6aaW6aG1PC9lbC1icmVhZGNydW1iLWl0ZW0+XHJcblx0XHRcdDxlbC1icmVhZGNydW1iLWl0ZW0+PGEgaHJlZj1cIiMvcmVsZWFzZVwiPuivnemimOe8lui+kTwvYT48L2VsLWJyZWFkY3J1bWItaXRlbT5cclxuXHRcdDwvZWwtYnJlYWRjcnVtYj5cclxuXHRcdDxoci8+XHJcblx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi6K+d6aKY5YiG57G7XCIgcHJvcD1cInRvcGljdHlwZVwiPlxyXG5cdFx0XHQ8ZWwtc2VsZWN0IHYtbW9kZWw9XCJydWxlRm9ybS50b3BpY3R5cGVcIiBwbGFjZWhvbGRlcj1cIuivt+mAieaLqeivnemimOWIhuexu1wiPlxyXG5cdFx0XHRcdDxlbC1vcHRpb24gbGFiZWw9XCLmioDmnK9cIiB2YWx1ZT1cInRlY2hub2xvZ3lcIj48L2VsLW9wdGlvbj5cclxuXHRcdFx0XHQ8ZWwtb3B0aW9uIGxhYmVsPVwi5paH5a2mXCIgdmFsdWU9XCJsaXRlcmF0dXJlXCI+PC9lbC1vcHRpb24+XHJcblx0XHRcdFx0PGVsLW9wdGlvbiBsYWJlbD1cIuS9k+iCslwiIHZhbHVlPVwiU3BvcnRzXCI+PC9lbC1vcHRpb24+XHJcblx0XHRcdFx0PGVsLW9wdGlvbiBsYWJlbD1cIuWoseS5kFwiIHZhbHVlPVwiZW50ZXJ0YWlubWVudFwiPjwvZWwtb3B0aW9uPlxyXG5cdFx0XHRcdDxlbC1vcHRpb24gbGFiZWw9XCLnjoTlraZcIiB2YWx1ZT1cIm1ldGFwaHlzaWNzXCI+PC9lbC1vcHRpb24+XHJcblx0XHRcdDwvZWwtc2VsZWN0PlxyXG5cdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi5qCH6aKYXCIgcHJvcD1cInRpdGxlXCI+XHJcblx0XHRcdDxlbC1pbnB1dCB2LW1vZGVsPVwicnVsZUZvcm0udGl0bGVcIj48L2VsLWlucHV0PlxyXG5cdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi6K+d6aKY5YaF5a65XCIgcHJvcD1cImNvbnRlbnRcIj5cclxuXHRcdFx0PGVsLWlucHV0IHR5cGU9XCJ0ZXh0YXJlYVwiIHYtbW9kZWw9XCJydWxlRm9ybS5jb250ZW50XCIgY29scz1cIjgwXCIgY2xhc3M9XCIudGV4dGFyZWFcIj48L2VsLWlucHV0PlxyXG5cdFx0XHQ8IS0tIDx0ZXh0YXJlYSBuYW1lPVwiXCIgaWQ9XCJcIiBjb2xzPVwiMTAwXCIgcm93cz1cIjIwXCIgdi1tb2RlbD1cInJ1bGVGb3JtLmRlc2NcIiBjbGFzcz1cIi50ZXh0YXJlYVwiPjwvdGV4dGFyZWE+IC0tPlxyXG5cdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHQ8ZWwtZm9ybS1pdGVtPlxyXG5cdFx0XHQ8ZWwtYnV0dG9uIHR5cGU9XCJwcmltYXJ5XCIgQGNsaWNrPVwic3VibWl0Rm9ybSgncnVsZUZvcm0nKVwiPuaPkOS6pDwvZWwtYnV0dG9uPlxyXG5cdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0PC9lbC1mb3JtPlxyXG5cdDwvZWwtbWFpbj5cclxuPC90ZW1wbGF0ZT5cclxuXHJcbjxzY3JpcHQ+XHJcblx0aW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xyXG5cdGV4cG9ydCBkZWZhdWx0IHtcclxuXHRcdGRhdGEoKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cnVsZUZvcm06IHtcclxuXHRcdFx0XHRcdHRpdGxlOiAnJyxcclxuXHRcdFx0XHRcdHRvcGljdHlwZTogJycsXHJcblx0XHRcdFx0XHRjb250ZW50OiAnJ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cnVsZXM6IHtcclxuXHRcdFx0XHRcdHRpdGxlOiBbe1xyXG5cdFx0XHRcdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfmoIfpopjkuI3og73kuLrnqbonLFxyXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXI6ICdibHVyJ1xyXG5cdFx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0bWluOiAyLFxyXG5cdFx0XHRcdFx0XHRcdG1heDogMzAsXHJcblx0XHRcdFx0XHRcdFx0bWVzc2FnZTogJ+mVv+W6puWcqCAyIOWIsCAzMCDkuKrlrZfnrKYnLFxyXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXI6ICdibHVyJ1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0dG9waWN0eXBlOiBbe1xyXG5cdFx0XHRcdFx0XHRyZXF1aXJlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0bWVzc2FnZTogJ+ivt+mAieaLqeivnemimOexu+WeiycsXHJcblx0XHRcdFx0XHRcdHRyaWdnZXI6ICdjaGFuZ2UnXHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdGNvbnRlbnQ6IFt7XHJcblx0XHRcdFx0XHRcdHJlcXVpcmVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRtZXNzYWdlOiAn6K+d6aKY5YaF5a655LiN6IO95Li656m6JyxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlcjogJ2JsdXInXHJcblx0XHRcdFx0XHR9XVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblx0XHRtZXRob2RzOiB7XHJcblx0XHRcdHN1Ym1pdEZvcm0oZm9ybU5hbWUpIHtcclxuXHRcdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zXHJcblx0XHRcdFx0dGhpcy4kcmVmc1tmb3JtTmFtZV0udmFsaWRhdGUoYXN5bmMgKHZhbGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodmFsaWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3Qge2RhdGE6dG9waWNkYXRhfSA9IGF3YWl0IGF4aW9zLnBhdGNoKGBodHRwOi8vMTI3LjAuMC4xOjMwMDAvdG9waWNzLyR7aWR9YCx0aGlzLnJ1bGVGb3JtKVxyXG5cdFx0XHRcdFx0XHRpZih0b3BpY2RhdGEuZXJyID09PSBcIuayoeacieadg+mZkFwiKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJyxcclxuXHRcdFx0XHRcdFx0XHRcdGN1c3RvbUNsYXNzIDogJ21lc3NhZ2UnXHJcblx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighdG9waWNkYXRhLmVycil7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAn5pu05paw5oiQ5YqfJyxcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6ICdzdWNjZXNzJ1xyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0dGhpcy4kcm91dGVyLmdvKC0xKVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3Igc3VibWl0ISEnKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZXNldEZvcm0oZm9ybU5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS5yZXNldEZpZWxkcygpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YXN5bmMgY3JlYXRlZCgpe1xyXG5cdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zXHJcblx0XHRcdGNvbnN0IHtkYXRhIDogdG9waWN9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvdG9waWNzL2RldGFpbHM/X2lkPScraWQpXHJcblx0XHRcdGlmKHRvcGljLmVycil7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5ydWxlRm9ybS5jb250ZW50ID0gdG9waWMuY29udGVudFxyXG5cdFx0XHR0aGlzLnJ1bGVGb3JtLnRpdGxlID0gdG9waWMudGl0bGVcclxuXHRcdFx0dGhpcy5ydWxlRm9ybS50b3BpY3R5cGUgPSB0b3BpYy50b3BpY3R5cGVcclxuXHRcdH1cclxuXHR9XHJcbjwvc2NyaXB0PlxyXG5cclxuPHN0eWxlPlxyXG4udG9waWNlZGl0e1xyXG5cdC8qIG1hcmdpbi10b3A6IDYxcHg7ICovXHJcbn1cclxuLmRlbW8tcnVsZUZvcm17XHJcblx0XHJcbn1cclxuLm5hdntcclxuXHRtYXJnaW4tdG9wOiAwcHg7XHJcblx0bWFyZ2luLWJvdHRvbTogMjBweDtcclxufVxyXG4uZWwtdGV4dGFyZWFfX2lubmVye1xyXG5cdG1pbi1oZWlnaHQ6IDI1MHB4ICFpbXBvcnRhbnQ7XHJcbn1cclxuPC9zdHlsZT5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlIiwidmFyIGRpc3Bvc2VkID0gZmFsc2VcbmZ1bmN0aW9uIGluamVjdFN0eWxlIChzc3JDb250ZXh0KSB7XG4gIGlmIChkaXNwb3NlZCkgcmV0dXJuXG4gIHJlcXVpcmUoXCIhIXZ1ZS1zdHlsZS1sb2FkZXIhY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4P3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi00YmUyMTVlNVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vdXNlcmVkaXQudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vdXNlcmVkaXQudnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi91c2VyZWRpdC52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LTRiZTIxNWU1XFxcIixcXFwiaGFzU2NvcGVkXFxcIjpmYWxzZSxcXFwiYnVibGVcXFwiOntcXFwidHJhbnNmb3Jtc1xcXCI6e319fSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vdXNlcmVkaXQudnVlXCJcbi8qIHRlbXBsYXRlIGZ1bmN0aW9uYWwgKi9cbnZhciBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18gPSBmYWxzZVxuLyogc3R5bGVzICovXG52YXIgX192dWVfc3R5bGVzX18gPSBpbmplY3RTdHlsZVxuLyogc2NvcGVJZCAqL1xudmFyIF9fdnVlX3Njb3BlSWRfXyA9IG51bGxcbi8qIG1vZHVsZUlkZW50aWZpZXIgKHNlcnZlciBvbmx5KSAqL1xudmFyIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX18gPSBudWxsXG52YXIgQ29tcG9uZW50ID0gbm9ybWFsaXplQ29tcG9uZW50KFxuICBfX3Z1ZV9zY3JpcHRfXyxcbiAgX192dWVfdGVtcGxhdGVfXyxcbiAgX192dWVfdGVtcGxhdGVfZnVuY3Rpb25hbF9fLFxuICBfX3Z1ZV9zdHlsZXNfXyxcbiAgX192dWVfc2NvcGVJZF9fLFxuICBfX3Z1ZV9tb2R1bGVfaWRlbnRpZmllcl9fXG4pXG5Db21wb25lbnQub3B0aW9ucy5fX2ZpbGUgPSBcInNyYy9jb21wb25lbnRzL3VzZXJlZGl0LnZ1ZVwiXG5cbi8qIGhvdCByZWxvYWQgKi9cbmlmIChtb2R1bGUuaG90KSB7KGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhvdEFQSSA9IHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIilcbiAgaG90QVBJLmluc3RhbGwocmVxdWlyZShcInZ1ZVwiKSwgZmFsc2UpXG4gIGlmICghaG90QVBJLmNvbXBhdGlibGUpIHJldHVyblxuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmICghbW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgaG90QVBJLmNyZWF0ZVJlY29yZChcImRhdGEtdi00YmUyMTVlNVwiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfSBlbHNlIHtcbiAgICBob3RBUEkucmVsb2FkKFwiZGF0YS12LTRiZTIxNWU1XCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9XG4gIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbiAoZGF0YSkge1xuICAgIGRpc3Bvc2VkID0gdHJ1ZVxuICB9KVxufSkoKX1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50LmV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCI8dGVtcGxhdGU+XHJcblx0PGVsLW1haW4gY2xhc3M9XCJ1c2VyZWRpdFwiPlxyXG5cdFx0PHA+XHJcblx0XHRcdDxzcGFuIEBjbGljaz1cImdvdXNlclwiPlxyXG5cdFx0XHRcdDxhIGhyZWY9XCJqYXZhc2NyaXB0OlwiPuS4quS6uuS4reW/gzwvYT5cclxuXHRcdFx0PC9zcGFuPlxyXG5cdFx0XHQ8c3Bhbj5cclxuXHRcdFx0XHQ+XHJcblx0XHRcdFx0PGEgaHJlZj1cImphdmFzY3JpcHQ6XCI+6LWE5paZ5L+u5pS5PC9hPlxyXG5cdFx0XHQ8L3NwYW4+XHJcblx0XHQ8L3A+XHJcblx0XHQ8aHIvPlxyXG5cdFx0PGVsLXVwbG9hZFxyXG5cdFx0ICBjbGFzcz1cImF2YXRhci11cGxvYWRlclwiXHJcblx0XHQgIGFjdGlvbj1cImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91cGxvYWRpbWdcIlxyXG5cdFx0ICA6c2hvdy1maWxlLWxpc3Q9XCJmYWxzZVwiXHJcblx0XHQgIDpvbi1zdWNjZXNzPVwiaGFuZGxlQXZhdGFyU3VjY2Vzc1wiXHJcblx0XHQgIDpiZWZvcmUtdXBsb2FkPVwiYmVmb3JlQXZhdGFyVXBsb2FkXCI+XHJcblx0XHQgIDxpbWcgdi1pZj1cImltYWdlVXJsXCIgOnNyYz1cImltYWdlVXJsXCIgY2xhc3M9XCJhdmF0YXJcIj5cclxuXHRcdCAgPGkgdi1lbHNlIGNsYXNzPVwiZWwtaWNvbi1wbHVzIGF2YXRhci11cGxvYWRlci1pY29uXCI+PC9pPlxyXG5cdFx0PC9lbC11cGxvYWQ+XHJcblx0XHQ8ZWwtZm9ybSA6bW9kZWw9XCJydWxlRm9ybTJcIiBzdGF0dXMtaWNvbiA6cnVsZXM9XCJydWxlczJcIiByZWY9XCJydWxlRm9ybTJcIiBsYWJlbC13aWR0aD1cIjEwMHB4XCIgY2xhc3M9XCJkZW1vLXJ1bGVGb3JtXCI+XHJcblx0XHRcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XCLnlKjmiLflkI1cIiBwcm9wPVwidXNlcm5hbWVcIj5cclxuXHRcdFx0XHQ8ZWwtaW5wdXQgdi1tb2RlbD1cInJ1bGVGb3JtMi51c2VybmFtZVwiPjwvZWwtaW5wdXQ+XHJcblx0XHRcdDwvZWwtZm9ybS1pdGVtPlxyXG5cdFx0XHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVwi5oCn5YirXCIgcHJvcD1cImdlbmRhclwiPlxyXG5cdFx0XHRcdDxlbC1yYWRpby1ncm91cCB2LW1vZGVsPVwicnVsZUZvcm0yLmdlbmRhclwiPlxyXG5cdFx0XHRcdFx0PGVsLXJhZGlvIGxhYmVsPVwi55S3XCIgdmFsdWU9XCIwXCI+PC9lbC1yYWRpbz5cclxuXHRcdFx0XHRcdDxlbC1yYWRpbyBsYWJlbD1cIuWls1wiIHZhbHVlPVwiMVwiPjwvZWwtcmFkaW8+XHJcblx0XHRcdFx0PC9lbC1yYWRpby1ncm91cD5cclxuXHRcdFx0PC9lbC1mb3JtLWl0ZW0+XHJcblx0XHRcdDxlbC1mb3JtLWl0ZW0+XHJcblx0XHRcdFx0PGVsLWJ1dHRvbiBjbGFzcz1cInJlZ2lzdGVyYnRuXCIgdHlwZT1cInByaW1hcnlcIiBAY2xpY2s9XCJzdWJtaXRGb3JtKCdydWxlRm9ybTInKVwiPuaPkOS6pDwvZWwtYnV0dG9uPlxyXG5cdFx0XHQ8L2VsLWZvcm0taXRlbT5cclxuXHRcdDwvZWwtZm9ybT5cclxuXHQ8L2VsLW1haW4+XHJcbjwvdGVtcGxhdGU+XHJcblxyXG48c2NyaXB0PlxyXG5cdGltcG9ydCBheGlvcyBmcm9tICdheGlvcydcclxuXHRleHBvcnQgZGVmYXVsdCB7XHJcblx0XHRkYXRhKCkge1xyXG5cdFx0XHRjb25zdCBjaGVja0FnZSA9IChydWxlLCB2YWx1ZSwgY2FsbGJhY2spID0+IHtcclxuXHRcdFx0XHRpZiAoIXZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCfnlKjmiLflkI3kuI3og73kuLrnqbonKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlLmxlbmd0aCA8IDIgfHwgdmFsdWUubGVuZ3RoID4gOCkge1xyXG5cdFx0XHRcdFx0XHRjYWxsYmFjayhuZXcgRXJyb3IoJ+eUqOaIt+WQjeW/hemhu+WcqDItOOS9jScpKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP3VzZXJuYW1lPScrdmFsdWUpXHJcblx0XHRcdFx0XHRcdGlmKHJlcy5kYXRhWzBdKXtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zXHJcblx0XHRcdFx0XHRcdFx0aWYocmVzLmRhdGFbMF0uX2lkID09PSBpZCl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2soKVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCfor6XnlKjmiLflkI3lt7LlrZjlnKgnKSlcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRjYWxsYmFjaygpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwgMjAwKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0Y29uc3QgdmFsaWRhdGVnZW5kYXIgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7fpgInmi6nmgKfliKsnKSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNhbGxiYWNrKClcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRydWxlRm9ybTI6IHtcclxuXHRcdFx0XHRcdHVzZXJuYW1lOiAnJyxcclxuXHRcdFx0XHRcdGdlbmRhcjogJycsXHJcblx0XHRcdFx0XHRhdmF0YXIgOiAnJ1xyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0cnVsZXMyOiB7XHJcblx0XHRcdFx0XHR1c2VybmFtZTogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiBjaGVja0FnZSxcclxuXHRcdFx0XHRcdFx0dHJpZ2dlcjogJ2JsdXInXHJcblx0XHRcdFx0XHR9XSxcclxuXHRcdFx0XHRcdGdlbmRhcjogW3tcclxuXHRcdFx0XHRcdFx0dmFsaWRhdG9yOiB2YWxpZGF0ZWdlbmRhcixcclxuXHRcdFx0XHRcdFx0dHJpZ2dlcjogJ2JsdXInXHJcblx0XHRcdFx0XHR9XVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0aW1hZ2VVcmwgOiAnJ1xyXG5cdFx0XHR9O1xyXG5cdFx0fSxcclxuXHRcdG1ldGhvZHM6IHtcclxuXHRcdFx0Z291c2VyKCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKDEpXHJcblx0XHRcdFx0dGhpcy4kcm91dGVyLmJhY2soKVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQgaGFuZGxlQXZhdGFyU3VjY2VzcyhyZXMsIGZpbGUpIHtcclxuXHRcdFx0ICB0aGlzLmltYWdlVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlLnJhdyk7XHJcblx0XHRcdFx0dGhpcy5ydWxlRm9ybTIuYXZhdGFyID0gcmVzLmRhdGFcclxuXHRcdFx0fSxcclxuXHRcdFx0YmVmb3JlQXZhdGFyVXBsb2FkKGZpbGUpIHtcclxuXHRcdFx0ICBjb25zdCBpc0pQRyA9IGZpbGUudHlwZSA9PT0gJ2ltYWdlL2pwZWcnO1xyXG5cdFx0XHQgIGNvbnN0IGlzTHQyTSA9IGZpbGUuc2l6ZSAvIDEwMjQgLyAxMDI0IDwgMjtcclxuXHRcdFx0XHJcblx0XHRcdCAgaWYgKCFpc0pQRykge1xyXG5cdFx0XHQgICAgdGhpcy4kbWVzc2FnZS5lcnJvcign5LiK5Lyg5aS05YOP5Zu+54mH5Y+q6IO95pivIEpQRyDmoLzlvI8hJyk7XHJcblx0XHRcdCAgfVxyXG5cdFx0XHQgIGlmICghaXNMdDJNKSB7XHJcblx0XHRcdCAgICB0aGlzLiRtZXNzYWdlLmVycm9yKCfkuIrkvKDlpLTlg4/lm77niYflpKflsI/kuI3og73otoXov4cgMk1CIScpO1xyXG5cdFx0XHQgIH1cclxuXHRcdFx0ICByZXR1cm4gaXNKUEcgJiYgaXNMdDJNO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRzdWJtaXRGb3JtKGZvcm1OYW1lKSB7XHJcblx0XHRcdFx0dGhpcy4kcmVmc1tmb3JtTmFtZV0udmFsaWRhdGUoYXN5bmMgKHZhbGlkKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAodmFsaWQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3Qge2lkfSA9IHRoaXMuJHJvdXRlLnBhcmFtc1xyXG5cdFx0XHRcdFx0XHRjb25zdCB7ZGF0YTpjdXJyZW50dXNlcn0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcclxuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coZGF0YS5zdGF0ZSlcclxuXHRcdFx0XHRcdFx0aWYoIWN1cnJlbnR1c2VyLnN0YXRlKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcclxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYoaWQgIT09IGN1cnJlbnR1c2VyLnN0YXRlLl9pZCl7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogJ+ayoeacieadg+mZkCcsXHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPT09ICfnlLcnKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5ydWxlRm9ybTIuZ2VuZGFyID0gMFxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMucnVsZUZvcm0yLmdlbmRhciA9IDFcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZighdGhpcy5ydWxlRm9ybTIuYXZhdGFyKXtcclxuXHRcdFx0XHRcdFx0XHRkZWxldGUgdGhpcy5ydWxlRm9ybTIuYXZhdGFyXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MucGF0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2Vycy8ke2lkfWAsIHRoaXMucnVsZUZvcm0yKVxyXG5cdFx0XHRcdFx0XHRpZihkYXRhLmVycil7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRcdFx0bWVzc2FnZTogJ+acjeWKoeWZqOe5geW/mScsXHJcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnd2FybmluZydcclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHRoaXMuJG1lc3NhZ2Uoe1xyXG5cdFx0XHRcdFx0XHRcdG1lc3NhZ2U6ICfmm7TmlrDmiJDlip8nLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHR0aGlzLiRyb3V0ZXIuZ28oLTEpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdGFzeW5jIGNyZWF0ZWQoKSB7XHJcblx0XHRcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcclxuXHRcdFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvdXNlcnM/X2lkPScraWQpXHJcblx0XHRcdHRoaXMucnVsZUZvcm0yLnVzZXJuYW1lID0gZGF0YVswXS51c2VybmFtZVxyXG5cdFx0XHR0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPSBkYXRhWzBdLmdlbmRhciA9PT0gMD8n55S3Jzon5aWzJ1xyXG5cdFx0fVxyXG5cdH1cclxuPC9zY3JpcHQ+XHJcblxyXG48c3R5bGU+XHJcblx0LnVzZXJlZGl0e1xyXG5cdFx0cGFkZGluZzogMjBweCAzMDBweDtcclxuXHRcdHBhZGRpbmctdG9wOiAxMHB4O1xyXG5cdFx0YmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuXHRcdHBhZGRpbmctYm90dG9tOiAxMzhweDtcclxuXHR9XHJcblx0LnVzZXJlZGl0IHB7XHJcblx0XHRtYXJnaW46IDA7XHJcblx0fVxyXG5cdFxyXG5cdC51c2VyZWRpdCBhe1xyXG5cdFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG5cdFx0Y29sb3I6ICMwMDA7XHJcblx0XHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcblx0XHRwYWRkaW5nOiAwIDVweDtcclxuXHRcdGZvbnQtc2l6ZTogMTRweDtcclxuXHR9XHJcblx0LnVzZXJlZGl0IHNwYW46Zmlyc3QtY2hpbGQgYTpob3ZlcntcclxuXHRcdGNvbG9yOiAjMDA3NEQ5O1xyXG5cdH1cclxuXHQudXNlcmVkaXQgc3BhbjpsYXN0LWNoaWxkIGF7XHJcblx0XHRjb2xvcjogI2ZmZjtcclxuXHR9XHJcblx0LnVzZXJlZGl0IC5yZWdpc3RlciB7XHJcblx0XHR3aWR0aDogNTAwcHg7XHJcblx0XHRwYWRkaW5nOiA0MHB4O1xyXG5cdFx0cGFkZGluZy1yaWdodDogNzBweDtcclxuXHRcdG1hcmdpbjogMjBweCBhdXRvO1xyXG5cdFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcclxuXHR9XHJcblx0LnVzZXJlZGl0IC5yZWdpc3RlciBoMXtcclxuXHRcdHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHRcdG1hcmdpbjogMDtcclxuXHR9XHJcblx0LnVzZXJlZGl0IC5yZWdpc3RlcmJ0bntcclxuXHRcdHdpZHRoOiAxMDAlO1xyXG5cdH1cclxuXHQudXNlcmVkaXQgLm1lc3NhZ2Uge1xyXG5cdFx0aGVpZ2h0OiA0MHB4O1xyXG5cdFx0bWFyZ2luOiA0MHB4IDA7XHJcblx0XHRwYWRkaW5nLWxlZnQ6IDIwcHg7XHJcblx0ICBib3JkZXI6IDFweCBzb2xpZCAjZDhkZWUyO1xyXG5cdCAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG5cdH1cclxuXHQudXNlcmVkaXQgLm1lc3NhZ2UgcHtcclxuXHRcdHBhZGRpbmc6IDA7XHJcblx0XHRsaW5lLWhlaWdodDogNDBweDtcclxuXHRcdG1hcmdpbjogMDtcclxuXHR9XHJcblx0LnVzZXJlZGl0IC5hdmF0YXItdXBsb2FkZXIgLmVsLXVwbG9hZCB7XHJcblx0XHRtYXJnaW4tbGVmdDogNTAlO1xyXG5cdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xyXG5cdCAgYm9yZGVyOiAxcHggc29saWQgIzQwOUVGRjtcclxuXHRcdG1hcmdpbi1ib3R0b206IDIwcHg7XHJcblx0ICBib3JkZXItcmFkaXVzOiA2cHg7XHJcblx0ICBjdXJzb3I6IHBvaW50ZXI7XHJcblx0ICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcblx0ICBvdmVyZmxvdzogaGlkZGVuO1xyXG5cdH1cclxuXHQudXNlcmVkaXQgLmF2YXRhci11cGxvYWRlciAuZWwtdXBsb2FkOmhvdmVyIHtcclxuXHQgIGJvcmRlci1jb2xvcjogIzQwOUVGRjtcclxuXHR9XHJcblx0LnVzZXJlZGl0IC5hdmF0YXItdXBsb2FkZXItaWNvbiB7XHJcblx0ICBmb250LXNpemU6IDI4cHg7XHJcblx0ICBjb2xvcjogIzhjOTM5ZDtcclxuXHQgIHdpZHRoOiAxNzhweDtcclxuXHQgIGhlaWdodDogMTc4cHg7XHJcblx0ICBsaW5lLWhlaWdodDogMTc4cHg7XHJcblx0ICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblx0fVxyXG5cdC51c2VyZWRpdCAuYXZhdGFyIHtcclxuXHQgIHdpZHRoOiAxNzhweDtcclxuXHQgIGhlaWdodDogMTc4cHg7XHJcblx0ICBkaXNwbGF5OiBibG9jaztcclxuXHR9XHJcbjwvc3R5bGU+XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBzcmMvY29tcG9uZW50cy91c2VyZWRpdC52dWUiLCJ2YXIgZGlzcG9zZWQgPSBmYWxzZVxuZnVuY3Rpb24gaW5qZWN0U3R5bGUgKHNzckNvbnRleHQpIHtcbiAgaWYgKGRpc3Bvc2VkKSByZXR1cm5cbiAgcmVxdWlyZShcIiEhdnVlLXN0eWxlLWxvYWRlciFjc3MtbG9hZGVyP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXg/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTUyODYwMmEzXFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9saXN0Ynl0aXRsZS52dWVcIilcbn1cbnZhciBub3JtYWxpemVDb21wb25lbnQgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9jb21wb25lbnQtbm9ybWFsaXplclwiKVxuLyogc2NyaXB0ICovXG5leHBvcnQgKiBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9saXN0Ynl0aXRsZS52dWVcIlxuaW1wb3J0IF9fdnVlX3NjcmlwdF9fIGZyb20gXCIhIWJhYmVsLWxvYWRlciEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zY3JpcHQmaW5kZXg9MCEuL2xpc3RieXRpdGxlLnZ1ZVwiXG4vKiB0ZW1wbGF0ZSAqL1xuaW1wb3J0IF9fdnVlX3RlbXBsYXRlX18gZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3RlbXBsYXRlLWNvbXBpbGVyL2luZGV4P3tcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNTI4NjAyYTNcXFwiLFxcXCJoYXNTY29wZWRcXFwiOmZhbHNlLFxcXCJidWJsZVxcXCI6e1xcXCJ0cmFuc2Zvcm1zXFxcIjp7fX19IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9saXN0Ynl0aXRsZS52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gbnVsbFxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvbGlzdGJ5dGl0bGUudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LTUyODYwMmEzXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtNTI4NjAyYTNcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9saXN0Ynl0aXRsZS52dWVcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIjx0ZW1wbGF0ZT5cblx0PGVsLW1haW4gY2xhc3M9XCJsaXN0XCI+XHJcblx0XHQ8ZWwtY2FyZCBjbGFzcz1cImJveC1jYXJkXCIgdi1zaG93PVwidG9waWNzWzBdXCIgPlxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwidGV4dCBpdGVtXCIgdi1mb3I9XCIodG9waWMsaW5kZXgpIGluIHRvcGljc1wiIDprZXk9XCJpbmRleFwiPlxyXG5cdFx0XHRcdDxkaXY+XHJcblx0XHRcdFx0XHQ8aDM+XHJcblx0XHRcdFx0XHRcdDxhIDpocmVmPVwiYCMvZGV0YWlscy8ke3RvcGljLl9pZH1gXCI+e3t0b3BpYy50aXRsZX19PC9hPiBcclxuXHRcdFx0XHRcdFx0PGVsLWJ1dHRvbiBcclxuXHRcdFx0XHRcdFx0XHRzaXplPVwibWluaVwiXHJcblx0XHRcdFx0XHRcdFx0c3R5bGU9XCJjb2xvcjogIzg4ODtcIlxyXG5cdFx0XHRcdFx0XHRcdGRpc2FibGVkPlxyXG5cdFx0XHRcdFx0XHRcdHt7IHRvcGljLnRvcGljdHlwZSB9fVxyXG5cdFx0XHRcdFx0XHQ8L2VsLWJ1dHRvbj5cclxuXHRcdFx0XHRcdFx0PGVsLWJhZGdlIDp2YWx1ZT1cInRvcGljLnN0YXJzLmxlbmd0aFwiIDptYXg9XCI5OVwiIGNsYXNzPVwiaXRlbSBzdGFyXCIgdHlwZT1cIndhcm5pbmdcIj5cclxuXHRcdFx0XHRcdFx0XHQ8ZWwtYnV0dG9uIHNpemU9XCJtaW5pXCI+PHNwYW4gY2xhc3M9XCJlbC1pY29uLXN0YXItb25cIj48L3NwYW4+PC9lbC1idXR0b24+XHJcblx0XHRcdFx0XHRcdDwvZWwtYmFkZ2U+XHJcblx0XHRcdFx0XHQ8L2gzPlxyXG5cdFx0XHRcdFx0PHAgY2xhc3M9XCJjb250ZW50XCI+e3sgdG9waWMuY29udGVudCB9fTwvcD5cclxuXHRcdFx0XHRcdDxwIGNsYXNzPVwicHNcIj5cclxuXHRcdFx0XHRcdFx0IOWPkeW4g+aXtumXtCA6IHt7IHRvcGljLmNyZWF0ZV90aW1lIH19XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0XHQ8aHIvPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdDwvZWwtY2FyZD5cclxuXHRcdDxkaXYgY2xhc3M9XCJibG9ja1wiPlxyXG5cdFx0PGgzIHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyO1wiIHYtc2hvdz1cIiF0b3BpY3NbMF1cIj7mib7kuI3liLDnm7jlhbPor53popguLi4uXHJcblx0XHRcdDxhIGhyZWY9XCJcIiBAY2xpY2sucHJldmVudD1cImdvcmVsZWFzZVwiPuWOu+WPkeW4gz88L2E+XHJcblx0XHQ8L2gzPlxyXG4gIDwvZGl2PlxyXG5cdDwvZWwtbWFpbj5cbjwvdGVtcGxhdGU+XG5cbjxzY3JpcHQ+XG5cdGV4cG9ydCBkZWZhdWx0IHtcblx0XHRkYXRhKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0dG9waWNzIDogW10sXHJcblx0XHRcdFx0dG9waWN0eXBlIDogJydcblx0XHRcdH07XG5cdFx0fSxcclxuXHRcdG1ldGhvZHM6e1xyXG5cdFx0XHRhc3luYyBnZXR0b3BpY3NieXRpdGxlKCl7XHJcblx0XHRcdFx0Y29uc3Qge2tleXdvcmR9ID0gdGhpcy4kcm91dGUucXVlcnlcclxuXHRcdFx0XHRjb25zdCB7ZGF0YSA6IHRvcGljc30gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MvdGl0bGU/a2V5d29yZD0nK2tleXdvcmQpXHJcblx0XHRcdFx0dG9waWNzLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcclxuXHRcdFx0XHRcdHN3aXRjaChpdGVtLnRvcGljdHlwZSl7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ3RlY2hub2xvZ3knIDogaXRlbS50b3BpY3R5cGUgPSAn5oqA5pyvJ1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlICdsaXRlcmF0dXJlJyA6IGl0ZW0udG9waWN0eXBlID0gJ+aWh+WtpidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnU3BvcnRzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+S9k+iCsidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiBpdGVtLnRvcGljdHlwZSA9ICflqLHkuZAnXHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgJ21ldGFwaHlzaWNzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+eOhOWtpidcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0ZGVmYXVsdCA6IGl0ZW0udG9waWN0eXBlID0gJ+acquefpSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdHRoaXMudG9waWNzID0gdG9waWNzXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2codG9waWNzKVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0YXN5bmMgY3JlYXRlZCgpe1xyXG5cdFx0XHR0aGlzLmdldHRvcGljc2J5dGl0bGUoKVxyXG5cdFx0fSxcclxuXHRcdGNvbXB1dGVkOntcclxuXHRcdFx0dG9waWNjbGFzcygpe1xyXG5cdFx0XHRcdHN3aXRjaCh0aGlzLnRvcGljdHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlICd0ZWNobm9sb2d5JyA6IHJldHVybiAn5oqA5pyvJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2xpdGVyYXR1cmUnIDogcmV0dXJuICAn5paH5a2mJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ1Nwb3J0cycgOiByZXR1cm4gICfkvZPogrInXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiByZXR1cm4gICflqLHkuZAnXHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnbWV0YXBoeXNpY3MnIDogcmV0dXJuICAn546E5a2mJ1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQgOiByZXR1cm4gICflhajpg6gnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0d2F0Y2g6e1xyXG5cdFx0XHQnJHJvdXRlJyAodG8gLCBmcm9tKXtcclxuXHRcdFx0XHR0aGlzLmdldHRvcGljc2J5dGl0bGUoKVxyXG5cdFx0XHR9XHJcblx0XHR9XG5cdH1cbjwvc2NyaXB0PlxuXG48c3R5bGU+XHJcblx0Lmxpc3R7XHJcblx0XHRcclxuXHR9XHJcblx0Lmxpc3QgLml0ZW0uc3RhcntcclxuXHRcdFxyXG5cdH1cclxuXHQubGlzdCAuaXRlbS5zdGFyIHNwYW57XHJcblx0XHRjb2xvcjogIzAwNzREOTtcclxuXHR9XHJcblx0Lmxpc3QgYXtcclxuXHRcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcclxuXHRcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuXHRcdGNvbG9yOiAjODA4MDgwO1xyXG5cdH1cclxuXHQubGlzdCBhOmhvdmVye1xyXG5cdFx0Y29sb3I6ICMwMDc0RDk7XHJcblx0fVxuXHQubGlzdCAudGV4dCB7XHJcblx0Zm9udC1zaXplOiAxNHB4O1xyXG59XHJcblxyXG4ubGlzdCAucmVsZWFzZSB7XHJcblx0ZmxvYXQ6IHJpZ2h0O1xyXG5cdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTBweCk7XHJcbn1cclxuLmxpc3QgZGl2LmVsLWNhcmRfX2hlYWRlcntcclxuXHRwYWRkaW5nOiAxNXB4O1xyXG5cdHBhZGRpbmctbGVmdDogMjBweDtcclxufVxyXG4ubGlzdCBkaXYuZWwtY2FyZF9fYm9keXtcclxuXHRwYWRkaW5nOiA1cHg7XHJcblx0cGFkZGluZy1sZWZ0OiAyMHB4O1xyXG59XHJcbi5saXN0IC5jbGVhcmZpeHtcclxuXHRoZWlnaHQ6IDIwcHg7XHJcbn1cclxuLmNsZWFyZml4OmJlZm9yZSxcclxuLmNsZWFyZml4OmFmdGVyIHtcclxuXHRkaXNwbGF5OiB0YWJsZTtcclxuXHRjb250ZW50OiBcIlwiO1xyXG59XHJcbi5jbGVhcmZpeDphZnRlciB7XHJcblx0Y2xlYXI6IGJvdGhcclxufVxyXG5cclxuLmJveC1jYXJkIHtcclxuXHR3aWR0aDogMTAwJTtcclxufVxyXG4ubGlzdCAuY29udGVudHtcclxuXHR0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO1xyXG5cdG92ZXJmbG93OiBoaWRkZW47XHJcblx0d2hpdGUtc3BhY2U6bm93cmFwO1xyXG5cdHBhZGRpbmctcmlnaHQ6IDMwMHB4O1xyXG59XHJcbi5saXN0IHAucHN7XHJcblx0bWFyZ2luOiAxMHB4O1xyXG5cdGZvbnQtc2l6ZTogMTJweDtcclxuXHR0ZXh0LWFsaWduOiByaWdodDtcclxufVxyXG4ubGlzdCAucGFnaW5ne1xyXG5cdG1hcmdpbjogMzBweDtcclxuXHRmbG9hdDogcmlnaHQ7XHJcbn1cbjwvc3R5bGU+XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbXBvbmVudHMvbGlzdGJ5dGl0bGUudnVlIiwiaW1wb3J0IFZ1ZSBmcm9tICd2dWUnXHJcbmltcG9ydCBBcHAgZnJvbSAnLi9hcHAudnVlJ1xyXG5cclxuXHJcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi9yb3V0ZXIuanMnXHJcblxyXG5uZXcgVnVlKHtcclxuXHRlbCA6ICcjYXBwJyxcclxuXHRkYXRhIDoge1xyXG5cdFx0bWVzc2FnZSA6ICd0ZXN0J1xyXG5cdH0sXHJcblx0dGVtcGxhdGU6JzxBcHAgLz4nLFxyXG5cdGNvbXBvbmVudHM6e1xyXG4gICAgQXBwXHJcblx0fSxcclxuXHRyb3V0ZXJcclxufSlcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbWFpbi5qcyIsIm1vZHVsZS5leHBvcnRzID0gVnVlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiVnVlXCJcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNWVmNDg5NThcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3I/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2FwcC52dWVcIilcbn1cbnZhciBub3JtYWxpemVDb21wb25lbnQgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9jb21wb25lbnQtbm9ybWFsaXplclwiKVxuLyogc2NyaXB0ICovXG5leHBvcnQgKiBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9hcHAudnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9hcHAudnVlXCJcbi8qIHRlbXBsYXRlICovXG5pbXBvcnQgX192dWVfdGVtcGxhdGVfXyBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXIvaW5kZXg/e1xcXCJpZFxcXCI6XFxcImRhdGEtdi01ZWY0ODk1OFxcXCIsXFxcImhhc1Njb3BlZFxcXCI6ZmFsc2UsXFxcImJ1YmxlXFxcIjp7XFxcInRyYW5zZm9ybXNcXFwiOnt9fX0hLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL2FwcC52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gbnVsbFxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2FwcC52dWVcIlxuXG4vKiBob3QgcmVsb2FkICovXG5pZiAobW9kdWxlLmhvdCkgeyhmdW5jdGlvbiAoKSB7XG4gIHZhciBob3RBUEkgPSByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpXG4gIGhvdEFQSS5pbnN0YWxsKHJlcXVpcmUoXCJ2dWVcIiksIGZhbHNlKVxuICBpZiAoIWhvdEFQSS5jb21wYXRpYmxlKSByZXR1cm5cbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAoIW1vZHVsZS5ob3QuZGF0YSkge1xuICAgIGhvdEFQSS5jcmVhdGVSZWNvcmQoXCJkYXRhLXYtNWVmNDg5NThcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH0gZWxzZSB7XG4gICAgaG90QVBJLnJlbG9hZChcImRhdGEtdi01ZWY0ODk1OFwiLCBDb21wb25lbnQub3B0aW9ucylcbiAgfVxuICBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBkaXNwb3NlZCA9IHRydWVcbiAgfSlcbn0pKCl9XG5cbmV4cG9ydCBkZWZhdWx0IENvbXBvbmVudC5leHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAudnVlXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNWVmNDg5NThcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2FwcC52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcIjdkMWI1Yjk0XCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi01ZWY0ODk1OFxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vYXBwLnZ1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgdmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi01ZWY0ODk1OFxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vYXBwLnZ1ZVwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlciEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi01ZWY0ODk1OFwiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9hcHAudnVlXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJcIixcImZpbGVcIjpcImFwcC52dWVcIixcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi01ZWY0ODk1OFwiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9hcHAudnVlXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIFRyYW5zbGF0ZXMgdGhlIGxpc3QgZm9ybWF0IHByb2R1Y2VkIGJ5IGNzcy1sb2FkZXIgaW50byBzb21ldGhpbmdcbiAqIGVhc2llciB0byBtYW5pcHVsYXRlLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAocGFyZW50SWQsIGxpc3QpIHtcbiAgdmFyIHN0eWxlcyA9IFtdXG4gIHZhciBuZXdTdHlsZXMgPSB7fVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICB2YXIgaWQgPSBpdGVtWzBdXG4gICAgdmFyIGNzcyA9IGl0ZW1bMV1cbiAgICB2YXIgbWVkaWEgPSBpdGVtWzJdXG4gICAgdmFyIHNvdXJjZU1hcCA9IGl0ZW1bM11cbiAgICB2YXIgcGFydCA9IHtcbiAgICAgIGlkOiBwYXJlbnRJZCArICc6JyArIGksXG4gICAgICBjc3M6IGNzcyxcbiAgICAgIG1lZGlhOiBtZWRpYSxcbiAgICAgIHNvdXJjZU1hcDogc291cmNlTWFwXG4gICAgfVxuICAgIGlmICghbmV3U3R5bGVzW2lkXSkge1xuICAgICAgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHsgaWQ6IGlkLCBwYXJ0czogW3BhcnRdIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3R5bGVzXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9saXN0VG9TdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDMyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0xMGQ5ZGYwOVxcXCIsXFxcInNjb3BlZFxcXCI6dHJ1ZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9sb2dpbi52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcImEzZjNkNTAyXCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0xMGQ5ZGYwOVxcXCIsXFxcInNjb3BlZFxcXCI6dHJ1ZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9sb2dpbi52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMTBkOWRmMDlcXFwiLFxcXCJzY29wZWRcXFwiOnRydWUsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vbG9naW4udnVlXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LTEwZDlkZjA5XCIsXCJzY29wZWRcIjp0cnVlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWVcbi8vIG1vZHVsZSBpZCA9IDMzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG4ubG9naW5bZGF0YS12LTEwZDlkZjA5XSB7XFxuXFx0d2lkdGg6IDQwMHB4O1xcblxcdHBhZGRpbmc6IDMwcHg7XFxuXFx0cGFkZGluZy1sZWZ0OiAxMHB4O1xcblxcdHBhZGRpbmctcmlnaHQ6IDcwcHg7XFxuXFx0cGFkZGluZy1ib3R0b206IDIwcHg7XFxuXFx0bWFyZ2luOiAxMDBweCBhdXRvO1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XFxufVxcbi5sb2dpbmJ0bltkYXRhLXYtMTBkOWRmMDlde1xcblxcdHdpZHRoOiAxMDAlO1xcbn1cXG4ubWVzc2FnZVtkYXRhLXYtMTBkOWRmMDldIHtcXG5cXHRoZWlnaHQ6IDQwcHg7XFxuXFx0bWFyZ2luLXRvcDogMjBweDtcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZDhkZWUyO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbn1cXG4ubWVzc2FnZSBwW2RhdGEtdi0xMGQ5ZGYwOV17XFxuXFx0cGFkZGluZzogMDtcXG5cXHRsaW5lLWhlaWdodDogNDBweDtcXG5cXHRtYXJnaW46IDA7XFxufVxcbi5sb2dpbiBoMVtkYXRhLXYtMTBkOWRmMDlde1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRtYXJnaW46IDA7XFxufVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJFOi9DTVMvY21zLXNwYS9zcmMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9sb2dpbi52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjtBQTZFQTtDQUNBLGFBQUE7Q0FDQSxjQUFBO0NBQ0EsbUJBQUE7Q0FDQSxvQkFBQTtDQUNBLHFCQUFBO0NBQ0EsbUJBQUE7Q0FDQSx1QkFBQTtDQUNBO0FBQ0E7Q0FDQSxZQUFBO0NBQ0E7QUFDQTtDQUNBLGFBQUE7Q0FDQSxpQkFBQTtDQUNBLG1CQUFBO0VBQ0EsMEJBQUE7RUFDQSxtQkFBQTtDQUNBO0FBQ0E7Q0FDQSxXQUFBO0NBQ0Esa0JBQUE7Q0FDQSxVQUFBO0NBQ0E7QUFDQTtDQUNBLG1CQUFBO0NBQ0EsVUFBQTtDQUNBXCIsXCJmaWxlXCI6XCJsb2dpbi52dWVcIixcInNvdXJjZXNDb250ZW50XCI6W1wiPHRlbXBsYXRlPlxcblxcdDxkaXYgY2xhc3M9XFxcImxvZ2luXFxcIj5cXHJcXG5cXHRcXHQ8aDE+PGEgaHJlZj1cXFwiIy9cXFwiPjxpbWcgc3JjPVxcXCIuLi9wdWJpYy9pbWcvbG9nby5wbmdcXFwiIGFsdD1cXFwiXFxcIj48L2E+PC9oMT5cXHJcXG5cXHRcXHQ8ZWwtZm9ybSA6bW9kZWw9XFxcInJ1bGVGb3JtMlxcXCIgc3RhdHVzLWljb24gOnJ1bGVzPVxcXCJydWxlczJcXFwiIHJlZj1cXFwicnVsZUZvcm0yXFxcIiBsYWJlbC13aWR0aD1cXFwiODBweFxcXCIgY2xhc3M9XFxcImRlbW8tcnVsZUZvcm1cXFwiPlxcclxcblxcdFxcdFxcdDxlbC1mb3JtLWl0ZW0gcHJvcD1cXFwiZW1haWxcXFwiIGxhYmVsPVxcXCLpgq7nrrFcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1pbnB1dCB2LW1vZGVsPVxcXCJydWxlRm9ybTIuZW1haWxcXFwiIHR5cGU9XFxcImVtYWlsXFxcIj48L2VsLWlucHV0PlxcclxcblxcdFxcdFxcdDwvZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XFxcIuWvhueggVxcXCIgcHJvcD1cXFwicGFzc3dvcmRcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1pbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgdi1tb2RlbD1cXFwicnVsZUZvcm0yLnBhc3N3b3JkXFxcIiBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCI+PC9lbC1pbnB1dD5cXHJcXG5cXHRcXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdDxlbC1idXR0b24gY2xhc3M9XFxcImxvZ2luYnRuXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInN1Ym1pdEZvcm0oJ3J1bGVGb3JtMicpXFxcIj7nmbvlvZU8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQgIDxwPuayoeaciei0puWPtz8gPGEgaHJlZj1cXFwiIy9yZWdpc3RlclxcXCI+54K55Ye75Yib5bu6PC9hPi48L3A+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0PC9lbC1mb3JtPlxcclxcblxcdDwvZGl2PlxcbjwvdGVtcGxhdGU+XFxuXFxuPHNjcmlwdD5cXHJcXG5cXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXFxuXFx0ZXhwb3J0IGRlZmF1bHQge1xcclxcblxcdFxcdGRhdGEoKSB7XFxyXFxuXFx0XFx0XFx0Y29uc3QgdmFsaWRhdGVQYXNzID0gKHJ1bGUsIHZhbHVlLCBjYWxsYmFjaykgPT4ge1xcclxcblxcdFxcdFxcdFxcdGlmICh2YWx1ZSA9PT0gJycpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYWxsYmFjayhuZXcgRXJyb3IoJ+ivt+i+k+WFpeWvhueggScpKTtcXHJcXG5cXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKCk7XFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0XFx0Y29uc3QgdmFsaWRhdGVlbWFpbCA9IChydWxlLCB2YWx1ZSwgY2FsbGJhY2spID0+IHtcXHJcXG5cXHRcXHRcXHRcXHRpZiAodmFsdWUgPT09ICcnKSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2sobmV3IEVycm9yKCfpgq7nrrHkuI3og73kuLrnqbonKSk7XFxyXFxuXFx0XFx0XFx0XFx0fSBlbHNlIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKFxcXCJeW2EtejAtOUEtWl0rWy0gfCBhLXowLTlBLVogLiBfXStAKFthLXowLTlBLVpdKygtW2EtejAtOUEtWl0rKT9cXFxcXFxcXC4pK1thLXpdezIsfSRcXFwiKVxcclxcblxcdFxcdFxcdFxcdFxcdGlmICghcmVnLnRlc3QodmFsdWUpKSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7fovpPlhaXmraPnoa7pgq7nrrHmoLzlvI8nKSlcXHJcXG5cXHRcXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKClcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0XFx0cmV0dXJuIHtcXHJcXG5cXHRcXHRcXHRcXHRydWxlRm9ybTI6IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRwYXNzd29yZDogJycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0ZW1haWw6ICcnXFxyXFxuXFx0XFx0XFx0XFx0fSxcXHJcXG5cXHRcXHRcXHRcXHRydWxlczI6IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRwYXNzd29yZDogW3tcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR2YWxpZGF0b3I6IHZhbGlkYXRlUGFzcyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRlbWFpbDogW3tcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR2YWxpZGF0b3I6IHZhbGlkYXRlZW1haWwsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dHJpZ2dlcjogJ2JsdXInXFxyXFxuXFx0XFx0XFx0XFx0XFx0fV1cXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0fTtcXHJcXG5cXHRcXHR9LFxcclxcblxcdFxcdG1ldGhvZHM6IHtcXHJcXG5cXHRcXHRcXHQgc3VibWl0Rm9ybShmb3JtTmFtZSkge1xcclxcblxcdFxcdFxcdFxcdHRoaXMuJHJlZnNbZm9ybU5hbWVdLnZhbGlkYXRlKGFzeW5jICh2YWxpZCkgPT4ge1xcclxcblxcdFxcdFxcdFxcdFxcdGlmICh2YWxpZCkge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJywgdGhpcy5ydWxlRm9ybTIpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYocmVzLmRhdGEuZXJyKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRyZXR1cm4gdGhpcy4kbWVzc2FnZSgn55So5oi35ZCN5oiW5a+G56CB6ZSZ6K+vJylcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dGhpcy4kcm91dGVyLnB1c2goJy8nKVxcclxcblxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdH1cXHRcXHJcXG5cXHRcXHR9XFxyXFxuXFx0fVxcbjwvc2NyaXB0PlxcblxcbjxzdHlsZSBzY29wZWQ+XFxuXFx0LmxvZ2luIHtcXHJcXG5cXHRcXHR3aWR0aDogNDAwcHg7XFxyXFxuXFx0XFx0cGFkZGluZzogMzBweDtcXHJcXG5cXHRcXHRwYWRkaW5nLWxlZnQ6IDEwcHg7XFxyXFxuXFx0XFx0cGFkZGluZy1yaWdodDogNzBweDtcXHJcXG5cXHRcXHRwYWRkaW5nLWJvdHRvbTogMjBweDtcXHJcXG5cXHRcXHRtYXJnaW46IDEwMHB4IGF1dG87XFxyXFxuXFx0XFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcXHJcXG5cXHR9XFxyXFxuXFx0LmxvZ2luYnRue1xcclxcblxcdFxcdHdpZHRoOiAxMDAlO1xcclxcblxcdH1cXHJcXG5cXHQubWVzc2FnZSB7XFxyXFxuXFx0XFx0aGVpZ2h0OiA0MHB4O1xcclxcblxcdFxcdG1hcmdpbi10b3A6IDIwcHg7XFxyXFxuXFx0XFx0cGFkZGluZy1sZWZ0OiAyMHB4O1xcclxcblxcdCAgYm9yZGVyOiAxcHggc29saWQgI2Q4ZGVlMjtcXHJcXG5cXHQgIGJvcmRlci1yYWRpdXM6IDVweDtcXHJcXG5cXHR9XFxyXFxuXFx0Lm1lc3NhZ2UgcHtcXHJcXG5cXHRcXHRwYWRkaW5nOiAwO1xcclxcblxcdFxcdGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcblxcdFxcdG1hcmdpbjogMDtcXHJcXG5cXHR9XFxyXFxuXFx0LmxvZ2luIGgxe1xcclxcblxcdFxcdHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG5cXHRcXHRtYXJnaW46IDA7XFxyXFxuXFx0fVxcbjwvc3R5bGU+XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LTEwZDlkZjA5XCIsXCJzY29wZWRcIjp0cnVlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9sb2dpbi52dWVcbi8vIG1vZHVsZSBpZCA9IDM0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXG4gICAgXCJkaXZcIixcbiAgICB7IHN0YXRpY0NsYXNzOiBcImxvZ2luXCIgfSxcbiAgICBbXG4gICAgICBfdm0uX20oMCksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXG4gICAgICAgIFwiZWwtZm9ybVwiLFxuICAgICAgICB7XG4gICAgICAgICAgcmVmOiBcInJ1bGVGb3JtMlwiLFxuICAgICAgICAgIHN0YXRpY0NsYXNzOiBcImRlbW8tcnVsZUZvcm1cIixcbiAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgbW9kZWw6IF92bS5ydWxlRm9ybTIsXG4gICAgICAgICAgICBcInN0YXR1cy1pY29uXCI6IFwiXCIsXG4gICAgICAgICAgICBydWxlczogX3ZtLnJ1bGVzMixcbiAgICAgICAgICAgIFwibGFiZWwtd2lkdGhcIjogXCI4MHB4XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IHByb3A6IFwiZW1haWxcIiwgbGFiZWw6IFwi6YKu566xXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybTIuZW1haWwsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybTIsIFwiZW1haWxcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwicnVsZUZvcm0yLmVtYWlsXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIuWvhueggVwiLCBwcm9wOiBcInBhc3N3b3JkXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInBhc3N3b3JkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIiB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnJ1bGVGb3JtMi5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtMiwgXCJwYXNzd29yZFwiLCAkJHYpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJydWxlRm9ybTIucGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJsb2dpbmJ0blwiLFxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJwcmltYXJ5XCIgfSxcbiAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uc3VibWl0Rm9ybShcInJ1bGVGb3JtMlwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KFwi55m75b2VXCIpXVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIm1lc3NhZ2VcIiB9LCBbXG4gICAgICAgICAgICAgICAgX2MoXCJwXCIsIFtcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIuayoeaciei0puWPtz8gXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL3JlZ2lzdGVyXCIgfSB9LCBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fdihcIueCueWHu+WIm+W7ulwiKVxuICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIuXCIpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKVxuICAgICAgICBdLFxuICAgICAgICAxXG4gICAgICApXG4gICAgXSxcbiAgICAxXG4gIClcbn1cbnZhciBzdGF0aWNSZW5kZXJGbnMgPSBbXG4gIGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdm0gPSB0aGlzXG4gICAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gICAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gICAgcmV0dXJuIF9jKFwiaDFcIiwgW1xuICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL1wiIH0gfSwgW1xuICAgICAgICBfYyhcImltZ1wiLCB7IGF0dHJzOiB7IHNyYzogcmVxdWlyZShcIi4uL3B1YmljL2ltZy9sb2dvLnBuZ1wiKSwgYWx0OiBcIlwiIH0gfSlcbiAgICAgIF0pXG4gICAgXSlcbiAgfVxuXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG52YXIgZXNFeHBvcnRzID0geyByZW5kZXI6IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zOiBzdGF0aWNSZW5kZXJGbnMgfVxuZXhwb3J0IGRlZmF1bHQgZXNFeHBvcnRzXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmIChtb2R1bGUuaG90LmRhdGEpIHtcbiAgICByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpICAgICAgLnJlcmVuZGVyKFwiZGF0YS12LTEwZDlkZjA5XCIsIGVzRXhwb3J0cylcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3RlbXBsYXRlLWNvbXBpbGVyP3tcImlkXCI6XCJkYXRhLXYtMTBkOWRmMDlcIixcImhhc1Njb3BlZFwiOnRydWUsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL2xvZ2luLnZ1ZVxuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LThmOGExZDlhXFxcIixcXFwic2NvcGVkXFxcIjp0cnVlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3JlZ2lzdGVyLnZ1ZVwiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzQ2xpZW50LmpzXCIpKFwiMWQ1YWUxNjBcIiwgY29udGVudCwgZmFsc2UsIHt9KTtcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcbiAvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuIGlmKCFjb250ZW50LmxvY2Fscykge1xuICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LThmOGExZDlhXFxcIixcXFwic2NvcGVkXFxcIjp0cnVlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3JlZ2lzdGVyLnZ1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgdmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi04ZjhhMWQ5YVxcXCIsXFxcInNjb3BlZFxcXCI6dHJ1ZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9yZWdpc3Rlci52dWVcIik7XG4gICAgIGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuICAgICB1cGRhdGUobmV3Q29udGVudCk7XG4gICB9KTtcbiB9XG4gLy8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIhLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtOGY4YTFkOWFcIixcInNjb3BlZFwiOnRydWUsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3JlZ2lzdGVyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlxcbi5yZWdpc3RlcltkYXRhLXYtOGY4YTFkOWFdIHtcXG5cXHR3aWR0aDogNTAwcHg7XFxuXFx0cGFkZGluZzogNDBweDtcXG5cXHRwYWRkaW5nLXJpZ2h0OiA3MHB4O1xcblxcdG1hcmdpbjogMjBweCBhdXRvO1xcblxcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XFxufVxcbi5yZWdpc3RlciBoMVtkYXRhLXYtOGY4YTFkOWFde1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRtYXJnaW46IDA7XFxufVxcbi5yZWdpc3RlcmJ0bltkYXRhLXYtOGY4YTFkOWFde1xcblxcdHdpZHRoOiAxMDAlO1xcbn1cXG4ubWVzc2FnZVtkYXRhLXYtOGY4YTFkOWFdIHtcXG5cXHRoZWlnaHQ6IDQwcHg7XFxuXFx0bWFyZ2luLXRvcDogMjBweDtcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZDhkZWUyO1xcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcbn1cXG4ubWVzc2FnZSBwW2RhdGEtdi04ZjhhMWQ5YV17XFxuXFx0cGFkZGluZzogMDtcXG5cXHRsaW5lLWhlaWdodDogNDBweDtcXG5cXHRtYXJnaW46IDA7XFxufVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJFOi9DTVMvY21zLXNwYS9zcmMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9yZWdpc3Rlci52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjtBQWlLQTtDQUNBLGFBQUE7Q0FDQSxjQUFBO0NBQ0Esb0JBQUE7Q0FDQSxrQkFBQTtDQUNBLHVCQUFBO0NBQ0E7QUFDQTtDQUNBLG1CQUFBO0NBQ0EsVUFBQTtDQUNBO0FBQ0E7Q0FDQSxZQUFBO0NBQ0E7QUFDQTtDQUNBLGFBQUE7Q0FDQSxpQkFBQTtDQUNBLG1CQUFBO0VBQ0EsMEJBQUE7RUFDQSxtQkFBQTtDQUNBO0FBQ0E7Q0FDQSxXQUFBO0NBQ0Esa0JBQUE7Q0FDQSxVQUFBO0NBQ0FcIixcImZpbGVcIjpcInJlZ2lzdGVyLnZ1ZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI8dGVtcGxhdGU+XFxyXFxuXFx0PGRpdiBjbGFzcz1cXFwicmVnaXN0ZXJcXFwiPlxcclxcblxcdFxcdDxoMT48aW1nIHNyYz1cXFwiLi4vcHViaWMvaW1nL2xvZ28ucG5nXFxcIiBhbHQ9XFxcIlxcXCI+PC9oMT5cXHJcXG5cXHRcXHQ8ZWwtZGlhbG9nIHRpdGxlPVxcXCLmj5DnpLpcXFwiIDp2aXNpYmxlLnN5bmM9XFxcImRpYWxvZ1Zpc2libGVcXFwiIHdpZHRoPVxcXCIzMCVcXFwiID5cXHJcXG5cXHRcXHRcXHQ8c3Bhbj7ms6jlhozmiJDlip8h5Y6755m75b2V77yfPC9zcGFuPlxcclxcblxcdFxcdFxcdDxzcGFuIHNsb3Q9XFxcImZvb3RlclxcXCIgY2xhc3M9XFxcImRpYWxvZy1mb290ZXJcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1idXR0b24gQGNsaWNrPVxcXCJkaWFsb2dWaXNpYmxlID0gZmFsc2VcXFwiPuWPliDmtog8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwiZ29sb2dpblxcXCI+56GuIOWumjwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdDwvc3Bhbj5cXHJcXG5cXHRcXHQ8L2VsLWRpYWxvZz5cXHJcXG5cXHRcXHQ8ZWwtZm9ybSA6bW9kZWw9XFxcInJ1bGVGb3JtMlxcXCIgc3RhdHVzLWljb24gOnJ1bGVzPVxcXCJydWxlczJcXFwiIHJlZj1cXFwicnVsZUZvcm0yXFxcIiBsYWJlbC13aWR0aD1cXFwiMTAwcHhcXFwiIGNsYXNzPVxcXCJkZW1vLXJ1bGVGb3JtXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLnlKjmiLflkI1cXFwiIHByb3A9XFxcInVzZXJuYW1lXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtaW5wdXQgdi1tb2RlbD1cXFwicnVsZUZvcm0yLnVzZXJuYW1lXFxcIj48L2VsLWlucHV0PlxcclxcblxcdFxcdFxcdDwvZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1mb3JtLWl0ZW0gcHJvcD1cXFwiZW1haWxcXFwiIGxhYmVsPVxcXCLpgq7nrrFcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1pbnB1dCB2LW1vZGVsPVxcXCJydWxlRm9ybTIuZW1haWxcXFwiIHR5cGU9XFxcImVtYWlsXFxcIj48L2VsLWlucHV0PlxcclxcblxcdFxcdFxcdDwvZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XFxcIuWvhueggVxcXCIgcHJvcD1cXFwicGFzc3dvcmRcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1pbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgdi1tb2RlbD1cXFwicnVsZUZvcm0yLnBhc3N3b3JkXFxcIiBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCI+PC9lbC1pbnB1dD5cXHJcXG5cXHRcXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLnoa7orqTlr4bnoIFcXFwiIHByb3A9XFxcImNoZWNrUGFzc1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLWlucHV0IHR5cGU9XFxcInBhc3N3b3JkXFxcIiB2LW1vZGVsPVxcXCJydWxlRm9ybTIuY2hlY2tQYXNzXFxcIiBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCI+PC9lbC1pbnB1dD5cXHJcXG5cXHRcXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLmgKfliKtcXFwiIHByb3A9XFxcImdlbmRhclxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLXJhZGlvLWdyb3VwIHYtbW9kZWw9XFxcInJ1bGVGb3JtMi5nZW5kYXJcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxlbC1yYWRpbyBsYWJlbD1cXFwi55S3XFxcIiB2YWx1ZT1cXFwiMFxcXCI+PC9lbC1yYWRpbz5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8ZWwtcmFkaW8gbGFiZWw9XFxcIuWls1xcXCIgdmFsdWU9XFxcIjFcXFwiPjwvZWwtcmFkaW8+XFxyXFxuXFx0XFx0XFx0XFx0PC9lbC1yYWRpby1ncm91cD5cXHJcXG5cXHRcXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdDxlbC1idXR0b24gY2xhc3M9XFxcInJlZ2lzdGVyYnRuXFxcIiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBAY2xpY2s9XFxcInN1Ym1pdEZvcm0oJ3J1bGVGb3JtMicpXFxcIj7mj5DkuqQ8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJtZXNzYWdlXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQgIDxwPuW3suaciei0puWPtz8gPGEgaHJlZj1cXFwiIy9sb2dpblxcXCI+54K55Ye755m75b2VPC9hPi48L3A+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0PC9lbC1mb3JtPlxcclxcblxcdDwvZGl2PlxcclxcbjwvdGVtcGxhdGU+XFxyXFxuXFxyXFxuPHNjcmlwdD5cXHJcXG5cXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXFxyXFxuXFx0ZXhwb3J0IGRlZmF1bHQge1xcclxcblxcdFxcdGRhdGEoKSB7XFxyXFxuXFx0XFx0XFx0Y29uc3QgY2hlY2tBZ2UgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XFxyXFxuXFx0XFx0XFx0XFx0aWYgKCF2YWx1ZSkge1xcclxcblxcdFxcdFxcdFxcdFxcdHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ+eUqOaIt+WQjeS4jeiDveS4uuepuicpKTtcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0c2V0VGltZW91dChhc3luYyAoKSA9PiB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0aWYgKHZhbHVlLmxlbmd0aCA8IDIgfHwgdmFsdWUubGVuZ3RoID4gOCkge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKG5ldyBFcnJvcign55So5oi35ZCN5b+F6aG75ZyoMi045L2NJykpO1xcclxcblxcdFxcdFxcdFxcdFxcdH0gZWxzZSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y29uc3QgcmVzID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvdXNlcnM/dXNlcm5hbWU9Jyt2YWx1ZSlcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRpZihyZXMuZGF0YVswXSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0cmV0dXJuIGNhbGxiYWNrKG5ldyBFcnJvcign6K+l55So5oi35ZCN5bey5a2Y5ZyoJykpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKCk7XFxyXFxuXFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdH0sIDIwMCk7XFxyXFxuXFx0XFx0XFx0fTtcXHJcXG5cXHRcXHRcXHRjb25zdCB2YWxpZGF0ZVBhc3MgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XFxyXFxuXFx0XFx0XFx0XFx0aWYgKHZhbHVlID09PSAnJykge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKG5ldyBFcnJvcign6K+36L6T5YWl5a+G56CBJykpO1xcclxcblxcdFxcdFxcdFxcdH0gZWxzZSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0aWYgKHRoaXMucnVsZUZvcm0yLmNoZWNrUGFzcyAhPT0gJycpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0aGlzLiRyZWZzLnJ1bGVGb3JtMi52YWxpZGF0ZUZpZWxkKCdjaGVja1Bhc3MnKTtcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2soKTtcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0fTtcXHJcXG5cXHRcXHRcXHRjb25zdCB2YWxpZGF0ZVBhc3MyID0gKHJ1bGUsIHZhbHVlLCBjYWxsYmFjaykgPT4ge1xcclxcblxcdFxcdFxcdFxcdGlmICh2YWx1ZSA9PT0gJycpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYWxsYmFjayhuZXcgRXJyb3IoJ+ivt+WGjeasoei+k+WFpeWvhueggScpKTtcXHJcXG5cXHRcXHRcXHRcXHR9IGVsc2UgaWYgKHZhbHVlICE9PSB0aGlzLnJ1bGVGb3JtMi5wYXNzd29yZCkge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKG5ldyBFcnJvcign5Lik5qyh6L6T5YWl5a+G56CB5LiN5LiA6Ie0IScpKTtcXHJcXG5cXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKCk7XFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0XFx0Y29uc3QgdmFsaWRhdGVlbWFpbCA9IGFzeW5jIChydWxlLCB2YWx1ZSwgY2FsbGJhY2spID0+IHtcXHJcXG5cXHRcXHRcXHRcXHRpZiAodmFsdWUgPT09ICcnKSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2sobmV3IEVycm9yKCfpgq7nrrHkuI3og73kuLrnqbonKSk7XFxyXFxuXFx0XFx0XFx0XFx0fSBlbHNlIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRjb25zdCByZWcgPSBuZXcgUmVnRXhwKFxcXCJeW2EtejAtOUEtWl0rWy0gfCBhLXowLTlBLVogLiBfXStAKFthLXowLTlBLVpdKygtW2EtejAtOUEtWl0rKT9cXFxcXFxcXC4pK1thLXpdezIsfSRcXFwiKVxcclxcblxcdFxcdFxcdFxcdFxcdGlmICghcmVnLnRlc3QodmFsdWUpKSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2sobmV3IEVycm9yKCfor7fovpPlhaXmraPnoa7pgq7nrrHmoLzlvI8nKSlcXHJcXG5cXHRcXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP2VtYWlsPScrdmFsdWUpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYocmVzLmRhdGFbMF0pe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHJldHVybiBjYWxsYmFjayhuZXcgRXJyb3IoJ+ivpemCrueuseW3suiiq+azqOWGjCcpKVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjYWxsYmFjaygpXFxyXFxuXFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9O1xcclxcblxcdFxcdFxcdGNvbnN0IHZhbGlkYXRlZ2VuZGFyID0gKHJ1bGUsIHZhbHVlLCBjYWxsYmFjaykgPT4ge1xcclxcblxcdFxcdFxcdFxcdGlmICh2YWx1ZSA9PT0gJycpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYWxsYmFjayhuZXcgRXJyb3IoJ+ivt+mAieaLqeaAp+WIqycpKTtcXHJcXG5cXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKClcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0fTtcXHJcXG5cXHRcXHRcXHRyZXR1cm4ge1xcclxcblxcdFxcdFxcdFxcdHJ1bGVGb3JtMjoge1xcclxcblxcdFxcdFxcdFxcdFxcdHBhc3N3b3JkOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRjaGVja1Bhc3M6ICcnLFxcclxcblxcdFxcdFxcdFxcdFxcdHVzZXJuYW1lOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRlbWFpbDogJycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0Z2VuZGFyOiAnJ1xcclxcblxcdFxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0XFx0ZGlhbG9nVmlzaWJsZTogZmFsc2UsXFxyXFxuXFx0XFx0XFx0XFx0cnVsZXMyOiB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0cGFzc3dvcmQ6IFt7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dmFsaWRhdG9yOiB2YWxpZGF0ZVBhc3MsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dHJpZ2dlcjogJ2JsdXInXFxyXFxuXFx0XFx0XFx0XFx0XFx0fV0sXFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2hlY2tQYXNzOiBbe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdHZhbGlkYXRvcjogdmFsaWRhdGVQYXNzMixcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHR1c2VybmFtZTogW3tcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR2YWxpZGF0b3I6IGNoZWNrQWdlLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHRyaWdnZXI6ICdibHVyJ1xcclxcblxcdFxcdFxcdFxcdFxcdH1dLFxcclxcblxcdFxcdFxcdFxcdFxcdGVtYWlsOiBbe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdHZhbGlkYXRvcjogdmFsaWRhdGVlbWFpbCxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRnZW5kYXI6IFt7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dmFsaWRhdG9yOiB2YWxpZGF0ZWdlbmRhcixcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9O1xcclxcblxcdFxcdH0sXFxyXFxuXFx0XFx0bWV0aG9kczoge1xcclxcblxcdFxcdFxcdHN1Ym1pdEZvcm0oZm9ybU5hbWUpIHtcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS52YWxpZGF0ZShhc3luYyAodmFsaWQpID0+IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRpZiAodmFsaWQpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRkZWxldGUgdGhpcy5ydWxlRm9ybTIuY2hlY2tQYXNzXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYgKHRoaXMucnVsZUZvcm0yLmdlbmRhciA9PT0gJ+eUtycpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPSAwXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fSBlbHNlIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPSAxXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2VycycsIHRoaXMucnVsZUZvcm0yKVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGlmKHJlcy5kYXRhLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0cmV0dXJuXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHRoaXMuZGlhbG9nVmlzaWJsZSA9IHRydWVcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHR9LFxcclxcblxcdFxcdFxcdGdvbG9naW4oKXtcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLmRpYWxvZ1Zpc2libGUgPSBmYWxzZVxcclxcblxcdFxcdFxcdFxcdHRoaXMuJHJvdXRlci5wdXNoKCcvbG9naW4nKVxcclxcblxcdFxcdFxcdH1cXHJcXG5cXHRcXHR9XFxyXFxuXFx0fVxcclxcbjwvc2NyaXB0PlxcclxcblxcclxcbjxzdHlsZSBzY29wZWQ+XFxyXFxuXFx0LnJlZ2lzdGVyIHtcXHJcXG5cXHRcXHR3aWR0aDogNTAwcHg7XFxyXFxuXFx0XFx0cGFkZGluZzogNDBweDtcXHJcXG5cXHRcXHRwYWRkaW5nLXJpZ2h0OiA3MHB4O1xcclxcblxcdFxcdG1hcmdpbjogMjBweCBhdXRvO1xcclxcblxcdFxcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XFxyXFxuXFx0fVxcclxcblxcdC5yZWdpc3RlciBoMXtcXHJcXG5cXHRcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuXFx0XFx0bWFyZ2luOiAwO1xcclxcblxcdH1cXHJcXG5cXHQucmVnaXN0ZXJidG57XFxyXFxuXFx0XFx0d2lkdGg6IDEwMCU7XFxyXFxuXFx0fVxcclxcblxcdC5tZXNzYWdlIHtcXHJcXG5cXHRcXHRoZWlnaHQ6IDQwcHg7XFxyXFxuXFx0XFx0bWFyZ2luLXRvcDogMjBweDtcXHJcXG5cXHRcXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxuXFx0ICBib3JkZXI6IDFweCBzb2xpZCAjZDhkZWUyO1xcclxcblxcdCAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcblxcdH1cXHJcXG5cXHQubWVzc2FnZSBwe1xcclxcblxcdFxcdHBhZGRpbmc6IDA7XFxyXFxuXFx0XFx0bGluZS1oZWlnaHQ6IDQwcHg7XFxyXFxuXFx0XFx0bWFyZ2luOiAwO1xcclxcblxcdH1cXHJcXG48L3N0eWxlPlxcblxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi04ZjhhMWQ5YVwiLFwic2NvcGVkXCI6dHJ1ZSxcImhhc0lubGluZUNvbmZpZ1wiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvcmVnaXN0ZXIudnVlXG4vLyBtb2R1bGUgaWQgPSAzN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFxuICAgIFwiZGl2XCIsXG4gICAgeyBzdGF0aWNDbGFzczogXCJyZWdpc3RlclwiIH0sXG4gICAgW1xuICAgICAgX3ZtLl9tKDApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWRpYWxvZ1wiLFxuICAgICAgICB7XG4gICAgICAgICAgYXR0cnM6IHsgdGl0bGU6IFwi5o+Q56S6XCIsIHZpc2libGU6IF92bS5kaWFsb2dWaXNpYmxlLCB3aWR0aDogXCIzMCVcIiB9LFxuICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICBcInVwZGF0ZTp2aXNpYmxlXCI6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICBfdm0uZGlhbG9nVmlzaWJsZSA9ICRldmVudFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW1xuICAgICAgICAgIF9jKFwic3BhblwiLCBbX3ZtLl92KFwi5rOo5YaM5oiQ5YqfIeWOu+eZu+W9le+8n1wiKV0pLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcInNwYW5cIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6IFwiZGlhbG9nLWZvb3RlclwiLFxuICAgICAgICAgICAgICBhdHRyczogeyBzbG90OiBcImZvb3RlclwiIH0sXG4gICAgICAgICAgICAgIHNsb3Q6IFwiZm9vdGVyXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIF92bS5kaWFsb2dWaXNpYmxlID0gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW192bS5fdihcIuWPliDmtohcIildXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgeyBhdHRyczogeyB0eXBlOiBcInByaW1hcnlcIiB9LCBvbjogeyBjbGljazogX3ZtLmdvbG9naW4gfSB9LFxuICAgICAgICAgICAgICAgIFtfdm0uX3YoXCLnoa4g5a6aXCIpXVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgIClcbiAgICAgICAgXVxuICAgICAgKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcbiAgICAgICAgXCJlbC1mb3JtXCIsXG4gICAgICAgIHtcbiAgICAgICAgICByZWY6IFwicnVsZUZvcm0yXCIsXG4gICAgICAgICAgc3RhdGljQ2xhc3M6IFwiZGVtby1ydWxlRm9ybVwiLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICBtb2RlbDogX3ZtLnJ1bGVGb3JtMixcbiAgICAgICAgICAgIFwic3RhdHVzLWljb25cIjogXCJcIixcbiAgICAgICAgICAgIHJ1bGVzOiBfdm0ucnVsZXMyLFxuICAgICAgICAgICAgXCJsYWJlbC13aWR0aFwiOiBcIjEwMHB4XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIueUqOaIt+WQjVwiLCBwcm9wOiBcInVzZXJuYW1lXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybTIudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybTIsIFwidXNlcm5hbWVcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwicnVsZUZvcm0yLnVzZXJuYW1lXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IHByb3A6IFwiZW1haWxcIiwgbGFiZWw6IFwi6YKu566xXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcImVtYWlsXCIgfSxcbiAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybTIuZW1haWwsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybTIsIFwiZW1haWxcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwicnVsZUZvcm0yLmVtYWlsXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIuWvhueggVwiLCBwcm9wOiBcInBhc3N3b3JkXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInBhc3N3b3JkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIiB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnJ1bGVGb3JtMi5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtMiwgXCJwYXNzd29yZFwiLCAkJHYpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJydWxlRm9ybTIucGFzc3dvcmRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIHsgYXR0cnM6IHsgbGFiZWw6IFwi56Gu6K6k5a+G56CBXCIsIHByb3A6IFwiY2hlY2tQYXNzXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInBhc3N3b3JkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIiB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnJ1bGVGb3JtMi5jaGVja1Bhc3MsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybTIsIFwiY2hlY2tQYXNzXCIsICQkdilcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInJ1bGVGb3JtMi5jaGVja1Bhc3NcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIHsgYXR0cnM6IHsgbGFiZWw6IFwi5oCn5YirXCIsIHByb3A6IFwiZ2VuZGFyXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICBcImVsLXJhZGlvLWdyb3VwXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybTIuZ2VuZGFyLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtMiwgXCJnZW5kYXJcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInJ1bGVGb3JtMi5nZW5kYXJcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1yYWRpb1wiLCB7IGF0dHJzOiB7IGxhYmVsOiBcIueUt1wiLCB2YWx1ZTogXCIwXCIgfSB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLXJhZGlvXCIsIHsgYXR0cnM6IHsgbGFiZWw6IFwi5aWzXCIsIHZhbHVlOiBcIjFcIiB9IH0pXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJyZWdpc3RlcmJ0blwiLFxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJwcmltYXJ5XCIgfSxcbiAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uc3VibWl0Rm9ybShcInJ1bGVGb3JtMlwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KFwi5o+Q5LqkXCIpXVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIm1lc3NhZ2VcIiB9LCBbXG4gICAgICAgICAgICAgICAgX2MoXCJwXCIsIFtcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIuW3suaciei0puWPtz8gXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL2xvZ2luXCIgfSB9LCBbX3ZtLl92KFwi54K55Ye755m75b2VXCIpXSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIuXCIpXG4gICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKVxuICAgICAgICBdLFxuICAgICAgICAxXG4gICAgICApXG4gICAgXSxcbiAgICAxXG4gIClcbn1cbnZhciBzdGF0aWNSZW5kZXJGbnMgPSBbXG4gIGZ1bmN0aW9uKCkge1xuICAgIHZhciBfdm0gPSB0aGlzXG4gICAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gICAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gICAgcmV0dXJuIF9jKFwiaDFcIiwgW1xuICAgICAgX2MoXCJpbWdcIiwgeyBhdHRyczogeyBzcmM6IHJlcXVpcmUoXCIuLi9wdWJpYy9pbWcvbG9nby5wbmdcIiksIGFsdDogXCJcIiB9IH0pXG4gICAgXSlcbiAgfVxuXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG52YXIgZXNFeHBvcnRzID0geyByZW5kZXI6IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zOiBzdGF0aWNSZW5kZXJGbnMgfVxuZXhwb3J0IGRlZmF1bHQgZXNFeHBvcnRzXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmIChtb2R1bGUuaG90LmRhdGEpIHtcbiAgICByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpICAgICAgLnJlcmVuZGVyKFwiZGF0YS12LThmOGExZDlhXCIsIGVzRXhwb3J0cylcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3RlbXBsYXRlLWNvbXBpbGVyP3tcImlkXCI6XCJkYXRhLXYtOGY4YTFkOWFcIixcImhhc1Njb3BlZFwiOnRydWUsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3JlZ2lzdGVyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gMzhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTQ3MzIzYmYyXFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9pbmRleC52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcIjc5YTk4OGE2XCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi00NzMyM2JmMlxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vaW5kZXgudnVlXCIsIGZ1bmN0aW9uKCkge1xuICAgICB2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTQ3MzIzYmYyXFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9pbmRleC52dWVcIik7XG4gICAgIGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuICAgICB1cGRhdGUobmV3Q29udGVudCk7XG4gICB9KTtcbiB9XG4gLy8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIhLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtNDczMjNiZjJcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9pbmRleC52dWVcbi8vIG1vZHVsZSBpZCA9IDM5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W10sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIlwiLFwiZmlsZVwiOlwiaW5kZXgudnVlXCIsXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtNDczMjNiZjJcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9pbmRleC52dWVcbi8vIG1vZHVsZSBpZCA9IDQwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0yMjcxNzlhZVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vbGlzdC52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcIjRiYWYzZDMyXCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi0yMjcxNzlhZVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vbGlzdC52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMjI3MTc5YWVcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2xpc3QudnVlXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LTIyNzE3OWFlXCIsXCJzY29wZWRcIjpmYWxzZSxcImhhc0lubGluZUNvbmZpZ1wiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvbGlzdC52dWVcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG4ubGlzdHtcXG59XFxuLmxpc3QgLml0ZW0uc3RhcntcXG59XFxuLmxpc3QgLml0ZW0uc3RhciBzcGFue1xcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcbn1cXG4ubGlzdCBhe1xcblxcdFxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cXHRcXHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuXFx0XFx0Y29sb3I6ICM4MDgwODA7XFxufVxcbi5saXN0IGE6aG92ZXJ7XFxuXFx0XFx0Y29sb3I6ICMwMDc0RDk7XFxufVxcbi5saXN0IC50ZXh0IHtcXG5cXHRmb250LXNpemU6IDE0cHg7XFxufVxcbi5saXN0IC5yZWxlYXNlIHtcXG5cXHRmbG9hdDogcmlnaHQ7XFxuXFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMHB4KTtcXG59XFxuLmxpc3QgZGl2LmVsLWNhcmRfX2hlYWRlcntcXG5cXHRwYWRkaW5nOiAxNXB4O1xcblxcdHBhZGRpbmctbGVmdDogMjBweDtcXG59XFxuLmxpc3QgZGl2LmVsLWNhcmRfX2JvZHl7XFxuXFx0cGFkZGluZzogNXB4O1xcblxcdHBhZGRpbmctbGVmdDogMjBweDtcXG59XFxuLmxpc3QgLmNsZWFyZml4e1xcblxcdGhlaWdodDogMjBweDtcXG59XFxuLmNsZWFyZml4OmJlZm9yZSxcXG4uY2xlYXJmaXg6YWZ0ZXIge1xcblxcdGRpc3BsYXk6IHRhYmxlO1xcblxcdGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG4uY2xlYXJmaXg6YWZ0ZXIge1xcblxcdGNsZWFyOiBib3RoXFxufVxcbi5ib3gtY2FyZCB7XFxuXFx0d2lkdGg6IDEwMCU7XFxufVxcbi5saXN0IC5jb250ZW50e1xcblxcdHRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7XFxuXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cXHR3aGl0ZS1zcGFjZTpub3dyYXA7XFxuXFx0cGFkZGluZy1yaWdodDogMzAwcHg7XFxufVxcbi5saXN0IHAucHN7XFxuXFx0bWFyZ2luOiAxMHB4O1xcblxcdGZvbnQtc2l6ZTogMTJweDtcXG5cXHR0ZXh0LWFsaWduOiByaWdodDtcXG59XFxuLmxpc3QgLnBhZ2luZ3tcXG5cXHRtYXJnaW46IDMwcHg7XFxuXFx0ZmxvYXQ6IHJpZ2h0O1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiRTovQ01TL2Ntcy1zcGEvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvbGlzdC52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjtBQTZKQTtDQUVBO0FBQ0E7Q0FFQTtBQUNBO0VBQ0EsZUFBQTtDQUNBO0FBQ0E7RUFDQSxzQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZUFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0NBQ0E7QUFDQTtDQUNBLGdCQUFBO0NBQ0E7QUFFQTtDQUNBLGFBQUE7Q0FDQSw2QkFBQTtDQUNBO0FBQ0E7Q0FDQSxjQUFBO0NBQ0EsbUJBQUE7Q0FDQTtBQUNBO0NBQ0EsYUFBQTtDQUNBLG1CQUFBO0NBQ0E7QUFDQTtDQUNBLGFBQUE7Q0FDQTtBQUNBOztDQUVBLGVBQUE7Q0FDQSxZQUFBO0NBQ0E7QUFDQTtDQUNBLFdBQUE7Q0FDQTtBQUVBO0NBQ0EsWUFBQTtDQUNBO0FBQ0E7Q0FDQSx1QkFBQTtDQUNBLGlCQUFBO0NBQ0EsbUJBQUE7Q0FDQSxxQkFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsZ0JBQUE7Q0FDQSxrQkFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsYUFBQTtDQUNBXCIsXCJmaWxlXCI6XCJsaXN0LnZ1ZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI8dGVtcGxhdGU+XFxuXFx0PGVsLW1haW4gY2xhc3M9XFxcImxpc3RcXFwiPlxcclxcblxcdFxcdDxlbC1jYXJkIGNsYXNzPVxcXCJib3gtY2FyZFxcXCIgPlxcclxcblxcdFxcdFxcdDxkaXYgc2xvdD1cXFwiaGVhZGVyXFxcIiBjbGFzcz1cXFwiY2xlYXJmaXhcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1kcm9wZG93biBAY29tbWFuZD1cXFwiaGFuZGxlQ29tbWFuZFxcXCIgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJlbC1kcm9wZG93bi1saW5rXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR7e3RvcGljY2xhc3N9fTxpIGNsYXNzPVxcXCJlbC1pY29uLWFycm93LWRvd24gZWwtaWNvbi0tcmlnaHRcXFwiPjwvaT5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L3NwYW4+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGVsLWRyb3Bkb3duLW1lbnUgc2xvdD1cXFwiZHJvcGRvd25cXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1kcm9wZG93bi1pdGVtIGNvbW1hbmQ9XFxcIlxcXCI+5YWo6YOoPC9lbC1kcm9wZG93bi1pdGVtPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1kcm9wZG93bi1pdGVtIGNvbW1hbmQ9XFxcInRlY2hub2xvZ3lcXFwiPuaKgOacrzwvZWwtZHJvcGRvd24taXRlbT5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZWwtZHJvcGRvd24taXRlbSBjb21tYW5kPVxcXCJsaXRlcmF0dXJlXFxcIj7mloflraY8L2VsLWRyb3Bkb3duLWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PGVsLWRyb3Bkb3duLWl0ZW0gY29tbWFuZD1cXFwiU3BvcnRzXFxcIj7kvZPogrI8L2VsLWRyb3Bkb3duLWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PGVsLWRyb3Bkb3duLWl0ZW0gY29tbWFuZD1cXFwibWV0YXBoeXNpY3NcXFwiPueOhOWtpjwvZWwtZHJvcGRvd24taXRlbT5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZWwtZHJvcGRvd24taXRlbSBjb21tYW5kPVxcXCJlbnRlcnRhaW5tZW50XFxcIj7lqLHkuZA8L2VsLWRyb3Bkb3duLWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9lbC1kcm9wZG93bi1tZW51PlxcclxcblxcdFxcdFxcdFxcdDwvZWwtZHJvcGRvd24+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiBcXHJcXG5cXHRcXHRcXHRcXHRcXHRjbGFzcz1cXFwicmVsZWFzZVxcXCIgXFxyXFxuXFx0XFx0XFx0XFx0XFx0dHlwZT1cXFwicHJpbWFyeVxcXCIgXFxyXFxuXFx0XFx0XFx0XFx0XFx0QGNsaWNrID0gXFxcImdvcmVsZWFzZVxcXCJcXHJcXG5cXHRcXHRcXHRcXHRcXHRpY29uPVxcXCJlbC1pY29uLWVkaXRcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdOWPkeW4g1xcclxcblxcdFxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcInRleHQgaXRlbVxcXCIgdi1mb3I9XFxcIih0b3BpYyxpbmRleCkgaW4gdG9waWNzXFxcIiA6a2V5PVxcXCJpbmRleFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGRpdiB2LXNob3c9XFxcInRvcGljc1swXVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGgzPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxhIDpocmVmPVxcXCJgIy9kZXRhaWxzLyR7dG9waWMuX2lkfWBcXFwiPnt7dG9waWMudGl0bGV9fTwvYT4gXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiBcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRzaXplPVxcXCJtaW5pXFxcIlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHN0eWxlPVxcXCJjb2xvcjogIzg4ODtcXFwiXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0ZGlzYWJsZWQ+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0e3sgdG9waWMudG9waWN0eXBlIH19XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PGVsLWJhZGdlIDp2YWx1ZT1cXFwidG9waWMuc3RhcnMubGVuZ3RoXFxcIiA6bWF4PVxcXCI5OVxcXCIgY2xhc3M9XFxcIml0ZW0gc3RhclxcXCIgdHlwZT1cXFwid2FybmluZ1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiBzaXplPVxcXCJtaW5pXFxcIj48c3BhbiBjbGFzcz1cXFwiZWwtaWNvbi1zdGFyLW9uXFxcIj48L3NwYW4+PC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9lbC1iYWRnZT5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2gzPlxcclxcblxcdFxcdFxcdFxcdFxcdDxwIGNsYXNzPVxcXCJjb250ZW50XFxcIj57eyB0b3BpYy5jb250ZW50IH19PC9wPlxcclxcblxcdFxcdFxcdFxcdFxcdDxwIGNsYXNzPVxcXCJwc1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0IOWPkeW4g+aXtumXtCA6IHt7IHRvcGljLmNyZWF0ZV90aW1lIH19XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9wPlxcclxcblxcdFxcdFxcdFxcdFxcdDxoci8+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0PC9lbC1jYXJkPlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcImJsb2NrXFxcIj5cXHJcXG4gICAgPGVsLXBhZ2luYXRpb25cXHJcXG5cXHRcXHRcXHR2LXNob3c9XFxcInRvcGljc1swXVxcXCJcXHJcXG5cXHRcXHRcXHRjbGFzcz1cXFwicGFnaW5nXFxcIlxcclxcbiAgICAgIEBzaXplLWNoYW5nZT1cXFwiaGFuZGxlU2l6ZUNoYW5nZVxcXCJcXHJcXG4gICAgICBAY3VycmVudC1jaGFuZ2U9XFxcImhhbmRsZUN1cnJlbnRDaGFuZ2VcXFwiXFxyXFxuICAgICAgOmN1cnJlbnQtcGFnZT1cXFwiY3VycmVudFBhZ2VcXFwiXFxyXFxuICAgICAgOnBhZ2Utc2l6ZXM9XFxcIls1LCAxMCwgMjAsIDMwXVxcXCJcXHJcXG4gICAgICA6cGFnZS1zaXplPVxcXCJwYWdlc2l6ZVxcXCJcXHJcXG4gICAgICBsYXlvdXQ9XFxcInRvdGFsLCBzaXplcywgcHJldiwgcGFnZXIsIG5leHQsIGp1bXBlclxcXCJcXHJcXG4gICAgICA6dG90YWw9XFxcImFsbGxlbmd0aFxcXCI+XFxyXFxuICAgIDwvZWwtcGFnaW5hdGlvbj5cXHJcXG5cXHRcXHQ8aDMgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtcXFwiIHYtc2hvdz1cXFwiIXRvcGljc1swXVxcXCI+6L+Y5rKh5pyJ55u45YWz6K+d6aKYLi4uLlxcclxcblxcdFxcdFxcdDxhIGhyZWY9XFxcIlxcXCIgQGNsaWNrLnByZXZlbnQ9XFxcImdvcmVsZWFzZVxcXCI+5Y675Y+R5biDPzwvYT5cXHJcXG5cXHRcXHQ8L2gzPlxcclxcbiAgPC9kaXY+XFxyXFxuXFx0PC9lbC1tYWluPlxcbjwvdGVtcGxhdGU+XFxuXFxuPHNjcmlwdD5cXG5cXHRleHBvcnQgZGVmYXVsdCB7XFxuXFx0XFx0ZGF0YSgpIHtcXG5cXHRcXHRcXHRyZXR1cm4ge1xcblxcdFxcdFxcdFxcdHRvcGljcyA6IFtdLFxcclxcbiAgICAgICAgY3VycmVudFBhZ2UgOiAxLFxcclxcblxcdFxcdFxcdFxcdHBhZ2VzaXplIDogNSxcXHJcXG5cXHRcXHRcXHRcXHRhbGxsZW5ndGggOiAxLFxcclxcblxcdFxcdFxcdFxcdHRvcGljdHlwZSA6ICcnLFxcclxcblxcdFxcdFxcdFxcdHVzZXIgOiBudWxsXFxuXFx0XFx0XFx0fTtcXG5cXHRcXHR9LFxcclxcblxcdFxcdG1ldGhvZHM6e1xcclxcblxcdFxcdFxcdGhhbmRsZVNpemVDaGFuZ2UodmFsKSB7XFxyXFxuLy8gICAgICAgICBjb25zb2xlLmxvZyhg5q+P6aG1ICR7dmFsfSDmnaFgKTtcXHJcXG4vLyBcXHRcXHRcXHRcXHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRQYWdlKVxcclxcblxcdFxcdFxcdFxcdHRoaXMucGFnZXNpemUgPSB2YWxcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLmdldGxpc3QoYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3M/XFxyXFxuXFx0XFx0XFx0XFx0cGFnZT0keyB0aGlzLmN1cnJlbnRQYWdlIH0mc2l6ZT0ke3RoaXMucGFnZXNpemV9JnRvcGljdHlwZT0ke3RoaXMudG9waWN0eXBlfWApXFxyXFxuICAgICAgfSxcXHJcXG4gICAgICBoYW5kbGVDdXJyZW50Q2hhbmdlKHZhbCkge1xcclxcbi8vICAgICAgICAgY29uc29sZS5sb2coYOW9k+WJjemhtTogJHt2YWx9YCk7XFxyXFxuLy8gXFx0XFx0XFx0XFx0Y29uc29sZS5sb2codGhpcy5wYWdlc2l6ZSlcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLmN1cnJlbnRQYWdlID0gdmFsXFxyXFxuXFx0XFx0XFx0XFx0dGhpcy5nZXRsaXN0KGBodHRwOi8vMTI3LjAuMC4xOjMwMDAvdG9waWNzP1xcclxcblxcdFxcdFxcdFxcdHBhZ2U9JHsgdmFsIH0mc2l6ZT0ke3RoaXMucGFnZXNpemV9JnRvcGljdHlwZT0ke3RoaXMudG9waWN0eXBlfWApXFxyXFxuICAgICAgfSxcXHJcXG5cXHRcXHRcXHRhc3luYyBnZXRsaXN0KHVybCl7XFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGE6cmVzZGF0YX0gPSBhd2FpdCBheGlvcy5nZXQodXJsKSxcXHJcXG5cXHRcXHRcXHRcXHR0b3BpY2RhdGEgPSByZXNkYXRhLmRhdGFcXHJcXG5cXHRcXHRcXHRcXHR0b3BpY2RhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xcclxcblxcdFxcdFxcdFxcdFxcdHN3aXRjaChpdGVtLnRvcGljdHlwZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAndGVjaG5vbG9neScgOiBpdGVtLnRvcGljdHlwZSA9ICfmioDmnK8nXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnbGl0ZXJhdHVyZScgOiBpdGVtLnRvcGljdHlwZSA9ICfmloflraYnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnU3BvcnRzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+S9k+iCsidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjYXNlICdlbnRlcnRhaW5tZW50JyA6IGl0ZW0udG9waWN0eXBlID0gJ+WoseS5kCdcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjYXNlICdtZXRhcGh5c2ljcycgOiBpdGVtLnRvcGljdHlwZSA9ICfnjoTlraYnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0ZGVmYXVsdCA6IGl0ZW0udG9waWN0eXBlID0gJ+acquefpSdcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLnRvcGljcyA9IHRvcGljZGF0YVxcclxcblxcdFxcdFxcdFxcdHRoaXMuYWxsbGVuZ3RoID0gcmVzZGF0YS5hbGxsZW5ndGhcXHJcXG5cXHRcXHRcXHR9LFxcclxcblxcdFxcdFxcdGhhbmRsZUNvbW1hbmQoY29tbWFuZCkge1xcclxcbiAgICAgICAgdGhpcy50b3BpY3R5cGUgPSBjb21tYW5kXFxyXFxuXFx0XFx0XFx0XFx0dGhpcy5jdXJyZW50UGFnZSA9IDFcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLmdldGxpc3QoYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3M/XFxyXFxuXFx0XFx0XFx0XFx0cGFnZT0keyB0aGlzLmN1cnJlbnRQYWdlIH0mc2l6ZT0ke3RoaXMucGFnZXNpemV9JnRvcGljdHlwZT0ke3RoaXMudG9waWN0eXBlfWApXFxyXFxuICAgICAgfSxcXHJcXG5cXHRcXHRcXHRhc3luYyBnb3JlbGVhc2UoKXtcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7ZGF0YX0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcXHJcXG5cXHRcXHRcXHRcXHQvLyBjb25zb2xlLmxvZyhkYXRhLnN0YXRlKVxcclxcblxcdFxcdFxcdFxcdGlmKCFkYXRhLnN0YXRlKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0bWVzc2FnZTogJ+ivt+WFiOeZu+W9lScsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dHlwZTogJ3dhcm5pbmcnXFxyXFxuXFx0XFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy51c2VyID0gZGF0YS5zdGF0ZVxcclxcblxcdFxcdFxcdFxcdHRoaXMuJHJvdXRlci5wdXNoKCcvcmVsZWFzZScpXFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcdH0sXFxyXFxuXFx0XFx0YXN5bmMgY3JlYXRlZCgpe1xcclxcblxcdFxcdFxcdHRoaXMuZ2V0bGlzdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcycpXFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRjb21wdXRlZDp7XFxyXFxuXFx0XFx0XFx0dG9waWNjbGFzcygpe1xcclxcblxcdFxcdFxcdFxcdHN3aXRjaCh0aGlzLnRvcGljdHlwZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FzZSAndGVjaG5vbG9neScgOiByZXR1cm4gJ+aKgOacrydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYXNlICdsaXRlcmF0dXJlJyA6IHJldHVybiAgJ+aWh+WtpidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYXNlICdTcG9ydHMnIDogcmV0dXJuICAn5L2T6IKyJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdGNhc2UgJ2VudGVydGFpbm1lbnQnIDogcmV0dXJuICAn5aix5LmQJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdGNhc2UgJ21ldGFwaHlzaWNzJyA6IHJldHVybiAgJ+eOhOWtpidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRkZWZhdWx0IDogcmV0dXJuICAn5YWo6YOoJ1xcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fVxcblxcdH1cXG48L3NjcmlwdD5cXG5cXG48c3R5bGU+XFxyXFxuXFx0Lmxpc3R7XFxyXFxuXFx0XFx0XFxyXFxuXFx0fVxcclxcblxcdC5saXN0IC5pdGVtLnN0YXJ7XFxyXFxuXFx0XFx0XFxyXFxuXFx0fVxcclxcblxcdC5saXN0IC5pdGVtLnN0YXIgc3BhbntcXHJcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXHJcXG5cXHR9XFxyXFxuXFx0Lmxpc3QgYXtcXHJcXG5cXHRcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuXFx0XFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcblxcdFxcdGNvbG9yOiAjODA4MDgwO1xcclxcblxcdH1cXHJcXG5cXHQubGlzdCBhOmhvdmVye1xcclxcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcclxcblxcdH1cXG5cXHQubGlzdCAudGV4dCB7XFxyXFxuXFx0Zm9udC1zaXplOiAxNHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ubGlzdCAucmVsZWFzZSB7XFxyXFxuXFx0ZmxvYXQ6IHJpZ2h0O1xcclxcblxcdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTBweCk7XFxyXFxufVxcclxcbi5saXN0IGRpdi5lbC1jYXJkX19oZWFkZXJ7XFxyXFxuXFx0cGFkZGluZzogMTVweDtcXHJcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxufVxcclxcbi5saXN0IGRpdi5lbC1jYXJkX19ib2R5e1xcclxcblxcdHBhZGRpbmc6IDVweDtcXHJcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxufVxcclxcbi5saXN0IC5jbGVhcmZpeHtcXHJcXG5cXHRoZWlnaHQ6IDIwcHg7XFxyXFxufVxcclxcbi5jbGVhcmZpeDpiZWZvcmUsXFxyXFxuLmNsZWFyZml4OmFmdGVyIHtcXHJcXG5cXHRkaXNwbGF5OiB0YWJsZTtcXHJcXG5cXHRjb250ZW50OiBcXFwiXFxcIjtcXHJcXG59XFxyXFxuLmNsZWFyZml4OmFmdGVyIHtcXHJcXG5cXHRjbGVhcjogYm90aFxcclxcbn1cXHJcXG5cXHJcXG4uYm94LWNhcmQge1xcclxcblxcdHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG4ubGlzdCAuY29udGVudHtcXHJcXG5cXHR0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO1xcclxcblxcdG92ZXJmbG93OiBoaWRkZW47XFxyXFxuXFx0d2hpdGUtc3BhY2U6bm93cmFwO1xcclxcblxcdHBhZGRpbmctcmlnaHQ6IDMwMHB4O1xcclxcbn1cXHJcXG4ubGlzdCBwLnBze1xcclxcblxcdG1hcmdpbjogMTBweDtcXHJcXG5cXHRmb250LXNpemU6IDEycHg7XFxyXFxuXFx0dGV4dC1hbGlnbjogcmlnaHQ7XFxyXFxufVxcclxcbi5saXN0IC5wYWdpbmd7XFxyXFxuXFx0bWFyZ2luOiAzMHB4O1xcclxcblxcdGZsb2F0OiByaWdodDtcXHJcXG59XFxuPC9zdHlsZT5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtMjI3MTc5YWVcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9saXN0LnZ1ZVxuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3ZtID0gdGhpc1xuICB2YXIgX2ggPSBfdm0uJGNyZWF0ZUVsZW1lbnRcbiAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gIHJldHVybiBfYyhcbiAgICBcImVsLW1haW5cIixcbiAgICB7IHN0YXRpY0NsYXNzOiBcImxpc3RcIiB9LFxuICAgIFtcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWNhcmRcIixcbiAgICAgICAgeyBzdGF0aWNDbGFzczogXCJib3gtY2FyZFwiIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiBcImNsZWFyZml4XCIsXG4gICAgICAgICAgICAgIGF0dHJzOiB7IHNsb3Q6IFwiaGVhZGVyXCIgfSxcbiAgICAgICAgICAgICAgc2xvdDogXCJoZWFkZXJcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1kcm9wZG93blwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIHN0YXRpY1N0eWxlOiB7IFwidGV4dC1hbGlnblwiOiBcImNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICBvbjogeyBjb21tYW5kOiBfdm0uaGFuZGxlQ29tbWFuZCB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJlbC1kcm9wZG93bi1saW5rXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcIiArIF92bS5fcyhfdm0udG9waWNjbGFzcykpLFxuICAgICAgICAgICAgICAgICAgICBfYyhcImlcIiwge1xuICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiBcImVsLWljb24tYXJyb3ctZG93biBlbC1pY29uLS1yaWdodFwiXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJlbC1kcm9wZG93bi1tZW51XCIsXG4gICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgc2xvdDogXCJkcm9wZG93blwiIH0sIHNsb3Q6IFwiZHJvcGRvd25cIiB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJlbC1kcm9wZG93bi1pdGVtXCIsIHsgYXR0cnM6IHsgY29tbWFuZDogXCJcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIuWFqOmDqFwiKVxuICAgICAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVsLWRyb3Bkb3duLWl0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgY29tbWFuZDogXCJ0ZWNobm9sb2d5XCIgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihcIuaKgOacr1wiKV1cbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVsLWRyb3Bkb3duLWl0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgY29tbWFuZDogXCJsaXRlcmF0dXJlXCIgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihcIuaWh+WtplwiKV1cbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJlbC1kcm9wZG93bi1pdGVtXCIsIHsgYXR0cnM6IHsgY29tbWFuZDogXCJTcG9ydHNcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIuS9k+iCslwiKVxuICAgICAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVsLWRyb3Bkb3duLWl0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgY29tbWFuZDogXCJtZXRhcGh5c2ljc1wiIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtfdm0uX3YoXCLnjoTlraZcIildXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlbC1kcm9wZG93bi1pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGF0dHJzOiB7IGNvbW1hbmQ6IFwiZW50ZXJ0YWlubWVudFwiIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtfdm0uX3YoXCLlqLHkuZBcIildXG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6IFwicmVsZWFzZVwiLFxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJwcmltYXJ5XCIsIGljb246IFwiZWwtaWNvbi1lZGl0XCIgfSxcbiAgICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiBfdm0uZ29yZWxlYXNlIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtfdm0uX3YoXCJcXG5cXHRcXHRcXHRcXHRcXHTlj5HluINcXG5cXHRcXHRcXHRcXHRcIildXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF92bS5fbChfdm0udG9waWNzLCBmdW5jdGlvbih0b3BpYywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfYyhcImRpdlwiLCB7IGtleTogaW5kZXgsIHN0YXRpY0NsYXNzOiBcInRleHQgaXRlbVwiIH0sIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNob3dcIixcbiAgICAgICAgICAgICAgICAgICAgICByYXdOYW1lOiBcInYtc2hvd1wiLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0udG9waWNzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwidG9waWNzWzBdXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgIFwiaDNcIixcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFwiYVwiLCB7IGF0dHJzOiB7IGhyZWY6IFwiIy9kZXRhaWxzL1wiICsgdG9waWMuX2lkIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyh0b3BpYy50aXRsZSkpXG4gICAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY1N0eWxlOiB7IGNvbG9yOiBcIiM4ODhcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBzaXplOiBcIm1pbmlcIiwgZGlzYWJsZWQ6IFwiXCIgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl9zKHRvcGljLnRvcGljdHlwZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlbC1iYWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJpdGVtIHN0YXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdG9waWMuc3RhcnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heDogOTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJlbC1idXR0b25cIiwgeyBhdHRyczogeyBzaXplOiBcIm1pbmlcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJlbC1pY29uLXN0YXItb25cIiB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJwXCIsIHsgc3RhdGljQ2xhc3M6IFwiY29udGVudFwiIH0sIFtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyh0b3BpYy5jb250ZW50KSlcbiAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwicFwiLCB7IHN0YXRpY0NsYXNzOiBcInBzXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXG4gICAgICAgICAgICAgICAgICAgICAgXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHQg5Y+R5biD5pe26Ze0IDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl9zKHRvcGljLmNyZWF0ZV90aW1lKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlxcblxcdFxcdFxcdFxcdFxcdFwiXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwiaHJcIilcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgfSlcbiAgICAgICAgXSxcbiAgICAgICAgMlxuICAgICAgKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcbiAgICAgICAgXCJkaXZcIixcbiAgICAgICAgeyBzdGF0aWNDbGFzczogXCJibG9ja1wiIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcImVsLXBhZ2luYXRpb25cIiwge1xuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogXCJzaG93XCIsXG4gICAgICAgICAgICAgICAgcmF3TmFtZTogXCJ2LXNob3dcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnRvcGljc1swXSxcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInRvcGljc1swXVwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBzdGF0aWNDbGFzczogXCJwYWdpbmdcIixcbiAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgIFwiY3VycmVudC1wYWdlXCI6IF92bS5jdXJyZW50UGFnZSxcbiAgICAgICAgICAgICAgXCJwYWdlLXNpemVzXCI6IFs1LCAxMCwgMjAsIDMwXSxcbiAgICAgICAgICAgICAgXCJwYWdlLXNpemVcIjogX3ZtLnBhZ2VzaXplLFxuICAgICAgICAgICAgICBsYXlvdXQ6IFwidG90YWwsIHNpemVzLCBwcmV2LCBwYWdlciwgbmV4dCwganVtcGVyXCIsXG4gICAgICAgICAgICAgIHRvdGFsOiBfdm0uYWxsbGVuZ3RoXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgXCJzaXplLWNoYW5nZVwiOiBfdm0uaGFuZGxlU2l6ZUNoYW5nZSxcbiAgICAgICAgICAgICAgXCJjdXJyZW50LWNoYW5nZVwiOiBfdm0uaGFuZGxlQ3VycmVudENoYW5nZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImgzXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBcInNob3dcIixcbiAgICAgICAgICAgICAgICAgIHJhd05hbWU6IFwidi1zaG93XCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogIV92bS50b3BpY3NbMF0sXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcIiF0b3BpY3NbMF1cIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgc3RhdGljU3R5bGU6IHsgXCJ0ZXh0LWFsaWduXCI6IFwiY2VudGVyXCIgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX3ZtLl92KFwi6L+Y5rKh5pyJ55u45YWz6K+d6aKYLi4uLlxcblxcdFxcdFxcdFwiKSxcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgaHJlZjogXCJcIiB9LFxuICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF92bS5nb3JlbGVhc2UoJGV2ZW50KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KFwi5Y675Y+R5biDP1wiKV1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIClcbiAgICAgICAgXSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgIF0sXG4gICAgMVxuICApXG59XG52YXIgc3RhdGljUmVuZGVyRm5zID0gW11cbnJlbmRlci5fd2l0aFN0cmlwcGVkID0gdHJ1ZVxudmFyIGVzRXhwb3J0cyA9IHsgcmVuZGVyOiByZW5kZXIsIHN0YXRpY1JlbmRlckZuczogc3RhdGljUmVuZGVyRm5zIH1cbmV4cG9ydCBkZWZhdWx0IGVzRXhwb3J0c1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAobW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKSAgICAgIC5yZXJlbmRlcihcImRhdGEtdi0yMjcxNzlhZVwiLCBlc0V4cG9ydHMpXG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlcj97XCJpZFwiOlwiZGF0YS12LTIyNzE3OWFlXCIsXCJoYXNTY29wZWRcIjpmYWxzZSxcImJ1YmxlXCI6e1widHJhbnNmb3Jtc1wiOnt9fX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvbGlzdC52dWVcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBkaXNwb3NlZCA9IGZhbHNlXG5mdW5jdGlvbiBpbmplY3RTdHlsZSAoc3NyQ29udGV4dCkge1xuICBpZiAoZGlzcG9zZWQpIHJldHVyblxuICByZXF1aXJlKFwiISF2dWUtc3R5bGUtbG9hZGVyIWNzcy1sb2FkZXI/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleD97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtZTk2MWI3MDJcXFwiLFxcXCJzY29wZWRcXFwiOnRydWUsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXN0eWxlcyZpbmRleD0wIS4vaW5kZXhoZWFkZXIudnVlXCIpXG59XG52YXIgbm9ybWFsaXplQ29tcG9uZW50ID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvY29tcG9uZW50LW5vcm1hbGl6ZXJcIilcbi8qIHNjcmlwdCAqL1xuZXhwb3J0ICogZnJvbSBcIiEhYmFiZWwtbG9hZGVyIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXNjcmlwdCZpbmRleD0wIS4vaW5kZXhoZWFkZXIudnVlXCJcbmltcG9ydCBfX3Z1ZV9zY3JpcHRfXyBmcm9tIFwiISFiYWJlbC1sb2FkZXIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yP3R5cGU9c2NyaXB0JmluZGV4PTAhLi9pbmRleGhlYWRlci52dWVcIlxuLyogdGVtcGxhdGUgKi9cbmltcG9ydCBfX3Z1ZV90ZW1wbGF0ZV9fIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlci9pbmRleD97XFxcImlkXFxcIjpcXFwiZGF0YS12LWU5NjFiNzAyXFxcIixcXFwiaGFzU2NvcGVkXFxcIjp0cnVlLFxcXCJidWJsZVxcXCI6e1xcXCJ0cmFuc2Zvcm1zXFxcIjp7fX19IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvcj90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9pbmRleGhlYWRlci52dWVcIlxuLyogdGVtcGxhdGUgZnVuY3Rpb25hbCAqL1xudmFyIF9fdnVlX3RlbXBsYXRlX2Z1bmN0aW9uYWxfXyA9IGZhbHNlXG4vKiBzdHlsZXMgKi9cbnZhciBfX3Z1ZV9zdHlsZXNfXyA9IGluamVjdFN0eWxlXG4vKiBzY29wZUlkICovXG52YXIgX192dWVfc2NvcGVJZF9fID0gXCJkYXRhLXYtZTk2MWI3MDJcIlxuLyogbW9kdWxlSWRlbnRpZmllciAoc2VydmVyIG9ubHkpICovXG52YXIgX192dWVfbW9kdWxlX2lkZW50aWZpZXJfXyA9IG51bGxcbnZhciBDb21wb25lbnQgPSBub3JtYWxpemVDb21wb25lbnQoXG4gIF9fdnVlX3NjcmlwdF9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9fLFxuICBfX3Z1ZV90ZW1wbGF0ZV9mdW5jdGlvbmFsX18sXG4gIF9fdnVlX3N0eWxlc19fLFxuICBfX3Z1ZV9zY29wZUlkX18sXG4gIF9fdnVlX21vZHVsZV9pZGVudGlmaWVyX19cbilcbkNvbXBvbmVudC5vcHRpb25zLl9fZmlsZSA9IFwic3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlXCJcblxuLyogaG90IHJlbG9hZCAqL1xuaWYgKG1vZHVsZS5ob3QpIHsoZnVuY3Rpb24gKCkge1xuICB2YXIgaG90QVBJID0gcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKVxuICBob3RBUEkuaW5zdGFsbChyZXF1aXJlKFwidnVlXCIpLCBmYWxzZSlcbiAgaWYgKCFob3RBUEkuY29tcGF0aWJsZSkgcmV0dXJuXG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKCFtb2R1bGUuaG90LmRhdGEpIHtcbiAgICBob3RBUEkuY3JlYXRlUmVjb3JkKFwiZGF0YS12LWU5NjFiNzAyXCIsIENvbXBvbmVudC5vcHRpb25zKVxuICB9IGVsc2Uge1xuICAgIGhvdEFQSS5yZWxvYWQoXCJkYXRhLXYtZTk2MWI3MDJcIiwgQ29tcG9uZW50Lm9wdGlvbnMpXG4gIH1cbiAgbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZGlzcG9zZWQgPSB0cnVlXG4gIH0pXG59KSgpfVxuXG5leHBvcnQgZGVmYXVsdCBDb21wb25lbnQuZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcG9uZW50cy9pbmRleGhlYWRlci52dWVcbi8vIG1vZHVsZSBpZCA9IDQ0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi1lOTYxYjcwMlxcXCIsXFxcInNjb3BlZFxcXCI6dHJ1ZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9pbmRleGhlYWRlci52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcImE3MzZkZmY0XCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi1lOTYxYjcwMlxcXCIsXFxcInNjb3BlZFxcXCI6dHJ1ZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9pbmRleGhlYWRlci52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtZTk2MWI3MDJcXFwiLFxcXCJzY29wZWRcXFwiOnRydWUsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vaW5kZXhoZWFkZXIudnVlXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LWU5NjFiNzAyXCIsXCJzY29wZWRcIjp0cnVlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9pbmRleGhlYWRlci52dWVcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXG5cXHQvKiAuaW5kZXhoZWFkZXJ7XFxuXFx0XFx0cG9zaXRpb246IGZpeGVkO1xcblxcdFxcdHRvcDogMDtcXG5cXHRcXHRsZWZ0OiAwO1xcblxcdFxcdHdpZHRoOiAxMDAlO1xcblxcdFxcdHotaW5kZXg6IDEwMDAwO1xcblxcdH0gKi9cXG5hW2RhdGEtdi1lOTYxYjcwMl17XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbn1cXG4udXNlcltkYXRhLXYtZTk2MWI3MDJde1xcblxcdGZsb2F0OiBsZWZ0O1xcblxcdHdpZHRoOiA1MHB4O1xcbn1cXG4udXNlciBwW2RhdGEtdi1lOTYxYjcwMl17XFxuXFx0bWFyZ2luOiAwO1xcblxcdGhlaWdodDogMjBweDtcXG5cXHRsaW5lLWhlaWdodDogMjBweDtcXG5cXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXFx0Zm9udC1zaXplOiAxMnB4O1xcbn1cXG4ucG9ydHJhaXRbZGF0YS12LWU5NjFiNzAyXXtcXG5cXHRkaXNwbGF5OiBibG9jaztcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xcblxcdHdpZHRoOiAzNXB4O1xcblxcdGhlaWdodDogMzVweDtcXG5cXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0Ym9yZGVyLXJhZGl1czogNTAlO1xcblxcdG92ZXJmbG93OiBoaWRkZW47XFxuXFx0bWFyZ2luOiAwIGF1dG87XFxufVxcbi5wb3J0cmFpdCBpbWdbZGF0YS12LWU5NjFiNzAyXXtcXG5cXHR3aWR0aDogMzVweDtcXG5cXHRoZWlnaHQ6IDM1cHg7XFxuXFx0Ym9yZGVyLXJhZGl1czogNTAlO1xcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG5cXHRsZWZ0OiAwO1xcblxcdHRvcDogMDtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkU6L0NNUy9jbXMtc3BhL3NyYy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL2luZGV4aGVhZGVyLnZ1ZVwiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FzR0E7Ozs7OztLQU1BO0FBQ0E7Q0FDQSxzQkFBQTtDQUNBO0FBQ0E7Q0FDQSxZQUFBO0NBQ0EsWUFBQTtDQUNBO0FBQ0E7Q0FDQSxVQUFBO0NBQ0EsYUFBQTtDQUNBLGtCQUFBO0NBQ0EsbUJBQUE7Q0FDQSxnQkFBQTtDQUNBO0FBQ0E7Q0FDQSxlQUFBO0NBQ0EsdUJBQUE7Q0FDQSxZQUFBO0NBQ0EsYUFBQTtDQUNBLG1CQUFBO0NBQ0EsbUJBQUE7Q0FDQSxpQkFBQTtDQUNBLGVBQUE7Q0FDQTtBQUNBO0NBQ0EsWUFBQTtDQUNBLGFBQUE7Q0FDQSxtQkFBQTtDQUNBLG1CQUFBO0NBQ0EsUUFBQTtDQUNBLE9BQUE7Q0FDQVwiLFwiZmlsZVwiOlwiaW5kZXhoZWFkZXIudnVlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjx0ZW1wbGF0ZT5cXHJcXG5cXHQ8ZGl2IGNsYXNzPVxcXCJpbmRleGhlYWRlclxcXCI+XFxyXFxuXFx0XFx0PGVsLW1lbnUgOmRlZmF1bHQtYWN0aXZlPVxcXCJhY3RpdmVJbmRleDJcXFwiXFxyXFxuXFx0XFx0XFx0Y2xhc3M9XFxcImVsLW1lbnUtZGVtb1xcXCJcXHJcXG5cXHRcXHRcXHRtb2RlPVxcXCJob3Jpem9udGFsXFxcIlxcclxcblxcdFxcdFxcdGJhY2tncm91bmQtY29sb3I9XFxcIiM1NDVjNjRcXFwiXFxyXFxuXFx0XFx0XFx0dGV4dC1jb2xvcj1cXFwiI2ZmZlxcXCJcXHJcXG5cXHRcXHRcXHRhY3RpdmUtdGV4dC1jb2xvcj1cXFwiI2ZmZDA0YlxcXCI+XFxyXFxuXFx0XFx0XFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cXFwiMVxcXCI+PGEgaHJlZj1cXFwiIy9cXFwiPumYheiniOWkp+WOhTwvYT48L2VsLW1lbnUtaXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtc3VibWVudSBpbmRleD1cXFwiMlxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHRlbXBsYXRlIHNsb3Q9XFxcInRpdGxlXFxcIj7miJHnmoTlt6XkvZzlj7A8L3RlbXBsYXRlPlxcclxcblxcdFxcdFxcdFxcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XFxcIjItMVxcXCI+6YCJ6aG5MTwvZWwtbWVudS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XFxcIjItMlxcXCI+6YCJ6aG5MjwvZWwtbWVudS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XFxcIjItM1xcXCI+6YCJ6aG5MzwvZWwtbWVudS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdDxlbC1zdWJtZW51IGluZGV4PVxcXCIyLTRcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDx0ZW1wbGF0ZSBzbG90PVxcXCJ0aXRsZVxcXCI+6YCJ6aG5NDwvdGVtcGxhdGU+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cXFwiMi00LTFcXFwiPumAiemhuTE8L2VsLW1lbnUtaXRlbT5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8ZWwtbWVudS1pdGVtIGluZGV4PVxcXCIyLTQtMlxcXCI+6YCJ6aG5MjwvZWwtbWVudS1pdGVtPlxcclxcblxcdFxcdFxcdFxcdFxcdDxlbC1tZW51LWl0ZW0gaW5kZXg9XFxcIjItNC0zXFxcIj7pgInpobkzPC9lbC1tZW51LWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0PC9lbC1zdWJtZW51PlxcclxcblxcdFxcdFxcdDwvZWwtc3VibWVudT5cXHJcXG5cXHRcXHRcXHQ8ZWwtbWVudS1pdGVtIGluZGV4PVxcXCI2XFxcIiBzdHlsZT1cXFwiYm9yZGVyLWJvdHRvbTogbm9uZTsgYmFja2dyb3VuZC1jb2xvcjogcmdiKDg0LDkyLDEwMCk7XFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJkZW1vLWlucHV0LXN1ZmZpeFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGVsLWlucHV0XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0cGxhY2Vob2xkZXI9XFxcIuivt+i+k+WFpeagh+mimFxcXCJcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRwcmVmaXgtaWNvbj1cXFwiZWwtaWNvbi1zZWFyY2hcXFwiXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0c2l6ZT1cXFwic21hbGxcXFwiXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0c3R5bGU9XFxcIndpZHRoOiAyMDBweDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xcXCJcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR2LW1vZGVsPVxcXCJrZXl3b3JkXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2VsLWlucHV0PlxcclxcblxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b25cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0eXBlPVxcXCJwcmltYXJ5XFxcIlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHNpemU9XFxcInNtYWxsXFxcIiBcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRAY2xpY2s9XFxcInF1ZXJ5dGl0bGVcXFwiXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0c3R5bGU9XFxcIlxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx05pCc57SiXFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PC9lbC1tZW51LWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLW1lbnUtaXRlbSBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O1xcXCIgaW5kZXg9XFxcIjRcXFwiIHYtaWY9XFxcIiFsb2dpblxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBzaXplPVxcXCJtaW5pXFxcIj48YSBocmVmPVxcXCIjL2xvZ2luXFxcIj7nmbvlvZU8L2E+PC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiB0eXBlPVxcXCJzdWNjZXNzXFxcIiBzaXplPVxcXCJtaW5pXFxcIj48YSBocmVmPVxcXCIjL3JlZ2lzdGVyXFxcIj7ms6jlhow8L2E+PC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0PC9lbC1tZW51LWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLXN1Ym1lbnUgaW5kZXg9XFxcIjVcXFwiIHYtaWY9XFxcImxvZ2luXFxcIiBzdHlsZT1cXFwiZmxvYXQ6IHJpZ2h0O1xcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHRlbXBsYXRlIHNsb3Q9XFxcInRpdGxlXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ1c2VyXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJwb3J0cmFpdFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0PGltZyA6c3JjPVxcXCJgaHR0cDovLzEyNy4wLjAuMTozMDAwJHt1c2VyLmF2YXRhcn1gXFxcIiBhbHQ9XFxcIlxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PC9hPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxwPiA8c3Bhbj48L3NwYW4+e3t1c2VyLnVzZXJuYW1lfX08L3A+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0XFx0PC90ZW1wbGF0ZT5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtbWVudS1pdGVtIGluZGV4PVxcXCI1LTFcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxzcGFuIGNsYXNzPVxcXCJlbC1pY29uLWluZm9cXFwiPiA8L3NwYW4+IFxcclxcblxcdFxcdFxcdFxcdFxcdDxhIDpocmVmPVxcXCJgIy91c2VyLyR7dXNlci5faWR9YFxcXCIgc3R5bGU9XFxcImNvbG9yOiB3aGl0ZTtcXFwiPiDkuKrkurrkuLvpobU8L2E+XFxyXFxuXFx0XFx0XFx0XFx0PC9lbC1tZW51LWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cXFwiNS0yXFxcIj48c3BhbiBjbGFzcz1cXFwiZWwtaWNvbi1kb2N1bWVudFxcXCI+IDwvc3Bhbj4g5oiR55qE6K+d6aKYPC9lbC1tZW51LWl0ZW0+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLW1lbnUtaXRlbSBpbmRleD1cXFwiNS0zXFxcIiBAY2xpY2s9XFxcImxvZ291dFxcXCI+PHNwYW4gY2xhc3M9XFxcImVsLWljb24tZXJyb3JcXFwiPiA8L3NwYW4+IOmAgOWHuueZu+W9lTwvZWwtbWVudS1pdGVtPlxcclxcblxcdFxcdFxcdDwvZWwtc3VibWVudT5cXHJcXG5cXHRcXHQ8L2VsLW1lbnU+XFxyXFxuXFx0PC9kaXY+XFxyXFxuPC90ZW1wbGF0ZT5cXHJcXG5cXHJcXG48c2NyaXB0PlxcclxcblxcdGltcG9ydCBheGlvcyBmcm9tICdheGlvcydcXHJcXG5cXHRheGlvcy5kZWZhdWx0cy53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXFxyXFxuXFx0ZXhwb3J0IGRlZmF1bHQge1xcclxcbiAgICBkYXRhKCkge1xcclxcbiAgICAgIHJldHVybiB7XFxyXFxuICAgICAgICBhY3RpdmVJbmRleDogJzEnLFxcclxcbiAgICAgICAgYWN0aXZlSW5kZXgyOiAnMScsXFxyXFxuXFx0XFx0XFx0XFx0bG9naW4gOiBmYWxzZSxcXHJcXG5cXHRcXHRcXHRcXHR1c2VyIDoge30sXFxyXFxuXFx0XFx0XFx0XFx0a2V5d29yZCA6ICcnXFxyXFxuICAgICAgfTtcXHJcXG4gICAgfSxcXHJcXG4gICAgbWV0aG9kczoge1xcclxcbiAgICAgIGFzeW5jIGxvZ291dCgpe1xcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtkYXRhfSA9IGF3YWl0IGF4aW9zLmRlbGV0ZSgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Nlc3Npb24nKVxcclxcblxcdFxcdFxcdFxcdGlmKCFkYXRhLnN0YXRlKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLmxvZ2luID0gZmFsc2VcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLnVzZXIgPSBkYXRhLnN0YXRlXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0cXVlcnl0aXRsZSgpe1xcclxcblxcdFxcdFxcdFxcdHRoaXMua2V5d29yZC50cmltKClcXHJcXG5cXHRcXHRcXHRcXHRpZih0aGlzLmtleXdvcmQgPT09ICcnKVxcdHJldHVybiB0aGlzLiRyb3V0ZXIucHVzaCgnLycpXFxyXFxuXFx0XFx0XFx0XFx0dGhpcy4kcm91dGVyLnB1c2goJy9saXN0Ynl0aXRsZT9rZXl3b3JkPScrdGhpcy5rZXl3b3JkKVxcclxcblxcdFxcdFxcdH1cXHJcXG4gICAgfSxcXHJcXG5cXHRcXHRhc3luYyBjcmVhdGVkKCl7XFxyXFxuXFx0XFx0XFx0Y29uc3Qge2RhdGF9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXFxyXFxuXFx0XFx0XFx0Ly8gY29uc29sZS5sb2coZGF0YS5zdGF0ZSlcXHJcXG5cXHRcXHRcXHRpZihkYXRhLnN0YXRlKXtcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLmxvZ2luID0gdHJ1ZVxcclxcblxcdFxcdFxcdFxcdHRoaXMudXNlciA9IGRhdGEuc3RhdGVcXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fVxcclxcbiAgfVxcclxcbjwvc2NyaXB0PlxcclxcblxcclxcbjxzdHlsZSBzY29wZWQ+XFxyXFxuXFx0LyogLmluZGV4aGVhZGVye1xcclxcblxcdFxcdHBvc2l0aW9uOiBmaXhlZDtcXHJcXG5cXHRcXHR0b3A6IDA7XFxyXFxuXFx0XFx0bGVmdDogMDtcXHJcXG5cXHRcXHR3aWR0aDogMTAwJTtcXHJcXG5cXHRcXHR6LWluZGV4OiAxMDAwMDtcXHJcXG5cXHR9ICovXFxyXFxuYXtcXHJcXG5cXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxufVxcclxcbi51c2Vye1xcclxcblxcdGZsb2F0OiBsZWZ0O1xcclxcblxcdHdpZHRoOiA1MHB4O1xcclxcbn1cXHJcXG4udXNlciBwe1xcclxcblxcdG1hcmdpbjogMDtcXHJcXG5cXHRoZWlnaHQ6IDIwcHg7XFxyXFxuXFx0bGluZS1oZWlnaHQ6IDIwcHg7XFxyXFxuXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcclxcblxcdGZvbnQtc2l6ZTogMTJweDtcXHJcXG59XFxyXFxuLnBvcnRyYWl0e1xcclxcblxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XFxyXFxuXFx0d2lkdGg6IDM1cHg7XFxyXFxuXFx0aGVpZ2h0OiAzNXB4O1xcclxcblxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG5cXHRib3JkZXItcmFkaXVzOiA1MCU7XFxyXFxuXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG5cXHRtYXJnaW46IDAgYXV0bztcXHJcXG59XFxyXFxuLnBvcnRyYWl0IGltZ3tcXHJcXG5cXHR3aWR0aDogMzVweDtcXHJcXG5cXHRoZWlnaHQ6IDM1cHg7XFxyXFxuXFx0Ym9yZGVyLXJhZGl1czogNTAlO1xcclxcblxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRsZWZ0OiAwO1xcclxcblxcdHRvcDogMDtcXHJcXG59XFxyXFxuPC9zdHlsZT5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtZTk2MWI3MDJcIixcInNjb3BlZFwiOnRydWUsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL2luZGV4aGVhZGVyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3ZtID0gdGhpc1xuICB2YXIgX2ggPSBfdm0uJGNyZWF0ZUVsZW1lbnRcbiAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gIHJldHVybiBfYyhcbiAgICBcImRpdlwiLFxuICAgIHsgc3RhdGljQ2xhc3M6IFwiaW5kZXhoZWFkZXJcIiB9LFxuICAgIFtcbiAgICAgIF9jKFxuICAgICAgICBcImVsLW1lbnVcIixcbiAgICAgICAge1xuICAgICAgICAgIHN0YXRpY0NsYXNzOiBcImVsLW1lbnUtZGVtb1wiLFxuICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICBcImRlZmF1bHQtYWN0aXZlXCI6IF92bS5hY3RpdmVJbmRleDIsXG4gICAgICAgICAgICBtb2RlOiBcImhvcml6b250YWxcIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiM1NDVjNjRcIixcbiAgICAgICAgICAgIFwidGV4dC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgIFwiYWN0aXZlLXRleHQtY29sb3JcIjogXCIjZmZkMDRiXCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcImVsLW1lbnUtaXRlbVwiLCB7IGF0dHJzOiB7IGluZGV4OiBcIjFcIiB9IH0sIFtcbiAgICAgICAgICAgIF9jKFwiYVwiLCB7IGF0dHJzOiB7IGhyZWY6IFwiIy9cIiB9IH0sIFtfdm0uX3YoXCLpmIXop4jlpKfljoVcIildKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImVsLXN1Ym1lbnVcIixcbiAgICAgICAgICAgIHsgYXR0cnM6IHsgaW5kZXg6IFwiMlwiIH0gfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXCJ0ZW1wbGF0ZVwiLCB7IHNsb3Q6IFwidGl0bGVcIiB9LCBbX3ZtLl92KFwi5oiR55qE5bel5L2c5Y+wXCIpXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFwiZWwtbWVudS1pdGVtXCIsIHsgYXR0cnM6IHsgaW5kZXg6IFwiMi0xXCIgfSB9LCBbXG4gICAgICAgICAgICAgICAgX3ZtLl92KFwi6YCJ6aG5MVwiKVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgX2MoXCJlbC1tZW51LWl0ZW1cIiwgeyBhdHRyczogeyBpbmRleDogXCIyLTJcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICBfdm0uX3YoXCLpgInpobkyXCIpXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcImVsLW1lbnUtaXRlbVwiLCB7IGF0dHJzOiB7IGluZGV4OiBcIjItM1wiIH0gfSwgW1xuICAgICAgICAgICAgICAgIF92bS5fdihcIumAiemhuTNcIilcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZWwtc3VibWVudVwiLFxuICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgaW5kZXg6IFwiMi00XCIgfSB9LFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIF9jKFwidGVtcGxhdGVcIiwgeyBzbG90OiBcInRpdGxlXCIgfSwgW192bS5fdihcIumAiemhuTRcIildKSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLW1lbnUtaXRlbVwiLCB7IGF0dHJzOiB7IGluZGV4OiBcIjItNC0xXCIgfSB9LCBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fdihcIumAiemhuTFcIilcbiAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwiZWwtbWVudS1pdGVtXCIsIHsgYXR0cnM6IHsgaW5kZXg6IFwiMi00LTJcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwi6YCJ6aG5MlwiKVxuICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1tZW51LWl0ZW1cIiwgeyBhdHRyczogeyBpbmRleDogXCIyLTQtM1wiIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCLpgInpobkzXCIpXG4gICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgMlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMlxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtbWVudS1pdGVtXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN0YXRpY1N0eWxlOiB7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItYm90dG9tXCI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcInJnYig4NCw5MiwxMDApXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYXR0cnM6IHsgaW5kZXg6IFwiNlwiIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJkZW1vLWlucHV0LXN1ZmZpeFwiIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRpY1N0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMjAwcHhcIixcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMXB4KVwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI6IFwi6K+36L6T5YWl5qCH6aKYXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJwcmVmaXgtaWNvblwiOiBcImVsLWljb24tc2VhcmNoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJzbWFsbFwiXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5rZXl3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5rZXl3b3JkID0gJCR2XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcImtleXdvcmRcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6IFwicHJpbWFyeVwiLCBzaXplOiBcInNtYWxsXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICBvbjogeyBjbGljazogX3ZtLnF1ZXJ5dGl0bGUgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBbX3ZtLl92KFwiXFxuXFx0XFx0XFx0XFx0XFx05pCc57SiXFxuXFx0XFx0XFx0XFx0XCIpXVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICFfdm0ubG9naW5cbiAgICAgICAgICAgID8gX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1tZW51LWl0ZW1cIixcbiAgICAgICAgICAgICAgICB7IHN0YXRpY1N0eWxlOiB7IGZsb2F0OiBcInJpZ2h0XCIgfSwgYXR0cnM6IHsgaW5kZXg6IFwiNFwiIH0gfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgeyBhdHRyczogeyB0eXBlOiBcInByaW1hcnlcIiwgc2l6ZTogXCJtaW5pXCIgfSB9LFxuICAgICAgICAgICAgICAgICAgICBbX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL2xvZ2luXCIgfSB9LCBbX3ZtLl92KFwi55m75b2VXCIpXSldXG4gICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICBcImVsLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgICAgICB7IGF0dHJzOiB7IHR5cGU6IFwic3VjY2Vzc1wiLCBzaXplOiBcIm1pbmlcIiB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICBfYyhcImFcIiwgeyBhdHRyczogeyBocmVmOiBcIiMvcmVnaXN0ZXJcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIuazqOWGjFwiKVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBfdm0uX2UoKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF92bS5sb2dpblxuICAgICAgICAgICAgPyBfYyhcbiAgICAgICAgICAgICAgICBcImVsLXN1Ym1lbnVcIixcbiAgICAgICAgICAgICAgICB7IHN0YXRpY1N0eWxlOiB7IGZsb2F0OiBcInJpZ2h0XCIgfSwgYXR0cnM6IHsgaW5kZXg6IFwiNVwiIH0gfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBfYyhcInRlbXBsYXRlXCIsIHsgc2xvdDogXCJ0aXRsZVwiIH0sIFtcbiAgICAgICAgICAgICAgICAgICAgX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJ1c2VyXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHN0YXRpY0NsYXNzOiBcInBvcnRyYWl0XCIsIGF0dHJzOiB7IGhyZWY6IFwiXCIgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICBfYyhcImltZ1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogXCJodHRwOi8vMTI3LjAuMC4xOjMwMDBcIiArIF92bS51c2VyLmF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsdDogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJwXCIsIFtfYyhcInNwYW5cIiksIF92bS5fdihfdm0uX3MoX3ZtLnVzZXIudXNlcm5hbWUpKV0pXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLW1lbnUtaXRlbVwiLCB7IGF0dHJzOiB7IGluZGV4OiBcIjUtMVwiIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJlbC1pY29uLWluZm9cIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGljU3R5bGU6IHsgY29sb3I6IFwid2hpdGVcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgaHJlZjogXCIjL3VzZXIvXCIgKyBfdm0udXNlci5faWQgfVxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgW192bS5fdihcIiDkuKrkurrkuLvpobVcIildXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwiZWwtbWVudS1pdGVtXCIsIHsgYXR0cnM6IHsgaW5kZXg6IFwiNS0yXCIgfSB9LCBbXG4gICAgICAgICAgICAgICAgICAgIF9jKFwic3BhblwiLCB7IHN0YXRpY0NsYXNzOiBcImVsLWljb24tZG9jdW1lbnRcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIOaIkeeahOivnemimFwiKVxuICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgIFwiZWwtbWVudS1pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgaW5kZXg6IFwiNS0zXCIgfSwgb246IHsgY2xpY2s6IF92bS5sb2dvdXQgfSB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIHsgc3RhdGljQ2xhc3M6IFwiZWwtaWNvbi1lcnJvclwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgIF92bS5fdihcIiDpgIDlh7rnmbvlvZVcIilcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgMlxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICA6IF92bS5fZSgpXG4gICAgICAgIF0sXG4gICAgICAgIDFcbiAgICAgIClcbiAgICBdLFxuICAgIDFcbiAgKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtZTk2MWI3MDJcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi1lOTYxYjcwMlwiLFwiaGFzU2NvcGVkXCI6dHJ1ZSxcImJ1YmxlXCI6e1widHJhbnNmb3Jtc1wiOnt9fX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvaW5kZXhoZWFkZXIudnVlXG4vLyBtb2R1bGUgaWQgPSA0N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtM2YyYjU2YTdcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3JlbGVhc2UudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikoXCIzNjNlMjRlZVwiLCBjb250ZW50LCBmYWxzZSwge30pO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuIC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG4gaWYoIWNvbnRlbnQubG9jYWxzKSB7XG4gICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtM2YyYjU2YTdcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3JlbGVhc2UudnVlXCIsIGZ1bmN0aW9uKCkge1xuICAgICB2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTNmMmI1NmE3XFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9yZWxlYXNlLnZ1ZVwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlciEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi0zZjJiNTZhN1wiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlXG4vLyBtb2R1bGUgaWQgPSA0OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuLnJlbGVhc2Vjb25lbnR7XFxyXFxuXFx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cXG59XFxuLmRlbW8tcnVsZUZvcm17XFxufVxcbi5uYXZ7XFxyXFxuXFx0bWFyZ2luLXRvcDogMHB4O1xcclxcblxcdG1hcmdpbi1ib3R0b206IDIwcHg7XFxufVxcbi5lbC10ZXh0YXJlYV9faW5uZXJ7XFxyXFxuXFx0bWluLWhlaWdodDogMjUwcHggIWltcG9ydGFudDtcXG59XFxyXFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkU6L0NNUy9jbXMtc3BhL3NyYy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCI7QUFvR0E7Q0FDQSx1QkFBQTtDQUNBO0FBQ0E7Q0FFQTtBQUNBO0NBQ0EsZ0JBQUE7Q0FDQSxvQkFBQTtDQUNBO0FBQ0E7Q0FDQSw2QkFBQTtDQUNBXCIsXCJmaWxlXCI6XCJyZWxlYXNlLnZ1ZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI8dGVtcGxhdGU+XFxyXFxuXFx0PGVsLW1haW4gY2xhc3M9XFxcInJlbGVhc2Vjb25lbnRcXFwiPlxcclxcblxcdDxlbC1mb3JtIDptb2RlbD1cXFwicnVsZUZvcm1cXFwiIDpydWxlcz1cXFwicnVsZXNcXFwiIHJlZj1cXFwicnVsZUZvcm1cXFwiIGxhYmVsLXdpZHRoPVxcXCIxMDBweFxcXCIgY2xhc3M9XFxcImRlbW8tcnVsZUZvcm1cXFwiPlxcclxcblxcdFxcdDxlbC1icmVhZGNydW1iIHNlcGFyYXRvcj1cXFwiL1xcXCIgY2xhc3M9XFxcIm5hdlxcXCI+XFxyXFxuXFx0XFx0XFx0PGVsLWJyZWFkY3J1bWItaXRlbSA6dG89XFxcInsgcGF0aDogJy8nIH1cXFwiPummlumhtTwvZWwtYnJlYWRjcnVtYi1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1icmVhZGNydW1iLWl0ZW0+PGEgaHJlZj1cXFwiIy9yZWxlYXNlXFxcIj7or53popjlj5HluIM8L2E+PC9lbC1icmVhZGNydW1iLWl0ZW0+XFxyXFxuXFx0XFx0PC9lbC1icmVhZGNydW1iPlxcclxcblxcdFxcdDxoci8+XFxyXFxuXFx0XFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cXFwi6K+d6aKY5YiG57G7XFxcIiBwcm9wPVxcXCJ0b3BpY3R5cGVcXFwiPlxcclxcblxcdFxcdFxcdDxlbC1zZWxlY3Qgdi1tb2RlbD1cXFwicnVsZUZvcm0udG9waWN0eXBlXFxcIiBwbGFjZWhvbGRlcj1cXFwi6K+36YCJ5oup6K+d6aKY5YiG57G7XFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtb3B0aW9uIGxhYmVsPVxcXCLmioDmnK9cXFwiIHZhbHVlPVxcXCJ0ZWNobm9sb2d5XFxcIj48L2VsLW9wdGlvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtb3B0aW9uIGxhYmVsPVxcXCLmloflraZcXFwiIHZhbHVlPVxcXCJsaXRlcmF0dXJlXFxcIj48L2VsLW9wdGlvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtb3B0aW9uIGxhYmVsPVxcXCLkvZPogrJcXFwiIHZhbHVlPVxcXCJTcG9ydHNcXFwiPjwvZWwtb3B0aW9uPlxcclxcblxcdFxcdFxcdFxcdDxlbC1vcHRpb24gbGFiZWw9XFxcIuWoseS5kFxcXCIgdmFsdWU9XFxcImVudGVydGFpbm1lbnRcXFwiPjwvZWwtb3B0aW9uPlxcclxcblxcdFxcdFxcdFxcdDxlbC1vcHRpb24gbGFiZWw9XFxcIueOhOWtplxcXCIgdmFsdWU9XFxcIm1ldGFwaHlzaWNzXFxcIj48L2VsLW9wdGlvbj5cXHJcXG5cXHRcXHRcXHQ8L2VsLXNlbGVjdD5cXHJcXG5cXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLmoIfpophcXFwiIHByb3A9XFxcInRpdGxlXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtaW5wdXQgdi1tb2RlbD1cXFwicnVsZUZvcm0udGl0bGVcXFwiPjwvZWwtaW5wdXQ+XFxyXFxuXFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cXFwi6K+d6aKY5YaF5a65XFxcIiBwcm9wPVxcXCJjb250ZW50XFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtaW5wdXQgdHlwZT1cXFwidGV4dGFyZWFcXFwiIHYtbW9kZWw9XFxcInJ1bGVGb3JtLmNvbnRlbnRcXFwiIGNvbHM9XFxcIjgwXFxcIiBjbGFzcz1cXFwiLnRleHRhcmVhXFxcIj48L2VsLWlucHV0PlxcclxcblxcdFxcdFxcdDwhLS0gPHRleHRhcmVhIG5hbWU9XFxcIlxcXCIgaWQ9XFxcIlxcXCIgY29scz1cXFwiMTAwXFxcIiByb3dzPVxcXCIyMFxcXCIgdi1tb2RlbD1cXFwicnVsZUZvcm0uZGVzY1xcXCIgY2xhc3M9XFxcIi50ZXh0YXJlYVxcXCI+PC90ZXh0YXJlYT4gLS0+XFxyXFxuXFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0PGVsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHQ8ZWwtYnV0dG9uIHR5cGU9XFxcInByaW1hcnlcXFwiIEBjbGljaz1cXFwic3VibWl0Rm9ybSgncnVsZUZvcm0nKVxcXCI+5Y+R5biDPC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0PGVsLWJ1dHRvbiBAY2xpY2s9XFxcInJlc2V0Rm9ybSgncnVsZUZvcm0nKVxcXCI+6YeN572uPC9lbC1idXR0b24+XFxyXFxuXFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0PC9lbC1mb3JtPlxcclxcblxcdDwvZWwtbWFpbj5cXHJcXG48L3RlbXBsYXRlPlxcclxcblxcclxcbjxzY3JpcHQ+XFxyXFxuXFx0aW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xcclxcblxcdGV4cG9ydCBkZWZhdWx0IHtcXHJcXG5cXHRcXHRkYXRhKCkge1xcclxcblxcdFxcdFxcdHJldHVybiB7XFxyXFxuXFx0XFx0XFx0XFx0cnVsZUZvcm06IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aXRsZTogJycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0dG9waWN0eXBlOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRjb250ZW50OiAnJ1xcclxcblxcdFxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0XFx0cnVsZXM6IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aXRsZTogW3tcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRyZXF1aXJlZDogdHJ1ZSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5qCH6aKY5LiN6IO95Li656m6JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9LFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRtaW46IDIsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0bWF4OiAzMCxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn6ZW/5bqm5ZyoIDIg5YiwIDMwIOS4quWtl+espicsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0dHJpZ2dlcjogJ2JsdXInXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdF0sXFxyXFxuXFx0XFx0XFx0XFx0XFx0dG9waWN0eXBlOiBbe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdHJlcXVpcmVkOiB0cnVlLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfor7fpgInmi6nor53popjnsbvlnosnLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHRyaWdnZXI6ICdjaGFuZ2UnXFxyXFxuXFx0XFx0XFx0XFx0XFx0fV0sXFxyXFxuXFx0XFx0XFx0XFx0XFx0Y29udGVudDogW3tcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRyZXF1aXJlZDogdHJ1ZSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn6K+d6aKY5YaF5a655LiN6IO95Li656m6JyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9O1xcclxcblxcdFxcdH0sXFxyXFxuXFx0XFx0bWV0aG9kczoge1xcclxcblxcdFxcdFxcdHN1Ym1pdEZvcm0oZm9ybU5hbWUpIHtcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS52YWxpZGF0ZShhc3luYyAodmFsaWQpID0+IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRpZiAodmFsaWQpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjb25zdCB7ZGF0YTp0b3BpY2RhdGF9ID0gYXdhaXQgYXhpb3MucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcycsdGhpcy5ydWxlRm9ybSlcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRpZih0b3BpY2RhdGEuZXJyID09PSBcXFwi5rKh5pyJ5p2D6ZmQXFxcIil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdHR5cGU6ICd3YXJuaW5nJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGlmKCF0b3BpY2RhdGEuZXJyKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5Y+R5biD5oiQ5YqfJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnc3VjY2VzcydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHRoaXMuJHJvdXRlci5wdXNoKCcvJylcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0fSBlbHNlIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjb25zb2xlLmxvZygnZXJyb3Igc3VibWl0ISEnKTtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRyZXR1cm4gZmFsc2U7XFxyXFxuXFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdH0pO1xcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0cmVzZXRGb3JtKGZvcm1OYW1lKSB7XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy4kcmVmc1tmb3JtTmFtZV0ucmVzZXRGaWVsZHMoKTtcXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fVxcclxcblxcdH1cXHJcXG48L3NjcmlwdD5cXHJcXG5cXHJcXG48c3R5bGU+XFxyXFxuLnJlbGVhc2Vjb25lbnR7XFxyXFxuXFx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cXHJcXG59XFxyXFxuLmRlbW8tcnVsZUZvcm17XFxyXFxuXFx0XFxyXFxufVxcclxcbi5uYXZ7XFxyXFxuXFx0bWFyZ2luLXRvcDogMHB4O1xcclxcblxcdG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxufVxcclxcbi5lbC10ZXh0YXJlYV9faW5uZXJ7XFxyXFxuXFx0bWluLWhlaWdodDogMjUwcHggIWltcG9ydGFudDtcXHJcXG59XFxyXFxuPC9zdHlsZT5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtM2YyYjU2YTdcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9yZWxlYXNlLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3ZtID0gdGhpc1xuICB2YXIgX2ggPSBfdm0uJGNyZWF0ZUVsZW1lbnRcbiAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gIHJldHVybiBfYyhcbiAgICBcImVsLW1haW5cIixcbiAgICB7IHN0YXRpY0NsYXNzOiBcInJlbGVhc2Vjb25lbnRcIiB9LFxuICAgIFtcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWZvcm1cIixcbiAgICAgICAge1xuICAgICAgICAgIHJlZjogXCJydWxlRm9ybVwiLFxuICAgICAgICAgIHN0YXRpY0NsYXNzOiBcImRlbW8tcnVsZUZvcm1cIixcbiAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgbW9kZWw6IF92bS5ydWxlRm9ybSxcbiAgICAgICAgICAgIHJ1bGVzOiBfdm0ucnVsZXMsXG4gICAgICAgICAgICBcImxhYmVsLXdpZHRoXCI6IFwiMTAwcHhcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW1xuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1icmVhZGNydW1iXCIsXG4gICAgICAgICAgICB7IHN0YXRpY0NsYXNzOiBcIm5hdlwiLCBhdHRyczogeyBzZXBhcmF0b3I6IFwiL1wiIH0gfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXCJlbC1icmVhZGNydW1iLWl0ZW1cIiwgeyBhdHRyczogeyB0bzogeyBwYXRoOiBcIi9cIiB9IH0gfSwgW1xuICAgICAgICAgICAgICAgIF92bS5fdihcIummlumhtVwiKVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgX2MoXCJlbC1icmVhZGNydW1iLWl0ZW1cIiwgW1xuICAgICAgICAgICAgICAgIF9jKFwiYVwiLCB7IGF0dHJzOiB7IGhyZWY6IFwiIy9yZWxlYXNlXCIgfSB9LCBbX3ZtLl92KFwi6K+d6aKY5Y+R5biDXCIpXSlcbiAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFwiaHJcIiksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIuivnemimOWIhuexu1wiLCBwcm9wOiBcInRvcGljdHlwZVwiIH0gfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1zZWxlY3RcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBhdHRyczogeyBwbGFjZWhvbGRlcjogXCLor7fpgInmi6nor53popjliIbnsbtcIiB9LFxuICAgICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybS50b3BpY3R5cGUsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uJHNldChfdm0ucnVsZUZvcm0sIFwidG9waWN0eXBlXCIsICQkdilcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJydWxlRm9ybS50b3BpY3R5cGVcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1vcHRpb25cIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBsYWJlbDogXCLmioDmnK9cIiwgdmFsdWU6IFwidGVjaG5vbG9neVwiIH1cbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwiZWwtb3B0aW9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgbGFiZWw6IFwi5paH5a2mXCIsIHZhbHVlOiBcImxpdGVyYXR1cmVcIiB9XG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLW9wdGlvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IGxhYmVsOiBcIuS9k+iCslwiLCB2YWx1ZTogXCJTcG9ydHNcIiB9XG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLW9wdGlvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IGxhYmVsOiBcIuWoseS5kFwiLCB2YWx1ZTogXCJlbnRlcnRhaW5tZW50XCIgfVxuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1vcHRpb25cIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBsYWJlbDogXCLnjoTlraZcIiwgdmFsdWU6IFwibWV0YXBoeXNpY3NcIiB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIuagh+mimFwiLCBwcm9wOiBcInRpdGxlXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybS50aXRsZSxcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtLCBcInRpdGxlXCIsICQkdilcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInJ1bGVGb3JtLnRpdGxlXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtZm9ybS1pdGVtXCIsXG4gICAgICAgICAgICB7IGF0dHJzOiB7IGxhYmVsOiBcIuivnemimOWGheWuuVwiLCBwcm9wOiBcImNvbnRlbnRcIiB9IH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFwiZWwtaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiBcIi50ZXh0YXJlYVwiLFxuICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6IFwidGV4dGFyZWFcIiwgY29sczogXCI4MFwiIH0sXG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0ucnVsZUZvcm0uY29udGVudCxcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtLCBcImNvbnRlbnRcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwicnVsZUZvcm0uY29udGVudFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImVsLWZvcm0taXRlbVwiLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICBcImVsLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6IFwicHJpbWFyeVwiIH0sXG4gICAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24oJGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLnN1Ym1pdEZvcm0oXCJydWxlRm9ybVwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KFwi5Y+R5biDXCIpXVxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICBcImVsLWJ1dHRvblwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdm0ucmVzZXRGb3JtKFwicnVsZUZvcm1cIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW192bS5fdihcIumHjee9rlwiKV1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApXG4gICAgICAgIF0sXG4gICAgICAgIDFcbiAgICAgIClcbiAgICBdLFxuICAgIDFcbiAgKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtM2YyYjU2YTdcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi0zZjJiNTZhN1wiLFwiaGFzU2NvcGVkXCI6ZmFsc2UsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3JlbGVhc2UudnVlXG4vLyBtb2R1bGUgaWQgPSA1MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtOGQ2NGU5M2NcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2RldGFpbHMudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikoXCIyMzAyMmI5NVwiLCBjb250ZW50LCBmYWxzZSwge30pO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuIC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG4gaWYoIWNvbnRlbnQubG9jYWxzKSB7XG4gICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtOGQ2NGU5M2NcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2RldGFpbHMudnVlXCIsIGZ1bmN0aW9uKCkge1xuICAgICB2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LThkNjRlOTNjXFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9kZXRhaWxzLnZ1ZVwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlciEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi04ZDY0ZTkzY1wiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL2RldGFpbHMudnVlXG4vLyBtb2R1bGUgaWQgPSA1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuLmRldGFpbHN7XFxuXFx0XFx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cXG59XFxuLmRldGFpbHMgYXtcXG5cXHRcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXFx0XFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblxcdFxcdGNvbG9yOiAjODA4MDgwO1xcbn1cXG4uZGV0YWlscyBhOmhvdmVye1xcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcbn1cXG4uZGV0YWlscyAudGV4dCB7XFxuICAgIGZvbnQtc2l6ZTogMTdweCA7XFxuXFx0XFx0dGV4dC1pbmRlbnQ6IDJlbTtcXG59XFxuLmRldGFpbHMgLml0ZW0ge1xcbiAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xcblxcdFxcdG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi5kZXRhaWxzIC5vcGVyYXRpb257XFxuXFx0XFx0bWFyZ2luLXRvcDogNTBweDtcXG59XFxuLmNsZWFyZml4OmJlZm9yZSxcXG4gIC5jbGVhcmZpeDphZnRlciB7XFxuICAgIGRpc3BsYXk6IHRhYmxlO1xcbiAgICBjb250ZW50OiBcXFwiXFxcIjtcXG59XFxuLmNsZWFyZml4OmFmdGVyIHtcXG4gICAgY2xlYXI6IGJvdGhcXG59XFxuLmJveC1jYXJkIHtcXG4gIFxcdHdpZHRoOiAxMDAlO1xcbn1cXG4uZGV0YWlscyAudGl0bGV7XFxuXFx0XFx0Zm9udC1zaXplOiAzMHB4O1xcblxcdFxcdGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcbi5kZXRhaWxzIC5ib3gtY2FyZCBkaXYuZWwtY2FyZF9faGVhZGVye1xcblxcdFxcdGhlaWdodDogMTAwcHg7XFxuXFx0XFx0bGluZS1oZWlnaHQ6IDYzcHg7XFxuXFx0XFx0cG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5zcGFuLmF1dGhvcntcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFx0XFx0Ym90dG9tOiAxM3B4O1xcblxcdFxcdHJpZ2h0OiAyMHB4O1xcblxcdFxcdGZvbnQtc2l6ZTogMTVweDtcXG59XFxuc3Bhbi5zdGFyc3tcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFx0XFx0dG9wOiAxOHB4O1xcblxcdFxcdHJpZ2h0OiAyMHB4O1xcblxcdFxcdGZvbnQtc2l6ZTogMTVweDtcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXG5cXHRcXHRjdXJzb3I6IHBvaW50ZXI7XFxufVxcbnNwYW4uY3JlYXRlX3RpbWV7XFxuXFx0XFx0ZGlzcGxheTogYmxvY2s7XFxuXFx0XFx0aGVpZ2h0OiAwcHg7XFxuXFx0XFx0cG9zaXRpb246IGFic29sdXRlO1xcblxcdFxcdGJvdHRvbTogNTBweDtcXG5cXHRcXHRyaWdodDogMjBweDtcXG5cXHRcXHRmb250LXNpemU6IDEycHg7XFxufVxcbi5jb21tZW50e1xcblxcdFxcdG1hcmdpbi10b3A6IDMwcHg7XFxufVxcbi5kZXRhaWxzIC5jb21tZW50IC50ZXh0e1xcblxcdFxcdG1hcmdpbi1ib3R0b206IDA7XFxuXFx0XFx0dGV4dC1pbmRlbnQ6IDA7XFxuXFx0XFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cXHRcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFx0XFx0Ym9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNjY2M7XFxuXFx0XFx0cGFkZGluZzogMTBweCAwO1xcblxcdFxcdHBhZGRpbmctYm90dG9tOiAyMHB4O1xcbn1cXG4uZGV0YWlscyAuY29tbWVudCAudGV4dCBhLmF2YXRhcntcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXG5cXHRcXHR3aWR0aDogNDBweDtcXG5cXHRcXHRoZWlnaHQ6IDQwcHg7XFxuXFx0XFx0Ym9yZGVyLXJhZGl1czogMjBweDtcXG5cXHRcXHRmbG9hdDogbGVmdDtcXG59XFxuLmRldGFpbHMgLmNvbW1lbnQgLnRleHQgYSBpbWd7XFxuXFx0XFx0ZGlzcGxheTogYmxvY2s7XFxuXFx0XFx0d2lkdGg6IDQwcHg7XFxuXFx0XFx0aGVpZ2h0OiA0MHB4O1xcblxcdFxcdGJvcmRlci1yYWRpdXM6IDIwcHg7XFxufVxcbi5jb21tZW50Y29udGVudHtcXG5cXHRcXHR3aWR0aDogMTAwJTtcXG5cXHRcXHRwYWRkaW5nLWxlZnQ6IDYwcHg7XFxufVxcbi5jb21tZW50Y29udGVudCBoNiAscHtcXG5cXHRcXHRtYXJnaW46IDA7XFxufVxcbi5jb21tZW50Y29udGVudCBwe1xcblxcdFxcdG1hcmdpbi10b3A6IDEwcHg7XFxuXFx0XFx0Zm9udC1zaXplOiAxNHB4O1xcblxcdFxcdHRleHQtaW5kZW50OiAwO1xcblxcdFxcdGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5kaXYuZGVtby1pbnB1dC1zaXple1xcblxcdFxcdG1hcmdpbi10b3A6IDMwcHg7XFxuXFx0XFx0cGFkZGluZy1yaWdodDogNTRweDtcXG5cXHRcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcbi5zZW5kbWVzc2FnZXtcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFx0XFx0dG9wOiAwO1xcblxcdFxcdHJpZ2h0OiAwO1xcbn1cXG4ub3BlcmF0aW9uIGF7XFxuXFx0XFx0Y29sb3I6IHdoaXRlO1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiRTovQ01TL2Ntcy1zcGEvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvZGV0YWlscy52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjtBQWlMQTtFQUNBLHVCQUFBO0NBQ0E7QUFDQTtFQUNBLHNCQUFBO0VBQ0Esc0JBQUE7RUFDQSxlQUFBO0NBQ0E7QUFDQTtFQUNBLGVBQUE7Q0FDQTtBQUNBO0lBQ0EsaUJBQUE7RUFDQSxpQkFBQTtDQUNBO0FBRUE7SUFDQSxvQkFBQTtFQUNBLGlCQUFBO0NBQ0E7QUFDQTtFQUNBLGlCQUFBO0NBQ0E7QUFDQTs7SUFFQSxlQUFBO0lBQ0EsWUFBQTtDQUNBO0FBQ0E7SUFDQSxXQUFBO0NBQ0E7QUFFQTtHQUNBLFlBQUE7Q0FDQTtBQUNBO0VBQ0EsZ0JBQUE7RUFDQSxvQkFBQTtDQUNBO0FBQ0E7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0NBQ0E7QUFDQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLFVBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7Q0FDQTtBQUNBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7Q0FDQTtBQUNBO0VBQ0EsaUJBQUE7Q0FDQTtBQUNBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxvQkFBQTtFQUNBLFlBQUE7Q0FDQTtBQUNBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0Esb0JBQUE7Q0FDQTtBQUNBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0NBQ0E7QUFDQTtFQUNBLFVBQUE7Q0FDQTtBQUNBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxrQkFBQTtDQUNBO0FBQ0E7RUFDQSxpQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7Q0FDQTtBQUNBO0VBQ0EsbUJBQUE7RUFDQSxPQUFBO0VBQ0EsU0FBQTtDQUNBO0FBQ0E7RUFDQSxhQUFBO0NBQ0FcIixcImZpbGVcIjpcImRldGFpbHMudnVlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjx0ZW1wbGF0ZT5cXHJcXG5cXHQ8ZWwtbWFpbiBjbGFzcz1cXFwiZGV0YWlsc1xcXCI+XFxyXFxuXFx0XFx0PGVsLWJyZWFkY3J1bWIgc2VwYXJhdG9yPVxcXCIvXFxcIiBjbGFzcz1cXFwibmF2XFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtYnJlYWRjcnVtYi1pdGVtIDp0bz1cXFwieyBwYXRoOiAnLycgfVxcXCI+6aaW6aG1PC9lbC1icmVhZGNydW1iLWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLWJyZWFkY3J1bWItaXRlbT48YSBocmVmPVxcXCJqYXZhc2NyaXB0OlxcXCI+6K+d6aKY6K+m5oOFPC9hPjwvZWwtYnJlYWRjcnVtYi1pdGVtPlxcclxcblxcdFxcdDwvZWwtYnJlYWRjcnVtYj5cXHJcXG5cXHRcXHQ8aHIvPlxcblxcdFxcdDxlbC1jYXJkIGNsYXNzPVxcXCJib3gtY2FyZFxcXCI+XFxyXFxuXFx0XFx0XFx0PGRpdiBzbG90PVxcXCJoZWFkZXJcXFwiIGNsYXNzPVxcXCJjbGVhcmZpeFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcInRpdGxlXFxcIj57eyB0b3BpYy50aXRsZSB9fTwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHQ8c3BhbiBjbGFzcz1cXFwiYXV0aG9yXFxcIj7kvZzogIUgOiA8YSBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IGJvbGQ7XFxcIiA6aHJlZj1cXFwiYCMvdXNlci8ke2F1dGhvci5faWR9YFxcXCI+e3thdXRob3IudXNlcm5hbWV9fTwvYT48L3NwYW4+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gOmNsYXNzPVxcXCJzdGFyPydlbC1pY29uLXN0YXItb2ZmIHN0YXJzJzonZWwtaWNvbi1zdGFyLW9uIHN0YXJzJ1xcXCIgQGNsaWNrPVxcXCJzZXRzdGFyXFxcIj4gXFxyXFxuXFx0XFx0XFx0XFx0XFx0e3sgc3RhcnMgfX1cXHJcXG5cXHRcXHRcXHRcXHQ8L3NwYW4+XFxyXFxuXFx0XFx0XFx0XFx0PHNwYW4gY2xhc3M9XFxcImNyZWF0ZV90aW1lXFxcIj7liJvlu7rml7bpl7QgOiB7e3RvcGljLmNyZWF0ZV90aW1lfX08L3NwYW4+XFxyXFxuXFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwidGV4dCBpdGVtXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8cD5cXHJcXG5cXHRcXHRcXHRcXHRcXHR7e3RvcGljLmNvbnRlbnR9fVxcclxcblxcdFxcdFxcdFxcdDwvcD5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJvcGVyYXRpb25cXFwiIHYtaWY9XFxcIm9wZXJhdGlvblxcXCIgc3R5bGU9XFxcImZsb2F0OiByaWdodDtcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwiZWwtaWNvbi1lZGl0LW91dGxpbmVcXFwiIHNpemU9XFxcIm1pbmlcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxhIDpocmVmPVxcXCJgIy90b3BpY2VkaXQvJHt0b3BpYy5faWR9YFxcXCI+57yW6L6RPC9hPlxcclxcblxcdFxcdFxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gdHlwZT1cXFwiZGFuZ2VyXFxcIiBpY29uPVxcXCJlbC1pY29uLWRlbGV0ZVxcXCIgc2l6ZT1cXFwibWluaVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0PGEgaHJlZj1cXFwiamF2YXNjcmlwdDpcXFwiIDpkYXRhLWlkPVxcXCJ0b3BpYy5faWRcXFwiIEBjbGljaz1cXFwiZGVsZXRldG9waWNcXFwiPuWIoOmZpDwvYT5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHQ8L2VsLWNhcmQ+XFxyXFxuXFx0XFx0PGVsLWNhcmQgY2xhc3M9XFxcImJveC1jYXJkIGNvbW1lbnRcXFwiIHYtc2hvdz1cXFwiY29tbWVudHNbMF1cXFwiPlxcclxcblxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcInRleHQgaXRlbVxcXCIgdi1mb3I9XFxcIihjb21tZW50LGluZGV4KSBpbiBjb21tZW50c1xcXCIgOmtleT1cXFwiaW5kZXhcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxhIDpocmVmPVxcXCJgIy91c2VyLyR7Y29tbWVudC51c2VyLl9pZH1gXFxcIiBjbGFzcz1cXFwiYXZhdGFyXFxcIj48aW1nIDpzcmM9XFxcImBodHRwOi8vMTI3LjAuMC4xOjMwMDAke2NvbW1lbnQudXNlci5hdmF0YXJ9YFxcXCIgYWx0PVxcXCJcXFwiPjwvYT5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJjb21tZW50Y29udGVudFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGg2PlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdOeUqOaItyA6IDxhIDpocmVmPVxcXCJgIy91c2VyLyR7Y29tbWVudC51c2VyLl9pZH1gXFxcIj4ge3sgY29tbWVudC51c2VyLnVzZXJuYW1lIH19PC9hPiZuYnNwOyAmbmJzcDtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8c3Bhbj4ge3sgY29tbWVudC5jcmVhdGVfdGltZSB9fTwvc3Bhbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2g2PlxcclxcblxcdFxcdFxcdFxcdFxcdDxwPnt7IGNvbW1lbnQuY29udGVudCB9fTwvcD5cXHJcXG5cXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHQ8L2VsLWNhcmQ+XFxyXFxuXFx0XFx0PGVsLWNhcmQgY2xhc3M9XFxcImJveC1jYXJkXFxcIiB2LXNob3c9XFxcIiFjb21tZW50c1swXVxcXCI+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwidGV4dCBpdGVtXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8aDUgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjtcXFwiPuaaguaXtui/mOayoeS6uueVmeiogC4uLi4uLi4uLi4uPC9oNT5cXHJcXG5cXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHQ8L2VsLWNhcmQ+XFxyXFxuXFx0XFx0PGRpdiBjbGFzcz1cXFwiZGVtby1pbnB1dC1zaXplXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtaW5wdXRcXHJcXG5cXHRcXHRcXHRcXHRwbGFjZWhvbGRlcj1cXFwi5Y+R6KGo5L2g55qE55yL5rOVLi4uXFxcIlxcclxcblxcdFxcdFxcdFxcdHN1ZmZpeC1pY29uPVxcXCJlbC1pY29uLWRhdGVcXFwiXFxyXFxuXFx0XFx0XFx0XFx0di1tb2RlbD1cXFwibndlbWVzc2FnZVxcXCI+XFxyXFxuXFx0XFx0XFx0PC9lbC1pbnB1dD5cXHJcXG5cXHRcXHRcXHQ8ZWwtYnV0dG9uIFxcclxcblxcdFxcdFxcdFxcdHR5cGU9XFxcInByaW1hcnlcXFwiIFxcclxcblxcdFxcdFxcdFxcdGljb249XFxcImVsLWljb24tZWRpdFxcXCIgXFxyXFxuXFx0XFx0XFx0XFx0Y2xhc3M9XFxcInNlbmRtZXNzYWdlXFxcIlxcclxcblxcdFxcdFxcdFxcdEBjbGljaz1cXFwic2VuZG1lc3NhZ2VcXFwiPlxcclxcblxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdDwvZGl2PlxcclxcblxcdDwvZWwtbWFpbj5cXG48L3RlbXBsYXRlPlxcblxcbjxzY3JpcHQ+XFxyXFxuXFx0aW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xcblxcdGV4cG9ydCBkZWZhdWx0IHtcXG5cXHRcXHRkYXRhKCkge1xcblxcdFxcdFxcdHJldHVybiB7XFxuXFx0XFx0XFx0XFx0dG9waWMgOiB7fSxcXHJcXG5cXHRcXHRcXHRcXHRhdXRob3IgOiB7fSxcXHJcXG5cXHRcXHRcXHRcXHRjb21tZW50cyA6IFtdLFxcclxcblxcdFxcdFxcdFxcdG53ZW1lc3NhZ2UgOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRvcGVyYXRpb24gOiBmYWxzZSxcXHJcXG5cXHRcXHRcXHRcXHRzdGFycyA6IDAsXFxyXFxuXFx0XFx0XFx0XFx0c3RhciA6IHRydWVcXG5cXHRcXHRcXHR9O1xcblxcdFxcdH0sXFxyXFxuXFx0XFx0YXN5bmMgY3JlYXRlZCgpe1xcclxcblxcdFxcdFxcdC8vIGNvbnNvbGUubG9nKHRoaXMuJHJvdXRlLnBhcmFtcylcXHJcXG5cXHRcXHRcXHRsZXQgY3VycmVudHVzZXJfaWQgPSAnJ1xcclxcblxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRjb25zdCB7ZGF0YSA6IHRvcGljfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy9kZXRhaWxzP19pZD0nK2lkKVxcclxcblxcdFxcdFxcdGNvbnN0IHtkYXRhIDogYXV0aG9yfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP19pZD0nK3RvcGljLnVzZXJfaWQpXFxyXFxuXFx0XFx0XFx0aWYoIWF1dGhvci5lcnIpe1xcclxcblxcdFxcdFxcdFxcdHRoaXMuYXV0aG9yID0gYXV0aG9yWzBdXFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGEgOiBjdXJyZW50dXNlcn0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcXHJcXG5cXHRcXHRcXHRcXHRpZihjdXJyZW50dXNlci5zdGF0ZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y3VycmVudHVzZXJfaWQgPSBjdXJyZW50dXNlci5zdGF0ZS5faWRcXHJcXG5cXHRcXHRcXHRcXHRcXHRpZih0aGlzLmF1dGhvci5faWQgPT09IGN1cnJlbnR1c2VyLnN0YXRlLl9pZCl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dGhpcy5vcGVyYXRpb24gPSB0cnVlXFxyXFxuXFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0aWYoIXRvcGljLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy50b3BpYyA9IHRvcGljXFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdHRoaXMuZ2V0Y29tbWVudHMoKVxcclxcblxcdFxcdFxcdHRoaXMuc3RhcnMgPSB0aGlzLnRvcGljLnN0YXJzLmxlbmd0aFxcclxcblxcdFxcdFxcdGlmKGN1cnJlbnR1c2VyX2lkKXtcXHJcXG5cXHRcXHRcXHRcXHQvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXJzKVxcclxcblxcdFxcdFxcdFxcdHRoaXMuc3RhciA9IHRoaXMudG9waWMuc3RhcnMuaW5kZXhPZihjdXJyZW50dXNlcl9pZCkgPT09IC0xID8gdHJ1ZSA6IGZhbHNlXFxyXFxuXFx0XFx0XFx0XFx0Ly8gY29uc29sZS5sb2codGhpcy5zdGFycy5pbmRleE9mKGN1cnJlbnR1c2VyX2lkKSlcXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRtZXRob2RzOntcXHJcXG5cXHRcXHRcXHRhc3luYyBkZWxldGV0b3BpYyhlKXtcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCBpZCA9IGUudGFyZ2V0LmRhdGFzZXRbXFxcImlkXFxcIl1cXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7ZGF0YTp0b3BpY2RhdGF9ID0gYXdhaXQgYXhpb3MuZGVsZXRlKGBodHRwOi8vMTI3LjAuMC4xOjMwMDAvdG9waWNzLyR7aWR9YClcXHJcXG5cXHRcXHRcXHRcXHRpZih0b3BpY2RhdGEuZXJyID09PSBcXFwi5rKh5pyJ5p2D6ZmQXFxcIil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHR5cGU6ICd3YXJuaW5nJ1xcclxcblxcdFxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdGlmKCF0b3BpY2RhdGEuZXJyKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5Yig6Zmk5oiQ5YqfJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnc3VjY2VzcycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLiRyb3V0ZXIuZ28oLTEpXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0YXN5bmMgZ2V0Y29tbWVudHMoKXtcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7aWR9ID0gdGhpcy4kcm91dGUucGFyYW1zIFxcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtkYXRhIDogY29tbWVudHN9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvY29tbWVudHM/YXJ0aWNsZV9pZD0nK2lkKVxcclxcblxcdFxcdFxcdFxcdGlmKCFjb21tZW50cy5lcnIpe1xcclxcblxcdFxcdFxcdFxcdFxcdHRoaXMuY29tbWVudHMgPSBjb21tZW50c1xcclxcblxcdFxcdFxcdFxcdFxcdC8vIGNvbnNvbGUubG9nKHRoaXMuY29tbWVudHMpXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0YXN5bmMgc2VuZG1lc3NhZ2UoKXtcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7ZGF0YX0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcXHJcXG5cXHRcXHRcXHRcXHQvLyBjb25zb2xlLmxvZyhkYXRhLnN0YXRlKVxcclxcblxcdFxcdFxcdFxcdGlmKCFkYXRhLnN0YXRlKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRyZXR1cm4gdGhpcy4kbWVzc2FnZSh7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0bWVzc2FnZTogJ+ivt+WFiOeZu+W9lSEnLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHR5cGU6ICd3YXJuaW5nJ1xcclxcblxcdFxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXMgXFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGEgOiBjb21tZW50fSA9IGF3YWl0IGF4aW9zLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9jb21tZW50cycse1xcclxcblxcdFxcdFxcdFxcdFxcdGNvbnRlbnQgOiB0aGlzLm53ZW1lc3NhZ2UsXFxyXFxuXFx0XFx0XFx0XFx0XFx0YXJ0aWNsZV9pZCA6IGlkXFxyXFxuXFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHRpZighY29tbWVudC5lcnIpe1xcclxcblxcdFxcdFxcdFxcdFxcdHRoaXMubndlbWVzc2FnZSA9ICcnXFxyXFxuXFx0XFx0XFx0XFx0XFx0dGhpcy5nZXRjb21tZW50cygpXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0YXN5bmMgc2V0c3Rhcigpe1xcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtkYXRhfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3Nlc3Npb24nKVxcclxcblxcdFxcdFxcdFxcdC8vIGNvbnNvbGUubG9nKGRhdGEuc3RhdGUpXFxyXFxuXFx0XFx0XFx0XFx0aWYoIWRhdGEuc3RhdGUpe1xcclxcblxcdFxcdFxcdFxcdFxcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZydcXHJcXG5cXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB1c2VyX2lkID0gZGF0YS5zdGF0ZS5faWRcXHJcXG5cXHRcXHRcXHRcXHRsZXQgc3RhcnMgPSB0aGlzLnRvcGljLnN0YXJzXFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qgc3Rhcl9pZHggPSBzdGFycy5pbmRleE9mKHVzZXJfaWQpXFxyXFxuXFx0XFx0XFx0XFx0aWYoc3Rhcl9pZHggPT09IC0xKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRzdGFycy5wdXNoKHVzZXJfaWQpXFxyXFxuXFx0XFx0XFx0XFx0fSBlbHNlIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRzdGFycy5zcGxpY2Uoc3Rhcl9pZHgsMSlcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGEgOiBuZXd0b3BpY30gPSBhd2FpdCBheGlvcy5wYXRjaChgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy9zdGFyLyR7dGhpcy50b3BpYy5faWR9YCx7c3RhcnMgOiBzdGFyc30pXFxyXFxuXFx0XFx0XFx0XFx0aWYoIW5ld3RvcGljLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0dGhpcy5zdGFycyA9IHN0YXJzLmxlbmd0aFxcclxcblxcdFxcdFxcdFxcdFxcdHRoaXMuc3RhciA9IHRoaXMuc3RhciA/IGZhbHNlIDogdHJ1ZVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9IFxcclxcblxcdFxcdH1cXG5cXHR9XFxuPC9zY3JpcHQ+XFxuXFxuPHN0eWxlPlxcclxcblxcdC5kZXRhaWxze1xcclxcblxcdFxcdC8qIG1hcmdpbi10b3A6IDYxcHg7ICovXFxyXFxuXFx0fVxcclxcblxcdC5kZXRhaWxzIGF7XFxyXFxuXFx0XFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcblxcdFxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG5cXHRcXHRjb2xvcjogIzgwODA4MDtcXHJcXG5cXHR9XFxyXFxuXFx0LmRldGFpbHMgYTpob3ZlcntcXHJcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXHJcXG5cXHR9XFxuIC5kZXRhaWxzIC50ZXh0IHtcXHJcXG4gICAgZm9udC1zaXplOiAxN3B4IDtcXHJcXG5cXHRcXHR0ZXh0LWluZGVudDogMmVtO1xcclxcbiAgfVxcclxcblxcclxcbiAgLmRldGFpbHMgLml0ZW0ge1xcclxcbiAgICBtYXJnaW4tYm90dG9tOiAxOHB4O1xcclxcblxcdFxcdG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICB9XFxyXFxuXFx0LmRldGFpbHMgLm9wZXJhdGlvbntcXHJcXG5cXHRcXHRtYXJnaW4tdG9wOiA1MHB4O1xcclxcblxcdH1cXHJcXG4gIC5jbGVhcmZpeDpiZWZvcmUsXFxyXFxuICAuY2xlYXJmaXg6YWZ0ZXIge1xcclxcbiAgICBkaXNwbGF5OiB0YWJsZTtcXHJcXG4gICAgY29udGVudDogXFxcIlxcXCI7XFxyXFxuICB9XFxyXFxuICAuY2xlYXJmaXg6YWZ0ZXIge1xcclxcbiAgICBjbGVhcjogYm90aFxcclxcbiAgfVxcclxcblxcclxcbiAgLmJveC1jYXJkIHtcXHJcXG4gIFxcdHdpZHRoOiAxMDAlO1xcclxcbiAgfVxcclxcblxcdC5kZXRhaWxzIC50aXRsZXtcXHJcXG5cXHRcXHRmb250LXNpemU6IDMwcHg7XFxyXFxuXFx0XFx0Zm9udC13ZWlnaHQ6IGJvbGRlcjtcXHJcXG5cXHR9XFxyXFxuXFx0LmRldGFpbHMgLmJveC1jYXJkIGRpdi5lbC1jYXJkX19oZWFkZXJ7XFxyXFxuXFx0XFx0aGVpZ2h0OiAxMDBweDtcXHJcXG5cXHRcXHRsaW5lLWhlaWdodDogNjNweDtcXHJcXG5cXHRcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuXFx0fVxcclxcblxcdHNwYW4uYXV0aG9ye1xcclxcblxcdFxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdFxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRcXHRib3R0b206IDEzcHg7XFxyXFxuXFx0XFx0cmlnaHQ6IDIwcHg7XFxyXFxuXFx0XFx0Zm9udC1zaXplOiAxNXB4O1xcclxcblxcdH1cXHJcXG5cXHRzcGFuLnN0YXJze1xcclxcblxcdFxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdFxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRcXHR0b3A6IDE4cHg7XFxyXFxuXFx0XFx0cmlnaHQ6IDIwcHg7XFxyXFxuXFx0XFx0Zm9udC1zaXplOiAxNXB4O1xcclxcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcclxcblxcdFxcdGN1cnNvcjogcG9pbnRlcjtcXHJcXG5cXHR9XFxyXFxuXFx0c3Bhbi5jcmVhdGVfdGltZXtcXHJcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXHJcXG5cXHRcXHRoZWlnaHQ6IDBweDtcXHJcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuXFx0XFx0Ym90dG9tOiA1MHB4O1xcclxcblxcdFxcdHJpZ2h0OiAyMHB4O1xcclxcblxcdFxcdGZvbnQtc2l6ZTogMTJweDtcXHJcXG5cXHR9XFxyXFxuXFx0LmNvbW1lbnR7XFxyXFxuXFx0XFx0bWFyZ2luLXRvcDogMzBweDtcXHJcXG5cXHR9XFxyXFxuXFx0LmRldGFpbHMgLmNvbW1lbnQgLnRleHR7XFxyXFxuXFx0XFx0bWFyZ2luLWJvdHRvbTogMDtcXHJcXG5cXHRcXHR0ZXh0LWluZGVudDogMDtcXHJcXG5cXHRcXHRvdmVyZmxvdzogaGlkZGVuO1xcclxcblxcdFxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG5cXHRcXHRib3JkZXItYm90dG9tOiAxcHggc29saWQgI2NjYztcXHJcXG5cXHRcXHRwYWRkaW5nOiAxMHB4IDA7XFxyXFxuXFx0XFx0cGFkZGluZy1ib3R0b206IDIwcHg7XFxyXFxuXFx0fVxcclxcblxcdC5kZXRhaWxzIC5jb21tZW50IC50ZXh0IGEuYXZhdGFye1xcclxcblxcdFxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdFxcdHdpZHRoOiA0MHB4O1xcclxcblxcdFxcdGhlaWdodDogNDBweDtcXHJcXG5cXHRcXHRib3JkZXItcmFkaXVzOiAyMHB4O1xcclxcblxcdFxcdGZsb2F0OiBsZWZ0O1xcclxcblxcdH1cXHJcXG5cXHQuZGV0YWlscyAuY29tbWVudCAudGV4dCBhIGltZ3tcXHJcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXHJcXG5cXHRcXHR3aWR0aDogNDBweDtcXHJcXG5cXHRcXHRoZWlnaHQ6IDQwcHg7XFxyXFxuXFx0XFx0Ym9yZGVyLXJhZGl1czogMjBweDtcXHJcXG5cXHR9XFxyXFxuXFx0LmNvbW1lbnRjb250ZW50e1xcclxcblxcdFxcdHdpZHRoOiAxMDAlO1xcclxcblxcdFxcdHBhZGRpbmctbGVmdDogNjBweDtcXHJcXG5cXHR9XFxyXFxuXFx0LmNvbW1lbnRjb250ZW50IGg2ICxwe1xcclxcblxcdFxcdG1hcmdpbjogMDtcXHJcXG5cXHR9XFxyXFxuXFx0LmNvbW1lbnRjb250ZW50IHB7XFxyXFxuXFx0XFx0bWFyZ2luLXRvcDogMTBweDtcXHJcXG5cXHRcXHRmb250LXNpemU6IDE0cHg7XFxyXFxuXFx0XFx0dGV4dC1pbmRlbnQ6IDA7XFxyXFxuXFx0XFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuXFx0fVxcclxcblxcdGRpdi5kZW1vLWlucHV0LXNpemV7XFxyXFxuXFx0XFx0bWFyZ2luLXRvcDogMzBweDtcXHJcXG5cXHRcXHRwYWRkaW5nLXJpZ2h0OiA1NHB4O1xcclxcblxcdFxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXHJcXG5cXHR9XFxyXFxuXFx0LnNlbmRtZXNzYWdle1xcclxcblxcdFxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRcXHR0b3A6IDA7XFxyXFxuXFx0XFx0cmlnaHQ6IDA7XFxyXFxuXFx0fVxcclxcblxcdC5vcGVyYXRpb24gYXtcXHJcXG5cXHRcXHRjb2xvcjogd2hpdGU7XFxyXFxuXFx0fVxcbjwvc3R5bGU+XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LThkNjRlOTNjXCIsXCJzY29wZWRcIjpmYWxzZSxcImhhc0lubGluZUNvbmZpZ1wiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvZGV0YWlscy52dWVcbi8vIG1vZHVsZSBpZCA9IDUyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXG4gICAgXCJlbC1tYWluXCIsXG4gICAgeyBzdGF0aWNDbGFzczogXCJkZXRhaWxzXCIgfSxcbiAgICBbXG4gICAgICBfYyhcbiAgICAgICAgXCJlbC1icmVhZGNydW1iXCIsXG4gICAgICAgIHsgc3RhdGljQ2xhc3M6IFwibmF2XCIsIGF0dHJzOiB7IHNlcGFyYXRvcjogXCIvXCIgfSB9LFxuICAgICAgICBbXG4gICAgICAgICAgX2MoXCJlbC1icmVhZGNydW1iLWl0ZW1cIiwgeyBhdHRyczogeyB0bzogeyBwYXRoOiBcIi9cIiB9IH0gfSwgW1xuICAgICAgICAgICAgX3ZtLl92KFwi6aaW6aG1XCIpXG4gICAgICAgICAgXSksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcImVsLWJyZWFkY3J1bWItaXRlbVwiLCBbXG4gICAgICAgICAgICBfYyhcImFcIiwgeyBhdHRyczogeyBocmVmOiBcImphdmFzY3JpcHQ6XCIgfSB9LCBbX3ZtLl92KFwi6K+d6aKY6K+m5oOFXCIpXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdLFxuICAgICAgICAxXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwiaHJcIiksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXCJlbC1jYXJkXCIsIHsgc3RhdGljQ2xhc3M6IFwiYm94LWNhcmRcIiB9LCBbXG4gICAgICAgIF9jKFxuICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdGljQ2xhc3M6IFwiY2xlYXJmaXhcIixcbiAgICAgICAgICAgIGF0dHJzOiB7IHNsb3Q6IFwiaGVhZGVyXCIgfSxcbiAgICAgICAgICAgIHNsb3Q6IFwiaGVhZGVyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIF9jKFwic3BhblwiLCB7IHN0YXRpY0NsYXNzOiBcInRpdGxlXCIgfSwgW1xuICAgICAgICAgICAgICBfdm0uX3YoX3ZtLl9zKF92bS50b3BpYy50aXRsZSkpXG4gICAgICAgICAgICBdKSxcbiAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJhdXRob3JcIiB9LCBbXG4gICAgICAgICAgICAgIF92bS5fdihcIuS9nOiAhSA6IFwiKSxcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgc3RhdGljU3R5bGU6IHsgXCJmb250LXdlaWdodFwiOiBcImJvbGRcIiB9LFxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgaHJlZjogXCIjL3VzZXIvXCIgKyBfdm0uYXV0aG9yLl9pZCB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KF92bS5fcyhfdm0uYXV0aG9yLnVzZXJuYW1lKSldXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICBcInNwYW5cIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBfdm0uc3RhclxuICAgICAgICAgICAgICAgICAgPyBcImVsLWljb24tc3Rhci1vZmYgc3RhcnNcIlxuICAgICAgICAgICAgICAgICAgOiBcImVsLWljb24tc3Rhci1vbiBzdGFyc1wiLFxuICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiBfdm0uc2V0c3RhciB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFtfdm0uX3YoXCIgXFxuXFx0XFx0XFx0XFx0XCIgKyBfdm0uX3MoX3ZtLnN0YXJzKSArIFwiXFxuXFx0XFx0XFx0XCIpXVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJjcmVhdGVfdGltZVwiIH0sIFtcbiAgICAgICAgICAgICAgX3ZtLl92KFwi5Yib5bu65pe26Ze0IDogXCIgKyBfdm0uX3MoX3ZtLnRvcGljLmNyZWF0ZV90aW1lKSlcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXVxuICAgICAgICApLFxuICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcInRleHQgaXRlbVwiIH0sIFtcbiAgICAgICAgICBfYyhcInBcIiwgW1xuICAgICAgICAgICAgX3ZtLl92KFwiXFxuXFx0XFx0XFx0XFx0XCIgKyBfdm0uX3MoX3ZtLnRvcGljLmNvbnRlbnQpICsgXCJcXG5cXHRcXHRcXHRcIilcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF92bS5vcGVyYXRpb25cbiAgICAgICAgICAgID8gX2MoXG4gICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7IHN0YXRpY0NsYXNzOiBcIm9wZXJhdGlvblwiLCBzdGF0aWNTdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH0gfSxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInByaW1hcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiZWwtaWNvbi1lZGl0LW91dGxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IFwibWluaVwiXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgYXR0cnM6IHsgaHJlZjogXCIjL3RvcGljZWRpdC9cIiArIF92bS50b3BpYy5faWQgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihcIue8lui+kVwiKV1cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJkYW5nZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiZWwtaWNvbi1kZWxldGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IFwibWluaVwiXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBcImphdmFzY3JpcHQ6XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWlkXCI6IF92bS50b3BpYy5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHsgY2xpY2s6IF92bS5kZWxldGV0b3BpYyB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgW192bS5fdihcIuWIoOmZpFwiKV1cbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgOiBfdm0uX2UoKVxuICAgICAgICBdKVxuICAgICAgXSksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXG4gICAgICAgIFwiZWwtY2FyZFwiLFxuICAgICAgICB7XG4gICAgICAgICAgZGlyZWN0aXZlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiBcInNob3dcIixcbiAgICAgICAgICAgICAgcmF3TmFtZTogXCJ2LXNob3dcIixcbiAgICAgICAgICAgICAgdmFsdWU6IF92bS5jb21tZW50c1swXSxcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJjb21tZW50c1swXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJib3gtY2FyZCBjb21tZW50XCJcbiAgICAgICAgfSxcbiAgICAgICAgX3ZtLl9sKF92bS5jb21tZW50cywgZnVuY3Rpb24oY29tbWVudCwgaW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gX2MoXCJkaXZcIiwgeyBrZXk6IGluZGV4LCBzdGF0aWNDbGFzczogXCJ0ZXh0IGl0ZW1cIiB9LCBbXG4gICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJhdmF0YXJcIixcbiAgICAgICAgICAgICAgICBhdHRyczogeyBocmVmOiBcIiMvdXNlci9cIiArIGNvbW1lbnQudXNlci5faWQgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgX2MoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcImh0dHA6Ly8xMjcuMC4wLjE6MzAwMFwiICsgY29tbWVudC51c2VyLmF2YXRhcixcbiAgICAgICAgICAgICAgICAgICAgYWx0OiBcIlwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcImNvbW1lbnRjb250ZW50XCIgfSwgW1xuICAgICAgICAgICAgICBfYyhcImg2XCIsIFtcbiAgICAgICAgICAgICAgICBfdm0uX3YoXCJcXG5cXHRcXHRcXHRcXHRcXHTnlKjmiLcgOiBcIiksXG4gICAgICAgICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL3VzZXIvXCIgKyBjb21tZW50LnVzZXIuX2lkIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiICsgX3ZtLl9zKGNvbW1lbnQudXNlci51c2VybmFtZSkpXG4gICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgX3ZtLl92KFwiwqAgwqBcXG5cXHRcXHRcXHRcXHRcXHRcIiksXG4gICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIFtfdm0uX3YoXCIgXCIgKyBfdm0uX3MoY29tbWVudC5jcmVhdGVfdGltZSkpXSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFwicFwiLCBbX3ZtLl92KF92bS5fcyhjb21tZW50LmNvbnRlbnQpKV0pXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgIH0pLFxuICAgICAgICAwXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWNhcmRcIixcbiAgICAgICAge1xuICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogXCJzaG93XCIsXG4gICAgICAgICAgICAgIHJhd05hbWU6IFwidi1zaG93XCIsXG4gICAgICAgICAgICAgIHZhbHVlOiAhX3ZtLmNvbW1lbnRzWzBdLFxuICAgICAgICAgICAgICBleHByZXNzaW9uOiBcIiFjb21tZW50c1swXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJib3gtY2FyZFwiXG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcInRleHQgaXRlbVwiIH0sIFtcbiAgICAgICAgICAgIF9jKFwiaDVcIiwgeyBzdGF0aWNTdHlsZTogeyBcInRleHQtYWxpZ25cIjogXCJjZW50ZXJcIiB9IH0sIFtcbiAgICAgICAgICAgICAgX3ZtLl92KFwi5pqC5pe26L+Y5rKh5Lq655WZ6KiALi4uLi4uLi4uLi5cIilcbiAgICAgICAgICAgIF0pXG4gICAgICAgICAgXSlcbiAgICAgICAgXVxuICAgICAgKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcbiAgICAgICAgXCJkaXZcIixcbiAgICAgICAgeyBzdGF0aWNDbGFzczogXCJkZW1vLWlucHV0LXNpemVcIiB9LFxuICAgICAgICBbXG4gICAgICAgICAgX2MoXCJlbC1pbnB1dFwiLCB7XG4gICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICBwbGFjZWhvbGRlcjogXCLlj5HooajkvaDnmoTnnIvms5UuLi5cIixcbiAgICAgICAgICAgICAgXCJzdWZmaXgtaWNvblwiOiBcImVsLWljb24tZGF0ZVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IF92bS5ud2VtZXNzYWdlLFxuICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgX3ZtLm53ZW1lc3NhZ2UgPSAkJHZcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJud2VtZXNzYWdlXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFwiZWwtYnV0dG9uXCIsIHtcbiAgICAgICAgICAgIHN0YXRpY0NsYXNzOiBcInNlbmRtZXNzYWdlXCIsXG4gICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInByaW1hcnlcIiwgaWNvbjogXCJlbC1pY29uLWVkaXRcIiB9LFxuICAgICAgICAgICAgb246IHsgY2xpY2s6IF92bS5zZW5kbWVzc2FnZSB9XG4gICAgICAgICAgfSlcbiAgICAgICAgXSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgIF0sXG4gICAgMVxuICApXG59XG52YXIgc3RhdGljUmVuZGVyRm5zID0gW11cbnJlbmRlci5fd2l0aFN0cmlwcGVkID0gdHJ1ZVxudmFyIGVzRXhwb3J0cyA9IHsgcmVuZGVyOiByZW5kZXIsIHN0YXRpY1JlbmRlckZuczogc3RhdGljUmVuZGVyRm5zIH1cbmV4cG9ydCBkZWZhdWx0IGVzRXhwb3J0c1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAobW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKSAgICAgIC5yZXJlbmRlcihcImRhdGEtdi04ZDY0ZTkzY1wiLCBlc0V4cG9ydHMpXG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlcj97XCJpZFwiOlwiZGF0YS12LThkNjRlOTNjXCIsXCJoYXNTY29wZWRcIjpmYWxzZSxcImJ1YmxlXCI6e1widHJhbnNmb3Jtc1wiOnt9fX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvZGV0YWlscy52dWVcbi8vIG1vZHVsZSBpZCA9IDUzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi03YjRiNTM0YVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vdXNlci52dWVcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlc0NsaWVudC5qc1wiKShcIjEyN2ViZTQ2XCIsIGNvbnRlbnQsIGZhbHNlLCB7fSk7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG4gLy8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3NcbiBpZighY29udGVudC5sb2NhbHMpIHtcbiAgIG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi03YjRiNTM0YVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vdXNlci52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtN2I0YjUzNGFcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3VzZXIudnVlXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LTdiNGI1MzRhXCIsXCJzY29wZWRcIjpmYWxzZSxcImhhc0lubGluZUNvbmZpZ1wiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvdXNlci52dWVcbi8vIG1vZHVsZSBpZCA9IDU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodHJ1ZSk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJcXG4udXNlcmNvbnRlbnR7XFxuXFx0XFx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cXG59XFxuLnVzZXJjb250ZW50IC5pdGVtLnN0YXJ7XFxuXFx0XFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKDlweCk7XFxufVxcbi51c2VyY29udGVudCAuaXRlbS5zdGFyIHNwYW57XFxuXFx0XFx0Y29sb3I6ICMwMDc0RDk7XFxufVxcbi51c2VyY29udGVudCBhe1xcblxcdFxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cXHRcXHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuXFx0XFx0Y29sb3I6ICM4MDgwODA7XFxufVxcbi51c2VyY29udGVudCBhOmhvdmVye1xcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcbn1cXG4udXNlcmNvbnRlbnQgLnRleHQge1xcbiAgICBmb250LXNpemU6IDE0cHg7XFxufVxcbi51c2VyY29udGVudCAuaXRlbSB7XFxuICAgIG1hcmdpbi1ib3R0b206IDE4cHg7XFxuXFx0XFx0cG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG4uY2xlYXJmaXg6YmVmb3JlLFxcbiAgLmNsZWFyZml4OmFmdGVyIHtcXG4gICAgZGlzcGxheTogdGFibGU7XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbn1cXG4uY2xlYXJmaXg6YWZ0ZXIge1xcbiAgICBjbGVhcjogYm90aFxcbn1cXG4udXNlcmNvbnRlbnQgLmJveC1jYXJkIHtcXG4gICAgd2lkdGg6IDEwMCU7XFxuXFx0XFx0cG9zaXRpb246IHJlbGF0aXZlO1xcblxcdFxcdG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi51c2VyY29udGVudCAuY2xlYXJmaXggYXtcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXG5cXHRcXHR3aWR0aDogMTAwcHg7XFxuXFx0XFx0aGVpZ2h0OiAxMDBweDtcXG5cXHRcXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoNTMwcHgpO1xcblxcdFxcdGJvcmRlci1yYWRpdXM6IDUwcHg7XFxufVxcbi51c2VyY29udGVudCAuY2xlYXJmaXggYSBpbWd7XFxuXFx0XFx0d2lkdGg6IDEwMCU7XFxuXFx0XFx0aGVpZ2h0OjEwMCU7XFxuXFx0XFx0Ym9yZGVyLXJhZGl1czogNTBweDtcXG5cXHRcXHRkaXNwbGF5OiBibG9jaztcXG59XFxuLnVzZXJjb250ZW50IC5pbmZvcm1hdGlvbntcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFx0XFx0dG9wOiAwcHg7XFxuXFx0XFx0bGVmdDogNTAlO1xcbn1cXG4udXNlcmNvbnRlbnQgLmluZm9ybWF0aW9uIHB7XFxuXFx0XFx0bWFyZ2luOiAxMHB4O1xcbn1cXG4udXNlcmNvbnRlbnQgLmVkaXRidG57XFxuXFx0XFx0cG9zaXRpb246IGFic29sdXRlO1xcblxcdFxcdHJpZ2h0OiA0MDBweDtcXG5cXHRcXHR0b3A6IDQ1cHg7XFxufVxcbi51c2VyY29udGVudCAub3BlcmF0aW9ue1xcblxcdFxcdHdpZHRoOiAyMDBweDtcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFx0XFx0cmlnaHQ6IDBweDtcXG5cXHRcXHR0b3A6IDUwJTtcXG5cXHRcXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XFxufVxcbi51c2VyY29udGVudCAub3BlcmF0aW9uIGF7XFxuXFx0XFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcblxcdFxcdGNvbG9yOiB3aGl0ZTtcXG59XFxuXCIsIFwiXCIsIHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIkU6L0NNUy9jbXMtc3BhL3NyYy9jb21wb25lbnRzL3NyYy9jb21wb25lbnRzL3VzZXIudnVlXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCI7QUFpSUE7RUFDQSx1QkFBQTtDQUNBO0FBQ0E7RUFDQSwyQkFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0NBQ0E7QUFDQTtFQUNBLHNCQUFBO0VBQ0Esc0JBQUE7RUFDQSxlQUFBO0NBQ0E7QUFDQTtFQUNBLGVBQUE7Q0FDQTtBQUNBO0lBQ0EsZ0JBQUE7Q0FDQTtBQUVBO0lBQ0Esb0JBQUE7RUFDQSxtQkFBQTtDQUNBO0FBQ0E7O0lBRUEsZUFBQTtJQUNBLFlBQUE7Q0FDQTtBQUNBO0lBQ0EsV0FBQTtDQUNBO0FBRUE7SUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxpQkFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7RUFDQSw2QkFBQTtFQUNBLG9CQUFBO0NBQ0E7QUFDQTtFQUNBLFlBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0NBQ0E7QUFDQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7Q0FDQTtBQUNBO0VBQ0EsYUFBQTtDQUNBO0FBQ0E7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxVQUFBO0NBQ0E7QUFDQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0VBQ0EsNEJBQUE7Q0FDQTtBQUNBO0VBQ0Esc0JBQUE7RUFDQSxhQUFBO0NBQ0FcIixcImZpbGVcIjpcInVzZXIudnVlXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIjx0ZW1wbGF0ZT5cXG5cXHQ8ZWwtbWFpbiBjbGFzcz1cXFwidXNlcmNvbnRlbnRcXFwiPlxcclxcblxcdFxcdDxlbC1icmVhZGNydW1iIHNlcGFyYXRvcj1cXFwiL1xcXCIgY2xhc3M9XFxcIm5hdlxcXCI+XFxyXFxuXFx0XFx0XFx0PGVsLWJyZWFkY3J1bWItaXRlbSA6dG89XFxcInsgcGF0aDogJy8nIH1cXFwiPummlumhtTwvZWwtYnJlYWRjcnVtYi1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1icmVhZGNydW1iLWl0ZW0+PGEgaHJlZj1cXFwiamF2YXNjcmlwdDpcXFwiPnt7IGVkaXQ/J+aIkSc6IHVzZXIudXNlcm5hbWUgfX3nmoTkuKrkurrkuK3lv4M8L2E+PC9lbC1icmVhZGNydW1iLWl0ZW0+XFxyXFxuXFx0XFx0PC9lbC1icmVhZGNydW1iPlxcclxcblxcdFxcdDxoci8+XFxyXFxuXFx0XFx0PGVsLWNhcmQgY2xhc3M9XFxcImJveC1jYXJkXFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZGl2IHNsb3Q9XFxcImhlYWRlclxcXCIgY2xhc3M9XFxcImNsZWFyZml4XFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8YSBocmVmPVxcXCJqYXZhc2NyaXB0OlxcXCI+PGltZyA6c3JjPVxcXCJgaHR0cDovLzEyNy4wLjAuMTozMDAwJHt1c2VyLmF2YXRhcn1gXFxcIiBhbHQ9XFxcIlxcXCI+PC9hPlxcclxcblxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcImluZm9ybWF0aW9uXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cD48ZWwtdGFnPjxzcGFuIGNsYXNzPVxcXCJlbC1pY29uLWluZm9cXFwiPiA6IHt7IHVzZXIudXNlcm5hbWUgfX08L3NwYW4+PC9lbC10YWc+IDwvcD5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cD48ZWwtdGFnPjxzcGFuIGNsYXNzPVxcXCJlbC1pY29uLW1lc3NhZ2VcXFwiPiA6IHt7IHVzZXIuZW1haWwgfX08L3NwYW4+PC9lbC10YWc+IDwvcD5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cD48ZWwtdGFnPjxzcGFuIGNsYXNzPVxcXCJlbC1pY29uLXZpZXdcXFwiPiA6IHt7IHVzZXIuZ2VuZGFyPyflpbMnOifnlLcnIH19PC9zcGFuPjwvZWwtdGFnPiA8L3A+XFxyXFxuXFx0XFx0XFx0XFx0PC9kaXY+XFxyXFxuXFx0XFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwiZWRpdGJ0blxcXCIgdi1pZj1cXFwiZWRpdFxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGVsLWJ1dHRvbiB0eXBlPVxcXCJwcmltYXJ5XFxcIiBpY29uPVxcXCJlbC1pY29uLWVkaXQtb3V0bGluZVxcXCIgQGNsaWNrPVxcXCJ1c2VyZWRpdFxcXCIgY2lyY2xlPjwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDxoMyBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyO1xcXCI+e3sgZWRpdD8n5oiRJzon5LuWJyB9feeahOivnemimDwvaDM+XFxyXFxuXFx0XFx0XFx0PGhyLz5cXHJcXG5cXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJ0ZXh0IGl0ZW1cXFwiIHYtZm9yPVxcXCIodG9waWMsaW5kZXgpIGluIHRvcGljc1xcXCIgOmtleT1cXFwiaW5kZXhcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxkaXYgdi1zaG93PVxcXCJ0b3BpY3NbMF1cXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdDxoMz5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8YSA6aHJlZj1cXFwiYCMvZGV0YWlscy8ke3RvcGljLl9pZH1gXFxcIj57e3RvcGljLnRpdGxlfX08L2E+IFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0c2l6ZT1cXFwibWluaVxcXCJcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRzdHlsZT1cXFwiY29sb3I6ICM4ODg7XFxcIlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGRpc2FibGVkPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHt7IHRvcGljLnRvcGljdHlwZSB9fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1iYWRnZSA6dmFsdWU9XFxcInRvcGljLnN0YXJzLmxlbmd0aFxcXCIgOm1heD1cXFwiOTlcXFwiIGNsYXNzPVxcXCJpdGVtIHN0YXJcXFwiIHR5cGU9XFxcIndhcm5pbmdcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gc2l6ZT1cXFwibWluaVxcXCI+PHNwYW4gY2xhc3M9XFxcImVsLWljb24tc3Rhci1vblxcXCI+PC9zcGFuPjwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDwvZWwtYmFkZ2U+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9oMz5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cCBjbGFzcz1cXFwicHNcXFwiPuWPkeW4g+aXtumXtCA6IHt7IHRvcGljLmNyZWF0ZV90aW1lIH19PC9wPlxcclxcblxcdFxcdFxcdFxcdFxcdDxkaXYgY2xhc3M9XFxcIm9wZXJhdGlvblxcXCIgdi1pZj1cXFwib3BlcmF0aW9uXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8ZGl2IGNsYXNzPVxcXCJvcGVyYXRpb25cXFwiIHYtaWY9XFxcIm9wZXJhdGlvblxcXCIgc3R5bGU9XFxcImZsb2F0OiByaWdodDtcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgaWNvbj1cXFwiZWwtaWNvbi1lZGl0LW91dGxpbmVcXFwiIHNpemU9XFxcIm1pbmlcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDxhIDpocmVmPVxcXCJgIy90b3BpY2VkaXQvJHt0b3BpYy5faWR9YFxcXCI+57yW6L6RPC9hPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gdHlwZT1cXFwiZGFuZ2VyXFxcIiBpY29uPVxcXCJlbC1pY29uLWRlbGV0ZVxcXCIgc2l6ZT1cXFwibWluaVxcXCI+XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PGEgaHJlZj1cXFwiamF2YXNjcmlwdDpcXFwiIDpkYXRhLWlkPVxcXCJ0b3BpYy5faWRcXFwiIEBjbGljaz1cXFwiZGVsZXRldG9waWNcXFwiPuWIoOmZpDwvYT5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8L2Rpdj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8aHIvPlxcclxcblxcdFxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdDwvZWwtY2FyZD5cXHJcXG5cXHQ8L2VsLW1haW4+XFxuPC90ZW1wbGF0ZT5cXG5cXG48c2NyaXB0PlxcblxcdGV4cG9ydCBkZWZhdWx0IHtcXHJcXG4gICAgZGF0YSgpIHtcXHJcXG4gICAgICByZXR1cm4ge1xcclxcbiAgICAgICAgYWN0aXZlTmFtZTogJ3NlY29uZCcsXFxyXFxuXFx0XFx0XFx0XFx0dXNlciA6IHt9LFxcclxcblxcdFxcdFxcdFxcdGVkaXQgOiBmYWxzZSxcXHJcXG5cXHRcXHRcXHRcXHR0b3BpY3MgOiBbXSxcXHJcXG5cXHRcXHRcXHRcXHRvcGVyYXRpb24gOiBmYWxzZVxcclxcbiAgICAgIH07XFxyXFxuICAgIH0sXFxyXFxuICAgIG1ldGhvZHM6IHtcXHJcXG5cXHRcXHRcXHRhc3luYyB1c2VyZWRpdCgpe1xcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtkYXRhIDogY3VycmVudHVzZXJ9ID0gYXdhaXQgYXhpb3MuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvc2Vzc2lvbicpXFxyXFxuXFx0XFx0XFx0XFx0aWYoIWN1cnJlbnR1c2VyLnN0YXRlKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRyZXR1cm5cXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy4kcm91dGVyLnB1c2goYC91c2VyZWRpdC8ke2N1cnJlbnR1c2VyLnN0YXRlLl9pZH1gKVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0YXN5bmMgZGVsZXRldG9waWMoZSl7XFxyXFxuXFx0XFx0XFx0XFx0Y29uc3QgaWQgPSBlLnRhcmdldC5kYXRhc2V0W1xcXCJpZFxcXCJdXFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGE6dG9waWNkYXRhfSA9IGF3YWl0IGF4aW9zLmRlbGV0ZShgaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy8ke2lkfWApXFxyXFxuXFx0XFx0XFx0XFx0aWYodG9waWNkYXRhLmVyciA9PT0gXFxcIuayoeacieadg+mZkFxcXCIpe1xcclxcblxcdFxcdFxcdFxcdFxcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZydcXHJcXG5cXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRpZighdG9waWNkYXRhLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0dGhpcy4kbWVzc2FnZSh7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0bWVzc2FnZTogJ+WIoOmZpOaIkOWKnycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dHlwZTogJ3N1Y2Nlc3MnLFxcclxcblxcdFxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0XFx0dGhpcy5nZXR1c2Vyb25lKClcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0fSxcXHJcXG5cXHRcXHRcXHRhc3luYyBnZXR1c2Vyb25lKCkge1xcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7ZGF0YX0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2Vycz9faWQ9JytpZClcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLnVzZXIgPSBkYXRhWzBdXFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGEgOiB1c2VydG9waWNzfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy91c2VydG9waWNzP3VzZXJfaWQ9JytpZClcXHJcXG5cXHRcXHRcXHRcXHRpZighdXNlcnRvcGljcy5lcnIpe1xcclxcblxcdFxcdFxcdFxcdFxcdHVzZXJ0b3BpY3MuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdHN3aXRjaChpdGVtLnRvcGljdHlwZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAndGVjaG5vbG9neScgOiBpdGVtLnRvcGljdHlwZSA9ICfmioDmnK8nXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnbGl0ZXJhdHVyZScgOiBpdGVtLnRvcGljdHlwZSA9ICfmloflraYnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnU3BvcnRzJyA6IGl0ZW0udG9waWN0eXBlID0gJ+S9k+iCsidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRjYXNlICdlbnRlcnRhaW5tZW50JyA6IGl0ZW0udG9waWN0eXBlID0gJ+WoseS5kCdcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRjYXNlICdtZXRhcGh5c2ljcycgOiBpdGVtLnRvcGljdHlwZSA9ICfnjoTlraYnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0ZGVmYXVsdCA6IGl0ZW0udG9waWN0eXBlID0gJ+acquefpSdcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLnRvcGljcyA9IHVzZXJ0b3BpY3NcXHJcXG5cXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2RhdGEgOiBjdXJyZW50dXNlcn0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcXHJcXG5cXHRcXHRcXHRcXHRpZighY3VycmVudHVzZXIuc3RhdGUpe1xcclxcblxcdFxcdFxcdFxcdFxcdHJldHVyblxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRpZihpZCA9PT0gY3VycmVudHVzZXIuc3RhdGUuX2lkKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHR0aGlzLmVkaXQgPSB0cnVlXFxyXFxuXFx0XFx0XFx0XFx0XFx0dGhpcy5vcGVyYXRpb24gPSB0cnVlXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH1cXHJcXG4gICAgfSxcXHJcXG5cXHRcXHRjcmVhdGVkKCl7XFxyXFxuXFx0XFx0XFx0dGhpcy5nZXR1c2Vyb25lKClcXHJcXG5cXHRcXHR9XFxyXFxuICB9XFxuPC9zY3JpcHQ+XFxuXFxuPHN0eWxlPlxcclxcblxcdC51c2VyY29udGVudHtcXHJcXG5cXHRcXHQvKiBtYXJnaW4tdG9wOiA2MXB4OyAqL1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmNvbnRlbnQgLml0ZW0uc3RhcntcXHJcXG5cXHRcXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOXB4KTtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IC5pdGVtLnN0YXIgc3BhbntcXHJcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IGF7XFxyXFxuXFx0XFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcblxcdFxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG5cXHRcXHRjb2xvcjogIzgwODA4MDtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IGE6aG92ZXJ7XFxyXFxuXFx0XFx0Y29sb3I6ICMwMDc0RDk7XFxyXFxuXFx0fVxcbi51c2VyY29udGVudCAudGV4dCB7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gIH1cXHJcXG5cXHJcXG4gIC51c2VyY29udGVudCAuaXRlbSB7XFxyXFxuICAgIG1hcmdpbi1ib3R0b206IDE4cHg7XFxyXFxuXFx0XFx0cG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgfVxcclxcbiAgLmNsZWFyZml4OmJlZm9yZSxcXHJcXG4gIC5jbGVhcmZpeDphZnRlciB7XFxyXFxuICAgIGRpc3BsYXk6IHRhYmxlO1xcclxcbiAgICBjb250ZW50OiBcXFwiXFxcIjtcXHJcXG4gIH1cXHJcXG4gIC5jbGVhcmZpeDphZnRlciB7XFxyXFxuICAgIGNsZWFyOiBib3RoXFxyXFxuICB9XFxyXFxuXFxyXFxuICAudXNlcmNvbnRlbnQgLmJveC1jYXJkIHtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuXFx0XFx0cG9zaXRpb246IHJlbGF0aXZlO1xcclxcblxcdFxcdG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICB9XFxyXFxuXFx0LnVzZXJjb250ZW50IC5jbGVhcmZpeCBhe1xcclxcblxcdFxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdFxcdHdpZHRoOiAxMDBweDtcXHJcXG5cXHRcXHRoZWlnaHQ6IDEwMHB4O1xcclxcblxcdFxcdHRyYW5zZm9ybTogdHJhbnNsYXRlWCg1MzBweCk7XFxyXFxuXFx0XFx0Ym9yZGVyLXJhZGl1czogNTBweDtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IC5jbGVhcmZpeCBhIGltZ3tcXHJcXG5cXHRcXHR3aWR0aDogMTAwJTtcXHJcXG5cXHRcXHRoZWlnaHQ6MTAwJTtcXHJcXG5cXHRcXHRib3JkZXItcmFkaXVzOiA1MHB4O1xcclxcblxcdFxcdGRpc3BsYXk6IGJsb2NrO1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmNvbnRlbnQgLmluZm9ybWF0aW9ue1xcclxcblxcdFxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRcXHR0b3A6IDBweDtcXHJcXG5cXHRcXHRsZWZ0OiA1MCU7XFxyXFxuXFx0fVxcclxcblxcdC51c2VyY29udGVudCAuaW5mb3JtYXRpb24gcHtcXHJcXG5cXHRcXHRtYXJnaW46IDEwcHg7XFxyXFxuXFx0fVxcclxcblxcdC51c2VyY29udGVudCAuZWRpdGJ0bntcXHJcXG5cXHRcXHRwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuXFx0XFx0cmlnaHQ6IDQwMHB4O1xcclxcblxcdFxcdHRvcDogNDVweDtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IC5vcGVyYXRpb257XFxyXFxuXFx0XFx0d2lkdGg6IDIwMHB4O1xcclxcblxcdFxcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG5cXHRcXHRyaWdodDogMHB4O1xcclxcblxcdFxcdHRvcDogNTAlO1xcclxcblxcdFxcdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJjb250ZW50IC5vcGVyYXRpb24gYXtcXHJcXG5cXHRcXHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuXFx0XFx0Y29sb3I6IHdoaXRlO1xcclxcblxcdH1cXG48L3N0eWxlPlxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi03YjRiNTM0YVwiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3VzZXIudnVlXG4vLyBtb2R1bGUgaWQgPSA1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFxuICAgIFwiZWwtbWFpblwiLFxuICAgIHsgc3RhdGljQ2xhc3M6IFwidXNlcmNvbnRlbnRcIiB9LFxuICAgIFtcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWJyZWFkY3J1bWJcIixcbiAgICAgICAgeyBzdGF0aWNDbGFzczogXCJuYXZcIiwgYXR0cnM6IHsgc2VwYXJhdG9yOiBcIi9cIiB9IH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcImVsLWJyZWFkY3J1bWItaXRlbVwiLCB7IGF0dHJzOiB7IHRvOiB7IHBhdGg6IFwiL1wiIH0gfSB9LCBbXG4gICAgICAgICAgICBfdm0uX3YoXCLpppbpobVcIilcbiAgICAgICAgICBdKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFwiZWwtYnJlYWRjcnVtYi1pdGVtXCIsIFtcbiAgICAgICAgICAgIF9jKFwiYVwiLCB7IGF0dHJzOiB7IGhyZWY6IFwiamF2YXNjcmlwdDpcIiB9IH0sIFtcbiAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyhfdm0uZWRpdCA/IFwi5oiRXCIgOiBfdm0udXNlci51c2VybmFtZSkgKyBcIueahOS4quS6uuS4reW/g1wiKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICBdKVxuICAgICAgICBdLFxuICAgICAgICAxXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwiaHJcIiksXG4gICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgX2MoXG4gICAgICAgIFwiZWwtY2FyZFwiLFxuICAgICAgICB7IHN0YXRpY0NsYXNzOiBcImJveC1jYXJkXCIgfSxcbiAgICAgICAgW1xuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6IFwiY2xlYXJmaXhcIixcbiAgICAgICAgICAgICAgYXR0cnM6IHsgc2xvdDogXCJoZWFkZXJcIiB9LFxuICAgICAgICAgICAgICBzbG90OiBcImhlYWRlclwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImFcIiwgeyBhdHRyczogeyBocmVmOiBcImphdmFzY3JpcHQ6XCIgfSB9LCBbXG4gICAgICAgICAgICAgICAgX2MoXCJpbWdcIiwge1xuICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgc3JjOiBcImh0dHA6Ly8xMjcuMC4wLjE6MzAwMFwiICsgX3ZtLnVzZXIuYXZhdGFyLFxuICAgICAgICAgICAgICAgICAgICBhbHQ6IFwiXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBdKSxcbiAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgX2MoXCJkaXZcIiwgeyBzdGF0aWNDbGFzczogXCJpbmZvcm1hdGlvblwiIH0sIFtcbiAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgIFwicFwiLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBfYyhcImVsLXRhZ1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIHsgc3RhdGljQ2xhc3M6IFwiZWwtaWNvbi1pbmZvXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIDogXCIgKyBfdm0uX3MoX3ZtLnVzZXIudXNlcm5hbWUpKVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgIFwicFwiLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBfYyhcImVsLXRhZ1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIHsgc3RhdGljQ2xhc3M6IFwiZWwtaWNvbi1tZXNzYWdlXCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIDogXCIgKyBfdm0uX3MoX3ZtLnVzZXIuZW1haWwpKVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgIFwicFwiLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICBfYyhcImVsLXRhZ1wiLCBbXG4gICAgICAgICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIHsgc3RhdGljQ2xhc3M6IFwiZWwtaWNvbi12aWV3XCIgfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIDogXCIgKyBfdm0uX3MoX3ZtLnVzZXIuZ2VuZGFyID8gXCLlpbNcIiA6IFwi55S3XCIpKVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF92bS5lZGl0XG4gICAgICAgICAgICAgICAgPyBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJlZGl0YnRuXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFwiZWwtYnV0dG9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicHJpbWFyeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcImVsLWljb24tZWRpdC1vdXRsaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNpcmNsZTogXCJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uOiB7IGNsaWNrOiBfdm0udXNlcmVkaXQgfVxuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICA6IF92bS5fZSgpXG4gICAgICAgICAgICBdXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFwiaDNcIiwgeyBzdGF0aWNTdHlsZTogeyBcInRleHQtYWxpZ25cIjogXCJjZW50ZXJcIiB9IH0sIFtcbiAgICAgICAgICAgIF92bS5fdihfdm0uX3MoX3ZtLmVkaXQgPyBcIuaIkVwiIDogXCLku5ZcIikgKyBcIueahOivnemimFwiKVxuICAgICAgICAgIF0pLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXCJoclwiKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF92bS5fbChfdm0udG9waWNzLCBmdW5jdGlvbih0b3BpYywgaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBfYyhcImRpdlwiLCB7IGtleTogaW5kZXgsIHN0YXRpY0NsYXNzOiBcInRleHQgaXRlbVwiIH0sIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJkaXZcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBcInNob3dcIixcbiAgICAgICAgICAgICAgICAgICAgICByYXdOYW1lOiBcInYtc2hvd1wiLFxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0udG9waWNzWzBdLFxuICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwidG9waWNzWzBdXCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgIFwiaDNcIixcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgIF9jKFwiYVwiLCB7IGF0dHJzOiB7IGhyZWY6IFwiIy9kZXRhaWxzL1wiICsgdG9waWMuX2lkIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyh0b3BpYy50aXRsZSkpXG4gICAgICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY1N0eWxlOiB7IGNvbG9yOiBcIiM4ODhcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBzaXplOiBcIm1pbmlcIiwgZGlzYWJsZWQ6IFwiXCIgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiXFxuXFx0XFx0XFx0XFx0XFx0XFx0XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl9zKHRvcGljLnRvcGljdHlwZSkgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cXHRcXHRcXHRcXHRcXHRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlbC1iYWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJpdGVtIHN0YXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdG9waWMuc3RhcnMubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heDogOTksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJlbC1idXR0b25cIiwgeyBhdHRyczogeyBzaXplOiBcIm1pbmlcIiB9IH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYyhcInNwYW5cIiwgeyBzdGF0aWNDbGFzczogXCJlbC1pY29uLXN0YXItb25cIiB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJwXCIsIHsgc3RhdGljQ2xhc3M6IFwicHNcIiB9LCBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fdihcIuWPkeW4g+aXtumXtCA6IFwiICsgX3ZtLl9zKHRvcGljLmNyZWF0ZV90aW1lKSlcbiAgICAgICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF92bS5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgPyBfYyhcImRpdlwiLCB7IHN0YXRpY0NsYXNzOiBcIm9wZXJhdGlvblwiIH0sIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIF92bS5vcGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBfYyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGl2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRpY0NsYXNzOiBcIm9wZXJhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNTdHlsZTogeyBmbG9hdDogXCJyaWdodFwiIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwcmltYXJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IFwiZWwtaWNvbi1lZGl0LW91dGxpbmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogXCJtaW5pXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmOiBcIiMvdG9waWNlZGl0L1wiICsgdG9waWMuX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbX3ZtLl92KFwi57yW6L6RXCIpXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImRhbmdlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBcImVsLWljb24tZGVsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IFwibWluaVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZjogXCJqYXZhc2NyaXB0OlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJkYXRhLWlkXCI6IHRvcGljLl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb246IHsgY2xpY2s6IF92bS5kZWxldGV0b3BpYyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtfdm0uX3YoXCLliKDpmaRcIildXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBfdm0uX2UoKVxuICAgICAgICAgICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICAgICAgICAgIDogX3ZtLl9lKCksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJoclwiKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXSlcbiAgICAgICAgICB9KVxuICAgICAgICBdLFxuICAgICAgICAyXG4gICAgICApXG4gICAgXSxcbiAgICAxXG4gIClcbn1cbnZhciBzdGF0aWNSZW5kZXJGbnMgPSBbXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG52YXIgZXNFeHBvcnRzID0geyByZW5kZXI6IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zOiBzdGF0aWNSZW5kZXJGbnMgfVxuZXhwb3J0IGRlZmF1bHQgZXNFeHBvcnRzXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmIChtb2R1bGUuaG90LmRhdGEpIHtcbiAgICByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpICAgICAgLnJlcmVuZGVyKFwiZGF0YS12LTdiNGI1MzRhXCIsIGVzRXhwb3J0cylcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3RlbXBsYXRlLWNvbXBpbGVyP3tcImlkXCI6XCJkYXRhLXYtN2I0YjUzNGFcIixcImhhc1Njb3BlZFwiOmZhbHNlLFwiYnVibGVcIjp7XCJ0cmFuc2Zvcm1zXCI6e319fSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy91c2VyLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTFhMjM0ZjU5XFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi90b3BpY2VkaXQudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikoXCJhZTFkNmNjOFwiLCBjb250ZW50LCBmYWxzZSwge30pO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuIC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG4gaWYoIWNvbnRlbnQubG9jYWxzKSB7XG4gICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMWEyMzRmNTlcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3RvcGljZWRpdC52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtMWEyMzRmNTlcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3RvcGljZWRpdC52dWVcIik7XG4gICAgIGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuICAgICB1cGRhdGUobmV3Q29udGVudCk7XG4gICB9KTtcbiB9XG4gLy8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuIG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1zdHlsZS1sb2FkZXIhLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtMWEyMzRmNTlcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuLnRvcGljZWRpdHtcXHJcXG5cXHQvKiBtYXJnaW4tdG9wOiA2MXB4OyAqL1xcbn1cXG4uZGVtby1ydWxlRm9ybXtcXG59XFxuLm5hdntcXHJcXG5cXHRtYXJnaW4tdG9wOiAwcHg7XFxyXFxuXFx0bWFyZ2luLWJvdHRvbTogMjBweDtcXG59XFxuLmVsLXRleHRhcmVhX19pbm5lcntcXHJcXG5cXHRtaW4taGVpZ2h0OiAyNTBweCAhaW1wb3J0YW50O1xcbn1cXHJcXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiRTovQ01TL2Ntcy1zcGEvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdG9waWNlZGl0LnZ1ZVwiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiO0FBK0dBO0NBQ0EsdUJBQUE7Q0FDQTtBQUNBO0NBRUE7QUFDQTtDQUNBLGdCQUFBO0NBQ0Esb0JBQUE7Q0FDQTtBQUNBO0NBQ0EsNkJBQUE7Q0FDQVwiLFwiZmlsZVwiOlwidG9waWNlZGl0LnZ1ZVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCI8dGVtcGxhdGU+XFxyXFxuXFx0PGVsLW1haW4gY2xhc3M9XFxcInRvcGljZWRpdFxcXCI+XFxyXFxuXFx0PGVsLWZvcm0gOm1vZGVsPVxcXCJydWxlRm9ybVxcXCIgOnJ1bGVzPVxcXCJydWxlc1xcXCIgcmVmPVxcXCJydWxlRm9ybVxcXCIgbGFiZWwtd2lkdGg9XFxcIjEwMHB4XFxcIiBjbGFzcz1cXFwiZGVtby1ydWxlRm9ybVxcXCI+XFxyXFxuXFx0XFx0PGVsLWJyZWFkY3J1bWIgc2VwYXJhdG9yPVxcXCIvXFxcIiBjbGFzcz1cXFwibmF2XFxcIj5cXHJcXG5cXHRcXHRcXHQ8ZWwtYnJlYWRjcnVtYi1pdGVtIDp0bz1cXFwieyBwYXRoOiAnLycgfVxcXCI+6aaW6aG1PC9lbC1icmVhZGNydW1iLWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLWJyZWFkY3J1bWItaXRlbT48YSBocmVmPVxcXCIjL3JlbGVhc2VcXFwiPuivnemimOe8lui+kTwvYT48L2VsLWJyZWFkY3J1bWItaXRlbT5cXHJcXG5cXHRcXHQ8L2VsLWJyZWFkY3J1bWI+XFxyXFxuXFx0XFx0PGhyLz5cXHJcXG5cXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLor53popjliIbnsbtcXFwiIHByb3A9XFxcInRvcGljdHlwZVxcXCI+XFxyXFxuXFx0XFx0XFx0PGVsLXNlbGVjdCB2LW1vZGVsPVxcXCJydWxlRm9ybS50b3BpY3R5cGVcXFwiIHBsYWNlaG9sZGVyPVxcXCLor7fpgInmi6nor53popjliIbnsbtcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1vcHRpb24gbGFiZWw9XFxcIuaKgOacr1xcXCIgdmFsdWU9XFxcInRlY2hub2xvZ3lcXFwiPjwvZWwtb3B0aW9uPlxcclxcblxcdFxcdFxcdFxcdDxlbC1vcHRpb24gbGFiZWw9XFxcIuaWh+WtplxcXCIgdmFsdWU9XFxcImxpdGVyYXR1cmVcXFwiPjwvZWwtb3B0aW9uPlxcclxcblxcdFxcdFxcdFxcdDxlbC1vcHRpb24gbGFiZWw9XFxcIuS9k+iCslxcXCIgdmFsdWU9XFxcIlNwb3J0c1xcXCI+PC9lbC1vcHRpb24+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLW9wdGlvbiBsYWJlbD1cXFwi5aix5LmQXFxcIiB2YWx1ZT1cXFwiZW50ZXJ0YWlubWVudFxcXCI+PC9lbC1vcHRpb24+XFxyXFxuXFx0XFx0XFx0XFx0PGVsLW9wdGlvbiBsYWJlbD1cXFwi546E5a2mXFxcIiB2YWx1ZT1cXFwibWV0YXBoeXNpY3NcXFwiPjwvZWwtb3B0aW9uPlxcclxcblxcdFxcdFxcdDwvZWwtc2VsZWN0PlxcclxcblxcdFxcdDwvZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XFxcIuagh+mimFxcXCIgcHJvcD1cXFwidGl0bGVcXFwiPlxcclxcblxcdFxcdFxcdDxlbC1pbnB1dCB2LW1vZGVsPVxcXCJydWxlRm9ybS50aXRsZVxcXCI+PC9lbC1pbnB1dD5cXHJcXG5cXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHQ8ZWwtZm9ybS1pdGVtIGxhYmVsPVxcXCLor53popjlhoXlrrlcXFwiIHByb3A9XFxcImNvbnRlbnRcXFwiPlxcclxcblxcdFxcdFxcdDxlbC1pbnB1dCB0eXBlPVxcXCJ0ZXh0YXJlYVxcXCIgdi1tb2RlbD1cXFwicnVsZUZvcm0uY29udGVudFxcXCIgY29scz1cXFwiODBcXFwiIGNsYXNzPVxcXCIudGV4dGFyZWFcXFwiPjwvZWwtaW5wdXQ+XFxyXFxuXFx0XFx0XFx0PCEtLSA8dGV4dGFyZWEgbmFtZT1cXFwiXFxcIiBpZD1cXFwiXFxcIiBjb2xzPVxcXCIxMDBcXFwiIHJvd3M9XFxcIjIwXFxcIiB2LW1vZGVsPVxcXCJydWxlRm9ybS5kZXNjXFxcIiBjbGFzcz1cXFwiLnRleHRhcmVhXFxcIj48L3RleHRhcmVhPiAtLT5cXHJcXG5cXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHQ8ZWwtZm9ybS1pdGVtPlxcclxcblxcdFxcdFxcdDxlbC1idXR0b24gdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzdWJtaXRGb3JtKCdydWxlRm9ybScpXFxcIj7mj5DkuqQ8L2VsLWJ1dHRvbj5cXHJcXG5cXHRcXHQ8L2VsLWZvcm0taXRlbT5cXHJcXG5cXHQ8L2VsLWZvcm0+XFxyXFxuXFx0PC9lbC1tYWluPlxcclxcbjwvdGVtcGxhdGU+XFxyXFxuXFxyXFxuPHNjcmlwdD5cXHJcXG5cXHRpbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXFxyXFxuXFx0ZXhwb3J0IGRlZmF1bHQge1xcclxcblxcdFxcdGRhdGEoKSB7XFxyXFxuXFx0XFx0XFx0cmV0dXJuIHtcXHJcXG5cXHRcXHRcXHRcXHRydWxlRm9ybToge1xcclxcblxcdFxcdFxcdFxcdFxcdHRpdGxlOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHR0b3BpY3R5cGU6ICcnLFxcclxcblxcdFxcdFxcdFxcdFxcdGNvbnRlbnQ6ICcnXFxyXFxuXFx0XFx0XFx0XFx0fSxcXHJcXG5cXHRcXHRcXHRcXHRydWxlczoge1xcclxcblxcdFxcdFxcdFxcdFxcdHRpdGxlOiBbe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHJlcXVpcmVkOiB0cnVlLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfmoIfpopjkuI3og73kuLrnqbonLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHRyaWdnZXI6ICdibHVyJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0e1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdG1pbjogMixcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRtYXg6IDMwLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfplb/luqblnKggMiDliLAgMzAg5Liq5a2X56ymJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHR0b3BpY3R5cGU6IFt7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0cmVxdWlyZWQ6IHRydWUsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0bWVzc2FnZTogJ+ivt+mAieaLqeivnemimOexu+WeiycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dHJpZ2dlcjogJ2NoYW5nZSdcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRjb250ZW50OiBbe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdHJlcXVpcmVkOiB0cnVlLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfor53popjlhoXlrrnkuI3og73kuLrnqbonLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHRyaWdnZXI6ICdibHVyJ1xcclxcblxcdFxcdFxcdFxcdFxcdH1dXFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRtZXRob2RzOiB7XFxyXFxuXFx0XFx0XFx0c3VibWl0Rm9ybShmb3JtTmFtZSkge1xcclxcblxcdFxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRcXHR0aGlzLiRyZWZzW2Zvcm1OYW1lXS52YWxpZGF0ZShhc3luYyAodmFsaWQpID0+IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRpZiAodmFsaWQpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjb25zdCB7ZGF0YTp0b3BpY2RhdGF9ID0gYXdhaXQgYXhpb3MucGF0Y2goYGh0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MvJHtpZH1gLHRoaXMucnVsZUZvcm0pXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYodG9waWNkYXRhLmVyciA9PT0gXFxcIuayoeacieadg+mZkFxcXCIpe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn6K+35YWI55m75b2VJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0Y3VzdG9tQ2xhc3MgOiAnbWVzc2FnZSdcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRpZighdG9waWNkYXRhLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0dGhpcy4kbWVzc2FnZSh7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0bWVzc2FnZTogJ+abtOaWsOaIkOWKnycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0dHlwZTogJ3N1Y2Nlc3MnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0aGlzLiRyb3V0ZXIuZ28oLTEpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdH0gZWxzZSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y29uc29sZS5sb2coJ2Vycm9yIHN1Ym1pdCEhJyk7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0cmV0dXJuIGZhbHNlO1xcclxcblxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHR9KTtcXHJcXG5cXHRcXHRcXHR9LFxcclxcblxcdFxcdFxcdHJlc2V0Rm9ybShmb3JtTmFtZSkge1xcclxcblxcdFxcdFxcdFxcdHRoaXMuJHJlZnNbZm9ybU5hbWVdLnJlc2V0RmllbGRzKCk7XFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcdH0sXFxyXFxuXFx0XFx0YXN5bmMgY3JlYXRlZCgpe1xcclxcblxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRjb25zdCB7ZGF0YSA6IHRvcGljfSA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3RvcGljcy9kZXRhaWxzP19pZD0nK2lkKVxcclxcblxcdFxcdFxcdGlmKHRvcGljLmVycil7XFxyXFxuXFx0XFx0XFx0XFx0cmV0dXJuXFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdHRoaXMucnVsZUZvcm0uY29udGVudCA9IHRvcGljLmNvbnRlbnRcXHJcXG5cXHRcXHRcXHR0aGlzLnJ1bGVGb3JtLnRpdGxlID0gdG9waWMudGl0bGVcXHJcXG5cXHRcXHRcXHR0aGlzLnJ1bGVGb3JtLnRvcGljdHlwZSA9IHRvcGljLnRvcGljdHlwZVxcclxcblxcdFxcdH1cXHJcXG5cXHR9XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXFxyXFxuPHN0eWxlPlxcclxcbi50b3BpY2VkaXR7XFxyXFxuXFx0LyogbWFyZ2luLXRvcDogNjFweDsgKi9cXHJcXG59XFxyXFxuLmRlbW8tcnVsZUZvcm17XFxyXFxuXFx0XFxyXFxufVxcclxcbi5uYXZ7XFxyXFxuXFx0bWFyZ2luLXRvcDogMHB4O1xcclxcblxcdG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxufVxcclxcbi5lbC10ZXh0YXJlYV9faW5uZXJ7XFxyXFxuXFx0bWluLWhlaWdodDogMjUwcHggIWltcG9ydGFudDtcXHJcXG59XFxyXFxuPC9zdHlsZT5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtMWEyMzRmNTlcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy90b3BpY2VkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSA1OFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gIHZhciBfdm0gPSB0aGlzXG4gIHZhciBfaCA9IF92bS4kY3JlYXRlRWxlbWVudFxuICB2YXIgX2MgPSBfdm0uX3NlbGYuX2MgfHwgX2hcbiAgcmV0dXJuIF9jKFxuICAgIFwiZWwtbWFpblwiLFxuICAgIHsgc3RhdGljQ2xhc3M6IFwidG9waWNlZGl0XCIgfSxcbiAgICBbXG4gICAgICBfYyhcbiAgICAgICAgXCJlbC1mb3JtXCIsXG4gICAgICAgIHtcbiAgICAgICAgICByZWY6IFwicnVsZUZvcm1cIixcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJkZW1vLXJ1bGVGb3JtXCIsXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIG1vZGVsOiBfdm0ucnVsZUZvcm0sXG4gICAgICAgICAgICBydWxlczogX3ZtLnJ1bGVzLFxuICAgICAgICAgICAgXCJsYWJlbC13aWR0aFwiOiBcIjEwMHB4XCJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfYyhcbiAgICAgICAgICAgIFwiZWwtYnJlYWRjcnVtYlwiLFxuICAgICAgICAgICAgeyBzdGF0aWNDbGFzczogXCJuYXZcIiwgYXR0cnM6IHsgc2VwYXJhdG9yOiBcIi9cIiB9IH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFwiZWwtYnJlYWRjcnVtYi1pdGVtXCIsIHsgYXR0cnM6IHsgdG86IHsgcGF0aDogXCIvXCIgfSB9IH0sIFtcbiAgICAgICAgICAgICAgICBfdm0uX3YoXCLpppbpobVcIilcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFwiZWwtYnJlYWRjcnVtYi1pdGVtXCIsIFtcbiAgICAgICAgICAgICAgICBfYyhcImFcIiwgeyBhdHRyczogeyBocmVmOiBcIiMvcmVsZWFzZVwiIH0gfSwgW192bS5fdihcIuivnemimOe8lui+kVwiKV0pXG4gICAgICAgICAgICAgIF0pXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgICksXG4gICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICBfYyhcImhyXCIpLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImVsLWZvcm0taXRlbVwiLFxuICAgICAgICAgICAgeyBhdHRyczogeyBsYWJlbDogXCLor53popjliIbnsbtcIiwgcHJvcDogXCJ0b3BpY3R5cGVcIiB9IH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICAgIFwiZWwtc2VsZWN0XCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgcGxhY2Vob2xkZXI6IFwi6K+36YCJ5oup6K+d6aKY5YiG57G7XCIgfSxcbiAgICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0ucnVsZUZvcm0udG9waWN0eXBlLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtLCBcInRvcGljdHlwZVwiLCAkJHYpXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb246IFwicnVsZUZvcm0udG9waWN0eXBlXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIF9jKFwiZWwtb3B0aW9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgbGFiZWw6IFwi5oqA5pyvXCIsIHZhbHVlOiBcInRlY2hub2xvZ3lcIiB9XG4gICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLW9wdGlvblwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzOiB7IGxhYmVsOiBcIuaWh+WtplwiLCB2YWx1ZTogXCJsaXRlcmF0dXJlXCIgfVxuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1vcHRpb25cIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBsYWJlbDogXCLkvZPogrJcIiwgdmFsdWU6IFwiU3BvcnRzXCIgfVxuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1vcHRpb25cIiwge1xuICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBsYWJlbDogXCLlqLHkuZBcIiwgdmFsdWU6IFwiZW50ZXJ0YWlubWVudFwiIH1cbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgICAgICAgICAgICAgIF9jKFwiZWwtb3B0aW9uXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgbGFiZWw6IFwi546E5a2mXCIsIHZhbHVlOiBcIm1ldGFwaHlzaWNzXCIgfVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIDFcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImVsLWZvcm0taXRlbVwiLFxuICAgICAgICAgICAgeyBhdHRyczogeyBsYWJlbDogXCLmoIfpophcIiwgcHJvcDogXCJ0aXRsZVwiIH0gfSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXCJlbC1pbnB1dFwiLCB7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdm0ucnVsZUZvcm0udGl0bGUsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybSwgXCJ0aXRsZVwiLCAkJHYpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJydWxlRm9ybS50aXRsZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApLFxuICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgX2MoXG4gICAgICAgICAgICBcImVsLWZvcm0taXRlbVwiLFxuICAgICAgICAgICAgeyBhdHRyczogeyBsYWJlbDogXCLor53popjlhoXlrrlcIiwgcHJvcDogXCJjb250ZW50XCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcImVsLWlucHV0XCIsIHtcbiAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCIudGV4dGFyZWFcIixcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInRleHRhcmVhXCIsIGNvbHM6IFwiODBcIiB9LFxuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnJ1bGVGb3JtLmNvbnRlbnQsXG4gICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgIF92bS4kc2V0KF92bS5ydWxlRm9ybSwgXCJjb250ZW50XCIsICQkdilcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInJ1bGVGb3JtLmNvbnRlbnRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiBcInByaW1hcnlcIiB9LFxuICAgICAgICAgICAgICAgICAgb246IHtcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgIF92bS5zdWJtaXRGb3JtKFwicnVsZUZvcm1cIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW192bS5fdihcIuaPkOS6pFwiKV1cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIDFcbiAgICAgICAgICApXG4gICAgICAgIF0sXG4gICAgICAgIDFcbiAgICAgIClcbiAgICBdLFxuICAgIDFcbiAgKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtMWEyMzRmNTlcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi0xYTIzNGY1OVwiLFwiaGFzU2NvcGVkXCI6ZmFsc2UsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL3RvcGljZWRpdC52dWVcbi8vIG1vZHVsZSBpZCA9IDU5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi00YmUyMTVlNVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vdXNlcmVkaXQudnVlXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXNDbGllbnQuanNcIikoXCI2ZTgwNjBlNlwiLCBjb250ZW50LCBmYWxzZSwge30pO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuIC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG4gaWYoIWNvbnRlbnQubG9jYWxzKSB7XG4gICBtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNGJlMjE1ZTVcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3VzZXJlZGl0LnZ1ZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgdmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9zb3VyY2VNYXAhLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyL2luZGV4LmpzP3tcXFwidnVlXFxcIjp0cnVlLFxcXCJpZFxcXCI6XFxcImRhdGEtdi00YmUyMTVlNVxcXCIsXFxcInNjb3BlZFxcXCI6ZmFsc2UsXFxcImhhc0lubGluZUNvbmZpZ1xcXCI6ZmFsc2V9IS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vdXNlcmVkaXQudnVlXCIpO1xuICAgICBpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcbiAgICAgdXBkYXRlKG5ld0NvbnRlbnQpO1xuICAgfSk7XG4gfVxuIC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3NcbiBtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtc3R5bGUtbG9hZGVyIS4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/c291cmNlTWFwIS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3N0eWxlLWNvbXBpbGVyP3tcInZ1ZVwiOnRydWUsXCJpZFwiOlwiZGF0YS12LTRiZTIxNWU1XCIsXCJzY29wZWRcIjpmYWxzZSxcImhhc0lubGluZUNvbmZpZ1wiOmZhbHNlfSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXN0eWxlcyZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSA2MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHRydWUpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiXFxuLnVzZXJlZGl0e1xcblxcdHBhZGRpbmc6IDIwcHggMzAwcHg7XFxuXFx0cGFkZGluZy10b3A6IDEwcHg7XFxuXFx0YmFja2dyb3VuZC1jb2xvcjogI2NjYztcXG5cXHRwYWRkaW5nLWJvdHRvbTogMTM4cHg7XFxufVxcbi51c2VyZWRpdCBwe1xcblxcdG1hcmdpbjogMDtcXG59XFxuLnVzZXJlZGl0IGF7XFxuXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblxcdGNvbG9yOiAjMDAwO1xcblxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cXHRwYWRkaW5nOiAwIDVweDtcXG5cXHRmb250LXNpemU6IDE0cHg7XFxufVxcbi51c2VyZWRpdCBzcGFuOmZpcnN0LWNoaWxkIGE6aG92ZXJ7XFxuXFx0Y29sb3I6ICMwMDc0RDk7XFxufVxcbi51c2VyZWRpdCBzcGFuOmxhc3QtY2hpbGQgYXtcXG5cXHRjb2xvcjogI2ZmZjtcXG59XFxuLnVzZXJlZGl0IC5yZWdpc3RlciB7XFxuXFx0d2lkdGg6IDUwMHB4O1xcblxcdHBhZGRpbmc6IDQwcHg7XFxuXFx0cGFkZGluZy1yaWdodDogNzBweDtcXG5cXHRtYXJnaW46IDIwcHggYXV0bztcXG5cXHRib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xcbn1cXG4udXNlcmVkaXQgLnJlZ2lzdGVyIGgxe1xcblxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cXHRtYXJnaW46IDA7XFxufVxcbi51c2VyZWRpdCAucmVnaXN0ZXJidG57XFxuXFx0d2lkdGg6IDEwMCU7XFxufVxcbi51c2VyZWRpdCAubWVzc2FnZSB7XFxuXFx0aGVpZ2h0OiA0MHB4O1xcblxcdG1hcmdpbjogNDBweCAwO1xcblxcdHBhZGRpbmctbGVmdDogMjBweDtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkOGRlZTI7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxufVxcbi51c2VyZWRpdCAubWVzc2FnZSBwe1xcblxcdHBhZGRpbmc6IDA7XFxuXFx0bGluZS1oZWlnaHQ6IDQwcHg7XFxuXFx0bWFyZ2luOiAwO1xcbn1cXG4udXNlcmVkaXQgLmF2YXRhci11cGxvYWRlciAuZWwtdXBsb2FkIHtcXG5cXHRtYXJnaW4tbGVmdDogNTAlO1xcblxcdHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkICM0MDlFRkY7XFxuXFx0bWFyZ2luLWJvdHRvbTogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDZweDtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxufVxcbi51c2VyZWRpdCAuYXZhdGFyLXVwbG9hZGVyIC5lbC11cGxvYWQ6aG92ZXIge1xcbiAgYm9yZGVyLWNvbG9yOiAjNDA5RUZGO1xcbn1cXG4udXNlcmVkaXQgLmF2YXRhci11cGxvYWRlci1pY29uIHtcXG4gIGZvbnQtc2l6ZTogMjhweDtcXG4gIGNvbG9yOiAjOGM5MzlkO1xcbiAgd2lkdGg6IDE3OHB4O1xcbiAgaGVpZ2h0OiAxNzhweDtcXG4gIGxpbmUtaGVpZ2h0OiAxNzhweDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuLnVzZXJlZGl0IC5hdmF0YXIge1xcbiAgd2lkdGg6IDE3OHB4O1xcbiAgaGVpZ2h0OiAxNzhweDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cIiwgXCJcIiwge1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wiRTovQ01TL2Ntcy1zcGEvc3JjL2NvbXBvbmVudHMvc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCI7QUFpS0E7Q0FDQSxvQkFBQTtDQUNBLGtCQUFBO0NBQ0EsdUJBQUE7Q0FDQSxzQkFBQTtDQUNBO0FBQ0E7Q0FDQSxVQUFBO0NBQ0E7QUFFQTtDQUNBLHNCQUFBO0NBQ0EsWUFBQTtDQUNBLHNCQUFBO0NBQ0EsZUFBQTtDQUNBLGdCQUFBO0NBQ0E7QUFDQTtDQUNBLGVBQUE7Q0FDQTtBQUNBO0NBQ0EsWUFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsY0FBQTtDQUNBLG9CQUFBO0NBQ0Esa0JBQUE7Q0FDQSx1QkFBQTtDQUNBO0FBQ0E7Q0FDQSxtQkFBQTtDQUNBLFVBQUE7Q0FDQTtBQUNBO0NBQ0EsWUFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsZUFBQTtDQUNBLG1CQUFBO0VBQ0EsMEJBQUE7RUFDQSxtQkFBQTtDQUNBO0FBQ0E7Q0FDQSxXQUFBO0NBQ0Esa0JBQUE7Q0FDQSxVQUFBO0NBQ0E7QUFDQTtDQUNBLGlCQUFBO0NBQ0EsNEJBQUE7RUFDQSwwQkFBQTtDQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7Q0FDQTtBQUNBO0VBQ0Esc0JBQUE7Q0FDQTtBQUNBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0NBQ0E7QUFDQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtDQUNBXCIsXCJmaWxlXCI6XCJ1c2VyZWRpdC52dWVcIixcInNvdXJjZXNDb250ZW50XCI6W1wiPHRlbXBsYXRlPlxcclxcblxcdDxlbC1tYWluIGNsYXNzPVxcXCJ1c2VyZWRpdFxcXCI+XFxyXFxuXFx0XFx0PHA+XFxyXFxuXFx0XFx0XFx0PHNwYW4gQGNsaWNrPVxcXCJnb3VzZXJcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxhIGhyZWY9XFxcImphdmFzY3JpcHQ6XFxcIj7kuKrkurrkuK3lv4M8L2E+XFxyXFxuXFx0XFx0XFx0PC9zcGFuPlxcclxcblxcdFxcdFxcdDxzcGFuPlxcclxcblxcdFxcdFxcdFxcdD5cXHJcXG5cXHRcXHRcXHRcXHQ8YSBocmVmPVxcXCJqYXZhc2NyaXB0OlxcXCI+6LWE5paZ5L+u5pS5PC9hPlxcclxcblxcdFxcdFxcdDwvc3Bhbj5cXHJcXG5cXHRcXHQ8L3A+XFxyXFxuXFx0XFx0PGhyLz5cXHJcXG5cXHRcXHQ8ZWwtdXBsb2FkXFxyXFxuXFx0XFx0ICBjbGFzcz1cXFwiYXZhdGFyLXVwbG9hZGVyXFxcIlxcclxcblxcdFxcdCAgYWN0aW9uPVxcXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvdXBsb2FkaW1nXFxcIlxcclxcblxcdFxcdCAgOnNob3ctZmlsZS1saXN0PVxcXCJmYWxzZVxcXCJcXHJcXG5cXHRcXHQgIDpvbi1zdWNjZXNzPVxcXCJoYW5kbGVBdmF0YXJTdWNjZXNzXFxcIlxcclxcblxcdFxcdCAgOmJlZm9yZS11cGxvYWQ9XFxcImJlZm9yZUF2YXRhclVwbG9hZFxcXCI+XFxyXFxuXFx0XFx0ICA8aW1nIHYtaWY9XFxcImltYWdlVXJsXFxcIiA6c3JjPVxcXCJpbWFnZVVybFxcXCIgY2xhc3M9XFxcImF2YXRhclxcXCI+XFxyXFxuXFx0XFx0ICA8aSB2LWVsc2UgY2xhc3M9XFxcImVsLWljb24tcGx1cyBhdmF0YXItdXBsb2FkZXItaWNvblxcXCI+PC9pPlxcclxcblxcdFxcdDwvZWwtdXBsb2FkPlxcclxcblxcdFxcdDxlbC1mb3JtIDptb2RlbD1cXFwicnVsZUZvcm0yXFxcIiBzdGF0dXMtaWNvbiA6cnVsZXM9XFxcInJ1bGVzMlxcXCIgcmVmPVxcXCJydWxlRm9ybTJcXFwiIGxhYmVsLXdpZHRoPVxcXCIxMDBweFxcXCIgY2xhc3M9XFxcImRlbW8tcnVsZUZvcm1cXFwiPlxcclxcblxcdFxcdFxcdDxlbC1mb3JtLWl0ZW0gbGFiZWw9XFxcIueUqOaIt+WQjVxcXCIgcHJvcD1cXFwidXNlcm5hbWVcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1pbnB1dCB2LW1vZGVsPVxcXCJydWxlRm9ybTIudXNlcm5hbWVcXFwiPjwvZWwtaW5wdXQ+XFxyXFxuXFx0XFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLWZvcm0taXRlbSBsYWJlbD1cXFwi5oCn5YirXFxcIiBwcm9wPVxcXCJnZW5kYXJcXFwiPlxcclxcblxcdFxcdFxcdFxcdDxlbC1yYWRpby1ncm91cCB2LW1vZGVsPVxcXCJydWxlRm9ybTIuZ2VuZGFyXFxcIj5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8ZWwtcmFkaW8gbGFiZWw9XFxcIueUt1xcXCIgdmFsdWU9XFxcIjBcXFwiPjwvZWwtcmFkaW8+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PGVsLXJhZGlvIGxhYmVsPVxcXCLlpbNcXFwiIHZhbHVlPVxcXCIxXFxcIj48L2VsLXJhZGlvPlxcclxcblxcdFxcdFxcdFxcdDwvZWwtcmFkaW8tZ3JvdXA+XFxyXFxuXFx0XFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0XFx0PGVsLWZvcm0taXRlbT5cXHJcXG5cXHRcXHRcXHRcXHQ8ZWwtYnV0dG9uIGNsYXNzPVxcXCJyZWdpc3RlcmJ0blxcXCIgdHlwZT1cXFwicHJpbWFyeVxcXCIgQGNsaWNrPVxcXCJzdWJtaXRGb3JtKCdydWxlRm9ybTInKVxcXCI+5o+Q5LqkPC9lbC1idXR0b24+XFxyXFxuXFx0XFx0XFx0PC9lbC1mb3JtLWl0ZW0+XFxyXFxuXFx0XFx0PC9lbC1mb3JtPlxcclxcblxcdDwvZWwtbWFpbj5cXHJcXG48L3RlbXBsYXRlPlxcclxcblxcclxcbjxzY3JpcHQ+XFxyXFxuXFx0aW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJ1xcclxcblxcdGV4cG9ydCBkZWZhdWx0IHtcXHJcXG5cXHRcXHRkYXRhKCkge1xcclxcblxcdFxcdFxcdGNvbnN0IGNoZWNrQWdlID0gKHJ1bGUsIHZhbHVlLCBjYWxsYmFjaykgPT4ge1xcclxcblxcdFxcdFxcdFxcdGlmICghdmFsdWUpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRyZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCfnlKjmiLflkI3kuI3og73kuLrnqbonKSk7XFxyXFxuXFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xcclxcblxcdFxcdFxcdFxcdFxcdGlmICh2YWx1ZS5sZW5ndGggPCAyIHx8IHZhbHVlLmxlbmd0aCA+IDgpIHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjYWxsYmFjayhuZXcgRXJyb3IoJ+eUqOaIt+WQjeW/hemhu+WcqDItOOS9jScpKTtcXHJcXG5cXHRcXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHJlcyA9IGF3YWl0IGF4aW9zLmdldCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzP3VzZXJuYW1lPScrdmFsdWUpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYocmVzLmRhdGFbMF0pe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRpZihyZXMuZGF0YVswXS5faWQgPT09IGlkKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRyZXR1cm4gY2FsbGJhY2soKVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRyZXR1cm4gY2FsbGJhY2sobmV3IEVycm9yKCfor6XnlKjmiLflkI3lt7LlrZjlnKgnKSlcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2soKVxcclxcblxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHR9LCAyMDApO1xcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0XFx0Y29uc3QgdmFsaWRhdGVnZW5kYXIgPSAocnVsZSwgdmFsdWUsIGNhbGxiYWNrKSA9PiB7XFxyXFxuXFx0XFx0XFx0XFx0aWYgKHZhbHVlID09PSAnJykge1xcclxcblxcdFxcdFxcdFxcdFxcdGNhbGxiYWNrKG5ldyBFcnJvcign6K+36YCJ5oup5oCn5YirJykpO1xcclxcblxcdFxcdFxcdFxcdH0gZWxzZSB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FsbGJhY2soKVxcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0cmV0dXJuIHtcXHJcXG5cXHRcXHRcXHRcXHRydWxlRm9ybTI6IHtcXHJcXG5cXHRcXHRcXHRcXHRcXHR1c2VybmFtZTogJycsXFxyXFxuXFx0XFx0XFx0XFx0XFx0Z2VuZGFyOiAnJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRhdmF0YXIgOiAnJ1xcclxcblxcdFxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0XFx0cnVsZXMyOiB7XFxyXFxuXFx0XFx0XFx0XFx0XFx0dXNlcm5hbWU6IFt7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dmFsaWRhdG9yOiBjaGVja0FnZSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XSxcXHJcXG5cXHRcXHRcXHRcXHRcXHRnZW5kYXI6IFt7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0dmFsaWRhdG9yOiB2YWxpZGF0ZWdlbmRhcixcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0cmlnZ2VyOiAnYmx1cidcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XVxcclxcblxcdFxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0XFx0aW1hZ2VVcmwgOiAnJ1xcclxcblxcdFxcdFxcdH07XFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRtZXRob2RzOiB7XFxyXFxuXFx0XFx0XFx0Z291c2VyKCkge1xcclxcblxcdFxcdFxcdFxcdGNvbnNvbGUubG9nKDEpXFxyXFxuXFx0XFx0XFx0XFx0dGhpcy4kcm91dGVyLmJhY2soKVxcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0IGhhbmRsZUF2YXRhclN1Y2Nlc3MocmVzLCBmaWxlKSB7XFxyXFxuXFx0XFx0XFx0ICB0aGlzLmltYWdlVXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlLnJhdyk7XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy5ydWxlRm9ybTIuYXZhdGFyID0gcmVzLmRhdGFcXHJcXG5cXHRcXHRcXHR9LFxcclxcblxcdFxcdFxcdGJlZm9yZUF2YXRhclVwbG9hZChmaWxlKSB7XFxyXFxuXFx0XFx0XFx0ICBjb25zdCBpc0pQRyA9IGZpbGUudHlwZSA9PT0gJ2ltYWdlL2pwZWcnO1xcclxcblxcdFxcdFxcdCAgY29uc3QgaXNMdDJNID0gZmlsZS5zaXplIC8gMTAyNCAvIDEwMjQgPCAyO1xcclxcblxcdFxcdFxcdFxcclxcblxcdFxcdFxcdCAgaWYgKCFpc0pQRykge1xcclxcblxcdFxcdFxcdCAgICB0aGlzLiRtZXNzYWdlLmVycm9yKCfkuIrkvKDlpLTlg4/lm77niYflj6rog73mmK8gSlBHIOagvOW8jyEnKTtcXHJcXG5cXHRcXHRcXHQgIH1cXHJcXG5cXHRcXHRcXHQgIGlmICghaXNMdDJNKSB7XFxyXFxuXFx0XFx0XFx0ICAgIHRoaXMuJG1lc3NhZ2UuZXJyb3IoJ+S4iuS8oOWktOWDj+WbvueJh+Wkp+Wwj+S4jeiDvei2hei/hyAyTUIhJyk7XFxyXFxuXFx0XFx0XFx0ICB9XFxyXFxuXFx0XFx0XFx0ICByZXR1cm4gaXNKUEcgJiYgaXNMdDJNO1xcclxcblxcdFxcdFxcdH0sXFxyXFxuXFx0XFx0XFx0c3VibWl0Rm9ybShmb3JtTmFtZSkge1xcclxcblxcdFxcdFxcdFxcdHRoaXMuJHJlZnNbZm9ybU5hbWVdLnZhbGlkYXRlKGFzeW5jICh2YWxpZCkgPT4ge1xcclxcblxcdFxcdFxcdFxcdFxcdGlmICh2YWxpZCkge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjb25zdCB7ZGF0YTpjdXJyZW50dXNlcn0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZXNzaW9uJylcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQvLyBjb25zb2xlLmxvZyhkYXRhLnN0YXRlKVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGlmKCFjdXJyZW50dXNlci5zdGF0ZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0cmV0dXJuIHRoaXMuJG1lc3NhZ2Uoe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdG1lc3NhZ2U6ICfor7flhYjnmbvlvZUnLFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdHR5cGU6ICd3YXJuaW5nJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdGlmKGlkICE9PSBjdXJyZW50dXNlci5zdGF0ZS5faWQpe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5rKh5pyJ5p2D6ZmQJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRpZiAodGhpcy5ydWxlRm9ybTIuZ2VuZGFyID09PSAn55S3Jykge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHRoaXMucnVsZUZvcm0yLmdlbmRhciA9IDBcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9IGVsc2Uge1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHRoaXMucnVsZUZvcm0yLmdlbmRhciA9IDFcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYoIXRoaXMucnVsZUZvcm0yLmF2YXRhcil7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0ZGVsZXRlIHRoaXMucnVsZUZvcm0yLmF2YXRhclxcclxcblxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRjb25zdCB7ZGF0YX0gPSBhd2FpdCBheGlvcy5wYXRjaChgaHR0cDovLzEyNy4wLjAuMTozMDAwL3VzZXJzLyR7aWR9YCwgdGhpcy5ydWxlRm9ybTIpXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0aWYoZGF0YS5lcnIpe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHJldHVybiB0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5pyN5Yqh5Zmo57mB5b+ZJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR0aGlzLiRtZXNzYWdlKHtcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRtZXNzYWdlOiAn5pu05paw5oiQ5YqfJyxcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHR0eXBlOiAnd2FybmluZydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHR9KVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdHRoaXMuJHJvdXRlci5nbygtMSlcXHJcXG5cXHRcXHRcXHRcXHRcXHR9XFxyXFxuXFx0XFx0XFx0XFx0fSlcXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRhc3luYyBjcmVhdGVkKCkge1xcclxcblxcdFxcdFxcdGNvbnN0IHtpZH0gPSB0aGlzLiRyb3V0ZS5wYXJhbXNcXHJcXG5cXHRcXHRcXHRjb25zdCB7ZGF0YX0gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC91c2Vycz9faWQ9JytpZClcXHJcXG5cXHRcXHRcXHR0aGlzLnJ1bGVGb3JtMi51c2VybmFtZSA9IGRhdGFbMF0udXNlcm5hbWVcXHJcXG5cXHRcXHRcXHR0aGlzLnJ1bGVGb3JtMi5nZW5kYXIgPSBkYXRhWzBdLmdlbmRhciA9PT0gMD8n55S3Jzon5aWzJ1xcclxcblxcdFxcdH1cXHJcXG5cXHR9XFxyXFxuPC9zY3JpcHQ+XFxyXFxuXFxyXFxuPHN0eWxlPlxcclxcblxcdC51c2VyZWRpdHtcXHJcXG5cXHRcXHRwYWRkaW5nOiAyMHB4IDMwMHB4O1xcclxcblxcdFxcdHBhZGRpbmctdG9wOiAxMHB4O1xcclxcblxcdFxcdGJhY2tncm91bmQtY29sb3I6ICNjY2M7XFxyXFxuXFx0XFx0cGFkZGluZy1ib3R0b206IDEzOHB4O1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgcHtcXHJcXG5cXHRcXHRtYXJnaW46IDA7XFxyXFxuXFx0fVxcclxcblxcdFxcclxcblxcdC51c2VyZWRpdCBhe1xcclxcblxcdFxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG5cXHRcXHRjb2xvcjogIzAwMDtcXHJcXG5cXHRcXHRkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuXFx0XFx0cGFkZGluZzogMCA1cHg7XFxyXFxuXFx0XFx0Zm9udC1zaXplOiAxNHB4O1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgc3BhbjpmaXJzdC1jaGlsZCBhOmhvdmVye1xcclxcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgc3BhbjpsYXN0LWNoaWxkIGF7XFxyXFxuXFx0XFx0Y29sb3I6ICNmZmY7XFxyXFxuXFx0fVxcclxcblxcdC51c2VyZWRpdCAucmVnaXN0ZXIge1xcclxcblxcdFxcdHdpZHRoOiA1MDBweDtcXHJcXG5cXHRcXHRwYWRkaW5nOiA0MHB4O1xcclxcblxcdFxcdHBhZGRpbmctcmlnaHQ6IDcwcHg7XFxyXFxuXFx0XFx0bWFyZ2luOiAyMHB4IGF1dG87XFxyXFxuXFx0XFx0Ym9yZGVyOiAxcHggc29saWQgI2NjYztcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJlZGl0IC5yZWdpc3RlciBoMXtcXHJcXG5cXHRcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuXFx0XFx0bWFyZ2luOiAwO1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgLnJlZ2lzdGVyYnRue1xcclxcblxcdFxcdHdpZHRoOiAxMDAlO1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgLm1lc3NhZ2Uge1xcclxcblxcdFxcdGhlaWdodDogNDBweDtcXHJcXG5cXHRcXHRtYXJnaW46IDQwcHggMDtcXHJcXG5cXHRcXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxuXFx0ICBib3JkZXI6IDFweCBzb2xpZCAjZDhkZWUyO1xcclxcblxcdCAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgLm1lc3NhZ2UgcHtcXHJcXG5cXHRcXHRwYWRkaW5nOiAwO1xcclxcblxcdFxcdGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcblxcdFxcdG1hcmdpbjogMDtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJlZGl0IC5hdmF0YXItdXBsb2FkZXIgLmVsLXVwbG9hZCB7XFxyXFxuXFx0XFx0bWFyZ2luLWxlZnQ6IDUwJTtcXHJcXG5cXHRcXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XFxyXFxuXFx0ICBib3JkZXI6IDFweCBzb2xpZCAjNDA5RUZGO1xcclxcblxcdFxcdG1hcmdpbi1ib3R0b206IDIwcHg7XFxyXFxuXFx0ICBib3JkZXItcmFkaXVzOiA2cHg7XFxyXFxuXFx0ICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuXFx0ICBwb3NpdGlvbjogcmVsYXRpdmU7XFxyXFxuXFx0ICBvdmVyZmxvdzogaGlkZGVuO1xcclxcblxcdH1cXHJcXG5cXHQudXNlcmVkaXQgLmF2YXRhci11cGxvYWRlciAuZWwtdXBsb2FkOmhvdmVyIHtcXHJcXG5cXHQgIGJvcmRlci1jb2xvcjogIzQwOUVGRjtcXHJcXG5cXHR9XFxyXFxuXFx0LnVzZXJlZGl0IC5hdmF0YXItdXBsb2FkZXItaWNvbiB7XFxyXFxuXFx0ICBmb250LXNpemU6IDI4cHg7XFxyXFxuXFx0ICBjb2xvcjogIzhjOTM5ZDtcXHJcXG5cXHQgIHdpZHRoOiAxNzhweDtcXHJcXG5cXHQgIGhlaWdodDogMTc4cHg7XFxyXFxuXFx0ICBsaW5lLWhlaWdodDogMTc4cHg7XFxyXFxuXFx0ICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuXFx0fVxcclxcblxcdC51c2VyZWRpdCAuYXZhdGFyIHtcXHJcXG5cXHQgIHdpZHRoOiAxNzhweDtcXHJcXG5cXHQgIGhlaWdodDogMTc4cHg7XFxyXFxuXFx0ICBkaXNwbGF5OiBibG9jaztcXHJcXG5cXHR9XFxyXFxuPC9zdHlsZT5cXG5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtNGJlMjE1ZTVcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy91c2VyZWRpdC52dWVcbi8vIG1vZHVsZSBpZCA9IDYxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXG4gICAgXCJlbC1tYWluXCIsXG4gICAgeyBzdGF0aWNDbGFzczogXCJ1c2VyZWRpdFwiIH0sXG4gICAgW1xuICAgICAgX2MoXCJwXCIsIFtcbiAgICAgICAgX2MoXCJzcGFuXCIsIHsgb246IHsgY2xpY2s6IF92bS5nb3VzZXIgfSB9LCBbXG4gICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCJqYXZhc2NyaXB0OlwiIH0gfSwgW192bS5fdihcIuS4quS6uuS4reW/g1wiKV0pXG4gICAgICAgIF0pLFxuICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICBfYyhcInNwYW5cIiwgW1xuICAgICAgICAgIF92bS5fdihcIlxcblxcdFxcdFxcdD5cXG5cXHRcXHRcXHRcIiksXG4gICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCJqYXZhc2NyaXB0OlwiIH0gfSwgW192bS5fdihcIui1hOaWmeS/ruaUuVwiKV0pXG4gICAgICAgIF0pXG4gICAgICBdKSxcbiAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICBfYyhcImhyXCIpLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFxuICAgICAgICBcImVsLXVwbG9hZFwiLFxuICAgICAgICB7XG4gICAgICAgICAgc3RhdGljQ2xhc3M6IFwiYXZhdGFyLXVwbG9hZGVyXCIsXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIGFjdGlvbjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvdXBsb2FkaW1nXCIsXG4gICAgICAgICAgICBcInNob3ctZmlsZS1saXN0XCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJvbi1zdWNjZXNzXCI6IF92bS5oYW5kbGVBdmF0YXJTdWNjZXNzLFxuICAgICAgICAgICAgXCJiZWZvcmUtdXBsb2FkXCI6IF92bS5iZWZvcmVBdmF0YXJVcGxvYWRcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFtcbiAgICAgICAgICBfdm0uaW1hZ2VVcmxcbiAgICAgICAgICAgID8gX2MoXCJpbWdcIiwgeyBzdGF0aWNDbGFzczogXCJhdmF0YXJcIiwgYXR0cnM6IHsgc3JjOiBfdm0uaW1hZ2VVcmwgfSB9KVxuICAgICAgICAgICAgOiBfYyhcImlcIiwgeyBzdGF0aWNDbGFzczogXCJlbC1pY29uLXBsdXMgYXZhdGFyLXVwbG9hZGVyLWljb25cIiB9KVxuICAgICAgICBdXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFxuICAgICAgICBcImVsLWZvcm1cIixcbiAgICAgICAge1xuICAgICAgICAgIHJlZjogXCJydWxlRm9ybTJcIixcbiAgICAgICAgICBzdGF0aWNDbGFzczogXCJkZW1vLXJ1bGVGb3JtXCIsXG4gICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgIG1vZGVsOiBfdm0ucnVsZUZvcm0yLFxuICAgICAgICAgICAgXCJzdGF0dXMtaWNvblwiOiBcIlwiLFxuICAgICAgICAgICAgcnVsZXM6IF92bS5ydWxlczIsXG4gICAgICAgICAgICBcImxhYmVsLXdpZHRoXCI6IFwiMTAwcHhcIlxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgW1xuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIHsgYXR0cnM6IHsgbGFiZWw6IFwi55So5oi35ZCNXCIsIHByb3A6IFwidXNlcm5hbWVcIiB9IH0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIF9jKFwiZWwtaW5wdXRcIiwge1xuICAgICAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnJ1bGVGb3JtMi51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigkJHYpIHtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtMiwgXCJ1c2VybmFtZVwiLCAkJHYpXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJydWxlRm9ybTIudXNlcm5hbWVcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIHsgYXR0cnM6IHsgbGFiZWw6IFwi5oCn5YirXCIsIHByb3A6IFwiZ2VuZGFyXCIgfSB9LFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICBcImVsLXJhZGlvLWdyb3VwXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF92bS5ydWxlRm9ybTIuZ2VuZGFyLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oJCR2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLiRzZXQoX3ZtLnJ1bGVGb3JtMiwgXCJnZW5kYXJcIiwgJCR2KVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcInJ1bGVGb3JtMi5nZW5kYXJcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXCJlbC1yYWRpb1wiLCB7IGF0dHJzOiB7IGxhYmVsOiBcIueUt1wiLCB2YWx1ZTogXCIwXCIgfSB9KSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcImVsLXJhZGlvXCIsIHsgYXR0cnM6IHsgbGFiZWw6IFwi5aWzXCIsIHZhbHVlOiBcIjFcIiB9IH0pXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgIClcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAxXG4gICAgICAgICAgKSxcbiAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgIF9jKFxuICAgICAgICAgICAgXCJlbC1mb3JtLWl0ZW1cIixcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgXCJlbC1idXR0b25cIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBzdGF0aWNDbGFzczogXCJyZWdpc3RlcmJ0blwiLFxuICAgICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogXCJwcmltYXJ5XCIgfSxcbiAgICAgICAgICAgICAgICAgIG9uOiB7XG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbigkZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBfdm0uc3VibWl0Rm9ybShcInJ1bGVGb3JtMlwiKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBbX3ZtLl92KFwi5o+Q5LqkXCIpXVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgMVxuICAgICAgICAgIClcbiAgICAgICAgXSxcbiAgICAgICAgMVxuICAgICAgKVxuICAgIF0sXG4gICAgMVxuICApXG59XG52YXIgc3RhdGljUmVuZGVyRm5zID0gW11cbnJlbmRlci5fd2l0aFN0cmlwcGVkID0gdHJ1ZVxudmFyIGVzRXhwb3J0cyA9IHsgcmVuZGVyOiByZW5kZXIsIHN0YXRpY1JlbmRlckZuczogc3RhdGljUmVuZGVyRm5zIH1cbmV4cG9ydCBkZWZhdWx0IGVzRXhwb3J0c1xuaWYgKG1vZHVsZS5ob3QpIHtcbiAgbW9kdWxlLmhvdC5hY2NlcHQoKVxuICBpZiAobW9kdWxlLmhvdC5kYXRhKSB7XG4gICAgcmVxdWlyZShcInZ1ZS1ob3QtcmVsb2FkLWFwaVwiKSAgICAgIC5yZXJlbmRlcihcImRhdGEtdi00YmUyMTVlNVwiLCBlc0V4cG9ydHMpXG4gIH1cbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi90ZW1wbGF0ZS1jb21waWxlcj97XCJpZFwiOlwiZGF0YS12LTRiZTIxNWU1XCIsXCJoYXNTY29wZWRcIjpmYWxzZSxcImJ1YmxlXCI6e1widHJhbnNmb3Jtc1wiOnt9fX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT10ZW1wbGF0ZSZpbmRleD0wIS4vc3JjL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlXG4vLyBtb2R1bGUgaWQgPSA2MlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNTI4NjAyYTNcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2xpc3RieXRpdGxlLnZ1ZVwiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzQ2xpZW50LmpzXCIpKFwiM2M1NDBjYjRcIiwgY29udGVudCwgZmFsc2UsIHt9KTtcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcbiAvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuIGlmKCFjb250ZW50LmxvY2Fscykge1xuICAgbW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP3NvdXJjZU1hcCEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXIvaW5kZXguanM/e1xcXCJ2dWVcXFwiOnRydWUsXFxcImlkXFxcIjpcXFwiZGF0YS12LTUyODYwMmEzXFxcIixcXFwic2NvcGVkXFxcIjpmYWxzZSxcXFwiaGFzSW5saW5lQ29uZmlnXFxcIjpmYWxzZX0hLi4vLi4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9saXN0Ynl0aXRsZS52dWVcIiwgZnVuY3Rpb24oKSB7XG4gICAgIHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/c291cmNlTWFwIS4uLy4uL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlci9pbmRleC5qcz97XFxcInZ1ZVxcXCI6dHJ1ZSxcXFwiaWRcXFwiOlxcXCJkYXRhLXYtNTI4NjAyYTNcXFwiLFxcXCJzY29wZWRcXFwiOmZhbHNlLFxcXCJoYXNJbmxpbmVDb25maWdcXFwiOmZhbHNlfSEuLi8uLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL2xpc3RieXRpdGxlLnZ1ZVwiKTtcbiAgICAgaWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG4gICAgIHVwZGF0ZShuZXdDb250ZW50KTtcbiAgIH0pO1xuIH1cbiAvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG4gbW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLXN0eWxlLWxvYWRlciEuL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP3NvdXJjZU1hcCEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zdHlsZS1jb21waWxlcj97XCJ2dWVcIjp0cnVlLFwiaWRcIjpcImRhdGEtdi01Mjg2MDJhM1wiLFwic2NvcGVkXCI6ZmFsc2UsXCJoYXNJbmxpbmVDb25maWdcIjpmYWxzZX0hLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc2VsZWN0b3IuanM/dHlwZT1zdHlsZXMmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL2xpc3RieXRpdGxlLnZ1ZVxuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh0cnVlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIlxcbi5saXN0e1xcbn1cXG4ubGlzdCAuaXRlbS5zdGFye1xcbn1cXG4ubGlzdCAuaXRlbS5zdGFyIHNwYW57XFxuXFx0XFx0Y29sb3I6ICMwMDc0RDk7XFxufVxcbi5saXN0IGF7XFxuXFx0XFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblxcdFxcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG5cXHRcXHRjb2xvcjogIzgwODA4MDtcXG59XFxuLmxpc3QgYTpob3ZlcntcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXG59XFxuLmxpc3QgLnRleHQge1xcblxcdGZvbnQtc2l6ZTogMTRweDtcXG59XFxuLmxpc3QgLnJlbGVhc2Uge1xcblxcdGZsb2F0OiByaWdodDtcXG5cXHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTEwcHgpO1xcbn1cXG4ubGlzdCBkaXYuZWwtY2FyZF9faGVhZGVye1xcblxcdHBhZGRpbmc6IDE1cHg7XFxuXFx0cGFkZGluZy1sZWZ0OiAyMHB4O1xcbn1cXG4ubGlzdCBkaXYuZWwtY2FyZF9fYm9keXtcXG5cXHRwYWRkaW5nOiA1cHg7XFxuXFx0cGFkZGluZy1sZWZ0OiAyMHB4O1xcbn1cXG4ubGlzdCAuY2xlYXJmaXh7XFxuXFx0aGVpZ2h0OiAyMHB4O1xcbn1cXG4uY2xlYXJmaXg6YmVmb3JlLFxcbi5jbGVhcmZpeDphZnRlciB7XFxuXFx0ZGlzcGxheTogdGFibGU7XFxuXFx0Y29udGVudDogXFxcIlxcXCI7XFxufVxcbi5jbGVhcmZpeDphZnRlciB7XFxuXFx0Y2xlYXI6IGJvdGhcXG59XFxuLmJveC1jYXJkIHtcXG5cXHR3aWR0aDogMTAwJTtcXG59XFxuLmxpc3QgLmNvbnRlbnR7XFxuXFx0dGV4dC1vdmVyZmxvdzplbGxpcHNpcztcXG5cXHRvdmVyZmxvdzogaGlkZGVuO1xcblxcdHdoaXRlLXNwYWNlOm5vd3JhcDtcXG5cXHRwYWRkaW5nLXJpZ2h0OiAzMDBweDtcXG59XFxuLmxpc3QgcC5wc3tcXG5cXHRtYXJnaW46IDEwcHg7XFxuXFx0Zm9udC1zaXplOiAxMnB4O1xcblxcdHRleHQtYWxpZ246IHJpZ2h0O1xcbn1cXG4ubGlzdCAucGFnaW5ne1xcblxcdG1hcmdpbjogMzBweDtcXG5cXHRmbG9hdDogcmlnaHQ7XFxufVxcblwiLCBcIlwiLCB7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJFOi9DTVMvY21zLXNwYS9zcmMvY29tcG9uZW50cy9zcmMvY29tcG9uZW50cy9saXN0Ynl0aXRsZS52dWVcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIjtBQTZGQTtDQUVBO0FBQ0E7Q0FFQTtBQUNBO0VBQ0EsZUFBQTtDQUNBO0FBQ0E7RUFDQSxzQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZUFBQTtDQUNBO0FBQ0E7RUFDQSxlQUFBO0NBQ0E7QUFDQTtDQUNBLGdCQUFBO0NBQ0E7QUFFQTtDQUNBLGFBQUE7Q0FDQSw2QkFBQTtDQUNBO0FBQ0E7Q0FDQSxjQUFBO0NBQ0EsbUJBQUE7Q0FDQTtBQUNBO0NBQ0EsYUFBQTtDQUNBLG1CQUFBO0NBQ0E7QUFDQTtDQUNBLGFBQUE7Q0FDQTtBQUNBOztDQUVBLGVBQUE7Q0FDQSxZQUFBO0NBQ0E7QUFDQTtDQUNBLFdBQUE7Q0FDQTtBQUVBO0NBQ0EsWUFBQTtDQUNBO0FBQ0E7Q0FDQSx1QkFBQTtDQUNBLGlCQUFBO0NBQ0EsbUJBQUE7Q0FDQSxxQkFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsZ0JBQUE7Q0FDQSxrQkFBQTtDQUNBO0FBQ0E7Q0FDQSxhQUFBO0NBQ0EsYUFBQTtDQUNBXCIsXCJmaWxlXCI6XCJsaXN0Ynl0aXRsZS52dWVcIixcInNvdXJjZXNDb250ZW50XCI6W1wiPHRlbXBsYXRlPlxcblxcdDxlbC1tYWluIGNsYXNzPVxcXCJsaXN0XFxcIj5cXHJcXG5cXHRcXHQ8ZWwtY2FyZCBjbGFzcz1cXFwiYm94LWNhcmRcXFwiIHYtc2hvdz1cXFwidG9waWNzWzBdXFxcIiA+XFxyXFxuXFx0XFx0XFx0PGRpdiBjbGFzcz1cXFwidGV4dCBpdGVtXFxcIiB2LWZvcj1cXFwiKHRvcGljLGluZGV4KSBpbiB0b3BpY3NcXFwiIDprZXk9XFxcImluZGV4XFxcIj5cXHJcXG5cXHRcXHRcXHRcXHQ8ZGl2PlxcclxcblxcdFxcdFxcdFxcdFxcdDxoMz5cXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHQ8YSA6aHJlZj1cXFwiYCMvZGV0YWlscy8ke3RvcGljLl9pZH1gXFxcIj57e3RvcGljLnRpdGxlfX08L2E+IFxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0c2l6ZT1cXFwibWluaVxcXCJcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRzdHlsZT1cXFwiY29sb3I6ICM4ODg7XFxcIlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGRpc2FibGVkPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdHt7IHRvcGljLnRvcGljdHlwZSB9fVxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDxlbC1iYWRnZSA6dmFsdWU9XFxcInRvcGljLnN0YXJzLmxlbmd0aFxcXCIgOm1heD1cXFwiOTlcXFwiIGNsYXNzPVxcXCJpdGVtIHN0YXJcXFwiIHR5cGU9XFxcIndhcm5pbmdcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdDxlbC1idXR0b24gc2l6ZT1cXFwibWluaVxcXCI+PHNwYW4gY2xhc3M9XFxcImVsLWljb24tc3Rhci1vblxcXCI+PC9zcGFuPjwvZWwtYnV0dG9uPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdDwvZWwtYmFkZ2U+XFxyXFxuXFx0XFx0XFx0XFx0XFx0PC9oMz5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cCBjbGFzcz1cXFwiY29udGVudFxcXCI+e3sgdG9waWMuY29udGVudCB9fTwvcD5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8cCBjbGFzcz1cXFwicHNcXFwiPlxcclxcblxcdFxcdFxcdFxcdFxcdFxcdCDlj5HluIPml7bpl7QgOiB7eyB0b3BpYy5jcmVhdGVfdGltZSB9fVxcclxcblxcdFxcdFxcdFxcdFxcdDwvcD5cXHJcXG5cXHRcXHRcXHRcXHRcXHQ8aHIvPlxcclxcblxcdFxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdFxcdDwvZGl2PlxcclxcblxcdFxcdDwvZWwtY2FyZD5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJibG9ja1xcXCI+XFxyXFxuXFx0XFx0PGgzIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7XFxcIiB2LXNob3c9XFxcIiF0b3BpY3NbMF1cXFwiPuaJvuS4jeWIsOebuOWFs+ivnemimC4uLi5cXHJcXG5cXHRcXHRcXHQ8YSBocmVmPVxcXCJcXFwiIEBjbGljay5wcmV2ZW50PVxcXCJnb3JlbGVhc2VcXFwiPuWOu+WPkeW4gz88L2E+XFxyXFxuXFx0XFx0PC9oMz5cXHJcXG4gIDwvZGl2PlxcclxcblxcdDwvZWwtbWFpbj5cXG48L3RlbXBsYXRlPlxcblxcbjxzY3JpcHQ+XFxuXFx0ZXhwb3J0IGRlZmF1bHQge1xcblxcdFxcdGRhdGEoKSB7XFxuXFx0XFx0XFx0cmV0dXJuIHtcXG5cXHRcXHRcXHRcXHR0b3BpY3MgOiBbXSxcXHJcXG5cXHRcXHRcXHRcXHR0b3BpY3R5cGUgOiAnJ1xcblxcdFxcdFxcdH07XFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRtZXRob2RzOntcXHJcXG5cXHRcXHRcXHRhc3luYyBnZXR0b3BpY3NieXRpdGxlKCl7XFxyXFxuXFx0XFx0XFx0XFx0Y29uc3Qge2tleXdvcmR9ID0gdGhpcy4kcm91dGUucXVlcnlcXHJcXG5cXHRcXHRcXHRcXHRjb25zdCB7ZGF0YSA6IHRvcGljc30gPSBhd2FpdCBheGlvcy5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC90b3BpY3MvdGl0bGU/a2V5d29yZD0nK2tleXdvcmQpXFxyXFxuXFx0XFx0XFx0XFx0dG9waWNzLmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcXHJcXG5cXHRcXHRcXHRcXHRcXHRzd2l0Y2goaXRlbS50b3BpY3R5cGUpe1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhc2UgJ3RlY2hub2xvZ3knIDogaXRlbS50b3BpY3R5cGUgPSAn5oqA5pyvJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhc2UgJ2xpdGVyYXR1cmUnIDogaXRlbS50b3BpY3R5cGUgPSAn5paH5a2mJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGNhc2UgJ1Nwb3J0cycgOiBpdGVtLnRvcGljdHlwZSA9ICfkvZPogrInXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnZW50ZXJ0YWlubWVudCcgOiBpdGVtLnRvcGljdHlwZSA9ICflqLHkuZAnXFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0XFx0YnJlYWs7XFxyXFxuXFx0XFx0XFx0XFx0XFx0XFx0Y2FzZSAnbWV0YXBoeXNpY3MnIDogaXRlbS50b3BpY3R5cGUgPSAn546E5a2mJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGRlZmF1bHQgOiBpdGVtLnRvcGljdHlwZSA9ICfmnKrnn6UnXFxyXFxuXFx0XFx0XFx0XFx0XFx0fVxcclxcblxcdFxcdFxcdFxcdH0pXFxyXFxuXFx0XFx0XFx0XFx0dGhpcy50b3BpY3MgPSB0b3BpY3NcXHJcXG5cXHRcXHRcXHRcXHQvLyBjb25zb2xlLmxvZyh0b3BpY3MpXFxyXFxuXFx0XFx0XFx0fVxcclxcblxcdFxcdH0sXFxyXFxuXFx0XFx0YXN5bmMgY3JlYXRlZCgpe1xcclxcblxcdFxcdFxcdHRoaXMuZ2V0dG9waWNzYnl0aXRsZSgpXFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHRjb21wdXRlZDp7XFxyXFxuXFx0XFx0XFx0dG9waWNjbGFzcygpe1xcclxcblxcdFxcdFxcdFxcdHN3aXRjaCh0aGlzLnRvcGljdHlwZSl7XFxyXFxuXFx0XFx0XFx0XFx0XFx0Y2FzZSAndGVjaG5vbG9neScgOiByZXR1cm4gJ+aKgOacrydcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYXNlICdsaXRlcmF0dXJlJyA6IHJldHVybiAgJ+aWh+WtpidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRjYXNlICdTcG9ydHMnIDogcmV0dXJuICAn5L2T6IKyJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdGNhc2UgJ2VudGVydGFpbm1lbnQnIDogcmV0dXJuICAn5aix5LmQJ1xcclxcblxcdFxcdFxcdFxcdFxcdFxcdGJyZWFrO1xcclxcblxcdFxcdFxcdFxcdFxcdGNhc2UgJ21ldGFwaHlzaWNzJyA6IHJldHVybiAgJ+eOhOWtpidcXHJcXG5cXHRcXHRcXHRcXHRcXHRcXHRicmVhaztcXHJcXG5cXHRcXHRcXHRcXHRcXHRkZWZhdWx0IDogcmV0dXJuICAn5YWo6YOoJ1xcclxcblxcdFxcdFxcdFxcdH1cXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fSxcXHJcXG5cXHRcXHR3YXRjaDp7XFxyXFxuXFx0XFx0XFx0JyRyb3V0ZScgKHRvICwgZnJvbSl7XFxyXFxuXFx0XFx0XFx0XFx0dGhpcy5nZXR0b3BpY3NieXRpdGxlKClcXHJcXG5cXHRcXHRcXHR9XFxyXFxuXFx0XFx0fVxcblxcdH1cXG48L3NjcmlwdD5cXG5cXG48c3R5bGU+XFxyXFxuXFx0Lmxpc3R7XFxyXFxuXFx0XFx0XFxyXFxuXFx0fVxcclxcblxcdC5saXN0IC5pdGVtLnN0YXJ7XFxyXFxuXFx0XFx0XFxyXFxuXFx0fVxcclxcblxcdC5saXN0IC5pdGVtLnN0YXIgc3BhbntcXHJcXG5cXHRcXHRjb2xvcjogIzAwNzREOTtcXHJcXG5cXHR9XFxyXFxuXFx0Lmxpc3QgYXtcXHJcXG5cXHRcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuXFx0XFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcblxcdFxcdGNvbG9yOiAjODA4MDgwO1xcclxcblxcdH1cXHJcXG5cXHQubGlzdCBhOmhvdmVye1xcclxcblxcdFxcdGNvbG9yOiAjMDA3NEQ5O1xcclxcblxcdH1cXG5cXHQubGlzdCAudGV4dCB7XFxyXFxuXFx0Zm9udC1zaXplOiAxNHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ubGlzdCAucmVsZWFzZSB7XFxyXFxuXFx0ZmxvYXQ6IHJpZ2h0O1xcclxcblxcdHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMTBweCk7XFxyXFxufVxcclxcbi5saXN0IGRpdi5lbC1jYXJkX19oZWFkZXJ7XFxyXFxuXFx0cGFkZGluZzogMTVweDtcXHJcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxufVxcclxcbi5saXN0IGRpdi5lbC1jYXJkX19ib2R5e1xcclxcblxcdHBhZGRpbmc6IDVweDtcXHJcXG5cXHRwYWRkaW5nLWxlZnQ6IDIwcHg7XFxyXFxufVxcclxcbi5saXN0IC5jbGVhcmZpeHtcXHJcXG5cXHRoZWlnaHQ6IDIwcHg7XFxyXFxufVxcclxcbi5jbGVhcmZpeDpiZWZvcmUsXFxyXFxuLmNsZWFyZml4OmFmdGVyIHtcXHJcXG5cXHRkaXNwbGF5OiB0YWJsZTtcXHJcXG5cXHRjb250ZW50OiBcXFwiXFxcIjtcXHJcXG59XFxyXFxuLmNsZWFyZml4OmFmdGVyIHtcXHJcXG5cXHRjbGVhcjogYm90aFxcclxcbn1cXHJcXG5cXHJcXG4uYm94LWNhcmQge1xcclxcblxcdHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG4ubGlzdCAuY29udGVudHtcXHJcXG5cXHR0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO1xcclxcblxcdG92ZXJmbG93OiBoaWRkZW47XFxyXFxuXFx0d2hpdGUtc3BhY2U6bm93cmFwO1xcclxcblxcdHBhZGRpbmctcmlnaHQ6IDMwMHB4O1xcclxcbn1cXHJcXG4ubGlzdCBwLnBze1xcclxcblxcdG1hcmdpbjogMTBweDtcXHJcXG5cXHRmb250LXNpemU6IDEycHg7XFxyXFxuXFx0dGV4dC1hbGlnbjogcmlnaHQ7XFxyXFxufVxcclxcbi5saXN0IC5wYWdpbmd7XFxyXFxuXFx0bWFyZ2luOiAzMHB4O1xcclxcblxcdGZsb2F0OiByaWdodDtcXHJcXG59XFxuPC9zdHlsZT5cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlcj9zb3VyY2VNYXAhLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvc3R5bGUtY29tcGlsZXI/e1widnVlXCI6dHJ1ZSxcImlkXCI6XCJkYXRhLXYtNTI4NjAyYTNcIixcInNjb3BlZFwiOmZhbHNlLFwiaGFzSW5saW5lQ29uZmlnXCI6ZmFsc2V9IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9c3R5bGVzJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9saXN0Ynl0aXRsZS52dWVcbi8vIG1vZHVsZSBpZCA9IDY0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXG4gICAgXCJlbC1tYWluXCIsXG4gICAgeyBzdGF0aWNDbGFzczogXCJsaXN0XCIgfSxcbiAgICBbXG4gICAgICBfYyhcbiAgICAgICAgXCJlbC1jYXJkXCIsXG4gICAgICAgIHtcbiAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6IFwic2hvd1wiLFxuICAgICAgICAgICAgICByYXdOYW1lOiBcInYtc2hvd1wiLFxuICAgICAgICAgICAgICB2YWx1ZTogX3ZtLnRvcGljc1swXSxcbiAgICAgICAgICAgICAgZXhwcmVzc2lvbjogXCJ0b3BpY3NbMF1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgc3RhdGljQ2xhc3M6IFwiYm94LWNhcmRcIlxuICAgICAgICB9LFxuICAgICAgICBfdm0uX2woX3ZtLnRvcGljcywgZnVuY3Rpb24odG9waWMsIGluZGV4KSB7XG4gICAgICAgICAgcmV0dXJuIF9jKFwiZGl2XCIsIHsga2V5OiBpbmRleCwgc3RhdGljQ2xhc3M6IFwidGV4dCBpdGVtXCIgfSwgW1xuICAgICAgICAgICAgX2MoXCJkaXZcIiwgW1xuICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICBcImgzXCIsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgX2MoXCJhXCIsIHsgYXR0cnM6IHsgaHJlZjogXCIjL2RldGFpbHMvXCIgKyB0b3BpYy5faWQgfSB9LCBbXG4gICAgICAgICAgICAgICAgICAgIF92bS5fdihfdm0uX3ModG9waWMudGl0bGUpKVxuICAgICAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICAgICAgX2MoXG4gICAgICAgICAgICAgICAgICAgIFwiZWwtYnV0dG9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdGF0aWNTdHlsZTogeyBjb2xvcjogXCIjODg4XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICBhdHRyczogeyBzaXplOiBcIm1pbmlcIiwgZGlzYWJsZWQ6IFwiXCIgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgX3ZtLl92KFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcXHRcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF92bS5fcyh0b3BpYy50b3BpY3R5cGUpICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJcXG5cXHRcXHRcXHRcXHRcXHRcXHRcIlxuICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgICAgICBfYyhcbiAgICAgICAgICAgICAgICAgICAgXCJlbC1iYWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgc3RhdGljQ2xhc3M6IFwiaXRlbSBzdGFyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB0b3BpYy5zdGFycy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXg6IDk5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJ3YXJuaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICBfYyhcImVsLWJ1dHRvblwiLCB7IGF0dHJzOiB7IHNpemU6IFwibWluaVwiIH0gfSwgW1xuICAgICAgICAgICAgICAgICAgICAgICAgX2MoXCJzcGFuXCIsIHsgc3RhdGljQ2xhc3M6IFwiZWwtaWNvbi1zdGFyLW9uXCIgfSlcbiAgICAgICAgICAgICAgICAgICAgICBdKVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFwicFwiLCB7IHN0YXRpY0NsYXNzOiBcImNvbnRlbnRcIiB9LCBbXG4gICAgICAgICAgICAgICAgX3ZtLl92KF92bS5fcyh0b3BpYy5jb250ZW50KSlcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICAgIF92bS5fdihcIiBcIiksXG4gICAgICAgICAgICAgIF9jKFwicFwiLCB7IHN0YXRpY0NsYXNzOiBcInBzXCIgfSwgW1xuICAgICAgICAgICAgICAgIF92bS5fdihcbiAgICAgICAgICAgICAgICAgIFwiXFxuXFx0XFx0XFx0XFx0XFx0XFx0IOWPkeW4g+aXtumXtCA6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgX3ZtLl9zKHRvcGljLmNyZWF0ZV90aW1lKSArXG4gICAgICAgICAgICAgICAgICAgIFwiXFxuXFx0XFx0XFx0XFx0XFx0XCJcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIF0pLFxuICAgICAgICAgICAgICBfdm0uX3YoXCIgXCIpLFxuICAgICAgICAgICAgICBfYyhcImhyXCIpXG4gICAgICAgICAgICBdKVxuICAgICAgICAgIF0pXG4gICAgICAgIH0pLFxuICAgICAgICAwXG4gICAgICApLFxuICAgICAgX3ZtLl92KFwiIFwiKSxcbiAgICAgIF9jKFwiZGl2XCIsIHsgc3RhdGljQ2xhc3M6IFwiYmxvY2tcIiB9LCBbXG4gICAgICAgIF9jKFxuICAgICAgICAgIFwiaDNcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInNob3dcIixcbiAgICAgICAgICAgICAgICByYXdOYW1lOiBcInYtc2hvd1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAhX3ZtLnRvcGljc1swXSxcbiAgICAgICAgICAgICAgICBleHByZXNzaW9uOiBcIiF0b3BpY3NbMF1cIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgc3RhdGljU3R5bGU6IHsgXCJ0ZXh0LWFsaWduXCI6IFwiY2VudGVyXCIgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgX3ZtLl92KFwi5om+5LiN5Yiw55u45YWz6K+d6aKYLi4uLlxcblxcdFxcdFxcdFwiKSxcbiAgICAgICAgICAgIF9jKFxuICAgICAgICAgICAgICBcImFcIixcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGF0dHJzOiB7IGhyZWY6IFwiXCIgfSxcbiAgICAgICAgICAgICAgICBvbjoge1xuICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uKCRldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3ZtLmdvcmVsZWFzZSgkZXZlbnQpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBbX3ZtLl92KFwi5Y675Y+R5biDP1wiKV1cbiAgICAgICAgICAgIClcbiAgICAgICAgICBdXG4gICAgICAgIClcbiAgICAgIF0pXG4gICAgXSxcbiAgICAxXG4gIClcbn1cbnZhciBzdGF0aWNSZW5kZXJGbnMgPSBbXVxucmVuZGVyLl93aXRoU3RyaXBwZWQgPSB0cnVlXG52YXIgZXNFeHBvcnRzID0geyByZW5kZXI6IHJlbmRlciwgc3RhdGljUmVuZGVyRm5zOiBzdGF0aWNSZW5kZXJGbnMgfVxuZXhwb3J0IGRlZmF1bHQgZXNFeHBvcnRzXG5pZiAobW9kdWxlLmhvdCkge1xuICBtb2R1bGUuaG90LmFjY2VwdCgpXG4gIGlmIChtb2R1bGUuaG90LmRhdGEpIHtcbiAgICByZXF1aXJlKFwidnVlLWhvdC1yZWxvYWQtYXBpXCIpICAgICAgLnJlcmVuZGVyKFwiZGF0YS12LTUyODYwMmEzXCIsIGVzRXhwb3J0cylcbiAgfVxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3RlbXBsYXRlLWNvbXBpbGVyP3tcImlkXCI6XCJkYXRhLXYtNTI4NjAyYTNcIixcImhhc1Njb3BlZFwiOmZhbHNlLFwiYnVibGVcIjp7XCJ0cmFuc2Zvcm1zXCI6e319fSEuL25vZGVfbW9kdWxlcy92dWUtbG9hZGVyL2xpYi9zZWxlY3Rvci5qcz90eXBlPXRlbXBsYXRlJmluZGV4PTAhLi9zcmMvY29tcG9uZW50cy9saXN0Ynl0aXRsZS52dWVcbi8vIG1vZHVsZSBpZCA9IDY1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF92bSA9IHRoaXNcbiAgdmFyIF9oID0gX3ZtLiRjcmVhdGVFbGVtZW50XG4gIHZhciBfYyA9IF92bS5fc2VsZi5fYyB8fCBfaFxuICByZXR1cm4gX2MoXCJkaXZcIiwgW19jKFwiaW5kZXhoZWFkZXJcIiksIF92bS5fdihcIiBcIiksIF9jKFwicm91dGVyLXZpZXdcIildLCAxKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtNDczMjNiZjJcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi00NzMyM2JmMlwiLFwiaGFzU2NvcGVkXCI6ZmFsc2UsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9jb21wb25lbnRzL2luZGV4LnZ1ZVxuLy8gbW9kdWxlIGlkID0gNjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICB2YXIgX3ZtID0gdGhpc1xuICB2YXIgX2ggPSBfdm0uJGNyZWF0ZUVsZW1lbnRcbiAgdmFyIF9jID0gX3ZtLl9zZWxmLl9jIHx8IF9oXG4gIHJldHVybiBfYyhcImRpdlwiLCB7IGF0dHJzOiB7IGlkOiBcImFwcFwiIH0gfSwgW19jKFwicm91dGVyLXZpZXdcIildLCAxKVxufVxudmFyIHN0YXRpY1JlbmRlckZucyA9IFtdXG5yZW5kZXIuX3dpdGhTdHJpcHBlZCA9IHRydWVcbnZhciBlc0V4cG9ydHMgPSB7IHJlbmRlcjogcmVuZGVyLCBzdGF0aWNSZW5kZXJGbnM6IHN0YXRpY1JlbmRlckZucyB9XG5leHBvcnQgZGVmYXVsdCBlc0V4cG9ydHNcbmlmIChtb2R1bGUuaG90KSB7XG4gIG1vZHVsZS5ob3QuYWNjZXB0KClcbiAgaWYgKG1vZHVsZS5ob3QuZGF0YSkge1xuICAgIHJlcXVpcmUoXCJ2dWUtaG90LXJlbG9hZC1hcGlcIikgICAgICAucmVyZW5kZXIoXCJkYXRhLXYtNWVmNDg5NThcIiwgZXNFeHBvcnRzKVxuICB9XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvdnVlLWxvYWRlci9saWIvdGVtcGxhdGUtY29tcGlsZXI/e1wiaWRcIjpcImRhdGEtdi01ZWY0ODk1OFwiLFwiaGFzU2NvcGVkXCI6ZmFsc2UsXCJidWJsZVwiOntcInRyYW5zZm9ybXNcIjp7fX19IS4vbm9kZV9tb2R1bGVzL3Z1ZS1sb2FkZXIvbGliL3NlbGVjdG9yLmpzP3R5cGU9dGVtcGxhdGUmaW5kZXg9MCEuL3NyYy9hcHAudnVlXG4vLyBtb2R1bGUgaWQgPSA2N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVnVlUm91dGVyIGZyb20gJ3Z1ZS1yb3V0ZXInXHJcbmltcG9ydCBsb2dpbiBmcm9tICcuL2NvbXBvbmVudHMvbG9naW4udnVlJ1xyXG5pbXBvcnQgcmVnaXN0ZXIgZnJvbSAnLi9jb21wb25lbnRzL3JlZ2lzdGVyLnZ1ZSdcclxuaW1wb3J0IGluZGV4IGZyb20gJy4vY29tcG9uZW50cy9pbmRleC52dWUnXHJcbmltcG9ydCBsaXN0IGZyb20gJy4vY29tcG9uZW50cy9saXN0LnZ1ZSdcclxuaW1wb3J0IHJlbGVhc2UgZnJvbSAnLi9jb21wb25lbnRzL3JlbGVhc2UudnVlJ1xyXG5pbXBvcnQgZGV0YWlsc3BhZ2UgZnJvbSAnLi9jb21wb25lbnRzL2RldGFpbHMudnVlJ1xyXG5pbXBvcnQgdXNlciBmcm9tICcuL2NvbXBvbmVudHMvdXNlci52dWUnXHJcbmltcG9ydCB0b3BpY2VkaXQgZnJvbSAnLi9jb21wb25lbnRzL3RvcGljZWRpdC52dWUnXHJcbmltcG9ydCB1c2VyZWRpdCBmcm9tICcuL2NvbXBvbmVudHMvdXNlcmVkaXQudnVlJ1xyXG5pbXBvcnQgbGlzdGJ5dGl0bGUgZnJvbSAnLi9jb21wb25lbnRzL2xpc3RieXRpdGxlLnZ1ZSdcclxuZXhwb3J0IGRlZmF1bHQgbmV3IFZ1ZVJvdXRlcih7XHJcblx0cm91dGVzIDogW1xyXG5cdFx0e1xyXG5cdFx0XHRwYXRoIDogJy8nLFxyXG5cdFx0XHRjb21wb25lbnQgOiBpbmRleCxcclxuXHRcdFx0Y2hpbGRyZW46IFtcclxuICAgICAgICB7IHBhdGg6ICcvJywgY29tcG9uZW50OiBsaXN0IH0sXHJcblx0XHRcdFx0eyBwYXRoOiAnL3JlbGVhc2UnLCBjb21wb25lbnQ6IHJlbGVhc2UgfSxcclxuXHRcdFx0XHR7IHBhdGg6ICcvZGV0YWlscy86aWQnLCBjb21wb25lbnQ6IGRldGFpbHNwYWdlIH0sXHJcblx0XHRcdFx0eyBwYXRoOiAnL3VzZXIvOmlkJywgY29tcG9uZW50OiB1c2VyIH0sXHJcblx0XHRcdFx0eyBwYXRoOiAnL3RvcGljZWRpdC86aWQnLCBjb21wb25lbnQ6IHRvcGljZWRpdCB9LFxyXG5cdFx0XHRcdHsgcGF0aDogJy91c2VyZWRpdC86aWQnLCBjb21wb25lbnQ6IHVzZXJlZGl0IH0sXHJcblx0XHRcdFx0eyBwYXRoOiAnL2xpc3RieXRpdGxlJywgY29tcG9uZW50OiBsaXN0Ynl0aXRsZSB9XHJcbiAgICAgIF1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHBhdGggOiAnL2xvZ2luJyxcclxuXHRcdFx0Y29tcG9uZW50IDogbG9naW5cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHBhdGggOiAnL3JlZ2lzdGVyJyxcclxuXHRcdFx0Y29tcG9uZW50IDogcmVnaXN0ZXJcclxuXHRcdH1cclxuXHRdXHJcbn0pXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3JvdXRlci5qcyIsIm1vZHVsZS5leHBvcnRzID0gVnVlUm91dGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiVnVlUm91dGVyXCJcbi8vIG1vZHVsZSBpZCA9IDY5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=