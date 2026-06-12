---
name: hyobee-worktree-ticket
description: Hyobee 하네스 티켓용 git worktree 생성(TB-xxx당 1 worktree). 병렬 티켓, worktree pilot, feature/TB-{id} 브랜치 격리 시 사용.
---

# Hyobee 티켓당 Worktree

## 정책

- 병렬 작업 시 활성 티켓당 worktree 1개
- 브랜치: `feature/TB-{id}-{short-name}`
- 경로 비중첩 + Contract 고정 시에만 병렬 (`agent-hierarchy.md`)

## worktree 생성

repo root 기준 (clone 경로에 맞게 조정):

```powershell
# 예: TB-004 frontend 모듈화
git fetch origin
git worktree add ../hyobee-TB-004 feature/TB-004-aichat010-modularize
cd ../hyobee-TB-004/hyobee
```

브랜치가 없을 때:

```powershell
git worktree add -b feature/TB-004-aichat010-modularize ../hyobee-TB-004 origin/feature/harness/main
```

## 격리 확인

```powershell
git worktree list
git branch --show-current
```

각 worktree는 **서로 다른** 브랜치여야 한다.

## 병렬 분배 전

- [ ] Contract handoff 완료 (auth/API 스키마 관련 시)
- [ ] 경로 매트릭스: Backend `src/main/java/**` vs Frontend `static/**`/`webapp/**`
- [ ] 두 에이전트가 동일 파일 수정 없음

## 머지 후 정리

```powershell
git worktree remove ../hyobee-TB-004
git branch -d feature/TB-004-aichat010-modularize
git worktree prune
```

## Fallback

worktree 불가 시 단일 clone + 브랜치 전환 허용 (현재 L2). 병렬 요청했으나 직렬 fallback이면 PR에 기록 (`workflow.md` Hook fallback).

## 참고

- `docs/harness/workflow.md`
- `docs/harness/agent-hierarchy.md` §병렬 정책
