# RAG 외부 클라이언트 계약

> **원칙:** RAG(검색·임베딩·에이전트)는 **chat-api 밖 별도 서비스**로 구성한다.  
> `chat-api`는 레거시 `HyobeeChatApiClient` → WRTN 호출과 같이 **HTTP/SSE 클라이언트만** 둔다.

## chat-api 내부 경계

```text
application/   SendMessageUseCase  ──►  RagCompletionPort (domain)
infrastructure/                    ◄──  RagHttpClient (WebClient → 외부 URL)
```

| 레이어 | 책임 | 금지 |
|--------|------|------|
| `domain/port` | `RagCompletionPort`, 요청/청크 모델 | WebClient, URL, Jackson |
| `infrastructure/rag` | `RagHttpClient`, `RagServiceProperties` | 벡터 DB, 프롬프트, 에이전트 로직 |
| 별도 RAG 서비스 | 검색·생성·오케스트레이션 | chat-api DB 직접 소유(선택) |

## 설정

```yaml
# services/chat-api/application.yml
katsubot:
  rag:
    base-url: ${RAG_SERVICE_BASE_URL:http://localhost:8090}
```

| 환경 | `base-url` 예시 |
|------|----------------|
| 로컬 | `http://localhost:8090` (`infra/dummy-rag` 스텁) |
| 스테이징 | `https://rag.staging.example` |
| 운영 | 운영 RAG 게이트웨이 URL |

URL만 변경하면 스텁 → 실 RAG로 교체한다. **chat-api 코드 변경 최소.**

## HTTP 계약 (RAG 서비스가 구현)

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
  "stream": false
}

→ 200 {"answer": "..."}
```

### Completion (SSE)

```http
POST /v1/completions
Content-Type: application/json
Accept: text/event-stream

{
  "query": "질문",
  "conversation_id": "uuid",
  "stream": true
}

→ data: {"delta":"토큰"}
→ data: {"done":true}
```

## 로컬 스텁

`infra/dummy-rag` — 위 계약을 만족하는 **최소 Node 서버**. RAG 로직 없음, 개발·CI용.

```bash
cd infra && docker compose up -d dummy-rag
```

## Phase 1+ Contract 산출물

- `packages/api-contract/` — **chat-api ↔ browser** OpenAPI (RAG API 아님)
- 본 문서 — **chat-api ↔ RAG 서비스** 계약 (필요 시 `packages/rag-contract/`로 분리 가능)

## 레거시 대응

| 레거시 | 신규 |
|--------|------|
| `HyobeeChatApiClient` → WRTN | `RagHttpClient` → RAG 서비스 |
| BFF에 LLM 로직 혼재 | BFF는 대화·인증·SSE 중계만 |
