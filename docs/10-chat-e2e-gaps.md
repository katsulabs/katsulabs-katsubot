# 10 — 채팅 E2E 갭

> E2E 분석·구현 우선순위. **플로우·시퀀스:** [03-architecture-flows.md §3](./03-architecture-flows.md#3-채팅-e2e)

| 항목 | 값 |
|------|-----|
| 티켓 후보 | KC-008-chat-e2e (또는 KC-007 잔여) |
| 상태 | **분석·설계** |
| 근거 | [02-modernization-plan.md](./02-modernization-plan.md), [openapi.yaml](../packages/api-contract/openapi.yaml) |

## 1. 요약

채팅 E2E는 모노레포 3모듈(`chat-web` → `chat-api` → RAG)로 완성. Phase 0–4 골격은 존재하며, 아래 갭을 메우면 **“채팅이 동작한다”** 달성.

| 우선순위 | 갭 | 영향 |
|----------|-----|------|
| P0 | 로컬 3-tier 기동·연결 | 메시지 전송 |
| P0 | SSE UX (에러·중단·재시도) | 사용자 체감 |
| P1 | `chat_category` (사내/웹 검색) | UI·RAG 불일치 |
| P1 | 피드백 UI | v2 parity |
| P2 | OpenAPI 생성 클라이언트·TanStack Query | 유지보수 |
| P2 | `ChatPage` 분리 | 558줄 단일 컴포넌트 |

## 2. 현재 상태

### 모듈

```text
apps/chat-web/          # React SPA
services/chat-api/      # Gradle :services:chat-api (경로 services/api)
packages/api-contract/
infra/dummy-rag/
legacy/hyobee/          # Strangler, 신규 기능 금지
```

### 구현됨

| 계층 | 상태 |
|------|------|
| Contract | OpenAPI conversations/messages/feedback/board-auth ✅ |
| Backend | Use Case, JPA/in-memory, JWT, RagCompletionPort ✅ |
| Frontend | 대화 CRUD, SSE, Hyobee UI 스킨 ✅ |
| Auth (로컬) | dev-token ✅ |

### 미완성

| 항목 | UI | API |
|------|----|-----|
| 사내/웹 검색 토글 | ✅ | ❌ `SendMessageRequest` 필드 없음 |
| 피드백 | ❌ | ✅ |
| 스트림 취소 | ❌ | ❌ |
| SSE `event: error` | ❌ | ✅ |
| OpenAPI 클라이언트 | ❌ 수동 api.ts | — |
| TanStack Query | ❌ | — |

## 3. chat_category (Contract 우선)

| UI | 레거시 | RAG (제안) |
|----|--------|------------|
| 사내검색 | `internal_rules` | `web_search_enabled: false` |
| 웹검색 | `web_search` | `web_search_enabled: true` |

OpenAPI `SendMessageRequest.chat_category` 확장 → Backend `RagCompletionRequest` → Frontend 전달.

## 4. chat-web 구조 (제안)

```text
features/chat/     ChatPage, Sidebar, Thread, Composer
hooks/             useConversations, useMessages, useSendMessage
lib/api/           또는 packages/chat-client (OpenAPI 생성)
```

## 5. 구현 순서

| Phase | 범위 | DoD |
|-------|------|-----|
| Wire-up | 3-tier, dev-token | smoke-phase1 green |
| SSE hardening | error, abort | consumeSseBuffer 테스트 |
| chat_category | OpenAPI→RAG | 토글 분기 |
| Feedback UI | like/dislike | PUT/DELETE |
| Refactor | hooks, Query | ChatPage < 200줄 |
| JPA 로컬 | postgres | 재시작 후 대화 유지 |

## 6. 리스크

| 리스크 | 완화 |
|--------|------|
| RAG 계약 불일치 | [06-rag-contract.md](./06-rag-contract.md) + 통합 테스트 |
| SSE 60s timeout | timeout 연장 또는 heartbeat |
| 임시 vs 서버 message ID | done 후 sync/merge |

**결정 필요:** `chat_category` 대화 단위 고정 vs 메시지마다 변경 — 레거시는 대화 단위.

## 7. API ↔ UI 매핑

| 액션 | API | ChatPage |
|------|-----|----------|
| 앱 로드 | GET /conversations | `loadConversations` |
| 새 대화 | POST /conversations | `startNewConversation` |
| 대화 선택 | GET .../messages | `loadHistory` |
| 메시지 전송 | POST .../messages SSE | `sendMessageStream` |
| 삭제 | DELETE /conversations | `removeSelectedConversations` |
| 피드백 | PUT/DELETE .../feedback | (미구현) |

## 관련

- [04-local-development.md](./04-local-development.md)
- [07-api-reference.md](./07-api-reference.md)
- 이력: [archive/KC-007/superseded/chat-flow-analysis.md](./archive/KC-007/superseded/chat-flow-analysis.md)
