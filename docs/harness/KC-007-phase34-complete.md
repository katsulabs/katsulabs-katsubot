# KC-007-modernization Phase 3–4 완료 요약

| 항목 | 값 |
|------|-----|
| Phase 3 | PR [#4](https://github.com/katsulabs/katsulabs-katsubot/pull/4) → `975313c` |
| Phase 4 | PR [#5](https://github.com/katsulabs/katsulabs-katsubot/pull/5) → `fb44cc6` |
| main | Strangler cutover + RAG ops 스캐폴딩 |

## Phase 3 (머지 완료)

- `RagHealthIndicator`, `application-staging.yml`, OTel tracing
- `legacy-bridge` / `LegacyBoardAuthClient`
- React JWT URL handoff, `smoke-phase3.sh` (G6)

## Phase 4 (머지 완료)

- Strangler `:8088` — `/` → chat-web SPA
- `chat-web/Dockerfile`, decommission runbook
- `smoke-phase4.sh` (G8)
- HiCloud `cloudAttach` — **KC-007 범위 외**

## 스모크 (로컬)

```bash
./gradlew :services:chat-api:bootRun
cd infra && docker compose -f docker-compose.strangler.yml up -d --build
PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase4.sh
```

## 운영 전 잔여

| 항목 | 담당 |
|------|------|
| Epic 승인 · staging Secrets | Sponsor/Infra |
| G7 OTel collector 상관 ID | Backend/QA |
| SSO cutover · legacy 트래픽 0% | 운영 |
| (선택) 로컬 파일 업로드 | Product |

## 참고

- [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md)
- [KC-007-phase4-kickoff.md](./KC-007-phase4-kickoff.md)
- [decommission-runbook.md](../modernization/decommission-runbook.md)
