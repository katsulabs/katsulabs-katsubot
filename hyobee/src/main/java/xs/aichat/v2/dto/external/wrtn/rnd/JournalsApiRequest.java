package xs.aichat.v2.dto.external.wrtn.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "of")
public class JournalsApiRequest {

    private String start_date;

    private String end_date;

    private String doc_types;

    private String keyword;

    private String author;

    private String unique_number;

    private String journal_number;

    private String sort_by;

    private int page;

    private int size;
}
