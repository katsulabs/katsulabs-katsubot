package xs.aichat.v2.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import xs.aichat.dto.ChatLogPartitionResult;
import xs.aichat.enumeration.ChatApiLogPartitionStatus;
import xs.aichat.v2.mapper.ChatLogPartitionMapper;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("ChatLogPartitionService 단위 테스트")
class ChatLogPartitionServiceTest {

    @Mock
    private ChatLogPartitionMapper chatLogPartitionMapper;

    @InjectMocks
    private ChatLogPartitionService service;

    @Test
    @DisplayName("월별 파티션 생성 호출 시 mapper 호출 및 예외 없이 종료")
    void createPartitionsMonthly_callsMapper() {
        ChatLogPartitionResult result = ChatLogPartitionResult.builder()
                .partitionName("2026_03")
                .status(ChatApiLogPartitionStatus.CREATED)
                .message("ok")
                .build();

        when(chatLogPartitionMapper.createChatApiLogPartition()).thenReturn(result);

        assertThatCode(() -> service.createPartitionsMonthly()).doesNotThrowAnyException();

        verify(chatLogPartitionMapper).createChatApiLogPartition();
    }
}

