---
name: katsubot-ticket-kickoff
description: Katsubot 티켓 킥오프 — KC-000·todo.md·Epic DoD 확인, feature/KC-{id}-{feature} 브랜치, 4역할 Sub-agent 태그 분배. 구현 요청 첫 턴 시 사용.
---

# Katsubot 티켓 킥오프

## 첫 턴 체크리스트

1. `docs/01-project-conventions.md`
2. `docs/harness/todo.md` — 티켓, DoD
3. Epic 문서: `docs/02-modernization-plan.md`
4. 브랜치: `feature/KC-{id}-{feature}` (`main` 기능 커밋 금지)
5. 태그 분배: `[KC-xxx][Contract|Backend|Frontend|QA]`

## Kickoff 메모 템플릿

```markdown
## [KC-xxx-feature] Kickoff
- 티켓: KC-007-modernization — {Phase/제목}
- 브랜치: feature/KC-007-modernization-{name}
- DoD: todo.md + work-plan §
- 분배: [KC-007-modernization][Contract]
```

## 병렬 착수 조건

- 티켓당 별도 worktree
- `services/katsubot-api/**` vs `apps/katsubot-web/**` 비중첩
- OpenAPI Contract 선행

## 참고

- `docs/harness/agent-hierarchy.md`
- `katsubot-worktree-ticket` skill
