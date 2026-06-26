---
name: katsubot-secrets-prep
description: Katsulabs Chatbot Secrets 체크리스트 — repo secret 금지, env 분리, DB·RAG·Auth 키. 배포 전·todo.md Secrets 항목 시 사용.
---

# Katsubot Secrets 준비

## 금지

- API 키·DB 비밀번호를 git에 커밋
- `.env` 파일 커밋 (`.gitignore` 확인)

## 권장

| Secret | 저장소 |
|--------|--------|
| DB URL/user/pw | GitHub Environment `staging` / `production` |
| WRTN/RAG API key | Environment secret |
| JWT signing key | Environment secret |

## 로컬 개발

- `docker-compose.yml` — 개발용 더미 값만
- JVM/env override: `application-local.yml` (gitignore)

## 체크리스트

- [ ] `.gitignore`에 `*.local.yml`, `.env` 포함
- [ ] CI는 test profile / Testcontainers
- [ ] `todo.md` §Secrets management 갱신

## 참고

- `KC-000-project-conventions.md`
- `docs/harness/todo.md`
