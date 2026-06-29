# 03 — 아키텍처·플로우차트

> 시스템 흐름 다이어그램 **단일 모음**. 상세 계약·설정은 각 넘버링 문서 참고.

| § | 주제 | 상세 문서 |
|---|------|-----------|
| 1 | 시스템 개요 | [02-modernization-plan.md](./02-modernization-plan.md) |
| 2 | 인증 (SSO → JWT) | [05-auth-bridge.md](./05-auth-bridge.md) |
| 3 | 채팅 E2E | [10-chat-e2e-gaps.md](./10-chat-e2e-gaps.md) |
| 4 | Strangler Cutover | [09-operations-runbook.md](./09-operations-runbook.md) |
| 5 | Board Auth Port | [07-api-reference.md](./07-api-reference.md) |
| 6 | WRTN → AI Gateway | [08-ai-gateway-handoff.md](./08-ai-gateway-handoff.md) |

---

## §1 시스템 개요 (To-Be)

```text
katsulabs-katsubot/
├── apps/katsubot-web/           # React SPA
├── services/katsubot-api/       # Boot 4.1 BFF (Gradle :services:katsubot-api)
├── packages/api-contract/   # OpenAPI 3.1
├── infra/                   # Postgres · AI Gateway · Strangler
└── legacy/hyobee/           # SSO·v2 (전환기, 신규 기능 금지)
```

---

## §2 인증 — SSO → JWT → katsubot-api

```mermaid
sequenceDiagram
  participant Browser as katsubot-web
  participant Legacy as legacy/hyobee
  participant API as katsubot-api

  Browser->>Legacy: SSO 로그인 (ADFS)
  Legacy-->>Browser: 세션 + JWT (session.jwt)
  Browser->>API: Authorization: Bearer JWT
  API-->>Browser: /api/v1/** 응답
```

**운영 handoff (Phase 4):**

```mermaid
sequenceDiagram
  participant B as Browser
  participant L as legacy/hyobee
  participant W as katsubot-web
  participant A as katsubot-api

  B->>L: ADFS SSO login.jsp
  L-->>B: redirect → katsubot-web?jwt=...
  W->>W: initAuthFromUrl() → sessionStorage
  W->>A: Bearer JWT (모든 /api/v1/**)
  A->>A: LegacyJwtTokenValidator (HS512)
```

---

## §3 채팅 E2E

```mermaid
sequenceDiagram
  participant U as 사용자
  participant W as katsubot-web
  participant A as katsubot-api
  participant DB as PostgreSQL
  participant R as RAG 서비스

  Note over U,R: 앱 진입
  U->>W: SPA 로드
  W->>W: initAuthFromUrl() / dev-token
  W->>A: GET /api/v1/conversations
  A->>DB: userId별 목록
  A-->>W: Conversation[]

  Note over U,R: 새 메시지
  U->>W: 입력 + 전송
  W->>A: POST /api/v1/conversations (lazy create)
  W->>A: POST .../messages (Accept: text/event-stream)
  A->>DB: user message persist
  A->>R: POST /v1/completions (stream=true)
  loop SSE
    R-->>A: data: {"delta":"..."}
    A-->>W: event: delta
  end
  R-->>A: data: {"done":true}
  A->>DB: assistant message persist
  A-->>W: event: done {message_id}
```

**Frontend 메시지 상태:**

```text
         ┌──────────┐
         │   idle   │
         └────┬─────┘
              │ send()
              ▼
         ┌──────────┐
         │ sending  │── createConversation (if needed)
         └────┬─────┘
              │ SSE open
              ▼
         ┌──────────┐     onDelta
         │streaming │◄────────────
         └────┬─────┘
    error /   │ onDone
    abort     ▼
         ┌──────────┐
         │  sync    │── GET messages (server IDs)
         └────┬─────┘
              ▼
         ┌──────────┐
         │   idle   │
         └──────────┘
```

---

## §4 Strangler Cutover (Phase 4)

```mermaid
flowchart TB
  Browser[Browser]
  Proxy[strangler-proxy :8088]
  Web[katsubot-web SPA]
  API[katsubot-api :8081]
  Legacy[legacy/hyobee :8080]
  RAG[dummy-rag / 운영 RAG]

  Browser --> Proxy
  Proxy -->|/ /assets| Web
  Proxy -->|/api/v1 /actuator| API
  Proxy -->|/xs /webapps| Legacy
  API --> RAG
```

---

## §5 Board Auth Port

```mermaid
flowchart LR
  API[katsubot-api BoardAuthController]
  Port[BoardAuthPort]
  Stub[StubBoardAuthAdapter]
  Legacy[LegacyBoardAuthClient]

  API --> Port
  Port --> Stub
  Port --> Legacy
```

---

## §6 WRTN → AI Gateway

**현재 연동 (As-Is / 전환기):**

```mermaid
flowchart LR
  Browser --> HyobeeBFF["Hyobee BFF :8080"]
  HyobeeBFF --> WrtnClient["WrtnChatVendorClient"]
  WrtnClient --> WRTN["WRTN API (폐기)"]
  ChatWeb --> ChatApi["katsubot-api :8081"]
  ChatApi --> Gateway["AI Gateway :8090"]
```

**목표 (After):**

```mermaid
flowchart LR
  subgraph before [Before — 폐기됨]
    H1[Hyobee BFF] --> WRTN[WRTN API Gateway]
  end
  subgraph after [After — 목표]
    H2[Hyobee BFF] --> GW[katsulabs-ai-gateway]
    CA[katsubot-api] --> GW
    H2 -.->|Strangler 전환기| CA
  end
```
