# 하네스 워크플로

## 원칙

- `main`에 기능 커밋 금지
- 기능당 worktree 1개
- PR 전 테스트 게이트 통과
- 머지는 no-ff
- 인증/세션 영향 변경은 로그인 플로우 회귀 확인 필수

## 일일 흐름

1. 최신 `main` 기준으로 worktree 생성
2. 티켓 태그 기준 Sub-agent 분배
3. 구현 및 테스트(`mvn test`)
4. PR 생성 및 CI 확인
5. 승인 후 `main`에 no-ff 머지

## 커밋 메시지

- **한국어** 제목·본문 (prefix·티켓 태그·고유명사는 예외)
- **`Co-authored-by: Cursor <cursoragent@cursor.com>` 금지**
- 상세: `.cursor/rules/git-commit.mdc`

## 인증 흐름 변경 시 추가 체크

아래 경로를 건드리면 PR에 흐름 영향도를 남깁니다.

- `xs/webbase/login/**` (일반 로그인)
- `xs/aichat/controller/HyobeeSSOController`
- `xs/aichat/service/HyobeeSSOServiceImpl`
- `xs/aichat/config/HyobeePagePaths`
- `src/main/webapp/**/login.jsp`, `src/main/webapp/**/main.jsp` (및 레거시 redirect stub)
- `xs/core/config/XtrmHandlerInterceptor`
- `xs/core/config/HyobeeApiInterceptor`
- `xs/core/config/XtrmSecurityConifg`
- `xs/vob/management/AuthPagePreload`

기본 확인 항목:

1. 정상 로그인/SSO 경로 유지
2. 세션 필수 키(`USER_ID`, `AUTH_MENU_INFO`) 누락 없음
3. 권한 거부 시 응답 코드/메시지 회귀 없음

## Hook 실패 대체 런북

Hook이 비활성/실패하면 수동으로 단계 전환합니다.

1. 태그를 유지해 다음 Sub-agent를 메인이 직접 분배
2. 직전 산출물(DTO, migration, 테스트 결과) 전달
3. QA 전환 전 backend/frontend 테스트 재확인
4. PR 본문에 fallback 사용 사유 기록

## 운영 지표(KPI)

- PR Lead Time
- CI Red Rate
- Reopen Rate
- Handoff Failure
- 인증 플로우 회귀 이슈 수
