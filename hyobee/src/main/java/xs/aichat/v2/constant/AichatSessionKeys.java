package xs.aichat.v2.constant;

/**
 * AI 챗 세션 속성 키.
 * DEPT_CODE는 로그인 사용자 소속(프로필)이며, JWT_TEAM_CODE는 sidebar 콤보 선택 조회 팀(SSE 채팅·RND 저널 목록 등)이다.
 */
public final class AichatSessionKeys {

    /** sidebar 콤보 선택 팀 — SSE 채팅·RND 저널 목록 등 WRTN JWT teamCode claim */
    public static final String JWT_TEAM_CODE = "JWT_TEAM_CODE";

    /** 일반 API / WRTN 호출용 JWT (로그인 DEPT_CODE 기준) */
    public static final String JWT = "jwt";

    /** SSE 채팅 스트림 전용 JWT (JWT_TEAM_CODE 기준) */
    public static final String STREAM_JWT = "stream_jwt";

    private AichatSessionKeys() {
    }
}
