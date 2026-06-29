# Katsubot 문서 목차

> KC-007 현대화 이후 **필수 문서**만 넘버링으로 정리. Phase 킥오프·스모크 등 이력은 [`archive/KC-007/`](./archive/KC-007/) 참고.

## 읽기 순서 (온보딩)

1. [01-project-conventions.md](./01-project-conventions.md) — KC-000 프로젝트 규칙
2. [02-modernization-plan.md](./02-modernization-plan.md) — KC-007 Epic (승인됨)
3. [03-architecture-flows.md](./03-architecture-flows.md) — **아키텍처·플로우차트 모음**
4. [04-local-development.md](./04-local-development.md) — 로컬 기동·스모크

## 계약·API

| # | 문서 | 내용 |
|---|------|------|
| 05 | [auth-bridge.md](./05-auth-bridge.md) | SSO/JWT ↔ chat-api |
| 06 | [rag-contract.md](./06-rag-contract.md) | chat-api ↔ AI Gateway |
| 07 | [api-reference.md](./07-api-reference.md) | REST/SSE 경로·v2 parity |
| 08 | [ai-gateway-handoff.md](./08-ai-gateway-handoff.md) | WRTN → Gateway 마이그레이션 |

## 운영·E2E

| # | 문서 | 내용 |
|---|------|------|
| 09 | [operations-runbook.md](./09-operations-runbook.md) | Cutover·Secrets·Decommission |
| 10 | [chat-e2e-gaps.md](./10-chat-e2e-gaps.md) | 채팅 E2E 갭·구현 우선순위 |

## 에이전트 하네스

| 문서 | 내용 |
|------|------|
| [harness/todo.md](./harness/todo.md) | 활성 티켓·DoD |
| [harness/agent-hierarchy.md](./harness/agent-hierarchy.md) | 4역할 Sub-agent |
| [harness/workflow.md](./harness/workflow.md) | worktree·PR·CI |

## 기타

| 경로 | 내용 |
|------|------|
| [../README-MONOREPO.md](../README-MONOREPO.md) | 모노레포 빠른 시작 |
| [../AGENTS.md](../AGENTS.md) | 에이전트 실행 명령 |
| [../README.md](../README.md) | 레거시 Hyobee 상세 |
| [../packages/api-contract/](../packages/api-contract/) | OpenAPI 단일 소스 |
| [archive/KC-007/](./archive/KC-007/) | Phase 킥오ff·스모크·프롬프트 보관 |
