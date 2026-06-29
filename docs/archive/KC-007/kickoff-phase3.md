# [KC-007-modernization] Phase 3 Kickoff

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization — Phase 3+ RAG·운영 전환 |
| 선행 | Phase 2 DoD — PR [#2](https://github.com/katsulabs/katsulabs-katsubot/pull/2) 머지 |
| 브랜치 | `feature/KC-007-modernization-phase3-rag-ops` |
| DoD | 운영 RAG 연동 스캐폴딩 · 관측성 · 레거시 브릿지(선택) |

## Phase 2 회고 (완료)

- OpenAPI 0.2.0, v2 parity 80%+
- Strangler proxy (`:8088`), smoke G4/G5 — [phase2-smoke-results.md](./phase2-smoke-results.md)

## Phase 3+ 범위

| ID | 작업 | 담당 | 상태 |
|----|------|------|------|
| 3-O1 | 운영 RAG 서비스 URL 확정·배포 | RAG/Infra | katsubot-api 밖 (Infra) |
| 3-O2 | `RAG_SERVICE_BASE_URL` 전환·검증 | Backend/QA | [x] staging 프로필·`RagHealthIndicator` |
| 3-O3 | OpenTelemetry trace 연동 | Backend/Infra | [x] OTel deps·staging 로그 패턴 |
| 3-O4 | Secrets·배포 체크리스트 | QA | [x] [secrets-checklist.md](./secrets-checklist.md) |

## 선택 (Phase 2 잔여)

| ID | 작업 | 상태 |
|----|------|------|
| 3-X1 | `board-auth` 레거시 HTTP 브릿지 | [x] `legacy-bridge` + `LegacyBoardAuthClient` |
| 3-X2 | auth-bridge — React JWT handoff | [x] `?jwt=` / `?token=` → sessionStorage |
| 3-X3 | 로컬 파일 업로드 (`uploadFile`) | 선택 |

## 산출물

| 역할 | 산출물 |
|------|--------|
| [Contract] | [rag-ops-contract.md](../modernization/rag-ops-contract.md), OpenAPI 설명 갱신 |
| [Backend] | `application-staging.yml`, `RagHealthIndicator`, OTel, `LegacyBoardAuthClient` |
| [Frontend] | `auth.ts` JWT handoff |
| [QA] | `scripts/smoke-phase3.sh` (G6) |

## Definition of Ready

- [x] worktree: `feature/KC-007-modernization-phase3-rag-ops`
- [ ] Phase 3+ Epic 승인란 (운영 배포 전)
- [ ] 운영 `RAG_SERVICE_BASE_URL`·Secrets 합의 (staging)

## 게이트

| 게이트 | 기준 | 상태 |
|--------|------|------|
| G6 | 스테이징 RAG E2E 1건 (SSE + 히스토리) | `smoke-phase3.sh` |
| G7 | OTel trace RAG ↔ katsubot-api 상관 ID | 수동 (collector) |

## 참고

- [rag-external-client.md](../rag-external-client.md)
- [rag-ops-contract.md](../modernization/rag-ops-contract.md)
- [board-auth-bridge.md](../modernization/board-auth-bridge.md)
- [KC-007-modernization-plan.md](../KC-007-modernization-plan.md)
