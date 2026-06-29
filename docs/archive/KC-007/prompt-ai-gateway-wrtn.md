# katsulabs-ai-gateway 구현 프롬프트 (복붙용)

> Gateway repo Issue/Agent/Cursor에 **아래 블록 전체**를 붙여 kickoff한다.  
> OpenAPI: katsubot `packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml` **v1.1.0 (UUID)**  
> Handoff: katsubot `docs/08-ai-gateway-handoff.md`  
> 승인: katsubot `docs/KC-007-api-server-migration-plan.md` (2026-06-29)

---

## PROMPT START

You are implementing **WRTN upstream API replacement** in **katsulabs-ai-gateway**.

### Context

- The external WRTN API server (`WRTN_BASEURL`) has been **decommissioned**.
- Legacy Hyobee BFF (`katsulabs-katsubot`) calls WRTN via `WrtnChatVendorClient.java` — 14 HTTP endpoints.
- Goal: Gateway exposes **WRTN-compatible paths** so Hyobee changes `WRTN_BASEURL` to the Gateway host (plus minimal UUID mapper in Hyobee — P5-C).
- chat-api uses Gateway via `POST /v1/completions` + `GET /_health` — **keep and reuse** the same inference core behind a WRTN SSE adapter.
- chat-api `gateway` profile will call your `/api/v1/**` routes and translate to the modern browser contract — implement **faithful Gateway contract**, not browser UX.

### Source of truth (from katsubot repo)

| Artifact | Path |
|----------|------|
| Handoff doc | `docs/08-ai-gateway-handoff.md` |
| Target OpenAPI | `packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml` (v1.1.0) |
| Migration plan | `docs/KC-007-api-server-migration-plan.md` |
| Reverse-engineered analysis | `docs/archive/KC-007/superseded/wrtn-upstream-api.md` |
| Java client (calls to re-home) | `legacy/hyobee/.../WrtnChatVendorClient.java` |
| SSE consumer | `legacy/hyobee/.../ChatStreamServiceImpl.java` (processChunk) |
| DTOs | `legacy/hyobee/.../dto/external/wrtn/**` |
| DB reference (UUID) | `services/api/src/main/resources/db/migration/V1__conversation_schema.sql` |
| Auth claims | `docs/05-auth-bridge.md` |

### Implementation priorities

**P0 — service cannot run without these**

1. `GET /_health`
2. `POST /api/v1/conversations/{conversationId}/ai-chat?web_search_enabled={bool}` — SSE with WRTN JSON-line format (NOT chat-api `data: {delta}` format)
3. `GET/POST /api/v1/conversations`, `GET /api/v1/conversations/{id}/messages` — conversation + message persistence

**P1**

4. `DELETE /api/v1/conversations`
5. `POST .../interrupt`, `PUT/DELETE .../feedback`

**P2**

6. `GET /api/v1/boards/auth`
7. R&D: `/api/v2/rnd/journal/**` (5 endpoints)

### ID format — UUID (mandatory, v1.1.0)

WRTN integer IDs are **deprecated**. Use **UUID v4** strings everywhere:

| Field | Type | Example |
|-------|------|---------|
| `conversation_id` | `string` (uuid) | `550e8400-e29b-41d4-a716-446655440000` |
| `message_id` | `string` (uuid) | same |
| `feedback_id` | `string` (uuid) | same |
| Path params `{conversationId}`, `{messageId}` | uuid | |

- Postgres: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- JSON: always string, never integer
- `conversation_ids[]` in delete body: array of uuid strings

**Do not** emit integer IDs even for Hyobee compat — katsubot approved UUID unification (2026-06-29).

### Critical SSE contract (Hyobee compatibility)

Upstream sends **one JSON object per line** on `text/event-stream`:

```json
{"status":"response_chunk","text":"토큰"}
{"status":"searching","text":"검색 중..."}
{"status":"response_completed","message":""}
{"status":"done"}
{"status":"error","message":"..."}
```

Chunks may include `sources[]` with: `source_type`, `source_title`, `display_title`, `url`, `source_id`, `doc_type`, `board_id`.

Hyobee forwards these to the browser; do **not** use chat-api's `data: {"delta"}` format on `/ai-chat`.

Implement `/v1/completions` as a **thin adapter** over the same generation pipeline:

- In: `{query, conversation_id, stream, mode}` — `conversation_id` is UUID string
- Out: `data: {"delta"}` / `data: {"done":true}`

### Auth

- `Authorization: Bearer <JWT>` on all endpoints (except health if you choose public health).
- JWT: **HS512**, shared `SECRET_KEY` with katsubot ([05-auth-bridge.md](https://github.com/katsulabs/katsulabs-katsubot/blob/main/docs/05-auth-bridge.md)).
- Claims: `sub` (userId), `corpCode`, `teamCode` (+ optional `pgCode`, `puCode`).
- Enforce `user_id` query/body matches JWT `sub`.

### Error envelope (WRTN compat)

```json
{ "error": { "code": "NOT_FOUND", "message": "..." } }
```

Do **not** use browser-tier flat `{code, message}` on `/api/v1/**` routes.

### Persistence

Gateway **owns Postgres** for P0 CRUD:

- Tables aligned with katsubot Flyway V1/V2 (`conversation`, `message`, feedback)
- **UUID PKs** — see `V1__conversation_schema.sql`
- snake_case column names

### JSON naming

- snake_case in JSON bodies and query params (`user_id`, `conversation_id`, `chat_category`, etc.)

### Out of scope (Hyobee BFF handles)

- `thumbnail_image` enrichment
- `DocumentLinkBuilder` URL rewriting for internal docs
- API call audit logging

### Deliverables

1. OpenAPI updated in gateway repo (from katsubot contract YAML v1.1.0)
2. P0 endpoints implemented + Docker compose local run on `:8090`
3. README section: Hyobee `WRTN_BASEURL` migration + UUID note
4. Smoke: health + create conversation (uuid) + ai-chat SSE + list messages
5. Existing `/v1/completions` still passes katsubot `scripts/smoke-phase3.sh`

### Do not

- Break existing `POST /v1/completions` used by chat-api
- Emit integer `conversation_id` / `message_id`
- Use chat-api SSE format on `/ai-chat`
- Assume zero-downtime — focus on **external API replacement**

## PROMPT END

---

## Issue 템플릿 (GitHub)

**Title:** `[Contract] WRTN upstream replacement — UUID + P0 SSE + CRUD`

**Body:**

```markdown
## Summary
WRTN API server decommissioned. Implement WRTN-compatible routes on ai-gateway per katsubot handoff **v1.1.0 (UUID IDs)**.

## Attachments
- OpenAPI: `packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml` (v1.1.0)
- Handoff: `docs/08-ai-gateway-handoff.md`
- Kickoff prompt: `docs/archive/KC-007/prompt-ai-gateway-wrtn.md`
- Migration plan: `docs/KC-007-api-server-migration-plan.md`

## P0 scope
- [ ] GET /_health
- [ ] POST /api/v1/conversations/{uuid}/ai-chat (WRTN SSE)
- [ ] Conversation CRUD + message list (UUID PKs)

## Acceptance
- Create conversation returns UUID `conversation_id`
- ai-chat SSE streams WRTN JSON-line chunks
- `POST /v1/completions` regression still passes katsubot smoke-phase3

## Related
- katsulabs-katsubot KC-007 modernization P5-A
```
