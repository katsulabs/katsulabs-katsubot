# 08 — AI Gateway Handoff (WRTN 대체)

> **배경:** WRTN upstream API(`WRTN_BASEURL`) **폐기**. `WrtnChatVendorClient` 14개 HTTP API를 **katsulabs-ai-gateway**가 대체.  
> **플로우차트:** [03-architecture-flows.md §6](./03-architecture-flows.md#6-wrtn--ai-gateway)

## 1. 수신자·목적

| 항목 | 내용 |
|------|------|
| **수신 repo** | [katsulabs-ai-gateway](https://github.com/katsulabs/katsulabs-ai-gateway) |
| **발신 repo** | katsulabs-katsubot (본 문서 + OpenAPI) |
| **목표** | Hyobee BFF가 `WRTN_BASEURL`만 Gateway URL로 바꿔 **동일 경로·계약**으로 재연결 |
| **부가 목표** | chat-api `/v1/completions` **유지·확장** ([06-rag-contract.md](./06-rag-contract.md)) |

## 2. 첨부 산출물

| 파일 | 용도 |
|------|------|
| [`packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml`](../packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml) | **구현 대상** OpenAPI 3.1 |
| [`packages/api-contract/wrtn-upstream-openapi.yaml`](../packages/api-contract/wrtn-upstream-openapi.yaml) | 역공학 원본 |
| [archive/KC-007/superseded/wrtn-upstream-api.md](./archive/KC-007/superseded/wrtn-upstream-api.md) | API 목록·Hyobee 후처리 상세 |
| [archive/KC-007/prompt-ai-gateway-wrtn.md](./archive/KC-007/prompt-ai-gateway-wrtn.md) | Gateway kickoff **복붙 프롬프트** |

### 근거 Java

```
legacy/hyobee/.../WrtnChatVendorClient.java
legacy/hyobee/.../HyobeeChatApiClient.java
legacy/hyobee/.../WrtnRequestMapper.java
legacy/hyobee/.../dto/external/wrtn/**
legacy/hyobee/.../ChatStreamServiceImpl.java
```

**Hyobee 최소 변경:**

```properties
WRTN_BASEURL=https://<ai-gateway-host>
```

## 3. API 교체 매트릭스

| P | Method | Path | Hyobee 메서드 |
|---|--------|------|---------------|
| **P0** | GET | `/_health` | `healthCheck` |
| **P0** | POST | `/api/v1/conversations/{id}/ai-chat` | `startChatStream` (SSE) |
| **P0** | GET/POST | `/api/v1/conversations` | 목록·생성 |
| **P0** | GET | `/api/v1/conversations/{id}/messages` | `selectMessages` |
| **P1** | DELETE | `/api/v1/conversations` | `deleteConversations` |
| **P1** | POST | `.../interrupt` | `interrupt` |
| **P1** | PUT/DELETE | `.../feedback` | 피드백 CRUD |
| **P2** | GET | `/api/v1/boards/auth` | `selectDataBoardsAuth` |
| **P2** | GET | `/api/v2/rnd/journal/**` | R&D 저널 5 API |

**chat-api 전용 (유지):** `GET /_health`, `POST /v1/completions`

## 4. SSE 계약 (Hyobee 호환)

Hyobee는 upstream에서 **JSON 한 줄씩** 수신 (`text/event-stream`).

| `status` | Hyobee 동작 |
|----------|-------------|
| `response_chunk` | `text` relay |
| `searching` | relay |
| `response_completed` | relay; 스트림 유지 |
| `done` | relay 후 종료 |
| `error` | relay 후 종료 |

> `/v1/completions`의 `data: {"delta"}`와 **다름**. `/api/v1/.../ai-chat`은 **WRTN SSE 형식** 필수.

## 5. 인증

- `Authorization: Bearer <JWT>` — claims: [05-auth-bridge.md](./05-auth-bridge.md)
- SSE·R&D: sidebar `JWT_TEAM_CODE` / `resolveStreamTeamCode`

## 6. Persistence (결정 필요)

WRTN compat P0 CRUD는 Gateway Postgres 권장. chat-api Flyway: `services/api/src/main/resources/db/migration/V1__conversation_schema.sql`

## 7. 완료 기준

**P0:** Hyobee `WRTN_BASEURL=<gateway>` — health + conversation + ai-chat SSE 1회  
**chat-api:** `RAG_SERVICE_BASE_URL` → `/_health` + `/v1/completions` (`scripts/smoke-phase3.sh`)

## 8. katsubot 후속

1. `infra/docker-compose.ai-gateway.yml` WRTN compat 라우트
2. Hyobee `WRTN_BASEURL` Secrets 갱신
3. [07-api-reference.md](./07-api-reference.md) Gateway compat 경로 반영

## 9. 전달 방법

1. GitHub Issue (katsulabs-ai-gateway): 본 문서 + OpenAPI
2. Gateway repo `docs/contract/wrtn-replacement.md` 복사
3. [prompt-ai-gateway-wrtn.md](./archive/KC-007/prompt-ai-gateway-wrtn.md)로 kickoff

**문의:** katsubot Contract `[KC-007][Contract]`
