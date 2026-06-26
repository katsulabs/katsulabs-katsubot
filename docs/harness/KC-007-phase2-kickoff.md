# [KC-007-modernization] Phase 2 Kickoff

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization — Phase 2 대화·Strangler |
| 상태 | **완료** — PR [#2](https://github.com/katsulabs/katsulabs-chatbot-api/pull/2) 머지 (2026-06-26) |
| 브랜치 | `feature/KC-007-modernization-phase2-strangler` |
| worktree | `../katsubot-KC-007-phase2` |
| 선행 | Phase 1 DoD (`c225546`) — OpenAPI MVP, auth-bridge, REST/SSE, React UI |
| DoD | 기능 매트릭스 80%+ · 스테이징 proxy 1회 · legacy CI green |

## 분배

| 역할 | 산출물 | 순서 |
|------|--------|------|
| [Contract] | OpenAPI 확장, v2 parity 매트릭스, `BoardAuthPort` | **1주차 선행** |
| [Backend] | CRUD Use Case, board-auth 브릿지, Testcontainers | Contract 확정 후 |
| [Frontend] | 대화 목록·히스토리·에러 UX | OpenAPI 확정 후 |
| [QA] | proxy 스모크, G4/G5 게이트, CI | Backend·Frontend 병행 |

태그: `[KC-007-modernization][Contract|Backend|Frontend|QA]`

## v2 → v1 기능 매트릭스 (초안)

레거시 기준: `legacy/hyobee/.../HyobeeChatController.java` (`/xs/aichat/v2/**`)

| 레거시 v2 | 신규 `/api/v1` | Phase 2 | 비고 |
|-----------|----------------|---------|------|
| `POST /conversation` | `POST /conversations` | ✅ Phase 1 | |
| `GET /conversations` | `GET /conversations` | ✅ P2 | JWT 기반 목록 |
| `DELETE /conversations` | `DELETE /conversations` | ✅ P2 | body `conversation_ids` |
| `GET /messages` | `GET /conversations/{id}/messages` | ✅ P2 | `cursor`/`size` 쿼리 |
| `PUT .../feedback` | `PUT .../messages/{id}/feedback` | ✅ P2 | `like`/`dislike` |
| `DELETE .../feedback/{id}` | `DELETE .../feedback/{id}` | ✅ P2 | 논리 삭제 |
| `GET /board-auth` | `GET /board-auth` | ✅ P2 | `BoardAuthPort` Stub |
| SSE `/stream/**` | `POST .../messages` (SSE) | ✅ Phase 1 | |
| `uploadFile` / `uploadFiles` / `cloudAttach` | — | ⏸ Phase 3+ | 파일·HiCloud |
| `PUT /session/jwt-team-code` | — | ⏸ | 세션·팀 전환 — auth-bridge 보강 시 |
| `GET /healthCheck.json` | `/actuator/health` | ✅ | 벤더 health는 별도 |

**Phase 2 목표:** 위 표에서 ⬜ 5건 + 🟡 보강 → **80%+** (G4)

## Contract 선행 (2-C1 ~ 2-C3)

- [x] **2-C1** `openapi.yaml` — delete, messages list, feedback paths·스키마 (v0.2.0)
- [x] **2-C2** `BoardAuthPort` + `docs/modernization/board-auth-bridge.md`
- [x] **2-C3** v2 parity 매트릭스 확정 (`docs/modernization/v2-parity-matrix.md`)

## Backend (2-B1 ~ 2-B5)

- [x] **2-B1** `DeleteConversationsUseCase` + `DELETE /api/v1/conversations`
- [x] **2-B2** `ListMessagesUseCase` + `GET /api/v1/conversations/{id}/messages`
- [x] **2-B3** `UpsertFeedbackUseCase`, `DeleteFeedbackUseCase`
- [x] **2-B4** `StubBoardAuthAdapter` (`BoardAuthPort`)
- [x] **2-B5** Testcontainers — Postgres + API 통합 테스트 (`ChatApiJpaIntegrationTest`)

## Frontend (2-F1 ~ 2-F3)

- [x] **2-F1** 대화 목록 사이드바 (TanStack Query, `GET /conversations`)
- [x] **2-F2** 대화 선택 시 히스토리 로드
- [x] **2-F3** 401/403/네트워크 에러 UX (재시도·로그인 안내)

## Infra / Strangler (2-I1)

- [x] **2-I1** Reverse proxy — `infra/nginx/strangler.conf.template`, `docker-compose.strangler.yml`, [phase2-proxy-smoke.md](./phase2-proxy-smoke.md)

## QA (2-Q1 ~ 2-Q2)

- [x] **2-Q1** `scripts/smoke-phase2.sh` — CRUD + proxy 경로
- [x] **2-Q2** G4/G5 — [phase2-smoke-results.md](./phase2-smoke-results.md)

## 게이트

| 게이트 | 기준 |
|--------|------|
| G4 | v2 parity 매트릭스 80%+ Contract·QA 서명 |
| G5 | SSE 5분 연결 스모크 PASS |
| 모듈 | `./gradlew test` · `pnpm test` · `pnpm build` · legacy `mvn test` (터치 시) |

## 병렬 착수 조건

- worktree: `../katsubot-KC-007-phase2` (본 브랜치만 커밋)
- `services/chat-api/**` vs `apps/chat-web/**` 비중첩 병렬 가능
- OpenAPI·Port는 Contract 머지/확정 후 Backend·Frontend 착수

## 즉시 액션

Phase 2 완료. 다음: [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md)
