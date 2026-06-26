# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **Phase 4 진행 중** | [KC-007-modernization-plan.md](../KC-007-modernization-plan.md) §5 Phase 4 |

## Phase 0–2 (완료 · main)

Phase 0–2 — PR [#1](https://github.com/katsulabs/katsulabs-chatbot-api/pull/1) · [#2](https://github.com/katsulabs/katsulabs-chatbot-api/pull/2)

## Phase 3 (PR 대기)

킥오프: [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md) · PR [#4](https://github.com/katsulabs/katsulabs-chatbot-api/pull/4)

## Phase 4 (진행 중)

킥오프: [KC-007-phase4-kickoff.md](./KC-007-phase4-kickoff.md)  
브랜치: `feature/KC-007-modernization-phase4-decommission`

- [x] Strangler `/` → chat-web SPA
- [x] `chat-web/Dockerfile` + nginx SPA
- [x] `decommission-runbook.md`, `legacy/hyobee/DEPRECATED.md`
- [x] `scripts/smoke-phase4.sh` (G8)
- [ ] Phase 3 PR #4 머지 후 Phase 4 PR
- [ ] 운영 cutover (SSO·트래픽 0% 확인)
- [ ] (선택) 로컬 파일 업로드 · IdP 직접 연동

## 보류

| 항목 | 상태 |
|------|------|
| Secrets (staging/prod) | [secrets-checklist.md](./secrets-checklist.md) |
