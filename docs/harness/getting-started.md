# 시작 가이드

Katsulabs Chatbot 하네스 온보딩입니다.

## 1) 5분 설치

1. **[KC-000-project-conventions.md](./KC-000-project-conventions.md)** 읽기
2. 브랜치: `feature/KC-{id}-{feature}` (예: `feature/KC-007-modernization-phase0-scaffold`)
3. `.cursor/rules/*`, `.cursor/skills/katsubot-*` 확인
4. `docs/harness/todo.md` 활성 티켓 확인

## 2) 첫 구현 요청 (Main 오케스트레이터)

- [ ] `KC-000` · `todo.md` · Epic 문서 확인
- [ ] worktree 준비 (`katsubot-worktree-ticket`)
- [ ] `[KC-xxx][Role]` 태그 분배 (`katsubot-ticket-kickoff`)

## 3) 테스트 게이트

| 모듈 | 명령 |
|------|------|
| chat-api | `cd services/chat-api && ./gradlew test` |
| chat-web | `cd apps/chat-web && pnpm test && pnpm build` |
| legacy | `cd legacy/hyobee && mvn test` (터치 시) |

## 4) 온보딩 체크리스트

- [ ] KC-000 숙지
- [ ] [KC-007-work-plan.md](../modernization/KC-007-work-plan.md) Phase DoD 확인
- [ ] `katsubot-subagent-handoff` fallback 리허설
