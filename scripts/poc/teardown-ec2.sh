#!/usr/bin/env bash
# POC EC2 종료 — compose down + 볼륨 삭제 (데이터 초기화)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
POC_DIR="$ROOT/infra/poc-ec2"
ROLE="${1:-}"

usage() {
  echo "Usage: $0 gateway|katsubot|all" >&2
  exit 1
}

down_gateway() {
  cd "$POC_DIR"
  docker compose -f docker-compose.gateway-ec2.yml --env-file .env down -v --remove-orphans 2>/dev/null || \
    docker compose -f docker-compose.gateway-ec2.yml down -v --remove-orphans
  echo "Gateway stack removed (rag-db volume deleted)"
}

down_katsubot() {
  cd "$POC_DIR"
  docker compose -f docker-compose.katsubot-ec2.yml --env-file .env down -v --remove-orphans 2>/dev/null || \
    docker compose -f docker-compose.katsubot-ec2.yml down -v --remove-orphans
  echo "Katsubot stack removed"
}

case "$ROLE" in
  gateway) down_gateway ;;
  katsubot) down_katsubot ;;
  all)
    down_katsubot || true
    down_gateway || true
    ;;
  *) usage ;;
esac

echo "POC teardown done. EC2 인스턴스는 AWS 콘솔/CLI에서 terminate 하세요."
