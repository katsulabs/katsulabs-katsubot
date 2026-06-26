package xs.aichat.v2.dto.common;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ComMessageLang {

	private String languageCode;

	private String messageId;

	private String messageContents;
}
