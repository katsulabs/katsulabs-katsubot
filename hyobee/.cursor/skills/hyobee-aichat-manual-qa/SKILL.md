---
name: hyobee-aichat-manual-qa
description: TB-004 Frontend 수동 QA — aichat010/main.jsp 채팅 UI 브라우저 회귀 11시나리오 실행. v2 JS 모듈화, aichat010.js, main.jsp script 순서, 채팅 UX 변경 PR 전 수동 회귀 시 사용.
---

# Hyobee Aichat 수동 QA (TB-004)

## 사전 조건

- 로컬 앱 기동 + 인증 (SSO 또는 테스트 로그인)
- TB-004(또는 FE) 변경이 반영된 빌드/배포
- 401/네트워크 확인용 브라우저 devtools

## 11 시나리오

| # | 시나리오 | 기대 |
|---|----------|------|
| 1 | `main.jsp` 최초 로드 | 웰컴 메시지, 사이드바 대화 목록 |
| 2 | 사내검색 + Enter | SSE 스트리밍, 입력 잠금/해제 |
| 3 | 웹검색 / RND 전환 (권한 있을 때) | placeholder·UI 테마 변경 |
| 4 | 새 대화 | `#box` 초기화, 파일 첨부 cleared |
| 5 | 대화 이력 클릭 | 메시지 로드, 스크롤 |
| 6 | 대화 중지 버튼 | interrupt API, "대화가 중지되었습니다" |
| 7 | 로컬 파일 첨부 | validate, upload, 메시지 bubble |
| 8 | HiCloud 첨부 | popup + callback |
| 9 | 저널 영역 전환 (권한) | `journal.completePageRender` |
| 10 | 401 응답 | `login-routing.js` 로그인 redirect |
| 11 | 탭 닫기 / beforeunload | SSE `eventSource.close()` |

## 실행 절차

1. 각 시나리오 실행; PASS / FAIL / BLOCKED 기록
2. FAIL 시: 브라우저, 재현 단계, console/network 오류 기록
3. `docs/harness/qa-registry.md` §5 (TB-004 수동 FE) 갱신
4. 참고: `docs/harness/TB-004-aichat010-modularization.md` §QA

## PR 기록 템플릿

```markdown
### TB-004 수동 QA
| # | 결과 | 비고 |
|---|------|------|
| 1 | PASS | |
...
| 11 | PASS | |
실행자: {이름} · 날짜: YYYY-MM-DD · 빌드: {branch/commit}
```

## BLOCKED 기준

인증/환경 불가 시 사유와 함께 PENDING 또는 BLOCKED — **실행 없이 PASS 표기 금지**.

## 참고

- `docs/harness/TB-004-aichat010-modularization.md`
- `docs/harness/qa-registry.md` §5
