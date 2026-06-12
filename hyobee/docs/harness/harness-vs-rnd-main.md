# feature/harness/main vs rnd/main 차이 분석

> **작성 기준:** 2026-06-10  
> **비교 대상:** `feature/harness/main` (`77d75212`) ← `rnd/main` (`0cd72f11`) merge 완료 후  
> **분석 방법:** `git merge-base`, `git log`, `git diff --stat`

---

## 1. 요약

| 항목 | rnd/main | feature/harness/main |
|------|----------|----------------------|
| **HEAD** | `0cd72f11` | `77d75212` (merge commit 포함) |
| **관계** | 기준 브랜치 | `rnd/main`의 **후손(descendant)** — rnd 커밋 전부 포함 |
| **rnd에만 있는 커밋** | — | **0건** (merge 후 rnd 기능 누락 없음) |
| **harness에만 있는 커밋** | — | **89건** (하네스·TB 티켓·리팩터링) |
| **파일 diff 규모** | — | 212 files, +10,961 / −9,766 lines |

**한 줄 정리:** `feature/harness/main`은 `rnd/main` 위에 **하네스 엔지니어링 체계**, **Hyobee 리네이밍/구조 정리**, **TB-005 의존성·JDK 현대화**가 얹힌 브랜치이다. RND 비즈니스 기능(다중 권한, 저널 설정, SSO 보강 등)은 merge commit `77d75212`로 통합되었고, **RND 전용 UI·서비스 파일(`footer.jsp`, `ChatUserServiceImpl` 등)은 양 브랜치 간 diff가 없다.**

---

## 2. 브랜치 관계

```
rnd/main (0cd72f11)
    │
    ├── [harness-only: TB-002~006, docs, auth gate, …]  (89 commits)
    │
    └── Merge branch 'rnd/main' into feature/harness/main (77d75212)
            ↑
    feature/harness/main (현재)
```

- **공통 조상(merge-base):** `0cd72f11` = 현재 `rnd/main` HEAD  
  → harness는 rnd의 **fast-forward 후손**에 가깝고, rnd 쪽 미반영 커밋은 없다.
- **merge 시 수동 해결한 충돌 (5건):**
  - `HyobeeChatApiClient` — 204 No Content 성공 처리 (rnd) + harness 클래스명 유지
  - `HyobeeThumbnailService` — 개선된 스케일링·로깅 (rnd) + harness 리네이밍 유지
  - `WrtnChatVendorClient` — SSE chunk 파싱 debug 로그 (rnd)
  - `sidebar.jsp` — 추천 저널/언어 드롭다운 UI (rnd)
  - `AichatFileServiceImpl` — harness에서 삭제 (`ChatFileServiceImpl`로 대체)

---

## 3. rnd/main 대비 harness **추가·변경** 영역

### 3.1 빌드·런타임 (TB-005)

| 항목 | rnd/main | feature/harness/main |
|------|----------|----------------------|
| **JDK** | 11 | **21** |
| **JSON** | `XtrmJSON` + Gson | **`XtrmJsonNode`** (Jackson), Gson·`org.json` 제거 |
| **JWT** | jjwt 구버전 | **jjwt 0.12.x** |
| **HTTP 클라이언트** | RestTemplate/WebClient 혼재 | **풀링 RestTemplate + 공유 WebClient** (`HyobeeHttpClientConfig`, virtual thread pilot) |
| **제거된 의존성** | gson, guava, ibatis-sqlmap, org.json 등 | pom에서 제거 |

영향 범위: `xs/core/api`, `xs/domain`, `xs/vob`, `xs/webbase/login`, Excel/View 레이어 전반.

### 3.2 패키지·클래스 구조 (TB-002, TB-003)

| rnd/main | feature/harness/main | 비고 |
|----------|----------------------|------|
| `Aichat*` 접두사 | **`Hyobee*`** | Controller, Service, JWT, SSO |
| `XtrmAichatInterface` | **`HyobeeChatApiClient`** | WRTN API 클라이언트 |
| `AichatThumbnailService` | **`HyobeeThumbnailService`** | 썸네일 |
| `AichatFileServiceImpl` | **`ChatFileServiceImpl`** (v2) | legacy v1 파일 서비스 삭제 |
| `AichatController`, `AichatServiceImpl` | **삭제** | v1 API 제거, v2만 유지 |
| `xs/aichat/vendor/*` | **삭제** | `v2/external/WrtnChatVendorClient`로 통합 |
| `RequestData` + ArgumentResolver | **삭제** | typed DTO + `@LoggedInUser` |
| `ConversationParamStore` | **삭제** | |
| `SSOAuthServiceImpl` | **삭제** | Hyobee SSO 경로로 통합 |
| `XtrmServletFilter`, `XtrmTokenInterceptor` | **삭제** | 인증 체인 단순화 |

### 3.3 화면·정적 리소스

| rnd/main | feature/harness/main |
|----------|----------------------|
| `login010.jsp` (본문) | **`login.jsp`** canonical + `login010.jsp` stub/축소 |
| `aichat010.jsp` 직접 진입 | **`main.jsp`** canonical + legacy redirect |
| `aichat011~015.jsp` (루트) | **`prototype/`** 하위로 이동 |
| `aichat020.*` (관리) | **`admin/admin010.*`** |
| `v2/aichat010.js` (단일 대형 파일) | **IIFE 모듈 분리** (`hyobee-api.js`, `hyobee-constants.js`, `hyobee-i18n.js`) + v2 JS 축소 |
| `vob/aisearch/img/*` | **`aichat/img/*`** 로 이동 |
| `test1.jsp` | **삭제** |

**변경 없음 (merge 후 rnd와 동일):** `v2/footer.jsp`, `v2/sidebar.jsp`, `v2/aichat010.js`의 RND 기능(다중 권한·저널·체크박스 등) 본문.

### 3.4 인증·세션

- **`HyobeePagePaths`**: `LOGIN_PAGE_URL` / `MAIN_PAGE_URL` config 기반 redirect 단일화
- **인증 게이트:** `HyobeeApiInterceptor`, `XtrmHandlerInterceptor` 정비, 회귀 테스트 추가
- **DTO:** `JwtClaims`, `VobLoginResult` record/타입 정리 (TB-005b/c)

자세한 흐름: [auth-flow-analysis.md](./auth-flow-analysis.md)

### 3.5 테스트

harness에 **추가**된 대표 테스트 (rnd/main에 없음):

| 테스트 | 검증 대상 |
|--------|-----------|
| `HyobeePagePathsTest` | canonical JSP 경로 |
| `AuthPagePreloadTest` | JSP 게이트 |
| `HyobeeApiInterceptorTest` | `/xs/aichat/**` JWT |
| `ApiServiceImplTest` | 세션 키 계약 |
| `XtrmHandlerInterceptorAuthTest` | 레거시 API 권한 |
| `XtrmJsonNodeTest` | JSON 레코드 마이그레이션 |
| `JwtClaimsTest` | JWT 클레임 |

RND merge로 **함께 포함**된 테스트: `ChatUserServiceViewableTeamTest`, `ChatServiceImplViewableTeamTest`, `LoginLandingControllerTest`, `AichatThumbnailServiceTest` 등.

### 3.6 하네스 운영 체계 (rnd에 없음)

| 경로 | 내용 |
|------|------|
| `docs/harness/**` | 워크플로, QA registry, TB 티켓, auth baseline |
| `.cursor/rules/*.mdc` | Backend/Frontend/Contract/QA/Orchestrator 역할 규칙 |
| `.cursor/skills/**` | 18개 Agent Skill (kickoff, promote, auth regression 등) |
| `AGENTS.md` | Cloud/Agent 진입 가이드 |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 템플릿 |

---

## 4. rnd/main 기능 — harness **보존** 목록

merge 이후 아래 RND 기능은 harness에 **동일하게 존재**한다 (`git diff rnd/main feature/harness/main` 해당 경로 diff 없음 또는 merge 반영 완료).

| 영역 | 대표 파일/기능 |
|------|----------------|
| **다중 권한** | `ChatUserServiceImpl`, `UserMapper.xml`, viewable team API |
| **대화 enrichment** | `ConversationItem.targetDeptCode`, SSE/JWT team 동기화 |
| **저널·RND API** | `HyobeeRndController`, `DocumentLinkBuilder`, hope2 internal 링크 |
| **로그인 landing** | `LoginLandingController` (SSO 프로필·팀명 보강) |
| **UI** | footer 도움말, sidebar 설정 드롭다운, `aichat010.css` RND 스타일 |
| **버그픽스** | API 204 처리, SSE chunk 파싱, 썸네일 실패 graceful, 체크박스 삭제 버튼 |

---

## 5. 영역별 diff 통계 (harness − rnd)

### 5.1 Java (핵심)

| 패키지/영역 | harness 쪽 변화 요약 |
|-------------|---------------------|
| `xs/core/parameter` | `XtrmJSON` 삭제 → `XtrmJsonNode` (+966 lines) |
| `xs/vob/management` | `ManagementServiceImpl` XtrmJsonNode 마이그레이션 |
| `xs/core/api` | `ApiServiceImpl` Jackson 기반 재작성 |
| `xs/aichat` (legacy) | v1 Controller/Service 대량 삭제, Hyobee rename |
| `xs/aichat/v2` | vendor 통합, Gson annotation 정리, rnd 로직 + harness 구조 |

### 5.2 UI

```
31 files (webapp + static/aichat): +707 / −496 lines
```

- 대부분 **경로 재배치·모듈 분리·canonical JSP** 에 해당
- RND가 추가한 채팅 UX 본문은 유지

---

## 6. 배포·운영 시 차이점

| 체크 | rnd/main | feature/harness/main |
|------|----------|----------------------|
| JDK | 11 | **21 필수** |
| Gson/XtrmJSON API | 사용 | **사용 불가** — `XtrmJsonNode`로 전환됨 |
| v1 Aichat API | 일부 legacy 존재 | **제거** — v2·Hyobee API만 |
| 로그인 URL | `login010.jsp` 중심 | **`login.jsp`** (config: `LOGIN_PAGE_URL`) |
| 메인 채팅 URL | `aichat010.jsp` / v2 혼재 | **`main.jsp`** → v2 |
| 관리 화면 | `aichat020` | **`admin/admin010`** |
| CI/PR 게이트 | 없음 | **`mvn test` P0+P1** 권장 ([qa-registry.md](./qa-registry.md)) |

---

## 7. 향후 작업 (harness 로드맵과의 관계)

| 티켓 | 상태 | rnd/main과의 추가 갭 |
|------|------|----------------------|
| TB-004 | 진행/부분 | aichat010.js 추가 모듈화 |
| TB-005 | 대부분 완료 | JDK 21·Gson 제거·jjwt 0.12 — **rnd에 없음** |
| TB-006 | 계획 | XtrmJsonNode → Java record 2차 마이그레이션 |

---

## 8. 검증 권장 명령

```powershell
# 브랜치 관계 확인
git merge-base rnd/main feature/harness/main
git log --oneline rnd/main..feature/harness/main | Measure-Object -Line

# RND 기능 회귀 (merge에서 추가된 테스트)
mvn test -f hyobee/pom.xml "-Dtest=ChatUserServiceViewableTeamTest,ChatServiceImplViewableTeamTest,LoginLandingControllerTest"

# Harness 인증 게이트
mvn test -f hyobee/pom.xml "-Dtest=HyobeePagePathsTest,AuthPagePreloadTest,HyobeeSSOControllerTest,HyobeeApiInterceptorTest"
```

---

## 9. 관련 문서

- [reference-baseline.md](./reference-baseline.md) — harness 운영 기준
- [auth-flow-analysis.md](./auth-flow-analysis.md) — 인증 흐름
- [TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) — JDK/Gson/JWT 상세
- [rnd-multiple-authorities.md](../rnd-multiple-authorities.md) — RND 다중 권한 (양 브랜치 공통)

---

## 부록: harness-only 커밋 테마 (89건 요약)

| 테마 | 대표 커밋/티켓 |
|------|----------------|
| TB-005 의존성·JDK | `495584ee`~`eee56546`, Gson 제거, VT·HTTP pool |
| TB-004 JS 모듈화 | `cac24ec7`, `105d79da` |
| TB-003 Hyobee naming | `cac24ec7` |
| TB-002 legacy cleanup | `aefe9243` |
| Harness auth gate | `c2feadb0` |
| TB-006 계획 문서 | `513695af`, `6817c6f3` |
| docs/README | `72dae5d5`, `d4f09b24` |

전체 목록: `git log --oneline rnd/main..feature/harness/main`
