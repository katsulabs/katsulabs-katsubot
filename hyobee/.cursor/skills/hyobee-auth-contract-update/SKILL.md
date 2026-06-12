---
name: hyobee-auth-contract-update
description: Hyobee 인증/세션 계약 문서(auth-flow-analysis.md, package-scope.md) 갱신 및 Backend/Frontend/QA handoff 메모 작성. 로그인, SSO, JWT, 인터셉터, 세션 키, JSP redirect 계약 변경 시 사용.
---

# Hyobee 인증 계약 갱신

## 계약 우선 워크플로

1. 계약 고정 **전에** 구현 로직 변경 금지
2. 문서 갱신 순서:
   - `docs/harness/auth-flow-analysis.md` — 실행 흐름, 네이밍, 경로
   - `docs/harness/package-scope.md` — 에이전트 스코프, 테스트 클래스, JSP canonical
3. API/DTO 경계 변경 → Contract 스코프 경로에 기록 (`.cursor/rules/contract.mdc`)

## 동기화 필수 섹션

| 주제 | auth-flow-analysis | package-scope |
|------|-------------------|---------------|
| 로그인 흐름 | §1 일반 로그인 | 인증 핵심 경로 표 |
| SSO 흐름 | §SSO 실행 흐름 | HyobeeSSO* 경로 |
| JSP canonical | §화면 JSP | login.jsp / main.jsp 표 |
| 인터셉터 | §권한 검증 체인 | HyobeeApiInterceptor, XtrmHandlerInterceptor |
| 세션 키 | createSessionAndUpdate 언급 | ApiServiceImpl 행 |
| 레거시 | §레거시 정리 | TB-002 제거 항목 |

## 세션 계약 (일관성 유지)

- `USER_ID`, `AUTH_MENU_INFO` — 로그인 후 누락 없음
- SSO 성공: `MAIN_PAGE_URL` redirect + `loginType=SSO` 쿠키
- API URL 변경 없음; 클래스/메서드만 Hyobee 네이밍 (TB-003)

## Handoff 메모 템플릿

```markdown
## [TB-xxx] Contract handoff

### 변경
- {흐름/경로/DTO 경계}

### 유지 (호환)
- {API URL, 하위 호환}

### Backend
- 파일: {xs/** 경로}
- 갱신 테스트: {P0/P1 클래스}

### Frontend
- JSP/JS: {경로}
- UX: redirect / 403 / XTRM_ERROR_DATA

### QA
- P0+P1 게이트 필수: yes/no
- 수동 시나리오: {FE면 TB-004 §QA}
```

## 검증

- 문서 흐름 일치: SSO → `loginHyobeeSSO` → `main.jsp`
- Backend/Frontend/QA 메모에 package-scope 경로 포함

## 참고

- `.cursor/rules/contract.mdc`
- `docs/harness/auth-flow-analysis.md`
