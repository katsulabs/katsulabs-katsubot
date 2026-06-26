#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:8081}"
PROXY_BASE="${PROXY_BASE:-}"
TOKEN="${TOKEN:-dev-token}"
RAG_BASE="${RAG_BASE:-http://localhost:8090}"
SSE_LONG_SECONDS="${SSE_LONG_SECONDS:-0}"

request_base() {
  if [[ -n "${PROXY_BASE}" ]]; then
    echo "${PROXY_BASE}"
  else
    echo "${API_BASE}"
  fi
}

BASE="$(request_base)"

echo "== target: ${BASE} (PROXY_BASE=${PROXY_BASE:-<direct>}) =="

echo "== dummy-rag health =="
curl -sf "${RAG_BASE}/_health" | grep -q '"status":"ok"'

echo "== chat-api health =="
if [[ -n "${PROXY_BASE}" ]]; then
  curl -sf "${API_BASE}/actuator/health" | grep -q '"status":"UP"'
else
  curl -sf "${BASE}/actuator/health" | grep -q '"status":"UP"'
fi

if [[ -n "${PROXY_BASE}" ]]; then
  echo "== strangler proxy healthz =="
  curl -sf "${PROXY_BASE}/healthz" | grep -q 'ok'
fi

echo "== create conversation =="
CONV_ID=$(curl -sf -X POST "${BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title":"smoke-phase2"}' | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [[ -z "${CONV_ID}" ]]; then
  echo "conversation id missing" >&2
  exit 1
fi
echo "conversation: ${CONV_ID}"

echo "== list conversations =="
curl -sf "${BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" | grep -q "${CONV_ID}"

echo "== list messages (empty) =="
curl -sf "${BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" | grep -q '"messages"'

echo "== send message (SSE) =="
BODY=$(curl -sf -N -X POST "${BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"content":"smoke phase2"}')

echo "${BODY}" | grep -q 'event:delta'
echo "${BODY}" | grep -q 'event:done'

echo "== list messages (after send) =="
MSG_JSON=$(curl -sf "${BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}")
echo "${MSG_JSON}" | grep -q '"role":"assistant"'

ASSISTANT_ID=$(echo "${MSG_JSON}" | python3 -c "import json,sys; m=json.load(sys.stdin)['messages']; print(next(x['id'] for x in m if x['role']=='assistant'))")

if [[ -n "${ASSISTANT_ID}" ]]; then
  echo "== upsert feedback =="
  curl -sf -X PUT "${BASE}/api/v1/conversations/${CONV_ID}/messages/${ASSISTANT_ID}/feedback" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"feedback_type":"like"}' | grep -q '"feedback_type":"like"'
fi

echo "== board-auth =="
curl -sf "${BASE}/api/v1/board-auth" \
  -H "Authorization: Bearer ${TOKEN}" | grep -q '"items"'

echo "== delete conversation =="
curl -sf -X DELETE "${BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"conversation_ids\":[\"${CONV_ID}\"]}" | grep -q '"deleted_count":1'

if [[ "${SSE_LONG_SECONDS}" -gt 0 ]]; then
  echo "== G5 SSE connection (max ${SSE_LONG_SECONDS}s) =="
  G5_CONV=$(curl -sf -X POST "${BASE}/api/v1/conversations" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"title":"sse-g5"}' | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
  curl -sf -N --max-time "${SSE_LONG_SECONDS}" -X POST "${BASE}/api/v1/conversations/${G5_CONV}/messages" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -d '{"content":"g5 hold"}' | grep -q 'event:done'
  echo "G5 SSE passed (max ${SSE_LONG_SECONDS}s)"
fi

echo "OK — Phase 2 smoke passed"
