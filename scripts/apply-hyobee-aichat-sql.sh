#!/usr/bin/env bash
# hyobee-admin-db(xtrmvob)에 aichat SQL 마이그레이션 적용 (P5-C V3 등)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SQL_DIR="$ROOT/legacy/hyobee/src/main/resources/sql/aichat"

DB_CONTAINER="${HYOBEE_ADMIN_DB_CONTAINER:-hyobee-admin-db}"
DB_USER="${HYOBEE_ADMIN_DB_USER:-XtrmSalesDev}"
DB_NAME="${HYOBEE_ADMIN_DB_NAME:-xtrmvob}"

if ! docker ps --format '{{.Names}}' | grep -qx "$DB_CONTAINER"; then
  echo "FAIL: container '$DB_CONTAINER' not running" >&2
  echo "  Start hyobee-admin-db (host port 53254) first." >&2
  exit 1
fi

apply() {
  local file="$1"
  echo "==> $file"
  docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 < "$file"
}

# V3: conversations integer[] → text[] (Gateway UUID)
if [[ -f "$SQL_DIR/V3__conversations_uuid_text_array.sql" ]]; then
  col_type="$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -tAc \
    "SELECT format_type(a.atttypid, a.atttypmod) FROM pg_attribute a JOIN pg_class c ON a.attrelid=c.oid WHERE c.relname='chat_viewable_teams' AND a.attname='conversations' AND NOT a.attisdropped;" \
    | tr -d '[:space:]')"
  if [[ "$col_type" == "text[]" ]]; then
    echo "SKIP: chat_viewable_teams.conversations already text[]"
  else
    apply "$SQL_DIR/V3__conversations_uuid_text_array.sql"
  fi
fi

echo "PASS: apply-hyobee-aichat-sql"
