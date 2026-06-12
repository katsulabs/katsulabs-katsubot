---
name: hyobee-jsp-canonical
description: Hyobee canonical JSP 경로(login.jsp, main.jsp) 및 HyobeePagePaths config 기반 redirect stub 유지. TB-003형 JSP rename, login/main redirect 변경, 레거시 JSP stub 갱신 시 사용.
---

# Hyobee JSP Canonical 경로

## Canonical 매핑 (TB-003)

| 용도 | Config 키 | 경로 |
|------|------------|------|
| 로그인 | `LOGIN_PAGE_URL` | `webapps/xs/webbase/login/login.jsp` |
| 채팅 메인 | `MAIN_PAGE_URL`, `AI_CHAT_URL` | `webapps/xs/aichat/main.jsp` |

## Redirect 단일 진입점

config 기반 redirect는 `xs.aichat.config.HyobeePagePaths` 경유:

- `HomeController`
- `HyobeeSSOController` (SSO 성공 → `main.jsp`)

신규 코드에 `.jsp` 경로 하드코딩 금지 — config 키 사용.

## 레거시 stub (redirect only)

| Stub | 정책 |
|------|------|
| `login010.jsp` | canonical login으로 redirect |
| `aichat010.jsp`, `v2/aichat010.jsp` | `main.jsp`로 redirect |
| stub 내 비즈니스 로직 | **금지** |

## JSP 게이트

`AuthPagePreload`가 canonical login/main을 예외 페이지로 처리 — 변경 시 `AuthPagePreloadTest` (P1) 통과 필수.

## 변경 워크플로

1. **Contract** — `auth-flow-analysis.md` §화면 JSP 갱신
2. **Backend** — `HyobeePagePaths`, controller, `HyobeePagePathsTest`
3. **Frontend** — JSP 내용, 필요 시 `main.jsp` script 태그
4. **QA** — P0+P1 + SSO redirect (`HyobeeSSOControllerTest`, `AuthPagePreloadTest`)

## SSO UX 계약

- 성공: 302 → `MAIN_PAGE_URL` + `loginType=SSO` 쿠키
- 실패: 403 + 일관된 오류 payload (`XTRM_ERROR_DATA` 해당 시)
- 사용자 노출 URL에 내부 `.jsp` 경로 노출 금지

## 참고

- `docs/harness/package-scope.md` §화면 JSP
- `docs/harness/auth-flow-analysis.md` §화면 JSP
- `.cursor/rules/frontend.mdc`
