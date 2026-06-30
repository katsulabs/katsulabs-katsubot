#!/usr/bin/env bash
# EC2-2 — katsubot-web + katsubot-api 기동
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POC_DIR="$ROOT/infra/poc-ec2"
ENV_FILE="$POC_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — cp infra/poc-ec2/.env.katsubot.example infra/poc-ec2/.env" >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

if [[ -z "${KATSUBOT_AUTH_DEV_TOKEN:-}" ]]; then
  if command -v python3 >/dev/null 2>&1; then
    echo "KATSUBOT_AUTH_DEV_TOKEN empty — minting dev JWT..."
    KATSUBOT_AUTH_DEV_TOKEN="$("$ROOT/scripts/mint-hyobee-dev-jwt.sh" "$ENV_FILE")"
    export KATSUBOT_AUTH_DEV_TOKEN
  else
    echo "WARN: python3 missing — set KATSUBOT_AUTH_DEV_TOKEN in $ENV_FILE" >&2
  fi
fi

gateway_url="${RAG_SERVICE_BASE_URL:?RAG_SERVICE_BASE_URL required}"
echo "Checking Gateway at $gateway_url/_health ..."
curl -sf "$gateway_url/_health" | grep -q '"status":"ok"' || {
  echo "FAIL: Gateway unreachable from this host (SG / RAG_SERVICE_BASE_URL?)" >&2
  exit 1
}

cd "$POC_DIR"
docker compose -f docker-compose.katsubot-ec2.yml --env-file .env up --build -d

echo "Waiting for katsubot-api health..."
for _ in $(seq 1 30); do
  if docker compose -f docker-compose.katsubot-ec2.yml exec -T katsubot-api \
    curl -sf http://127.0.0.1:8081/actuator/health >/dev/null 2>&1; then
    break
  fi
  sleep 3
done

port="${KATSUBOT_HTTP_PORT:-80}"
echo "Katsubot POC ready — http://$(curl -sf http://checkip.amazonaws.com 2>/dev/null || echo localhost):${port}"
echo "Dev JWT (Authorization: Bearer ...):"
echo "${KATSUBOT_AUTH_DEV_TOKEN:-<set KATSUBOT_AUTH_DEV_TOKEN in .env>}"
