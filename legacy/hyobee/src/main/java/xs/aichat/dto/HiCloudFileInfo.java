package xs.aichat.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * HiCloud 파일 정보 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HiCloudFileInfo {
    
    /**
     * 파일 ID
     */
    private String fileId;
    
    /**
     * 파일명
     */
    private String fileName;
    
    /**
     * 다운로드 URL
     */
    @JsonProperty("downloadUrl")
    @JsonAlias({"downLoadUrl", "download_url"})
    private String downLoadUrl;
    
    /**
     * 파일 크기 (bytes)
     */
    @JsonDeserialize(using = LenientLongDeserializer.class)
    private Long fileSize;
}


