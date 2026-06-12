---
name: hyobee-secrets-prep
description: 운영 배포 전 Hyobee Secrets 관리 체크리스트(repo secret 금지, env/config 분리, SSO 키). todo.md Secrets management, 배포 준비, 인증 credential rotation 계획 시 사용.
---

# Hyobee Secrets 준비

## 범위

SSO/JWT/DB/외부 API 운영 secret. git에 secret **커밋 금지**.

## 배포 전 체크리스트

- [ ] repo에 `.env`, 키, 비밀번호, JWKS private material 없음
- [ ] `XtrmProperty` / Spring config는 VCS 밖 env 파일 또는 secret store 사용
- [ ] SSO IdP client secret 코드 변경 없이 rotation 가능
- [ ] JWT signing key 환경별 관리 (dev/stage/prod)
- [ ] CI는 GitHub Secrets / vault — workflow YAML 평문 금지
- [ ] 로그 scrubbing: application log에 token 미출력
- [ ] `todo.md` 보류 인프라 → Secrets 행 DONE + 날짜

## 감사 명령 (안전)

```powershell
# 의심 패턴 검색 — hit는 수동 검토
rg -i "(password|secret|apikey|private_key|BEGIN RSA)" --glob "!target/**" --glob "!.git/**"
```

실제 secret이 포함된 결과는 PR·채팅에 붙여넣지 않는다.

## Rotation 절차 (개요)

1. Contract: auth flow에 영향 주는 secret 문서화 (`auth-flow-analysis.md`)
2. Backend: config 주입만 변경 — 하드코딩 금지
3. staging 배포; P0+P1 + SSO smoke test
4. prod rotation; 24h auth 오류 모니터링

## 에이전트 규칙

- **절차와 config 키 이름**만 문서화
- secret 파일 커밋 요청 → 거부; secret store 안내
- 체크리스트 완료 시 `docs/harness/todo.md` 상태 갱신

## 참고

- `docs/harness/todo.md` §보류 인프라 Secrets management
- `docs/harness/auth-flow-analysis.md` §SSO
