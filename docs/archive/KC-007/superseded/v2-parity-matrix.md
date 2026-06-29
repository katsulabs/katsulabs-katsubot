# v2 API Parity 매트릭스 (Phase 2)

> 레거시: `legacy/hyobee/.../HyobeeChatController.java` (`/xs/aichat/v2/**`)  
> 신규: `packages/api-contract/openapi.yaml` (`/api/v1/**`)

| # | 레거시 v2 | 신규 `/api/v1` | Phase 2 | 비고 |
|---|-----------|----------------|---------|------|
| 1 | `POST /conversation` | `POST /conversations` | ✅ P1 | |
| 2 | `GET /conversations` | `GET /conversations` | ✅ P2 | JWT 기반; 레거시 `user_id` 쿼리 제거 |
| 3 | `DELETE /conversations` | `DELETE /conversations` | ✅ P2 | body `conversation_ids` |
| 4 | `GET /messages` | `GET /conversations/{id}/messages` | ✅ P2 | `cursor`/`size` 쿼리 |
| 5 | `PUT .../feedback` | `PUT .../messages/{id}/feedback` | ✅ P2 | `like`/`dislike` |
| 6 | `DELETE .../feedback/{id}` | `DELETE .../feedback/{id}` | ✅ P2 | 논리 삭제 |
| 7 | `GET /board-auth` | `GET /board-auth` | ✅ P2 | `BoardAuthPort` 브릿지 |
| 8 | SSE `/stream/**` | `POST .../messages` (SSE) | ✅ P1 | |
| 9 | `GET /healthCheck.json` | `/actuator/health` | ✅ | 벤더 health 별도 |
| 10 | `uploadFile` / `uploadFiles` | — | ⏸ | 로컬 파일 업로드 (선택) |
| 11 | `PUT /session/jwt-team-code` | — | ⏸ | auth-bridge 보강 시 |

**Phase 2 목표 커버리지:** 8/10 핵심 항목 = **80%** (G4) — `cloudAttach`(HiCloud)는 **KC-007 범위 외**

## 의도적 차이

| 항목 | 레거시 | 신규 |
|------|--------|------|
| 사용자 식별 | 요청 `user_id` + 세션 대조 | JWT `sub` only |
| 메시지 ID | int (WRTN) | UUID |
| 에러 형식 | XtrmResponse HEADER/DATA | `ErrorResponse` (`code`, `message`) |
| 소스·첨부 | `MessageItem.sources` | Phase 2 미포함 (RAG 서비스 연동 시 확장) |

## 검증

- OpenAPI `0.2.0` ↔ Controller 스펙 일치
- `scripts/smoke-phase2.sh` (QA)
- G5: SSE 5분 연결 스모크
