package xs.aichat.v2.dto.internal.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HiCloudAttachRequest {

    /**
     * 프론트 호환을 위해 아래 두 형태를 모두 수용한다.
     * 1) 배열: [{...}, {...}]
     * 2) 문자열: "[{...}, {...}]"
     */
    private Object hiCloudFileInfos;
}
