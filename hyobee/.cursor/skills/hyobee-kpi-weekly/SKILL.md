---
name: hyobee-kpi-weekly
description: Hyobee 하네스 주간 KPI 수집(PR lead time, CI red rate, reopen rate, handoff failure, auth 회귀). L4 지표, 주간 현황 보고, workflow KPI 리뷰 시 사용.
---

# Hyobee Harness KPI (주간)

## 지표 (`workflow.md` §KPI)

| KPI | 정의 | 출처 |
|-----|------|------|
| PR Lead Time | Open → merge 소요 | GitHub PR 타임스탬프 |
| CI Red Rate | 실패 CI / 전체 CI | GitHub Actions (가동 시) |
| Reopen Rate | Reopen PR / Merged PR | GitHub PR 이벤트 |
| Handoff Failure | fallback 또는 재분배 필요 티켓 | PR 메모, 팀 로그 |
| Auth regression issues | 머지 후 auth 버그 | auth/harness 라벨 이슈 |

## 주간 수집 (수동 L3)

```powershell
# 예: 최근 merged PR (gh CLI 필요)
gh pr list --state merged --limit 20 --json number,title,createdAt,mergedAt,headRefName
```

Lead time: `feature/TB-*` 브랜치 PR마다 `mergedAt - createdAt` 계산.

## 1페이지 보고 템플릿

```markdown
# Hyobee Harness KPI — Week of YYYY-MM-DD

| KPI | 이번 주 | 지난 주 | 비고 |
|-----|---------|---------|------|
| PR Lead Time (median) | | | |
| CI Red Rate | CI 없으면 N/A | | |
| Reopen Rate | | | |
| Handoff Failures | | | |
| Auth regressions | | | |

## Highlights
- 완료 티켓: TB-xxx
- 게이트: P0+P1 {pass/fail} (qa-registry.md)
- Blocker: {CI, TB-004 수동 QA 등}
```

## 악화 시 조치

- CI red ↑ → `hyobee-ci-auth-workflow` 수정 우선
- Handoff failure ↑ → `hyobee-subagent-handoff` + Contract 메모 점검
- Auth regression ↑ → 머지 전 Contract 리뷰 필수

## 참고

- `docs/harness/workflow.md` §운영 지표
- `docs/harness/harness-status.md` §7 항목 5
