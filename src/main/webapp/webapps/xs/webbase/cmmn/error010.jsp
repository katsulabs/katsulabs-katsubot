<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="xs.core.dto.ApiEnvelope" %>
<%
	String strContextPath		= request.getContextPath();
	int intStatus				= response.getStatus();
	String strErrorCode			= new String();
	String strErrorMessage		= new String();
	String strErrorTitle		= "";
	String strErrorMessageSub	= "";
	String strErrorData			= response.getHeader("XTRM_ERROR_DATA");
	ApiEnvelope objErrorJson		= null;
	if(strErrorData != null){
		objErrorJson			= new ApiEnvelope(URLDecoder.decode(strErrorData, StandardCharsets.UTF_8));
		strErrorCode			= objErrorJson.getHeaderString("ERROR_CODE");
		strErrorMessage			= objErrorJson.getHeaderString("ERROR_MSG").replaceAll("&lt;br/&gt;", "<br/>");
		strErrorMessageSub		= objErrorJson.getString("ERROR_MSG_SUB").replaceAll("&lt;br/&gt;", "<br/>");
	}else{
		strErrorTitle			= intStatus + " 확인";
		if(intStatus == 400){
			strErrorMessageSub	+= "잘못된 요청";
			strErrorMessage		+= "비정상적인 요청정보입니다.";
		}else if(intStatus == 401){
			strErrorMessageSub	+= "인증 거절"; 
			strErrorMessage		+= "요청한 정보에 인증이 거절되었습니다.";
		}else if(intStatus == 403){
			strErrorMessageSub	+= "접근 불가";
			strErrorMessage		+= "요청한 정보는 접근이 불가합니다.";
		}else if(intStatus == 404){
			strErrorMessageSub	+= "존재하지 않는 화면";
			strErrorMessage		+= "요청한 페이지정보를 찾을 수 없습니다.";
		}else if(intStatus == 500){
			strErrorMessageSub	+= "서버 오류";
			strErrorMessage		+= "시스템 내부 장애가 발생하였습니다.";
		}else if(intStatus == 501){
			strErrorMessageSub	+= "처리할 수 없는 요청";
			strErrorMessage		+= "요청한 정보는 서버가 처리할 수 없습니다.";
		}else if(intStatus == 502){
			strErrorMessageSub	+= "없는 경로";
			strErrorMessage		+= "요청한 정보에 경로를 찾을 수 없습니다.";
		}else if(intStatus == 503){
			strErrorMessageSub	+= "응답할 수 없는 상태";
			strErrorMessage		+= "요청한 정보에 서버가 일시적으로 응답을 할 수 없습니다.";
		}else{
			strErrorMessageSub	+= "기타";
			strErrorMessage		+= "요청한 정보에 문제가 발생했습니다.";
		}
	}
	//클라이언트에 오류코드가 리턴 되지 않도록 클리어 한다.
	response.setStatus(200);
%>
<!doctype html>
<html>
<head>
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, private, no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, s-maxage=0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Vary" content="*" />
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
	<meta http-equiv="Content-Script-Type" content="text/javascript"/>
	<meta http-equiv="Content-Style-Type" content="text/css"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
	<link rel="stylesheet" href="/html/xs/core/xui/css/xui-font.css"/>
	<link rel="stylesheet" href="/html/xs/core/xui/css/xui-color.css" />
	<link rel="stylesheet" href="/html/xs/core/xui/css/xui-style.css" />
	<link rel="stylesheet" href="/html/xs/core/xui/css/xui-animate.css" />
	<script defer src="/html/xs/core/xui/js/opensources/lottie/lottie.js"></script>
	<script defer src="/html/xs/webbase/cmmn/js/error010.js"></script>
	<style type="text/css">
		html,body{
			font-family:NotoSans, sans-serif;
			width:100%;
			height:100%;
			/* background-color:rgb(var(--gray_50)); */
			background-image: linear-gradient(to right, rgb(var(--periBlue_50)), rgb(var(--viridian_50)));
		}
		*{
			margin:0;
			padding:0;
		}
		.error {
			width:100%;
			height:100%;
			display:flex;
			justify-content: center;
			margin-top: -60px;
		}
		.error_wrap {
			width: 480px;
			position:absolute;
			top:calc(50% - 125px);
			left:calc(50% - 240px);
		}
		.error_wrap .error_tit {
			padding-top: 11px;
			width: 100%;
			height: 34px;
			font-size: 22px;
			font-weight: bold;
			font-stretch: normal;
			font-style: normal;
			line-height: 1.27;
			letter-spacing: -1.1px;
			text-align: center;
			color: rgb(var(--gray_900));
			display: absolute;
		}
		.error_wrap .error_sub {
			padding-top: 12px;
			width: 100%;
			height: 24px;
			font-size: 16px;
			font-weight: 500 !important;
			font-stretch: normal;
			font-style: normal;
			line-height: 1.5;
			letter-spacing: -0.32px;
			text-align: center;
			color: rgb(var(--gray_900));
		}
		.error_wrap .error_detail {
			padding-top: 23px;
			width: 100%;
			height: 20px;
			font-size: 14px;
			font-weight: 500;
			font-stretch: normal;
			font-style: normal;
			line-height: 1.43;
			letter-spacing: -0.35px;
			text-align: center;
			color: rgb(var(--gray_600));
		}
		.popBtn {
			margin-top: 180px;
			width: 120px !important;
			height: 40px !important;
  			margin: 57px 180px 0;
  			padding: 8px 46px;
			border-radius: 20px !important;
			border-color: rgba(83,84,130) !important;
			background-color: rgba(83,84,130) !important;
			/*display: flex !important;*/
			display: none !important;
			align-items: center;
			justify-content: center;
		}
		.invisible{
			display:none;
		}
		#alert_err {
			width: 100%;
			height: 72px;
			display: absolute;
			overflow: hidden;
			transform: translate3d(0, 0, 0);
			text-align: center;
			opacity: 1;
		}
	</style>
</head>
<body class="document-body">
	<input type="hidden" id="ctxPath" value="<%=strContextPath%>"/>

	<div class="error">
		<div class="error_wrap">
			<div id="alert_err"></div>
			<p class="error_sub"><%=strErrorMessageSub%></p>
			<p class="error_detail"><%=strErrorMessage%></p>
			<div class="xui-button large allowed popBtn" onclick="moveLoginPage();">확인</div>
			<input type="hidden" id="error_code" value="<%=intStatus%>"/>
			<input type="hidden" id="error_msg" value="<%=strErrorMessage%>"/>
			<input type="hidden" id="error_msg_sub" value="<%=strErrorMessageSub%>"/>
		</div>
	</div>
	<script>
		(function(){
			if(document.getElementById("error_code").value === "610"){
				if(opener != null){
					opener.xui.com._redirectErrorPage(document.getElementById("error_code").value, document.getElementById("error_msg").value, document.getElementById("error_msg_sub").value);
				}else if(top.document !== document){
					top.xui.com._redirectErrorPage(document.getElementById("error_code").value, document.getElementById("error_msg").value, document.getElementById("error_msg_sub").value);
				}else{
					document.body.classList.remove("invisible");
				}
			}else{
				document.body.classList.remove("invisible");
			}
		}());
		function moveLoginPage(){
			try{
				var ctxPath							= document.getElementById("ctxPath").value;
				if(typeof(ctxPath) === "undefined" || ctxPath === null || ctxPath === ""){
					ctxPath							= "/";
				}
				if(opener != null){
					window.close();
				}else{
					if(top.window == window){
						window.location.href			= ctxPath;
					}else{
						//if(document.getElementById("error_code").value === "610"){
							top.window.location.href	= ctxPath;
						//}else{
						//	top.xuiMain.closeErrorPage();
						//}
					}
				}
			}catch(e){}
		}
	</script>
</body>
</html>

