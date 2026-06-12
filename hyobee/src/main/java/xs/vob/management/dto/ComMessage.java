package xs.vob.management.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ComMessage {

	private String languageCode;

	private String messageId;

	private String messageContents;

	private String messageSectionCode;

	private String useAt;

	private String firstCreateUserId;

	private String lastUpdateUserId;

	private Timestamp createDt;

	private Timestamp updateDt;

	public ComMessage(String languageCode, String messageId, String messageContents) {
		this.languageCode       = languageCode;
		this.messageId          = messageId;
		this.messageContents    = messageContents;
	}

	public ComMessage(String languageCode, String messageId, String messageContents, String messageSectionCode, String useAt) {
		this.languageCode       = languageCode;
		this.messageId          = messageId;
		this.messageContents    = messageContents;
		this.messageSectionCode = messageSectionCode;
		this.useAt              = useAt;
	}
}
