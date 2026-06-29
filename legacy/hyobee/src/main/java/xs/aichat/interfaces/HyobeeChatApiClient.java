package xs.aichat.interfaces;

import com.fasterxml.jackson.core.type.TypeReference;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.springframework.http.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import xs.aichat.dto.ChatLogParam;
import xs.aichat.v2.service.ChatLogService;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.dto.external.wrtn.error.ApiErrorResponse;
import xs.aichat.v2.exception.ExternalApiException;
import xs.aichat.v2.dto.external.wrtn.error.UpstreamErrorMapper;
import xs.core.property.XtrmProperty;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.aichat.v2.util.JwtSessionHelper;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.UUID;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.config.SocketConfig;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.impl.client.HttpClientBuilder;


import javax.net.ssl.*;
import javax.servlet.http.HttpServletRequest;
import java.security.cert.X509Certificate;
import javax.net.ssl.SSLContext;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.ssl.SSLContextBuilder;

@Slf4j
@Component
@SuppressWarnings("unchecked")
public class HyobeeChatApiClient {

	private final JsonAdapter jsonAdapter;

    private final XtrmProperty xtrmConfig;

    private final ChatLogService chatLogService;

	private final HyobeeJwtTokenService hyobeeJwtTokenService;

	private final Executor blockingIoExecutor;

	private final WebClient wrtnWebClient;

    private RestTemplate restTemplate;

	private CloseableHttpClient closeableHttpClient;

	@Getter
	private String url;

	@Getter
    private String serviceMode;

	public HyobeeChatApiClient(JsonAdapter jsonAdapter, XtrmProperty xtrmConfig, ChatLogService chatLogService,
			HyobeeJwtTokenService hyobeeJwtTokenService,
			@Qualifier("blockingIoExecutor") Executor blockingIoExecutor, WebClient wrtnWebClient) {
		this.jsonAdapter = jsonAdapter;
		this.xtrmConfig = xtrmConfig;
		this.chatLogService = chatLogService;
		this.hyobeeJwtTokenService = hyobeeJwtTokenService;
		this.blockingIoExecutor = blockingIoExecutor;
		this.wrtnWebClient = wrtnWebClient;
	}

	@PostConstruct
	public void init() {
		this.url = xtrmConfig.getString("WRTN_BASEURL");
		this.serviceMode = xtrmConfig.getString("SERVICE_MODE");
		boolean trustAllSsl = "LOCAL".equalsIgnoreCase(this.serviceMode);
		this.restTemplate = createPooledRestTemplate(trustAllSsl);
	}

	@PreDestroy
	public void destroy() throws Exception {
		if (closeableHttpClient != null) {
			closeableHttpClient.close();
		}
	}

	// ????? ??result.put("error", ...) ??aichat ??????????
	public Map<String, Object> callApi(String callApiUrl, HttpMethod method,
									   Map<String, String> headers, Map<String, Object> params) {
		return executeCallApi(callApiUrl, method, headers, params, false);
	}

	// v2: ??? ???????ExternalApiException ????
	public Map<String, Object> callApiOrThrow(String callApiUrl, HttpMethod method,
											  Map<String, String> headers, Map<String, Object> params) {
		return executeCallApi(callApiUrl, method, headers, params, true);
	}

	public Map<String, Object> callApiOrThrow(String callApiUrl, HttpMethod method,
											  Map<String, String> headers, Object params) {
		return executeCallApi(callApiUrl, method, headers, jsonAdapter.toMap(params), true, false);
	}

	/** sidebar ?? ????? ??(JWT_TEAM_CODE) ??? JWT??WRTN ???? */
	public Map<String, Object> callApiOrThrowWithViewableTeam(String callApiUrl, HttpMethod method,
															  Map<String, String> headers, Object params) {
		return executeCallApi(callApiUrl, method, headers, jsonAdapter.toMap(params), true, true);
	}

	private Map<String, Object> executeCallApi(String callApiUrl, HttpMethod method,
			Map<String, String> headers, Map<String, Object> params, boolean strictUpstream) {
		return executeCallApi(callApiUrl, method, headers, params, strictUpstream, false);
	}

	private Map<String, Object> executeCallApi(String callApiUrl, HttpMethod method,
			Map<String, String> headers, Map<String, Object> params, boolean strictUpstream,
			boolean useViewableTeamAuth) {
		return CompletableFuture.supplyAsync(
				() -> doExecuteCallApi(callApiUrl, method, headers, params, strictUpstream, useViewableTeamAuth),
				blockingIoExecutor).join();
	}

	private Map<String, Object> doExecuteCallApi(String callApiUrl, HttpMethod method,
			Map<String, String> headers, Map<String, Object> params, boolean strictUpstream,
			boolean useViewableTeamAuth) {
		// ============ 1. ????? ???? ?? ============
		Timestamp requestDt = new Timestamp(System.currentTimeMillis());
		long startTime = System.currentTimeMillis();

		// ============ 2. Request ??? ????============
		HttpHeaders httpHeaders = new HttpHeaders();
		if (headers != null) {
			headers.forEach(httpHeaders::set);
		}
		// ??? ????: ???? ???? ????
		httpHeaders.set("Accept-Encoding", "deflate, br");

		// Authorization ???? ???? (??: ?????DEPT_CODE, viewableTeam: sidebar ?? JWT_TEAM_CODE)
		if (useViewableTeamAuth) {
			injectStreamAuthorizationHeader(httpHeaders);
		} else {
			injectAuthorizationHeader(httpHeaders);
		}

		String finalUrl = this.url + callApiUrl;
		String queryString = null;

		// GET ??????? ???
        String userId = extractUserId(params);
		if (HttpMethod.GET.equals(method) && params != null && !params.isEmpty()) {
			StringBuilder urlBuilder = new StringBuilder(finalUrl);
			urlBuilder.append("?");
			StringBuilder queryBuilder = new StringBuilder();
			for (Map.Entry<String, Object> entry : params.entrySet()) {
//                String encodedKey = URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8);
//                String encodedValue = URLEncoder.encode(String.valueOf(entry.getValue()), StandardCharsets.UTF_8);
//                urlBuilder.append(encodedKey).append("=").append(encodedValue).append("&");
//                queryBuilder.append(encodedKey).append("=").append(encodedValue).append("&");
				String key = entry.getKey();
				String value = String.valueOf(entry.getValue());

				// ????? ??????????? ????????%2C??????? ?????????? (???? API ?????????)
				String encodedValue = value;
				// TODO: ???? ?????????? ????? ????? ????? ??? ?????
//				String encodedValue = URLEncoder.encode(value, StandardCharsets.UTF_8)
//						.replace("%2C", ",");

				urlBuilder.append(key).append("=").append(encodedValue).append("&");
				queryBuilder.append(key).append("=").append(encodedValue).append("&");
            }
			finalUrl = urlBuilder.substring(0, urlBuilder.length() - 1);
			queryString = queryBuilder.substring(0, queryBuilder.length() - 1);
			params = null;
		}

		HttpEntity<?> requestEntity;
		String requestBodyStr = null;
		if (params != null && !HttpMethod.GET.equals(method)) {
			httpHeaders.setContentType(MediaType.APPLICATION_JSON);
			requestBodyStr = jsonAdapter.toJson(params);
			requestEntity = new HttpEntity<>(requestBodyStr, httpHeaders);
//			log.info("[API ???] URL: {}\nMethod: {}\nHeaders: {}\nBody: {}", finalUrl, method, httpHeaders, requestBodyStr);
		} else {
			requestEntity = new HttpEntity<>(httpHeaders);
//			log.info("[API ???] URL: {}\nMethod: {}\nHeaders: {}", finalUrl, method, httpHeaders);
		}

		// ============ 3. API ???? & ??? ????????============
		// Request ?????ChatLogParam Builder ?????
		String logKey = UUID.randomUUID().toString();
		ChatLogParam.ChatLogParamBuilder chatLogBuilder = ChatLogParam.builder()
                .companyCode(xtrmConfig.getString("COMPANY_CODE", "1000"))
                .logKey(logKey)
                .vendor("WRTN")
				.httpMethod(method.name())
				.apiPath(callApiUrl)
				.apiBaseUrl(this.url)
				.apiFullUrl(finalUrl)
				.requestDt(requestDt.toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
				.requestHeader(jsonAdapter.toJson(httpHeaders))
				.requestQueryString(queryString)
				.requestBody(requestBodyStr)
                .firstCreateUserId(userId);

		Map<String, Object> result = null;
		ChatLogParam logParam = null;  // finally ???????? ???????? ????? ?????????? ?????? ?????

		try {
			// ============ ???? API ???? ============
			ResponseEntity<String> response = restTemplate.exchange(
					finalUrl,
					method,
					requestEntity,
					String.class
			);

			long responseTime = System.currentTimeMillis() - startTime;
			Timestamp responseDt = new Timestamp(System.currentTimeMillis());
			String responseBody = response.getBody();

			// Response ?????ChatLogParam ????? (??? ???????)
			ChatLogParam baseParam = chatLogBuilder.build();
			logParam = ChatLogParam.successBuilder()
					.companyCode(baseParam.getCompanyCode())
					.logKey(baseParam.getLogKey())
					.vendor(baseParam.getVendor())
					.httpMethod(baseParam.getHttpMethod())
					.apiPath(baseParam.getApiPath())
					.apiBaseUrl(baseParam.getApiBaseUrl())
					.apiFullUrl(baseParam.getApiFullUrl())
					.requestDt(baseParam.getRequestDt())
					.requestHeader(baseParam.getRequestHeader())
					.requestQueryString(baseParam.getRequestQueryString())
					.requestBody(baseParam.getRequestBody())
					.firstCreateUserId(baseParam.getFirstCreateUserId())
					.responseDt(responseDt.toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
					.responseStatusCode(String.valueOf(response.getStatusCodeValue()))
					.responseHeader(jsonAdapter.toJson(response.getHeaders()))
					.responseBody(responseBody)
					.responseBodySize(responseBody != null ? responseBody.length() : 0)
					.responseTimeMs(responseTime)
					.build();

//			log.info("[API ?????] Status: {} | ?????????: {}ms", response.getStatusCode(), responseTime);

			// 응답 처리 (204 No Content 등 본문 없는 2xx도 성공)
			if (response.getStatusCode().is2xxSuccessful()) {
				if (responseBody == null || responseBody.isBlank()) {
					return Collections.emptyMap();
				}
				rejectIfUpstreamErrorBody(strictUpstream, responseBody);
				return jsonAdapter.fromJson(responseBody, new TypeReference<>() {});
			}
			if (strictUpstream) {
				throw UpstreamErrorMapper.fromHttpError(jsonAdapter, response.getStatusCode(), responseBody);
			}
			throw new RuntimeException("API 호출 실패: " + response.getStatusCode());

		} catch (HttpClientErrorException | HttpServerErrorException e) {
			// HTTP ????? (4xx, 5xx)
			long responseTime = System.currentTimeMillis() - startTime;
			Timestamp errorResponseDt = new Timestamp(System.currentTimeMillis());
			String errorResponseBody = e.getResponseBodyAsString();

			// Response ?????ChatLogParam ????? (HTTP ????? ???????)
			ChatLogParam baseParam = chatLogBuilder.build();
			logParam = ChatLogParam.failureBuilder(e)
					.companyCode(baseParam.getCompanyCode())
					.logKey(baseParam.getLogKey())
					.vendor(baseParam.getVendor())
					.httpMethod(baseParam.getHttpMethod())
					.apiPath(baseParam.getApiPath())
					.apiBaseUrl(baseParam.getApiBaseUrl())
					.apiFullUrl(baseParam.getApiFullUrl())
					.requestDt(baseParam.getRequestDt())
					.requestHeader(baseParam.getRequestHeader())
					.requestQueryString(baseParam.getRequestQueryString())
					.requestBody(baseParam.getRequestBody())
					.firstCreateUserId(baseParam.getFirstCreateUserId())
					.responseDt(errorResponseDt.toLocalDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
					.responseStatusCode(String.valueOf(e.getRawStatusCode()))
					.responseHeader("")
					.responseBody(errorResponseBody)
					.responseBodySize(errorResponseBody != null ? errorResponseBody.length() : 0)
					.responseTimeMs(responseTime)
					.build();

//			log.error("[API ?????] URL: {} | Status: {} | Exception: {}", finalUrl, e.getRawStatusCode(), e.getMessage());
			if (strictUpstream) {
				HttpStatus st = HttpStatus.resolve(e.getRawStatusCode());
				throw UpstreamErrorMapper.fromHttpError(jsonAdapter, st, errorResponseBody);
			}
			result = new HashMap<>();
			result.put("error", e.getMessage());

		} catch (ResourceAccessException e) {
			// ?????????????? ???????? ????
			long responseTime = System.currentTimeMillis() - startTime;

			// Response ?????ChatLogParam ????? (????????????????)
			ChatLogParam baseParam = chatLogBuilder.build();
			logParam = ChatLogParam.timeoutBuilder(e)
					.companyCode(baseParam.getCompanyCode())
					.logKey(baseParam.getLogKey())
					.vendor(baseParam.getVendor())
					.httpMethod(baseParam.getHttpMethod())
					.apiPath(baseParam.getApiPath())
					.apiBaseUrl(baseParam.getApiBaseUrl())
					.apiFullUrl(baseParam.getApiFullUrl())
					.requestDt(baseParam.getRequestDt())
					.requestHeader(baseParam.getRequestHeader())
					.requestQueryString(baseParam.getRequestQueryString())
					.requestBody(baseParam.getRequestBody())
					.firstCreateUserId(baseParam.getFirstCreateUserId())
					.responseTimeMs(responseTime)
					.build();

//			log.error("[API ????????? URL: {} | Exception: {}", finalUrl, e.getMessage());
			if (strictUpstream) {
				throw ExternalApiException.of(
						HttpStatus.SERVICE_UNAVAILABLE,
						String.valueOf(HttpStatus.SERVICE_UNAVAILABLE.value()),
						e.getMessage()
				);
			}
			result = new HashMap<>();
			result.put("error", "API ????????? " + e.getMessage());

		} catch (ExternalApiException e) {
			throw e;
		} catch (Exception e) {
			// ??? ?????
			long responseTime = System.currentTimeMillis() - startTime;

			// Response ?????ChatLogParam ????? (??? ????? ???????)
			ChatLogParam baseParam = chatLogBuilder.build();
			logParam = ChatLogParam.failureBuilder(e)
					.companyCode(baseParam.getCompanyCode())
					.logKey(baseParam.getLogKey())
					.vendor(baseParam.getVendor())
					.httpMethod(baseParam.getHttpMethod())
					.apiPath(baseParam.getApiPath())
					.apiBaseUrl(baseParam.getApiBaseUrl())
					.apiFullUrl(baseParam.getApiFullUrl())
					.requestDt(baseParam.getRequestDt())
					.requestHeader(baseParam.getRequestHeader())
					.requestQueryString(baseParam.getRequestQueryString())
					.requestBody(baseParam.getRequestBody())
					.firstCreateUserId(baseParam.getFirstCreateUserId())
					.responseDt(null)
					.responseStatusCode(null)
					.responseHeader("")
					.responseBody("")
					.responseBodySize(0)
					.responseTimeMs(responseTime)
					.build();

//			log.error("[API ?????] URL: {} | Exception: {}", finalUrl, e.getMessage(), e);
			if (strictUpstream) {
				throw ExternalApiException.of(
						HttpStatus.BAD_GATEWAY,
						String.valueOf(HttpStatus.BAD_GATEWAY.value()),
						e.getMessage()
				);
			}
			result = new HashMap<>();
			result.put("error", e.getMessage());

		} finally {
			// ============ ??? ????(???? ?????) ============
			if (logParam != null) {
				chatLogService.saveApiLog(logParam);
			}
		}

		return result;
	}

	// 200 + error
	private void rejectIfUpstreamErrorBody(boolean strict, String body) {
		if (!strict || body == null) {
			return;
		}
		try {
			JsonNode n = jsonAdapter.toTree(body);
			if (!n.has("error") || !n.get("error").isObject()) {
				return;
			}
			ApiErrorResponse root = jsonAdapter.fromJson(body, ApiErrorResponse.class);
			if (root.getError() != null) {
				throw UpstreamErrorMapper.fromEnvelope(HttpStatus.BAD_GATEWAY, root);
			}
		} catch (ExternalApiException e) {
			throw e;
		} catch (Exception ignore) {
		}
	}


	/**
	 * ??? ??? ???? (params????? ??? ??? ??????????)
	 */
	private List<Map<String, Object>> extractFileInfoList(Map<String, Object> params) {
		List<Map<String, Object>> fileInfoList = new ArrayList<>();

		if (params == null) {
			return fileInfoList;
		}

		// 1. fileInfos ???? ??????????????? ????? ???????????
		Object fileInfosObj = params.get("fileInfos");
		if (fileInfosObj instanceof List) {
			for (Object fileInfoObj : (List<?>) fileInfosObj) {
				if (fileInfoObj instanceof Map) {
					@SuppressWarnings("unchecked")
					Map<String, Object> fileInfo = (Map<String, Object>) fileInfoObj;
					fileInfoList.add(fileInfo);
				}
			}
			return fileInfoList;
		}

		// 2. files ?????????? ??? ????
		Object filesObj = params.get("files");
		if (filesObj instanceof List) {
			int seq = 1;
			for (Object fileObj : (List<?>) filesObj) {
				Map<String, Object> fileInfo = new HashMap<>();

				// AttachFileInfo ????????
				if (fileObj instanceof xs.aichat.dto.AttachFileInfo) {
					xs.aichat.dto.AttachFileInfo attachFileInfo = (xs.aichat.dto.AttachFileInfo) fileObj;
					fileInfo.put("fileName", attachFileInfo.getFilename());
					fileInfo.put("fileType", attachFileInfo.getMimeType());
					fileInfo.put("fileSize", null); // AttachFileInfo????? ??? ????? ????
					fileInfo.put("fileUrl", null);
					fileInfo.put("fileId", null);
				}
				// Resource ????????
				else if (fileObj instanceof org.springframework.core.io.Resource) {
					org.springframework.core.io.Resource resource = (org.springframework.core.io.Resource) fileObj;
					try {
						fileInfo.put("fileName", resource.getFilename());
						fileInfo.put("fileType", null); // Resource????? MIME ???????? ?????
						fileInfo.put("fileSize", resource.contentLength() > 0 ? resource.contentLength() : null);
						fileInfo.put("fileUrl", resource.getURI() != null ? resource.getURI().toString() : null);
						fileInfo.put("fileId", null);
					} catch (Exception e) {
//						log.warn("??? ??? ???? ?????: {}", e.getMessage());
						fileInfo.put("fileName", resource.getFilename());
						fileInfo.put("fileType", null);
						fileInfo.put("fileSize", null);
						fileInfo.put("fileUrl", null);
						fileInfo.put("fileId", null);
					}
				}
				// Map ???????????
				else if (fileObj instanceof Map) {
					@SuppressWarnings("unchecked")
					Map<String, Object> fileMap = (Map<String, Object>) fileObj;
					fileInfo.put("fileName", fileMap.get("fileName") != null ? fileMap.get("fileName") : fileMap.get("filename"));
					fileInfo.put("fileType", fileMap.get("fileType") != null ? fileMap.get("fileType") : fileMap.get("mimeType"));
					fileInfo.put("fileSize", fileMap.get("fileSize") != null ? fileMap.get("fileSize") : fileMap.get("file_size"));
					fileInfo.put("fileUrl", fileMap.get("fileUrl") != null ? fileMap.get("fileUrl") : fileMap.get("file_url"));
					fileInfo.put("fileId", fileMap.get("fileId") != null ? fileMap.get("fileId") : fileMap.get("file_id"));
				}

				if (fileInfo.containsKey("fileName") && fileInfo.get("fileName") != null) {
					fileInfo.put("fileSeq", seq++);
					fileInfoList.add(fileInfo);
				}
			}
		}

		return fileInfoList;
	}


	/**
	 * API ???? ???? ???????(multipart/form-data ?????, WebClient ??????????)
	 * @param callApiUrl
	 * @param method
	 * @param headers
	 * @param params
	 * @return Mono<Map<String, Object>> (??????
	 */
	public Map<String, Object> callApi2(String callApiUrl, HttpMethod method,
										Map<String, String> headers, Map<String, Object> params) {

		String finalUrl = this.url;

		HttpHeaders httpHeaders = new HttpHeaders();
		if (headers != null) headers.forEach(httpHeaders::set);

		// ??? ????: ???? ???? ????
//		httpHeaders.set("Accept-Encoding", "deflate, br");

		// JWT ????
		injectAuthorizationHeader(httpHeaders);
//		log.info("???? ????: {}", httpHeaders);

		// WebClient — shared pooled bean (TB-005f)
		MultiValueMap<String, Object> multipartBody = new LinkedMultiValueMap<>();
		if (params != null) {
			for (Map.Entry<String, Object> entry : params.entrySet()) {
				String key = entry.getKey();
				Object value = entry.getValue();
				if ("files".equals(key) && value instanceof List) {
					for (Object fileObj : (List<?>) value) {
						if (fileObj instanceof org.springframework.core.io.Resource) {
							multipartBody.add("files", fileObj);
						}
					}
				} else if (value != null) {
					multipartBody.add(key, value);
				}
			}
		}

		try {
			// ??? ???? (.block() ?????)
			String responseBody = wrtnWebClient
					.method(method)
					.uri(callApiUrl)
					.headers(h -> h.addAll(httpHeaders))
					.contentType(MediaType.MULTIPART_FORM_DATA)
					.body(BodyInserters.fromMultipartData(multipartBody))
					.retrieve()
					.onStatus(
							status -> status.is4xxClientError() || status.is5xxServerError(),
							response -> response.bodyToMono(String.class)
									.flatMap(errorBody -> {
//										log.error("API ???? ????? [{}]: {}", response.statusCode(), errorBody);
										return reactor.core.publisher.Mono.error(
												new RuntimeException("API ???? ?????: " + errorBody)
										);
									})
					)
					.bodyToMono(String.class)
					.block(); // ????????? API ??????????????(??? ????

			// ????? ?????
			try {
				return jsonAdapter.fromJson(responseBody, new TypeReference<>(){});
			} catch (Exception parseEx) {
//				log.warn("????? JSON ????? ?????: {}", parseEx.getMessage());
				Map<String, Object> fallback = new HashMap<>();
				fallback.put("raw", responseBody);
				return fallback;
			}

		} catch (Exception e) {
			// ???????? / ????? ???
//			log.error("API ???? ??????? ?????", e);
			Map<String, Object> errorMap = new HashMap<>();
			errorMap.put("error", e.getMessage());
			return errorMap;
		}
	}


	private RestTemplate createPooledRestTemplate(boolean trustAllSsl) {
		try {
			int connReqTimeout = xtrmConfig.getInt("REST_CONN_REQ_TIMEOUT", 10_000);
			int connTimeout = xtrmConfig.getInt("REST_CONN_TIMEOUT", 10_000);
			int socketTimeout = xtrmConfig.getInt("REST_SOCKET_TIMEOUT", 120_000);
			int poolMaxTotal = xtrmConfig.getInt("REST_CONN_POOL_MAX_TOTAL", 100);
			int poolMaxPerRoute = xtrmConfig.getInt("REST_CONN_POOL_MAX_PER_ROUTE", 30);

			SSLConnectionSocketFactory csf;
			if (trustAllSsl) {
				TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
				SSLContext sslContext = SSLContextBuilder.create()
						.loadTrustMaterial(null, acceptingTrustStrategy)
						.build();
				csf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
			} else {
				csf = SSLConnectionSocketFactory.getSocketFactory();
			}

			RequestConfig requestConfig = RequestConfig.custom()
					.setConnectionRequestTimeout(connReqTimeout)
					.setConnectTimeout(connTimeout)
					.setSocketTimeout(socketTimeout)
					.setExpectContinueEnabled(true)
					.setStaleConnectionCheckEnabled(true)
					.build();
			SocketConfig socketConfig = SocketConfig.custom()
					.setSoKeepAlive(true)
					.setTcpNoDelay(true)
					.setSoReuseAddress(true)
					.setSoTimeout(socketTimeout)
					.build();
			Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory>create()
					.register("https", csf)
					.register("http", PlainConnectionSocketFactory.getSocketFactory())
					.build();
			PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(
					socketFactoryRegistry);
			connectionManager.setMaxTotal(poolMaxTotal);
			connectionManager.setDefaultMaxPerRoute(poolMaxPerRoute);
			closeableHttpClient = HttpClientBuilder.create()
					.setConnectionManager(connectionManager)
					.setDefaultRequestConfig(requestConfig)
					.setDefaultSocketConfig(socketConfig)
					.build();
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			requestFactory.setHttpClient(closeableHttpClient);
			return new RestTemplate(requestFactory);
		} catch (Exception e) {
			throw new RuntimeException("Failed to create pooled RestTemplate for WRTN API", e);
		}
	}

    // ?????????? USER_ID ???? ?????????params, params???? ????????????????
    private String extractUserId(Map<String, Object> params) {
        return Optional.ofNullable(getCurrentRequest())
                .map(request -> request.getSession(false))
                .map(session -> (String) session.getAttribute("USER_ID"))
                .filter(StringUtils::hasText)
                .orElseGet(() -> Optional.ofNullable(params)
                        .map(param -> param.get("user_id"))
                        .map(String::valueOf)
                        .orElse("anonymous"));
    }

    // RequestContextHolder ??request ???
    private HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return (attrs != null) ? attrs.getRequest() : null;
    }

    /**
     * ?????????? ?????????? ??JWT ??? ????? ??Authorization ???? ????
     */
    public void injectAuthorizationHeader(HttpHeaders headers) {

        HttpServletRequest request = getCurrentRequest();
        if (request == null) {
//            log.warn("????? request ???? ??Authorization ?????");
            return;
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
//            log.warn("????? ???? ??Authorization ?????");
            return;
        }

        String userId = (String) session.getAttribute("USER_ID");
        String corpCode = (String) session.getAttribute("GBIS_CORP_CODE");
        String pgCode = (String) session.getAttribute("PG_CODE");
        String puCode = (String) session.getAttribute("PU_CODE");
        String teamCode = JwtSessionHelper.resolveLoginTeamCode(session);
		log.info("USER INFO : {},{},{},{},{}", userId, corpCode, pgCode, puCode, teamCode);

        if (userId == null) {
//            log.warn("USER_ID ???? ??Authorization ?????");
            return;
        }

        String token = JwtSessionHelper.obtainAuthorizationJwt(session, hyobeeJwtTokenService);
        if (!StringUtils.hasText(token)) {
            return;
        }

        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + token);
    }

    /**
     * chat-web Bearer JWT가 있으면 그대로 upstream에 전달하고, 없으면 세션 기반 stream JWT를 사용한다.
     */
    public void injectUpstreamAuthorizationHeader(HttpHeaders headers) {
        HttpServletRequest request = getCurrentRequest();
        if (request != null) {
            String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
            if (StringUtils.hasText(authorization)) {
                headers.set(HttpHeaders.AUTHORIZATION, authorization);
                return;
            }
        }
        injectStreamAuthorizationHeader(headers);
    }

    /**
     * SSE ??????RND ?????? ????sidebar ?? ????? ??(JWT_TEAM_CODE)???? JWT ????.
     */
    public void injectStreamAuthorizationHeader(HttpHeaders headers) {
        HttpServletRequest request = getCurrentRequest();
        if (request == null) {
            return;
        }

        HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }

        String userId = (String) session.getAttribute("USER_ID");
        if (userId == null) {
            return;
        }

        String teamCode = JwtSessionHelper.resolveStreamTeamCode(session);
        log.info("STREAM USER INFO : {},{},{},{},{}",
                userId,
                session.getAttribute("GBIS_CORP_CODE"),
                session.getAttribute("PG_CODE"),
                session.getAttribute("PU_CODE"),
                teamCode);

        String token = JwtSessionHelper.obtainStreamAuthorizationJwt(session, hyobeeJwtTokenService);
        if (!StringUtils.hasText(token)) {
            return;
        }

        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + token);
    }

}
