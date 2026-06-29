#!/usr/bin/env bash
set -euo pipefail

PROXY_BASE="${PROXY_BASE:-http://localhost:8088}"
TOKEN="${TOKEN:-dev-token}"
RAG_BASE="${RAG_BASE:-http://localhost:8090}"

echo "== Phase 4 cutover smoke (G8) =="
echo "proxy: ${PROXY_BASE}, rag: ${RAG_BASE}"

echo "== proxy healthz =="
curl -sf "${PROXY_BASE}/healthz" | grep -q 'ok'

echo "== katsubot-web SPA (root) =="
SPA_BODY=$(curl -sf "${PROXY_BASE}/")
echo "${SPA_BODY}" | grep -q '<div id="root">'

echo "== RAG health =="
curl -sf "${RAG_BASE}/_health" | grep -q '"status":"ok"'

echo "== create conversation via proxy =="
CONV_ID=$(curl -sf -X POST "${PROXY_BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"title":"smoke-phase4"}' | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [[ -z "${CONV_ID}" ]]; then
  echo "conversation id missing" >&2
  exit 1
fi

echo "== send message (SSE via proxy) =="
BODY=$(curl -sf -N -X POST "${PROXY_BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{"content":"smoke phase4 cutover"}')

echo "${BODY}" | grep -q 'event:delta'
echo "${BODY}" | grep -q 'event:done'

echo "== list messages (history) =="
curl -sf "${PROXY_BASE}/api/v1/conversations/${CONV_ID}/messages" \
  -H "Authorization: Bearer ${TOKEN}" | grep -q '"role":"assistant"'

echo "== cleanup =="
curl -sf -X DELETE "${PROXY_BASE}/api/v1/conversations" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"conversation_ids\":[\"${CONV_ID}\"]}" | grep -q '"deleted_count":1'

echo "OK — Phase 4 cutover smoke (G8) passed"
