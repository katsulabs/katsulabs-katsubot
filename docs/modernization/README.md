# 챗봇 현대화 (KC-007-modernization) — 사전 검토 문서

> **상태:** 승인 대기 (APPROVAL PENDING)  
> **작성일:** 2026-06-25  
> **범위:** 레거시 Hyobee(WAR/JSP)와 신규 스택(React + Spring Boot 4.1) 분리 전략

## 목적

현 레거시 단일 WAR(`hyobee`, Spring Boot 2.7 + JSP/JS)를 **별도 모듈**로 분리하고, React · JDK 25 · Spring Boot 4.1 · Gradle · Clean Architecture 기반의 신규 챗봇 스택을 구축하기 **전** 구조·스택·트렌드를 검토하고 승인받는다.

## 문서 목록

| 문서 | 내용 | 승인 항목 |
|------|------|-----------|
| [KC-007-project-structure-decision.md](./KC-007-project-structure-decision.md) | 모노레포 vs 멀티레포, 모듈 경계, Strangler 전략 | **구조안 A/B/C 중 선택** |
| [KC-007-stack-assessment.md](./KC-007-stack-assessment.md) | 요구 스택 적절성, 리스크, 레거시와의 관계 | **스택·JDK·빌드 도구 확정** |
| [KC-007-chatbot-agent-trends.md](./KC-007-chatbot-agent-trends.md) | 2025–2026 챗봇·에이전트·RAG 트렌드 | **아키텍처 방향(참고)** |
| [KC-007-work-plan.md](./KC-007-work-plan.md) | Phase별 작업계획·DoD·게이트 | **일정·범위 승인** |

## 권장안 요약 (검토용)

| 항목 | 권장 |
|------|------|
| 저장소 | **모노레포 + Gradle 멀티모듈** (구조안 B) |
| 레거시 | `legacy/hyobee` — 전환기 유지·점진 축소 |
| 신규 | `apps/chat-web`(React), `services/chat-api`(Boot 4.1) |
| RAG | 초기 **Dummy RAG API** + Port/Adapter (운영 WRTN·향후 Agentic RAG 교체) |
| JPA | **선택적** — 대화 메타·피드백은 JPA, 대량 조회·레거시 호환은 JDBC/Query |
| CI/CD | GitHub Actions — 레거시(Maven)·신규(Gradle) **분리 워크플로** |

## 승인 체크리스트

승인자는 아래를 확인 후 `KC-007-work-plan.md` §8 서명란에 기록한다.

- [ ] 프로젝트 구조안 (A/B/C) 선택
- [ ] 신규 스택 (React, Boot 4.1, JDK 25, Gradle) 확정 또는 수정안 반영
- [ ] 레거시 모듈과의 Strangler 전환 조건 이해
- [ ] Phase 0(스캐폴딩) 착수 범위·일정 승인
- [ ] Dummy RAG → 실 RAG 전환 시점(Phase 3 이후) 동의

## 관련 문서

- [harness/README.md](../harness/README.md) — Agent 협업·워크플로
- [harness/todo.md](../harness/todo.md) — KC-007-modernization 티켓·DoD
