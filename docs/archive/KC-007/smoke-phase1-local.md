# Phase 1 로컬 스모크

> 전제: **dummy-rag** 또는 **katsulabs-ai-gateway**(+ 선택 **postgres**) 기동, JDK 25, Node 22.

## 1. 인프라

**dummy-rag (최소 스텁)**

```bash
cd infra
docker compose up -d dummy-rag
```

**katsulabs-ai-gateway (Phase 1 Direct LLM)**

```bash
# gateway repo clone 후 — Java 스택 (Boot 4.1, katsubot-api와 동일)
docker compose -f infra/docker-compose.java.yml up --build -d
# LLM 키 없으면 stub 응답 (smoke·CI)
```

**Postgres (JPA 영속화)**

```bash
cd infra && docker compose up -d postgres
```

## 2. katsubot-api

**인메모리 (기본)**

```bash
./gradlew :services:katsubot-api:bootRun
```

**Postgres + Flyway**

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
cd apps/katsubot-web
npm run dev
```

브라우저: http://localhost:5173 — 메시지 전송 후 **Dummy RAG** 스트리밍 확인.

## 4. curl 스모크 (API만)

```bash
./scripts/smoke-phase1.sh
```

## 5. 레거시 JWT (선택)

```bash
export KATSUBOT_AUTH_DEV_BYPASS=false
export KATSUBOT_AUTH_JWT_SECRET='<레거시 SECRET_KEY>'
# 레거시에서 발급한 Bearer JWT로 /api/v1/conversations 호출
```

## 관련

- [auth-bridge.md](../auth-bridge.md)
- [rag-external-client.md](../rag-external-client.md)
- [KC-007-phase1-kickoff.md](./KC-007-phase1-kickoff.md)
