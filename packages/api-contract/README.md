# API Contract

| 파일 | 설명 |
|------|------|
| [openapi.yaml](./openapi.yaml) | katsubot-api ↔ browser (OpenAPI 3.1) |
| [wrtn-upstream-openapi.yaml](./wrtn-upstream-openapi.yaml) | WRTN upstream 역공학 (참고) |
| [ai-gateway-wrtn-replacement-openapi.yaml](./ai-gateway-wrtn-replacement-openapi.yaml) | **katsulabs-ai-gateway 구현 대상** (WRTN 대체, P0–P2, **v1.1.0 UUID**) |

**Swagger UI (로컬):** katsubot-web 기동 후 [http://localhost:5173/api-docs/](http://localhost:5173/api-docs/)  
또는 `cd apps/katsubot-web && npm run dev:docs`

RAG 서비스 계약: [docs/06-rag-contract.md](../../docs/06-rag-contract.md)

**WRTN 폐기 → Gateway handoff:** [docs/08-ai-gateway-handoff.md](../../docs/08-ai-gateway-handoff.md)

## Phase 1 엔드포인트

- `POST /api/v1/conversations` — 대화 생성
- `GET /api/v1/conversations` — 목록
- `POST /api/v1/conversations/{id}/messages` — SSE 스트리밍 응답

인증: `Authorization: Bearer` — [docs/05-auth-bridge.md](../../docs/05-auth-bridge.md)
