package xs.domain.certification.service;

import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Random;

import javax.annotation.Resource;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.commons.codec.binary.Base32;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import xs.core.extend.XtrmDefaultResource;
import xs.core.module.XtrmRestComponentWeb;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCryptoUtil;
import xs.domain.certification.enumeration.CertificationEnum;
import xs.domain.cmmn.service.CmmnService;
import xs.vob.management.dto.ComUser;

@Service
public class CertificationServiceImpl extends XtrmDefaultResource implements CertificationService {

	@Autowired
	CmmnService cmmnService;

	@Resource(name = "xtrmProperty")
	public XtrmProperty objXtrmConfig;

	@Autowired
	XtrmRestComponentWeb xtrmRestComponentWeb;

	@Override
	public ApiEnvelope createCertificationNumber(ApiEnvelope params) throws Exception {
		ApiEnvelope result = new ApiEnvelope();
		int lengthSize = params.getInt("DATA", "lengthSize", 0, 6);
		boolean isDuplication = params.getBoolean("DATA", "isDuplication", 0, true);
		String certificationNumber = createCertificationNumber(lengthSize, isDuplication);
		result.setString("certificationNumber", certificationNumber);
		return result;
	}

	@Override
	public String createCertificationNumber(int lengthSize, boolean isDuplication) {
		Random random = new Random();
		String certificationNumber = "";
		for (int i = 0; i < lengthSize; i++) {
			String randomNumber = Integer.toString(random.nextInt(10));
			if (isDuplication) {
				certificationNumber += randomNumber;
			} else if (!certificationNumber.contains(randomNumber)) {
				certificationNumber += randomNumber;
			} else {
				i -= 1;
			}
		}
		return certificationNumber;
	}

	@Override
	public ApiEnvelope sendCertificationNumber(ApiEnvelope params, ComUser user) throws Exception {
		ApiEnvelope result = new ApiEnvelope();
		int certificationErrRetryCnt = mobjXtrmConfig.getInt("CERTIFICATION_ERR_RETRY_CNT", 1);
		boolean certificationAvailable = mobjXtrmConfig.getBoolean("CERTIFICATION_AVAILABLE", true);
		String certiSender = mobjXtrmConfig.getString("CERTIFICATION_SENDER", "");
		String certificationType = params.getString("certificationType");

		if (certificationType.equalsIgnoreCase(CertificationEnum.CERTIFICATION_TYPE_EMAIL.getCode())) {
			params.setString("sendUrl", mobjXtrmConfig.getString("CERTIFICATION_EMAIL_URL"));
		} else if (certificationType.equalsIgnoreCase(CertificationEnum.CERTIFICATION_TYPE_SMS.getCode())) {
			params.setString("sendUrl", mobjXtrmConfig.getString("CERTIFICATION_SMS_URL"));
		}

		params.setString("certificationNumber", createCertificationNumber(6, true));
		params.setInt("expireTimeSec", mobjXtrmConfig.getInt("CERTIFICATION_EXPIRE_TIME_SECONDS", 180));

		if (!validationSendCertificationNumber(params, user, result)) {
			return result;
		}

		if (!certificationAvailable) {
			result.setString("certificationNumber", params.getString("certificationNumber"));
			result.setBoolean("certificationAvailable", certificationAvailable);
		} else {
			int errorCnt = 0;
			while (errorCnt <= certificationErrRetryCnt) {
				try {
					if (certificationType.equalsIgnoreCase(CertificationEnum.CERTIFICATION_TYPE_EMAIL.getCode())) {
						result = sendEmail(user.getEmail(), params.getString("certificationNumber"), certiSender);
					} else if (certificationType.equalsIgnoreCase(CertificationEnum.CERTIFICATION_TYPE_SMS.getCode())) {
						result = sendSms(user.getMobilePhone(), params.getString("certificationNumber"), certiSender);
					}
					break;
				} catch (Exception exception) {
					Thread.sleep(1000);
					errorCnt++;
				}
			}
		}
		return result;
	}

	private boolean validationSendCertificationNumber(ApiEnvelope params, ComUser user, ApiEnvelope result)
			throws Exception {
		if (user == null || user.getUserId() == null || "".equals(user.getUserId())) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_EMPTY.getCodeName(),
					CertificationEnum.CERTIFICATION_EMPTY.getCode());
			return false;
		}
		if (params.getString("sendUrl").equals("")) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_URL_NO.getCodeName(),
					CertificationEnum.CERTIFICATION_URL_NO.getCode());
			return false;
		}
		if (params.getString("certificationNumber").equals("")) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_EMPTY.getCodeName(),
					CertificationEnum.CERTIFICATION_EMPTY.getCode());
			return false;
		}
		return true;
	}

	private ApiEnvelope sendEmail(String emailAddress, String certificationNumber, String sender) {
		String sendUrl = mobjXtrmConfig.getString("CERTIFICATION_EMAIL_URL");
		ApiEnvelope params = new ApiEnvelope();
		params.setString("subject", "[" + sender + "] " + CertificationEnum.CERTIFICATION_INFO_001.getCodeName());
		params.setString("text", "[" + sender + "] " + CertificationEnum.CERTIFICATION_INFO_001.getCodeName()
				+ "는 [" + certificationNumber + "] " + CertificationEnum.CERTIFICATION_INFO_002.getCodeName());
		params.setString("refrnSeq", XtrmCmmnUtil.getUUID());
		params.setString("toAdres", emailAddress);
		params.setString("toCc", emailAddress);
		params.setString("toBcc", emailAddress);
		params.setString("svcNm", mobjXtrmConfig.getString("CERTIFICATION_EMAIL_SERVICE"));
		return xtrmRestComponentWeb.requestApiEnvelope(sendUrl, HttpMethod.POST, "application", "json",
				"UTF-8", params, null);
	}

	private ApiEnvelope sendSms(String mobilePhoneNumber, String certificationNumber, String sender) {
		String sendUrl = mobjXtrmConfig.getString("CERTIFICATION_SMS_URL");
		Date today = new Date();
		Locale currentLocale = new Locale("KOREAN", "KOREA");
		String pattern = "yyyyMMddHHmmss";
		SimpleDateFormat formatter = new SimpleDateFormat(pattern, currentLocale);
		String currentTime = formatter.format(today);
		ApiEnvelope params = new ApiEnvelope();
		params.setString("USER_ID", mobjXtrmConfig.getString("CERTIFICATION_SMS_CDR"));
		params.setString("SUBJECT", "[" + sender + "] " + CertificationEnum.CERTIFICATION_INFO_001.getCodeName());
		params.setString("SMS_MSG", "[" + sender + "] " + CertificationEnum.CERTIFICATION_INFO_001.getCodeName()
				+ "는 [" + certificationNumber + "] " + CertificationEnum.CERTIFICATION_INFO_002.getCodeName());
		params.setString("NOW_DATE", currentTime);
		params.setString("SEND_DATE", currentTime);
		params.setString("SCHEDULE_TYPE", mobjXtrmConfig.getString("CERTIFICATION_SMS_SCHEDULE"));
		params.setString("CALLBACK", mobjXtrmConfig.getString("CERTIFICATION_SMS_CALLBACK"));
		params.setString("DEST_INFO", mobilePhoneNumber);
		params.setString("CDR_ID", mobjXtrmConfig.getString("CERTIFICATION_SMS_CDR"));
		params.setString("RESERVED1", currentTime);
		params.setString("RESERVED2", "[" + sender + "] 본인확인 인증번호");
		return xtrmRestComponentWeb.requestApiEnvelope(sendUrl, HttpMethod.POST, "application", "json",
				"UTF-8", params, null);
	}

	@Override
	public boolean validationCertificationNumber(ApiEnvelope params, ComUser user, ApiEnvelope result)
			throws Exception {
		int failMaxCnt = mobjXtrmConfig.getInt("CERTIFICATION_FAIL_MAX_COUNT", 5);
		String certificationNumber = params.getString("certificationNumber");
		if (certificationNumber.equals("")) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_EMPTY.getCodeName(),
					CertificationEnum.CERTIFICATION_EMPTY.getCode());
			return false;
		}

		ApiEnvelope certificationInfo = ApiEnvelopes.selectJson(mobjXtrmDao,
				"xs.domain.certification.CertificationMapper", "selectUserCertification", params);

		if (certificationInfo.getCount() == 0) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_INFO_EMPTY.getCodeName(),
					CertificationEnum.CERTIFICATION_INFO_EMPTY.getCode());
			return false;
		}

		if (certificationInfo.getInt("certificationFailureCount") >= failMaxCnt) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_CONFIRM_FAIL_COUNT.getCodeName(),
					CertificationEnum.CERTIFICATION_CONFIRM_FAIL_COUNT.getCode());
			return false;
		}

		if ("Y".equals(certificationInfo.getString("certificationEndDtAt"))) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_EXPIRE_TIME.getCodeName(),
					CertificationEnum.CERTIFICATION_EXPIRE_TIME.getCode());
			return false;
		}

		if (!certificationNumber.equals(certificationInfo.getString("certificationNumber"))) {
			String errorMsg = CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCodeName() + "<br />"
					+ CertificationEnum.CERTIFICATION_INFO_003.getCodeName() + " : "
					+ (certificationInfo.getInt("certificationFailureCount") + 1);
			result.setResultHeader(true, errorMsg, CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCode());
			updateCertificationFailCountAdd(params);
			return false;
		}

		return true;
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public int updateOtpFailCountAdd(ApiEnvelope params) throws Exception {
		params.setBoolean("isOtpFailureCount", true);
		return ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper",
				"updateUserCertificationFailCount", params);
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public int updateOtpFailCountInit(ApiEnvelope params) throws Exception {
		params.setBoolean("isOtpFailureCount", false);
		return ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper",
				"updateUserCertificationFailCount", params);
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public int updateCertificationFailCountAdd(ApiEnvelope params) throws Exception {
		params.setBoolean("isCertificationFailureCount", true);
		return ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper",
				"updateUserCertificationFailCount", params);
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public int updateCertificationFailCountInit(ApiEnvelope params) throws Exception {
		params.setBoolean("isCertificationFailureCount", false);
		return ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper",
				"updateUserCertificationFailCount", params);
	}

	@Override
	public boolean validationCreateOTPKey(ApiEnvelope params, ApiEnvelope result) throws Exception {
		ApiEnvelope userCertification = ApiEnvelopes.selectJson(mobjXtrmDao,
				"xs.domain.certification.CertificationMapper", "selectUserCertification", params);
		String otpKey = userCertification.getString("otpKey");

		if (params.getBoolean("isNew")) {
			if (!otpKey.equals("")) {
				result.setResultHeader(true, CertificationEnum.CERTIFICATION_EXIST_OTP.getCodeName(),
						CertificationEnum.CERTIFICATION_EXIST_OTP.getCode());
				return false;
			}
		} else {
			int failMaxCnt = mobjXtrmConfig.getInt("CERTIFICATION_FAIL_MAX_COUNT", 5);
			if (otpKey.equals("")) {
				result.setResultHeader(true, CertificationEnum.CERTIFICATION_NO_EXIST_OTP.getCodeName(),
						CertificationEnum.CERTIFICATION_NO_EXIST_OTP.getCode());
				return false;
			}
			if (failMaxCnt < userCertification.getInt("otpFailureCount")) {
				result.setResultHeader(true, CertificationEnum.CERTIFICATION_FAIL_MAX_COUNT.getCodeName(),
						CertificationEnum.CERTIFICATION_FAIL_MAX_COUNT.getCode());
				return false;
			}
			if (!checkOTPCode(otpKey, params.getLong("otpCode", 0, 0), (new Date().getTime()) / 30000)) {
				result.setResultHeader(true, CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCodeName(),
						CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCode());
				updateOtpFailCountAdd(params);
				return false;
			}
		}
		return true;
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public boolean validationOTPCode(ApiEnvelope params, ApiEnvelope result) throws Exception {
		ApiEnvelope userCertification = ApiEnvelopes.selectJson(mobjXtrmDao,
				"xs.domain.certification.CertificationMapper", "selectUserCertification", params);
		String otpKey = userCertification.getString("otpKey");

		if ("".equals(otpKey)) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_NO_EXIST_OTP.getCodeName(),
					CertificationEnum.CERTIFICATION_NO_EXIST_OTP.getCode());
			return false;
		}

		int failMaxCnt = mobjXtrmConfig.getInt("CERTIFICATION_FAIL_MAX_COUNT", 5);
		if (failMaxCnt < userCertification.getInt("otpFailureCount")) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_FAIL_MAX_COUNT.getCodeName(),
					CertificationEnum.CERTIFICATION_FAIL_MAX_COUNT.getCode());
			return false;
		}

		boolean isValid = checkOTPCode(otpKey, params.getLong("otpCode", 0, 0), (new Date().getTime()) / 30000);
		if (!isValid) {
			result.setResultHeader(true, CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCodeName(),
					CertificationEnum.CERTIFICATION_NOT_MATCH_CODE.getCode());
			updateOtpFailCountAdd(params);
		} else {
			updateOtpFailCountInit(params);
		}
		return isValid;
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public String updateOTPKey(ApiEnvelope params) throws Exception {
		Base32 base32 = new Base32();
		String otpKey = "";
		while (true) {
			otpKey = base32.encodeToString(XtrmCryptoUtil.generateAESKey(256)).toString().substring(0, 16);
			params.setString("otpKey", otpKey);
			ApiEnvelope dupCnt = ApiEnvelopes.selectJson(mobjXtrmDao,
					"xs.domain.certification.CertificationMapper", "selectUserOtpKeyMatching", params);
			if (dupCnt.getCount() == 0) {
				break;
			}
		}
		params.setString("otpKey", otpKey);
		ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper", "mergeUserCertificationOtpKey",
				params);
		return otpKey;
	}

	@Transactional(rollbackFor = { Exception.class, SQLException.class }, propagation = Propagation.REQUIRES_NEW, readOnly = false)
	@Override
	public int updateCertificationNumber(ApiEnvelope params) throws Exception {
		return ApiEnvelopes.update(mobjXtrmDao, "xs.domain.certification.CertificationMapper",
				"mergeUserCertificationNumber", params);
	}

	private boolean checkOTPCode(String secret, long code, long t) throws Exception {
		Base32 codec = new Base32();
		byte[] decodedKey = codec.decode(secret);
		int window = 3;
		for (int i = -window; i <= window; ++i) {
			long hash = verifyOTPCode(decodedKey, t + i);
			if (hash == code) {
				return true;
			}
		}
		return false;
	}

	private int verifyOTPCode(byte[] key, long t) throws Exception {
		byte[] data = new byte[8];
		long value = t;
		for (int i = 8; i-- > 0; value >>>= 8) {
			data[i] = (byte) value;
		}

		SecretKeySpec signKey = new SecretKeySpec(key, "HmacSHA1");
		Mac mac = Mac.getInstance("HmacSHA1");
		mac.init(signKey);
		byte[] hash = mac.doFinal(data);
		int offset = hash[20 - 1] & 0xF;

		long truncatedHash = 0;
		for (int i = 0; i < 4; ++i) {
			truncatedHash <<= 8;
			truncatedHash |= (hash[offset + i] & 0xFF);
		}
		truncatedHash &= 0x7FFFFFFF;
		truncatedHash %= 1000000;

		return (int) truncatedHash;
	}
}
