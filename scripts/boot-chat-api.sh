#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/infra/.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

export RAG_SERVICE_BASE_URL="${RAG_SERVICE_BASE_URL:-http://localhost:8090}"
export RAG_SERVICE_MODE="${RAG_SERVICE_MODE:-direct}"
export KATSUBOT_AUTH_DEV_BYPASS="${KATSUBOT_AUTH_DEV_BYPASS:-true}"
export KATSUBOT_AUTH_DEV_TOKEN="${KATSUBOT_AUTH_DEV_TOKEN:-dev-token}"
# 레거시 로그인 JWT — infra/.env 의 KATSUBOT_AUTH_JWT_SECRET
# hyobee-admin-db 로그인 — infra/.env 의 KATSUBOT_ADMIN_DB_*

cd "$ROOT"
exec ./gradlew :services:chat-api:bootRun
