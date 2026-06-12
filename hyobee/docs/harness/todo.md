# 하네스 TODO

프로젝트별 운영 백로그와 DoD를 관리합니다.

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| TB-001 | Main/Contract/Backend/QA | DONE | P0+P1 인증 테스트 + package-scope 문서화 |
| TB-003 | Backend/Contract/QA | DONE | Hyobee 네이밍 + login.jsp/main.jsp + P0+P1 59건 통과 |
| TB-004 | IN PROGRESS | Phase 1a + pre-flight PASS; **브라우저 QA 11 BLOCKED** — [qa-registry §5-1](./qa-registry.md#51-pre-flight-자동http--2026-05-29) |
| TB-005 | Contract/Backend/QA | IN PROGRESS | [TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) — **005a–f DONE**; **`feature/harness/main` 승격 2026-05-30** (PR #2→main 롤백) |

## TB-005 (PLAN — 의존성 현대화)

> **005e 완료 (2026-05-30):** `XtrmJSON` 삭제 · `XtrmJsonNode` 단일 타입 · `gson` pom 제거 · G9 PASS

- [x] **005a** patch 버전 + 미사용 dep 제거 (org.json, guava, ibatis-sqlmap) — G0–G3 PASS (2026-05-30)
- [x] **005b** JDK 17 + record pilot (`JwtClaims`, `VobLoginResult`) — G0–G3 PASS + `JwtClaimsTest` (2026-05-30)
- [x] **005c** jjwt 0.12 + P0 인증 회귀 — G2+G4 PASS (74 tests incl. JWT/SSO, 2026-05-30)
- [x] **005d** aichat v2 Gson 제거 (`xs/aichat/v2/**`) — G5 PASS (2026-05-30)
- [x] **005e** (Epic) `XtrmJSON` → Jackson Strangler + `gson` pom 제거 — [서브 PR 계획](./TB-005-005e-subprs.md)
  - [x] **005e-1** `XtrmJsonNode` + `XtrmJsonNodeTest` (G6 smoke)
  - [x] **005e-2** `XtrmJSON` 내부 위임 (호출부 무변경)
  - [x] **005e-3** `xs/domain/**`
  - [x] **005e-4** `xs/vob/cmmn/**`
  - [x] **005e-5** `xs/core/api/**` (G3 필수)
  - [x] **005e-6** Login/SSO (G4)
  - [x] **005e-7** Management 등 vob 대량
  - [x] **005e-8** Excel/View + GsonHttpMessageConverter
  - [x] **005e-9** `XtrmJSON` 삭제 + gson pom 제거 (G9)
- [x] **005f** (선택) JDK 21 + Virtual thread REST pilot + shared WRTN WebClient pool — G3 PASS (2026-05-30)
- [ ] QA: G0–G4 전 Phase · G5–G9 Phase 005e+ ([TB-005](./TB-005-dependency-modernization.md) · [skill](../.cursor/skills/hyobee-dependency-modernization/SKILL.md))

> **QA 전체 현황:** [qa-registry.md](./qa-registry.md) — 2026-05-29 기준 P0+P1 **59/59 PASS**

## TB-004 (IN PROGRESS — Phase 1a)

- [x] `hyobee-constants.js` / `hyobee-api.js` / `hyobee-i18n.js` 추출
- [x] `main.jsp` script 로드 순서 반영
- [x] `aichat010` facade public API 위임 (`requestApi`, `msg`, `applyMessageTemplate`)
- [x] L1251 주석 인코딩 수정
- [ ] QA 수동 회귀 11항목 (pre-flight §5-1 PASS — [qa-registry.md §5](./qa-registry.md#5-tb-004-수동-frontend-qa) 브라우저 11 BLOCKED, 인간 재실행 필요)
- [ ] (선택) `hyobee-markdown.js` Phase 1b

## TB-001 P0 테스트 (완료)

- [x] `LoginServiceImplTest` — loginHyobeeSSO 4건, loginBase 4건
- [x] `HyobeeApiInterceptorTest` — 6건
- [x] `HyobeeSSOServiceImplTest` — 7건
- [x] `HyobeeSSOControllerTest` — 6건

## TB-001 P1 테스트 (완료)

- [x] `ApiServiceImplTest` — 세션 키 계약 4건
- [x] `XtrmHandlerInterceptorAuthTest` — 인증 분기 9건
- [x] `AuthPagePreloadTest` — JSP 게이트 9건

## TB-003 (완료)

- [x] Hyobee 클래스 리네이밍 (`HyobeeSSO*`, `HyobeeAuth*`, `HyobeeJwt*`, `HyobeeChatApiClient`)
- [x] `loginHyobeeSSO`, canonical JSP (`login.jsp`, `main.jsp`), `HyobeePagePaths`
- [x] `HyobeePagePathsTest` 3건 추가
- [x] `auth-flow-analysis.md` · harness 문서 갱신

## P2 (보류)

- [ ] `LoginControllerTest` — 로그인 API 위임
- [ ] `HyobeeAuthControllerTest` — JWT verify API

## 보류 인프라

| 항목 | 상태 | 비고 |
|------|--------|------|
| CI/CD mirror setup | TODO | 환경 준비 후 적용 |
| Secrets management | TODO | 운영 배포 전 완료 |

## 참고

- 구현 요청 첫 턴에 이 문서의 티켓/DoD를 반드시 확인.
- 인증/세션 관련 변경은 `docs/harness/auth-flow-analysis.md` 갱신을 기본으로 한다.
