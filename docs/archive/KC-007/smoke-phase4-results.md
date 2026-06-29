# Phase 4 Cutover 스모크 결과 (G8)

| 항목 | 값 |
|------|-----|
| 일시 | 2026-06-26 |
| Proxy | `http://localhost:8088` (strangler + katsubot-web Docker) |
| API | `http://localhost:8081` (katsubot-api 호스트) |
| RAG | `http://localhost:8090` (dummy-rag) |
| 스크립트 | `scripts/smoke-phase4.sh` |

## 결과

| 게이트 | 항목 | 결과 |
|--------|------|------|
| G8 | `/healthz` | PASS |
| G8 | `/` SPA `<div id="root">` | PASS |
| G8 | API SSE + assistant 히스토리 (proxy) | PASS |

## 비고

- legacy `:8080` **미기동** — dev-token으로 검증
- Phase 3 PR [#4](https://github.com/katsulabs/katsulabs-katsubot/pull/4) 선행 머지 권장
