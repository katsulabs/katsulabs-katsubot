# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **Phase 2 완료 → Phase 3 대기** | [KC-007-modernization-plan.md](../KC-007-modernization-plan.md) §5 Phase 3+ |

## Phase 0 (완료 · main)

- [x] 모노레포 스캐폴딩, legacy 이동, CI 3종
- [x] RAG 외부 클라이언트 Port (`docs/rag-external-client.md`)

**머지:** PR [#1](https://github.com/katsulabs/katsulabs-chatbot-api/pull/1) → `c225546`

## Phase 1 (완료 · main)

- [x] OpenAPI, auth-bridge, MVP 채팅 REST/SSE, React UI
- [x] JWT 보강, Flyway V1 + JPA 프로필, smoke 스크립트
- [x] PR [#1](https://github.com/katsulabs/katsulabs-chatbot-api/pull/1) 머지 (2026-06-26)

참고: [KC-007-phase1-kickoff.md](./KC-007-phase1-kickoff.md) · [phase1-local-smoke.md](./phase1-local-smoke.md)

## Phase 2 (완료 · main)

- [x] v2 parity API, board-auth Port, strangler proxy, Testcontainers, chat-web 목록 UI
- [x] G4/G5 스모크 — [phase2-smoke-results.md](./phase2-smoke-results.md)
- [x] PR [#2](https://github.com/katsulabs/katsulabs-chatbot-api/pull/2) 머지 (2026-06-26)

참고: [KC-007-phase2-kickoff.md](./KC-007-phase2-kickoff.md) · [phase2-proxy-smoke.md](./phase2-proxy-smoke.md)

## Phase 3+ (다음 · 별도 승인)

킥오프: [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md)

- [ ] Epic 승인 (RAG 고도화·운영 전환)
- [ ] 운영 RAG `RAG_SERVICE_BASE_URL` 전환
- [ ] OpenTelemetry (RAG ↔ chat-api)
- [ ] (선택) 파일 업로드·HiCloud·레거시 board-auth 브릿지

브랜치 예: `feature/KC-007-modernization-phase3-rag-ops`

## 보류

| 항목 | 상태 |
|------|------|
| Secrets | 배포 전 (`katsubot-secrets-prep`) |
