# Phase 2 스모크 결과

> 일자: 2026-06-26  
> 머지: PR [#2](https://github.com/katsulabs/katsulabs-chatbot-api/pull/2)

## G4 — v2 parity 매트릭스

- 문서: [v2-parity-matrix.md](../modernization/v2-parity-matrix.md)
- 핵심 8/10 항목 **80%+** 충족 (로컬 파일 업로드는 선택; HiCloud `cloudAttach`는 KC-007 범위 외)
- **PASS**

## G5 — SSE 연결 (proxy 경유)

```bash
API_BASE=http://localhost:8082 \
PROXY_BASE=http://localhost:8088 \
SSE_LONG_SECONDS=300 \
./scripts/smoke-phase2.sh
```

- strangler proxy `healthz` OK
- SSE `event:done` 수신 (max 300s 설정)
- **PASS**

## 직접 API 스모크

```bash
API_BASE=http://localhost:8082 ./scripts/smoke-phase2.sh
```

- CRUD, feedback, board-auth, delete — **PASS**

## Proxy 스모크

```bash
API_BASE=http://localhost:8082 PROXY_BASE=http://localhost:8088 ./scripts/smoke-phase2.sh
```

- `/api/v1/**` → chat-api 라우팅 — **PASS**

## CI

- chat-api CI — green (PR #2)
- chat-web CI — green (PR #2)

## 비고

- strangler nginx: `default.conf.template` 마운트 필요 (`docker-compose.strangler.yml` 반영, 커밋 `c220e45`)
