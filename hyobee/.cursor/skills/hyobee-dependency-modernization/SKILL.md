---
name: hyobee-dependency-modernization
description: Hyobee TB-005 의존성·JDK·Gson→Jackson·record·virtual thread·CLOSE_WAIT·QA 게이트. pom 버전업, Third-party 제거, Tomcat 9.x 제약 하 XtrmJSON Strangler. dependency upgrade, Gson removal, JDK 17/21, record, virtual threads, CLOSE_WAIT 시 사용.
---

# Hyobee TB-005 — 의존성 현대화

## 언제 사용

- `pom.xml` 의존성 버전업·미사용 dep 제거
- Gson → Jackson, **`XtrmJSON.java` 제거 (0순위 Epic)**
- JDK 11→17/21, record, Virtual thread pilot
- CLOSE_WAIT / HTTP client leak 대응
- TB-005 QA G0–G9 실행·증적

## 제약 (Hard)

- **외장 Tomcat 9.x** — WAR, `javax.servlet`, SB **2.7.x** 유지
- Spring Boot **3.x / Jakarta / Tomcat 10+** 금지
- Phase마다 **P0+P1 59건** 회귀 ([package-scope.md](../../docs/harness/package-scope.md))

## 첫 턴

1. `docs/harness/TB-005-dependency-modernization.md` — Phase·DoD
2. `docs/harness/todo.md` — TB-005 체크리스트
3. 브랜치: `feature/TB-005-dependency-modernization`
4. 태그: `[TB-005][Contract|Backend|QA]`

## Phase 순서 (역순 금지)

```text
005a patch + unused dep  →  005b JDK17+record  →  005c jjwt  →  005d v2 Gson
                                                              →  005e XtrmJSON Epic
                                                              →  005f JDK21+VT (선택)
```

| Phase | 핵심 산출 |
|-------|-----------|
| **005a** | `org.json`, `guava`, `ibatis-sqlmap` pom 제거; Jackson BOM 정렬 |
| **005b** | `java.version=17`; `JwtClaims` record pilot |
| **005c** | jjwt 0.12; `HyobeeJwtTokenServiceImpl` API 변경 |
| **005d** | `xs/aichat/v2/**` Gson 0건 |
| **005e** | `XtrmJSON` → Jackson Strangler; gson pom 제거 |
| **005f** | VT executor pilot; CLOSE_WAIT G7 |

## XtrmJSON Strangler (005e)

**0순위 제거:** `src/main/java/xs/core/parameter/XtrmJSON.java`

**서브 PR:** [TB-005-005e-subprs.md](../../docs/harness/TB-005-005e-subprs.md) — 005e-1 `XtrmJsonNode` → … → 005e-9 삭제·G9.

1. Wire format `{HEADER, DATA[]}` **변경 금지**
2. `XtrmJsonNode` (Jackson) 동형 API 신규
3. 마이그레이션: domain → core/api → login/SSO → excel/view
4. `GsonHttpMessageConverter`, `@Autowired Gson`, `getBean("gson")` 제거
5. G9: `rg 'com.google.gson' src/` → 0건

## CLOSE_WAIT (우선 수정)

| 클래스 | 조치 |
|--------|------|
| `WrtnChatVendorClient` | shared `WebClient` `@Bean`, ConnectionProvider eviction |
| `HyobeeChatApiClient` | pooling `CloseableHttpClient` + `@PreDestroy` |
| `XtrmRestComponent` | stale check / idle evictor |

검증: `ss -tan state close-wait | wc -l` — SSE 부하 전후 (G7)

## QA 명령

```bash
# G0
mvn -q -DskipTests compile

# G1
mvn test -DfailIfNoTests=false

# G3 P0+P1 (59)
mvn test "-Dtest=HyobeePagePathsTest,AuthPagePreloadTest,HyobeeSSOControllerTest,HyobeeSSOServiceImplTest,LoginServiceImplTest,HyobeeApiInterceptorTest,ApiServiceImplTest,XtrmHandlerInterceptorAuthTest"

# G5 (005d)
rg 'import com.google.gson' src/main/java/xs/aichat/v2

# G9 (005e 완료)
rg 'com.google.gson' src/
```

## Virtual thread (005f)

- SB 2.7 — `spring.threads.virtual.enabled` **없음**
- `Executors.newVirtualThreadPerTaskExecutor()` 명시적 `@Bean`
- 후보: `HyobeeChatApiClient`, `XtrmRestComponent`, `taskExecutor`
- 비권장: SSE/Reactor, POI CPU-bound

## record pilot (005b)

- `JwtClaims`, `VobLoginResult`, v2 immutable DTO
- JPA entity / mutable MyBatis DTO 제외

## Handoff 체크

- [ ] Phase ID in PR title
- [ ] G0–G3 (005c+: G4) PASS 첨부
- [ ] 인증 영향 → `auth-flow-analysis.md`
- [ ] 005e → Contract wire format sign-off

## 참고

- [TB-005-dependency-modernization.md](../../docs/harness/TB-005-dependency-modernization.md)
- [hyobee-auth-regression](../hyobee-auth-regression/SKILL.md)
- [hyobee-pr-harness-gate](../hyobee-pr-harness-gate/SKILL.md)
