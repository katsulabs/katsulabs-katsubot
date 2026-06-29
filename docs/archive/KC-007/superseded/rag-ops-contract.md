# RAG 운영 계약 (Phase 3)

> OpenAPI **breaking 변경 없음**. RAG는 chat-api 외부 HTTP 서비스 (`RagCompletionPort` → `RagHttpClient`).

## 환경 변수

| 변수 | 기본값 (로컬) | 스테이징 |
|------|---------------|----------|
| `RAG_SERVICE_BASE_URL` | `http://localhost:8090` | AI Gateway URL (필수) |
| `RAG_SERVICE_MODE` | `direct` | `direct` · `rag` (Phase 2+) |
| `MANAGEMENT_TRACING_ENABLED` | `false` | `true` (`application-staging.yml`) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | — | `http://<collector>:4318/v1/traces` |

## HTTP 계약 (불변)

| 메서드 | 경로 | 용도 |
|--------|------|------|
| GET | `/_health` | `{"status":"ok"}` — `RagHealthIndicator` |
| POST | `/v1/completions` | JSON 또는 SSE (`stream: true`) |

요청/응답 스키마는 [rag-external-client.md](../rag-external-client.md) 및 `infra/dummy-rag` 참고.

## 관측성

- `micrometer-tracing-bridge-otel` + OTLP exporter
- `RagHttpClient`는 Spring Boot auto-configured `WebClient.Builder` 사용 → outbound trace propagation
- 로그 패턴: `%X{traceId}`, `%X{spanId}` (`application-staging.yml`)

## 프로필

| 프로필 | 설명 |
|--------|------|
| `in-memory` (기본) | 로컬 dummy-rag |
| `staging` | `RAG_SERVICE_BASE_URL` 필수, tracing on |
| `jpa` | DB 영속화 (Phase 2) |

## 게이트

| ID | 기준 |
|----|------|
| G6 | 스테이징 RAG E2E 1건 (SSE + 히스토리) — `scripts/smoke-phase3.sh` |
| G7 | OTel traceId 로그·collector 상관 (수동) |
