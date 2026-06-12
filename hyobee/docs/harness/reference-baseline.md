# 하네스 기본 기준

Hyobee 프로젝트(Spring Boot 2.7, Java 11, Maven WAR) 기준 하네스 운영 기준입니다.

**운영 현황·성숙도·QA 베이스라인:** [harness-status.md](./harness-status.md) (이 문서와 역할 분리 — baseline은 “규칙”, status는 “측정”)

## 핵심 기준

- `main` 직접 커밋 금지 + 기능별 브랜치(`feature/TB-{id}-{short-name}`) 사용
- 병합 전략은 `no-ff` 고정
- 역할 분리(Main/Contract/Backend/Frontend/QA) + 티켓 태그 기반 분배
- 변경 영향이 인증/세션 흐름에 닿으면 테스트 게이트를 반드시 강화

## 첫 턴 체크리스트

- [ ] `docs/harness/todo.md`에서 티켓/DoD 확인
- [ ] 작업 브랜치 준비(필요 시 생성)
- [ ] 태그 기반 Sub-agent 분배(`Contract`/`Backend`/`Frontend`/`QA`)
- [ ] Hook fallback 필요 여부 확인

## 이 프로젝트 인증 기준선

- 일반 로그인: `LoginController` -> `LoginServiceImpl` -> `ApiServiceImpl#createSessionAndUpdate`
- SSO 로그인: `HyobeeSSOController` -> `HyobeeSSOServiceImpl` -> `LoginServiceImpl#loginHyobeeSSO` -> `main.jsp` redirect
- 화면 canonical: `login.jsp`(로그인), `main.jsp`(채팅) — `HyobeePagePaths` + `XtrmConfig` (`auth-flow-analysis.md` 참고)
- 전역 검증 체인:
  - `XtrmAuthenticationFilter`(JSP 사전 검증)
  - `XtrmHandlerInterceptor`(세션/권한/메뉴키 검증)
  - `HyobeeApiInterceptor`(`/xs/aichat/**` 사용자 해석, `HyobeeJwtTokenService`)

## TDD 도입 시작점(권장)

- 1순위: `HyobeeSSOServiceImpl` 성공/실패/JWT 예외 케이스 단위 테스트
- 2순위: `LoginController`, `HyobeeSSOController` 요청/응답 계약 테스트
- 3순위: 인터셉터·JSP 게이트 회귀(`XtrmHandlerInterceptor`, `HyobeeApiInterceptor`, `AuthPagePreload`, `HyobeePagePaths`)

## PR 하드 게이트

- [ ] 티켓 목적/범위 명시
- [ ] 역할 경계 위반 없음
- [ ] `mvn test` 결과 첨부
- [ ] 인증/세션 영향 변경 시 관련 테스트 추가 또는 회귀 검증 기록
