#!/usr/bin/env bash
# OpenAPI 계약·런타임 문서에서 API path 목록 추출
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTRACT="${ROOT}/packages/api-contract/openapi.yaml"
CHAT_API_URL="${CHAT_API_URL:-http://localhost:8081}"

echo "=== packages/api-contract/openapi.yaml ==="
if command -v yq >/dev/null 2>&1; then
  yq '.paths | keys | .[]' "$CONTRACT"
else
  grep -E '^  /' "$CONTRACT" | sed 's/:$//' | awk '{print $1}'
fi

echo ""
echo "=== chat-api runtime (/v3/api-docs) ==="
if curl -sf "${CHAT_API_URL}/v3/api-docs" >/tmp/katsubot-openapi.json 2>/dev/null; then
  if command -v jq >/dev/null 2>&1; then
    jq -r '.paths | keys[]' /tmp/katsubot-openapi.json | sort
  else
    echo "(jq 없음 — /tmp/katsubot-openapi.json 저장됨)"
  fi
else
  echo "(chat-api 미기동 — CHAT_API_URL=${CHAT_API_URL})"
fi

echo ""
echo "=== outbound (문서 고정) ==="
cat <<'EOF'
GET  /_health          → RAG_SERVICE_BASE_URL
POST /v1/completions   → RAG_SERVICE_BASE_URL
GET  /xs/aichat/v2/board-auth → KATSUBOT_LEGACY_BASE_URL (legacy-bridge)
EOF
