#!/usr/bin/env bash
# HyobeeJwtTokenServiceImpl 과 동일한 claim 으로 로컬 dev JWT 발급 (HS512)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${1:-$ROOT/infra/.env}"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

export GATEWAY_JWT_SECRET="${GATEWAY_JWT_SECRET:-yZp3n4W8LkqS1tDbE9mV0rXuA7wC2pTfG5hQ8jR3xU6sNcKdF4vB1zYeH0aMiOwP}"
export GATEWAY_DEV_USER_ID="${GATEWAY_DEV_USER_ID:-test20230128}"
export GATEWAY_DEV_CORP_CODE="${GATEWAY_DEV_CORP_CODE:-00}"
export GATEWAY_DEV_PG_CODE="${GATEWAY_DEV_PG_CODE:-H}"
export GATEWAY_DEV_PU_CODE="${GATEWAY_DEV_PU_CODE:-H01}"
export GATEWAY_DEV_TEAM_CODE="${GATEWAY_DEV_TEAM_CODE:-65H00}"
export GATEWAY_DEV_ROLES="${GATEWAY_DEV_ROLES:-ROLE_USER,ROLE_ADMIN}"
export GATEWAY_DEV_JWT_EXP_HOURS="${GATEWAY_DEV_JWT_EXP_HOURS:-87600}"

python3 << 'PY'
import jwt, time, os
secret = os.environ["GATEWAY_JWT_SECRET"]
now = int(time.time())
payload = {
    "sub": os.environ["GATEWAY_DEV_USER_ID"],
    "corpCode": os.environ["GATEWAY_DEV_CORP_CODE"],
    "pgCode": os.environ["GATEWAY_DEV_PG_CODE"],
    "puCode": os.environ["GATEWAY_DEV_PU_CODE"],
    "teamCode": os.environ["GATEWAY_DEV_TEAM_CODE"],
    "roles": os.environ["GATEWAY_DEV_ROLES"].split(","),
    "iat": now,
    "exp": now + int(os.environ["GATEWAY_DEV_JWT_EXP_HOURS"]) * 3600,
}
print(jwt.encode(payload, secret, algorithm="HS512"))
PY
