---
name: hyobee-harness-status-refresh
description: 테스트 건수, qa.mdc, CI, 티켓 변경 후 harness-status.md·qa-registry.md 갱신. 하네스 성숙도 지표, @Test 재집계, QA Before/After 문서화 시 사용.
---

# Hyobee Harness 상태 갱신

## 갱신 트리거

- P0/P1 테스트 클래스 또는 `@Test` 건수 변경
- `qa.mdc` 또는 PR 템플릿 체크리스트 변경
- CI workflow 추가/변경
- Harness `main` 머지
- 티켓 DONE / 신규 티켓 (TB-xxx)

## P0+P1 @Test 재집계 (PowerShell)

`hyobee/` 모듈 root에서 실행:

```powershell
$classes = @(
  'HyobeeSSOServiceImplTest','HyobeeSSOControllerTest','LoginServiceImplTest',
  'HyobeeApiInterceptorTest','ApiServiceImplTest','XtrmHandlerInterceptorAuthTest',
  'AuthPagePreloadTest','HyobeePagePathsTest'
)
$sum = 0
foreach ($c in $classes) {
  $n = (Select-String -Path "src/test/java/**/$c.java" -Pattern '@Test' | Measure-Object).Count
  Write-Output "$c : $n"
  $sum += $n
}
Write-Output "P0+P1 total: $sum"
```

## harness-status.md 갱신 섹션

| 섹션 | 갱신 내용 |
|------|-----------|
| §1 한 줄 요약 | 성숙도, main 머지 여부, Rules vs Skills 개수 |
| §3 QA Before/After | 프로세스 게이트 건수, `@Test` 합계 |
| §5 티켓별 준수도 | `todo.md` TB 상태 |
| §8 갱신 방법 | "최종 갱신" 날짜 |

## qa-registry.md 동기화

`mvn test -DfailIfNoTests=false` 전체 실행 후:

1. §1 dashboard — PASS/FAIL/ERROR 건수
2. §2 클래스 표 — 클래스별 결과
3. §2-1 ERROR 상세 — 실패 메서드
4. TB-004 §5 — 수동 QA 실행 시 상태

## Skills 목록 갱신

project skills 추가/변경 시 harness-status §4 갱신:

- Rules: `.cursor/rules/*.mdc` 개수
- Skills: `.cursor/skills/*/SKILL.md` 개수 + 목록

## 참고

- `docs/harness/harness-status.md` §8
- `docs/harness/qa-registry.md`
