# Katsubot — 모노레포

| 모듈 | 경로 | 명령 |
|------|------|------|
| **katsubot-api** (Boot 4.1, JDK 25) | `services/katsubot-api` | `./gradlew :services:katsubot-api:test` |
| **katsubot-web** (React) | `apps/katsubot-web` | `npm ci && npm test && npm run build` |
| **legacy hyobee** (Boot 2.7 WAR) | `legacy/hyobee` | `mvn test` (JDK 21) |
| **infra** | `infra/` | Postgres · [AI Gateway](https://github.com/katsulabs/katsulabs-ai-gateway) |

## 로컬 (Phase 0+)

```bash
# 1) AI Gateway (WRTN + completions — hyobee-rag-db 필요)
cp infra/.env.example infra/.env   # DB 비밀번호·JWT 채우기
./scripts/up-ai-gateway.sh
curl -s http://localhost:8090/_health

# 2) katsubot-api
./scripts/boot-katsubot-api.sh   # :8081

# 3) katsubot-web
cd apps/katsubot-web && npm run dev                  # :5173
```

**CI·오프라인 스텁** (8090 — gateway와 동시 기동 금지):

```bash
cd infra && docker compose --profile stub up -d dummy-rag
```

환경 변수 예시: `infra/.env.example` (`RAG_SERVICE_BASE_URL`, `RAG_SERVICE_MODE`, `LLM_API_KEY`)

## 문서

- [02-modernization-plan.md](docs/02-modernization-plan.md) — 작업계획 (승인됨)
- [01-project-conventions.md](docs/01-project-conventions.md) — 운영 규칙
- [docs/README.md](docs/README.md) — 문서 목차

레거시 Hyobee 상세 실행 방법은 기존 README 본문 및 `legacy/hyobee/`를 참고합니다.
