---
name: hyobee-legacy-cleanup
description: Hyobee dead code·레거시 스택 안전 제거(auth 회귀 게이트, package-scope 갱신). TB-002형 정리, deprecated controller/인터셉터 삭제, v1 API 제거 시 사용.
---

# Hyobee 레거시 정리

## 패턴 (TB-002 참고)

제거된 항목 예:

- `SSOAuthServiceImpl`, `LoginService#loginSSO`, `XtrmServletFilter`
- v1 Aichat API (`AichatController`, `AichatServiceImpl`, vendor 패키지)
- `XtrmTokenInterceptor`, `/xs/vob/api/**`, prototype/admin JSP

**유지:** v2 `/xs/aichat/**`, SSO `/xs/vob/aichat/**`, `HyobeeSSO*`, `loginHyobeeSSO`

## 안전한 정리 워크플로

1. **Contract** — 제거 목록 + 운영 의존 없음 확인 (`auth-flow-analysis.md` §레거시)
2. **Grep** — 삭제 전 참조 검색:
   ```powershell
   rg "ClassNameOrPath" --glob "!target/**"
   ```
3. **Backend** — Java + 테스트 삭제; 스코프 내 compile 오류만 수정
4. **Frontend** — redirect-only 정책 허용 시 static/JSP stub 제거
5. **QA** — P0+P1 전체 게이트 (`hyobee-auth-regression`)
6. **Docs** — `package-scope.md` TB-002/레거시, `todo.md` 갱신

## Redirect stub 정책 (TB-003)

트래픽 zero 전까지 redirect-only JSP 유지:

- `login010.jsp`, `aichat010.jsp`, `v2/aichat010.jsp`
- 북마크/IdP config 참조 시 Contract sign-off 없이 **삭제 금지**

## PR 요구사항

- 티켓에 삭제 경로 전부 문서화
- 명시 없이 auth flow 동작 변경 금지
- 하네스 Hard Gates (`hyobee-pr-harness-gate`)

## 참고

- `docs/harness/package-scope.md` §레거시 정리
- `docs/harness/auth-flow-analysis.md` §레거시 정리 (TB-002)
