# 하네스 TODO

> 규칙: [01-project-conventions.md](../01-project-conventions.md)  
> 작업계획: **[02-modernization-plan.md](../02-modernization-plan.md)** (승인: 2026-06-26)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **Phase 0–4 코드 완료 → 운영 cutover 대기** | [09-operations-runbook.md](../09-operations-runbook.md) |

## Phase 0–2 (완료 · main)

- [x] PR [#1](https://github.com/katsulabs/katsulabs-katsubot/pull/1) · [#2](https://github.com/katsulabs/katsulabs-katsubot/pull/2)

## Phase 3 (완료 · main)

- [x] RAG ops·OTel·legacy-bridge·JWT handoff·G6
- [x] PR [#4](https://github.com/katsulabs/katsulabs-katsubot/pull/4) 머지 (2026-06-26)

참고: [archive/KC-007/kickoff-phase3.md](../archive/KC-007/kickoff-phase3.md) · [smoke-phase3-results.md](../archive/KC-007/smoke-phase3-results.md)

## Phase 4 (완료 · main)

- [x] Strangler cutover (SPA + API), G8, decommission runbook
- [x] HiCloud `cloudAttach` KC-007 범위 외
- [x] PR [#5](https://github.com/katsulabs/katsulabs-katsubot/pull/5) 머지 (2026-06-26)

참고: [archive/KC-007/kickoff-phase4.md](../archive/KC-007/kickoff-phase4.md) · [smoke-phase4-cutover.md](../archive/KC-007/smoke-phase4-cutover.md)

## 운영 전 (잔여)

- [ ] Epic 승인 · staging `RAG_SERVICE_BASE_URL`·Secrets ([09-operations-runbook.md](../09-operations-runbook.md))
- [ ] G7 OTel collector 검증
- [ ] SSO cutover · legacy 트래픽 모니터링
- [ ] (선택) 로컬 파일 업로드
- [ ] (선택) [10-chat-e2e-gaps.md](../10-chat-e2e-gaps.md) P0–P1 갭

## P5 — API Server 마이그레이션 (진행 중)

- [x] 작업계획서 승인 — [KC-007-api-server-migration-plan.md](../KC-007-api-server-migration-plan.md) (2026-06-29, UUID)
- [x] OpenAPI v1.1.0 UUID — `ai-gateway-wrtn-replacement-openapi.yaml`
- [x] Gateway kickoff Issue — [katsulabs-ai-gateway#5](https://github.com/katsulabs/katsulabs-ai-gateway/issues/5)
- [x] P5-A Gateway P0 구현 (외부 repo, smoke green)
- [x] P5-B chat-api `gateway` 프로필 — UUID 매핑·SSE·`scripts/smoke-gateway-profile.sh` green
- [x] P5-C Hyobee UUID DTO/mapper + `chat_viewable_teams.conversations` text[]
- [x] P5-C 운영: `WRTN_BASEURL` Secrets + V3 SQL 적용 (로컬: XtrmConfig `8090`, V3 `text[]`, `infra/.env` gateway)

## 보류

| 항목 | 상태 |
|------|------|
| HiCloud | KC-007 범위 외 (legacy만 유지) |
