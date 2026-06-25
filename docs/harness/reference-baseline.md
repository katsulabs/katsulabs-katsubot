# 하네스 기본 기준

> 헌법: [KC-000-project-conventions.md](./KC-000-project-conventions.md)

## 기술 기준선

| 영역 | 경로 |
|------|------|
| Frontend | `apps/chat-web` — React, TypeScript, Vite |
| Backend | `services/chat-api` — Boot 4.1, JDK 25, Gradle |
| Contract | `packages/api-contract` — OpenAPI 3.1 |
| DB | PostgreSQL |
| RAG | Dummy API → Port/Adapter |

상세: [KC-007-stack-assessment.md](../modernization/KC-007-stack-assessment.md)

## PR 하드 게이트

- [ ] 티켓 ID·범위 (`KC-{id}-{feature}`)
- [ ] 4역할 경계 준수
- [ ] 모듈별 테스트 green
- [ ] OpenAPI 변경 시 breaking 검토

검증 절차: `katsubot-pr-harness-gate` skill

## TDD 시작점

1. Domain Use Case + Port Mock
2. Controller/WebTestClient 계약 테스트
3. React hook·컴포넌트 (Vitest + RTL)
