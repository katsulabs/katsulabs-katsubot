package xs.webbase.login.service;

import xs.core.dto.ApiEnvelope;
import xs.vob.management.dto.ComUser;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public interface LoginService {

	//****** 로그인 공통 관련 인터페이스  ************************************************************************//

	//****** 로그인 공통 관련 인터페이스  ************************************************************************//

	//****** 로그인 일반 ************************************************************************//
	public ApiEnvelope selectDataCompanyInfo(ApiEnvelope objXtrmParams, HttpServletRequest objRequest) throws Exception;
	public ApiEnvelope createOTPEncryptKey(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	public ApiEnvelope loginBase(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public ApiEnvelope logout(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	public ApiEnvelope changeUserPassword(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;

	//****** 로그인 일반 ************************************************************************//
	
	
	//****** 구글 OTP 인증용 로그인 ************************************************************************//
	public ApiEnvelope loginOTP(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public ApiEnvelope createOTPKey(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public ApiEnvelope changePasswordOTP(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	//****** 구글 OTP 인증용 로그인 ************************************************************************//	
	
	//****** SMS Email 인증용 로그인 ************************************************************************//
	public ApiEnvelope loginSMSMail(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public ApiEnvelope sendCertificationNumber(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public ApiEnvelope loginCertification(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	//****** SMS Email 인증용 로그인 ************************************************************************//

	//****** Aichat SSO 로그인 ************************************************************************//
	public ApiEnvelope loginHyobeeSSO(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession, String acceptLanguage, HttpServletResponse objResponse) throws Exception;
	//****** Aichat SSO 로그인 ************************************************************************//

	// 언어 변경
	public ApiEnvelope changeLocale(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	// SAP 데이터를 기준으로 사용자의 법인 구분이 HS효성인지 (주)효성인지 조회
	public ApiEnvelope getEaiCorpHoldings(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
}
