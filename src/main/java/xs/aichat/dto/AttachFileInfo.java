package xs.aichat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(staticName = "of")
public class AttachFileInfo {

    private String filename;

    @JsonProperty("mime_type")
    private String mimeType;

    private String content;

    private int size;
    
    @JsonProperty("thumbnail_id")
    private String thumbnailId;

}


