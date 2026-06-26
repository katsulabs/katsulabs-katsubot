/********************************************************************************
* @classDescription 사용자 관리 서비스 클래스
* @author HyosungITX Corp.
* @version 1.0
* -------------------------------------------------------------------------------
* Modification Information
* Date				Developer			Content
* -------			-------------		-------------------------
* 2024/11/07		AICC R&D팀				신규생성
* -------------------------------------------------------------------------------
* Copyright (C) 2017 by HyosungITX Corp. All rights reserved.
*********************************************************************************/
package xs.vob.management.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
//import xs.batch.service.BatchWorker;
//import xs.batch.service.BatchWorkerThread;
import xs.core.api.service.ApiService;
import xs.core.enumeration.XtrmEnum;
import xs.core.extend.XtrmDefaultResource;
import xs.core.interfaces.XtrmCallistoInterface;
import xs.core.interfaces.enumeration.CallistoEnums;

import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.utility.*;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComMessage;

import javax.servlet.http.HttpSession;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class ManagementServiceImpl extends XtrmDefaultResource implements ManagementService {

	// 초기 WAS LOAD시 메모리에 적재할 다국어 데이터 조회 — MessageDataLoader에서 xs.vob.cmmn.CmmnMapper.selectAllMessage로 처리함. 중복 호출 제거.
	@SuppressWarnings("static-access")
	// @PostConstruct
	private void initMessage() throws Exception{
		// List<ComMessage> messageData                = this.selectAllMessage();
		// Map<String, List<ComMessage>> objMessageMap = messageData.stream().collect(Collectors.groupingBy(c -> c.getMessageId()));
		// log.info("초기 메모리에 LOAD한 다국어 데이터(MESSAGE_ID 그룹핑 기준) 건수 : {}", objMessageMap.size() );
		// cmmnService.setInitMessageData(objMessageMap);
	}

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Autowired
	ApiService apiService;

	@Autowired
	CmmnService cmmnService;

	@Autowired
	xs.domain.cmmn.service.CmmnService domainService;

	@Autowired
	ThreadPoolTaskExecutor objTaskExecutor;

	@Autowired
	XtrmCallistoInterface xtrmCallistoInterface;

	//****** Oversea Pu 관리  ************************************************************************//
	@Override
	public ApiEnvelope retrieveOverseaPuList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "retrieveOverseaPuList", objXtrmParams);
	}
	@Override
	public ApiEnvelope retrieveOverseaPuCodeList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "retrieveOverseaPuCodeList", objXtrmParams);
	}
	@Override
	public ApiEnvelope retrieveOverseaPuUpdate(ApiEnvelope objXtrmParams) throws Exception {

		// 반환용 변수
		ApiEnvelope objXtrmReturn				   = new ApiEnvelope();
		ArrayNode overseaPuArrayNode          = objXtrmParams.getDataArrayNode("overseaPuJsonArray");
		int workCnt                           = 0;
		int count = 0;

		if(overseaPuArrayNode != null) {
			for (JsonNode row : overseaPuArrayNode) {
				ObjectNode obj = objectNode(row);
				if("U".equals(text(obj, "DATA_FLAG"))) {
					workCnt++;
					count += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateOverseaPuList", obj);
				}else if("I".equals(text(obj, "DATA_FLAG"))){
					workCnt++;
					count += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertOverseaPuList", obj);
				}
			}
		}

		// 생성된 데이터가 인입된 데이터 카운트와 같은 경우 성공(실제 조건보다 데이터 적게 생성된 경우 에러 반환)
		if(count == workCnt){
			objXtrmReturn.setResultHeader(false, XtrmEnum.UPDATE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_MESSAGE.getCodeName());
		}

		// 결과 객체 반환
		return objXtrmReturn;
	}
	//****** Oversea Pu 관리  ************************************************************************//

	//****** 공통 관련 인터페이스  ************************************************************************//
	// 시스템코드관리 >  상세코드 조회
	@Override
	public ApiEnvelope selectSysCodeDetailData(ApiEnvelope objXtrmParams) throws Exception {
		return cmmnService.selectSysCodeDetailData(objXtrmParams);
	}
	// 팝업 > 메뉴 및 사용자 정보 조회
	@Override
	public ApiEnvelope selectUserMenuData(ApiEnvelope objXtrmParams) throws Exception {
		return cmmnService.selectUserMenuData(objXtrmParams);
	}
	// 엑셀 양식 다운로드
	@Override
	public ApiEnvelope excelTemplateDownload(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "excelTemplateDownload", objXtrmParams);
	}
	// Management 영역 화면에서 사용되는 권한적용 안된 PG, PU, 법인 .. 목록 리스트를 조회한다.
	@Override
	public ApiEnvelope selectManagementCombo(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn							= new ApiEnvelope();

		String formList    = objXtrmParams.getString("formList");
		ApiEnvelope comboList = null;
		if( formList.indexOf("pgCode")>-1 ){
			comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPgCode", objXtrmParams);
			objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"pgList");
			comboList = null;
		}
		if( formList.indexOf("puCode")>-1 ){
			comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPuCode", objXtrmParams);
			objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"puList");
			comboList = null;
		}
		if( formList.indexOf("corpCode")>-1 ){
			comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectCorpCode", objXtrmParams);
			objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"corpCode");
			comboList = null;
		}

		return objXtrmReturn;
	}
	@Override
	public ApiEnvelope selectCorpComboByPu(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope comboList = null;
		comboList = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectCorpComboByPu", objXtrmParams);
		objXtrmReturn.setDataArrayNode(comboList.getDataArrayNode(),"corpCode");
		comboList = null;
		return objXtrmReturn;
	}
	//****** 공통 관련 인터페이스  ************************************************************************//

	//****** 사용자관리  ************************************************************************//
	// 사용자관리 > 사용자 정보 조회
	@Override
	public ApiEnvelope selectUser010(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectUser010", objXtrmParams);
	}

	// 사용자관리 > 사용자 상세 정보 조회
	@Override
	public ApiEnvelope selectUserDetail010(ApiEnvelope objXtrmParams) throws Exception {
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectUserDetail010", objXtrmParams);
	}

	// 사용자관리 > 사용자 정보 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveUser(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		int intReturnValue			= 0;
		String strTxFlag			= objXtrmParams.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
		objXtrmParams.setValueToNull();

		String companyCode		= apiService.getSessionInfo("COMPANY_CODE");

		if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)){
			if(checkExistUser(objXtrmParams)){

				// 대상 회사코드로 암호 생성
				ApiEnvelope objXtrmPasswordCreate	= createPassword(companyCode, XtrmCryptoUtil.encryptSHA256(objXtrmParams.getString("userId"), ""));

				// 암호화 암호 반영
				objXtrmParams.setString("passwordEncpt", objXtrmPasswordCreate.getDataObjectNode().get("passwordEncpt").asText());

				//사용자 신규 등록
				intReturnValue	+= ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertUser", objXtrmParams);
				//확장 사용자 정보 등록
				intReturnValue	+= ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertExtUser", objXtrmParams);
				//확장 사용자 다국어 정보 등록
				intReturnValue	+= ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertExtUserLang", objXtrmParams);
			}else{
				objXtrmReturn.setResultHeader(true, XtrmEnum.DUPLE_KEY_DATA.getCodeName());
				return objXtrmReturn;
			}
		}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)){

			//사용자 정보 수정
			intReturnValue	+= ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateUserManagement", objXtrmParams);
			//확장 사용자 정보 등록
			intReturnValue	+= ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeExtUser", objXtrmParams);
			//확장 사용자 다국어 정보 등록
			intReturnValue	+= ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeExtUserLang", objXtrmParams);
		}
		if(intReturnValue == 0){
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}

	// 사용자관리 > 사용자 정보 삭제
//	@Override
//	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
//	public ApiEnvelope deleteUser(ApiEnvelope objXtrmParams) throws Exception {
//		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
//		int intReturnValue		= 0;
		/*
		 * 사용자 삭제 순서
		 * - COM_AUTH_GROUP_USER(사용자별 권한그룹)
		 * - COM_USER_PASSWORD_HISTORY(로그인암호 변경이력)
		 * - COM_USER(사용자 관리)
		 */
		//COM_USER_CERTIFICATION 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteCertificationData", objXtrmParams);
//		//COM_AUTH_GROUP_USER 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteAuthGroupUserByUserId", objXtrmParams);
//		//COM_USER_PASSWORD_HISTORY 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteUserPasswordHistory", objXtrmParams);
//		//VOB_EXT_USER_LANG 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteExtUserLang", objXtrmParams);
//		//VOB_EXT_USER 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteExtUser", objXtrmParams);
//		//COM_USER 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteUserByKey", objXtrmParams);
//		if(intReturnValue == 0){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
//		}else{
//			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
//		}
//		return objXtrmReturn;
//	}

	// 사용자관리 > 사용자 계정 잠김 해제
	@Override
	public ApiEnvelope unlockUserAccount(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intReturnValue		= 0;
		intReturnValue += mobjXtrmDao.updateList("xs.vob.management.ManagementMapper", "unlockUserAccount", objXtrmParams.getDataArrayNode());
		if(intReturnValue == 0){
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.UPDATE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}

	// 사용자관리 > 사용자 암호 초기화
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope initUserPass(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intChangeCount		= 0;

		ApiEnvelope objXtrmPass = new ApiEnvelope();
		for(int i=0; i<objXtrmParams.getDataArrayNode().size(); i++){
			ApiEnvelope objXtrmReturnPass = new ApiEnvelope();
			objXtrmPass.setString("companyCode", objXtrmParams.getString("companyCode", i));
			objXtrmPass.setString("userId", objXtrmParams.getString("userId", i));
			objXtrmPass.setString("passwordEncpt", XtrmCryptoUtil.encryptSHA256(objXtrmParams.getString("userId", i), ""));
			objXtrmPass.setBoolean("init", true);
			objXtrmReturnPass = cmmnService.changeUserPassword(objXtrmPass, mobjXtrmDao);
			if(!objXtrmReturnPass.getErrorFlag()){
				intChangeCount++;
			}
		}
		if(objXtrmParams.getDataArrayNode().size() == intChangeCount) {
			objXtrmReturn.setResultHeader(false, MainEnum.PASSWORD_SET_USERID_PLEASE_CHANGE.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	// 사용자관리 > 사용자 엑셀 업로드 후 사용자 정보 저장 및 수정
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveImportUserData(ApiEnvelope objXtrmParams) throws Exception {

		// 검증용 카운트 변수
		int intReturnValue						= 0;

		// 반환용 변수
		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
		objXtrmParams.setValueToNull();

		// 입력 대상 데이터 Json Array
		ArrayNode userListArrayNode 			= objXtrmParams.getDataArrayNode("USER_DATA");

		HttpSession objSession = XtrmCmmnUtilWeb.getServletRequest().getSession(false);
		Object objCompanyCode  = null;
		if(objSession != null){objCompanyCode = objSession.getAttribute("COMPANY_CODE");}

		String companyCode = objCompanyCode.toString();

		for(int i = 0; i < userListArrayNode.size(); i++) {
			// 대상 데이터
			ObjectNode targetImportUser 		= objectNode(userListArrayNode.get(i));
			String importUserId 				= text(targetImportUser, "userId");

			// 중복체크용 객체 생성
			ApiEnvelope searchXtrmJson				= new ApiEnvelope();
			searchXtrmJson.setString("companyCode", companyCode);
			searchXtrmJson.setString("userId", importUserId);
			// 기존에 해당 유저 있는지 확인
			if(checkExistUser(searchXtrmJson)){

				// 입사일자 밸리데이션 체크
				String entranceCompanyDate = targetImportUser.get("entranceCompanyDate").asText().replaceAll("-","");
				//if( "".equals(entranceCompanyDate)  ){objXtrmReturn.setResultHeader(true, MainEnum.EMPTY_DATA_EMPLOYMENT_DATE.getCodeName()); return objXtrmReturn;}
				if( ! "".equals(entranceCompanyDate)  ){
					if( !entranceCompanyDate.matches( "\\d+" )){objXtrmReturn.setResultHeader(true, MainEnum.NOT_VALID_EMPLOYMENT_DATE.getCodeName()+" ex) 2024-09-05 "); return objXtrmReturn;}
					else if( entranceCompanyDate.length() != 8 ){objXtrmReturn.setResultHeader(true, MainEnum.NOT_VALID_EMPLOYMENT_DATE1.getCodeName()+" ex) 2024-09-05 "); return objXtrmReturn;}
				}

				// 대상 회사코드로 암호 생성
				ApiEnvelope objXtrmPasswordCreate	= createPassword(companyCode, XtrmCryptoUtil.encryptSHA256(importUserId, ""));

				// 암호화 암호 반영
				targetImportUser.set("passwordEncpt", objXtrmPasswordCreate.getDataObjectNode().get("passwordEncpt").deepCopy());

				// 휴대폰번호 값 존재시 암호화키 생성
				String mobilePhone = targetImportUser.get("mobilePhoneNumber").asText().replaceAll("-","");
				if( !"".equals(mobilePhone) ){
					String mobilePhoneKey   = domainService.getAesKey(companyCode, mobilePhone);
					String mobilePhoneMask  = XtrmCmmnUtil.getMaskingText(mobilePhone,XtrmEnum.PHONE_PATTERN.getCode());
					targetImportUser.put("mobilePhoneKey", mobilePhoneKey);
					targetImportUser.put("mobilePhoneMask", mobilePhoneMask);
					targetImportUser.put("mobilePhone", mobilePhone);
				}

				// 이메일 값 존재시 암호화키 생성
				String email = targetImportUser.get("emailAddressInfo").asText().replaceAll("-","");
				if( !"".equals(email) ){
					String emailKey   = domainService.getAesKey(companyCode, email);
					String emailMask  = XtrmCmmnUtil.getMaskingText(email,XtrmEnum.EMAIL_PATTERN.getCode());
					targetImportUser.put("emailKey", emailKey);
					targetImportUser.put("emailMask", emailMask);
					targetImportUser.put("email", email);
				}

				// 계정 사용여부 반영
				targetImportUser.put("accountUseAt", Character.toString('Y'));

				// 계정 회사코드 반영
				targetImportUser.put("companyCode", companyCode);

				// 사번 아이디 반영
				targetImportUser.put("empNumber", importUserId);

				// 입사일자 반영
				targetImportUser.put("entranceCompanyDate", entranceCompanyDate);

				// 데이터 인입
				intReturnValue	+= mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertUser", targetImportUser);
				//확장 사용자 정보 등록
				intReturnValue	+= mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertExtUser", targetImportUser);
				//확장 사용자 다국어 정보 등록
				intReturnValue	+= mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertExtUserLang", targetImportUser);
			}else{
				// 이미 유저가 있으면, 중복 에러 반환
				objXtrmReturn.setResultHeader(true, XtrmEnum.DUPLE_KEY_DATA.getCodeName());
				return objXtrmReturn;
			}
		}

		// 생성된 데이터가 인입된 데이터 카운트와 같은 경우 성공(실제 조건보다 데이터 적게 생성된 경우 에러 반환)
		if(intReturnValue == userListArrayNode.size()){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}

		// 결과 객체 반환
		return objXtrmReturn;
	}

	// 클라이언트에서 전송된 1차 Hash 데이터를 이용하여 EncptKeyInfo키를 랜덤하게 생성하고 EncptKeyInfo와 반복처리를 통해 2차 암호화 비밀번호를 생성하여 반환한다.
	private ApiEnvelope createPassword(String strCompanyCode, String strPasswordEncpt) throws Exception {
		ApiEnvelope objXtrmReturn			= new ApiEnvelope();
		ApiEnvelope objXtrmParams			= new ApiEnvelope();
		String strEncptKeyInfo			= new String();
		objXtrmParams.setString("companyCode", strCompanyCode);
		ApiEnvelope companyInfo = cmmnService.selectCompanyByKey(objXtrmParams);

		if(companyInfo.getCount() > 0){
			strEncptKeyInfo = companyInfo.getString("encptKeyInfo");
			//5회 수행
			for(int i = 0; i < 5; i++){
				strPasswordEncpt = XtrmCryptoUtil.encryptSHA256(strPasswordEncpt + strEncptKeyInfo, "");
			}
		}
		objXtrmReturn.setString("passwordEncpt"	, strPasswordEncpt);
		objXtrmReturn.setString("encptKeyInfo"	, strEncptKeyInfo);
		return objXtrmReturn;
	}

	// 사용자관리 > 사용자 등록 엑셀 양식 업로드
	@Override
	public ApiEnvelope importUserExcelTemplateFile(List<MultipartFile> fileList, ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 엑셀 업로드 미지원");
		return objXtrmReturn;
	}


	// 사용자 정보 중복 체크
	public boolean checkExistUser(ApiEnvelope objXtrmParam) throws Exception{
		ApiEnvelope resultXtrmJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "checkExistUserWithId", objXtrmParam);
		return (resultXtrmJson.getDataObjectNode().get("existCount").asInt() == 0);
	}
	//****** 사용자관리  ************************************************************************//

	//****** 조직관리  ************************************************************************//
	// 조직관리, 회사정보관리 > 조직 정보 조회
	@Override
	public ApiEnvelope selectDeptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDept", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, new String[]{"deptName","deptShortName"});
		return objXtrmReturn;
	}

	// 조직관리 > 조직 저장시
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveDeptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intProcCnt			= 0;
		objXtrmParams.setValueAllToNull();
		ArrayNode objData = objXtrmParams.getDataArrayNode();
		for(int i = 0; i < objData.size(); i++){
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				if(!checkExistDept(objXtrmParams.getDataObjectNode(i))){
					intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertDept", objXtrmParams.getDataObjectNode(i));
					mergeDeptLang(objXtrmParams.getDataObjectNode(i));
				}else{
					objXtrmReturn.setResultHeader(true, XtrmEnum.DUPLE_KEY_DATA.getCodeName());
				}
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateDept", objXtrmParams.getDataObjectNode(i));
				mergeDeptLang(objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteDeptLang", objXtrmParams.getDataObjectNode(i));
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteDept", objXtrmParams.getDataObjectNode(i));
			}
		}
		if(intProcCnt > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}
	// 다국어 부서정보를 저장한다.
	private void mergeDeptLang(ObjectNode objXtrmParam) throws Exception{
		ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
		objXtrmCodeParams.setString("groupCode", "SYS028");
		objXtrmCodeParams.setString("useAt", "Y");
		// COM_SYS_CODE에서 SYS028을 가져온다.
		ApiEnvelope objXtrmCodeData = selectSysCodeDetailData(objXtrmCodeParams);

		ApiEnvelope objXtrmParams   = new ApiEnvelope(objXtrmParam);
		ApiEnvelope objXtrmDeptLang = ApiEnvelopes.copyOf(objXtrmParams);
		// LanguageCode값으로 CodeName, CodeDesc, LanguageCode, GroupCode, Code를 넣어주어서 생성합니다.
		for(int i=0;i<objXtrmCodeData.getCount();i++){
			String languageCode    = objXtrmCodeData.getString("code", i);
			String capLanguageCode = capitalizeFirstLetter(languageCode);
			if(languageCode.equals("*****")){
				continue;
			}
			objXtrmDeptLang.setString("deptName", objXtrmParams.getString("deptName"+capLanguageCode));
			objXtrmDeptLang.setString("deptShortName", objXtrmParams.getString("deptShortName"+capLanguageCode));
			objXtrmDeptLang.setString("languageCode", languageCode);
			ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeDeptLang", objXtrmDeptLang);
		}
	}

	// 조직관리 > 조직 등록 엑셀 업로드
	@Override
	public ApiEnvelope importDeptExcelTemplateFile(List<MultipartFile> fileList, ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn.setResultHeader(true, "aichat 전용에서는 엑셀 업로드 미지원");
		return objXtrmReturn;
	}

	// 조직관리 > 업로드한 엑셀 내 조직 정보 등록 및 수정
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveImportDeptData(ApiEnvelope objXtrmParams) throws Exception {

		// 검증용 카운트 변수
		int intReturnValue						= 0;

		// 반환용 변수
		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
		objXtrmParams.setValueToNull();

		// 입력 대상 데이터 Json Array
		ArrayNode deptListArrayNode 			= objXtrmParams.getDataArrayNode("DEPT_DATA");

		// 입력 대상 회사 코드
		String companyCode		= apiService.getSessionInfo("COMPANY_CODE");

		for(int i = 0; i < deptListArrayNode.size(); i++) {
			// 대상 데이터
			ObjectNode targetImportDept 		= objectNode(deptListArrayNode.get(i));
			String importDeptCode 				= text(targetImportDept, "deptCode");

			// 중복체크용 객체 생성
			ApiEnvelope searchXtrmJson				= new ApiEnvelope();
			searchXtrmJson.setString("companyCode", companyCode);
			searchXtrmJson.setString("deptCode", importDeptCode);
			// 기존에 해당 부서가 있는지 확인
			if(!checkExistDept(searchXtrmJson)){
				// 사용여부 반영
				targetImportDept.put("useAt", Character.toString('Y'));

				// 부서 회사코드 반영
				targetImportDept.put("sessionCompanyCode", companyCode);
				targetImportDept.put("companyCode", companyCode);

				// 데이터 인입
				intReturnValue					+= mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertDept", targetImportDept);
			}else{
				// 이미 유저가 있으면, 중복 에러 반환
				objXtrmReturn.setResultHeader(true, XtrmEnum.DUPLE_KEY_DATA.getCodeName());
				return objXtrmReturn;
			}
		}

		// 생성된 데이터가 인입된 데이터 카운트와 같은 경우 성공(실제 조건보다 데이터 적게 생성된 경우 에러 반환)
		if(intReturnValue == deptListArrayNode.size()){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}

		// 결과 객체 반환
		return objXtrmReturn;
	}

	private boolean checkExistDept(ObjectNode objData) throws Exception {
		ApiEnvelope objXtrmParams	= new ApiEnvelope();
		objXtrmParams.setDataObjectNode(objData);
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDeptByKey", objXtrmParams);
		return (objXtrmReturn.getCount() > 0);
	}
	private boolean checkExistDept(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDeptByKey", objXtrmParams);
		return (objXtrmReturn.getCount() > 0);
	}
	//****** 조직관리  ************************************************************************//

	//****** 공통코드관리  ************************************************************************//
	// 공통코드관리 > 코드 조회
	@Override
	public ApiEnvelope selectCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectCodeData", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, new String[]{"codeName","codeDesc"});
		return objXtrmReturn;
	}

	// 공통코드관리 > 상세 코드 조회
	@Override
	public ApiEnvelope selectCodeDetailData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectCodeDetailData", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, new String[]{"codeName","codeDesc"});
		return objXtrmReturn;
	}

	// 공통코드관리 > 코드 저장
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope saveCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		String strTxFlag = objXtrmParams.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
		if (XtrmEnum.TRANSACTION_NONE.getCode().equals(strTxFlag)) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.TRANSACTION_DIVISION_OMISSION.getCodeName());
		} else {
			objXtrmParams.setValueToNull();
			if (XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)) {
				if (ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDuplicateGroupCode", objXtrmParams).getInt("duplicated") > 0) {
					objXtrmReturn.setResultHeader(true, MainEnum.GROUP_CODE_ALREADY_EXIST.getCodeName());
					return objXtrmReturn;
				}
				intReturnValue = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertCode", objXtrmParams);
				mergeCodeLang(objXtrmParams);
			} else if (XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)) {
				intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateCode", objXtrmParams);
				mergeCodeLang(objXtrmParams);
			}
			if (intReturnValue == 0) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
			} else {
				objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
			}
		}
		return objXtrmReturn;
	}

	// 공통코드관리 > 사용 여부 변경 시
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope configureCodeUseAt(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateCodeUseAt", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.UPDATE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}

	// 공통코드관리 > 코드 삭제
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope deleteCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteCodeLang", objXtrmParams);
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteCode", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	@SuppressWarnings("unused")
	private void mergeCodeLang(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
		objXtrmCodeParams.setString("groupCode", "SYS028");
		objXtrmCodeParams.setString("useAt", "Y");
		// COM_SYS_CODE에서 SYS028을 가져온다.
		ApiEnvelope objXtrmCodeData = selectSysCodeDetailData(objXtrmCodeParams);

		ApiEnvelope objXtrmCodeLang = ApiEnvelopes.copyOf(objXtrmParams);
		// LanguageCode값으로 CodeName, CodeDesc, LanguageCode, GroupCode, Code를 넣어주어서 생성합니다.
		for(int i=0;i<objXtrmCodeData.getCount();i++){
			String languageCode = objXtrmCodeData.getString("code", i);
			String capLanguageCode = capitalizeFirstLetter(languageCode);
			String groupCode = objXtrmCodeData.getString("groupCode", i);
			if(languageCode.equals("*****")){
				continue;
			}
			objXtrmCodeLang.setString("codeName", objXtrmParams.getString("codeName"+capLanguageCode));
			objXtrmCodeLang.setString("codeDesc", objXtrmParams.getString("codeDesc"+capLanguageCode));
			objXtrmCodeLang.setString("languageCode", languageCode);
			ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeCodeLang", objXtrmCodeLang);
		}
	}

	//****** 공통코드관리  ************************************************************************//

	//****** 시스템코드관리  ************************************************************************//
	// 시스템코드관리 > 코드 조회
	@Override
	public ApiEnvelope selectSysCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectSysCodeData", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, new String[]{"codeName","codeDesc"});
		return objXtrmReturn;
	}

	// 시스템코드관리 > 코드 저장
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope saveSysCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		String strTxFlag = objXtrmParams.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
		if (XtrmEnum.TRANSACTION_NONE.getCode().equals(strTxFlag)) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.TRANSACTION_DIVISION_OMISSION.getCodeName());
		} else {
			objXtrmParams.setValueToNull();
			if (XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)) {
				if (ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDuplicateGroupCode", objXtrmParams).getInt("duplicated") > 0) {
					objXtrmReturn.setResultHeader(true, MainEnum.GROUP_CODE_ALREADY_EXIST.getCodeName());
					return objXtrmReturn;
				}
				intReturnValue = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertSysCode", objXtrmParams);
				mergeSysCodeLang(objXtrmParams);
			} else if (XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)) {
				intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateSysCode", objXtrmParams);
				mergeSysCodeLang(objXtrmParams);
			}
			if (intReturnValue == 0) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
			} else {
				objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
			}
		}
		return objXtrmReturn;
	}

	// 시스템코드관리 > 사용 여부 변경 시
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope configureSysCodeUseAt(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateSysCodeUseAt", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.UPDATE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}

	// 시스템코드관리 > 코드 삭제
	@Override
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope deleteSysCodeData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteSysCodeLang", objXtrmParams);
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteSysCode", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	@SuppressWarnings("unused")
	private void mergeSysCodeLang(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
		objXtrmCodeParams.setString("groupCode", "SYS028");
		objXtrmCodeParams.setString("useAt", "Y");
		// COM_SYS_CODE에서 SYS028을 가져온다.
		ApiEnvelope objXtrmCodeData = selectSysCodeDetailData(objXtrmCodeParams);

		ApiEnvelope objXtrmCodeLang = ApiEnvelopes.copyOf(objXtrmParams);
		// LanguageCode값으로 CodeName, CodeDesc, LanguageCode, GroupCode, Code를 넣어주어서 생성합니다.
		for(int i=0;i<objXtrmCodeData.getCount();i++){
			String languageCode = objXtrmCodeData.getString("code", i);
			String capLanguageCode = capitalizeFirstLetter(languageCode);
			String groupCode = objXtrmCodeData.getString("groupCode", i);
			if(languageCode.equals("*****")){
				continue;
			}
			objXtrmCodeLang.setString("codeName", objXtrmParams.getString("codeName"+capLanguageCode));
			objXtrmCodeLang.setString("codeDesc", objXtrmParams.getString("codeDesc"+capLanguageCode));
			objXtrmCodeLang.setString("languageCode", languageCode);
			ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeSysCodeLang", objXtrmCodeLang);
		}
	}
	//****** 시스템코드관리  ************************************************************************//

	//****** 다국어관리  ************************************************************************//
	// 다국어관리 > 메시지 그룹 조회
	public ApiEnvelope selectData010(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectData010", objXtrmParams);
	}
	// 다국어관리 > 상세 메시지 조회
	public ApiEnvelope selectDataDetail010(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMessageDetail010", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, "messageContents");
		return objXtrmReturn;
	}

	// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
	private void makeDynamicColumn(ApiEnvelope objXtrmData,String columnName) throws Exception{
		if(objXtrmData.getCount() != 0){
			int dataCount        = objXtrmData.getCount();
			ObjectNode dataObj   = null;
			String changeData    = "";
			String[] rowDataList = null;
			String[] rowData     = null;
			for( int i=0; i < dataCount ; i++ ){
				dataObj     = objXtrmData.getDataObjectNode(i);
				changeData  = dataObj.get("changeDataList").asText();
				objXtrmData.removeKey("DATA", "changeDataList",i);
				rowDataList = changeData.split("%%");
				for( int y=0; y < rowDataList.length ; y++ ){
					rowData = rowDataList[y].split("###");
					if( rowData.length > 1 ){objXtrmData.setString(columnName+capitalizeFirstLetter(rowData[0]),rowData[1],i);}
				}
			}
		}
	}

	// 다국어관리 > 메시지 저장
	@Transactional(rollbackFor = {Exception.class, SQLException.class}, propagation = Propagation.REQUIRED, readOnly = false)
	public ApiEnvelope saveMessage(ApiEnvelope objXtrmParam) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		String strTxFlag = objXtrmParam.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
		if (XtrmEnum.TRANSACTION_NONE.getCode().equals(strTxFlag)) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.TRANSACTION_DIVISION_OMISSION.getCodeName());
		} else {
			ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
			objXtrmCodeParams.setString("groupCode", "SYS028");
			objXtrmCodeParams.setString("useAt", "Y");
			// COM_SYS_CODE에서 SYS028을 가져온다.
			ApiEnvelope objXtrmCodeData = selectSysCodeDetailData(objXtrmCodeParams);

			ApiEnvelope objXtrmParams   = ApiEnvelopes.copyOf(objXtrmParam);
			ApiEnvelope objXtrmMessageLang = ApiEnvelopes.copyOf(objXtrmParams);
			// LanguageCode값으로 CodeName, CodeDesc, LanguageCode, GroupCode, Code를 넣어주어서 생성합니다.
			for(int i=0;i<objXtrmCodeData.getCount();i++){
				String languageCode    = objXtrmCodeData.getString("code", i);
				String capLanguageCode = capitalizeFirstLetter(languageCode);
				if(languageCode.equals("*****")){
					continue;
				}
				objXtrmMessageLang.setString("messageContents", objXtrmParams.getString("messageContents"+capLanguageCode));
				objXtrmMessageLang.setString("languageCode", languageCode);
				intReturnValue += ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeMessage", objXtrmMessageLang);
				// 다국어 데이터 등록 및 수정시 서버에 다국어 변경 목록을 전송한다.
				cmmnService.memoryMessageDataUpdate(objXtrmMessageLang, strTxFlag);
			}

//			if (XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)) {
//				if (ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDuplicateMessage", objXtrmParams).getInt("duplicated") > 0) {
//					objXtrmReturn.setResultHeader(true, "메시지 ID가 이미 존재합니다.");
//					return objXtrmReturn;
//				}
//				intReturnValue = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeMessage", objXtrmParams);
//			} else if (XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)) {
//				intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateMessage", objXtrmParams);
//			}

			if (intReturnValue == 0) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
			} else {
				objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
				// 다국어 데이터 등록 및 수정시 서버에 다국어 변경 목록을 전송한다.
				cmmnService.memoryMessageDataUpdate(objXtrmParams, strTxFlag);
			}
		}
		return objXtrmReturn;
	}

	// 다국어관리 > 메시지 삭제
	public ApiEnvelope deleteMessage(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue     = 0;
		intReturnValue         = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteMessage", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
			// 다국어 데이터 등록 및 수정시 서버에 다국어 변경 목록을 전송한다.
			cmmnService.memoryMessageDataUpdate(objXtrmParams, XtrmEnum.TRANSACTION_DELETE.getCode());
		}

		return objXtrmReturn;
	}

	@Override
	public List<ComMessage> selectAllMessage() throws Exception {
		ApiEnvelope objXtrmParams = new ApiEnvelope();
		return ApiEnvelopes.selectMap(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAllMessage", objXtrmParams, ComMessage.class);
	}
	//****** 다국어관리  ************************************************************************//

	//****** 분류관리  ************************************************************************//
	/*PU별 등록된 분류 개수 포함 콤보박스 표시용 조회*/
	@Override
	public ApiEnvelope selectClsfPuCombo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectClsfPuCode", objXtrmParams);
		return objXtrmReturn;
	}

	// 분류관리 > 분류 목록 조회 ( TREE )
	public ApiEnvelope selectClsfData(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectClsfData", objXtrmParams);
	}

	// 분류관리 > 분류 저장, 수정,삭제
	public ApiEnvelope saveClsfData(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();

		int intProcCnt			= 0;
		objXtrmParams.setValueAllToNull();
		ArrayNode objData = objXtrmParams.getDataArrayNode();
		for(int i = 0; i < objData.size(); i++){
			//파라메터 추가 설정
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "mergeClsfData", objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "mergeClsfData", objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteVobDictionaryClsfData"	, objXtrmParams.getDataObjectNode(i));
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteClsfData", objXtrmParams.getDataObjectNode(i));
			}
		}
		if(intProcCnt > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}
	//****** 분류관리  ************************************************************************//

	//****** 사전관리  ************************************************************************//
	/*PU별 매핑된 키워드 개수 포함 콤보박스 표시용 조회*/
	@Override
	public ApiEnvelope selectDictPuCombo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDictPuCode", objXtrmParams);
		return objXtrmReturn;
	}

	// 사전관리 > 분류 목록 조회 ( TREE )
	public ApiEnvelope selectDictionaryData(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDictionaryData", objXtrmParams);
	}
	// 사전관리 > 키워드, 상세키워드 목록 조회 ( TREE )
	public ApiEnvelope selectKeywordAllData(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
		ArrayNode objKeywordAllDataJsonArary	= MAPPER.createArrayNode();
		ObjectNode objKeywordAllDataJson		= MAPPER.createObjectNode();
		ArrayNode objKeywordDataJsonArray		= MAPPER.createArrayNode();
		ObjectNode objKeywordDataJson			= MAPPER.createObjectNode();
		ArrayNode objDetailDataJsonArray		= MAPPER.createArrayNode();
		ObjectNode objDetailDataJson			= MAPPER.createObjectNode();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectKeywordAllData", objXtrmParams);
		int intLoopCount						= objXtrmReturn.getCount();
		if(intLoopCount > 0){
			String strPrevKeywordKey			= new String();
			String strCurrKeywordKey			= new String();
			for(int i = 0; i < intLoopCount; i++){
				strCurrKeywordKey				= objXtrmReturn.getString("keywordKey", i);
				if(!strPrevKeywordKey.equals(strCurrKeywordKey)){
					objKeywordDataJson			= MAPPER.createObjectNode();
					objKeywordDataJson.put("moveDictionary"				,objXtrmReturn.getString("moveDictionary"				,i));
					objKeywordDataJson.put("companyCode"				,objXtrmReturn.getString("companyCode"					,i));
					objKeywordDataJson.put("puCode"				,objXtrmReturn.getString("puCode"					,i));
					objKeywordDataJson.put("keywordKey"					,objXtrmReturn.getString("keywordKey"					,i));
					objKeywordDataJson.put("keywordName"				,objXtrmReturn.getString("keywordName"					,i));
					objKeywordDataJson.put("detailKeywordCount"			,objXtrmReturn.getString("detailKeywordCount"			,i));
					objKeywordDataJson.put("useAt"						,objXtrmReturn.getString("keywordUseAt"					,i));
					objKeywordDataJson.put("firstCreateUserInfo"		,objXtrmReturn.getString("keywordFirstCreateUserInfo"	,i));
					objKeywordDataJson.put("createDt"					,objXtrmReturn.getString("keywordCreateDt"				,i));
					objKeywordDataJson.put("lastUpdateUserInfo"			,objXtrmReturn.getString("keywordLastUpdateUserInfo"	,i));
					objKeywordDataJson.put("updateDt"					,objXtrmReturn.getString("keywordUpdateDt"				,i));
					objKeywordDataJson.put("DATA_FLAG"					,XtrmEnum.TRANSACTION_NONE.getCode());
					objKeywordDataJsonArray.add(objKeywordDataJson);
					if(!"".equals(strPrevKeywordKey)){
						objKeywordAllDataJson.set(strPrevKeywordKey, objDetailDataJsonArray);
						objDetailDataJsonArray	= MAPPER.createArrayNode();
					}
				}

				String detailKeywordKey = objXtrmReturn.getString("detailKeywordKey",i);
				if(!"".equals(detailKeywordKey)) {
					objDetailDataJson				= MAPPER.createObjectNode();
					objDetailDataJson.put("companyCode"						,objXtrmReturn.getString("companyCode"					,i));
					objDetailDataJson.put("keywordKey"						,objXtrmReturn.getString("keywordKey"					,i));
					objDetailDataJson.put("puCode"						,objXtrmReturn.getString("puCode"					,i));
					objDetailDataJson.put("detailKeywordKey"				,detailKeywordKey											);
					objDetailDataJson.put("detailKeywordContents"			,objXtrmReturn.getString("detailKeywordContents"		,i));
					objDetailDataJson.put("useAt"							,objXtrmReturn.getString("detailUseAt"					,i));
					objDetailDataJson.put("firstCreateUserInfo"				,objXtrmReturn.getString("detailFirstCreateUserInfo"	,i));
					objDetailDataJson.put("createDt"						,objXtrmReturn.getString("detailCreateDt"				,i));
					objDetailDataJson.put("lastUpdateUserInfo"				,objXtrmReturn.getString("detailLastUpdateUserInfo"		,i));
					objDetailDataJson.put("updateDt"						,objXtrmReturn.getString("detailUpdateDt"				,i));
					objDetailDataJson.put("originDetailKeywordContents"		,objXtrmReturn.getString("detailUpdateDt"				,i));
					objDetailDataJson.put("originUseAt"						,objXtrmReturn.getString("originDetailUseAt"			,i));
					objDetailDataJson.put("DATA_FLAG"						,XtrmEnum.TRANSACTION_NONE.getCode());
					objDetailDataJsonArray.add(objDetailDataJson);
				}
				strPrevKeywordKey				= strCurrKeywordKey;
				if(i == intLoopCount-1){
					objKeywordAllDataJson.set(strCurrKeywordKey, objDetailDataJsonArray);
				}
			}
			objXtrmReturn.setResultHeader(false, XtrmEnum.SELECT_SUCCESS.getCodeName());
			objXtrmReturn.setHeader("COUNT"		,objKeywordDataJsonArray.size());
			objXtrmReturn.setHeader("TOT_COUNT"	,objKeywordDataJsonArray.size());
			objXtrmReturn.setDataArrayNode(objKeywordDataJsonArray);
		}
		objKeywordAllDataJsonArary.add(objKeywordAllDataJson);
		objXtrmReturn.setDataArrayNode(objKeywordAllDataJsonArary, "KEYWORD_ALL_DATA");
		return objXtrmReturn;
	}
	// 사전관리 > 키워드 저장, 수정, 삭제
	public ApiEnvelope saveDictionaryData(ApiEnvelope objXtrmParams) throws Exception{
		//최종 반환객체 생성
		ApiEnvelope objXtrmReturn 					= new ApiEnvelope();
		//처리유형별 데이터셋
		ApiEnvelope objXtrmInsertKeywordData		= new ApiEnvelope();	//대표키워드 신규등록 데이터셋
		ApiEnvelope objXtrmUpdateKeywordData		= new ApiEnvelope();	//대표키워드 수정 데이터셋
		ApiEnvelope objXtrmDeleteKeywordData		= new ApiEnvelope();	//대표키워드 삭제 데이터셋
		ApiEnvelope objXtrmInsertDetailKeywordData	= new ApiEnvelope();	//상세키워드 신규등록 데이터셋
		ApiEnvelope objXtrmUpdateDetailKeywordData	= new ApiEnvelope();	//상세키워드 수정 데이터셋
		ApiEnvelope objXtrmDeleteDetailKeywordData	= new ApiEnvelope();	//상세키워드 삭제 데이터셋
		ApiEnvelope objXtrmDictionaryData			= new ApiEnvelope();	//키워드 매핑정보 사전 데이터셋

		objXtrmDictionaryData.setDataArrayNode(objXtrmParams.getDataArrayNode("DICTIONARY"));
		ArrayNode objKeywordData				= objXtrmParams.getDataArrayNode("KEYWORD");
		ArrayNode objDetailKeywordData			= objXtrmParams.getDataArrayNode("DETAIL_KEYWORD");

		//각 처리유형별 데이터셋 추출
		if(objKeywordData != null && objKeywordData.size() > 0 && !isEmptyObject(objKeywordData.get(0))){
			objXtrmInsertKeywordData.setDataArrayNode(filterArrayByFlag(objKeywordData, XtrmEnum.TRANSACTION_INSERT.getCode()));
			objXtrmUpdateKeywordData.setDataArrayNode(filterArrayByFlag(objKeywordData, XtrmEnum.TRANSACTION_UPDATE.getCode()));
			objXtrmDeleteKeywordData.setDataArrayNode(filterArrayByFlag(objKeywordData, XtrmEnum.TRANSACTION_DELETE.getCode()));
		}
		if(objDetailKeywordData != null && objDetailKeywordData.size() > 0 && !isEmptyObject(objDetailKeywordData.get(0))){
			objXtrmInsertDetailKeywordData.setDataArrayNode(filterArrayByFlag(objDetailKeywordData, XtrmEnum.TRANSACTION_INSERT.getCode()));
			objXtrmUpdateDetailKeywordData.setDataArrayNode(filterArrayByFlag(objDetailKeywordData, XtrmEnum.TRANSACTION_UPDATE.getCode()));
			objXtrmDeleteDetailKeywordData.setDataArrayNode(filterArrayByFlag(objDetailKeywordData, XtrmEnum.TRANSACTION_DELETE.getCode()));
		}

		int intReturnValue						= 0;

		//정해진 Sequence로 수행
		//1.대표키워드 신규등록
		if(objXtrmInsertKeywordData.getCount() > 0){
			objXtrmInsertKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.insertList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"insertVobKeyword"			,objXtrmInsertKeywordData);
		}
		//2.상세키워드 신규 등록
		if(objXtrmInsertDetailKeywordData.getCount() > 0){
			objXtrmInsertDetailKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.insertList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"insertVobKeywordDetail"	,objXtrmInsertDetailKeywordData);
		}
		//3.상세키워드 수정
		if(objXtrmUpdateDetailKeywordData.getCount() > 0){
			objXtrmUpdateDetailKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.updateList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"updateVobKeywordDetail"	,objXtrmUpdateDetailKeywordData);
		}
		//4.상세키워드 삭제
		if(objXtrmDeleteDetailKeywordData.getCount() > 0){
			objXtrmDeleteDetailKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.deleteList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"deleteVobKeywordDetail"	,objXtrmDeleteDetailKeywordData);
		}
		//5.대표키워드 수정
		if(objXtrmUpdateKeywordData.getCount() > 0){
			objXtrmUpdateKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.updateList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"updateVobKeyword"			,objXtrmUpdateKeywordData);
		}
		//6.대표키워드 삭제(삭제 시에는 상세키워드 테이블 삭제 후 대표키워드 테이블 삭제)
		if(objXtrmDeleteKeywordData.getCount() > 0){
			objXtrmDeleteKeywordData.setValueAllToNull();
			intReturnValue						+= ApiEnvelopes.deleteList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"deleteVobDictionary"		,objXtrmDeleteKeywordData);
			intReturnValue						+= ApiEnvelopes.deleteList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"deleteVobKeywordDetail"	,objXtrmDeleteKeywordData);
			intReturnValue						+= ApiEnvelopes.deleteList(mobjXtrmDao, "xs.vob.management.ManagementMapper"	,"deleteVobKeyword"			,objXtrmDeleteKeywordData);
		}
		//7.사전데이터 변경분 데이터 처리유형별로 처리
		if(objXtrmDictionaryData.getCount() > 0){
			objXtrmDictionaryData.setValueAllToNull();
			int intDataCount					= objXtrmDictionaryData.getCount();
			for(int i = 0; i < intDataCount; i++){
				if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(objXtrmDictionaryData.getString("DATA_FLAG", i))){
					intReturnValue				+= mobjXtrmDao.delete("xs.vob.management.ManagementMapper"		,"deleteVobDictionary"		,objXtrmDictionaryData.getDataObjectNode(i));
				}else if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(objXtrmDictionaryData.getString("DATA_FLAG", i))){
					intReturnValue				+= mobjXtrmDao.insert("xs.vob.management.ManagementMapper"		,"insertVobDictionary"		,objXtrmDictionaryData.getDataObjectNode(i));
				}
			}
		}

		//처리 결과 건수에 따른 최종 반환 헤더 세팅
		if(intReturnValue > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}

		return objXtrmReturn;
	}
	//****** 사전관리  ************************************************************************//

	//****** 치환특화사전관리  ************************************************************************//
	//****** 치환특화사전관리  ************************************************************************//

	//****** 알림그룹별 대상자 ************************************************************************//
	// 이메일 알림 > 알림그룹 조회
	public ApiEnvelope selectDataEmail010(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataEmail010", objXtrmParams);
	}
	// 이메일 알림 > 단일 알림그룹 내 대상자 목록 조회
	public ApiEnvelope selectDataEmail010User(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataEmail010User", objXtrmParams);
	}
	// 이메일 알림 > 배치 목록 조회
	public ApiEnvelope selectDataEmail010Batch(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataEmail010Batch", objXtrmParams);
	}
	// 이메일 알림 > 사용자 검색 팝업 (부서 트리)
	public ApiEnvelope selectDataDeptTreeUser(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataDeptTreeUser", objXtrmParams);
	}
	// 이메일 알림 > 발송 서비스 저장
	public ApiEnvelope saveDataEmail010(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		String strTxFlag = objXtrmParams.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
		if (!XtrmEnum.TRANSACTION_NONE.getCode().equals(strTxFlag)) {
			if (XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)) {
				intReturnValue = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertVobSend", objXtrmParams);
			} else if (XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)) {
				intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateVobSend", objXtrmParams);
			}
			if (intReturnValue == 0) {
				objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
			} else {
				objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
			}
		} else {
			objXtrmReturn.setResultHeader(true, XtrmEnum.TRANSACTION_DIVISION_OMISSION.getCodeName());
		}
		return objXtrmReturn;
	}
	// 이메일 알림 > 발송 서비스 대상자 목록 저장
	public ApiEnvelope saveDataEmail010User(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		for(int i = 0; i < objXtrmParams.getDataArrayNode("USER_LIST").size(); i++){
			ObjectNode userList = objectNode(objXtrmParams.getDataArrayNode("USER_LIST").get(i));
			if("USER".equals(text(userList, "sectionCode"))){
				objXtrmParams.setString("userId", text(userList, "userId"));
				intReturnValue += ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertVobSendTargetUser", objXtrmParams);
			}
		}
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}
	// 이메일 알림 > 서비스 대상자 삭제
	public ApiEnvelope deleteTargetUser(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ArrayNode jsonArray = objXtrmParams.getDataArrayNode("USER_LIST");
		List<String> userList = new ArrayList<>();
		if (jsonArray != null) {
			for (JsonNode node : jsonArray) {
				String userId = text(node, "userId");
				if (!"".equals(userId)) {
					userList.add(userId);
				}
			}
		}
		objXtrmParams.setObject("userList", userList);
		int intReturnValue = 0;
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteVobSendTargetUser", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	//****** 알림그룹별 대상자 ************************************************************************//

	//****** 알림발송현황  ************************************************************************//
	// 이메일 알림 > 알림발송현황 목록 조회
	public ApiEnvelope selectDataEmail020(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataEmail020", objXtrmParams);
	}
	// 이메일 알림 > 알림발송현황 상세내역 조회
	public ApiEnvelope selectDataEmail020Detail(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataEmail020Detail", objXtrmParams);
	}
	// 이메일 알림 > 알림발송현황 메일 전송
	public ApiEnvelope sendMail(ApiEnvelope objXtrmParams) throws Exception{
		// aichat 전용: 리포트 메일/스크린샷 미사용 — 스텁 처리
		objXtrmParams.setHeader("ERROR_FLAG", true);
		objXtrmParams.setHeader("ERROR_MSG", "aichat 전용에서는 미지원");
		return objXtrmParams;
	}
	// 이메일 알림 > 알림발송현황 메일 전송
	public ApiEnvelope sendMail_old(ApiEnvelope objXtrmParams) throws Exception{
//		try {
//			// 메일 수신자 목록 이메일 복호화
//			ArrayNode jsonArray = objXtrmParams.getDataArrayNode("MAIL_LIST");
//			List<String> mailList = StreamSupport.stream(jsonArray.spliterator(), false) // ArrayNode -> Stream 변환
//					.map(JsonNode::getAsJsonObject)											// 각 JsonNode를 JsonObject로 변환
//					.map(obj -> obj.get("userId").asText())								// userId 값을 추출
//					.collect(Collectors.toList()); 												// 결과를 List로 수집
//			objXtrmParams.setObject("mailList", mailList);
//			String recipients = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReportRecipients", objXtrmParams).getDataObjectNode(0).get("emailList").asText();
//			objXtrmParams.setString("recipients", recipients);
//
//			// 리포트 헤더 정보 SELECT
//			ApiEnvelope keyData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectTargetReportBase", objXtrmParams);
//			objXtrmParams.setString("reportKey"      , keyData.getString("reportKey"), 0);
//			objXtrmParams.setString("analysisPeriod" , keyData.getString("analysisPeriod"), 0);
//			objXtrmParams.setString("subject"        , keyData.getString("subject"), 0);
//			objXtrmParams.setString("summary"        , keyData.getString("summary"), 0);
//			objXtrmParams.setString("vocCount"       , keyData.getString("vocCount"), 0);
//			objXtrmParams.setString("standardYear"   , keyData.getString("standardYear"), 0);
//			objXtrmParams.setString("standardMonth"  , keyData.getString("standardMonth"), 0);
//			objXtrmParams.setString("standardWeek"   , keyData.getString("standardWeek"), 0);
//			objXtrmParams.setString("dateInfo"       , keyData.getString("dateInfo"), 0);
//
//			// 메일 본문 (요약리포트) 데이터 조회 및 그룹화
//			objXtrmParams.setString("analysisSectionCode", "010");
//			objXtrmParams.setInt("subSubjectSn", 2);
//			objXtrmParams.setString("vocMailShortcutUrl", mobjXtrmConfig.getString("VOC_MAIL_SHORTCUT_URL"));
//			ArrayNode summaryResult = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.report.ReportMapper", "selectReportContentsSummary", objXtrmParams).getDataArrayNode("DATA");
//			objXtrmParams.removeKey("subSubjectSn");
//			ApiEnvelope summaryData = cmmnService.groupReportContentsSummary(summaryResult);
//
//			// PDF 본문 (상세리포트) 데이터 조회 및 그룹화
//			objXtrmParams.setString("analysisSectionCode", "020");
//			ArrayNode detailResult = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.report.ReportMapper", "selectReportContents", objXtrmParams).getDataArrayNode("DATA");
//			ApiEnvelope detailData = cmmnService.groupReportContentsDetail(detailResult);
//
//			// 메일 본문 내용 html 생성
//			String textHtml = cmmnService.getTextHtml(objXtrmParams, summaryData);
//			// PDF HTML 생성
//			String htmlTotal = cmmnService.getPdfHtml(objXtrmParams, summaryData, detailData);
//
//			// 메일 첨부파일 pdf 서버에 저장
//			objXtrmParams.setString("vocReportFilePath", mobjXtrmConfig.getString("VOC_REPORT_FILE_PATH"));
//////			cmmnService.saveReportToPdf(objXtrmParams, htmlTotal);
//
//			// 메일 전송 관련 PROPERTY
//			objXtrmParams.setString("vocMailSmtpHost", mobjXtrmConfig.getString("VOC_MAIL_SMTP_HOST"));
//			objXtrmParams.setString("vocMailSmtpPort", mobjXtrmConfig.getString("VOC_MAIL_SMTP_PORT"));
//			objXtrmParams.setString("vocMailSmtpStarttlsEnable", mobjXtrmConfig.getString("VOC_MAIL_SMTP_STARTTLS_ENABLE"));
//			objXtrmParams.setString("vocMailSmtpAuth", mobjXtrmConfig.getString("VOC_MAIL_SMTP_AUTH"));
//			objXtrmParams.setString("vocMailFromAddress", mobjXtrmConfig.getString("VOC_MAIL_FROM_ADDRESS"));
//			// 메일 전송
//			String url = mobjXtrmConfig.getString("VOC_MAIL_SHORTCUT_URL") + mobjXtrmConfig.getString("REPORT_POP_PAGE_URL");
//			XtrmSendMail.sendMail(objXtrmParams, textHtml);
//
//			objXtrmParams.setHeader("ERROR_FLAG"	, false);
//			objXtrmParams.setHeader("ERROR_MSG"	, XtrmEnum.SEND_SUCCESS.getCodeName());
//		}catch (Exception e){
//			objXtrmParams.setHeader("ERROR_FLAG"	, true);
//			objXtrmParams.setHeader("ERROR_MSG"	, XtrmEnum.ERROR_MESSAGE.getCodeName());
//		}
		return objXtrmParams;
	}
	//****** 알림발송현황  ************************************************************************//

	//****** VOC피드백현황  ************************************************************************//
	//****** VOC피드백현황  ************************************************************************//

	//****** 리포트피드백 현황  ************************************************************************//
	//****** 리포트피드백 현황  ************************************************************************//

	//****** 접속로그현황  ************************************************************************//
	// 접속로그현황 > 접속로그 목록 조회
	@Override
	public ApiEnvelope selectAccessLogList(ApiEnvelope objXtrmParams) throws Exception {
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode );
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAccessLogList", objXtrmParams);
		objXtrmReturn.setHeader("solutionSectionCode", solutionSectionCode);
		return objXtrmReturn;
	}

	// 접속로그현황, 접속로그현황(그래프), 다운로드 현황 > 매뉴리스트 콤보 데이터 조회
	@Override
	public ApiEnvelope selectMenuListCombo() throws Exception {
		ApiEnvelope objXtrmParams = new ApiEnvelope();
		objXtrmParams.setString("solutionSectionCode", mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*"));
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMenuListCombo", objXtrmParams);
	}
	//****** 접속로그현황  ************************************************************************//

	//****** 접속로그현황(그래프)  ************************************************************************//
	//사용자 접속로그 현황, 시간별 접속건수(차트), 구분별 건수(차트)
	@Override
	public ApiEnvelope selectUserAccessLog(ApiEnvelope objXtrmParams) throws Exception {
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope editData = new ApiEnvelope();
		ApiEnvelope chatData = new ApiEnvelope();
		int etcMaxCount = 10;						//그외 기준 최대 건수
		//접속구분 (로그유형/접근메뉴)
		String cnsltAccessKind = objXtrmParams.getString("cnsltAccessKind");
		Set<String> codeList = new HashSet<>();
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		//접속구분에 따른 접속이력정보 검색
		if(cnsltAccessKind.equals(MainEnum.ACCESS_TYPE_LOG.getCode())){
			objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAccessLogLowData", objXtrmParams);
		}else if(cnsltAccessKind.equals(MainEnum.ACCESS_TYPE_MENU.getCode())) {
			objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAccessLogLowDataForMenu", objXtrmParams);
		}

		// 그외 기준 최대 개수 기준으로 합계가 포함되어 있기 때문에 etcMaxCount + 1 이상일 경우 ETC를 계산해서 반환한다.
		if(objXtrmReturn.getCount() > etcMaxCount + 1) {
			editData = getEditChartData(objXtrmParams,objXtrmReturn, etcMaxCount,codeList);
		}

		//차트를 표시하기 위해 차트 포맷으로 데이터를 재 설정한다.
		if(editData.getCount() > 0) {
			chatData = getChartData(editData);					//그외가 존재할 경우
		} else {
			chatData = getChartData(objXtrmReturn);			//그외가 존재하지 않을 경우
		}


		//MixChartData 설정
		objXtrmReturn.setDataArrayNode(chatData.getDataArrayNode("DATA_MIX"),"CHART_DATA01");

		//PieChartData 설정
		objXtrmReturn.setDataArrayNode(chatData.getDataArrayNode("DATA_PIE"),"CHART_DATA02");

		//구분 Code List 설정(그외 기타를 검색하기 위한 정보)
		objXtrmReturn.setObject("codeList", codeList, "DATA_CODE_LIST");

		return objXtrmReturn;
	}

	private ApiEnvelope getEditChartData(ApiEnvelope objXtrmParams,ApiEnvelope objXtrmReturn, int etcMaxCount,Set<String> codeList) throws Exception {
		ApiEnvelope editJson = new ApiEnvelope();
		ApiEnvelope etcJson = new ApiEnvelope();

		//그외 대상건 기준으로 합산한다.
		//예:10개 이상을 그외로 설정할 경우 0~9까지 데이터이고, 10~마지막전까지 그외로 합산해야 함 (마지막 로우는 총합임)
		for(int i=etcMaxCount;i<objXtrmReturn.getCount()-1;i++) {
			etcJson.setString("code", "etc", 0);
			etcJson.setString("nm", MainEnum.OTHERS.getCodeName(), 0);
			String index = "";
			for(int j=0;j<24;j++){
				index = j < 10 ? index = "t0" + j : "t" + j;
				etcJson.setInt(index, etcJson.getInt(index,0) + objXtrmReturn.getInt(index,i), 0);
			}
			etcJson.setInt("totCnt", etcJson.getInt("totCnt",0) + objXtrmReturn.getInt("totCnt",i), 0);
			//그 외 대상의 키 리스트 생성
			codeList.add(objXtrmReturn.getString("code",i));
		}

		//그외를 포함한 데이터 재 생성
		for(int i=0;i<(etcMaxCount+2);i++) {
			if(i <= (etcMaxCount-1)) {
				//그외 기준 최대 값까지 설정
				editJson.setDataObjectNode(objXtrmReturn.getDataObjectNode(i), i);
			} else if (i == etcMaxCount) {
				//합산이 된 그 외 코드값 설정
				editJson.setDataObjectNode(etcJson.getDataObjectNode(0), i);
			} else if (i == (etcMaxCount+1)) {
				//합계 설정
				editJson.setDataObjectNode(objXtrmReturn.getDataObjectNode(objXtrmReturn.getCount()-1), i);
			}
		}
		return editJson;
	}

	// mixChartData 생성, pieChartData 생성
	private ApiEnvelope getChartData(ApiEnvelope objXtrmReturn) throws Exception {
		ApiEnvelope chartData = new ApiEnvelope();
		ApiEnvelope mixChartData = new ApiEnvelope();
		ApiEnvelope pieChartData = new ApiEnvelope();
		String index = "";
		// mixChartData 생성
		for(int j=0; j<24; j++) {
			index = j < 10 ? index = "0" + j : j+"" ;
			mixChartData.setString("stdText", 	   index+"시",j);
			mixChartData.setString("stdDate",     index ,j);
			for(int i=0; i<objXtrmReturn.getCount()-1; i++ ) {
				mixChartData.setString("labelCode"+i, objXtrmReturn.getString("code", i),j);
				mixChartData.setString("labelName"+i, objXtrmReturn.getString("nm",i),j);
				mixChartData.setInt("labelCount"+i,	   objXtrmReturn.getInt("t"+index, i),j);

				// pieChartData 생성
				pieChartData.setString("labelName", objXtrmReturn.getString("nm",i),i);
				pieChartData.setString("labelCode", objXtrmReturn.getString("code",i),i);
				pieChartData.setInt("labelCount", objXtrmReturn.getInt("totCnt",i),i);
				pieChartData.setInt("totCnt", objXtrmReturn.getInt("totCnt",objXtrmReturn.getCount()-1),i);
				Double rate = objXtrmReturn.getDouble("totCnt",i)/objXtrmReturn.getDouble("totCnt",objXtrmReturn.getCount()-1)*100;
				pieChartData.setString("rate", String.format("%.2f", rate)+"%",i);
			}
			mixChartData.setInt("lineCount",     objXtrmReturn.getCount()-1,j);
			mixChartData.setInt("totalCount",  objXtrmReturn.getInt("t"+index, objXtrmReturn.getCount()-1),j);
		}

		chartData.setDataArrayNode(mixChartData.getDataArrayNode(),"DATA_MIX");
		chartData.setDataArrayNode(pieChartData.getDataArrayNode(),"DATA_PIE");

		return chartData;
	}

	// 접속로그현황 클릭 시 상세로그 (그리드 2)에 데이터 검색
	@Override
	public ApiEnvelope selectUserAccessLogDetail(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAccessLogList", objXtrmParams);
	}

	//****** 접속로그현황(그래프)  ************************************************************************//

	//****** 다운로드현황  ************************************************************************//
	// 다운로드 현황 > 엑셀 다운로드한 로그 목록 조회
	@Override
	public ApiEnvelope selectExcelLogList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);

		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectExcelLogList", objXtrmParams);
		objXtrmReturn.setHeader("solutionSectionCode", solutionSectionCode);
		return objXtrmReturn;
	}
	//****** 다운로드현황  ************************************************************************//

	//****** 송수신로그현황  ************************************************************************//
	// 송수신로그 현황 > 송수신 로그 목록 조회
	@Override
	public ApiEnvelope selectLog030(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();

		String processType = objXtrmParams.getString("processType");
		if( processType == null || "".equals(processType) ){
			objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_TOKEN.getCodeName());
			return objXtrmReturn;
		}

		// 1 = 자연어 검색 처리 정보, 2 = 유사 질의어 생성 처리 정보, 3 = VECTOR 처리 정보, 4= 리포트 생성 처리 정보, 5=컨텐츠 요약 처리 정보, 6= PROMPT PU 검수 이력 정보
		if( "1".equals(processType)){objXtrmParams.setString("tableName","VOB_PROCESS_SEARCH_NLP");}
		else if( "2".equals(processType)){objXtrmParams.setString("tableName","VOB_PROCESS_SEARCH_WORD");}
		else if( "3".equals(processType)){
			objXtrmParams.setString("tableName","VOB_PROCESS_VECTOR");
			// VECTOR 처리 정보 테이블의 PK 컬럼명은 VECTOR_PROCESS_EKY 에 따라 변경
			objXtrmParams.setString("vectorProcessKey",objXtrmParams.getString("processKey"));
			objXtrmParams.removeKey("processKey");
		}
		else if( "4".equals(processType)){objXtrmParams.setString("tableName","VOB_PROCESS_REPORT");}
		else if( "5".equals(processType)){objXtrmParams.setString("tableName","VOB_CONTENTS_SUMMARY_PROCESS");}
		else if( "6".equals(processType)){objXtrmParams.setString("tableName","VOB_PROMPT_PU_VALID_PROCESS");}
		else {
			objXtrmReturn.setResultHeader(true, XtrmEnum.ERROR_TOKEN.getCodeName());
			return objXtrmReturn;
		}

		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectLog030", objXtrmParams);
	}
	//****** 송수신로그현황  ************************************************************************//

	//****** 메뉴 관리  ************************************************************************//
	// 메뉴관리 > 메뉴 정보 조회
	@Override
	public ApiEnvelope selectMenuData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		//파라메터 추가 설정
		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMenu", objXtrmParams);
		// 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
		makeDynamicColumn(objXtrmReturn, new String[]{"menuName","menuDesc"});
		return objXtrmReturn;
	}

	// 행에 속한 ChangeDataList 의 값을 분리하여 컬럼으로 추가한다.
	private void makeDynamicColumn(ApiEnvelope objXtrmData, String[] columnName) throws Exception{
		if(objXtrmData.getCount() != 0 && columnName.length == 2){
			int dataCount        = objXtrmData.getCount();
			ObjectNode dataObj   = null;
			String changeData    = "";
			String[] rowDataList = null;
			String[] rowData     = null;

			ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
			// COM_SYS_CODE 다국어 언어 정보를 설정 한다. ( SYS028 )
			objXtrmCodeParams.setString("groupCode", "SYS028");
			objXtrmCodeParams.setString("useAt", "Y");
			ApiEnvelope objXtrmCodeData = cmmnService.selectSysCodeDetailData(objXtrmCodeParams);
			int codeLength = objXtrmCodeData.getCount();
			for( int i=0; i < dataCount ; i++ ){
				dataObj     = objXtrmData.getDataObjectNode(i);
				if( dataObj.get("changeDataList").isNull() ) continue;
				changeData  = dataObj.get("changeDataList").asText();
				objXtrmData.removeKey("DATA", "changeDataList",i);
				rowDataList = changeData.split("%%");

				for( int y=0; y < codeLength ; y++ ){
					if(rowDataList.length<y+1){ break; }
					rowData = rowDataList[y].split("###");

					objXtrmData.setString(columnName[0]+capitalizeFirstLetter(rowData[0]),"",i);
					objXtrmData.setString(columnName[1]+capitalizeFirstLetter(rowData[0]),"",i);
					// 동적으로 생성하는 변수가 존재하지 않는경우 TREE COLUMN 생성 안됨으로 인하여 동적으로 생성한다.
					if( rowData.length == 1 ){continue;}
					if( rowData.length > 1 ){objXtrmData.setString(columnName[0]+capitalizeFirstLetter(rowData[0]),rowData[1],i);}
					if( rowData.length > 2 ){objXtrmData.setString(columnName[1]+capitalizeFirstLetter(rowData[0]),rowData[2],i);}
				}
			}
		}
	}


	// 메뉴관리 > 메뉴정보 등록,수정,삭제
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation= Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveMenuData(ApiEnvelope objXtrmParams) throws Exception {
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();

		int intProcCnt			= 0;
		ApiEnvelope copyXtrmParams = ApiEnvelopes.copyOf(objXtrmParams);
		objXtrmParams.setValueAllToNull();
		ArrayNode objData = objXtrmParams.getDataArrayNode();
		for(int i = 0; i < objData.size(); i++){
			//파라메터 추가 설정
			objXtrmParams.setString("solutionSectionCode", solutionSectionCode,i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertMenu", objXtrmParams.getDataObjectNode(i));
				mergeMenuLang(copyXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateMenu", objXtrmParams.getDataObjectNode(i));
				mergeMenuLang(copyXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(objXtrmParams.getString("DATA_FLAG", i))){
				objXtrmParams.setString("deleteMenuKey", objXtrmParams.getString("menuKey", i), i);
				//intProcCnt += userService.deleteUserBookmark(new ApiEnvelope(objXtrmParams.getDataObjectNode(i)));
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteAuthGroupMenu"	, objXtrmParams.getDataObjectNode(i));
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteComMenuLang", objXtrmParams.getDataObjectNode(i));
				intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteMenu", objXtrmParams.getDataObjectNode(i));
			}
		}
		if(intProcCnt > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	private void mergeMenuLang(ObjectNode objMenuData) throws Exception{
		ApiEnvelope objXtrmCodeParams = new ApiEnvelope();
		// COM_SYS_CODE 다국어 언어 정보를 설정 한다. ( SYS028 )
		objXtrmCodeParams.setString("groupCode", "SYS028");
		objXtrmCodeParams.setString("useAt", "Y");
		ApiEnvelope objXtrmCodeData = cmmnService.selectSysCodeDetailData(objXtrmCodeParams);
		ApiEnvelope objXtrmLang     = null;
		// LanguageCode값으로 CodeName, CodeDesc, LanguageCode, GroupCode, Code를 넣어주어서 생성합니다.
		for(int i=0;i<objXtrmCodeData.getCount();i++){
			String languageCode    = objXtrmCodeData.getString("code", i);
			String capLanguageCode = capitalizeFirstLetter(languageCode);
			objXtrmLang            = new ApiEnvelope(objMenuData);
			String menuName        = objMenuData.get("menuName"+capLanguageCode).asText();
			String menuDesc        = objMenuData.get("menuDesc"+capLanguageCode).asText();
			if(menuName == null && menuDesc == null) continue;
			objXtrmLang.setString("menuName", menuName);
			objXtrmLang.setString("menuDesc", menuDesc);
			objXtrmLang.setString("languageCode", languageCode);
			ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "mergeComMenuLang", objXtrmLang);
		}
	}

	private static ObjectNode objectNode(JsonNode node) {
		if (node instanceof ObjectNode) {
			return (ObjectNode) node;
		}
		return MAPPER.createObjectNode();
	}

	private static String text(JsonNode node) {
		return node == null || node.isNull() ? "" : node.asText();
	}

	private static String text(ObjectNode node, String fieldName) {
		return text(node == null ? null : node.get(fieldName));
	}

	private static String text(JsonNode node, String fieldName) {
		if (node == null || !node.isObject()) {
			return "";
		}
		return text(node.get(fieldName));
	}

	private static boolean isEmptyObject(JsonNode node) {
		return !(node instanceof ObjectNode) || node.size() == 0;
	}

	private static ArrayNode filterArrayByFlag(ArrayNode source, String dataFlag) {
		return filterArray(source, node -> dataFlag.equals(text(node, "DATA_FLAG")));
	}

	private static ArrayNode filterArray(ArrayNode source, java.util.function.Predicate<ObjectNode> predicate) {
		ArrayNode filtered = MAPPER.createArrayNode();
		if (source == null) {
			return filtered;
		}
		for (JsonNode node : source) {
			if (node instanceof ObjectNode) {
				ObjectNode objectNode = (ObjectNode) node;
				if (predicate.test(objectNode)) {
					filtered.add(objectNode.deepCopy());
				}
			}
		}
		return filtered;
	}

	private String capitalizeFirstLetter(String input) {
		if (input == null || input.isEmpty()) {
			return input; // null 또는 빈 문자열일 경우 그대로 반환
		}
		// 첫 문자를 대문자로 변환하고 나머지 문자열은 그대로 유지
		return Character.toUpperCase(input.charAt(0)) + input.substring(1);
	}
	//****** 메뉴 관리  ************************************************************************//

	//****** 권한그룹별 메뉴관리  ************************************************************************//
	// 권한그룹별메뉴관리 > 권한그룹관리dialog > 권한그룹 정보 저장,수정,삭제
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveAuthGroupData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strTxValue		= new String();
		int intCount			= objXtrmParams.getCount();
		int intProcessCount		= 0;
		for(int i = 0; i < intCount; i++){
			strTxValue			= objXtrmParams.getString("DATA_FLAG", i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxValue)){
				String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)
				objXtrmParams.setString("solutionSectionCode", solutionSectionCode,i);
				intProcessCount += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertAuthGroup"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxValue)){
				intProcessCount += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateAuthGroup"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxValue)){
				intProcessCount += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteAuthGroupUser"	, objXtrmParams.getDataObjectNode(i));
				intProcessCount += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteAuthGroupMenu"	, objXtrmParams.getDataObjectNode(i));
				intProcessCount += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteAuthGroup"		, objXtrmParams.getDataObjectNode(i));
			}
		}
		if(intProcessCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}

	// 권한그룹별메뉴관리 > 권한그룹별 메뉴 정보 조회
	@Override
	public ApiEnvelope selectAuthGroupMenuData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		ApiEnvelope objXtrmSqlData	= new ApiEnvelope();
		String sectionCode		= objXtrmParams.getString("sectionCode");
		if(!"AUTH".equals(sectionCode)){
			objXtrmSqlData		= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectUnAuthGroupMenu", objXtrmParams);
			objXtrmReturn.setHeader("UNAUTH_GROUP_COUNT"		,objXtrmSqlData.getCount());
			objXtrmReturn.setHeader("UNAUTH_GROUP_TOT_COUNT"	,objXtrmSqlData.getCount());
			objXtrmReturn.setDataArrayNode(objXtrmSqlData.getDataArrayNode(), "UNAUTH_GROUP");
		}
		if(!"UNAUTH".equals(sectionCode)){
			objXtrmSqlData		= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAuthGroupMenu", objXtrmParams);
			objXtrmReturn.setHeader("AUTH_GROUP_COUNT"		,objXtrmSqlData.getCount());
			objXtrmReturn.setHeader("AUTH_GROUP_TOT_COUNT"	,objXtrmSqlData.getCount());
			objXtrmReturn.setDataArrayNode(objXtrmSqlData.getDataArrayNode(), "AUTH_GROUP");
		}
		return objXtrmReturn;
	}

	// 권한그룹별메뉴관리, 권한그룹별사용자관리 > 권한그룹목록 조회
	@Override
	public ApiEnvelope selectAuthGroupData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAuthGroup", objXtrmParams);
	}

	// 권한그룹별메뉴관리 > 권한그룹에 속한 매뉴 정보를 저장,수정,삭제
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveAuthGroupMenuData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();

		int intDeleteCount		= 0;
		int intInsertCount		= 0;

		//권한그룹의 메인메뉴정보 수정
		ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateAuthGroupMainMenu", objXtrmParams);

		//최초 전체 삭제처리
		intDeleteCount			= ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteAuthGroupMenu", objXtrmParams);
		if(objXtrmParams.getCount() > 0){
			//트리데이터 정보중에 실제로 메뉴경로가 존재하고 뷰 타겟코드가 존재하는 데이터들만 필터링하여 insert처리
			ArrayNode filteredMenuData = objXtrmParams.getDataArrayNode();

			//전체 메뉴 삭제한 경우
			if(filteredMenuData != null && filteredMenuData.size() == 1) {
				ObjectNode checkParameter = objectNode(filteredMenuData.get(0));
				if(!checkParameter.has("viewTargetCode") && !checkParameter.has("menuPathInfo")) {
					objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
					return objXtrmReturn;
				}
			}

			objXtrmParams.setDataArrayNode(filterArray(objXtrmParams.getDataArrayNode(),
					node -> !"".equals(text(node, "menuPathInfo")) && !"".equals(text(node, "viewTargetCode"))));
			if(objXtrmParams.getCount() > 0){
				intInsertCount	= ApiEnvelopes.insertList(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertAuthGroupMenu", objXtrmParams);
			}
		}
		if(intDeleteCount > 0 || intInsertCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}

		return objXtrmReturn;
	}
	//****** 권한그룹별 메뉴관리  ************************************************************************//

	//****** 권한그룹별 사용자관리  ************************************************************************//
	// 권한그룹별사용자관리 > 권한그룹에 속한 사용자 정보 조회
	@Override
	public ApiEnvelope selectAuthGroupUserData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		ApiEnvelope objXtrmSqlData	= new ApiEnvelope();
		String sectionCode		= objXtrmParams.getString("sectionCode");
		if(!"AUTH".equals(sectionCode)){
			objXtrmParams.setString("unAuth","1");
			objXtrmSqlData		= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAuthGroupUser030", objXtrmParams);
			objXtrmReturn.setHeader("UNAUTH_GROUP_COUNT"		,objXtrmSqlData.getCount());
			objXtrmReturn.setHeader("UNAUTH_GROUP_TOT_COUNT"	,objXtrmSqlData.getCount());
			objXtrmReturn.setDataArrayNode(objXtrmSqlData.getDataArrayNode(), "UNAUTH_GROUP");
		}
		if(!"UNAUTH".equals(sectionCode)){
			objXtrmParams.removeKey("unAuth");
			objXtrmParams.setString("auth","1");
			objXtrmSqlData		= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectAuthGroupUser030", objXtrmParams);
			objXtrmReturn.setHeader("AUTH_GROUP_COUNT"		,objXtrmSqlData.getCount());
			objXtrmReturn.setHeader("AUTH_GROUP_TOT_COUNT"	,objXtrmSqlData.getCount());
			objXtrmReturn.setDataArrayNode(objXtrmSqlData.getDataArrayNode(), "AUTH_GROUP");
		}

		return objXtrmReturn;
	}

	// 권한그룹별사용자관리 > 권한그룹에 속한 사용자를 저장,수정,삭제
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveAuthGroupUserData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intDeleteCount		= 0;
		int intInsertCount		= 0;
		//최초 전체 삭제처리
		intDeleteCount			= ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteAuthGroupUser", objXtrmParams);
		if(objXtrmParams.containsKey("userId")){
			//트리데이터 정보중에 조직이 아닌 사용자 정보에 해당하는 데이터들만 필터링하여 insert처리
			objXtrmParams.setDataArrayNode(filterArray(objXtrmParams.getDataArrayNode(),
					node -> "USER".equals(text(node, "sectionCode"))));
			if(objXtrmParams.getCount() > 0){
				intInsertCount	= ApiEnvelopes.insertList(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertAuthGroupUser", objXtrmParams);
			}
		}
		if(intDeleteCount > 0 || intInsertCount > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}

		return objXtrmReturn;
	}
	//****** 권한그룹별 사용자관리  ************************************************************************//

	//****** 사용자별 데이터권한관리  ************************************************************************//
	// 사용자별 데이터 권한관리 > 사용자현황 목록을 조회한다.
	@Override
	public ApiEnvelope selectMenu040(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMenu040", objXtrmParams);
	}
	// 사용자별 데이터 권한관리 > 사용자의 권한에 따른 PU 목록을 조회한다.
	@Override
	public ApiEnvelope selectMenu040PuList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		ApiEnvelope puList		    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMenu040PuList", objXtrmParams);
		objXtrmReturn.setDataArrayNode(puList.getDataArrayNode(), "puList");
		ApiEnvelope corpList		= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMenu040CorpList", objXtrmParams);
		objXtrmReturn.setDataArrayNode(corpList.getDataArrayNode(), "corpList");
		return objXtrmReturn;
	}
	// 사용자별 데이터 권한관리 > 사용자의 권한에 따른 PU 목록을 조회한다.
	@Override
	public ApiEnvelope saveAuthUserData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int paramsCount     = objXtrmParams.getCount();
		int intReturnValue = 0;
		for( int i=0;i<paramsCount; i++ ){
			String strTxFlag = objXtrmParams.getString("DATA_FLAG",i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)){
				intReturnValue += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "insertVobAuthDataUser"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxFlag)){
				intReturnValue += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deleteVobAuthDataUser"		, objXtrmParams.getDataObjectNode(i));
			}
		}

		if(intReturnValue == 0){
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}
		//if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag))

		return objXtrmReturn;
	}
	//****** 사용자별 데이터권한관리  ************************************************************************//

	//****** 사용자별 권한현황  ************************************************************************//
	// 사용자별 권한 및 부서 정보 조회
	@Override
	public ApiEnvelope selectDataUser050(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","VOB");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)

		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		objXtrmReturn		    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataUser050", objXtrmParams);
		return objXtrmReturn;
	}
	// 사용자별 권한그룹 정보 조회
	@Override
	public ApiEnvelope selectDataAuthGroup(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","VOB");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)

		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		objXtrmReturn		    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataAuthGroup", objXtrmParams);
		return objXtrmReturn;
	}

	// 사용자의 권한그룹에 해당하는 메뉴 정보 조회
	@Override
	public ApiEnvelope selectDataMenu(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","VOB");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)

		objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
		objXtrmReturn		    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectDataMenu", objXtrmParams);
		return objXtrmReturn;
	}
	//****** 사용자별 권한현황  ************************************************************************//

	//****** 설문권한관리 ************************************************************************//
	// 설문관리 > Survey 조회결과 정보 조회
	@Override
	public ApiEnvelope selectSurvey(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectSurvey", objXtrmParams);
	}
	// 설문관리 > Survey 저장
	@Override
	public ApiEnvelope saveSurvey(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intProcCnt			= 0;
		// insert and update
		intProcCnt += ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "saveSurvey", objXtrmParams);

		if(intProcCnt > 0){
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}else{
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}
		return objXtrmReturn;
	}
	// 설문관리 > Survey 삭제
	@Override
	public ApiEnvelope deleteSurvey(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteSurveyUser", objXtrmParams);
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteSurvey", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	// 설문관리 > Survey에 할당된 사용자목록 정보 조회
	@Override
	public ApiEnvelope selectSurveyAccount(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectSurveyAccount", objXtrmParams);
	}
	// 설문관리 > Survey 및 사용자 연결 저장
	@Override
	public ApiEnvelope saveSurveyAccount(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		if (ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectSurveyAccountDuplicate", objXtrmParams).getInt("duplicated") > 0) {
			objXtrmReturn.setResultHeader(true, MainEnum.EXISTS_ALREADY_USER.getCodeName());
			return objXtrmReturn;
		}
		intReturnValue += ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "saveSurveyAccount", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	// 설문관리 > Survey 에 할당된 사용자 정보 삭제
	@Override
	public ApiEnvelope deleteSurveyAccount(ApiEnvelope objXtrmParams) throws Exception{
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int intReturnValue = 0;
		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteSurveyAccount", objXtrmParams);
		if (intReturnValue == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}
	// 설문관리 > Survey에 할당된 사용자목록 정보 조회
	@Override
	public ApiEnvelope selectMySurvey(ApiEnvelope objXtrmParams) throws Exception{
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectMySurvey", objXtrmParams);
	}

	//****** 설문권한관리 ************************************************************************//

//	//****** 배치모니터링  ************************************************************************//
//	/**
//	 * 배치목록 조회
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope selectBatchList(ApiEnvelope objXtrmParams) throws Exception {
//		//반환 파라메터 생성
//		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectBatchList", objXtrmParams);
//	}
//
//	@Override
//	public ApiEnvelope getBatchExecutionCycleName(ApiEnvelope objXtrmParams) throws Exception {
//		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "getBatchExecutionCycleName", objXtrmParams);
//	}
//
//	/**
//	 * 배치정보 저장
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope saveBatchSchedule(ApiEnvelope objXtrmParams) throws Exception {
//		//반환 파라메터 생성
//		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
//		int intReturnValue		= 0;
//		String strTxFlag		= objXtrmParams.getString("txValue", 0, XtrmEnum.TRANSACTION_NONE.getCode());
//		if(XtrmEnum.TRANSACTION_NONE.getCode().equals(strTxFlag)){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.TRANSACTION_NONE.getCodeName());
//		}else{
//			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)){
//				//배치정보 신규등록
//				intReturnValue = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertBatchSchedule", objXtrmParams);
//			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)){
//				//배치정보 수정
//				intReturnValue = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateBatchScheduleSelective", objXtrmParams);
//			}
//		}
//		if(intReturnValue == 0){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
//		}else{
//			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
//		}
//
//		return objXtrmReturn;
//	}
//
//	/**
//	 * <pre>
//	 * 배치정보 삭제
//	 * - 배치 로그 상세>배치로그>배치정보 순서로 삭제한다.
//	 *   > 배치로그 상세 및 배치로그는 삭제 전 batchKey와 일치하는 로그가 생성된 경우 해당 로그를 먼저 삭제한다.
//	 *   > 배치로그 상세 row가 존재하면 배치로그도 존재하므로, 위의 순서에 따라 삭제한다.
//	 *   > 배치로그 상세 row가 존재하지 않더라도 배치로그 row는 존재할 수 있으므로 추가 검증을 진행하여 배치로그>배치정보 순서로 삭제한다.
//	 *   > 배치 로그, 배치로그 상세 row가 모두 없는 경우는 배치스케쥴 정보를 삭제한다.
//	 * </pre>
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope deleteBatchSchedule(ApiEnvelope objXtrmParams) throws Exception {
//		//반환 파라메터 생성
//		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
//		int intReturnValue						= 0;
//		//배치로그 상세 삭제
//		intReturnValue = ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteBatchLogDetailSelective", objXtrmParams);
//		//배치로그 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteBatchLogSelective", objXtrmParams);
//		//배치정보 삭제
//		intReturnValue += ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteBatchSchedule", objXtrmParams);
//		//삭제처리결과 setting
//		if(intReturnValue == 0){
//			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
//		}else{
//			objXtrmReturn.setResultHeader(false, XtrmEnum.DELETE_SUCCESS.getCodeName());
//		}
//		return objXtrmReturn;
//	}
//
//	/**
//	 * 배치 직접 실행
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope executeBatch(ApiEnvelope objXtrmParams) throws Exception {
//		//반환 파라메터 생성
//		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
//		//배치 데이터 조회
//		ApiEnvelope xtrmBatchData					= ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectBatchList", objXtrmParams);
//		//데이터 유효성 체크
//		if(validationExecuteBatch(xtrmBatchData, objXtrmReturn)){
//			String serverName    = XtrmCmmnUtil.getProperty("BATCH_DAEMON_SERVER_NAME").toString();
//			ObjectNode batchJson = MAPPER.createObjectNode();
//			batchJson            = XtrmCmmnUtil.convertQueryStringToJson(objXtrmParams.getString("batchParamtr"));
//			batchJson.put("batchServerName", serverName);
//			batchJson.put("companyCode", xtrmBatchData.getString("companyCode"));
//			batchJson.put("batchKey", xtrmBatchData.getString("batchKey"));
//			batchJson.put("batchName", xtrmBatchData.getString("batchName"));
//			batchJson.put("batchClassInfo", xtrmBatchData.getString("batchClassInfo"));
//			batchJson.put("batchServiceBeanId", xtrmBatchData.getString("batchServiceBeanId"));
//			batchJson.put("batchLocationInfo", xtrmBatchData.getString("batchLocationInfo"));
//			batchJson.put("batchMode", batchJson.get("batchMode") != null ? batchJson.get("batchMode").asText() : "pull");
//			batchJson.put("batchBaseDate", batchJson.get("batchBaseDate") != null ? batchJson.get("batchBaseDate").asText() : XtrmCmmnUtil.getFormatDate());
//			// WORKER THREAD RUN
//			BatchWorker.G_CACHED_THREAD_POOL.execute(new BatchWorkerThread(batchJson));
//			BatchWorker.G_CURRENT_WORKER.putIfAbsent(xtrmBatchData.getString("batchKey"), batchJson);
//
////			String returnMessage				= new String();
////			//소켓통신 component 객체 생성
////			boolean success						= false;
////			//TNS 운영 배치 프로젝트 특성상 임시 주석처리 -> VOC Light 복원
////			XtrmSocketComponent socketComponent	= new XtrmSocketComponent();
////			boolean connect						= socketComponent.connect(mobjXtrmConfig.getString("BATCH_DAEMON_MASTER_IP"), mobjXtrmConfig.getInt("BATCH_DAEMON_MASTER_PORT"));
////			//연결 성공 시 데이터 전송
////			if(connect){
////				returnMessage					= socketComponent.request(xtrmBatchData);
////				success							= true;
////				//실패 시 SLAVE 서버로 재시도
////			}else{
////				connect							= socketComponent.connect(mobjXtrmConfig.getString("BATCH_DAEMON_SLAVE_IP"), mobjXtrmConfig.getInt("BATCH_DAEMON_SLAVE_PORT"));
////				if(connect){
////					returnMessage				= socketComponent.request(xtrmBatchData);
////					success						= true;
////				}
////			}
////			//커넥션 해제
////			socketComponent.close();
////			if(success){
////				if(returnMessage.length() > 0){
////					objXtrmReturn				= new ApiEnvelope(returnMessage);
////					if(!objXtrmReturn.getErrorFlag()){
////						objXtrmReturn.setHeader("ERROR_MSG", XtrmEnum.BATCH_EXECUTION_SUCCESS.getCodeName());
////					}else{
////						objXtrmReturn.setHeader("ERROR_MSG", XtrmEnum.BATCH_EXECUTION_FAILED.getCodeName());
////					}
////				}else{
////					objXtrmReturn.setResultHeader(true, XtrmEnum.BATCH_EXECUTION_FAILED.getCodeName());
////				}
////			}else{
////				objXtrmReturn					= executeBatchByJavaRuntime(xtrmBatchData);
////			}
//		}
//
//		return objXtrmReturn;
//	}
//
//	/**
//	 * 배치 실행 데이터 유효성 체크
//	 * @param xtrmBatchData
//	 * @return
//	 */
//	private boolean validationExecuteBatch(ApiEnvelope xtrmBatchData, ApiEnvelope xtrmReturn) throws Exception {
//		boolean isValid				= false;
//		if(xtrmBatchData.getCount() == 1){
//			//배치상태 준비
//			if("010".equals(xtrmBatchData.getString("batchStatusCode"))){
//				isValid				= true;
//			}else{
//				xtrmReturn.setResultHeader(true, XtrmEnum.BATCH_ALREADY_RUNNING.getCodeName());
//			}
//		}else{
//			xtrmReturn.setResultHeader(true, XtrmEnum.BATCH_ESSEINTIAL_PARAM_INVALID.getCodeName());
//		}
//		return isValid;
//	}
//
//	private ApiEnvelope executeBatchByJavaRuntime(ApiEnvelope xtrmBatchData) throws Exception {
//		//반환 파라메터 생성
//		ApiEnvelope xtrmReturn			= new ApiEnvelope();
//		//배치 실행과 관련된 정보 setting
//		String javaClassPath		= mobjXtrmConfig.getString("BATCH_SERVICE_CLASS_PATH");
//		String javaPath				= mobjXtrmConfig.getString("BATCH_SERVICE_JAVA_PATH");
//		//필수파라미터 validation을 통과한 경우 배치 실행을 진행한다.
//		if(validationExecuteBatchByJavaRuntime(javaClassPath, javaPath)){
//			try{
//				objTaskExecutor.execute(new BatchServiceThread(javaPath, javaClassPath, xtrmBatchData));
//				xtrmReturn.setResultHeader(false, XtrmEnum.BATCH_EXECUTION_SUCCESS.getCodeName());
//			}catch(Exception e){
//				xtrmReturn.setResultHeader(true, XtrmEnum.BATCH_EXECUTION_FAILED.getCodeName());
//			}
//		}else{
//			xtrmReturn.setResultHeader(true, XtrmEnum.BATCH_ESSEINTIAL_PARAM_INVALID.getCodeName());
//		}
//		return xtrmReturn;
//	}
//
//	private boolean validationExecuteBatchByJavaRuntime(String javaClassPath, String javaPath) throws Exception {
//		boolean isValid				= true;
//		if(javaClassPath == null || "".equals(javaClassPath) || javaPath == null || "".equals(javaPath) || !XtrmNIOFileUtil.existFile(javaPath)){
//			isValid					= false;
//		}
//		return isValid;
//	}
//
//	/**
//	 * 배치 로그 조회
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope selectBatchLog(ApiEnvelope objXtrmParams) throws Exception {
//		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectBatchLog", objXtrmParams);
//	}
//
//	/**
//	 * Batch Procedure Log 조회
//	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
//	 * @return ApiEnvelope 형식의 반환 데이터
//	 * @throws Exception
//	 * @throws Exception
//	 */
//	@Override
//	public ApiEnvelope selectBatchProcedureLog(ApiEnvelope objXtrmParams) throws Exception {
//		//반환 파라메터 생성
//		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectBatchProcedureLog", objXtrmParams);
//	}
//	//****** 배치모니터링  ************************************************************************//

	//****** 연계모니터링  ************************************************************************//
	/**
	 * 연계 목록 조회
	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
	 * @return ApiEnvelope 형식의 반환 데이터
	 * @throws Exception
	 * @throws Exception
	 */
	@Override
	public ApiEnvelope selectLinkageList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectLinkageList", objXtrmParams);
	}
	//****** 연계모니터링  ************************************************************************//

	//****** 요약모니터링  ************************************************************************//
	/**
	 * 연계 목록 조회
	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
	 * @return ApiEnvelope 형식의 반환 데이터
	 * @throws Exception
	 * @throws Exception
	 */
	@Override
	public ApiEnvelope selectSummaryList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectSummaryList", objXtrmParams);
	}
	@Override
	public ApiEnvelope selectProcessList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectProcessList", objXtrmParams);
	}
	//****** 요약모니터링  ************************************************************************//

	//****** RAG모니터링  ************************************************************************//
	/**
	 * RAG 목록 조회
	 * @param objXtrmParams client로부터 전달받은 요청 파라미터
	 * @return ApiEnvelope 형식의 반환 데이터
	 * @throws Exception
	 * @throws Exception
	 */
	@Override
	public ApiEnvelope selectRagstatList(ApiEnvelope objXtrmParams) throws Exception {
		return null;
	}
	//****** RAG모니터링  ************************************************************************//

	//****** 사용자프롬프트  ************************************************************************//
	//사용자 프롬프트 항목 조회
	@Override
	public ApiEnvelope selectPromptData(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptData", objXtrmParams);
	}

	//프롬프트 요청 항목 조회
	@Override
	public ApiEnvelope selectPromptRequest(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptRequest", objXtrmParams);
	}

	//사용자 프롬프트 요청 항목 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope savePromptRequest(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int saveCount = 0;
		int intCount		   = objXtrmParams.getCount("CHECKED_DATA");

		if(intCount > 0){
			//멀티건의 요청상태를 변경시
			String processContents = objXtrmParams.getString("processContents");
			String processStatusCode = objXtrmParams.getString("processStatusCode");
			String processUserId = objXtrmParams.getString("processUserId");
			for(int i = 0 ; i< intCount; i++) {
				objXtrmParams.setString("processContents", processContents, i, "CHECKED_DATA");
				objXtrmParams.setString("processStatusCode", processStatusCode, i, "CHECKED_DATA");
				objXtrmParams.setString("processUserId", processUserId, i, "CHECKED_DATA");
				saveCount += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateVobPromptRequest", objXtrmParams.getDataObjectNode("CHECKED_DATA", i));
			}
		}else{
			//1건의 요청내용 변경시
			// requestKey가 없으면 신규, 있으면 수정
			if(objXtrmParams.getString("requestKey").equals("")) {
				saveCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertVobPromptRequest", objXtrmParams);
			} else {
				saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateVobPromptRequest", objXtrmParams);
			}
		}


		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}


	//사용자 프롬프트 요청 항목 삭제
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope deleteVobPromptRequest(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int deleteCount = 0;
		deleteCount = ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteVobPromptRequest", objXtrmParams);

		//결과값 헤더를 세팅하여 반환한다.
		if(deleteCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	//****** 사용자프롬프트  ************************************************************************//

	//****** 시스템프롬프트  ************************************************************************//
	/*PU별 등록된 프롬프트 개수 포함 콤보박스 표시용 조회*/
	@Override
	public ApiEnvelope selectPromptPuCombo(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptPuCode", objXtrmParams);
		return objXtrmReturn;
	}
	/*PU별 시스템프롬프트 조회*/
	@Override
	public ApiEnvelope selectPromptPuList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptPuList", objXtrmParams);
		return objXtrmReturn;
	}
	/*평가항목 조회*/
	@Override
	public ApiEnvelope selectEvlItemList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectEvlItemList", objXtrmParams);
		return objXtrmReturn;
	}
	/*시스템프롬프트 상세 조회*/
	@Override
	public ApiEnvelope selectPromptPuDetail(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptPuDetail", objXtrmParams);
		return objXtrmReturn;
	}
	/*시스템프롬프트 저장*/
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope savePromptPuDetail(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		int intProcCnt = 0;
		String promptKey = objXtrmParams.getString("promptKey");
		objXtrmParams.setValueAllToNull();

		//신규수정구분
		if(objXtrmParams.getString("lastVerKey").equals("")) {
			int verSn = 1;
			objXtrmParams.setString("lastVerKey", promptKey + "-" + XtrmCmmnUtil.lpad(String.valueOf(verSn), 3, "0"));
			objXtrmParams.setString("promptVersionKey", promptKey + "-" + XtrmCmmnUtil.lpad(String.valueOf(verSn), 3, "0"));
			objXtrmParams.setString("changeReason", "신규등록");
			//신규등록
			intProcCnt = insertPromptPu(objXtrmParams, verSn);
			//이력추가
			intProcCnt = insertPromptPuHistory(objXtrmParams, verSn);
		} else {
			if(objXtrmParams.getBoolean("isAddHistory")) {
				ApiEnvelope verSnInfo = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptPuHistoryVerSn", objXtrmParams);
				int verSn = verSnInfo.getInt("verSn");
				objXtrmParams.setString("promptVersionKey", promptKey + "-" + XtrmCmmnUtil.lpad(String.valueOf(verSn), 3, "0"));
				objXtrmParams.setString("lastVerKey", promptKey + "-" + XtrmCmmnUtil.lpad(String.valueOf(verSn), 3, "0"));

				//이력신규등록
				intProcCnt = insertPromptPuHistory(objXtrmParams, verSn);
			} else {
				objXtrmParams.setString("promptVersionKey", objXtrmParams.getString("lastVerKey"));
				//이력업데이트
				intProcCnt = updatePromptPuHistory(objXtrmParams);
			}
			//수정등록
			intProcCnt = updatePromptPu(objXtrmParams);
		}

		if (intProcCnt == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		} else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		//프롬프트키 반환
		objXtrmReturn.setString("promptKey", promptKey);

		return objXtrmReturn;
	}

	private int insertPromptPu(ApiEnvelope objXtrmParams, int verSn) throws Exception {
		int intCount = 0;
		intCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertPromptPu", objXtrmParams);
		return intCount;
	}

	private int updatePromptPu(ApiEnvelope objXtrmParams) throws Exception {
		int intCount = 0;
		intCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updatePromptPu", objXtrmParams);
		return intCount;
	}

	private int insertPromptPuHistory(ApiEnvelope objXtrmParams, int verSn) throws Exception {
		objXtrmParams.setInt("verSn", verSn);
		int intCount = 0;
		intCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertPromptPuHistory", objXtrmParams);
		return intCount;
	}

	private int updatePromptPuHistory(ApiEnvelope objXtrmParams) throws Exception {
		int intCount = 0;
		intCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updatePromptPuHistory", objXtrmParams);
		return intCount;
	}

	/*시스템프롬프트 변경이력 조회*/
	@Override
	public ApiEnvelope selectPromptPuHistoryList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptPuHistoryList", objXtrmParams);
		return objXtrmReturn;
	}


	/*시스템프롬프트 실행(검증)*/
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope executePromptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope processData = new ApiEnvelope();
		Timestamp sendDt = Timestamp.from(Instant.now());
		String verificationDataString  = objXtrmParams.getString("verificationData");

		// JSON 문자열을 ObjectNode로 변환
		JsonNode verificationDataNode = MAPPER.readTree(verificationDataString);
		ObjectNode verificationDataJson = verificationDataNode instanceof ObjectNode ? (ObjectNode) verificationDataNode : MAPPER.createObjectNode();

		//답변 데이터 생성
		ApiEnvelope answerCallisto = xtrmCallistoInterface.request(
				CallistoEnums.CALLISTO_API.LLM,
				new ApiEnvelope(verificationDataJson.toString()).getDataObjectNode());

		//처리결과 저장을 위한 파라메터 생성
		processData = makeProcessParams( objXtrmParams, verificationDataJson, answerCallisto);

		//처리결과 저장
		processData.setString("sendDt", sendDt.toString());
		Timestamp returnDt = Timestamp.from(Instant.now());
		processData.setString("returnDt", returnDt.toString());

		ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertVobPromptPuValidProcess", processData);


		//return값 세팅
		String sendDtString = processData.getString("sendDt");
		String returnDtString = processData.getString("returnDt");
		if (sendDtString != null && sendDtString.contains(".")) {sendDtString = returnDtString.split("\\.")[0];}
		if (returnDtString != null && returnDtString.contains(".")) {returnDtString = returnDtString.split("\\.")[0];}
		objXtrmReturn.setString("sendDt", sendDtString);
		objXtrmReturn.setString("returnDt", returnDtString);
		objXtrmReturn.setString("errorAt", processData.getString("errorAt"));
		objXtrmReturn.setString("errorMessage", processData.getString("errorMessage"));
		objXtrmReturn.setString("returnValue", processData.getString("returnValue"));

		return objXtrmReturn;
	}

	//프로세스 Table Db 파라미터 세팅
	private ApiEnvelope makeProcessParams(ApiEnvelope objXtrmParams, ObjectNode requestData, ApiEnvelope responseData) throws Exception {
		String sendData = requestData.toString();
		String returnData = responseData.toString();
		ApiEnvelope processData = new ApiEnvelope();

		String uuid = XtrmCmmnUtil.getUUID();

		processData.setString("processKey", uuid);
		processData.setString("promptVersionKey", objXtrmParams.getString("lastVerKey"));
		processData.setString("promptKey", objXtrmParams.getString("promptKey"));
		processData.setString("modelCode", objXtrmParams.getString("modelCode"));
		processData.setString("puCode", objXtrmParams.getString("puCode"));
		processData.setString("sendValue", sendData);
		processData.setString("returnValue", returnData);

		//처리결과 오류 여부를 판단해서 오류시 오류 정보를 담는다.
		if (responseData.getHeaderBoolean("ERROR_FLAG")) {
			processData.setString("errorAt", "Y");
			processData.setString("errorMessage", responseData.getHeaderString("ERROR_MSG"));
		} else {
			processData.setString("errorAt", "N");
			processData.setString("errorMessage", "");
		}

		return processData;
	}


	/*PU별 프롬프트 개수 조회*/
	@Override
	public ApiEnvelope selectPromptCountByPu(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptCountByPu", objXtrmParams);
		return objXtrmReturn;
	}


	//프롬프트 복사
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveCopyPromptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int saveCount = 0;
		int intPromptCnt = objXtrmParams.getCount("CHECKED_PROMPT_DATA");
		int intPuCnt = objXtrmParams.getCount("CHECKED_PU_DATA");
		int dupCnt = 0;


		//pu 목록별 프롬프트를 복사한다.
		for (int i = 0; i < intPuCnt; i++) {
			String stringPromptKey = objXtrmParams.getString("CHECKED_PU_DATA", "promptKeyList", i);
			Map<String, String> dataMap = new HashMap<>();

			// ',' 기준으로 나누어 키 저장 (값은 빈 문자열)
			String[] keys = stringPromptKey.split(",");
			for (String key : keys) {
				dataMap.put(key, ""); // 빈 문자열 저장
			}
			for (int j = 0; j < intPromptCnt; j++) {
				String chkPromptKey = objXtrmParams.getString("CHECKED_PROMPT_DATA", "promptKey", j);
				// 특정 키 존재 여부 확인
				if (dataMap.containsKey(chkPromptKey)) {
					dupCnt++;
					log.info(objXtrmParams.getString("CHECKED_PROMPT_DATA", "promptKey", j) + " key 존재함!");
					//objXtrmReturn.setResultHeader(true, "프롬프트키 "+chkPromptKey + "는 이미 "+objXtrmParams.getString("CHECKED_PU_DATA","puName", i)+"에 존재합니다.");
					//return objXtrmReturn;
				} else {
					//insert VOB_PROMPT_PU, 이력 추가
					String newPuCode = objXtrmParams.getString("CHECKED_PU_DATA", "puCode", i);
					objXtrmParams.setString("newPuCode", newPuCode, j, "CHECKED_PROMPT_DATA");
					saveCount += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertPromptWithDiffPu", objXtrmParams.getDataObjectNode("CHECKED_PROMPT_DATA", j));
					saveCount += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertPromptHistoryWithDiffPu", objXtrmParams.getDataObjectNode("CHECKED_PROMPT_DATA", j));
				}
			}
		}


		//결과값 헤더를 세팅하여 반환한다.
		if (saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else if (dupCnt >0){
			objXtrmReturn.setResultHeader(false, MainEnum.DUP_SAVE_SUCCESS.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	//****** 시스템프롬프트  ************************************************************************//


	//****** 리포트목차관리  ************************************************************************//
	/* 리포트 프롬프트 업무처리 조회*/
	@Override
	public ApiEnvelope selectPromptJobData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptJobData", objXtrmParams);
		return objXtrmReturn;
	}
	/* 리포트 프롬프트 단위처리 조회*/
	@Override
	public ApiEnvelope selectPromptJobTask(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptJobTask", objXtrmParams);
		return objXtrmReturn;
	}

	/* 리포트 프롬프트 세부처리 조회*/
	@Override
	public ApiEnvelope selectPromptJobTaskAction(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectPromptJobTaskAction", objXtrmParams);
		return objXtrmReturn;
	}

	//조건 법인 목록 조회
	@Override
	public ApiEnvelope selectConditionCorpList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectConditionCorpList", objXtrmParams);
		return objXtrmReturn;
	}

	//프롬프트 목록 조회
	@Override
	public ApiEnvelope selectActionPromptList(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecActionPrompt", objXtrmParams);
		return objXtrmReturn;
	}

	// 대상 프롬프트 목록 조회
	@Override
	public ApiEnvelope selectActionTargetPromptList(ApiEnvelope objXtrmParams) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectActionTargetPrompt", objXtrmParams);
	}

	// 리포트 프롬프트 업무처리 조회 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveVobPromptJob(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strTxValue		= new String();
		int intProcCnt = 0;

		//신규수정구분
		for(int i=0 ; i < objXtrmParams.getCount() ; i ++){
			strTxValue			= objXtrmParams.getString("DATA_FLAG", i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxValue)){
				intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertPromptJob"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxValue)){
				//리포트 프롬프트 업무처리 수정
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateVobPromptJob"		, objXtrmParams.getDataObjectNode(i));
				//사용/미사용 하위항목(프롬프트업무단위,프롬프트세부단위 처리) 상태값 변경
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateVobPromptJobTaskJobKey"		, objXtrmParams.getDataObjectNode(i));
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updatePromptJobTaskActionJobKey"	, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxValue)){
				//삭제시 리포트 정보테이블 조회해서 없으면 삭제
				ApiEnvelope selectReportJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecExistVobReport", objXtrmParams);
				//삭제시 프롬프트 업무단위 테이블 조회해서 없으면 삭제
				ApiEnvelope selectTaskJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecExistPromptJobTask", objXtrmParams);
				if(!selectReportJson.getBoolean("exists") && !selectTaskJson.getBoolean("exists")){
					intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deletePromptJob"		, objXtrmParams.getDataObjectNode(i));
				}else{
					objXtrmReturn.setResultHeader(true,  MainEnum.DELETE_VALID.getCodeName());
                    return objXtrmReturn;
				}

			}
		}

		//결과값 헤더를 세팅하여 반환한다.
		if(intProcCnt == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	// 리포트 프롬프트 단위업무처리 조회 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveVobPromptJobTask(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strTxValue		= new String();
		int intProcCnt = 0;

		//신규수정구분
		for(int i=0 ; i < objXtrmParams.getCount() ; i ++){
			strTxValue			= objXtrmParams.getString("DATA_FLAG", i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxValue)){
				intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertPromptJobTask"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxValue)){
				//리포트 프롬프트 단위업무처리 변경
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updateVobPromptJobTask"		, objXtrmParams.getDataObjectNode(i));
				//사용/미사용 하위항목(프롬프트세부단위 처리) 상태값 변경
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updatePromptJobTaskActionTaskKey"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxValue)){
				//삭제시 리포트 상세 정보테이블 조회해서 없으면 삭제
				ApiEnvelope selectReportJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecExistVobReportDetail", objXtrmParams);
				//삭제시 프롬프트 세부단위 테이블 조회해서 없으면 삭제
				ApiEnvelope selectTaskJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecExistPromptJobTaskAction", objXtrmParams);
				if(!selectReportJson.getBoolean("exists") && !selectTaskJson.getBoolean("exists")){
					intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deletePromptJobTask"		, objXtrmParams.getDataObjectNode(i));
				}else{
					objXtrmReturn.setResultHeader(true,  MainEnum.DELETE_VALID.getCodeName());
                    return objXtrmReturn;
				}
			}
		}

		//결과값 헤더를 세팅하여 반환한다.
		if(intProcCnt == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	// 리포트 프롬프트 세부업무처리 조회 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveVobPromptJobTaskAction(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn	= new ApiEnvelope();
		String strTxValue		= new String();
		int intProcCnt = 0;

		//신규수정구분
		for(int i=0 ; i < objXtrmParams.getCount() ; i ++){
			strTxValue			= objXtrmParams.getString("DATA_FLAG", i);
			if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxValue)){
				intProcCnt += mobjXtrmDao.insert("xs.vob.management.ManagementMapper", "insertPromptJobTaskAction"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxValue)){
				intProcCnt += mobjXtrmDao.update("xs.vob.management.ManagementMapper", "updatePromptJobTaskAction"		, objXtrmParams.getDataObjectNode(i));
			}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxValue)){
				//삭제시 리포트 상세항목 정보테이블 조회해서 없으면 삭제
				ApiEnvelope selectReportJson = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selecExistVobReportDetailItem", objXtrmParams);
				if(!selectReportJson.getBoolean("exists")){
					intProcCnt += mobjXtrmDao.delete("xs.vob.management.ManagementMapper", "deletePromptJobTaskAction"		, objXtrmParams.getDataObjectNode(i));
				}else{
					objXtrmReturn.setResultHeader(true,  MainEnum.DELETE_VALID.getCodeName());
                    return objXtrmReturn;
				}
			}
		}

		//결과값 헤더를 세팅하여 반환한다.
		if(intProcCnt == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	//프롬프트 업무단위테이블 조건 법인리스트 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveTaskCorpData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope paramJson = new ApiEnvelope();
		int saveCount = 0;
		String conditionCorpList ="";
		ArrayNode corp = (ArrayNode)objXtrmParams.getObject("CORP_LIST");
		//corpList 변환
		conditionCorpList = IntStream.range(0, corp.size())
	                .mapToObj(i -> corp.get(i).asText())
	                .collect(Collectors.joining(","));
		if(conditionCorpList.equals("")){conditionCorpList = null;}

		paramJson.setString("taskKey", objXtrmParams.getString("taskKey"));
		paramJson.setString("jobKey", objXtrmParams.getString("jobKey"));
		paramJson.setString("puCode", objXtrmParams.getString("puCode"));
		paramJson.setString("companyCode", objXtrmParams.getString("companyCode"));
		paramJson.setString("conditionCorpList",conditionCorpList);

		saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateVobPromptJobTask", paramJson);

		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	//프롬프트 세부단위테이블 프롬프트 키 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveActionPromptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope paramJson = new ApiEnvelope();
		int saveCount = 0;
		String newPromptKey = objXtrmParams.getString("newPromptKey");
		if(newPromptKey.equals("")){newPromptKey = null;}

		paramJson.setString("actionKey", objXtrmParams.getString("actionKey"));
		paramJson.setString("taskKey", objXtrmParams.getString("taskKey"));
		paramJson.setString("jobKey", objXtrmParams.getString("jobKey"));
		paramJson.setString("puCode", objXtrmParams.getString("puCode"));
		paramJson.setString("companyCode", objXtrmParams.getString("companyCode"));
		paramJson.setString("promptKey", newPromptKey);

		saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updatePromptJobTaskAction", paramJson);

		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}

	//프롬프트 세부단위테이블 대상 프롬프트 키 리스트 저장
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveActionTargetPromptData(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		ApiEnvelope paramJson = new ApiEnvelope();
		paramJson.setString("actionKey", objXtrmParams.getString("actionKey"));
		paramJson.setString("taskKey", objXtrmParams.getString("taskKey"));
		paramJson.setString("jobKey", objXtrmParams.getString("jobKey"));
		paramJson.setString("puCode", objXtrmParams.getString("puCode"));
		paramJson.setString("companyCode", objXtrmParams.getString("companyCode"));
		paramJson.setString("promptKey", objXtrmParams.getString("promptKey"));
		paramJson.setString("contentsTargetPromptKey", objXtrmParams.getString("contentsTargetPromptKey"));
		int saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updatePromptJobTaskAction", paramJson);
		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}
		return objXtrmReturn;
	}

	//****** 리포트목차관리  ************************************************************************//

	//****** 용어사전관리  ************************************************************************//
	@Override
	public ApiEnvelope selectDataWord(ApiEnvelope objXtrmParams) throws Exception {
		objXtrmParams.setString("wordStatusCode", MainEnum.CONTENTS_STATUS_END.getCode());
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectWord", objXtrmParams);
	}
	@Override
	public ApiEnvelope selectDataWordDelete(ApiEnvelope objXtrmParams) throws Exception {
		objXtrmParams.setString("wordStatusCode", MainEnum.CONTENTS_STATUS_DELETE.getCode());
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectWord", objXtrmParams);
	}
	@Override
	public ApiEnvelope selectDataWordDetail(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		if(objXtrmParams.getString("wordKey").equals("")) {
			//신규모드
			objXtrmReturn.setString("wordKey", "");
			objXtrmReturn.setString("registUserInfo2", apiService.getSessionInfo("USER_NAME") + "(" + apiService.getSessionInfo("USER_ID") + ")");
		} else {
			//수정모드
			objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectWordDetail", objXtrmParams);
		}
		return objXtrmReturn;
	}
	//용어를 저장한다.
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveDataWord(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int saveCount = 0;
		if(objXtrmParams.getString("wordKey").equals("")) {
			saveCount = ApiEnvelopes.insert(mobjXtrmDao, "xs.vob.management.ManagementMapper", "insertWord", objXtrmParams);
		} else {
			saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateWord", objXtrmParams);
		}

		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}
	//용어를 복원한다.
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope saveDataWordRestore(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int saveCount = ApiEnvelopes.update(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateWordRestore", objXtrmParams);

		//결과값 헤더를 세팅하여 반환한다.
		if(saveCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}
	//용어를 삭제한다.(상태)
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope deleteDataWordStatus(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int deleteCount = 0;
		deleteCount = ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "updateWordDelete", objXtrmParams);

		//결과값 헤더를 세팅하여 반환한다.
		if(deleteCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}
	//용어를 삭제한다.(완전)
	@Override
	@Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
	public ApiEnvelope deleteDataWord(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		int deleteCount = 0;
		deleteCount = ApiEnvelopes.delete(mobjXtrmDao, "xs.vob.management.ManagementMapper", "deleteWord", objXtrmParams);

		//결과값 헤더를 세팅하여 반환한다.
		if(deleteCount == 0) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.PROCESS_EMPTY.getCodeName());
		}else {
			objXtrmReturn.setResultHeader(false, XtrmEnum.SAVE_SUCCESS.getCodeName());
		}

		return objXtrmReturn;
	}
	//****** 용어사전관리  ************************************************************************//

	//****** 읽은 VOC 현황 ************************************************************************//
	// 내가 읽은 VOC 현황 조회
	@Override
	public ApiEnvelope selectActivity010(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn      = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVoc", objXtrmParams);
		ApiEnvelope chartData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVocChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(chartData.getDataArrayNode(), "VOC_READ");
		return objXtrmReturn;
	}
	//****** 읽은 VOC 현황 ************************************************************************//

	//****** 관심 VOC 현황 ************************************************************************//
	// 내가 읽은 VOC 현황 조회
	@Override
	public ApiEnvelope selectActivity020(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn      = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVoc", objXtrmParams);
		ApiEnvelope chartData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVocChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(chartData.getDataArrayNode(), "VOC_INTEREST");
		return objXtrmReturn;
	}
	//****** 관심 VOC 현황 ************************************************************************//

	//****** VOC 피드백 현황  ************************************************************************//
	// 내가 읽은 VOC 현황 조회
	@Override
	public ApiEnvelope selectActivity030(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn      = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVoc", objXtrmParams);
		ApiEnvelope chartData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReadVocChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(chartData.getDataArrayNode(), "VOC_FEEDBACK");
		return objXtrmReturn;
	}

	//****** VOC 피드백 현황  ************************************************************************//

	//****** Report 피드백 현황  ************************************************************************//
	// 내가 읽은 VOC 현황 조회
	@Override
	public ApiEnvelope selectActivity040(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn      = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReportFeedback", objXtrmParams);
		ApiEnvelope chartData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectReportFeedbackChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(chartData.getDataArrayNode(), "REPORT_FEEDBACK");
		return objXtrmReturn;


	}
	//****** Report 피드백 현황  ************************************************************************//

	//****** 검색 키워드 현황  ************************************************************************//
	@Override
	public ApiEnvelope selectActivity050(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn          = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoSearch", objXtrmParams);
		// 일별 검색 건수 추이
		ApiEnvelope vocAISearch   = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoSearchChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(vocAISearch.getDataArrayNode(), "VOC_AI_SEARCH");
		//나의 검색어 분포 (워드클라우드)
		ApiEnvelope vocKeyword    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoSearchWordCloud", objXtrmParams);
		objXtrmReturn.setDataArrayNode(vocKeyword.getDataArrayNode(), "VOC_KEYWORD_WORDCLOUD");
		return objXtrmReturn;
	}
	//****** 검색 키워드 현황  ************************************************************************//

	//****** AI 질의어 현황  ************************************************************************//
	// 내가 읽은 VOC 현황 조회
	@Override
	public ApiEnvelope selectActivity060(ApiEnvelope objXtrmParams) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		objXtrmReturn          = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoQuestion", objXtrmParams);
		// 일별 검색 건수 추이
		ApiEnvelope vocAISearch   = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoQuestionChart", objXtrmParams);
		objXtrmReturn.setDataArrayNode(vocAISearch.getDataArrayNode(), "VOC_AI_QUESTION");
		//나의 검색어 분포 (워드클라우드)
		ApiEnvelope vocKeyword    = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.management.ManagementMapper", "selectInfoQuestionWordCloud", objXtrmParams);
		objXtrmReturn.setDataArrayNode(vocKeyword.getDataArrayNode(), "VOC_QUESTION_WORDCLOUD");
		return objXtrmReturn;
	}
	//****** AI 질의어 현황  ************************************************************************//


}
