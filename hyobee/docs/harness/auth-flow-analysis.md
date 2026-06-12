# 인증/로그인 실행 흐름 분석 (TB-001 · TB-003)

## 목적

하네스 엔지니어링 도입 시, 운영 중인 실제 로그인/권한 흐름을 단일 기준선으로 고정합니다.

## 현재 프로젝트 상태 요약

- 런타임: Spring Boot 2.7 + Java 11 + Maven WAR
- 주요 패키지:
  - `xs/webbase/login/**` 일반 로그인
  - `xs/aichat/**` Hyobee SSO·JWT·챗 도메인 (API URL은 기존 `/xs/vob/aichat/**`, `/xs/aichat/**` 유지)
  - `xs/core/config/**` 필터/인터셉터/공통 설정
- P0+P1 회귀 테스트로 로그인·SSO·JSP 게이트·인터셉터 계약 고정 (`package-scope.md` 참고)

## 화면 JSP (TB-003)

| 용도 | 설정 키 | canonical 경로 | 비고 |
|------|---------|----------------|------|
| 로그인 | `LOGIN_PAGE_URL` | `webapps/xs/webbase/login/login.jsp` | |
| 채팅 메인 | `MAIN_PAGE_URL`, `AI_CHAT_URL` | `webapps/xs/aichat/main.jsp` | 동일 경로 |

- **레거시 URL 호환**: `login010.jsp`, `aichat010.jsp`, `v2/aichat010.jsp`는 redirect stub만 유지(비즈니스 로직 없음).
- **리다이렉트 단일 진입점**: `xs.aichat.config.HyobeePagePaths` — `HomeController`, `HyobeeSSOController` 등에서 config 기반 redirect.
- JSP 게이트: `AuthPagePreload`가 위 canonical 경로를 예외 페이지로 처리.

## 로그인 실행 흐름

### 1) 일반 로그인

1. `POST /xs/webbase/login/loginBase.json`
2. `LoginController#loginBase`
3. `LoginServiceImpl#loginBase`
4. `ApiServiceImpl#createSessionAndUpdate` (세션 키 설정)
5. 이후 요청은 `XtrmHandlerInterceptor`를 통해 세션/권한 검증

## SSO 실행 흐름 (실운영 기준)

1. `/xs/vob/aichat/ssologin` (IdP 리다이렉트) — `HyobeeSSOController`
2. `/xs/vob/aichat/voblogin` (토큰 수신)
3. `HyobeeSSOServiceImpl#handleVobLogin` (JWT/JWKS 검증)
4. `LoginServiceImpl#loginHyobeeSSO`
5. `ApiServiceImpl#createSessionAndUpdate` (세션/권한 반영)
6. 성공 시 `MAIN_PAGE_URL`(`main.jsp`)로 redirect + `loginType=SSO` 쿠키
7. `/xs/aichat/**` 요청은 `HyobeeApiInterceptor` 분기 처리

## 권한 검증 체인

- `XtrmSecurityConifg` + `XtrmAuthenticationFilter`: JSP 진입 전 검증
- `XtrmHandlerInterceptor`: 세션 유효성, 기능 권한, 메뉴키 검증
- `HyobeeApiInterceptor`: Hyobee API 사용자/토큰 처리 (`HyobeeJwtTokenService`)
- `AuthPagePreload`: JSP prelude 게이트 (로그인·메인·에러·클라우드·채팅 attach URL 예외)

## Hyobee 네이밍 (TB-003)

API URL·매핑은 변경하지 않고, 클래스/메서드명만 Hyobee 컨벤션으로 정렬했다.

| Before | After |
|--------|-------|
| `AichatSSOController` / `AichatSSOServiceImpl` | `HyobeeSSOController` / `HyobeeSSOServiceImpl` |
| `AichatAuthController` | `HyobeeAuthController` |
| `AichatJwtTokenService` | `HyobeeJwtTokenService` |
| `loginAichatSSO` | `loginHyobeeSSO` |
| `XtrmAichatInterface` | `HyobeeChatApiClient` |
| `AichatLogService` | 제거 → `ChatLogService` (v2) |

## 레거시 정리 (TB-002)

다음 항목은 제거되었으며, 운영 SSO 경로는 `HyobeeSSO*` + `loginHyobeeSSO` + v2 채팅 API만 유지한다.

- `SSOAuthServiceImpl`, `LoginService#loginSSO`, `XtrmServletFilter`
- v1 `/xs/aichat/*` API 스택 (`AichatController` 등)
- `XtrmTokenInterceptor`, `/xs/vob/api/**`, `vob/aisearch` 정적 리소스

## 하네스 도입 단계 (최소 침습)

1. 인증 흐름 기준선 문서 고정(본 문서)
2. 변경 시 PR 템플릿에 "인증 흐름 영향도" 항목 추가/점검
3. TDD (현재 P0+P1):
   - `HyobeeSSOServiceImpl` 단위 테스트
   - `HyobeeSSOController`, `HyobeeAuthController` 계약 테스트
   - `HyobeeApiInterceptor`, `AuthPagePreload`, `HyobeePagePaths` 회귀 테스트
4. 레거시 JSP URL은 redirect stub로 관측 후 단계적 축소

## 세션 필수 키 (로그인 성공 후)

`ApiServiceImpl#createSessionAndUpdate` 기준 Hyobee/Aichat에서 참조하는 최소 키:

- `USER_ID`
- `AUTH_MENU_INFO`
- `LOGIN_DATETIME`
- `GBIS_CORP_CODE`, `PG_CODE`, `PU_CODE`, `DEPT_CODE`
- SSO 경로 추가: `LANGUAGE_CODE` (3-arg 오버로드)

## DoD 초안

- 로그인/SSO 경로가 문서와 코드에서 동일하게 추적 가능
- 인증 영향 PR은 P0+P1 회귀 테스트 명령 통과 (`package-scope.md` 참고)
- 레거시 후보 목록에 상태(`관측중`/`deprecated`/`제거`)가 기록됨
- 화면 canonical은 `login.jsp` / `main.jsp`, API URL은 기존 유지
