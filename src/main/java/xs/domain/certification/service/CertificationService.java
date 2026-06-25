package xs.domain.certification.service;

import xs.core.dto.ApiEnvelope;
import xs.vob.management.dto.ComUser;

public interface CertificationService {

	ApiEnvelope createCertificationNumber(ApiEnvelope params) throws Exception;

	String createCertificationNumber(int lengthSize, boolean isDuplication) throws Exception;

	ApiEnvelope sendCertificationNumber(ApiEnvelope params, ComUser user) throws Exception;

	boolean validationCertificationNumber(ApiEnvelope params, ComUser user, ApiEnvelope result) throws Exception;

	boolean validationCreateOTPKey(ApiEnvelope params, ApiEnvelope result) throws Exception;

	boolean validationOTPCode(ApiEnvelope params, ApiEnvelope result) throws Exception;

	int updateOtpFailCountAdd(ApiEnvelope params) throws Exception;

	int updateOtpFailCountInit(ApiEnvelope params) throws Exception;

	int updateCertificationFailCountAdd(ApiEnvelope params) throws Exception;

	int updateCertificationFailCountInit(ApiEnvelope params) throws Exception;

	String updateOTPKey(ApiEnvelope params) throws Exception;

	int updateCertificationNumber(ApiEnvelope params) throws Exception;

}
