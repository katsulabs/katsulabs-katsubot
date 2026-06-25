---
name: katsubot-worktree-ticket
description: Katsulabs Chatbot 티켓용 git worktree 생성(KC 티켓당 1 worktree). feature/KC-{id}-{feature} 브랜치 격리 시 사용.
---

# Katsubot 티켓당 Worktree

## 규칙

- 활성 티켓당 worktree 1개
- 브랜치: `feature/KC-{id}-{feature}`

## 생성

```bash
# 기존 브랜치
git worktree add ../katsubot-KC-007-phase0 feature/KC-007-modernization-phase0-scaffold
cd ../katsubot-KC-007-phase0

# 신규 브랜치
git worktree add -b feature/KC-007-modernization-phase0-scaffold ../katsubot-KC-007-phase0 main
```

## 정리

```bash
git worktree remove ../katsubot-KC-007-phase0
git branch -d feature/KC-007-modernization-phase0-scaffold
```

## 참고

- `docs/harness/workflow.md`
- `KC-000-project-conventions.md` §1
