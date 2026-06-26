package xs.aichat.v2.service;

import xs.aichat.v2.dto.Team;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.dto.internal.rnd.*;
import xs.aichat.v2.dto.wrapper.ApiResponse;
import xs.aichat.v2.dto.wrapper.JsonDataWrapper;

public interface RndChatService {

    MessageSourcesResponse selectMessageSources(String conversationId, String messageId, MessageSourcesRequest request);

    JournalsResponse selectJournals(JournalsRequest request);

    JournalDetailResponse selectJournalDetail(String journalId);

    JournalRelatedItemsResponse selectJournalRelatedItems(String journalId);

    JournalAiSummaryResponse selectJournalAiSummary(String journalId, String docType);

    JsonDataWrapper<ApiResponse<Team>> selectViewableTeams(
            User user,
            String languageCode,
            String loginDeptName
    );
}
