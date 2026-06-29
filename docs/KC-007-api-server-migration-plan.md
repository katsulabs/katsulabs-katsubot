# KC-007 — 신규 API Server 마이그레이션 작업계획서 (P5)

| 항목 | 값 |
|------|-----|
| 티켓 | `KC-007-modernization` Phase 5 |
| 상태 | **승인됨** — 2026-06-29 |
| 우선순위 | **P5-A Gateway kickoff 먼저** |

## 승인 결정

| # | 항목 | 결정 |
|---|------|------|
| 1 | Entity ID | **UUID string** (`conversation_id`, `message_id`, `feedback_id`) |
| 2 | D2–D5 | 권장안 그대로 (`gateway` 프로필, legacy board-auth bridge 등) |
| 3 | 착수 순서 | **Gateway kickoff → katsubot Contract/Backend** |

## 목표

1. Browser BFF(`katsubot-api /api/v1/**`)와 Gateway WRTN compat 간 **3-Tier Response** 확립
2. katsulabs-ai-gateway P0 구현 (WRTN 대체)
3. JWT 로그인 체계 **변경 없음** ([05-auth-bridge.md](./05-auth-bridge.md))

## Response 3-Tier

| Tier | 경로 | ID | 에러 | SSE |
|------|------|-----|------|-----|
| **A** Browser BFF | `katsubot-api /api/v1/**` | UUID | `{code, message}` | `event: delta/done` |
| **B** Gateway WRTN | `ai-gateway /api/v1/**` | **UUID** | `{error:{code,message}}` | JSON-line WRTN |
| **C** RAG adapter | `ai-gateway /v1/completions` | — | — | `data: {delta}` |

katsubot-api `gateway` 프로필이 Tier B → Tier A 변환(Anti-Corruption Layer).

## 단계

| Phase | 범위 | 게이트 |
|-------|------|--------|
| **P5-A** | katsulabs-ai-gateway P0 | health + CRUD + ai-chat SSE |
| **P5-B** | katsubot-api `gateway` 프로필 완성 | `./gradlew test` + 스모크 |
| **P5-C** | Hyobee `WRTN_BASEURL` + UUID mapper | legacy P0 |
| **P5-D** | Strangler cutover | smoke-phase4 |
| **P5-E** | Hyobee v2 채팅 축소 | 트래픽 0% |

## Hyobee UUID 영향

WRTN integer ID 폐기로 **URL 변경만으로는 불충분**. P5-C에서 `WrtnRequestMapper`·DTO가 UUID string을 수용하도록 최소 수정 필요.

## 산출물

- [08-ai-gateway-handoff.md](./08-ai-gateway-handoff.md)
- [packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml](../packages/api-contract/ai-gateway-wrtn-replacement-openapi.yaml) v1.1.0
- [archive/KC-007/prompt-ai-gateway-wrtn.md](./archive/KC-007/prompt-ai-gateway-wrtn.md)

## 관련

- [03-architecture-flows.md §6](./03-architecture-flows.md)
- [05-auth-bridge.md](./05-auth-bridge.md)
