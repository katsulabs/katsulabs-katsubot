# [KC-007-modernization] Phase 3 Kickoff

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization — Phase 3+ RAG·운영 전환 |
| 선행 | Phase 2 DoD — PR [#2](https://github.com/katsulabs/katsulabs-chatbot-api/pull/2) 머지 |
| 승인 | **별도 Epic 승인 필요** (`KC-007-modernization-plan.md` §5 Phase 3+) |
| DoD | 운영 RAG 연동 · 관측성 · (선택) 레거시 축소 잔여 항목 |

## Phase 2 회고 (완료)

- OpenAPI 0.2.0, v2 parity 80%+
- Strangler proxy (`:8088`), smoke G4/G5 — [phase2-smoke-results.md](./phase2-smoke-results.md)

## Phase 3+ 범위 (작업계획서)

| ID | 작업 | 담당 | 비고 |
|----|------|------|------|
| 3-O1 | 운영 RAG 서비스 URL 확정·배포 | RAG/Infra | chat-api 밖 |
| 3-O2 | `RAG_SERVICE_BASE_URL` 전환·검증 | Backend/QA | Port 계약 유지 |
| 3-O3 | OpenTelemetry trace 연동 | Backend/Infra | RAG ↔ chat-api |
| 3-O4 | Secrets·배포 체크리스트 | QA | `katsubot-secrets-prep` |

## 선택 (Phase 2 잔여 · 별도 스코프)

| ID | 작업 | 비고 |
|----|------|------|
| 3-X1 | `board-auth` 레거시 HTTP 브릿지 | `legacy-bridge` 프로필 |
| 3-X2 | auth-bridge — React JWT handoff | redirect/postMessage |
| 3-X3 | 파일 업로드·HiCloud (`uploadFile`, `cloudAttach`) | v2 parity 확장 |

## 분배 (승인 후)

| 역할 | 산출물 |
|------|--------|
| [Contract] | RAG 운영 계약·환경 변수·breaking 없음 확인 |
| [Backend] | `RagHttpClient` 운영 URL, OTel instrumentation |
| [Frontend] | (변경 최소) 운영 API base URL |
| [QA] | E2E against 운영 RAG 스텁/스테이징, smoke 확장 |

태그: `[KC-007-modernization][Contract|Backend|Frontend|QA]`

## Definition of Ready

- [ ] Phase 3+ Epic 승인란 (`KC-007-modernization-plan.md`)
- [ ] 운영 `RAG_SERVICE_BASE_URL`·Secrets 합의
- [ ] worktree: `feature/KC-007-modernization-phase3-rag-ops`

## 즉시 액션 (승인 전)

1. Sponsor/Tech Lead — Phase 3+ 승인 요청
2. `katsubot-secrets-prep` — 배포 전 Secrets 점검
3. 승인 후 `[Contract]` — 운영 RAG URL·관측성 계약 고정

## 게이트 (초안)

| 게이트 | 기준 |
|--------|------|
| G6 | 스테이징 RAG E2E 1건 (SSE + 히스토리) |
| G7 | OTel trace RAG ↔ chat-api 상관 ID 확인 |

## 참고

- [rag-external-client.md](../rag-external-client.md)
- [KC-007-modernization-plan.md](../KC-007-modernization-plan.md)
- [v2-parity-matrix.md](../modernization/v2-parity-matrix.md)
