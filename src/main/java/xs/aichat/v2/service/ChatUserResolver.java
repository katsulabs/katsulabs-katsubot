package xs.aichat.v2.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import xs.aichat.v2.dto.User;
import xs.aichat.v2.exception.HyobeeException;

@Component
@RequiredArgsConstructor
public class ChatUserResolver {

    private final ChatUserService chatUserService;

    public User requireById(String userId) {
        return chatUserService.findById(userId)
                .orElseThrow(() -> new HyobeeException(
                        HttpStatus.UNAUTHORIZED.toString(),
                        "팀 정보를 불러오지 못했습니다."
                ));
    }
}
