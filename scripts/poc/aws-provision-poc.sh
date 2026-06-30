#!/usr/bin/env bash
# POC용 EC2 2대 + Security Group 2개 생성 (Default VPC)
set -euo pipefail

REGION="${AWS_REGION:-ap-northeast-2}"
KEY_NAME="${KEY_NAME:?KEY_NAME required (e.g. export KEY_NAME=katsubot-poc)}"
INSTANCE_TYPE="${INSTANCE_TYPE:-t3.medium}"
VOLUME_GB="${VOLUME_GB:-30}"
NAME_PREFIX="${NAME_PREFIX:-katsubot-poc}"

MY_IP="$(curl -sf https://checkip.amazonaws.com)/32"
echo "Region: $REGION  My IP: $MY_IP  Key: $KEY_NAME"

VPC_ID="$(aws ec2 describe-vpcs --region "$REGION" \
  --filters Name=isDefault,Values=true \
  --query 'Vpcs[0].VpcId' --output text)"
if [[ -z "$VPC_ID" || "$VPC_ID" == "None" ]]; then
  echo "FAIL: Default VPC not found in $REGION" >&2
  exit 1
fi
echo "Default VPC: $VPC_ID"

# Amazon Linux 2023 x86_64
AMI_ID="$(aws ec2 describe-images --region "$REGION" \
  --owners amazon \
  --filters \
    Name=name,Values='al2023-ami-2023*-kernel-6.1-x86_64' \
    Name=state,Values=available \
  --query 'sort_by(Images, &CreationDate)[-1].ImageId' --output text)"
echo "AMI: $AMI_ID"

create_sg() {
  local name="$1"
  aws ec2 create-security-group --region "$REGION" \
    --group-name "$name" --description "Katsubot POC $name" \
    --vpc-id "$VPC_ID" \
    --query 'GroupId' --output text 2>/dev/null || \
  aws ec2 describe-security-groups --region "$REGION" \
    --filters "Name=group-name,Values=$name" "Name=vpc-id,Values=$VPC_ID" \
    --query 'SecurityGroups[0].GroupId' --output text
}

KATSUBOT_SG="$(create_sg "${NAME_PREFIX}-katsubot-sg")"
GATEWAY_SG="$(create_sg "${NAME_PREFIX}-gateway-sg")"
echo "Security groups: katsubot=$KATSUBOT_SG gateway=$GATEWAY_SG"

# SSH — My IP only
aws ec2 authorize-security-group-ingress --region "$REGION" \
  --group-id "$KATSUBOT_SG" --protocol tcp --port 22 --cidr "$MY_IP" 2>/dev/null || true
aws ec2 authorize-security-group-ingress --region "$REGION" \
  --group-id "$GATEWAY_SG" --protocol tcp --port 22 --cidr "$MY_IP" 2>/dev/null || true

# Katsubot HTTP (POC demo)
aws ec2 authorize-security-group-ingress --region "$REGION" \
  --group-id "$KATSUBOT_SG" --protocol tcp --port 80 --cidr 0.0.0.0/0 2>/dev/null || true

# Gateway 8090 ← Katsubot SG only
aws ec2 authorize-security-group-ingress --region "$REGION" \
  --group-id "$GATEWAY_SG" --protocol tcp --port 8090 \
  --source-group "$KATSUBOT_SG" 2>/dev/null || true

launch() {
  local name="$1" sg="$2"
  aws ec2 run-instances --region "$REGION" \
    --image-id "$AMI_ID" \
    --instance-type "$INSTANCE_TYPE" \
    --key-name "$KEY_NAME" \
    --security-group-ids "$sg" \
    --block-device-mappings "[{\"DeviceName\":\"/dev/xvda\",\"Ebs\":{\"VolumeSize\":${VOLUME_GB},\"VolumeType\":\"gp3\",\"DeleteOnTermination\":true}}]" \
    --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${name}},{Key=Project,Value=katsubot-poc}]" \
    --query 'Instances[0].InstanceId' --output text
}

echo "Launching Gateway EC2..."
GW_ID="$(launch "${NAME_PREFIX}-gateway" "$GATEWAY_SG")"
echo "Launching Katsubot EC2..."
KB_ID="$(launch "${NAME_PREFIX}-katsubot" "$KATSUBOT_SG")"

echo "Waiting for instances (running)..."
aws ec2 wait instance-running --region "$REGION" --instance-ids "$GW_ID" "$KB_ID"

describe() {
  aws ec2 describe-instances --region "$REGION" --instance-ids "$1" \
    --query 'Reservations[0].Instances[0].[PublicIpAddress,PrivateIpAddress,State.Name]' \
    --output text
}

read -r GW_PUB GW_PRIV GW_STATE <<< "$(describe "$GW_ID")"
read -r KB_PUB KB_PRIV KB_STATE <<< "$(describe "$KB_ID")"

STATE_FILE="${POC_STATE_FILE:-/tmp/katsubot-poc-ec2.state}"
cat >"$STATE_FILE" <<EOF
AWS_REGION=$REGION
GATEWAY_INSTANCE_ID=$GW_ID
KATSUBOT_INSTANCE_ID=$KB_ID
GATEWAY_SG=$GATEWAY_SG
KATSUBOT_SG=$KATSUBOT_SG
GATEWAY_PUBLIC_IP=$GW_PUB
GATEWAY_PRIVATE_IP=$GW_PRIV
KATSUBOT_PUBLIC_IP=$KB_PUB
KATSUBOT_PRIVATE_IP=$KB_PRIV
EOF

echo ""
echo "========== POC EC2 ready =========="
echo "State file: $STATE_FILE"
echo ""
echo "Gateway (EC2-1):  $GW_ID"
echo "  Public IP:   $GW_PUB  (SSH only)"
echo "  Private IP:  $GW_PRIV  → RAG_SERVICE_BASE_URL=http://${GW_PRIV}:8090"
echo ""
echo "Katsubot (EC2-2): $KB_ID"
echo "  Public IP:   $KB_PUB  → browser http://${KB_PUB}/"
echo ""
echo "SSH:"
echo "  ssh -i <key.pem> ec2-user@${GW_PUB}   # Gateway"
echo "  ssh -i <key.pem> ec2-user@${KB_PUB}   # Katsubot"
echo ""
echo "Next: docs/poc-ec2-deployment.md §배포 절차"
