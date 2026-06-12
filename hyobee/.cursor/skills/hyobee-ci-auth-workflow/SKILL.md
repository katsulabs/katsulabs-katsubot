---
name: hyobee-ci-auth-workflow
description: Hyobee P0+P1 인증 회귀(mvn test) GitHub Actions CI 생성·유지. CI mirror, GitHub workflows, CI red 트리아지, L3 하네스 자동화 설정 시 사용.
---

# Hyobee CI 인증 워크플로

## 목표

PR마다 P0+P1 auth 게이트 실행으로 머지 전 회귀 방지 (`todo.md` CI/CD mirror).

## 권장 workflow 스켈레톤

경로: `.github/workflows/hyobee-auth-regression.yml`

```yaml
name: Hyobee Auth Regression

on:
  pull_request:
    paths:
      - 'src/main/java/**'
      - 'src/test/java/**'
      - 'src/main/webapp/**'
      - 'src/main/resources/**'
      - 'pom.xml'
  workflow_dispatch:

jobs:
  auth-regression:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: hyobee
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '11'
          cache: maven
      - name: P0+P1 auth regression
        run: mvn test -DfailIfNoTests=false
      - name: Upload Surefire reports on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: surefire-reports
          path: hyobee/target/surefire-reports/
```

## 참고 사항

- repo root가 `hyobee/` 상위일 수 있음 — `working-directory` 조정
- `@Nested` 테스트는 전체 `mvn test` 필요 (`qa-registry.md` §1)
- P2 테스트는 `todo.md`에서 승격 전까지 blocking 아님

## CI red 시

1. Surefire artifact 다운로드 또는 job log 확인
2. 실패를 P0/P1 클래스에 매핑 (`hyobee-auth-regression`)
3. feature 브랜치에서 수정 후 re-push
4. 게이트 green 시 `docs/harness/qa-registry.md` 갱신

## CI 가동 후

- `docs/harness/harness-status.md` §2 (CI mirror ✅)
- `docs/harness/todo.md` 보류 인프라 행 갱신

## 참고

- `docs/harness/harness-status.md` §7 항목 2
- `docs/harness/todo.md` CI/CD mirror
