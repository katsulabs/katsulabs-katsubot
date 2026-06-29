# RAG 외부 클라이언트 계약

> **원칙:** LLM/RAG 추론은 **chat-api 밖 별도 서비스**(`katsulabs-ai-gateway`)로 구성한다.  
> `chat-api`는 레거시 `HyobeeChatApiClient` → WRTN 호출과 같이 **HTTP/SSE 클라이언트만** 둔다.

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
| 별도 AI Gateway | 검색·LLM·생성 (`katsulabs-ai-gateway`) | chat-api DB 직접 소유(선택) |

## 설정

```yaml
# services/chat-api/application.yml
katsubot:
  rag:
    base-url: ${RAG_SERVICE_BASE_URL:http://localhost:8090}
    mode: ${RAG_SERVICE_MODE:direct}
```

| 환경 | `base-url` 예시 | `mode` |
|------|-----------------|--------|
| 로컬 | `http://localhost:8090` (`katsulabs-ai-gateway`) | `direct` (기본) |
| 스테이징 | 운영 게이트웨이 URL | `direct` / `rag` |
| 운영 | 운영 게이트웨이 URL | `direct` / `rag` |

`RAG_SERVICE_BASE_URL`만 바꿔 스테이징·운영 Gateway로 전환한다. **chat-api 코드 변경 최소.**

## HTTP 계약 (AI Gateway가 구현)

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

`mode`: `direct` (LLM only, Phase 1) · `rag` (검색 후 생성, Phase 2+ stub).  
응답의 `sources`는 Phase 2+ — chat-api는 Phase 1에서 무시.

### Completion (SSE)

```http
POST /v1/completions
Content-Type: application/json
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

Phase 2+ RAG 확장: `data: {"source":{...}}` — chat-api는 무시 가능 (하위 호환).

## 로컬 기동

| 대상 | 실행 |
|------|------|
| **katsulabs-ai-gateway** (권장) | `cd infra && docker compose -f docker-compose.ai-gateway.yml up --build -d` |
| **dummy-rag** (CI·오프라인 스텁) | `cd infra && docker compose --profile stub up -d dummy-rag` |

둘 다 포트 **8090** — **동시에 하나만** 기동.

Gateway repo 직접 기동: [katsulabs-ai-gateway](https://github.com/katsulabs/katsulabs-ai-gateway) `infra/docker-compose.java.yml`

## Phase 1+ Contract 산출물

- `packages/api-contract/` — **chat-api ↔ browser** OpenAPI (RAG API 아님)
- 본 문서 — **chat-api ↔ RAG 서비스** 계약 (필요 시 `packages/rag-contract/`로 분리 가능)

## 레거시 대응

| 레거시 | 신규 |
|--------|------|
| `HyobeeChatApiClient` → WRTN | `RagHttpClient` → **katsulabs-ai-gateway** |
| BFF에 LLM 로직 혼재 | BFF는 대화·인증·SSE 중계만 |
