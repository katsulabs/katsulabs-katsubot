# KC-007-modernization — 기술 스택 적절성 평가

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization |
| 상태 | **승인 대기** |
| 평가 대상 | React, JDK 25, Boot 4.1, Gradle, JPA(Optional), Postgres, Dummy RAG, CI/CD |

## 1. 요구 스택 vs 현재 기준선

| 영역 | 요구사항 | 현재 (레거시) | 평가 |
|------|----------|---------------|------|
| Frontend | React | JSP + vanilla JS (TB-004 IIFE) | ✅ 적절 — UI 현대화·테스트·컴포넌트화 |
| JDK | 25 | 21 (`pom.xml`) | ✅ 신규 모듈에 적절 (아래 §2) |
| Framework | Spring Boot 4.1 | 2.7.18 | ✅ **신규 모듈만** — 레거시 in-place ❌ |
| Build | Gradle | Maven | ✅ 멀티모듈에 적합 |
| ORM | JPA (Optional) | JPA + JDBC 혼용 | ✅ Optional 권장 (§4) |
| DB | PostgreSQL | PostgreSQL | ✅ 유지 |
| RAG | Dummy API | WRTN 직접 연동 | ✅ 개발·테스트 decouple |
| Architecture | Clean Architecture | Layered MVC | ✅ 신규 `chat-api`에 적용 |
| CI/CD | GitHub Actions | PR template만, CI TODO | ✅ 필수 보완 |

## 2. JDK 25 + Spring Boot 4.1

### 2.1 시점 적합성 (2026-06 기준)

- Spring Boot **4.1.0** GA: 2026-06-10 ([release notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes))
- Java **25** GA: 2025-09 — Boot 4.x가 17–25 지원, 4.1에서 Java 25 first-class
- 요구 스택은 **신규 greenfield**에 대해 시의적절함

### 2.2 레거시와의 분리 필요성

레거시 Hyobee(WAR, Tomcat 9)는 in-place Boot 3+ 마이그레이션이 불가하므로 신규 모듈로 분리한다.

| 항목 | 레거시 (hyobee) | 신규 (chat-api) |
|------|-----------------|-----------------|
| Servlet API | `javax.*` (Tomcat 9) | `jakarta.*` (Boot 4 embedded) |
| Spring Boot | 2.7.x 상한 | 4.1 |
| Jackson | 2.x | 3.x (Boot 4 기본) |
| 마이그레이션 | Strangler·점진 | 새 코드베이스 |

**결론:** JDK 25 + Boot 4.1은 **신규 `services/chat-api`에만** 적용한다.

### 2.3 JDK 25 채택 리스크·완화

| 리스크 | 완화 |
|--------|------|
| CI runner JDK 25 미지원 | `actions/setup-java@v4` temurin 25; Docker 빌드 이미지 고정 |
| 사내 표준 JDK가 21 이하 | 배포 타깃 JDK를 21로 **컴파일 타깃**만 낮추는 옵션은 가능하나, 요구사항과 불일치 시 승인 단계에서 조정 |
| 서드파티 Agent/APM 미지원 | Phase 0 스파이크에서 검증 |
| Boot 4.x 마이그레이션 가이드 학습 곡선 | Phase 0에서 공식 migration guide + 최소 API 스캐폴딩 |

### 2.4 대안 스택 (거부·보류 사유)

| 대안 | 사유 |
|------|------|
| Boot 3.5 + JDK 21 | 요구사항 미충족; 4.1이 이미 GA |
| Kotlin + Spring | 팀 Java 자산·하네스 테스트 재사용 우선 |
| Node/NestJS backend | 기존 Spring·PostgreSQL·인증 지식 활용 |
| Next.js full-stack | BFF 분리 요구와 Clean Architecture 경계 모호 |

## 3. React (Frontend)

### 3.1 적절성

- SSE 스트리밍: `EventSource` 또는 `fetch` + ReadableStream — 레거시 `aichat010.js` 패턴을 컴포넌트화
- 인증: SSO는 Phase 0–1에서 **레거시 redirect** 유지 → React는 JWT/세션 쿠키를 API와 계약
- TB-004 IIFE 모듈화 지식(`hyobee-api.js` 등)을 React hooks/services로 **이전 가능**

### 3.2 권장 부가 스택 (승인 시 기본값)

| 항목 | 권장 | 비고 |
|------|------|------|
| 번들러 | Vite 6+ | 빠른 HMR |
| 언어 | TypeScript | API 계약 타입 안전 |
| 상태 | TanStack Query + Zustand(또는 Context) | 서버 상태 / UI 상태 분리 |
| 스타일 | 기존 디자인 토큰 이식 또는 CSS Modules | 대규모 UI 라이브러리는 Phase 1 후 결정 |
| 테스트 | Vitest + RTL | 컴포넌트·hook 단위 |

## 4. JPA (Optional) — 권장 전략

**Optional이 맞다.** 전면 JPA는 레거시 스키마·대량 조회·SSE 경로와 맞지 않는 구간이 있다.

| 데이터 | 권장 접근 | 이유 |
|--------|-----------|------|
| 대화·메시지 메타 | JPA (또는 Spring Data JDBC) | CRUD, 트랜잭션 |
| 피드백·세션 메타 | JPA | 단순 엔티티 |
| 레거시 테이블 read | JDBC/MyBatis 또는 Repository adapter | 스키마 소유권·복잡 쿼리 |
| 채팅 스트림 | **비영속** — WebClient → SSE | JPA 부적합 |

**Port 예시:** `ConversationRepository` (domain port) ← `JpaConversationAdapter` / `LegacyJdbcConversationAdapter`

## 5. PostgreSQL

- 기존 `xtrmvob` 스키마와 **공존** 또는 **신규 스키마**(`chat`) 분리
- Phase 0: Flyway/Liquibase로 `chat-api` 전용 테이블만 관리
- 레거시 테이블 직접 JPA 매핑은 **Phase 2 이후**, Anti-Corruption Layer 필수

## 6. Dummy RAG API

### 6.1 목적

- WRTN·외부 LLM 없이 **로컬·CI**에서 E2E 검증
- Clean Architecture **Port** (`RagCompletionPort`, `EmbeddingPort`) 뒤에 어댑터 교체

### 6.2 최소 계약 (제안)

```http
POST /v1/completions
Content-Type: application/json

{ "query": "...", "conversation_id": "...", "stream": true }
```

- `stream: true` → SSE (`data: {"delta":"..."}` )
- 고정 시나리오 응답 + 인위적 지연(스트리밍 UX 테스트)
- Phase 1: Docker Compose `dummy-rag:8090`
- Phase 3: `WrtnRagAdapter` 또는 Agentic orchestrator로 교체

### 6.3 적절성

✅ **강력 권장** — 외부 API 비용·가용성·계약 변경으로부터 개발 속도 보호

## 7. Gradle

| 항목 | 판단 |
|------|------|
| 멀티모듈 | `services/chat-api`, `packages/api-contract` |
| Version catalog | `gradle/libs.versions.toml` — Boot 4.1 BOM |
| 레거시 | `legacy/hyobee`는 Maven 유지 (composite build 선택) |
| vs Maven (신규만) | 요구사항 충족 + 모듈 경계 명확 |

## 8. GitHub CI/CD

### 8.1 현재 갭

- `.github/` — PR template만 존재, **workflow 없음** ([todo.md](../harness/todo.md) CI/CD mirror TODO)

### 8.2 제안 워크플로

| Workflow | 트리거 | 작업 |
|----------|--------|------|
| `legacy-ci.yml` | `legacy/**`, `pom.xml` | JDK 21, `mvn test` (P0+P1 인증 세트) |
| `chat-api-ci.yml` | `services/chat-api/**` | JDK 25, `./gradlew test`, Spotless(선택) |
| `chat-web-ci.yml` | `apps/chat-web/**` | `pnpm lint`, `pnpm test`, `pnpm build` |
| `contract-check.yml` | OpenAPI 변경 | breaking change 감지 (Phase 1+) |

### 8.3 CD (Phase 2+)

- `main` merge → staging deploy (Docker/K8s는 인프라 팀 합의 후)
- Secrets: GitHub Environments (`katsubot-secrets-prep` skill)

## 9. Clean Architecture 적용 범위

| 적용 | 미적용 |
|------|--------|
| `services/chat-api` 전면 | `legacy/hyobee` (기존 layered 유지) |
| RAG·Auth·Conversation 도메인 | JSP/정적 리소스 |
| Port/Adapter로 WRTN·Dummy RAG | `xs/core/**` 레거시 유틸 직접 import 금지 |

**레거시 브릿지:** `infrastructure/auth/LegacySessionAuthAdapter` — HTTP 또는 공유 Redis/DB로 세션 검증 (Phase 1 스파이크)

## 10. 레거시 모듈과의 관계

```text
legacy/hyobee (전환기)            KC-007-modernization 신규 스택
─────────────────────────         ─────────────────────
Boot 2.7, Tomcat 9 WAR            JDK 25, Boot 4.1 JAR
JSP + vanilla JS                  React
WRTN 직접 연동                    Port/Adapter + Dummy RAG
Strangler 축소 대상               주 개발 경로
```

- 전환기에는 `legacy/hyobee`를 **동결·축소**하고 KC-007-modernization에 개발 리소스를 집중한다.
- Phase 2 이후 트래픽 이전이 진행되면 레거시 모듈 제거 일정을 별도 검토한다.

## 11. 종합 판단

| 요구사항 | 판정 | 조건 |
|----------|------|------|
| React | ✅ 채택 | TypeScript + Vite 기본 |
| JDK 25 + Boot 4.1 | ✅ 채택 | **신규 모듈 한정** |
| Gradle | ✅ 채택 | 루트 멀티모듈 |
| JPA Optional | ✅ 채택 | 도메인별 Adapter 혼합 |
| PostgreSQL | ✅ 유지 | 스키마 분리 권장 |
| Dummy RAG | ✅ 채택 | Port 뒤 어댑터 |
| GitHub CI/CD | ✅ 필수 | Phase 0에 최소 3 workflow |
| Clean Architecture | ✅ 채택 | `chat-api` only |

**승인 시 수정 가능 항목:** JDK 25 → 21 LTS 타깃, Boot 4.1 → 4.0.x pin (사내 정책 시)
