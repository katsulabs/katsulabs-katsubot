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
| **ID 형식 (v1.1.0)** | `conversation_id`, `message_id`, `feedback_id` — **UUID string** (WRTN integer 폐기) |

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

**Hyobee 변경 (P5-C):**

```properties
WRTN_BASEURL=https://<ai-gateway-host>
```

### 첫 메시지 대화 제목 (v1.1.1)

| 단계 | 동작 |
|------|------|
| 대화 생성 | `user_query`/`title` → 50자 truncate (LLM 없음) |
| 첫 `ai-chat` 완료 | placeholder 제목(`New chat`, `새 대화`)이면 Ollama **비스트리밍** 1회 호출로 제목 생성 → DB `conversations.title` 갱신 |
| SSE `done` | 선택 필드 `title` — BFF `event:done`으로 전달, chat-web 사이드바 즉시 반영 |

LLM 비활성(`LLM_API_KEY` 없음) 시 첫 사용자 메시지 truncate fallback.

UUID 도입으로 `WrtnRequestMapper`·`dto/external/wrtn/**`에서 integer → UUID string 수용이 필요하다 (URL 변경만으로는 불충분).

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

## 6. Persistence

WRTN compat P0 CRUD는 Gateway Postgres 권장.

- **PK:** UUID (`gen_random_uuid()`)
- **스키마 참고:** `services/api/src/main/resources/db/migration/V1__conversation_schema.sql`, `V2__message_feedback.sql`
- OpenAPI: `ai-gateway-wrtn-replacement-openapi.yaml` v1.1.0

## 7. 완료 기준

**P0:** Hyobee `WRTN_BASEURL=<gateway>` — health + conversation + ai-chat SSE 1회  
**chat-api:** `RAG_SERVICE_BASE_URL` → `/_health` + `/v1/completions` (`scripts/smoke-phase3.sh`)

## 8. katsubot 후속

1. `infra/docker-compose.ai-gateway.yml` WRTN compat 라우트
2. Hyobee `WRTN_BASEURL` Secrets 갱신
3. [07-api-reference.md](./07-api-reference.md) Gateway compat 경로 반영

## 9. 전달 방법

1. GitHub Issue (katsulabs-ai-gateway): 본 문서 + OpenAPI v1.1.0
2. Gateway repo `docs/contract/wrtn-replacement.md` 복사
3. [prompt-ai-gateway-wrtn.md](./archive/KC-007/prompt-ai-gateway-wrtn.md)로 kickoff
4. 승인 계획: [KC-007-api-server-migration-plan.md](./KC-007-api-server-migration-plan.md)

**문의:** katsubot Contract `[KC-007][Contract]`
