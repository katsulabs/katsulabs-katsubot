#!/usr/bin/env bash
# EC2-1 — AI Gateway + WRTN Postgres 기동
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POC_DIR="$ROOT/infra/poc-ec2"
ENV_FILE="$POC_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE — cp infra/poc-ec2/.env.gateway.example infra/poc-ec2/.env" >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a && source "$ENV_FILE" && set +a

if [[ ! -d "${AI_GATEWAY_REPO:-}" ]]; then
  echo "katsulabs-ai-gateway not found: ${AI_GATEWAY_REPO:-}" >&2
  echo "  git clone https://github.com/katsulabs/katsulabs-ai-gateway \"${AI_GATEWAY_REPO:-$HOME/katsulabs-ai-gateway}\"" >&2
  exit 1
fi

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

cd "$POC_DIR"
docker compose -f docker-compose.gateway-ec2.yml --env-file .env up --build -d

echo "Waiting for Gateway health..."
for _ in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:${GATEWAY_BIND:-8090}/_health" >/dev/null 2>&1; then
    curl -s "http://127.0.0.1:${GATEWAY_BIND:-8090}/_health"
    echo
    echo "Gateway ready on :${GATEWAY_BIND:-8090}"
    exit 0
  fi
  sleep 3
done

echo "FAIL: Gateway health timeout" >&2
docker compose -f docker-compose.gateway-ec2.yml logs --tail=50 ai-gateway >&2 || true
exit 1
