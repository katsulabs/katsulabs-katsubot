package xs.aichat.v2.mapper;

import org.apache.ibatis.annotations.Mapper;
import xs.aichat.dto.ChatLogPartitionResult;

@Mapper
public interface ChatLogPartitionMapper {

    ChatLogPartitionResult createChatApiLogPartition();
}
