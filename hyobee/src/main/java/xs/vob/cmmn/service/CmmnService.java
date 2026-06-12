package xs.vob.cmmn.service;

import java.util.List;
import java.util.Map;

import xs.core.database.XtrmDAOWeb;
import xs.core.dto.ApiEnvelope;
import xs.vob.management.dto.ComMessage;
import xs.vob.management.dto.ComUser;
import xs.vob.management.dto.ComUserPasswordHistory;

public interface CmmnService {

	ApiEnvelope selectSysCodeDetailData(ApiEnvelope params) throws Exception;

	ApiEnvelope selectUserMenuData(ApiEnvelope params) throws Exception;

	ApiEnvelope selectCompanyByKey(ApiEnvelope params) throws Exception;

	ApiEnvelope changeUserPassword(ApiEnvelope params, XtrmDAOWeb dao) throws Exception;

	ApiEnvelope changeUserPasswordOTP(ApiEnvelope params, XtrmDAOWeb dao) throws Exception;

	int updateUser(ComUser user, XtrmDAOWeb dao) throws Exception;

	int updateUser(ApiEnvelope params, XtrmDAOWeb dao) throws Exception;

	ComUser selectUserBase(String companyCode, String userId, String languageCode) throws Exception;

	boolean validationUserPassword(String passwordEncptClient, String passwordEncptDb, String encptKeyInfo)
			throws Exception;

	ApiEnvelope createPassword(String companyCode, String passwordEncpt) throws Exception;

	List<ComUserPasswordHistory> getUserPasswordHist(String companyCode, String userId) throws Exception;

	int insertUserPasswordHist(String companyCode, String userId, String passwordEncpt, String encptKeyInfo,
			XtrmDAOWeb dao) throws Exception;

	int memoryMessageDataUpdate(ApiEnvelope params, String txFlag) throws Exception;

	String getAesKey(String companyCode, String keyInfo) throws Exception;

	int increaseWrongPasswordCount(String companyCode, String userId, int wrongPasswordCount, XtrmDAOWeb dao)
			throws Exception;

	void setInitMessageData(Map<String, List<ComMessage>> messageData);

	ComUser selectUserForLogin(String companyCode, String userId) throws Exception;

	ComUser selectUserForLogin(String companyCode, String userId, String languageCode) throws Exception;

}
