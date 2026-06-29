#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GW_REPO="${AI_GATEWAY_REPO:-$ROOT/../katsulabs-ai-gateway}"
KATSUBOT_ENV="$ROOT/infra/.env"
GW_ENV="$GW_REPO/infra/.env"

if [[ ! -d "$GW_REPO" ]]; then
  echo "katsulabs-ai-gateway not found: $GW_REPO" >&2
  echo "  git clone https://github.com/katsulabs/katsulabs-ai-gateway \"$GW_REPO\"" >&2
  exit 1
fi

if [[ -f "$KATSUBOT_ENV" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$KATSUBOT_ENV" && set +a
fi

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

if [[ ! -f "$GW_ENV" && -f "$ROOT/infra/.env.example" ]]; then
  echo "Gateway infra/.env missing — copy infra/.env.example values into $GW_ENV" >&2
  exit 1
fi

if docker ps --format '{{.Names}}' | grep -q '^hyobee-rag-db$'; then
  echo "Using hyobee-rag-db on host port $(docker port hyobee-rag-db 5432 2>/dev/null | cut -d: -f2 || echo 15433)"
else
  echo "WARN: hyobee-rag-db not running — WRTN /api/v1/** needs Postgres (GATEWAY_WRTN_ENABLED=true)" >&2
fi

cd "$GW_REPO"
docker compose -f infra/docker-compose.java.yml --env-file infra/.env up --build -d

echo "Gateway health:"
curl -sf "http://localhost:${GATEWAY_PORT:-8090}/_health" || true
echo
