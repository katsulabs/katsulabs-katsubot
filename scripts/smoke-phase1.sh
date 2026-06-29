#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:8081}"
TOKEN="${TOKEN:-dev-token}"
RAG_BASE="${RAG_BASE:-http://localhost:8090}"

echo "== AI Gateway health (8090) =="
curl -sf "${RAG_BASE}/_health" | grep -q '"status":"ok"'

echo "== katsubot-api health =="
curl -sf "${API_BASE}/actuator/health" | grep -q '"status":"UP"'

echo "== create conversation =="
CONV_ID=$(curl -sf -X POST "${API_BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title":"smoke"}' | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [[ -z "${CONV_ID}" ]]; then
  echo "conversation id missing" >&2
  exit 1
fi
echo "conversation: ${CONV_ID}"

echo "== send message (SSE) =="
BODY=$(curl -sf -N -X POST "${API_BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"content":"smoke test"}')

echo "${BODY}" | grep -q 'event:delta'
echo "${BODY}" | grep -q 'event:done'

echo "OK — Phase 1 smoke passed"
