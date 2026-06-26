# 하네스 TODO

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)  
> 작업계획: **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **Phase 0–4 코드 완료 → 운영 cutover 대기** | [KC-007-phase34-complete.md](./KC-007-phase34-complete.md) |

## Phase 0–2 (완료 · main)

- [x] PR [#1](https://github.com/katsulabs/katsulabs-katsubot/pull/1) · [#2](https://github.com/katsulabs/katsulabs-katsubot/pull/2)

## Phase 3 (완료 · main)

- [x] RAG ops·OTel·legacy-bridge·JWT handoff·G6
- [x] PR [#4](https://github.com/katsulabs/katsulabs-katsubot/pull/4) 머지 (2026-06-26)

참고: [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md) · [phase3-smoke-results.md](./phase3-smoke-results.md)

## Phase 4 (완료 · main)

- [x] Strangler cutover (SPA + API), G8, decommission runbook
- [x] HiCloud `cloudAttach` KC-007 범위 외
- [x] PR [#5](https://github.com/katsulabs/katsulabs-katsubot/pull/5) 머지 (2026-06-26)

참고: [KC-007-phase4-kickoff.md](./KC-007-phase4-kickoff.md) · [phase4-cutover-smoke.md](./phase4-cutover-smoke.md)

## 운영 전 (잔여)

- [ ] Epic 승인 · staging `RAG_SERVICE_BASE_URL`·Secrets ([secrets-checklist.md](./secrets-checklist.md))
- [ ] G7 OTel collector 검증
- [ ] SSO cutover · legacy 트래픽 모니터링
- [ ] (선택) 로컬 파일 업로드

## 보류

| 항목 | 상태 |
|------|------|
| HiCloud | KC-007 범위 외 (legacy만 유지) |
