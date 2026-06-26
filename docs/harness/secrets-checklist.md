# Secrets·배포 체크리스트 (Phase 3)

> `katsubot-secrets-prep` 스킬 기반. 배포 전 QA·Infra 공동 점검.

## 금지

- API 키·DB 비밀번호·JWT 서명 키를 git에 커밋
- `.env` 파일 커밋 (`.gitignore` 확인)

## 환경 변수 (chat-api)

| 변수 | 용도 | 저장소 |
|------|------|--------|
| `RAG_SERVICE_BASE_URL` | 운영 RAG HTTP/SSE | GitHub Environment `staging` / `production` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Trace 수집기 | Environment secret |
| `MANAGEMENT_TRACING_ENABLED` | 로컬 `false`, 스테이징 `true` | 프로필·env |
| `KATSUBOT_LEGACY_BASE_URL` | `legacy-bridge` 프로필 | staging only |
| `SPRING_DATASOURCE_*` | JPA 프로필 DB | Environment secret |
| JWT signing key | `katsubot.auth.jwt-secret` (향후) | Environment secret |

## 환경 변수 (chat-web)

| 변수 | 용도 |
|------|------|
| `VITE_AUTH_TOKEN` | 로컬 개발 전용 (운영 금지) |
| URL `?jwt=` / `?token=` | 레거시 handoff — sessionStorage 저장 후 URL 정리 |

## 로컬 개발

- `application-local.yml` — gitignore (JVM override 권장)
- `docker-compose.yml` — 더미 값만
- CI — `in-memory` / Testcontainers

## 체크리스트

- [x] `.gitignore`에 `*.local.yml`, `.env` 포함
- [x] CI는 test profile / Testcontainers
- [ ] staging Environment secrets 등록 (RAG URL, OTLP, DB)
- [ ] production 승인 후 동일 항목 복제

## 참고

- [rag-ops-contract.md](../modernization/rag-ops-contract.md)
- [KC-007-phase3-kickoff.md](./KC-007-phase3-kickoff.md)
