#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/infra/.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

export RAG_SERVICE_BASE_URL="${RAG_SERVICE_BASE_URL:-http://localhost:8090}"
export RAG_SERVICE_MODE="${RAG_SERVICE_MODE:-direct}"
export SPRING_PROFILES_ACTIVE="${SPRING_PROFILES_ACTIVE:-gateway}"
export KATSUBOT_AUTH_DEV_BYPASS="${KATSUBOT_AUTH_DEV_BYPASS:-true}"
export KATSUBOT_AUTH_DEV_TOKEN="${KATSUBOT_AUTH_DEV_TOKEN:-dev-token}"
export KATSUBOT_ADMIN_DB_URL="${KATSUBOT_ADMIN_DB_URL:-}"
export KATSUBOT_ADMIN_DB_USER="${KATSUBOT_ADMIN_DB_USER:-}"
export KATSUBOT_ADMIN_DB_PASSWORD="${KATSUBOT_ADMIN_DB_PASSWORD:-}"
# JWT 서명: HYOBEE_JWT_SECRET → KATSUBOT_AUTH_JWT_SECRET (scripts/lib/jwt-env.sh)

cd "$ROOT"
exec ./gradlew :services:katsubot-api:bootRun
