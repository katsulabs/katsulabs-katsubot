# [KC-007-modernization] Phase 1 Kickoff

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization — Phase 1 MVP |
| 브랜치 | `feature/KC-007-modernization-phase1-mvp` |
| 선행 | Phase 0 DoD, RAG 외부 클라이언트 (`6d1ded7`) |
| DoD | 로그인(브릿지) → React → 외부 RAG SSE 1건 · Use Case 테스트 · OpenAPI |

## 분배

| 역할 | 산출물 | 상태 |
|------|--------|------|
| [Contract] | `openapi.yaml`, `auth-bridge.md` | 진행 |
| [Backend] | Use Case, REST/SSE, Bearer 필터 | 진행 |
| [Frontend] | 채팅 UI, SSE hook | 진행 |
| [QA] | MockMvc 401, Use Case 단위 테스트 | 진행 |

## Contract 선행 (1-C1 ~ 1-C3)

- [x] 1-C3 `RagCompletionPort` + [rag-external-client.md](../rag-external-client.md)
- [x] 1-C1 `packages/api-contract/openapi.yaml`
- [x] 1-C2 `docs/auth-bridge.md`

## 게이트

- G2 OpenAPI breaking 없음 (초안 — 리뷰 시 diff)
- G3 401/403 계약 테스트
