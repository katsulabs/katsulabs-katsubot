/*
@license

dhtmlxPivot v.1.4.1 Professional

This software is covered by DHTMLX Enterprise License.
Usage without proper license is prohibited.

(c) XB Software.

*/
if (window.dhx){ window.dhx_legacy = dhx; delete window.dhx; }(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dhx"] = factory();
	else
		root["dhx"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/codebase/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(2);
var counter = (new Date()).valueOf();
function uid() {
    return "u" + (counter++);
}
exports.uid = uid;
function extend(target, source, deep) {
    if (deep === void 0) { deep = true; }
    if (source) {
        for (var key in source) {
            var sobj = source[key];
            var tobj = target[key];
            if (deep && typeof tobj === "object" && !(tobj instanceof Date) && !(tobj instanceof Array)) {
                extend(tobj, sobj);
            }
            else {
                target[key] = sobj;
            }
        }
    }
    return target;
}
exports.extend = extend;
function copy(source, withoutInner) {
    var result = {};
    for (var key in source) {
        if (!withoutInner || key[0] !== "$") {
            result[key] = source[key];
        }
    }
    return result;
}
exports.copy = copy;
function naturalSort(arr) {
    return arr.sort(function (a, b) {
        var nn = typeof a === "string" ? a.localeCompare(b) : a - b;
        return nn;
    });
}
exports.naturalSort = naturalSort;
function findIndex(arr, predicate) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function isEqualString(from, to) {
    if (from.length > to.length) {
        return false;
    }
    for (var i = 0; i < from.length; i++) {
        if (from[i].toLowerCase() !== to[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}
exports.isEqualString = isEqualString;
function singleOuterClick(fn) {
    var click = function (e) {
        if (fn(e)) {
            document.removeEventListener("click", click);
        }
    };
    document.addEventListener("click", click);
}
exports.singleOuterClick = singleOuterClick;
function detectWidgetClick(widgetId, cb) {
    var click = function (e) { return cb(html_1.locate(e, "dhx_widget_id") === widgetId); };
    document.addEventListener("click", click);
    return function () { return document.removeEventListener("click", click); };
}
exports.detectWidgetClick = detectWidgetClick;
function unwrapBox(box) {
    if (Array.isArray(box)) {
        return box[0];
    }
    return box;
}
exports.unwrapBox = unwrapBox;
function wrapBox(unboxed) {
    if (Array.isArray(unboxed)) {
        return unboxed;
    }
    return [unboxed];
}
exports.wrapBox = wrapBox;
function isDefined(some) {
    return some !== null && some !== undefined;
}
exports.isDefined = isDefined;
function range(from, to) {
    if (from > to) {
        return [];
    }
    var result = [];
    while (from <= to) {
        result.push(from++);
    }
    return result;
}
exports.range = range;
function isNumeric(val) {
    return !isNaN(val - parseFloat(val));
}
exports.isNumeric = isNumeric;
function downloadFile(data, filename, mimeType) {
    if (mimeType === void 0) { mimeType = "text/plain"; }
    var file = new Blob([data], { type: mimeType });
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else {
        var a_1 = document.createElement("a");
        var url_1 = URL.createObjectURL(file);
        a_1.href = url_1;
        a_1.download = filename;
        document.body.appendChild(a_1);
        a_1.click();
        setTimeout(function () {
            document.body.removeChild(a_1);
            window.URL.revokeObjectURL(url_1);
        }, 0);
    }
}
exports.downloadFile = downloadFile;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var dom = __webpack_require__(48);
exports.el = dom.defineElement;
exports.sv = dom.defineSvgElement;
exports.view = dom.defineView;
exports.create = dom.createView;
exports.inject = dom.injectView;
function disableHelp() {
    dom.DEVMODE.mutations = false;
    dom.DEVMODE.warnings = false;
    dom.DEVMODE.verbose = false;
    dom.DEVMODE.UNKEYED_INPUT = false;
}
exports.disableHelp = disableHelp;
function resizer(handler) {
    var resize = window.ResizeObserver;
    var activeHandler = function (node) {
        var height = node.el.offsetHeight;
        var width = node.el.offsetWidth;
        handler(width, height);
    };
    if (resize) {
        return exports.el("div.dhx-resize-observer", {
            _hooks: {
                didInsert: function (node) {
                    new resize(function () { return activeHandler(node); }).observe(node.el);
                }
            }
        });
    }
    return exports.el("iframe.dhx-resize-observer", {
        _hooks: {
            didInsert: function (node) {
                node.el.contentWindow.onresize = function () { return activeHandler(node); };
                activeHandler(node);
            }
        }
    });
}
exports.resizer = resizer;
function awaitRedraw() {
    return new Promise(function (res) {
        requestAnimationFrame(function () {
            res();
        });
    });
}
exports.awaitRedraw = awaitRedraw;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(42);
function toNode(node) {
    if (typeof node === "string") {
        node = (document.getElementById(node) || document.querySelector(node));
    }
    return node || document.body;
}
exports.toNode = toNode;
function eventHandler(prepare, hash) {
    var keys = Object.keys(hash);
    return function (ev) {
        var data = prepare(ev);
        var node = ev.target;
        while (node) {
            var cssstring = node.getAttribute ? (node.getAttribute("class") || "") : "";
            if (cssstring.length) {
                var css = cssstring.split(" ");
                for (var j = 0; j < keys.length; j++) {
                    if (css.indexOf(keys[j]) > -1) {
                        return hash[keys[j]](ev, data);
                    }
                }
            }
            node = node.parentNode;
        }
        return true;
    };
}
exports.eventHandler = eventHandler;
function locate(target, attr) {
    if (attr === void 0) { attr = "dhx_id"; }
    var node = locateNode(target, attr);
    return node ? node.getAttribute(attr) : "";
}
exports.locate = locate;
function locateNode(target, attr) {
    if (attr === void 0) { attr = "dhx_id"; }
    if (target instanceof Event) {
        target = target.target;
    }
    while (target) {
        if (target.getAttribute && target.getAttribute(attr)) {
            return target;
        }
        target = target.parentNode;
    }
}
exports.locateNode = locateNode;
function getBox(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var top = box.top + scrollTop;
    var left = box.left + scrollLeft;
    var right = body.offsetWidth - box.right;
    var bottom = body.offsetHeight - box.bottom;
    var width = box.right - box.left;
    var height = box.bottom - box.top;
    return { top: top, left: left, right: right, bottom: bottom, width: width, height: height };
}
exports.getBox = getBox;
var scrollWidth = -1;
function getScrollbarWidth() {
    if (scrollWidth > -1) {
        return scrollWidth;
    }
    var scrollDiv = document.createElement("div");
    document.body.appendChild(scrollDiv);
    scrollDiv.style.cssText = "position: absolute;left: -99999px;overflow:scroll;width: 100px;height: 100px;";
    scrollWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollWidth;
}
exports.getScrollbarWidth = getScrollbarWidth;
function fitPosition(node, config) {
    return calculatePosition(getRealPosition(node), config);
}
exports.fitPosition = fitPosition;
function isIE() {
    var ua = window.navigator.userAgent;
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
}
exports.isIE = isIE;
function getRealPosition(node) {
    var rects = node.getBoundingClientRect();
    return {
        left: rects.left + window.pageXOffset,
        right: rects.right + window.pageXOffset,
        top: rects.top + window.pageYOffset,
        bottom: rects.bottom + window.pageYOffset
    };
}
exports.getRealPosition = getRealPosition;
var Position;
(function (Position) {
    Position["left"] = "left";
    Position["right"] = "right";
    Position["bottom"] = "bottom";
    Position["top"] = "top";
})(Position = exports.Position || (exports.Position = {}));
function calculatePosition(pos, config) {
    var _a = config.mode === Position.bottom || config.mode === Position.top
        ? placeBottomOrTop(pos, config)
        : placeRightOrLeft(pos, config), left = _a.left, top = _a.top;
    return {
        left: Math.round(left) + "px",
        top: Math.round(top) + "px",
        minWidth: Math.round(config.width) + "px",
        position: "absolute"
    };
}
exports.calculatePosition = calculatePosition;
function getWindowBorders() {
    return {
        rightBorder: window.pageXOffset + window.innerWidth,
        bottomBorder: window.pageYOffset + window.innerHeight
    };
}
function horizontalCentering(pos, width, rightBorder) {
    var nodeWidth = pos.right - pos.left;
    var diff = (width - nodeWidth) / 2;
    var left = pos.left - diff;
    var right = pos.right + diff;
    if (left >= 0 && right <= rightBorder) {
        return left;
    }
    if (left < 0) {
        return 0;
    }
    return rightBorder - width;
}
function verticalCentering(pos, height, bottomBorder) {
    var nodeHeight = pos.bottom - pos.top;
    var diff = (height - nodeHeight) / 2;
    var top = pos.top - diff;
    var bottom = pos.bottom + diff;
    if (top >= 0 && bottom <= bottomBorder) {
        return top;
    }
    if (top < 0) {
        return 0;
    }
    return bottomBorder - height;
}
function placeBottomOrTop(pos, config) {
    var _a = getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
    var left;
    var top;
    var bottomDiff = bottomBorder - pos.bottom - config.height;
    var topDiff = pos.top - config.height;
    if (config.mode === Position.bottom) {
        if (bottomDiff >= 0) {
            top = pos.bottom;
        }
        else if (topDiff >= 0) {
            top = topDiff;
        }
    }
    else {
        if (topDiff >= 0) {
            top = topDiff;
        }
        else if (bottomDiff >= 0) {
            top = pos.bottom;
        }
    }
    if (bottomDiff < 0 && topDiff < 0) {
        if (config.auto) {
            return placeRightOrLeft(pos, __assign({}, config, { mode: Position.right, auto: false }));
        }
        top = bottomDiff > topDiff ? pos.bottom : topDiff;
    }
    if (config.centering) {
        left = horizontalCentering(pos, config.width, rightBorder);
    }
    else {
        var leftDiff = rightBorder - pos.left - config.width;
        var rightDiff = pos.right - config.width;
        if (leftDiff >= 0) {
            left = pos.left;
        }
        else if (rightDiff >= 0) {
            left = rightDiff;
        }
        else {
            left = rightDiff > leftDiff ? pos.left : rightDiff;
        }
    }
    return { left: left, top: top };
}
function placeRightOrLeft(pos, config) {
    var _a = getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
    var left;
    var top;
    var rightDiff = rightBorder - pos.right - config.width;
    var leftDiff = pos.left - config.width;
    if (config.mode === Position.right) {
        if (rightDiff >= 0) {
            left = pos.right;
        }
        else if (leftDiff >= 0) {
            left = leftDiff;
        }
    }
    else {
        if (leftDiff >= 0) {
            left = leftDiff;
        }
        else if (rightDiff >= 0) {
            left = pos.right;
        }
    }
    if (leftDiff < 0 && rightDiff < 0) {
        if (config.auto) {
            return placeBottomOrTop(pos, __assign({}, config, { mode: Position.bottom, auto: false }));
        }
        left = leftDiff > rightDiff ? leftDiff : pos.right;
    }
    if (config.centering) {
        top = verticalCentering(pos, config.height, rightBorder);
    }
    else {
        var bottomDiff = pos.bottom - config.height;
        var topDiff = bottomBorder - pos.top - config.height;
        if (topDiff >= 0) {
            top = pos.top;
        }
        else if (bottomDiff > 0) {
            top = bottomDiff;
        }
        else {
            top = bottomDiff > topDiff ? bottomDiff : pos.top;
        }
    }
    return { left: left, top: top };
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EditorType;
(function (EditorType) {
    EditorType["input"] = "input";
    EditorType["select"] = "select";
    EditorType["datepicker"] = "datePicker";
})(EditorType = exports.EditorType || (exports.EditorType = {}));
var GridEvents;
(function (GridEvents) {
    GridEvents["scroll"] = "scroll";
    GridEvents["sort"] = "sort";
    GridEvents["expand"] = "expand";
    GridEvents["headerInput"] = "headerInput";
    GridEvents["cellClick"] = "cellClick";
    GridEvents["cellRightClick"] = "cellRightClick";
    GridEvents["cellMouseOver"] = "cellMouseOver";
    GridEvents["cellMouseDown"] = "cellMouseDown";
    GridEvents["cellDblClick"] = "cellDblClick";
    GridEvents["headerCellClick"] = "headerCellClick";
    GridEvents["footerCellClick"] = "footerCellClick";
    GridEvents["headerCellMouseOver"] = "headerCellMouseOver";
    GridEvents["footerCellMouseOver"] = "footerCellMouseOver";
    GridEvents["headerCellMouseDown"] = "headerCellMouseDown";
    GridEvents["footerCellMouseDown"] = "footerCellMouseDown";
    GridEvents["headerCellDblClick"] = "headerCellDblClick";
    GridEvents["footerCellDblClick"] = "footerCellDblClick";
    GridEvents["headerCellRightClick"] = "headerCellRightClick";
    GridEvents["footerCellRightClick"] = "footerCellRightClick";
    GridEvents["beforeEditStart"] = "beforeEditStart";
    GridEvents["afterEditStart"] = "afterEditStart";
    GridEvents["beforeEditEnd"] = "beforeEditEnd";
    GridEvents["afterEditEnd"] = "afterEditEnd";
})(GridEvents = exports.GridEvents || (exports.GridEvents = {}));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var html_1 = __webpack_require__(2);
var View = /** @class */ (function () {
    function View(_container, config) {
        this._uid = core_1.uid();
        this.config = config || {};
    }
    View.prototype.mount = function (container, vnode) {
        if (vnode) {
            this._view = vnode;
        }
        if (container && this._view && this._view.mount) {
            // init view inside of HTML container
            this._container = html_1.toNode(container);
            if (this._container.tagName) {
                this._view.mount(this._container);
            }
            else if (this._container.attach) {
                this._container.attach(this);
            }
        }
    };
    View.prototype.unmount = function () {
        var rootView = this.getRootView();
        if (rootView && rootView.node) {
            rootView.unmount();
            this._view = null;
        }
    };
    View.prototype.getRootView = function () {
        return this._view;
    };
    View.prototype.getRootNode = function () {
        return this._view && this._view.node && this._view.node.el;
    };
    View.prototype.paint = function () {
        if (this._view && ( // was mounted
        this._view.node || // already rendered node
            this._container)) { // not rendered, but has container
            this._doNotRepaint = false;
            this._view.redraw();
        }
    };
    return View;
}());
exports.View = View;
function toViewLike(view) {
    return {
        getRootView: function () { return view; },
        paint: function () { return view.node && view.redraw(); },
        mount: function (container) { return view.mount(container); }
    };
}
exports.toViewLike = toViewLike;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventSystem = /** @class */ (function () {
    function EventSystem(context) {
        this.events = {};
        this.context = context || this;
    }
    EventSystem.prototype.on = function (name, callback, context) {
        var event = name.toLowerCase();
        this.events[event] = this.events[event] || [];
        this.events[event].push({ callback: callback, context: context || this.context });
    };
    EventSystem.prototype.detach = function (name, context) {
        var event = name.toLowerCase();
        var eStack = this.events[event];
        if (context && eStack && eStack.length) {
            for (var i = eStack.length - 1; i >= 0; i--) {
                if (eStack[i].context === context) {
                    eStack.splice(i, 1);
                }
            }
        }
        else {
            this.events[event] = [];
        }
    };
    EventSystem.prototype.fire = function (name, args) {
        if (typeof args === "undefined") {
            args = [];
        }
        var event = name.toLowerCase();
        if (this.events[event]) {
            var res = this.events[event].map(function (e) { return e.callback.apply(e.context, args); });
            return res.indexOf(false) < 0;
        }
        return true;
    };
    EventSystem.prototype.clear = function () {
        this.events = {};
    };
    return EventSystem;
}());
exports.EventSystem = EventSystem;
function EventsMixin(obj) {
    obj = obj || {};
    var eventSystem = new EventSystem(obj);
    obj.detachEvent = eventSystem.detach.bind(eventSystem);
    obj.attachEvent = eventSystem.on.bind(eventSystem);
    obj.callEvent = eventSystem.fire.bind(eventSystem);
}
exports.EventsMixin = EventsMixin;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var en = {
    availableFields: "available fields",
    values: "data",
    columns: "columns",
    rows: "rows",
    moveFieldsHere: "MOVE FIELDS HERE",
    hideSettings: "Hide Settings",
    showSettings: "Show Settings",
    apply: "Apply",
    day: "Day",
    week: "Week",
    month: "Month",
    quarter: "Quarter",
    year: "Year",
    min: "Min",
    max: "Max",
    sum: "Sum",
    count: "Count",
    equal: "Equal",
    notEqual: "Not Equal",
    contains: "Contains",
    notContains: "Not Contains",
    typeHere: "Type Here",
    selectAll: "Select All",
    unselectAll: "Unselect All",
    cancel: "Cancel",
    ok: "Ok",
    total: "Total",
    date: {
        monthFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        dayFull: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        dayShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        quarter: ["Q1", "Q2", "Q3", "Q4"],
        week: "W"
    }
};
/*HSITX*/
var kr = {
	availableFields: "사용가능항목",
    values: "표출항목",
    columns: "열항목",
    rows: "행항목",
    moveFieldsHere: "여기로 옮겨주세요",
    hideSettings: "숨기기",
    showSettings: "나타내기",
    apply: "적용",
    day: "일별",
    week: "주별",
    month: "월별",
    quarter: "분기별",
    year: "연도별",
    min: "최소",
    max: "최대",
    sum: "합계",
    count: "건수",
    equal: "동일",
    notEqual: "상이",
    contains: "포함",
    notContains: "미포함",
    typeHere: "Type Here",
    selectAll: "전체선택",
    unselectAll: "선택해제",
    cancel: "취소",
    ok: "Ok",
    total: "총계",
    date: {
        monthFull: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayFull: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        dayShort: ["일", "월", "화", "수", "목", "금", "토"],
        quarter: ["1분기", "2분기", "3분기", "4분기"],
        week: "주"
    }
};
/**/

/*ORIGINAL
exports.default = en;
*/
/*HSITX*/
exports.default = kr;
/**/


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(8));
__export(__webpack_require__(20));
__export(__webpack_require__(53));
__export(__webpack_require__(54));
__export(__webpack_require__(11));
__export(__webpack_require__(9));
__export(__webpack_require__(23));
__export(__webpack_require__(22));
__export(__webpack_require__(56));
__export(__webpack_require__(21));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeFilterType;
(function (TreeFilterType) {
    TreeFilterType["all"] = "all";
    TreeFilterType["level"] = "level";
    TreeFilterType["leafs"] = "leafs";
})(TreeFilterType = exports.TreeFilterType || (exports.TreeFilterType = {}));
var DropPosition;
(function (DropPosition) {
    DropPosition["top"] = "top";
    DropPosition["bot"] = "bot";
    DropPosition["in"] = "in";
})(DropPosition = exports.DropPosition || (exports.DropPosition = {}));
var DataEvents;
(function (DataEvents) {
    DataEvents["afterAdd"] = "afteradd";
    DataEvents["beforeAdd"] = "beforeadd";
    DataEvents["removeAll"] = "removeall";
    DataEvents["beforeRemove"] = "beforeremove";
    DataEvents["afterRemove"] = "afterremove";
    DataEvents["change"] = "change";
    DataEvents["load"] = "load";
    DataEvents["loadError"] = "loaderror";
})(DataEvents = exports.DataEvents || (exports.DataEvents = {}));
var DragEvents;
(function (DragEvents) {
    DragEvents["beforeDrag"] = "beforedrag";
    DragEvents["beforeDrop"] = "beforeDrop";
    DragEvents["dragStart"] = "dragstart";
    DragEvents["dragEnd"] = "dragend";
    DragEvents["canDrop"] = "candrop";
    DragEvents["cancelDrop"] = "canceldrop";
    DragEvents["dropComplete"] = "dropcomplete";
    DragEvents["dragOut"] = "dragOut";
    DragEvents["dragIn"] = "dragIn"; // fire on source
})(DragEvents = exports.DragEvents || (exports.DragEvents = {}));
var DragMode;
(function (DragMode) {
    DragMode["target"] = "target";
    DragMode["both"] = "both";
    DragMode["source"] = "source";
})(DragMode = exports.DragMode || (exports.DragMode = {}));
var DropBehaviour;
(function (DropBehaviour) {
    DropBehaviour["child"] = "child";
    DropBehaviour["sibling"] = "sibling";
    DropBehaviour["complex"] = "complex";
})(DropBehaviour = exports.DropBehaviour || (exports.DropBehaviour = {}));
var DataDriver;
(function (DataDriver) {
    DataDriver["json"] = "json";
    DataDriver["csv"] = "csv";
    DataDriver["xml"] = "xml";
})(DataDriver = exports.DataDriver || (exports.DataDriver = {}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dataproxy_1 = __webpack_require__(11);
var drivers_1 = __webpack_require__(21);
function isEqualObj(a, b) {
    for (var key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.isEqualObj = isEqualObj;
function naturalCompare(a, b) {
    if (isNaN(a) || isNaN(b)) {
        var ax_1 = [];
        var bx_1 = [];
        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            ax_1.push([$1 || Infinity, $2 || ""]);
        });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            bx_1.push([$1 || Infinity, $2 || ""]);
        });
        while (ax_1.length && bx_1.length) {
            var an = ax_1.shift();
            var bn = bx_1.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) {
                return nn;
            }
        }
        return ax_1.length - bx_1.length;
    }
    return a - b;
}
exports.naturalCompare = naturalCompare;
function findByConf(item, conf) {
    if (typeof conf === "function") {
        if (conf.call(this, item)) {
            return item;
        }
    }
    else if (conf.by && conf.match) {
        if (item[conf.by] === conf.match) {
            return item;
        }
    }
}
exports.findByConf = findByConf;
function isDebug() {
    var dhx = window.dhx;
    if (typeof dhx !== "undefined") {
        return typeof (dhx.debug) !== "undefined" && dhx.debug;
    }
    // return typeof DHX_DEBUG_MODE !== "undefined" && DHX_DEBUG_MODE;
}
exports.isDebug = isDebug;
function dhxWarning(msg) {
    // tslint:disable-next-line:no-console
    console.warn(msg);
}
exports.dhxWarning = dhxWarning;
function dhxError(msg) {
    throw new Error(msg);
}
exports.dhxError = dhxError;
function toProxy(proxy) {
    var type = typeof proxy;
    if (type === "string") {
        return new dataproxy_1.DataProxy(proxy);
    }
    else if (type === "object") {
        return proxy;
    }
}
exports.toProxy = toProxy;
function toDataDriver(driver) {
    if (typeof driver === "string") {
        var dhx = window.dhx;
        var drivers = (dhx && dhx.dataDrivers) || drivers_1.dataDrivers;
        if (drivers[driver]) {
            return new drivers[driver]();
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn("Incorrect data driver type:", driver);
            // tslint:disable-next-line:no-console
            console.warn("Available types:", JSON.stringify(Object.keys(drivers)));
        }
    }
    else if (typeof driver === "object") {
        return driver;
    }
}
exports.toDataDriver = toDataDriver;
function copyWithoutInner(obj, forbidden) {
    var result = {};
    for (var key in obj) {
        if (key[0] !== "$" && (!forbidden || !forbidden[key])) {
            result[key] = obj[key];
        }
    }
    return result;
}
exports.copyWithoutInner = copyWithoutInner;
function isTreeCollection(obj) {
    return Boolean(obj.getRoot);
}
exports.isTreeCollection = isTreeCollection;
function hasJsonOrArrayStructure(str) {
    if (typeof str === "object") {
        return true;
    }
    if (typeof str !== "string") {
        return false;
    }
    try {
        var result = JSON.parse(str);
        return Object.prototype.toString.call(result) === "[object Object]"
            || Array.isArray(result);
    }
    catch (err) {
        return false;
    }
}
exports.hasJsonOrArrayStructure = hasJsonOrArrayStructure;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function rgbToHex(color) {
    if (color.substr(0, 1) === "#") {
        return color;
    }
    var digits = /(.*?)rgb[a]?\((\d+), *(\d+), *(\d+),* *([\d]*)\)/.exec(color);
    var red = parseInt(digits[2], 10).toString(16);
    var green = parseInt(digits[3], 10).toString(16);
    var blue = parseInt(digits[4], 10).toString(16);
    return "#" + red + green + blue;
}
exports.rgbToHex = rgbToHex;
function transpose(arr, transform) {
    var columns = [];
    for (var i = 0; i < arr.length; i++) {
        var row = arr[i];
        for (var cellInd = 0; cellInd < row.length; cellInd++) {
            columns[cellInd] = columns[cellInd] || [];
            var cell = transform ? transform(row[cellInd]) : row[cellInd];
            columns[cellInd].push(cell);
        }
    }
    return columns;
}
exports.transpose = transpose;
function getStrWidth(str, font) {
    if (font === void 0) { font = "14px Arial"; }
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.font = font;
    return Math.round(ctx.measureText(str).width);
}
exports.getStrWidth = getStrWidth;
function insert(node, newone) {
    if (typeof newone === "string") {
        node.insertAdjacentHTML("beforeend", newone);
        return node.lastChild;
    }
    else {
        node.appendChild(newone);
        return newone;
    }
}
function getStyleByClass(cssClass, container, targetClass, def) {
    var cont = container.querySelector("." + targetClass);
    var testDiv = insert(cont, "<div class=\"" + cssClass + "\"></div>");
    var styles = window.getComputedStyle(testDiv);
    var result = {
        color: styles.color === "rgb(0, 0, 0)" ? def.color : rgbToHex(styles.color),
        background: styles.backgroundColor === "rgba(0, 0, 0, 0)" ? def.background : rgbToHex(styles.backgroundColor),
        fontSize: parseFloat(styles.fontSize)
    };
    cont.removeChild(testDiv);
    // [dirty]
    if (result.color === def.color
        && result.background === def.background
        && result.fontSize === def.fontSize) {
        return null;
    }
    return result;
}
exports.getStyleByClass = getStyleByClass;
function removeHTMLTags(str) {
    if (typeof str !== "string" && typeof str !== "number") {
        return "";
    }
    return ("" + ((str === undefined || str === null) ? "" : str)).replace(/<[^>]*>/g, "").replace(/[\"]/g, "&quot;").trim();
}
exports.removeHTMLTags = removeHTMLTags;
function isCssSupport(property, value) {
    try {
        return CSS.supports(property, value);
    }
    catch (err) {
        var el = document.createElement("div");
        el.style[property] = value;
        return el.style[property] === value;
    }
}
exports.isCssSupport = isCssSupport;
function isRowEmpty(row) {
    if (!row) {
        return;
    }
    return Object.keys(row).reduce(function (acc, col) {
        if (col === "id" || col[0] === "$") {
            return acc;
        }
        if (acc && (row[col] !== undefined && row[col] !== "")) {
            return false;
        }
        return acc;
    }, true);
}
exports.isRowEmpty = isRowEmpty;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var DataProxy = /** @class */ (function () {
    function DataProxy(url) {
        this.url = url;
    }
    DataProxy.prototype.load = function () {
        return this._ajax(this.url);
    };
    DataProxy.prototype.save = function (data, mode) {
        var modes = {
            insert: "POST",
            delete: "DELETE",
            update: "POST"
        };
        return this._ajax(this.url, data, modes[mode] || "POST");
    };
    DataProxy.prototype._ajax = function (url, data, method) {
        if (method === void 0) { method = "GET"; }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response || xhr.responseText);
                }
                else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            xhr.open(method, url);
            xhr.setRequestHeader("Content-Type", "application/json");
            switch (method) {
                case "POST":
                case "DELETE":
                case "PUT":
                    xhr.send(JSON.stringify(data));
                    break;
                case "GET":
                    xhr.send();
                    break;
                default:
                    xhr.send();
                    break;
            }
        });
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {(function () {
  global = this

  var queueId = 1
  var queue = {}
  var isRunningTask = false

  if (!global.setImmediate)
    global.addEventListener('message', function (e) {
      if (e.source == global){
        if (isRunningTask)
          nextTick(queue[e.data])
        else {
          isRunningTask = true
          try {
            queue[e.data]()
          } catch (e) {}

          delete queue[e.data]
          isRunningTask = false
        }
      }
    })

  function nextTick(fn) {
    if (global.setImmediate) setImmediate(fn)
    // if inside of web worker
    else if (global.importScripts) setTimeout(fn)
    else {
      queueId++
      queue[queueId] = fn
      global.postMessage(queueId, '*')
    }
  }

  Deferred.resolve = function (value) {
    if (!(this._d == 1))
      throw TypeError()

    if (value instanceof Deferred)
      return value

    return new Deferred(function (resolve) {
        resolve(value)
    })
  }

  Deferred.reject = function (value) {
    if (!(this._d == 1))
      throw TypeError()

    return new Deferred(function (resolve, reject) {
        reject(value)
    })
  }

  Deferred.all = function (arr) {
    if (!(this._d == 1))
      throw TypeError()

    if (!(arr instanceof Array))
      return Deferred.reject(TypeError())

    var d = new Deferred()

    function done(e, v) {
      if (v)
        return d.resolve(v)

      if (e)
        return d.reject(e)

      var unresolved = arr.reduce(function (cnt, v) {
        if (v && v.then)
          return cnt + 1
        return cnt
      }, 0)

      if(unresolved == 0)
        d.resolve(arr)

      arr.map(function (v, i) {
        if (v && v.then)
          v.then(function (r) {
            arr[i] = r
            done()
            return r
          }, done)
      })
    }

    done()

    return d
  }

  Deferred.race = function (arr) {
    if (!(this._d == 1))
      throw TypeError()

    if (!(arr instanceof Array))
      return Deferred.reject(TypeError())

    if (arr.length == 0)
      return new Deferred()

    var d = new Deferred()

    function done(e, v) {
      if (v)
        return d.resolve(v)

      if (e)
        return d.reject(e)

      var unresolved = arr.reduce(function (cnt, v) {
        if (v && v.then)
          return cnt + 1
        return cnt
      }, 0)

      if(unresolved == 0)
        d.resolve(arr)

      arr.map(function (v, i) {
        if (v && v.then)
          v.then(function (r) {
            done(null, r)
          }, done)
      })
    }

    done()

    return d
  }

  Deferred._d = 1


  /**
   * @constructor
   */
  function Deferred(resolver) {
    'use strict'
    if (typeof resolver != 'function' && resolver != undefined)
      throw TypeError()

    if (typeof this != 'object' || (this && this.then))
      throw TypeError()

    // states
    // 0: pending
    // 1: resolving
    // 2: rejecting
    // 3: resolved
    // 4: rejected
    var self = this,
      state = 0,
      val = 0,
      next = [],
      fn, er;

    self['promise'] = self

    self['resolve'] = function (v) {
      fn = self.fn
      er = self.er
      if (!state) {
        val = v
        state = 1

        nextTick(fire)
      }
      return self
    }

    self['reject'] = function (v) {
      fn = self.fn
      er = self.er
      if (!state) {
        val = v
        state = 2

        nextTick(fire)

      }
      return self
    }

    self['_d'] = 1

    self['then'] = function (_fn, _er) {
      if (!(this._d == 1))
        throw TypeError()

      var d = new Deferred()

      d.fn = _fn
      d.er = _er
      if (state == 3) {
        d.resolve(val)
      }
      else if (state == 4) {
        d.reject(val)
      }
      else {
        next.push(d)
      }

      return d
    }

    self['catch'] = function (_er) {
      return self['then'](null, _er)
    }

    var finish = function (type) {
      state = type || 4
      next.map(function (p) {
        state == 3 && p.resolve(val) || p.reject(val)
      })
    }

    try {
      if (typeof resolver == 'function')
        resolver(self['resolve'], self['reject'])
    } catch (e) {
      self['reject'](e)
    }

    return self

    // ref : reference to 'then' function
    // cb, ec, cn : successCallback, failureCallback, notThennableCallback
    function thennable (ref, cb, ec, cn) {
      // Promises can be rejected with other promises, which should pass through
      if (state == 2) {
        return cn()
      }
      if ((typeof val == 'object' || typeof val == 'function') && typeof ref == 'function') {
        try {

          // cnt protects against abuse calls from spec checker
          var cnt = 0
          ref.call(val, function (v) {
            if (cnt++) return
            val = v
            cb()
          }, function (v) {
            if (cnt++) return
            val = v
            ec()
          })
        } catch (e) {
          val = e
          ec()
        }
      } else {
        cn()
      }
    };

    function fire() {

      // check if it's a thenable
      var ref;
      try {
        ref = val && val.then
      } catch (e) {
        val = e
        state = 2
        return fire()
      }

      thennable(ref, function () {
        state = 1
        fire()
      }, function () {
        state = 2
        fire()
      }, function () {
        try {
          if (state == 1 && typeof fn == 'function') {
            val = fn(val)
          }

          else if (state == 2 && typeof er == 'function') {
            val = er(val)
            state = 1
          }
        } catch (e) {
          val = e
          return finish()
        }

        if (val == self) {
          val = TypeError()
          finish()
        } else thennable(ref, function () {
            finish(3)
          }, finish, function () {
            finish(state == 1 && 3)
          })

      })
    }


  }

  // Export our library object, either for node.js or as a globally scoped variable
  if (true) {
    module['exports'] = Deferred
  } else {}
})()

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13), __webpack_require__(45).setImmediate))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function normalizeArray(obj, name) {
    if (!obj[name]) {
        return;
    }
    if (typeof obj[name] === "string") {
        obj[name] = [{
                text: "" + obj[name]
            }];
    }
    else {
        obj[name] = obj[name].map(function (el) {
            if (typeof el === "string") {
                el = { text: el };
            }
            return el;
        });
    }
}
function normalizeColumns(columns) {
    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
        var col = columns_1[_i];
        col.$cellCss = col.$cellCss || {};
        normalizeArray(col, "header");
        normalizeArray(col, "footer");
        var isContent = col.header.reduce(function (acc, item) { return acc = acc || !!item.content; }, false);
        if (isContent) {
            col.$uniqueData = [];
        }
        col.width = col.width || 100;
    }
}
exports.normalizeColumns = normalizeColumns;
function countColumns(config, columns) {
    var headerRowsCount = 0;
    var footerRowsCount = 0;
    var totalWidth = 0;
    var colspans = false;
    var rowsHeadersCount = 0;
    var footer = false;
    columns.map(function (col) {
        headerRowsCount = Math.max(headerRowsCount, col.header.length);
        totalWidth += col.width;
        if (col.footer) {
            footerRowsCount = Math.max(footerRowsCount, col.footer.length);
            if (!footer) {
                footer = true;
            }
        }
        if (!colspans) {
            for (var _i = 0, _a = col.header; _i < _a.length; _i++) {
                var head = _a[_i];
                if (head.colspan) {
                    colspans = true;
                    return;
                }
            }
        }
    });
    // fill missing cells
    columns.map(function (col) {
        if (col.header.length < headerRowsCount) {
            for (var i = 0; i < headerRowsCount; i++) {
                col.header[i] = col.header[i] || { text: "" };
            }
        }
        if (footer) {
            col.footer = col.footer || [];
        }
        if (col.footer && col.footer.length < footerRowsCount) {
            for (var i = 0; i < footerRowsCount; i++) {
                col.footer[i] = col.footer[i] || { text: "" };
            }
        }
        col.header.map(function (head) {
            head.css = head.css || "";
            if (!head.text && !/dhx_cell-empty/.test(head.css)) {
                head.css += " dhx_cell-empty";
            }
        });
        // find header columns indexes
        if (col.header[0].text === "") {
            rowsHeadersCount++;
        }
    });
    config.$totalWidth = totalWidth;
    config.$headerLevel = headerRowsCount;
    config.$footerLevel = footerRowsCount;
    config.$colspans = colspans;
    config.$footer = footer;
    return rowsHeadersCount;
}
exports.countColumns = countColumns;
function calculatePositions(width, height, scroll, conf) {
    var avrColWidth = conf.$totalWidth / conf.columns.length;
    var colPerPage = Math.round(width / avrColWidth);
    var rowPerPage = Math.round(height / conf.rowHeight);
    var reserve = 1;
    var y = Math.round(scroll.top / conf.rowHeight) || 0;
    var yStart = y - reserve >= 0 ? y - reserve : 0;
    var yEnd = y + rowPerPage + reserve;
    var x = 0;
    var scrollLeft = scroll.left;
    for (var i = 0; i < conf.columns.length; i++) {
        var col = conf.columns[i];
        scrollLeft = scrollLeft - col.width;
        if (scrollLeft + (avrColWidth / 2) > 0) {
            x++;
        }
        else {
            break;
        }
    }
    var xStart = x - reserve >= 0 ? x - reserve : 0;
    var xEnd = x + colPerPage + reserve;
    return {
        xStart: xStart,
        xEnd: xEnd,
        yStart: yStart,
        yEnd: yEnd
    };
}
exports.calculatePositions = calculatePositions;
function getUnique(arr, name) {
    return arr.map(function (item) { return item[name]; })
        .filter(function (item, i, array) { return array.indexOf(item) === i; })
        .sort();
}
exports.getUnique = getUnique;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// [todo]
function getWidth(columns, colspan, index) {
    if (!colspan) {
        return columns[index].width;
    }
    return columns.reduce(function (w, c, i) {
        w += (i >= index && i < index + colspan) ? c.width : 0;
        return w;
    }, 0);
}
exports.getWidth = getWidth;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(77));
__export(__webpack_require__(27));


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var en_1 = __webpack_require__(30);
var core_1 = __webpack_require__(0);
/*
    %d	day as a number with leading zero, 01..31
    %j	day as a number, 1..31
    %D	short name of the day, Su Mo Tu...
    %l	full name of the day, Sunday Monday Tuesday...
    %m	month as a number with leading zero, 01..12
    %n	month as a number, 1..12
    %M	short name of the month, Jan Feb Mar...
    %F	full name of the month, January February March...
    %y	year as a number, 2 digits
    %Y	year as a number, 4 digits
    %h	hours 12-format with leading zero, 01..12)
    %g	hours 12-format, 1..12)
    %H	hours 24-format with leading zero, 01..24
    %G	hours 24-format, 1..24
    %i	minutes with leading zero, 01..59
    %s	seconds with leading zero, 01..59
    %a	am or pm
    %A	AM or PM
    %u	milliseconds
    %P	timezone offset
*/
var formatters = {
    "%d": function (date) {
        var day = date.getDate();
        return day < 10 ? "0" + day : day;
    },
    "%j": function (date) { return date.getDate(); },
    "%l": function (date) {
        return en_1.default.days[date.getDay()];
    },
    "%D": function (date) {
        return en_1.default.daysShort[date.getDay()];
    },
    "%m": function (date) {
        var month = date.getMonth() + 1;
        return month < 10 ? "0" + month : month;
    },
    "%n": function (date) { return date.getMonth() + 1; },
    "%M": function (date) { return en_1.default.monthsShort[date.getMonth()]; },
    "%F": function (date) { return en_1.default.months[date.getMonth()]; },
    "%y": function (date) { return date.getFullYear().toString().slice(2); },
    "%Y": function (date) { return date.getFullYear(); },
    "%h": function (date) {
        var hours = date.getHours() % 12;
        return hours < 10 ? "0" + hours : hours;
    },
    "%g": function (date) { return date.getHours() % 12; },
    "%H": function (date) {
        var hours = date.getHours();
        return hours < 10 ? "0" + hours : hours;
    },
    "%G": function (date) { return date.getHours(); },
    "%i": function (date) {
        var minutes = date.getMinutes();
        return minutes < 10 ? "0" + minutes : minutes;
    },
    "%s": function (date) {
        var seconds = date.getSeconds();
        return seconds < 10 ? "0" + seconds : seconds;
    },
    "%a": function (date) { return date.getHours() > 12 ? "pm" : "am"; },
    "%A": function (date) { return date.getHours() > 12 ? "PM" : "AM"; },
    "%u": function (date) { return date.getMilliseconds(); }
};
var setFormatters = {
    "%d": function (date, value) {
        var check = /(^([0-9][0-9])$)/i.test(value);
        check
            ? date.setDate(Number(value))
            : date.setDate(Number(1));
    },
    "%j": function (date, value) {
        var check = /(^([0-9]?[0-9])$)/i.test(value);
        check
            ? date.setDate(Number(value))
            : date.setDate(Number(1));
    },
    "%m": function (date, value) {
        var check = /(^([0-9][0-9])$)/i.test(value);
        check
            ? date.setMonth(Number(value) - 1)
            : date.setMonth(Number(0));
    },
    "%n": function (date, value) {
        var check = /(^([0-9]?[0-9])$)/i.test(value);
        check
            ? date.setMonth(Number(value) - 1)
            : date.setMonth(Number(0));
    },
    "%M": function (date, value) {
        var index = core_1.findIndex(en_1.default.monthsShort, function (v) { return v === value; });
        index === -1
            ? date.setMonth(0)
            : date.setMonth(index);
    },
    "%F": function (date, value) {
        var index = core_1.findIndex(en_1.default.months, function (v) { return v === value; });
        index === -1
            ? date.setMonth(0)
            : date.setMonth(index);
    },
    "%y": function (date, value) {
        var check = /(^([0-9][0-9])$)/i.test(value);
        check
            ? date.setFullYear(Number("20" + value))
            : date.setFullYear(Number("2000"));
    },
    "%Y": function (date, value) {
        var check = /(^([0-9][0-9][0-9][0-9])$)/i.test(value);
        check
            ? date.setFullYear(Number(value))
            : date.setFullYear(Number("2000"));
    },
    "%h": function (date, value) {
        var check = /(^0[1-9]|1[0-2]$)/i.test(value);
        check
            ? date.setHours(Number(value))
            : date.setHours(Number(0));
    },
    "%g": function (date, value) {
        var check = /(^[1-9]$)|(^0[1-9]|1[0-2]$)/i.test(value);
        check
            ? date.setHours(Number(value))
            : date.setHours(Number(0));
    },
    "%H": function (date, value) {
        var check = /(^[0-9][0-3]$)/i.test(value);
        check
            ? date.setHours(Number(value))
            : date.setHours(Number(0));
    },
    "%G": function (date, value) {
        var check = /(^([0-9]$)|[0-9][0-3]$)/i.test(value);
        check
            ? date.setHours(Number(value))
            : date.setHours(Number(0));
    },
    "%i": function (date, value) {
        var check = /(^([0-5][0-9])$)/i.test(value);
        check
            ? date.setMinutes(Number(value))
            : date.setMinutes(Number(0));
    },
    "%s": function (date, value) {
        var check = /(^([0-5][0-9])$)/i.test(value);
        check
            ? date.setSeconds(Number(value))
            : date.setSeconds(Number(0));
    },
    "%a": function (date, value) {
        if (value === "pm") {
            date.setHours(date.getHours() + 12);
        }
    },
    "%A": function (date, value) {
        if (value === "PM") {
            date.setHours(date.getHours() + 12);
        }
    },
};
function getFormatedDate(format, date) {
    return tokenizeFormat(format).reduce(function (res, token) {
        if (token.type === TokenType.separator) {
            return res + token.value;
        }
        else {
            if (!formatters[token.value]) {
                return res;
            }
            return res + formatters[token.value](date);
        }
    }, "");
}
exports.getFormatedDate = getFormatedDate;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["separator"] = 0] = "separator";
    TokenType[TokenType["datePart"] = 1] = "datePart";
})(TokenType || (TokenType = {}));
function tokenizeFormat(format) {
    var tokens = [];
    var currentSeparator = "";
    for (var i = 0; i < format.length; i++) {
        if (format[i] === "%") {
            if (currentSeparator.length > 0) {
                tokens.push({
                    type: TokenType.separator,
                    value: currentSeparator
                });
                currentSeparator = "";
            }
            tokens.push({
                type: TokenType.datePart,
                value: format[i] + format[i + 1]
            });
            i++;
        }
        else {
            currentSeparator += format[i];
        }
    }
    if (currentSeparator.length > 0) {
        tokens.push({
            type: TokenType.separator,
            value: currentSeparator
        });
    }
    return tokens;
}
function stringToDate(str, format, validate) {
    var tokens = tokenizeFormat(format);
    var dateParts = [];
    var index = 0;
    var formatter = null;
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.type === TokenType.separator) {
            var sepratorIndex = str.indexOf(token.value, index);
            if (sepratorIndex === -1) {
                if (validate) {
                    return false;
                }
                throw new Error(("Incorrect date, see docs: https://docs.dhtmlx.com/suite/calendar__api__calendar_dateformat_config.html"));
            }
            if (formatter) {
                dateParts.push({
                    formatter: formatter,
                    value: str.slice(index, sepratorIndex)
                });
                formatter = null;
            }
            index = sepratorIndex + token.value.length;
        }
        else if (token.type === TokenType.datePart) {
            formatter = token.value;
        }
    }
    if (formatter) {
        dateParts.push({
            formatter: formatter,
            value: str.slice(index)
        });
    }
    var date = new Date();
    dateParts.reverse();
    for (var _a = 0, dateParts_1 = dateParts; _a < dateParts_1.length; _a++) {
        var datePart = dateParts_1[_a];
        if (setFormatters[datePart.formatter]) {
            setFormatters[datePart.formatter](date, datePart.value);
        }
    }
    return validate ? true : date;
}
exports.stringToDate = stringToDate;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var DateFormatter_1 = __webpack_require__(85);
var en_1 = __webpack_require__(6);
exports.dateFormatter = new DateFormatter_1.DateFormatter();
function fastWrap(format, idMask, labelMask) {
    var id = format.date_to_str(idMask);
    var label = format.date_to_str(labelMask);
    return function (val) {
        return {
            id: id(val),
            label: label(val)
        };
    };
}
exports.groupMethods = {
    dateByDay: fastWrap(exports.dateFormatter, "%P", "%D"),
    dateByMonth: fastWrap(exports.dateFormatter, "%m", "%M"),
    dateByQuarter: fastWrap(exports.dateFormatter, "%q", "%Q"),
    dateByWeek: fastWrap(exports.dateFormatter, "%W", en_1.default.date.week + "%W"),
    dateByYear: fastWrap(exports.dateFormatter, "%Y", "%Y")
};
function strToDate(val, format) {
    if (format === void 0) { format = "%d/%m/%Y"; }
    return exports.dateFormatter.str_to_date(format)(val);
}
exports.strToDate = strToDate;
function dateToStr(val, format) {
    return exports.dateFormatter.date_to_str(format)(val);
}
exports.dateToStr = dateToStr;
function getUniqueFieldData(field, data) {
    if (field.type === "date") {
        return core_1.naturalSort(data
            .map(function (item) { return item[field.id].getTime(); })
            .filter(function (el, i, arr) { return arr.indexOf(el) === i; }));
    }
    return core_1.naturalSort(data
        .map(function (item) { return item[field.id]; })
        .filter(function (el, i, arr) { return arr.indexOf(el) === i; }));
}
exports.getUniqueFieldData = getUniqueFieldData;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PivotEvents;
(function (PivotEvents) {
    PivotEvents["fieldClick"] = "fieldClick";
    PivotEvents["applyButtonClick"] = "applyButtonClick";
    PivotEvents["change"] = "change";
    PivotEvents["update"] = "update";
    PivotEvents["filterApply"] = "filterApply";
})(PivotEvents = exports.PivotEvents || (exports.PivotEvents = {}));


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(5);
var loader_1 = __webpack_require__(49);
var sort_1 = __webpack_require__(52);
var dataproxy_1 = __webpack_require__(11);
var helpers_1 = __webpack_require__(9);
var types_1 = __webpack_require__(8);
var core_1 = __webpack_require__(0);
var DataCollection = /** @class */ (function () {
    function DataCollection(config, events) {
        this.config = config || {};
        this._order = [];
        this._pull = {};
        this._changes = { order: [] };
        this._initOrder = null;
        this._sort = new sort_1.Sort();
        this._loader = new loader_1.Loader(this, this._changes);
        this.events = events || new events_1.EventSystem(this);
        this.events.on(types_1.DataEvents.loadError, function (response) {
            if (typeof response !== "string") {
                helpers_1.dhxError(response);
            }
            else {
                helpers_1.dhxWarning(response);
            }
        });
    }
    DataCollection.prototype.add = function (obj, index) {
        var _this = this;
        if (!this.events.fire(types_1.DataEvents.beforeAdd, [obj])) {
            return;
        }
        if (Array.isArray(obj)) {
            obj.map(function (element, key) {
                if (key !== 0) {
                    index = index + 1;
                }
                var id = _this._addCore(element, index);
                _this._onChange("add", element.id, element);
                _this.events.fire(types_1.DataEvents.afterAdd, [element]);
                return id;
            });
        }
        else {
            var id = this._addCore(obj, index);
            this._onChange("add", obj.id, obj);
            this.events.fire(types_1.DataEvents.afterAdd, [obj]);
            return id;
        }
    };
    DataCollection.prototype.remove = function (id) {
        var _this = this;
        if (id) {
            if (id instanceof Array) {
                id.map(function (element) {
                    var obj = _this._pull[element];
                    if (obj) {
                        if (!_this.events.fire(types_1.DataEvents.beforeRemove, [obj])) {
                            return;
                        }
                        _this._removeCore(obj.id);
                        _this._onChange("remove", element, obj);
                    }
                    _this.events.fire(types_1.DataEvents.afterRemove, [obj]);
                });
            }
            else {
                var obj = this._pull[id];
                if (obj) {
                    if (!this.events.fire(types_1.DataEvents.beforeRemove, [obj])) {
                        return;
                    }
                    this._removeCore(obj.id);
                    this._onChange("remove", id, obj);
                }
                this.events.fire(types_1.DataEvents.afterRemove, [obj]);
            }
        }
    };
    DataCollection.prototype.removeAll = function () {
        this._removeAll();
        this.events.fire(types_1.DataEvents.removeAll);
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.exists = function (id) {
        return !!this._pull[id];
    };
    DataCollection.prototype.getNearId = function (id) {
        var item = this._pull[id];
        if (!item) {
            return this._order[0].id || "";
        }
    };
    DataCollection.prototype.getItem = function (id) {
        return this._pull[id];
    };
    DataCollection.prototype.update = function (id, obj, silent) {
        var item = this.getItem(id);
        if (item) {
            if (helpers_1.isEqualObj(obj, item)) {
                return;
            }
            if (obj.id && id !== obj.id) {
                helpers_1.dhxWarning("this method doesn't allow change id");
                if (helpers_1.isDebug()) {
                    // tslint:disable-next-line:no-debugger
                    debugger;
                }
            }
            else {
                core_1.extend(this._pull[id], obj, false);
                if (this.config.update) {
                    this.config.update(this._pull[id]);
                }
                if (!silent) {
                    this._onChange("update", id, this._pull[id]);
                }
            }
        }
        else {
            helpers_1.dhxWarning("item not found");
        }
    };
    DataCollection.prototype.getIndex = function (id) {
        var res = core_1.findIndex(this._order, function (item) { return item.id === id; });
        if (this._pull[id] && res >= 0) {
            return res;
        }
        return -1;
    };
    DataCollection.prototype.getId = function (index) {
        if (!this._order[index]) {
            return;
        }
        return this._order[index].id;
    };
    DataCollection.prototype.getLength = function () {
        return this._order.length;
    };
    DataCollection.prototype.filter = function (rule, config) {
        config = core_1.extend({
            add: false,
            multiple: true
        }, config);
        if (!config.add) {
            this._order = this._initOrder || this._order;
            this._initOrder = null;
        }
        this._filters = this._filters || {};
        if (!config.multiple || !rule) {
            this._filters = {};
        }
        if (rule) {
            if (typeof rule === "function") {
                var f = "_";
                this._filters[f] = {
                    match: f,
                    compare: rule
                };
            }
            else {
                if (!rule.match) {
                    delete this._filters[rule.by];
                }
                else {
                    rule.compare = rule.compare || (function (val, match) { return val === match; });
                    this._filters[rule.by] = rule;
                }
            }
            this._applyFilters();
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.find = function (conf) {
        for (var key in this._pull) {
            var res = helpers_1.findByConf(this._pull[key], conf);
            if (res) {
                return res;
            }
        }
        return null;
    };
    DataCollection.prototype.findAll = function (conf) {
        var res = [];
        for (var key in this._pull) {
            var item = helpers_1.findByConf(this._pull[key], conf);
            if (item) {
                res.push(item);
            }
        }
        return res;
    };
    DataCollection.prototype.sort = function (by) {
        if (!by) {
            this._order = [];
            for (var key in this._pull) {
                this._order.push(this._pull[key]);
            }
            this._applyFilters();
        }
        else {
            this._sort.sort(this._order, by);
            if (this._initOrder && this._initOrder.length) {
                this._sort.sort(this._initOrder, by);
            }
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.copy = function (id, index, target, targetId) {
        if (!this.exists(id)) {
            return null;
        }
        var newid = core_1.uid();
        if (target) {
            if (!(target instanceof DataCollection) && targetId) {
                target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                return;
            }
            if (target.exists(id)) {
                target.add(__assign({}, helpers_1.copyWithoutInner(this.getItem(id)), { id: newid }), index);
                return newid;
            }
            else {
                target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                return id;
            }
        }
        this.add(__assign({}, helpers_1.copyWithoutInner(this.getItem(id)), { id: newid }), index);
        return newid;
    };
    DataCollection.prototype.move = function (id, index, target, targetId) {
        if (target && target !== this && this.exists(id)) {
            var item = core_1.copy(this.getItem(id), true);
            if (target.exists(id)) {
                item.id = core_1.uid();
            }
            if (targetId) {
                item.parent = targetId;
            }
            target.add(item, index);
            // remove data from original collection
            this.remove(id);
            return item.id;
        }
        if (this.getIndex(id) === index) {
            return null;
        }
        // move other elements
        var spliced = this._order.splice(this.getIndex(id), 1)[0];
        if (index === -1) {
            index = this._order.length;
        }
        this._order.splice(index, 0, spliced);
        this.events.fire(types_1.DataEvents.change); // if target not this, it trigger add and remove
        return id;
    };
    DataCollection.prototype.load = function (url, driver) {
        if (typeof url === "string") {
            url = new dataproxy_1.DataProxy(url);
        }
        return this._loader.load(url, driver);
    };
    DataCollection.prototype.parse = function (data, driver) {
        this._removeAll();
        return this._loader.parse(data, driver);
    };
    DataCollection.prototype.$parse = function (data) {
        var apx = this.config.approximate;
        if (apx) {
            data = this._approximate(data, apx.value, apx.maxNum);
        }
        this._parse_data(data);
        this.events.fire(types_1.DataEvents.change, ["load"]);
        this.events.fire(types_1.DataEvents.load);
    };
    DataCollection.prototype.save = function (url) {
        this._loader.save(url);
    };
    // todo: loop through the array and check saved statuses
    DataCollection.prototype.isSaved = function () {
        return !this._changes.order.length; // todo: bad solution, errors and holded elments are missed...
    };
    DataCollection.prototype.map = function (cb) {
        var result = [];
        for (var i = 0; i < this._order.length; i++) {
            result.push(cb.call(this, this._order[i], i));
        }
        return result;
    };
    DataCollection.prototype.mapRange = function (from, to, cb) {
        if (from < 0) {
            from = 0;
        }
        if (to > this._order.length - 1) {
            to = this._order.length - 1;
        }
        var result = [];
        for (var i = from; i <= to; i++) {
            result.push(cb.call(this, this._order[i], i));
        }
        return result;
    };
    DataCollection.prototype.reduce = function (cb, acc) {
        for (var i = 0; i < this._order.length; i++) {
            acc = cb.call(this, acc, this._order[i], i);
        }
        return acc;
    };
    DataCollection.prototype.serialize = function (driver) {
        if (driver === void 0) { driver = types_1.DataDriver.json; }
        var data = this.map(function (item) {
            var newItem = __assign({}, item);
            Object.keys(newItem).forEach(function (key) {
                if (key[0] === "$") {
                    delete newItem[key];
                }
            });
            return newItem;
        });
        var dataDriver = helpers_1.toDataDriver(driver);
        if (dataDriver) {
            return dataDriver.serialize(data);
        }
    };
    DataCollection.prototype.getInitialData = function () {
        return this._initOrder;
    };
    DataCollection.prototype._removeAll = function () {
        this._pull = {};
        this._order = [];
        this._changes.order = [];
        this._initOrder = null;
    };
    DataCollection.prototype._addCore = function (obj, index) {
        if (this.config.init) {
            obj = this.config.init(obj);
        }
        obj.id = obj.id ? obj.id.toString() : core_1.uid();
        if (this._pull[obj.id]) {
            helpers_1.dhxError("Item already exist");
        }
        // todo: not ideal solution
        if (this._initOrder && this._initOrder.length) {
            this._addToOrder(this._initOrder, obj, index);
        }
        this._addToOrder(this._order, obj, index);
        return obj.id;
    };
    DataCollection.prototype._removeCore = function (id) {
        if (this.getIndex(id) >= 0) {
            this._order = this._order.filter(function (el) { return el.id !== id; });
            delete this._pull[id];
        }
        if (this._initOrder && this._initOrder.length) {
            this._initOrder = this._initOrder.filter(function (el) { return el.id !== id; });
        }
    };
    DataCollection.prototype._parse_data = function (data) {
        var index = this._order.length;
        if (this.config.prep) {
            data = this.config.prep(data);
        }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            obj.id = (obj.id || obj.id === 0) ? obj.id : core_1.uid();
            this._pull[obj.id] = obj;
            this._order[index++] = obj;
        }
    };
    DataCollection.prototype._approximate = function (data, values, maxNum) {
        var len = data.length;
        var vlen = values.length;
        var rlen = Math.floor(len / maxNum);
        var newData = Array(Math.ceil(len / rlen));
        var index = 0;
        for (var i = 0; i < len; i += rlen) {
            var newItem = core_1.copy(data[i]);
            var end = Math.min(len, i + rlen);
            for (var j = 0; j < vlen; j++) {
                var sum = 0;
                for (var z = i; z < end; z++) {
                    sum += data[z][values[j]];
                }
                newItem[values[j]] = sum / (end - i);
            }
            newData[index++] = newItem;
        }
        return newData;
    };
    DataCollection.prototype._onChange = function (status, id, obj) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var item = _a[_i];
            // update pending item if previous state is "saving" or if item not saved yet
            if (item.id === id && !item.saving) {
                // update item
                if (item.error) {
                    item.error = false;
                }
                item = __assign({}, item, { obj: obj, status: status });
                this.events.fire(types_1.DataEvents.change, [id, status, obj]);
                return;
            }
        }
        this._changes.order.push({ id: id, status: status, obj: __assign({}, obj), saving: false });
        this.events.fire(types_1.DataEvents.change, [id, status, obj]);
    };
    DataCollection.prototype._addToOrder = function (array, obj, index) {
        if (index >= 0 && array[index]) {
            this._pull[obj.id] = obj;
            array.splice(index, 0, obj);
        }
        else {
            this._pull[obj.id] = obj;
            array.push(obj);
        }
    };
    DataCollection.prototype._applyFilters = function () {
        var _this = this;
        if (this._filters && Object.keys(this._filters).length) {
            var fOrder = this._order.filter(function (item) {
                return Object.keys(_this._filters).every(function (key) {
                    return item[key] ?
                        _this._filters[key].compare(item[key], _this._filters[key].match, item)
                        : _this._filters[key].compare(item);
                });
            });
            if (!this._initOrder) {
                this._initOrder = this._order;
            }
            this._order = fOrder;
        }
    };
    return DataCollection;
}());
exports.DataCollection = DataCollection;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsonDriver_1 = __webpack_require__(22);
var CsvDriver_1 = __webpack_require__(23);
var XMLDriver_1 = __webpack_require__(50);
exports.dataDrivers = {
    json: JsonDriver_1.JsonDriver,
    csv: CsvDriver_1.CsvDriver
};
exports.dataDriversPro = __assign({}, exports.dataDrivers, { xml: XMLDriver_1.XMLDriver });


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonDriver = /** @class */ (function () {
    function JsonDriver() {
    }
    JsonDriver.prototype.toJsonArray = function (data) {
        return this.getRows(data);
    };
    JsonDriver.prototype.serialize = function (data) {
        return data;
    };
    JsonDriver.prototype.getFields = function (row) {
        return row;
    };
    JsonDriver.prototype.getRows = function (data) {
        return typeof data === "string" ? JSON.parse(data) : data;
    };
    return JsonDriver;
}());
exports.JsonDriver = JsonDriver;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CsvDriver = /** @class */ (function () {
    function CsvDriver(config) {
        var initConfig = {
            skipHeader: 0,
            nameByHeader: false,
            rowDelimiter: "\n",
            columnDelimiter: ",",
        };
        this.config = __assign({}, initConfig, config);
        if (this.config.nameByHeader) {
            this.config.skipHeader = 1;
        }
    }
    CsvDriver.prototype.getFields = function (row, headers) {
        var parts = row.trim().split(this.config.columnDelimiter);
        var obj = {};
        for (var i = 0; i < parts.length; i++) {
            obj[headers ? headers[i] : i + 1] = parts[i];
        }
        return obj;
    };
    CsvDriver.prototype.getRows = function (data) {
        return data.trim().split(this.config.rowDelimiter);
    };
    CsvDriver.prototype.toJsonArray = function (data) {
        var _this = this;
        var rows = this.getRows(data);
        var names = this.config.names;
        if (this.config.skipHeader) {
            var top_1 = rows.splice(0, this.config.skipHeader);
            if (this.config.nameByHeader) {
                names = top_1[0].trim().split(this.config.columnDelimiter);
            }
        }
        return rows.map(function (row) { return _this.getFields(row, names); });
    };
    CsvDriver.prototype.serialize = function (data, withoutHeader) {
        var header = data[0] ? Object.keys(data[0])
            .filter(function (key) { return key[0] !== "$"; })
            .join(this.config.columnDelimiter) : "";
        var readyData = this._serialize(data);
        if (withoutHeader) {
            return readyData;
        }
        return header + readyData;
    };
    CsvDriver.prototype._serialize = function (data) {
        var _this = this;
        return data.reduce(function (csv, row) {
            var cells = Object.keys(row).reduce(function (total, key, i) {
                if (key[0] === "$" || key === "items") {
                    return total;
                }
                return "" + total + row[key] + (i === row.length - 1 ? "" : _this.config.columnDelimiter);
            }, "");
            if (row.items) {
                return csv + "\n" + cells + _this._serialize(row.items);
            }
            return "" + csv + _this.config.rowDelimiter + cells;
        }, "");
    };
    return CsvDriver;
}());
exports.CsvDriver = CsvDriver;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(60));
__export(__webpack_require__(3));
__export(__webpack_require__(15));
__export(__webpack_require__(14));
__export(__webpack_require__(10));


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var cells_1 = __webpack_require__(15);
var main_1 = __webpack_require__(10);
var types_1 = __webpack_require__(3);
var editors_1 = __webpack_require__(64);
function handleMouse(row, col, conf, type, e) {
    conf.events.fire(type, [row, col, e]);
}
function getHandlers(row, column, conf) {
    return {
        onclick: [handleMouse, row, column, conf, types_1.GridEvents.cellClick],
        onmouseover: [handleMouse, row, column, conf, types_1.GridEvents.cellMouseOver],
        onmousedown: [handleMouse, row, column, conf, types_1.GridEvents.cellMouseDown],
        ondblclick: [handleMouse, row, column, conf, types_1.GridEvents.cellDblClick],
        oncontextmenu: [handleMouse, row, column, conf, types_1.GridEvents.cellRightClick]
    };
}
function getTreeCell(content, row, col, conf) {
    return dom_1.el(".dhx_grid-cell", __assign({ class: "dhx_tree-cell " + (col.$cellCss[row.id] || "") + " " + (row.$items ? "dhx_grid-expand-cell" : ""), style: {
            width: col.width,
            lineHeight: conf.rowHeight + "px",
            paddingLeft: 24 * row.$level
        }, dhx_id: row.id }, getHandlers(row, col, conf)), [
        row.$items ? dom_1.el(".dhx_grid-expand-cell-icon", {
            class: row.$opened ? "dxi dxi-chevron-up" : "dxi dxi-chevron-down",
            dhx_id: row.id,
        }) : null,
        dom_1.el(".dhx_tree-cell", {
            title: main_1.removeHTMLTags(row[col.id]),
            style: {
                width: col.width - row.$level * 10,
                height: "100%",
                textAlign: "left"
            }
        }, [content])
    ]);
}
function getEditorCell(row, col, conf) {
    return editors_1.getEditor(row, col, conf).toHTML();
}
function getCells(conf) {
    if (!conf.data || !conf.columns) {
        return [];
    }
    var pos = conf.$positions;
    var data = conf.data ? conf.data.slice(pos.yStart, pos.yEnd) : [];
    var columns = conf.columns.slice(pos.xStart, pos.xEnd);
    return data.map(function (row) {
        var rowCss = "";
        if (conf.rowCss) {
            rowCss = conf.rowCss(row);
        }
        if (row.$css) {
            rowCss += row.$css;
        }
        return dom_1.el(".dhx_grid-row", {
            "style": { height: conf.rowHeight },
            "dhx_grid-row": row.id,
            "class": rowCss
        }, columns.map(function (col) {
            var t = function (text, _row, _col) { return (text || text === 0) ? text : ""; };
            var template = col.template || t;
            var content = template(row[col.id], row, col);
            // ability to use domvm node as template result
            content = typeof content === "string" ? dom_1.el("div.dhx_cell-content", { ".innerHTML": content }) : content;
            var css = ((col.$cellCss[row.id] || "") + " dhx_" + col.type + "-cell").replace(/\s+/g, " ");
            var isEditable = conf.$editable && conf.$editable.row === row.id && conf.$editable.col === col.id;
            if (isEditable) {
                content = getEditorCell(row, col, conf);
                css += " dhx_grid-cell__editable";
            }
            if (conf.type === "tree" && conf.firstColId === col.id) {
                return getTreeCell(content, row, col, conf);
            }
            return dom_1.el(".dhx_grid-cell", __assign({ class: css, style: {
                    width: col.width,
                    lineHeight: conf.rowHeight + "px"
                }, _key: row.id + col.id }, getHandlers(row, col, conf), { title: main_1.removeHTMLTags(row[col.id]) }), [content]);
        }));
    });
}
exports.getCells = getCells;
function getSpans(conf) {
    var spanCells = [];
    var columns = conf.columns;
    if (!columns.length) {
        return null;
    }
    if (!conf.spans) {
        return null;
    }
    var spans = conf.spans.sort(function (a, b) {
        return (typeof a.row === "string" && typeof b.row === "string") ?
            a.row.localeCompare(b.row)
            : a.row - b.row;
    });
    var cellHeight = conf.rowHeight;
    var _loop_1 = function (i) {
        var row = spans[i].row;
        var col = spans[i].column;
        var spanHeight = spans[i].rowspan;
        var spanWidth = spans[i].colspan;
        var spanCss = spans[i].css;
        // [todo]
        if (spanHeight === 1) {
            return "continue";
        }
        var colIndex = core_1.findIndex(columns, function (item) { return "" + item.id === "" + col; });
        var rowIndex = core_1.findIndex(conf.data, function (item) { return "" + item.id === "" + row; });
        if (colIndex < 0 || rowIndex < 0) {
            return "continue";
        }
        var currCol = columns[colIndex];
        var currRow = conf.data[rowIndex];
        var content = spans[i].text ?
            spans[i].text
            : currRow[col] === undefined ? "" : currRow[col];
        var tooltipText = content;
        var t = function (text, _row, _col) { return (text || text === 0) ? text : ""; };
        var template = currCol.template || t;
        content = template(content, currRow, currCol);
        content = typeof content === "string" ? dom_1.el("div.dhx_span-cell-content", { ".innerHTML": content }) : content;
        var top_1 = conf.rowHeight * rowIndex;
        var left = 0;
        for (var s = colIndex - 1; s >= 0; s--) {
            left += columns[s].width;
        }
        var css = currCol.header[0].text ? "dhx_span-cell" : "dhx_span-cell dhx_span-cell--title";
        if (spanCss) {
            css += " " + spanCss;
        }
        if (rowIndex === 0) {
            css += " dhx_span-first-row";
        }
        // [dirty]
        if (colIndex === 0) {
            css += " dhx_span-first-col";
        }
        var rowspanWithLastCol = colIndex === columns.length - 1;
        var colspanWithLastCol = colIndex + spanWidth === columns.length;
        if (rowspanWithLastCol || colspanWithLastCol) {
            css += " dhx_span-last-col";
        }
        if (!spanWidth) {
            css += " dhx_span-" + (currCol.type || "string") + "-cell";
        }
        else {
            css += " dhx_span-string-cell";
        }
        var width = spanWidth > 1 ? cells_1.getWidth(conf.columns, spanWidth, colIndex) : currCol.width;
        spanCells.push(dom_1.el("div", {
            class: css,
            style: {
                width: width,
                height: (spanHeight || 1) * cellHeight,
                top: top_1,
                left: left,
                lineHeight: conf.rowHeight + "px"
            },
            title: main_1.removeHTMLTags(tooltipText),
        }, [content]));
    };
    for (var i = 0; i < spans.length; i++) {
        _loop_1(i);
    }
    return spanCells;
}
exports.getSpans = getSpans;
function getShifts(conf) {
    var columnsLeft = conf.columns.slice(0, conf.$positions.xStart);
    return {
        x: columnsLeft.reduce(function (sum, col) { return sum += col.width; }, 0),
        y: conf.$positions.yStart * conf.rowHeight
    };
}
exports.getShifts = getShifts;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(72));


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PopupEvents;
(function (PopupEvents) {
    PopupEvents["beforeHide"] = "beforehide";
    PopupEvents["beforeShow"] = "beforeshow";
    PopupEvents["afterHide"] = "afterhide";
    PopupEvents["afterShow"] = "aftershow";
    PopupEvents["click"] = "click";
})(PopupEvents = exports.PopupEvents || (exports.PopupEvents = {}));


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Direction;
(function (Direction) {
    Direction["vertical"] = "vertical";
    Direction["horizontal"] = "horizontal";
})(Direction = exports.Direction || (exports.Direction = {}));
var SliderEvents;
(function (SliderEvents) {
    SliderEvents["change"] = "change";
    SliderEvents["mousedown"] = "mousedown";
    SliderEvents["mouseup"] = "mouseup";
})(SliderEvents = exports.SliderEvents || (exports.SliderEvents = {}));


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TimepickerEvents;
(function (TimepickerEvents) {
    TimepickerEvents["change"] = "change";
    TimepickerEvents["save"] = "save";
    TimepickerEvents["close"] = "close";
})(TimepickerEvents = exports.TimepickerEvents || (exports.TimepickerEvents = {}));


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var locale = {
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Monday"],
    cancel: "Cancel"
};
exports.default = locale;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ViewMode;
(function (ViewMode) {
    ViewMode["days"] = "calendar";
    ViewMode["years"] = "year";
    ViewMode["months"] = "month";
    ViewMode["timepicker"] = "timepicker";
})(ViewMode = exports.ViewMode || (exports.ViewMode = {}));
var CalendarEvents;
(function (CalendarEvents) {
    CalendarEvents["change"] = "change";
    CalendarEvents["beforeChange"] = "beforechange";
    CalendarEvents["dateHover"] = "dateHover";
})(CalendarEvents = exports.CalendarEvents || (exports.CalendarEvents = {}));


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var cells_1 = __webpack_require__(15);
var main_1 = __webpack_require__(10);
var types_1 = __webpack_require__(3);
var content_1 = __webpack_require__(33);
function handleMouse(col, config, type, e) {
    config.events.fire(type, [col, e]);
}
function getHandlers(column, rowName, config) {
    return {
        onclick: [handleMouse, column, config, types_1.GridEvents[rowName + "CellClick"]],
        onmouseover: [handleMouse, column, config, types_1.GridEvents[rowName + "CellMouseOver"]],
        onmousedown: [handleMouse, column, config, types_1.GridEvents[rowName + "CellMouseDown"]],
        ondblclick: [handleMouse, column, config, types_1.GridEvents[rowName + "CellDblClick"]],
        oncontextmenu: [handleMouse, column, config, types_1.GridEvents[rowName + "CellRightClick"]]
    };
}
function buildRows(columns, name) {
    var header = columns.map(function (col) { return col[name] || [{}]; });
    return main_1.transpose(header);
}
function getCustomContentCell(cell, column, config, rowName, css) {
    if (css === void 0) { css = ""; }
    var rowHeight = config[name + "RowHeight"] || 40;
    var type = column.type ? "dhx_" + column.type + "-cell" : "dhx_string_cell";
    return dom_1.el(".dhx_grid-" + rowName + "-cell.dhx_grid-custom-content-cell." + type, __assign({ class: css, style: {
            width: column.width,
            lineHeight: rowHeight + 1 + "px"
        } }, getHandlers(column, rowName, config)), [
        content_1.content[cell.content] && content_1.content[cell.content].toHtml(column, config)
    ]);
}
function getRows(config, rowsConfig) {
    if (!config.data || !config.columns) {
        return [];
    }
    var rowName = rowsConfig.name;
    var columns = config.currentColumns;
    var rowHeight = config[rowName + "RowHeight"] || 40;
    var rows = buildRows(columns, rowName);
    return rows.map(function (row) { return dom_1.el(".dhx_" + rowName + "-row", { style: { height: rowHeight } }, row.map(function (cell, i) {
        var css = cell.css || "";
        var column = columns[i];
        var sortIconCss = "dxi dxi-sort-variant dhx_grid-sort-icon";
        if (config.sortBy && "" + column.id === config.sortBy && !cell.content) {
            sortIconCss += " dhx_grid-sort-icon--" + (config.sortDir || "asc");
            css += " dhx_grid-" + rowName + "-cell--sorted ";
        }
        var sortIconVisible = cell.text && config.headerSort && rowName !== "footer";
        // [todo]
        if (sortIconVisible) {
            css += " dhx_grid-header-cell--sortable";
        }
        var isFirstCol = i === 0 ? "dhx_first-column-cell" : "";
        var isLastCol = i === columns.length - 1 ? "dhx_last-column-cell" : "";
        if (!cell.content) {
            css += " dhx_grid-header-cell--" + (column.type === "number" ? "align_right" : "align_left") + " ";
        }
        css += isFirstCol + " " + isLastCol;
        if (cell.content) {
            return getCustomContentCell(cell, column, config, rowName, css);
        }
        return dom_1.el(".dhx_grid-" + rowName + "-cell", __assign({ class: css.trim(), dhx_id: column.id, _key: i, style: {
                width: column.width,
                lineHeight: rowHeight + 1 + "px"
            } }, getHandlers(column, rowName, config), { title: main_1.removeHTMLTags(cell.text) }), [
            dom_1.el("div", { ".innerHTML": cell.text }),
            sortIconVisible && dom_1.el("div", { class: sortIconCss })
        ]);
    })); });
}
exports.getRows = getRows;
function getSpans(config, rowsConfig) {
    var cols = config.columns;
    var rows = main_1.transpose(cols.map(function (col) { return col[rowsConfig.name] || []; }));
    var height = config[rowsConfig.name + "RowHeight"] || 40;
    var leftShift = 0;
    return rows.map(function (row, i) {
        leftShift = 0;
        return dom_1.el(".dhx_span-row", { style: { top: height * i + "px", height: height } }, row.map(function (cell, cellIdx) {
            var col = cols[cellIdx];
            leftShift += col.width;
            var isFirstCol = cellIdx === 0 ? "dhx_first-column-cell" : "";
            var isLastCol = (cellIdx === cols.length - 1)
                || ((cell.colspan || 0) + (cellIdx - 1) >= cols.length - 1) ? "dhx_last-column-cell" : "";
            var spanHeight = height;
            if (cell.rowspan) {
                spanHeight = spanHeight * cell.rowspan - 1;
            }
            var sortIconVisible = cell.rowspan
                && cell.text
                && config.headerSort
                && rowsConfig.name !== "footer";
            var sortIconCss = "dxi dxi-sort-variant dhx_grid-sort-icon";
            if (config.sortBy && "" + col.id === config.sortBy && !cell.content) {
                sortIconCss += " dhx_grid-sort-icon--" + (config.sortDir || "asc");
            }
            var css = isFirstCol + " " + isLastCol + " " + (cell.rowspan ? "dhx_span-cell__rowspan" : "");
            if (sortIconVisible) {
                css += " dhx_grid-header-cell  dhx_grid-header-cell--sortable";
            }
            if (!cell.content) {
                css += " dhx_grid-header-cell--" + (col.type === "number" ? "align_right" : "align_left") + " ";
            }
            return (cell.colspan || cell.rowspan) ?
                dom_1.el(".dhx_span-cell", {
                    style: {
                        width: cells_1.getWidth(config.columns, cell.colspan, cellIdx),
                        height: spanHeight,
                        left: leftShift - col.width,
                        top: height * i,
                        lineHeight: spanHeight + "px"
                    },
                    class: css.trim(),
                    title: main_1.removeHTMLTags(cell.text),
                    dhx_id: col.id
                }, [
                    dom_1.el("div", { ".innerHTML": cell.text }),
                    sortIconVisible && dom_1.el("div", { class: sortIconCss })
                ])
                : null;
        }).filter(function (cell) { return cell; }));
    });
}
exports.getSpans = getSpans;
function getFixedRows(config, rowsConfig) {
    var _a;
    var rows = getRows(config, rowsConfig);
    var spans = getSpans(config, rowsConfig);
    var fixedCols = null;
    if (rowsConfig.name === "footer" && !rowsConfig.sticky) {
        fixedCols = config.splitAt >= 0 && getRows(__assign({}, config, { currentColumns: config.columns.slice(0, config.splitAt), $positions: __assign({}, config.$positions, { xStart: 0, xEnd: config.splitAt }) }), rowsConfig);
    }
    var styles = (_a = {
            position: "sticky"
        },
        _a[rowsConfig.position] = 0,
        _a);
    var left;
    if (!rowsConfig.sticky) {
        styles.left = -config.scroll.left;
        left = -config.scroll.left;
        styles.position = "relative";
    }
    var BORDERS = 2;
    return dom_1.el(".dhx_" + rowsConfig.name + "-wrapper", {
        class: rowsConfig.sticky ? "" : "dhx_compatible-" + rowsConfig.name,
        style: __assign({}, styles, { left: rowsConfig.sticky ? left : 0, height: config[rowsConfig.name + "Height"], width: rowsConfig.sticky ? config.$totalWidth : rowsConfig.wrapper.width - BORDERS })
    }, [
        dom_1.el(".dhx_grid-" + rowsConfig.name, {
            style: {
                height: config[rowsConfig.name + "Height"],
                left: left,
                paddingLeft: rowsConfig.shifts.x,
                width: config.$totalWidth,
            }
        }, [
            dom_1.el(".dhx_" + rowsConfig.name + "-rows", rows.slice()),
            dom_1.el(".dhx_" + rowsConfig.name + "-spans", {
                style: {
                    marginLeft: -rowsConfig.shifts.x
                }
            }, spans),
            fixedCols && dom_1.el(".dhx_" + rowsConfig.name + "-fixed-cols", {
                style: {
                    position: "absolute",
                    top: 0,
                    left: config.scroll.left + "px",
                    height: "100%"
                }
            }, fixedCols)
        ]),
        dom_1.el("div", { style: { width: config.$totalWidth } })
    ]);
}
exports.getFixedRows = getFixedRows;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
var inputDelay;
function onInput(eventSystem, colId, filter, filterObj, e) {
    var inputHandler = function () {
        filterObj.value[colId] = e.target.value;
        eventSystem.fire(types_1.GridEvents.headerInput, [e.target.value, colId, filter]);
    };
    if (filter === "selectFilter") {
        inputHandler();
        return;
    }
    if (inputDelay) {
        clearTimeout(inputDelay);
    }
    inputDelay = setTimeout(inputHandler, 250);
}
function applyMathMethod(column, config, method, validate) {
    var id = column.id;
    var columnData = validate ? validate(id, config.data) : config.data.reduce(function (items, item) {
        if (item[id] !== undefined && item[id] !== "" && !isNaN(item[id])) {
            items.push(parseFloat(item[id]));
        }
        return items;
    }, []);
    // [todo] move to treegrid
    var roots = columnData;
    if (config.type === "tree") {
        roots = config.data.reduce(function (total, item) {
            if (item.$level === 0) {
                if (item[id] !== undefined && item[id] !== "" && !isNaN(item[id])) {
                    total.push((parseFloat(item[id]) || 0));
                }
                else {
                    var value_1 = 0;
                    config.datacollection.eachChild(item.id, function (cell) {
                        if (!config.datacollection.haveItems(cell.id)) {
                            value_1 += parseFloat(cell[id]);
                        }
                    });
                    total.push(value_1);
                }
            }
            return total;
        }, []);
    }
    return method(columnData, roots);
}
exports.content = {
    inputFilter: {
        toHtml: function (column, config) {
            return dom_1.el("label.dhx_grid-filter__label.dxi.dxi-magnify", [
                dom_1.el("input", {
                    type: "text",
                    class: "dhx_input dhx_grid-filter",
                    oninput: [onInput, config.events, column.id, "inputFilter", this],
                    _key: column.id,
                    value: this.value[column.id] || ""
                })
            ]);
        },
        match: function (value, match) { return new RegExp("" + match, "i").test(value); },
        value: {}
    },
    selectFilter: {
        toHtml: function (column, config) {
            return dom_1.el("label.dhx_grid-filter__label.dxi.dxi-menu-down", [
                dom_1.el("select.dxi.dxi-menu-down", {
                    type: "text",
                    class: "dhx_input dhx_grid-filter dhx_grid-filter--select",
                    onchange: [onInput, config.events, column.id, "selectFilter", this],
                    _key: column.id,
                    value: this.value[column.id] || ""
                }, [
                    dom_1.el("option", { value: "" }, "")
                ].concat(column.$uniqueData.map(function (val) { return val && dom_1.el("option", { value: val }, val); })))
            ]);
        },
        match: function (value, match) { return value === match; },
        value: {}
    },
    sum: {
        calculate: function (_col, roots) { return roots.reduce(function (sum, c) { return sum += parseFloat(c) || 0; }, 0).toFixed(3); },
        toHtml: function (column, config) { return applyMathMethod(column, config, this.calculate); }
    },
    avg: {
        calculate: function (_col, roots) { return (roots.reduce(function (sum, c) { return sum += c; }, 0) / _col.length).toFixed(3); },
        toHtml: function (column, config) { return applyMathMethod(column, config, this.calculate); }
    },
    min: {
        calculate: function (col) { return Math.min.apply(Math, col).toFixed(3); },
        toHtml: function (column, config) { return applyMathMethod(column, config, this.calculate); }
    },
    max: {
        calculate: function (col) { return Math.max.apply(Math, col).toFixed(3); },
        toHtml: function (column, config) { return applyMathMethod(column, config, this.calculate); }
    },
    count: {
        calculate: function (_col, roots) {
            // [todo]
            return roots.reduce(function (count, c) { return count += c; }, 0);
        },
        validate: function (colId, data) {
            return data.reduce(function (items, item) {
                if (item[colId] !== undefined && item[colId] !== "") {
                    if (isNaN(item)) {
                        items.push(1);
                    }
                    else {
                        items.push(item);
                    }
                }
                return items;
            }, []);
        },
        toHtml: function (column, config) { return applyMathMethod(column, config, this.calculate, this.validate); }
    }
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var ts_data_1 = __webpack_require__(7);
var TreeGridCollection = /** @class */ (function (_super) {
    __extends(TreeGridCollection, _super);
    function TreeGridCollection(config, events) {
        return _super.call(this, config, events) || this;
    }
    TreeGridCollection.prototype.eachChild = function (id, cb, direct, checkItem) {
        if (direct === void 0) { direct = true; }
        checkItem = checkItem || (function (item) { return item.$opened !== false; });
        _super.prototype.eachChild.call(this, id, cb, direct, checkItem);
    };
    TreeGridCollection.prototype.getMaxLevel = function () {
        var _this = this;
        var maxLevel = 0;
        this.map(function (el) {
            var level = _this.getLevel(el.id);
            maxLevel = Math.max(level, maxLevel);
        });
        return maxLevel;
    };
    TreeGridCollection.prototype.getLevel = function (id) {
        var level = 0;
        this.eachParent(id, function () {
            level++;
        });
        return level;
    };
    TreeGridCollection.prototype.serialize = function (driver) {
        var _this = this;
        if (driver === void 0) { driver = ts_data_1.DataDriver.json; }
        var data = [];
        this.eachChild(this.getRoot(), function (el) {
            if (!el) {
                return;
            }
            var cell = __assign({}, el, { $level: _this.getLevel(el.id), $items: _this.haveItems(el.id) });
            if (_this.haveItems(el.id) && el.$opened === undefined) {
                el.$opened = cell.$opened = true;
            }
            data.push(cell);
        });
        var dataDriver = ts_data_1.toDataDriver(driver);
        if (dataDriver) {
            return dataDriver.serialize(data);
        }
    };
    TreeGridCollection.prototype.getPlainIndex = function (id) {
        return Object.keys(this._pull).indexOf(id);
    };
    TreeGridCollection.prototype.map = function (cb, parent, direct) {
        if (parent === void 0) { parent = this._root; }
        if (direct === void 0) { direct = true; }
        var result = [];
        if (!this.haveItems(parent)) {
            return result;
        }
        for (var i = 0; i < this._childs[parent].length; i++) {
            result.push(cb.call(this, this._childs[parent][i], i));
            if (direct) {
                if (this._childs[parent][i].$opened) {
                    var childResult = this.map(cb, this._childs[parent][i].id, direct);
                    result = result.concat(childResult);
                }
            }
        }
        return result;
    };
    // [todo]
    TreeGridCollection.prototype.getId = function (index) {
        return Object.keys(this._pull)[index];
    };
    TreeGridCollection.prototype._parse_data = function (data, parent) {
        if (parent === void 0) { parent = this._root; }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            obj.id = obj.id ? obj.id.toString() : core_1.uid();
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            this._pull[obj.id] = obj;
            if (!this._childs[obj.parent]) {
                this._childs[obj.parent] = [];
            }
            this._childs[obj.parent].push(obj);
            obj.$level = this.getLevel(obj.id);
            if (obj.items && obj.items instanceof Object) {
                obj.$opened = true;
                this._parse_data(obj.items, obj.id);
            }
        }
        this._checkItems();
    };
    TreeGridCollection.prototype._checkItems = function () {
        var _this = this;
        this.eachChild(this._root, function (item) {
            item.$items = item.$opened = _this.haveItems(item.id);
        });
    };
    return TreeGridCollection;
}(ts_data_1.TreeCollection));
exports.TreeGridCollection = TreeGridCollection;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var html_1 = __webpack_require__(2);
var Filters_1 = __webpack_require__(36);
var en_1 = __webpack_require__(6);
var types_1 = __webpack_require__(19);
// sub fields
exports.types = {
    operations: [
        { id: "sum", label: "sum" },
        { id: "min", label: "min" },
        { id: "max", label: "max" },
        { id: "count", label: "count" }
    ],
    dates: [
        { id: "dateByDay", label: "day" },
        { id: "dateByWeek", label: "week" },
        { id: "dateByMonth", label: "month" },
        { id: "dateByQuarter", label: "quarter" },
        { id: "dateByYear", label: "year" }
    ]
};
var defaultFields = {
    free: {
        label: "availableFields"
    },
    columns: {
        label: "columns",
        helper: "moveFieldsHere"
    },
    rows: {
        label: "rows",
        helper: "moveFieldsHere"
    },
    values: {
        label: "values",
        helper: "moveFieldsHere"
    }
};
var Configurator = /** @class */ (function () {
    function Configurator(pivot, config) {
        var _this = this;
        this._handleMouseMove = function (e) {
            if (Math.abs(e.pageX - _this._pressedCoords.x + e.pageY - _this._pressedCoords.y) < 10) {
                return;
            }
            _this._isDragStart = true;
            var target = html_1.getBox(_this._pressedCoords.target);
            var x = e.clientX - (_this._pressedCoords.x - target.left);
            var y = e.clientY - (_this._pressedCoords.y - target.top);
            _this._pressedCoords.nextX = x;
            _this._pressedCoords.nextY = y;
            _this._pivot.paint();
        };
        this._handleMouseup = function (_e) {
            document.removeEventListener("mousemove", _this._handleMouseMove);
            document.removeEventListener("mouseup", _this._handleMouseup);
            document.body.classList.remove("dhx_noselect");
            var drag = _this._isDragStart;
            _this._updateFields();
            _this._isDragStart = false;
            _this._pressedItem = null;
            _this._dropArea = null;
            _this._changeItem = null;
            _this._pivot.paint();
            if (_this.config.layout.liveReload !== false && drag) {
                dom_1.awaitRedraw().then(function () {
                    _this.events.fire(types_1.PivotEvents.change);
                });
            }
        };
        this.config = config;
        this._pivot = pivot;
        this._htmlEvents = {
            fieldOver: function (name) {
                if (_this._isDragStart) {
                    _this._dropArea = name;
                }
            },
            itemOver: function (item) {
                if (_this._isDragStart) {
                    _this._dropArea = item.$field;
                    _this._changeItem = item;
                }
            },
            fieldOut: function () {
                if (_this._isDragStart) {
                    _this._dropArea = null;
                }
            },
            itemOut: function () {
                if (_this._isDragStart) {
                    _this._changeItem = null;
                }
            },
            change: function (item, type, e) {
                item[type.name] = e.target.value;
                _this.config.events.fire(types_1.PivotEvents.change);
            }
        };
        this.events = this.config.events;
        this._filters = new Filters_1.Filters(this.config.events);
        this.events.on(types_1.PivotEvents.fieldClick, function (_ev, id, type) {
            var item = _this._getFieldObj(id);
            switch (type) {
                case "selector":
                    if (_this.config.layout.fieldSelectorType === "loop") {
                        _this._toggleSelector(item);
                        _this.config.events.fire(types_1.PivotEvents.change);
                    }
                    break;
                case "filter":
                    if (_this.config.layout.showFilters !== false) {
                        _this._pressedItem = item;
                        _this._filters.getFilter(_this._pressedItem, _this._pressedCoords.target, _this._pivot.config.data, _this._pivot.getFilterValue(_this._pressedItem.id));
                    }
                    break;
                case "close":
                    _this._dropArea = "free";
                    _this._pressedItem = item;
                    _this._updateFields();
                    _this.config.events.fire(types_1.PivotEvents.change);
                    break;
                default:
                    break;
            }
        });
    }
    Configurator.prototype.getField = function (name) {
        var _this = this;
        var config = this._pivot.config;
        var field = defaultFields[name];
        var onHover = this._isDragStart && this._pressedItem.$field !== name && "dhx_on_hover";
        return dom_1.el(".dhx_config_field", {
            dhx_id: name,
            onmouseover: [this._htmlEvents.fieldOver, name],
            onmouseout: [this._htmlEvents.fieldOut, name],
            class: onHover
        }, [
            dom_1.el(".dhx_field_header", [
                dom_1.el(".field_name", en_1.default[field.label]),
                field.helper && dom_1.el(".field_helper", en_1.default[field.helper])
            ]),
            dom_1.el(".dhx_field_content", config.fields[name].map(function (f) {
                return _this._getItem(f);
            }))
        ]);
    };
    Configurator.prototype.setFields = function (fields) {
        this.config.fields = fields;
    };
    Configurator.prototype.getFields = function () {
        var _a = this.config.fields, rows = _a.rows, columns = _a.columns, values = _a.values;
        return {
            rows: rows,
            columns: columns,
            values: values
        };
    };
    Configurator.prototype.getShadow = function () {
        var item = this._pressedItem;
        if (!item || !this._isDragStart) {
            return dom_1.el("div");
        }
        var target = html_1.getBox(this._pressedCoords.target);
        var shiftX = this._pressedCoords.nextX || target.left;
        var shiftY = this._pressedCoords.nextY || target.top;
        var filters = this._pivot.getFiltersValues();
        return dom_1.el("div", {
            class: "dhx_shadow",
            style: {
                top: shiftY,
                left: shiftX,
                pointerEvents: "none"
            }
        }, [
            dom_1.el(".item_body", [
                this.config.layout.showFilters !== false && dom_1.el(".dhx_item_filter", {
                    class: "dxi dxi-filter-variant " + (filters[item.id] ? "dhx_item_filter--flat" : "")
                }),
                dom_1.el(".item_content", item.label || item.id)
            ]),
            this._getSelector(item)
        ]);
    };
    Configurator.prototype.setPressedItem = function (ev, id, node) {
        this._pressedItem = this._getFieldObj(id);
        this._pressedCoords = {
            x: ev.pageX,
            y: ev.pageY,
            target: node
        };
        document.body.classList.add("dhx_noselect");
        document.addEventListener("mousemove", this._handleMouseMove);
        document.addEventListener("mouseup", this._handleMouseup);
    };
    Configurator.prototype._getFieldObj = function (id) {
        var config = this._pivot.config;
        for (var key in config.fields) {
            for (var _i = 0, _a = config.fields[key]; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.$uid === id) {
                    return obj;
                }
            }
        }
    };
    Configurator.prototype._getItem = function (item) {
        var onHover = this._isDragStart && this._changeItem && this._changeItem.$uid === item.$uid && "dhx_on_hover";
        var filters = this._pivot.getFiltersValues();
        return dom_1.el(".dhx_config_item", {
            class: onHover,
            dhx_id: item.$uid,
            onmouseover: [this._htmlEvents.itemOver, item],
            onmouseout: [this._htmlEvents.itemOut]
        }, [
            dom_1.el(".item_body", { _ref: item.$uid }, [
                (this.config.layout.fieldsCloseBtn === true && item.$field !== "free") && dom_1.el(".dhx_close", { class: "dxi dxi-close" }),
                this.config.layout.showFilters !== false && dom_1.el(".dhx_item_filter", {
                    class: "dxi dxi-filter-variant " + (filters[item.id] ? "dhx_item_filter--flat" : "")
                }),
                dom_1.el(".item_content", item.label || item.id),
            ]),
            this._getSelector(item)
        ]);
    };
    Configurator.prototype._moveItem = function (areaId, targetItem, item) {
        var config = this._pivot.config;
        var ids = config.fields[areaId].map(function (field) { return field.$uid; });
        if (ids.indexOf(item) === -1) {
            config.fields[areaId].splice(ids.indexOf(targetItem), 0, this._pressedItem);
            return;
        }
        config.fields[areaId].splice(ids.indexOf(targetItem), 0, config.fields[areaId].splice(ids.indexOf(item), 1)[0]);
    };
    Configurator.prototype._deleteItem = function (id) {
        var config = this._pivot.config;
        var item = this._getFieldObj(id);
        config.fields[item.$field] =
            config.fields[item.$field]
                .filter(function (f) { return f.$uid !== item.$uid; });
    };
    Configurator.prototype._updateFields = function () {
        var config = this._pivot.config;
        if (this._pressedItem && this._dropArea) {
            if (this._pressedItem.$field === this._dropArea) {
                if (!this._changeItem) {
                    return;
                }
            }
            if (this._dropArea === "values") {
                if (this._pressedItem.$field === this._dropArea) {
                    return;
                }
                var copy = __assign({}, this._pressedItem);
                copy.$field = this._dropArea;
                copy.$temp = true;
                copy.$uid = core_1.uid();
                this._toggleSelector(copy);
                config.fields[this._dropArea].push(copy);
            }
            else {
                if (this._pressedItem.$temp) {
                    this._deleteItem(this._pressedItem.$uid);
                }
                else {
                    if (this._pressedItem.$field !== this._dropArea) {
                        this._deleteItem(this._pressedItem.$uid);
                    }
                    var fieldItems = config.fields[this._dropArea];
                    this._pressedItem.$field = this._dropArea;
                    if (this._changeItem) {
                        this._moveItem(this._dropArea, this._changeItem.$uid, this._pressedItem.$uid);
                    }
                    else {
                        fieldItems.push(this._pressedItem);
                    }
                }
            }
        }
    };
    Configurator.prototype._getSelectorType = function (item) {
        var id;
        var name;
        if (exports.types[item.id]) {
            id = item.id;
            name = "group";
        }
        if (item.type === "date") {
            id = "dates";
            name = "group";
        }
        if (item.$field === "values") {
            id = "operations";
            name = "method";
        }
        if (!id) {
            return;
        }
        return {
            id: id,
            name: name
        };
    };
    Configurator.prototype._getSelector = function (item) {
        var type = this.config.layout.fieldSelectorType;
        switch (type) {
            case "loop":
                return this._getLoopSelect(item);
            case "dropdown":
                return this._getDropdownSelect(item);
            default:
                break;
        }
    };
    Configurator.prototype._getLoopSelect = function (item) {
        var type = this._getSelectorType(item);
        if (!type) {
            return;
        }
        var val = item[type.name] ? exports.types[type.id].filter(function (t) { return t.id === item[type.name]; })[0] : exports.types[type.id][0];
        if (!val) {
            return null;
        }
        item[type.name] = val.id;
        var text = en_1.default[val.label] || val.label;
        return dom_1.el(".dhx_config_select", { dhx_date: item.id }, [
            dom_1.el("span", { class: "select_text" }, text),
            dom_1.el("i", { class: "dxi dxi-unfold-more-horizontal" }),
        ]);
    };
    Configurator.prototype._getDropdownSelect = function (item) {
        var type = this._getSelectorType(item);
        if (!type) {
            return;
        }
        var methods = exports.types[type.id];
        return dom_1.el(".dhx_item-modes", [
            dom_1.el("select.dhx_item-modes__select", {
                _key: item.$uid,
                onchange: [this._htmlEvents.change, item, type]
            }, methods.map(function (method) { return dom_1.el("option.dhx_select__option", { value: method.id, selected: item[type.name] === method.id }, method.label); })),
            dom_1.el(".dxi.dxi-chevron-down.dhx_select__icon")
        ]);
    };
    Configurator.prototype._toggleSelector = function (item) {
        var type = this._getSelectorType(item);
        if (!type) {
            return;
        }
        var config = exports.types[type.id];
        var next = config[0];
        for (var i = 0; i < config.length; i++) {
            if (config[i].id === item[type.name]) {
                if (!config[i + 1]) {
                    next = config[0];
                    break;
                }
                next = config[i + 1];
            }
        }
        item[type.name] = next.id;
    };
    return Configurator;
}());
exports.Configurator = Configurator;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DateFilter_1 = __webpack_require__(84);
var Filter_1 = __webpack_require__(37);
var helpers_1 = __webpack_require__(18);
function getFilterHandler(meta, field) {
    return function (item) {
        if (field.type === "date") {
            item = item.getTime();
        }
        return meta.values.indexOf(item) > -1;
    };
}
exports.getFilterHandler = getFilterHandler;
var Filters = /** @class */ (function () {
    function Filters(events) {
        this.events = events;
    }
    Filters.prototype.getFilter = function (item, coords, data, oldMeta) {
        var _this = this;
        var uniqueData = helpers_1.getUniqueFieldData(item, data);
        item.type = item.type || this._getFieldType(uniqueData) || "string";
        if (this._filter) {
            this._filter.hide();
        }
        this._filter = this._getFilter(item.type);
        this._filter.setMeta(item, oldMeta, uniqueData);
        this._filter.show(coords);
        this._filter.config.events.on("filterApply", function () {
            _this._filter = null;
        });
    };
    Filters.prototype._getFilter = function (type) {
        switch (type) {
            case "number":
            case "string":
                return new Filter_1.Filter({ events: this.events });
            case "date":
                return new DateFilter_1.DateFilter({ events: this.events });
            default:
                break;
        }
    };
    Filters.prototype._getFieldType = function (fieldData) {
        if (isNaN(fieldData[0])) {
            return typeof fieldData[0];
        }
        else {
            return "number";
        }
    };
    return Filters;
}());
exports.Filters = Filters;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var html_1 = __webpack_require__(2);
var view_1 = __webpack_require__(4);
var ts_popup_1 = __webpack_require__(16);
var en_1 = __webpack_require__(6);
exports.operations = {
    string: {
        ct: { name: function () { return en_1.default.contains; }, handler: function (item, str) { return new RegExp("^" + str, "i").test(item); } },
        nct: { name: function () { return en_1.default.notContains; }, handler: function (item, str) { return !new RegExp("^" + str, "i").test(item); } },
        eq: { name: function () { return en_1.default.equal; }, handler: function (item, str) { return item === str; } },
        neq: { name: function () { return en_1.default.notEqual; }, handler: function (item, str) { return item !== str; } },
    },
    number: {
        lt: { name: function () { return "<"; }, handler: function (item, inpVal) { return item < inpVal; } },
        gt: { name: function () { return ">"; }, handler: function (item, inpVal) { return item > inpVal; } },
        leq: { name: function () { return "<="; }, handler: function (item, inpVal) { return item <= inpVal; } },
        geq: { name: function () { return ">="; }, handler: function (item, inpVal) { return item >= inpVal; } },
        // tslint:disable-next-line:triple-equals
        eq: { name: function () { return "="; }, handler: function (item, inpVal) { return item == inpVal; } },
        // tslint:disable-next-line:triple-equals
        neq: { name: function () { return "<>"; }, handler: function (item, inpVal) { return item != inpVal; } },
    }
};
var Filter = /** @class */ (function (_super) {
    __extends(Filter, _super);
    function Filter(config) {
        var _this = _super.call(this, null, config) || this;
        _this._popup = new ts_popup_1.Popup();
        _this.config.width = 330;
        _this.config.height = 370;
        _this._htmlEvents = {
            onclick: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                dhx_filter_selectAll: function (_ev) {
                    if (_this._meta.values.length) {
                        _this._meta.values = [];
                    }
                    else {
                        _this._meta.values = _this._data.slice();
                    }
                    _this.paint();
                },
                dhx_button: function (_ev, item) {
                    if (item === "hide") {
                        _this.hide();
                    }
                    if (item === "apply") {
                        _this.config.events.fire("filterApply", [_this._item.id, _this.getMeta()]);
                        _this.hide();
                    }
                }
            }),
            oninput: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                dhx_field_input: function (ev) {
                    if (_this._inputTimeout) {
                        clearTimeout(_this._inputTimeout);
                        _this._inputTimeout = null;
                    }
                    _this._inputTimeout = setTimeout(function () {
                        var val = ev.target.value.trim();
                        if (_this._validateInput(val)) {
                            ev.target.classList.remove("dhx_alert");
                            _this._meta.filter = val;
                            var operation_1 = exports.operations[_this._item.type][_this._meta.operation].handler;
                            _this._meta.values = _this._data.filter(function (itm) { return operation_1(itm, _this._meta.filter); });
                            _this.paint();
                        }
                        else {
                            ev.target.classList.add("dhx_alert");
                        }
                    }, 200);
                },
                dhx_filter_select: function (ev) {
                    _this._meta.operation = ev.target.value;
                    var operation = exports.operations[_this._item.type][_this._meta.operation].handler;
                    _this._meta.values = _this._data.filter(function (itm) { return operation(itm, _this._meta.filter); });
                    _this.paint();
                }
            }),
            onchange: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                dhx_checkbox: function (ev) {
                    _this._checkHandler(ev.target);
                    _this.paint();
                }
            })
        };
        _this._popup.events.on(ts_popup_1.PopupEvents.beforeHide, function (isOutside) {
            if (isOutside) {
                _this.config.events.fire("filterApply", [_this._item.id, _this.getMeta()]);
            }
        });
        var view = dom_1.create({ render: function () { return _this._getContent(); } });
        _this.mount(_this._popup, view);
        return _this;
    }
    Filter.prototype.setMeta = function (item, meta, uniqueData) {
        this._item = item;
        this._data = uniqueData;
        this._setMeta(meta);
    };
    Filter.prototype.getMeta = function () {
        if (this._meta.values.length === this._data.length) {
            this._meta.values = [];
        }
        return this._meta;
    };
    Filter.prototype.show = function (node) {
        this._popup.show(node, { mode: html_1.Position.bottom, centering: true });
    };
    Filter.prototype.hide = function () {
        this._popup.hide();
    };
    Filter.prototype._setMeta = function (oldMeta) {
        this._meta = oldMeta || {};
        this._meta.operation = this._meta.operation || (this._item.type === "string" ? "ct" : "lt");
        this._meta.values = this._meta.values || this._data.slice();
    };
    Filter.prototype._checkHandler = function (checkbox) {
        var val = isNaN(checkbox.value) ? checkbox.value : parseFloat(checkbox.value);
        var index = this._meta.values.indexOf(val);
        if (index > -1 || !checkbox.checked) {
            this._meta.values.splice(index, 1);
        }
        else {
            this._meta.values.push(val);
        }
    };
    Filter.prototype._validateInput = function (val) {
        if (!val) {
            return true;
        }
        switch (this._item.type) {
            case "string":
                return true;
            case "number":
                return !isNaN(val);
            default:
                break;
        }
    };
    Filter.prototype._getContent = function () {
        return dom_1.el(".dhx_filter", {
            oninput: this._htmlEvents.oninput,
            onchange: this._htmlEvents.onchange,
            onclick: this._htmlEvents.onclick
        }, [
            this._getFilterInput(),
            dom_1.el(".dhx_filter_content", [
                dom_1.el(".dhx_filter_selectAll", this._meta.values.length ? en_1.default.unselectAll : en_1.default.selectAll),
                this._getCheckboxes()
            ]),
            dom_1.el(".dhx_filter-buttons", [
                dom_1.el("button", { class: "dhx_button dhx_button--view_link dhx_button--color_primary dhx_button--size_medium", dhx_id: "hide" }, en_1.default.cancel),
                dom_1.el("button", { class: "dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium", dhx_id: "apply" }, en_1.default.apply)
            ])
        ]);
    };
    Filter.prototype._getOperations = function (type) {
        if (type === void 0) { type = "string"; }
        var op = exports.operations[type];
        var options = [];
        for (var key in op) {
            options.push(dom_1.el("option", {
                value: key,
                selected: key === this._meta.operation
            }, op[key].name()));
        }
        return options;
    };
    Filter.prototype._getFilterInput = function () {
        return dom_1.el(".dhx_filter_field", [
            dom_1.el(".dhx_field_select", [
                dom_1.el("select", { class: "dhx_filter_select", _key: "sel" }, this._getOperations(this._item.type))
            ]),
            dom_1.el(".dhx_field_input", [
                dom_1.el("input.dhx_input", { class: "dhx_field_input", value: this._meta.filter || "", placeholder: en_1.default.typeHere, type: "text", _key: "inp" }, this._meta.filter || "")
            ])
        ]);
    };
    Filter.prototype._formatLabel = function (label) {
        return label;
    };
    Filter.prototype._getCheckboxData = function () {
        var _this = this;
        var data = this._data;
        if (this._meta.filter) {
            var operation_2 = exports.operations[this._item.type][this._meta.operation].handler;
            data = data.filter(function (item) { return operation_2(item, _this._meta.filter); });
        }
        return data;
    };
    Filter.prototype._getCheckboxes = function () {
        var _this = this;
        var data = this._getCheckboxData();
        var checkboxes = dom_1.el(".dhx_list", data.map(function (label, i) {
            var isChecked = _this._meta.values.indexOf(label) > -1;
            return dom_1.el(".dhx_list_item", { dhx_list_item: i }, [
                dom_1.el("label.dhx_checkbox", [
                    dom_1.el("input.dhx_checkbox__input", {
                        type: "checkbox",
                        value: label,
                        dhx_list_item: i,
                        _key: i,
                        checked: isChecked
                    }),
                    dom_1.el(".dhx_checkbox__visual-input"),
                    dom_1.el(".dhx_label", _this._formatLabel(label))
                ]),
            ]);
        }));
        return checkboxes;
    };
    return Filter;
}(view_1.View));
exports.Filter = Filter;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var groupfuncs_1 = __webpack_require__(39);
var core_1 = __webpack_require__(0);
var en_1 = __webpack_require__(6);
// [dirty]
var pivotConfig;
function getGridData(config, data) {
    pivotConfig = config;
    var columns = getColumns(data, config.fields.columns);
    var headers = getHeader(config, columns);
    var groupedData = getGroupedData(config, columns, data);
    return {
        headers: headers,
        groupedData: groupedData
    };
}
exports.getGridData = getGridData;
function setRowsLabels(rows, uniqueRows, level, rowName, parent) {
    var firstColumns = {};
    firstColumns.id = core_1.uid();
    if (pivotConfig.layout.gridMode === "tree") {
        if (level > 0 && parent && parent.id) {
            firstColumns.parent = parent.id;
        }
        var text = getValue(rowName, "label");
        if (rows[level].template) {
            text = rows[level].template(text, rows[level]);
        }
        firstColumns[0] = text;
    }
    else {
        rows.forEach(function (_row, i) {
            var text = (pivotConfig.layout.repeatRowsHeaders && parent.chain && parent.chain[i]) || "";
            if (i === level) {
                text = getValue(rowName, "label");
                if (rows[level].template) {
                    text = rows[level].template(text, rows[level]);
                }
            }
            firstColumns[i] = text;
        });
    }
    uniqueRows.push(firstColumns);
    return firstColumns.id;
}
function getRows(columns, uniqueRows, rows, level, parent) {
    if (level === void 0) { level = 0; }
    var rowName = rows[level].id;
    var dir = rows[level].sortDir || "asc";
    var unqRowNames = groupfuncs_1.getUnique(columns, rowName, dir);
    parent = parent || { id: null, chain: null };
    var result = [];
    var id;
    for (var i = 0; i < unqRowNames.length; i++) {
        var unqRowName = getValue(unqRowNames[i], "id");
        // build first columns
        id = setRowsLabels(rows, uniqueRows, level, unqRowNames[i], parent);
        var row = [];
        for (var k = 0; k < columns.length; k++) {
            var cell = [];
            for (var j = 0; j < columns[k].length; j++) {
                if (getValue(columns[k][j][rowName], "id") === unqRowName) {
                    cell.push(columns[k][j]);
                }
            }
            row.push(cell);
        }
        result.push(row);
        //  next level rows
        if (level < rows.length - 1) {
            if (pivotConfig.layout.gridMode === "tree") {
                result.push.apply(result, getRows(row, uniqueRows, rows, level + 1, { id: id, chain: [] }));
            }
            else {
                parent.id = id;
                parent.chain = parent.chain || [];
                parent.chain.push(unqRowName);
                result.push.apply(result, getRows(row, uniqueRows, rows, level + 1, parent));
                parent.chain.pop();
            }
        }
    }
    return result;
}
function getGroupedData(config, columns, _data) {
    var uniqueRows = [];
    var configRows = config.fields.rows;
    var rows = getRows(columns, uniqueRows, configRows, 0);
    var fields = config.fields.values;
    if (fields) {
        var _loop_1 = function (i) {
            var row = void 0;
            if (pivotConfig.layout.gridMode === "tree") {
                row = [uniqueRows[i][0]];
            }
            else {
                row = config.fields.rows.map(function (_row, ind) { return uniqueRows[i][ind]; });
            }
            for (var k = 0; k < rows[i].length; k++) {
                for (var j = 0; j < fields.length; j++) {
                    row.push(groupfuncs_1.methods(rows[i][k], fields[j].id, fields[j].method));
                }
            }
            uniqueRows[i] = __assign({}, row, uniqueRows[i]);
        };
        for (var i = 0; i < rows.length; i++) {
            _loop_1(i);
        }
        return uniqueRows;
    }
}
function getColumns(data, columns) {
    var groups = {};
    var _loop_2 = function (i) {
        data[i].$keyArr = columns.map(function (col) { return getValue(data[i][(col.id)], "id"); });
        var group = data[i].$keyArr.join(".");
        groups[group] = groups[group] || [];
        groups[group].push(data[i]);
    };
    for (var i = 0; i < data.length; i++) {
        _loop_2(i);
    }
    return Object.keys(groups).map(function (group) {
        return groups[group];
    }).sort(function (a, b) {
        for (var i = 0; i < a[0].$keyArr.length; i++) {
            var an = a[0].$keyArr[i];
            var bn = b[0].$keyArr[i];
            var nn = isNaN(an) ? an.localeCompare(bn) : an - bn;
            var dir = columns[i].sortDir || "asc";
            nn = dir === "asc" ? nn : -nn;
            if (nn) {
                return nn;
            }
        }
    });
}
function getHeaderLabels(columns, config) {
    return columns.map(function (col) {
        return config.map(function (f) {
            var field = f.id;
            return "" + getValue(col[0][field], "label");
        });
    });
}
function getHeader(config, columns) {
    var firstColsWidth;
    if (config.layout && config.layout.rowsHeadersWidth) {
        firstColsWidth = config.layout.rowsHeadersWidth === "auto" ? 0 : config.layout.rowsHeadersWidth;
    }
    var colMinWidth = 100;
    var _header = config.fields.columns;
    var colId = 0;
    var fields = config.fields.values;
    if (!fields) {
        return;
    }
    var result;
    var footer = config.layout.footer ? [{ text: en_1.default.total }] : null;
    if (pivotConfig.layout.gridMode === "tree") {
        var header = [];
        for (var i = 0; i < config.fields.columns.length + 1; i++) {
            header.push({ text: "" });
        }
        result = [{
                header: header,
                footer: footer,
                width: firstColsWidth,
                id: (colId++).toString()
            }];
    }
    else {
        result = [];
        config.fields.rows.forEach(function (row) {
            var header = [{
                    text: row.label || row.id,
                    rowspan: config.fields.columns.length + 1
                }];
            result.push({
                header: header,
                footer: footer,
                width: firstColsWidth,
                id: (colId++).toString()
            });
        });
    }
    var prevKeys = []; // prev keys for each level
    var colspans = []; // colspans for each level
    var spanCells = []; // first colspan cells
    columns = getHeaderLabels(columns, _header);
    for (var i = 0; i < columns.length; i++) {
        var _loop_3 = function (field) {
            var column = []; // IHeaderCell[]; // fixme: add column type
            // array with column rows
            for (var level = 0; level < columns[i].length; level++) {
                var key = columns[i][level].id || columns[i][level];
                prevKeys[level] = prevKeys[level] || [];
                // todo:
                colspans[level] = colspans[level] || 1; // fix for last element
                spanCells[level] = spanCells[level] || {};
                if (prevKeys[level] !== key) {
                    prevKeys[level] = key;
                    spanCells[level] = {
                        text: key,
                        colspan: colspans[level],
                    };
                    if (_header[level].template) {
                        spanCells[level].text = _header[level].template(key, _header[level]);
                    }
                    column.push(spanCells[level]);
                }
                else {
                    spanCells[level].colspan++;
                    column.push({ text: null });
                }
            }
            column.push({ text: (field.label || field.id) + " (" + en_1.default[field.method] + ")" }); // add field
            var col = {
                header: column,
                width: colMinWidth,
                id: (colId++).toString(),
                mark: config.mark,
                template: function (v, r, c) {
                    if (v === null) {
                        return "";
                    }
                    if (config.customFormat) {
                        v = config.customFormat(v, col.method);
                    }
                    if (field.cellTemplate) {
                        return field.cellTemplate(v, r, c);
                    }
                    return v;
                },
                method: field.method
            };
            if (config.layout) {
                if (config.layout.footer) {
                    col.footer = [{ content: field.method }];
                }
            }
            if (config.layout && config.layout.columnsWidth) {
                col.width = config.layout.columnsWidth === "auto" ? 0 : config.layout.columnsWidth;
            }
            result.push(col);
        };
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var field = fields_1[_i];
            _loop_3(field);
        }
    }
    return result;
}
function getValue(obj, key, fallback) {
    if (fallback === void 0) { fallback = ""; }
    return obj ? obj[key] || obj : fallback;
}
exports.getValue = getValue;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DataGroup_1 = __webpack_require__(38);
function sort(arr, dir) {
    if (dir === void 0) { dir = "asc"; }
    return arr.sort(function (a, b) {
        var nn = isNaN(a) ? a.localeCompare(b) : a - b;
        return dir === "asc" ? nn : -nn;
    });
}
function getUnique(data, field, dir) {
    var temp = {};
    for (var i = 0; i < data.length; i++) {
        if (data[i] instanceof Array && data[i].length) {
            for (var k = 0; k < data[i].length; k++) {
                temp[DataGroup_1.getValue(data[i][k][field], "id")] = data[i][k];
            }
        }
    }
    return sort(Object.keys(temp), dir).map(function (key) { return temp[key][field]; });
}
exports.getUnique = getUnique;
exports.mathMethods = {
    sum: function (data) {
        return data.reduce(function (prev, el) {
            return prev + el;
        });
    },
    min: function (data) {
        return data[0];
    },
    max: function (data) {
        return data[data.length - 1];
    },
    count: function (data) {
        return data.length;
    }
};
function methods(data, field, method) {
    if (typeof data === "string") {
        return data;
    }
    if (!data.length) {
        return null;
    }
    data = data.map(function (obj) {
        return parseFloat(obj[field]) || 0;
    }).sort(function (a, b) {
        return a > b ? 1 : -1;
    });
    return exports.mathMethods[method] ? defaultFormat(exports.mathMethods[method](data), method) : null;
}
exports.methods = methods;
var defaultFormat = function (val, method) {
    if (method === "count" || typeof val === "string") {
        return val;
    }
    else {
        return val.toFixed(3);
    }
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// default localization
var en_1 = __webpack_require__(6);
var w = window;
exports.i18n = (w.dhx && w.dhx.i18n) ? w.dhx.i18 : {};
exports.i18n.setLocale = function (component, value) {
    var target = exports.i18n[component];
    for (var key in value) {
        target[key] = value[key];
    }
};
exports.i18n.pivot = exports.i18n.pivot || en_1.default;
var CssManager_1 = __webpack_require__(41);
exports.css = CssManager_1.cssManager;
__webpack_require__(43);
var Pivot_1 = __webpack_require__(44);
exports.Pivot = Pivot_1.Pivot;
var ts_data_1 = __webpack_require__(7);
exports.data = { CsvDriver: ts_data_1.CsvDriver, JsonDriver: ts_data_1.JsonDriver, Proxy: ts_data_1.DataProxy };


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var CssManager = /** @class */ (function () {
    function CssManager() {
        this._classes = {};
        var styles = document.createElement("style");
        styles.id = "dhx_generated_styles";
        this._styleCont = document.head.appendChild(styles);
    }
    CssManager.prototype.update = function () {
        // move style element to the bottom of head
        document.head.appendChild(this._styleCont);
        this._styleCont.innerHTML = this._generateCss();
    };
    CssManager.prototype.remove = function (className) {
        delete this._classes[className];
        this.update();
    };
    CssManager.prototype.add = function (cssList, customId, silent) {
        if (silent === void 0) { silent = false; }
        var cssString = this._toCssString(cssList);
        var id = this._findSameClassId(cssString);
        if (id && customId && customId !== id) {
            this._classes[customId] = this._classes[id];
            return customId;
        }
        if (id) {
            return id;
        }
        return this._addNewClass(cssString, customId, silent);
    };
    CssManager.prototype.get = function (className) {
        if (this._classes[className]) {
            var props = {};
            var css = this._classes[className].split(";");
            for (var _i = 0, css_1 = css; _i < css_1.length; _i++) {
                var item = css_1[_i];
                if (item) {
                    var prop = item.split(":");
                    props[prop[0]] = prop[1];
                }
            }
            return props;
        }
        return null;
    };
    CssManager.prototype._findSameClassId = function (cssString) {
        for (var key in this._classes) {
            if (cssString === this._classes[key]) {
                return key;
            }
        }
        return null;
    };
    CssManager.prototype._addNewClass = function (cssString, customId, silent) {
        var id = customId || "dhx_generated_class_" + core_1.uid();
        this._classes[id] = cssString;
        if (!silent) {
            this.update();
        }
        return id;
    };
    CssManager.prototype._toCssString = function (cssList) {
        var cssString = "";
        for (var key in cssList) {
            var prop = cssList[key];
            var name_1 = key.replace(/[A-Z]{1}/g, function (letter) { return "-" + letter.toLowerCase(); });
            cssString += name_1 + ":" + prop + ";";
        }
        return cssString;
    };
    CssManager.prototype._generateCss = function () {
        var result = "";
        for (var key in this._classes) {
            var cssProps = this._classes[key];
            result += "." + key + "{" + cssProps + "}\n";
        }
        return result;
    };
    return CssManager;
}());
exports.CssManager = CssManager;
exports.cssManager = new CssManager();


/***/ }),
/* 42 */
/***/ (function(module, exports) {

if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector;
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var html_1 = __webpack_require__(2);
var view_1 = __webpack_require__(4);
var ts_data_1 = __webpack_require__(7);
var ts_treegrid_1 = __webpack_require__(58);
var ts_layout_1 = __webpack_require__(26);
var Configurator_1 = __webpack_require__(35);
var Fields_1 = __webpack_require__(86);
var DataPreprocessor_1 = __webpack_require__(87);
var DataGroup_1 = __webpack_require__(38);
var groupfuncs_1 = __webpack_require__(39);
var en_1 = __webpack_require__(6);
var types_1 = __webpack_require__(19);
var Exporter_1 = __webpack_require__(88);
var Pivot = /** @class */ (function (_super) {
    __extends(Pivot, _super);
    function Pivot(container, config) {
        var _this = _super.call(this, container, config) || this;
        _this._isSettingsHidden = false;
        _this.container = container === null ? container : html_1.toNode(container);
        _this._htmlEvents = {
            onmousedown: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                dhx_config_item: function (ev, item) {
                    var fieldNode = html_1.locateNode(ev.target);
                    _this._configurator.setPressedItem(ev, item, fieldNode);
                }
            }),
            onclick: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                pivot_settings_btn: function () {
                    _this._isSettingsHidden = !_this._isSettingsHidden;
                    _this._checkLayoutState();
                },
                dhx_config_select: function (ev, item) {
                    _this.events.fire(types_1.PivotEvents.fieldClick, [ev, item, "selector"]);
                },
                dhx_close: function (ev, item) {
                    _this.events.fire(types_1.PivotEvents.fieldClick, [ev, item, "close"]);
                },
                item_body: function (ev, item) {
                    _this.events.fire(types_1.PivotEvents.fieldClick, [ev, item, "filter"]);
                },
                dhx_button: function (_ev, item) {
                    if (item === "dhx_configApplyBtn") {
                        _this.events.fire(types_1.PivotEvents.applyButtonClick);
                    }
                }
            })
        };
        _this._dataPrep = new DataPreprocessor_1.DataPreprocessor();
        _this.config = _this._dataPrep.normalizeConfig(config);
        if (_this.config.layout.gridOnly) {
            _this._isSettingsHidden = true;
        }
        Configurator_1.types.operations = _this.config.types.operations || Configurator_1.types.operations;
        _this._init();
        if (_this.config.data) {
            _this.setData(_this.config.data);
        }
        _this._update();
        _this._setEventsHandlers();
        _this._initLayout();
        _this._checkLayoutState();
        _this.export = Exporter_1.getExporter(_this);
        return _this;
    }
    Pivot.prototype.destructor = function () {
        this.layout.destructor();
        this.grid.destructor();
        this.events.clear();
    };
    Pivot.prototype.setFields = function (fields) {
        this.config.fields = fields;
        this._dataPrep.normalizeFields(this.config);
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.getFields = function () {
        return this._dataPrep.getPureFields(this.config.fields);
    };
    Pivot.prototype.getConfig = function () {
        return this.config;
    };
    Pivot.prototype.load = function (url, type) {
        var _this = this;
        var proxy = ts_data_1.toProxy(url);
        return proxy.load().then(function (data) { return _this.setData(data, type); });
    };
    Pivot.prototype.setData = function (data, type) {
        var driver = ts_data_1.toDataDriver(type || "json");
        data = driver.toJsonArray(data);
        this.config.data = this._dataPrep.normalizeData(data, this.config.fieldList);
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.addMathMethod = function (id, label, func) {
        groupfuncs_1.mathMethods[id] = func;
        en_1.default[id] = label;
        Configurator_1.types.operations.push({ id: id, label: label });
        this.grid.content[id] = {
            toHtml: function (column, config) {
                return this.calculate(column, config);
            },
            calculate: function (column, config) {
                var columnData = config.data.map(function (item) { return item[column.id] || "0"; });
                return func(columnData);
            }
        };
    };
    Pivot.prototype.addSubField = function (name, functor, label) {
        var _this = this;
        en_1.default[label] = en_1.default[label] ? en_1.default[label] : label;
        this._dataPrep.addSubField(name, functor, label);
        this.paint();
        setTimeout(function () {
            _this.events.fire(types_1.PivotEvents.change);
        }, 100);
    };
    Pivot.prototype.setFilterValue = function (field, meta) {
        this._dataPrep.setFilterValue(field, meta);
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.setFiltersValues = function (filters) {
        this._dataPrep.setFiltersValues(filters);
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.getFilterValue = function (fieldId) {
        return this._dataPrep.getFilterValue(fieldId);
    };
    Pivot.prototype.getFiltersValues = function () {
        return this._dataPrep.getFiltersValues();
    };
    Pivot.prototype.clearFiltersValues = function () {
        this._dataPrep.clearFiltersValues();
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.setGlobalFilter = function (handler) {
        this._dataPrep.setGlobalFilter(handler);
        this.events.fire(types_1.PivotEvents.change);
    };
    Pivot.prototype.addFilter = function () {
        alert("method is deprecated, see docs https://docs.dhtmlx.com/pivot/api__refs__pivot.html");
    };
    Pivot.prototype.removeFilter = function () {
        alert("method is deprecated, see docs https://docs.dhtmlx.com/pivot/api__refs__pivot.html");
    };
    Pivot.prototype.getFilter = function () {
        alert("method is deprecated, see docs https://docs.dhtmlx.com/pivot/api__refs__pivot.html");
    };
    Pivot.prototype.paint = function () {
        _super.prototype.paint.call(this);
        if (this.layout) {
            this.layout.paint();
        }
    };
    Pivot.prototype._setEventsHandlers = function () {
        var _this = this;
        this.events.on(types_1.PivotEvents.change, function () {
            if (_this.config.layout.liveReload !== false) {
                _this._update();
            }
            _this.paint();
        });
        this.events.on(types_1.PivotEvents.update, function () {
            _this.paint();
        });
        this.events.on(types_1.PivotEvents.applyButtonClick, function () {
            _this._update();
            _this.paint();
        });
        this.events.on(types_1.PivotEvents.filterApply, function (field, meta) {
            _this.setFilterValue(field, meta);
        });
    };
    Pivot.prototype._update = function () {
        var fields = this.config.fields;
        if (fields.rows.length) {
            var gridInfo = DataGroup_1.getGridData(__assign({}, this.config, { fields: fields }), this._dataPrep.getData(this.config.data || [], fields));
            this.grid.setColumns(gridInfo.headers);
            this.grid.data.parse(gridInfo.groupedData);
        }
    };
    Pivot.prototype._init = function () {
        this.events = new events_1.EventSystem(this);
        var columnsAutoWidth = this.config.layout.rowsHeadersWidth === "auto" ?
            this.config.layout.gridMode === "flat" ? this.config.fields.rows.length + 1 : 1
            : false;
        if (this.config.layout.columnsWidth === "auto") {
            columnsAutoWidth = true;
        }
        this.grid = new ts_treegrid_1.TreeGrid(null, {
            columnsAutoWidth: columnsAutoWidth,
            data: [],
            columns: [],
            type: "tree",
            width: 400,
            height: 400
        });
        this._configurator = new Configurator_1.Configurator(this, __assign({}, this.config, { events: this.events }));
    };
    Pivot.prototype._initLayout = function () {
        var _this = this;
        var columnsStyle = window.dhx.css.add({ paddingLeft: (this.config.layout.leftMargin || 168) + 12 + "px" });
        var rowsStyle = window.dhx.css.add({ minWidth: (this.config.layout.leftMargin || 168) + "px" });
        var pivotHeader = [
            { id: "freeFields", css: "dhx_free-fields-wrap dhx_config_free-items" },
            { id: "hideSettings", css: "dhx_settings-button-wrap" },
        ];
        if (!this.config.layout.liveReload) {
            pivotHeader.splice(1, 0, { id: "manualApply", css: "dhx_apply-button-wrap" });
        }
        var layout = this.layout = new ts_layout_1.Layout(this.container, {
            views: [
                {
                    css: "dhx_pivot dhx_config",
                    id: "full", rows: [
                        {
                            id: "pivotHeader", css: "dhx_pivot-header", cols: pivotHeader
                        },
                        {
                            id: "mainArea", css: "dhx_pivot-main-area", rows: [
                                { id: "valuesFields", css: "dhx_values-fields-wrap" },
                                { id: "columnsFields", css: "dhx_columns-fields-wrap " + columnsStyle },
                                {
                                    id: "gridWrapper", css: "dhx_pivot-grid-wrap", cols: [
                                        { id: "rowsFields", css: "dhx_rows-fields-wrap " + rowsStyle },
                                        { id: "grid", css: "dhx_pivot-grid" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    css: "dhx_pivot dhx_pivot--readonly",
                    id: "gridOnly", rows: [
                        {
                            id: "gridWrapper", css: "dhx_pivot-grid-wrap", rows: [
                                { id: "showSettings", css: "dhx_settings-button-wrap dhx_settings-button-wrap--readonly" },
                                { id: "gridOnlyWrap", css: "dhx_pivot-grid" }
                            ]
                        }
                    ]
                }
            ]
        });
        var free = new Fields_1.Fields(null, {
            configurator: this._configurator,
            item: "free",
            events: this._htmlEvents
        });
        var values = new Fields_1.Fields(null, {
            configurator: this._configurator,
            item: "values",
            events: this._htmlEvents
        });
        var cols = new Fields_1.Fields(null, {
            configurator: this._configurator,
            item: "columns",
            events: this._htmlEvents
        });
        var rows = new Fields_1.Fields(null, {
            configurator: this._configurator,
            item: "rows",
            events: this._htmlEvents
        });
        layout.cell("grid").attach(this.grid, this);
        layout.cell("freeFields").attach(free, this);
        layout.cell("valuesFields").attach(values, this);
        layout.cell("columnsFields").attach(cols, this);
        layout.cell("rowsFields").attach(rows, this);
        layout.cell("gridOnlyWrap").attach(this.grid, this);
        var getSettingsButton = function (type) { return ({
            getRootView: function () { return dom_1.el("button", __assign({ class: "pivot_settings_btn dhx_button dhx_button--view_link dhx_button--color_primary dhx_button--size_medium" }, _this._htmlEvents), en_1.default[(type === "hide" ? "hideSettings" : "showSettings")]); }
        }); };
        var getManualApplyButton = function (type) { return ({
            getRootView: function () { return dom_1.el("button", __assign({ class: "dhx_pivot-apply-button dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium", dhx_id: "dhx_configApplyBtn" }, _this._htmlEvents), [
                dom_1.el("i.dxi.dxi-check"),
                dom_1.el("span", en_1.default.apply)
            ]); }
        }); };
        layout.cell("showSettings").attach(getSettingsButton("show"), this);
        layout.cell("hideSettings").attach(getSettingsButton("hide"), this);
        if (this.config.layout.liveReload === false) {
            layout.cell("manualApply").attach(getManualApplyButton(this.config.layout.liveReload), this);
        }
        this.mount(null, layout.getRootView());
        dom_1.awaitRedraw().then(function () {
            _this._createShadow();
        });
    };
    Pivot.prototype._checkLayoutState = function () {
        var _this = this;
        if (this.config.layout.readonly) {
            this.layout.cell("gridOnly").show();
            this.layout.cell("showSettings").hide();
            return;
        }
        if (this._isSettingsHidden) {
            this.layout.cell("gridOnly").show();
        }
        else {
            this.layout.cell("full").show();
        }
        dom_1.awaitRedraw().then(function () {
            var scroll = _this.grid.getScrollState();
            _this.grid.scroll(scroll.x, scroll.y);
            _this.grid.paint();
        });
    };
    Pivot.prototype._createShadow = function () {
        var _this = this;
        var shadow = dom_1.create({ render: function () { return _this._configurator.getShadow(); } }, this._configurator);
        this.mount(document.body, shadow);
    };
    return Pivot;
}(view_1.View));
exports.Pivot = Pivot;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(46);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13), __webpack_require__(47)))

/***/ }),
/* 47 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/**
* Copyright (c) 2017, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* domvm.js (DOM ViewModel)
* A thin, fast, dependency-free vdom view layer
* @preserve https://github.com/leeoniya/domvm (v3.2.6, micro build)
*/

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

// NOTE: if adding a new *VNode* type, make it < COMMENT and renumber rest.
// There are some places that test <= COMMENT to assert if node is a VNode

// VNode types
var ELEMENT	= 1;
var TEXT		= 2;
var COMMENT	= 3;

// placeholder types
var VVIEW		= 4;
var VMODEL		= 5;

var ENV_DOM = typeof window !== "undefined";
var win = ENV_DOM ? window : {};
var rAF = win.requestAnimationFrame;

var emptyObj = {};

function noop() {}

var isArr = Array.isArray;

function isSet(val) {
	return val != null;
}

function isPlainObj(val) {
	return val != null && val.constructor === Object;		//  && typeof val === "object"
}

function insertArr(targ, arr, pos, rem) {
	targ.splice.apply(targ, [pos, rem].concat(arr));
}

function isVal(val) {
	var t = typeof val;
	return t === "string" || t === "number";
}

function isFunc(val) {
	return typeof val === "function";
}

function isProm(val) {
	return typeof val === "object" && isFunc(val.then);
}



function assignObj(targ) {
	var args = arguments;

	for (var i = 1; i < args.length; i++)
		{ for (var k in args[i])
			{ targ[k] = args[i][k]; } }

	return targ;
}

// export const defProp = Object.defineProperty;

function deepSet(targ, path, val) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			{ targ[seg] = val; }
		else
			{ targ[seg] = targ = targ[seg] || {}; }
	}
}

/*
export function deepUnset(targ, path) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			targ[seg] = val;
		else
			targ[seg] = targ = targ[seg] || {};
	}
}
*/

function sliceArgs(args, offs) {
	var arr = [];
	for (var i = offs; i < args.length; i++)
		{ arr.push(args[i]); }
	return arr;
}

function cmpObj(a, b) {
	for (var i in a)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

function cmpArr(a, b) {
	var alen = a.length;

	if (b.length !== alen)
		{ return false; }

	for (var i = 0; i < alen; i++)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

// https://github.com/darsain/raft
// rAF throttler, aggregates multiple repeated redraw calls within single animframe
function raft(fn) {
	if (!rAF)
		{ return fn; }

	var id, ctx, args;

	function call() {
		id = 0;
		fn.apply(ctx, args);
	}

	return function() {
		ctx = this;
		args = arguments;
		if (!id) { id = rAF(call); }
	};
}

function curry(fn, args, ctx) {
	return function() {
		return fn.apply(ctx, args);
	};
}

/*
export function prop(val, cb, ctx, args) {
	return function(newVal, execCb) {
		if (newVal !== undefined && newVal !== val) {
			val = newVal;
			execCb !== false && isFunc(cb) && cb.apply(ctx, args);
		}

		return val;
	};
}
*/

/*
// adapted from https://github.com/Olical/binary-search
export function binaryKeySearch(list, item) {
    var min = 0;
    var max = list.length - 1;
    var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

    return -1;
}
*/

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// impl borrowed from https://github.com/ivijs/ivi
function longestIncreasingSubsequence(a) {
	var p = a.slice();
	var result = [];
	result.push(0);
	var u;
	var v;

	for (var i = 0, il = a.length; i < il; ++i) {
		var j = result[result.length - 1];
		if (a[j] < a[i]) {
			p[i] = j;
			result.push(i);
			continue;
		}

		u = 0;
		v = result.length - 1;

		while (u < v) {
			var c = ((u + v) / 2) | 0;
			if (a[result[c]] < a[i]) {
				u = c + 1;
			} else {
				v = c;
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1];
			}
			result[u] = i;
		}
	}

	u = result.length;
	v = result[u - 1];

	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}

	return result;
}

// based on https://github.com/Olical/binary-search
function binaryFindLarger(item, list) {
	var min = 0;
	var max = list.length - 1;
	var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

	return (min == list.length) ? null : min;

//	return -1;
}

function isEvProp(name) {
	return name[0] === "o" && name[1] === "n";
}

function isSplProp(name) {
	return name[0] === "_";
}

function isStyleProp(name) {
	return name === "style";
}

function repaint(node) {
	node && node.el && node.el.offsetHeight;
}

function isHydrated(vm) {
	return vm.node != null && vm.node.el != null;
}

// tests interactive props where real val should be compared
function isDynProp(tag, attr) {
//	switch (tag) {
//		case "input":
//		case "textarea":
//		case "select":
//		case "option":
			switch (attr) {
				case "value":
				case "checked":
				case "selected":
//				case "selectedIndex":
					return true;
			}
//	}

	return false;
}

function getVm(n) {
	n = n || emptyObj;
	while (n.vm == null && n.parent)
		{ n = n.parent; }
	return n.vm;
}

function VNode() {}

var VNodeProto = VNode.prototype = {
	constructor: VNode,

	type:	null,

	vm:		null,

	// all this stuff can just live in attrs (as defined) just have getters here for it
	key:	null,
	ref:	null,
	data:	null,
	hooks:	null,
	ns:		null,

	el:		null,

	tag:	null,
	attrs:	null,
	body:	null,

	flags:	0,

	_class:	null,
	_diff:	null,

	// pending removal on promise resolution
	_dead:	false,
	// part of longest increasing subsequence?
	_lis:	false,

	idx:	null,
	parent:	null,

	/*
	// break out into optional fluent module
	key:	function(val) { this.key	= val; return this; },
	ref:	function(val) { this.ref	= val; return this; },		// deep refs
	data:	function(val) { this.data	= val; return this; },
	hooks:	function(val) { this.hooks	= val; return this; },		// h("div").hooks()
	html:	function(val) { this.html	= true; return this.body(val); },

	body:	function(val) { this.body	= val; return this; },
	*/
};

function defineText(body) {
	var node = new VNode;
	node.type = TEXT;
	node.body = body;
	return node;
}

// creates a one-shot self-ending stream that redraws target vm
// TODO: if it's already registered by any parent vm, then ignore to avoid simultaneous parent & child refresh

var tagCache = {};

var RE_ATTRS = /\[(\w+)(?:=(\w+))?\]/g;

function cssTag(raw) {
	{
		var cached = tagCache[raw];

		if (cached == null) {
			var tag, id, cls, attr;

			tagCache[raw] = cached = {
				tag:	(tag	= raw.match( /^[-\w]+/))		?	tag[0]						: "div",
				id:		(id		= raw.match( /#([-\w]+)/))		? 	id[1]						: null,
				class:	(cls	= raw.match(/\.([-\w.]+)/))		?	cls[1].replace(/\./g, " ")	: null,
				attrs:	null,
			};

			while (attr = RE_ATTRS.exec(raw)) {
				if (cached.attrs == null)
					{ cached.attrs = {}; }
				cached.attrs[attr[1]] = attr[2] || "";
			}
		}

		return cached;
	}
}

// (de)optimization flags

// forces slow bottom-up removeChild to fire deep willRemove/willUnmount hooks,
var DEEP_REMOVE = 1;
// prevents inserting/removing/reordering of children
var FIXED_BODY = 2;
// enables fast keyed lookup of children via binary search, expects homogeneous keyed body
var KEYED_LIST = 4;
// indicates an vnode match/diff/recycler function for body
var LAZY_LIST = 8;

function initElementNode(tag, attrs, body, flags) {
	var node = new VNode;

	node.type = ELEMENT;

	if (isSet(flags))
		{ node.flags = flags; }

	node.attrs = attrs;

	var parsed = cssTag(tag);

	node.tag = parsed.tag;

	// meh, weak assertion, will fail for id=0, etc.
	if (parsed.id || parsed.class || parsed.attrs) {
		var p = node.attrs || {};

		if (parsed.id && !isSet(p.id))
			{ p.id = parsed.id; }

		if (parsed.class) {
			node._class = parsed.class;		// static class
			p.class = parsed.class + (isSet(p.class) ? (" " + p.class) : "");
		}
		if (parsed.attrs) {
			for (var key in parsed.attrs)
				{ if (!isSet(p[key]))
					{ p[key] = parsed.attrs[key]; } }
		}

//		if (node.attrs !== p)
			node.attrs = p;
	}

	var mergedAttrs = node.attrs;

	if (isSet(mergedAttrs)) {
		if (isSet(mergedAttrs._key))
			{ node.key = mergedAttrs._key; }

		if (isSet(mergedAttrs._ref))
			{ node.ref = mergedAttrs._ref; }

		if (isSet(mergedAttrs._hooks))
			{ node.hooks = mergedAttrs._hooks; }

		if (isSet(mergedAttrs._data))
			{ node.data = mergedAttrs._data; }

		if (isSet(mergedAttrs._flags))
			{ node.flags = mergedAttrs._flags; }

		if (!isSet(node.key)) {
			if (isSet(node.ref))
				{ node.key = node.ref; }
			else if (isSet(mergedAttrs.id))
				{ node.key = mergedAttrs.id; }
			else if (isSet(mergedAttrs.name))
				{ node.key = mergedAttrs.name + (mergedAttrs.type === "radio" || mergedAttrs.type === "checkbox" ? mergedAttrs.value : ""); }
		}
	}

	if (body != null)
		{ node.body = body; }

	return node;
}

function setRef(vm, name, node) {
	var path = ["refs"].concat(name.split("."));
	deepSet(vm, path, node);
}

function setDeepRemove(node) {
	while (node = node.parent)
		{ node.flags |= DEEP_REMOVE; }
}

// vnew, vold
function preProc(vnew, parent, idx, ownVm) {
	if (vnew.type === VMODEL || vnew.type === VVIEW)
		{ return; }

	vnew.parent = parent;
	vnew.idx = idx;
	vnew.vm = ownVm;

	if (vnew.ref != null)
		{ setRef(getVm(vnew), vnew.ref, vnew); }

	var nh = vnew.hooks,
		vh = ownVm && ownVm.hooks;

	if (nh && (nh.willRemove || nh.didRemove) ||
		vh && (vh.willUnmount || vh.didUnmount))
		{ setDeepRemove(vnew); }

	if (isArr(vnew.body))
		{ preProcBody(vnew); }
	else {}
}

function preProcBody(vnew) {
	var body = vnew.body;

	for (var i = 0; i < body.length; i++) {
		var node2 = body[i];

		// remove false/null/undefined
		if (node2 === false || node2 == null)
			{ body.splice(i--, 1); }
		// flatten arrays
		else if (isArr(node2)) {
			insertArr(body, node2, i--, 1);
		}
		else {
			if (node2.type == null)
				{ body[i] = node2 = defineText(""+node2); }

			if (node2.type === TEXT) {
				// remove empty text nodes
				if (node2.body == null || node2.body === "")
					{ body.splice(i--, 1); }
				// merge with previous text node
				else if (i > 0 && body[i-1].type === TEXT) {
					body[i-1].body += node2.body;
					body.splice(i--, 1);
				}
				else
					{ preProc(node2, vnew, i, null); }
			}
			else
				{ preProc(node2, vnew, i, null); }
		}
	}
}

var unitlessProps = {
	animationIterationCount: true,
	boxFlex: true,
	boxFlexGroup: true,
	boxOrdinalGroup: true,
	columnCount: true,
	flex: true,
	flexGrow: true,
	flexPositive: true,
	flexShrink: true,
	flexNegative: true,
	flexOrder: true,
	gridRow: true,
	gridColumn: true,
	order: true,
	lineClamp: true,

	borderImageOutset: true,
	borderImageSlice: true,
	borderImageWidth: true,
	fontWeight: true,
	lineHeight: true,
	opacity: true,
	orphans: true,
	tabSize: true,
	widows: true,
	zIndex: true,
	zoom: true,

	fillOpacity: true,
	floodOpacity: true,
	stopOpacity: true,
	strokeDasharray: true,
	strokeDashoffset: true,
	strokeMiterlimit: true,
	strokeOpacity: true,
	strokeWidth: true
};

function autoPx(name, val) {
	{
		// typeof val === 'number' is faster but fails for numeric strings
		return !isNaN(val) && !unitlessProps[name] ? (val + "px") : val;
	}
}

// assumes if styles exist both are objects or both are strings
function patchStyle(n, o) {
	var ns =     (n.attrs || emptyObj).style;
	var os = o ? (o.attrs || emptyObj).style : null;

	// replace or remove in full
	if (ns == null || isVal(ns))
		{ n.el.style.cssText = ns; }
	else {
		for (var nn in ns) {
			var nv = ns[nn];

			if (os == null || nv != null && nv !== os[nn])
				{ n.el.style[nn] = autoPx(nn, nv); }
		}

		// clean old
		if (os) {
			for (var on in os) {
				if (ns[on] == null)
					{ n.el.style[on] = ""; }
			}
		}
	}
}

var didQueue = [];

function fireHook(hooks, name, o, n, immediate) {
	if (hooks != null) {
		var fn = o.hooks[name];

		if (fn) {
			if (name[0] === "d" && name[1] === "i" && name[2] === "d") {	// did*
				//	console.log(name + " should queue till repaint", o, n);
				immediate ? repaint(o.parent) && fn(o, n) : didQueue.push([fn, o, n]);
			}
			else {		// will*
				//	console.log(name + " may delay by promise", o, n);
				return fn(o, n);		// or pass  done() resolver
			}
		}
	}
}

function drainDidHooks(vm) {
	if (didQueue.length) {
		repaint(vm.node);

		var item;
		while (item = didQueue.shift())
			{ item[0](item[1], item[2]); }
	}
}

var doc = ENV_DOM ? document : null;

function closestVNode(el) {
	while (el._node == null)
		{ el = el.parentNode; }
	return el._node;
}

function createElement(tag, ns) {
	if (ns != null)
		{ return doc.createElementNS(ns, tag); }
	return doc.createElement(tag);
}

function createTextNode(body) {
	return doc.createTextNode(body);
}

function createComment(body) {
	return doc.createComment(body);
}

// ? removes if !recycled
function nextSib(sib) {
	return sib.nextSibling;
}

// ? removes if !recycled
function prevSib(sib) {
	return sib.previousSibling;
}

// TODO: this should collect all deep proms from all hooks and return Promise.all()
function deepNotifyRemove(node) {
	var vm = node.vm;

	var wuRes = vm != null && fireHook(vm.hooks, "willUnmount", vm, vm.data);

	var wrRes = fireHook(node.hooks, "willRemove", node);

	if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE && isArr(node.body)) {
		for (var i = 0; i < node.body.length; i++)
			{ deepNotifyRemove(node.body[i]); }
	}

	return wuRes || wrRes;
}

function _removeChild(parEl, el, immediate) {
	var node = el._node, vm = node.vm;

	if (isArr(node.body)) {
		if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE) {
			for (var i = 0; i < node.body.length; i++)
				{ _removeChild(el, node.body[i].el); }
		}
		else
			{ deepUnref(node); }
	}

	delete el._node;

	parEl.removeChild(el);

	fireHook(node.hooks, "didRemove", node, null, immediate);

	if (vm != null) {
		fireHook(vm.hooks, "didUnmount", vm, vm.data, immediate);
		vm.node = null;
	}
}

// todo: should delay parent unmount() by returning res prom?
function removeChild(parEl, el) {
	var node = el._node;

	// already marked for removal
	if (node._dead) { return; }

	var res = deepNotifyRemove(node);

	if (res != null && isProm(res)) {
		node._dead = true;
		res.then(curry(_removeChild, [parEl, el, true]));
	}
	else
		{ _removeChild(parEl, el); }
}

function deepUnref(node) {
	var obody = node.body;

	for (var i = 0; i < obody.length; i++) {
		var o2 = obody[i];
		delete o2.el._node;

		if (o2.vm != null)
			{ o2.vm.node = null; }

		if (isArr(o2.body))
			{ deepUnref(o2); }
	}
}

function clearChildren(parent) {
	var parEl = parent.el;

	if ((parent.flags & DEEP_REMOVE) === 0) {
		isArr(parent.body) && deepUnref(parent);
		parEl.textContent = null;
	}
	else {
		var el = parEl.firstChild;

		do {
			var next = nextSib(el);
			removeChild(parEl, el);
		} while (el = next);
	}
}

// todo: hooks
function insertBefore(parEl, el, refEl) {
	var node = el._node, inDom = el.parentNode != null;

	// el === refEl is asserted as a no-op insert called to fire hooks
	var vm = (el === refEl || !inDom) ? node.vm : null;

	if (vm != null)
		{ fireHook(vm.hooks, "willMount", vm, vm.data); }

	fireHook(node.hooks, inDom ? "willReinsert" : "willInsert", node);
	parEl.insertBefore(el, refEl);
	fireHook(node.hooks, inDom ? "didReinsert" : "didInsert", node);

	if (vm != null)
		{ fireHook(vm.hooks, "didMount", vm, vm.data); }
}

function insertAfter(parEl, el, refEl) {
	insertBefore(parEl, el, refEl ? nextSib(refEl) : null);
}

var onemit = {};

function emitCfg(cfg) {
	assignObj(onemit, cfg);
}

function emit(evName) {
	var targ = this,
		src = targ;

	var args = sliceArgs(arguments, 1).concat(src, src.data);

	do {
		var evs = targ.onemit;
		var fn = evs ? evs[evName] : null;

		if (fn) {
			fn.apply(targ, args);
			break;
		}
	} while (targ = targ.parent());

	if (onemit[evName])
		{ onemit[evName].apply(targ, args); }
}

var onevent = noop;

function config(newCfg) {
	onevent = newCfg.onevent || onevent;

	{
		if (newCfg.onemit)
			{ emitCfg(newCfg.onemit); }
	}

	
}

function bindEv(el, type, fn) {
	el[type] = fn;
}

function exec(fn, args, e, node, vm) {
	var out = fn.apply(vm, args.concat([e, node, vm, vm.data]));

	// should these respect out === false?
	vm.onevent(e, node, vm, vm.data, args);
	onevent.call(null, e, node, vm, vm.data, args);

	if (out === false) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function handle(e) {
	var node = closestVNode(e.target);
	var vm = getVm(node);

	var evDef = e.currentTarget._node.attrs["on" + e.type], fn, args;

	if (isArr(evDef)) {
		fn = evDef[0];
		args = evDef.slice(1);
		exec(fn, args, e, node, vm);
	}
	else {
		for (var sel in evDef) {
			if (e.target.matches(sel)) {
				var evDef2 = evDef[sel];

				if (isArr(evDef2)) {
					fn = evDef2[0];
					args = evDef2.slice(1);
				}
				else {
					fn = evDef2;
					args = [];
				}

				exec(fn, args, e, node, vm);
			}
		}
	}
}

function patchEvent(node, name, nval, oval) {
	if (nval === oval)
		{ return; }

	var el = node.el;

	if (nval == null || isFunc(nval))
		{ bindEv(el, name, nval); }
	else if (oval == null)
		{ bindEv(el, name, handle); }
}

function remAttr(node, name, asProp) {
	if (name[0] === ".") {
		name = name.substr(1);
		asProp = true;
	}

	if (asProp)
		{ node.el[name] = ""; }
	else
		{ node.el.removeAttribute(name); }
}

// setAttr
// diff, ".", "on*", bool vals, skip _*, value/checked/selected selectedIndex
function setAttr(node, name, val, asProp, initial) {
	var el = node.el;

	if (val == null)
		{ !initial && remAttr(node, name, false); }		// will also removeAttr of style: null
	else if (node.ns != null)
		{ el.setAttribute(name, val); }
	else if (name === "class")
		{ el.className = val; }
	else if (name === "id" || typeof val === "boolean" || asProp)
		{ el[name] = val; }
	else if (name[0] === ".")
		{ el[name.substr(1)] = val; }
	else
		{ el.setAttribute(name, val); }
}

function patchAttrs(vnode, donor, initial) {
	var nattrs = vnode.attrs || emptyObj;
	var oattrs = donor.attrs || emptyObj;

	if (nattrs === oattrs) {
		
	}
	else {
		for (var key in nattrs) {
			var nval = nattrs[key];
			var isDyn = isDynProp(vnode.tag, key);
			var oval = isDyn ? vnode.el[key] : oattrs[key];

			if (nval === oval) {}
			else if (isStyleProp(key))
				{ patchStyle(vnode, donor); }
			else if (isSplProp(key)) {}
			else if (isEvProp(key))
				{ patchEvent(vnode, key, nval, oval); }
			else
				{ setAttr(vnode, key, nval, isDyn, initial); }
		}

		// TODO: bench style.cssText = "" vs removeAttribute("style")
		for (var key in oattrs) {
			!(key in nattrs) &&
			!isSplProp(key) &&
			remAttr(vnode, key, isDynProp(vnode.tag, key) || isEvProp(key));
		}
	}
}

function createView(view, data, key, opts) {
	if (view.type === VVIEW) {
		data	= view.data;
		key		= view.key;
		opts	= view.opts;
		view	= view.view;
	}

	return new ViewModel(view, data, key, opts);
}

//import { XML_NS, XLINK_NS } from './defineSvgElement';
function hydrateBody(vnode) {
	for (var i = 0; i < vnode.body.length; i++) {
		var vnode2 = vnode.body[i];
		var type2 = vnode2.type;

		// ELEMENT,TEXT,COMMENT
		if (type2 <= COMMENT)
			{ insertBefore(vnode.el, hydrate(vnode2)); }		// vnode.el.appendChild(hydrate(vnode2))
		else if (type2 === VVIEW) {
			var vm = createView(vnode2.view, vnode2.data, vnode2.key, vnode2.opts)._redraw(vnode, i, false);		// todo: handle new data updates
			type2 = vm.node.type;
			insertBefore(vnode.el, hydrate(vm.node));
		}
		else if (type2 === VMODEL) {
			var vm = vnode2.vm;
			vm._redraw(vnode, i);					// , false
			type2 = vm.node.type;
			insertBefore(vnode.el, vm.node.el);		// , hydrate(vm.node)
		}
	}
}

//  TODO: DRY this out. reusing normal patch here negatively affects V8's JIT
function hydrate(vnode, withEl) {
	if (vnode.el == null) {
		if (vnode.type === ELEMENT) {
			vnode.el = withEl || createElement(vnode.tag, vnode.ns);

		//	if (vnode.tag === "svg")
		//		vnode.el.setAttributeNS(XML_NS, 'xmlns:xlink', XLINK_NS);

			if (vnode.attrs != null)
				{ patchAttrs(vnode, emptyObj, true); }

			if ((vnode.flags & LAZY_LIST) === LAZY_LIST)	// vnode.body instanceof LazyList
				{ vnode.body.body(vnode); }

			if (isArr(vnode.body))
				{ hydrateBody(vnode); }
			else if (vnode.body != null && vnode.body !== "")
				{ vnode.el.textContent = vnode.body; }
		}
		else if (vnode.type === TEXT)
			{ vnode.el = withEl || createTextNode(vnode.body); }
		else if (vnode.type === COMMENT)
			{ vnode.el = withEl || createComment(vnode.body); }
	}

	vnode.el._node = vnode;

	return vnode.el;
}

// prevent GCC from inlining some large funcs (which negatively affects Chrome's JIT)
//window.syncChildren = syncChildren;
window.lisMove = lisMove;

function nextNode(node, body) {
	return body[node.idx + 1];
}

function prevNode(node, body) {
	return body[node.idx - 1];
}

function parentNode(node) {
	return node.parent;
}

var BREAK = 1;
var BREAK_ALL = 2;

function syncDir(advSib, advNode, insert, sibName, nodeName, invSibName, invNodeName, invInsert) {
	return function(node, parEl, body, state, convTest, lis) {
		var sibNode, tmpSib;

		if (state[sibName] != null) {
			// skip dom elements not created by domvm
			if ((sibNode = state[sibName]._node) == null) {
				state[sibName] = advSib(state[sibName]);
				return;
			}

			if (parentNode(sibNode) !== node) {
				tmpSib = advSib(state[sibName]);
				sibNode.vm != null ? sibNode.vm.unmount(true) : removeChild(parEl, state[sibName]);
				state[sibName] = tmpSib;
				return;
			}
		}

		if (state[nodeName] == convTest)
			{ return BREAK_ALL; }
		else if (state[nodeName].el == null) {
			insert(parEl, hydrate(state[nodeName]), state[sibName]);	// should lis be updated here?
			state[nodeName] = advNode(state[nodeName], body);		// also need to advance sib?
		}
		else if (state[nodeName].el === state[sibName]) {
			state[nodeName] = advNode(state[nodeName], body);
			state[sibName] = advSib(state[sibName]);
		}
		// head->tail or tail->head
		else if (!lis && sibNode === state[invNodeName]) {
			tmpSib = state[sibName];
			state[sibName] = advSib(tmpSib);
			invInsert(parEl, tmpSib, state[invSibName]);
			state[invSibName] = tmpSib;
		}
		else {
			if (lis && state[sibName] != null)
				{ return lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state); }

			return BREAK;
		}
	};
}

function lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state) {
	if (sibNode._lis) {
		insert(parEl, state[nodeName].el, state[sibName]);
		state[nodeName] = advNode(state[nodeName], body);
	}
	else {
		// find closest tomb
		var t = binaryFindLarger(sibNode.idx, state.tombs);
		sibNode._lis = true;
		var tmpSib = advSib(state[sibName]);
		insert(parEl, state[sibName], t != null ? body[state.tombs[t]].el : t);

		if (t == null)
			{ state.tombs.push(sibNode.idx); }
		else
			{ state.tombs.splice(t, 0, sibNode.idx); }

		state[sibName] = tmpSib;
	}
}

var syncLft = syncDir(nextSib, nextNode, insertBefore, "lftSib", "lftNode", "rgtSib", "rgtNode", insertAfter);
var syncRgt = syncDir(prevSib, prevNode, insertAfter, "rgtSib", "rgtNode", "lftSib", "lftNode", insertBefore);

function syncChildren(node, donor) {
	var obody	= donor.body,
		parEl	= node.el,
		body	= node.body,
		state = {
			lftNode:	body[0],
			rgtNode:	body[body.length - 1],
			lftSib:		((obody)[0] || emptyObj).el,
			rgtSib:		(obody[obody.length - 1] || emptyObj).el,
		};

	converge:
	while (1) {
//		from_left:
		while (1) {
			var l = syncLft(node, parEl, body, state, null, false);
			if (l === BREAK) { break; }
			if (l === BREAK_ALL) { break converge; }
		}

//		from_right:
		while (1) {
			var r = syncRgt(node, parEl, body, state, state.lftNode, false);
			if (r === BREAK) { break; }
			if (r === BREAK_ALL) { break converge; }
		}

		sortDOM(node, parEl, body, state);
		break;
	}
}

// TODO: also use the state.rgtSib and state.rgtNode bounds, plus reduce LIS range
function sortDOM(node, parEl, body, state) {
	var kids = Array.prototype.slice.call(parEl.childNodes);
	var domIdxs = [];

	for (var k = 0; k < kids.length; k++) {
		var n = kids[k]._node;

		if (n.parent === node)
			{ domIdxs.push(n.idx); }
	}

	// list of non-movable vnode indices (already in correct order in old dom)
	var tombs = longestIncreasingSubsequence(domIdxs).map(function (i) { return domIdxs[i]; });

	for (var i = 0; i < tombs.length; i++)
		{ body[tombs[i]]._lis = true; }

	state.tombs = tombs;

	while (1) {
		var r = syncLft(node, parEl, body, state, null, true);
		if (r === BREAK_ALL) { break; }
	}
}

function alreadyAdopted(vnode) {
	return vnode.el._node.parent !== vnode.parent;
}

function takeSeqIndex(n, obody, fromIdx) {
	return obody[fromIdx];
}

function findSeqThorough(n, obody, fromIdx) {		// pre-tested isView?
	for (; fromIdx < obody.length; fromIdx++) {
		var o = obody[fromIdx];

		if (o.vm != null) {
			// match by key & viewFn || vm
			if (n.type === VVIEW && o.vm.view === n.view && o.vm.key === n.key || n.type === VMODEL && o.vm === n.vm)
				{ return o; }
		}
		else if (!alreadyAdopted(o) && n.tag === o.tag && n.type === o.type && n.key === o.key && (n.flags & ~DEEP_REMOVE) === (o.flags & ~DEEP_REMOVE))
			{ return o; }
	}

	return null;
}

function findHashKeyed(n, obody, fromIdx) {
	return obody[obody._keys[n.key]];
}

/*
// list must be a sorted list of vnodes by key
function findBinKeyed(n, list) {
	var idx = binaryKeySearch(list, n.key);
	return idx > -1 ? list[idx] : null;
}
*/

// have it handle initial hydrate? !donor?
// types (and tags if ELEM) are assumed the same, and donor exists
function patch(vnode, donor) {
	fireHook(donor.hooks, "willRecycle", donor, vnode);

	var el = vnode.el = donor.el;

	var obody = donor.body;
	var nbody = vnode.body;

	el._node = vnode;

	// "" => ""
	if (vnode.type === TEXT && nbody !== obody) {
		el.nodeValue = nbody;
		return;
	}

	if (vnode.attrs != null || donor.attrs != null)
		{ patchAttrs(vnode, donor, false); }

	// patch events

	var oldIsArr = isArr(obody);
	var newIsArr = isArr(nbody);
	var lazyList = (vnode.flags & LAZY_LIST) === LAZY_LIST;

//	var nonEqNewBody = nbody != null && nbody !== obody;

	if (oldIsArr) {
		// [] => []
		if (newIsArr || lazyList)
			{ patchChildren(vnode, donor); }
		// [] => "" | null
		else if (nbody !== obody) {
			if (nbody != null)
				{ el.textContent = nbody; }
			else
				{ clearChildren(donor); }
		}
	}
	else {
		// "" | null => []
		if (newIsArr) {
			clearChildren(donor);
			hydrateBody(vnode);
		}
		// "" | null => "" | null
		else if (nbody !== obody) {
			if (el.firstChild)
				{ el.firstChild.nodeValue = nbody; }
			else
				{ el.textContent = nbody; }
		}
	}

	fireHook(donor.hooks, "didRecycle", donor, vnode);
}

// larger qtys of KEYED_LIST children will use binary search
//const SEQ_FAILS_MAX = 100;

// TODO: modify vtree matcher to work similar to dom reconciler for keyed from left -> from right -> head/tail -> binary
// fall back to binary if after failing nri - nli > SEQ_FAILS_MAX
// while-advance non-keyed fromIdx
// [] => []
function patchChildren(vnode, donor) {
	var nbody		= vnode.body,
		nlen		= nbody.length,
		obody		= donor.body,
		olen		= obody.length,
		isLazy		= (vnode.flags & LAZY_LIST) === LAZY_LIST,
		isFixed		= (vnode.flags & FIXED_BODY) === FIXED_BODY,
		isKeyed		= (vnode.flags & KEYED_LIST) === KEYED_LIST,
		domSync		= !isFixed && vnode.type === ELEMENT,
		doFind		= true,
		find		= (
			isKeyed ? findHashKeyed :				// keyed lists/lazyLists
			isFixed || isLazy ? takeSeqIndex :		// unkeyed lazyLists and FIXED_BODY
			findSeqThorough							// more complex stuff
		);

	if (isKeyed) {
		var keys = {};
		for (var i = 0; i < obody.length; i++)
			{ keys[obody[i].key] = i; }
		obody._keys = keys;
	}

	if (domSync && nlen === 0) {
		clearChildren(donor);
		if (isLazy)
			{ vnode.body = []; }	// nbody.tpl(all);
		return;
	}

	var donor2,
		node2,
		foundIdx,
		patched = 0,
		everNonseq = false,
		fromIdx = 0;		// first unrecycled node (search head)

	if (isLazy) {
		var fnode2 = {key: null};
		var nbodyNew = Array(nlen);
	}

	for (var i = 0; i < nlen; i++) {
		if (isLazy) {
			var remake = false;
			var diffRes = null;

			if (doFind) {
				if (isKeyed)
					{ fnode2.key = nbody.key(i); }

				donor2 = find(fnode2, obody, fromIdx);
			}

			if (donor2 != null) {
                foundIdx = donor2.idx;
				diffRes = nbody.diff(i, donor2);

				// diff returns same, so cheaply adopt vnode without patching
				if (diffRes === true) {
					node2 = donor2;
					node2.parent = vnode;
					node2.idx = i;
					node2._lis = false;
				}
				// diff returns new diffVals, so generate new vnode & patch
				else
					{ remake = true; }
			}
			else
				{ remake = true; }

			if (remake) {
				node2 = nbody.tpl(i);			// what if this is a VVIEW, VMODEL, injected element?
				preProc(node2, vnode, i);

				node2._diff = diffRes != null ? diffRes : nbody.diff(i);

				if (donor2 != null)
					{ patch(node2, donor2); }
			}
			else {
				// TODO: flag tmp FIXED_BODY on unchanged nodes?

				// domSync = true;		if any idx changes or new nodes added/removed
			}

			nbodyNew[i] = node2;
		}
		else {
			var node2 = nbody[i];
			var type2 = node2.type;

			// ELEMENT,TEXT,COMMENT
			if (type2 <= COMMENT) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {
					patch(node2, donor2);
					foundIdx = donor2.idx;
				}
			}
			else if (type2 === VVIEW) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {		// update/moveTo
					foundIdx = donor2.idx;
					var vm = donor2.vm._update(node2.data, vnode, i);		// withDOM
				}
				else
					{ var vm = createView(node2.view, node2.data, node2.key, node2.opts)._redraw(vnode, i, false); }	// createView, no dom (will be handled by sync below)

				type2 = vm.node.type;
			}
			else if (type2 === VMODEL) {
				// if the injected vm has never been rendered, this vm._update() serves as the
				// initial vtree creator, but must avoid hydrating (creating .el) because syncChildren()
				// which is responsible for mounting below (and optionally hydrating), tests .el presence
				// to determine if hydration & mounting are needed
				var withDOM = isHydrated(node2.vm);

				var vm = node2.vm._update(node2.data, vnode, i, withDOM);
				type2 = vm.node.type;
			}
		}

		// found donor & during a sequential search ...at search head
		if (!isKeyed && donor2 != null) {
			if (foundIdx === fromIdx) {
				// advance head
				fromIdx++;
				// if all old vnodes adopted and more exist, stop searching
				if (fromIdx === olen && nlen > olen) {
					// short-circuit find, allow loop just create/init rest
					donor2 = null;
					doFind = false;
				}
			}
			else
				{ everNonseq = true; }

			if (olen > 100 && everNonseq && ++patched % 10 === 0)
				{ while (fromIdx < olen && alreadyAdopted(obody[fromIdx]))
					{ fromIdx++; } }
		}
	}

	// replace List w/ new body
	if (isLazy)
		{ vnode.body = nbodyNew; }

	domSync && syncChildren(vnode, donor);
}

// view + key serve as the vm's unique identity
function ViewModel(view, data, key, opts) {
	var vm = this;

	vm.view = view;
	vm.data = data;
	vm.key = key;

	if (opts) {
		vm.opts = opts;
		vm.config(opts);
	}

	var out = isPlainObj(view) ? view : view.call(vm, vm, data, key, opts);

	if (isFunc(out))
		{ vm.render = out; }
	else {
		vm.render = out.render;
		vm.config(out);
	}

	// these must be wrapped here since they're debounced per view
	vm._redrawAsync = raft(function (_) { return vm.redraw(true); });
	vm._updateAsync = raft(function (newData) { return vm.update(newData, true); });

	vm.init && vm.init.call(vm, vm, vm.data, vm.key, opts);
}

var ViewModelProto = ViewModel.prototype = {
	constructor: ViewModel,

	_diff:	null,	// diff cache

	init:	null,
	view:	null,
	key:	null,
	data:	null,
	state:	null,
	api:	null,
	opts:	null,
	node:	null,
	hooks:	null,
	onevent: noop,
	refs:	null,
	render:	null,

	mount: mount,
	unmount: unmount,
	config: function(opts) {
		var t = this;

		if (opts.init)
			{ t.init = opts.init; }
		if (opts.diff)
			{ t.diff = opts.diff; }
		if (opts.onevent)
			{ t.onevent = opts.onevent; }

		// maybe invert assignment order?
		if (opts.hooks)
			{ t.hooks = assignObj(t.hooks || {}, opts.hooks); }

		{
			if (opts.onemit)
				{ t.onemit = assignObj(t.onemit || {}, opts.onemit); }
		}
	},
	parent: function() {
		return getVm(this.node.parent);
	},
	root: function() {
		var p = this.node;

		while (p.parent)
			{ p = p.parent; }

		return p.vm;
	},
	redraw: function(sync) {
		var vm = this;
		sync ? vm._redraw(null, null, isHydrated(vm)) : vm._redrawAsync();
		return vm;
	},
	update: function(newData, sync) {
		var vm = this;
		sync ? vm._update(newData, null, null, isHydrated(vm)) : vm._updateAsync(newData);
		return vm;
	},

	_update: updateSync,
	_redraw: redrawSync,
	_redrawAsync: null,
	_updateAsync: null,
};

function mount(el, isRoot) {
	var vm = this;

	if (isRoot) {
		clearChildren({el: el, flags: 0});

		vm._redraw(null, null, false);

		// if placeholder node doesnt match root tag
		if (el.nodeName.toLowerCase() !== vm.node.tag) {
			hydrate(vm.node);
			insertBefore(el.parentNode, vm.node.el, el);
			el.parentNode.removeChild(el);
		}
		else
			{ insertBefore(el.parentNode, hydrate(vm.node, el), el); }
	}
	else {
		vm._redraw(null, null);

		if (el)
			{ insertBefore(el, vm.node.el); }
	}

	if (el)
		{ drainDidHooks(vm); }

	return vm;
}

// asSub means this was called from a sub-routine, so don't drain did* hook queue
function unmount(asSub) {
	var vm = this;

	var node = vm.node;
	var parEl = node.el.parentNode;

	// edge bug: this could also be willRemove promise-delayed; should .then() or something to make sure hooks fire in order
	removeChild(parEl, node.el);

	if (!asSub)
		{ drainDidHooks(vm); }
}

function reParent(vm, vold, newParent, newIdx) {
	if (newParent != null) {
		newParent.body[newIdx] = vold;
		vold.idx = newIdx;
		vold.parent = newParent;
		vold._lis = false;
	}
	return vm;
}

function redrawSync(newParent, newIdx, withDOM) {
	var isRedrawRoot = newParent == null;
	var vm = this;
	var isMounted = vm.node && vm.node.el && vm.node.el.parentNode;

	var vold = vm.node, oldDiff, newDiff;

	if (vm.diff != null) {
		oldDiff = vm._diff;
		vm._diff = newDiff = vm.diff(vm, vm.data);

		if (vold != null) {
			var cmpFn = isArr(oldDiff) ? cmpArr : cmpObj;
			var isSame = oldDiff === newDiff || cmpFn(oldDiff, newDiff);

			if (isSame)
				{ return reParent(vm, vold, newParent, newIdx); }
		}
	}

	isMounted && fireHook(vm.hooks, "willRedraw", vm, vm.data);

	var vnew = vm.render.call(vm, vm, vm.data, oldDiff, newDiff);

	if (vnew === vold)
		{ return reParent(vm, vold, newParent, newIdx); }

	// todo: test result of willRedraw hooks before clearing refs
	vm.refs = null;

	// always assign vm key to root vnode (this is a de-opt)
	if (vm.key != null && vnew.key !== vm.key)
		{ vnew.key = vm.key; }

	vm.node = vnew;

	if (newParent) {
		preProc(vnew, newParent, newIdx, vm);
		newParent.body[newIdx] = vnew;
	}
	else if (vold && vold.parent) {
		preProc(vnew, vold.parent, vold.idx, vm);
		vold.parent.body[vold.idx] = vnew;
	}
	else
		{ preProc(vnew, null, null, vm); }

	if (withDOM !== false) {
		if (vold) {
			// root node replacement
			if (vold.tag !== vnew.tag || vold.key !== vnew.key) {
				// hack to prevent the replacement from triggering mount/unmount
				vold.vm = vnew.vm = null;

				var parEl = vold.el.parentNode;
				var refEl = nextSib(vold.el);
				removeChild(parEl, vold.el);
				insertBefore(parEl, hydrate(vnew), refEl);

				// another hack that allows any higher-level syncChildren to set
				// reconciliation bounds using a live node
				vold.el = vnew.el;

				// restore
				vnew.vm = vm;
			}
			else
				{ patch(vnew, vold); }
		}
		else
			{ hydrate(vnew); }
	}

	isMounted && fireHook(vm.hooks, "didRedraw", vm, vm.data);

	if (isRedrawRoot && isMounted)
		{ drainDidHooks(vm); }

	return vm;
}

// this also doubles as moveTo
// TODO? @withRedraw (prevent redraw from firing)
function updateSync(newData, newParent, newIdx, withDOM) {
	var vm = this;

	if (newData != null) {
		if (vm.data !== newData) {
			fireHook(vm.hooks, "willUpdate", vm, newData);
			vm.data = newData;

			
		}
	}

	return vm._redraw(newParent, newIdx, withDOM);
}

function defineElement(tag, arg1, arg2, flags) {
	var attrs, body;

	if (arg2 == null) {
		if (isPlainObj(arg1))
			{ attrs = arg1; }
		else
			{ body = arg1; }
	}
	else {
		attrs = arg1;
		body = arg2;
	}

	return initElementNode(tag, attrs, body, flags);
}

//export const XML_NS = "http://www.w3.org/2000/xmlns/";
var SVG_NS = "http://www.w3.org/2000/svg";

function defineSvgElement(tag, arg1, arg2, flags) {
	var n = defineElement(tag, arg1, arg2, flags);
	n.ns = SVG_NS;
	return n;
}

function defineComment(body) {
	var node = new VNode;
	node.type = COMMENT;
	node.body = body;
	return node;
}

// placeholder for declared views
function VView(view, data, key, opts) {
	this.view = view;
	this.data = data;
	this.key = key;
	this.opts = opts;
}

VView.prototype = {
	constructor: VView,

	type: VVIEW,
	view: null,
	data: null,
	key: null,
	opts: null,
};

function defineView(view, data, key, opts) {
	return new VView(view, data, key, opts);
}

// placeholder for injected ViewModels
function VModel(vm) {
	this.vm = vm;
}

VModel.prototype = {
	constructor: VModel,

	type: VMODEL,
	vm: null,
};

function injectView(vm) {
//	if (vm.node == null)
//		vm._redraw(null, null, false);

//	return vm.node;

	return new VModel(vm);
}

function injectElement(el) {
	var node = new VNode;
	node.type = ELEMENT;
	node.el = node.key = el;
	return node;
}

function lazyList(items, cfg) {
	var len = items.length;

	var self = {
		items: items,
		length: len,
		// defaults to returning item identity (or position?)
		key: function(i) {
			return cfg.key(items[i], i);
		},
		// default returns 0?
		diff: function(i, donor) {
			var newVals = cfg.diff(items[i], i);
			if (donor == null)
				{ return newVals; }
			var oldVals = donor._diff;
			var same = newVals === oldVals || isArr(oldVals) ? cmpArr(newVals, oldVals) : cmpObj(newVals, oldVals);
			return same || newVals;
		},
		tpl: function(i) {
			return cfg.tpl(items[i], i);
		},
		map: function(tpl) {
			cfg.tpl = tpl;
			return self;
		},
		body: function(vnode) {
			var nbody = Array(len);

			for (var i = 0; i < len; i++) {
				var vnode2 = self.tpl(i);

			//	if ((vnode.flags & KEYED_LIST) === KEYED_LIST && self. != null)
			//		vnode2.key = getKey(item);

				vnode2._diff = self.diff(i);			// holds oldVals for cmp

				nbody[i] = vnode2;

				// run preproc pass (should this be just preProc in above loop?) bench
				preProc(vnode2, vnode, i);
			}

			// replace List with generated body
			vnode.body = nbody;
		}
	};

	return self;
}

var nano = {
	config: config,

	ViewModel: ViewModel,
	VNode: VNode,

	createView: createView,

	defineElement: defineElement,
	defineSvgElement: defineSvgElement,
	defineText: defineText,
	defineComment: defineComment,
	defineView: defineView,

	injectView: injectView,
	injectElement: injectElement,

	lazyList: lazyList,

	FIXED_BODY: FIXED_BODY,
	DEEP_REMOVE: DEEP_REMOVE,
	KEYED_LIST: KEYED_LIST,
	LAZY_LIST: LAZY_LIST,
};

function protoPatch(n, doRepaint) {
	patch$1(this, n, doRepaint);
}

// newNode can be either {class: style: } or full new VNode
// will/didPatch hooks?
function patch$1(o, n, doRepaint) {
	if (n.type != null) {
		// no full patching of view roots, just use redraw!
		if (o.vm != null)
			{ return; }

		preProc(n, o.parent, o.idx, null);
		o.parent.body[o.idx] = n;
		patch(n, o);
		doRepaint && repaint(n);
		drainDidHooks(getVm(n));
	}
	else {
		// TODO: re-establish refs

		// shallow-clone target
		var donor = Object.create(o);
		// fixate orig attrs
		donor.attrs = assignObj({}, o.attrs);
		// assign new attrs into live targ node
		var oattrs = assignObj(o.attrs, n);
		// prepend any fixed shorthand class
		if (o._class != null) {
			var aclass = oattrs.class;
			oattrs.class = aclass != null && aclass !== "" ? o._class + " " + aclass : o._class;
		}

		patchAttrs(o, donor);

		doRepaint && repaint(o);
	}
}

VNodeProto.patch = protoPatch;

function nextSubVms(n, accum) {
	var body = n.body;

	if (isArr(body)) {
		for (var i = 0; i < body.length; i++) {
			var n2 = body[i];

			if (n2.vm != null)
				{ accum.push(n2.vm); }
			else
				{ nextSubVms(n2, accum); }
		}
	}

	return accum;
}

function defineElementSpread(tag) {
	var args = arguments;
	var len = args.length;
	var body, attrs;

	if (len > 1) {
		var bodyIdx = 1;

		if (isPlainObj(args[1])) {
			attrs = args[1];
			bodyIdx = 2;
		}

		if (len === bodyIdx + 1 && (isVal(args[bodyIdx]) || isArr(args[bodyIdx]) || attrs && (attrs._flags & LAZY_LIST) === LAZY_LIST))
			{ body = args[bodyIdx]; }
		else
			{ body = sliceArgs(args, bodyIdx); }
	}

	return initElementNode(tag, attrs, body);
}

function defineSvgElementSpread() {
	var n = defineElementSpread.apply(null, arguments);
	n.ns = SVG_NS;
	return n;
}

ViewModelProto.emit = emit;
ViewModelProto.onemit = null;

ViewModelProto.body = function() {
	return nextSubVms(this.node, []);
};

nano.defineElementSpread = defineElementSpread;
nano.defineSvgElementSpread = defineSvgElementSpread;

return nano;

})));
//# sourceMappingURL=domvm.micro.js.map


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(9);
var types_1 = __webpack_require__(8);
var Loader = /** @class */ (function () {
    function Loader(parent, changes) {
        this._parent = parent;
        this._changes = changes; // todo: [dirty] mutation
    }
    Loader.prototype.load = function (url, driver) {
        var _this = this;
        return this._parent.loadData = url.load().then(function (data) {
            _this._parent.removeAll();
            // const parcedData = this.parse(data, driver);
            return _this.parse(data, driver);
        }).catch(function (error) {
            _this._parent.events.fire(types_1.DataEvents.loadError, [error]);
        });
    };
    Loader.prototype.parse = function (data, driver) {
        if (driver === void 0) { driver = "json"; }
        if (driver === "json" && !helpers_1.hasJsonOrArrayStructure(data)) {
            this._parent.events.fire(types_1.DataEvents.loadError, ["Uncaught SyntaxError: Unexpected end of input"]);
        }
        driver = helpers_1.toDataDriver(driver);
        data = driver.toJsonArray(data);
        this._parent.$parse(data);
        return data;
    };
    Loader.prototype.save = function (url) {
        var _this = this;
        var _loop_1 = function (el) {
            if (el.saving || el.pending) {
                helpers_1.dhxWarning("item is saving");
            }
            else {
                var prevEl_1 = this_1._findPrevState(el.id);
                if (prevEl_1 && prevEl_1.saving) {
                    var pending = new Promise(function (res, rej) {
                        prevEl_1.promise.then(function () {
                            el.pending = false;
                            res(_this._setPromise(el, url));
                        }).catch(function (err) {
                            _this._removeFromOrder(prevEl_1);
                            _this._setPromise(el, url);
                            helpers_1.dhxWarning(err);
                            rej(err);
                        });
                    });
                    this_1._addToChain(pending);
                    el.pending = true;
                }
                else {
                    this_1._setPromise(el, url);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            _loop_1(el);
        }
        this._parent.saveData.then(function () {
            _this._saving = false;
        });
    };
    Loader.prototype._setPromise = function (el, url) {
        var _this = this;
        el.promise = url.save(el.obj, el.status);
        el.promise.then(function () {
            _this._removeFromOrder(el);
        }).catch(function (err) {
            el.saving = false;
            el.error = true;
            helpers_1.dhxError(err);
        });
        el.saving = true;
        this._saving = true;
        this._addToChain(el.promise);
        return el.promise;
    };
    Loader.prototype._addToChain = function (promise) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (this._parent.saveData && this._saving) {
            this._parent.saveData = this._parent.saveData.then(function () { return promise; });
        }
        else {
            this._parent.saveData = promise;
        }
    };
    Loader.prototype._findPrevState = function (id) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.id === id) {
                return el;
            }
        }
        return null;
    };
    Loader.prototype._removeFromOrder = function (el) {
        this._changes.order = this._changes.order.filter(function (item) { return !helpers_1.isEqualObj(item, el); });
    };
    return Loader;
}());
exports.Loader = Loader;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(12)))

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xml_1 = __webpack_require__(51);
var ARRAY_NAME = "items";
var ITEM_NAME = "item";
var XMLDriver = /** @class */ (function () {
    function XMLDriver() {
    }
    XMLDriver.prototype.toJsonArray = function (data) {
        return this.getRows(data);
    };
    XMLDriver.prototype.serialize = function (data) {
        return xml_1.jsonToXML(data);
    };
    XMLDriver.prototype.getFields = function (row) {
        return row;
    };
    XMLDriver.prototype.getRows = function (data) {
        if (typeof data === "string") {
            data = this._fromString(data);
        }
        var childNodes = data.childNodes && data.childNodes[0] && data.childNodes[0].childNodes;
        if (!childNodes || !childNodes.length) {
            return null;
        }
        return this._getRows(childNodes);
    };
    XMLDriver.prototype._getRows = function (nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === ITEM_NAME) {
                result.push(this._nodeToJS(nodes[i]));
            }
        }
        return result;
    };
    XMLDriver.prototype._fromString = function (data) {
        return (new DOMParser()).parseFromString(data, "text/xml");
    };
    XMLDriver.prototype._nodeToJS = function (node) {
        var result = {};
        if (this._haveAttrs(node)) {
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var _a = attrs[i], name_1 = _a.name, value = _a.value;
                result[name_1] = this._toType(value);
            }
        }
        if (node.nodeType === 3) {
            result.value = result.value || this._toType(node.textContent);
            return result;
        }
        var childNodes = node.childNodes;
        if (childNodes) {
            for (var i = 0; i < childNodes.length; i++) {
                var subNode = childNodes[i];
                var tag = subNode.tagName;
                if (!tag) {
                    continue;
                }
                if (tag === ARRAY_NAME && subNode.childNodes) {
                    result[tag] = this._getRows(subNode.childNodes);
                }
                else {
                    if (this._haveAttrs(subNode)) {
                        result[tag] = this._nodeToJS(subNode);
                    }
                    else {
                        result[tag] = this._toType(subNode.textContent);
                    }
                }
            }
        }
        return result;
    };
    XMLDriver.prototype._toType = function (val) {
        if (val === "false" || val === "true") {
            return val === "true";
        }
        if (!isNaN(val)) {
            return Number(val);
        }
        return val;
    };
    XMLDriver.prototype._haveAttrs = function (node) {
        return node.attributes && node.attributes.length;
    };
    return XMLDriver;
}());
exports.XMLDriver = XMLDriver;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var INDENT_STEP = 4;
function jsonToXML(data, root) {
    if (root === void 0) { root = "root"; }
    var result = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<" + root + ">";
    for (var i = 0; i < data.length; i++) {
        result += "\n" + itemToXML(data[i]);
    }
    return result + ("\n</" + root + ">");
}
exports.jsonToXML = jsonToXML;
function ws(count) {
    return " ".repeat(count);
}
function itemToXML(item, indent) {
    if (indent === void 0) { indent = INDENT_STEP; }
    var result = ws(indent) + "<item>\n";
    for (var key in item) {
        if (Array.isArray(item[key])) {
            result += ws(indent + INDENT_STEP) + ("<" + key + ">\n");
            result += item[key].map(function (subItem) { return itemToXML(subItem, indent + INDENT_STEP * 2); }).join("\n") + "\n";
            result += ws(indent + INDENT_STEP) + ("</" + key + ">\n");
        }
        else {
            result += ws(indent + INDENT_STEP) + ("<" + key + ">" + item[key] + "</" + key + ">\n");
        }
    }
    result += ws(indent) + "</item>";
    return result;
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(9);
var Sort = /** @class */ (function () {
    function Sort() {
    }
    Sort.prototype.sort = function (array, by) {
        var _this = this;
        if (by.rule && typeof by.rule === "function") {
            this._sort(array, by);
        }
        else if (by.by) {
            by.rule = function (a, b) {
                var aa = _this._checkVal(by.as, a[by.by]);
                var bb = _this._checkVal(by.as, b[by.by]);
                return helpers_1.naturalCompare(aa.toString(), bb.toString());
            };
            this._sort(array, by);
        }
    };
    Sort.prototype._checkVal = function (method, val) {
        return method ? method.call(this, val) : val;
    };
    Sort.prototype._sort = function (arr, conf) {
        var _this = this;
        var dir = {
            asc: 1,
            desc: -1
        };
        return arr.sort(function (a, b) {
            return conf.rule.call(_this, a, b) * (dir[conf.dir] || dir.asc);
        });
    };
    return Sort;
}());
exports.Sort = Sort;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var datacollection_1 = __webpack_require__(20);
var dataproxy_1 = __webpack_require__(11);
var helpers_1 = __webpack_require__(9);
var types_1 = __webpack_require__(8);
function addToOrder(store, obj, parent, index) {
    if (index !== undefined && index !== -1 && store[parent] && store[parent][index]) {
        store[parent].splice(index, 0, obj);
    }
    else {
        if (!store[parent]) {
            store[parent] = [];
        }
        store[parent].push(obj);
    }
}
var TreeCollection = /** @class */ (function (_super) {
    __extends(TreeCollection, _super);
    function TreeCollection(config, events) {
        var _a;
        var _this = _super.call(this, config, events) || this;
        var root = _this._root = "_ROOT_" + core_1.uid();
        _this._childs = (_a = {}, _a[root] = [], _a);
        _this._initChilds = null;
        return _this;
    }
    TreeCollection.prototype.add = function (obj, index, parent) {
        var _this = this;
        if (index === void 0) { index = -1; }
        if (parent === void 0) { parent = this._root; }
        if (typeof obj !== "object") {
            obj = {
                value: obj
            };
        }
        if (Array.isArray(obj)) {
            obj.map(function (element, key) {
                if (key > 0 && index !== -1) {
                    index = index + 1;
                }
                element.parent = element.parent ? element.parent.toString() : parent;
                var id = _super.prototype.add.call(_this, element, index);
                if (Array.isArray(element.items)) {
                    for (var _i = 0, _a = element.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _this.add(item, -1, element.id);
                    }
                }
                return id;
            });
        }
        else {
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            var id = _super.prototype.add.call(this, obj, index);
            if (Array.isArray(obj.items)) {
                for (var _i = 0, _a = obj.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.add(item, -1, obj.id);
                }
            }
            return id;
        }
    };
    TreeCollection.prototype.getRoot = function () {
        return this._root;
    };
    TreeCollection.prototype.getParent = function (id, asObj) {
        if (asObj === void 0) { asObj = false; }
        if (!this._pull[id]) {
            return null;
        }
        var parent = this._pull[id].parent;
        return asObj ? this._pull[parent] : parent;
    };
    TreeCollection.prototype.getItems = function (id) {
        if (this._childs && this._childs[id]) {
            return this._childs[id];
        }
        return [];
    };
    TreeCollection.prototype.getLength = function (id) {
        if (id === void 0) { id = this._root; }
        if (!this._childs[id]) {
            return null;
        }
        return this._childs[id].length;
    };
    TreeCollection.prototype.removeAll = function (id) {
        var _a;
        if (id) {
            var childs = this._childs[id].slice();
            for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
                var child = childs_1[_i];
                this.remove(child.id);
            }
        }
        else {
            _super.prototype.removeAll.call(this);
            var root = this._root;
            this._initChilds = null;
            this._childs = (_a = {}, _a[root] = [], _a);
        }
    };
    TreeCollection.prototype.getIndex = function (id) {
        var parent = this.getParent(id);
        if (!parent || !this._childs[parent]) {
            return -1;
        }
        return core_1.findIndex(this._childs[parent], function (item) { return item.id === id; });
    };
    TreeCollection.prototype.sort = function (by) {
        var _this = this;
        if (!by) {
            this._childs = {};
            // [dirty]
            this._parse_data(Object.keys(this._pull).map(function (key) { return _this._pull[key]; }));
            if (this._filters) {
                for (var key in this._filters) {
                    var filter = this._filters[key];
                    this.filter(filter.rule, filter.config);
                }
            }
        }
        else {
            for (var key in this._childs) {
                this._sort.sort(this._childs[key], by);
            }
            if (this._initChilds && Object.keys(this._initChilds).length) {
                for (var key in this._initChilds) {
                    this._sort.sort(this._initChilds[key], by);
                }
            }
        }
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.map = function (cb, parent, direct) {
        if (parent === void 0) { parent = this._root; }
        if (direct === void 0) { direct = true; }
        var result = [];
        if (!this.haveItems(parent)) {
            return result;
        }
        for (var i = 0; i < this._childs[parent].length; i++) {
            result.push(cb.call(this, this._childs[parent][i], i));
            if (direct) {
                var childResult = this.map(cb, this._childs[parent][i].id, direct);
                result = result.concat(childResult);
            }
        }
        return result;
    };
    TreeCollection.prototype.filter = function (rule, config) {
        if (config === void 0) { config = {}; }
        if (!rule) {
            this.restoreOrder();
            return;
        }
        if (!this._initChilds) {
            this._initChilds = this._childs;
        }
        config.type = config.type || types_1.TreeFilterType.leafs;
        // [todo] we can store multiple filter rules, like in datacollection
        this._filters = {};
        this._filters._ = {
            rule: rule,
            config: config
        };
        var newChilds = {};
        this._recursiveFilter(rule, config, this._root, 0, newChilds);
        var parents = [];
        var _loop_1 = function (i) {
            if (newChilds[i].length > 0 && newChilds[i] !== newChilds[this_1.getRoot()]) {
                var item = newChilds[this_1.getRoot()].find(function (element) {
                    if (element.id === i) {
                        return element;
                    }
                });
                if (item) {
                    parents.push(item);
                }
            }
        };
        var this_1 = this;
        for (var i in newChilds) {
            _loop_1(i);
        }
        newChilds[this.getRoot()] = parents;
        this._childs = newChilds;
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.restoreOrder = function () {
        if (this._initChilds) {
            this._childs = this._initChilds;
            this._initChilds = null;
        }
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.copy = function (id, index, target, targetId) {
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (!this.exists(id)) {
            return null;
        }
        var currentChilds = this._childs[id];
        if (target === this && !this.canCopy(id, targetId)) {
            return null;
        }
        var itemCopy = helpers_1.copyWithoutInner(this.getItem(id), { items: true });
        if (target.exists(id)) {
            itemCopy.id = core_1.uid();
        }
        if (!helpers_1.isTreeCollection(target)) {
            target.add(itemCopy, index);
            return;
        }
        if (this.exists(id)) {
            itemCopy.parent = targetId;
            target.add(itemCopy, index);
            id = itemCopy.id;
        }
        if (currentChilds) {
            for (var _i = 0, currentChilds_1 = currentChilds; _i < currentChilds_1.length; _i++) {
                var child = currentChilds_1[_i];
                var childId = child.id;
                var childIndex = this.getIndex(childId);
                this.copy(childId, childIndex, target, id);
            }
        }
        return id;
    };
    TreeCollection.prototype.move = function (id, index, target, targetId) {
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (!this.exists(id)) {
            return null;
        }
        if (target !== this) {
            if (!helpers_1.isTreeCollection(target)) { // move to datacollection
                target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                this.remove(id);
                return;
            }
            var returnId = this.copy(id, index, target, targetId);
            this.remove(id);
            return returnId;
        }
        // move inside
        if (!this.canCopy(id, targetId)) {
            return null;
        }
        var parent = this.getParent(id);
        var parentIndex = this.getIndex(id);
        // get item from parent array and move to target array
        var spliced = this._childs[parent].splice(parentIndex, 1)[0];
        spliced.parent = targetId; // need for next moving, ... not best solution, may be full method for get item
        if (!this._childs[parent].length) {
            delete this._childs[parent];
        }
        if (!this.haveItems(targetId)) {
            this._childs[targetId] = [];
        }
        if (index === -1) {
            index = this._childs[targetId].push(spliced);
        }
        else {
            this._childs[targetId].splice(index, 0, spliced);
        }
        this.events.fire(types_1.DataEvents.change);
        return id;
    };
    TreeCollection.prototype.eachChild = function (id, cb, direct, checkItem) {
        if (direct === void 0) { direct = true; }
        if (checkItem === void 0) { checkItem = function () { return true; }; }
        if (!this.haveItems(id)) {
            return;
        }
        for (var i = 0; i < this._childs[id].length; i++) {
            cb.call(this, this._childs[id][i], i);
            if (direct && checkItem(this._childs[id][i])) {
                this.eachChild(this._childs[id][i].id, cb, direct, checkItem);
            }
        }
    };
    TreeCollection.prototype.getNearId = function (id) {
        return id; // for selection
    };
    TreeCollection.prototype.loadItems = function (id, driver) {
        var _this = this;
        if (driver === void 0) { driver = "json"; }
        var url = this.config.autoload + "?id=" + id;
        var proxy = new dataproxy_1.DataProxy(url);
        proxy.load().then(function (data) {
            driver = helpers_1.toDataDriver(driver);
            data = driver.toJsonArray(data);
            _this._parse_data(data, id);
            _this.events.fire(types_1.DataEvents.change);
        });
    };
    TreeCollection.prototype.refreshItems = function (id, driver) {
        if (driver === void 0) { driver = "json"; }
        this.removeAll(id);
        this.loadItems(id, driver);
    };
    TreeCollection.prototype.eachParent = function (id, cb, self) {
        if (self === void 0) { self = false; }
        var item = this.getItem(id);
        if (!item) {
            return;
        }
        if (self) {
            cb.call(this, item);
        }
        if (item.parent === this._root) {
            return;
        }
        var parent = this.getItem(item.parent);
        cb.call(this, parent);
        this.eachParent(item.parent, cb);
    };
    TreeCollection.prototype.haveItems = function (id) {
        return id in this._childs;
    };
    TreeCollection.prototype.canCopy = function (id, target) {
        if (id === target) {
            return false;
        }
        var canCopy = true;
        this.eachParent(target, function (item) { return item.id === id ? canCopy = false : null; }); // locate return string
        return canCopy;
    };
    TreeCollection.prototype.serialize = function (driver, checkItem) {
        if (driver === void 0) { driver = types_1.DataDriver.json; }
        var data = this._serialize(this._root, checkItem);
        var dataDriver = helpers_1.toDataDriver(driver);
        if (dataDriver) {
            return dataDriver.serialize(data);
        }
    };
    TreeCollection.prototype.getId = function (index, parent) {
        if (parent === void 0) { parent = this._root; }
        if (!this._childs[parent] || !this._childs[parent][index]) {
            return;
        }
        return this._childs[parent][index].id;
    };
    TreeCollection.prototype._removeAll = function (id) {
        var _a;
        if (id) {
            var childs = this._childs[id].slice();
            for (var _i = 0, childs_2 = childs; _i < childs_2.length; _i++) {
                var child = childs_2[_i];
                this.remove(child.id);
            }
        }
        else {
            _super.prototype._removeAll.call(this);
            var root = this._root;
            this._initChilds = null;
            this._childs = (_a = {}, _a[root] = [], _a);
        }
    };
    TreeCollection.prototype._removeCore = function (id) {
        if (this._pull[id]) {
            var parent_1 = this.getParent(id);
            this._childs[parent_1] = this._childs[parent_1].filter(function (item) { return item.id !== id; });
            if (parent_1 !== this._root && !this._childs[parent_1].length) {
                delete this._childs[parent_1];
            }
            if (this._initChilds && this._initChilds[parent_1]) {
                this._initChilds[parent_1] = this._initChilds[parent_1].filter(function (item) { return item.id !== id; });
                if (parent_1 !== this._root && !this._initChilds[parent_1].length) {
                    delete this._initChilds[parent_1];
                }
            }
            this._fastDeleteChilds(this._childs, id);
            if (this._initChilds) {
                this._fastDeleteChilds(this._initChilds, id);
            }
        }
    };
    TreeCollection.prototype._addToOrder = function (_order, obj, index) {
        var childs = this._childs;
        var initChilds = this._initChilds;
        var parent = obj.parent;
        this._pull[obj.id] = obj;
        addToOrder(childs, obj, parent, index);
        if (initChilds) {
            addToOrder(initChilds, obj, parent, index);
        }
    };
    TreeCollection.prototype._parse_data = function (data, parent) {
        if (parent === void 0) { parent = this._root; }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            if (typeof obj !== "object") {
                obj = {
                    value: obj
                };
            }
            obj.id = obj.id ? obj.id.toString() : core_1.uid();
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            this._pull[obj.id] = obj;
            if (!this._childs[obj.parent]) {
                this._childs[obj.parent] = [];
            }
            this._childs[obj.parent].push(obj);
            if (obj.items && obj.items instanceof Object) {
                this._parse_data(obj.items, obj.id);
            }
        }
    };
    TreeCollection.prototype._fastDeleteChilds = function (target, id) {
        if (this._pull[id]) {
            delete this._pull[id];
        }
        if (!target[id]) {
            return;
        }
        for (var i = 0; i < target[id].length; i++) {
            this._fastDeleteChilds(target, target[id][i].id);
        }
        delete target[id];
    };
    TreeCollection.prototype._recursiveFilter = function (rule, config, current, level, newChilds) {
        var _this = this;
        var childs = this._childs[current];
        if (!childs) {
            return;
        }
        var condition = function (item) {
            switch (config.type) {
                case types_1.TreeFilterType.all: {
                    return true;
                }
                case types_1.TreeFilterType.level: {
                    return level === config.level;
                }
                case types_1.TreeFilterType.leafs: {
                    return !_this.haveItems(item.id);
                }
            }
        };
        if (typeof rule === "function") {
            var customRule = function (item) { return !condition(item) || rule(item); };
            var filtered = childs.filter(customRule);
            if (filtered.length) {
                newChilds[current] = filtered;
            }
        }
        else if (rule.by && rule.match) {
            var customRule = function (item) { return !condition(item) || item[rule.by].toString().toLowerCase().indexOf(rule.match.toString().toLowerCase()) !== -1; };
            newChilds[current] = childs.filter(customRule);
        }
        for (var _i = 0, childs_3 = childs; _i < childs_3.length; _i++) {
            var child = childs_3[_i];
            this._recursiveFilter(rule, config, child.id, level + 1, newChilds);
        }
    };
    TreeCollection.prototype._serialize = function (parent, fn) {
        var _this = this;
        if (parent === void 0) { parent = this._root; }
        return this.map(function (item) {
            var itemCopy = {};
            for (var key in item) {
                if (key === "parent" || key === "items") {
                    continue;
                }
                itemCopy[key] = item[key];
            }
            if (fn) {
                itemCopy = fn(itemCopy);
            }
            if (_this.haveItems(item.id)) {
                itemCopy.items = _this._serialize(item.id, fn);
            }
            return itemCopy;
        }, parent, false);
    };
    return TreeCollection;
}(datacollection_1.DataCollection));
exports.TreeCollection = TreeCollection;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(2);
var CollectionStore_1 = __webpack_require__(55);
var types_1 = __webpack_require__(8);
var helpers_1 = __webpack_require__(9);
function getPosition(e) {
    var y = e.clientY;
    var element = html_1.locateNode(e);
    if (!element) {
        return null;
    }
    var treeLine = element.childNodes[0];
    var _a = treeLine.getBoundingClientRect(), top = _a.top, height = _a.height;
    return (y - top) / height;
}
function dragEventContent(element, elements) {
    var rect = element.getBoundingClientRect();
    var ghost = document.createElement("div");
    var clone = element.cloneNode(true);
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.maxHeight = rect.height + "px";
    clone.style.opacity = "0.6";
    ghost.appendChild(clone);
    if (elements && elements.length) {
        elements.forEach(function (node, key) {
            var nodeClone = node.cloneNode(true);
            nodeClone.style.width = rect.width + "px";
            nodeClone.style.height = rect.height + "px";
            nodeClone.style.maxHeight = rect.height + "px";
            nodeClone.style.top = ((key + 1) * 12 - rect.height) - (rect.height * key) + "px";
            nodeClone.style.left = (key + 1) * 12 + "px";
            nodeClone.style.opacity = "0.6";
            nodeClone.style.zIndex = "" + (-key - 1);
            ghost.appendChild(nodeClone);
        });
    }
    ghost.className = "dhx_drag-ghost";
    ghost.style.position = "absolute";
    ghost.style.pointerEvents = "none";
    return ghost;
}
var DragManager = /** @class */ (function () {
    function DragManager() {
        var _this = this;
        this._transferData = {};
        this._canMove = true;
        this._selectedIds = [];
        this._onMouseMove = function (e) {
            if (!_this._transferData.id) {
                return;
            }
            var pageX = e.pageX, pageY = e.pageY;
            if (!_this._transferData.ghost) {
                if (Math.abs(_this._transferData.x - pageX) < 3 && Math.abs(_this._transferData.y - pageY) < 3) {
                    return;
                }
                else {
                    var ghost = _this._onDragStart(_this._transferData.id, _this._transferData.targetId);
                    if (!ghost) {
                        _this._endDrop();
                        return;
                    }
                    else {
                        _this._transferData.ghost = ghost;
                        document.body.appendChild(_this._transferData.ghost);
                    }
                }
            }
            _this._moveGhost(pageX, pageY);
            _this._onDrag(e);
        };
        this._onMouseUp = function () {
            if (!_this._transferData.x) {
                return;
            }
            if (_this._transferData.ghost) {
                _this._removeGhost();
                _this._onDrop();
            }
            else {
                _this._endDrop();
            }
            document.removeEventListener("mousemove", _this._onMouseMove);
            document.removeEventListener("mouseup", _this._onMouseUp);
        };
    }
    DragManager.prototype.setItem = function (id, item) {
        CollectionStore_1.collectionStore.setItem(id, item);
    };
    DragManager.prototype.onMouseDown = function (e, selectedIds, itemsForGhost) {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();
        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("mouseup", this._onMouseUp);
        var item = html_1.locateNode(e, "dhx_id");
        var id = item && item.getAttribute("dhx_id");
        var targetId = html_1.locate(e, "dhx_widget_id");
        if (selectedIds && selectedIds.indexOf(id) !== -1 && selectedIds.length > 1) {
            this._selectedIds = selectedIds;
            this._itemsForGhost = itemsForGhost;
        }
        else {
            this._selectedIds = [];
            this._itemsForGhost = null;
        }
        if (id && targetId) {
            var _a = html_1.getBox(item), left = _a.left, top_1 = _a.top;
            this._transferData.initXOffset = e.pageX - left;
            this._transferData.initYOffset = e.pageY - top_1;
            this._transferData.x = e.pageX;
            this._transferData.y = e.pageY;
            this._transferData.targetId = targetId;
            this._transferData.id = id;
            this._transferData.item = item;
        }
    };
    DragManager.prototype._moveGhost = function (x, y) {
        if (this._transferData.ghost) {
            this._transferData.ghost.style.left = x - this._transferData.initXOffset + "px";
            this._transferData.ghost.style.top = y - this._transferData.initYOffset + "px";
        }
    };
    DragManager.prototype._removeGhost = function () {
        document.body.removeChild(this._transferData.ghost);
    };
    DragManager.prototype._onDrop = function () {
        if (!this._canMove) {
            this._endDrop();
            return;
        }
        var target = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        var config = target && target.config;
        if (!target || config.dragMode === types_1.DragMode.source) {
            this._endDrop();
            return;
        }
        if (target.events.fire(types_1.DragEvents.beforeDrop, [this._lastId, this._transferData.target])) {
            var to = {
                id: this._lastId,
                target: target
            };
            var from = {
                id: this._transferData.id,
                target: this._transferData.target
            };
            this._move(from, to);
            to.target.events.fire(types_1.DragEvents.dropComplete, [to.id, this._transferData.dropPosition]);
        }
        this._endDrop();
    };
    DragManager.prototype._onDragStart = function (id, targetId) {
        var target = CollectionStore_1.collectionStore.getItem(targetId);
        var config = target.config;
        if (config.dragMode === types_1.DragMode.target) {
            return null;
        }
        var item = target.data.getItem(id);
        var ghost = dragEventContent(this._transferData.item, this._itemsForGhost);
        var ans = target.events.fire(types_1.DragEvents.beforeDrag, [item, ghost]);
        if (!ans || !id) {
            return null;
        }
        target.events.fire(types_1.DragEvents.dragStart, [id, this._selectedIds]);
        this._toggleTextSelection(true);
        this._transferData.target = target;
        this._transferData.dragConfig = config;
        return ghost;
    };
    DragManager.prototype._onDrag = function (e) {
        var clientX = e.clientX, clientY = e.clientY;
        var element = document.elementFromPoint(clientX, clientY);
        var collectionId = html_1.locate(element, "dhx_widget_id");
        if (!collectionId) {
            if (this._canMove) {
                this._cancelCanDrop();
            }
            return;
        }
        var target = CollectionStore_1.collectionStore.getItem(collectionId);
        var id = html_1.locate(element, "dhx_id");
        if (!id) {
            this._cancelCanDrop();
            this._lastCollectionId = collectionId;
            this._lastId = null;
            this._canDrop();
            return;
        }
        if (target.config.dropBehaviour === types_1.DropBehaviour.complex) {
            var pos = getPosition(e);
            if (pos <= 0.25) {
                this._transferData.dropPosition = types_1.DropPosition.top;
            }
            else if (pos >= 0.75) {
                this._transferData.dropPosition = types_1.DropPosition.bot;
            }
            else {
                this._transferData.dropPosition = types_1.DropPosition.in;
            }
        }
        else if (this._lastId === id && this._lastCollectionId === collectionId) {
            return;
        }
        var from = {
            id: this._transferData.id,
            target: this._transferData.target
        };
        if (target.config.dragMode === "source") {
            return;
        }
        from.target.events.fire(types_1.DragEvents.dragOut, [id, target]);
        if (collectionId !== this._transferData.targetId || !helpers_1.isTreeCollection(from.target.data) ||
            (helpers_1.isTreeCollection(from.target.data) && from.target.data.canCopy(from.id, id))) {
            this._cancelCanDrop(); // clear last
            this._lastId = id;
            this._lastCollectionId = collectionId;
            var canMove = from.target.events.fire(types_1.DragEvents.dragIn, [id, this._transferData.dropPosition, CollectionStore_1.collectionStore.getItem(collectionId)]);
            if (canMove) {
                this._canDrop();
            }
        }
        else {
            this._cancelCanDrop();
        }
    };
    DragManager.prototype._move = function (from, to) {
        var fromData = from.target.data;
        var toData = to.target.data;
        var index = 0;
        var targetId = to.id;
        var behaviour = helpers_1.isTreeCollection(toData) ? to.target.config.dropBehaviour : undefined;
        switch (behaviour) {
            case types_1.DropBehaviour.child:
                break;
            case types_1.DropBehaviour.sibling:
                targetId = toData.getParent(targetId);
                index = toData.getIndex(to.id) + 1;
                break;
            case types_1.DropBehaviour.complex:
                var dropPosition = this._transferData.dropPosition;
                if (dropPosition === types_1.DropPosition.top) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id);
                }
                else if (dropPosition === types_1.DropPosition.bot) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id) + 1;
                }
                break;
            default:
                // list move
                if (!to.id) {
                    index = -1;
                }
                else if (from.target === to.target && toData.getIndex(from.id) < toData.getIndex(to.id)) {
                    index = toData.getIndex(to.id) - 1;
                }
                else {
                    index = toData.getIndex(to.id);
                }
        }
        if (this._transferData.dragConfig.dragCopy) {
            if (this._selectedIds instanceof Array && this._selectedIds.length > 1) {
                this._selectedIds.map(function (selctedId) {
                    fromData.copy(selctedId, index, toData, targetId);
                    if (index > -1) {
                        index++;
                    }
                });
            }
            else {
                fromData.copy(from.id, index, toData, targetId);
            }
        }
        else {
            if (this._selectedIds instanceof Array && this._selectedIds.length > 1) {
                this._selectedIds.map(function (selctedId) {
                    fromData.move(selctedId, index, toData, targetId);
                    if (index > -1) {
                        index++;
                    }
                });
            }
            else {
                fromData.move(from.id, index, toData, targetId); // typescript bug??
            }
        }
    };
    DragManager.prototype._endDrop = function () {
        this._toggleTextSelection(false);
        if (this._transferData.target) {
            this._transferData.target.events.fire(types_1.DragEvents.dragEnd, [this._transferData.id, this._selectedIds]);
        }
        this._cancelCanDrop();
        this._canMove = true;
        this._transferData = {};
        this._lastId = null;
        this._lastCollectionId = null;
    };
    DragManager.prototype._cancelCanDrop = function () {
        this._canMove = false;
        var collection = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (collection && this._lastId) {
            collection.events.fire(types_1.DragEvents.cancelDrop, [this._lastId]);
        }
        this._lastCollectionId = null;
        this._lastId = null;
    };
    DragManager.prototype._canDrop = function () {
        this._canMove = true;
        var target = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (target && this._lastId) {
            target.events.fire(types_1.DragEvents.canDrop, [this._lastId, this._transferData.dropPosition]);
        }
    };
    DragManager.prototype._toggleTextSelection = function (add) {
        if (add) {
            document.body.classList.add("dhx_no-select");
        }
        else {
            document.body.classList.remove("dhx_no-select");
        }
    };
    return DragManager;
}());
var dhx = window.dhxHelpers = window.dhxHelpers || {};
dhx.dragManager = dhx.dragManager || new DragManager();
exports.dragManager = dhx.dragManager;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollectionStore = /** @class */ (function () {
    function CollectionStore() {
        this._store = {};
    }
    CollectionStore.prototype.setItem = function (id, target) {
        this._store[id] = target;
    };
    CollectionStore.prototype.getItem = function (id) {
        if (!this._store[id]) {
            return null;
        }
        return this._store[id];
    };
    return CollectionStore;
}());
var dhx = window.dhxHelpers = window.dhxHelpers || {};
dhx.collectionStore = dhx.collectionStore || new CollectionStore();
exports.collectionStore = dhx.collectionStore;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(5);
var types_1 = __webpack_require__(57);
var types_2 = __webpack_require__(8);
var Selection = /** @class */ (function () {
    function Selection(_config, data, events) {
        var _this = this;
        this.events = events || (new events_1.EventSystem(this));
        this._data = data;
        this._data.events.on(types_2.DataEvents.removeAll, function () {
            _this._selected = null;
        });
        this._data.events.on(types_2.DataEvents.change, function () {
            if (_this._selected) {
                var near = _this._data.getNearId(_this._selected);
                if (near !== _this._selected) {
                    _this._selected = null;
                    if (near) {
                        _this.add(near);
                    }
                }
            }
        });
    }
    Selection.prototype.getId = function () {
        return this._selected;
    };
    Selection.prototype.getItem = function () {
        if (this._selected) {
            return this._data.getItem(this._selected);
        }
        return null;
    };
    Selection.prototype.remove = function (id) {
        id = id || this._selected;
        if (!id) {
            return true;
        }
        if (this.events.fire(types_1.SelectionEvents.beforeUnSelect, [id])) {
            this._data.update(id, { $selected: false });
            this._selected = null;
            this.events.fire(types_1.SelectionEvents.afterUnSelect, [id]);
            return true;
        }
        return false;
    };
    Selection.prototype.add = function (id) {
        if (this._selected === id) {
            return;
        }
        this.remove();
        if (this.events.fire(types_1.SelectionEvents.beforeSelect, [id])) {
            this._selected = id;
            this._data.update(id, { $selected: true });
            this.events.fire(types_1.SelectionEvents.afterSelect, [id]);
        }
    };
    return Selection;
}());
exports.Selection = Selection;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SelectionEvents;
(function (SelectionEvents) {
    SelectionEvents["beforeUnSelect"] = "beforeunselect";
    SelectionEvents["afterUnSelect"] = "afterunselect";
    SelectionEvents["beforeSelect"] = "beforeselect";
    SelectionEvents["afterSelect"] = "afterselect";
})(SelectionEvents = exports.SelectionEvents || (exports.SelectionEvents = {}));


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(59));
__export(__webpack_require__(83));
__export(__webpack_require__(34));


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts_grid_1 = __webpack_require__(24);
var core_1 = __webpack_require__(0);
var TreeGridCollection_1 = __webpack_require__(34);
var TreeGrid = /** @class */ (function (_super) {
    __extends(TreeGrid, _super);
    function TreeGrid(container, config) {
        var _this = _super.call(this, container, config) || this;
        // [dirty]
        _this.config.type = "tree";
        return _this;
    }
    TreeGrid.prototype.scrollTo = function (row, col) {
        var colInd = core_1.findIndex(this.config.columns, function (obj) { return obj.id === col; });
        var fixedColsWidth = this.config.splitAt ?
            this.config.columns.slice(0, this.config.splitAt).reduce(function (total, c) { return total += c.width; }, 0)
            : 0;
        var x = this.config.columns.slice(0, colInd).reduce(function (total, c) { return total += c.width; }, 0) - fixedColsWidth;
        var y = this.data.getPlainIndex(row) * this.config.rowHeight;
        var scrollState = this.getScrollState();
        var gridRight = this.config.width + scrollState.x;
        var gridBottom = this.config.height + scrollState.y - (this.config.headerRowHeight * this.config.$headerLevel);
        var cellTop = y - scrollState.y - this.config.rowHeight;
        var cellLeft = x - scrollState.x - this.config.columns[colInd].width;
        var cellBottom = y + (this.config.rowHeight * 2) + 17 - gridBottom;
        var cellRight = x + (this.config.columns[colInd].width * 2) + 17 - gridRight;
        var scrollTop = (cellTop > 0 && cellBottom < 0) ? 0 : cellTop < 0 ? cellTop : cellBottom;
        var scrollLeft = (cellLeft > 0 && cellRight < 0) ? 0 : cellLeft < 0 ? cellLeft : cellRight;
        this.scroll(scrollLeft + scrollState.x, scrollTop + scrollState.y);
    };
    TreeGrid.prototype._createCollection = function (prep) {
        this.data = new TreeGridCollection_1.TreeGridCollection({
            prep: prep
        }, this.events);
    };
    TreeGrid.prototype._checkColumns = function () {
        _super.prototype._checkColumns.call(this);
        this._getTreeHeadersWidth();
    };
    TreeGrid.prototype._getRowIndex = function (rowId) {
        return core_1.findIndex(this.data.serialize(), function (obj) { return obj.id === rowId; });
    };
    TreeGrid.prototype._parseColumns = function () {
        _super.prototype._parseColumns.call(this);
        if (this.config.columns.length) {
            this._getTreeHeadersWidth();
        }
    };
    TreeGrid.prototype._setEventHandlers = function () {
        var _this = this;
        _super.prototype._setEventHandlers.call(this);
        this.events.on(ts_grid_1.GridEvents.expand, function (id) {
            var item = _this.data.getItem(id);
            _this.data.update(id, { $opened: !item.$opened });
        });
        this.events.detach(ts_grid_1.GridEvents.headerInput, this);
        this.events.on(ts_grid_1.GridEvents.headerInput, function (val, colId, filter) {
            _this.data.filter();
            if (val) {
                _this.data.filter({
                    by: colId,
                    match: val,
                    compare: _this.content[filter].match
                });
            }
        });
    };
    TreeGrid.prototype._getTreeHeadersWidth = function () {
        var maxLevel = this.data.getMaxLevel();
        var firstCol = this.config.columns[0];
        var DEFAULT_PADDING = 10;
        var ICON_WIDTH = 35;
        var paddings = maxLevel * (DEFAULT_PADDING + ICON_WIDTH);
        var firstColWidth = 0;
        this.data.map(function (el) {
            firstColWidth = Math.max(ts_grid_1.getStrWidth(ts_grid_1.removeHTMLTags("" + el[firstCol.id])), firstColWidth);
        });
        var newWidth = Math.max(firstColWidth + paddings, firstCol.width);
        this.config.$totalWidth = this.config.$totalWidth - firstCol.width + newWidth;
        this.config.columns[0].width = newWidth;
    };
    return TreeGrid;
}(ts_grid_1.Grid));
exports.TreeGrid = TreeGrid;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var html_1 = __webpack_require__(2);
var view_1 = __webpack_require__(4);
var ts_data_1 = __webpack_require__(7);
var Exporter_1 = __webpack_require__(61);
var data_1 = __webpack_require__(14);
var main_1 = __webpack_require__(10);
var Selection_1 = __webpack_require__(62);
var types_1 = __webpack_require__(3);
var render_1 = __webpack_require__(63);
var core_1 = __webpack_require__(0);
var content_1 = __webpack_require__(33);
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(container, config) {
        var _this = _super.call(this, container, config) || this;
        _this.config = core_1.extend({
            rowHeight: 40,
            headerRowHeight: 40,
            footerRowHeight: 40,
            headerSort: true,
            columns: [],
            data: []
        }, config);
        _this.content = content_1.content;
        _this._scroll = {
            top: 0,
            left: 0
        };
        var htmlEvents = {
            onclick: html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
                "dhx_grid-header-cell": function (_ev, item) {
                    if (_this.config.headerSort) {
                        _this.events.fire(types_1.GridEvents.sort, [item]);
                    }
                },
                "dhx_grid-expand-cell": function (_ev, item) { return _this.events.fire(types_1.GridEvents.expand, [item]); }
            }),
            onscroll: function (e) {
                _this.events.fire(types_1.GridEvents.scroll, [{
                        y: e.target.scrollTop,
                        x: e.target.scrollLeft
                    }]);
            }
        };
        _this._init();
        if (_this.config.columns) {
            _this._parseColumns();
        }
        if ((_this.config.data && _this.config.data instanceof Array && _this.config.data.length) && _this.config.columns) {
            _this.data.parse(_this.config.data);
        }
        if (_this.config.selection) {
            _this.selection = new Selection_1.Selection(_this);
        }
        var view = dom_1.create({
            render: function (vm, obj) {
                return render_1.render(vm, obj, _this._currentData, htmlEvents, _this.selection);
            }
        }, _this);
        _this.mount(container, view);
        if (config.autoEmptyRow && _this.data.getLength() === 0) {
            _this.data.add(_this.config.columns.reduce(function (total, col) {
                total[col.id] = "";
                return total;
            }, {}));
            _this.paint();
        }
        return _this;
    }
    Grid.prototype.destructor = function () {
        this.unmount();
        this.events.events = {};
        this.events.context = null;
        this._currentData = this.data = this.config =
            this._scroll = this.content = null;
    };
    Grid.prototype.setColumns = function (columns) {
        this.config.columns = columns;
        this._parseColumns();
    };
    Grid.prototype.addRowCss = function (id, css) {
        var item = this.data.getItem(id);
        var styles = item.$css || "";
        if (!styles.match(new RegExp(css, "g"))) {
            item.$css = styles + (" " + css);
            // [todo]
            var index = core_1.findIndex(this._currentData, function (row) { return row.id === item.id; });
            if (index >= 0) {
                this._currentData[index].$css = item.$css;
            }
            this.paint();
        }
    };
    Grid.prototype.removeRowCss = function (id, css) {
        var item = this.data.getItem(id);
        var styles = item.$css ? item.$css.replace(css, "") : "";
        item.$css = styles;
    };
    Grid.prototype.addCellCss = function (row, col, css) {
        var column = this._getColumn(col);
        if (column) {
            if (column.$cellCss[row]) {
                column.$cellCss[row] += column.$cellCss[row].match(new RegExp(css, "g")) ? "" : " " + css;
            }
            else if (this.data.getItem(row)) {
                column.$cellCss[row] = css + " ";
            }
            this.paint();
        }
    };
    Grid.prototype.removeCellCss = function (row, col, css) {
        var column = this._getColumn(col);
        if (column) {
            if (column.$cellCss[row]) {
                column.$cellCss[row] = column.$cellCss[row].replace(css, "");
                this.paint();
            }
            else if (this.data.getItem(row)) {
                column.$cellCss[row] = "";
            }
        }
    };
    Grid.prototype.getScrollState = function () {
        return {
            x: this._scroll && this._scroll.left,
            y: this._scroll && this._scroll.top
        };
    };
    Grid.prototype.scroll = function (x, y) {
        var gridBody = this.getRootView().refs && this.getRootView().refs.grid_body.el;
        if (gridBody) {
            gridBody.scrollLeft = typeof x === "number" ? x : gridBody.scrollLeft;
            gridBody.scrollTop = typeof y === "number" ? y : gridBody.scrollTop;
        }
    };
    Grid.prototype.scrollTo = function (row, col) {
        var colInd = core_1.findIndex(this.config.columns, function (obj) { return obj.id === col; });
        var fixedColsWidth = this.config.splitAt ?
            this.config.columns.slice(0, this.config.splitAt).reduce(function (total, c) { return total += c.width; }, 0)
            : 0;
        var x = this.config.columns.slice(0, colInd).reduce(function (total, c) { return total += c.width; }, 0) - fixedColsWidth;
        var y = this.data.getIndex(row) * this.config.rowHeight;
        var scrollState = this.getScrollState();
        var gridRight = this.config.width + scrollState.x;
        var gridBottom = this.config.height + scrollState.y - (this.config.headerRowHeight * this.config.$headerLevel);
        var cellTop = y - scrollState.y - this.config.rowHeight;
        var cellLeft = x - scrollState.x - this.config.columns[colInd].width;
        var cellBottom = y + (this.config.rowHeight * 2) + 17 - gridBottom;
        var cellRight = x + (this.config.columns[colInd].width * 2) + 17 - gridRight;
        var scrollTop = (cellTop > 0 && cellBottom < 0) ? 0 : cellTop < 0 ? cellTop : cellBottom;
        var scrollLeft = (cellLeft > 0 && cellRight < 0) ? 0 : cellLeft < 0 ? cellLeft : cellRight;
        this.scroll(scrollLeft + scrollState.x, scrollTop + scrollState.y);
    };
    Grid.prototype.adjustColumnWidth = function (id) {
        var index = core_1.findIndex(this.config.columns, function (с) { return с.id === id; });
        var col = this.config.columns[index];
        this.data.map(function (row) {
            if (typeof row[col.id] === "string" || typeof row[col.id] === "number") {
                col.maxWidth = col.maxWidth || col.width;
                col.maxWidth = Math.max(main_1.getStrWidth(main_1.removeHTMLTags(row[col.id])) + 20, col.maxWidth);
            }
        });
        this.config.$totalWidth = this.config.columns.reduce(function (t, column) {
            column.width = column.maxWidth || column.width;
            return t += column.width;
        }, 0);
        this.paint();
    };
    Grid.prototype.getCellRect = function (row, col) {
        var colInd = core_1.findIndex(this.config.columns, function (obj) { return obj.id === col; });
        var rowInd = this._getRowIndex(row);
        var x = this.config.columns.slice(0, colInd).reduce(function (total, c) { return total += c.width; }, 0);
        var y = rowInd * this.config.rowHeight;
        return { x: x, y: y, height: this.config.rowHeight, width: this.config.columns[colInd].width };
    };
    Grid.prototype.getColumn = function (colId) {
        var ind = core_1.findIndex(this.config.columns, function (col) { return col.id === colId; });
        if (ind >= 0) {
            return this.config.columns[ind];
        }
    };
    Grid.prototype.addSpan = function (spanObj) {
        this.config.spans = this.config.spans || [];
        var index = core_1.findIndex(this.config.spans, function (span) {
            return "" + span.row === "" + spanObj.row && "" + span.column === "" + spanObj.column;
        });
        if (index >= 0) {
            this.config.spans[index] = spanObj;
            return;
        }
        this.config.spans.push(spanObj);
        this.paint();
    };
    Grid.prototype.getSpan = function (row, col) {
        if (this.config.spans) {
            var index = core_1.findIndex(this.config.spans, function (span) {
                return "" + span.row === "" + row && "" + span.column === "" + col;
            });
            return this.config.spans[index];
        }
    };
    Grid.prototype.removeSpan = function (row, col) {
        if (this.config.spans) {
            var index = core_1.findIndex(this.config.spans, function (span) {
                return "" + span.row === "" + row && "" + span.column === "" + col;
            });
            this.config.spans.splice(index, 1);
        }
        this.paint();
    };
    Grid.prototype.edit = function (rowId, colId, editorType) {
        if (editorType === void 0) { editorType = types_1.EditorType.input; }
        var row = this.data.getItem(rowId);
        var col = this.getColumn(colId);
        if (!row || row[colId] === undefined) {
            return;
        }
        if (!this.events.fire(types_1.GridEvents.beforeEditStart, [row, col, editorType])) {
            return;
        }
        if (col.type === "date") {
            editorType = types_1.EditorType.datepicker;
        }
        this.config.$editable = {
            row: rowId,
            col: colId,
            editorType: editorType
        };
        this.paint();
        this.events.fire(types_1.GridEvents.afterEditStart, [row, col, editorType]);
    };
    Grid.prototype._parseColumns = function () {
        var columns = this.config.columns;
        data_1.normalizeColumns(columns);
        data_1.countColumns(this.config, columns);
    };
    Grid.prototype._parseData = function () {
        var firstItem = this.data.getId(0);
        if (firstItem) {
            if (this.config.columns.length) {
                this._checkColumns();
            }
            this._currentData = this.data.serialize() || [];
        }
        this._checkFilters();
        this._checkMarks();
        this._render();
    };
    Grid.prototype._checkColumns = function () {
        this._detectColsTypes();
    };
    Grid.prototype._createCollection = function (prep) {
        this.data = new ts_data_1.DataCollection({
            prep: prep
        }, this.events);
    };
    Grid.prototype._getRowIndex = function (rowId) {
        return this.data.getIndex(rowId);
    };
    Grid.prototype._setEventHandlers = function () {
        var _this = this;
        this.data.events.on(ts_data_1.DataEvents.load, function () {
            _this._parseData();
            // [todo] need to check autoWidth after data load
            _this.data.events.fire(ts_data_1.DataEvents.change);
        });
        this.data.events.on(ts_data_1.DataEvents.change, function (_id, status, obj) {
            // [dirty]
            if (status === "remove" && obj.$empty) {
                return;
            }
            _this._currentData = _this.data.map(function (el) { return el; }) || [];
            _this._detectColsTypes();
            _this._checkMarks();
            // set auto width to all columns
            if (_this.config.columnsAutoWidth) {
                if (typeof _this.config.columnsAutoWidth === "number") {
                    _this._setAutoWidth(_this.config.columnsAutoWidth);
                }
                else {
                    _this._setAutoWidth();
                }
            }
            if (_this.config.autoEmptyRow) {
                var emptyRow = _this.data.find({ by: "$empty", match: true });
                if (emptyRow && !(status === "add" && obj.$empty)) {
                    _this.data.remove(emptyRow.id);
                }
                if (!(status === "add" && obj.$empty)) {
                    _this._addEmptyRow();
                }
            }
            _this._render();
        });
        this.data.events.on(ts_data_1.DataEvents.removeAll, function () {
            _this.config.columns.map(function (col) {
                col.header.map(function (cell) {
                    if (cell.content && cell.content === "selectFilter") {
                        col.$uniqueData = [];
                    }
                });
            });
        });
        this.events.on(types_1.GridEvents.sort, function (id) {
            if (id) {
                _this._sort(id);
            }
        });
        this.events.on(types_1.GridEvents.headerInput, function (val, colId, filter) {
            // [dirty]
            if (_this.config.autoEmptyRow) {
                var emptyRow = _this.data.find({ by: "$empty", match: true });
                if (emptyRow) {
                    _this.data.remove(emptyRow.id);
                }
            }
            _this.data.filter({
                by: colId,
                match: val,
                compare: _this.content[filter].match
            }, {
                multiple: true
            });
        });
        this.events.on(types_1.GridEvents.scroll, function (scrollState) {
            _this._scroll = { top: scrollState.y, left: scrollState.x };
            _this.paint();
        });
        this.events.on(types_1.GridEvents.cellDblClick, function (row, col) {
            if (col.editing !== false && _this.config.editing || col.editing) {
                _this.edit(row.id, col.id, col.editorType);
            }
        });
        this.events.on(types_1.GridEvents.afterEditEnd, function (value) {
            var _a;
            var item = _this.data.getItem(_this.config.$editable.row);
            // if item was an empty row
            delete item.$empty;
            if (value !== undefined && value !== null && value !== "") {
                _this.data.update(_this.config.$editable.row, __assign({}, item, (_a = {}, _a[_this.config.$editable.col] = value, _a)));
            }
            _this.config.$editable = null;
            _this._checkFilters();
            _this.paint();
        });
    };
    Grid.prototype._addEmptyRow = function () {
        var id = this.data.getId(this.data.getLength() - 1);
        var lastRow = this.data.getItem(id);
        var isEmpty = main_1.isRowEmpty(lastRow);
        if (!isEmpty) {
            this.data.add(this.config.columns.reduce(function (total, col) {
                total[col.id] = "";
                return total;
            }, { $empty: true }));
        }
    };
    Grid.prototype._sort = function (by, dir) {
        var _this = this;
        if (!dir) {
            if (this._sortBy === by) {
                this._sortDir = this._sortDir === "asc" ? "desc" : "asc";
            }
            else {
                this._sortDir = "desc";
            }
        }
        else {
            this._sortDir = dir;
        }
        this._sortBy = by;
        this.data.sort({
            by: by,
            dir: this._sortDir,
            as: function (el) {
                if (el && _this.getColumn(by).type === "date") {
                    return "" + new Date(el).getTime();
                }
                return el ? "" + el : "";
            }
        });
    };
    Grid.prototype._getColumn = function (id) {
        for (var _i = 0, _a = this.config.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.id === id) {
                return col;
            }
        }
    };
    Grid.prototype._init = function () {
        this.events = new events_1.EventSystem(this);
        this._attachDataCollection();
        this.export = new Exporter_1.Exporter(this);
        this._setEventHandlers();
    };
    Grid.prototype._attachDataCollection = function () {
        var _this = this;
        var prep = function (data) {
            if (data.spans) {
                _this.config.spans = data.spans;
                data = data.data;
            }
            return data;
        };
        if (this.config.data instanceof ts_data_1.DataCollection) {
            this.data = this.config.data;
            this.config.data = [];
            this._parseData();
            return;
        }
        this._createCollection(prep);
    };
    Grid.prototype._setMarks = function (col, func) {
        var colCells = this.data.map(function (row) { return ({ id: row.id, data: row[col.id], row: row }); });
        var colCellsData = this.data.map(function (row) { return row[col.id]; });
        var _loop_1 = function (cell) {
            var css = func(cell.data, colCellsData, cell.row, col);
            if (css) {
                col.$cellCss = col.$cellCss || {};
                var cellCss_1 = (col.$cellCss[cell.id] || "").split(" ");
                css.split(" ").map(function (item) {
                    if (cellCss_1.indexOf(item) === -1) {
                        cellCss_1.push(item);
                    }
                });
                col.$cellCss[cell.id] = cellCss_1.join(" ");
            }
        };
        for (var _i = 0, colCells_1 = colCells; _i < colCells_1.length; _i++) {
            var cell = colCells_1[_i];
            _loop_1(cell);
        }
    };
    Grid.prototype._checkMarks = function () {
        var _this = this;
        this.config.columns.map(function (col) {
            var mark = col.mark;
            if (mark) {
                if (typeof mark === "function") {
                    _this._setMarks(col, mark);
                }
                else {
                    _this._setMarks(col, function (el, c) {
                        var data = c.filter(function (item) { return item !== null && item !== undefined && item !== ""; });
                        var min = Math.min.apply(Math, data);
                        var max = Math.max.apply(Math, data);
                        if (mark.max && max === parseFloat(el)) {
                            return mark.max;
                        }
                        if (mark.min && min === parseFloat(el)) {
                            return mark.min;
                        }
                        return false;
                    });
                }
            }
        });
    };
    // [todo] use adjustColumnWidth
    Grid.prototype._setAutoWidth = function (colsCount) {
        var _this = this;
        this.data.map(function (row) {
            _this.config.columns.map(function (col, i) {
                if (colsCount && colsCount <= i) {
                    return col;
                }
                if (typeof row[col.id] === "string" || typeof row[col.id] === "number") {
                    col.maxWidth = col.maxWidth || col.width;
                    var paddings = 20;
                    // [todo] move to treegrid
                    if (_this.config.type === "tree" && i === 0) {
                        paddings = _this.data.getMaxLevel() * 24 + 20;
                    }
                    col.maxWidth = Math.max(main_1.getStrWidth(main_1.removeHTMLTags(row[col.id])) + paddings, col.maxWidth);
                }
            });
        });
        this.config.$totalWidth = this.config.columns.reduce(function (t, col) {
            col.width = col.maxWidth || col.width;
            return t += col.width;
        }, 0);
    };
    // [todo] make more smart type detection
    Grid.prototype._detectColsTypes = function () {
        var firstRow = this.data.getItem(this.data.getId(0));
        if (!firstRow) {
            return;
        }
        this.config.columns.map(function (col) {
            if (col.type) {
                return col;
            }
            var firstCell = firstRow ? firstRow[col.id] : "";
            var v = parseFloat(firstCell);
            var val = isNaN(v) ? firstCell : v;
            col.type = typeof val;
            return col;
        });
    };
    Grid.prototype._checkFilters = function () {
        var data = this._currentData;
        this.config.columns.map(function (col) {
            col.header.map(function (cell) {
                if (cell.content && cell.content === "selectFilter") {
                    var unique = data_1.getUnique(data, col.id);
                    if (col.$uniqueData && col.$uniqueData.length > unique.length) {
                        unique.forEach(function (item) {
                            if (col.$uniqueData.indexOf(item) === -1) {
                                col.$uniqueData.push(item);
                            }
                        });
                    }
                    else {
                        col.$uniqueData = unique;
                    }
                }
            });
        });
    };
    Grid.prototype._render = function () {
        this.paint();
    };
    return Grid;
}(view_1.View));
exports.Grid = Grid;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var main_1 = __webpack_require__(10);
var ts_data_1 = __webpack_require__(7);
var core_1 = __webpack_require__(0);
function fillArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = value;
    }
    return arr;
}
var Exporter = /** @class */ (function () {
    function Exporter(_view) {
        this._view = _view;
    }
    Exporter.prototype.xlsx = function (config) {
        return this._export(config);
    };
    Exporter.prototype.csv = function (config) {
        if (config === void 0) { config = {}; }
        config = __assign({ asFile: true, rowDelimiter: "\n", columnDelimiter: ",", skipHeader: 0 }, config);
        var csv;
        if ("getRoot" in this._view.data && config.flat) {
            csv = this.getFlatCSV(config);
        }
        else {
            csv = this._getCSV(config);
        }
        var name = config.name || "grid_export";
        if (config.asFile) {
            core_1.downloadFile(csv, name + ".csv", "text/csv");
        }
        return csv;
    };
    Exporter.prototype._export = function (config) {
        if (config === void 0) { config = {}; }
        var configCols = this._view.config.columns;
        var rowsIndexMap = {};
        var headers = main_1.transpose(this._view.config.columns.map(function (col) {
            return col.header.map(function (level) { return level.text || " "; });
        }));
        var columns = [];
        var uniqStyles = {
            default: {
                color: "#000000",
                background: "#FFFFFF",
                fontSize: 14
            }
        };
        var cells = [];
        var columnsIndexMap = {};
        var data = this._view.data.serialize().map(function (row, i) {
            rowsIndexMap[row.id] = i;
            var rowData = configCols.map(function (col, k) {
                columnsIndexMap[col.id] = k;
                return main_1.removeHTMLTags(row[col.id]);
            });
            return rowData;
        });
        for (var _i = 0, configCols_1 = configCols; _i < configCols_1.length; _i++) {
            var col = configCols_1[_i];
            columns.push({ width: col.width });
            for (var key in col.$cellCss) {
                var colStyle = col.$cellCss[key];
                var colStyleHash = colStyle
                    .split("")
                    .reduce(function (h, letter) {
                    // tslint:disable-next-line:no-bitwise
                    var hh = ((h << 5) - h) + letter.charCodeAt(0);
                    return Math.abs(hh & hh);
                }, 0).toString();
                if (!uniqStyles[colStyleHash]) {
                    var cont = document.body;
                    var css = main_1.getStyleByClass(colStyle, cont, "dhx_grid-row", uniqStyles.default);
                    if (css) {
                        uniqStyles[colStyleHash] = css;
                    }
                }
                if (uniqStyles[colStyleHash]) {
                    cells.push([rowsIndexMap[key], col.id, colStyleHash]);
                }
            }
        }
        var exportData = {
            name: (config.name || "data"),
            columns: columns,
            header: headers,
            data: data,
            styles: {
                cells: cells,
                css: uniqStyles
            }
        };
        if (config.url) {
            var form_1 = document.createElement("form");
            form_1.setAttribute("target", "_blank");
            form_1.setAttribute("action", config.url);
            form_1.setAttribute("method", "POST");
            form_1.style.visibility = "hidden";
            var input = document.createElement("textarea");
            input.setAttribute("name", "data");
            input.value = JSON.stringify(exportData);
            form_1.appendChild(input);
            document.body.appendChild(form_1);
            form_1.submit();
            setTimeout(function () {
                form_1.parentNode.removeChild(form_1);
            }, 100);
        }
        return exportData;
    };
    Exporter.prototype.getFlatCSV = function (config) {
        var treeData = this._view.data;
        var root = treeData.getRoot();
        var firstCol = this._view.config.columns[0];
        var maxLevel = treeData.getMaxLevel();
        var getParentsChain = function (item, data) {
            var parents = [];
            for (var i = 0; i <= maxLevel; i++) {
                if (item && item[firstCol.id]) {
                    parents[item.$level] = item[firstCol.id];
                    var parent_1 = data.getParent(item.id, true);
                    if (parent_1 && parent_1.id) {
                        item = parent_1;
                    }
                    else {
                        item = null;
                    }
                }
                else {
                    parents[i] = "";
                }
            }
            return parents;
        };
        var total = "";
        treeData.eachChild(root, function (item) {
            var parents = getParentsChain(item, treeData).join(config.columnDelimiter);
            total += parents + Object.keys(item).reduce(function (values, key, i) {
                if (key !== "id" && key !== "parent" && key[0] !== "$" && i !== 0) {
                    return values + config.columnDelimiter + (item[key] === null ? "" : item[key]);
                }
                return values;
            }, "");
            total += config.rowDelimiter;
        });
        var exportData = this._export(config);
        // [dirty]
        var emptyHeaders = fillArray(new Array(maxLevel + 1), "");
        var headers = exportData.header.map(function (header) {
            header.splice.apply(header, [0, 1].concat(emptyHeaders));
            return header;
        });
        var head = new ts_data_1.CsvDriver(config).serialize(headers, true) + config.rowDelimiter;
        return head + total;
    };
    Exporter.prototype._getCSV = function (config) {
        var exportData = this._export(config);
        var headers = exportData.header;
        var driver = new ts_data_1.CsvDriver(config);
        var head = driver.serialize(headers, true);
        var readyData = driver.serialize(exportData.data, true);
        return head + readyData;
    };
    return Exporter;
}());
exports.Exporter = Exporter;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
var ts_data_1 = __webpack_require__(7);
var Selection = /** @class */ (function () {
    function Selection(grid) {
        this._grid = grid;
        var types = ["cell", "row", "complex"];
        this._type = types.indexOf(this._grid.config.selection) !== -1 ? this._grid.config.selection : "complex";
        this._init();
    }
    Selection.prototype.setCell = function (row, col) {
        row = row.id ? row : this._grid.data.getItem(row);
        if (!col) {
            col = this._grid.config.columns[0];
        }
        col = col.id ? col : this._grid.getColumn(col);
        this._selectedCell = { row: row, column: col };
        this._grid.paint();
    };
    Selection.prototype.getCell = function () {
        return this._selectedCell;
    };
    Selection.prototype.toHTML = function () {
        if (!this._selectedCell.row || !this._selectedCell.column) {
            return;
        }
        var fixedCols = this._grid.config.splitAt ?
            this._grid.config.columns.slice(0, this._grid.config.splitAt) : [];
        var fixedColsIds = fixedCols.map(function (col) { return col.id; });
        var fixedCell;
        var cellRect = this._grid.getCellRect(this._selectedCell.row.id, this._selectedCell.column.id);
        if (fixedColsIds.indexOf(this._selectedCell.column.id) !== -1) {
            var scrollState = this._grid.getScrollState();
            fixedCell = dom_1.el(".dhx_grid-selected-cell", {
                style: {
                    width: cellRect.width,
                    height: cellRect.height,
                    top: cellRect.y,
                    left: cellRect.x + scrollState.x,
                    position: "absolute",
                    zIndex: 10
                }
            });
        }
        var totalWidth = this._grid.config.$totalWidth;
        return dom_1.el(".dhx_grid-selection", {}, [
            (this._type === "row" || this._type === "complex") && dom_1.el(".dhx_grid-selected-row", {
                style: {
                    width: totalWidth,
                    height: cellRect.height,
                    top: cellRect.y,
                    left: 0,
                    position: "absolute"
                }
            }),
            (this._type === "cell" || this._type === "complex") && dom_1.el(".dhx_grid-selected-cell", {
                style: {
                    width: cellRect.width,
                    height: cellRect.height,
                    top: cellRect.y,
                    left: cellRect.x,
                    position: "absolute"
                }
            }),
            (this._type === "cell" || this._type === "complex") && fixedCell
        ]);
    };
    Selection.prototype._init = function () {
        var _this = this;
        this._selectedCell = {
            row: this._grid.data.getItem(this._grid.data.getId(0)),
            column: this._grid.config.columns[0]
        };
        this._grid.events.on(types_1.GridEvents.cellClick, function (row, col) {
            _this.setCell(row, col);
        });
        this._grid.data.events.on(ts_data_1.DataEvents.beforeRemove, function (item) {
            if (item) {
                var index = _this._grid.data.getIndex(String(_this._selectedCell.row.id));
                var id = _this._grid.data.getId(index + 1);
                if (id) {
                    _this.setCell(id);
                }
                else {
                    var newId = _this._grid.data.getId(index - 1);
                    _this.setCell(newId);
                }
                _this._grid.paint();
            }
        });
    };
    return Selection;
}());
exports.Selection = Selection;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var html_1 = __webpack_require__(2);
var data_1 = __webpack_require__(14);
var main_1 = __webpack_require__(10);
var Cells_1 = __webpack_require__(25);
var FixedCols_1 = __webpack_require__(82);
var FixedRows_1 = __webpack_require__(32);
var BORDERS = 2;
function getRenderConfig(obj, data, wrapperSizes) {
    var config = obj.config;
    var positions = data_1.calculatePositions(wrapperSizes.width, wrapperSizes.height, obj._scroll, config);
    return __assign({}, config, { data: data, scroll: obj._scroll, $positions: positions, headerHeight: config.$headerLevel * config.headerRowHeight, footerHeight: config.$footerLevel * config.footerRowHeight, firstColId: config.columns[0].id, events: obj.events, currentColumns: config.columns.slice(positions.xStart, positions.xEnd), sortBy: obj._sortBy, sortDir: obj._sortDir });
}
function getElementSizes(element) {
    if (!element) {
        return {
            width: 1,
            height: 1
        };
    }
    var styles = element.currentStyle || window.getComputedStyle(element);
    var paddingsByWidth = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight) || 0;
    var paddingsByHeight = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) || 0;
    return {
        width: element.clientWidth - paddingsByWidth,
        height: element.clientHeight - paddingsByHeight
    };
}
function render(vm, obj, data, htmlEvents, selection) {
    if (!obj._container) {
        obj.config.width = 1;
        obj.config.height = 1;
    }
    // if grid placed inside another component, it will fit to its container
    if (vm && vm.node && vm.node.parent && vm.node.parent.el) {
        var parentNode = vm.node.parent.el;
        var parentSizes = getElementSizes(parentNode);
        obj.config.width = parentSizes.width;
        obj.config.height = parentSizes.height;
    }
    var config = obj.config;
    if (!config.columns.length) {
        return dom_1.el(".dhx_grid");
    }
    if (!data || !obj.data) {
        data = [];
    }
    config.$totalHeight = data.length * config.rowHeight;
    var sizes = getElementSizes(obj._container);
    var wrapperSizes = {
        width: config.width ? config.width : sizes.width,
        height: config.height ? config.height : sizes.height
    };
    if (config.fitToContainer) {
        var scrollbarY = config.$totalHeight > wrapperSizes.height ? html_1.getScrollbarWidth() : 0;
        config.$totalWidth = wrapperSizes.width - BORDERS - scrollbarY;
        var total = config.columns.reduce(function (width, col) { return width + col.width; }, 0);
        var per_1 = config.$totalWidth / total;
        config.columns.map(function (col) {
            col.width = per_1 * col.width;
        });
    }
    config.width = wrapperSizes.width;
    config.height = wrapperSizes.height;
    var renderConfig = getRenderConfig(obj, data, wrapperSizes);
    renderConfig.selection = selection;
    renderConfig.datacollection = obj.data;
    var shifts = Cells_1.getShifts(renderConfig);
    var isSticky = main_1.isCssSupport("position", "sticky");
    var gridBodyHeight = getContentHeight(renderConfig, isSticky, wrapperSizes);
    var layoutState = {
        wrapper: wrapperSizes,
        sticky: isSticky,
        shifts: shifts,
        gridBodyHeight: gridBodyHeight
    };
    var header = FixedRows_1.getFixedRows(renderConfig, __assign({}, layoutState, { name: "header", position: "top" }));
    var footer = renderConfig.$footer ? FixedRows_1.getFixedRows(renderConfig, __assign({}, layoutState, { name: "footer", position: "bottom" })) : null;
    var lessByWidth = renderConfig.$totalWidth + BORDERS < wrapperSizes.width ? "dhx_grid-less-width" : "";
    var lessByHeight = renderConfig.$totalHeight + BORDERS < wrapperSizes.height ? "dhx_grid-less-height" : "";
    return dom_1.el(".dhx_grid.dhx_widget", {
        class: renderConfig.css
    }, [
        dom_1.resizer(function () { return obj.paint(); }),
        dom_1.el(".dhx_grid-content", {
            style: __assign({}, wrapperSizes),
            onclick: htmlEvents.onclick,
            class: (lessByWidth + " " + lessByHeight).trim()
        }, [
            isSticky ? null : header,
            dom_1.el(".dhx_grid-body", {
                style: {
                    height: gridBodyHeight,
                    width: wrapperSizes.width - BORDERS,
                },
                onscroll: htmlEvents.onscroll,
                _ref: "grid_body"
            }, [
                isSticky ? header : null,
                getGridData(renderConfig, shifts),
                isSticky ? footer : null
            ]),
            FixedCols_1.getFixedCols(renderConfig, layoutState),
            isSticky ? null : footer
        ])
    ]);
}
exports.render = render;
function getGridData(renderConfig, shifts) {
    var content = Cells_1.getCells(renderConfig);
    var contentSpans = Cells_1.getSpans(renderConfig);
    var selection = renderConfig.selection ? renderConfig.selection.toHTML() : null;
    selection = typeof selection === "string" ? dom_1.el("div.dhx_selection", { ".innerHTML": selection }) : selection;
    return dom_1.el(".dhx_data-wrap", {
        style: {
            "height": renderConfig.$totalHeight,
            "width": renderConfig.$totalWidth,
            "padding-left": shifts.x,
            "padding-top": shifts.y,
        }
    }, [
        dom_1.el(".dhx_grid_data", content),
        dom_1.el(".dhx_span-spans", contentSpans),
        dom_1.el(".dhx_grid_selection", { _ref: "selection" }, [selection])
    ]);
}
function getContentHeight(renderConfig, isSticky, wrapperSizes) {
    var contentHeight = wrapperSizes.height - BORDERS;
    contentHeight = isSticky ? contentHeight : contentHeight - renderConfig.headerHeight;
    var isFooter = renderConfig.$footer;
    // [dirty] refactoring needed
    var lessByHeight = renderConfig.$totalHeight + BORDERS < wrapperSizes.height;
    if (renderConfig.splitAt && lessByHeight) {
        return renderConfig.$totalHeight + renderConfig.footerHeight + renderConfig.headerHeight + html_1.getScrollbarWidth();
    }
    // [dirty]
    return contentHeight = isFooter ?
        isSticky ? contentHeight : contentHeight - renderConfig.footerHeight
        : contentHeight;
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(3);
var InputEditor_1 = __webpack_require__(65);
var SelectEditor_1 = __webpack_require__(66);
var DateEditor_1 = __webpack_require__(67);
var lastEditor = {
    cell: {
        row: null,
        col: null
    },
    editor: null
};
var editHandler;
function getEditor(row, col, conf) {
    var type = conf.$editable.editorType;
    if (lastEditor.cell.row === row.id && lastEditor.cell.col === col.id) {
        return lastEditor.editor;
    }
    lastEditor.cell = {
        row: row.id,
        col: col.id
    };
    if (!editHandler) {
        editHandler = function () {
            lastEditor = {
                cell: {
                    row: null,
                    col: null
                },
                editor: null
            };
        };
        conf.events.on(types_1.GridEvents.afterEditEnd, editHandler);
    }
    switch (type) {
        case types_1.EditorType.input:
            return lastEditor.editor = new InputEditor_1.InputEditor(row, col, conf);
        case types_1.EditorType.select:
            return lastEditor.editor = new SelectEditor_1.SelectEditor(row, col, conf);
        case types_1.EditorType.datepicker:
            return lastEditor.editor = new DateEditor_1.DateEditor(row, col, conf);
        default:
            return lastEditor.editor = new InputEditor_1.InputEditor(row, col, conf);
    }
}
exports.getEditor = getEditor;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
var core_1 = __webpack_require__(0);
var InputEditor = /** @class */ (function () {
    function InputEditor(row, col, config) {
        this._config = config;
        this._cell = { row: row, col: col };
        this._initHandlers();
    }
    InputEditor.prototype.endEdit = function () {
        var value = this._input.value;
        if (this._config.events.fire(types_1.GridEvents.beforeEditEnd, [value, this._cell.row, this._cell.col])) {
            this._input.removeEventListener("blur", this._handlers.onBlur);
            this._input.removeEventListener("change", this._handlers.onChange);
            this._handlers = {};
            if (core_1.isNumeric(value)) {
                value = parseFloat(value);
            }
            this._config.events.fire(types_1.GridEvents.afterEditEnd, [value, this._cell.row, this._cell.col]);
        }
        else {
            this._input.focus();
        }
    };
    InputEditor.prototype.toHTML = function () {
        var content = this._cell.row[this._cell.col.id];
        if (this._input) {
            content = this._input.value;
        }
        return dom_1.el("input.dhx_cell-editor.dhx_cell-editor__input", {
            _hooks: {
                didInsert: this._handlers.didInsert
            },
            _key: "cell_editor",
            dhx_id: "cell_editor",
            value: content
        });
    };
    InputEditor.prototype._initHandlers = function () {
        var _this = this;
        this._handlers = {
            onBlur: function () {
                _this.endEdit();
            },
            onChange: function () {
                _this.endEdit();
            },
            didInsert: function (node) {
                var input = node.el;
                _this._input = input;
                input.focus();
                input.setSelectionRange(input.value.length, input.value.length);
                input.addEventListener("change", _this._handlers.onChange);
                input.addEventListener("blur", _this._handlers.onBlur);
            }
        };
    };
    return InputEditor;
}());
exports.InputEditor = InputEditor;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
var SelectEditor = /** @class */ (function () {
    function SelectEditor(row, col, config) {
        this._config = config;
        this._cell = { row: row, col: col };
        this._initHandlers();
    }
    SelectEditor.prototype.endEdit = function () {
        var value = this._input.value;
        if (this._config.events.fire(types_1.GridEvents.beforeEditEnd, [value, this._cell.row, this._cell.col])) {
            this._input.removeEventListener("blur", this._handlers.onBlur);
            this._handlers = {};
            this._config.events.fire(types_1.GridEvents.afterEditEnd, [value, this._cell.row, this._cell.col]);
        }
        else {
            this._input.focus();
        }
    };
    SelectEditor.prototype.toHTML = function () {
        var content = this._cell.col.options || [];
        var selected = this._cell.row[this._cell.col.id];
        if (this._input) {
            selected = this._input.options[this._input.selectedIndex].value;
        }
        var options = content.map(function (item) {
            return dom_1.el("option", {
                selected: item === selected
            }, item);
        });
        return dom_1.el("select.dhx_cell-editor.dhx_cell-editor__input", {
            _hooks: {
                didInsert: this._handlers.didInsert,
            },
            _key: "cell_editor",
            dhx_id: "cell_editor"
        }, options);
    };
    SelectEditor.prototype._initHandlers = function () {
        var _this = this;
        this._handlers = {
            onBlur: function () {
                _this.endEdit();
            },
            didInsert: function (node) {
                var input = node.el;
                _this._input = input;
                input.focus();
                input.addEventListener("blur", _this._handlers.onBlur);
            }
        };
    };
    return SelectEditor;
}());
exports.SelectEditor = SelectEditor;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var types_1 = __webpack_require__(3);
var ts_calendar_1 = __webpack_require__(68);
var ts_popup_1 = __webpack_require__(16);
var html_1 = __webpack_require__(2);
var DateEditor = /** @class */ (function () {
    function DateEditor(row, col, config) {
        var _this = this;
        this._config = config;
        this._cell = { row: row, col: col };
        this._calendar = new ts_calendar_1.Calendar(null, { dateFormat: col.dateFormat });
        var value = this._cell.row[this._cell.col.id];
        if (value) {
            this._calendar.setValue(value);
        }
        this._popup = new ts_popup_1.Popup({ css: "dhx_widget--bordered" });
        this._popup.attach(this._calendar);
        this._calendar.events.on(ts_calendar_1.CalendarEvents.change, function () {
            _this.endEdit();
        });
        this._popup.events.on(ts_popup_1.PopupEvents.afterHide, function () {
            _this.endEdit();
        });
        this._initHandlers();
    }
    DateEditor.prototype.endEdit = function () {
        // [todo]
        if (!this._handlers) {
            return;
        }
        var value = this._calendar.getValue();
        if (this._config.events.fire(types_1.GridEvents.beforeEditEnd, [value, this._cell.row, this._cell.col])) {
            this._input.removeEventListener("blur", this._handlers.onBlur);
            this._handlers = null;
            this._popup.destructor();
            this._calendar.destructor();
            this._config.events.fire(types_1.GridEvents.afterEditEnd, [value, this._cell.row, this._cell.col]);
        }
        else {
            this._input.focus();
        }
    };
    DateEditor.prototype.toHTML = function () {
        var content = this._cell.row[this._cell.col.id];
        return dom_1.el("input.dhx_cell-editor.dhx_cell-editor__input.dhx_cell-editor__datepicker", {
            _hooks: {
                didInsert: this._handlers.didInsert,
                didRecycle: this._handlers.didRecycle,
                didRemove: this._handlers.didRemove
            },
            _key: "cell_editor",
            dhx_id: "cell_editor",
            value: content
        });
    };
    DateEditor.prototype._initHandlers = function () {
        var _this = this;
        this._handlers = {
            onBlur: function () {
                _this.endEdit();
            },
            onChange: function () {
                _this.endEdit();
            },
            didInsert: function (node) {
                var input = node.el;
                _this._input = input;
                _this._input.addEventListener("focus", function () {
                    // [dirty]
                    setTimeout(function () {
                        _this._popup.show(_this._input, { centering: true, mode: html_1.Position.bottom });
                    }, 100);
                });
                input.focus();
                input.setAttribute("disabled", "true");
                input.setSelectionRange(input.value.length, input.value.length);
            },
            didRecycle: function () {
                if (_this._input) {
                    _this._popup.show(_this._input, { centering: true, mode: html_1.Position.bottom });
                }
                else {
                    _this.endEdit();
                }
            },
            didRemove: function () {
                _this.endEdit();
            }
        };
    };
    return DateEditor;
}());
exports.DateEditor = DateEditor;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(69));
__export(__webpack_require__(31));
__export(__webpack_require__(17));


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var view_1 = __webpack_require__(4);
var ts_timepicker_1 = __webpack_require__(70);
var DateHelper_1 = __webpack_require__(80);
var DateFormatter_1 = __webpack_require__(17);
var helper_1 = __webpack_require__(81);
var en_1 = __webpack_require__(30);
var types_1 = __webpack_require__(31);
var Calendar = /** @class */ (function (_super) {
    __extends(Calendar, _super);
    function Calendar(container, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, container, core_1.extend({
            weekStart: "sunday",
            thisMonthOnly: false,
            dateFormat: (window && window.dhx && window.dhx.dateFormat),
            width: "250px"
        }, config)) || this;
        _this.events = new events_1.EventSystem();
        if (!_this.config.dateFormat) {
            if (_this.config.timePicker) {
                if (_this.config.timeFormat === 12) {
                    _this.config.dateFormat = "%d/%m/%y %h:%i %A";
                }
                else {
                    _this.config.dateFormat = "%d/%m/%y %H:%i";
                }
            }
            else {
                _this.config.dateFormat = "%d/%m/%y";
            }
        }
        if (_this.config.value) {
            _this._selected = DateHelper_1.DateHelper.toDateObject(_this.config.value, _this.config.dateFormat);
        }
        if (_this.config.date) {
            _this._currentDate = DateHelper_1.DateHelper.toDateObject(_this.config.date, _this.config.dateFormat);
        }
        else if (_this._selected) {
            _this._currentDate = new Date(_this._selected);
        }
        else {
            _this._currentDate = new Date();
        }
        switch (_this.config.view) {
            case types_1.ViewMode.months:
                _this._currentViewMode = types_1.ViewMode.months;
                break;
            case types_1.ViewMode.years:
                _this._currentViewMode = types_1.ViewMode.years;
                break;
            default:
                _this._currentViewMode = types_1.ViewMode.days;
        }
        _this._initHandlers();
        if (_this.config.timePicker) {
            _this._timepicker = new ts_timepicker_1.Timepicker(null, { timeFormat: _this.config.timeFormat, actions: true });
            var initTime = _this._selected || new Date();
            _this._timepicker.setValue(initTime);
            _this._time = _this._timepicker.getValue();
            _this._timepicker.events.on(ts_timepicker_1.TimepickerEvents.close, function () {
                _this._timepicker.setValue(_this._time);
                _this.showDate(null, types_1.ViewMode.days);
            });
            _this._timepicker.events.on(ts_timepicker_1.TimepickerEvents.save, function () {
                var _a = _this._timepicker.getValue(true), hour = _a.hour, minute = _a.minute, AM = _a.AM;
                var oldDate = _this._selected;
                var newDate = _this._selected = DateHelper_1.DateHelper.withHoursAndMinutes(_this._selected || new Date(), AM === false ? hour + 12 : hour, minute);
                if (_this.events.fire(types_1.CalendarEvents.beforeChange, [newDate, oldDate, true])) {
                    _this._selected = newDate;
                    _this.events.fire(types_1.CalendarEvents.change, [newDate, oldDate, true]);
                }
                _this._time = _this._timepicker.getValue();
                _this.showDate(null, types_1.ViewMode.days);
            });
        }
        var render = function () { return _this._draw(); };
        _this.mount(container, dom_1.create({ render: render }));
        return _this;
    }
    Calendar.prototype.setValue = function (date) {
        date = DateHelper_1.DateHelper.toDateObject(date, this.config.dateFormat);
        var oldDate = DateHelper_1.DateHelper.copy(this._selected);
        if (!this.events.fire(types_1.CalendarEvents.beforeChange, [date, oldDate, false])) {
            return false;
        }
        this._selected = date;
        this._currentDate = DateHelper_1.DateHelper.copy(this._selected);
        if (this._timepicker) {
            this._timepicker.setValue(date);
            this._time = this._timepicker.getValue();
        }
        this.events.fire(types_1.CalendarEvents.change, [date, oldDate, false]);
        this.paint();
        return true;
    };
    Calendar.prototype.getValue = function (asDateObject) {
        if (!this._selected) {
            return null;
        }
        if (asDateObject) {
            return DateHelper_1.DateHelper.copy(this._selected);
        }
        else {
            return DateFormatter_1.getFormatedDate(this.config.dateFormat, this._selected);
        }
    };
    Calendar.prototype.showDate = function (date, mode) {
        if (date) {
            this._currentDate = date;
        }
        if (mode) {
            this._currentViewMode = mode;
        }
        this.paint();
    };
    Calendar.prototype.destructor = function () {
        if (this._linkedCalendar) {
            this._unlink();
        }
        if (this._timepicker) {
            this._timepicker.destructor();
        }
        this.unmount();
    };
    Calendar.prototype.link = function (targetCalendar) {
        var _this = this;
        if (this._linkedCalendar) {
            this._unlink();
        }
        this._linkedCalendar = targetCalendar;
        var rawLowerData = this.getValue(true);
        var rawUpperDate = targetCalendar.getValue(true);
        var lowerDate = rawLowerData && DateHelper_1.DateHelper.dayStart(rawLowerData);
        var upperDate = rawUpperDate && DateHelper_1.DateHelper.dayStart(rawUpperDate);
        var rangeMark = function (date) {
            if (lowerDate && upperDate) {
                return date >= lowerDate && date <= upperDate && getRangeClass(date);
            }
        };
        var getRangeClass = function (date) {
            if (DateHelper_1.DateHelper.isSameDay(upperDate, lowerDate)) {
                return null;
            }
            var positionInRange = "dhx_calendar-day--in-range";
            if (DateHelper_1.DateHelper.isSameDay(date, lowerDate)) {
                positionInRange += " dhx_calendar-day--first-date";
            }
            if (DateHelper_1.DateHelper.isSameDay(date, upperDate)) {
                positionInRange += " dhx_calendar-day--last-date";
            }
            return positionInRange;
        };
        if (!this.config.block || !this._linkedCalendar.config.block) {
            this.config.block = function (date) {
                if (upperDate) {
                    return date > upperDate;
                }
            };
            this._linkedCalendar.config.block = function (date) {
                if (lowerDate) {
                    return date < lowerDate;
                }
            };
        }
        this.config.thisMonthOnly = true;
        targetCalendar.config.thisMonthOnly = true;
        if (!this.config.$rangeMark || !this._linkedCalendar.config.$rangeMark) {
            this.config.$rangeMark = this._linkedCalendar.config.$rangeMark = rangeMark;
        }
        this.events.on(types_1.CalendarEvents.change, function (date) {
            lowerDate = DateHelper_1.DateHelper.dayStart(date);
            _this._linkedCalendar.paint();
        }, "link");
        this._linkedCalendar.events.on(types_1.CalendarEvents.change, function (date) {
            upperDate = DateHelper_1.DateHelper.dayStart(date);
            _this.paint();
        }, "link");
        this._linkedCalendar.paint();
        this.paint();
    };
    Calendar.prototype._unlink = function () {
        if (this._linkedCalendar) {
            this.config.$rangeMark = this._linkedCalendar.config.$rangeMark = null;
            this.config.block = this._linkedCalendar.config.block = null;
            this.events.detach(types_1.CalendarEvents.change, "link");
            this._linkedCalendar.events.detach(types_1.CalendarEvents.change, "link");
            this._linkedCalendar.paint();
            this.paint();
            this._linkedCalendar = null;
        }
    };
    Calendar.prototype._draw = function () {
        switch (this._currentViewMode) {
            case types_1.ViewMode.days:
                return this._drawCalendar();
            case types_1.ViewMode.months:
                return this._drawMonthSelector();
            case types_1.ViewMode.years:
                return this._drawYearSelector();
            case types_1.ViewMode.timepicker:
                return this._drawTimepicker();
        }
    };
    Calendar.prototype._initHandlers = function () {
        var _this = this;
        this._handlers = {
            onclick: {
                ".dhx_calendar-year, .dhx_calendar-month, .dhx_calendar-day": function (_e, vn) {
                    var date = vn.attrs._date;
                    var oldDate = DateHelper_1.DateHelper.copy(_this._selected);
                    switch (_this._currentViewMode) {
                        case types_1.ViewMode.days:
                            var mergedDate = _this.config.timePicker ? DateHelper_1.DateHelper.mergeHoursAndMinutes(date, _this._selected || _this._currentDate) : date;
                            if (!_this.events.fire(types_1.CalendarEvents.beforeChange, [mergedDate, oldDate, true])) {
                                return;
                            }
                            _this._selected = mergedDate;
                            _this.showDate(date);
                            _this.events.fire(types_1.CalendarEvents.change, [date, oldDate, true]);
                            break;
                        case types_1.ViewMode.months:
                            if (_this.config.view !== types_1.ViewMode.months) {
                                DateHelper_1.DateHelper.setMonth(_this._currentDate, date);
                                _this.showDate(null, types_1.ViewMode.days);
                            }
                            else {
                                var newDate = DateHelper_1.DateHelper.fromYearAndMonth(_this._currentDate.getFullYear() || _this._selected.getFullYear(), date);
                                if (!_this.events.fire(types_1.CalendarEvents.beforeChange, [newDate, oldDate, true])) {
                                    return;
                                }
                                _this._currentDate = newDate;
                                _this._selected = newDate;
                                _this.events.fire(types_1.CalendarEvents.change, [_this._selected, oldDate, true]);
                                _this.paint();
                            }
                            break;
                        case types_1.ViewMode.years:
                            if (_this.config.view !== types_1.ViewMode.years) {
                                DateHelper_1.DateHelper.setYear(_this._currentDate, date);
                                _this.showDate(null, types_1.ViewMode.months);
                            }
                            else {
                                var newDate = DateHelper_1.DateHelper.fromYear(date);
                                if (!_this.events.fire(types_1.CalendarEvents.beforeChange, [newDate, oldDate, true])) {
                                    return;
                                }
                                _this._currentDate = newDate;
                                _this._selected = newDate;
                                _this.events.fire(types_1.CalendarEvents.change, [_this._selected, oldDate, true]);
                                _this.paint();
                            }
                    }
                },
                ".dhx_calendar-action__cancel": function () { return _this.showDate(_this._selected, types_1.ViewMode.days); },
                ".dhx_calendar-action__show-month": function () { return _this.showDate(null, types_1.ViewMode.months); },
                ".dhx_calendar-action__show-year": function () { return _this.showDate(null, types_1.ViewMode.years); },
                ".dhx_calendar-action__next": function () {
                    var newDate;
                    switch (_this._currentViewMode) {
                        case types_1.ViewMode.days:
                            newDate = DateHelper_1.DateHelper.addMonth(_this._currentDate, 1);
                            break;
                        case types_1.ViewMode.months:
                            newDate = DateHelper_1.DateHelper.addYear(_this._currentDate, 1);
                            break;
                        case types_1.ViewMode.years:
                            newDate = DateHelper_1.DateHelper.addYear(_this._currentDate, 12);
                    }
                    _this.showDate(newDate);
                },
                ".dhx_calendar-action__prev": function () {
                    var newDate;
                    switch (_this._currentViewMode) {
                        case types_1.ViewMode.days:
                            newDate = DateHelper_1.DateHelper.addMonth(_this._currentDate, -1);
                            break;
                        case types_1.ViewMode.months:
                            newDate = DateHelper_1.DateHelper.addYear(_this._currentDate, -1);
                            break;
                        case types_1.ViewMode.years:
                            newDate = DateHelper_1.DateHelper.addYear(_this._currentDate, -12);
                    }
                    _this.showDate(newDate);
                },
                ".dhx_calendar-action__show-timepicker": function () {
                    _this._currentViewMode = types_1.ViewMode.timepicker;
                    _this.paint();
                }
            },
            onmouseover: {
                ".dhx_calendar-day": function (e, vn) { return _this.events.fire(types_1.CalendarEvents.dateHover, [e, new Date(vn.attrs._date)]); }
            }
        };
    };
    Calendar.prototype._getData = function (d) {
        var firstDay = this.config.weekStart === "monday" ? 1 : 0;
        var first = DateHelper_1.DateHelper.weekStart(DateHelper_1.DateHelper.monthStart(d), firstDay);
        var data = [];
        var weeksCount = 6;
        var currentDate = first;
        while (weeksCount--) {
            var currentWeek = DateHelper_1.DateHelper.getWeekNumber(currentDate);
            var disabledDays = 0;
            var daysCount = 7;
            var days = [];
            while (daysCount--) {
                var isDateWeekEnd = DateHelper_1.DateHelper.isWeekEnd(currentDate);
                var isCurrentMonth = d.getMonth() === currentDate.getMonth();
                var isBlocked = this.config.block && this.config.block(currentDate);
                var css = [];
                if (isDateWeekEnd && isCurrentMonth) {
                    css.push("dhx_calendar-day--weekend");
                }
                if (!isCurrentMonth) {
                    if (this.config.thisMonthOnly) {
                        disabledDays++;
                        css.push("dhx_calendar-day--hidden");
                    }
                    else {
                        css.push("dhx_calendar-day--muffled");
                    }
                }
                if (this.config.mark) {
                    var markedCss = this.config.mark(currentDate);
                    if (markedCss) {
                        css.push(markedCss);
                    }
                }
                if (this.config.$rangeMark) {
                    var rangeMark = this.config.$rangeMark(currentDate);
                    if (rangeMark) {
                        css.push(rangeMark);
                    }
                }
                if (isBlocked) {
                    if (isDateWeekEnd) {
                        css.push("dhx_calendar-day--weekend-disabled");
                    }
                    else {
                        css.push("dhx_calendar-day--disabled");
                    }
                }
                if (this._selected && currentDate.getDate() === this._selected.getDate()
                    && currentDate.getMonth() === this._selected.getMonth()
                    && this._selected.getFullYear() === currentDate.getFullYear()) {
                    css.push("dhx_calendar-day--selected");
                }
                days.push({
                    date: currentDate,
                    day: currentDate.getDate(),
                    css: css.join(" ")
                });
                currentDate = DateHelper_1.DateHelper.addDay(currentDate);
            }
            data.push({
                weekNumber: currentWeek,
                days: days,
                disabledWeekNumber: disabledDays === 7
            });
        }
        return data;
    };
    Calendar.prototype._drawCalendar = function () {
        var date = this._currentDate;
        var weekDays = this.config.weekStart === "monday"
            ? en_1.default.daysShort.slice(1).concat([en_1.default.daysShort[0]]) : en_1.default.daysShort;
        var weekDaysHeader = weekDays.map(function (day) { return dom_1.el(".dhx_calendar-weekday", day); });
        var data = this._getData(date);
        var content = [];
        var weekNumbers = [];
        var weekNumbersWrapper;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var week = data_1[_i];
            var weekRow = week.days.map(function (item) { return dom_1.el("div.dhx_calendar-day", {
                class: item.css,
                _date: item.date,
                tabIndex: 1,
            }, item.day); });
            if (this.config.weekNumbers && !(week.disabledWeekNumber && this.config.thisMonthOnly)) {
                weekNumbers.push(dom_1.el("div", {
                    class: "dhx_calendar-week-number"
                }, week.weekNumber));
            }
            content = content.concat(weekRow);
        }
        if (this.config.weekNumbers) {
            weekNumbersWrapper = dom_1.el(".dhx_calendar__week-numbers", weekNumbers);
        }
        var widgetClass = "dhx_calendar dhx_widget" +
            (this.config.css ? " " + this.config.css : "") +
            (this.config.timePicker ? " dhx_calendar--with_timepicker" : "") +
            (this.config.weekNumbers ? " dhx_calendar--with_week-numbers" : "");
        return dom_1.el("div", __assign({ class: widgetClass, style: { width: this.config.weekNumbers ? "calc(" + this.config.width + " + 48px )" : this.config.width } }, this._handlers), [
            dom_1.el(".dhx_calendar__wrapper", [
                this._drawHeader(dom_1.el("button.dhx_calendar-action__show-month.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", en_1.default.months[date.getMonth()] + " " + date.getFullYear())),
                this.config.weekNumbers && dom_1.el(".dhx_calendar__dates-wrapper", [
                    dom_1.el(".dhx_calendar__weekdays", weekDaysHeader),
                    dom_1.el(".dhx_calendar__days", content),
                    weekNumbersWrapper
                ]),
                !this.config.weekNumbers && dom_1.el(".dhx_calendar__weekdays", weekDaysHeader),
                !this.config.weekNumbers && dom_1.el(".dhx_calendar__days", content),
                this.config.timePicker ?
                    dom_1.el(".dhx_timepicker__actions", [
                        dom_1.el("button.dhx_calendar__timepicker-button." +
                            "dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__show-timepicker", [
                            dom_1.el("span.dhx_button__icon.dxi.dxi-clock-outline"),
                            dom_1.el("span.dhx_button__text", this._time),
                        ])
                    ]) : null,
            ])
        ]);
    };
    Calendar.prototype._drawMonthSelector = function () {
        var date = this._currentDate;
        var currentMonth = date.getMonth();
        var currentYear = this._selected ? this._selected.getFullYear() : null;
        var widgetClass = "dhx_calendar dhx_widget" +
            (this.config.css ? " " + this.config.css : "") +
            (this.config.timePicker ? " dhx_calendar--with_timepicker" : "") +
            (this.config.weekNumbers ? " dhx_calendar--with_week-numbers" : "");
        return dom_1.el("div", __assign({ class: widgetClass, style: {
                width: this.config.weekNumbers ? "calc(" + this.config.width + " + 48px)" : this.config.width,
            } }, this._handlers), [
            dom_1.el(".dhx_calendar__wrapper", [
                this._drawHeader(dom_1.el("button.dhx_calendar-action__show-year.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", date.getFullYear())),
                dom_1.el(".dhx_calendar__months", en_1.default.monthsShort.map(function (item, i) { return dom_1.el("div", {
                    class: "dhx_calendar-month" + (currentMonth === i && currentYear === date.getFullYear() ? " dhx_calendar-month--selected" : ""),
                    tabIndex: 1,
                    _date: i
                }, item); })),
                this.config.view !== types_1.ViewMode.months ? dom_1.el(".dhx_calendar__actions", [
                    dom_1.el("button.dhx_button.dhx_button--color_primary.dhx_button--view_link.dhx_button--size_small.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__cancel", en_1.default.cancel)
                ]) : null
            ])
        ]);
    };
    Calendar.prototype._drawYearSelector = function () {
        var _this = this;
        var date = this._currentDate;
        var yearsDiapason = DateHelper_1.DateHelper.getTwelweYears(date);
        var widgetClass = "dhx_calendar dhx_widget" +
            (this.config.css ? " " + this.config.css : "") +
            (this.config.timePicker ? " dhx_calendar--with_timepicker" : "") +
            (this.config.weekNumbers ? " dhx_calendar--with_week-numbers" : "");
        return dom_1.el("div", __assign({ class: widgetClass, style: { width: this.config.weekNumbers ? "calc(" + this.config.width + " + 48px)" : this.config.width } }, this._handlers), [
            dom_1.el(".dhx_calendar__wrapper", [
                this._drawHeader(dom_1.el("button.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", yearsDiapason[0] + "-" + yearsDiapason[yearsDiapason.length - 1])),
                dom_1.el(".dhx_calendar__years", yearsDiapason.map(function (item) { return dom_1.el("div", {
                    class: "dhx_calendar-year" + (_this._selected && item === _this._selected.getFullYear() ? " dhx_calendar-year--selected" : ""),
                    _date: item,
                    tabIndex: 1,
                }, item); })),
                this.config.view !== types_1.ViewMode.years && this.config.view !== types_1.ViewMode.months ? dom_1.el(".dhx_calendar__actions", [
                    dom_1.el("button.dhx_button.dhx_button--color_primary.dhx_button--view_link.dhx_button--size_small.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__cancel", en_1.default.cancel)
                ]) : null
            ])
        ]);
    };
    Calendar.prototype._drawHeader = function (actionContent) {
        return dom_1.el(".dhx_calendar__navigation", [
            dom_1.el("button.dhx_calendar-navigation__button.dhx_calendar-action__prev" + helper_1.linkButtonClasses + ".dhx_button--icon.dhx_button--circle", [
                dom_1.el(".dhx_button__icon.dxi.dxi-chevron-left")
            ]),
            actionContent,
            dom_1.el("button.dhx_calendar-navigation__button.dhx_calendar-action__next" + helper_1.linkButtonClasses + ".dhx_button--icon.dhx_button--circle", [
                dom_1.el(".dhx_button__icon.dxi.dxi-chevron-right")
            ]),
        ]);
    };
    Calendar.prototype._drawTimepicker = function () {
        return dom_1.el(".dhx_widget.dhx-calendar", {
            class: (this.config.css ? " " + this.config.css : ""),
            style: { width: this.config.weekNumbers ? "calc(" + this.config.width + " + 48px)" : this.config.width }
        }, [
            dom_1.inject(this._timepicker.getRootView())
        ]);
    };
    return Calendar;
}(view_1.View));
exports.Calendar = Calendar;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(71));
__export(__webpack_require__(29));


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var view_1 = __webpack_require__(4);
var ts_layout_1 = __webpack_require__(26);
var ts_slider_1 = __webpack_require__(74);
var en_1 = __webpack_require__(78);
var helper_1 = __webpack_require__(79);
var types_1 = __webpack_require__(29);
var Timepicker = /** @class */ (function (_super) {
    __extends(Timepicker, _super);
    function Timepicker(container, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, container, core_1.extend({
            timeFormat: 24,
            actions: false
        }, config)) || this;
        _this.events = new events_1.EventSystem(_this);
        _this._time = {
            h: 0,
            m: 0,
            isAM: true
        };
        if (_this.config.timeFormat === 12) {
            _this._time.h = 12;
        }
        _this._initUI(container);
        _this._initHandlers();
        _this._initEvents();
        return _this;
    }
    Timepicker.prototype.getValue = function (asOBject) {
        var _a = this._time, h = _a.h, m = _a.m, isAM = _a.isAM;
        if (asOBject) {
            var obj = {
                hour: h,
                minute: m
            };
            if (this.config.timeFormat === 12) {
                obj.AM = isAM;
            }
            return obj;
        }
        return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + (this.config.timeFormat === 12 ? (isAM ? "AM" : "PM") : "");
    };
    Timepicker.prototype.setValue = function (value) {
        var m;
        var h;
        var isPM;
        if (typeof value === "number") {
            value = new Date(value);
        }
        if (value instanceof Date) {
            m = value.getMinutes();
            h = value.getHours();
        }
        else if (Array.isArray(value)) {
            h = validate(value[0], 23);
            m = validate(value[1], 59);
            if (value[2] && value[2].toLowerCase() === "pm") {
                isPM = true;
            }
        }
        else {
            var matches = value.match(/\d+/g);
            h = validate(+matches[0], 23);
            m = validate(+matches[1], 59);
            if (value.toLowerCase().indexOf("pm") !== -1) {
                isPM = true;
            }
        }
        if (isPM && h < 12) {
            h += 12;
        }
        this._hoursSlider.setValue(h);
        this._minutesSlider.setValue(m);
        if (helper_1.isTimeCheck(value)) {
            this._hoursSlider.setValue(0);
            this._minutesSlider.setValue(m);
            this._time.isAM = true;
        }
        this._inputsView.paint();
    };
    Timepicker.prototype.destructor = function () {
        this._minutesSlider.destructor();
        this._hoursSlider.destructor();
        this.events.clear();
        this.unmount();
    };
    Timepicker.prototype.getRootView = function () {
        return this.layout.getRootView();
    };
    Timepicker.prototype._initUI = function (container) {
        var _this = this;
        var layoutConfig = {
            gravity: false,
            css: "dhx_widget dhx_timepicker " +
                (this.config.css ? this.config.css : "") +
                (this.config.actions ? " dhx_timepicker--with-actions" : ""),
            rows: [
                {
                    id: "timepicker",
                    css: "dhx_timepicker__inputs"
                },
                {
                    id: "hour-slider",
                    css: "dhx_timepicker__hour"
                },
                {
                    id: "minute-slider",
                    css: "dhx_timepicker__minute"
                }
            ]
        };
        if (this.config.actions) {
            layoutConfig.rows.unshift({
                id: "close-action",
                css: "dhx_timepicker__close"
            });
            layoutConfig.rows.push({
                id: "save-action",
                css: "dhx_timepicker__save"
            });
        }
        var layout = this.layout = new ts_layout_1.Layout(container, layoutConfig);
        var timepicker = dom_1.create({
            render: function () { return _this._draw(); }
        });
        var inputsView = this._inputsView = view_1.toViewLike(timepicker);
        var mSlider = this._minutesSlider = new ts_slider_1.Slider(null, {
            min: 0,
            max: 59,
            step: 1,
            thumbLabel: false,
            labelInline: false,
            label: en_1.default.minutes
        });
        var hSlider = this._hoursSlider = new ts_slider_1.Slider(null, {
            min: 0,
            max: 23,
            step: 1,
            thumbLabel: false,
            labelInline: false,
            label: en_1.default.hours
        });
        layout.cell("timepicker").attach(inputsView);
        layout.cell("hour-slider").attach(hSlider);
        layout.cell("minute-slider").attach(mSlider);
        if (this.config.actions) {
            var save = function () {
                return dom_1.el("button.dhx_timepicker__button-save.dhx_button.dhx_button--view_flat.dhx_button--color_primary.dhx_button--size_medium.dhx_button--circle.dhx_button--width_full", { onclick: _this._outerHandlers.save }, en_1.default.save);
            };
            var close_1 = function () {
                return dom_1.el("button.dhx_timepicker__button-close.dhx_button.dhx_button--view_link.dhx_button--size_medium.dhx_button--view_link.dhx_button--color_secondary.dhx_button--icon.dhx_button--circle", {
                    onclick: _this._outerHandlers.close
                }, [dom_1.el("span.dhx_button__icon.dxi.dxi-close")]);
            };
            layout.cell("save-action").attach(save);
            layout.cell("close-action").attach(close_1);
        }
    };
    Timepicker.prototype._initHandlers = function () {
        var _this = this;
        this._handlers = {
            onchange: {
                ".dhx_timepicker-input--hour": function (e) {
                    var hour = validate(parseInt(e.target.value, 10), 23);
                    e.target.value = hour;
                    _this._hoursSlider.setValue(hour);
                },
                ".dhx_timepicker-input--minutes": function (e) {
                    var min = validate(parseInt(e.target.value, 10), 59);
                    e.target.value = min;
                    _this._minutesSlider.setValue(min);
                }
            }
        };
        this._outerHandlers = {
            close: function () { return _this.events.fire(types_1.TimepickerEvents.close); },
            save: function () { return _this.events.fire(types_1.TimepickerEvents.save, [_this._time]); }
        };
    };
    Timepicker.prototype._initEvents = function () {
        var _this = this;
        this._hoursSlider.events.on(ts_slider_1.SliderEvents.change, function (value) {
            if (value < _this._hoursSlider.config.min || value > _this._hoursSlider.config.max) {
                return;
            }
            if (_this.config.timeFormat === 12) {
                _this._time.isAM = value < 12;
                _this._time.h = value % 12 || 12;
            }
            else {
                _this._time.h = value;
            }
            _this.events.fire(types_1.TimepickerEvents.change, [_this.getValue()]);
            _this._inputsView.paint();
        });
        this._minutesSlider.events.on(ts_slider_1.SliderEvents.change, function (value) {
            if (value < _this._minutesSlider.config.min || value > _this._minutesSlider.config.max) {
                return;
            }
            _this._time.m = value;
            _this.events.fire(types_1.TimepickerEvents.change, [_this.getValue()]);
            _this._inputsView.paint();
        });
    };
    Timepicker.prototype._draw = function () {
        return dom_1.el(".dhx_timepicker-inputs", __assign({}, this._handlers), [
            dom_1.el("input.dhx_timepicker-input.dhx_timepicker-input--hour", {
                _key: "hour",
                value: this._time.h < 10 ? "0" + this._time.h : this._time.h
            }),
            dom_1.el("span.dhx_timepicker-delimer", ":"),
            dom_1.el("input.dhx_timepicker-input.dhx_timepicker-input--minutes", {
                _key: "minute",
                value: this._time.m < 10 ? "0" + this._time.m : this._time.m
            }),
            this.config.timeFormat === 12 ? dom_1.el(".dhx_timepicker-ampm", this._time.isAM ? "AM" : "PM") : null
        ]);
    };
    return Timepicker;
}(view_1.View));
exports.Timepicker = Timepicker;
function validate(value, max) {
    if (isNaN(value)) {
        return 0;
    }
    return Math.min(max, Math.max(0, value));
}


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Cell_1 = __webpack_require__(73);
var dom_1 = __webpack_require__(1);
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout(parent, config) {
        var _this = _super.call(this, parent, config) || this;
        // root layout
        _this._root = _this.config.parent || _this;
        _this._all = {};
        _this._parseConfig();
        if (_this.config.views) {
            _this.config.activeView = _this.config.activeView || _this._cells[0].id;
            _this._isViewLayout = true;
        }
        if (!config.parent) {
            var view = dom_1.create({ render: function () { return _this.toVDOM(); } }, _this);
            _this.mount(parent, view);
        }
        return _this;
    }
    Layout.prototype.cell = function (id) {
        // FIXME
        return this._root._all[id];
    };
    Layout.prototype.toVDOM = function () {
        if (this._isViewLayout) {
            var roots = this.config && [this.cell(this.config.activeView).toVDOM()];
            return _super.prototype.toVDOM.call(this, roots);
        }
        var nodes = [];
        this._cells.forEach(function (cell) {
            var node = cell.toVDOM();
            if (Array.isArray(node)) {
                nodes = nodes.concat(node);
            }
            else {
                nodes.push(node);
            }
        });
        return _super.prototype.toVDOM.call(this, nodes);
    };
    Layout.prototype.removeCell = function (id) {
        var root = (this.config.parent || this);
        if (root !== this) {
            return root.removeCell(id);
        }
        // this === root layout
        var view = this.cell(id);
        if (view) {
            var parent_1 = view.getParent();
            delete this._all[id];
            parent_1._cells = parent_1._cells.filter(function (cell) { return cell.id !== id; });
            parent_1.paint();
        }
    };
    Layout.prototype.addCell = function (config, index) {
        if (index === void 0) { index = -1; }
        var view = this._createCell(config);
        if (index < 0) {
            index = this._cells.length + index + 1;
        }
        this._cells.splice(index, 0, view);
        this.paint();
    };
    Layout.prototype.getId = function (index) {
        if (index < 0) {
            index = this._cells.length + index;
        }
        return this._cells[index] ? this._cells[index].id : undefined;
    };
    Layout.prototype.getRefs = function (name) {
        return this._root.getRootView().refs[name];
    };
    Layout.prototype._getCss = function (content) {
        var layoutCss = this._xLayout ? "dhx_layout-columns" : "dhx_layout-rows";
        var directionCss = this.config.align ? " " + layoutCss + "--" + this.config.align : "";
        if (content) {
            return layoutCss + " dhx_layout-cell" + (this.config.align ? " dhx_layout-cell--" + this.config.align : "");
        }
        else {
            var cellCss = this.config.parent ? _super.prototype._getCss.call(this) : "dhx_widget dhx_layout";
            var fullModeCss = this.config.parent ? "" : " dhx_layout-cell";
            return cellCss + (this.config.full ? fullModeCss : " " + layoutCss) + directionCss;
        }
    };
    Layout.prototype._parseConfig = function () {
        var _this = this;
        var config = this.config;
        var cells = config.rows || config.cols || config.views || [];
        this._xLayout = !config.rows;
        this._cells = cells.map(function (a) { return _this._createCell(a); });
    };
    Layout.prototype._createCell = function (cell) {
        var view;
        if (cell.rows || cell.cols || cell.views) {
            cell.parent = this._root;
            view = new Layout(this, cell);
        }
        else {
            view = new Cell_1.Cell(this, cell);
        }
        // FIxME
        this._root._all[view.id] = view;
        return view;
    };
    return Layout;
}(Cell_1.Cell));
exports.Layout = Layout;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var view_1 = __webpack_require__(4);
var resizeMode;
(function (resizeMode) {
    resizeMode[resizeMode["unknown"] = 0] = "unknown";
    resizeMode[resizeMode["percents"] = 1] = "percents";
    resizeMode[resizeMode["pixels"] = 2] = "pixels";
    resizeMode[resizeMode["mixedpx1"] = 3] = "mixedpx1";
    resizeMode[resizeMode["mixedpx2"] = 4] = "mixedpx2";
    resizeMode[resizeMode["mixedperc1"] = 5] = "mixedperc1";
    resizeMode[resizeMode["mixedperc2"] = 6] = "mixedperc2";
})(resizeMode || (resizeMode = {}));
function getResizeMode(dir, conf1, conf2) {
    var field = dir ? "width" : "height";
    var is1perc = conf1[field] && conf1[field].indexOf("%") !== -1;
    var is2perc = conf2[field] && conf2[field].indexOf("%") !== -1;
    var is1px = conf1[field] && conf1[field].indexOf("px") !== -1;
    var is2px = conf2[field] && conf2[field].indexOf("px") !== -1;
    if (is1perc && is2perc) {
        return resizeMode.percents;
    }
    if (is1px && is2px) {
        return resizeMode.pixels;
    }
    if (is1px && !is2px) {
        return resizeMode.mixedpx1;
    }
    if (is2px && !is1px) {
        return resizeMode.mixedpx2;
    }
    if (is1perc) {
        return resizeMode.mixedperc1;
    }
    if (is2perc) {
        return resizeMode.mixedperc2;
    }
    return resizeMode.unknown;
}
function getBlockRange(block1, block2, isXLayout) {
    if (isXLayout === void 0) { isXLayout = true; }
    if (isXLayout) {
        return {
            min: block1.left + window.pageXOffset,
            max: block2.right + window.pageXOffset
        };
    }
    return {
        min: block1.top + window.pageYOffset,
        max: block2.bottom + window.pageYOffset
    };
}
var Cell = /** @class */ (function (_super) {
    __extends(Cell, _super);
    function Cell(parent, config) {
        var _this = _super.call(this, parent, core_1.extend({ gravity: true }, config)) || this;
        var p = parent;
        if (p && p.isVisible) {
            _this._parent = p;
        }
        _this.config.full = _this.config.full === undefined ? Boolean(_this.config.header || _this.config.collapsable) : _this.config.full;
        _this._initHandlers();
        _this.id = _this.config.id || core_1.uid();
        return _this;
    }
    Cell.prototype.paint = function () {
        if (this.isVisible()) {
            var view = this.getRootView();
            if (view) {
                view.redraw();
            }
            else {
                this._parent.paint();
            }
        }
    };
    Cell.prototype.isVisible = function () {
        // top level node
        if (!this._parent) {
            if (this._container && this._container.tagName) {
                return true;
            }
            return Boolean(this.getRootNode());
        }
        // check active view in case of multiview
        var active = this._parent.config.activeView;
        if (active && active !== this.id) {
            return false;
        }
        // check that all parents of the cell are visible as well
        return !this.config.hidden && (!this._parent || this._parent.isVisible());
    };
    Cell.prototype.hide = function () {
        this.config.hidden = true;
        if (this._parent && this._parent.paint) {
            this._parent.paint();
        }
    };
    Cell.prototype.show = function () {
        if (this._parent && this._parent.config.activeView) {
            this._parent.config.activeView = this.id;
        }
        else {
            this.config.hidden = false;
        }
        if (this._parent && !this._parent.isVisible()) {
            this._parent.show();
        }
        this.paint();
    };
    Cell.prototype.getParent = function () {
        return this._parent;
    };
    Cell.prototype.destructor = function () {
        this.config = null;
        this.unmount();
    };
    Cell.prototype.getWidget = function () {
        return this._ui;
    };
    Cell.prototype.getCellView = function () {
        return this._parent && this._parent.getRefs(this._uid);
    };
    Cell.prototype.attach = function (name, config) {
        this.config.html = null;
        if (typeof name === "object") {
            this._ui = name;
        }
        else if (typeof name === "string") {
            this._ui = new window.dhx[name](null, config);
        }
        else if (typeof name === "function") {
            if (name.prototype instanceof view_1.View) {
                this._ui = new name(null, config);
            }
            else {
                this._ui = {
                    getRootView: function () {
                        return name(config);
                    }
                };
            }
        }
        this.paint();
        return this._ui;
    };
    Cell.prototype.attachHTML = function (html) {
        this.config.html = html;
        this.paint();
    };
    Cell.prototype.toVDOM = function (nodes) {
        var _a;
        if (this.config === null) {
            this.config = {};
        }
        if (this.config.hidden) {
            return;
        }
        var style = this._calculateStyle();
        var stylePadding = core_1.isDefined(this.config.padding) ? { padding: this.config.padding } : {};
        var kids;
        if (!this.config.html) {
            if (this._ui) {
                var view = this._ui.getRootView();
                if (view.render) {
                    view = dom_1.inject(view);
                }
                kids = [view];
            }
            else {
                kids = nodes || null;
            }
        }
        var resizer = this.config.resizable && !this._isLastCell() && !this.config.collapsed ?
            dom_1.el(".dhx_layout-resizer." + (this._isXDirection() ? "dhx_layout-resizer--x" : "dhx_layout-resizer--y"), __assign({}, this._resizerHandlers, { _ref: "resizer_" + this._uid }), [dom_1.el("span.dhx_layout-resizer__icon", {
                    class: "dxi " + (this._isXDirection() ? "dxi-dots-vertical" : "dxi-dots-horizontal")
                })]) : null;
        var handlers = {};
        if (this.config.on) {
            for (var key in this.config.on) {
                handlers["on" + key] = this.config.on[key];
            }
        }
        var cell = dom_1.el("div", __assign((_a = { _key: this._uid, style: this.config.full || this.config.html ? style : __assign({}, style, stylePadding), _ref: this._uid }, _a["aria-labelledby"] = this.config.id ? "tab-content-" + this.config.id : null, _a), handlers, { class: this._getCss(false) +
                (this.config.css ? " " + this.config.css : "") +
                (this.config.collapsed ? " dhx_layout-cell--collapsed" : "") +
                (this.config.resizable ? " dhx_layout-cell--resizeble" : "") +
                //  только для селов
                (this.config.gravity ? " dhx_layout-cell--gravity" : "") }), this.config.full ? [
            dom_1.el("div", {
                tabindex: this.config.collapsable ? "0" : "-1",
                class: "dhx_layout-cell-header" +
                    (this._isXDirection() ? " dhx_layout-cell-header--col" : " dhx_layout-cell-header--row") +
                    (this.config.collapsable ? " dhx_layout-cell-header--collapseble" : "") +
                    (this.config.collapsed ? " dhx_layout-cell-header--collapsed" : "") +
                    (((this.getParent() || {}).config || {}).isAccordion ? " dhx_layout-cell-header--accordion" : ""),
                onclick: this._handlers.collapse,
                onkeydown: this._handlers.enterCollapse
            }, [
                this.config.headerIcon && dom_1.el("span.dhx_layout-cell-header__icon" + this.config.headerIcon),
                this.config.headerImage && dom_1.el(".dhx_layout-cell-header__image-wrapper", [
                    dom_1.el("img", {
                        src: this.config.headerImage,
                        class: "dhx_layout-cell-header__image",
                    })
                ]),
                this.config.header && dom_1.el("h3.dhx_layout-cell-header__title", this.config.header),
                this.config.collapsable && dom_1.el("div.dhx_layout-cell-header__collapse-icon", {
                    class: this._getCollapseIcon()
                }),
            ]),
            !this.config.collapsed ? dom_1.el("div", {
                "style": this.config.html || nodes ? stylePadding : null,
                ".innerHTML": this.config.html,
                "class": this._getCss(true) + " dhx_layout-cell-content",
            }, kids) : null
        ] : (this.config.html ? [
            dom_1.el(".dhx_layout-cell-content", {
                ".innerHTML": this.config.html,
                "style": stylePadding,
            })
        ] : kids));
        return resizer ? [
            cell,
            resizer
        ] : cell;
    };
    Cell.prototype._getCss = function (_content) {
        return "dhx_layout-cell";
    };
    Cell.prototype._initHandlers = function () {
        var _this = this;
        var blockOpts = {
            left: null,
            top: null,
            isActive: false,
            range: null,
            xLayout: null,
            nextCell: null,
            size: null,
            resizerLength: null,
            mode: null,
            percentsum: null
        };
        var mouseUp = function () {
            blockOpts.isActive = false;
            document.body.classList.remove("dhx_no-select--resize");
            document.removeEventListener("mouseup", mouseUp);
            document.removeEventListener("mousemove", mouseMove);
        };
        var mouseMove = function (e) {
            if (!blockOpts.isActive || blockOpts.mode === resizeMode.unknown) {
                return;
            }
            var newValue = blockOpts.xLayout
                ? e.x - blockOpts.range.min + window.pageXOffset
                : e.y - blockOpts.range.min + window.pageYOffset;
            var prop = blockOpts.xLayout ? "width" : "height";
            if (newValue < 0) {
                newValue = blockOpts.resizerLength / 2;
            }
            else if (newValue > blockOpts.size) {
                newValue = blockOpts.size - blockOpts.resizerLength;
            }
            switch (blockOpts.mode) {
                case resizeMode.pixels:
                    _this.config[prop] = newValue - blockOpts.resizerLength / 2 + "px";
                    blockOpts.nextCell.config[prop] = blockOpts.size - newValue - blockOpts.resizerLength / 2 + "px";
                    break;
                case resizeMode.mixedpx1:
                    _this.config[prop] = newValue - blockOpts.resizerLength / 2 + "px";
                    break;
                case resizeMode.mixedpx2:
                    blockOpts.nextCell.config[prop] = blockOpts.size - newValue - blockOpts.resizerLength / 2 + "px";
                    break;
                case resizeMode.percents:
                    _this.config[prop] = newValue / blockOpts.size * blockOpts.percentsum + "%";
                    blockOpts.nextCell.config[prop] = (blockOpts.size - newValue) / blockOpts.size * blockOpts.percentsum + "%";
                    break;
                case resizeMode.mixedperc1:
                    _this.config[prop] = newValue / blockOpts.size * blockOpts.percentsum + "%";
                    break;
                case resizeMode.mixedperc2:
                    blockOpts.nextCell.config[prop] = (blockOpts.size - newValue) / blockOpts.size * blockOpts.percentsum + "%";
                    break;
            }
            _this.paint();
        };
        this._handlers = {
            enterCollapse: function (e) {
                if (e.keyCode === 13) {
                    _this._handlers.collapse();
                }
            },
            collapse: function () {
                if (!_this.config.collapsable) {
                    return;
                }
                _this.config.collapsed = !_this.config.collapsed;
                _this.paint();
            }
        };
        this._resizerHandlers = {
            onmousedown: function (e) {
                if (e.which === 3) {
                    return;
                }
                if (blockOpts.isActive) {
                    mouseUp();
                }
                document.body.classList.add("dhx_no-select--resize");
                var block = _this.getCellView();
                var nextCell = _this._getNextCell();
                var nextBlock = nextCell.getCellView();
                var resizerBlock = _this._getResizerView();
                var blockOffsets = block.el.getBoundingClientRect();
                var resizerOffsets = resizerBlock.el.getBoundingClientRect();
                var nextBlockOffsets = nextBlock.el.getBoundingClientRect();
                blockOpts.xLayout = _this._isXDirection();
                blockOpts.left = blockOffsets.left + window.pageXOffset;
                blockOpts.top = blockOffsets.top + window.pageYOffset;
                blockOpts.range = getBlockRange(blockOffsets, nextBlockOffsets, blockOpts.xLayout);
                blockOpts.size = blockOpts.range.max - blockOpts.range.min;
                blockOpts.isActive = true;
                blockOpts.nextCell = nextCell;
                blockOpts.resizerLength = blockOpts.xLayout ? resizerOffsets.width : resizerOffsets.height;
                blockOpts.mode = getResizeMode(blockOpts.xLayout, _this.config, nextCell.config);
                if (blockOpts.mode === resizeMode.percents) {
                    var field = blockOpts.xLayout ? "width" : "height";
                    blockOpts.percentsum = parseFloat(_this.config[field]) + parseFloat(nextCell.config[field]);
                }
                if (blockOpts.mode === resizeMode.mixedperc1) {
                    var field = blockOpts.xLayout ? "width" : "height";
                    blockOpts.percentsum = 1 / (blockOffsets[field] / (blockOpts.size - blockOpts.resizerLength)) * parseFloat(_this.config[field]);
                }
                if (blockOpts.mode === resizeMode.mixedperc2) {
                    var field = blockOpts.xLayout ? "width" : "height";
                    blockOpts.percentsum = 1 / (nextBlockOffsets[field] / (blockOpts.size - blockOpts.resizerLength)) * parseFloat(nextCell.config[field]);
                }
                document.addEventListener("mouseup", mouseUp);
                document.addEventListener("mousemove", mouseMove);
            },
            ondragstart: function (e) { return e.preventDefault(); }
        };
    };
    Cell.prototype._getCollapseIcon = function () {
        if (this._isXDirection() && this.config.collapsed) {
            return "dxi dxi-chevron-right";
        }
        if (this._isXDirection() && !this.config.collapsed) {
            return "dxi dxi-chevron-left";
        }
        if (!this._isXDirection() && this.config.collapsed) {
            return "dxi dxi-chevron-up";
        }
        if (!this._isXDirection() && !this.config.collapsed) {
            return "dxi dxi-chevron-down";
        }
    };
    Cell.prototype._isLastCell = function () {
        var parent = this._parent;
        return parent && parent._cells.indexOf(this) === parent._cells.length - 1;
    };
    Cell.prototype._getNextCell = function () {
        var parent = this._parent;
        var index = parent._cells.indexOf(this);
        return parent._cells[index + 1];
    };
    Cell.prototype._getResizerView = function () {
        return this._parent.getRefs("resizer_" + this._uid);
    };
    Cell.prototype._isXDirection = function () {
        return this._parent && this._parent._xLayout;
    };
    Cell.prototype._calculateStyle = function () {
        var config = this.config;
        if (!config) {
            return;
        }
        var style = {};
        if (this._isXDirection()) {
            if (config.width !== undefined && !config.collapsed) {
                style.flexBasis = config.width;
                style.width = config.width;
            }
            if (config.height !== undefined) {
                style.height = config.height;
            }
        }
        else {
            if (config.height !== undefined && !config.collapsed) {
                style.flexBasis = config.height;
                style.height = config.height;
            }
            if (config.width !== undefined) {
                style.width = config.width;
            }
        }
        // if (config.padding) {
        // 	style.padding = config.padding;
        // }
        return style;
    };
    return Cell;
}(view_1.View));
exports.Cell = Cell;


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(75));
__export(__webpack_require__(28));


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var Keymanager_1 = __webpack_require__(76);
var view_1 = __webpack_require__(4);
var ts_popup_1 = __webpack_require__(16);
var types_1 = __webpack_require__(28);
function normalizeValue(value, min, max) {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
}
function parseValue(value, min, max) {
    var values;
    if (value === undefined) {
        values = [];
    }
    else if (Array.isArray(value)) {
        values = value;
    }
    else if (typeof value === "string") {
        values = value.split(",").map(function (v) { return parseInt(v, 10); });
    }
    else {
        values = [value];
    }
    values[0] = values[0] === undefined ? min : normalizeValue(values[0], min, max);
    values[1] = values[1] === undefined ? max : normalizeValue(values[1], min, max);
    return values;
}
var Slider = /** @class */ (function (_super) {
    __extends(Slider, _super);
    function Slider(container, config) {
        var _this = _super.call(this, container, core_1.extend({
            mode: types_1.Direction.horizontal,
            min: 0,
            max: 100,
            step: 1,
            thumbLabel: true,
        }, config)) || this;
        _this.events = new events_1.EventSystem(_this);
        _this._axis = _this.config.mode === types_1.Direction.horizontal ? "clientX" : "clientY";
        _this._initStartPosition();
        _this._initHotkeys();
        var vNode = dom_1.create({
            render: function () { return _this._draw(); },
            hooks: {
                didMount: function () { return _this._calcSliderPosition(); },
                didRedraw: function () { return _this._calcSliderPosition(); }
            }
        });
        _this._initHandlers();
        _this.mount(container, vNode);
        return _this;
    }
    Slider.prototype.disable = function () {
        this._disabled = true;
        this.paint();
    };
    Slider.prototype.enable = function () {
        this._disabled = false;
        this.paint();
    };
    Slider.prototype.focus = function (extra) {
        this.getRootView().refs[extra ? "extraRunner" : "runner"].el.focus();
    };
    Slider.prototype.getValue = function () {
        var res;
        if (this.config.range) {
            var a = this._getValue(this._currentPosition);
            var b = this._getValue(this._extraCurrentPosition);
            res = a < b ? [a, b] : [b, a];
        }
        else {
            res = [this._getValue(this._currentPosition)];
        }
        return res;
    };
    Slider.prototype.setValue = function (value) {
        var old = this._getValue(this._currentPosition);
        if (Array.isArray(value) && value.length > 1) {
            var oldExtra = this._getValue(this._extraCurrentPosition);
            this._setValue(value[0], false);
            this.events.fire(types_1.SliderEvents.change, [value[0], old, false]);
            this._setValue(value[1], true);
            this.events.fire(types_1.SliderEvents.change, [value[1], oldExtra, true]);
        }
        else {
            value = parseFloat(value);
            if (!isNaN(value)) {
                this._setValue(value);
                this.events.fire(types_1.SliderEvents.change, [value, old, false]);
            }
            else {
                throw new Error("Wrong value type, for more info check documentation https://docs.dhtmlx.com/suite/slider__api__slider_setvalue_method.html");
            }
        }
        this.paint();
    };
    Slider.prototype.destructor = function () {
        this._hotkeysDestructor();
        this.unmount();
    };
    Slider.prototype._calcSliderPosition = function () {
        var root = this.getRootView();
        if (!root) {
            return;
        }
        var tracker = root.refs.track.el;
        var rect = tracker.getBoundingClientRect();
        this._offsets = {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset
        };
        this._length = this.config.mode === types_1.Direction.horizontal ? rect.width : rect.height;
    };
    Slider.prototype._initHotkeys = function () {
        var _this = this;
        var isRunnersInFocus = function () {
            var activeEl = document.activeElement;
            var refs = _this.getRootView().refs;
            if (!refs) {
                return false;
            }
            var runner = refs.runner;
            if (runner && runner.el === activeEl) {
                return true;
            }
            if (_this.config.range && refs.extraRunner && refs.extraRunner.el === activeEl) {
                return true;
            }
            return false;
        };
        this._hotkeysDestructor = Keymanager_1.addHotkeys({
            arrowleft: function (e) {
                if (_this.config.mode === types_1.Direction.vertical) {
                    return;
                }
                e.preventDefault();
                _this._move(-_this.config.step, e.target.classList.contains("dhx_slider__thumb--extra"));
            },
            arrowright: function (e) {
                if (_this.config.mode === types_1.Direction.vertical) {
                    return;
                }
                e.preventDefault();
                _this._move(_this.config.step, e.target.classList.contains("dhx_slider__thumb--extra"));
            },
            arrowup: function (e) {
                if (_this.config.mode === types_1.Direction.horizontal) {
                    return;
                }
                e.preventDefault();
                _this._move(_this.config.step, e.target.classList.contains("dhx_slider__thumb--extra"));
            },
            arrowdown: function (e) {
                if (_this.config.mode === types_1.Direction.horizontal) {
                    return;
                }
                e.preventDefault();
                _this._move(-_this.config.step, e.target.classList.contains("dhx_slider__thumb--extra"));
            }
        }, isRunnersInFocus);
    };
    Slider.prototype._move = function (value, forExtra) {
        if (this.config.inverse) {
            value = -value;
        }
        var oldValue = forExtra ? this._getValue(this._extraCurrentPosition) : this._getValue(this._currentPosition);
        var newValue = oldValue + value;
        this._setValue(oldValue + value, forExtra);
        this.events.fire(types_1.SliderEvents.change, [newValue, oldValue, forExtra]);
        this.paint();
    };
    Slider.prototype._initStartPosition = function () {
        var _a = this.config, max = _a.max, min = _a.min, range = _a.range;
        var _b = parseValue(this.config.value, this.config.min, this.config.max), value = _b[0], extraValue = _b[1];
        this._currentPosition = (value - min) / (max - min) * 100;
        if (range) {
            this._extraCurrentPosition = (max - extraValue) / (max - min) * 100;
        }
        this._currentPosition = (value - min) / (max - min) * 100;
        if (range) {
            this._extraCurrentPosition = (extraValue - min) / (max - min) * 100;
        }
        if (this._isInverse()) {
            this._currentPosition = 100 - this._currentPosition;
            if (range) {
                this._extraCurrentPosition = 100 - this._extraCurrentPosition;
            }
        }
    };
    Slider.prototype._getValue = function (value) {
        if (this._isInverse()) {
            value = 100 - value;
        }
        var _a = this.config, min = _a.min, max = _a.max, step = _a.step;
        if (value === 100) {
            return max;
        }
        if (value === 0) {
            return min;
        }
        var val = value * (max - min) / 100;
        var remain = val % step;
        var rounder = remain >= step / 2 ? step : 0;
        var result = Number(min) + Number(val) - remain + rounder;
        return +result.toFixed(5);
    };
    Slider.prototype._setValue = function (val, forExtra) {
        if (forExtra === void 0) { forExtra = false; }
        var _a = this.config, max = _a.max, min = _a.min;
        if (val > max || val < min) {
            return false;
        }
        var rawValue = (val - min) / (max - min) * 100;
        var newValue = this._isInverse() ? 100 - rawValue : rawValue;
        if (forExtra) {
            this._extraCurrentPosition = newValue;
        }
        else {
            this._currentPosition = newValue;
        }
    };
    Slider.prototype._initHandlers = function () {
        var _this = this;
        var mouseMove = function (e) {
            e.preventDefault();
            var x = (e[_this._axis] - _this._getBegining()) / _this._length * 100;
            if (_this._findNewDirection) {
                if (Math.abs(_this._currentPosition - x) < 1) {
                    return;
                }
                if (x > _this._currentPosition) {
                    _this._possibleRange = [_this._currentPosition, 100];
                }
                else {
                    _this._possibleRange = [0, _this._currentPosition];
                }
                _this._findNewDirection = null;
            }
            if (_this._inSide(x)) {
                _this._updatePosition(x, _this._isExtraActive);
            }
            _this.paint();
        };
        var mouseUp = function (e) {
            _this.events.fire(types_1.SliderEvents.mouseup, [e]);
            setTimeout(function () {
                _this._isMouseMoving = false;
                _this.paint();
            }, 4);
            document.removeEventListener("mouseup", mouseUp);
            document.removeEventListener("mousemove", mouseMove);
        };
        if (this.config.help) {
            this._helper = new ts_popup_1.Popup({ css: "dhx_tooltip dhx_tooltip--forced dhx_tooltip--light" });
            this._helper.attachHTML(this.config.help);
        }
        this._handlers = {
            showHelper: function (e) {
                e.preventDefault();
                e.stopPropagation();
                _this._helper.show(e.target);
            },
            onmousedown: function (e) {
                if (_this._disabled || e.which === 3) {
                    return;
                }
                _this.events.fire(types_1.SliderEvents.mousedown, [e]);
                _this._isMouseMoving = true;
                var active;
                if (e.target.classList.contains("dhx_slider__thumb--extra")) {
                    _this._isExtraActive = true;
                    active = _this._extraCurrentPosition;
                }
                else {
                    _this._isExtraActive = false;
                    active = _this._currentPosition;
                }
                _this._findNewDirection = null;
                // define possible range
                if (_this.config.range) {
                    var _a = _this._currentPosition > _this._extraCurrentPosition ?
                        [_this._currentPosition, _this._extraCurrentPosition] : [_this._extraCurrentPosition, _this._currentPosition], more = _a[0], less = _a[1];
                    if (_this._currentPosition === _this._extraCurrentPosition) {
                        _this._findNewDirection = active;
                        _this._possibleRange = [0, 100];
                    }
                    else if (active < more) {
                        _this._possibleRange = [0, more];
                    }
                    else {
                        _this._possibleRange = [less, 100];
                    }
                }
                else {
                    _this._possibleRange = [0, 100];
                }
                document.addEventListener("mousemove", mouseMove);
                document.addEventListener("mouseup", mouseUp);
            },
            onlabelClick: function () {
                var refs = _this.getRootView().refs;
                refs.runner.el.focus();
            },
            onclick: function (e) {
                if (_this._disabled || _this._isMouseMoving || e.which === 3) {
                    return;
                }
                var x = (e[_this._axis] - _this._getBegining()) / _this._length * 100;
                var refs = _this.getRootView().refs;
                if (_this.config.range) {
                    var dist = Math.abs(_this._currentPosition - x);
                    var extraDist = Math.abs(_this._extraCurrentPosition - x);
                    if (dist < extraDist) {
                        _this._updatePosition(x, false);
                        refs.runner.el.focus();
                    }
                    else {
                        _this._updatePosition(x, true);
                        refs.extraRunner.el.focus();
                    }
                }
                else {
                    _this._updatePosition(x, false);
                    refs.runner.el.focus();
                }
                _this.paint();
            },
            onmouseover: function () {
                _this._mouseIn = true;
                _this.paint();
            },
            onmouseout: function () {
                _this._mouseIn = false;
                _this.paint();
            },
            onfocus: function () {
                _this._focusIn = true;
                _this.paint();
            },
            onblur: function () {
                _this._focusIn = false;
                _this.paint();
            }
        };
    };
    Slider.prototype._getBegining = function () {
        return this.config.mode === types_1.Direction.horizontal ? this._offsets.left - window.pageXOffset : this._offsets.top - window.pageYOffset;
    };
    Slider.prototype._inSide = function (x) {
        var range = this._possibleRange;
        if (x < range[0]) {
            this._updatePosition(range[0], this._isExtraActive);
            return false;
        }
        if (x > range[1]) {
            this._updatePosition(range[1], this._isExtraActive);
            return false;
        }
        return true;
    };
    Slider.prototype._updatePosition = function (x, extra) {
        if (extra === void 0) { extra = false; }
        if (x > 100) {
            x = 100;
        }
        if (x < 0) {
            x = 0;
        }
        var _a = this.config, max = _a.max, min = _a.min;
        var position = extra ? this._extraCurrentPosition : this._currentPosition;
        var oldValue = this._getValue(position);
        var newValue = this._getValue(x);
        if (oldValue === newValue) {
            return;
        }
        var rawValue = (newValue - min) / (max - min) * 100;
        var value = this._isInverse() ? 100 - rawValue : rawValue;
        if (extra) {
            this._extraCurrentPosition = value;
        }
        else {
            this._currentPosition = value;
        }
        this.events.fire(types_1.SliderEvents.change, [newValue, oldValue, extra]);
    };
    Slider.prototype._getRunnerStyle = function (forExtra) {
        if (forExtra === void 0) { forExtra = false; }
        var _a;
        var direction = this.config.mode === types_1.Direction.horizontal ? "left" : "top";
        var pos = forExtra ? this._extraCurrentPosition : this._currentPosition;
        return _a = {},
            _a[direction] = pos + "%",
            _a;
    };
    Slider.prototype._isInverse = function () {
        return (this.config.inverse && this.config.mode === types_1.Direction.horizontal) ||
            (!this.config.inverse && this.config.mode === types_1.Direction.vertical);
    };
    Slider.prototype._getRunnerCss = function (forExtra) {
        if (forExtra === void 0) { forExtra = false; }
        return "dhx_slider__thumb" +
            (forExtra ? " dhx_slider__thumb--extra" : "") +
            (this._isMouseMoving && ((forExtra && this._isExtraActive) || (!forExtra && !this._isExtraActive)) ? " dhx_slider__thumb--active" : "") +
            (this._disabled ? " dhx_slider__thumb--disabled" : "") +
            (this._isNullable(forExtra ? this._extraCurrentPosition : this._currentPosition) && !this.config.range ? " dhx_slider__thumb--nullable" : "");
    };
    Slider.prototype._draw = function () {
        var width = this.config.labelInline && this.config.labelWidth ? this.config.labelWidth : "";
        return dom_1.el("div", {
            class: "dhx_slider" +
                " dhx_slider--mode_" + this.config.mode +
                (this.config.label && this.config.labelInline ? " dhx_slider--label-inline" : "") +
                (this.config.hiddenLabel ? " dhx_slider--label_sr" : "") +
                (this.config.tick ? " dhx_slider--ticks" : "") +
                (this.config.majorTick ? " dhx_slider--major-ticks" : "") +
                (this.config.css ? " " + this.config.css : "")
        }, [
            this.config.label ? dom_1.el("label.dhx_label.dhx_slider__label", {
                style: { minWidth: width, maxWidth: width },
                class: this.config.help ? "dhx_label--with-help" : "",
                onclick: this._handlers.onlabelClick,
            }, this.config.help ? [
                dom_1.el("span.dhx_label__holder", this.config.label),
                dom_1.el("span.dhx_label-help.dxi.dxi-help-circle-outline", {
                    tabindex: "0",
                    role: "button",
                    onclick: this._handlers.showHelper
                }),
            ] : this.config.label) : null,
            this._drawSlider()
        ]);
    };
    Slider.prototype._drawSlider = function () {
        return dom_1.el(".dhx_widget.dhx_slider__track-holder", 
        // (this.config.mode === Direction.vertical ? ".dhx_slider--vertical" : ".dhx_slider--horizontal"),
        {
            dhx_widget_id: this._uid,
        }, [
            dom_1.el(".dhx_slider__track", {
                _ref: "track",
                onmouseover: this._handlers.onmouseover,
                onmouseout: this._handlers.onmouseout,
                onclick: this._handlers.onclick
            }, [
                this._getDetector(),
                dom_1.el("div", {
                    _ref: "runner",
                    class: this._getRunnerCss(),
                    onmousedown: this._handlers.onmousedown,
                    onmousemove: this._handlers.onmousemove,
                    onfocus: this._handlers.onfocus,
                    onblur: this._handlers.onblur,
                    style: this._getRunnerStyle(),
                    tabindex: 0,
                }),
                this.config.thumbLabel && (this._mouseIn || this._focusIn || this._isMouseMoving) ? this._drawThumbLabel() : null,
                this.config.thumbLabel && this.config.range && (this._mouseIn || this._focusIn || this._isMouseMoving) ? this._drawThumbLabel(true) : null,
                this.config.range ? dom_1.el("div", {
                    _ref: "extraRunner",
                    class: this._getRunnerCss(true),
                    onmousedown: this._handlers.onmousedown,
                    onmousemove: this._handlers.onmousemove,
                    onfocus: this._handlers.onfocus,
                    onblur: this._handlers.onblur,
                    style: this._getRunnerStyle(true),
                    tabindex: 0,
                }) : null,
            ]),
            this.config.tick ? this._drawTicks() : null
        ]);
    };
    Slider.prototype._getDetector = function () {
        var _a, _b, _c;
        if (this._disabled) {
            return dom_1.el(".dhx_slider__range");
        }
        var direction = this.config.mode === types_1.Direction.horizontal ? "left" : "top";
        var size = this.config.mode === types_1.Direction.horizontal ? "width" : "height";
        if (this.config.range) {
            var _d = this._currentPosition > this._extraCurrentPosition ?
                [this._currentPosition, this._extraCurrentPosition] : [this._extraCurrentPosition, this._currentPosition], more = _d[0], less = _d[1];
            return dom_1.el(".dhx_slider__range", {
                style: (_a = {},
                    _a[direction] = less + "%",
                    _a[size] = more - less + "%",
                    _a)
            });
        }
        if (this._isInverse()) {
            return dom_1.el(".dhx_slider__range", {
                style: (_b = {},
                    _b[direction] = this._currentPosition + "%",
                    _b[size] = 100 - this._currentPosition + "%",
                    _b)
            });
        }
        return dom_1.el(".dhx_slider__range", {
            style: (_c = {},
                _c[direction] = 0,
                _c[size] = this._currentPosition + "%",
                _c)
        });
    };
    Slider.prototype._drawThumbLabel = function (forExtra) {
        if (forExtra === void 0) { forExtra = false; }
        var _a;
        var pos = forExtra ? this._extraCurrentPosition : this._currentPosition;
        var direction = this.config.mode === types_1.Direction.horizontal ? "left" : "top";
        var classNameModifiers = this.config.mode === types_1.Direction.horizontal ? ".dhx_slider__thumb-label--horizontal" : ".dhx_slider__thumb-label--vertical";
        if ((forExtra && this._isExtraActive) || (!forExtra && !this._isExtraActive)) {
            classNameModifiers += ".dhx_slider__thumb-label--active";
        }
        var style = (_a = {},
            _a[direction] = pos + "%",
            _a);
        return dom_1.el(".dhx_slider__thumb-label" + classNameModifiers, {
            style: style
        }, this._getValue(pos));
    };
    Slider.prototype._getTicks = function () {
        var _a = this.config, max = _a.max, min = _a.min, step = _a.step, tick = _a.tick, majorTick = _a.majorTick;
        var len = max - min;
        var tickLength = (step * tick) / len;
        var positions = [];
        var length = 0;
        var index = 0;
        while (length < 1) {
            var tickValue = +(Number(min) + length * len).toFixed(5);
            var isMultiple = index % majorTick === 0;
            positions.push({
                position: (this._isInverse() ? (1 - length) * 100 : length * 100) + "%",
                isMultiple: isMultiple,
                label: isMultiple && typeof this.config.tickTemplate === "function" ? this.config.tickTemplate(tickValue) : null
            });
            length += tickLength;
            index++;
        }
        positions.push({
            position: (this._isInverse() ? 0 : 100) + "%",
            isMultiple: true,
            label: typeof this.config.tickTemplate === "function" ?
                this.config.tickTemplate(max) : null
        });
        return positions;
    };
    Slider.prototype._drawTicks = function () {
        var direction = this.config.mode === types_1.Direction.horizontal ? "left" : "top";
        return dom_1.el(".dhx_slider__ticks-holder", this._getTicks().map(function (tick) {
            var _a;
            return dom_1.el("div", {
                class: "dhx_slider__tick" + (tick.isMultiple ? " dhx_slider__tick--major" : ""),
                style: (_a = {},
                    _a[direction] = tick.position,
                    _a)
            }, tick.label !== undefined ? [
                dom_1.el(".dhx_slider__tick-label", tick.label)
            ] : null);
        }));
    };
    Slider.prototype._isNullable = function (value) {
        if (this._isInverse()) {
            return value === 100;
        }
        else {
            return value === 0;
        }
    };
    return Slider;
}(view_1.View));
exports.Slider = Slider;


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getHotKeyCode(code) {
    var matches = code.toLowerCase().match(/\w+/g);
    var comp = 0;
    var key = "";
    for (var i = 0; i < matches.length; i++) {
        var check = matches[i];
        if (check === "ctrl") {
            comp += 4;
        }
        else if (check === "shift") {
            comp += 2;
        }
        else if (check === "alt") {
            comp += 1;
        }
        else {
            key = check;
        }
    }
    return comp + key;
}
var KeyManager = /** @class */ (function () {
    function KeyManager() {
        var _this = this;
        this._keysStorage = {};
        document.addEventListener("keydown", function (e) {
            var comp = (e.ctrlKey || e.metaKey ? 4 : 0) + (e.shiftKey ? 2 : 0) + (e.altKey ? 1 : 0);
            var key;
            if ((e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90)) { // A-Z 0-9
                key = String.fromCharCode(e.which);
            }
            else {
                key = e.key;
            }
            var code = comp + (key && key.toLowerCase());
            var actions = _this._keysStorage[code];
            if (actions) {
                for (var i = 0; i < actions.length; i++) {
                    actions[i].handler(e);
                }
            }
        });
    }
    KeyManager.prototype.addHotKey = function (key, handler, scope) {
        var code = getHotKeyCode(key);
        if (!this._keysStorage[code]) {
            this._keysStorage[code] = [];
        }
        this._keysStorage[code].push({
            handler: handler,
            scope: scope
        });
    };
    KeyManager.prototype.removeHotKey = function (key, scope) {
        var keyStorage = this._keysStorage;
        if (key) {
            var code = getHotKeyCode(key);
            delete keyStorage[code];
        }
        if (scope) {
            for (var code in keyStorage) {
                var toDelete = []; // items index to delete
                for (var i = 0; i < keyStorage[code].length; i++) {
                    if (keyStorage[code][i].scope === scope) {
                        toDelete.push(i);
                    }
                }
                if (keyStorage[code].length === toDelete.length) {
                    delete keyStorage[code];
                }
                else {
                    for (var i = toDelete.length - 1; i >= 0; i--) { // begin from last coz splice change other index
                        keyStorage[code].splice(toDelete[i], 1);
                    }
                }
            }
        }
    };
    KeyManager.prototype.exist = function (key) {
        var code = getHotKeyCode(key);
        return !!this._keysStorage[code];
    };
    return KeyManager;
}());
exports.keyManager = new KeyManager();
function addHotkeys(handlers, beforeCall) {
    var context = new Date();
    var wrapHandler = function (handler) { return function (e) {
        if (beforeCall && beforeCall() === false) {
            return;
        }
        handler(e);
    }; };
    for (var key in handlers) {
        exports.keyManager.addHotKey(key, wrapHandler(handlers[key]), context);
    }
    return function () { return exports.keyManager.removeHotKey(undefined, context); };
}
exports.addHotkeys = addHotkeys;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var dom_1 = __webpack_require__(1);
var events_1 = __webpack_require__(5);
var html_1 = __webpack_require__(2);
var view_1 = __webpack_require__(4);
var types_1 = __webpack_require__(27);
var Popup = /** @class */ (function (_super) {
    __extends(Popup, _super);
    function Popup(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, null, core_1.extend({}, config)) || this;
        var popup = _this._popup = document.createElement("div");
        popup.className = "dhx_widget dhx_popup" + (_this.config.css ? " " + _this.config.css : "");
        popup.style.position = "absolute";
        _this.mount(popup, dom_1.create({
            render: function () { return _this.toVDOM(); }
        }));
        _this._clickEvent = function (e) { return _this.events.fire(types_1.PopupEvents.click, [e]); };
        _this.events = config.events || new events_1.EventSystem(_this);
        _this._isActive = false;
        return _this;
    }
    Popup.prototype.show = function (node, config, attached) {
        var _this = this;
        if (config === void 0) { config = {}; }
        if (!this.events.fire(types_1.PopupEvents.beforeShow, [node])) {
            return;
        }
        node = html_1.toNode(node);
        if (this._isActive) {
            this._setPopupSize(node, config);
            return;
        }
        if (attached) {
            this.attach(attached);
        }
        this._popup.style.left = "0";
        this._popup.style.top = "0";
        document.body.appendChild(this._popup);
        this._setPopupSize(node, config);
        this._isActive = true;
        setTimeout(function () {
            _this.events.fire(types_1.PopupEvents.afterShow, [node]);
            _this._outerClickDestructor = _this._detectOuterClick(node);
        }, 100);
    };
    Popup.prototype.hide = function () {
        this._hide(false, null);
    };
    Popup.prototype.isVisible = function () {
        return this._isActive;
    };
    Popup.prototype.attach = function (name, config) {
        this._html = null;
        if (typeof name === "object") {
            this._ui = name;
        }
        else if (typeof name === "string") {
            this._ui = new window.dhx[name](null, config);
        }
        else if (typeof name === "function") {
            if (name.prototype instanceof view_1.View) {
                this._ui = new name(null, config);
            }
            else {
                this._ui = {
                    getRootView: function () {
                        return name(config);
                    }
                };
            }
        }
        this.paint();
        return this._ui;
    };
    Popup.prototype.attachHTML = function (html) {
        this._html = html;
        this.paint();
    };
    Popup.prototype.getWidget = function () {
        return this._ui;
    };
    Popup.prototype.getContainer = function () {
        return this.getRootView().refs.content.el;
    };
    Popup.prototype.toVDOM = function () {
        var view;
        if (this._html) {
            view = dom_1.el(".dhx_popup__inner-html-content", {
                ".innerHTML": this._html
            });
        }
        else {
            view = this._ui ? this._ui.getRootView() : null;
            if (view && view.render) {
                view = dom_1.inject(view);
            }
        }
        return dom_1.el("div", {
            class: "dhx_popup-content",
            onclick: this._clickEvent,
            _key: this._uid,
            _ref: "content"
        }, [view]);
    };
    Popup.prototype.destructor = function () {
        this.hide();
        if (this._outerClickDestructor) {
            this._outerClickDestructor();
        }
        this._popup = null;
    };
    Popup.prototype._setPopupSize = function (node, config, calls) {
        var _this = this;
        if (calls === void 0) { calls = 3; }
        var _a = this._popup.getBoundingClientRect(), width = _a.width, height = _a.height;
        // TODO: IE popup height = 0
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        if (calls && (width === 0 || height === 0)) {
            this._timeout = setTimeout(function () {
                if (!_this._isActive) {
                    return;
                }
                _this._setPopupSize(node, config, calls - 1);
                _this._timeout = null;
            });
            return;
        }
        var _b = html_1.fitPosition(node, __assign({ centering: true, mode: html_1.Position.bottom }, config, { width: width, height: height })), left = _b.left, top = _b.top;
        this._popup.style.left = left;
        this._popup.style.top = top;
        if (config.indent && config.indent !== 0) {
            switch (config.mode) {
                case html_1.Position.top:
                    this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) - parseInt(config.indent.toString(), null) + "px";
                    break;
                case html_1.Position.bottom:
                    this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) + parseInt(config.indent.toString(), null) + "px";
                    break;
                case html_1.Position.left:
                    this._popup.style.left = parseInt(this._popup.style.left.slice(0, -2), null) - parseInt(config.indent.toString(), null) + "px";
                    break;
                case html_1.Position.right:
                    this._popup.style.left = parseInt(this._popup.style.left.slice(0, -2), null) + parseInt(config.indent.toString(), null) + "px";
                    break;
                default:
                    this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) + parseInt(config.indent.toString(), null) + "px";
                    break;
            }
        }
    };
    Popup.prototype._detectOuterClick = function (node) {
        var _this = this;
        var outerClick = function (e) {
            var target = e.target;
            while (target) {
                if (target === node || target === _this._popup) {
                    return;
                }
                target = target.parentNode;
            }
            if (_this._hide(true, e)) {
                document.removeEventListener("click", outerClick);
            }
        };
        document.addEventListener("click", outerClick);
        return function () { return document.removeEventListener("click", outerClick); };
    };
    Popup.prototype._hide = function (fromOuterClick, e) {
        if (this._isActive) {
            if (!this.events.fire(types_1.PopupEvents.beforeHide, [fromOuterClick, e])) {
                return false;
            }
            document.body.removeChild(this._popup);
            this._isActive = false;
            if (this._outerClickDestructor) {
                this._outerClickDestructor();
                this._outerClickDestructor = null;
            }
            this.events.fire(types_1.PopupEvents.afterHide, [e]);
            return true;
        }
    };
    return Popup;
}(view_1.View));
exports.Popup = Popup;


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var locale = {
    hours: "Hours",
    minutes: "Minutes",
    save: "save"
};
exports.default = locale;


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function is designed to resolve conflicts with the time setting for the 12 hour format.
 */
function isTimeCheck(value) {
    return /(^12:[0-5][0-9]?AM$)/i.test(value);
}
exports.isTimeCheck = isTimeCheck;


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var DateFormatter_1 = __webpack_require__(17);
var DateHelper = /** @class */ (function () {
    function DateHelper() {
    }
    DateHelper.copy = function (d) {
        return new Date(d);
    };
    DateHelper.fromYear = function (year) {
        return new Date(year, 0, 1);
    };
    DateHelper.fromYearAndMonth = function (year, month) {
        return new Date(year, month, 1);
    };
    DateHelper.weekStart = function (d, firstWeekday) {
        var diff = (d.getDay() + 7 - firstWeekday) % 7;
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
    };
    DateHelper.monthStart = function (d) {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    };
    DateHelper.yearStart = function (d) {
        return new Date(d.getFullYear(), 0, 1);
    };
    DateHelper.dayStart = function (d) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };
    DateHelper.addDay = function (d, count) {
        if (count === void 0) { count = 1; }
        return new Date(d.getFullYear(), d.getMonth(), d.getDate() + count);
    };
    DateHelper.addMonth = function (d, count) {
        if (count === void 0) { count = 1; }
        return new Date(d.getFullYear(), d.getMonth() + count, 1);
    };
    DateHelper.addYear = function (d, count) {
        if (count === void 0) { count = 1; }
        return new Date(d.getFullYear() + count, d.getMonth(), 0);
    };
    DateHelper.withHoursAndMinutes = function (d, hours, minutes) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours, minutes);
    };
    DateHelper.setMonth = function (d, month) {
        d.setMonth(month);
    };
    DateHelper.setYear = function (d, year) {
        d.setFullYear(year);
    };
    DateHelper.mergeHoursAndMinutes = function (source, target) {
        return new Date(source.getFullYear(), source.getMonth(), source.getDate(), target.getHours(), target.getMinutes());
    };
    DateHelper.isWeekEnd = function (d) {
        return d.getDay() === 0 || d.getDay() === 6;
    };
    DateHelper.getTwelweYears = function (d) {
        var y = d.getFullYear();
        var firstYear = y - y % 12;
        return core_1.range(firstYear, firstYear + 11);
    };
    DateHelper.getWeekNumber = function (d) {
        if (d.getDay() !== 6) {
            d = DateHelper.addDay(d, 6 - d.getDay());
        }
        var dayMS = 24 * 60 * 60 * 1000;
        var ordinal = (d.valueOf() - DateHelper.yearStart(d).valueOf()) / dayMS;
        return Math.floor((ordinal - d.getDay() + 10) / 7);
    };
    DateHelper.isSameDay = function (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    };
    DateHelper.toDateObject = function (date, dateFormat) {
        if (typeof date === "string") {
            return DateFormatter_1.stringToDate(date, dateFormat);
        }
        else {
            return new Date(date);
        }
    };
    DateHelper.nullTimestampDate = new Date(0);
    return DateHelper;
}());
exports.DateHelper = DateHelper;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.linkButtonClasses = ".dhx_button.dhx_button--view_link.dhx_button--icon.dhx_button--size_medium.dhx_button--color_secondary";


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var html_1 = __webpack_require__(2);
var Cells_1 = __webpack_require__(25);
var FixedRows_1 = __webpack_require__(32);
function getFixedCols(renderConfig, layout) {
    if (typeof renderConfig.splitAt !== "number") {
        return;
    }
    var scrollBarWidth = renderConfig.$totalWidth <= layout.wrapper.width ? 0 : html_1.getScrollbarWidth();
    var fixedColsHeight = (layout.sticky ?
        layout.gridBodyHeight
        : layout.gridBodyHeight + renderConfig.headerHeight) - scrollBarWidth;
    var columns = renderConfig.columns.slice(0, renderConfig.splitAt);
    renderConfig.fixedColumnsWidth = columns.reduce(function (total, item) { return total += item.width || 100; }, 0);
    var fixedCols = Cells_1.getCells(__assign({}, renderConfig, { columns: columns, $positions: __assign({}, renderConfig.$positions, { xStart: 0, xEnd: renderConfig.splitAt }) }));
    var isSticky = layout.sticky;
    var headerRowsConfig = __assign({}, layout, { name: "header", position: "top" });
    var footerRowsConfig = __assign({}, layout, { name: "footer", position: "bottom" });
    var frozenHeaderCols = renderConfig.splitAt >= 0 && FixedRows_1.getRows(__assign({}, renderConfig, { currentColumns: renderConfig.columns.slice(0, renderConfig.splitAt), $positions: __assign({}, renderConfig.$positions, { xStart: 0, xEnd: renderConfig.splitAt }) }), __assign({}, layout, { name: "header", position: "top" }));
    var frozenFooterCols = renderConfig.splitAt >= 0 && FixedRows_1.getRows(__assign({}, renderConfig, { currentColumns: renderConfig.columns.slice(0, renderConfig.splitAt), $positions: __assign({}, renderConfig.$positions, { xStart: 0, xEnd: renderConfig.splitAt }) }), __assign({}, layout, { name: "footer", position: "bottom" }));
    var frozenHeader = frozenHeaderCols && dom_1.el(".dhx_" + headerRowsConfig.name + "-fixed-cols", {
        style: {
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999999,
        }
    }, frozenHeaderCols);
    var frozenFooter = isSticky ? (frozenFooterCols && dom_1.el(".dhx_" + footerRowsConfig.name + "-fixed-cols", {
        style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 999999,
        }
    }, frozenFooterCols)) : null;
    return dom_1.el(".dhx_grid-fixed-cols-wrap", {
        style: {
            height: fixedColsHeight,
            paddingTop: renderConfig.headerHeight,
            overflow: "hidden",
            width: renderConfig.fixedColumnsWidth
        }
    }, [
        frozenHeader,
        dom_1.el(".dhx_grid-fixed-cols", {
            style: {
                top: -renderConfig.scroll.top + renderConfig.headerHeight + "px",
                paddingTop: layout.shifts.y,
                height: renderConfig.$totalHeight,
                position: "absolute"
            }
        }, fixedCols),
        renderConfig.$footer && frozenFooter,
        dom_1.el(".dhx_frozen-cols-border")
    ]);
}
exports.getFixedCols = getFixedCols;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ts_grid_1 = __webpack_require__(24);
exports.TreeGridEvents = ts_grid_1.GridEvents;


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var html_1 = __webpack_require__(2);
var helpers_1 = __webpack_require__(18);
var types_1 = __webpack_require__(19);
var Filter_1 = __webpack_require__(37);
var DateFilter = /** @class */ (function (_super) {
    __extends(DateFilter, _super);
    function DateFilter(config) {
        var _this = _super.call(this, config) || this;
        _this._htmlEvents.oninput = html_1.eventHandler(function (ev) { return html_1.locate(ev); }, {
            dhx_date_from: function (e) {
                _this._checkInputText(e, "from");
            },
            dhx_date_to: function (e) {
                _this._checkInputText(e, "to");
            }
        });
        return _this;
    }
    DateFilter.prototype._checkInputText = function (e, inputId) {
        var _this = this;
        if (this._inputTimeout) {
            clearTimeout(this._inputTimeout);
            this._inputTimeout = null;
        }
        this._inputTimeout = setTimeout(function () {
            if (!_this._validateInput(e.target.value)) {
                e.target.parentNode.classList.add("dhx_alert");
            }
            else {
                e.target.parentNode.classList.remove("dhx_alert");
                _this._meta.filter[inputId] = e.target.value;
                _this.config.events.fire(types_1.PivotEvents.update);
            }
        }, 500);
    };
    DateFilter.prototype._validateInput = function (val) {
        if (!val) {
            return true;
        }
        return new RegExp(this.mask, "g").test(val);
    };
    DateFilter.prototype._createMask = function () {
        this._format = this._meta.inputFormat;
        var match = this._format.match(/(%[a-zA-Z])/g);
        var delimiter = this._format.match(/([^\%a-zA-Z])/g)[0];
        var placeholder = [];
        var mask = [];
        for (var _i = 0, match_1 = match; _i < match_1.length; _i++) {
            var rule = match_1[_i];
            switch (rule) {
                case "%d":
                    placeholder.push("DD");
                    mask.push("(0[1-9]|[12]\\d|3[01])");
                    break;
                case "%j":
                    placeholder.push("DD");
                    mask.push("([1-9]|[12]\\d|3[01])");
                    break;
                case "%m":
                    placeholder.push("MM");
                    mask.push("(0?[1-9]|1[012])");
                    break;
                case "%n":
                    placeholder.push("MM");
                    mask.push("([1-9]|1[012])");
                    break;
                case "%Y":
                    placeholder.push("YYYY");
                    mask.push("[1-2][0-9]{3}");
                    break;
                case "%y":
                    placeholder.push("YY");
                    mask.push("[0-9]{2}");
                    break;
            }
        }
        this.mask = mask.join("\\W");
        this.placeholder = placeholder.join(delimiter);
    };
    DateFilter.prototype._setMeta = function (oldMeta) {
        this._meta = oldMeta || {};
        this._meta.values = this._meta.values || this._data.slice();
        this._meta.filter = this._meta.filter || { from: "", to: "" };
        this._meta.inputFormat = this._meta.inputFormat || this._item.inputFormat || this._item.format || "%d.%m.%Y";
        this._createMask();
    };
    DateFilter.prototype._getFilterInput = function () {
        return dom_1.el(".dhx_filter--date-field", [
            dom_1.el(".dhx_date_input", [
                dom_1.el("input.dhx_input", { class: "dhx_date_from", type: "text", placeholder: this.placeholder, _key: "from" })
            ]),
            dom_1.el(".dhx_date_input", [
                dom_1.el("input.dhx_input", { class: "dhx_date_to", type: "text", placeholder: this.placeholder, _key: "to" })
            ])
        ]);
    };
    DateFilter.prototype._formatLabel = function (label) {
        return helpers_1.dateToStr(new Date(label), this._meta.inputFormat);
    };
    DateFilter.prototype._getCheckboxData = function () {
        var filter = this._meta.filter;
        var data = this._data;
        var operation = function (cur, from, to) { return cur >= from && cur <= to; };
        if (filter.from || filter.to) {
            var from_1 = filter.from ?
                helpers_1.strToDate(filter.from, this._meta.inputFormat).getTime()
                : Math.min.apply(Math, data);
            var to_1 = filter.to ?
                helpers_1.strToDate(filter.to, this._meta.inputFormat).getTime()
                : Math.max.apply(Math, data);
            return data.filter(function (item) { return operation(item, from_1, to_1); });
        }
        else {
            return data;
        }
    };
    return DateFilter;
}(Filter_1.Filter));
exports.DateFilter = DateFilter;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var en_1 = __webpack_require__(6);
var DateFormatter = /** @class */ (function () {
    function DateFormatter() {
        this.custom = {}; // hash of custom data adding modes
        this.locale = {};
        try {
            if (dhx.i18n.pivot.date) {
                this.locale.date = dhx.i18n.pivot.date;
            }
            else {
                throw new Error();
            }
        }
        catch (err) {
            this.locale.date = en_1.default.date;
        }
        this.startOnMonday = true; // FIXME
        this._len = {
            year: 60 * 60 * 24 * 364.25,
            month: 60 * 60 * 24 * 30.5,
            day: 60 * 60 * 24,
            hour: 60 * 60,
            minute: 60,
            second: 1
        };
    }
    DateFormatter.prototype.date_part = function (date) {
        var old = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        if (date.getHours() && // shift to yesterday on dst
            (date.getDate() < old.getDate() || date.getMonth() < old.getMonth() || date.getFullYear() < old.getFullYear())) {
            date.setTime(date.getTime() + 60 * 60 * 1000 * (24 - date.getHours()));
        }
        return date;
    };
    DateFormatter.prototype.time_part = function (date) {
        return (date.valueOf() / 1000 - date.getTimezoneOffset() * 60) % 86400;
    };
    DateFormatter.prototype.week_start = function (date) {
        var shift = date.getDay();
        if (this.startOnMonday) {
            if (shift === 0) {
                shift = 6;
            }
            else {
                shift--;
            }
        }
        return this.date_part(this.add(date, -1 * shift, "day"));
    };
    DateFormatter.prototype.month_start = function (date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    };
    DateFormatter.prototype.month_end = function (date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    };
    DateFormatter.prototype.year_start = function (date) {
        date.setMonth(0);
        return this.month_start(date);
    };
    DateFormatter.prototype.day_start = function (date) {
        return this.date_part(date);
    };
    DateFormatter.prototype.length = function (a, b, unit) {
        unit = unit || "day";
        return Math.abs(Math.round((a.valueOf() - b.valueOf()) / (1000 * this._len[unit])));
    };
    DateFormatter.prototype._add_days = function (date, inc) {
        var ndate = new Date(date.valueOf());
        ndate.setDate(ndate.getDate() + inc);
        if (inc >= 0 && (!date.getHours() && ndate.getHours()) && // shift to yesterday on dst
            (ndate.getDate() < date.getDate() || ndate.getMonth() < date.getMonth() || ndate.getFullYear() < date.getFullYear())) {
            ndate.setTime(ndate.getTime() + 60 * 60 * 1000 * (24 - ndate.getHours()));
        }
        return ndate;
    };
    DateFormatter.prototype.registerCustomMode = function (name, handler) {
        this.custom[name] = handler;
    };
    DateFormatter.prototype.add = function (date, inc, mode) {
        var ndate = new Date(date.valueOf());
        switch (mode) {
            case "day":
                ndate = this._add_days(ndate, inc);
                break;
            case "week":
                ndate = this._add_days(ndate, inc * 7);
                break;
            case "month":
                ndate.setMonth(ndate.getMonth() + inc);
                break;
            case "year":
                ndate.setFullYear(ndate.getFullYear() + inc);
                break;
            case "hour":
                /*
                 setHour(getHour() + inc) and setMinutes gives weird result when is applied on a Daylight Saving time switch
                 setTime seems working as expected
                */
                ndate.setTime(ndate.getTime() + inc * 60 * 60 * 1000);
                break;
            case "minute":
                ndate.setTime(ndate.getTime() + inc * 60 * 1000);
                break;
            default:
                return this.custom[mode](date, inc, mode);
        }
        return ndate;
    };
    DateFormatter.prototype.to_fixed = function (num) {
        if (num < 10) {
            return "0" + num;
        }
        return "" + num;
    };
    DateFormatter.prototype.copy = function (date) {
        return new Date(date.valueOf());
    };
    DateFormatter.prototype.date_to_str = function (format, utc) {
        var _this = this;
        format = format.replace(/%[a-zA-Z]/g, function (a) {
            switch (a) {
                case "%d": return "\"+to_fixed(date.getDate())+\"";
                case "%m": return "\"+to_fixed((date.getMonth()+1))+\"";
                case "%j": return "\"+date.getDate()+\"";
                case "%n": return "\"+(date.getMonth()+1)+\"";
                case "%y": return "\"+to_fixed(date.getFullYear()%100)+\"";
                case "%Y": return "\"+date.getFullYear()+\"";
                case "%D": return "\"+locale.date.dayShort[date.getDay()]+\"";
                case "%l": return "\"+locale.date.dayFull[date.getDay()]+\"";
                case "%P": return "\"+date.getDay()+\"";
                case "%M": return "\"+locale.date.monthShort[date.getMonth()]+\"";
                case "%F": return "\"+locale.date.monthFull[date.getMonth()]+\"";
                case "%h": return "\"+to_fixed((date.getHours()+11)%12+1)+\"";
                case "%g": return "\"+((date.getHours()+11)%12+1)+\"";
                case "%G": return "\"+date.getHours()+\"";
                case "%H": return "\"+to_fixed(date.getHours())+\"";
                case "%i": return "\"+to_fixed(date.getMinutes())+\"";
                case "%a": return "\"+(date.getHours()>11?\"pm\":\"am\")+\"";
                case "%A": return "\"+(date.getHours()>11?\"PM\":\"AM\")+\"";
                case "%s": return "\"+to_fixed(date.getSeconds())+\"";
                case "%W": return "\"+to_fixed(getISOWeek(date))+\"";
                case "%Q": return "\"+locale.date.quarter[getQuarter(date)-1]+\"";
                case "%q": return "\"+getQuarter(date)+\"";
                default: return a;
            }
        });
        if (utc) {
            format = format.replace(/date\.get/g, "date.getUTC");
        }
        var code = new Function("date", "to_fixed", "locale", "getISOWeek", "getQuarter", " return \"" + format + "\";");
        return function (date) {
            return code(date, _this.to_fixed, en_1.default, _this.getISOWeek, _this.getQuarter);
        };
    };
    DateFormatter.prototype.str_to_date = function (format, utc) {
        var _this = this;
        var splt = "if (typeof date === 'object') return date; var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
        var mask = format.match(/%[a-zA-Z]/g);
        for (var i = 0; i < mask.length; i++) {
            switch (mask[i]) {
                case "%j":
                case "%d":
                    splt += "set[2]=temp[" + i + "]||1;";
                    break;
                case "%n":
                case "%m":
                    splt += "set[1]=(temp[" + i + "]||1)-1;";
                    break;
                case "%y":
                    splt += "set[0]=temp[" + i + "]*1+(temp[" + i + "]>50?1900:2000);";
                    break;
                case "%g":
                case "%G":
                case "%h":
                case "%H":
                    splt += "set[3]=temp[" + i + "]||0;";
                    break;
                case "%i":
                    splt += "set[4]=temp[" + i + "]||0;";
                    break;
                case "%Y":
                    splt += "set[0]=temp[" + i + "]||0;";
                    break;
                case "%a":
                case "%A":
                    splt += "set[3]=set[3]%12+((temp[" + i + "]||'').toLowerCase()=='am'?0:12);";
                    break;
                case "%s":
                    splt += "set[5]=temp[" + i + "]||0;";
                    break;
                case "%M":
                    splt += "set[1]=locale.date.month_short_hash[temp[" + i + "]]||0;";
                    break;
                case "%F":
                    splt += "set[1]=locale.date.month_full_hash[temp[" + i + "]]||0;";
                    break;
                default:
                    break;
            }
        }
        var params = "set[0],set[1],set[2],set[3],set[4],set[5]";
        if (utc) {
            params = " Date.UTC(" + params + ")";
        }
        var code = new Function("to_fixed", "locale", "date", "var set=[0,0,1,0,0,0]; " + splt + " return new Date(" + params + ");");
        return function (date) {
            return code(_this.to_fixed, _this.locale, date);
        };
    };
    DateFormatter.prototype.getISOWeek = function (ndate) {
        if (!ndate) {
            return 0;
        }
        var nday = ndate.getDay();
        if (nday === 0) {
            nday = 7;
        }
        var firstThursday = new Date(ndate.valueOf());
        firstThursday.setDate(ndate.getDate() + (4 - nday));
        var yearNumber = firstThursday.getFullYear(); // year of the first Thursday
        var ordinalDate = Math.round((firstThursday.getTime() - new Date(yearNumber, 0, 1).getTime()) / 86400000); // ordinal date of the first Thursday - 1 (so not really ordinal date)
        var weekNumber = 1 + Math.floor(ordinalDate / 7);
        return weekNumber;
    };
    DateFormatter.prototype.getUTCISOWeek = function (ndate) {
        return this.getISOWeek(this.convert_to_utc(ndate));
    };
    DateFormatter.prototype.convert_to_utc = function (date) {
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    };
    DateFormatter.prototype.getQuarter = function (d) {
        d = d || new Date();
        return Math.floor(d.getMonth() / 3) + 1;
    };
    return DateFormatter;
}());
exports.DateFormatter = DateFormatter;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(1);
var view_1 = __webpack_require__(4);
var Fields = /** @class */ (function (_super) {
    __extends(Fields, _super);
    function Fields(element, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, element, config) || this;
        var render = function () { return _this._render(); };
        _this.mount(element, dom_1.create({ render: render }));
        return _this;
    }
    Fields.prototype._render = function () {
        return dom_1.el(".dhx_config_" + this.config.item, __assign({}, this.config.events), [
            this.config.configurator.getField(this.config.item)
        ]);
    };
    return Fields;
}(view_1.View));
exports.Fields = Fields;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var Configurator_1 = __webpack_require__(35);
var Filters_1 = __webpack_require__(36);
var helpers_1 = __webpack_require__(18);
var DataPreprocessor = /** @class */ (function () {
    function DataPreprocessor() {
        this._subFields = {};
        this._filters = {};
        this._fields = {};
    }
    DataPreprocessor.prototype.setFilterValue = function (fieldId, meta) {
        var field = this._fields[fieldId];
        if (!meta || !meta.values || meta.values.length <= 0) {
            delete this._filters[fieldId];
            field.$filter = false;
        }
        else {
            this._filters[fieldId] = {
                meta: meta,
                handler: Filters_1.getFilterHandler(meta, field)
            };
            field.$filter = true;
        }
    };
    DataPreprocessor.prototype.setFiltersValues = function (filtersMeta) {
        for (var field in filtersMeta) {
            if (!this.getFilterValue(field)) {
                this.setFilterValue(field, filtersMeta[field]);
            }
        }
    };
    DataPreprocessor.prototype.getFilterValue = function (fieldId) {
        return this._filters[fieldId] ? this._filters[fieldId].meta : null;
    };
    DataPreprocessor.prototype.getFiltersValues = function () {
        var filters = {};
        for (var key in this._filters) {
            filters[key] = this._filters[key].meta;
        }
        return filters;
    };
    DataPreprocessor.prototype.clearFiltersValues = function () {
        this._filters = {};
    };
    DataPreprocessor.prototype.setGlobalFilter = function (handler) {
        this._globalFilter = handler || null;
    };
    DataPreprocessor.prototype.addSubField = function (name, functor, label) {
        this._subFields[name] = this._subFields[name] || {};
        this._subFields[name][label] = functor;
        helpers_1.groupMethods[label] = functor;
        Configurator_1.types[name] = Configurator_1.types[name] || [];
        Configurator_1.types[name].push({ id: label, label: label, method: functor });
    };
    DataPreprocessor.prototype.normalizeConfig = function (config) {
        this.normalizeFields(config);
        config.layout = config.layout || {};
        config.layout.rowsWidth = config.layout.rowsWidth || 100;
        config.layout.columnsWidth = config.layout.columnsWidth || config.layout.rowsWidth;
        config.layout.fieldSelectorType = config.layout.fieldSelectorType || "dropdown";
        config.layout.gridMode = config.layout.gridMode || "tree";
        config.types = config.types || {};
        return config;
    };
    DataPreprocessor.prototype.normalizeData = function (data, fieldList) {
        data = this._parseAliases(data, fieldList);
        this._parseDates(data, fieldList);
        return data;
    };
    DataPreprocessor.prototype.normalizeFields = function (config) {
        if (!config.fields) {
            config.fields = {
                columns: [],
                rows: [],
                values: []
            };
        }
        config.fields.free = [];
        var idMap = {};
        var _loop_1 = function (key) {
            config.fields[key] = config.fields[key].map(function (el) {
                el = (typeof el === "string") ? { id: el } : el;
                var elFromList = config.fieldList.filter(function (e) { return e.id === el.id; })[0];
                el = __assign({}, el, elFromList, { $field: key, $uid: core_1.uid() });
                if (key === "values") {
                    el.$temp = true;
                }
                else {
                    idMap[el.id] = true;
                }
                return el;
            });
        };
        for (var key in config.fields) {
            _loop_1(key);
        }
        config.fields.free = config.fieldList.filter(function (el) { return !idMap[el.id]; }).map(function (el) {
            el = __assign({}, el, { $field: "free", $uid: core_1.uid() });
            return el;
        });
        this._fields = config.fieldList.reduce(function (obj, f) { obj[f.id] = f; return obj; }, {});
    };
    DataPreprocessor.prototype.getData = function (data, fields) {
        if (data === void 0) { data = []; }
        return this._checkData(data, fields);
    };
    DataPreprocessor.prototype.getPureFields = function (fields) {
        var f = {
            columns: fields.columns.slice(),
            rows: fields.rows.slice(),
            values: fields.values.slice()
        };
        for (var key in f) {
            f[key] = f[key].map(function (el) {
                if (el.method) {
                    return { id: el.id, method: el.method };
                }
                else if (el.group) {
                    return { id: el.id, group: el.group };
                }
                else {
                    return el.id;
                }
            });
        }
        return f;
    };
    DataPreprocessor.prototype._parseDates = function (data, fieldList) {
        for (var _i = 0, fieldList_1 = fieldList; _i < fieldList_1.length; _i++) {
            var item = fieldList_1[_i];
            if (item.type === "date") {
                Configurator_1.types[item.id] = Configurator_1.types.dates;
                item.group = item.group || "dateByDay";
                for (var i = 0; i < data.length; i++) {
                    var current = data[i][item.id];
                    data[i][item.id] = (current !== null ? helpers_1.strToDate(current, item.format) : null);
                }
            }
        }
    };
    DataPreprocessor.prototype._parseAliases = function (data, fieldList) {
        if ("data" in data) {
            if (data.aliases) {
                for (var _i = 0, fieldList_2 = fieldList; _i < fieldList_2.length; _i++) {
                    var field = fieldList_2[_i];
                    if (data.aliases[field.id]) {
                        field.aliases = data.aliases[field.id];
                    }
                }
            }
            data = data.data;
        }
        return this._checkAliases(data, fieldList);
    };
    DataPreprocessor.prototype._checkAliases = function (data, fieldList) {
        return data.map(function (el) {
            for (var _i = 0, fieldList_3 = fieldList; _i < fieldList_3.length; _i++) {
                var field = fieldList_3[_i];
                if (field.aliases && field.aliases[el[field.id]]) {
                    el[field.id] = field.aliases[el[field.id]];
                }
            }
            return el;
        });
    };
    DataPreprocessor.prototype._checkData = function (data, fields) {
        var _this = this;
        var checkedData = data.slice();
        if (this._globalFilter) {
            checkedData = checkedData.filter(function (row) { return _this._globalFilter(row); });
        }
        if (Object.keys(this._filters).length) {
            var _loop_2 = function (key) {
                var filter = this_1._filters[key];
                checkedData = checkedData.filter(function (item) { return filter.handler(item[key]); });
            };
            var this_1 = this;
            for (var key in this._filters) {
                _loop_2(key);
            }
        }
        for (var key in fields) {
            for (var _i = 0, _a = fields[key]; _i < _a.length; _i++) {
                var obj = _a[_i];
                if (obj.group && !obj.method) {
                    checkedData = this._callGroupMethod(checkedData, obj);
                }
            }
        }
        return checkedData;
    };
    DataPreprocessor.prototype._callGroupMethod = function (data, field) {
        if (helpers_1.groupMethods[field.group]) {
            return data.map(function (el) {
                el = __assign({}, el);
                if (el[field.id] !== null) {
                    el[field.id] = helpers_1.groupMethods[field.group](el[field.id]);
                }
                return el;
            });
        }
        else {
            return data;
        }
    };
    return DataPreprocessor;
}());
exports.DataPreprocessor = DataPreprocessor;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// [todo] remove export() method from Pivot api and convert Exporter to class
function getExporter(pivot) {
    var exp = function Exporter(config) {
        return pivot.grid.export.xlsx(config);
    };
    exp.csv = function (config) {
        return pivot.grid.export.csv(config);
    };
    exp.xlsx = function (config) {
        return pivot.grid.export.xlsx(config);
    };
    return exp;
}
exports.getExporter = getExporter;
// export class Exporter extends Function {
// 	private _pivot: IPivot;
// 	constructor(pivot: IPivot) {
// 		this._pivot = pivot;
// 	}
// 	xlsx(config: IXlsxExportConfig) {
// 		return this._pivot.grid.export.xlsx(config);
// 	}
// 	csv(config: ICsvExportConfig) {
// 		return this._pivot.grid.export.csv(config);
// 	}
// }


/***/ })
/******/ ]);
});if (window.dhx_legacy) { if (window.dhx){ for (var key in dhx) dhx_legacy[key] = dhx[key]; } window.dhx = dhx_legacy; delete window.dhx_legacy; }