#!/usr/bin/env bash
# Hyobee SECRET_KEY (legacy XtrmConfig.properties) — katsubot-api·Gateway 공통 JWT 서명 키
resolve_hyobee_jwt_secret() {
  echo "${HYOBEE_JWT_SECRET:-${KATSUBOT_AUTH_JWT_SECRET:-${GATEWAY_JWT_SECRET:-}}}"
}

export_hyobee_jwt_env() {
  local secret
  secret="$(resolve_hyobee_jwt_secret)"
  if [[ -z "$secret" ]]; then
    return 0
  fi
  export HYOBEE_JWT_SECRET="$secret"
  export KATSUBOT_AUTH_JWT_SECRET="$secret"
  export GATEWAY_JWT_SECRET="$secret"
}
