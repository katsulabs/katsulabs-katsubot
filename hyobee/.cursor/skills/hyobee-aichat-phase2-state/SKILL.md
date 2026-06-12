---
name: hyobee-aichat-phase2-state
description: Hyobee aichat Phase 2 계획 — HyobeeChatState 캡슐화, 전역 state 축소, selectDataChatStream 분해. TB-004b 후속, aichat010.js state 리팩터, SSE 로직 분리 티켓 시 사용.
---

# Hyobee Aichat Phase 2 (State + SSE)

## 선행 조건

- Phase 1 완료: `hyobee-constants.js`, `hyobee-i18n.js`, `hyobee-api.js`, facade delegate
- 수동 QA 11/11 PASS (`hyobee-aichat-manual-qa`)

## 목표 (TB-004 문서 Phase 2)

1. `HyobeeChatState` 도입 — 40+ 전역을 accessor API 뒤로 캡슐화
2. `selectDataChatStream` / SSE 처리를 focused 모듈로 분해
3. Phase 4 rename 전까지 `window.aichat010` facade 안정 유지

## 비목표

- API URL 또는 SSE 프로토콜 변경
- `aichat010` → `hyobeeChat` rename (Phase 4 / TB-005)
- ES module 또는 bundler 도입

## 권장 파일 분리

| 모듈 | 책임 |
|------|------|
| `hyobee-chat-state.js` | 가변 대화/UI state, 단일 export 객체 |
| `hyobee-sse.js` | `EventSource` lifecycle, stream parse, `eventSource.close()` |
| `aichat010.js` | Facade wiring, DOM, state/sse 호출 |

## 마이그레이션 패턴

1. 전역 식별 → getter/setter로 `HyobeeChatState` 이동
2. facade의 직접 전역 참조를 클러스터 단위로 교체
3. PR당 ≤500 LOC; 수동 QA **2, 6, 11** 최소 실행 (SSE/stop/close)
4. state 필드는 티켓 문서에 기록 (SKILL에 전 필드 나열하지 않음)

## 의존 순서

```
constants → i18n → api → chat-state → sse → aichat010 → login-routing → journal
```

## 티켓 분리

- Phase 1a/1b와 **TB-004b** 분리 권장
- 분배: `[TB-004b][Frontend]` → `[TB-004b][QA]`

## 참고

- `docs/harness/TB-004-aichat010-modularization.md` §Phase 2~4
- `.cursor/skills/hyobee-iife-extract/SKILL.md`
