package xs.aichat.v2.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xs.aichat.controller.dto.AichatEncryptedLoginRequest;
import xs.aichat.v2.dto.LoginUserCredentials;
import xs.aichat.v2.exception.AichatLoginException;
import xs.aichat.v2.mapper.UserMapper;
import xs.core.database.XtrmDAOWeb;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCryptoUtil;
import xs.vob.cmmn.service.CmmnService;
import xs.vob.enumeration.MainEnum;
import xs.vob.management.dto.ComUser;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * UserMapper 기반 id/비밀번호(OTP 복호화 후) 로그인.
 * 비밀번호 검증·계정 잠금 등은 {@link CmmnService} 레거시 정책을 참고한다.
 */
@Service
@RequiredArgsConstructor
public class AichatUserLoginService {

    private static final String SESSION_ENCRYPT_KEY = "ENCRYPT_KEY";

    private final UserMapper userMapper;
    private final CmmnService cmmnService;
    private final XtrmDAOWeb xtrmDao;
    private final XtrmProperty xtrmConfig;

    public String createOtpEncryptKey(HttpSession session) throws Exception {
        String encryptKey = Base64.encodeBase64String(XtrmCryptoUtil.generateAESKey(256));
        encryptKey = encryptKey.substring(0, 32);
        session.setAttribute(SESSION_ENCRYPT_KEY, encryptKey);
        return encryptKey;
    }

    public LoginUserCredentials loginWithEncryptedFields(
            AichatEncryptedLoginRequest request,
            HttpSession session,
            HttpServletRequest httpRequest
    ) throws Exception {
        DecryptedLogin decrypted = decryptLoginFields(request, session);
        LoginUserCredentials credentials = validatePassword(
                decrypted.companyCode(),
                decrypted.userId(),
                decrypted.passwordHash(),
                httpRequest
        );
        establishChatSession(session, credentials, decrypted.languageCode());
        return credentials;
    }

    /**
     * webbase {@code loginBase.json} — 복호화된 비밀번호(SHA256) 검증만 UserMapper 경로로 수행.
     */
    public LoginUserCredentials validateDecryptedPassword(
            String companyCode,
            String userId,
            String decryptedPasswordHash
    ) throws Exception {
        return validatePassword(companyCode, userId, decryptedPasswordHash, null);
    }

    private DecryptedLogin decryptLoginFields(AichatEncryptedLoginRequest request, HttpSession session)
            throws Exception {
        if (session == null) {
            throw loginError(MainEnum.LOGIN_ENF);
        }

        String encryptKey = (String) session.getAttribute(SESSION_ENCRYPT_KEY);
        session.removeAttribute(SESSION_ENCRYPT_KEY);
        if (!StringUtils.hasText(encryptKey)) {
            throw loginError(MainEnum.LOGIN_ENF);
        }

        String companyCodeEncrypt = normalizeCipher(request.getCompanyCodeEncrypt());
        String userIdEncrypt = normalizeCipher(request.getUserIdEncrypt());
        String passwordEncrypt = normalizeCipher(request.getPasswordEncrypt());
        if (!StringUtils.hasText(companyCodeEncrypt)
                || !StringUtils.hasText(userIdEncrypt)
                || !StringUtils.hasText(passwordEncrypt)) {
            throw loginError(MainEnum.LOGIN_EMPTY);
        }

        String companyCode = XtrmCryptoUtil.decryptAES(companyCodeEncrypt, encryptKey);
        String userId = XtrmCryptoUtil.decryptAES(userIdEncrypt, encryptKey);
        String passwordHash = XtrmCryptoUtil.decryptAES(passwordEncrypt, encryptKey);
        String languageCode = StringUtils.hasText(request.getLanguageCode())
                ? request.getLanguageCode()
                : "ko";

        return new DecryptedLogin(companyCode, userId, passwordHash, languageCode);
    }

    private LoginUserCredentials validatePassword(
            String companyCode,
            String userId,
            String decryptedPasswordHash,
            HttpServletRequest httpRequest
    ) throws Exception {
        LoginUserCredentials credentials = userMapper.findLoginCredentials(companyCode, userId);
        if (credentials == null || !StringUtils.hasText(credentials.getUserId())) {
            throw loginError(MainEnum.PASSWORD_CHANGE_ERROR02);
        }

        int limitPasswordFailCount = xtrmConfig.getInt("LIMIT_PASSWORD_FAIL_COUNT", 5);
        int passwordErrorCount = XtrmCmmnUtil.convertInteger(credentials.getPasswordErrorCount(), 0);

        boolean isMaster = xtrmConfig.getBoolean("MASTER_LOGIN_AVAILABLE", false)
                && decryptedPasswordHash.equals(xtrmConfig.getString("MASTER_LOGIN_PASSWORD_ENCPT"));

        if (!"Y".equals(credentials.getAccountUseAt()) && passwordErrorCount > limitPasswordFailCount) {
            throw loginError(MainEnum.LOGIN_PFO);
        }

        if (!"Y".equals(credentials.getAccountUseAt())) {
            throw loginError(MainEnum.LOGIN_UTL);
        }

        if (!cmmnService.validationUserPassword(
                decryptedPasswordHash,
                credentials.getPasswordEncpt(),
                credentials.getEncptKeyInfo()
        ) && !isMaster) {
            try {
                cmmnService.increaseWrongPasswordCount(companyCode, userId, passwordErrorCount, xtrmDao);
            } catch (Exception ignored) {
                // 레거시와 동일하게 실패 카운트 갱신 실패는 로그인 거부만 유지
            }
            throw loginError(MainEnum.LOGIN_NMP);
        }

        if ("Y".equals(credentials.getIsLockAccount())) {
            throw loginError(MainEnum.LOGIN_LNL);
        }

        try {
            if (cmmnService.validationUserPassword(
                    XtrmCryptoUtil.encryptSHA256(credentials.getUserId(), ""),
                    credentials.getPasswordEncpt(),
                    credentials.getEncptKeyInfo()
            )) {
                throw loginError(MainEnum.LOGIN_EUP);
            }
        } catch (AichatLoginException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new AichatLoginException(
                    HttpStatus.BAD_REQUEST,
                    MainEnum.LOGIN_NMP.getCode(),
                    MainEnum.LOGIN_NMP.getCodeName(),
                    MainEnum.LOGIN_NMP.getCode()
            );
        }

        if (credentials.getRecentPasswordChangeDate() != null
                && XtrmCmmnUtil.getDateDiff(
                        XtrmCmmnUtil.getFormatDateTime(credentials.getRecentPasswordChangeDate()),
                        XtrmCmmnUtil.getFormatDateTime(),
                        "M"
                ) >= 6) {
            throw loginError(MainEnum.LOGIN_EPW);
        }

        return credentials;
    }

    public void establishChatSession(HttpSession session, LoginUserCredentials credentials, String languageCode) {
        if (session == null || credentials == null) {
            return;
        }
        session.setAttribute("USER_ID", credentials.getUserId());
        session.setAttribute("COMPANY_CODE", credentials.getCompanyCode());
        session.setAttribute("USER_NAME", credentials.getUserName());
        session.setAttribute("PG_CODE", credentials.getPgCode());
        session.setAttribute("PU_CODE", credentials.getPuCode());
        session.setAttribute("CORP_CODE", credentials.getCorpCode());
        session.setAttribute("GBIS_CORP_CODE", credentials.getCorpCode());
        session.setAttribute("DEPT_CODE", firstNonBlank(credentials.getTeamCode(), credentials.getDeptCode()));
        session.setAttribute("DEPT_NAME", credentials.getTeamName());
        session.setAttribute("LANGUAGE_CODE", StringUtils.hasText(languageCode) ? languageCode : "ko");
        enrichSessionDisplayProfile(session);
    }

    /**
     * selectUserBase 기준으로 세션 표시명(이름·직위·부서)을 갱신한다.
     * loginBase·aichat /login 경로는 establishChatSession만으로 USER_NAME·직위가 비는 경우가 있어 보강한다.
     */
    public void enrichSessionDisplayProfile(HttpSession session) {
        if (session == null || session.getAttribute("USER_ID") == null || session.getAttribute("COMPANY_CODE") == null) {
            return;
        }
        String userId = session.getAttribute("USER_ID").toString();
        String companyCode = session.getAttribute("COMPANY_CODE").toString();
        Object langAttr = session.getAttribute("LANGUAGE_CODE");
        String languageCode = langAttr == null || !StringUtils.hasText(langAttr.toString()) ? "ko" : langAttr.toString();
        try {
            ComUser user = cmmnService.selectUserBase(companyCode, userId, languageCode);
            if (user == null || user.getUserId() == null || "".equals(user.getUserId())) {
                return;
            }
            session.setAttribute("COMPANY_NAME", XtrmCmmnUtil.convertString(user.getCompanyName(), ""));
            session.setAttribute("CORP_NAME", XtrmCmmnUtil.convertString(user.getCorpName(), ""));
            session.setAttribute("OFFICIAL_POSITION_NAME", XtrmCmmnUtil.convertString(user.getOfficialPositionName(), ""));
            session.setAttribute("USER_NAME", XtrmCmmnUtil.convertString(user.getUserName(), ""));
            session.setAttribute("DEPT_NAME", XtrmCmmnUtil.convertString(user.getDeptName(), ""));
            session.setAttribute("FULL_DEPT_NAME", XtrmCmmnUtil.convertString(user.getFullDeptName(), ""));
        } catch (Exception ignored) {
            // 로그인·페이지 진입은 표시명 보강 실패만으로 막지 않는다.
        }
    }

    private static String normalizeCipher(String value) {
        return value == null ? "" : value.replace(" ", "+");
    }

    private static String firstNonBlank(String primary, String fallback) {
        if (StringUtils.hasText(primary)) {
            return primary;
        }
        return fallback == null ? "" : fallback;
    }

    private static AichatLoginException loginError(MainEnum mainEnum) {
        return new AichatLoginException(
                HttpStatus.UNAUTHORIZED,
                mainEnum.getCode(),
                mainEnum.getCodeName(),
                mainEnum.getCode()
        );
    }

    @lombok.Value
    @lombok.experimental.Accessors(fluent = true)
    private static class DecryptedLogin {
        String companyCode;
        String userId;
        String passwordHash;
        String languageCode;
    }
}
