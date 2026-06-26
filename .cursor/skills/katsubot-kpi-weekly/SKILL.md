---
name: katsubot-kpi-weekly
description: Katsubot 하네스 주간 KPI — PR lead time, CI red rate, reopen, handoff failure. 주간 리뷰 시 사용.
---

# Katsubot Harness KPI (주간)

## 지표

| KPI | 정의 |
|-----|------|
| PR Lead Time | `feature/KC-*` PR `mergedAt - createdAt` |
| CI Red Rate | 실패 run / 전체 run |
| Reopen Rate | reopen PR / merged PR |
| Handoff Failure | fallback 또는 재분배 티켓 수 |

## 리포트 템플릿

```markdown
# Katsubot Harness KPI — Week of YYYY-MM-DD

## Summary
- Merged PRs: N
- Avg lead time: Xh
- CI red rate: Y%

## Completed
- KC-007-modernization Phase 0 …

## Blockers
- …
```

## 액션

- CI red ↑ → `katsubot-ci-workflow` 우선
- Handoff ↑ → Contract handoff 메모·OpenAPI 선행 점검

## 참고

- `docs/harness/workflow.md` §KPI
