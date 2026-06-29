# Hyobee Legacy — Decommission 대상

> **Phase 4:** 신규 채팅 UX는 `apps/katsubot-web` + `services/katsubot-api`로 이전됨.  
> 본 WAR는 **SSO·JSP·미이전 API** 전환기 동안만 유지한다.

## 정책

- **신규 기능 금지** (`KC-000` §2)
- 버그·보안 패치만 허용 (Hotfix)
- CI: `legacy-ci.yml` — `legacy/hyobee/**` 변경 시에만 실행

## Strangler 라우팅 (Phase 4)

| 경로 | 대상 |
|------|------|
| `/`, `/assets/**` | katsubot-web (React SPA) |
| `/api/v1/**`, `/actuator/**` | katsubot-api |
| `/xs/**`, `/webapps/**` | legacy (SSO·JSP·v2 잔여) |

## 완전 제거 전제

- [ ] SSO/ADFS를 katsubot-web 또는 IdP 직접 연동으로 대체
- [ ] v2 parity 100% 또는 미사용 API 폐기 합의 ([07-api-reference.md](../../docs/07-api-reference.md))
- [ ] 운영 트래픽 0% 확인 (레거시 `/xs/aichat/v2/**` 모니터링)

## 참고

- [09-operations-runbook.md](../../docs/09-operations-runbook.md)
- [KC-007-phase4-kickoff.md](../../docs/harness/KC-007-phase4-kickoff.md)
