# TB-006 — XtrmJsonNode 잔재 제거 및 record 전환 계획

> 대상 기준 브랜치: `feature/harness/main`  
> 전제: TB-005e에서 `(구) XtrmJSON` 삭제, `XtrmJsonNode` 단일 타입 전환, `gson` pom 제거가 완료됨  
> 제약: 이 문서는 계획 산출물이며, 실제 코드 변경은 승인 후 진행한다.

## 1. 목표

TB-005e는 Gson 기반 `(구) XtrmJSON`을 제거하고 Jackson 기반 `XtrmJsonNode`로 통합하는 데 성공했다. 그러나 `XtrmJsonNode`도 여전히 다음 성격을 가진다.

- `{HEADER, DATA[]}` wire format을 직접 들고 있는 mutable 컨테이너
- `getString("userId")`, `setObject("fileKeyList", ...)` 같은 문자열 키 기반 접근자
- DAO 입력/출력, 컨트롤러 응답, 서비스 내부 임시 상태를 동시에 담당하는 만능 객체
- `ObjectNode`/`ArrayNode` deep copy와 런타임 타입 변환에 의존하는 중간 계층

TB-006의 목표는 이 중간 계층을 최종 구조로 고정하지 않고, API/서비스/DAO 경계를 명시적인 Java `record` 계약으로 전환하는 것이다.

## 2. 현재 상태 요약

### 2.1 완료된 것

- `src/main/java/xs/core/parameter/XtrmJSON.java` 삭제
- `src/main/java/xs/core/parameter/XtrmJSONWeb.java` 삭제
- `XtrmJSON` 호출부 대부분이 `XtrmJsonNode`/`XtrmJsonNodes`로 이동
- `XtrmDAO`의 `selectJson` 결과가 Jackson `ObjectNode`/`ArrayNode` 기반으로 전환
- `JwtClaims`, `VobLoginResult` record pilot 도입

### 2.2 아직 남은 것

`feature/harness/main` 기준으로 남은 주요 결합 지점은 다음과 같다.

| 구분 | 현재 상태 | 의미 |
|---|---|---|
| `XtrmJsonNode` 타입 | 테스트 포함 다수 Java 파일에서 사용 | 서비스/컨트롤러/DAO 경계가 아직 동적 JSON 객체에 의존 |
| `XtrmJsonNodes` DAO bridge | 10개 내외 주요 서비스에서 사용 | `selectJson/update/insert` 호출이 JSON node를 반환/변경 |
| 동적 접근자 | `ManagementServiceImpl`, `ApiServiceImpl`, `CmmnServiceImpl`, 로그인/파일/엑셀 경로에 집중 | 문자열 키 오타와 런타임 타입 변환 위험 유지 |
| mapper interface | MyBatis mapper interface 일부가 직접 사용 여부를 별도 확인해야 함 | record DAO 전환 시 미사용 mapper interface 삭제 또는 repository 경계로 통합 필요 |
| `XtrmJSON` 문자열 | 일부 주석에만 잔존 | 동작 영향은 없지만 검색 품질 게이트를 위해 정리 가능 |

특히 사용량이 큰 파일은 다음과 같다.

- `xs/vob/management/service/ManagementServiceImpl.java`
- `xs/core/api/service/ApiServiceImpl.java`
- `xs/vob/cmmn/service/CmmnServiceImpl.java`
- `xs/webbase/login/service/LoginServiceImpl.java`
- `xs/core/database/XtrmDAO.java`
- `xs/aichat/v2/mapper/*Mapper.java` 등 MyBatis mapper interface
- 파일 다운로드/스트림/엑셀 관련 view/util

## 3. 최종 구조 원칙

### 3.1 wire format과 내부 계약 분리

기존 프론트/레거시 API가 기대하는 응답 형태는 유지한다.

```json
{
  "HEADER": {
    "ERROR_FLAG": false,
    "ERROR_CODE": "",
    "ERROR_MSG": "",
    "COUNT": 1,
    "TOT_COUNT": 1
  },
  "DATA": [
    { "...": "..." }
  ]
}
```

다만 서비스 내부에서는 위 구조를 직접 조작하지 않고 다음 record로 표현한다.

```java
public record ApiEnvelope<T>(
        ResponseHeader header,
        List<T> data
) {
}

public record ResponseHeader(
        boolean errorFlag,
        String errorCode,
        String errorMessage,
        int count,
        int totalCount
) {
}
```

Jackson 직렬화 시 기존 대문자 필드명은 `@JsonProperty`로 보존한다.

### 3.2 요청/응답/DAO row를 분리

하나의 `XtrmJsonNode`에 요청값, 세션 보강값, DB 결과, 응답 헤더를 모두 넣지 않는다.

예시:

```java
public record LoginRequest(
        String companyCode,
        String userId,
        String password,
        String languageCode,
        boolean master
) {
}

public record LoginResponse(
        String recentLoginDt,
        String currLoginDate
) {
}
```

DAO 결과는 별도 row record로 표현한다.

```java
public record UploadFileRow(
        String fileGroupKey,
        String fileKey,
        String filePathInfo,
        String originalFileName
) {
}
```

### 3.3 `XtrmJsonNode`는 임시 어댑터로만 사용

승인 후 초기 단계에서는 완전 삭제보다 안전한 strangler 방식을 쓴다.

- 외부 요청 수신부: `XtrmJsonNode` -> request record 변환
- 서비스 내부: record 기반 처리
- 외부 응답 반환부: response record -> `ApiEnvelope<T>` 또는 기존 wire format 변환
- 전환 완료 후: `XtrmJsonNode`/`XtrmJsonNodes` 삭제

## 4. 승인 후 작업 단계

### Phase 0. 계약 고정 및 사용처 재분류

> **산출물:** [TB-006-phase0-inventory.md](./TB-006-phase0-inventory.md) (2026-06-11)

작업:

- `XtrmJsonNode`, `XtrmJsonNodes`, `XtrmJsonNodeWeb` 사용처를 패키지별로 재집계한다.
- 문자열 키 접근자를 입력/출력/DAO row/헤더/세션 보강으로 분류한다.
- MyBatis mapper interface를 실제 Spring bean 주입/호출/mapper XML 연결 기준으로 사용·미사용으로 분류한다.
- 기존 `HEADER/DATA` 응답 중 프론트 호환이 필요한 API를 목록화한다.
- 주석에 남은 `XtrmJSON` 문자열은 별도 정리 대상으로 분리한다.

완료 조건:

- 전환 대상 API/서비스/DAO 목록
- 삭제 가능한 미사용 mapper interface 목록
- 유지해야 하는 wire format 목록
- 삭제 가능한 주석/죽은 코드 목록

### Phase 1. 공통 envelope record 도입

작업:

- `ApiEnvelope<T>`, `ResponseHeader` record 추가
- 기존 `ERROR_FLAG`, `ERROR_CODE`, `ERROR_MSG`, `COUNT`, `TOT_COUNT`, `PAGE_NO`, `ROW_PER_PAGE` 의미 고정
- `XtrmJsonNode`와 `ApiEnvelope<T>` 간 변환 어댑터를 테스트 전용 또는 임시 경계 모듈로 작성

완료 조건:

- 대표 정상/오류 응답 JSON 스냅샷 테스트
- `XtrmJsonNodeTest`의 wire format 핵심 케이스를 envelope 테스트로 이전

### Phase 2. 인증/세션 경로 record 전환

우선 대상:

- `xs/webbase/login/service/LoginServiceImpl`
- `xs/webbase/login/controller/LoginController`
- `xs/core/api/service/ApiServiceImpl#createSessionAndUpdate`
- `xs/aichat/service/HyobeeSSOServiceImpl`
- `xs/aichat/dto/VobLoginResult`

작업:

- 로그인 입력을 `LoginRequest`, `EncryptedLoginRequest`, `PasswordChangeRequest` 등으로 분리
- 세션 생성에 필요한 보강값을 `SessionCreationCommand` 같은 record로 명시
- `VobLoginResult.fail(XtrmJsonNode)` 의존 제거
- 오류 응답은 `ApiEnvelope<EmptyBody>` 또는 명시적 error record로 변환

완료 조건:

- P0/P1 인증 테스트 통과
- 세션 키 계약 유지 확인
- SSO 실패 시 `XTRM_ERROR_DATA` wire format 호환 확인

### Phase 3. `xs/core/api/**` 공통 API record 전환

우선 대상:

- 공통코드 조회
- 프로퍼티 조회
- 날짜/패턴 계산
- 세션 조회
- 파일 업로드/다운로드 메타데이터

작업:

- request record를 컨트롤러 또는 resolver 경계에서 생성
- 서비스 내부의 `setString/setObject` 보강 패턴을 command record 생성으로 대체
- 응답 row는 `List<SomeRow>`로 유지하고 컨트롤러 경계에서 envelope로 감싼다.

완료 조건:

- `ApiServiceImpl` 내 `XtrmJsonNode` 파라미터/반환 사용량 대폭 축소
- 공통 API 대표 테스트 통과

### Phase 4. DAO bridge 제거

작업:

- `XtrmJsonNodes.selectJson(...)` 호출을 `XtrmDAO.selectMap(..., RowRecord.class)` 또는 전용 repository 메서드로 대체
- `insert/update/deleteList`에서 `XtrmJsonNode.getDataObjectNode(i)` 루프를 `List<CommandRecord>` 처리로 변경
- MyBatis mapper 결과 컬럼 alias를 record component 이름과 맞춘다.
- 사용되지 않는 MyBatis mapper interface는 mapper XML, DI 주입 지점, 테스트 fixture를 확인한 뒤 삭제한다.
- 계속 사용하는 mapper interface는 `XtrmJsonNode`를 받거나 반환하지 않도록 record/DTO 기반 메서드 시그니처로 제한한다.

완료 조건:

- `XtrmJsonNodes` 사용처 0건
- `XtrmDAO.selectJson` 신규 사용 금지
- 미사용 mapper interface 0건 또는 삭제 보류 사유 문서화
- DAO row record 매핑 테스트 통과

### Phase 5. 대량 레거시 서비스 전환

우선순위:

1. `xs/vob/cmmn/**`
2. `xs/domain/**`
3. `xs/domain/certification/**`
4. `xs/vob/management/**`
5. 파일/엑셀/view 유틸

전략:

- `ManagementServiceImpl`은 한 번에 제거하지 않고 기능 묶음별로 나눈다.
- 엑셀/view는 외부 wire format보다 내부 row 변환 비용이 크므로 row record와 stream 처리 경계를 우선 정리한다.
- 기존 JSON group(`COMPANY_COMBO`, 임의 그룹명)은 명시적 응답 record 필드 또는 envelope 확장 구조로 표현한다.

완료 조건:

- 패키지별 `XtrmJsonNode` import 제거
- 동적 문자열 키 접근자 감소 추적
- 패키지별 회귀 테스트 통과

### Phase 6. 호환층 삭제

작업:

- `XtrmJsonNode`, `XtrmJsonNodeWeb`, `XtrmJsonNodes` 삭제
- `XtrmArgumentResolveMap`에서 `params` 타입 제거 또는 request record resolver로 교체
- 주석에 남은 `XtrmJSON`/`XtrmJsonNode` 레거시 코드 제거
- 문서와 테스트명에서 legacy 표현 정리

완료 조건:

```bash
rg "XtrmJSON|XtrmJSONWeb|XtrmJsonNode|XtrmJsonNodes" src/main/java src/test/java
```

결과가 0건이거나, 문서화된 허용 목록만 남아야 한다.

## 5. 검증 계획

### 5.1 필수 테스트

- `XtrmJsonNodeTest`에 해당하는 wire format golden test를 `ApiEnvelope` 테스트로 이전
- P0/P1 인증 회귀
  - `LoginServiceImplTest`
  - `HyobeeSSOServiceImplTest`
  - `HyobeeSSOControllerTest`
  - `HyobeeApiInterceptorTest`
  - `ApiServiceImplTest`
  - `XtrmHandlerInterceptorAuthTest`
  - `AuthPagePreloadTest`
  - `HyobeePagePathsTest`
- 파일 다운로드/엑셀 smoke 테스트
- DAO row record 매핑 테스트

### 5.2 검색 기반 품질 게이트

단계별로 아래 검색 결과를 기록한다.

```bash
rg "XtrmJsonNode|XtrmJsonNodes|XtrmJsonNodeWeb" src/main/java src/test/java
rg "getString\\(|setString\\(|getObject\\(|setObject\\(|getDataArrayNode\\(" src/main/java
rg "ObjectNode|ArrayNode|JsonNode" src/main/java/xs
rg "interface\\s+\\w+Mapper|@Mapper" src/main/java/xs
```

`ObjectNode`/`ArrayNode`/`JsonNode`는 Jackson 경계에서 필요한 경우가 있으므로, 최종 단계에서는 허용 경계를 별도 목록으로 관리한다.
mapper interface 검색 결과는 호출 그래프와 MyBatis XML 연결 여부를 함께 확인하여 삭제/유지 목록으로 분리한다.

## 6. 유지보수 기대 효과

### 6.1 컴파일 타임 계약 강화

현재는 `objXtrmParams.getString("languageCode")`처럼 문자열 키가 틀려도 컴파일이 통과한다. record 전환 후에는 필드명과 타입이 생성자/접근자에 고정되어 다음 효과가 있다.

- 키 오타가 컴파일 또는 테스트 단계에서 드러남
- API별 필수/선택 필드가 타입으로 표현됨
- 서비스 메서드 시그니처만 보고 입력/출력 의미를 파악 가능
- IDE rename/refactor가 동작하여 변경 영향 추적 쉬움

### 6.2 책임 경계 축소

`XtrmJsonNode`는 요청, 응답, DAO row, 에러 헤더, 임시 그룹을 모두 담을 수 있다. record 전환 후에는 다음처럼 책임이 나뉜다.

- request record: 외부 입력
- command record: 서비스/DAO에 넘기는 내부 명령
- row record: DB 조회 결과
- response record: API 응답 body
- envelope record: 기존 `HEADER/DATA` wire format

이 구조는 테스트 fixture를 단순화하고, 신규 기능 추가 시 기존 공용 JSON 객체를 이해해야 하는 부담을 줄인다.

### 6.3 레거시 검색 비용 감소

최종 단계에서 아래 항목은 0건을 목표로 한다.

- `XtrmJsonNode`/`XtrmJsonNodes` import
- `getString/setString/getObject/setObject` 기반 업무 로직
- 호출되지 않는 mapper interface
- 주석에 남은 `XtrmJSON` 죽은 코드

따라서 레거시 객체의 의미를 추적하는 비용과, 문자열 키 변경 시 광범위 grep에 의존하는 비용이 줄어든다.

## 7. 성능 기대 효과

### 7.1 개선되는 경로

record 전환으로 기대되는 성능 개선은 주로 다음 경로에서 발생한다.

- DAO 결과 `Map -> ObjectNode/ArrayNode -> getString/getInt` 변환 제거
- `getDataArrayNode()`/`getDataObjectNode()` deep copy 빈도 감소
- 서비스 내부 임시 JSON 객체 생성 감소
- JSON 문자열 직렬화/역직렬화 왕복 감소
- 대량 목록/엑셀/파일 메타데이터 처리 시 GC allocation 감소

### 7.2 보수적 기대치

- DB I/O가 대부분인 단건 API는 응답 시간 개선이 작을 수 있다.
- row 수가 많은 목록, 엑셀, 파일 메타데이터 API는 CPU와 allocation 감소 효과가 상대적으로 크다.
- 정확한 수치는 대표 API의 전환 전후 측정으로만 확정한다.

권장 측정 항목:

- 대표 목록 API p95 latency
- 엑셀 export 대상 row 수별 처리 시간
- 파일 메타데이터 목록 처리 시간
- JVM allocation rate 또는 GC pause
- `XtrmDAO.selectJson` 대비 `selectMap(..., RowRecord.class)` 처리 시간

## 8. 위험과 완화

| 위험 | 설명 | 완화 |
|---|---|---|
| wire format 회귀 | 프론트가 `HEADER/DATA` 대문자 필드에 의존 | envelope JSON 스냅샷 테스트 |
| 인증/세션 회귀 | login/SSO/session 경로가 민감 | P0/P1 테스트 선행, 작은 PR로 분할 |
| mapper alias 불일치 | DB 컬럼명과 record component 불일치 | mapper alias 정리, row record 매핑 테스트 |
| mapper interface 오삭제 | XML 또는 런타임 스캔으로만 연결된 mapper를 미사용으로 오판 가능 | Spring bean 주입, XML namespace, 테스트 실행을 함께 확인 |
| 대량 파일 충돌 | `ManagementServiceImpl` 사용량 집중 | 기능 묶음별 단계 전환 |
| 임의 그룹 표현 | `COMPANY_COMBO` 같은 추가 DATA 그룹 존재 | 명시적 response record 필드 또는 envelope extension 정의 |
| 중간 호환층 장기화 | `XtrmJsonNode` adapter가 새 표준이 될 위험 | Phase별 삭제 기준과 검색 게이트 운영 |

## 9. 승인 후 첫 작업 제안

승인 후 첫 구현 PR은 대량 전환이 아니라 아래 범위로 제한하는 것이 안전하다.

1. `ApiEnvelope<T>`/`ResponseHeader` record 추가
2. `XtrmJsonNode`와 envelope 간 변환 테스트 추가
3. `VobLoginResult.fail(XtrmJsonNode)` 제거 또는 error envelope 기반으로 축소
4. MyBatis mapper interface 사용 여부 조사표 추가
5. 주석에 남은 `(구) XtrmJSON` 죽은 코드 제거

이 범위는 wire format과 테스트 기준을 먼저 고정하므로 이후 Backend 전환 PR의 충돌과 회귀 위험을 줄인다.
