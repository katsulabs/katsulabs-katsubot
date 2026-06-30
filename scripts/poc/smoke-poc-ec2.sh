#!/usr/bin/env bash
# POC EC2 스모크 — Gateway + Katsubot E2E (EC2-2에서 실행)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ENV_FILE="${1:-$ROOT/infra/poc-ec2/.env}"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

GATEWAY_URL="${RAG_SERVICE_BASE_URL:-http://localhost:8090}"
BASE_URL="${KATSUBOT_BASE_URL:-http://localhost:${KATSUBOT_HTTP_PORT:-80}}"
TOKEN="${KATSUBOT_AUTH_DEV_TOKEN:-$("$ROOT/scripts/mint-hyobee-dev-jwt.sh" "$ENV_FILE")}"

echo "==> Gateway: $GATEWAY_URL/_health"
curl -sf "$GATEWAY_URL/_health" | grep -q '"status":"ok"'

echo "==> Katsubot web: $BASE_URL/healthz"
curl -sf "$BASE_URL/healthz" | grep -q ok

echo "==> katsubot-api via nginx: $BASE_URL/api/v1/conversations"
curl -sf -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/v1/conversations" >/dev/null

echo "==> Create conversation + SSE"
conv="$(curl -sf -X POST "$BASE_URL/api/v1/conversations" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"poc-ec2-smoke","chat_category":"internal_rules"}')"
conv_id="$(echo "$conv" | python3 -c 'import json,sys; print(json.load(sys.stdin)["id"])')"

sse="$(curl -sfN --max-time 90 -X POST "$BASE_URL/api/v1/conversations/${conv_id}/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/event-stream' \
  -d '{"content":"POC smoke hello","chat_category":"internal_rules"}')"
echo "$sse" | grep -qE 'event:\s*delta' || { echo "FAIL: missing event: delta"; exit 1; }
echo "$sse" | grep -qE 'event:\s*done' || { echo "FAIL: missing event: done"; exit 1; }

echo "POC EC2 smoke OK"
