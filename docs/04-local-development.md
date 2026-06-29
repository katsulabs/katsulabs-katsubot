# 04 — 로컬 개발·스모크

> 모노레포 3-tier 기동. 상세 플로우: [03-architecture-flows.md](./03-architecture-flows.md)

## 빠른 시작

```bash
# 1) AI Gateway (WRTN + completions — hyobee-rag-db 필요)
cp infra/.env.example infra/.env   # DB 비밀번호·JWT 채우기
./scripts/up-ai-gateway.sh
curl -s http://localhost:8090/_health

# 2) katsubot-api
./scripts/boot-katsubot-api.sh   # :8081

# 3) katsubot-web
cd apps/katsubot-web && npm run dev   # :5173
```

**CI·오프라인 스텁** (8090 — gateway와 동시 기동 금지):

```bash
cd infra && docker compose --profile stub up -d dummy-rag
```

환경 변수: `infra/.env.example` (`RAG_SERVICE_BASE_URL`, `RAG_SERVICE_MODE`, `LLM_API_KEY`)

## 모듈별 명령

| 모듈 | 경로 | 명령 |
|------|------|------|
| katsubot-api | `services/katsubot-api` | `./gradlew :services:katsubot-api:test` |
| katsubot-web | `apps/katsubot-web` | `npm ci && npm test && npm run build` |
| legacy hyobee | `legacy/hyobee` | `mvn test` (JDK 11, Boot 2.7.18) |

## 1. 인프라

**dummy-rag (최소 스텁):**

```bash
cd infra && docker compose up -d dummy-rag
```

**katsulabs-ai-gateway (Direct LLM):**

```bash
./scripts/up-ai-gateway.sh
```

**Postgres (JPA):**

```bash
cd infra && docker compose up -d postgres
```

## 2. katsubot-api

**인메모리 (기본):**

```bash
./gradlew :services:katsubot-api:bootRun
```

**Postgres + Flyway:**

```bash
SPRING_PROFILES_ACTIVE=jpa ./gradlew :services:katsubot-api:bootRun
```

| 변수 | 기본 | 설명 |
|------|------|------|
| `KATSUBOT_AUTH_DEV_BYPASS` | `true` | `Bearer dev-token` 허용 |
| `KATSUBOT_AUTH_JWT_SECRET` | (없음) | 레거시 `SECRET_KEY`와 동일 시 JWT 검증 |
| `RAG_SERVICE_BASE_URL` | `http://localhost:8090` | dummy-rag 또는 AI Gateway |
| `RAG_SERVICE_MODE` | `direct` | `direct` · `rag` |
| `KATSUBOT_DB_URL` | `jdbc:postgresql://localhost:5432/katsubot` | `jpa` 프로필 |

Health: `curl -s http://localhost:8081/actuator/health`

## 3. katsubot-web

```bash
cd apps/katsubot-web && npm run dev
```

브라우저: http://localhost:5173 — 메시지 전송 후 RAG 스트리밍 확인.

## 4. curl 스모크

```bash
./scripts/smoke-phase1.sh
```

## 5. 레거시 JWT (선택)

```bash
export KATSUBOT_AUTH_DEV_BYPASS=false
export KATSUBOT_AUTH_JWT_SECRET='<레거시 SECRET_KEY>'
# 레거시에서 발급한 Bearer JWT로 /api/v1/conversations 호출
```

## Phase 4 Cutover (G8)

```bash
cd infra && docker compose up -d postgres dummy-rag
./gradlew :services:katsubot-api:bootRun   # 별도 터미널
cd infra && docker compose -f docker-compose.yml -f docker-compose.strangler.yml up -d --build
PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase4.sh
```

브라우저: http://localhost:8088/

## 관련

- [05-auth-bridge.md](./05-auth-bridge.md)
- [06-rag-contract.md](./06-rag-contract.md)
- [09-operations-runbook.md](./09-operations-runbook.md)
- 이력: [archive/KC-007/smoke-phase1-local.md](./archive/KC-007/smoke-phase1-local.md)
