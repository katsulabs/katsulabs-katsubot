#!/usr/bin/env bash
# EC2 공통 — Docker Engine + Compose plugin (Amazon Linux 2023 / Ubuntu 22.04)
set -euo pipefail

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  echo "Docker already installed: $(docker --version)"
  docker compose version
  exit 0
fi

if [[ -f /etc/os-release ]]; then
  # shellcheck disable=SC1091
  source /etc/os-release
else
  echo "Unsupported OS (no /etc/os-release)" >&2
  exit 1
fi

case "${ID:-}" in
  amzn)
    sudo dnf update -y
    sudo dnf install -y docker git curl
    sudo systemctl enable --now docker
    sudo usermod -aG docker "${USER}"
    ;;
  ubuntu|debian)
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl git
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/${ID}/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/${ID} \
      $(. /etc/os-release && echo "${VERSION_CODENAME}") stable" |
      sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker "${USER}"
    ;;
  *)
    echo "Unsupported OS: ${ID}. Install Docker manually." >&2
    exit 1
    ;;
esac

echo "Docker installed. Re-login or run: newgrp docker"
