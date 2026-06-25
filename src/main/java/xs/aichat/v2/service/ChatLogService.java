package xs.aichat.v2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import xs.aichat.dto.ChatLogFileParam;
import xs.aichat.dto.ChatLogParam;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.mapper.ChatLogMapper;
import xs.core.property.XtrmProperty;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 채팅 API 로그 저장 서비스
 * <p>
 * 역할: 외부 API 호출 로그 저장 전담 (비즈니스 로직과 분리)
 * - 일반 API 호출 로그 저장
 * - SSE 스트림 API 호출 로그 저장
 * - 파일 로그 저장
 * </p>
 * <p>
 * 주의: 이 서비스는 로그 저장만 담당합니다.
 * - XtrmAichatInterface: 외부 API 호출 담당
 * - AichatLogService: 로그 저장 담당
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatLogService {

    private final XtrmProperty xtrmConfig;

    private final ChatLogMapper chatLogMapper;

    private final JsonAdapter jsonAdapter;

    /**
     * 외부 API 로그 저장
     * - request_body 내 files[].content 는 제거 후 저장 (용량·개인정보 최소화)
     * @param logParam 로그 파라미터
     */
    public void saveApiLog(ChatLogParam logParam) {
        try {
            String requestBodyForLog = removeContentFromFilesInRequestBody(logParam.getRequestBody());
            ChatLogParam paramForInsert = logParam.toBuilder()
                    .requestBody(requestBodyForLog)
                    .build();

            chatLogMapper.insertChatApiLog(
                    paramForInsert.getCompanyCode(),
                    paramForInsert.getLogKey(),
                    paramForInsert.getVendor(),
                    paramForInsert.getApiPath(),
                    paramForInsert.getApiBaseUrl(),
                    paramForInsert.getApiFullUrl(),
                    paramForInsert.getHttpMethod(),
                    paramForInsert.getRequestDt(),
                    paramForInsert.getRequestHeader(),
                    paramForInsert.getRequestQueryString(),
                    paramForInsert.getRequestBody(),
                    paramForInsert.getResponseDt(),
                    paramForInsert.getResponseStatusCode(),
                    paramForInsert.getResponseHeader(),
                    paramForInsert.getResponseBody(),
                    paramForInsert.getResponseBodySize(),
                    paramForInsert.getResponseTimeMs(),
                    paramForInsert.getCallStatus(),
                    paramForInsert.getSuccessYn(),
                    paramForInsert.getErrorYn(),
                    paramForInsert.getErrorMessage(),
                    paramForInsert.getTimeoutYn(),
                    paramForInsert.getFirstCreateUserId(),
                    paramForInsert.getCreateDt()
            );

//            log.debug("API 로그 저장 완료: logKey={}", logParam.getLogKey());
        } catch (Exception e) {
            // 로그 저장 실패해도 비즈니스 로직에 영향 없도록
//            log.error("외부 API 로그 저장 실패: logKey={}, error={}",
//                    logParam.getLogKey(), e.getMessage(), e);
        }
    }

    /**
     * 파일 로그 저장
     * @param logKey 그룹 로그 키 (API 로그의 log_key)
     * @param fileInfoList 파일 정보 리스트
     */
    public void saveFileLogs(String logKey, List<Map<String, Object>> fileInfoList) {
        if (fileInfoList == null || fileInfoList.isEmpty()) {
            return;
        }

        // null인 경우 빈 문자열로 처리 (파일 업로드 시점에는 LOG_KEY = ''로 INSERT)
        if (logKey == null) {
            logKey = StringUtils.EMPTY;
        }

        String companyCode = xtrmConfig.getString("COMPANY_CODE", "1000");

        for (Map<String, Object> fileInfo : fileInfoList) {
            try {
                // DTO로 로그 param 조립 로직을 이동
                ChatLogFileParam fileLogParam = ChatLogFileParam.fromFileInfo(companyCode, logKey, fileInfo);

                chatLogMapper.insertChatApiFileLog(
                        fileLogParam.getCompanyCode(),
                        fileLogParam.getLogKey(),
                        fileLogParam.getFileLogKey(),
                        fileLogParam.getFileName(),
                        fileLogParam.getFileSize(),
                        fileLogParam.getFileType(),
                        fileLogParam.getMimeType(),
                        fileLogParam.getSuccessYn(),
                        fileLogParam.getErrorMessage(),
                        fileLogParam.getCreateDt()
                );

                log.debug("파일 로그 저장 완료: logKey={}, fileName={}", logKey, fileInfo.get("fileName"));
            } catch (Exception e) {
                // 파일 로그 저장 실패해도 비즈니스 로직에 영향 없도록
                log.error("파일 로그 처리 중 오류: logKey={}, fileName={}, error={}", logKey, fileInfo.get("fileName"), e.getMessage(), e);
            }
        }
    }

    /**
     * SSE 스트림 API 호출 로그 저장
     * @param callApiUrl 호출 URL
     * @param requestBody 요청 Body
     * @param requestHeaders 요청 Headers
     * @param userId 사용자 ID
     * @param requestDt 요청 일시
     * @param responseTimeMs 응답 시간 (밀리초)
     * @param callStatus 호출 상태 (SUCCESS, FAIL, TIMEOUT)
     * @param errorMessage 에러 메시지 (있을 경우)
     * @param responseBody 누적된 스트림 chunk 내용
     * @param fileInfoList 파일 정보 리스트 (있는 경우)
     */
    public void saveStreamApiLog(
            String apiBaseUrl,
            String callApiUrl,
            String requestBody,
            Map<String, String> requestHeaders,
            String userId,
            Timestamp requestDt,
            long responseTimeMs,
            String callStatus,
            String errorMessage,
            String responseBody,
            List<Map<String, Object>> fileInfoList
    ) {
        try {
            String finalUrl = apiBaseUrl + callApiUrl;
            String queryString = extractQueryString(callApiUrl);

            Map<String, String> resultMap = new java.util.HashMap<>();
            resultMap.put("content", responseBody);

            String logKey = UUID.randomUUID().toString();

            String companyCode = xtrmConfig.getString("COMPANY_CODE", "1000");
            String requestHeaderJson = jsonAdapter.toJson(requestHeaders);
            String responseBodyJson = jsonAdapter.toJson(resultMap);
            Integer responseBodySize = responseBody != null ? responseBody.length() : 0;

            // DTO로 로그 param 조립 로직을 이동
            ChatLogParam logParam = ChatLogParam.fromStreamApiLog(
                    companyCode,
                    logKey,
                    "WRTN",
                    callApiUrl,
                    apiBaseUrl,
                    finalUrl,
                    "POST",
                    requestDt,
                    requestHeaderJson,
                    queryString,
                    requestBody,
                    responseBodyJson,
                    responseBodySize,
                    responseTimeMs,
                    callStatus,
                    errorMessage,
                    userId
            );

            saveApiLog(logParam);

            // 파일 로그의 logKey 업데이트 (chat_api_log INSERT 후 생성된 logKey로 업데이트)
            if (fileInfoList != null && !fileInfoList.isEmpty()) {
                for (Map<String, Object> fileInfo : fileInfoList) {
                    String fileLogKey = (String) fileInfo.get("fileLogKey");
                    if (fileLogKey != null && !fileLogKey.isEmpty()) {
                        try {
                            updateChatApiFileLogKey(companyCode, fileLogKey, logKey);
                        } catch (Exception e) {
                            // 파일 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
                            log.warn("파일 로그 logkey 업데이트 실패: fileLogKey={}, logKey={}", fileLogKey, logKey, e);
                        }
                    }
                }
            }

//            log.debug("SSE 스트림 API 로그 저장 완료: logKey={}, callStatus={}", logKey, callStatus);
        } catch (Exception e) {
//            log.error("SSE 스트림 API 로그 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 파일 로그 업데이트 (성공/실패 여부)
     * @param companyCode 회사코드
     * @param fileLogKey 파일 로그 키
     * @param successYn 성공 여부 (Y: 성공, N: 실패)
     * @param errorMessage 에러 메시지 (실패 시)
     */
    public void updateFileLog(String companyCode, String fileLogKey, String successYn, String errorMessage) {
        try {
            ChatLogFileParam fileLogParam = ChatLogFileParam.builder()
                    .companyCode(companyCode)
                    .fileLogKey(fileLogKey)
                    .successYn(successYn)
                    .errorMessage(errorMessage)
                    .build();

            chatLogMapper.updateChatApiFileLog(
                    fileLogParam.getCompanyCode(),
                    fileLogParam.getFileLogKey(),
                    fileLogParam.getSuccessYn(),
                    fileLogParam.getErrorMessage()
            );
            log.debug("파일 로그 업데이트 완료: fileLogKey={}, successYn={}", fileLogKey, successYn);
        } catch (Exception e) {
            // 파일 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
            log.error("파일 로그 업데이트 실패: fileLogKey={}, error={}", fileLogKey, e.getMessage(), e);
        }
    }

    /**
     * 파일 로그 logKey 업데이트 (API 호출 완료 후)
     * @param companyCode 회사코드
     * @param fileLogKey 파일 로그 키 (folderUuid)
     * @param logKey 그룹 로그 키 (API 로그의 log_key)
     */
    public void updateChatApiFileLogKey(String companyCode, String fileLogKey, String logKey) {
        if (logKey == null || logKey.isEmpty()) {
            return; // logKey가 없으면 업데이트하지 않음
        }

        try {
            ChatLogFileParam fileLogParam = ChatLogFileParam.builder()
                    .companyCode(companyCode)
                    .logKey(logKey)
                    .fileLogKey(fileLogKey)
                    .build();

            chatLogMapper.updateChatApiFileLogKey(
                    fileLogParam.getCompanyCode(),
                    fileLogParam.getFileLogKey(),
                    fileLogParam.getLogKey()
            );

            log.debug("파일 로그 logKey 업데이트 완료: fileLogKey={}, logKey={}", fileLogKey, logKey);
        } catch (Exception e) {
            // 파일 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
            log.error("파일 로그 logKey 업데이트 실패: fileLogKey={}", fileLogKey, e);
        }
    }

    /**
     * request_body JSON에서 files 배열 내 각 요소의 content 키만 제거 (로그 저장 시 용량 최소화)
     * @param requestBody 요청 Body JSON 문자열 (null/빈값 허용)
     * @return content 제거된 JSON 문자열 (파싱 실패·files 없음 시 원본 그대로)
     */
    private String removeContentFromFilesInRequestBody(String requestBody) {
        if (requestBody == null || requestBody.isEmpty()) {
            return requestBody;
        }
        try {
            JsonNode root = jsonAdapter.toTree(requestBody);
            if (!root.isObject()) {
                return requestBody;
            }
            ObjectNode body = (ObjectNode) root;
            JsonNode filesNode = body.get("files");
            if (filesNode == null || !filesNode.isArray()) {
                return requestBody;
            }
            for (JsonNode fileNode : filesNode) {
                if (fileNode.isObject()) {
                    ((ObjectNode) fileNode).remove("content");
                }
            }
            return jsonAdapter.toJson(body);
        } catch (Exception e) {
            log.debug("request_body files content 제거 중 파싱 실패, 원본 유지: {}", e.getMessage());
            return requestBody;
        }
    }

    /**
     * URL에서 Query String 추출
     */
    private String extractQueryString(String url) {
        if (url == null) {
            return null;
        }
        int queryIndex = url.indexOf('?');
        if (queryIndex >= 0 && queryIndex < url.length() - 1) {
            return url.substring(queryIndex + 1);
        }
        return null;
    }
}

