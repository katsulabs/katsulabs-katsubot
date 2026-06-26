# Phase 3 스모크 결과 (G6)

| 항목 | 값 |
|------|-----|
| 일시 | 2026-06-26 |
| API | `http://localhost:8083` (Phase 3 `feature/KC-007-modernization-phase3-rag-ops`) |
| RAG | `http://localhost:8090` (dummy-rag) |
| 스크립트 | `scripts/smoke-phase3.sh` |

## 결과

| 게이트 | 항목 | 결과 |
|--------|------|------|
| G6 | RAG `/_health` | PASS |
| G6 | `actuator/health` + `rag` component UP | PASS |
| G6 | SSE 메시지 전송 + assistant 히스토리 | PASS |

## G7 (OTel)

- 스테이징 `MANAGEMENT_TRACING_ENABLED=true` + OTLP collector 연결 시 traceId 로그·collector 상관 ID 수동 확인 필요
- 로컬 in-memory 프로필: tracing disabled (기본)

## 비고

- `:8081`은 Phase 2 이전 인스턴스일 수 있음 — Phase 3 검증은 `:8083` 기준
