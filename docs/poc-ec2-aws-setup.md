# POC EC2 — AWS 설정 가이드

> **대상:** AWS 콘솔·CLI 처음 쓰는 경우  
> **배포:** [poc-ec2-deployment.md](./poc-ec2-deployment.md)  
> **POC 종료:** EC2 terminate → 과금 중단

---

## 한눈에 보기

POC에 필요한 AWS 리소스는 **딱 3가지**입니다.

| # | 리소스 | 개수 | 역할 |
|---|--------|------|------|
| 1 | **키 페어** | 1 | SSH 접속용 (`.pem` 파일) |
| 2 | **보안 그룹** | 2 | 방화벽 (Gateway용 / Katsubot용) |
| 3 | **EC2** | 2 | Gateway 서버 1 + Katsubot 서버 1 |

**RDS·Aurora는 POC에 필요 없습니다.** DB는 EC2-1에서 Docker Postgres(`rag-db`)로 자동 기동됩니다. → [poc-ec2-deployment.md §DB](./poc-ec2-deployment.md#db--별도-rds-필요-없음-poc)

VPC·서브넷·인터넷 게이트웨이는 **기본 VPC(Default VPC)** 를 그대로 쓰면 됩니다. 별도 네트워크 설계 불필요.

```text
[인터넷] ──:80──▶ EC2-2 (Katsubot) ──:8090──▶ EC2-1 (Gateway) ──:443──▶ Gemini API
                      ▲ SSH(:22)              ▲ SSH(:22)
                      └── 내 PC IP만            └── 내 PC IP만
```

---

## 방법 A — AWS 콘솔 (추천, 처음이면 이걸로)

### 0. 사전 준비

1. AWS 계정 로그인 → 우측 상단 **리전** 선택 (예: `ap-northeast-2` 서울)
2. **Gemini API 키** 준비 ([Google AI Studio](https://aistudio.google.com/apikey))
3. 본인 공인 IP 확인: 브라우저에서 `https://checkip.amazonaws.com` → 예: `203.0.113.50`

---

### 1. 키 페어 만들기 (SSH)

1. **EC2** → 왼쪽 **Network & Security** → **Key pairs** → **Create key pair**
2. 설정:
   - Name: `katsubot-poc`
   - Type: `RSA`
   - Format: `.pem` (Mac/Linux) 또는 `.ppk` (Windows PuTTY)
3. **Create** → `.pem` 파일 저장 (다시 받을 수 없음)
4. Mac/Linux:

```bash
chmod 400 ~/Downloads/katsubot-poc.pem
```

---

### 2. 보안 그룹 2개 만들기

**EC2** → **Security Groups** → **Create security group**

#### (1) `katsubot-poc-gateway-sg` — Gateway EC2용

| 항목 | 값 |
|------|-----|
| Name | `katsubot-poc-gateway-sg` |
| VPC | **default** (기본 VPC) |

**Inbound rules** (나중에 Katsubot SG 추가):

| Type | Port | Source | 설명 |
|------|------|--------|------|
| SSH | 22 | **My IP** | 본인 PC에서 SSH |
| Custom TCP | 8090 | *(아직 비움 — 4단계에서 추가)* | Katsubot → Gateway |

**Outbound:** 기본값(All traffic → 0.0.0.0/0) 그대로

#### (2) `katsubot-poc-katsubot-sg` — Katsubot EC2용

| Type | Port | Source | 설명 |
|------|------|--------|------|
| SSH | 22 | **My IP** | 본인 PC SSH |
| HTTP | 80 | `0.0.0.0/0` | 브라우저 데모 (POC 한정) |

> 데모를 본인 PC에서만 보려면 HTTP Source를 **My IP** 로 바꿔도 됩니다.

**Outbound:** 기본값 그대로

#### (3) Gateway SG에 Katsubot 허용 추가

`katsubot-poc-gateway-sg` → **Edit inbound rules** → **Add rule**:

| Type | Port | Source |
|------|------|--------|
| Custom TCP | 8090 | **`katsubot-poc-katsubot-sg`** (보안 그룹 ID 선택) |

> IP 대신 **보안 그룹**을 Source로 넣으면, Katsubot EC2 private IP가 바뀌어도 통신이 유지됩니다.

---

### 3. EC2 2대 기동

**EC2** → **Instances** → **Launch instances** (2번 반복)

#### EC2-1: Gateway

| 항목 | 값 |
|------|-----|
| Name | `katsubot-poc-gateway` |
| AMI | **Amazon Linux 2023** |
| Instance type | `t3.medium` |
| Key pair | `katsubot-poc` |
| Network | default VPC, **Auto-assign public IP: Enable** |
| Security group | `katsubot-poc-gateway-sg` |
| Storage | 30 GiB gp3 |

**Launch instance**

#### EC2-2: Katsubot

| 항목 | 값 |
|------|-----|
| Name | `katsubot-poc-katsubot` |
| (나머지 동일) | |
| Security group | `katsubot-poc-katsubot-sg` |

**Launch instance**

기동 후 **Instances** 목록에서 확인:

| Name | Public IP | Private IP | 용도 |
|------|-----------|------------|------|
| katsubot-poc-gateway | (SSH용) | **기록** → `.env`의 `RAG_SERVICE_BASE_URL` | Gateway |
| katsubot-poc-katsubot | **브라우저 URL** | — | SPA |

예: Gateway private IP = `172.31.28.15`  
→ EC2-2 `.env`: `RAG_SERVICE_BASE_URL=http://172.31.28.15:8090`

---

### 4. SSH 접속

Mac/Linux:

```bash
# Gateway
ssh -i ~/Downloads/katsubot-poc.pem ec2-user@<EC2-1-public-ip>

# Katsubot
ssh -i ~/Downloads/katsubot-poc.pem ec2-user@<EC2-2-public-ip>
```

Amazon Linux 2023 사용자명: `ec2-user`  
Ubuntu AMI면: `ubuntu`

---

### 5. 이후 — 앱 배포

SSH 접속 후 [poc-ec2-deployment.md §배포 절차](./poc-ec2-deployment.md#배포-절차) 를 따릅니다.

---

## 방법 B — AWS CLI 한 번에 (콘솔 대신)

### 0. CLI 설치·로그인

```bash
# macOS
brew install awscli

aws configure
# AWS Access Key ID / Secret / region(ap-northeast-2) / output(json)
```

IAM 사용자에 최소 권한: `AmazonEC2FullAccess` (POC 한정). 운영 계정이면 더 좁히세요.

### 1. 자동 프로비저닝

```bash
cd katsulabs-katsubot
chmod +x scripts/poc/*.sh

# 키 페어는 콘솔에서 미리 만들거나 KEY_NAME 지정
export AWS_REGION=ap-northeast-2
export KEY_NAME=katsubot-poc   # EC2 → Key pairs 에 존재해야 함

./scripts/poc/aws-provision-poc.sh
```

출력되는 **Gateway private IP**, **Katsubot public IP** 를 메모한 뒤 배포 스크립트 실행.

### 2. 종료

```bash
./scripts/poc/aws-teardown-poc.sh
```

---

## 체크리스트 (배포 전)

- [ ] 리전 고정 (서울 `ap-northeast-2` 등)
- [ ] 키 페어 `.pem` + `chmod 400`
- [ ] Gateway SG: 8090 ← **katsubot-sg** (IP 아님)
- [ ] Katsubot SG: 80 ← 데모 접속 허용
- [ ] 양쪽 SSH 22 ← **My IP** (0.0.0.0/0 금지)
- [ ] Gateway **private IP** → EC2-2 `RAG_SERVICE_BASE_URL`
- [ ] `GATEWAY_JWT_SECRET` EC2-1·2 **동일**
- [ ] `LLM_API_KEY` EC2-1 `.env`

---

## 자주 하는 실수

| 증상 | 원인 | 해결 |
|------|------|------|
| SSH 연결 timeout | SG 22가 0.0.0.0/0 아닌데 My IP 틀림 | SG에서 My IP 재설정 |
| EC2-2에서 Gateway curl fail | 8090 Source가 IP인데 private IP 오타 | SG Source = **katsubot-sg** 로 변경 |
| 브라우저에서 EC2-1 :8090 접속 시도 | Gateway는 **공개하지 않음** | EC2-2 `:80` 만 사용 |
| `Permission denied (publickey)` | 키·사용자명 불일치 | `-i katsubot-poc.pem`, `ec2-user` |
| Gemini 호출 실패 | Gateway outbound 443 차단 | Outbound All traffic 확인 |

---

## POC 종료 (과금 중단)

1. EC2-2: `./scripts/poc/teardown-ec2.sh katsubot`
2. EC2-1: `./scripts/poc/teardown-ec2.sh gateway`
3. **EC2** → Instances → 2대 선택 → **Instance state** → **Terminate**
4. (선택) Security Groups·Key pair 삭제

> **Stop** vs **Terminate:** POC 끝이면 **Terminate** (디스크까지 삭제). Stop은 디스크 과금 계속.

---

## 예상 비용 (대략)

| 항목 | POC 2대 × t3.medium | 비고 |
|------|---------------------|------|
| EC2 | ~$0.05/시간 × 2 ≈ **$2.4/일** | 온디맨드, 서울 리전 기준 |
| EBS 30GB × 2 | ~$0.1/일 | terminate 시 삭제 |
| Gemini API | 사용량별 | 무료 tier 있음 |

**며칠 POC 후 terminate** 하면 EC2·EBS 과금은 거의 없습니다.

---

## 관련

- [poc-ec2-deployment.md](./poc-ec2-deployment.md) — Docker 배포·스모크
- [09-operations-runbook.md](./09-operations-runbook.md) — Secrets
