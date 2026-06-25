# KC-007-modernization — 작업계획서 (승인용)

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization |
| 제목 | 챗봇 현대화 스택 (React + Boot 4.1) |
| 상태 | **승인 대기** |
| 전제 | [구조 결정](./KC-007-project-structure-decision.md) **구조안 B** |
| 예상 기간 | Phase 0–2: **8–10주** (1 FTE 기준, 병렬 시 단축) |

## 1. 목표 (DoD — Epic)

Epic 완료 시:

1. `apps/chat-web` — React 채팅 UI가 **Dummy RAG** 및 (선택) WRTN 어댑터로 E2E 동작
2. `services/chat-api` — Clean Architecture, Boot 4.1, JDK 25, PostgreSQL, SSE API
3. `legacy/hyobee` — 기존 SSO·운영 경로 유지, Strangler proxy 준비
4. GitHub Actions — legacy / chat-api / chat-web CI green
5. OpenAPI 계약 + 최소 통합 테스트·문서

## 2. Phase 개요

```text
Phase 0  구조·스캐폴딩·CI        (2주)
Phase 1  MVP API + React shell   (3주)
Phase 2  대화 도메인 + Strangler  (3–4주)
Phase 3  RAG Router + 실 벡터     (4주+, 별도 승인)
Phase 4  레거시 축소·decommission (요구 시)
```

## 3. Phase 0 — 구조 확립 (2주)

### 3.1 작업 항목

| ID | 작업 | 산출물 | 담당 |
|----|------|--------|------|
| 0-1 | 구조안 B 디렉터리 스캐폴딩 | `legacy/hyobee/`, `services/chat-api/`, `apps/chat-web/` | Main |
| 0-2 | 기존 `src/` → `legacy/hyobee/` 이동 (git history preserve) | 경로 변경 PR | Main |
| 0-3 | 루트 `settings.gradle.kts` + `chat-api` Boot 4.1 skeleton | health endpoint | Backend |
| 0-4 | Vite + React + TS `chat-web` skeleton | dev server | Frontend |
| 0-5 | `docker-compose.yml` — Postgres + dummy-rag | 로컬 E2E | Backend |
| 0-6 | GitHub Actions 3종 | `legacy-ci`, `chat-api-ci`, `chat-web-ci` | QA/Main |
| 0-7 | JDK 25 / Node 22 CI 검증 | green build | QA |

### 3.2 DoD (Phase 0)

- [ ] `legacy/hyobee`: `mvn test` — P0+P1 인증 **59/59 PASS** (경로 변경 후)
- [ ] `services/chat-api`: `./gradlew bootTest` + `GET /actuator/health` 200
- [ ] `apps/chat-web`: `pnpm build` 성공
- [ ] Dummy RAG: `POST /v1/completions` SSE 응답
- [ ] 문서: README 루트 갱신 (모듈별 실행 방법)

### 3.3 게이트

- **G0:** 디렉터리·빌드 분리 — 레거시 WAR 패키징 무손상
- **G1:** CI 3 workflow green on PR

## 4. Phase 1 — MVP API + React Shell (3주)

### 4.1 Contract (1주차 선행)

| ID | 작업 | 산출물 |
|----|------|--------|
| 1-C1 | OpenAPI 3.1 — `POST /api/v1/conversations`, `POST .../messages` (SSE) | `packages/api-contract/openapi.yaml` |
| 1-C2 | 인증 브릿지 계약 — JWT Bearer vs 레거시 세션 | `docs/modernization/auth-bridge.md` |
| 1-C3 | Dummy RAG Port 인터페이스 | domain port 문서 |

### 4.2 Backend

| ID | 작업 |
|----|------|
| 1-B1 | Clean Architecture 패키지 + `CreateConversation` / `SendMessage` Use Case |
| 1-B2 | `DummyRagAdapter` — SSE relay |
| 1-B3 | Flyway `V1__conversation.sql` |
| 1-B4 | JPA — `Conversation`, `Message` 엔티티 (Optional 범위) |
| 1-B5 | 단위 테스트 — Use Case (Mock Port) |

### 4.3 Frontend

| ID | 작업 |
|----|------|
| 1-F1 | 로그인 redirect — 레거시 `login.jsp` → React deep link |
| 1-F2 | 채팅 레이아웃, 메시지 리스트, 입력창 |
| 1-F3 | SSE hook — 스트리밍 렌더 |
| 1-F4 | OpenAPI 생성 클라이언트 연동 |

### 4.4 DoD (Phase 1)

- [ ] 로컬: 로그인(레거시) → React 채팅 → Dummy RAG 스트리밍 **수동 시나리오 1건**
- [ ] `chat-api` 테스트 커버리지 — Use Case 핵심 경로
- [ ] Contract PR — Backend/Frontend 병렬 착수 가능

### 4.5 게이트

- **G2:** OpenAPI breaking change 없음 (review)
- **G3:** 인증 브릿지 — 401/403 계약 테스트

## 5. Phase 2 — 대화 도메인 + Strangler (3–4주)

| ID | 작업 |
|----|------|
| 2-1 | 대화 목록·삭제·메시지 히스토리 — v2 API parity 분석 |
| 2-2 | `board-auth` 권한 Port — 레거시 DB 또는 API 브릿지 |
| 2-3 | Reverse proxy 규칙 — `/api/v1/**` → chat-api, SSO → legacy |
| 2-4 | 피드백 API |
| 2-5 | 통합 테스트 — Testcontainers Postgres |
| 2-6 | Frontend — 대화 목록, 파일 첨부(스텁), 에러 UX |

### DoD (Phase 2)

- [ ] v2 핵심 API 대비 **기능 매트릭스** 80%+ (문서화)
- [ ] Strangler proxy 스테이징 배포 1회
- [ ] P0 인증 회귀 — 레거시 CI green 유지

### 게이트

- **G4:** 기능 매트릭스 리뷰 (Product/Contract)
- **G5:** 스테이징 스모크 — SSE 5분 연결 유지

## 6. Phase 3+ — RAG 고도화 (별도 승인)

| ID | 작업 | 비고 |
|----|------|------|
| 3-1 | `WrtnRagAdapter` — 기존 `HyobeeChatApiClient` 로직 이전 | Port 뒤 |
| 3-2 | Router — 단순/복잡 질의 분기 | 트렌드 문서 §2 |
| 3-3 | 하이브리드 검색 인덱스 | pgvector 또는 외부 |
| 3-4 | OpenTelemetry 대시보드 | |

**Phase 3 착수 조건:** Phase 2 DoD + 운영 배포 승인 + WRTN 계약 확인

## 7. 리스크 레지스터

| ID | 리스크 | 영향 | 완화 |
|----|--------|------|------|
| R1 | 경로 이동으로 레거시 CI 깨짐 | 높음 | Phase 0 전용 PR, 59 테스트 게이트 |
| R2 | SSO·세션 브릿지 복잡도 | 높음 | Phase 1 Contract 선행, JWT verify 재사용 |
| R3 | JDK 25 CI/배포 미지원 | 중간 | Docker 이미지 pin, 21 fallback 옵션 |
| R4 | 레거시 병행 리소스 경쟁 | 중간 | KC-007-modernization Phase 0–1은 소규모 |
| R5 | Boot 4 Jackson 3 호환 | 중간 | 신규 모듈만 해당 |

## 8. 승인

| 역할 | 이름 | 날짜 | 결정 |
|------|------|------|------|
| Product / Sponsor | | | ☐ Phase 0 착수 / ☐ 수정 / ☐ 보류 |
| Tech Lead | | | ☐ 구조안 B / ☐ 구조안 A / ☐ 기타: _____ |
| Backend | | | ☐ 스택 확정 / ☐ JDK ___ Boot ___ |
| Frontend | | | ☐ React+Vite+TS |
| QA | | | ☐ CI 게이트 합의 |

**수정 요청 시 기록:**

```text
(승인자 메모)
```

## 9. 착수 조건 (Definition of Ready)

- [ ] §8 승인 완료
- [ ] worktree 브랜치: `feature/KC-007-modernization-phase0-scaffold`
- [ ] PostgreSQL 로컬/CI 시크릿 정책 합의

## 10. 하네스 티켓 등록 (승인 후)

`docs/harness/todo.md`에 KC-007-modernization 활성 티켓 추가 — Phase별 DoD 링크.

## 11. 즉시 다음 액션 (승인 시)

1. `feature/KC-007-modernization-phase0-scaffold` worktree 생성 (`katsubot-worktree-ticket`)
2. Phase 0 PR — 디렉터리 이동 + 스캐폴딩 only (기능 변경 없음)
3. Contract 서브에이전트 — `auth-bridge.md` + OpenAPI 초안
