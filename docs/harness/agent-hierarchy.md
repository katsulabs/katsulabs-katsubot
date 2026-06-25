# 에이전트 계층

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)

메인 오케스트레이터(`.cursor/rules/orchestrator.mdc`)가 티켓·worktree를 관리하고, Sub-agent 4역할이 구현합니다.

## 4역할

| Agent | 역할 | 수정 범위 |
|-------|------|-----------|
| **Contract** | OpenAPI·Port·인증 브릿지 문서 | `docs/**`, `packages/api-contract/**` |
| **Backend** | Use Case·인프라·테스트 | `services/chat-api/**` |
| **Frontend** | React·SSE·API 클라이언트 | `apps/chat-web/**` |
| **QA** | CI·스모크·PR 게이트 | 테스트, `.github/workflows/**`, `docs/harness/**` |

## 분배 태그

```text
[KC-{id}-{feature}][Contract]
[KC-{id}-{feature}][Backend]
[KC-{id}-{feature}][Frontend]
[KC-{id}-{feature}][QA]
```

예: `[KC-007-modernization][Backend]`

## 병렬 정책

- 서로 다른 worktree/브랜치
- 경로 비중첩: `services/chat-api/**` vs `apps/chat-web/**`
- OpenAPI 계약 Contract 선행 확정

불명확하면 **Contract → Backend → Frontend → QA** 순차 진행.

## KC-007-modernization 경계

| Role | 책임 |
|------|------|
| Contract | OpenAPI, Auth 브릿지, RAG Port |
| Backend | Clean Architecture, Dummy RAG Adapter |
| Frontend | SSE 스트리밍 UI, TanStack Query |
| QA | 모듈별 CI green, E2E 스모크 |
