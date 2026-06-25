package xs.aichat.v2.external;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.Disposable;
import xs.aichat.dto.*;
import xs.aichat.interfaces.HyobeeChatApiClient;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.dto.external.wrtn.request.*;
import xs.aichat.v2.dto.external.wrtn.response.*;
import xs.aichat.v2.dto.external.wrtn.rnd.*;
import xs.aichat.v2.dto.internal.request.*;
import xs.aichat.v2.dto.internal.request.MessageRequest;
import xs.aichat.v2.dto.internal.response.*;
import xs.aichat.v2.dto.internal.rnd.*;
import xs.aichat.v2.service.ChatFileService;
import xs.aichat.v2.service.ChatLogService;
import xs.aichat.v2.util.DocumentLinkBuilder;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.*;
import java.util.function.Consumer;

/**
 * Wrtn ?? ???.
 * <p>
 * - ?? HTTP ??? {@link HyobeeChatApiClient}? ???<br>
 * - SSE ???(/ai-chat)? WebClient ??
 * </p>
 */
@Slf4j
@Service("wtrnChatVendorClientV2")
@RequiredArgsConstructor
public class WrtnChatVendorClient implements ChatVendorClient {

    private final HyobeeChatApiClient hyobeeChatApiClient;
    
    private final ChatLogService chatLogService;
    
    private final ChatFileService chatFileService;
    
    private final ObjectMapper objectMapper;

    private final JsonAdapter jsonAdapter;

    private final WebClient wrtnWebClient;

    // ?? ??.
    @Override
    public ResponseEntity<Map<String, Object>> healthCheck() {
        try {
            var result = hyobeeChatApiClient.callApiOrThrow("/_health", HttpMethod.GET, defaultHeaders(), null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            var error = new HashMap<String, Object>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
        }
    }

    // ?? ?? ??: ?? ?? ? ?? API ? ?? ?? ? ?? ?? ??
    @Override
    public ConversationsResponse selectConversations(ConversationRequest request) {
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var result = hyobeeChatApiClient.callApiOrThrow(
                "/api/v1/conversations",
                HttpMethod.GET,
                defaultHeaders(),
                apiRequest
        );
        var apiResponse = jsonAdapter.convertValue(result, ConversationsApiResponse.class);
        return WrtnChatApiResponseMapper.toInternalResponse(apiResponse);
    }

    // ??? ?? ??: ?? ?? ? ?? API ?? ? ?? ?? ? ?? ?? ??
    @Override
    public List<MessageItem> selectMessages(MessageRequest request) {
        var callUrl = "/api/v1/conversations/" + request.getConversationId() + "/messages";
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                apiRequest
        );

        var apiResponse = jsonAdapter.convertValue(result, MessagesApiResponse.class);
        enrichAttachmentThumbnails(apiResponse);
        return WrtnMessageApiResponseMapper.toInternalResponse(apiResponse.getContent(), this::getSourceFilter);
    }

    private void enrichAttachmentThumbnails(MessagesApiResponse apiResponse) {
        if (apiResponse == null || apiResponse.getContent() == null) {
            return;
        }
        for (var message : apiResponse.getContent()) {
            if (message == null || message.getAttachments() == null) {
                continue;
            }
            for (var attachmentObj : message.getAttachments()) {
                if (!(attachmentObj instanceof Map)) {
                    continue;
                }
                @SuppressWarnings("unchecked")
                var attachment = (Map<String, Object>) attachmentObj;
                var thumbnailId = asString(attachment.get("thumbnail_id"));
                if (thumbnailId == null || thumbnailId.isEmpty()) {
                    continue;
                }
                if (!isImageAttachment(attachment)) {
                    continue;
                }
                var imageBase64 = chatFileService.getImageByThumbnailId(thumbnailId);
                if (imageBase64 != null && !imageBase64.isEmpty()) {
                    attachment.put("thumbnail_image", imageBase64);
                }
            }
        }
    }

    private boolean isImageAttachment(Map<String, Object> attachment) {
        var filename = asString(attachment.get("filename"));
        if (filename != null) {
            var lowerFilename = filename.toLowerCase();
            if (lowerFilename.endsWith(".jpg")
                    || lowerFilename.endsWith(".jpeg")
                    || lowerFilename.endsWith(".png")
                    || lowerFilename.endsWith(".gif")
                    || lowerFilename.endsWith(".bmp")
                    || lowerFilename.endsWith(".webp")) {
                return true;
            }
        }

        var mimeType = asString(attachment.get("mime_type"));
        return mimeType != null && mimeType.toLowerCase().startsWith("image/");
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    // ?? ??: ?? ?? ? ?? API ? ?? ?? ? ?? ?? ??
    @Override
    public CreateConversationResponse createConversation(CreateConversationRequest request) {
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var result = hyobeeChatApiClient.callApiOrThrow(
                "/api/v1/conversations",
                HttpMethod.POST,
                defaultHeaders(),
                apiRequest
        );
        var apiResponse = jsonAdapter.convertValue(result, CreateConversationApiResponse.class);
        return WrtnChatApiResponseMapper.toInternalResponse(apiResponse);
    }

    // ?? ?? ??: ?? ?? ? ?? API ? ?? ?? ? ?? ?? ??
    @Override
    public DeleteConversationsResponse deleteConversations(DeleteConversationRequest request) {
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var result = hyobeeChatApiClient.callApiOrThrow(
                "/api/v1/conversations",
                HttpMethod.DELETE,
                defaultHeaders(),
                apiRequest
        );
        var apiResponse = jsonAdapter.convertValue(result, DeleteConversationsApiResponse.class);
        return WrtnChatApiResponseMapper.toInternalResponse(apiResponse);
    }

    // ?? ??? ??? ?? ??: ?? ?? ? ?? API ? ?? ?? ? ?? ?? ??
    @Override
    public BoardAuthResponse selectDataBoardsAuth(BoardAuthRequest request) {
//        var apiRequest = BoardAuthApiRequest.of(request.getPgCode(), request.getPuCode(), request.getCorpCode(), request.getTeamCode());
        var result = hyobeeChatApiClient.callApiOrThrow(
                "/api/v1/boards/auth",
                HttpMethod.GET,
                defaultHeaders(),
                null
//                apiRequest
        );
        var apiResponse = jsonAdapter.convertValue(result, BoardAuthApiResponse.class);
        return WrtnChatApiResponseMapper.toInternalResponse(apiResponse);
    }


    // SSE ??? ??
    @Override
    public Disposable startChatStream(
            String conversationId,
            SendMessageApiRequest body,
            Consumer<String> onChunk,
            Consumer<Throwable> onError,
            Runnable onComplete
    ) {

        log.info("jsonAdapter={}", jsonAdapter.getClass().getName());

        // ??? ?? ?? ??
        Timestamp requestDt = new Timestamp(System.currentTimeMillis());
        long startTime = System.currentTimeMillis();

        var requestHeaders = new HashMap<String, String>();
        requestHeaders.put("Accept", MediaType.TEXT_EVENT_STREAM_VALUE);
        requestHeaders.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);

        var requestBody = jsonAdapter.toJson(body);
        var userId = body.getUserId();

        // ?? ?? ?? (?? ???)
        List<Map<String, Object>> fileInfoList = extractFileInfoFromRequest(body);

        // ??? chunk ??? ?? StringBuilder
        StringBuilder responseBodyBuilder = new StringBuilder();

        var dynamicHeaders = new HttpHeaders();
        hyobeeChatApiClient.injectStreamAuthorizationHeader(dynamicHeaders);

        var webClient = wrtnWebClient;

        var callUrl = "/api/v1/conversations/" + conversationId
                + "/ai-chat?web_search_enabled=" + body.getWebSearchEnabled();
        log.info("SSE callUrl={} (conversationId={}, userId={}, webSearchEnabled={})", callUrl, conversationId, body.getUserId(), body.getWebSearchEnabled());

        return webClient.post()
                .uri(callUrl)
                .headers(h -> {
                    h.setAccept(List.of(MediaType.TEXT_EVENT_STREAM));
                    h.setContentType(MediaType.APPLICATION_JSON);
                    h.addAll(dynamicHeaders);
                })
                // Map?? ??? WebClient/MessageWriter ??? ?? ??? ??? ?? ? ??,
                // ?? ??? JSON String? ??? ???.
                .body(BodyInserters.fromValue(requestBody))
                .retrieve()
                .bodyToFlux(String.class)
                .subscribe(
                        chunk -> {
                            if (chunk == null || chunk.trim().isEmpty()) {
                                return;
                            }

                            // chunk 내용을 누적 (안전한 파싱) — toMap은 POJO 변환용, JSON 문자열은 fromJson 사용
                            try {
                                Map<String, Object> chunkMap = jsonAdapter.fromJson(
                                        chunk.trim(),
                                        new TypeReference<>() {
                                        }
                                );
                                if (chunkMap != null && "error".equals(chunkMap.get("status"))) {
                                    Object errDetail = chunkMap.get("message");
                                    if (errDetail == null) {
                                        errDetail = chunkMap.get("error");
                                    }
                                    String errMsg = errDetail != null ? String.valueOf(errDetail) : chunk.trim();
                                    log.error(
                                            "SSE upstream error status ??: conversationId={}, callUrl={}, payload={}",
                                            conversationId, callUrl, errMsg
                                    );
                                }
                                // response_chunk? ?? ?? (???)
                                if (chunkMap != null && "response_chunk".equals(chunkMap.get("status"))) {
                                    Object text = chunkMap.get("text");
                                    if (text != null) {
                                        responseBodyBuilder.append(text);
                                    }
                                }
                            } catch (Exception e) {
                                log.debug("SSE chunk JSON 파싱 실패, 원본 저장: conversationId={}, chunk={}", conversationId, chunk.trim(), e);
                                responseBodyBuilder.append(chunk).append("\n");
                            }

                            onChunk.accept(chunk);
                        },
                        error -> {
                            long responseTime = System.currentTimeMillis() - startTime;

                            var accumulatedResponse = responseBodyBuilder.toString();
                            chatLogService.saveStreamApiLog(
                                    hyobeeChatApiClient.getUrl(),
                                    callUrl,
                                    requestBody,
                                    requestHeaders,
                                    userId,
                                    requestDt,
                                    responseTime,
                                    "FAIL",
                                    error.getMessage() != null ? error.getMessage() : "",
                                    accumulatedResponse,
                                    fileInfoList
                            );
                            
                            onError.accept(error);
                        },
                        () -> {
                            long responseTime = System.currentTimeMillis() - startTime;

                            var accumulatedResponse = responseBodyBuilder.toString();
                            chatLogService.saveStreamApiLog(
                                    hyobeeChatApiClient.getUrl(),
                                    callUrl,
                                    requestBody,
                                    requestHeaders,
                                    userId,
                                    requestDt,
                                    responseTime,
                                    "SUCCESS",
                                    null,
                                    accumulatedResponse,
                                    fileInfoList
                            );
                            
                            onComplete.run();
                        }
                );
    }

    // ?? ??
    @Override
    public StopMessageApiResponse interrupt(StopMessageApiRequest request) throws JsonProcessingException {
        var callUrl = "/api/v1/conversations/" + request.getConversationId()
                + "/messages/" + request.getMessageId()
                + "/interrupt?user_id=" + request.getUserId();

        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.POST,
                defaultHeaders(),
                request
        );

        return jsonAdapter.convertValue(result, StopMessageApiResponse.class);
    }

    private Map<String, String> defaultHeaders() {
        return Map.of(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
    }

    /**
     * body?? ?? ?? ??
     */
    private List<Map<String, Object>> extractFileInfoFromRequest(SendMessageApiRequest body) {
        List<Map<String, Object>> fileInfoList = new java.util.ArrayList<>();
        
        if (body == null) {
            return fileInfoList;
        }

        // files ??? ?? ?? ??
        var files = body.getFiles();
        if (files != null) {
            for (AttachFileInfo attachFileInfo : files) {
                var fileInfo = new HashMap<String, Object>();
                
                // filename?? UUID ?? ?? (uuid/??? -> ???)
                var filename = attachFileInfo.getFilename();
                if (filename != null && filename.contains("/")) {
                    filename = filename.substring(filename.lastIndexOf("/") + 1);
                }
                fileInfo.put("fileName", filename);
                fileInfo.put("fileType", attachFileInfo.getMimeType());
                fileInfo.put("fileSize", attachFileInfo.getSize());
                // thumbnail_id? fileLogKey? ?? (?? ??? ? ??? UUID)
                if (attachFileInfo.getThumbnailId() != null) {
                    fileInfo.put("fileLogKey", attachFileInfo.getThumbnailId());
                }

                if (fileInfo.containsKey("fileName") && fileInfo.get("fileName") != null) {
                    fileInfoList.add(fileInfo);
                }
            }
        }

        return fileInfoList;
    }

    private String getSourceFilter(String inputData) {
        if (inputData == null || inputData.isEmpty()) {
            return inputData;
        }
        var mapper = new ObjectMapper();
        String updatedInput = inputData;
        int searchStart = 0;

        while (true) {
            int startIndex = updatedInput.indexOf("[{", searchStart);
            if (startIndex < 0) {
                break;
            }

            int endMarker = updatedInput.indexOf("}]", startIndex);
            if (endMarker < 0) {
                break;
            }
            int endIndex = endMarker + 2;

            String jsonArrayString = updatedInput.substring(startIndex, endIndex);
            try {
                JsonNode arrayNode = mapper.readTree(jsonArrayString);
                if (!arrayNode.isArray()) {
                    searchStart = endIndex;
                    continue;
                }

                var filteredArray = mapper.createArrayNode();
                for (JsonNode objNode : arrayNode) {
                    var filteredObj = mapper.createObjectNode();
                    filteredObj.put("source_type", objNode.path("source_type").asText());
                    filteredObj.put("source_title", objNode.path("source_title").asText());
                    filteredObj.put("display_title", objNode.path("display_title").asText());

                    var docType = objNode.path("doc_type").asText(null);
                    var sourceType = objNode.path("source_type").asText();
                    var boardId = ("internal".equalsIgnoreCase(docType) || "internal".equalsIgnoreCase(sourceType))
                            ? objNode.path("board_id").asText(null)
                            : null;

                    var url = DocumentLinkBuilder.resolveSourceUrl(
                            sourceType,
                            docType,
                            objNode.path("source_id").asText(null),
                            boardId,
                            objNode.path("url").asText()
                    );

                    filteredObj.put("url", url);
                    filteredArray.add(filteredObj);
                }

                String filteredJsonString = mapper.writeValueAsString(filteredArray);
                updatedInput = updatedInput.substring(0, startIndex) + filteredJsonString + updatedInput.substring(endIndex);
                searchStart = startIndex + filteredJsonString.length();
            } catch (Exception ignore) {
                searchStart = endIndex;
            }
        }

        return updatedInput;
    }

    //****** ???? ****************************************************************************//
    // feedback (DTO ??)
    @Override
    public FeedbackResponse feedback(String conversationId, String messageId, String userId, FeedbackRequest request) {
        var callUrl = "/api/v1/conversations/" + conversationId + "/messages/" + messageId + "/feedback?user_id=" + userId;
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.PUT,
                defaultHeaders(),
                apiRequest
        );

        return jsonAdapter.convertValue(result, FeedbackResponse.class);
    }

    // ??? ?? (DTO ??)
    @Override
    public FeedbackResponse deleteFeedback(String conversationId, String messageId, String userId, String feedbackId) {
        var callUrl = String.format("/api/v1/conversations/%s/messages/%s/feedback/%s?user_id=%s", conversationId, messageId, feedbackId, userId);
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.DELETE,
                defaultHeaders(),
                null
        );

        return jsonAdapter.convertValue(result, FeedbackResponse.class);
    }

    @Override
    public MessageSourcesResponse selectMessageSources(String conversationId, String messageId, MessageSourcesRequest request) {
        var callUrl = String.format("/api/v1/conversations/%s/messages/%s/sources", conversationId, messageId);
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        var queryParams = WrtnRequestMapper.toNonEmptyQueryParams(jsonAdapter, apiRequest);
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                queryParams
        );

        var apiResponse = jsonAdapter.convertValue(result, MessageSourcesApiResponse.class);
        return WrtnRndApiResponseMapper.toInternalResponse(apiResponse);
    }

    @Override
    public JournalsResponse selectJournals(JournalsRequest request) {
        var callUrl = "/api/v2/rnd/journal";
        var apiRequest = WrtnRequestMapper.toApiRequest(request);
        log.info(String.valueOf(request));
        var queryParams = WrtnRequestMapper.toNonEmptyQueryParams(jsonAdapter, apiRequest);
        log.info(String.valueOf(queryParams));

        var result = hyobeeChatApiClient.callApiOrThrowWithViewableTeam(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                queryParams
        );

        JournalsApiResponse apiResponse = jsonAdapter.convertValue(result, JournalsApiResponse.class);
        return WrtnRndApiResponseMapper.toInternalResponse(apiResponse);
    }

    // ?? ?? ??? ??
    @Override
    public JournalDetailResponse selectJournalDetail(String journalId) {
        var callUrl = String.format("/api/v2/rnd/journal/%s", journalId);

        var detailRequest = JournalDetailRequest.of(journalId);
        var queryParams = WrtnRequestMapper.toNonEmptyQueryParams(jsonAdapter, detailRequest);
        log.info("?? ?? ?? ID: {}, Params: {}", journalId, queryParams);

        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                queryParams
        );

        JournalDetail journalDetail = jsonAdapter.convertValue(result, JournalDetail.class);
        if (result != null) {
            var rawImageUrl = String.valueOf(result.getOrDefault("image_url", journalDetail.getImageUrl()));
            if (!"null".equalsIgnoreCase(rawImageUrl) && rawImageUrl != null) {
                // JSON escape ?? ???(\u003d, \u0026, \u002f)? URL encoding(%xx)? ?? ???
                var normalizedImageUrl = rawImageUrl
                        .replace("\\u003d", "=")
                        .replace("\\u0026", "&")
                        .replace("\\u002f", "/");
                try {
                    normalizedImageUrl = URLDecoder.decode(normalizedImageUrl, StandardCharsets.UTF_8);
                } catch (IllegalArgumentException ignore) {
                    // ?? decode? URL??? ??? ??? ????? ?? ??
                }
                journalDetail.setImageUrl(normalizedImageUrl);
            }
        }
        return JournalDetailResponse.of(journalDetail);
    }

    // ?? ?? ??? ?? - ?? ??
    @Override
    public JournalRelatedItemsResponse selectJournalRelatedItems(String journalId) {
        var callUrl = String.format("/api/v2/rnd/journal/%s/related-items", journalId);
        var request = JournalRelatedItemsRequest.of(journalId);
        var queryParams = WrtnRequestMapper.toNonEmptyQueryParams(jsonAdapter, request);
        log.info("???? ?? ????: {}", queryParams);

        // 3. ????? ??
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                queryParams
        );

        // 4. ?? ?? (JSON -> API ?? DTO -> ?? ??? DTO)
        // ?? result ??? JSON? 1:1??? ?? JournalRelatedItemsResponse? ?? ?????.
        return objectMapper.convertValue(result, JournalRelatedItemsResponse.class);
    }

    @Override
    public JournalAiSummaryApiResponse selectJournalAiSummary(String journalId) {
        var callUrl = String.format("/api/v2/rnd/journal/%s/ai-summary", journalId);
        // 3. ????? ??
        var result = hyobeeChatApiClient.callApiOrThrow(
                callUrl,
                HttpMethod.GET,
                defaultHeaders(),
                null
        );

        return jsonAdapter.convertValue(result, JournalAiSummaryApiResponse.class);
    }
}


