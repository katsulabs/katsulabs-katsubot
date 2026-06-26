package xs.aichat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * HiCloud 파일 다운로드 결과 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(staticName = "of")
public class HiCloudFileResult {
    
    /**
     * 원본 파일 정보 또는 다운로드 URL
     */
    private String fileInfo;
    
    /**
     * 저장된 파일 경로
     */
    private String savedPath;
    
    /**
     * 에러 메시지 또는 상태
     */
    private String errorMessage;
    
    /**
     * 서버가 발급한 저장 폴더 UUID (로컬 디스크 경로 및 채팅 스트림 {@code files} 쿼리와 동일).
     * (필드명은 하위 호환을 위해 {@code fileId}로 유지)
     */
    private String fileId;

    /**
     * {@link #fileId}와 동일 값. 클라이언트에서 "파일 키" 의미로 사용하기 쉽게 별칭 제공.
     */
    @JsonProperty("folderUuid")
    public String getFolderUuid() {
        return fileId;
    }

    /**
     * 파일명
     */
    private String filename;
    
    /**
     * 파일 크기 (옵션)
     */
    private Long fileSize;
}


