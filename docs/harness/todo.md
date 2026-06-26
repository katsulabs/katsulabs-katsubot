# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **IN PROGRESS — Phase 1** | Phase 1 DoD (아래) |

## Phase 0 (완료)

- [x] 0-1 모노레포 디렉터리 스캐폴딩
- [x] 0-2 `src/` → `legacy/hyobee/` 이동
- [x] 0-3 chat-api Boot 4.1 skeleton
- [x] 0-4 chat-web Vite+React+TS
- [x] 0-5 docker-compose (Postgres + dummy-rag)
- [x] 0-6 GitHub Actions 3종
- [x] 0-7 JDK 25 Gradle / Node 22 로컬 검증
- [x] RAG 외부 클라이언트 Port (`docs/rag-external-client.md`)

브랜치: `feature/KC-007-modernization-phase0-scaffold` → `6d1ded7`

## Phase 1 (진행 중)

브랜치: `feature/KC-007-modernization-phase1-mvp`  
킥오프: [KC-007-phase1-kickoff.md](./KC-007-phase1-kickoff.md)

**Contract**

- [x] 1-C1 `packages/api-contract/openapi.yaml`
- [x] 1-C2 `docs/auth-bridge.md`
- [x] 1-C3 `RagCompletionPort` + `docs/rag-external-client.md`

**Backend**

- [x] `CreateConversationUseCase`, `SendMessageUseCase`
- [x] REST `/api/v1/conversations`, SSE messages
- [x] Bearer 필터 (dev-bypass)
- [x] Use Case·401 MockMvc 테스트
- [x] **보강** 레거시 HS512 JWT 검증 (`KATSUBOT_AUTH_JWT_SECRET`)
- [x] **보강** Flyway V1 + JPA (`SPRING_PROFILES_ACTIVE=jpa`)
- [x] **보강** 요청 검증(400), SSE 비동기 전송
- [x] **보강** `scripts/smoke-phase1.sh`, [phase1-local-smoke.md](./phase1-local-smoke.md)

**Frontend**

- [x] 채팅 UI + SSE `fetch` 스트림
- [x] Vite `/api` 프록시

**DoD 잔여**

- [x] 로컬 E2E: [phase1-local-smoke.md](./phase1-local-smoke.md) (`smoke-phase1.sh` PASS)
- [ ] PR 생성 (`katsubot-pr-harness-gate`)

## 보류

| 항목 | 상태 |
|------|------|
| Secrets | 배포 전 (`katsubot-secrets-prep`) |
