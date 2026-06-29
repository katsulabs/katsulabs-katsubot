# 09 — 운영 Runbook

> Strangler cutover · Secrets · Decommission. **플로우:** [03-architecture-flows.md §4](./03-architecture-flows.md#4-strangler-cutover-phase-4)

## Strangler 라우팅

| 경로 | Upstream | 비고 |
|------|----------|------|
| `/` | katsubot-web | React SPA |
| `/api/v1/**` | katsubot-api | BFF REST/SSE |
| `/actuator/**` | katsubot-api | health (내부망 제한) |
| `/xs/**` | legacy | SSO·v2 — `Deprecation` 헤더 |
| `/webapps/**` | legacy | JSP |
| `/healthz` | proxy | liveness |

## 로컬 Cutover

```bash
cd infra && docker compose up -d postgres dummy-rag
./gradlew :services:katsubot-api:bootRun
docker compose -f docker-compose.yml -f docker-compose.strangler.yml up -d --build
PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase4.sh
```

## 인증 (전환기)

1. **개발:** `Bearer dev-token` ([05-auth-bridge.md](./05-auth-bridge.md))
2. **스테이징/운영:** legacy SSO → `/?jwt=<token>` → katsubot-web `sessionStorage`

## 레거시 Deprecation

nginx `/xs/**`, `/webapps/**` 응답:

- `Deprecation: true`
- `Link: </api/v1/>; rel="successor-version"`

## 롤백

1. Strangler `/` → legacy JSP 임시 redirect
2. `/api/v1` → legacy v2 프록시 (Phase 2 설정)

## 게이트

| ID | 기준 |
|----|------|
| G8 | 프록시 단일 origin — SPA 200 + API SSE + 히스토리 |
| G6 | 스테이징 RAG E2E — `scripts/smoke-phase3.sh` |
| G7 | OTel traceId·collector 상관 |

## Secrets·배포

> `katsubot-secrets-prep` 스킬. **금지:** API 키·DB·JWT를 git 커밋, `.env` 커밋

### katsubot-api

| 변수 | 저장소 |
|------|--------|
| `RAG_SERVICE_BASE_URL` | GitHub Environment |
| `RAG_SERVICE_MODE` | Environment |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Environment secret |
| `KATSUBOT_LEGACY_BASE_URL` | staging only |
| `SPRING_DATASOURCE_*` | Environment secret |
| JWT signing key | Environment secret |

### katsubot-web

| 변수 | 용도 |
|------|------|
| `VITE_AUTH_TOKEN` | 로컬 전용 (운영 금지) |
| `?jwt=` / `?token=` | 레거시 handoff |

### 체크리스트

- [x] `.gitignore` — `*.local.yml`, `.env`
- [x] CI — test profile / Testcontainers
- [ ] staging Secrets (RAG URL, OTLP, DB)
- [ ] production 승인 후 복제

## Phase 3–4 완료 요약

- Phase 3: RAG ops·OTel·legacy-bridge·JWT handoff (PR [#4](https://github.com/katsulabs/katsulabs-katsubot/pull/4))
- Phase 4: Strangler `:8088`, decommission runbook (PR [#5](https://github.com/katsulabs/katsulabs-katsubot/pull/5))

## 운영 전 잔여

- Epic 승인 · staging Secrets
- G7 OTel collector 검증
- SSO cutover · legacy 트래픽 0%
- (선택) 로컬 파일 업로드

## 관련

- [04-local-development.md](./04-local-development.md)
- [06-rag-contract.md](./06-rag-contract.md)
- 이력: [archive/KC-007/summary-phase34-complete.md](./archive/KC-007/summary-phase34-complete.md)
