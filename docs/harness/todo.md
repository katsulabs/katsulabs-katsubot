# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **IN PROGRESS — Phase 2** | [KC-007-modernization-plan.md](../KC-007-modernization-plan.md) §5 Phase 2 |

## Phase 0 (완료 · main)

- [x] 모노레포 스캐폴딩, legacy 이동, CI 3종
- [x] RAG 외부 클라이언트 Port (`docs/rag-external-client.md`)

**머지:** PR [#1](https://github.com/katsulabs/katsulabs-chatbot-api/pull/1) → `c225546`

## Phase 1 (완료 · main)

- [x] OpenAPI, auth-bridge, MVP 채팅 REST/SSE, React UI
- [x] JWT 보강, Flyway V1 + JPA 프로필, smoke 스크립트
- [x] PR [#1](https://github.com/katsulabs/katsulabs-chatbot-api/pull/1) 머지 (2026-06-26)

참고: [KC-007-phase1-kickoff.md](./KC-007-phase1-kickoff.md) · [phase1-local-smoke.md](./phase1-local-smoke.md)

## Phase 2 (진행 중)

브랜치: `feature/KC-007-modernization-phase2-strangler`  
worktree: `../katsubot-KC-007-phase2`  
킥오프: [KC-007-phase2-kickoff.md](./KC-007-phase2-kickoff.md)

**Contract**

- [x] 2-C1 OpenAPI — delete, messages, feedback (v0.2.0)
- [x] 2-C2 `BoardAuthPort` + board-auth 브릿지 문서
- [x] 2-C3 v2 parity 매트릭스 확정

**Backend**

- [x] 2-B1 대화 삭제 Use Case·API
- [x] 2-B2 메시지 히스토리 조회
- [x] 2-B3 피드백 PUT/DELETE
- [x] 2-B4 board-auth Stub Adapter
- [x] 2-B5 Testcontainers 통합 테스트

**Frontend**

- [x] 2-F1 대화 목록 UI
- [x] 2-F2 히스토리 로드
- [x] 2-F3 에러 UX

**Infra / QA**

- [x] 2-I1 Reverse proxy (`/api/v1/**` → chat-api)
- [x] 2-Q1 smoke-phase2.sh
- [ ] 2-Q2 G4/G5 (G5: `SSE_LONG_SECONDS=300` 수동)

## 보류

| 항목 | 상태 |
|------|------|
| Secrets | 배포 전 (`katsubot-secrets-prep`) |
