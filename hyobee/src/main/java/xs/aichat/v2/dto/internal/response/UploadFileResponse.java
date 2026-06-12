package xs.aichat.v2.dto.internal.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileResponse {

    private UploadFileItem fileInfo;

    public static UploadFileResponse initialize() {
        return new UploadFileResponse();
    }

//    public static UploadFileResponse of(boolean success, int totalCount, int successCount, int failCount, List<UploadFileItem> fileInfo) {
//        return new UploadFileResponse(success, totalCount, successCount, failCount, fileInfo, null, null);
//    }
}

