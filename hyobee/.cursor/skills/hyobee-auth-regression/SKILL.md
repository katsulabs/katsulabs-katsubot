---
name: hyobee-auth-regression
description: Hyobee P0+P1 인증 회귀 테스트(59 @Test) 실행, 실패 분석, qa-registry.md 기록. 인증/SSO/세션/인터셉터/JSP 변경 QA 게이트, mvn test, PR 테스트 증적이 필요할 때 사용.
---

# Hyobee 인증 회귀 게이트

## 실행 시점

- `docs/harness/workflow.md` §인증 흐름 변경 경로를 수정한 경우
- 인증 관련 작업의 QA 승인 또는 PR 머지 전
- 인증 테스트 실패 수정 후

## 기본 명령 (권장)

쉼표로 나열한 `-Dtest`는 `@Nested` 테스트(예: `LoginServiceImplTest`)를 **누락**할 수 있다. 모듈 전체 실행을 권장:

```powershell
cd hyobee
mvn test -DfailIfNoTests=false
```

P0+P1 클래스(8개, 59 `@Test`) 결과만 필터:

| 우선순위 | 클래스 | 건수 |
|----------|--------|------|
| P0 | `HyobeeSSOServiceImplTest` | 7 |
| P0 | `HyobeeSSOControllerTest` | 6 |
| P0 | `LoginServiceImplTest` | 15 |
| P0 | `HyobeeApiInterceptorTest` | 6 |
| P1 | `ApiServiceImplTest` | 4 |
| P1 | `XtrmHandlerInterceptorAuthTest` | 9 |
| P1 | `AuthPagePreloadTest` | 9 |
| P1 | `HyobeePagePathsTest` | 3 |

## 단일 클래스 디버그

```powershell
mvn test "-Dtest=LoginServiceImplTest"
mvn test "-Dtest=AuthPagePreloadTest"
```

## 통과 기준

- P0+P1 `@Test` 59건 전부 **PASS** (ERROR/FAIL 없음)
- P2 클래스는 티켓 범위에 포함될 때만 필수

## 실패 시

1. Surefire 출력에서 클래스 + 메서드 + DisplayName 기록
2. Backend 범위에서 수정 (`src/main/java/xs/**` 또는 `src/test/java/xs/**`)
3. `mvn test -DfailIfNoTests=false` 전체 재실행
4. `docs/harness/qa-registry.md` §2 갱신 (클래스 행 + ERROR 상세)

## PR 증적 템플릿

```markdown
### 인증 회귀 (P0+P1)
- 명령: `mvn test -DfailIfNoTests=false`
- 날짜: YYYY-MM-DD
- P0+P1: 59/59 PASS (또는 실패 목록)
- qa-registry.md 갱신: yes/no
```

## 참고

- `docs/harness/package-scope.md` § 인증 회귀 테스트
- `.cursor/rules/qa.mdc`
- `docs/harness/qa-registry.md`
