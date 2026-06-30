#!/usr/bin/env bash
# POC EC2 2대 + (선택) Security Group 삭제
set -euo pipefail

STATE_FILE="${POC_STATE_FILE:-/tmp/katsubot-poc-ec2.state}"
REGION="${AWS_REGION:-ap-northeast-2}"
DELETE_SG="${DELETE_SG:-false}"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "State file not found: $STATE_FILE" >&2
  echo "Terminate manually: EC2 console → Instances → Terminate" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

IDS=()
[[ -n "${GATEWAY_INSTANCE_ID:-}" ]] && IDS+=("$GATEWAY_INSTANCE_ID")
[[ -n "${KATSUBOT_INSTANCE_ID:-}" ]] && IDS+=("$KATSUBOT_INSTANCE_ID")

if [[ ${#IDS[@]} -eq 0 ]]; then
  echo "No instance IDs in state file" >&2
  exit 1
fi

echo "Terminating: ${IDS[*]}"
aws ec2 terminate-instances --region "$REGION" --instance-ids "${IDS[@]}"
aws ec2 wait instance-terminated --region "$REGION" --instance-ids "${IDS[@]}"
echo "Instances terminated."

if [[ "$DELETE_SG" == "true" ]]; then
  for sg in "${GATEWAY_SG:-}" "${KATSUBOT_SG:-}"; do
    [[ -z "$sg" ]] && continue
    aws ec2 delete-security-group --region "$REGION" --group-id "$sg" 2>/dev/null && \
      echo "Deleted SG $sg" || echo "Skip SG $sg (in use or default rules)"
  done
fi

rm -f "$STATE_FILE"
echo "POC AWS teardown done. State file removed."
