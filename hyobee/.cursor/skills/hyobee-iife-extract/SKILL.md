---
name: hyobee-iife-extract
description: Hyobee v2 채팅 JS를 IIFE 모듈로 분리(window.aichat010 facade·API URL 유지). aichat010.js 모듈화, hyobee-*.js 생성, main.jsp script 순서, TB-004 Phase 1 IIFE 작업 시 사용.
---

# Hyobee IIFE 모듈 추출

## 제약 (협상 불가)

- **ES Module 금지** — `import`/`export` 없음; Maven WAR 정적 리소스
- **`window.aichat010` public API 유지** (facade delegate)
- **`/xs/aichat/v2/**`, SSE 경로 유지**
- **`PageReady()` → `aichat010.completePageRender()` 진입점 유지**
- PR 목표: 추출 PR당 **≤500 LOC diff**

## IIFE 패턴

```javascript
(function (global) {
  'use strict';
  // ...
  global.HyobeeApi = { request: requestApi, paths: paths };
})(window);
```

## 의존 순서 (main.jsp script 태그)

```
hyobee-constants.js → hyobee-i18n.js → hyobee-api.js → (hyobee-markdown.js) → aichat010.js → login-routing.js → journal.js
```

| 파일 | Namespace | 추출 대상 |
|------|-----------|-----------|
| `hyobee-constants.js` | `HyobeeConstants` | FILE_VALIDATION, 저널 코드 |
| `hyobee-i18n.js` | `HyobeeI18n` | `msg`, `applyMessageTemplate` |
| `hyobee-api.js` | `HyobeeApi` | `request`, `paths` |
| `aichat010.js` | `window.aichat010` | DOM, SSE, UI (facade) |

## Facade 위임

```javascript
requestApi: function (opts) { return HyobeeApi.request(opts); },
msg: function (key) { return HyobeeI18n.msg(key); },
```

## 깨지면 안 되는 것

- `login-routing.js` monkey-patch: `isUnauthorizedError`, `getCookieValue`, `isSsoLoginByCookie`, `redirectToLoginPage`, `handleUnauthorizedFromApi`
- `journal.completePageRender()` 연동
- 전역 `eventSource` (Phase 2 범위)

## 인코딩

- 모든 JS **UTF-8 no BOM** 저장
- 한글 주석 PowerShell 일괄 치환 금지 (CP949 혼선 위험)
- 알려진 수정: `aichat010.js` L1251 → `// false: 홈(웰컴) / true: 대화 중`

## 추출 후

- 신규 파일 추가 시 `docs/harness/package-scope.md` v2 JS 표 갱신
- `hyobee-aichat-manual-qa` skill 실행 (11 시나리오)

## 참고

- `docs/harness/TB-004-aichat010-modularization.md`
- `src/main/webapp/webapps/xs/aichat/main.jsp`
