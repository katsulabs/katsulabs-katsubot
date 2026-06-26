# 하네스 워크플로

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)

## 원칙

- `main`에 기능 커밋 금지
- 기능당 worktree 1개 (`feature/KC-{id}-{feature}`)
- PR 전 모듈별 테스트 게이트 통과
- 머지는 no-ff

## 일일 흐름

1. 최신 `main` 기준으로 worktree 생성 (`.cursor/skills/katsubot-worktree-ticket`)
2. `[KC-xxx][Role]` 태그로 Sub-agent 분배
3. 구현 및 테스트
   - `services/chat-api`: `./gradlew test`
   - `apps/chat-web`: `pnpm test` / `pnpm build`
   - `legacy/hyobee` (전환기): `mvn test`
4. PR 생성 및 CI 확인 (`katsubot-pr-harness-gate`)
5. 승인 후 `main`에 no-ff 머지

## 커밋 메시지

- **한국어** 제목·본문
- **`Co-authored-by: Cursor <cursoragent@cursor.com>` 금지**
- 상세: `.cursor/rules/git-commit.mdc`

## API·인증 계약 변경 시

- `packages/api-contract/**`, `docs/auth-bridge.md`
- OpenAPI breaking change 검토
- 401/403·SSE 취소 동작 회귀 확인

## Hook 실패 대체

`katsubot-subagent-handoff` skill §Hook fallback 참고.

## KPI

`katsubot-kpi-weekly` skill — PR Lead Time, CI Red Rate, Reopen, Handoff Failure
