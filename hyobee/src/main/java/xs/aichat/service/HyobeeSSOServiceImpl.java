package xs.aichat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import xs.aichat.v2.exception.HyobeeException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.*;
import java.util.regex.Pattern;

import xs.aichat.dto.VobLoginResult;
import xs.aichat.v2.service.ChatUserResolver;
import xs.core.dto.ApiEnvelope;
import xs.core.property.XtrmProperty;
import xs.webbase.login.service.LoginService;

@Slf4j
@RequiredArgsConstructor
@Service
public class HyobeeSSOServiceImpl implements HyobeeSSOService {

	private static final Logger logger = LogManager.getLogger("xs.vob.aichat");

	private final XtrmProperty mobjXtrmConfig;

	private final LoginService loginService;

	private final ChatUserResolver chatUserResolver;

	/**
	 * JWKS(Json Web Key Set)를 저장하는 static 필드
	 * - 여러 사용자 요청에서 공용으로 사용 가능
	 * volatile : 멀티스레드 환경에서 초기화 경쟁 가능
	 *   -> loadJwks() 에 synchronized 추가
	 */
	private static volatile JsonNode jwks;

	/**
	 * 내부적으로 인증 결과를 담아 전달하기 위한 DTO 클래스
	 */
	private static class AuthContext {
		boolean isError = false;
		String errorMessage;
		Map<String, Object> attributes = new HashMap<>();
	}

	/**
	 * JWKS URI에서 공개키 목록을 로딩하는 메서드
	 *
	 * [개선 포인트]
	 * - static 필드 jwks에 실제 값을 할당하도록 수정
	 * - 예외 발생 시 명확한 로그 출력
	 */
	private synchronized void loadJwks() {
		InputStream is = null;
		try {
			log.info("SSO Auth JWKS URI loading start........");
			// 설정파일에서 jwks_uri 가져와 실제 호출
			is = new URL(jwksUri()).openStream();
			ObjectMapper objectMapper = new ObjectMapper();
			// 클래스 필드 jwks에 직접 저장
			jwks = objectMapper.readTree(is).get("keys");   // (this.jwks가 아닌 클래스 필드)
			log.info("SSO Auth JWKS URI loading end........");
		} catch (Exception e) {
			log.error("SSO Auth Config loading ERROR", e);
			throw new RuntimeException("SSO Auth Config IO exception", e);
		} finally {
			if (is != null) try { is.close(); } catch (Exception ignore) {}
		}
	}

	public void ssoLogin(HttpServletRequest request, HttpServletResponse response) throws IOException {
		var Adfs_Auth_Url = idpUrl()
				+ "?client_id=" + clientID()
				+ "&redirect_uri=" + acsUrl()
				+ "&response_mode=form_post"
				+ "&response_type=code+id_token"
				+ "&scope=openid+profile"
				+ "&nonce=" + UUID.randomUUID().toString();
		response.sendRedirect(Adfs_Auth_Url);
		logger.info("2. Response is committed: {}" ,response.isCommitted());

	}

	public VobLoginResult handleVobLogin(HttpServletRequest request, HttpServletResponse response) {
		var acceptLanguage = parseAcceptLanguage(request);

		try {
			/*
			  [수정사항 2]
			  processResponse에서 인증 결과를 AuthContext 객체로 반환받음 (Thread-safe)
			 */
			var authContext = processResponse(request);
			if (authContext.isError || authContext.attributes.isEmpty()) {
				logger.error("[SSO Login Fail] : {}", authContext.errorMessage);
				return createSsoFailResult(authContext.errorMessage, acceptLanguage);
			}

			// attr → Map 변환
			var attributes = authContext.attributes;

			// 로그 기록
			attributes.forEach((key, value) ->
					logger.info(" [{}  ] : {}", String.format("%-15s", key), value)
			);

			// Hyobee 전용 사용자 정보 조회
			var nullableUserId = Optional.ofNullable((String) authContext.attributes.get("samaccountname"));
			if (nullableUserId.isEmpty()) {
				logger.error("User ID not found in attributes: {}", authContext.attributes);
				return VobLoginResult.fail("로그인 정보 확인 중 오류가 발생했습니다.");
			}

			var userId = nullableUserId.get();
			chatUserResolver.requireById(userId);

			// Hyobee 전용 사용자 정보 조회 완료 후 Legacy 사용자 셋팅 로직 진행
			loginService.loginHyobeeSSO(convertAttrToJson(attributes), request, request.getSession(), acceptLanguage, response);
			return VobLoginResult.success();

		} catch (HyobeeException e) {
			logger.error("User validation failed during SSO process", e);
			return VobLoginResult.fail(e.getMessage());
		} catch (Exception e) {
			logger.error("Internal Error during SSO process", e);
			return VobLoginResult.fail("SSO 처리 중 내부 오류가 발생했습니다.");
		}
	}

	public AuthContext processResponse(HttpServletRequest request) {
		AuthContext ctx = new AuthContext();
		String id_Token = request.getParameter("id_token");

		if (id_Token == null || id_Token.isEmpty()) {
			ctx.isError = true;
			ctx.errorMessage = "id_token이 존재하지 않음";
			return ctx;
		}

		try {
			// JWT 구조 검증
			String[] parts = id_Token.split("\\.");
			if (parts.length != 3) {
				throw new RuntimeException("잘못된 JWT 형식");
			}

			logger.info("┃ [id_Token   ] : {}", id_Token);
			/**
			 * JWT Header에서 kid 추출
			 * - 어떤 공개키로 서명되었는지 식별하는 값
			 */
			String headerJson = new String(Base64.getUrlDecoder().decode(parts[0]));
			String kid = new ObjectMapper().readTree(headerJson).get("kid").asText();

			/**
			 * kid에 맞는 공개키 조회
			 */
			PublicKey publicKey = getPublicKeyByKid(kid);
			/**
			 * JWT 서명 검증 및 파싱
			 */
			Jws<Claims> claimJws = Jwts.parser()
					.verifyWith(publicKey)
					.clockSkewSeconds(60)
					.build()
					.parseSignedClaims(id_Token);
			logger.info("┃ [claimJws   ] : {}", claimJws.getPayload());

			// 검증 성공 시 사용자 속성 저장
			if (claimJws != null) {
				ctx.attributes = new HashMap<>(claimJws.getPayload());
			}
			logger.info("[attributes   ] : {}", ctx.attributes);
			logger.info("[claimJws   ] : {}", claimJws.getPayload().toString());
		}catch(ExpiredJwtException e){
			// 토큰 만료 케이스
			logger.info("[ExpiredJwtException   ] : {}" , e.getMessage());
			ctx.isError = true;
			ctx.errorMessage = "토큰 만료: " + e.getMessage();
		} catch(JwtException e) {
			// 서명 검증 실패 등 JWT 관련 오류
			logger.info("[JwtException   ] : {}" , e.getMessage());
			ctx.isError = true;
			ctx.errorMessage = "JWT 검증 실패: " + e.getMessage();
		} catch(Exception e) {
			// 기타 예외
			logger.info("[Exception   ] : {}" , e.getMessage());
			ctx.isError = true;
			ctx.errorMessage = "기타 예외: " + e.getMessage();
		}
		return ctx;
	}

	/**
	 * JWKS 목록에서 kid에 맞는 공개키를 찾아 반환
	 * [개선사항]
	 * - jwks가 null일 경우 재로딩 처리 추가
	 */
	public PublicKey getPublicKeyByKid(String kid) throws Exception {
		// jwks가 null이면 재로딩
		if (jwks == null) {
			loadJwks();
		}
		for (Iterator<JsonNode> it = jwks.elements(); it.hasNext(); ) {
			JsonNode key = it.next();
			if (key.get("kid").asText().equals(kid)) {
				// x5c 배열의 첫번째 값 사용
				String x5cStr = key.get("x5c").get(0).asText();
				byte[] decoded = Base64.getDecoder().decode(x5cStr);

				CertificateFactory cf = CertificateFactory.getInstance("X.509");
				X509Certificate cert = (X509Certificate) cf.generateCertificate(new java.io.ByteArrayInputStream(decoded));

				return cert.getPublicKey();
			}
		}
		// 키를 못 찾았을 경우 한 번 더 갱신 시도 (인증서 갱신 대응)
		loadJwks();
		throw new RuntimeException("JWKS에서 키를 찾을 수 없음: " + kid);
	}

	/* 인증 성공 여부 반환*/
//	public final boolean isAuthenticated()	{ return !this.IsError;	}
	/*에러 메시지 반환 */
//	public final String getErrorMessage() { return this.ErrorMessage; }
	/* JWT에서 추출한 사용자 속성 반환 */
//	public Map<String, Object> getAttributes() { return this.attributes; }
	/**
	 * 설정값 조회 메서드들
	 * - static 제거 후 인스턴스 메서드로 정상화
	 */
	private String idpUrl() {return mobjXtrmConfig.getString("chat_idp_url");}
	private String jwksUri() {return mobjXtrmConfig.getString("chat_jwks_uri");}
	private String clientID() {	return mobjXtrmConfig.getString("chat_idp_client_id");	}
	private String acsUrl() { return mobjXtrmConfig.getString("chat_sp_acs_url"); }


	/* ====================== 내부 공통 로직 =========================== */
	private ApiEnvelope convertAttrToJson(Map<String, Object> attr) {
		ApiEnvelope json = new ApiEnvelope();
		attr.forEach((k, v) -> json.setString(k, v.toString()));
		return json;
	}

	private VobLoginResult createSsoFailResult(String msg, String lang) {
		ApiEnvelope result = new ApiEnvelope();
		result.setResultHeader(true, msg, "SSO_AUTH");
		result.setString("ERROR_MSG_SUB", "Check");
		return VobLoginResult.fail(result);
	}

	//언어 파싱
	private String parseAcceptLanguage(HttpServletRequest request) {
		var lang = request.getHeader("Accept-Language");

		if (lang == null || lang.isEmpty()) return "en";

		var langPattern = Pattern.compile("^[a-zA-Z]{2,3}(-[a-zA-Z]{2,4})?$");
		var parts = lang.split(",");

		for (String part : parts) {
			var code = part.trim().split(";")[0];
			if (langPattern.matcher(code).matches()) {
				code = code.split("-")[0];
				if (Set.of("ko", "en", "zh", "vi").contains(code)) {
					return code;
				}
			}
		}
		return "en";
	}

}
