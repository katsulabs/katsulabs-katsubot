# XtrmJSON 잔재 제거 및 record 전환 작업 계획

## 1. 목적

`XtrmJSON` 계열은 `HEADER`, `DATA`, 임의 그룹, 타입 변환, DAO 파라미터, 응답 직렬화까지 한 객체가 모두 담당하는 만능 객체입니다. 이 구조는 호출부가 문자열 키와 런타임 변환에 의존하게 만들어 변경 영향 범위를 파악하기 어렵고, Gson/Jackson 노드 복사와 변환 비용도 누적됩니다.

이번 작업의 목표는 다음과 같습니다.

- `(구) XtrmJSON` 및 `XtrmJsonNode` 중간 계층의 잔재를 제거한다.
- API/서비스/DAO 경계에서 명시적인 Java `record` 요청/응답 계약으로 전환한다.
- JSON wire format 호환이 필요한 외부 응답만 얇은 어댑터에 격리한다.
- 유지보수성과 성능 개선 기대치를 검증 가능한 기준으로 문서화한다.

> 주의: 이 문서는 작업 계획입니다. 실제 코드 변경은 승인 후 진행합니다.

## 2. 현재 확인한 상태

### 2.1 `test-deploy` 기준

현재 기준 브랜치에는 아직 `XtrmJSON`/`XtrmJSONWeb`가 존재합니다.

- 핵심 클래스
  - `src/main/java/xs/core/parameter/XtrmJSON.java`
  - `src/main/java/xs/core/parameter/XtrmJSONWeb.java`
- 주요 결합 지점
  - `xs/core/database/XtrmDAO`
  - `xs/core/api/**`
  - `xs/webbase/login/**`
  - `xs/vob/**`
  - `xs/aichat/**`
  - 파일 다운로드/엑셀/REST 연동 유틸
- 검색 기준 대략적 사용량
  - `XtrmJSON`: 약 50개 Java 파일에 분포
  - `XtrmJSONWeb`: 인터셉터/리졸버 중심
  - `setString/getString/setObject/getObject/getDataJsonArray` 등 동적 접근자: 다수 서비스에 집중

### 2.2 `XtrmJsonNode` 중간 전환 상태

사용자 설명과 현재 작업 전 탐색 결과상, 다른 진행 브랜치에는 `XtrmJSON`을 삭제하고 Jackson 기반 `XtrmJsonNode`로 옮긴 중간 상태가 있습니다.

- `XtrmJsonNode`는 Gson 제거와 Jackson 일원화에는 유효한 중간 단계입니다.
- 다만 여전히 문자열 키 기반 `setString/getString/getObject`, 임의 그룹, mutable root node를 유지하므로 "만능 객체" 문제는 남습니다.
- 따라서 최종 방향은 `XtrmJsonNode`를 장기 API로 고정하지 않고, record 전환을 위한 strangler 어댑터로만 사용하는 것입니다.

## 3. 문제 정의

| 문제 | 현재 양상 | record 전환 후 목표 |
|---|---|---|
| 타입 안정성 부족 | `"companyCode"`, `"userId"` 같은 문자열 키를 런타임에 조회 | `record LoginRequest(String companyCode, String userId, ...)`처럼 컴파일 시점에 필드 검증 |
| 책임 과다 | 파싱, 검증, DAO, 응답 포맷, 에러 헤더를 단일 객체가 처리 | 요청 DTO, 응답 DTO, DAO row record, wire envelope를 분리 |
| 변경 영향 추적 어려움 | 키 이름 변경 시 검색 누락 가능 | record 생성자/접근자 기준으로 IDE/컴파일러가 영향 표시 |
| JSON 라이브러리 결합 | Gson 또는 JsonNode 타입이 서비스 로직까지 침투 | Jackson 변환은 컨트롤러/어댑터/DAO 경계에 제한 |
| 불필요한 변환 비용 | Map -> JsonObject/JsonNode -> 문자열 키 접근 반복 | MyBatis 결과를 record/List/Map으로 직접 매핑 |

## 4. 전환 원칙

1. **외부 wire format은 필요한 곳에서만 유지**
   - 기존 프론트가 `{ "HEADER": ..., "DATA": [...] }` 구조를 기대하는 API는 `ApiEnvelope<T>` 같은 명시적 record로 보존합니다.
   - 내부 서비스는 `XtrmJSON`/`XtrmJsonNode`를 직접 주고받지 않습니다.

2. **경계부터 안쪽으로 전환**
   - 컨트롤러/ArgumentResolver 입력을 record로 고정합니다.
   - DAO는 `selectMap(..., SomeRecord.class)` 또는 전용 mapper resultType으로 옮깁니다.
   - 마지막에 공용 JSON 객체 클래스를 삭제합니다.

3. **고위험 인증/세션 경로는 별도 단계로 관리**
   - `xs/webbase/login/**`, `xs/core/api/**`, 인터셉터는 테스트와 함께 작은 단위로 전환합니다.
   - 세션 키, 오류 헤더, redirect/error page 동작은 wire 호환성 테스트로 고정합니다.

4. **기존 브랜치의 `XtrmJsonNode`는 임시 호환층으로만 사용**
   - 이미 `XtrmJsonNode`로 전환된 변경이 병합 대상이면, 그 위에 새 만능 API를 추가하지 않습니다.
   - record 전환 완료 후에는 `XtrmJsonNode`/`XtrmJsonNodes`도 삭제 대상으로 둡니다.

## 5. 승인 후 작업 단계

### Phase 0. 기준선 고정

- `test-deploy`와 `XtrmJsonNode` 중간 브랜치의 차이를 재확인합니다.
- `XtrmJSON`, `XtrmJSONWeb`, `XtrmJsonNode`, `XtrmJsonNodes` 사용처를 패키지별로 목록화합니다.
- 기존 JSON 응답의 `HEADER`, `DATA`, `COUNT`, `TOT_COUNT`, 오류 헤더 의미를 계약 문서로 확정합니다.

완료 조건:

- 동적 JSON 객체 사용처 목록
- 외부 호환이 필요한 API 목록
- record 전환 우선순위 목록

### Phase 1. 공통 envelope/에러 계약 도입

예상 record:

```java
public record ApiEnvelope<T>(
        ResponseHeader header,
        List<T> data
) {
}

public record ResponseHeader(
        boolean errorFlag,
        String errorCode,
        String errorMsg,
        int count,
        int totalCount
) {
}
```

작업:

- 기존 `{HEADER, DATA}` 구조를 표현하는 record를 추가합니다.
- 기존 프론트 호환을 위해 Jackson property 이름은 `HEADER`, `DATA`, `ERROR_FLAG` 등으로 명시합니다.
- 오류 응답과 정상 응답 생성 helper를 추가하되, 서비스 내부의 mutable JSON 조립은 금지합니다.

완료 조건:

- envelope 단위 직렬화 테스트
- 기존 대표 응답과 JSON 필드명 호환 검증

### Phase 2. 입력 파라미터 record 전환

우선순위:

1. 로그인/SSO/세션 입력
   - `LoginRequest`
   - `PasswordChangeRequest`
   - `SessionSwitchRequest`
2. 공통 API 입력
   - `CodeGroupRequest`
   - `DatePatternRequest`
   - `PropertyRequest`
3. 파일/엑셀 입력
   - `FileDownloadRequest`
   - `FileStreamRequest`

작업:

- 컨트롤러는 `XtrmArgumentResolveMap`에서 값을 꺼내는 대신 record를 직접 받거나, 임시 adapter에서 record를 생성합니다.
- 필수값은 compact constructor 또는 Bean Validation으로 검증합니다.
- 서비스 시그니처에서 `XtrmJSON`/`XtrmJsonNode`를 제거합니다.

완료 조건:

- 입력 record별 단위 테스트
- 누락/빈 값/잘못된 타입 검증 테스트
- 인증/세션 회귀 테스트 통과

### Phase 3. DAO 결과 record 전환

작업:

- `XtrmDAO.selectJson` 호출을 가능한 곳부터 `selectMap(..., SomeRecord.class)` 또는 전용 DAO 메서드로 전환합니다.
- MyBatis 결과 row는 `record` 또는 기존 DTO로 직접 매핑합니다.
- 여러 row 응답은 `List<RowRecord>`로 서비스에 반환하고, 컨트롤러에서만 envelope로 감쌉니다.

완료 조건:

- `XtrmJSON`/`XtrmJsonNode`의 `getDataJsonArray/getDataArrayNode` 루프 제거
- DAO 결과 변환 테스트
- 대표 목록 API JSON 호환 테스트

### Phase 4. 대량 사용처 축소

우선 전환 패키지:

1. `xs/core/api/**`
2. `xs/webbase/login/**`
3. `xs/aichat/**`
4. `xs/domain/**`
5. `xs/vob/cmmn/**`
6. `xs/vob/management/**`
7. 파일/엑셀/view 유틸

전략:

- 변경량이 큰 `ManagementServiceImpl`은 기능 묶음별로 분리합니다.
- 서비스 내부에서 필드 값을 추가로 주입하던 패턴은 `with...` helper 또는 새 record 생성으로 대체합니다.
- list mutation이 필요한 흐름은 `List<MutableMap>`로 후퇴하지 않고 전용 command/result record로 나눕니다.

완료 조건:

- 패키지별 `XtrmJSON`/`XtrmJsonNode` import 0건
- 문자열 키 접근자 호출 감소 추적
- 패키지별 회귀 테스트 통과

### Phase 5. 호환층 제거

작업:

- `XtrmJSON`, `XtrmJSONWeb`, `XtrmJsonNode`, `XtrmJsonNodes` 삭제
- Gson 의존성이 남아 있다면 제거
- `XtrmArgumentResolver`/인터셉터에서 legacy JSON 생성 제거
- JSP 오류 페이지 등 예외적으로 문자열 JSON이 필요한 곳은 `ApiEnvelope` 직렬화로 대체

완료 조건:

- `rg "XtrmJSON|XtrmJsonNode|XtrmJsonNodes|XtrmJSONWeb"` 결과 0건
- `pom.xml`에서 불필요한 Gson 의존성 제거
- 전체 테스트 또는 합의된 회귀 테스트 통과

## 6. 검증 계획

### 필수 자동 검증

- `XtrmJSON`/`XtrmJsonNode` 호환 테스트 또는 신규 envelope 직렬화 테스트
- 로그인/세션/API 권한 회귀 테스트
- 파일 다운로드/엑셀 응답 smoke 테스트
- DAO record 매핑 테스트

### 검색 기반 품질 게이트

승인 후 각 단계 말미에 다음 검색을 통과 기준으로 둡니다.

```bash
rg "XtrmJSON|XtrmJSONWeb|XtrmJsonNode|XtrmJsonNodes" src/main/java src/test/java
rg "getString\\(|setString\\(|getObject\\(|setObject\\(" src/main/java
rg "JsonObject|JsonArray|JsonElement|Gson" src/main/java
```

단, 외부 라이브러리 또는 의도적으로 남긴 Jackson `JsonNode` 경계는 별도 허용 목록으로 관리합니다.

## 7. 기대 효과

### 7.1 유지보수성

정량 기대:

- 핵심 서비스의 문자열 키 기반 접근자 호출을 단계 완료 시점에 80~100% 제거할 수 있습니다.
- `XtrmJSON`/`XtrmJsonNode` 타입 import는 최종 단계에서 0건이 됩니다.
- DTO/record 필드가 컴파일 타임 계약이 되므로, 키 오타나 누락 필드로 인한 런타임 장애 가능성이 크게 줄어듭니다.

정성 기대:

- 기능별 요청/응답 구조를 IDE에서 바로 추적할 수 있습니다.
- 서비스 메서드의 입력과 출력 의미가 시그니처에 드러납니다.
- 신규 개발자가 `HEADER/DATA` 내부 규칙을 외우지 않아도 됩니다.
- 테스트는 JSON 객체 조립 대신 record fixture로 단순화됩니다.

### 7.2 성능

예상 개선 지점:

- DAO 결과를 `Map -> JsonObject/JsonNode -> 문자열 키 조회`로 반복 변환하던 흐름을 줄입니다.
- `getDataJsonObject/getDataArrayNode`의 deep copy 또는 JsonElement 변환 비용을 제거합니다.
- 서비스 내부의 불필요한 JSON 문자열 직렬화/역직렬화를 줄입니다.

보수적 예상:

- DB I/O가 지배적인 API에서는 전체 응답 시간 개선폭이 제한적일 수 있습니다.
- 대량 목록, 엑셀, 파일 메타데이터처럼 row 수가 많고 JSON 노드 변환이 반복되는 경로에서는 CPU 사용량과 GC allocation 감소 효과가 상대적으로 큽니다.
- 실제 수치는 대표 목록 API와 파일/엑셀 경로에 대해 전환 전후 micro 또는 integration benchmark를 붙여 확인해야 합니다.

### 7.3 위험과 완화

| 위험 | 설명 | 완화 |
|---|---|---|
| 프론트 호환성 | 기존 화면이 `HEADER/DATA` 대문자 필드를 기대 | envelope record에 JSON property 명시, 대표 응답 스냅샷 테스트 |
| 대량 변경 충돌 | `ManagementServiceImpl` 등 한 파일에 사용량 집중 | 패키지/기능 단위 PR 분리 |
| MyBatis 매핑 불일치 | 컬럼명과 record component 불일치 가능 | mapper alias 정리, DAO 매핑 테스트 |
| 세션/인증 회귀 | 로그인 파라미터와 세션 키 변경 위험 | P0/P1 회귀 테스트 우선 실행 |
| 중간 브랜치 차이 | `test-deploy`와 `XtrmJsonNode` 전환 브랜치 상태 차이 | 승인 후 시작 시 기준 브랜치 확정 및 diff 재조사 |

## 8. 승인 요청 전 확인 사항

실제 구현 착수 전에 아래 중 하나를 확정해야 합니다.

1. `test-deploy`에서 바로 `XtrmJSON -> record`로 진행
2. 이미 진행된 `XtrmJSON -> XtrmJsonNode` 브랜치를 먼저 병합/기준화한 뒤 `XtrmJsonNode -> record`로 진행

권장안은 2번입니다. Gson 제거와 Jackson 일원화가 먼저 안정화되어 있으면, record 전환은 동적 JSON 객체 축소에 집중할 수 있어 충돌과 회귀 범위를 줄일 수 있습니다.
