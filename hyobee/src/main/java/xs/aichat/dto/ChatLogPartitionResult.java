package xs.aichat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import xs.aichat.enumeration.ChatApiLogPartitionStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatLogPartitionResult {

    private String partitionName;

    // 함수의 status -> enum 으로 변환(EXISTS / CREATED / ERROR)
    private ChatApiLogPartitionStatus status;

    private String message;

    public boolean isSuccess() {
        return status == ChatApiLogPartitionStatus.CREATED;
    }
}