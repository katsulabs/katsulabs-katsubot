---
name: hyobee-pr-harness-gate
description: Hyobee PR 하네스 Hard Gates, 티켓 범위, 역할 경계, 테스트 증적 검증. PR 생성·리뷰, PULL_REQUEST_TEMPLATE.md 준수, 머지 전 QA 승인 시 사용.
---

# Hyobee PR 하네스 게이트

## Hard Gates (전부 필수)

`.github/PULL_REQUEST_TEMPLATE.md` 기준:

- [ ] Summary에 티켓 ID·범위 문서화
- [ ] 역할 경계 준수 (Contract/BE/FE/QA — 스코프 밖 수정 없음)
- [ ] 브랜치명: `feature/TB-{id}-{short-name}` (`main` 직접 커밋 없음)
- [ ] DB/Flyway 변경 시 rollback 또는 호환성 메모 (해당 시)
- [ ] Hook fallback 사용? yes면 사유 + 수동 단계 PR 본문 기록

## Test Plan 게이트

- [ ] Backend test gate 통과
- [ ] Frontend test gate 통과 (JS/JSP면 수동 QA — TB-004 참고)
- [ ] `main`에 기능 커밋 없음

## 인증 영향 PR (추가)

diff가 `docs/harness/workflow.md` §인증 흐름 경로를 건드리면:

1. P0+P1 회귀 증적 첨부 (`hyobee-auth-regression`)
2. 흐름 변경 시 `auth-flow-analysis.md` 갱신
3. 실행일·결과로 `qa-registry.md` 갱신

## 범위 vs diff 감사

1. `docs/harness/todo.md`에서 티켓 DoD 확인
2. 변경 경로 목록 → 에이전트 스코프 매핑 (`package-scope.md`)
3. 범위 밖 파일 → 티켓 갱신 또는 revert 요구

## PR 본문 템플릿

```markdown
## Summary
- Ticket: TB-xxx
- Agent: [TB-xxx][Backend]
- {변경 내용과 이유}

## Test Plan
- [x] mvn test -DfailIfNoTests=false — P0+P1 59/59 PASS
- [x] 수동 QA (FE): TB-004 § — 11/11 PASS
- [x] main 커밋 없음

## Harness Hard Gates
- [x] ticket + scope documented
- [x] role boundary respected
- [x] branch naming followed
- [x] N/A DB/Flyway
- [x] N/A hook fallback

## Auth flow impact
- None / {설명 + 문서 링크}
```

## 머지 정책

- 통합 브랜치에 **no-ff** 머지
- P0+P1 실패 auth PR은 명시적 waiver + 후속 티켓 없이 머지 금지

## 참고

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.cursor/rules/qa.mdc`
- `docs/harness/workflow.md`
