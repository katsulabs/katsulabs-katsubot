---
name: katsubot-subagent-handoff
description: Contract→Backend→Frontend→QA Sub-agent handoff(산출물 체크리스트, Hook fallback). 4역할 전환 시 사용.
---

# Katsubot Sub-agent Handoff

## 전환 순서

Contract → Backend → Frontend → QA

티켓 범위에서 불필요한 역할은 건너뛰고 사유를 문서화한다.

## Handoff 체크리스트

| From → To | 전달 산출물 |
|-----------|-------------|
| Contract → Backend | OpenAPI, Port 목록, auth-bridge 메모 |
| Backend → Frontend | API base URL, SSE 이벤트 형식, 샘플 curl |
| Frontend → QA | 스모크 시나리오, 빌드·실행 방법 |
| Any → QA | 브랜치명, DoD, diff 요약, 테스트 로그 |

## Handoff 메모 템플릿

```markdown
## Handoff [KC-007-modernization] Contract → Backend
- OpenAPI: packages/api-contract/openapi.yaml
- Ports: RagCompletionPort, ConversationRepository
- Blocker: none
- Next: [KC-007-modernization][Backend]
```

## Hook fallback

1. Main이 태그 유지: `[KC-xxx][NextAgent]`
2. 직전 산출물 전달
3. QA 전 모듈 테스트 재확인
4. PR에 fallback 사유 기록

## QA 전 게이트

- chat-api: `./gradlew test`
- chat-web: `pnpm test && pnpm build`

## 참고

- `katsubot-ticket-kickoff` skill
- `docs/harness/workflow.md`
