<meta http-equiv="Cache-Control"		content="no-cache, no-store, must-revalidate, private, max-age=0, proxy-revalidate, s-maxage=0"	/>
<meta http-equiv="Pragma"				content="no-cache"																				/>
<meta http-equiv="Expires"				content="0"																						/>
<meta http-equiv="Vary"					content="*"																						/>
<meta http-equiv="Content-Type"			content="text/html; charset=utf-8"																/>
<meta http-equiv="Content-Script-Type"	content="text/javascript"																		/>
<meta http-equiv="Content-Style-Type"	content="text/css"																				/>
<meta http-equiv="X-UA-Compatible"		content="IE=edge,chrome=1"																		/>
<meta name="viewport"					content="width=device-width, initial-scale=1.0"													/>
<%
    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyyMMdd");
    String versionDate = sdf.format(new java.util.Date());
%>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Black.woff2"			as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Bold.woff2"			as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Medium.woff2"		as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Regular.woff2"		as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Light.woff2"			as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/NotoSansKR/NotoSansKR-Thin.woff2"			as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/xuiFontIcon/xuiFontIcon.woff2"				as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/font-awesome-5.6.3/fa-brands-400.woff2"	as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/font-awesome-5.6.3/fa-regular-400.woff2"	as="font"	crossorigin="anonymous"	/>
<link rel="preload" 		type="font/woff2"	href="/html/xs/core/xui/font/font-awesome-5.6.3/fa-solid-900.woff2"		as="font"	crossorigin="anonymous"	/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-font.css"																	/>
<link rel="shortcut icon"	                    href="/html/xs/webbase/cmmn/img/shortcut/app.ico"					            							/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-style.css?version=<%=versionDate%>"											/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-color.css"																	/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-animate.css"																/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-grid.css"																	/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/css/xui-tree.css"																	/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/component/dhtmlx/pivot/pivot.css"												/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/component/dhtmlx/vault/vault.css"												/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/component/dhtmlx/suite/v6/suite.css"												/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/jquery/plugin/slick/slick.css"													/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/jquery/plugin/slick/slick-theme.css"												/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/domain/cmmn/css/domainCmmn.css?version=<%=versionDate%>"										/>
<link rel="stylesheet" id="stylesheet_webbaseCmmn"		type="text/css"		href="/html/xs/webbase/cmmn/css/webbaseCmmn.css?version=<%=versionDate%>"   	/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/core/xui/js/jquery/plugin/toast/jquery.toast.css"											/>
<link rel="stylesheet"		type="text/css"		href="/html/xs/vob/cmmn/css/vobCmmn.css?version=<%=versionDate%>"											/>


<script src="/html/xs/core/xui/js/opensources/LABjs/LAB.min.js"></script>
<script defer>
(function(){

	"use strict";

	/*Define global XtrmFrameworkCore(a.k.a xuic) object*/
	window.xuic						= window.xuic || {};
	xuic.__CONFIG					= {};

	/*Custom event polyfill*/
	if(typeof(window.CustomEvent) !== "function"){
		function CustomEvent(event, params){
			params					= params || {bubbles:false,cancelable:false,detail:undefined};
		    var evt					= document.createEvent("CustomEvent");
		    evt.initCustomEvent(event,params.bubbles,params.cancelable,params.detail);
		    return evt;
		}
		CustomEvent.prototype		= window.Event.prototype;
		window.Event				= CustomEvent;
	}

	/*typedarray slice method polyfill*/
	if(typeof(ArrayBuffer) !== 'undefined' && !ArrayBuffer.prototype.slice){
		ArrayBuffer.prototype.slice = function(start, end){
			if(start == null){start = 0;}
			if(start < 0){
				start += this.byteLength;
				if(start < 0){start = 0;}
			}
			if(start >= this.byteLength){return new Uint8Array(0);}
			if(end == null){end = this.byteLength;}
			if(end < 0){
				end += this.byteLength;
				if(end < 0){end = 0;}
			}
			if(end > this.byteLength){end = this.byteLength;}
			if(start > end){return new Uint8Array(0);}
			var out = new ArrayBuffer(end - start);
			var view = new Uint8Array(out);
			var data = new Uint8Array(this, start, end - start);
			/* IE10 should have Uint8Array#set */
			if(view.set) view.set(data); else while(start <= --end) view[end - start] = data[end];
			return out;
		};
	}

	/*Date extend polyfill*/
	Date.prototype.getUnixTime		= function(){
		return this.getTime()/1000|0;
	};
	if(!Date.now){
		Date.now					= function(){
			return new Date();
		}
	}
	Date.time						= function(){
		return Date.now().getUnixTime();
	}

	if(typeof(Uint8Array) !== 'undefined' && !Uint8Array.prototype.slice){
		Uint8Array.prototype.slice = function(start, end){
			if(start == null){start = 0;}
			if(start < 0){
				start += this.length;
				if(start < 0){start = 0;}
			}
			if(start >= this.length){return new Uint8Array(0);}
			if(end == null){end = this.length;}
			if(end < 0){
				end += this.length;
				if(end < 0){end = 0;}
			}
			if(end > this.length){end = this.length;}
			if(start > end){return new Uint8Array(0);}
			var out = new Uint8Array(end - start);
			while(start <= --end) out[end - start] = this[end];
			return out;
		};
	}
	/*requestAnimationFrame polyfill*/
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame	||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback){
			window.setTimeout(callback, 1000 / 60);
		};
	}());

	/* For those who need them (< IE 9), add support for CSS functions */
	var isStyleFuncSupported		= !!CSSStyleDeclaration.prototype.getPropertyValue;
	if(!isStyleFuncSupported){
		CSSStyleDeclaration.prototype.getPropertyValue = function(a){
			return this.getAttribute(a);
		};
	    CSSStyleDeclaration.prototype.setProperty = function(styleName, value, priority){
	    	this.setAttribute(styleName, value);
	    	var priority			= typeof(priority) !== "undefined" ? priority : "";
	    	if(priority !== ""){
	    		/* Add priority manually */
	    		var rule			= new RegExp(styleName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + '\\s*:\\s*' + value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + '(\\s*;)?', 'gmi');
	    		this.cssText		= this.cssText.replace(rule, styleName + ': ' + value + ' !' + priority + ';');
	    	}
	    };
	    CSSStyleDeclaration.prototype.removeProperty = function(a){
	    	return this.removeAttribute(a);
	    };
	    CSSStyleDeclaration.prototype.getPropertyPriority = function(styleName) {
	    	var rule				= new RegExp(styleName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + '\\s*:\\s*[^\\s]*\\s*!important(\\s*;)?', 'gmi');
	    	return rule.test(this.cssText) ? 'important' : '';
	    }
	}
	isStyleFuncSupported			= null;

	/*Set web application context path*/
	xuic.__CONFIG.contextRoot		= "/";
	var pos							= window.location.pathname.indexOf("/",2);
	if(pos >= 0){
		xuic.__CONFIG.contextRoot	= window.location.pathname.substring(0,pos) + "/";
	}
	if(xuic.__CONFIG.contextRoot === "/webapps/"){
		xuic.__CONFIG.contextRoot	= "/";
	}else if(xuic.__CONFIG.contextRoot === "/xsgbis/"){
         xuic.__CONFIG.contextRoot	= "/";
     }
	pos								= null;

	/*Caching browser info*/
	var strKind						= "", strVersion = "", intStartPoint = 0, intEndPoint = 0, strUserAgent = window.navigator.userAgent.toUpperCase();
	if(strUserAgent.indexOf("CHROME") >= 0 && strUserAgent.indexOf("EDGE") < 0){
		strKind						= "CHROME";
	}else if(strUserAgent.indexOf("FIREFOX") >= 0){
		strKind						= "FIREFOX";
	}else if(strUserAgent.indexOf("OPERA") >= 0){
		strKind						= "OPERA";
	}else if(strUserAgent.indexOf("MSIE") >= 0 || strUserAgent.indexOf("TRIDENT") >= 0 || strUserAgent.indexOf("EDGE") >= 0){
		strKind						= "MSIE";
	}else if(strUserAgent.indexOf("SAFARI") >= 0 && strUserAgent.indexOf("EDGE") < 0){
		strKind						= "SAFARI";
	}else if(strUserAgent.indexOf("KONQUEROR") >= 0 && strUserAgent.indexOf("EDGE") < 0){
		strKind						= "KONQUEROR";
	}
	if(strKind === "MSIE"){
		if(window.XMLHttpRequest == null && strUserAgent.indexOf("MSIE") >= 0){
			strVersion				= "6";
		}else if(strUserAgent.indexOf("MSIE 7.0") >= 0 && strUserAgent.indexOf("TRIDENT") < 0){
			strVersion				= "7";
		}else if(strUserAgent.indexOf("MSIE 8.0") >= 0 && strUserAgent.indexOf("TRIDENT") >= 0){
			strVersion				= "8";
		}else if(strUserAgent.indexOf("MSIE 9.0") >= 0 && strUserAgent.indexOf("TRIDENT") >= 0){
			strVersion				= "9";
		}else if(strUserAgent.indexOf("MSIE 10.0") >= 0 && strUserAgent.indexOf("TRIDENT") >= 0 && window.navigator.pointerEnabled != true){
			strVersion				= "10";
		}else if(strUserAgent.indexOf("TRIDENT") >= 0 && window.navigator.pointerEnabled == true){
			strVersion				= "11";
		}else if(strUserAgent.indexOf("EDGE") >= 0){
			strVersion				= "EDGE";
		}
	}else if(strKind === "FIREFOX"){
		intStartPoint				= strUserAgent.indexOf(strKind) + 8;
		strVersion					= strUserAgent.substring(intStartPoint);
	}else if(strKind === "CHROME"){
		intStartPoint				= strUserAgent.indexOf(strKind) + 7;
		intEndPoint					= strUserAgent.indexOf(" ", intStartPoint);
		strVersion					= strUserAgent.substring(intStartPoint, intEndPoint);
	}else if(strKind === "SAFARI" || strKind === "KONQUEROR"){
		intStartPoint				= strUserAgent.indexOf(strKind) + 7;
		strVersion					= strUserAgent.substring(intStartPoint);
	}
	xuic.__CONFIG.browserName		= strKind;
	xuic.__CONFIG.browserVersion	= strVersion;

	strKind							= null;
	strVersion						= null;
	intStartPoint					= null;
	intEndPoint						= null;
	strUserAgent					= null;

	function __Resourceloader(){
	};
	__Resourceloader.prototype	= {
		require : function(scripts, callback){
			if(typeof(callback) === "function"){
				$LAB.setOptions({"BasePath":xuic.__CONFIG.contextRoot}).script(scripts).wait(function(){
					callback.call("", scripts);
				});
			}else{
				$LAB.setOptions({"BasePath":xuic.__CONFIG.contextRoot}).script(scripts);
			}
		}
	};

	xuic.__RESOURCE_LOADER			= new __Resourceloader();
	__Resourceloader				= null;

	/*Load asynchronous page resource loader & Common resource load*/
	var today = new Date();
	var strToday = String(today.getFullYear())+String(today.getMonth()+1)+String(today.getDate());

	var loadResources = [];
	loadResources.push("html/xs/core/xui/js/jquery/core/jquery-3.5.1.min.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/jquery/ui/1.12.1/jquery-ui-1.12.1.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/component/dhtmlx/suite/v6/suite.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/jquery/plugin/cookie/jquery.cookie.min.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/opensources/crypto/gibberish-aes.min.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/opensources/crypto/md5.min.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/opensources/crypto/SHA256.min.js?version=" + strToday);
	//jsrender 추가 2025.08.12
	loadResources.push("html/xs/core/xui/js/component/jsrender/jsrender.min.js?version=" + strToday);
	//hi cloud 추가 2025.09.25
	loadResources.push("html/xs/core/xui/js/component/ecm/ecm.cloud.js?version=" + strToday);

	if(xuic.__CONFIG.browserName === "MSIE"){
		loadResources.push("html/xs/core/xui/js/opensources/polyfill/promise-polyfill.js?version=" + strToday);
		loadResources.push("html/xs/core/xui/js/opensources/polyfill/css-vars-ponyfill.js?version=" + strToday);
	}

	loadResources.push("html/xs/core/xui/js/opensources/uuid/uuid-random.min.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/opensources/lottie/lottie.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/opensources/mark/marked.min.js?version=" + strToday);

	if(document.location.pathname !== xuic.__CONFIG.contextRoot){
		loadResources.push("html/xs/core/xui/js/jquery/plugin/easy_number_animate/jquery.easy_number_animate.js?version=" + strToday);
		loadResources.push("html/xs/core/xui/js/jquery/plugin/slick/slick.min.js?version=" + strToday);
		loadResources.push("html/xs/core/xui/js/jquery/plugin/mark/jquery.mark.min.js?version=" + strToday);
		loadResources.push("html/xs/core/xui/js/opensources/stomp/stomp.js?version=" + strToday);
	}
	loadResources.push("html/xs/core/xui/js/xuicore.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/xui.js?version=" + strToday);
	loadResources.push("html/xs/core/xui/js/jquery/plugin/toast/jquery.toast.js?version=" + strToday);
	// login 화면 일 경우 동적으로 webbaseCmmn.css 제거
	if(location.pathname.indexOf("login.jsp")>-1 || location.pathname.indexOf("login010.jsp")>-1){
	    var linkElement = document.getElementById('stylesheet_webbaseCmmn');
        if (linkElement) { linkElement.disabled = true; } // 스타일 무효화
	}else {
	    loadResources.push("html/xs/webbase/cmmn/js/webbaseCmmn.js?version=" + strToday);
	}

	if(location.pathname !== '/'){
        loadResources.push("html/xs/domain/cmmn/js/domainCmmn.js?version=" + strToday);
    }
	loadResources.push("html/xs/vob/cmmn/js/vobCmmn.js?version=" + strToday);

	xuic.__RESOURCE_LOADER.require(loadResources, function(){
		xuic.__DCL();
		if(xuic.__CONFIG.browserName === "MSIE"){
			cssVars({});
		}
	});
}());
</script> 