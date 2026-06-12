# 에이전트 계층

메인 오케스트레이터가 티켓과 worktree를 관리하고 Sub-agent가 구현합니다.

## 역할

| Agent | 역할 | 수정 범위 |
|-------|------|-----------|
| Main | 분해, worktree, 분배 | `docs/**` 중심 |
| Contract | 인증/세션/API 계약 고정 | `docs/**`, `src/main/java/**/controller`, DTO |
| Backend | 비즈니스 로직 + API 테스트 | `src/main/java/xs/**`, `src/test/java/xs/**` |
| Frontend | 화면/정적 리소스 영향 검토 | `src/main/resources/static/**`, `src/main/webapp/**` |
| QA | 회귀 테스트 + PR 검증 | 테스트/PR 템플릿 |

## 분배 태그

- `[TB-xxx][Contract]`
- `[TB-xxx][Backend]`
- `[TB-xxx][Frontend]`
- `[TB-xxx][QA]`

## 병렬 정책

병렬은 아래 조건을 모두 만족할 때만 허용합니다.

- 서로 다른 worktree/브랜치
- 수정 경로 비중첩 (`src/main/java/xs/**` vs `src/main/resources/static/**`)
- 인증/세션 계약 변경 사항이 Contract에서 먼저 고정됨
- DTO/응답 스키마 변경 범위가 고정되었거나 optional/fallback 합의 완료

## 로그인 흐름 관점 역할 경계

- Contract: 로그인/SSO/인터셉터의 책임 경계를 문서로 먼저 확정
- Backend: `LoginServiceImpl`, `HyobeeSSOServiceImpl`, `HyobeePagePaths`, 인터셉터 변경 구현
- Frontend: 로그인/리다이렉트/오류 메시지 UX 영향 검토
- QA: 정상 로그인, SSO 로그인, 권한 거부, 세션 만료 회귀 검증
