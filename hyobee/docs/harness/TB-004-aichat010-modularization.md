# TB-004 — aichat010.js 모듈화 (Phase 1)

Hyobee 채팅 메인 화면 JavaScript(`aichat010.js`, ~7k LOC)의 God Object를 **동작 변경 없이** 점진 분리한다.  
번들러 없이 `<script defer>` + **IIFE namespace** 패턴을 사용한다.

## 메타

| 항목 | 값 |
|------|-----|
| 티켓 | TB-004 |
| 브랜치 | `feature/TB-004-aichat010-modularize` |
| 담당 | Frontend (주), QA (회귀) |
| 선행 | TB-003 (Hyobee JSP/Java 네이밍) 완료 |
| 비범위 | API URL 변경, SSE 프로토콜 변경, 비즈니스 로직 변경 |

## 배경

- `src/main/resources/static/html/xs/aichat/js/v2/aichat010.js` 단일 객체(`aichat010`) + 전역 변수 40개+
- `journal.js`, `login-routing.js`만 부분 분리; 핵심 로직·저널 연동·파일 업로드·SSE는 여전히 monolith
- `main.jsp` 로드 순서: `aichat010.js` → `login-routing.js` → `journal.js`

## 목표 (Phase 1)

1. **상수·API·i18n·순수 유틸**을 별도 IIFE 파일로 추출
2. **`window.aichat010` facade 유지** — 기존 JSP/inline/onclick/`journal.js` 호환
3. **전역 mutable state는 Phase 2**로 미루되, Phase 1에서 state 접근 경로 문서화
4. 주석 **인코딩 깨짐 1건** 수정 (아래 §인코딩 점검)

## Definition of Done (Phase 1)

- [x] 신규 JS 파일 4~5개 추가, `main.jsp` script 태그 순서 반영 *(Phase 1a: 3개)*
- [x] `window.aichat010` public 메서드 시그니처 **변경 없음** (facade delegate)
- [x] `/xs/aichat/v2/**` 호출 URL·SSE 경로 **변경 없음**
- [x] `PageReady()` → `aichat010.completePageRender()` 진입점 유지
- [x] `login-routing.js`의 `aichat010.*` monkey-patch **정상 동작** *(구조상 유지)*
- [x] `journal.completePageRender()` 연동 **정상 동작** *(구조상 유지)*
- [ ] 수동 QA 체크리스트(§QA) 전 항목 PASS
- [x] `docs/harness/todo.md` TB-004 상태 갱신
- [x] `package-scope.md` v2 JS 모듈 경로 1단락 추가

## Phase 2~4 (후속 티켓 후보)

| Phase | 내용 | 티켓 분리 권장 |
|-------|------|----------------|
| 2 | `HyobeeChatState` 전역 캡슐화, `selectDataChatStream` 분해 | TB-004b |
| 3 | 저널 출처 패널 → `journal-sources.js`, 이벤트 → `chat-events.js` | TB-004c |
| 4 | `aichat010` → `hyobeeChat` rename + `main.js` 파일명 (alias 유지) | TB-005 |

---

## Phase 1 — IIFE 모듈 설계

### 원칙

- **ES Module(`import`/`export`) 미사용** — Maven WAR 정적 리소스, 기존 XUI `PageReady` 패턴 유지
- 각 파일: `(function(global) { ... global.HyobeeXxx = ...; })(window);`
- **의존 방향**: constants → i18n → api → (markdown) → facade(`aichat010` 본체 축소)
- 추출 함수는 **순수 함수 우선**; DOM/`xui` 의존은 facade에 잔류

### 파일 구조 (신규)

```
src/main/resources/static/html/xs/aichat/js/v2/
├── hyobee-constants.js      # FILE_VALIDATION, JOURNAL_ALLOWED_*, host, MAX_LENGTH
├── hyobee-api.js            # requestApi, API_PATHS 상수
├── hyobee-i18n.js           # msg, formatMsg, applyMessageTemplate (xui.message 래핑)
├── hyobee-markdown.js       # copyAsMarkdown, processMathChunk, wrapMathBlocks (Phase 1b)
├── aichat010.js             # facade + DOM/SSE/대화/저널/파일 (축소)
├── login-routing.js         # 기존 (aichat010 patch)
└── journal.js               # 기존
```

> **Phase 1a**: constants + api + i18n  
> **Phase 1b**: markdown/math (약 400 LOC, 회귀 위험 → PR 분리 가능)

### `main.jsp` 로드 순서

```html
<!-- Phase 1: 의존성 순서 고정 -->
<script defer src=".../hyobee-constants.js?version=..."></script>
<script defer src=".../hyobee-i18n.js?version=..."></script>
<script defer src=".../hyobee-api.js?version=..."></script>
<!-- Phase 1b -->
<script defer src=".../hyobee-markdown.js?version=..."></script>
<!-- Facade (기존 진입점) -->
<script defer src=".../aichat010.js?version=..."></script>
<script defer src=".../login-routing.js?version=..."></script>
<script defer src=".../journal.js?version=..."></script>
```

`defer`는 선언 순서대로 실행되므로 **constants → i18n → api → markdown → aichat010** 순이 필수다.

### IIFE 스켈레톤

**hyobee-constants.js**

```javascript
"use strict";
(function (global) {
    global.HyobeeConstants = {
        MAX_LENGTH: 20480,
        host: { dev: "ai-chatdev.hyosung.com", prod: "ai-chat.hyosung.com" },
        FILE_VALIDATION: { /* 기존 객체 그대로 */ },
        JOURNAL_ALLOWED_PU_CODES: [/* ... */],
        JOURNAL_SIMILARITY: { /* ... */ }
    };
})(window);
```

**hyobee-api.js**

```javascript
"use strict";
(function (global) {
    var API_PATHS = {
        CONVERSATIONS: "/xs/aichat/v2/conversations",
        MESSAGES: "/xs/aichat/v2/messages",
        CONVERSATION: "/xs/aichat/v2/conversation",
        BOARD_AUTH: "/xs/aichat/v2/board-auth",
        STREAM_SEND_PARAM: "/xs/aichat/v2/stream/sendMessageParam",
        STREAM_MESSAGE: "/xs/aichat/v2/stream/message",
        STREAM_INTERRUPT: "/xs/aichat/v2/stream/interrupt",
        VIEWABLE_TEAMS: "/xs/aichat/v2/rnd/viewable-teams",
        JWT_TEAM_CODE: "/xs/aichat/v2/session/jwt-team-code",
        UPLOAD_FILES: "/xs/aichat/v2/uploadFiles",
        CLOUD_ATTACH: "/xs/aichat/v2/cloudAttach"
    };

    function requestApi(path, options) {
        /* aichat010.requestApi 본문 이동 — xui.json 반환 계약 동일 */
    }

    global.HyobeeApi = { paths: API_PATHS, request: requestApi };
})(window);
```

**hyobee-i18n.js**

```javascript
"use strict";
(function (global) {
    function applyMessageTemplate(template, values) { /* ... */ }
    function msg(key, values) { /* xui.message.get + template */ }
    function formatMsg(key, userName) { /* ... */ }

    global.HyobeeI18n = { applyMessageTemplate: applyMessageTemplate, msg: msg, formatMsg: formatMsg };
})(window);
```

**aichat010.js (facade 위임 예)**

```javascript
// 파일 상단 전역 var → HyobeeConstants 참조로 점진 치환
var FILE_VALIDATION = HyobeeConstants.FILE_VALIDATION;

var aichat010 = {
    requestApi: function (path, options) {
        return HyobeeApi.request(path, options);
    },
    msg: function (key, values) {
        return HyobeeI18n.msg(key, values);
    },
    applyMessageTemplate: function (template, values) {
        return HyobeeI18n.applyMessageTemplate(template, values);
    },
    // ... 나머지 DOM/SSE 로직
};
```

### Public API 고정 (회귀 방지)

Phase 1에서 **반드시 유지**할 `window` 심볼:

| 심볼 | 용도 |
|------|------|
| `PageReady` | XUI document ready |
| `aichat010` | 메인 facade |
| `aichat010.completePageRender` | 초기화 |
| `aichat010.searchAiBot` | 메시지 전송 |
| `aichat010.callBackFromHiCloud` | HiCloud 전역 콜백 |
| `eventSource` (전역) | SSE — Phase 2까지 유지 |

`login-routing.js`가 patch하는 메서드:

- `isUnauthorizedError`, `getCookieValue`, `isSsoLoginByCookie`, `redirectToLoginPage`, `handleUnauthorizedFromApi`

### 구현 순서 (Frontend 작업 단위)

1. **TB-004-1** `hyobee-constants.js` 추출 + `main.jsp` 태그 1개
2. **TB-004-2** `hyobee-api.js` + `requestApi` 위임
3. **TB-004-3** `hyobee-i18n.js` + `msg`/`formatMsg` 위임
4. **TB-004-4** 인코딩 수정 L1251 (§아래)
5. **TB-004-5** (선택) `hyobee-markdown.js`
6. QA 수동 회귀 → PR

각 PR은 **500 LOC diff 이하** 목표.

---

## QA 수동 회귀 체크리스트

**실행·결과 기록:** [qa-registry.md §5](./qa-registry.md#5-tb-004-수동-frontend-qa) · pre-flight [§5-1](./qa-registry.md#51-pre-flight-자동http--2026-05-29) (2026-05-29 PASS) · 브라우저 11 BLOCKED

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | `main.jsp` 최초 로드 | 웰컴 메시지, 사이드바 대화 목록 |
| 2 | 사내검색 질의 + Enter | SSE 스트리밍, 입력 잠금/해제 |
| 3 | 웹검색 / RND(권한 있을 때) 전환 | placeholder·UI 테마 변경 |
| 4 | 새 대화 | `#box` 초기화, 파일 첨부 cleared |
| 5 | 대화 이력 클릭 | 메시지 로드, 스크롤 |
| 6 | 대화 중지 버튼 | interrupt API, "대화가 중지되었습니다" |
| 7 | 파일 첨부 (로컬) | validate, upload, 메시지 bubble |
| 8 | HiCloud 첨부 | popup + callback |
| 9 | 저널 영역 전환 (권한) | `journal.completePageRender` |
| 10 | 401 응답 | `login-routing.js` redirect |
| 11 | 탭 닫기 / beforeunload | SSE `eventSource.close()` |

---

## 주석 인코딩 점검 (2026-05-29)

### 점검 방법

- 파일 raw bytes → UTF-8 디코드: **유효**
- BOM: **없음** (UTF-8 no BOM — 프로젝트 JS 관례와 일치)
- U+FFFD(�), Latin-1 mojibake(`Ã`, `â€`): **미검출**
- 대상: `aichat010.js`, `journal.js`, `login-routing.js`

### 결과 요약

| 파일 | 상태 | 비고 |
|------|------|------|
| `journal.js` | 정상 | 깨진 주석 없음 |
| `login-routing.js` | 정상 | 깨진 주석 없음 |
| `aichat010.js` | **1건 수정 권장** | 아래 상세 |

### `aichat010.js` 상세

| 줄 | 내용 | 판정 | 조치 |
|----|------|------|------|
| **1251** | `// ? 홈메인 : 대화 중` | **깨짐 의심** | `?`는 이모지/기호 소실 가능성. `// false: 홈(웰컴) / true: 대화 중` 등으로 교체 |
| 2787 | `// ?userId=bp0068246&...` | 정상 | URL query string 예시 (`?` = query 시작) |
| 4506 | `…` / `已找到` | 정상 | 의도적 다국어 예시 (ellipsis, CJK) |
| 166, 839, 2170 등 | `—`, `·`, `▶` | 정상 | Unicode 구두점 (em dash, middle dot) |
| 2207–2208, 4087, 5460 | 이모지 주석 (🙈, 📩, 🔍, 😱) | 정상 | UTF-8 이모지; 에디터 폰트에 따라 □ 표시 가능 |
| 5215–5220 | 주석 처리된 구버전 코드 | 정상 | 한글 주석 UTF-8 정상 |

### 편집 시 주의 (TB-003 교훈)

- Windows PowerShell `Set-Content` / 일괄 `StrReplace` on **한글 포함 JS** → CP949/UTF-8 혼선 위험
- 수정은 **UTF-8 (no BOM)** 저장, IDE 또는 `node`/`.NET UTF8Encoding` 단건 편집
- Phase 1 PR에 **L1251 주석 수정** 포함 권장

---

## Sub-agent 분배

```
[TB-004][Frontend] Phase 1a — constants + api + i18n + main.jsp + L1251
[TB-004][Frontend] Phase 1b — hyobee-markdown.js (선택, 별 PR)
[TB-004][QA] 수동 회귀 체크리스트 실행 + PR 기록
```

## 참고

- 분석 근거: `aichat010.js` 구조 리뷰 (God Object, 130+ methods, 40+ globals)
- 관련 경로: `docs/harness/package-scope.md`, `src/main/webapp/webapps/xs/aichat/main.jsp`
