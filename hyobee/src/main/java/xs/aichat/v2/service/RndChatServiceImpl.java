package xs.aichat.v2.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.rnd.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;
import xs.aichat.v2.external.ChatVendorClient;

@Slf4j
@Service
public class RndChatServiceImpl implements RndChatService {

    private final ChatVendorClient chatVendorClient; // 챗봇 벤더 연동 추상화 (현재 구현: WrtnChatVendorClient)

	private final ChatUserService chatUserService;

    public RndChatServiceImpl(@Qualifier("wtrnChatVendorClientV2") ChatVendorClient chatVendorClient,
							  ChatUserService chatUserService) {
        this.chatVendorClient = chatVendorClient;
		this.chatUserService = chatUserService;
    }

	@Override
	public MessageSourcesResponse selectMessageSources(
			String conversationId,
			String messageId,
			MessageSourcesRequest request
	) {
		return chatVendorClient.selectMessageSources(conversationId, messageId, request);
	}

	@Override
	public JournalsResponse selectJournals(JournalsRequest request) {
		log.info(request.toString());
		return chatVendorClient.selectJournals(request);
	}

	@Override
	public JournalDetailResponse selectJournalDetail(String request) {
		return chatVendorClient.selectJournalDetail(request);
	}

	@Override
	public JournalRelatedItemsResponse selectJournalRelatedItems(String journalId) {
		return chatVendorClient.selectJournalRelatedItems(journalId);
	}

	@Override
	public JournalAiSummaryResponse selectJournalAiSummary(String journalId, String docType) {
		var apiResponse = chatVendorClient.selectJournalAiSummary(journalId);
		var aiSummaryApiItem = apiResponse != null ? apiResponse.getAiSummary() : null;
		return JournalAiSummaryResponse.from(docType, aiSummaryApiItem);
	}

	@Override
	public JsonDataWrapper<ApiResponse<Team>> selectViewableTeams(
			User user,
			String languageCode,
			String loginDeptName
	) {
		var viewableTeams = chatUserService.findViewableTeamsById(user.getUserId(), languageCode);
		if (viewableTeams.isEmpty()) {
			var fallbackName = StringUtils.hasText(loginDeptName)
					? loginDeptName
					: user.getTeamName();
			viewableTeams.add(Team.of(user.getTeamCode(), fallbackName));
		}

		var apiResponse = new ApiResponse<Team>();
		apiResponse.setHeader(null); // 헤더는 ApiResponseAdvice에서 채움
		apiResponse.setData(viewableTeams);

		return new JsonDataWrapper<>(apiResponse);
	}
}