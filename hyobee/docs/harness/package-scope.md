# Hyobee 패키지 스코프 (에이전트 공통)

에이전트별 수정/검증 범위의 단일 기준선입니다. 상세 역할은 `agent-hierarchy.md`를 따릅니다.

## 인증/세션 핵심 경로 (운영 기준)

| 구분 | 패키지/경로 | 책임 |
|------|-------------|------|
| 일반 로그인 | `xs/webbase/login/**` | JSON 로그인 API |
| SSO | `xs/aichat/controller/HyobeeSSOController`, `xs/aichat/service/HyobeeSSOServiceImpl` | IdP 연동 및 voblogin |
| 화면 redirect | `xs/aichat/config/HyobeePagePaths`, `xs/webbase/main/controller/HomeController` | config 기반 login/main redirect |
| 세션 생성 | `xs/core/api/service/ApiServiceImpl` | 로그인 후 세션 키 설정 |
| 레거시 API 게이트 | `xs/core/config/XtrmHandlerInterceptor` | 세션/권한/menuKey |
| Aichat API 게이트 | `xs/core/config/HyobeeApiInterceptor` | JWT/세션 사용자 해석 |
| JSP 게이트 | `xs/vob/management/AuthPagePreload`, `xs/core/config/XtrmSecurityConifg` | JSP 진입 전 검증 |

## 화면 JSP (TB-003, canonical)

| 용도 | config 키 | 경로 |
|------|-----------|------|
| 로그인 | `LOGIN_PAGE_URL` | `webapps/xs/webbase/login/login.jsp` |
| 채팅 메인 | `MAIN_PAGE_URL`, `AI_CHAT_URL` | `webapps/xs/aichat/main.jsp` |

레거시 `login010.jsp`, `aichat010.jsp`, `v2/aichat010.jsp`는 redirect stub만 유지.

## v2 채팅 JS (TB-004, `main.jsp` 로드 순서)

| 파일 | 역할 |
|------|------|
| `hyobee-constants.js` | `HyobeeConstants` — FILE_VALIDATION, 저널 허용 코드 등 |
| `hyobee-i18n.js` | `HyobeeI18n` — `msg`, `applyMessageTemplate` |
| `hyobee-api.js` | `HyobeeApi` — `request`, `paths` |
| `aichat010.js` | facade (`window.aichat010`) — DOM/SSE/대화 UI |
| `login-routing.js` | 401 redirect patch |
| `journal.js` | 저널 영역 전환 |

## 에이전트별 스코프

| Agent | 허용 | 금지/주의 |
|-------|------|-----------|
| Main | `docs/**`, 브랜치/worktree 운영 | `main` 직접 커밋 |
| Contract | `docs/**`, `**/controller/**`, `**/dto/**`, 인증 계약 문서 | 구현 로직 선행 변경 |
| Backend | `src/main/java/xs/**`, `src/test/java/xs/**` | `src/main/resources/static/**` (Frontend 합의 없이) |
| Frontend | `src/main/resources/static/**`, `src/main/webapp/**`, UI 문서 | Java 비즈니스 로직 |
| QA | `src/test/java/**`, `.github/PULL_REQUEST_TEMPLATE.md`, `docs/harness/**` | 범위 밖 기능 변경 |

## 인증 회귀 테스트 (P0 + P1)

P0+P1 **59건** · 케이스별 PASS/FAIL: **[qa-registry.md](./qa-registry.md)** · 통계: [harness-status.md §3](./harness-status.md#3-qa-게이트--도입-전-vs-후)

권장: 전체 테스트 실행 후 인증 관련 클래스 결과 확인

```bash
mvn test -DfailIfNoTests=false
```

인증 전용 클래스 (P0+P1, 59건):

| 클래스 | 건수 |
|--------|------|
| `LoginServiceImplTest` | 15 |
| `HyobeeSSOServiceImplTest` | 7 |
| `HyobeeSSOControllerTest` | 6 |
| `HyobeeApiInterceptorTest` | 6 |
| `ApiServiceImplTest` | 4 |
| `XtrmHandlerInterceptorAuthTest` | 9 |
| `AuthPagePreloadTest` | 9 |
| `HyobeePagePathsTest` | 3 |

Windows PowerShell에서 `-Dtest` 다중 클래스 예:

```powershell
mvn test "-Dtest=HyobeePagePathsTest,AuthPagePreloadTest,HyobeeSSOControllerTest,HyobeeSSOServiceImplTest,LoginServiceImplTest,HyobeeApiInterceptorTest,ApiServiceImplTest,XtrmHandlerInterceptorAuthTest"
```

## 레거시 정리 (TB-002 · TB-003)

### TB-002 (제거 완료)

- `SSOAuthServiceImpl`, `LoginService#loginSSO`, `XtrmServletFilter`
- v1 Aichat API: `AichatController`, `AichatServiceImpl`, `AichatFileService*`, `xs.aichat.vendor.*`
- `XtrmTokenInterceptor`, `/xs/vob/api/**`, `vob/aisearch` 정적 리소스
- UI 목업: `webapps/xs/aichat/prototype/**`, 관리자: `webapps/xs/aichat/admin/admin010.jsp`

### TB-003 (Hyobee 네이밍 · JSP 정리)

- `AichatSSO*` → `HyobeeSSO*`, `AichatAuthController` → `HyobeeAuthController`
- `AichatJwtTokenService*` → `HyobeeJwtTokenService*`, `loginAichatSSO` → `loginHyobeeSSO`
- `XtrmAichatInterface` → `HyobeeChatApiClient`, `AichatLogService` → `ChatLogService`(v2)
- canonical JSP: `login.jsp`, `main.jsp` (API URL `/xs/vob/aichat/**` 유지)
