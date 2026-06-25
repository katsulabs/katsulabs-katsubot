---
name: katsubot-ci-workflow
description: Katsulabs Chatbot GitHub Actions CI — chat-api(Gradle), chat-web(pnpm), legacy(Maven) 분리 워크플로 생성·유지. Phase 0 CI 작업 시 사용.
---

# Katsubot CI Workflow

## 워크플로 (Phase 0 목표)

| File | paths filter | Job |
|------|--------------|-----|
| `.github/workflows/chat-api-ci.yml` | `services/chat-api/**` | JDK 25, `./gradlew test` |
| `.github/workflows/chat-web-ci.yml` | `apps/chat-web/**` | Node 22, `pnpm test`, `pnpm build` |
| `.github/workflows/legacy-ci.yml` | `legacy/hyobee/**`, `pom.xml` | JDK 21, `mvn test` (선택) |

## chat-api-ci 스켈레ton

```yaml
name: chat-api CI
on:
  pull_request:
    paths: ['services/chat-api/**', '.github/workflows/chat-api-ci.yml']
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '25'
      - run: cd services/chat-api && ./gradlew test
```

## 원칙

- path filter로 불필요한 CI 실행 최소화
- secret은 GitHub Environments; repo에 평문 금지
- 실패 시 PR merge block

## 참고

- `katsubot-secrets-prep` skill
- `KC-007-stack-assessment.md` §8
