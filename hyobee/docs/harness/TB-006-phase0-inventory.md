# TB-006 Phase 0 산출물 — 계약 고정 및 사용처 재분류

> 기준 브랜치: `feature/harness/main`  
> 작성일: 2026-06-11  
> 상위: [TB-006-xtrmjsonnode-record-migration.md](./TB-006-xtrmjsonnode-record-migration.md) §Phase 0  
> 후속: [TB-006-login-dto-migration.md](./TB-006-login-dto-migration.md)

## 1. 완료 상태

| Phase 0 DoD | 상태 | 비고 |
|-------------|------|------|
| 전환 대상 API/서비스/DAO 목록 | ✅ | §3 |
| 삭제 가능한 미사용 mapper interface 목록 | ✅ | §5 |
| 유지해야 하는 wire format 목록 | ✅ | §4 |
| 삭제 가능한 주석/죽은 코드 목록 | ✅ | §6 |
| `XtrmJsonNode` → `ApiEnvelope` 패키지별 재집계 | ✅ | §2 |

**선행 완료 (Phase 0 이전):** `XtrmJsonNode`/`XtrmJsonNodes`/`XtrmJsonNodeWeb` 삭제 → `xs.core.dto.ApiEnvelope` / `ApiRequest` / `ApiEnvelopes` / `ResponseHeader` 도입.

## 2. `ApiEnvelope` 사용처 재집계

`src/main/java` 기준 **37개 Java 파일** (aichat v2 `*ApiRequest` DTO명 제외 시 **36개**).

| 패키지 | 파일 수 | 대표 클래스 | `ApiEnvelopes` 호출 | Phase 우선순위 |
|--------|---------|-------------|---------------------|----------------|
| `xs/vob/management/**` | 3 | `ManagementServiceImpl` | **184** | P5 (대량) |
| `xs/core/api/**` | 3 | `ApiServiceImpl`, `ApiController` | **32** | P3 |
| `xs/vob/cmmn/**` | 2 | `CmmnServiceImpl` | 10 | P2 (로그인 의존) |
| `xs/domain/certification/**` | 2 | `CertificationServiceImpl` | 10 | P4 |
| `xs/webbase/login/**` | 3 | `LoginServiceImpl` | 3 | **P0** |
| `xs/webbase/view/**` | 2 | `FileDownloadView`, `FileStreamView` | 6 | P3 |
| `xs/core/utility/**` | 4 | `XtrmExcelUtil`, `XtrmNIOFileUtil` | 0 | P3 |
| `xs/core/dto/**` | 4 | `ApiEnvelope`, `ApiEnvelopes` | — | 인프라 |
| `xs/core/database/**` | 2 | `XtrmDAO`, `XtrmDAOWeb` | — | Phase 4 bridge |
| `xs/core/config/**` | 2 | `XtrmHandlerInterceptor`, `XtrmArgumentResolver` | 0 | P1 |
| `xs/aichat/service/**` | 1 | `HyobeeSSOServiceImpl` | 0 | **P0** |
| `xs/domain/cmmn/**` | 3 | `CmmnServiceImpl` | 1 | P2 |
| 기타 (`interfaces`, `module`, `view`, `handler`) | 9 | REST/엑셀/Callisto | 소수 | P4–P5 |

**Hyobee aichat v2** (`xs/aichat/v2/**`)는 typed DTO + Jackson 이미 적용. `ApiEnvelope` 미사용.

## 3. 전환 대상 API·서비스 목록

### 3.1 P0 — 인증/세션 (Phase 2, [login-dto-migration](./TB-006-login-dto-migration.md))

| 경로 | 메서드/엔드포인트 | 현재 타입 | 목표 DTO |
|------|-------------------|-----------|----------|
| `LoginController` | `loginBase.json` | `ApiEnvelope` | `EncryptedLoginRequest` → `LoginSuccessResponse` |
| `LoginServiceImpl` | `loginHyobeeSSO` | `ApiEnvelope` | `SsoLoginCommand` → `LoginSuccessResponse` |
| `ApiServiceImpl` | `createSessionAndUpdate` (3-arg) | `ApiEnvelope` params | `SessionCreationCommand` |
| `HyobeeSSOServiceImpl` | `handleVobLogin` | `ApiEnvelope` 생성 | `SsoLoginCommand` |
| `VobLoginResult` | `fail(ApiEnvelope)` | `ApiEnvelope` | `LoginErrorPayload` |

### 3.2 P1 — 로그인 부가 API (`LoginController`)

| 엔드포인트 | Slice |
|------------|-------|
| `logout.json` | Slice 4 |
| `changeUserPassword.json` | Slice 4 |
| `createOTPEncryptKey.json` | Slice 5 |
| `selectDataCompanyInfo.json` | Slice 5 |
| `loginOTP.json`, `createOTPKey.json`, `changePasswordOTP.json` | Slice 5 (aichat 스텁) |
| `loginSMSMail.json`, `sendCertificationNumber.json`, `loginCertification.json` | Slice 5 (스텁) |
| `changeLocale.json`, `getEaiCorpHoldings.json` | Slice 5 |

### 3.3 P3 — 공통 API (`ApiController` / `ApiServiceImpl`)

`POST /xs/core/api/*.json` 약 **40개** 엔드포인트 — 전부 `ApiEnvelope` 반환. Phase 3에서 record 전환.

대표: `initClientPageLoad.json`, `getCmmnCodeDataByGroupCodeList.json`, `sessionSwitch.json`, 파일 업로드/다운로드, CLOB, 북마크 등.

### 3.4 P5 — VOB 관리 (`ManagementServiceImpl`)

`ApiEnvelopes` **184회** — Phase 5 이후 단계적 전환.

## 4. wire format 유지 목록

### 4.1 공통 envelope

```json
{
  "HEADER": {
    "ERROR_FLAG": false,
    "ERROR_CODE": "",
    "ERROR_MSG": "",
    "COUNT": 0,
    "TOT_COUNT": 0,
    "PAGE_NO": 0,
    "ROW_PER_PAGE": 0
  },
  "DATA": [ { } ]
}
```

- 빈 성공 응답: `DATA` 길이 1, 첫 row `{}` (`ApiEnvelopeTest` / `ApiEnvelope` 기본 생성자)
- 오류: `HEADER.ERROR_FLAG=true`, `ERROR_CODE`, `ERROR_MSG` 필수

### 4.2 로그인 API — 프론트 호환 필드

| API | HEADER | DATA[0] |
|-----|--------|---------|
| `loginBase.json` 성공 | `ERROR_FLAG=false` | `recentLoginDt`, `currLoginDate` |
| `loginBase.json` OTP 없음 | `ERROR_FLAG=true`, `ERROR_CODE=ENF` | — |
| `loginBase.json` 빈 파라미터 | `ERROR_CODE=EMPTY` | — |
| `createOTPEncryptKey.json` | `ERROR_FLAG=false` | `ENCRYPT_KEY` (32자) |
| `loginHyobeeSSO` 성공 | `ERROR_FLAG=false` | `recentLoginDt`, `currLoginDate` |
| SSO 403 | `ERROR_FLAG=true`, `ERROR_CODE` | `ERROR_MSG_SUB` + `XTRM_ERROR_DATA` 헤더(URL encode) |

### 4.3 Golden JSON 스냅샷 (Slice 0 Contract)

Slice 2·3 구현 전 `LoginDtoWireFormatTest`에서 검증할 3건:

1. **loginBase 성공** — `ERROR_FLAG=false`, DATA에 `recentLoginDt`/`currLoginDate`
2. **loginBase ENF** — `ERROR_CODE=ENF`, `ERROR_FLAG=true`
3. **SSO 403** — `ERROR_CODE=PASSWORD_CHANGE_ERROR02`, DATA `ERROR_MSG_SUB`

## 5. MyBatis mapper 분류

### 5.1 Java mapper interface (9개)

| 파일 | 용도 | `ApiEnvelope` 연동 |
|------|------|-------------------|
| `xs/aichat/v2/mapper/UserMapper` | v2 사용자 | ❌ record/DTO |
| `xs/aichat/v2/mapper/CommonMapper` | v2 공통 | ❌ |
| `xs/aichat/v2/mapper/ChatLogMapper` | 채팅 로그 | ❌ |
| `xs/aichat/v2/mapper/ChatLogPartitionMapper` | 파티션 | ❌ |
| `xs/aichat/v2/external/Wrtn*Mapper` | WRTN API | ❌ |
| `xs/aichat/v2/dto/.../UpstreamErrorMapper` | 오류 매핑 | ❌ |

**결론:** 레거시 `ApiEnvelopes.selectJson`은 **XML namespace 문자열**로만 연결 (`xs.core.api.ApiMapper`, `xs.webbase.login.LoginMapper` 등). 별도 Java mapper interface **미사용·삭제 대상 없음**.

### 5.2 XML namespace (DAO bridge, `ApiEnvelopes` 호출 기준)

| namespace | 호출 수(대략) | Phase |
|-----------|---------------|-------|
| `xs.core.api.ApiMapper` | 32+ | 3 |
| `xs.vob.management.*` (다수) | 177+ | 5 |
| `xs.webbase.login.LoginMapper` | 3 | 2 (company 조회만) |
| `xs.vob.cmmn.*` | 10+ | 2 |
| `xs.domain.certification.*` | 10 | 4 |

Phase 4에서 `selectJson` → `selectMap(..., RowRecord.class)` 전환 시 namespace별 record 정의 필요.

## 6. 로그인 경로 동적 키 분류

| 분류 | 키 | 전환 record |
|------|-----|-------------|
| 입력(암호화) | `companyCodeEncrypt`, `userIdEncrypt`, `passwordEncrypt` | `EncryptedLoginRequest` |
| 입력(평문) | `companyCode`, `userId`, `password`, `languageCode` | `LoginCredentials` |
| SSO 입력 | `samaccountname` | `SsoLoginCommand.samAccountName` |
| 세션 보강 | `languageCode`, `isMaster` | `SessionCreationCommand` |
| 성공 출력 | `recentLoginDt`, `currLoginDate` | `LoginSuccessResponse` |
| 오류 출력 | `ERROR_MSG_SUB` | `LoginErrorPayload` |
| OTP 키 | `ENCRYPT_KEY` | `OtpEncryptKeyResponse` (Slice 5) |
| 로그아웃 | `loginAt`, `recentLogoutDt` | `LogoutCommand` (Slice 4) |

## 7. 주석·죽은 코드 (`XtrmJSON` 문자열 잔존)

| 파일 | 건수 | 조치 |
|------|------|------|
| `xs/vob/cmmn/service/CmmnServiceImpl.java` | 7 (주석) | Phase 2b 또는 정리 PR |
| `xs/core/utility/XtrmExcelUtil.java` | 2 (메서드명 `cnvtExcelToXtrmJSON`) | Phase 3 rename |
| `xs/aichat/v2/service/ChatServiceImpl.java` | 1 (주석) | 삭제 가능 |

런타임 영향 없음. Phase 6 정리 게이트에서 일괄 제거.

## 8. record 전환 우선순위 (확정)

```
P0  loginBase + loginHyobeeSSO + createSessionAndUpdate + HyobeeSSO  (Slice 1–3)
P1  XtrmHandlerInterceptor / ArgumentResolver (요청 파싱 record화)
P2  CmmnService (selectUserForLogin 주변)
P3  xs/core/api/** (공통 API)
P4  certification, domain/cmmn
P5  ManagementServiceImpl (184 bridge)
P6  호환층 ApiEnvelope 삭제 (typed envelope only)
```

## 9. 다음 작업

- [x] Phase 0 산출물 (본 문서)
- [x] Slice 1: `xs/webbase/login/dto/*`, `EnvelopeMapper`, `EnvelopeMapperTest`, `LoginDtoWireFormatTest`
- [ ] Slice 2: `loginBase` + `createSessionAndUpdate`
- [ ] Slice 3: SSO 경로
