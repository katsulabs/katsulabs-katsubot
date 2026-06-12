---
name: hyobee-harness-promote
description: Hyobee harness 통합 브랜치를 main 또는 rnd/*로 no-ff 머지 및 머지 후 문서 갱신. feature/harness/main 승격, 하네스 L3, 팀 합의 rollout 시 사용.
---

# Hyobee Harness 승격 (→ main)

## 사전 조건

- 대상 브랜치 팀 합의 (`main` 또는 `rnd/server/main`)
- 통합 브랜치 P0+P1 게이트 green (`hyobee-auth-regression`)
- `todo.md`에 진행 중 티켓 문서화 (알려진 갭 명시 시 IN PROGRESS 허용)
- PR 리뷰 + 하네스 Hard Gates 통과 (`hyobee-pr-harness-gate`)

## 머지 절차

```powershell
git checkout main
git pull origin main
git merge --no-ff feature/harness/main -m "merge(harness): promote Hyobee harness engineering to main"
git push origin main
```

`main`이 아니면 합의된 대상 브랜치명 사용.

## 머지 후 갱신 (동일 PR 또는 후속)

1. `docs/harness/harness-status.md`
   - §1: `main` 반영 → **예**
   - §2: 성숙도 L2 → **L3** (CI + 머지 완료 시)
   - §5: 티켓 상태
2. `docs/harness/todo.md` — 승격일 기록
3. 팀 공지: 브랜치 전략, PR 게이트, auth 기준선 문서 위치

## 롤백 계획

- 치명적 auth 회귀 시 대상 브랜치 merge commit revert
- revert PR에서 P0+P1 전체 재실행

## 금지

- `main` force-push
- no-ff 생략 (harness 통합 이력 보존)

## 참고

- `docs/harness/harness-status.md` §7 항목 1
- `docs/harness/workflow.md` (no-ff 원칙)
