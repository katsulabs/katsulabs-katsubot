package com.katsulabs.katsubot.infrastructure.admindb;

/** {@code UserMapper.findById} — JWT claim(pg/pu/corp/team) 조회 전용. */
public record AdminChatUser(
        String userId,
        String userName,
        String pgCode,
        String puCode,
        String corpCode,
        String teamCode,
        String teamName
) {
}
