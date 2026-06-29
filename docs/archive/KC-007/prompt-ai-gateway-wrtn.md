# katsulabs-ai-gateway 구현 프롬프트 (복붙용)

> Gateway repo Issue/Agent/Cursor에 **아래 블록 전체**를 붙여 kickoff한다.  
> OpenAPI: katsubot `packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml`  
> Handoff: katsubot `docs/08-ai-gateway-handoff.md`

---

## PROMPT START

You are implementing **WRTN upstream API replacement** in **katsulabs-ai-gateway**.

### Context

- The external WRTN API server (`WRTN_BASEURL`, e.g. `https://ax-api-gateway.wrtn.ai/hsgc-demo`) has been **decommissioned**.
- Legacy Hyobee BFF (`katsulabs-katsubot`) calls WRTN via `WrtnChatVendorClient.java` — 14 HTTP endpoints.
- Goal: Gateway exposes **WRTN-compatible paths** so Hyobee only changes `WRTN_BASEURL` to the Gateway host.
- chat-api already uses Gateway via `POST /v1/completions` + `GET /_health` — **keep and reuse** the same inference core behind a WRTN SSE adapter.

### Source of truth (from katsubot repo)

| Artifact | Path |
|----------|------|
| Handoff doc | `docs/08-ai-gateway-handoff.md` |
| Target OpenAPI | `packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml` |
| Reverse-engineered analysis | `docs/archive/KC-007/superseded/wrtn-upstream-api.md` |
| Java client (calls to re-home) | `legacy/hyobee/.../WrtnChatVendorClient.java` |
| SSE consumer | `legacy/hyobee/.../ChatStreamServiceImpl.java` (processChunk) |
| DTOs | `legacy/hyobee/.../dto/external/wrtn/**` |

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

- In: `{query, conversation_id, stream, mode}`
- Out: `data: {"delta"}` / `data: {"done":true}`

### Auth

- `Authorization: Bearer <JWT>` on all endpoints (except health if you choose public health).
- JWT carries user + team context (Hyobee session JWT). Team scoping matters for `GET /api/v2/rnd/journal` and SSE.
- Document expected claims; coordinate with katsubot `docs/05-auth-bridge.md`.

### Persistence

WRTN stored conversations/messages/feedback externally. Gateway must either:

- (A) Own Postgres tables compatible with WRTN response shapes (see katsubot `V1__conversation_schema.sql` as reference), or
- (B) Document that P0 CRUD requires Hyobee to point to chat-api instead (not drop-in).

**Prefer (A) for P0 drop-in** with `WRTN_BASEURL` swap only.

### JSON naming

- snake_case in JSON bodies and query params (`user_id`, `conversation_id`, `chat_category`, etc.)

### Out of scope (Hyobee BFF handles)

- `thumbnail_image` enrichment
- `DocumentLinkBuilder` URL rewriting for internal docs
- API call audit logging

### Deliverables

1. OpenAPI updated in gateway repo (from katsubot contract YAML)
2. P0 endpoints implemented + Docker compose local run on `:8090`
3. README section: Hyobee `WRTN_BASEURL` migration
4. Smoke: health + create conversation + ai-chat SSE + list messages
5. Existing `/v1/completions` still passes katsubot `scripts/smoke-phase3.sh`

### Do not

- Break existing `POST /v1/completions` used by chat-api
- Change Hyobee Java in the first iteration (config URL only)
- Assume zero-downtime — focus on **external API replacement**

## PROMPT END

---

## Issue 템플릿 (GitHub)

**Title:** `[Contract] WRTN upstream replacement — Hyobee drop-in compat (P0 SSE + CRUD)`

**Body:**

```markdown
## Summary
WRTN API server decommissioned. Implement WRTN-compatible routes on ai-gateway per katsubot handoff.

## Attachments
- OpenAPI: (link or paste) `ai-gateway-wrtn-replacement-openapi.yaml`
- Handoff: `wrtn-to-ai-gateway-handoff.md`

## P0 scope
- [ ] GET /_health
- [ ] POST /api/v1/conversations/{id}/ai-chat (WRTN SSE)
- [ ] Conversation CRUD + message list

## Acceptance
Hyobee with WRTN_BASEURL=<gateway> passes manual chat flow.

## Related
- katsulabs-katsubot KC-007 modernization
```
