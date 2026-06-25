package xs.aichat.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;
import java.util.UUID;

/**
 * 외부 API 송수신 로그 파일 정보 파라미터 DTO
 */
@Getter
@Builder
public class ChatLogFileParam {

    private String companyCode;

    private String logKey;

    private String fileLogKey;

    private String fileName;

    private Integer fileSize;

    private String fileType;

    private String mimeType;

    private String successYn;

    private String errorMessage;

    private String createDt;

    /**
     * fileInfo(Map) 기반 로그 파라미터 생성용 factory.
     * ChatLogService에서 builder() 필드 조립 로직을 DTO로 이동해 가독성을 높이기 위한 목적입니다.
     */
    public static ChatLogFileParam fromFileInfo(String companyCode, String logKey, Map<String, Object> fileInfo) {
        if (fileInfo == null) {
            return builder()
                    .companyCode(companyCode)
                    .logKey(logKey)
                    .build();
        }

        String fileLogKey = (String) fileInfo.get("fileLogKey");
        if (fileLogKey == null || fileLogKey.isEmpty()) {
            fileLogKey = UUID.randomUUID().toString();
        }

        String successYn = (String) fileInfo.get("successYn");
        if (successYn == null || successYn.isEmpty()) {
            successYn = "N";
        }

        String errorMessage = (String) fileInfo.get("errorMessage");

        Integer fileSize = null;
        Object sizeObj = fileInfo.get("fileSize");
        if (sizeObj != null) {
            fileSize = Integer.valueOf(String.valueOf(sizeObj));
        }

        return builder()
                .companyCode(companyCode)
                .logKey(logKey)
                .fileLogKey(fileLogKey)
                .fileName((String) fileInfo.get("fileName"))
                .fileSize(fileSize)
                .fileType((String) fileInfo.get("fileType"))
                .mimeType((String) fileInfo.get("mimeType"))
                .successYn(successYn)
                .errorMessage(errorMessage)
                .build();
    }
}

