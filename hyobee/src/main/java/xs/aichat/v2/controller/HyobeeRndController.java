package xs.aichat.v2.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import xs.aichat.v2.annotation.LoggedInUser;
import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.rnd.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;
import xs.aichat.v2.service.RndChatService;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.net.URI;
import xs.aichat.v2.util.JwtSessionHelper;
import java.util.Collections;

import static xs.aichat.v2.util.DocumentLinkBuilder.buildJournalLandingJspUrl;
import static xs.aichat.v2.util.DocumentLinkBuilder.resolveInternalSourceUrl;

@Slf4j
@Validated
@CrossOrigin(
        origins = {
                "http://itxvob.hyosung.com:8080",
                "https://c-cubedev.hyosung.com",
                "https://ax-api-gateway.wrtn.ai/hyosung-groupware-chatbot",
                "https://ax-api-gateway.wrtn.ai/hsgc-demo"
        },
        allowCredentials = "true"
)  // 또는 특정 도메인
@RestController
@RequestMapping("/xs/aichat/v2/rnd")
@RequiredArgsConstructor
public class HyobeeRndController {

	private final RndChatService rndChatService;

	@GetMapping(value = "/conversations/{conversationId}/messages/{messageId}/sources")
	public JsonDataWrapper<ApiResponse<MessageSourceItem>> messageSources(
			@PathVariable String conversationId,
			@PathVariable String messageId,
			@Valid MessageSourcesRequest request
	) {
		var response = rndChatService.selectMessageSources(conversationId, messageId, request);
		var rows = response.getContent() != null ? response.getContent() : Collections.<MessageSourceItem>emptyList();

		var header = new ApiResponse.Header();
		header.setErrorFlag(false);
		header.setErrorCode("");
		header.setErrorMsg("");
		header.copyPagingFrom(response, rows.size());

		return new JsonDataWrapper<>(new ApiResponse<>(header, rows));
	}

	@GetMapping(value = "/journals")
	public JsonDataWrapper<ApiResponse<JournalItem>> journals(JournalsRequest request) {
		var response = rndChatService.selectJournals(request);
		var rows = response.getContent() != null ? response.getContent() : Collections.<JournalItem>emptyList();

		var header = new ApiResponse.Header();
		header.setErrorFlag(false);
		header.setErrorCode("");
		header.setErrorMsg("");
		header.copyPagingFrom(response, rows.size());

		return new JsonDataWrapper<>(new ApiResponse<>(header, rows));
	}

	// 저널 상세 페이지 조회
	@GetMapping(value = "/journal/{journalId}")
	public JournalDetailResponse journalDetail(@PathVariable String journalId) {
		return rndChatService.selectJournalDetail(journalId);
	}

	// 저널 상세 페이지 조회 - 연관 저널
	@GetMapping(value = "/journal/{journalId}/related-items")
	public JournalRelatedItemsResponse selectJournalRelatedItems(@PathVariable String journalId) {
		// 서비스에서 바로 DTO를 받아 리턴
		return rndChatService.selectJournalRelatedItems(journalId);
	}

	// 저널 AI 요약 조회
	@GetMapping(value = "/journal/{journalId}/ai-summary")
	public JournalAiSummaryResponse selectJournalAiSummary(
			@PathVariable String journalId,
			@RequestParam("doc_type") String docType
	) {
		return rndChatService.selectJournalAiSummary(journalId, docType);
	}

	// 문서 타입/저널 ID 기반 상세 JSP 새창 랜딩
	@GetMapping(value = "/journals/{journalId}/landing")
	public ResponseEntity<Void> journalLanding(
			@PathVariable String journalId,
			@RequestParam("docType") String docType,
			@RequestParam(value = "boardId", required = false) String boardId
	) {
		if ("internal".equalsIgnoreCase(docType)) {
			String redirectUrl = resolveInternalSourceUrl(journalId, boardId, null);
			if (redirectUrl != null && redirectUrl.startsWith("http")) {
				return ResponseEntity.status(HttpStatus.FOUND)
						.location(URI.create(redirectUrl))
						.build();
			}
			throw new IllegalArgumentException("사내 게시판 링크를 생성할 수 없습니다.");
		}

		String redirectUrl = buildJournalLandingJspUrl(docType, journalId);
		return ResponseEntity.status(HttpStatus.FOUND)
				.location(URI.create(redirectUrl))
				.build();
	}

	// 다중 권한 대상 팀 정보
	@GetMapping(value = "/viewable-teams")
	public JsonDataWrapper<ApiResponse<Team>> viewableTeams(
			@LoggedInUser User user,
			HttpSession session
	) {
		return rndChatService.selectViewableTeams(
				user,
				JwtSessionHelper.resolveLanguageCode(session),
				JwtSessionHelper.resolveLoginDeptName(session)
		);
	}
}
