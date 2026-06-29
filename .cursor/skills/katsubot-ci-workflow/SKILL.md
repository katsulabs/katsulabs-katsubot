---
name: katsubot-ci-workflow
description: Katsubot GitHub Actions CI — katsubot-api(Gradle), katsubot-web(pnpm), legacy(Maven) 분리 워크플로 생성·유지. Phase 0 CI 작업 시 사용.
---

# Katsubot CI Workflow

## 워크플로 (Phase 0 목표)

| File | paths filter | Job |
|------|--------------|-----|
| `.github/workflows/katsubot-api-ci.yml` | `services/katsubot-api/**` | JDK 25, `./gradlew test` |
| `.github/workflows/katsubot-web-ci.yml` | `apps/katsubot-web/**` | Node 22, `pnpm test`, `pnpm build` |
| `.github/workflows/legacy-ci.yml` | `legacy/hyobee/**`, `pom.xml` | JDK 21, `mvn test` (선택) |

## katsubot-api-ci 스켈레ton

```yaml
name: katsubot-api CI
on:
  pull_request:
    paths: ['services/katsubot-api/**', '.github/workflows/katsubot-api-ci.yml']
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '25'
      - run: cd services/katsubot-api && ./gradlew test
```

## 원칙

- path filter로 불필요한 CI 실행 최소화
- secret은 GitHub Environments; repo에 평문 금지
- 실패 시 PR merge block

## 참고

- `katsubot-secrets-prep` skill
- `KC-007-stack-assessment.md` §8
