package xs.aichat.dto;

import lombok.Builder;
import lombok.Getter;

import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * 외부 API 송수신 로그 파라미터 DTO
 */
@Getter
@Builder(toBuilder = true)
public class ChatLogParam {

    private String companyCode;

    private String logKey;

    private String vendor;

    private String apiPath;

    private String apiBaseUrl;

    private String apiFullUrl;

    private String httpMethod;

    private String requestDt;

    private String requestHeader;

    private String requestQueryString;

    private String requestBody;

    private String responseDt;

    private String responseStatusCode;

    private String responseHeader;

    private String responseBody;

    private Integer responseBodySize;

    private Long responseTimeMs;

    private String callStatus;

    private String successYn;

    private String errorYn;

    private String errorMessage;

    private String timeoutYn;

    private String firstCreateUserId;

    private String createDt;

    /**
     * 성공 케이스용 Builder (기본값 설정)
     * @return ChatLogParamBuilder with success defaults
     */
    public static ChatLogParamBuilder successBuilder() {
        return builder()
                .callStatus("SUCCESS")
                .successYn("Y")
                .errorYn("N")
                .errorMessage("")
                .timeoutYn("N");
    }

    /**
     * 실패 케이스용 Builder (기본값 설정)
     * @param e 예외 객체
     * @return ChatLogParamBuilder with failure defaults
     */
    public static ChatLogParamBuilder failureBuilder(Exception e) {
        return builder()
                .callStatus("FAIL")
                .successYn("N")
                .errorYn("Y")
                .errorMessage(e != null && e.getMessage() != null ? e.getMessage() : "")
                .timeoutYn("N");
    }

    /**
     * 타임아웃 케이스용 Builder (기본값 설정)
     * @param e 예외 객체
     * @return ChatLogParamBuilder with timeout defaults
     */
    public static ChatLogParamBuilder timeoutBuilder(Exception e) {
        return builder()
                .responseDt(null)
                .responseStatusCode(null)
                .responseHeader("")
                .responseBody("")
                .responseBodySize(0)
                .callStatus("TIMEOUT")
                .successYn("N")
                .errorYn("Y")
                .timeoutYn("Y")
                .errorMessage(e != null && e.getMessage() != null ? e.getMessage() : "");
    }

    /**
     * SSE 스트림 API 호출 로그 파라미터 생성용 factory.
     * 서비스에서 필드 조립(builder() 세팅)을 DTO로 이동해 가독성을 높이기 위한 목적입니다.
     */
    public static ChatLogParam fromStreamApiLog(
            String companyCode,
            String logKey,
            String vendor,
            String apiPath,
            String apiBaseUrl,
            String apiFullUrl,
            String httpMethod,
            Timestamp requestDt,
            String requestHeaderJson,
            String requestQueryString,
            String requestBody,
            String responseBodyJson,
            Integer responseBodySize,
            long responseTimeMs,
            String callStatus,
            String errorMessage,
            String firstCreateUserId
    ) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        String requestDtStr = requestDt != null
                ? requestDt.toLocalDateTime().format(formatter)
                : "";
        String responseDtStr = new Timestamp(System.currentTimeMillis()).toLocalDateTime().format(formatter);

        boolean isSuccess = Objects.equals("SUCCESS", callStatus);
        boolean isTimeout = Objects.equals("TIMEOUT", callStatus);

        return builder()
                .companyCode(companyCode)
                .logKey(logKey)
                .vendor(vendor)
                .apiPath(apiPath)
                .apiBaseUrl(apiBaseUrl)
                .apiFullUrl(apiFullUrl)
                .httpMethod(httpMethod)
                .requestDt(requestDtStr)
                .requestHeader(requestHeaderJson)
                .requestQueryString(requestQueryString)
                .requestBody(requestBody)
                .responseDt(responseDtStr)
                .responseStatusCode("200") // SSE는 성공 시 200 기준으로 내부 로그를 남김
                .responseHeader("")
                .responseBody(responseBodyJson)
                .responseBodySize(responseBodySize != null ? responseBodySize : 0)
                .responseTimeMs(responseTimeMs)
                .callStatus(callStatus)
                .successYn(isSuccess ? "Y" : "N")
                .errorYn(isSuccess ? "N" : "Y")
                .errorMessage(errorMessage)
                .timeoutYn(isTimeout ? "Y" : "N")
                .firstCreateUserId(firstCreateUserId)
                .build();
    }
}


