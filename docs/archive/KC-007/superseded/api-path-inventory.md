# API Path Inventory

> chat-api가 **노출·호출**하는 HTTP 경로 목록. AI Gateway 경로 설계용.
>
> Swagger UI: `http://localhost:8081/swagger-ui.html`  
> OpenAPI JSON: `http://localhost:8081/v3/api-docs`  
> 계약 YAML: [`packages/api-contract/openapi.yaml`](../../packages/api-contract/openapi.yaml)

## 1. Browser → chat-api (공개 REST/SSE)

| Method | Path | operationId | 사용처 | 비고 |
|--------|------|-------------|--------|------|
| POST | `/api/v1/conversations` | `createConversation` | chat-web | 201 |
| GET | `/api/v1/conversations` | `listConversations` | chat-web | |
| DELETE | `/api/v1/conversations` | `deleteConversations` | chat-web | body: `conversation_ids[]` |
| GET | `/api/v1/conversations/{conversationId}/messages` | `listMessages` | chat-web | query: `cursor`, `size` |
| POST | `/api/v1/conversations/{conversationId}/messages` | `sendMessage` | chat-web | SSE (`text/event-stream`) |
| PUT | `/api/v1/conversations/{conversationId}/messages/{messageId}/feedback` | `upsertMessageFeedback` | (Phase 2+) | `like` / `dislike` |
| DELETE | `/api/v1/conversations/{conversationId}/messages/{messageId}/feedback/{feedbackId}` | `deleteMessageFeedback` | (Phase 2+) | |
| GET | `/api/v1/board-auth` | `listBoardAuth` | (Phase 2+) | query: `page`, `size` |

인증: `Authorization: Bearer <JWT>` (로컬 dev: `dev-token`)

## 2. chat-api → AI Gateway (outbound, `RagHttpClient`)

Base URL: `RAG_SERVICE_BASE_URL` (기본 `http://localhost:8090`)

| Method | Path | 구현 | 비고 |
|--------|------|------|------|
| GET | `/_health` | `RagHealthIndicator` | actuator health detail |
| POST | `/v1/completions` | `RagHttpClient` | JSON 또는 SSE (`stream: true`) |

요청 body (chat-api → gateway):

```json
{
  "query": "질문",
  "conversation_id": "uuid",
  "stream": true,
  "mode": "direct"
}
```

상세: [`docs/rag-external-client.md`](../rag-external-client.md)

## 3. chat-api → Legacy Hyobee (선택, `legacy-bridge` 프로필)

Base URL: `KATSUBOT_LEGACY_BASE_URL` (기본 `http://localhost:8080`)

| Method | Path | 구현 | 비고 |
|--------|------|------|------|
| GET | `/xs/aichat/v2/board-auth` | `LegacyBoardAuthClient` | Bearer 전달 |

## 4. 레거시 대응 (참고)

| 신규 (chat-api) | 레거시 (hyobee) |
|-----------------|-----------------|
| `DELETE /api/v1/conversations` | `DELETE /xs/aichat/v2/conversations` |
| `GET .../messages` | `GET /xs/aichat/v2/messages` |
| `PUT .../feedback` | `PUT .../feedback` |
| `GET /api/v1/board-auth` | `GET /xs/aichat/v2/board-auth` |

## 5. 추출 방법

```bash
# OpenAPI JSON (chat-api 기동 후)
curl -s http://localhost:8081/v3/api-docs | jq '.paths | keys'

# 계약 YAML에서 path만
./scripts/extract-api-paths.sh
```
