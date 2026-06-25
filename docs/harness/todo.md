# 하네스 TODO

프로젝트별 운영 백로그와 DoD를 관리합니다.

> 규칙: [KC-000-project-conventions.md](./KC-000-project-conventions.md)

## 활성 티켓

| 티켓 | 담당 | 상태 | DoD |
|--------|-------|--------|-----|
| KC-007-modernization | Main/Contract/Backend/Frontend/QA | **APPROVAL PENDING** | [modernization/](../modernization/README.md) — 승인 후 Phase 0 |

## KC-007-modernization Phase 요약

상세: [KC-007-work-plan.md](../modernization/KC-007-work-plan.md)

| Phase | 상태 | DoD |
|-------|------|-----|
| 0 — 구조·스캐폴딩·CI | 대기 | 디렉터리 분리, Boot 4.1/React skeleton, CI 3종 |
| 1 — MVP API + React | 대기 | OpenAPI, Dummy RAG SSE, 채팅 UI |
| 2 — 대화 도메인 + Strangler | 대기 | v2 parity, proxy, 통합 테스트 |
| 3+ — RAG 고도화 | 별도 승인 | WRTN 어댑터, Router Agent |

## 보류 인프라

| 항목 | 상태 | 비고 |
|------|--------|------|
| GitHub Actions CI/CD | TODO | Phase 0 — `katsubot-ci-workflow` skill |
| Secrets management | TODO | `katsubot-secrets-prep` skill |

## 참고

- 구현 요청 첫 턴: `KC-000` → `todo.md` → Epic 문서.
- API·인증 계약 변경은 Contract 산출물(`packages/api-contract/`, `docs/modernization/`) 선행.
