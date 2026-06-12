package xs.aichat.v2.dto.external.wrtn.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class MessageSourcesApiRequest {

    private String user_id;

    private String doc_type;

    private String sort_by;

    private String sort_order;

    private int page;

    private int size;
}
