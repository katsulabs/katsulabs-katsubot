# KC-007-modernization — 챗봇·에이전트 개발 트렌드 (2025–2026)

| 항목 | 값 |
|------|-----|
| 티켓 | KC-007-modernization |
| 상태 | **참고 문서** (아키텍처 방향 입력) |
| 갱신 | 2026-06-25 |

## 1. 요약 — Hyobee 현대화에의 시사점

| 트렌드 | Hyobee 적용 제안 |
|--------|------------------|
| SSE 스트리밍 표준화 | ✅ 유지 — `chat-api` + React EventSource |
| RAG → Agentic RAG | Phase 3+ — Dummy RAG Port 뒤에 Router/Planner 도입 |
| BFF 분리 | ✅ `chat-api`가 BFF; 레거시 SSO는 브릿지 |
| 관측성(Observability) | OpenTelemetry + 구조화 로그 (Boot 4.1 내장 지원 강화) |
| 하이브리드 검색 | 벡터 + BM25 — Dummy 이후 실 RAG 단계에서 |
| Human handoff | 장기 — 레거시 VOB·상담원 연계 요구 시 별도 Epic |

## 2. 아키텍처 진화

### 2.1 전통 RAG (1.0)

```text
User Query → Embed → Vector Search → Top-K → LLM Generate → Answer
```

- **한계:** 단일 패스, 멀티홉·모호 질의·다중 코퍼스에 취약
- **현 Hyobee:** WRTN API가 retrieval+generation을 **블랙박스**로 제공 — BFF는 대화 상태·권한·SSE 중계

### 2.2 Agentic RAG (2025–2026 주류)

에이전트가 retrieval을 **도구**로 쓰고, 반복·검증 후 답변 ([Google Research Agentic RAG](https://research.google/blog/unlocking-dependable-responses-with-gemini-enterprise-agent-platforms-agentic-rag/), [enterprise 가이드](https://heeya.fr/en/blog/agentic-rag-implementation-enterprise-2026)).

```text
                    ┌─────────────┐
User Query ────────►│ Router      │──► 단순 질의 → 1-pass RAG
                    └──────┬──────┘
                           │ 복잡 질의
                           ▼
                    ┌─────────────┐
                    │ Planner     │──► sub-query 분해
                    └──────┬──────┘
                           ▼
              ┌────────────────────────┐
              │ Retrieval Loop (bounded)│
              │  retrieve → reflect     │◄── max_iter, timeout
              └────────────┬───────────┘
                           ▼
                    ┌─────────────┐
                    │ Synthesis   │──► SSE stream
                    └─────────────┘
```

**프로덕션 패턴 (95% use case 커버):**

| 패턴 | 용도 | 복잡도 |
|------|------|--------|
| Router | 질의 분류 후 소스/전략 선택 | 낮음 — **MVP 이후 1순위** |
| ReAct | reasoning + tool call 반복 | 중간 |
| Plan-and-Execute | 계획 후 일괄 실행 | 중간 |
| Multi-Agent | 도메인별 전문 에이전트 | 높음 |
| Self-RAG | 생성·검색 품질 자체 평가 | 높음 |

**권장:** Phase 3에서 **Router + 1-pass RAG**로 시작, 품질 메트릭 실패 시 Agentic loop 추가.

### 2.3 루프 상한 (프로덕션 필수)

업계 공통 가드레일 ([production agentic RAG](https://dev.to/aloknecessary/agentic-rag-designing-self-correcting-retrieval-loops-for-production-2lbg)):

| 제한 | 권장값 |
|------|--------|
| `max_iterations` | 3–4 |
| wall-clock timeout | 12s (agentic path) |
| 단순 RAG P99 | < 2s |
| agentic P99 | < 12s (스트리밍으로 체감 완화) |

## 3. 스트리밍·프로토콜

### 3.1 SSE vs WebSocket

| 프로토콜 | 채팅 UX | Hyobee |
|----------|---------|--------|
| **SSE** | 서버→클라이언트 토큰 스트림 | ✅ 레거시 `/xs/aichat/v2/stream/**` |
| WebSocket | 양방향·낮은 지연 | 파일 업로드·멀티모달 시 검토 |
| HTTP chunked | 단순 | SSE 미지원 클라이언트 fallback |

**트렌드:** 엔터프라이즈 챗봇은 **SSE + REST** 조합이 여전히 주류 (Azure HR bot, Salesforce MIAW handoff 등).

### 3.2 스트리밍 UX 패턴

- **토큰 델타** — `data: {"delta":"..."}`
- **상태 이벤트** — `retrieving`, `generating`, `citation` (Agentic 경로)
- **하트비트** — 프록시/Nginx timeout 방지 (`X-Accel-Buffering: no` — 레거시 이미 적용)
- **취소** — 클라이언트 disconnect 시 upstream WebClient cancel

## 4. 검색·지식 계층

### 4.1 하이브리드 검색

- **Dense (embedding)** + **Sparse (BM25)** 병합
- **Reranker** (cross-encoder 또는 LLM RankGPT-style) — 선택
- **메타데이터 필터** — 팀/게시판 권한 (`board-auth` — Hyobee 도메인 요구)

### 4.2 멀티 테넌트·권한

Hyobee는 이미 `loginDeptCode`, `board-auth`로 **행 수준 접근** 패턴 보유. 신규 RAG 계층에서:

- Retrieval **전** 권한 필터 (ACL bitset 또는 DB join)
- 응답 **후** citation에 소스 문서 ID (감사·환각 추적)

## 5. 오케스트레이션 프레임워크

| 프레임워크 | 특징 | Hyobee 신규 스택 |
|------------|------|------------------|
| **LangGraph** | 상태 그래프, 루프·조건 분기 | Phase 3+ Python sidecar 또는 JVM에서 직접 구현 |
| Semantic Kernel | .NET/Java, 엔터프라이즈 | Java 팀이면 검토 가능 |
| **Spring AI** | Boot 생태계 통합 | Boot 4.1 + `chat-api` **1순위 후보** |
| 자체 Orchestrator | Use Case 레이어 | Clean Architecture와 정합 |

**권장:** Phase 1–2는 **Port/Adapter + WebClient**로 Dummy/WRTN; Phase 3에서 **Spring AI** 또는 경량 자체 Router 도입 여부 POC.

## 6. 프론트엔드 트렌드

| 트렌드 | 설명 | React 적용 |
|--------|------|------------|
| Chat UI 컴포넌트 | 메시지 리스트, markdown, code block | `react-markdown` + syntax highlighter |
| Optimistic UI | 전송 즉시 버블 표시 | TanStack Query mutation |
| 스트리밍 markdown | 점진 렌더 | throttle된 re-render |
| 접근성 | WCAG, 키보드 | Phase 2 QA 게이트 |
| i18n | 다국어 | 레거시 `HyobeeI18n` 메시지 키 이전 |

## 7. 관측성·평가

### 7.1 Production 필수

- **Trace:** 질의 → retrieve → LLM 호출 체인 (OpenTelemetry)
- **메트릭:** latency P50/P99, token usage, retrieval hit rate
- **로그:** 구조화 JSON, `conversation_id` 상관 ID

### 7.2 품질 평가 (오프라인)

- Golden set + LLM-as-judge (선택)
- Faithfulness / citation coverage — Agentic RAG 단계에서 필수

## 8. 엔터프라이즈 패턴 (레거시 대비)

| 패턴 | 예시 | Hyobee |
|------|------|--------|
| Live agent handoff | Salesforce MIAW + SSE | 미구현 — 요구 시 별도 |
| 세션 복원 | Cosmos + in-memory | HTTP session → JWT/Redis 검토 |
| Multi-strategy RAG | 국가별 + 글로벌 인덱스 | `board-auth`와 유사 개념 |
| Config 외부화 | App Config + Key Vault | `XtrmConfig.properties` → env/secret |

## 9. KC-007-modernization 로드맵 매핑

| Phase | 트렌드 반영 |
|-------|-------------|
| 0 | SSE endpoint, Dummy RAG, OTel scaffold |
| 1 | React 스트리밍 UI, OpenAPI contract |
| 2 | 하이브리드 검색 POC (dummy → staging index) |
| 3 | Router agent, bounded retrieval loop |
| 4 | Multi-agent / Self-RAG (요구·메트릭 기반) |

## 10. 참고 링크

- [Spring Boot 4.1 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.1-Release-Notes)
- [Google — Agentic RAG](https://research.google/blog/unlocking-dependable-responses-with-gemini-enterprise-agent-platforms-agentic-rag/)
- [Agentic RAG Enterprise Guide (2026)](https://heeya.fr/en/blog/agentic-rag-implementation-enterprise-2026)
- [Self-correcting retrieval loops](https://dev.to/aloknecessary/agentic-rag-designing-self-correcting-retrieval-loops-for-production-2lbg)
- [Unstructured — Agentic RAG](https://unstructured.io/insights/from-static-to-smart-agentic-rag-for-enterprise-ai)
