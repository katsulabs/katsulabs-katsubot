package xs.aichat.v2.dto.internal.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(staticName = "of")
@AllArgsConstructor(staticName = "of")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UploadFileItem {

    private String fileUrl;

    private String originalFilename;

    private String savedFilename;

    private String filePath;

    private String extension;

    private String contentType;

    private long fileSize;

    private String folderUuid;

    private String thumbnailId;

    private String thumbnailUrl;

    private String thumbnailBase64;

    private Boolean success;

    private String message;
}