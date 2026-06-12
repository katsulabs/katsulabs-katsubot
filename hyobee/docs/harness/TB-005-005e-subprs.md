# TB-005e — XtrmJSON Strangler 서브 PR 계획

> Epic: `XtrmJSON.java` 제거 + `gson` pom 제거  
> Wire format **고정:** `{HEADER:{ERROR_FLAG,ERROR_CODE,ERROR_MSG,...}, DATA:[{...}]}`

| 서브 PR | 브랜치 (권장) | 범위 | QA |
|---------|---------------|------|-----|
| **005e-1** | `feature/TB-005-005e-1-jsonnode` | `XtrmJsonNode` 신규 + `XtrmJsonNodeTest` (G6 smoke) | G0–G3 |
| **005e-2** | `feature/TB-005-005e-2-delegate` | `XtrmJSON` → 내부 `XtrmJsonNode` 위임 (호출부 무변경) | G0–G3 + G6 golden |
| **005e-3** | `feature/TB-005-005e-3-domain` | `xs/domain/**` 타입·DAO 경계 Jackson | G0–G3 |
| **005e-4** | `feature/TB-005-005e-4-vob-cmmn` | `xs/vob/cmmn/**` | G0–G3 |
| **005e-5** | `feature/TB-005-005e-5-core-api` | `xs/core/api/**`, `ApiServiceImpl` | **G0–G3 필수** (세션) |
| **005e-6** | `feature/TB-005-005e-6-auth-login` | `LoginServiceImpl`, `HyobeeSSOServiceImpl`, SSO fail path | **P0 59 + G4** |
| **005e-7** | `feature/TB-005-005e-7-management` | `ManagementServiceImpl` 등 vob 대량 (분할 가능) | G0–G3 |
| **005e-8** | `feature/TB-005-005e-8-excel-gson-mvc` | Excel/View, `GsonHttpMessageConverter`, `@Autowired Gson` | G6 + G3 |
| **005e-9** | `feature/TB-005-005e-9-remove-xtrmjson` | `XtrmJSON`/`XtrmJSONWeb` 삭제, `gson` pom 제거 | **G9** |

## 병합 순서

```text
005e-1 → 005e-2 → 005e-3 → 005e-4 → 005e-5 → 005e-6 → 005e-7 → 005e-8 → 005e-9
```

역순 병합 금지. **005e-2** 전까지 프로덕션은 Gson `XtrmJSON` 유지.

## PR 체크리스트 (공통)

- [ ] 서브 PR ID in title: `[TB-005][005e-N]`
- [ ] G0 compile (JDK 17)
- [ ] G3 P0+P1 59 PASS (`LoginServiceImplTest*` wildcard)
- [ ] 인증/세션 영향 PR: G4 또는 G6 명시
- [ ] 005e-9: `rg 'com.google.gson' src/main/java` → 0건, pom `gson` 없음

## 현재 진행

| 서브 PR | 상태 |
|---------|------|
| **005e-1** | DONE — `XtrmJsonNode` + `XtrmJsonNodeTest` (7 tests PASS) |
| **005e-2** | DONE — `XtrmJSON` → `XtrmJsonNode` delegate + `XtrmJSONDelegateTest` |
| **005e-3** | DONE — `xs/domain/**` → `XtrmJsonNode` + `XtrmJsonNodes` DAO bridge |
| **005e-4** | DONE — `xs/vob/cmmn/**` → `XtrmJsonNode` |
| **005e-5** | DONE — `xs/core/api/**`, `ApiServiceImpl`; controller `from`/`toLegacy` 경계 |
| **005e-6** | DONE — `LoginServiceImpl`, `HyobeeSSOServiceImpl`, SSO fail path |
| **005e-7** | DONE — `ManagementServiceImpl`, `AuthPagePreload` → `XtrmJsonNode` |
| **005e-8** | DONE — Excel/View → `XtrmJsonNode`; `GsonHttpMessageConverter` 제거; `ApiServiceImpl` `@Autowired Gson` 제거 |
| **005e-9** | DONE — `XtrmJSON`/`XtrmJSONWeb`/`XtrmJsonGsonBridge` 삭제; `gson` pom 제거; G9 PASS |

---

[TB-005-dependency-modernization.md](./TB-005-dependency-modernization.md) · [todo.md](./todo.md)
