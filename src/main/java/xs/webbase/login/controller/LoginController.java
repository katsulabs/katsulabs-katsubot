package xs.webbase.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xs.core.handler.app.XtrmArgumentResolveMap;
import xs.core.dto.ApiEnvelope;
import xs.webbase.login.service.LoginService;

@RestController
@RequestMapping("/xs/webbase/login")
public class LoginController {

    @Autowired
	LoginService loginService;

	//****** 로그인 일반 ************************************************************************//
	// 도메인을 이용한 회사정보 검색
	@PostMapping(value = "selectDataCompanyInfo.json")
	public ApiEnvelope selectDataCompanyInfo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.selectDataCompanyInfo(inRequestMap.getParams(), inRequestMap.getRequest());
	}  
	
	// 로그인 시 계정을 암호화하기 위한 암호화키를 생성하여 클라이언트에 반환하고 세션정보에 담는다.
	@PostMapping(value = "createOTPEncryptKey.json")
	public ApiEnvelope createOTPEncryptKey(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.createOTPEncryptKey(inRequestMap.getParams(), inRequestMap.getSession());
	}		

	// 일반 로그인
	@PostMapping(value = "loginBase.json")
	public ApiEnvelope loginBase(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.loginBase(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}
	
	// 로그아웃
	@PostMapping(value = "logout.json")
	public ApiEnvelope logout(XtrmArgumentResolveMap inRequestMap) throws Exception{
		return loginService.logout(inRequestMap.getParams(), inRequestMap.getSession());
	}

	// 비밀번호변경
	@PostMapping(value = "changeUserPassword.json")
	public ApiEnvelope changeUserPassword(XtrmArgumentResolveMap inRequestMap) throws Exception{
		return loginService.changeUserPassword(inRequestMap.getParams(), inRequestMap.getSession());
	}

	//****** 로그인 일반 ************************************************************************//

	
	//****** 구글 OTP 인증용 로그인 ************************************************************************//
	// OTP 검증 후 로그인
	@PostMapping(value = "loginOTP.json")
	public ApiEnvelope loginOTP(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.loginOTP(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}
	// OTP 발급/재발급
	@PostMapping(value = "createOTPKey.json")
	public ApiEnvelope createOTPKey(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.createOTPKey(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}	
	// OTP 검증 후 비밀번호 변경 
	@PostMapping(value = "changePasswordOTP.json")
	public ApiEnvelope changePasswordOTP(XtrmArgumentResolveMap inRequestMap) throws Exception{
		return loginService.changePasswordOTP(inRequestMap.getParams(), inRequestMap.getSession());
	}
	//****** 구글 OTP 인증용 로그인 ************************************************************************//
	
	
	//****** SMS Email 인증용 로그인 ************************************************************************//
	// 로그인을 위한 인증매체 정보
	@PostMapping(value = "loginSMSMail.json")
	public ApiEnvelope loginSMSMail(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.loginSMSMail(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}
	// 인증번호 요청
	@PostMapping(value = "sendCertificationNumber.json")
	public ApiEnvelope sendCertificationNumber(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.sendCertificationNumber(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}	
	// 인증번호 검증을 통한 로그인
	@PostMapping(value = "loginCertification.json")
	public ApiEnvelope loginCertification(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.loginCertification(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}
	//****** SMS Email 인증용 로그인 ************************************************************************//

	// 페이지에 설정된 다국어 언어 정보를 변경한다.
	@PostMapping(value = "changeLocale.json")
	public ApiEnvelope changeLocale(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.changeLocale(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}
	
	// SAP 데이터를 기준으로 사용자의 법인 구분이 HS효성인지 (주)효성인지 조회
	@PostMapping(value = "getEaiCorpHoldings.json")
	public ApiEnvelope getEaiCorpHoldings(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return loginService.getEaiCorpHoldings(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}

}
