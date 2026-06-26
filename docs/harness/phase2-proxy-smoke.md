# Phase 2 Strangler Proxy 스모크

> Reverse proxy: `/api/v1/**` → chat-api, `/xs/**` · `/webapps/**` → legacy

## 구성

| 파일 | 역할 |
|------|------|
| `infra/nginx/strangler.conf.template` | nginx 라우팅 템플릿 |
| `infra/docker-compose.strangler.yml` | 프록시 overlay (포트 **8088**) |

## 1. 선행 서비스

```bash
cd infra
docker compose up -d postgres dummy-rag
```

호스트에서 chat-api:

```bash
SPRING_PROFILES_ACTIVE=jpa ./gradlew :services:chat-api:bootRun
```

선택 — legacy SSO (포트 8080):

```bash
cd legacy/hyobee && mvn spring-boot:run
```

## 2. Strangler proxy 기동

```bash
cd infra
docker compose -f docker-compose.yml -f docker-compose.strangler.yml up -d strangler-proxy
```

| 변수 | 기본 | 설명 |
|------|------|------|
| `CHAT_API_UPSTREAM` | `host.docker.internal:8081` | chat-api |
| `LEGACY_UPSTREAM` | `host.docker.internal:8080` | legacy WAR |

Health: `curl -s http://localhost:8088/healthz` → `ok`

## 3. 라우팅 확인

```bash
# 신규 API (프록시 경유)
curl -s http://localhost:8088/api/v1/conversations \
  -H "Authorization: Bearer dev-token"

# chat-api 직접 (비교)
curl -s http://localhost:8081/actuator/health

# 레거시 (legacy 기동 시)
curl -s -o /dev/null -w "%{http_code}" http://localhost:8088/xs/aichat/v2/healthCheck.json
```

## 4. Phase 2 스모크

**직접 API:**

```bash
./scripts/smoke-phase2.sh
```

**프록시 경유:**

```bash
PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase2.sh
```

**G5 (SSE 최대 대기, 예: 300초):**

```bash
SSE_LONG_SECONDS=300 PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase2.sh
```

## 5. 게이트

| 게이트 | 확인 |
|--------|------|
| G4 | [v2-parity-matrix.md](../modernization/v2-parity-matrix.md) 80%+ |
| G5 | `SSE_LONG_SECONDS=300` 스모크 PASS (proxy 경유 권장) |

## 관련

- [phase1-local-smoke.md](./phase1-local-smoke.md)
- [KC-007-phase2-kickoff.md](./KC-007-phase2-kickoff.md)
- [board-auth-bridge.md](../modernization/board-auth-bridge.md)
