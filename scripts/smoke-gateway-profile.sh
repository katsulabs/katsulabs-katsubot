#!/usr/bin/env bash
# katsubot-api gateway 프로필 + live AI Gateway E2E (P5-B)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/infra/.env"
BASE_URL="${KATSUBOT_API_BASE_URL:-http://localhost:8081}"
GATEWAY_URL="${RAG_SERVICE_BASE_URL:-http://localhost:8090}"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

# shellcheck disable=SC1091
source "$ROOT/scripts/lib/jwt-env.sh"
export_hyobee_jwt_env

if [[ -z "${HYOBEE_JWT_SECRET:-}" ]]; then
  echo "FAIL: HYOBEE_JWT_SECRET / KATSUBOT_AUTH_JWT_SECRET required (infra/.env)"
  exit 1
fi

TOKEN="$("$ROOT/scripts/mint-hyobee-dev-jwt.sh" "$ENV_FILE")"
USER_ID="${GATEWAY_DEV_USER_ID:-test20230128}"

echo "==> Gateway health: $GATEWAY_URL/_health"
curl -sf "$GATEWAY_URL/_health" | grep -q '"status":"ok"'

echo "==> katsubot-api health: $BASE_URL/actuator/health"
curl -sf "$BASE_URL/actuator/health" | grep -q '"status":"UP"'

echo "==> Create conversation (BFF)"
conv="$(curl -sf -X POST "$BASE_URL/api/v1/conversations" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"smoke-gateway","chat_category":"internal_rules"}')"
echo "$conv"
conv_id="$(echo "$conv" | python3 -c 'import json,sys,uuid; cid=json.load(sys.stdin)["id"]; uuid.UUID(cid); print(cid)')"

echo "==> Send message SSE (BFF → Gateway)"
sse="$(curl -sfN --max-time 60 -X POST "$BASE_URL/api/v1/conversations/${conv_id}/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Accept: text/event-stream' \
  -d '{"content":"gateway smoke hi","chat_category":"internal_rules"}')"
echo "$sse"
echo "$sse" | grep -qE 'event:\s*delta' || { echo "FAIL: missing event: delta"; exit 1; }
echo "$sse" | grep -qE 'event:\s*done' || { echo "FAIL: missing event: done"; exit 1; }

echo "==> List messages"
msgs="$(curl -sf "$BASE_URL/api/v1/conversations/${conv_id}/messages?size=20" \
  -H "Authorization: Bearer $TOKEN")"
echo "$msgs"
echo "$msgs" | python3 -c 'import json,sys; b=json.load(sys.stdin); assert len(b["messages"])>=1'

echo "==> List conversations"
curl -sf "$BASE_URL/api/v1/conversations" -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import json,sys; ids=[c['id'] for c in json.load(sys.stdin)]; assert '$conv_id' in ids"

echo "PASS: smoke-gateway-profile (user=$USER_ID conv=$conv_id)"
