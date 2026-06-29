#!/usr/bin/env bash
# legacy/hyobee 개발 서버 — WRTN_BASEURL은 XtrmConfig.properties (기본 http://127.0.0.1:8090)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/infra/.env"

if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a && source "$ENV_FILE" && set +a
fi

export JAVA_HOME="${JAVA_HOME:-$(/usr/libexec/java_home -v 21)}"
export WRTN_BASEURL="${WRTN_BASEURL:-http://127.0.0.1:8090}"

mkdir -p /tmp/hyobee/{upload,clob,files,temp,download}

cd "$ROOT/legacy/hyobee"
exec mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXTRMDB_JDBC_URL=jdbc:postgresql://localhost:53254/xtrmvob?tcpKeepAlive=true&applicationName=xtrmVOB -DXTRMDB_JDBC_USER_ID=XtrmSalesDev -DXTRMDB_JDBC_USER_PW=Xtrm-Sales#Dev#86 -DCLOB_FILE_ROOT_PATH=/tmp/hyobee/clob/ -DFILE_UPLOAD_ROOT_PATH=/tmp/hyobee/files/ -DFILE_UPLOAD_TEMP_PATH=/tmp/hyobee/files/temp/ -DFILE_DOWNLOAD_TEMP_ROOT_PATH=/tmp/hyobee/files/download/ -DAI_CHAT_UPLOAD_PATH=/tmp/hyobee/upload/ -DWRTN_BASEURL=${WRTN_BASEURL}"
