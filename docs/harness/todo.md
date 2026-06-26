# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **IN PROGRESS — Phase 0** | Phase 0 DoD (아래) |

## Phase 0 (진행 중)

- [x] 0-1 모노레포 디렉터리 스캐폴딩
- [x] 0-2 `src/` → `legacy/hyobee/` 이동
- [x] 0-3 chat-api Boot 4.1 skeleton (`./gradlew :services:chat-api:test` PASS)
- [x] 0-4 chat-web Vite+React+TS (`npm test && npm run build` PASS)
- [x] 0-5 docker-compose (Postgres + dummy-rag)
- [x] 0-6 GitHub Actions 3종
- [x] 0-7 JDK 25 Gradle / Node 22 로컬 검증

브랜치: `feature/KC-007-modernization-phase0-scaffold`

## Phase 1 (다음)

- [ ] OpenAPI + auth-bridge
- [ ] MVP 채팅 + Dummy RAG SSE E2E

## 보류

| 항목 | 상태 |
|------|------|
| Secrets | 배포 전 (`katsubot-secrets-prep`) |
