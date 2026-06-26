# KC-000 — Katsulabs Chatbot 프로젝트 규칙

| 항목 | 값 |
|------|-----|
| 티켓 | **KC-000** (헌법 — 기능 티켓 아님) |
| 제품 | Katsulabs Chatbot (`katsubot`) |
| 상태 | ACTIVE |

## 1. 티켓·브랜치 명명

### 패턴

```text
KC-{번호}-{feature}     # 티켓 ID (문서·커밋·PR)
feature/KC-{번호}-{feature}   # Git 브랜치
[KC-{번호}][{Role}]     # Sub-agent 디스패치 태그
```

| 예시 | 의미 |
|------|------|
| `KC-000` | 본 규칙 문서 (변경 드묾) |
| `KC-007-modernization` | 챗봇 현대화 Epic |
| `feature/KC-007-modernization-phase0-scaffold` | Phase 0 worktree 브랜치 |
| `[KC-007-modernization][Backend]` | Backend Sub-agent 태그 |

### 번호 대역

| 범위 | 용도 |
|------|------|
| **KC-000** | 프로젝트 규칙·컨벤션 |
| KC-001–099 | 인프라·CI·공통 계약 |
| KC-100+ | 제품 기능 Epic (또는 KC-007 등 기존 Epic 번호 유지) |

## 2. 모듈 지도

| 경로 | 역할 | 에이전트 |
|------|------|----------|
| `apps/chat-web/` | React + TypeScript + Vite | Frontend |
| `services/chat-api/` | Spring Boot 4.1, Clean Architecture | Backend |
| `packages/api-contract/` | OpenAPI 3.1 (계약 단일 소스) | Contract |
| `legacy/hyobee/` | 전환기 WAR — **신규 기능 금지** | (터치 시 QA만) |
| `docs/KC-007-modernization-plan.md` | 현대화 Epic (승인용 단일 문서) |
| `docs/harness/` | 운영·워크플로 | Main |

## 3. 에이전트 4역할

Main(오케스트레이터)은 `.cursor/rules/orchestrator.mdc`에 정의. 구현 Sub-agent는 4역할:

| Role | 책임 | 허용 경로 |
|------|------|-----------|
| **Contract** | OpenAPI·도메인 Port·인증 브릿지 문서 | `docs/**`, `packages/api-contract/**` |
| **Backend** | Use Case·인프라·API 테스트 | `services/chat-api/**` |
| **Frontend** | React UI·SSE·API 클라이언트 | `apps/chat-web/**` |
| **QA** | CI·통합 스모크·PR 게이트 | `**/*Test*`, `.github/workflows/**`, `docs/harness/**` |

**순서:** Contract → Backend → Frontend → QA (병렬은 `agent-hierarchy.md` 조건 충족 시)

## 4. Clean Architecture (chat-api)

```text
interfaces/     → REST, SSE, ExceptionHandler
application/    → Use Case, application DTO
domain/         → Entity, Port (interface) — 프레임워크 무의존
infrastructure/ → JPA, RagHttpClient, AuthAdapter
```

의존 방향: `interfaces` → `application` → `domain` ← `infrastructure`

## 5. PR 게이트 (모듈별)

| 모듈 | 명령 |
|------|------|
| chat-api | `cd services/chat-api && ./gradlew test` |
| chat-web | `cd apps/chat-web && pnpm test && pnpm build` |
| api-contract | OpenAPI breaking change 검토 |
| legacy/hyobee | 터치 시만 `mvn test` |

## 6. Git·머지

- `main` 직접 커밋 금지
- 기능당 worktree 1개
- merge: `no-ff`
- 커밋 메시지: **한국어**, `Co-authored-by: Cursor` 금지 — `.cursor/rules/git-commit.mdc`

## 7. 문서 읽기 순서

1. **본 문서** (`KC-000`)
2. **[KC-007-modernization-plan.md](../KC-007-modernization-plan.md)** — 승인·실행 계획
3. `docs/harness/todo.md`
4. `packages/api-contract/openapi.yaml` (존재 시)
5. `docs/harness/workflow.md`

## 8. Cursor Skills

절차·HOW는 `.cursor/skills/katsubot-*/SKILL.md`를 따른다.

| Skill | 용도 |
|-------|------|
| `katsubot-ticket-kickoff` | 티켓 첫 턴 |
| `katsubot-worktree-ticket` | worktree 생성 |
| `katsubot-subagent-handoff` | 에이전트 전환 |
| `katsubot-pr-harness-gate` | PR 검증 |
| `katsubot-ci-workflow` | GitHub Actions |
| `katsubot-secrets-prep` | Secrets 체크리스트 |
| `katsubot-kpi-weekly` | 주간 KPI |

## 9. 레거시와의 경계

- 신규 개발은 `apps/`, `services/`, `packages/`만.
- `legacy/hyobee`는 Strangler 전환기 동결·축소.
- 레거시 전용 게이트(P0 SSO 59건 등)는 **legacy PR에만** 적용.
