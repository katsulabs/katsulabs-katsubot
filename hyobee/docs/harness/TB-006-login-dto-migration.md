# TB-006 Phase 2 작업계획서 — 로그인·SSO 경로 DTO 전환

> 기준 브랜치: `feature/harness/main`  
> 전제: `XtrmJsonNode` 제거 완료 → `xs.core.dto.ApiEnvelope` / `ApiRequest` / `ResponseHeader` 도입됨  
> 상위 계획: [TB-006-xtrmjsonnode-record-migration.md](./TB-006-xtrmjsonnode-record-migration.md) Phase 2  
> 인증 기준선: [auth-flow-analysis.md](./auth-flow-analysis.md)

## 1. 목표

로그인·SSO·세션 생성 경로에서 **문자열 키 기반 `ApiEnvelope` 조작**을 제거하고, **typed record DTO**로 내부 계약을 고정한다.

| 구분 | Before (현재) | After (목표) |
|------|---------------|--------------|
| 서비스 내부 | `getString("userId")`, `setString(...)` | `LoginCredentials`, `SsoLoginCommand` 등 record |
| 세션 생성 | `createSessionAndUpdate(ComUser, req, ApiEnvelope)` | `createSessionAndUpdate(ComUser, req, SessionCreationCommand)` |
| SSO 실패 | `ApiEnvelope` → `toString()` → `XTRM_ERROR_DATA` | `LoginErrorPayload` record → wire JSON |
| 컨트롤러 응답 | `ApiEnvelope` 직접 반환 | 내부 typed DTO → **컨트롤러 경계에서만** `{HEADER, DATA[]}` 조립 |

### 변경하지 않는 것

- API URL (`/xs/webbase/login/*.json`, `/xs/vob/aichat/voblogin`)
- 프론트가 기대하는 JSON wire format (`HEADER.ERROR_FLAG`, `DATA[0].recentLoginDt` 등)
- 세션 키 계약 (`USER_ID`, `AUTH_MENU_INFO`, `LOGIN_DATETIME`, `GBIS_CORP_CODE` 등 — `auth-flow-analysis.md` §세션 필수 키)
- P0+P1 인증 회귀 테스트 59건 PASS

## 2. 현황 스냅샷

### 2.1 영향 파일 (로그인 핵심)

```
xs/webbase/login/
  controller/LoginController.java      ← 13개 엔드포인트, 전부 ApiEnvelope 반환
  service/LoginService.java
  service/LoginServiceImpl.java        ← loginBase, loginHyobeeSSO, logout 등

xs/core/api/service/
  ApiServiceImpl.java                  ← createSessionAndUpdate (2/3-arg)

xs/aichat/
  service/HyobeeSSOServiceImpl.java    ← JWT 검증 → loginHyobeeSSO 호출
  dto/VobLoginResult.java              ← fail(ApiEnvelope) 잔존
  controller/HyobeeSSOController.java
```

### 2.2 호출 흐름 (전환 대상)

#### 일반 로그인

```
login.jsp
  → POST /xs/webbase/login/loginBase.json
  → LoginController#loginBase
  → LoginServiceImpl#loginBase
      → validationLoginBase (OTP 복호화)
      → CmmnService#selectUserForLogin
      → ApiServiceImpl#createSessionAndUpdate
  → {HEADER, DATA[]} (recentLoginDt, currLoginDate)
```

#### SSO

```
IdP
  → /xs/vob/aichat/voblogin?token=...
  → HyobeeSSOController
  → HyobeeSSOServiceImpl#handleVobLogin (JWT/JWKS 검증)
  → LoginServiceImpl#loginHyobeeSSO
  → ApiServiceImpl#createSessionAndUpdate
  → 302 main.jsp + loginType=SSO
```

### 2.3 `loginBase`에서 쓰이는 동적 키 (DTO화 대상)

| 단계 | 키 | 용도 |
|------|-----|------|
| 입력(암호화) | `companyCodeEncrypt`, `userIdEncrypt`, `passwordEncrypt` | OTP 세션키로 AES 복호화 |
| 입력(복호화 후) | `companyCode`, `userId`, `password`, `languageCode` | DB 조회·세션 |
| 출력 | `recentLoginDt`, `currLoginDate` | 로그인 성공 응답 DATA |
| 오류 | `ERROR_FLAG`, `ERROR_CODE`, `ERROR_MSG` | HEADER |

### 2.4 `loginHyobeeSSO`에서 쓰이는 동적 키

| 키 | 용도 |
|----|------|
| `samaccountname` | IdP JWT claim → userId |
| `companyCode` | config `COMPANY_CODE` 주입 |
| `languageCode` | `Accept-Language` |
| `ERROR_MSG_SUB` | SSO 403 시 `XTRM_ERROR_DATA` |
| (출력) `recentLoginDt`, `currLoginDate` | 성공 응답 |

## 3. DTO 설계 (신규 `xs.webbase.login.dto` + `xs.core.dto`)

### 3.1 Request / Command record

```java
// 암호화 상태 (컨트롤러/resolver 경계)
public record EncryptedLoginRequest(
    String companyCodeEncrypt,
    String userIdEncrypt,
    String passwordEncrypt,
    String languageCode
) {}

// 복호화 후 (서비스 내부)
public record LoginCredentials(
    String companyCode,
    String userId,
    String password,
    String languageCode
) {}

// SSO
public record SsoLoginCommand(
    String samAccountName,
    String companyCode,
    String languageCode
) {}

// createSessionAndUpdate 3-arg 대체
public record SessionCreationCommand(
    String languageCode,
    boolean masterLogin
) {}

// 비밀번호 변경 (Slice 4)
public record PasswordChangeRequest(...) {}
```

### 3.2 Response record

```java
public record LoginSuccessResponse(
    String recentLoginDt,
    String currLoginDate
) {}

public record LoginErrorPayload(
    String errorCode,
    String errorMessage,
    String errorMessageSub   // SSO 403용
) {}
```

### 3.3 경계 어댑터 (임시, 테스트 포함)

```java
// xs.core.dto.EnvelopeMapper (또는 LoginEnvelopeMapper)
public final class EnvelopeMapper {
    static EncryptedLoginRequest from(ApiRequest req);
    static ApiEnvelope success(LoginSuccessResponse body);
    static ApiEnvelope error(LoginErrorPayload err);
    static String toXtrmErrorData(LoginErrorPayload err);  // URLEncode 전 JSON
}
```

**원칙**: 서비스 시그니처는 record만 받고 반환한다. `ApiEnvelope` 조립은 **컨트롤러** 또는 **Mapper** 한 곳에만 둔다.

## 4. 작업 단계 (PR 단위 분할)

브랜치 규칙: `feature/TB-006-login-dto-{slice}`

### Slice 0 — Contract (선행, 코드 변경 최소) ✅

| 항목 | 내용 |
|------|------|
| 산출물 | [TB-006-phase0-inventory.md](./TB-006-phase0-inventory.md), 본 계획서, golden JSON 3건 정의 |
| 검증 | `LoginDtoWireFormatTest` (Slice 1에서 구현) |

**완료**: 2026-06-11

### Slice 1 — DTO + Mapper 골격 (`TB-006-login-dto-1`) ✅

| 작업 | 파일 |
|------|------|
| record 추가 | `xs/webbase/login/dto/*.java` (6종) |
| Mapper 추가 | `xs/core/dto/EnvelopeMapper.java` |
| 테스트 | `EnvelopeMapperTest`, `LoginDtoWireFormatTest` |

**완료 조건**: Mapper 단위 테스트 PASS, 기존 로그인 동작 변경 없음

**완료**: 2026-06-11 — Slice 2(`loginBase` 서비스 전환) 착수 대기

### Slice 2 — `loginBase` + `createSessionAndUpdate` (`TB-006-login-dto-2`) ★ P0

| 작업 | 상세 |
|------|------|
| `LoginServiceImpl#loginBase` | `EncryptedLoginRequest` → `LoginCredentials` → `LoginSuccessResponse` |
| `validationLoginBase` | record 기반 검증, `ApiEnvelope` 제거 |
| `ApiServiceImpl#createSessionAndUpdate` | 3-arg: `SessionCreationCommand` 수신; 2-arg 유지(deprecated 위임) |
| `LoginController#loginBase` | `EnvelopeMapper`로 응답 조립 |
| 테스트 갱신 | `LoginServiceImplTest` 15건, `ApiServiceImplTest` 4건 |

**완료 조건**

- [ ] `loginBase.json` 응답 byte-equal (golden JSON)
- [ ] 세션 키 7종+ 동일 (`ApiServiceImplTest`)
- [ ] P0 `LoginServiceImplTest` 전체 PASS

**예상**: 2일

### Slice 3 — SSO 경로 (`TB-006-login-dto-3`) ★ P0

| 작업 | 상세 |
|------|------|
| `LoginServiceImpl#loginHyobeeSSO` | `SsoLoginCommand` / `LoginSuccessResponse` |
| `validationLoginUserHyobeeSSO` | `LoginErrorPayload` + `toXtrmErrorData()` |
| `HyobeeSSOServiceImpl#convertAttrToJson` | `SsoLoginCommand` 직접 생성 (`ApiEnvelope` 제거) |
| `VobLoginResult` | `fail(ApiEnvelope)` 삭제 → `fail(LoginErrorPayload)` |
| 테스트 | `HyobeeSSOServiceImplTest` 7건, `HyobeeSSOControllerTest` 6건 |

**완료 조건**

- [ ] SSO 성공 → `main.jsp` 302 + `loginType=SSO` 쿠키
- [ ] SSO 403 → `XTRM_ERROR_DATA` wire format 호환
- [ ] P0 SSO 테스트 전체 PASS

**예상**: 2일

### Slice 4 — `logout` + `changeUserPassword` (`TB-006-login-dto-4`)

| 작업 | 상세 |
|------|------|
| `logout` | `LogoutCommand` (session에서 companyCode/userId 추출) |
| `changeUserPassword` | `PasswordChangeRequest` (암호화 필드 복호화) |
| `CmmnService#updateUser` | 당분간 `ApiEnvelope` 유지 — Slice 4b에서 record 전환 |

**완료 조건**: `LoginServiceImplTest` logout/비밀번호 케이스 PASS

**예상**: 1.5일

### Slice 5 — 부가 로그인 API (`TB-006-login-dto-5`, P2)

대상: `loginOTP`, `createOTPKey`, `changePasswordOTP`, `loginSMSMail`, `sendCertificationNumber`, `loginCertification`, `selectDataCompanyInfo`, `changeLocale`, `getEaiCorpHoldings`

- Hyobee aichat 핵심 경로가 아니므로 Slice 2–4 완료 후 진행
- 각 엔드포인트별 request/response record 1쌍씩

**예상**: 3일 (엔드포인트당 0.3일)

## 5. QA 게이트 (매 Slice 머지 전)

```bash
# P0+P1 인증 회귀 (package-scope.md)
mvn test "-Dtest=HyobeePagePathsTest,AuthPagePreloadTest,HyobeeSSOControllerTest,HyobeeSSOServiceImplTest,LoginServiceImplTest,HyobeeApiInterceptorTest,ApiServiceImplTest,XtrmHandlerInterceptorAuthTest"

# Slice별 추가
mvn test -Dtest=EnvelopeMapperTest,LoginDtoWireFormatTest   # Slice 1+
mvn test -Dtest=LoginControllerTest                          # Slice 2+ (P2)
```

| Slice | 필수 테스트 | 건수 |
|-------|------------|------|
| 2 | `LoginServiceImplTest`, `ApiServiceImplTest` | 19 |
| 3 | + `HyobeeSSOServiceImplTest`, `HyobeeSSOControllerTest` | +13 |
| 4–5 | 전체 P0+P1 | 59 |

## 6. 리스크 및 완화

| 리스크 | 영향 | 완화 |
|--------|------|------|
| 프론트 wire format 불일치 | login.jsp 오류 | golden JSON 스냅샷 + `EnvelopeMapper` 단일 조립 |
| `CmmnService`가 여전히 `ApiEnvelope` | Slice 2 범위 확대 | 로그인 경로만 record, DAO 호출은 `EnvelopeMapper.toParams()` 임시 bridge |
| OTP 암호화 키 세션 타이밍 | `LOGIN_ENF` 오류 | `validationLoginBase` 테스트 그대로 유지 |
| SSO `XTRM_ERROR_DATA` 인코딩 | 403 화면 깨짐 | 기존 `URLEncoder.encode(envelope.toString())` 경로 golden 비교 |
| `createSessionAndUpdate` 2개 오버로드 | SSO/일반 분기 누락 | `SessionCreationCommand` 기본값 + 양 오버로드 통합 검토 |

## 7. 완료 정의 (Phase 2 DoD)

- [ ] `LoginServiceImpl`, `LoginController` public 메서드에 `ApiEnvelope` 파라미터/반환 **0건** (Mapper 경계 제외)
- [ ] `ApiServiceImpl#createSessionAndUpdate` — `SessionCreationCommand` 전환
- [ ] `HyobeeSSOServiceImpl` — `ApiEnvelope` 생성 0건
- [ ] `VobLoginResult.fail(ApiEnvelope)` 제거
- [ ] P0+P1 59건 PASS
- [ ] `auth-flow-analysis.md`, `package-scope.md` 갱신

## 8. 권장 진행 순서

```
Slice 0 Contract
  → Slice 1 DTO+Mapper 골격
    → Slice 2 loginBase + 세션 (P0 핵심)
      → Slice 3 SSO (P0 핵심)
        → Slice 4 logout/비밀번호
          → Slice 5 OTP·부가 API
            → Phase 3 (xs/core/api 공통 API)
```

**총 예상**: Slice 0–4 약 **7일**, Slice 5 포함 시 **10일** (1인 기준)

## 9. 다음 액션

1. `feature/TB-006-login-dto-1` worktree 생성
2. Slice 1 — `EncryptedLoginRequest`, `LoginSuccessResponse`, `EnvelopeMapper` + 테스트 구현
3. Slice 2 착수 전 golden JSON 3건 캡처 (`loginBase` 성공/OTP실패, SSO 403)
