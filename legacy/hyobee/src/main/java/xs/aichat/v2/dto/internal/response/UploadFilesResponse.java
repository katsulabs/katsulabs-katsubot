package xs.aichat.v2.dto.internal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadFilesResponse {

    private boolean success;

    private int totalCount;

    private int successCount;

    private int failCount;

    private List<UploadFileItem> fileInfo;

    private String message;

    private List<String> errors;

    public static UploadFilesResponse initialize() {
        return new UploadFilesResponse();
    }

    public static UploadFilesResponse of(boolean success, int totalCount, int successCount, int failCount, List<UploadFileItem> fileInfo) {
        return new UploadFilesResponse(success, totalCount, successCount, failCount, fileInfo, null, null);
    }
}

