package xs.domain.cmmn.service;

import javax.servlet.http.HttpServletRequest;

import xs.core.dto.ApiEnvelope;

public interface CmmnService {

	ApiEnvelope getMenuKeyByPath(ApiEnvelope params) throws Exception;

	String getAesKey(String companyCode, String keyInfo) throws Exception;

	void setSolutionInfo(ApiEnvelope params) throws Exception;

	void setSolutionInfo(ApiEnvelope params, HttpServletRequest request) throws Exception;

}
