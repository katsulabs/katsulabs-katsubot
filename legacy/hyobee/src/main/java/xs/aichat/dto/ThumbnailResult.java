package xs.aichat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ThumbnailResult {

    private String thumbnailId;

    private String thumbnailUrl;

    private String thumbnailBase64;
}


