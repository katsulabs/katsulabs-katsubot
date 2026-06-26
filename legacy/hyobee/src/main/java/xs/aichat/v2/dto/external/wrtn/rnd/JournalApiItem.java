package xs.aichat.v2.dto.external.wrtn.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JournalApiItem {

    private String id;

    @JsonProperty("doc_type")
    private String docType;

    @JsonProperty("doc_type_label")
    private String docTypeLabel;

    private String title;

    private String overview;

    private String content;

    private String author;

    @JsonProperty("source_table")
    private String sourceTable;

    @JsonProperty("source_info")
    private String sourceInfo;

    private String date;

    private String url;

    @JsonProperty("domain_url")
    private String domainUrl;

    @JsonProperty("media_name")
    private String mediaName;

    @JsonProperty("news_main_topic")
    private String newsMainTopic;

    @JsonProperty("source_id")
    private String sourceId;

    @JsonProperty("ai_summary")
    private JournalApiAiSummary aiSummary;

    private List<String> keywords;

    private String applicant;

    private String inventor;

    @JsonProperty("registration_number")
    private String registrationNumber;

    @JsonProperty("application_number")
    private String applicationNumber;

    @JsonProperty("application_date")
    private String applicationDate;

    @JsonProperty("patent_status")
    private String patentStatus;

    private String claims;

    @JsonProperty("publication_number")
    private String publicationNumber;

    @JsonProperty("publication_date")
    private String publicationDate;

    @JsonProperty("registration_date")
    private String registrationDate;

    @JsonProperty("priority_info")
    private String priorityInfo;

    @JsonProperty("claim_count")
    private String claimCount;

    @JsonProperty("rights_holder")
    private String rightsHolder;

    @JsonProperty("representative_claim")
    private String representativeClaim;

    @JsonProperty("patent_ai_summary")
    private String patentAiSummary;

}

