---
name: hyobee-ticket-kickoff
description: Hyobee 하네스 티켓 킥오프 — todo.md DoD 확인, feature/TB-{id} 브랜치, Contract/Backend/Frontend/QA Sub-agent 태그 분배. 구현 요청 첫 턴 또는 TB-xxx 티켓 시작 시 사용.
---

# Hyobee 티켓 킥오프

## 첫 턴 체크리스트

1. `docs/harness/todo.md` — 티켓, 담당, DoD, 미완 항목 확인
2. 링크된 티켓 문서 읽기 (예: `TB-004-aichat010-modularization.md`)
3. 브랜치 확인: `feature/TB-{id}-{short-name}` (`main`에 기능 커밋 금지)
4. worktree/브랜치 존재 확인, 없으면 생성
5. 태그로 분배: `[TB-xxx][Contract|Backend|Frontend|QA]`

## 분배 규칙

| 변경 유형 | 첫 에이전트 |
|-----------|-------------|
| 인증/SSO/세션 계약 | **Contract** |
| 인증 구현 | **Backend** (경계 변경 시 Contract 선행) |
| JSP/정적/JS UX | **Frontend** |
| 회귀 + PR 게이트 | **QA** |

인증/SSO 영향 → Frontend **전에** Contract 또는 Backend.

## 병렬 작업 (전제 조건)

- 티켓당 서로 다른 worktree/브랜치
- 경로 비중첩 (`agent-hierarchy.md`)
- Backend+Frontend 병렬 전 Contract에서 DTO/스키마 고정

## 킥오프 출력

```markdown
## [TB-xxx] Kickoff
- 티켓: TB-xxx — {제목}
- 브랜치: feature/TB-xxx-{name}
- DoD 미완: {todo.md 목록}
- 분배: [TB-xxx][{Agent}]
- 스코프: package-scope.md § {섹션}
- 인증 영향: yes/no → yes면 auth-flow-analysis.md
```

## 참고

- `.cursor/rules/orchestrator.mdc`
- `docs/harness/agent-hierarchy.md`
- `docs/harness/workflow.md`
