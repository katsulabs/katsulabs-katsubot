# Katsubot — 모노레포

| 모듈 | 경로 | 명령 |
|------|------|------|
| **chat-api** (Boot 4.1, JDK 25) | `services/chat-api` | `./gradlew :services:chat-api:test` |
| **chat-web** (React) | `apps/chat-web` | `npm ci && npm test && npm run build` |
| **legacy hyobee** (Boot 2.7 WAR) | `legacy/hyobee` | `mvn test` (JDK 21) |
| **infra** | `infra/` | `docker compose up` (Postgres + dummy-rag) |

## 로컬 (Phase 0)

```bash
# chat-api
./gradlew :services:chat-api:bootRun   # :8081/actuator/health

# chat-web
cd apps/chat-web && npm run dev        # :5173

# dummy-rag + Postgres
cd infra && docker compose up -d
curl -s http://localhost:8090/_health
```

## 문서

- [KC-007-modernization-plan.md](docs/KC-007-modernization-plan.md) — 작업계획 (승인됨)
- [KC-000-project-conventions.md](docs/harness/KC-000-project-conventions.md) — 운영 규칙

레거시 Hyobee 상세 실행 방법은 기존 README 본문 및 `legacy/hyobee/`를 참고합니다.
