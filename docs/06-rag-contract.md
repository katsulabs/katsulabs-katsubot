# 06 — RAG 계약

> LLM/RAG 추론은 **chat-api 밖** `katsulabs-ai-gateway`. chat-api는 HTTP/SSE 클라이언트만 둔다.

Gateway 상세: [katsulabs-ai-gateway `docs/contract/katsubot-integration.md`](https://github.com/katsulabs/katsulabs-ai-gateway/blob/main/docs/contract/katsubot-integration.md)

## chat-api 내부 경계

```text
application/   SendMessageUseCase  ──►  RagCompletionPort (domain)
infrastructure/                    ◄──  RagHttpClient (WebClient → 외부 URL)
```

| 레이어 | 책임 | 금지 |
|--------|------|------|
| `domain/port` | `RagCompletionPort`, 요청/청크 모델 | WebClient, URL, Jackson |
| `infrastructure/rag` | `RagHttpClient`, `RagServiceProperties` | 벡터 DB, 프롬프트, 에이전트 로직 |
| 별도 AI Gateway | 검색·LLM·생성 | chat-api DB 직접 소유(선택) |

## 설정

```yaml
katsubot:
  rag:
    base-url: ${RAG_SERVICE_BASE_URL:http://localhost:8090}
    mode: ${RAG_SERVICE_MODE:direct}
```

| 환경 | `base-url` 예시 | `mode` |
|------|-----------------|--------|
| 로컬 | `http://localhost:8090` | `direct` (기본) |
| 스테이징 | 운영 게이트웨이 URL | `direct` / `rag` |
| 운영 | 운영 게이트웨이 URL | `direct` / `rag` |

## HTTP 계약 (AI Gateway)

### Health

```http
GET /_health
→ 200 {"status":"ok"}
```

### Completion (비스트림)

```http
POST /v1/completions
Content-Type: application/json

{
  "query": "질문",
  "conversation_id": "uuid",
  "stream": false,
  "mode": "direct"
}

→ 200 {"answer": "...","mode":"direct","sources":[]}
```

### Completion (SSE)

```http
POST /v1/completions
Accept: text/event-stream

{
  "query": "질문",
  "conversation_id": "uuid",
  "stream": true,
  "mode": "direct"
}

→ data: {"delta":"토큰"}
→ data: {"done":true}
```

## 운영 (Phase 3+)

| 변수 | 기본값 (로컬) | 스테이징 |
|------|---------------|----------|
| `RAG_SERVICE_BASE_URL` | `http://localhost:8090` | AI Gateway URL (필수) |
| `RAG_SERVICE_MODE` | `direct` | `direct` · `rag` |
| `MANAGEMENT_TRACING_ENABLED` | `false` | `true` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | — | `http://<collector>:4318/v1/traces` |

- `micrometer-tracing-bridge-otel` + OTLP exporter
- `RagHttpClient` → outbound trace propagation
- 게이트 G6: 스테이징 RAG E2E (`scripts/smoke-phase3.sh`), G7: OTel 상관

## 프로필

| 프로필 | 설명 |
|--------|------|
| `in-memory` (기본) | 로컬 dummy-rag |
| `staging` | `RAG_SERVICE_BASE_URL` 필수, tracing on |
| `jpa` | DB 영속화 |

## 로컬 기동

| 대상 | 실행 |
|------|------|
| **AI Gateway** (권장) | `./scripts/up-ai-gateway.sh` |
| **dummy-rag** (CI·오프라인) | `cd infra && docker compose --profile stub up -d dummy-rag` |

둘 다 포트 **8090** — **동시에 하나만** 기동.

## 레거시 대응

| 레거시 | 신규 |
|--------|------|
| `HyobeeChatApiClient` → WRTN | `RagHttpClient` → **katsulabs-ai-gateway** |
| BFF에 LLM 로직 혼재 | BFF는 대화·인증·SSE 중계만 |

## 관련

- [04-local-development.md](./04-local-development.md)
- [08-ai-gateway-handoff.md](./08-ai-gateway-handoff.md)
- [packages/api-contract/openapi.yaml](../packages/api-contract/openapi.yaml) — browser ↔ chat-api (RAG API 아님)
