package com.katsulabs.katsubot.application;

import com.katsulabs.katsubot.infrastructure.admindb.AdminChatUser;
import com.katsulabs.katsubot.infrastructure.admindb.AdminUserRepository;
import com.katsulabs.katsubot.infrastructure.auth.AuthProperties;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "katsubot.admin-db", name = "url")
public class GetCurrentUserUseCase {

    private final AdminUserRepository adminUserRepository;
    private final AuthProperties authProperties;

    public Optional<AdminChatUser> getByUserId(String userId) {
        if (userId == null || userId.isBlank()) {
            return Optional.empty();
        }
        return adminUserRepository.findById(authProperties.companyCode(), userId);
    }
}
