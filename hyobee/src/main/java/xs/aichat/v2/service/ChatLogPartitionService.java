package xs.aichat.v2.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import xs.aichat.dto.ChatLogPartitionResult;
import xs.aichat.v2.mapper.ChatLogPartitionMapper;

/**
 * 채팅 API 로그 파티션 관리 서비스
 * <p>
 * 역할: 인프라/운영 관리 기능 (비즈니스 로직과 분리)
 * - 월별 파티션 자동 생성 및 관리
 * - 파티션 생성 이력 조회
 * - 파티션 정보 모니터링
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatLogPartitionService {

    private final ChatLogPartitionMapper chatLogPartitionMapper;

    /**
     * 파티션 생성 (매월 말일 자정에 실행)
     */
    @Scheduled(cron = "0 0 0 L * *")
    public void createPartitionsMonthly() {
        log.info("🔄 월별 파티션 자동 생성 시작");
        
        try {
            // 다음 달 파티션 생성
            ChatLogPartitionResult result = chatLogPartitionMapper.createChatApiLogPartition();
            if (result.isSuccess()) {
                log.info("✅ 파티션 생성 완료: {}", result);
            } else {
                log.error("❌ 파티션 생성 실패: {}", result.getMessage());
            }
        } catch (Exception e) {
            log.error("❌ 파티션 생성 중 예외 발생", e);
        }
    }
}

