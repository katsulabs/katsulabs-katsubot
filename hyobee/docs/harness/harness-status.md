# 하네스 운영 현황 (Status)

Hyobee 프로젝트에 하네스 엔지니어링이 **얼마나 적용되었는지**, **QA 게이트가 어떻게 바뀌었는지**를 한곳에서 확인하는 문서입니다.

- **기준 브랜치:** `feature/harness/main`
- **하네스 도입 커밋:** `7df7aa82` (`feat(harness): Hyobee 하네스 엔지니어링 도입 및 인증 회귀 테스트`)
- **도입 전 스냅샷:** `7df7aa82^` (parent)
- **최종 갱신:** 2026-05-30

---

## 1. 한 줄 요약

| 질문 | 답 |
|------|-----|
| 적용됐나? | **예** — playbook·rules·티켓·P0+P1 테스트 게이트가 `feature/harness/main`에서 운영 중 |
| 성숙도 | **Level 2 ~ 2.5 / 5** (Pilot · 초기 운영) |
| `main` 반영? | **아직** — harness 전용 통합 라인; `main`/`rnd/*` 승격 전 |
| Agent 구현 | **Rules 5개 + Project Skills 18개** (역할·절차 분리) |

---

## 2. 성숙도 모델

```text
L0 없음          ─  playbook·규칙 없음
L1 문서화        ─  playbook, .cursor/rules 존재
L2 Pilot 운영    ─  ★ 현재: 티켓·no-ff·P0+P1·PR 게이트
L3 제도화        ─  CI, main 승격, KPI, worktree 실사용
L4 자동화        ─  Hook handoff, PR CI 필수, 지표 대시보드
```

### L2에서 충족하는 항목

| 영역 | 상태 | 근거 |
|------|------|------|
| Playbook | ✅ | `docs/harness/*` (9+ 문서) |
| Cursor Rules | ✅ | orchestrator + Contract/BE/FE/QA |
| 티켓·DoD | ✅ | TB-001~004 이력 (`todo.md`) |
| 인증 회귀 테스트 | ✅ | P0+P1 **59** `@Test` (`package-scope.md`) |
| PR Hard Gates | ✅ | `.github/PULL_REQUEST_TEMPLATE.md` |
| no-ff merge | ✅ | TB-003/004 → `feature/harness/main` |
| Cursor Project Skills | ✅ | `.cursor/skills/` **17**개 (2026-05-29) |

### L2 → L3 갭 (미완)

| 항목 | 상태 | 비고 |
|------|------|------|
| CI mirror | ❌ | `.github/workflows` 없음 (`todo.md` 보류) |
| `main` / `rnd/*` merge | ❌ | harness 라인만 선행 |
| worktree 1티켓 1개 | △ | 문서상 원칙, 실제는 단일 clone + 브랜치 |
| Cursor Hook / Sub-agent 자동 handoff | △ | `workflow.md` fallback 런북만 |
| KPI 수집 | ❌ | PR Lead Time 등 미집계 |
| FE 수동 QA (TB-004) | △ | pre-flight PASS(§5-1); **브라우저 11항 BLOCKED** — 인증·SSE·HiCloud 필요 |

---

## 3. QA 게이트 — 도입 전 vs 후

QA “걸리는 항목”은 **(A) 프로세스·체크리스트**와 **(B) 자동화 `@Test`**로 나눕니다.

> **PASS/FAIL 실행 비교 (3-way):** [qa-registry.md §10](./qa-registry.md#10-하네스-전후-비교-분석-2026-05-29) — `1eb7168a` / `7df7aa82` / `feature/harness/main` 각각 `mvn test` 재현 결과.

### 3-A. 프로세스·문서 게이트

| 구분 | 도입 전 (`7df7aa82^`) | 도입 직후 (`7df7aa82`) | 현재 |
|------|----------------------|------------------------|------|
| `qa.mdc` | 없음 | 1 | 1 |
| QA 우선순위 규칙 | 0 | 3 | 3 |
| QA 회귀 테스트 클래스 표 | 0 | 9 | **11** |
| `qa.mdc` PR 체크리스트 | 0 | 3 | 3 |
| PR Test Plan | 0 | 3 | 3 |
| PR Harness Hard Gates | 0 | 5 | 5 |
| **합계 (PR + qa.mdc)** | **0** | **23** | **25** |

**현재 +2:** `HyobeePagePathsTest`(P1), `HyobeeJwtTokenServiceImplTest`(P2 표 등재) — TB-003 이후.

**별도 정의 (qa.mdc 미포함):** TB-004 Frontend 수동 회귀 **11시나리오** → [TB-004-aichat010-modularization.md](./TB-004-aichat010-modularization.md) §QA.

### 3-B. 자동화 테스트 (`@Test`)

| 구분 | 도입 전 | 도입 직후 (P0+P1) | 현재 (P0+P1) |
|------|---------|-------------------|--------------|
| **공식 게이트 클래스 수** | 없음 (비체계) | 7 | **8** |
| **P0+P1 `@Test` 건수** | — | **56** | **59** |

#### 도입 전 — 인증·로그인 관련 (게이트 미정의)

아래 **6클래스 / 36 `@Test`** 는 존재했으나, 우선순위·일괄 실행·PR 필수 규칙이 없었다.

| 클래스 | `@Test` |
|--------|---------|
| `LoginServiceImplTest` | 7 |
| `HyobeeSSOServiceImplTest` | 4 |
| `HyobeeSSOControllerTest` | 5 |
| `AichatJwtTokenServiceImplTest` | 6 |
| `AichatAuthControllerTest` | 7 |
| `LoginControllerTest` | 7 |
| **합계** | **36** |

#### 도입 후 — P0+P1 공식 게이트

상세 클래스·건수·실행 명령: **[package-scope.md § 인증 회귀 테스트](./package-scope.md)**  
에이전트별 우선순위 표: **[`.cursor/rules/qa.mdc`](../../.cursor/rules/qa.mdc)**

| 변화 | 내용 |
|------|------|
| **신규 4클래스** | `HyobeeApiInterceptorTest`, `ApiServiceImplTest`, `XtrmHandlerInterceptorAuthTest`, `AuthPagePreloadTest` (+28 `@Test`) |
| **기존 3클래스 확장** | `LoginServiceImplTest`, `HyobeeSSOServiceImplTest`, `HyobeeSSOControllerTest` (+12 `@Test`) |
| **TB-003 추가** | `HyobeePagePathsTest` (+3 `@Test`) |

#### P2 (표에 있으나 P0+P1 게이트 밖)

`LoginControllerTest`, `HyobeeAuthControllerTest`, `HyobeeJwtTokenServiceImplTest` — **보류** (`todo.md` P2).

---

## 4. Agent 모델 — Rules vs Skills

하네스 Agent는 **Rules(역할·스코프·게이트)** + **Project Skills(절차·실행 HOW)** 로 구성한다.

| | Hyobee Rules | Hyobee Project Skills |
|--|--------------|----------------------|
| 위치 | `.cursor/rules/*.mdc` | `.cursor/skills/*/SKILL.md` |
| 개수 | **5** | **17** |
| 활성화 | `alwaysApply` 또는 `globs` | description 맥락 매칭 |
| 역할 | **WHO / WHERE / WHAT 금지** | **HOW** — mvn 명령, QA 체크리스트, handoff, CI |

### Rule ↔ Agent 매핑

| Rule | Agent | alwaysApply |
|------|-------|-------------|
| `orchestrator.mdc` | Main | ✅ |
| `contract.mdc` | Contract | globs |
| `backend.mdc` | Backend | globs |
| `frontend.mdc` | Frontend | globs |
| `qa.mdc` | QA | globs |

분배 태그: `[TB-xxx][Contract|Backend|Frontend|QA]` — [agent-hierarchy.md](./agent-hierarchy.md)

### Project Skills 목록 (17)

| Skill | 용도 |
|-------|------|
| `hyobee-ticket-kickoff` | 티켓·브랜치·Sub-agent 분배 |
| `hyobee-subagent-handoff` | Contract→BE→FE→QA handoff |
| `hyobee-auth-contract-update` | auth-flow·package-scope 계약 동기화 |
| `hyobee-auth-regression` | P0+P1 59건 mvn test 게이트 |
| `hyobee-backend-auth-test` | auth 단위/MockMvc 테스트 작성 |
| `hyobee-aichat-manual-qa` | TB-004 브라우저 회귀 11항 |
| `hyobee-iife-extract` | v2 JS IIFE 모듈 분리 |
| `hyobee-aichat-phase2-state` | TB-004b state/SSE 분해 |
| `hyobee-jsp-canonical` | login.jsp / main.jsp canonical |
| `hyobee-legacy-cleanup` | dead code 제거 (TB-002형) |
| `hyobee-pr-harness-gate` | PR Hard Gates 검증 |
| `hyobee-ci-auth-workflow` | GitHub Actions CI 스켈레톤 |
| `hyobee-worktree-ticket` | 티켓당 git worktree |
| `hyobee-harness-promote` | harness → main no-ff 승격 |
| `hyobee-harness-status-refresh` | 본 문서·qa-registry 갱신 |
| `hyobee-kpi-weekly` | 주간 KPI 수집 |
| `hyobee-secrets-prep` | Secrets 관리 체크리스트 |

---

## 5. 티켓별 하네스 준수도

| 티켓 | 상태 | 하네스 관점 |
|------|------|-------------|
| TB-001 | DONE | P0+P1 인증 테스트 + `package-scope` — 도입 목표 |
| TB-002 | DONE | dead code 정리, harness 라인 포함 |
| TB-003 | DONE | TDD(`HyobeePagePathsTest`), auth 문서·테스트 동기화, no-ff |
| TB-004 | IN PROGRESS | Phase 1a + pre-flight PASS; **브라우저 11항 BLOCKED** ([qa-registry §5](./qa-registry.md#5-tb-004-수동-frontend-qa)) |
| TB-005 | IN PROGRESS | 005a–f **feature/harness/main 승격** (2026-05-30); P0+P1 59/59 JDK 21; G7/G8 수동 pending |

---

## 6. 문서 맵 (Single source of truth)

| 알고 싶은 것 | 읽을 문서 |
|-------------|-----------|
| **QA 항목별 PASS/FAIL/PENDING** | **[qa-registry.md](./qa-registry.md)** |
| 지금 하네스가 어디까지 왔는지 | [harness-status.md](./harness-status.md) |
| 티켓·DoD·보류 | [todo.md](./todo.md) |
| 테스트 클래스·59건·mvn 명령 | [package-scope.md](./package-scope.md) |
| QA 우선순위·P0/P1/P2 표 | [qa.mdc](../../.cursor/rules/qa.mdc) |
| PR 체크리스트 | [PULL_REQUEST_TEMPLATE.md](../../.github/PULL_REQUEST_TEMPLATE.md) |
| 로그인/SSO 실행 흐름 | [auth-flow-analysis.md](./auth-flow-analysis.md) |
| 브랜치·worktree·no-ff | [workflow.md](./workflow.md) |
| 역할·병렬 정책 | [agent-hierarchy.md](./agent-hierarchy.md) |
| FE JS 모듈화·수동 QA | [TB-004-aichat010-modularization.md](./TB-004-aichat010-modularization.md) |
| Project Skills 목록 | [§4](./harness-status.md#4-agent-모델--rules-vs-skills) · `.cursor/skills/` |

---

## 7. L3 로드맵 (권장 순서)

1. `feature/harness/main` → 팀 합의 후 `main` 또는 `rnd/server/main` **no-ff merge**
2. GitHub Actions: P0+P1 subset `mvn test` CI
3. TB-004 수동 QA 11항 완료 → `todo.md` TB-004 DONE
4. (선택) 티켓당 `git worktree add` pilot
5. 주간 KPI 1페이지 (PR lead time, test red count) — [workflow.md § KPI](./workflow.md)

---

## 8. 갱신 방법

다음 이벤트 시 **이 문서 §1·§3·§5** 를 갱신한다.

- P0+P1 테스트 클래스/건수 변경
- `qa.mdc` 또는 PR 템플릿 체크리스트 변경
- harness → `main` merge
- CI 도입
- TB 완료/신규 티켓으로 성숙도 단계 이동

`@Test` 건수 재집계 (PowerShell, repo root):

```powershell
cd hyobee
$classes = @(
  'HyobeeSSOServiceImplTest','HyobeeSSOControllerTest','LoginServiceImplTest',
  'HyobeeApiInterceptorTest','ApiServiceImplTest','XtrmHandlerInterceptorAuthTest',
  'AuthPagePreloadTest','HyobeePagePathsTest'
)
$sum = 0
foreach ($c in $classes) {
  $n = (Select-String -Path "src/test/java/**/$c.java" -Pattern '@Test' | Measure-Object).Count
  Write-Output "$c : $n"
  $sum += $n
}
Write-Output "P0+P1 total: $sum"
```
