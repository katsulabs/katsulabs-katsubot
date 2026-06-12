---
name: hyobee-backend-auth-test
description: Hyobee 인증 단위 테스트 작성(Mockito/MockMvc standalone, Spring context 없음). XtrmProperty 실객체 패턴, P0/P1 테스트 클래스, @Nested 구조. LoginServiceImplTest, HyobeeSSO*, 인터셉터, AuthPagePreload 테스트 추가·수정 시 사용.
---

# Hyobee Backend 인증 테스트

## 기본 원칙

- **전체 Spring context 없음** — Mockito + MockMvc standalone
- `src/test/java/xs/**` 기존 패턴 따르기
- 인증 변경 → 해당 P0/P1 클래스 갱신 + `hyobee-auth-regression` 실행

## XtrmProperty (mock 금지)

`XtrmProperty`에 `final` 메서드 있음 — `Properties`로 실객체 사용:

```java
private XtrmProperty buildProperty(String companyCode) {
    Properties props = new Properties();
    props.setProperty("COMPANY_CODE", companyCode);
    props.setProperty("SERVICE_MODE", "local");  // getServiceMode() 순환 방지
    props.setProperty("DUPLICATION_LOGIN_AVAILABLE", "true");
    var property = new XtrmProperty();
    property.setProperties(props);
    return property;
}
```

403/XTRM_ERROR_DATA 경로에서 `XtrmJSON.toString()`이 `gson` bean을 쓰므로, nested 테스트에서는 `XtrmApplicationContextProvider`에 `Gson` mock bean을 등록한다.

## 구조

- `@Nested` + `@DisplayName`으로 흐름 그룹 (`LoginServiceImplTest` 참고)
- 구현 세부가 아닌 **계약 동작** 기준으로 테스트명 작성
- 해당 시 세션 키 검증: `USER_ID`, `AUTH_MENU_INFO`

## P0 테스트 대상

| 클래스 | 검증 초점 |
|--------|-----------|
| `LoginServiceImplTest` | `loginBase`, `loginHyobeeSSO` |
| `HyobeeSSOServiceImplTest` | JWT/JWKS, voblogin |
| `HyobeeSSOControllerTest` | `main.jsp` redirect, 403 |
| `HyobeeApiInterceptorTest` | `/xs/aichat/**` JWT 게이트 |

## P1 테스트 대상

| 클래스 | 검증 초점 |
|--------|-----------|
| `ApiServiceImplTest` | `createSessionAndUpdate` 세션 키 |
| `XtrmHandlerInterceptorAuthTest` | 레거시 API 권한 분기 |
| `AuthPagePreloadTest` | JSP 게이트 login.jsp / main.jsp |
| `HyobeePagePathsTest` | config 기반 redirect 경로 |

## MockMvc standalone (컨트롤러)

`HyobeeSSOControllerTest` 패턴 — mock 주입, `@SpringBootTest` 없음.

## 테스트 추가 후

1. `mvn test "-Dtest=YourNewTest"` 후 전체 게이트 실행
2. P0/P1 건수 변경 시 `docs/harness/qa-registry.md` 갱신
3. 게이트에 클래스 추가 시 `package-scope.md` 테스트 표 동기화

## 참고

- `.cursor/rules/backend.mdc`
- `src/test/java/xs/webbase/login/service/LoginServiceImplTest.java`
