# 07 — API 참조

> katsubot-api REST/SSE 경로·레거시 v2 parity. OpenAPI 단일 소스: [`packages/api-contract/openapi.yaml`](../packages/api-contract/openapi.yaml)

Swagger UI: `http://localhost:8081/swagger-ui.html` · katsubot-web: http://localhost:5173/api-docs/

## 1. Browser → katsubot-api

| Method | Path | operationId | 사용처 |
|--------|------|-------------|--------|
| POST | `/api/v1/conversations` | `createConversation` | katsubot-web |
| GET | `/api/v1/conversations` | `listConversations` | katsubot-web |
| DELETE | `/api/v1/conversations` | `deleteConversations` | katsubot-web |
| GET | `/api/v1/conversations/{conversationId}/messages` | `listMessages` | katsubot-web |
| POST | `/api/v1/conversations/{conversationId}/messages` | `sendMessage` | katsubot-web (SSE) |
| PUT | `.../messages/{messageId}/feedback` | `upsertMessageFeedback` | Phase 2+ |
| DELETE | `.../feedback/{feedbackId}` | `deleteMessageFeedback` | Phase 2+ |
| GET | `/api/v1/board-auth` | `listBoardAuth` | Phase 2+ |

인증: `Authorization: Bearer <JWT>` (로컬: `dev-token`)

## 2. katsubot-api → AI Gateway

Base: `RAG_SERVICE_BASE_URL` (기본 `http://localhost:8090`)

| Method | Path | 구현 |
|--------|------|------|
| GET | `/_health` | `RagHealthIndicator` |
| POST | `/v1/completions` | `RagHttpClient` |

상세: [06-rag-contract.md](./06-rag-contract.md)

## 3. katsubot-api → Legacy (legacy-bridge)

| Method | Path | 구현 |
|--------|------|------|
| GET | `/xs/aichat/v2/board-auth` | `LegacyBoardAuthClient` |

환경: `KATSUBOT_LEGACY_BASE_URL` (기본 `http://localhost:8080`)

**BoardAuthPort:** `in-memory` → `StubBoardAuthAdapter`, `legacy-bridge` → `LegacyBoardAuthClient`. 플로우: [03-architecture-flows.md §5](./03-architecture-flows.md#5-board-auth-port)

## 4. v2 Parity 매트릭스

레거시: `HyobeeChatController` (`/xs/aichat/v2/**`) · 신규: `/api/v1/**`

| # | 레거시 v2 | 신규 | 상태 |
|---|-----------|------|------|
| 1 | `POST /conversation` | `POST /conversations` | ✅ |
| 2 | `GET /conversations` | `GET /conversations` | ✅ JWT `sub` |
| 3 | `DELETE /conversations` | `DELETE /conversations` | ✅ |
| 4 | `GET /messages` | `GET .../messages` | ✅ cursor/size |
| 5 | `PUT .../feedback` | `PUT .../feedback` | ✅ |
| 6 | `DELETE .../feedback/{id}` | `DELETE .../feedback/{id}` | ✅ |
| 7 | `GET /board-auth` | `GET /board-auth` | ✅ |
| 8 | SSE `/stream/**` | `POST .../messages` (SSE) | ✅ |
| 9 | `GET /healthCheck.json` | `/actuator/health` | ✅ |
| 10 | `uploadFile` | — | ⏸ 선택 |
| 11 | `PUT /session/jwt-team-code` | — | ⏸ |

**커버리지:** 8/10 핵심 = **80%** — `cloudAttach`(HiCloud) KC-007 범위 외

### 의도적 차이

| 항목 | 레거시 | 신규 |
|------|--------|------|
| 사용자 식별 | `user_id` + 세션 | JWT `sub` only |
| 메시지 ID | int (WRTN) | UUID |
| 에러 | XtrmResponse | `ErrorResponse` |

## 5. 경로 추출

```bash
curl -s http://localhost:8081/v3/api-docs | jq '.paths | keys'
./scripts/extract-api-paths.sh
```

## 관련

- [05-auth-bridge.md](./05-auth-bridge.md)
- [10-chat-e2e-gaps.md](./10-chat-e2e-gaps.md)
