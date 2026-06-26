package xs.aichat.v2.dto.internal.rnd;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JournalDetailTimeline {

    private int idx;

    private String type;

    private String date;

    private String number;
}