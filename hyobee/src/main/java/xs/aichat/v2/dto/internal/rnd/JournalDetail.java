package xs.aichat.v2.dto.internal.rnd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JournalDetail {

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

    private String date;
    private String url;

    @JsonProperty("domain_url")
    private String domainUrl;

    @JsonProperty("source_id")
    private String sourceId;

    @JsonProperty("source_info")
    private String sourceInfo;

    @JsonProperty("image_url")
    private String imageUrl;

    // JSON에서는 null로 오지만, 객체 구조 유지를 위해 포함
    @JsonProperty("ai_summary")
    private JournalAiSummaryApiItem aiSummary;

    private List<String> keywords;

    private String applicant; // 출원인

    private String inventor;  // 발명자

    @JsonProperty("registration_number")
    private String registrationNumber; // 등록번호

    @JsonProperty("application_number")
    private String applicationNumber; // 출원번호

    @JsonProperty("application_date")
    private String applicationDate; // 출원일자

    @JsonProperty("patent_status")
    private String patentStatus; // 특허상태 (예: 심사중)

    @JsonProperty("patent_status_en")
    private String patentStatusEn; // 특허상태 (예: 심사중)

    private String claims; // 청구항 내용

    @JsonProperty("publication_number")
    private String publicationNumber; // 공개번호

    @JsonProperty("publication_date")
    private String publicationDate; // 공개일자

    @JsonProperty("registration_date")
    private String registrationDate; // 등록일자

    @JsonProperty("priority_info")
    private String priorityInfo; // 우선권 정보

    @JsonProperty("citing_doc_count")
    private int citingDocCount; // 피인용수

    @JsonProperty("claim_count")
    private int claimCount; // 청구항 수

    @JsonProperty("rights_holder")
    private String rightsHolder; // 권리자

    @JsonProperty("representative_claim")
    private String representativeClaim; // 대표 청구항

    @JsonProperty("patent_ai_summary")
    private String patentAiSummary; // 특허 AI 요약 전문 (String 형태)

    @JsonProperty("author_names")
    private String authorNames;

    private String institution;

    @JsonProperty("cited_by_count")
    private int citedByCount;

    @JsonProperty("representative_claim_translated")
    private String representativeClaimTranslated;

    private List<JournalDetailTimeline> timeline;

    @JsonProperty("media_name")
    private String mediaName;

    @JsonProperty("news_main_topic")
    private String newsMainTopic;

    private String description;

    @JsonProperty("referenced_works_count")
    private int referencedWorksCount; // 참고 문헌수

    @JsonProperty("cited_doc_count")
    private int citedDocCount;
}