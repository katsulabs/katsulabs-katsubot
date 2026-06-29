---
name: katsubot-pr-harness-gate
description: Katsubot PR 하네스 Hard Gates, KC 티켓 범위, 4역할 경계, 모듈별 테스트 증적. PR 생성·머지 전 사용.
---

# Katsubot PR 하네스 게이트

## Hard Gates

- [ ] Summary에 `KC-{id}-{feature}`·범위 명시
- [ ] `feature/KC-{id}-{feature}` (`main` 직접 커밋 없음)
- [ ] 4역할 경계 준수 (`KC-000` §3)
- [ ] 모듈 테스트 green (변경 모듈만)
- [ ] OpenAPI 변경 시 breaking 검토
- [ ] DB/Flyway 변경 시 호환·롤백 메모

## 모듈 테스트

| 변경 | 명령 |
|------|------|
| katsubot-api | `cd services/katsubot-api && ./gradlew test` |
| katsubot-web | `cd apps/katsubot-web && pnpm test && pnpm build` |
| legacy | `cd legacy/hyobee && mvn test` |

## PR 본문 예시

```markdown
## Ticket
KC-007-modernization — Phase 0 scaffold

## Agent
[KC-007-modernization][Backend]

## Test evidence
- ./gradlew test: BUILD SUCCESSFUL
```

## 범위 검증

1. `docs/harness/todo.md` DoD 대조
2. diff가 티켓 범위 밖 → 티켓 갱신 또는 revert

## 참고

- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/01-project-conventions.md` §5
