# QA 레지스트리 (Registry)

Hyobee 하네스 **전체 QA 항목**과 **최종 실행 결과**를 기록하는 living document입니다.

| 메타 | 값 |
|------|-----|
| 기준 브랜치 | `feature/harness/main` |
| 최종 자동화 실행 | **2026-05-29** — `mvn test -DfailIfNoTests=false` · **P0+P1 59/59 PASS** |
| P0+P1 게이트 명령 | [package-scope.md § 인증 회귀](./package-scope.md) · [qa.mdc](../../.cursor/rules/qa.mdc) |
| 성숙도·Before/After | [harness-status.md](./harness-status.md) |
| 최종 TB-004 QA 시도 | **2026-05-29** — pre-flight PASS · 브라우저 11항 BLOCKED (`2210bf92`, `:8080`) |
| **rnd/main vs harness** | **2026-05-29** — [§11](#11-rndmain-vs-featureharnessmain-2026-05-29) (`1eb7168a` vs `2210bf92`) |

**상태 기호:** `PASS` · `FAIL` · `ERROR` · `SKIP` · `PENDING` · `BLOCKED` · `N/A`

---

## 1. 요약 대시board

| 구분 | 항목 수 | PASS | FAIL/ERROR | PENDING | SKIP | 비고 |
|------|---------|------|------------|---------|------|------|
| **P0+P1 자동화** (`@Test`) | **59** | **59** | 0 | 0 | 0 | 게이트 **충족** (§2-1 수정 완료) |
| **P2 자동화** (`@Test`) | **20** | **20** | 0 | 0 | 0 | 공식 게이트 밖, 2026-05-29 전체 실행 기준 |
| **기타 자동화** (하네스 밖) | **14** | **13** | 0 | 0 | **1** | `WrtnExternalApiHealthCheckTest` SKIP |
| **TB-004 수동 FE** | **11** | 0 | 0 | 0 | **11 BLOCKED** | pre-flight §5-1 PASS; 브라우저 미실행 |
| **TB-004 pre-flight** | **5** | **5** | 0 | 0 | — | §5-1 (2026-05-29) |
| **PR·프로세스 게이트** | **11** | **8** | 0 | **3** | — | §4 (증적 기반) |
| **정적 점검 (TB-004)** | **4** | **4** | 0 | 0 | — | JS UTF-8·L1251 §5 |

> **주의:** `-Dtest=Class1,Class2,...` 만으로는 `@Nested` 테스트(`LoginServiceImplTest` 등)가 **누락**될 수 있음. P0+P1 검증은 **`mvn test` 전체** 또는 nested 포함 패턴 사용.

---

## 2. P0+P1 자동화 — 클래스별

최종 실행: **2026-05-29** · 명령: `mvn test -DfailIfNoTests=false`

| 우선순위 | 클래스 | `@Test` | PASS | ERROR | 결과 | 검증 대상 |
|----------|--------|---------|------|-------|------|-----------|
| P0 | `HyobeeSSOServiceImplTest` | 7 | 7 | 0 | **PASS** | SSO JWT·사용자·voblogin |
| P0 | `HyobeeSSOControllerTest` | 6 | 6 | 0 | **PASS** | voblogin → `main.jsp` / 403 |
| P0 | `LoginServiceImplTest` | 15 | 15 | 0 | **PASS** | loginBase / loginHyobeeSSO |
| P0 | `HyobeeApiInterceptorTest` | 6 | 6 | 0 | **PASS** | `/xs/aichat/**` JWT 게이트 |
| P1 | `ApiServiceImplTest` | 4 | 4 | 0 | **PASS** | 세션 키 계약 |
| P1 | `XtrmHandlerInterceptorAuthTest` | 9 | 9 | 0 | **PASS** | 레거시 API 권한 분기 |
| P1 | `AuthPagePreloadTest` | 9 | 9 | 0 | **PASS** | JSP 게이트 login/main |
| P1 | `HyobeePagePathsTest` | 3 | 3 | 0 | **PASS** | config redirect 경로 |
| | **합계** | **59** | **59** | **0** | **게이트 PASS** | |

### 2-1. ERROR 수정 이력 (2026-05-29)

| # | 클래스 | 원인 | 수정 |
|---|--------|------|------|
| 1–4 | `LoginServiceImplTest` `LoginHyobeeSSO` | `XtrmProperty.getServiceMode()` 순환 → `StackOverflowError`; 403 경로 `XtrmJSON.toString()` → `gson` null | `buildProperty`에 `SERVICE_MODE`, `DUPLICATION_LOGIN_AVAILABLE` 추가; nested `@BeforeEach`에서 `gson` bean 등록 |
| 5–6 | `AuthPagePreloadTest` `PageLoadValidation` | 403 경로 `XtrmJSON.toString()` → `gson` null | nested `@BeforeEach`에서 `gson` bean 등록 |

**재검증:** `mvn test -DfailIfNoTests=false` — P0+P1 **59/59 PASS**

---

## 3. P0+P1 — 케이스별 목록

### 3-1. `HyobeePagePathsTest` (P1) — 3/3 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | LOGIN_PAGE_URL을 절대 경로로 변환 | PASS |
| 2 | MAIN_PAGE_URL을 절대 경로로 변환 | PASS |
| 3 | Spring redirect: 접두사 포함 경로 | PASS |

### 3-2. `HyobeeSSOControllerTest` (P0) — 6/6 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | GET /ssologin → ssoLogin 위임 | PASS |
| 2 | POST /ssologin → ssoLogin 위임 | PASS |
| 3 | GET /voblogin 성공 → 쿠키 + main.jsp 리다이렉트 | PASS |
| 4 | POST /voblogin 성공 → 쿠키·리다이렉트 | PASS |
| 5 | GET /voblogin 실패 → 403 + XTRM_ERROR_DATA | PASS |
| 6 | POST /voblogin 실패 → 403 + XTRM_ERROR_DATA | PASS |

### 3-3. `HyobeeSSOServiceImplTest` (P0) — 7/7 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | 정상 토큰 + 사용자 존재 시 success=true | PASS |
| 2 | samaccountname 누락 시 오류 | PASS |
| 3 | 사용자 조회 실패 시 오류 | PASS |
| 4 | id_token 누락 시 실패 | PASS |
| 5 | Accept-Language en fallback | PASS |
| 6 | 잘못된 JWT 형식 실패 | PASS |
| 7 | loginHyobeeSSO 내부 예외 → 내부 오류 | PASS |

### 3-4. `HyobeeApiInterceptorTest` (P0) — 6/6 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | 세션 USER_ID만 있으면 JWT 재발급 후 통과 | PASS |
| 2 | 유효 Bearer JWT → 세션 보강 | PASS |
| 3 | 무효 Bearer → 세션 JWT fallback | PASS |
| 4 | 사용자 식별 불가 → 401 | PASS |
| 5 | loginType=SSO 쿠키 덮어쓰지 않음 | PASS |
| 6 | loginType 없으면 NORMAL 쿠키 | PASS |

### 3-5. `ApiServiceImplTest` (P1) — 4/4 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | createSessionAndUpdate — 필수 세션 키 | PASS |
| 2 | X-Forwarded-For → ACCESS_IP | PASS |
| 3 | languageCode → LANGUAGE_CODE | PASS |
| 4 | 3-arg — 필수 세션 키 | PASS |

### 3-6. `XtrmHandlerInterceptorAuthTest` (P1) — 9/9 PASS

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | checkValidSession — 세션 없음 false | PASS |
| 2 | checkValidSession — USER_ID 없음 false | PASS |
| 3 | checkValidSession — USER_ID 있음 true | PASS |
| 4 | checkFuncAuthorization — AUTH_TYPE=N skip | PASS |
| 5 | checkFuncAuthorization — 조회 권한 true | PASS |
| 6 | checkFuncAuthorization — 메뉴 권한 없음 false | PASS |
| 7 | checkValidParameter — menuKey 형식 오류 false | PASS |
| 8 | checkValidParameter — AUTH_TYPE 비허용 false | PASS |
| 9 | checkValidParameter — 유효하면 true | PASS |

### 3-7. `AuthPagePreloadTest` (P1) — 7/9 PASS, **2 ERROR**

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | checkValidSession — 세션 없음 false | PASS |
| 2 | checkValidSession — USER_ID 있음 true | PASS |
| 3 | checkRequestMenuInfo — menuKey 비어 false | PASS |
| 4 | checkRequestMenuInfo — menuKey 있음 true | PASS |
| 5 | checkValidAuthorization — AUTH_MENU_INFO 포함 true | PASS |
| 6 | checkValidAuthorization — 권한 없음 false | PASS |
| 7 | checkValidationBeforePageLoad — **세션 없이 보호 페이지 403** | **ERROR** |
| 8 | checkValidationBeforePageLoad — 로그인 페이지 통과 | PASS |
| 9 | checkValidationBeforePageLoad — **menuKey 누락 403** | **ERROR** |

### 3-8. `LoginServiceImplTest` (P0) — 11/15 PASS, **4 ERROR**

| # | DisplayName | 결과 |
|---|-------------|------|
| 1 | createOTPEncryptKey — ENCRYPT_KEY 설정 | PASS |
| 2 | loginOTP — 미지원 메시지 | PASS |
| 3 | loginSMSMail — 미지원 | PASS |
| 4 | sendCertificationNumber — 미지원 | PASS |
| 5 | loginCertification — 미지원 | PASS |
| 6 | createOTPKey — 미지원 | PASS |
| 7 | changePasswordOTP — 미지원 | PASS |
| 8 | loginHyobeeSSO — **정상 세션 생성** | **ERROR** |
| 9 | loginHyobeeSSO — **DB 없는 사용자 403** | **ERROR** |
| 10 | loginHyobeeSSO — **acceptLanguage 전달** | **ERROR** |
| 11 | loginHyobeeSSO — **companyCode 설정** | **ERROR** |
| 12 | loginBase — ENCRYPT_KEY 없음 | PASS |
| 13 | loginBase — 파라미터 누락 | PASS |
| 14 | loginBase — 정상 복호화·세션 | PASS |
| 15 | loginBase — X-Forwarded-For IP | PASS |

---

## 4. P2 자동화 — 클래스별 (게이트 밖)

2026-05-29 `mvn test` 전체 실행 기준 **20/20 PASS**. TB-001 DoD상 **보류** (`todo.md` P2).

| 클래스 | `@Test` | 결과 | 검증 대상 |
|--------|---------|------|-----------|
| `LoginControllerTest` | 7 | PASS | 로그인 API 위임 |
| `HyobeeAuthControllerTest` | 7 | PASS | JWT verify API |
| `HyobeeJwtTokenServiceImplTest` | 6 | PASS | JWT 발급/검증 |

---

## 5. TB-004 수동 Frontend QA

출처: [TB-004-aichat010-modularization.md §QA](./TB-004-aichat010-modularization.md#qa-수동-회귀-체크리스트)  
Skill: `.cursor/skills/hyobee-aichat-manual-qa/SKILL.md`

**2026-05-29 시도 요약:** pre-flight(§5-1) **5/5 PASS**. 브라우저 11항은 **인증 세션·SSE·HiCloud 팝업** 필요 — Cursor Agent 세션에서 상호작용 불가 → 전 항 **BLOCKED**. 인간 QA 재실행 필요.

| # | 시나리오 | 기대 | 결과 | 실행일 | 실행자 |
|---|----------|------|------|--------|--------|
| 1 | `main.jsp` 최초 로드 | 웰컴·사이드바 대화 목록 | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 2 | 사내검색 + Enter | SSE·입력 잠금/해제 | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 3 | 웹/RND 전환 | placeholder·테마 | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 4 | 새 대화 | `#box` 초기화·첨부 cleared | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 5 | 대화 이력 클릭 | 메시지·스크롤 | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 6 | 대화 중지 | interrupt·중지 문구 | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 7 | 로컬 파일 첨부 | validate·upload·bubble | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 8 | HiCloud 첨부 | popup·callback | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 9 | 저널 전환 | `journal.completePageRender` | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 10 | 401 응답 | login-routing redirect | **BLOCKED** | 2026-05-29 | Cursor Agent |
| 11 | beforeunload | SSE close | **BLOCKED** | 2026-05-29 | Cursor Agent |

**BLOCKED 사유:** 로컬 `:8080` 기동 확인·정적 리소스 HTTP 200·script 순서 검증까지 완료. UI/SSE/파일/HiCloud/401 재현은 **로그인된 브라우저**에서만 가능. PASS 표기는 실제 브라우저 실행 후에만.

### 5-1. Pre-flight (자동·HTTP — 2026-05-29)

커밋 `2210bf92` · 서버 `http://localhost:8080` (기존 인스턴스)

| # | 검증 | 결과 | 비고 |
|---|------|------|------|
| 1 | `node --check` 6개 v2 JS | **PASS** | constants, i18n, api, aichat010, login-routing, journal |
| 2 | HTTP 200 `hyobee-constants.js` | **PASS** | len=2454 |
| 3 | HTTP 200 `hyobee-api.js` | **PASS** | |
| 4 | HTTP 200 `main.jsp` | **PASS** | |
| 5 | script 순서 Phase 1a | **PASS** | constants→i18n→api→aichat010→login-routing→journal |

**인간 QA 재실행:** 로그인 후 §5 표 11항을 브라우저에서 실행 → PASS 시 `todo.md` TB-004 DoD 완료 가능.

---

## 6. 정적·비기능 QA (TB-004)

| # | 항목 | 결과 | 비고 |
|---|------|------|------|
| 1 | `aichat010.js` UTF-8 유효성 | PASS | 2026-05-29 |
| 2 | `journal.js` / `login-routing.js` 주석 | PASS | 깨짐 없음 |
| 3 | L1251 주석 인코딩 수정 | PASS | TB-004 Phase 1a |
| 4 | `hyobee-*.js` Node `--check` | PASS | 구문 검사 |

---

## 7. PR·프로세스 게이트 (티켓 증적)

| # | 항목 | TB-001 | TB-002 | TB-003 | TB-004 | 출처 |
|---|------|--------|--------|--------|--------|------|
| 1 | `main` 직접 커밋 없음 | PASS | PASS | PASS | PASS | feature 브랜치 사용 |
| 2 | 티켓·범위 문서화 | PASS | PASS | PASS | PASS | `todo.md` |
| 3 | 역할 경계 준수 | PASS | PASS | PASS | PASS | BE/FE 분리 |
| 4 | `feature/TB-*` 브랜치명 | N/A | PASS | PASS | PASS | git log |
| 5 | no-ff merge → harness | N/A | PASS | PASS | PASS | `feature/harness/main` |
| 6 | P0+P1 `mvn test` PASS | PASS* | — | PASS* | **FAIL** | *당시 59 PASS 기록; **현재 §2 ERROR 6** |
| 7 | auth-flow / package-scope 갱신 | PASS | — | PASS | PARTIAL | TB-004 scope FE only |
| 8 | frontend test gate | N/A | N/A | N/A | **BLOCKED** | §5-1 pre-flight PASS; §5 브라우저 11 BLOCKED |
| 9 | DB/Flyway rollback note | N/A | N/A | N/A | N/A | 해당 없음 |
| 10 | hook fallback 기록 | N/A | N/A | N/A | N/A | 미사용 |
| 11 | PR URL / CI green | **PENDING** | **PENDING** | **PENDING** | **PENDING** | CI 미구축 |

---

## 8. 티켓 DoD 대조

| 티켓 | DoD QA 관점 | 레지스트리 판정 |
|------|-------------|-----------------|
| TB-001 | P0+P1 인증 테스트 | **충족** — 59/59 PASS (2026-05-29, §2-1 수정) |
| TB-003 | P0+P1 59건 + HyobeePagePaths | **충족** — 59/59 PASS |
| TB-004 | Phase 1a + 수동 QA 11 | 코드·정적·pre-flight PASS; **브라우저 11 BLOCKED** |

---

## 9. 갱신 절차

1. **자동화:** `cd hyobee` → `mvn test -DfailIfNoTests=false`
2. **§1·§2·§3** 결과·날짜 갱신 (ERROR 시 §2-1 메서드명 기록)
3. **수동 FE:** §5 실행 후 PASS/PENDING·실행자·날짜 기입
4. **티켓 완료:** §8 판정 → `todo.md` DoD 동기화
5. PR 본문에 링크: `docs/harness/qa-registry.md` (커밋 SHA 또는 실행일)

```powershell
# P0+P1만 재실행 (nested 누락 주의 — 전체 test 권장)
cd hyobee
mvn test "-DfailIfNoTests=false"
```

---

## 10. 하네스 전·후 비교 분석 (2026-05-29)

**가능 여부:** **예** — git 스냅샷 + `mvn test`로 재현 가능. 다만 **동일 QA 집합이 아님**(아래 §10-1). 공정 비교는 **겹치는 클래스·케이스**와 **게이트 정의 변화**를 분리해 읽는다.

| 스냅샷 | 커밋 | worktree / 브랜치 |
|--------|------|-------------------|
| **도입 전** | `1eb7168a` (`7df7aa82^`) | `hyobee-qa-pre` |
| **도입 직후** | `7df7aa82` | `C:/tmp/hyobee-hi` |
| **현재** | `2210bf92` | `feature/harness/main` |

실행 명령: 각 스냅샷 `hyobee` 모듈에서 `mvn test -DfailIfNoTests=false`

### 10-1. 비교 시 주의 (apples-to-oranges)

| 구분 | 도입 전 | 도입 후 |
|------|---------|---------|
| P0+P1 **공식 게이트** | **없음** | 8클래스 59 `@Test` |
| 프로세스 체크리스트 | 0 | 25 (PR + qa.mdc) |
| TB-004 수동 FE | 없음 | 11 (전부 PENDING) |
| 클래스 rename | `Aichat*Test` | `Hyobee*Test` (TB-003) |
| `LoginServiceImplTest` | flat 7건 | `@Nested` 15건 (+loginHyobeeSSO) |

→ “전체 PASS율” 단순 비교는 **게이트가 없던 시절 100% vs 현재 90%**처럼 왜곡될 수 있음. **겹치는 36건**과 **신규 23건**을 나눠 본다.

### 10-2. 프로세스·문서 게이트

| 항목 | 도입 전 | 도입 직후 | 현재 | 해석 |
|------|---------|-----------|------|------|
| PR + qa.mdc 체크 항목 | 0 | 23 | **25** | **프로세스 QA는 전면 신설** |
| TB-004 수동 시나리오 | — | — | 11 **PENDING** | 정의만 됨, 실행 증적 없음 |
| PR URL / CI green | — | PENDING | PENDING | CI 미구축 |

### 10-3. 자동화 — 겹치는 6클래스 (36 `@Test`, 도입 전 존재)

도입 전 `mvn test -Dtest=LoginServiceImplTest,HyobeeSSOServiceImplTest,HyobeeSSOControllerTest,AichatJwtTokenServiceImplTest,AichatAuthControllerTest,LoginControllerTest`

| 클래스 | 도입 전 | 도입 직후* | 현재* | 비고 |
|--------|---------|------------|-------|------|
| `LoginServiceImplTest` | **7/7 PASS** | 9/15 (6 ERROR) | 11/15 (4 ERROR) | *건수·구조 변경; loginBase는 TB-003 후 PASS |
| `HyobeeSSOServiceImplTest` | 4/4 | 7/7 | 7/7 | +3 `@Test` |
| `HyobeeSSOControllerTest` | 5/5 | 6/6 | 6/6 | +1 `@Test` |
| JWT controller test | 6/6 (`Aichat…`) | 7/7 (`Aichat…`) | 7/7 (`HyobeeAuth…`) | rename, P2 |
| `LoginControllerTest` | 7/7 | 7/7 | 7/7 | P2 |
| **소계 (36건)** | **36/36 PASS** | — | — | 도입 전 baseline |

도입 전 **전체** `mvn test`: **67 run, 1 FAIL, 1 SKIP** — `RequestDataArgumentResolverTest` FAIL (하네스 게이트 **미포함**).

### 10-4. P0+P1 공식 게이트 — 실행 결과 3-way

| 스냅샷 | `@Test` | PASS | ERROR/FAIL | 게이트 |
|--------|---------|------|------------|--------|
| 도입 전 | — (미정의) | — | — | N/A |
| 도입 직후 | **56** | **50** | **6 ERROR** | **FAIL** |
| 현재 | **59** | **59** | **0** | **PASS** |

**도입 직후 ERROR (6)** — 전부 `LoginServiceImplTest` `StackOverflowError` (loginBase + loginHyobeeSSO nested).

**현재 ERROR (6)** — `LoginServiceImplTest` loginHyobeeSSO **4건** + `AuthPagePreloadTest` JSP gate **2건** (`gson` NPE, TB-003 이후 회귀).

| 클래스 | 도입 직후 | 현재 | 변화 |
|--------|-----------|------|------|
| `HyobeeSSOServiceImplTest` | 7/7 | 7/7 | 유지 |
| `HyobeeSSOControllerTest` | 6/6 | 6/6 | 유지 |
| `HyobeeApiInterceptorTest` | 6/6 | 6/6 | **신규, PASS** |
| `ApiServiceImplTest` | 4/4 | 4/4 | **신규, PASS** |
| `XtrmHandlerInterceptorAuthTest` | 9/9 | 9/9 | **신규, PASS** |
| `AuthPagePreloadTest` | **9/9** | **7/9** | 신규 → TB-003 후 **2 ERROR** |
| `HyobeePagePathsTest` | — | **3/3** | TB-003 **신규, PASS** |
| `LoginServiceImplTest` | **9/15** | **11/15** | loginBase 복구, loginHyobeeSSO 4 ERROR 잔존 |

### 10-5. 종합 판정

| 관점 | 도입 전 | 하네스 후 | 평가 |
|------|---------|-----------|------|
| **가시성** | 우선순위·일괄 게이트 없음 | P0/P1/P2·레지스트리·25 프로세스 항목 | **개선** |
| **커버리지** | 36 auth `@Test` (비체계) | +23 gate `@Test` (인터셉터·JSP·세션) | **확대** |
| **겹치는 36건 품질** | 36/36 PASS | loginHyobeeSSO·JSP gate 미통과 | **일부 회귀/미완** |
| **P0+P1 게이트 green** | 정의 없음 | **도입일부터 FAIL** (기록과 불일치 가능) | **미달** |
| **수동 FE (TB-004)** | 없음 | 11 정의, 0 실행 | **미착수** |

**한 줄:** 하네스는 QA **체계·범위·추적성**은 분명히 올렸지만, **P0+P1 자동화 게이트는 아직 한 번도 green이 아님**(full `mvn test` 기준). TB-003에서 loginBase 2건은 회복했으나 AuthPagePreload 2건이 새로 깨짐.

### 10-6. 재현·갱신

```powershell
# 도입 전 (worktree)
cd ..\hyobee-qa-pre\hyobee
mvn test -DfailIfNoTests=false

# 도입 직후
cd C:\tmp\hyobee-hi\hyobee
mvn test -DfailIfNoTests=false

# 현재
cd hyobee
mvn test -DfailIfNoTests=false
```

---

## 11. rnd/main vs feature/harness/main (2026-05-29)

**목적:** 승격 검토용 baseline (`rnd/main`) 대비 harness 라인 QA 차이 기록.

| 스냅샷 | 커밋 | 브랜치 | worktree |
|--------|------|--------|----------|
| **rnd/main** | `1eb7168a` | `rnd/main` | `C:/tmp/hbrnd/hyobee` |
| **harness** | `2210bf92` | `feature/harness/main` | 현재 clone |

**명령 (공통):** `mvn test -DfailIfNoTests=false`

> worktree 참고: repo 상위 `../hyobee-qa-rnd-main` 은 Windows 경로 길이 제한으로 실패(exit 128). **`C:/tmp/hbrnd`** 사용.

### 11-1. 전체 모듈

| 구분 | rnd/main | feature/harness/main | Δ |
|------|----------|----------------------|---|
| `@Test` run | 67 | 93 | +26 |
| PASS | **65** | **86** | +21 |
| FAIL | **1** | 0 | −1 |
| ERROR | 0 | **6** | +6 |
| SKIP | 1 | 1 | 0 |
| **성공률** | 97.0% | 92.5% | −4.5%p |

**rnd/main FAIL (1):** `RequestDataArgumentResolverTest.resolveFromQuery_directMode` — expected `"user-1"`, was `null` (하네스 게이트 **미포함**, harness에서 **삭제** TB-002).

| **harness ERROR (6)** | §2-1 — **수정 완료** 2026-05-29 → **59/59 PASS** |

### 11-2. 겹치는 인증 6클래스 (rnd/main baseline 36건)

| 클래스 | rnd/main | harness/main | 비고 |
|--------|----------|--------------|------|
| `LoginServiceImplTest` | **7/7** | **15/15 PASS** | +8 `@Test`, loginHyobeeSSO 포함 |
| `HyobeeSSOServiceImplTest` | **4/4** | **7/7** | +3 `@Test`, PASS |
| `HyobeeSSOControllerTest` | **5/5** | **6/6** | +1 `@Test`, PASS |
| JWT test | **6/6** (`AichatJwtTokenServiceImplTest`) | **6/6** (`HyobeeJwtTokenServiceImplTest`) | rename, P2 |
| `LoginControllerTest` | **7/7** | **7/7** | P2 |
| Auth controller | **7/7** (`AichatAuthControllerTest`) | **7/7** (`HyobeeAuthControllerTest`) | rename |
| **소계** | **36/36 PASS** | **48/48 PASS** | 겹치는 6클래스 **100%** |

### 11-3. harness 신규 P0+P1 (rnd/main 없음)

| 클래스 | harness | rnd/main |
|--------|---------|----------|
| `HyobeeApiInterceptorTest` | **6/6 PASS** | 없음 |
| `ApiServiceImplTest` | **4/4 PASS** | 없음 |
| `XtrmHandlerInterceptorAuthTest` | **9/9 PASS** | 없음 |
| `AuthPagePreloadTest` | **9/9 PASS** | 없음 |
| `HyobeePagePathsTest` | **3/3 PASS** | 없음 |
| **P0+P1 공식 게이트** | **59/59 PASS** | **미정의** |

### 11-4. harness에서 제거·축소 (rnd/main 대비)

| 클래스 | rnd/main | harness/main |
|--------|----------|--------------|
| `AichatControllerSendMessageTest` | 1/1 PASS | 삭제 (TB-002) |
| `RequestDataArgumentResolverTest` | 0/1 FAIL | 삭제 |
| `ChatServiceImplTest` | 10/10 PASS | 1/1 |
| `HyobeeChatControllerTest` | 8/8 PASS | 2/2 |

### 11-5. 종합 (rnd/main QA 관점)

| 관점 | rnd/main | harness/main |
|------|----------|--------------|
| 공식 P0+P1 게이트 | 없음 | **59/59 PASS** |
| 겹치는 auth 36건 | **36/36 green** | **48/48 green** (동일 6클래스) |
| 전체 `mvn test` | 65/67 (Resolver 1 FAIL) | **92/93** (1 SKIP) |
| 프로세스·수동 QA | 없음 | PR gates 25 + TB-004 11 BLOCKED |

**승격 전 조치:** ~~§2-1 ERROR 6건~~ ✅ · TB-004 브라우저 QA → `rnd/main` no-ff merge 검토.

### 11-6. 재현

```powershell
# rnd/main
git worktree add C:/tmp/hbrnd rnd/main
cd C:/tmp/hbrnd/hyobee
mvn test -DfailIfNoTests=false

# harness
cd hyobee   # feature/harness/main
mvn test -DfailIfNoTests=false

# 정리
git worktree remove C:/tmp/hbrnd
```

---

## 12. TB-005 의존성 현대화 QA (G0–G9)

> 상세: [TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) · Skill: [hyobee-dependency-modernization](../../.cursor/skills/hyobee-dependency-modernization/SKILL.md)

**상태:** PLAN — Phase별 실행 시 본 절 갱신 (§9 절차)

| Gate | 이름 | 필수 조건 | Phase |
|------|------|-----------|-------|
| G0 | Compile | `mvn -q compile test-compile` ERROR 0 | 전 Phase |
| G1 | Dep analyze | `mvn dependency:analyze` — 제거 대상 unused declared 0 | 005a+ |
| G2 | P0+P1 auth | `mvn test -DfailIfNoTests=false` **59/59 PASS** | 전 Phase |
| G3 | JDK smoke | JDK 17+; record pilot 단위 테스트 PASS | 005b+ |
| G4 | JWT contract | SSO·JWT·Interceptor 테스트 PASS | 005c+ |
| G5 | Gson mock 제거 | `LoginServiceImplTest`, `AuthPagePreloadTest` gson stub 없이 PASS | 005e+ |
| G6 | Legacy API | `ApiServiceImplTest` + HEADER/DATA envelope smoke | 005e-2+ |
| G7 | aichat v2 HTTP | snake_case JSON integration smoke | 005d+ |
| G8 | VT load (선택) | 동시 REST 50, thread dump 정상 | 005f |
| G9 | Gson 제거 완료 | dep:tree `gson` 없음; prod src Gson import 0 | 005e-4 |

**Hard Gate:** TB-005 PR은 G2 **59/59** 미달 시 merge 불가. 005e-4는 G9 추가 필수.

---

## 13. 관련 문서

| 문서 | 용도 |
|------|------|
| [harness-status.md](./harness-status.md) | 성숙도·QA Before/After 통계 |
| [package-scope.md](./package-scope.md) | P0+P1 클래스·mvn `-Dtest` |
| [qa.mdc](../../.cursor/rules/qa.mdc) | QA 에이전트 우선순위 |
| [todo.md](./todo.md) | 티켓 DoD |
| [TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) | dep·JDK·XtrmJSON Epic |
