package xs.webbase.login.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import xs.core.api.service.ApiService;
import xs.core.enumeration.XtrmEnum;
import xs.core.extend.XtrmDefaultResource;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCryptoUtil;
import xs.domain.certification.service.CertificationService;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComUser;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;

import static xs.vob.cmmn.service.CmmnServiceImpl.getMessage;

@Slf4j
@Service
public class LoginServiceImpl extends XtrmDefaultResource implements LoginService {

	@Autowired
	CertificationService certificationService;

	@Autowired
	CmmnService cmmnService;

	@Autowired
	ApiService apiService;

	@Resource(name = "xtrmProperty")
	public XtrmProperty objXtrmConfig;

	//****** 로그인 공통 관련 인터페이스  ************************************************************************//
	//****** 로그인 공통 관련 인터페이스  ************************************************************************//
	
	//****** 로그인 일반 ************************************************************************//
	// 도메인을 이용한 대상 회사정보 검색
	@Override
	public ApiEnvelope selectDataCompanyInfo(ApiEnvelope objXtrmParams, HttpServletRequest objRequest) throws Exception {
		String certificationCase = mobjXtrmConfig.getString("CERTIFICATION_CASE","NONE");						// 2Factor 인증처리 구분(NONE,OTP,SMS_MAIL)
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		int certNumberExpireSeconds = mobjXtrmConfig.getInt("CERTIFICATION_NUMBER_EXPIRE_SECONDS",180);			// 인증번호 발송 후 만료되는 최대 초
		String connectUrl = objRequest.getServerName();															// Request 객체에서 접속 도메인 추출
		
		//파라메터 추가 설정
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		objXtrmParams.setString("connectUrl", connectUrl);

		//솔루션코드를 이용하여 URL 매핑 조건 설정
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.webbase.login.LoginMapper", "selectComCompanyWithUrl", objXtrmParams);
		
		//해더에 2Factor 인증처리 구분 코드, 인증번호 최대 만료 분 설정
		objXtrmReturn.setHeader("certificationCase", certificationCase);
		objXtrmReturn.setHeader("certNumberExpireSeconds", certNumberExpireSeconds);
		
		//회사콤보박스조회 후 GROUP 데이터에 추가
		ApiEnvelope companyCombo = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.webbase.login.LoginMapper", "selectComCompanyCombo", objXtrmParams);
		objXtrmReturn.setDataArrayNode(companyCombo.getDataArrayNode(), "COMPANY_COMBO");
		
		return objXtrmReturn;
	}	
	
	// 로그인 시 계정을 암호화하기 위한 암호화키를 생성하여 클라이언트에 반환하고 세션정보에 담는다.
	@Override
	public ApiEnvelope createOTPEncryptKey(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		//반환 파라메터 생성
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		
		//난수 생성으로 32자리 영문과 숫자 조합 문자열 암호화 키 정보 생성
		String strEncryptKey	= Base64.encodeBase64String(XtrmCryptoUtil.generateAESKey(256)).toString();
		strEncryptKey			= strEncryptKey.substring(0, 32);
		
		//세션정보에 생성된 키 정보를 삽입
		objSession.setAttribute("ENCRYPT_KEY", strEncryptKey);
		
		//최종 반환정보 세팅
		objXtrmReturn.setString("ENCRYPT_KEY"	, strEncryptKey);
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		
		return objXtrmReturn;
	}	
	
	//일반 로그인
	@Override
	public ApiEnvelope loginBase(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		//반환 객체 생성
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		
		//로그인을 위한 필수항목 체크 및 추가 처리
		if(!validationLoginBase(objXtrmParams, objSession, objXtrmReturn)){return objXtrmReturn;}

		//사용자 정보 조회
		//다국어를 지원하기 위해 로그인시 선택한 언어 코드를 파라메터에 추가함
		ComUser objUser = cmmnService.selectUserForLogin(objXtrmParams.getString("companyCode"), objXtrmParams.getString("userId"), objXtrmParams.getString("languageCode"));

		String cilentIp = objRequest.getHeader("X-Forwarded-For");
		if( null != cilentIp && !cilentIp.isEmpty() ) {
			cilentIp = cilentIp.split(",")[0].trim();
		}else if(objRequest.getHeader("x-real-ip") == null) {
			cilentIp = objRequest.getRemoteAddr();
		}else {
			cilentIp = objRequest.getHeader("x-real-ip");
		}

		//로그인을 위한 사용자정보 체크
//		if(!validationLoginUser(objXtrmParams, objUser, objXtrmReturn, cilentIp)){return objXtrmReturn;}
		
		//세션정보생성 
		String recentLoginDt = XtrmCmmnUtil.getFormatDateTime(objUser.getRecentLoginDt());
		apiService.createSessionAndUpdate(objUser, objRequest, objXtrmParams);
		objXtrmReturn.setString("recentLoginDt", recentLoginDt);
		objXtrmReturn.setString("currLoginDate", objSession.getAttribute("LOGIN_DATETIME").toString());

		return objXtrmReturn;
	}		
	
	// 로그인 파라미터 검증 및 복호화 처리
	private boolean validationLoginBase(ApiEnvelope objXtrmParams, HttpSession objSession, ApiEnvelope objXtrmReturn) throws Exception {
		//암호화(OTP) 체크
		String strEncryptKey = (String)objSession.getAttribute("ENCRYPT_KEY");
		objSession.removeAttribute("ENCRYPT_KEY"); //세션정보에서 암호화 키(OTP) 삭제
		if(strEncryptKey == null || "".equals(strEncryptKey)) {
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_ENF.getCodeName(),  MainEnum.LOGIN_ENF.getCode());
			return false;
		}

		//필수파라메터체크
		String companyCode = objXtrmParams.getString("companyCodeEncrypt").replace(" ", "+");
		String userId = objXtrmParams.getString("userIdEncrypt").replace(" ", "+");
		String password = objXtrmParams.getString("passwordEncrypt").replace(" ", "+");
		if(companyCode.equals("") || userId.equals("") || password.equals("")) {objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_EMPTY.getCodeName(),  MainEnum.LOGIN_EMPTY.getCode());return false;}
		
		//사용자정보를 검색하기 위해 복화한 키 정보를 반환한다.
		objXtrmParams.setString("companyCode", XtrmCryptoUtil.decryptAES(companyCode, strEncryptKey));
		objXtrmParams.setString("userId", XtrmCryptoUtil.decryptAES(userId, strEncryptKey));
		objXtrmParams.setString("password", XtrmCryptoUtil.decryptAES(password, strEncryptKey));
		
		return true;
    }		
		
	
	// 로그아웃
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope logout(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		// 반환 객체 생성
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		ApiEnvelope xtrmParams	= new ApiEnvelope();
		
		//세션정보가 존재할 경우 사용자 정보의 로그아웃 처리와 세션을 소멸한다.
		if(objSession != null){
			xtrmParams.setString("loginAt", "N");
			xtrmParams.setString("companyCode", objSession.getAttribute("COMPANY_CODE").toString());
			xtrmParams.setString("userId", objSession.getAttribute("USER_ID").toString());
			xtrmParams.setString("recentLogoutDt", XtrmCmmnUtil.getFormatDateTimeMilli("-", ":"));

			//접속정보 업데이트
			cmmnService.updateUser(xtrmParams, mobjXtrmDao);

			//세션정보 소멸
			objSession.invalidate();
			objSession = null;
		}

		objXtrmReturn.setResultHeader(false, MainEnum.LOGOUT_OK.getCodeName());

		return objXtrmReturn;
	}	
	
	// 비밀번호 수정
	@Override
	public ApiEnvelope changeUserPassword(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		//반환 파라메터 생성
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		//암호화 파라메터 복호화 처리
		String strEncryptKey = (String)objSession.getAttribute("ENCRYPT_KEY");
		objSession.removeAttribute("ENCRYPT_KEY"); //세션정보에서 암호화 키(OTP) 삭제
		if(strEncryptKey != null && !"".equals(strEncryptKey)){
			//요청 암호화 파라메터 복호화
			String strCompanyCode = XtrmCryptoUtil.decryptAES(objXtrmParams.getString("companyCodeEncrypt").replace(" "	, "+"), strEncryptKey);
			String strUserId = XtrmCryptoUtil.decryptAES(objXtrmParams.getString("userIdEncrypt").replace(" "		, "+"), strEncryptKey);
			String strPasswordEncpt = XtrmCryptoUtil.decryptAES(objXtrmParams.getString("passwordEncrypt").replace(" "	, "+"), strEncryptKey);
			String strOldPasswordEncpt = XtrmCryptoUtil.decryptAES(objXtrmParams.getString("passwordOldEncrypt").replace(" "	, "+"), strEncryptKey);
			String strNewPassword = XtrmCryptoUtil.decryptAES(objXtrmParams.getString("passwordNew").replace(" "		, "+"), strEncryptKey);
			objXtrmParams.setString("companyCode", strCompanyCode);
			objXtrmParams.setString("userId", strUserId);
			objXtrmParams.setString("passwordEncpt", strPasswordEncpt);
			objXtrmParams.setString("passwordOldEncpt", strOldPasswordEncpt);
			objXtrmParams.setString("passwordNew", strNewPassword);
			objXtrmReturn = cmmnService.changeUserPassword(objXtrmParams, mobjXtrmDao);
		}
		
		return objXtrmReturn;
	}

	//****** 로그인 일반 ************************************************************************//
	
	
	//****** 구글 OTP 인증용 로그인 ************************************************************************//
	// 구글 인증을 통한 로그인
	@Override
	public ApiEnvelope loginOTP(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 OTP 로그인 미지원");
		return objXtrmReturn;
	}		
	
	//OTP 발급 재발급
	@Override
	public ApiEnvelope createOTPKey(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 OTP 발급 미지원");
		return objXtrmReturn;
	}	
	

	// OTP 검증 후 비밀번호 수정
	@Override
	public ApiEnvelope changePasswordOTP(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 OTP 비밀번호 변경 미지원");
		return objXtrmReturn;
	}	
	//****** 구글 OTP 인증용 로그인 ************************************************************************//
	

	
	//****** SMS Email 인증용 로그인 ************************************************************************//
	// 로그인을 위한 인증매체 정보
	@Override
	public ApiEnvelope loginSMSMail(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 SMS/메일 인증 로그인 미지원");
		return objXtrmReturn;
	}		
	
	// 인증번호발송
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope sendCertificationNumber(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 인증번호 발송 미지원");
		return objXtrmReturn;
	}

	// 인증번호 검증을 통한 로그인
	@Override
	public ApiEnvelope loginCertification(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 인증번호 로그인 미지원");
		return objXtrmReturn;
	}
	//****** SMS Email 인증용 로그인 ************************************************************************//

	// 페이지에 설정된 다국어 언어 정보를 변경한다.
	@Override
	public ApiEnvelope changeLocale(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception {
		ApiEnvelope objXtrmReturn  = new ApiEnvelope();
		String languageCode = objXtrmParams.getString("languageCode");
		// languageCode값을 변경한다.
		objSession.setAttribute("LANGUAGE_CODE", languageCode);
		objXtrmReturn = apiService.initLoginPageLoad(objXtrmParams, objSession);
		applyLocalizedUserNamesToSession(objSession, languageCode);
		return objXtrmReturn;
	}

	/**
	 * selectUserBase 기준으로 세션 표시명(이름·직위·부서)을 갱신한다.
	 * SSO 로그인(selectUserForLogin)은 VIEW_VOB_DEPT_INFO 조인이 더 엄격해 부서명이 비는 경우가 있어,
	 * changeLocale·최초 진입 보강에 동일 로직을 사용한다.
	 */
	private void applyLocalizedUserNamesToSession(HttpSession objSession, String languageCode) throws Exception {
		if (objSession == null || objSession.getAttribute("USER_ID") == null || objSession.getAttribute("COMPANY_CODE") == null) {
			return;
		}
		String userId = objSession.getAttribute("USER_ID").toString();
		String companyCode = objSession.getAttribute("COMPANY_CODE").toString();
		ComUser objUser = cmmnService.selectUserBase(companyCode, userId, languageCode);
		if (objUser == null || objUser.getUserId() == null || "".equals(objUser.getUserId())) {
			return;
		}
		objSession.setAttribute("COMPANY_NAME", XtrmCmmnUtil.convertString(objUser.getCompanyName(), ""));
		objSession.setAttribute("CORP_NAME", XtrmCmmnUtil.convertString(objUser.getCorpName(), ""));
		objSession.setAttribute("OFFICIAL_POSITION_NAME", XtrmCmmnUtil.convertString(objUser.getOfficialPositionName(), ""));
		objSession.setAttribute("USER_NAME", XtrmCmmnUtil.convertString(objUser.getUserName(), ""));
		objSession.setAttribute("DEPT_NAME", XtrmCmmnUtil.convertString(objUser.getDeptName(), ""));
		objSession.setAttribute("FULL_DEPT_NAME", XtrmCmmnUtil.convertString(objUser.getFullDeptName(), ""));
	}
	
	// SAP 데이터를 기준으로 사용자의 법인 구분이 HS효성인지 (주)효성인지 조회
	@Override
	public ApiEnvelope getEaiCorpHoldings(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.webbase.login.LoginMapper", "selectEaiCorpHoldings", objXtrmParams);
	}


	// 로그인 대상자 검증
	private boolean validationLoginUser(ApiEnvelope objXtrmParams, ComUser objUser, ApiEnvelope objXtrmReturn, String remoteAddr) throws Exception {
		// 프로퍼티에 의한 기준값 추출
		int LIMIT_PASSWORD_FAIL_COUNT = mobjXtrmConfig.getInt("LIMIT_PASSWORD_FAIL_COUNT",5);
		boolean DUPLICATION_LOGIN_AVAILABLE = mobjXtrmConfig.getBoolean("DUPLICATION_LOGIN_AVAILABLE", true);	//환경정보의 중복로그인 허용 여부

		// 고객사 요청에 따른 마스터 패스워드 기능 부여.. 2026.01
		// 마스터 로그인 가능 여부 속성이 true이고 패스워드 입력 값이 마스터 패스워드 암호화 값과 일치한다면 isMaster == true
		boolean isMaster = mobjXtrmConfig.getBoolean("MASTER_LOGIN_AVAILABLE", false) && objXtrmParams.getString("password").equals(mobjXtrmConfig.getString("MASTER_LOGIN_PASSWORD_ENCPT"));
		objXtrmParams.setBoolean("isMaster", isMaster);

		//사용자정보 존재 유무 판단
		if(objUser == null || objUser.getUserId() == null || "".equals(objUser.getUserId())){
			//계정정보 불일치나 사용자 정보 존재유무를 구분하지않고 alert 메세지 보여줘야함.
			objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR02.getCodeName(),  MainEnum.PASSWORD_CHANGE_ERROR02.getCode());
			return false;
		}
		
		//계정이 잠겨있고, 비밀번호 실패 횟수가 초가된 경우
		if(!"Y".equals(objUser.getAccountUseAt()) && XtrmCmmnUtil.convertInteger(objUser.getPasswordErrorCount(), 0) > LIMIT_PASSWORD_FAIL_COUNT){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_PFO.getCodeName() + MainEnum.LIMIT_COUNT.getCodeName() + "(" + LIMIT_PASSWORD_FAIL_COUNT + ")",  MainEnum.LOGIN_PFO.getCode());
			return false;
		}	
		
		//계정이 잠긴 상태
		if(!"Y".equals(objUser.getAccountUseAt())){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_UTL.getCodeName(),  MainEnum.LOGIN_UTL.getCode());
			return false;
		}

		//계정정보 불일치(비밀번호체크) -> 마스터패스워드의 경우 해당 validation을 태우지 않음..
		if(!cmmnService.validationUserPassword(objXtrmParams.getString("password"), objUser.getPasswordEncpt(), objUser.getEncptKeyInfo()) && !isMaster){
			//비밀번호 실패 횟수 증가
			cmmnService.increaseWrongPasswordCount(objXtrmParams.getString("companyCode"), objXtrmParams.getString("userId"), objUser.getPasswordErrorCount(), mobjXtrmDao);
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_NMP.getCodeName(),  MainEnum.LOGIN_NMP.getCode());
			return false;
		}	

		//장시간 미사용 여부 체크(미사용시간 6개월 초과 시 사용불가)		
		if("Y".equals(objUser.getIsLockAccount())){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_LNL.getCodeName(),  MainEnum.LOGIN_LNL.getCode());
			return false;
		}
		
		//초기화 비밀번호 여부 체크
		if(cmmnService.validationUserPassword(XtrmCryptoUtil.encryptSHA256(objUser.getUserId(), ""), objUser.getPasswordEncpt(), objUser.getEncptKeyInfo())){
			if(!objXtrmParams.getBoolean("isChangePassword")) {
				objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_EUP.getCodeName(),  MainEnum.LOGIN_EUP.getCode());
				return false;
			}
		}	 
		
		//마지막 비밀번호 변경일시 체크(3개월 초과 시 변경 필수)
		// 20241210 JJH 통합테스트 패스워드 변경 조건 – 60일 (효성 정책)에 따른 2달로 변경 -> 6개월로 변경
		if(XtrmCmmnUtil.getDateDiff(XtrmCmmnUtil.getFormatDateTime(objUser.getRecentPasswordChangeDate()), XtrmCmmnUtil.getFormatDateTime(), "M") >= 6){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_EPW.getCodeName(),  MainEnum.LOGIN_EPW.getCode());
			return false;
		}	
		
		//최소권한정보 확인
		if("".equals(XtrmCmmnUtil.convertString(objUser.getAuthGroupList(), ""))){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_NGR.getCodeName(),  MainEnum.LOGIN_NGR.getCode());
			return false;
		}	

		//PU SAP_CORP_CODE 권한체크
		if(objUser.getVobAuthCount() == 0){
			objXtrmReturn.setResultHeader(true, MainEnum.LOGIN_VOC_AUTH.getCodeName(),  MainEnum.LOGIN_VOC_AUTH.getCode());
			return false;
		}			
		
		//동시로그인 여부 체크
		if(objUser.getRecentConnectIp() != null && !objUser.getRecentConnectIp().equals(remoteAddr) && "Y".equals(objUser.getLoginAt())){
			// 20241210 JJH 운영서버 인입 ip를 확인하기 위하여 log 남김. 안정화후 삭제하면됨.
			log.info( "사용자 중복 로그인 시도 - 사용자 세션 IP : {}, 클라이언트 인입 IP : {}",objUser.getRecentConnectIp(), remoteAddr );
			//마지막 로그인 일시
			String recentLoginDt = XtrmCmmnUtil.getFormatDateTime(objUser.getRecentLoginDt(),"-",":");
			String errorMsg = "";
			
			if(DUPLICATION_LOGIN_AVAILABLE){
				//중복을 허용하기 때문에 관련 메시지만 만들어서 표시한다.
				errorMsg = XtrmCmmnUtil.getPatternMsgFormat(MainEnum.LOGIN_IDA_AVAIL2.getCodeName(), objUser.getRecentConnectIp() + "|" + recentLoginDt);
				objXtrmReturn.setResultHeader(false, errorMsg,  MainEnum.LOGIN_IDA_AVAIL2.getCode());
			} else {
				errorMsg = XtrmCmmnUtil.getPatternMsgFormat(MainEnum.LOGIN_IDA_AVAIL.getCodeName(), objUser.getRecentConnectIp() + "|" + recentLoginDt);
				objXtrmReturn.setResultHeader(true, errorMsg,  MainEnum.LOGIN_IDA_AVAIL.getCode());
				return false;
			}	
		}	
		
		return true;
    }


	//****** Aichat SSO 로그인 ************************************************************************//
	@Override
	public ApiEnvelope loginHyobeeSSO(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession, String acceptLanguage, HttpServletResponse response) throws Exception{
		//반환 객체 생성
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		String companyCode = mobjXtrmConfig.getString("COMPANY_CODE","1000");


		objXtrmParams.setString("companyCode", companyCode);
		objXtrmParams.setString("languageCode", acceptLanguage);
		objXtrmParams.setString("userId", objXtrmParams.getString("samaccountname"));


		//사용자 정보 조회
		ComUser objUser = cmmnService.selectUserForLogin(objXtrmParams.getString("companyCode"), objXtrmParams.getString("userId"), acceptLanguage);

		String cilentIp = objRequest.getHeader("X-Forwarded-For");
		if( null != cilentIp && !cilentIp.isEmpty() ) {
			cilentIp = cilentIp.split(",")[0].trim();
		}else if(objRequest.getHeader("x-real-ip") == null) {
			cilentIp = objRequest.getRemoteAddr();
		}else {
			cilentIp = objRequest.getHeader("x-real-ip");
		}

		//로그인을 위한 사용자정보 체크
		if(!validationLoginUserHyobeeSSO(objXtrmParams, objUser, objXtrmReturn, cilentIp, acceptLanguage,response )){return objXtrmReturn;}

		//세션정보생성
		String recentLoginDt = XtrmCmmnUtil.getFormatDateTime(objUser.getRecentLoginDt());
		apiService.createSessionAndUpdate(objUser, objRequest, objXtrmParams);
		// selectUserForLogin 부서 조인과 selectUserBase 차이로 표시명이 비는 경우 보강
		applyLocalizedUserNamesToSession(objSession, acceptLanguage);
		objXtrmReturn.setString("recentLoginDt", recentLoginDt);
		objXtrmReturn.setString("currLoginDate", objSession.getAttribute("LOGIN_DATETIME").toString());

		return objXtrmReturn;
	}

	// 로그인 대상자 검증
	private boolean validationLoginUserHyobeeSSO(ApiEnvelope objXtrmParams, ComUser objUser, ApiEnvelope objXtrmReturn, String remoteAddr, String acceptLanguage, HttpServletResponse response) throws Exception {
		// 프로퍼티에 의한 기준값 추출
		boolean DUPLICATION_LOGIN_AVAILABLE = mobjXtrmConfig.getBoolean("DUPLICATION_LOGIN_AVAILABLE", true);	//환경정보의 중복로그인 허용 여부

		//사용자정보 존재 유무 판단
		if(objUser == null || objUser.getUserId() == null || "".equals(objUser.getUserId())){
			//계정정보 불일치나 사용자 정보 존재유무를 구분하지않고 alert 메세지 보여줘야함.
			String message = getMessage("MainEnum.PASSWORD_CHANGE_ERROR02"  , acceptLanguage);
			objXtrmReturn.setResultHeader(true,message,  MainEnum.PASSWORD_CHANGE_ERROR02.getCode());
			objXtrmReturn.setString("ERROR_MSG_SUB", "Check Account");
			response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
			response.sendError(HttpStatus.FORBIDDEN.value());
			return false;
		}

//		//계정이 잠긴 상태
//		if(!"Y".equals(objUser.getAccountUseAt())){
//			String message = getMessage("MainEnum.LOGIN_UTL", acceptLanguage);
//			objXtrmReturn.setResultHeader(true,message,  MainEnum.LOGIN_UTL.getCode());
//			objXtrmReturn.setString("ERROR_MSG_SUB", "Account Locked");
//			response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
//			response.sendError(HttpStatus.FORBIDDEN.value());
//			return false;
//		}
//
//		//장시간 미사용 여부 체크(미사용시간 6개월 초과 시 사용불가)
//		if("Y".equals(objUser.getIsLockAccount())){
//			String message = getMessage("MainEnum.LOGIN_LNL", acceptLanguage);
//			objXtrmReturn.setResultHeader(true, message,  MainEnum.LOGIN_LNL.getCode());
//			objXtrmReturn.setString("ERROR_MSG_SUB", "Account Locked");
//			response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
//			response.sendError(HttpStatus.FORBIDDEN.value());
//			return false;
//		}
//
//		//최소권한정보 확인
//		if("".equals(XtrmCmmnUtil.convertString(objUser.getAuthGroupList(), ""))){
//			String message = getMessage("MainEnum.LOGIN_NGR", acceptLanguage);
//			objXtrmReturn.setResultHeader(true, message,  "SSO_AUTH");
//			objXtrmReturn.setString("ERROR_MSG_SUB", "Unauthorized User");
//			response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
//			response.sendError(HttpStatus.FORBIDDEN.value());
//			return false;
//		}
//
//		//PU SAP_CORP_CODE 권한체크
//		if(objUser.getVobAuthCount() == 0){
//			String message = getMessage("MainEnum.LOGIN_VOC_AUTH", acceptLanguage);
//			objXtrmReturn.setResultHeader(true,message,  MainEnum.LOGIN_VOC_AUTH.getCode());
//			objXtrmReturn.setString("ERROR_MSG_SUB", "Check Permission");
//			response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((objXtrmReturn.toString()), StandardCharsets.UTF_8));
//			response.sendError(HttpStatus.FORBIDDEN.value());
//			return false;
//		}
//
//		//동시로그인 여부 체크
//		if(objUser.getRecentConnectIp() != null && !objUser.getRecentConnectIp().equals(remoteAddr) && "Y".equals(objUser.getLoginAt())){
//			// 20241210 JJH 운영서버 인입 ip를 확인하기 위하여 log 남김. 안정화후 삭제하면됨.
//			log.info( "사용자 중복 로그인 시도 - 사용자 세션 IP : {}, 클라이언트 인입 IP : {}",objUser.getRecentConnectIp(), remoteAddr );
//			//마지막 로그인 일시
//			String recentLoginDt = XtrmCmmnUtil.getFormatDateTime(objUser.getRecentLoginDt(),"-",":");
//			String errorMsg = "";
//
//			if(DUPLICATION_LOGIN_AVAILABLE){
//				String message = getMessage("MainEnum.LOGIN_IDA_AVAIL2", acceptLanguage);
//				//중복을 허용하기 때문에 관련 메시지만 만들어서 표시한다.
//				errorMsg = XtrmCmmnUtil.getPatternMsgFormat(message, objUser.getRecentConnectIp() + "|" + recentLoginDt);
//				objXtrmReturn.setResultHeader(false, errorMsg,  MainEnum.LOGIN_IDA_AVAIL2.getCode());
//			} else {
//				String message = getMessage("MainEnum.LOGIN_IDA_AVAIL", acceptLanguage);
//				errorMsg = XtrmCmmnUtil.getPatternMsgFormat(message, objUser.getRecentConnectIp() + "|" + recentLoginDt);
//				objXtrmReturn.setResultHeader(true, errorMsg,  MainEnum.LOGIN_IDA_AVAIL.getCode());
//				return false;
//			}
//		}

		return true;
	}

	//****** SSO 로그인 ************************************************************************//

}
