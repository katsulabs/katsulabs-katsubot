# [KC-007-modernization] Phase 4 Kickoff

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization — Phase 4 레거시 Decommission |
| 선행 | Phase 3 — PR [#4](https://github.com/katsulabs/katsulabs-chatbot-api/pull/4) (RAG·관측성) |
| 브랜치 | `feature/KC-007-modernization-phase4-decommission` |
| DoD | Strangler cutover · chat-web 단일 진입 · legacy read-only |

## Phase 3 회고

- RAG health·staging·OTel, legacy-bridge, JWT handoff — PR #4

## Phase 4 범위

| ID | 작업 | 담당 | 상태 |
|----|------|------|------|
| 4-O1 | Strangler `/` → chat-web SPA | Infra/QA | 진행 |
| 4-O2 | chat-web Docker·nginx SPA | Frontend/Infra | 진행 |
| 4-O3 | Decommission runbook·legacy DEPRECATED | Contract | 진행 |
| 4-O4 | `smoke-phase4.sh` (G8) | QA | 진행 |
| 4-X1 | legacy CI → path-trigger 유지 | QA | [x] 기존 |
| 4-X2 | 로컬 파일 업로드 | — | 선택 |
| 4-X3 | SSO IdP 직접 연동 | — | Phase 4+ |

## 분배

| 역할 | 산출물 |
|------|--------|
| [Contract] | `decommission-runbook.md`, auth-bridge Phase 4 절 |
| [Backend] | (변경 최소) strangler upstream 호환 |
| [Frontend] | `chat-web/Dockerfile`, SPA nginx |
| [QA] | strangler compose, `smoke-phase4.sh`, G8 |

태그: `[KC-007-modernization][Contract|Backend|Frontend|QA]`

## Definition of Ready

- [x] Phase 2 strangler proxy (`:8088`)
- [x] Phase 3 JWT handoff
- [x] worktree: `feature/KC-007-modernization-phase4-decommission`

## 게이트

| 게이트 | 기준 |
|--------|------|
| G8 | `:8088` — SPA + API E2E (legacy 없이 dev-token) |

## 참고

- [decommission-runbook.md](../modernization/decommission-runbook.md)
- [KC-007-modernization-plan.md](../KC-007-modernization-plan.md) §5 Phase 4
