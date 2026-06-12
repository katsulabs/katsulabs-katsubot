# 하네스 엔지니어링

프로젝트의 Agent 협업 규칙과 운영 문서 모음입니다.

| 문서 | 내용 |
|------|------|
| **[qa-registry.md](./qa-registry.md)** | **QA 항목 전체·PASS/FAIL/PENDING·최종 실행 이력** |
| **[harness-status.md](./harness-status.md)** | 운영 현황·성숙도·QA Before/After·Rules vs Skills |
| [agent-hierarchy.md](./agent-hierarchy.md) | 역할 분리, 분배, 병렬 기준 |
| [workflow.md](./workflow.md) | worktree, PR, CI/CD, 예외 흐름 |
| [reference-baseline.md](./reference-baseline.md) | 기본값 레퍼런스 |
| [package-scope.md](./package-scope.md) | 에이전트별 패키지/경로 스코프 |
| [auth-flow-analysis.md](./auth-flow-analysis.md) | 로그인/SSO/권한 실행 흐름 기준선 |
| [getting-started.md](./getting-started.md) | 새 프로젝트 적용 5분 가이드 |
| [todo.md](./todo.md) | 티켓/DoD/보류 항목 |
| [TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) | dep·JDK·Gson→Jackson·VT·QA 게이트 |
| **[harness-vs-rnd-main.md](./harness-vs-rnd-main.md)** | **feature/harness/main ↔ rnd/main 차이 분석 (merge 후)** |

## Cursor Rules & Skills

- **Rules:** `.cursor/rules/*.mdc` — 역할·스코프·게이트
- **Skills:** `.cursor/skills/*/SKILL.md` — 절차·실행 HOW (18개)
- Rules vs Skills 상세: [harness-status.md §4](./harness-status.md#4-agent-모델--rules-vs-skills)
