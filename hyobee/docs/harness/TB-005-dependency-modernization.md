# TB-005 — 의존성·JDK 현대화

| 항목 | 값 |
|------|-----|
| 티켓 | TB-005 |
| 상태 | PLAN |
| 브랜치 | `feature/TB-005-dependency-modernization` |
| 제약 | **외장 Tomcat 9.x** 배포 구조 유지 (WAR, Servlet 4.0 / `javax.*`) |

## 1. 목표

1. Third-party JSON·미사용 라이브러리 정리 — **Spring Boot 기본 Jackson** 단일화
2. **제거 0순위:** `src/main/java/xs/core/parameter/XtrmJSON.java` (Gson `JsonObject` 래퍼, ~45 파일·500+ 참조)
3. JDK **11 → 17** (필수), **21** (선택) — record·Virtual thread 검토
4. **CLOSE_WAIT** 누적 가능 구간 식별 및 완화 방안
5. Phase별 **강화 QA 게이트** (G0–G9)

## 2. 현재 기준선 (2026-05-30)

| 영역 | 현재 |
|------|------|
| JDK | **11** (`pom.xml` `java.version`) |
| Spring Boot | **2.7.18** (2.x 최종 — Tomcat 9.x와 호환) |
| Packaging | WAR, `spring-boot-starter-tomcat` (provided 전환 가능) |
| JSON (Hyobee v2) | Jackson — `JacksonJsonAdapter` (`@Primary`) |
| JSON (레거시) | Gson — `XtrmJSON`, `GsonHttpMessageConverter`, `@Autowired Gson` |
| JWT | jjwt **0.10.7** |
| HTTP client | Apache HttpClient **4.5.14** + HttpClient5 5.2 + Reactor Netty(WebClient SSE) |
| 인증 회귀 | P0+P1 **59/59 PASS** ([qa-registry.md](./qa-registry.md)) |

### 2.1 Tomcat 9.x 제약에서 불가/보류

| 항목 | 판단 | 사유 |
|------|------|------|
| Spring Boot **3.x** | ❌ | Jakarta EE (`jakarta.*`), Tomcat **10+** 필요 |
| Embedded Tomcat **10+** | ❌ | 운영 외장 Tomcat 9.x와 불일치 |
| `javax.*` → `jakarta.*` 일괄 마이그레이션 | ❌ | 배포 구조 변경 수반 |

**가능:** JDK 17/21, 의존성 patch/minor, Gson→Jackson Strangler, HttpClient/WebClient 연결 관리 개선, record/VT (애플리케이션 코드 수준).

## 3. Phase 계획

```text
005a  patch + 미사용 dep 제거     ──► G0–G2
005b  JDK 17 + record pilot       ──► G0–G3
005c  jjwt 0.12 + 인증 회귀       ──► G0–G4 (P0 필수)
005d  aichat v2 Gson 제거           ──► G0–G4
005e  XtrmJSON Strangler (Epic)   ──► G0–G9
005f  (선택) JDK 21 + VT pilot    ──► G0–G4 + 부하 관측
```

| Phase | 범위 | PR 크기 |
|-------|------|---------|
| **005a** | `pom.xml` patch, 미사용 dep 제거, Jackson BOM 정렬 | S |
| **005b** | `java.version=17`, `JwtClaims` 등 record pilot | S |
| **005c** | jjwt 0.12.x, `HyobeeJwtTokenServiceImpl` API 마이그레이션 | M |
| **005d** | `xs/aichat/v2/**` Gson import 0건 (`ChatStreamServiceImpl`, `ChatLogService`, v2 DTO `@SerializedName` 등) | M |
| **005e** | `XtrmJSON` → `XtrmJsonNode`(Jackson) Strangler, `gson` pom 제거 | **XL (Epic, 다 PR)** |
| **005f** | JDK 21, VT Executor pilot (REST blocking 구간) | M |

## 4. 의존성 인벤토리

### 4.1 즉시 제거 후보 (005a) — 코드 import **0건** 확인됨

| artifact | 현재 | 조치 |
|----------|------|------|
| `org.json:json` | 20220320 | **pom 제거** |
| `com.google.guava:guava` | 32.1.2-jre | **pom 제거** |
| `org.apache.ibatis:ibatis-sqlmap` | 2.3.4.726 | **pom 제거** (MyBatis 3만 사용) |

### 4.2 patch/minor (로직 영향 낮음 — 005a)

| artifact | 현재 | 목표 | 비고 |
|----------|------|------|------|
| `jackson-databind` | 2.13.0 (pin) | **2.13.5** (SB 2.7 BOM) | pin 해제, BOM 위임 |
| `snakeyaml` | 2.2 | 2.2 유지 | CVE 대응 이미 반영 |
| `commons-lang3` | 3.8.1 | **3.14.0** | API 호환 |
| `commons-io` | 2.15.1 | **2.16.1** | |
| `jsoup` | 1.11.2 | **1.17.2** | HTML 파싱 API 대체로 호환 |
| `lombok` | 1.18.30 | **1.18.34** | JDK 17/21 |
| `postgresql` driver | BOM | BOM 최신 | pin 주석 해제 검토 |
| `spring-retry` | 1.3.1 | **1.3.4** | |
| `mybatis-spring-boot-starter` | 2.2.0 | **2.3.2** | SB 2.7 호환 최신 2.x |
| `httpclient` | 4.5.14 | 4.5.14 유지 | 4.x 최종 |
| `httpclient5` | 5.2 | **5.3.1** | |

### 4.3 major / 로직 변경 필요 (별도 PR·체크리스트)

| artifact | 현재 → 목표 | 로직 변경 요약 |
|----------|-------------|----------------|
| **jjwt** | 0.10.7 → **0.12.6** | `signWith(Key, SignatureAlgorithm)` → `signWith(Key)`; `Jwts.parser()` → `parserBuilder()`; `setSubject` → `subject()`; HS256 키 길이 검증 강화 |
| **commons-fileupload** | 1.3.3 → **1.5** | `CommonsMultipartResolver` → Spring `StandardServletMultipartResolver` 검토 (Spring Boot 기본) |
| **POI** | 5.2.5 | 5.2.x 유지 (5.3+는 JDK17 권장 — 005b 후 검토) |
| **gson** | BOM | **005e 완료 후 pom 제거** — `XtrmJSON`·`GsonHttpMessageConverter`·`@Autowired Gson` 제거 선행 |

### 4.4 유지 (Third-party이나 Spring 생태계 표준)

| artifact | 사유 |
|----------|------|
| `mybatis-spring-boot-starter` | ORM — 레거시 SQL 맵 대량 |
| `log4jdbc-remix` | SQL 로깅 — 대체 시 XtrmDataConfig 영향 |
| `httpclient` 4.x | `XtrmRestComponent`, `HyobeeChatApiClient` |
| `spring-boot-starter-webflux` | SSE `WebClient` — aichat v2 필수 |

## 5. Gson → Jackson (Third-party JSON 제거)

### 5.1 현황

| 구역 | JSON 스택 | Gson 사용 |
|------|-----------|-----------|
| `xs/aichat/v2/**` | Jackson (`JsonAdapter`) | **잔존** — `ChatStreamServiceImpl`, `ChatLogService`, DTO `@SerializedName` |
| `xs/aichat/**` (SSO/JWT) | Jackson + jjwt-jackson | 없음 |
| `xs/core/parameter/XtrmJSON` | Gson `JsonObject` | **핵심** — 레거시 API 계약 `{HEADER, DATA[]}` |
| `xs/core/api/**`, `xs/vob/**` | XtrmJSON | **광범위** — ApiServiceImpl, ManagementServiceImpl 등 |
| MVC | Gson **+** Jackson converter | `XtrmWebMvcConfig` — Gson이 **먼저** 등록됨 |

### 5.2 XtrmJSON 제거 Strangler (005e — 0순위 Epic)

> **서브 PR 분할:** [TB-005-005e-subprs.md](./TB-005-005e-subprs.md) — 005e-1 … 005e-9, 역순 병합 금지.

**목표:** `XtrmJSON.java` 삭제, Gson pom 제거.

**단계:**

1. **계약 고정** — `{HEADER:{ERROR_FLAG,ERROR_CODE,ERROR_MSG,...}, DATA:[{...}]}` JSON wire format 변경 없음 ([Contract handoff](./auth-flow-analysis.md) 레거시 API 섹션)
2. **`XtrmJsonNode` (신규)** — Jackson `ObjectNode`/`ArrayNode` 기반, `XtrmJSON` public API 동형 구현
3. **병행 기간** — `XtrmJSON` extends/ delegates to `XtrmJsonNode` 또는 `@Deprecated` + codemod
4. **마이그레이션 순서 (리스크 낮→高):**
   - P2 `xs/domain/**`, `xs/vob/cmmn/**`
   - P1 `xs/core/api/**` (인증 세션 — **P0 테스트 필수**)
   - P0 `LoginServiceImpl`, `HyobeeSSOServiceImpl` (XtrmJSON 잔존 4~33 refs)
   - Excel/View (`XtrmExcelExportView` 등) — Gson `JsonArray` 직접 사용
5. **`GsonHttpMessageConverter` 제거** — Jackson only; 레거시 클라이언트 Content-Type 회귀 테스트
6. **`@Autowired Gson` / `getBean("gson")` 제거**
7. **`XtrmJSON.java` 삭제**

**참조 규모:** ~**45** Java 파일, `ManagementServiceImpl` 단독 **325+** 참조.

## 6. JDK · record

### 6.1 JDK 17 (005b — 권장 필수)

| 항목 | 내용 |
|------|------|
| pom | `java.version=17`, `maven-compiler-plugin` 3.11+ |
| CI/운영 | 외장 Tomcat **9.0.70+**, JDK 17 런타임 |
| SB 2.7.18 | Java 17 공식 지원 |

### 6.2 record pilot 후보 (005b)

| 타입 | 패키지 | 이유 |
|------|--------|------|
| `JwtClaims` | `xs.aichat.dto` | immutable, Lombok `@Data` → `record` |
| `VobLoginResult` | `xs.aichat.dto` | SSO 결과 DTO |
| `ChatLogParam` | `xs.aichat.dto` | 로그 빌더 — `@Builder` record 또는 compact ctor |
| aichat v2 request/response | `xs.aichat.v2.dto.internal.*` | Jackson `@JsonProperty` + immutable (005d와 병행) |

**보류 (record 부적합):** JPA `@Entity`, MyBatis mutable DTO, `XtrmJSON` 계열 (005e에서 Jackson node로 대체).

## 7. JDK 21 · Virtual Thread (005f — 선택)

Spring Boot **2.7**은 `spring.threads.virtual.enabled` **미지원** (SB 3.2+). Tomcat 9.x는 컨테이너 스레드가 platform thread — **VT는 애플리케이션이 명시적으로 도입**.

### 7.1 VT 적용 후보 (blocking I/O)

| # | 구간 | 클래스 | 기대 효과 | 주의 |
|---|------|--------|-----------|------|
| 1 | WRTN REST 동기 호출 | `HyobeeChatApiClient` | 대량 동시 API 시 platform thread 고갈 완화 | `RestTemplate` + shared pool 선행 |
| 2 | 레거시 REST outbound | `XtrmRestComponent`, `XtrmRestComponentDeep` | Callisto/외부 연동 | static singleton — VT executor에서 호출 |
| 3 | `@Async` / TaskExecutor | `XtrmWebMvcConfig#taskExecutor` | core=max=20 고정 풀 대체 | `@Async` 전역 설정 필요 |
| 4 | 배치 스레드 | `BatchServiceThread` | 배치 fan-out | 기존 thread lifecycle과 충돌 검토 |
| 5 | 파일 I/O + DB 로그 | `ChatLogService` | API 로그 insert blocking | DB pool 크기와 VT 폭증 조율 |
| 6 | SSO/DB lookup | `HyobeeSSOServiceImpl` | 짧은 blocking | 효과 제한적 |

### 7.2 VT 비권장

| 구간 | 사유 |
|------|------|
| `ChatStreamServiceImpl` SSE + Reactor | 이미 non-blocking event loop |
| POI Excel export | CPU-bound |
| `synchronized`/legacy JDBC in XtrmDAO | pin carrier thread — VT 이점 감소 |

### 7.3 Pilot 패턴 (005f)

```java
@Bean
Executor virtualThreadExecutor() {
    return Executors.newVirtualThreadPerTaskExecutor();
}
```

`HyobeeChatApiClient`의 blocking `executeCallApi`만 VT executor로 offload → Tomcat worker 반환 속도 개선. **부하 테스트 + CLOSE_WAIT/netstat 관측 필수.**

## 8. CLOSE_WAIT 대응 가능 여부

### 8.1 결론

**대응 가능.** 코드베이스에 연결 누수·미정리 패턴이 있으며, 의존성 업그레이드만으로 해결되지 않음 — **HTTP 클라이언트 생명주기 정리**가 005a/005d/005f와 병행 필요.

### 8.2 위험 구간 (우선순위)

| P | 구간 | 문제 | 완화 (TB-005) |
|---|------|------|----------------|
| **P0** | `WrtnChatVendorClient#startChatStream` | **요청마다** `WebClient.builder().build()` — Reactor Netty connection pool 미공유 | `@Bean` shared `WebClient` + `ConnectionProvider` (maxIdleTime, evictInBackground) |
| **P0** | `HyobeeChatApiClient` (non-LOCAL) | `new RestTemplate()` — 기본 `SimpleClientHttpRequestFactory`, **pool/`@PreDestroy` 없음** | `XtrmRestComponent`와 동일한 pooling `CloseableHttpClient` + `@PreDestroy` |
| **P1** | `HyobeeChatApiClient#createUnsafeRestTemplate` | LOCAL SSL client — pool/eviction 없음, bean destroy 없음 | pooling manager + `@PreDestroy` |
| **P1** | `XtrmRestComponent` | `setStaleConnectionCheckEnabled(false)` — stale socket → CLOSE_WAIT | `true` 또는 `validateAfterInactivity`; idle connection evictor |
| **P2** | `ChatStreamServiceImpl#cleanup` | `subscription.dispose()` 구현됨 ✓ | 클라이언트 disconnect 시 `stopMessageStream` 경로 E2E 검증 |
| **P2** | Tomcat → client SSE | 클라이언트 abort 시 upstream dispose 지연 | `onCompletion`/`onError` → `cleanup` 이미 연결 — QA 시나리오 추가 |

### 8.3 운영 관측 (QA G7)

```bash
# Linux — CLOSE_WAIT 카운트
ss -tan state close-wait | wc -l
# 또는
netstat -an | grep CLOSE_WAIT | wc -l
```

**G7 시나리오:** SSE 10 concurrent × 5분 → CLOSE_WAIT 증가 ≤ baseline+10. 실패 시 WebClient/RestTemplate PR 롤백.

### 8.4 config 참고 (`XtrmConfig.properties`)

```properties
REST_CONN_REQ_TIMEOUT=10000
REST_CONN_TIMEOUT=10000
REST_SOCKET_TIMEOUT=120000
REST_SOCKET_TIMEOUT_DEEP=600000
REST_CONN_POOL_MAX_TOTAL=100
REST_CONN_POOL_MAX_PER_ROUTE=30
```

## 9. QA 게이트 (강화)

### 9.1 Phase 공통 (G0–G4)

| ID | 게이트 | 명령/조건 | Phase |
|----|--------|-----------|-------|
| **G0** | compile | `mvn -q -DskipTests compile` | 전체 |
| **G1** | unit all | `mvn test -DfailIfNoTests=false` | 005a+ |
| **G2** | dep audit | `mvn dependency:analyze` — unused declare 0건 (005a dep) | 005a |
| **G3** | P0+P1 auth | 59 tests PASS ([package-scope.md](./package-scope.md)) | **전 Phase 필수** |
| **G4** | jjwt/JWT | `HyobeeJwtTokenServiceImplTest` + SSO 4-class suite | 005c+ |

### 9.2 XtrmJSON·JSON (G5–G9, 005d/005e)

| ID | 게이트 | 조건 |
|----|--------|------|
| **G5** | Gson import | `rg 'import com.google.gson' src/main/java/xs/aichat/v2` → **0건** (005d) |
| **G6** | 레거시 API smoke | `LoginController` JSON login + `ApiController` 대표 3 API — `{HEADER,DATA}` 형식 byte-equal 또는 golden JSON |
| **G7** | CLOSE_WAIT | SSE 부하 후 CLOSE_WAIT netstat (§8.3) |
| **G8** | aichat manual | [qa-registry §5](./qa-registry.md) pre-flight + 브라우저 11 (TB-004 완료 후) |
| **G9** | Gson 제거 | `rg 'com.google.gson' src/` → **0건**; `pom.xml` gson dep 없음 (005e 완료) |

### 9.3 PR Hard Gates (기존 + TB-005)

- [ ] Phase ID (005a–f) 명시
- [ ] G0–G3 결과 첨부 (005c+: G4)
- [ ] 005e: G5–G9 중 해당 항목
- [ ] `main` 직접 커밋 없음
- [ ] 인증 영향 시 `auth-flow-analysis.md` diff 또는 "N/A"

## 10. Sub-agent handoff

| Phase | Contract | Backend | QA |
|-------|----------|---------|-----|
| 005a | dep 제거 목록 sign-off | pom patch | G0–G3 |
| 005b | record 대상 DTO | JDK 17, record | G0–G3 |
| 005c | JWT claim 계약 | jjwt 0.12 | **G4 필수** |
| 005d | v2 DTO naming | Gson→Jackson | G5 + G3 |
| 005e | XtrmJSON wire RFC | Strangler PR series | G5–G9 |
| 005f | VT scope | VT pilot | G7 + G3 |

**Skill:** [`.cursor/skills/hyobee-dependency-modernization/SKILL.md`](../.cursor/skills/hyobee-dependency-modernization/SKILL.md)

## 11. 첫 PR 권장 (Kickoff)

```text
[TB-005][Contract]  본 문서 리뷰·G0–G9 합의
[TB-005][Backend]   005a — org.json/guava/ibatis-sqlmap 제거 + Jackson BOM 정렬
[TB-005][QA]        005a merge 전 G0–G3 실행·qa-registry §9 갱신
```

브랜치: `feature/TB-005-dependency-modernization` (worktree 1티켓 1개 권장)

---

**관련:** [todo.md](./todo.md) · [package-scope.md](./package-scope.md) · [qa-registry.md](./qa-registry.md)
