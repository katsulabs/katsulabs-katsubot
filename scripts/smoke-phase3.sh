#!/usr/bin/env bash
set -euo pipefail

API_BASE="${API_BASE:-http://localhost:8081}"
TOKEN="${TOKEN:-dev-token}"
RAG_BASE="${RAG_BASE:-http://localhost:8090}"

echo "== Phase 3 smoke (G6) =="
echo "target: ${API_BASE}, rag: ${RAG_BASE}"

echo "== dummy-rag / RAG health =="
curl -sf "${RAG_BASE}/_health" | grep -q '"status":"ok"'

echo "== chat-api health (incl. rag indicator) =="
HEALTH_JSON=$(curl -sf "${API_BASE}/actuator/health")
echo "${HEALTH_JSON}" | grep -q '"status":"UP"'
echo "${HEALTH_JSON}" | grep -q '"rag"'

echo "== create conversation =="
CONV_ID=$(curl -sf -X POST "${API_BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title":"smoke-phase3"}' | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [[ -z "${CONV_ID}" ]]; then
  echo "conversation id missing" >&2
  exit 1
fi

echo "== send message (SSE) =="
BODY=$(curl -sf -N -X POST "${API_BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"content":"smoke phase3 rag"}')

echo "${BODY}" | grep -q 'event:delta'
echo "${BODY}" | grep -q 'event:done'

echo "== list messages (history after RAG) =="
curl -sf "${API_BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" | grep -q '"role":"assistant"'

echo "== cleanup =="
curl -sf -X DELETE "${API_BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"conversation_ids\":[\"${CONV_ID}\"]}" | grep -q '"deleted_count":1'

echo "OK — Phase 3 smoke (G6) passed"
