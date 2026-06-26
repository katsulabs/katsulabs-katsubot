# API Contract

| 파일 | 설명 |
|------|------|
| [openapi.yaml](./openapi.yaml) | chat-api ↔ browser (OpenAPI 3.1) |

RAG 서비스 계약은 `docs/rag-external-client.md` (chat-api ↔ RAG, 본 패키지 밖).

## Phase 1 엔드포인트

- `POST /api/v1/conversations` — 대화 생성
- `GET /api/v1/conversations` — 목록
- `POST /api/v1/conversations/{id}/messages` — SSE 스트리밍 응답

인증: `Authorization: Bearer` — `docs/auth-bridge.md`
