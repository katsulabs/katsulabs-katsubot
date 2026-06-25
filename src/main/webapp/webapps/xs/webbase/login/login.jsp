<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
	<title>C-Cube2.0</title>
	<!-- 공통include -->
	<jsp:include page="/webapps/xs/core/xui/xuicore.jsp" flush="false"></jsp:include>
	<!-- 화면script -->
	<script defer src="${pageContext.request.contextPath}/html/xs/webbase/login/js/login010.js?version=<%=System.currentTimeMillis() %>"></script>
	<!-- 화면CSS -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/html/xs/webbase/login/css/login.css?version=<%=System.currentTimeMillis() %>"/>
</head>
<body class="index-bg" data-color-theme="lm__blue" data-size-theme="mode-xs">
	<!-- `` 1. Background -->
	<div class="bg-container">
		<svg class="index-bg-gradient-s" width="1038" height="985" viewBox="0 0 1038 985" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_f_285_11893)">
				<path d="M836.481 373.534C841.387 403.114 832.841 428.58 832.841 428.58C820.815 464.487 791.698 484.26 775.715 494.858C735.521 521.59 718.431 511.15 684.725 532.504C657.823 549.588 645.797 570.626 622.06 612.227C576.486 691.949 583.448 733.392 536.766 765.503C527.905 771.672 514.454 781.004 494.99 784.01C457.486 790.02 416.659 769.932 340.069 688.944C250.819 594.669 206.194 547.531 200.972 503.083C185.147 368.947 365.229 201.593 546.577 200.011C692.953 198.746 825.087 305.675 836.481 373.534Z" fill="url(#paint0_radial_285_11893)"/>
			</g>
			<defs>
				<filter id="filter0_f_285_11893" x="0" y="0" width="1038" height="985" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix"/>
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
					<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_285_11893"/>
				</filter>
				<radialGradient id="paint0_radial_285_11893" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(538.032 467.967) scale(552.273 552.046)">
					<stop offset="0.09" stop-color="#AEE7F0"/>
					<stop offset="0.54" stop-color="#B499EF"/>
					<stop offset="0.65" stop-color="#D161F6"/>
				</radialGradient>
			</defs>
		</svg>
		<svg class="index-bg-gradient-l" width="1083" height="1176" viewBox="0 0 1083 1176" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_657_59775)">
				<g filter="url(#filter0_f_657_59775)">
					<path d="M882.773 677.26C887.787 779.023 808.123 860.174 794.195 874.287C699.861 970.294 531.247 1009.29 391.787 942.996C378.974 936.868 242.672 869.83 207.76 726.099C141.28 452.377 521.962 239.194 586.956 214.496C654.55 188.869 706.174 205.025 706.174 205.025C716.573 208.182 726.23 211.339 736.815 219.138C770.797 244.207 769.126 285.433 784.353 360.456C790.481 391.468 796.981 423.408 811.094 462.962C833.378 525.357 851.39 541.327 868.475 602.051C873.488 619.693 881.473 648.476 882.959 677.074L882.773 677.26Z" fill="url(#paint0_radial_657_59775)"/>
				</g>
			</g>
			<defs>
				<filter id="filter0_f_657_59775" x="0" y="0" width="1083" height="1176" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix"/>
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
					<feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_657_59775"/>
				</filter>
				<radialGradient id="paint0_radial_657_59775" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(477.951 584.595) scale(507.142 507.146)">
					<stop offset="0.13" stop-color="#B1DDEA"/>
					<stop offset="0.74" stop-color="#D27FEF"/>
					<stop offset="1" stop-color="#D364EE"/>
				</radialGradient>
				<clipPath id="clip0_657_59775">
					<rect width="1083" height="1176" fill="white"/>
				</clipPath>
			</defs>
		</svg>
		<div class="line-image"></div>
	</div>
	<!-- `` 2. Format -->
	<div class="login-container">
		<!-- `` 2.1. Login format -->
		<div class="format format--login format--active" id="login-format">
			<!-- `` 2.1.1. Logo -->
			<div class="title-logo"></div>
			<!-- `` 2.1.2. Form Group -->
			<form class="input-group" action="#" id="loginForm">
				<!-- `` 2.1.2.1. Text input -->
                <div class="input-group__input-row">
                    <label class="xui-combo-label">
                        <input type="text" class="input" id="languageCode" name="languageCode" message-tooltip="language" xui-tooltip-title="언어" groupCode="SYS028" style=""/>
                    </label>
                </div>
				<input type="text" class="input xui-invisible" id="companyCode"  name="companyCode" xui-tooltip-title="" placeholder="">
				<label class="xui-input-label">
					<input type="text" class="required input" id="userId"  name="userID" xui-tooltip-title="아이디" message-placeholder="id" placeholder="아이디">
				</label>
				<label class="xui-input-label password">
					<input type="password" class="with-icon required input" id="password" name="password"  message-tooltip="password" xui-tooltip-title="비밀번호" message-placeholder="password" placeholder="비밀번호 입력" autocomplete="off">
				</label>
				<div class="input-group__input-row xui-invisible">
					<label class="xui-input-label">
						<input type="number" class="input" name="confirmation" xui-tooltip-title="인증번호" placeholder="인증번호 입력">
					</label>
					<button class="btn-s default get-otp-btn " type="button">OTP 발급·재발급</button>
				</div>
				<!-- `` 2.1.2.2. Checkbox & Reset -->
				<div class="input-group__sub-row">
					<!-- `` 2.1.2.2.1. Checkbox -->
					<div class="input-group__checkbox-group">
						<label class="xui-checkbox-label">
							<input type="checkbox" id="rememberId" name="rememberId" message-tooltip="informationMemory" xui-tooltip-title="정보기억하기" on="Y" off="N" readonly
								class="checkbox-input" />
							<span message-text="informationMemory">정보저장</span>
						</label>
					</div>
					<!-- `` 2.1.2.2.2. Reset -->
					<div class="input-group__text-btn-group">
						<button class="[ text-btn ] [ change-pw-btn ]" authType="N" id="btnChangePassword" type="button" message-text="changePassword">비밀번호 변경</button>
                        <p class="divider xui-invisible" id="dividerCase"></p>
                        <p class="xui-invisible" id="btnCreateOTP" message-text="otpIssuanceAndReissue">OTP 발급/재발급</p>
					</div>
				</div>
			</form>
			<!-- `` 2.1.3. Button -->
			<button class="[ btn-l2 accent-solid ] [ format__btn ]" type="button" id="btnLogin" authType="N" message-text="login" message-tooltip="login">로그인</button>
		</div>

		<!-- `` 2.2. Change password format -->
		<div class="format format--change-pw" id="change-pw-format">
			<!-- `` 2.2.1. 비밀번호 변경 Title -->
			<span class="title">
				<div message-text="login010.PASSWORD_CHANGE">비밀번호 변경</div>
			</span>
			<!-- `` 2.2.2. Form Group -->
			<form class="input-group" action="#" id="passwordChangeForm" >
				<!-- `` 2.2.2.1. Text input -->
				<input type="text" class="input xui-invisible" id="companyCode"  name="companyCode" xui-tooltip-title="" placeholder="">
				<label class="xui-input-label">
					<input type="text" class="required input" id="userId" name="userId" message-tooltip="id" xui-tooltip-title="ID" message-placeholder="id" placeholder="아이디" readonly/>
				</label>
				<label class="xui-input-label password">
				    <input type="password" class="with-icon required input" id="passwordOld" name="passwordOld" message-tooltip="currentPassword" xui-tooltip-title="PASSWORD" message-placeholder="currentPassword" placeholder="비밀번호(현재)" readonly autocomplete="off"/>
				</label>
				<label class="xui-input-label password">
				    <input type="password" class="with-icon required input" id="passwordNew" name="passwordNew" message-tooltip="newPassword" xui-tooltip-title="PASSWORD" message-placeholder="newPassword" placeholder="비밀번호(신규)" readonly autocomplete="off"/>
				</label>
				<label class="xui-input-label password">
				    <input type="password" class="with-icon required input" id="passwordNewCheck" name="passwordNewCheck" message-tooltip="verifyPassword" xui-tooltip-title="PASSWORD" message-placeholder="verifyPassword" placeholder="비밀번호 확인" readonly autocomplete="off"/>
				</label>
				<div class="input-group__input-row xui-invisible">
					<label class="xui-input-label">
					    <input type="text" class="input" id="otpCode" name="otpCode" message-tooltip="otpInsert" xui-tooltip-title="OTP 입력" message-placeholder="otpInsert" placeholder="OTP 입력" readonly/>
					</label>
					<button class="btn-s default get-otp-btn" type="button">OTP 발급·재발급</button>
				</div>
			</form>
			<!-- `` 2.2.3. Button -->
			<div class="button-group button-group--full button-group--l">
			    <button type="button" class="btn-l2 default format__btn back-to-login-btn" id="btnLoginBack" authType="N" message-text="goBack" message-tooltip="goBack">돌아가기</button>
    			<button type="button" class="btn-l2 default format__btn back-to-login-btn" id="btnLoginBackOTP" authType="N" message-text="goBack" message-tooltip="goBack">돌아가기</button>
				<button type="button" class="btn-l2 accent-solid format__btn" id="btnUpdatePassword" authType="N" message-text="change" message-tooltip="change">변경</button>
			</div>
		</div>

		<!-- `` 2.3. Get OTP -->
		<form action="#" id="otpCreateForm" class="xui-invisible">
            <div class="format format--get-otp " id="get-otp-format">
                <!-- `` 2.3.1. OTP 발급·재발급 Title -->
                <span class="title">
                    OTP 발급·재발급
                </span>
                <!-- `` 2.3.2. Form Group -->
                <div class="input-group">
                    <!-- `` 2.3.2.1. Text input -->
                    <label class="xui-input-label">
                        <input type="text" class="required input" name="userID" xui-tooltip-title="로그인ID"
                        placeholder="아이디 입력">
                    </label>
                    <label class="xui-input-label password">
                        <input type="password" class="with-icon required input" name="current-password"
                        xui-tooltip-title="비밀번호" placeholder="비밀번호 입력" autocomplete="off">
                    </label>
                    <label class="xui-input-label">
                        <input type="number" class="required input" name="confirmation"
                        xui-tooltip-title="OTP KEY" placeholder="OTP KEY">
                    </label>
                    <!-- `` 2.3.2.1.1 Information text -->
                    <span class="noti-message">발급된 OTP KEY를 휴대폰에 등록하세요!</span>
                </div>
                <!-- `` 2.3.3. Button -->
                <div class="button-group button-group--full button-group--l">
                    <button class="[ btn-l2 default ] [ format__btn back-to-login-btn ]" type="button">돌아가기</button>
                    <button class="[ btn-l2 accent-solid ] [ format__btn ]" type="submit">발급</button>
                    <button class="[ btn-l2 accent-solid ] [ format__btn ]" type="submit">재발급</button>
                </div>
            </div>
        </form>
		<!-- `` 3. Information text -->
		<p class="information" message-html="loginInformation">
		</p>
	</div>

	<!-- `` 4. Copyright -->
	<footer class="footer-area">
		<footer2 class="footer footer--login">
			<a href="login.html" class="footer__logo-link">
				<div class="footer__logo"></div>
			</a>
			<p class="footer__copylight">&copy; 2024 by <a href="#" class="footer__link">HYOSUNG ITX.</a> All rights reserved.</p>
		</footer2>
	</footer>
</body>



</html>
