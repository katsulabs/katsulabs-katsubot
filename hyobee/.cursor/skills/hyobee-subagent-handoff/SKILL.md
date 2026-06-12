---
name: hyobee-subagent-handoff
description: Contract→Backend→Frontend→QA Sub-agent handoff 관리(산출물 체크리스트, Hook fallback 런북). 하네스 에이전트 전환, Cursor Hook 실패, 다중 에이전트 티켓 실행 시 사용.
---

# Hyobee Sub-agent Handoff

## 표준 파이프라인

```
Contract → Backend → Frontend → QA → PR
```

티켓 범위에서 제외된 에이전트만 건너뛰기 (사유 문서화).

## Handoff 산출물

| From → To | 필수 전달 |
|-----------|-----------|
| Contract → Backend | auth-flow + package-scope 갱신; DTO/API 경계 메모 |
| Backend → Frontend | API 동작 불변 목록; 세션/오류 코드; 테스트 결과 |
| Frontend → QA | 수동 QA 범위 (JS면 TB-004 §); 브라우저 빌드 방법 |
| Any → QA | 브랜치명, 티켓 DoD, diff 요약, 테스트 로그 |

## Handoff 메시지 형식

```markdown
## Handoff [TB-xxx] {From} → {To}

### 완료
- {산출물}

### 다음 에이전트 미완
- {todo.md 체크리스트}

### 테스트
- P0+P1: {상태 또는 N/A}
- 수동 QA: {상태 또는 N/A}

### 변경 파일
- {경로}

### 리스크
- {auth 영향, 호환, BLOCKED 항목}
```

## Hook fallback (`workflow.md`)

Cursor Hook / 자동 분배 실패 시:

1. Main 오케스트레이터가 태그 유지: `[TB-xxx][NextAgent]`
2. 이전 에이전트 출력 + 파일 목록을 다음 세션에 붙여넣기
3. QA 전환 전 테스트 재실행
4. PR 본문: fallback 사유 + 수동 단계 기록

## QA 전환 게이트

`[TB-xxx][QA]` 전:

- Backend: 티켓 범위 `mvn test` green
- Frontend: 빌드 로드 가능; JS/JSP면 수동 QA 계획 첨부
- auth 변경 시 Contract 문서 동기화

## 참고

- `docs/harness/workflow.md` §Hook 실패 대체 런북
- `docs/harness/agent-hierarchy.md`
- `.cursor/skills/hyobee-ticket-kickoff/SKILL.md`
