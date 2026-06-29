# Phase 4 Cutover 스모크 (G8)

> 단일 origin (`:8088`) — React SPA + katsubot-api. **legacy 미기동** 상태에서 dev-token으로 검증 가능.

## 구성

| 파일 | 역할 |
|------|------|
| `infra/docker-compose.strangler.yml` | katsubot-web + strangler-proxy |
| `infra/nginx/strangler.conf.template` | `/` → SPA, `/api/v1` → katsubot-api |
| `scripts/smoke-phase4.sh` | G8 자동 스모크 |

## 1. 선행

```bash
cd infra
docker compose up -d postgres dummy-rag
```

호스트 katsubot-api:

```bash
./gradlew :services:katsubot-api:bootRun
```

## 2. Cutover stack

```bash
cd infra
docker compose -f docker-compose.yml -f docker-compose.strangler.yml up -d --build
```

브라우저: http://localhost:8088/

## 3. G8 스모크

```bash
chmod +x scripts/smoke-phase4.sh
PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase4.sh
```

| 단계 | 확인 |
|------|------|
| `/healthz` | `ok` |
| `/` | HTML `<div id="root">` |
| API SSE + 히스토리 | phase3와 동일 (proxy 경유) |

## 4. 레거시 Deprecation (선택)

legacy `:8080` 기동 시:

```bash
curl -sI http://localhost:8088/xs/aichat/v2/healthCheck.json | grep -i deprecation
```

## 관련

- [decommission-runbook.md](../modernization/decommission-runbook.md)
- [KC-007-phase4-kickoff.md](./KC-007-phase4-kickoff.md)
- [phase2-proxy-smoke.md](./phase2-proxy-smoke.md)
