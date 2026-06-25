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
package xs.vob.cmmn.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
//import org.xhtmlrenderer.pdf.ITextFontResolver;
//import org.xhtmlrenderer.pdf.ITextRenderer;
//import org.xhtmlrenderer.simple.xhtml.XhtmlNamespaceHandler;

//import com.lowagie.text.pdf.BaseFont;

import xs.core.database.XtrmDAOWeb;
import xs.core.enumeration.XtrmEnum;
import xs.core.extend.XtrmDefaultResource;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCmmnUtilWeb;
import xs.core.utility.XtrmCryptoUtil;
//import xs.core.utility.XtrmNIOFileUtil;
import xs.domain.certification.service.CertificationService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComMessage;
import xs.vob.management.dto.ComUser;
import xs.vob.management.dto.ComUserPasswordHistory;


@Service
public class CmmnServiceImpl extends XtrmDefaultResource implements CmmnService {

    private static final String PASSWORD_DEFAULT = "^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$";
    private static final String SAME_FOUR_CHAR   = "(\\w)\\1\\1\\1";

    @Autowired
    xs.domain.cmmn.service.CmmnService domainService;

    @Autowired
    CertificationService certificationService;

    public static Map<String, List<ComMessage>> messages;

	//****** 비즈니스 공통 관련 인터페이스  ************************************************************************//
    // 시스템코드관리 >  상세코드 조회
    @Override
    public ApiEnvelope selectSysCodeDetailData(ApiEnvelope objXtrmParams) throws Exception {
        ApiEnvelope objXtrmReturn	= new ApiEnvelope();
        objXtrmReturn = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectSysCodeDetailData", objXtrmParams);
        // 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
        makeDynamicColumn(objXtrmReturn);
        return objXtrmReturn;
    }

    // 팝업 > 메뉴 및 사용자 정보 조회
    @Override
    public ApiEnvelope selectUserMenuData(ApiEnvelope objXtrmParams) throws Exception {
        objXtrmParams.setValueAllToNull();
        return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectUserMenuData", objXtrmParams);
    }

    // 행에 속한 changeDataList 의 값을 분리하여 컬럼으로 추가한다.
    private void makeDynamicColumn(ApiEnvelope objXtrmData) throws Exception {
        if (objXtrmData.getCount() != 0) {
            int dataCount = objXtrmData.getCount();
            for (int i = 0; i < dataCount; i++) {
                String changeData = objXtrmData.getString("changeDataList", i);
                objXtrmData.removeKey("DATA", "changeDataList", i);
                String[] rowDataList = changeData.split("%%");
                for (String rowDataListItem : rowDataList) {
                    String[] rowData = rowDataListItem.split("###");
                    if (rowData.length > 1) {
                        objXtrmData.setString("codeName" + capitalizeFirstLetter(rowData[0]), rowData[1], i);
                    }
                    if (rowData.length > 2) {
                        objXtrmData.setString("codeDesc" + capitalizeFirstLetter(rowData[0]), rowData[2], i);
                    }
                }
            }
        }
    }

    private String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) {
            return input; // null 또는 빈 문자열일 경우 그대로 반환
        }
        // 첫 문자를 대문자로 변환하고 나머지 문자열은 그대로 유지
        return Character.toUpperCase(input.charAt(0)) + input.substring(1);
    }

    // 비밀번호 변경
    @Transactional(rollbackFor={Exception.class, SQLException.class}, propagation= Propagation.REQUIRED, readOnly=false)
    public ApiEnvelope changeUserPassword(ApiEnvelope objXtrmParams, XtrmDAOWeb objXtrmDao) throws Exception {
        //최종 반환 객체 생성
        ApiEnvelope objXtrmReturn		= new ApiEnvelope();
        String strCompanyCode		= objXtrmParams.getString("companyCode");
        String strUserId			= objXtrmParams.getString("userId");
        String strPasswordEncpt		= objXtrmParams.getString("passwordEncpt");
        String strLanguageCode		= objXtrmParams.getString("languageCode");

        //사용자 정보 조회
        ComUser objUser				= selectUserBase(strCompanyCode, strUserId, strLanguageCode);
        //비밀번호변경 가능 여부 체크
        if(validationUpdatePwd(objXtrmParams, objUser, objXtrmReturn)){
            //회사코드를 이용한 암호화 비밀번호 생성
            ApiEnvelope objPasswordJson = createPassword(objUser.getCompanyCode(), strPasswordEncpt);
            objXtrmParams.setString("passwordEncpt", objPasswordJson.getString("passwordEncpt"));
            objXtrmParams.setString("companyCode", objUser.getCompanyCode());

            //사용자 업데이트 처리
            updateUser(objXtrmParams, objXtrmDao);

            //사용자 비밀번호 변경 히스토리 생성
            insertUserPasswordHist(objUser.getCompanyCode(), strUserId, strPasswordEncpt, objPasswordJson.getString("encptKeyInfo"), objXtrmDao);
        }

        return objXtrmReturn;
    }

    // 비밀번호 변경 ( OTP )
    @Override
    @Transactional(rollbackFor={Exception.class, SQLException.class}, propagation=Propagation.REQUIRED, readOnly=false)
    public ApiEnvelope changeUserPasswordOTP(ApiEnvelope objXtrmParams, XtrmDAOWeb objXtrmDao) throws Exception {
        //최종 반환 객체 생성
        ApiEnvelope objXtrmReturn  = new ApiEnvelope();
        String strCompanyCode   = objXtrmParams.getString("companyCode");
        String strUserId        = objXtrmParams.getString("userId");
        String strPasswordEncpt = objXtrmParams.getString("passwordEncpt");
        String strLanguageCode	= objXtrmParams.getString("languageCode");

        //사용자 정보 조회
        ComUser objUser = selectUserBase(strCompanyCode, strUserId, strLanguageCode);

        // OTP 코드 검증
        if(!certificationService.validationOTPCode(objXtrmParams, objXtrmReturn)) {return objXtrmReturn;}

        //비밀번호변경 가능 여부 체크
        if(validationUpdatePwd(objXtrmParams, objUser, objXtrmReturn)){
            //회사코드를 이용한 암호화 비밀번호 생성
            ApiEnvelope objPasswordJson = createPassword(objUser.getCompanyCode(), strPasswordEncpt);
            objXtrmParams.setString("passwordEncpt", objPasswordJson.getString("passwordEncpt"));
            objXtrmParams.setString("companyCode", objUser.getCompanyCode());

            //사용자 업데이트 처리
            updateUser(objXtrmParams, mobjXtrmDao);

            //사용자 비밀번호 변경 히스토리 생성
            insertUserPasswordHist(objUser.getCompanyCode(), strUserId, strPasswordEncpt, objPasswordJson.getString("encptKeyInfo"), objXtrmDao);
        }

        return objXtrmReturn;
    }


    // 비밀번호 변경 이력 저장
    @Override
    public int insertUserPasswordHist(String strCompanyCode, String strUserId, String strPasswordEncpt, String strEncptKeyInfo, XtrmDAOWeb objXtrmDao) throws Exception {
        ApiEnvelope objXtrmParams = new ApiEnvelope();
        objXtrmParams.setString("companyCode", strCompanyCode);
        objXtrmParams.setString("userId", strUserId);
        objXtrmParams.setString("passwordEncpt", strPasswordEncpt);
        objXtrmParams.setString("encptKeyInfo", strEncptKeyInfo);
        objXtrmParams.setObject("registDate", XtrmCmmnUtil.getFormatDateTimeMilli("-", ":"));
        HttpSession objSession = XtrmCmmnUtilWeb.getServletRequest().getSession(false);
        Object objSessionUserId = null;
        if(objSession != null){objSessionUserId = objSession.getAttribute("USER_ID");}
        if(objSessionUserId == null){objSessionUserId = "";}
        String strSessionUserId = objSessionUserId.toString();
        if("".equals(strSessionUserId)){strSessionUserId = strUserId;}
        objXtrmParams.setString("firstCreateUserId", strSessionUserId);

        return ApiEnvelopes.insert(objXtrmDao, "xs.vob.cmmn.CmmnMapper", "insertUserPasswordHistory", objXtrmParams);
    }

    // 사용자 정보 수정
    @Override
    public int updateUser(ComUser objUser, XtrmDAOWeb objXtrmDao) throws Exception {
        HttpSession objSession = XtrmCmmnUtilWeb.getServletRequest().getSession(false);
        Object objSessionUserId = null;
        if(objSession != null){objSessionUserId = objSession.getAttribute("USER_ID");}
        if(objSessionUserId == null){objSessionUserId = "";}
        String strSessionUserId = objSessionUserId.toString();
        if("".equals(strSessionUserId)){strSessionUserId = objUser.getUserId();}
        objUser.setLastUpdateUserId(strSessionUserId);

        return objXtrmDao.update("xs.vob.cmmn.CmmnMapper", "updateUser", objUser);
    }

    // 사용자 정보 수정
    @Override
    public int updateUser(ApiEnvelope objXtrmParams, XtrmDAOWeb objXtrmDao) throws Exception {
        HttpSession objSession = XtrmCmmnUtilWeb.getServletRequest().getSession(false);
        Object objSessionUserId = null;
        if(objSession != null){objSessionUserId = objSession.getAttribute("USER_ID");}
        if(objSessionUserId == null){objSessionUserId = "";}
        String strSessionUserId = objSessionUserId.toString();
        if("".equals(strSessionUserId)){strSessionUserId = objXtrmParams.getString("userId");}
        objXtrmParams.setString("lastUpdateUserId", strSessionUserId);

        return ApiEnvelopes.update(objXtrmDao, "xs.vob.cmmn.CmmnMapper", "updateUser", objXtrmParams);
    }


    // 사용자 정보 검색
    @Override
    public ComUser selectUserBase(String strCompanyCode, String strUserId, String languageCode) throws Exception{
        //반환객체 생성
        ComUser objReturnUser = new ComUser();
        ApiEnvelope objXtrmParams = new ApiEnvelope();

        //암호화키 생성
        String userIdKey = getAesKey(strCompanyCode, strUserId);

        objXtrmParams.setString("companyCode", strCompanyCode);
        objXtrmParams.setString("userId", strUserId);
        objXtrmParams.setString("userIdKey", userIdKey);
        objXtrmParams.setString("languageCode", languageCode);

        List<ComUser> objUser = ApiEnvelopes.selectMap(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectUserBase", objXtrmParams, ComUser.class);
        if(objUser.size() > 0){objReturnUser = objUser.get(0);}

        return objReturnUser;
    }

    // 비밀번호 변경시 데이터 체크
    private boolean validationUpdatePwd(ApiEnvelope objXtrmParams, ComUser objUser, ApiEnvelope objXtrmReturn) throws Exception{
        String companyCode				= objUser.getCompanyCode();
        String userId					= objUser.getUserId();
        String passwordNew				= objXtrmParams.getString("passwordNew");		//변경요청된 client 입력 평문 암호
        String passwordNewEncrypt		= objXtrmParams.getString("passwordEncpt");		//변경요청된 client 입력 암호화 암호
        String passwordOldEncrypt		= objXtrmParams.getString("passwordOldEncpt");	//암호화된 기존  암호
        boolean isInit					= objXtrmParams.getBoolean("init", 0, false);

        //사용자 정보 존재여부 체크
        if(objUser == null || companyCode == null || "".equals(companyCode) || userId == null || "".equals(userId)) {
            objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR01.getCodeName()); return false;
        }

        //초기화 여부 확인
        if(!isInit) {
            //사용자 정보 존재여부 체크
            if (!validationUserPassword(passwordOldEncrypt, objUser.getPasswordEncpt(), objUser.getEncptKeyInfo())) {
                objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR02.getCodeName());
                return false;
            }

            //비밀번호 유효성 체크(영문자+숫자+특수문자 조합 8글자 이상 20글자 이하<br/>반복 문자 4자리 이상 허용X)
            Matcher matcher = Pattern.compile(PASSWORD_DEFAULT).matcher(passwordNew);
            if (!matcher.matches()) {
                objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR03.getCodeName());
                return false;
            }

            matcher = Pattern.compile(SAME_FOUR_CHAR).matcher(passwordNew);
            if (matcher.find()) {
                objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR04.getCodeName());
                return false;
            }

            //연속문자 4자 이상 존재여부 체크(1234, 4321, abcd, dcba)
            if (isExistContinuousChar(passwordNew)) {
                objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR05.getCodeName());
                return false;
            }

            //변경 비밀번호와 계정 ID정보의 유사성 체크
            List<String> charArray = new ArrayList<>();
            int size = userId.length() - 3;
            for (int i = 0; i < size; i++) {
                charArray.add(userId.substring(i, (i + 4)));
            }
            for (int j = 0; j < charArray.size(); j++) {
                if (passwordNew.indexOf(charArray.get(j)) >= 0) {
                    objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR06.getCodeName());
                    return false;
                }
            }

            //현재 비밀번호 변경비밀번호 일치여부 체크
            if (passwordNewEncrypt.equals(passwordOldEncrypt)) {
                objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR07.getCodeName());
                return false;
            }

            //최근 변경 비밀번호 동일여부 체크, 당일 비밀번호 변경 여부 체크
            int intCheckCnt = mobjXtrmConfig.getInt("CHECK_PASSWORD_HIST_COUNT");
            List<ComUserPasswordHistory> objPasswordHist = getUserPasswordHist(objXtrmParams.getString("companyCode"), objXtrmParams.getString("userId"));
            for (int i = 0; i < objPasswordHist.size(); i++) {
                if (validationUserPassword(objXtrmParams.getString("passwordEncpt"), objPasswordHist.get(i).getPasswordEncpt(), objPasswordHist.get(i).getEncptKeyInfo())) {
                    objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR08.getCodeName());
                    return false;
                /* 당일 2번 이상 변경에 대한 Validation 처리는 하지 않음
                } else if ("Y".equals(objPasswordHist.get(i).getTodayChangeAt())) {
                    objXtrmReturn.setResultHeader(true, MainEnum.PASSWORD_CHANGE_ERROR09.getCodeName());
                    return false;
                */
                }
                if (i == intCheckCnt - 1) {
                    break;
                }
            }
        }

        return true;
    }

    /**
     * 클라이언트에서 전송된 비밀번호가 맞는지 체크하는 함수
     * @param strPasswordEncptClient 클라이언트에서 전송된 1차 Hash처리된 비밀번호
     * @param strPasswordEncptDB DB에 저장된 비밀번호
     * @param strEncptKeyInfo DB에 저장된 encptKeyInfo 키
     * @return true / false
     */
    @Override
    public boolean validationUserPassword(String strPasswordEncptClient, String strPasswordEncptDB, String strEncptKeyInfo) throws Exception{
        //5회 수행
        for(int i = 0; i < 5; i++){
            strPasswordEncptClient = XtrmCryptoUtil.encryptSHA256(strPasswordEncptClient + strEncptKeyInfo, "");
        }
        if(strPasswordEncptClient != null) {
            return strPasswordEncptClient.equals(strPasswordEncptDB);
        }else {
            return false;
        }
    }

    // 비밀번호 실패 건수 업데이트
    @Override
    public int increaseWrongPasswordCount(String strCompanyCode, String strUserId, int intWrongPasswordCount, XtrmDAOWeb objXtrmDao) throws Exception {
        ApiEnvelope objXtrmParams = new ApiEnvelope();
        int CHECK_PASSWORD_FAIL_MAX_COUNT = mobjXtrmConfig.getInt("CHECK_PASSWORD_FAIL_MAX_COUNT",5);
        objXtrmParams.setString("companyCode", strCompanyCode);
        objXtrmParams.setString("userId", strUserId);
        objXtrmParams.setInt("passwordErrorCount", intWrongPasswordCount + 1);
        if(intWrongPasswordCount >= CHECK_PASSWORD_FAIL_MAX_COUNT){objXtrmParams.setString("accountUseAt", "N");}
        HttpSession objSession = XtrmCmmnUtilWeb.getServletRequest().getSession(false);
        Object objSessionUserId = null;
        if(objSession != null){objSessionUserId = objSession.getAttribute("USER_ID");}
        if(objSessionUserId == null){objSessionUserId = "";}
        String strSessionUserId = objSessionUserId.toString();
        if("".equals(strSessionUserId)){strSessionUserId = strUserId;}
        objXtrmParams.setString("lastUpdateUserId", strSessionUserId);

        return ApiEnvelopes.update(objXtrmDao, "xs.vob.cmmn.CmmnMapper", "updateUser", objXtrmParams);
    }

    // 클라이언트에서 전송된 1차 Hash 데이터를 이용하여 EncptKeyInfo키를 랜덤하게 생성하고 EncptKeyInfo와 반복처리를 통해 2차 암호화 비밀번호를 생성하여 반환한다.
    @Override
    public ApiEnvelope createPassword(String strCompanyCode, String strPasswordEncpt) throws Exception {
        ApiEnvelope objXtrmReturn			= new ApiEnvelope();
        ApiEnvelope objXtrmParams			= new ApiEnvelope();
        String strEncptKeyInfo			= new String();
        objXtrmParams.setString("companyCode", strCompanyCode);
        ApiEnvelope companyInfo            = selectCompanyByKey(objXtrmParams);

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

    // 회사의 암호화 키 정보 조회
    @Override
    public ApiEnvelope selectCompanyByKey(ApiEnvelope objXtrmParams) throws Exception {
        return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectCompanyByKey", objXtrmParams);
    }

    // 비밀번호 변경 이력 검색
    @Override
    public List<ComUserPasswordHistory> getUserPasswordHist(String strCompanyCode, String strUserId) throws Exception {
        ApiEnvelope objXtrmParams = new ApiEnvelope();
        objXtrmParams.setString("companyCode", strCompanyCode);
        objXtrmParams.setString("userId", strUserId);

        return ApiEnvelopes.selectMap(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectUserPasswordHist", objXtrmParams, ComUserPasswordHistory.class);
    }

    private boolean isExistContinuousChar(String data){
        boolean isExist	= false;
        char [] s		= data.toCharArray();
        char chr_pass_0;
        char chr_pass_1;
        char chr_pass_2;
        char chr_pass_3;

        for(int i = 0; i < s.length - 3; i++){
            chr_pass_0	= s[i];
            chr_pass_1	= s[i+1];
            chr_pass_2	= s[i+2];
            chr_pass_3	= s[i+3];
            if(chr_pass_0 == chr_pass_1 - 1 && chr_pass_0 == chr_pass_2 - 2 && chr_pass_0 == chr_pass_3 - 3){
                isExist	= true;
                break;
            }
            if(chr_pass_0 == chr_pass_1 + 1 && chr_pass_0 == chr_pass_2 + 2 && chr_pass_0 == chr_pass_3 + 3){
                isExist	= true;
                break;
            }
        }

        return isExist;
    }

    // 초기 다국어 데이터를 Setting 한다.
    @Override
    public void setInitMessageData(Map<String, List<ComMessage>> messageData){
        messages = messageData;
    }

    static public String getMessage(String messageId){
        String languageCode = "ko";

        HttpServletRequest request = XtrmCmmnUtilWeb.getServletRequest();

        if(request != null){
            HttpSession session = request.getSession();
            if(session != null){
                Object objSessionLang = session.getAttribute("LANGUAGE_CODE");
                if(objSessionLang != null){
                    languageCode = objSessionLang.toString();
                }else{
                    languageCode = request.getLocale().getLanguage();
                }
            }else{
                languageCode = request.getLocale().getLanguage();
            }
        }
        return getMessage(messageId, languageCode);
    }

    static public String getMessage(String messageId, String languageCode){
        String returnValue = "";

        if(messages != null && messages.containsKey(messageId) ){
            Optional<ComMessage> result = messages.get(messageId)
                    .stream()
                    .filter(message -> message.getLanguageCode().equals(languageCode))
                    .findFirst();
            if (result.isPresent()) {
                returnValue = result.get().getMessageContents();
            }
        }

        return returnValue;
    }

    // 다국어 데이터 등록 및 수정시 서버에 다국어 변경 목록을 전송한다.
    public int memoryMessageDataUpdate(ApiEnvelope objXtrmParams, String strTxFlag) throws Exception {
        int intReturnValue           = 0;
        String messageId             = objXtrmParams.getString("messageId");
        String languageCode          = objXtrmParams.getString("languageCode");
        String messageSectionCode    = objXtrmParams.getString("messageSectionCode");
        String messageContents       = objXtrmParams.getString("messageContents");
        String useAt                 = objXtrmParams.getString("useAt");
        List<ComMessage> messageData = messages.get(objXtrmParams.getString("messageId"));
        if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)){
            String message = getMessage(messageId, languageCode);

            // 메모리상에 messageVO가 존재할경우 또는 사용여부가 미사용으로 전달된 경우 메모리에 데이터를 로드하지 않는다.
            if( ! "".equals(getMessage(messageId, languageCode)) || ! "Y".equals(useAt) ) return 0;

            // 메모리에 해당 KEY에 해당하는 객체가 없을경우( 사용여부가 미사용이어서 생성이 안되느 경우 ) 객체를 생성한다.
            if(messageData==null) messageData = new ArrayList<>();
            ComMessage comMessage             = new ComMessage(languageCode, messageId, messageContents, messageSectionCode, useAt);
            messageData.add(comMessage);

            messages.put(messageId, messageData);
            intReturnValue += 1;
        }else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)){
            // 메모리에 해당 KEY에 해당하는 객체가 없을경우 List 객체 생성
            if(messageData==null){ messageData           = new ArrayList<>(); }

            // List내 MessageVO 객체가 없을경우 또는 languageCode에 해당하는 MessageVO 객체가 없을경우
            if(messageData.isEmpty() || ( messageData.stream().noneMatch(item -> languageCode.equals(item.getLanguageCode()))) ){
                ComMessage comMessage = new ComMessage(languageCode, messageId, messageContents, messageSectionCode, useAt);
                messageData.add(comMessage);

                messages.put(messageId, messageData);
                intReturnValue += 1;
                return intReturnValue;
            }

            // 메모리에 등록된 MessageId에 해당하는 List를 순회한다.
            for(ComMessage serverData : messageData ){
                if(serverData.getMessageId().equals(messageId)&&serverData.getLanguageCode().equals(languageCode)){
                    // 사용여부가 미사용일경우 메모리에서 다국어 데이터를 제거한다.
                    if(!"Y".equals(useAt)){
                        messageData.remove(serverData);
                    }else{
                        serverData.setMessageSectionCode(messageSectionCode);
                        serverData.setMessageContents(messageContents);
                        serverData.setUseAt(useAt);
                        intReturnValue += 1;
                    }
                    // 메모리에 등록된 MessageId에 해당하는 List가 비어있을경우 메모리에서 제거한다.
                    if(messageData.isEmpty()){ messages.remove(messageId); }
                    break;
                }
            }

        }else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxFlag)){
            if(messageData!=null){
                // 메모리에 등록된 MessageId에 해당하는 List를 순회한다.
                for(ComMessage serverData : messageData ){
                    if(serverData.getMessageId().equals(messageId)&&serverData.getLanguageCode().equals(languageCode)){
                        messageData.remove(serverData);
                        intReturnValue += 1;
                        // 메모리에 등록된 MessageId에 해당하는 List가 비어있을경우 메모리에서 제거한다.
                        if(messageData.isEmpty()){ messages.remove(messageId); }
                        break;
                    }
                }
            }
        }

        return intReturnValue;
    }

    @Override
    public String getAesKey(String companyCode, String keyInfo) throws Exception{
        return domainService.getAesKey(companyCode, keyInfo);
    }

    // 세션 생성을 위한 로그인 대상자 검색
    @Override
    public ComUser selectUserForLogin(String strCompanyCode, String strUserId) throws Exception{
        return selectUserForLogin(strCompanyCode, strUserId, "ko");
    }

    @Override
    public ComUser selectUserForLogin(String strCompanyCode, String strUserId, String languageCode) throws Exception{
        //반환객체 생성
        ComUser objReturnUser = new ComUser();
        ApiEnvelope objXtrmParams = new ApiEnvelope();

        //암호화키 생성
        String userIdKey = getAesKey(strCompanyCode, strUserId);
        String solutionSectionCode = mobjXtrmConfig.getString("SOLUTION_SECTION_CODE","*");						// SOLUTION_SECTION_CODE (*, KMS, VOC, QMS, ADV, TLS, BOT, ...)

        objXtrmParams.setString("companyCode", strCompanyCode);
        objXtrmParams.setString("userId", strUserId);
        objXtrmParams.setString("userIdKey", userIdKey);
        objXtrmParams.setString("solutionSectionCode", solutionSectionCode);
        objXtrmParams.setString("languageCode", languageCode);					//로그인시 언어코드 조건 추가

        List<ComUser> objUser = ApiEnvelopes.selectMap(mobjXtrmDao, "xs.vob.cmmn.CmmnMapper", "selectUserForLogin", objXtrmParams, ComUser.class);
        if(objUser.size() > 0){objReturnUser = objUser.get(0);}

        return objReturnUser;
    }


    //****** 비즈니스 공통 관련 인터페이스  ************************************************************************//

//	//****** 리포트 공통 관련  ************************************************************************//
//	/**
//	 * PDF FONT 및 RENDERING 설정
//	 * @return
//	 * @throws IOException
//	 */
//	public ITextRenderer initRenderer(String fontPath) throws Exception {
//		ITextRenderer renderer = new ITextRenderer();
//		ITextFontResolver fontResolver = renderer.getFontResolver();
//		fontResolver.addFont(fontPath, "ArialUnicodeMS", BaseFont.IDENTITY_H, true, null);
//		renderer.getSharedContext().setNamespaceHandler(new XhtmlNamespaceHandler());
//		return renderer;
//	}
//
//	/**
//	 * 리포트 pdf 파일 서버 저장
//	 * @param objXtrmParams 리포트 관련 파라미터
//	 * @param path 저장경로
//	 * @param html 리포트 내용
//	 * @throws Exception
//	 */
//	public void saveReportToPdf(ApiEnvelope objXtrmParams, String path, String html) throws Exception {
//		String reportKey = objXtrmParams.getString("reportKey");
//		String subject = objXtrmParams.getString("subject").replace("|", "").replace(".png", "");
//		String fontPath =  mobjXtrmConfig.getString("VOC_REPORT_RESOURCE_FILE_PATH") + "/font/Arialuni.TTF";
//
//		// 저장 경로
//        File baseDir = new File(path);
//        if (baseDir.exists()) { XtrmNIOFileUtil.deleteDirectory(baseDir, true); }
//        baseDir.mkdirs();
//
//		// 파일 경로 지정
//		File pdfFile = new File(baseDir, subject + ".pdf");
//		OutputStream os = new FileOutputStream(pdfFile.getPath());
//		ITextRenderer renderer = initRenderer(fontPath);
//		renderer.setDocumentFromString(html);
//		renderer.layout();
//		renderer.createPDF(os, true);
//	}
//
//	/**
//	 * 요약 리포트 내용 그룹화 : ITEM_KEY를 기준으로 리포트 내용 그룹화하여 리턴
//	 * @param result
//	 * @return
//	 * @throws Exception
//	 */
//	public ApiEnvelope groupReportContentsSummary(JsonArray result) throws Exception {
//        XtrmJSON returnValue = new ApiEnvelope();
//
//		JsonArray groupedData = new JsonArray();
//		JsonObject groupedItem = null;
//		JsonArray detailContentsArray = null;
//		String previousKey = "";
//
//		for (int i = 0; i < result.size(); i++) {
//			JsonObject item = result.get(i).getAsJsonObject();
//			String currentKey = item.get("itemKey").getAsString();
//			String currentSubject = item.get("itemSubject").getAsString();
//
//			// 새로운 키의 경우 기존 그룹을 저장하고 새로운 그룹 시작
//			if (!currentKey.equals(previousKey)) {
//				if (groupedItem != null) {  // 기존 그룹이 있는 경우에만 추가
//					groupedItem.add("detailContentsArray", detailContentsArray);
//					groupedData.add(groupedItem);
//				}
//				// 새로운 그룹 초기화
//				groupedItem = new JsonObject();
//				detailContentsArray = new JsonArray();
//
//				groupedItem.addProperty("itemKey", currentKey);
//				groupedItem.addProperty("itemSubject", currentSubject);
//				previousKey = currentKey;
//			}
//			// 현재 아이템의 들여쓰기 레벨과 내용을 배열에 추가
//			JsonObject detailObject = new JsonObject();
//			if(!item.get("indentationLevel").isJsonNull() && item.get("indentationLevel") != null){ detailObject.addProperty("indentationLevel", item.get("indentationLevel").getAsInt()); }
//			if(!item.get("detailItemContents").isJsonNull() && item.get("detailItemContents") != null){ detailObject.addProperty("detailItemContents", item.get("detailItemContents").getAsString()); }
//			// VOC 출처 표시 및 상세 연동을 위한 CONTENTS_KEY, VOC등급, 상담일지번호 JsonArray로 add
//			// 요약 리포트 조회 시 키 리스트를 쿼리해오지 않게 변경함에 따라 key값 존재 여부 체크를 선행함
//			if(item.has("contentsKeyList")){
//				if(!item.get("contentsKeyList").isJsonNull() && item.get("contentsKeyList") != null){
//					detailObject.add("contentsKeyList", item.get("contentsKeyList").getAsJsonArray());
//				}
//			}
//			if(item.has("contentsNumList")){
//				if(!item.get("contentsNumList").isJsonNull() && item.get("contentsNumList") != null){
//					detailObject.add("contentsNumList", item.get("contentsNumList").getAsJsonArray());
//				}
//			}
//			if(item.has("vocGradeList")){
//				if(!item.get("vocGradeList").isJsonNull() && item.get("vocGradeList") != null){
//					detailObject.add("vocGradeList", item.get("vocGradeList").getAsJsonArray());
//				}
//			}
//			detailContentsArray.add(detailObject);
//		}
//		// 마지막 그룹 추가 (루프 종료 후 남아 있는 그룹 처리)
//		if (groupedItem != null) {
//			groupedItem.add("detailContentsArray", detailContentsArray);
//			groupedData.add(groupedItem);
//		}
//		returnValue.setDataJsonArray(groupedData);
//		return returnValue;
//	}
//
//	/**
//	 * 상세 리포트 내용 그룹화 : REPORT_SUB_KEY, ITEM_KEY를 기준으로 리포트 내용 그룹화하여 리턴
//	 * @param result
//	 * @return
//	 * @throws Exception
//	 */
//    public ApiEnvelope groupReportContentsDetail(JsonArray result) throws Exception {
//        XtrmJSON returnValue = new ApiEnvelope();
//        JsonArray groupedData = new JsonArray();
//        JsonObject groupedItem = null;
//        JsonArray detailContentsArray = null;
//
//        String previousReportSubKey = "";
//        String previousItemKey = "";
//
//        Map<String, Set<String>> subKeyToItemKeys = new HashMap<>();
//
//        // reportSubKey별로 몇 개의 itemKey가 있는지 미리 세기 (목차 중복 방지를 위함)
//        for (JsonElement elem : result) {
//            JsonObject item = elem.getAsJsonObject();
//            String subKey = item.get("reportSubKey").getAsString();
//            String itemKey = item.get("itemKey").getAsString();
//            subKeyToItemKeys.computeIfAbsent(subKey, k -> new HashSet<>()).add(itemKey);
//        }
//
//        for (int i = 0; i < result.size(); i++) {
//            JsonObject item = result.get(i).getAsJsonObject();
//            String currentReportSubKey = item.get("reportSubKey").getAsString();
//            String currentItemKey = item.get("itemKey").getAsString();
//            String currentItemSubject = item.get("itemSubject").getAsString();
//
//            // 새로운 reportSubKey 그룹 시작
//            if (!currentReportSubKey.equals(previousReportSubKey)) {
//                if (groupedItem != null) {
//                    groupedItem.add("detailContentsArray", detailContentsArray);
//                    groupedData.add(groupedItem);
//                }
//                groupedItem = new JsonObject();
//                detailContentsArray = new JsonArray();
//                groupedItem.addProperty("reportSubKey", currentReportSubKey);
//                if (item.has("subSubject")) {
//                    groupedItem.addProperty("subSubject", item.get("subSubject").getAsString());
//                }
//                previousReportSubKey = currentReportSubKey;
//                previousItemKey = ""; // 새 그룹이므로 초기화
//            }
//
//            // itemKey가 변경될 때만 itemSubject를 detailItemContents로 추가
//            if (!currentItemKey.equals(previousItemKey)) {
//                // TASK별 ACTION이 1개 뿐이면 목차가 중복되므로 ACTION명 추가하지 않음 ( VOB_REPORT_DETAIL : VOB_REPORT_DETAIL_ITEM = 1 : 1 )
//                boolean isOneToOne = subKeyToItemKeys.getOrDefault(currentReportSubKey, Set.of()).size() == 1;
//                if (!isOneToOne) {
//                    JsonObject subjectObject = new JsonObject();
//                    subjectObject.addProperty("indentationLevel", 0);
//                    subjectObject.addProperty("detailItemContents", currentItemSubject);
//                    subjectObject.add("contentsKeyList", new JsonArray());
//                    subjectObject.add("contentsNumList", new JsonArray());
//                    subjectObject.add("vocGradeList", new JsonArray());
//                    detailContentsArray.add(subjectObject);
//                    previousItemKey = currentItemKey;
//                }
//            }
//
//            // 기존 detailItemContents 추가
//            JsonObject detailObject = new JsonObject();
//            detailObject.addProperty("indentationLevel", item.get("indentationLevel").getAsInt());
//            detailObject.addProperty("detailItemContents", item.get("detailItemContents").getAsString());
//
//            if (item.has("contentsKeyList")) {
//                if (!item.get("contentsKeyList").isJsonNull() && item.get("contentsKeyList") != null) {
//                    detailObject.add("contentsKeyList", item.get("contentsKeyList").getAsJsonArray());
//                }
//            }
//            if (item.has("contentsNumList")) {
//                if (!item.get("contentsNumList").isJsonNull() && item.get("contentsNumList") != null) {
//                    detailObject.add("contentsNumList", item.get("contentsNumList").getAsJsonArray());
//                }
//            }
//            if (item.has("vocGradeList")) {
//                if (!item.get("vocGradeList").isJsonNull() && item.get("vocGradeList") != null) {
//                    detailObject.add("vocGradeList", item.get("vocGradeList").getAsJsonArray());
//                }
//            }
//            detailContentsArray.add(detailObject);
//        }
//
//        // 마지막 그룹 추가
//        if (groupedItem != null) {
//            groupedItem.add("detailContentsArray", detailContentsArray);
//            groupedData.add(groupedItem);
//        }
//
//        returnValue.setDataJsonArray(groupedData);
//        return returnValue;
//    }
//
//	/**
//	 * 요약리포트 내용으로 메일 본문 html 생성
//	 * @param objXtrmParams 리포트 관련 파라미터
//	 * @param summaryData 메일 본문에 실릴 요약리포트 데이터
//	 * @return 메일 본문 html
//	 * @throws Exception
//	 */
//	public String getTextHtml(ApiEnvelope objXtrmParams, XtrmJSON summaryData) throws Exception {
//		JsonArray summaryContents = summaryData.getDataJsonArray();
//		String vocReportResourceFilePath = mobjXtrmConfig.getString("VOC_REPORT_RESOURCE_FILE_PATH");
//		String templateSub1Path = vocReportResourceFilePath + "/html/summary_template_sub1.html";
//		String templateSub2Path = vocReportResourceFilePath + "/html/summary_template_sub2.html";
//		String templateTotalPath = vocReportResourceFilePath + "/html/totalHtml.html";
//		String htmlSub1 = Files.readString(Paths.get(templateSub1Path), StandardCharsets.UTF_8);
//		String htmlSub2 = Files.readString(Paths.get(templateSub2Path), StandardCharsets.UTF_8);
//		String htmlTotal = Files.readString(Paths.get(templateTotalPath), StandardCharsets.UTF_8);
//
//        // 리포트 월별 헤더 백그라운드 이미지 경로
////        String backgroundImgPath = mobjXtrmConfig.getString("VOC_REPORT_IMAGE_FILE_PATH") + "/img_report_" + objXtrmParams.getString("standardMonth") + ".png";
////        byte[] fileBytes = XtrmNIOFileUtil.readFile(backgroundImgPath);
////        // base64 인코딩
////        String strBase64 = Base64.getEncoder().encodeToString(fileBytes);
//
//        // 웹 접근 가능한 경로 사용
//        String backgroundImgPath = mobjXtrmConfig.getString("VOC_REPORT_WEB_IMAGE_FILE_PATH") + "/pdf_img_report_" + objXtrmParams.getString("standardMonth") + ".png";
//
//        // 리포트 본문 내 헤더 내용 html 템플릿에 적용
//		htmlTotal = htmlTotal.replace("${dateInfo}", objXtrmParams.getString("dateInfo"))
//						 	 .replace("${vocCount}", objXtrmParams.getString("vocCount"))
//						 	 .replace("${analysisPeriod}", objXtrmParams.getString("analysisPeriod"))
//							 .replace("${summary01Title}", summaryContents.get(0).getAsJsonObject().get("itemSubject").getAsString())
//							 .replace("${summary02Title}", summaryContents.get(1).getAsJsonObject().get("itemSubject").getAsString())
//							 .replace("${subject}", objXtrmParams.getString("subject"))
//							 .replace("${summary}", objXtrmParams.getString("summary"))
////							 .replace("${backgroundImgLink}", strBase64)
//							 .replace("${backgroundImgLink}", backgroundImgPath)
//							 .replace("${shortcutLink}", objXtrmParams.getString("vocMailShortcutUrl"));
//
//		// 요약 1 내용 html 템플릿에 적용
//		JsonArray summary1 = summaryContents.get(0).getAsJsonObject().get("detailContentsArray").getAsJsonArray();
//		String sub1 = "";
//		String sub2 = "";
//		for(int i = 0; i < summary1.size(); i++){
//			JsonObject item = summary1.get(i).getAsJsonObject();
//			int indentationLevel = item.get("indentationLevel").getAsInt();
//			String detailItemContents = XtrmCmmnUtil.recoverXSSConst(item.get("detailItemContents").getAsString());
//			// 요약 1의 0레벨은 국가명, 1레벨은 내용
//			if(indentationLevel == 0){
//				// 최초 요소가 아니라면 이전까지 생성된 국가별 세부 내용을 replace한 뒤 초기화
//				if(i > 0){
//					sub1 = sub1.replace("${subContents}", sub2);
//					sub2 = "";
//				}
//				// 0레벨 데이터일 경우 sub1 html을 새로 생성하여 제목 영역을 채움
//				sub1 += htmlSub1.replace("${subSubject}", detailItemContents);
//			}else if(indentationLevel == 1){
//				// 1레벨 데이터일 경우 이전 loop에서 생성된 html 내부에 sub2 템플릿을 적용,
//				sub2 += htmlSub2.replace("${subContent}", detailItemContents);
//			}
//		}
//		// 루프 종료 후 마지막 요소 replace 처리
//        sub1 = sub1.replace("${subContents}", sub2);
//        htmlTotal = htmlTotal.replace("${summarySub1}", sub1);
//        sub1 = "";
//        sub2 = "";
//
//        // 요약 2 내용 html 템플릿에 적용
//        JsonArray summary2 = summaryContents.get(1).getAsJsonObject().get("detailContentsArray").getAsJsonArray();
//        for(int i = 0; i < summary2.size(); i++){
//            JsonObject item = summary2.get(i).getAsJsonObject();
//            int indentationLevel = item.get("indentationLevel").getAsInt();
//            String detailItemContents = XtrmCmmnUtil.recoverXSSConst(item.get("detailItemContents").getAsString());
//            // 요약 1의 0레벨은 국가명, 1레벨은 내용
//            if(indentationLevel == 0){
//                // 최초 요소가 아니라면 이전까지 생성된 국가별 세부 내용을 replace한 뒤 초기화
//                if(i > 0){
//                    sub1 = sub1.replace("${subContents}", sub2);
//                    sub2 = "";
//                }
//                // 0레벨 데이터일 경우 sub1 html을 새로 생성하여 제목 영역을 채움
//                sub1 += htmlSub1.replace("${subSubject}", detailItemContents);
//            }else if(indentationLevel == 1){
//                // 1레벨 데이터일 경우 이전 loop에서 생성된 html 내부에 sub2 템플릿을 적용,
//                sub2 += htmlSub2.replace("${subContent}", detailItemContents);
//            }
//        }
//        // 루프 종료 후 마지막 요소 replace 처리
//        sub1 = sub1.replace("${subContents}", sub2);
//        htmlTotal = htmlTotal.replace("${summarySub2}", sub1);
//
//		return htmlTotal;
//	}
//
//	/**
//	 * 요약 및 상세리포트 내용으로 PDF 파일용 html 생성
//	 * @param objXtrmParams 리포트 관련 파라미터
//	 * @param summaryData PDF 본문에 실릴 요약리포트 데이터
//	 * @param detailData PDF 본문에 실릴 상세리포트 데이터
//	 * @return PDF 본문 html
//	 * @throws Exception
//	 */
//	public String getPdfHtml(ApiEnvelope objXtrmParams, XtrmJSON summaryData, XtrmJSON detailData) throws Exception {
//		// 요약 및 상세 리포트 내용
//		JsonArray summaryContents = summaryData.getDataJsonArray();
//		JsonArray detailContents = detailData.getDataJsonArray();
//
//		String vocReportResourceFilePath = mobjXtrmConfig.getString("VOC_REPORT_RESOURCE_FILE_PATH");
//		String templateSub1Path = vocReportResourceFilePath + "/html/summary_template_sub1_pdf.html";
//		String templateSub2Path = vocReportResourceFilePath + "/html/summary_template_sub2_pdf.html";
//		String templateTotalPath = vocReportResourceFilePath + "/html/totalHtml_pdf.html";
//		String summaryAreaPath = vocReportResourceFilePath + "/html/summaryArea.html";
//		String templateSub1PdfPath = vocReportResourceFilePath + "/html/detail_template_sub1_pdf.html";
//		String templateLevel0PdfPath = vocReportResourceFilePath + "/html/detail_template_level0_pdf.html";
//		String templateLevel1PdfPath = vocReportResourceFilePath + "/html/detail_template_level1_pdf.html";
//
//        String htmlSub1 = Files.readString(Paths.get(templateSub1Path), StandardCharsets.UTF_8);
//		String htmlSub2 = Files.readString(Paths.get(templateSub2Path), StandardCharsets.UTF_8);
//		String htmlTotal = Files.readString(Paths.get(templateTotalPath), StandardCharsets.UTF_8);
//		String summaryArea = Files.readString(Paths.get(summaryAreaPath), StandardCharsets.UTF_8);
//		String detailSub1 = Files.readString(Paths.get(templateSub1PdfPath), StandardCharsets.UTF_8);
//		String level0Template = Files.readString(Paths.get(templateLevel0PdfPath), StandardCharsets.UTF_8);
//		String level1Template = Files.readString(Paths.get(templateLevel1PdfPath), StandardCharsets.UTF_8);
//
//        // 리포트 본문 내 헤더 정보 SELECT
//        XtrmJSON headerData = ApiEnvelopes.selectJson(mobjXtrmDao, "xs.vob.report.ReportMapper", "selectTargetReportBase", objXtrmParams);
//
//        // 리포트 월별 헤더 백그라운드 이미지 경로
//        String backgroundImgPath = mobjXtrmConfig.getString("VOC_REPORT_IMAGE_FILE_PATH") + "/pdf_img_report_" + headerData.getString("standardMonth") + ".png";
//        byte[] fileBytes = XtrmNIOFileUtil.readFile(backgroundImgPath);
//        // base64 인코딩
//        String strBase64 = Base64.getEncoder().encodeToString(fileBytes);
//
//		// 리포트 본문 내 헤더 내용 html 템플릿에 적용
//		htmlTotal = htmlTotal.replace("${dateInfo}", headerData.getString("dateInfo"))
//				             .replace("${vocCount}", headerData.getString("vocCount"))
//				             .replace("${analysisPeriod}", headerData.getString("analysisPeriod"))
//			            	 .replace("${subject}", headerData.getString("subject"))
//		            		 .replace("${summary}", headerData.getString("summary"))
//		            		 .replace("${backgroundImgLink}", strBase64);
//
//        String templateFormat = "";
//        for(int i = 0; i < summaryContents.size(); i++){
//            String idx = String.format("%02d", i+1);
//            String replacement = summaryArea.replace("${number}", idx)
//                                            .replace("${summaryTitle}", "${summary" + idx + "Title}")
//                                            .replace("${summarySub}", "${summarySub" + idx +"}");
//            templateFormat += replacement;
//        }
//        htmlTotal = htmlTotal.replace("${summaryAllArea}", templateFormat);
//
//        String sub1 = "";
//        String sub2 = "";
//        for(int i = 0; i < summaryContents.size(); i++){
//            String idx = String.format("%02d", i+1);
//            htmlTotal = htmlTotal.replace("${summary" + idx + "Title}", summaryContents.get(i).getAsJsonObject().get("itemSubject").getAsString());
//            JsonArray summary = summaryContents.get(i).getAsJsonObject().get("detailContentsArray").getAsJsonArray();
//            for(int j = 0; j < summary.size(); j++) {
//                JsonObject item = summary.get(j).getAsJsonObject();
//                int indentationLevel = item.get("indentationLevel").getAsInt();
//                String detailItemContents = XtrmCmmnUtil.recoverXSSConst(item.get("detailItemContents").getAsString());
//                if(indentationLevel == 0){
//                    // 최초 요소가 아니라면 이전까지 생성된 국가별 세부 내용을 replace한 뒤 초기화
//                    if(j > 0){
//                        sub1 = sub1.replace("${subContents}", sub2);
//                        sub2 = "";
//                    }
//                    // 0레벨 데이터일 경우 sub1 html을 새로 생성하여 제목 영역을 채움
//                    sub1 += htmlSub1.replace("${subSubject}", detailItemContents);
//                }else if(indentationLevel == 1){
//                    // 1레벨 데이터일 경우 이전 loop에서 생성된 html 내부에 sub2 템플릿을 적용,
//                    sub2 += htmlSub2.replace("${subContent}", detailItemContents);
//                }
//            }
//            // 루프 종료 후 마지막 요소 replace 처리
//            sub1 = sub1.replace("${subContents}", sub2);
//            htmlTotal = htmlTotal.replace("${summarySub" + idx + "}", sub1);
//            sub1 = "";
//            sub2 = "";
//        }
//
//		/**************** 요약 완료, 상세 시작 ****************/
//
//        // 변경
//        int idx = 1;
//		String subDetail = "";
//        String detailHtmlTotal = "";
//        for(int i = 0; i < detailContents.size(); i++){
//            JsonObject detail = detailContents.get(i).getAsJsonObject();
//            String detailHtml = detailSub1.replace("${detailSubTitle}", XtrmCmmnUtil.recoverXSSConst(detail.get("subSubject").getAsString()));
//            JsonArray detailArray = detail.get("detailContentsArray").getAsJsonArray();
//            String detailHtmlSub = "";
//            idx = 1;
//            for(int j = 0; j < detailArray.size(); j++){
//                JsonObject item = detailArray.get(j).getAsJsonObject();
//                int depth = item.get("indentationLevel").getAsInt();
//                String contents = XtrmCmmnUtil.recoverXSSConst(item.get("detailItemContents").getAsString());
//                if(depth == 0){
//                    // 최초 요소가 아니라면 이전까지 생성된 세부 내용을 replace한 뒤 초기화
//                    if(j > 0){
//                        detailHtml += detailHtmlSub.replace("${level1}", subDetail);
//                        detailHtmlSub = "";
//                        subDetail = "";
//                    }
//                    detailHtmlSub += level0Template.replace("${subSubject}", idx + ". " + contents);
//                    idx ++;
//                }else if(depth == 1){
//                    subDetail += level1Template.replace("${level1Contents}", contents);
//                }
//            }
//            // 마지막 요소 처리
//            detailHtml += detailHtmlSub.replace("${level2}", subDetail);
//            detailHtmlTotal += detailHtml.replace("${level3}", "");
//            detailHtmlSub = "";
//            subDetail = "";
//        }
//
//        htmlTotal = htmlTotal.replace("${detailSub}", detailHtmlTotal);
//
//        // 빈 값이어서 치환되지 않은 부분 공백으로 변환
//        htmlTotal = htmlTotal.replace("${subContent}", "")
//                             .replace("${subContents}", "")
//                             .replace("${subSubject}", "")
//                             .replace("${level1}", "")
//                             .replace("${level2}", "")
//                             .replace("${level3}", "")
//                             .replace("${detailSubTitle}", "")
//                             .replace("${level1Contents}", "")
//                             .replace("${level2Contents}", "")
//                             .replace("${level3Contents}", "");
//
//		return htmlTotal;
//	}
//
//    /**
//     * 요약리포트 내용 조회
//     * @param xtrmData
//     * @throws Exception
//     */
//    public ApiEnvelope selectReportSummaryContent(XtrmJSON xtrmData) throws Exception {
//        xtrmData.setString("analysisSectionCode","010"); // 요약코드
//        xtrmData.setInt("subSubjectSn",2);
//        xtrmData.setString("vocMailShortcutUrl", mobjXtrmConfig.getString("VOC_MAIL_SHORTCUT_URL"));
//        JsonArray summaryResult = mobjXtrmDao.selectJson("xs.batch.vob.dao.xml.VocReportMonthlyMapper", "selectReportContentsSummary", xtrmData).getDataJsonArray();
//        xtrmData.removeKey("subSubjectSn");
//        return groupReportContentsSummary(summaryResult);
//    }
//
//    /**
//     * PDF 본문 (상세리포트) 데이터 조회
//     * @param xtrmData
//     * @throws Exception
//     */
//    public ApiEnvelope selectReportDetailContent(XtrmJSON xtrmData) throws Exception {
//        xtrmData.setString("analysisSectionCode","020"); // 상세코드
//        JsonArray detailResult = mobjXtrmDao.selectJson("xs.batch.vob.dao.xml.VocReportMonthlyMapper", "selectReportContents", xtrmData).getDataJsonArray();
//        return groupReportContentsDetail(detailResult);
//    }
//
//    //****** 리포트 공통 관련  ************************************************************************//


}
