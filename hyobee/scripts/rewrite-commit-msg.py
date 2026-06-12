#!/usr/bin/env python3
"""git filter-branch --msg-filter helper: 한글화 + Cursor Co-authored-by 제거."""
import sys

CURSOR_TRAILER = "Co-authored-by: Cursor <cursoragent@cursor.com>"

# key: 첫 줄(제목) 정확히 일치 → value: (제목, 본문) 또는 제목만 str
REWRITES = {
    "docs: add harness vs rnd/main branch diff analysis": (
        "docs: feature/harness/main과 rnd/main 차이 분석 문서 추가",
        "merge 후 두 브랜치 차이를 문서화하고 harness README에 링크를 추가한다.",
    ),
    "Merge branch 'rnd/main' into feature/harness/main": (
        "merge: rnd/main을 feature/harness/main에 병합",
        "다중 권한·저널 설정·인증 리팩터링(rnd)을 Hyobee 리네이밍·v2 구조(harness)에 통합한다.",
    ),
    "docs: include mapper interface cleanup scope": (
        "docs: mapper 인터페이스 정리 범위 문서 반영",
        None,
    ),
    "docs: plan xtrmjsonnode record migration": (
        "docs: XtrmJsonNode record 마이그레이션 계획",
        None,
    ),
    "docs: plan xtrmjson record migration": (
        "docs: XtrmJson record 마이그레이션 계획",
        None,
    ),
    "docs: add Cursor Cloud dev environment instructions for Hyobee": (
        "docs: Hyobee Cursor Cloud 개발 환경 가이드 추가",
        None,
    ),
    "docs: write Korean Hyobee README": (
        "docs: Hyobee README 한글 작성",
        None,
    ),
    "fix(TB-005): remove unused HttpClients import in HyobeeChatApiClient": (
        "fix(TB-005): HyobeeChatApiClient 미사용 HttpClients import 제거",
        None,
    ),
    "docs(harness): record TB-005 promotion to feature/harness/main": (
        "docs(harness): TB-005 feature/harness/main 승격 기록",
        "PR #2 to main 종료; harness 브랜치 전략에 따라 통합 라인을 갱신한다.",
    ),
    "[TB-005][005f] JDK 21 pilot with virtual threads and pooled WRTN HTTP clients": (
        "[TB-005][005f] JDK 21·가상 스레드·WRTN HTTP 클라이언트 풀링 파일럿",
        "컴파일 타깃 21, blocking I/O 가상 스레드 executor, SSE/multipart 공유 WebClient, "
        "RestTemplate 풀링 및 stale connection 검사(CLOSE_WAIT 완화).",
    ),
    "[TB-005][005e-9] Remove XtrmJSON and gson dependency (G9)": (
        "[TB-005][005e-9] XtrmJSON·gson 의존성 제거 (G9)",
        "레거시 Gson 타입 삭제, DAO·서비스·뷰·컨트롤러를 Jackson XtrmJsonNode로 이전, "
        "pom에서 gson 제거, P0+P1 회귀 통과.",
    ),
    "[TB-005][005e-8] Migrate Excel/View layer and remove GsonHttpMessageConverter": (
        "[TB-005][005e-8] Excel/View 레이어 XtrmJsonNode 이전 및 GsonHttpMessageConverter 제거",
        "파일·Excel export 뷰를 XtrmJsonNode로 이전, MVC Gson converter 제거(Jackson @JsonValue), "
        "ApiServiceImpl Gson 주입 제거.",
    ),
    "[TB-005][005e-7] Migrate Management layer to XtrmJsonNode": (
        "[TB-005][005e-7] Management 레이어 XtrmJsonNode 마이그레이션",
        "G3 P0+P1 인증 테스트 통과(클린 빌드).",
    ),
    "[TB-005][005e-6] Migrate Login/SSO layer to XtrmJsonNode": (
        "[TB-005][005e-6] Login/SSO 레이어 XtrmJsonNode 마이그레이션",
        "G4 P0+P1 인증 테스트 통과(클린 빌드).",
    ),
    "[TB-005][005e-5] Migrate xs/core/api to XtrmJsonNode": (
        "[TB-005][005e-5] xs/core/api XtrmJsonNode 마이그레이션",
        "G3 P0+P1 62건 테스트 통과(클린 빌드).",
    ),
    "feat(TB-005): Phase 005e-4 — migrate xs/vob/cmmn to XtrmJsonNode": (
        "feat(TB-005): 005e-4 xs/vob/cmmn XtrmJsonNode 마이그레이션",
        "vob CmmnService를 Jackson 노드로 이전, XtrmJsonNodes DAO 헬퍼 추가, "
        "Login·Management 경계 호출부 조정. G3 P0+P1 통과.",
    ),
    "feat(TB-005): Phase 005e-3 — migrate xs/domain to XtrmJsonNode": (
        "feat(TB-005): 005e-3 xs/domain XtrmJsonNode 마이그레이션",
        "Domain 서비스·컨트롤러 XtrmJsonNode 전환, XtrmJsonNodes DAO 브릿지, "
        "레거시 호출부 asJsonNode() 변환. G3 P0+P1 통과.",
    ),
    "feat(TB-005): Phase 005e-2 — XtrmJSON delegates to XtrmJsonNode": (
        "feat(TB-005): 005e-2 XtrmJSON → XtrmJsonNode 위임",
        "XtrmJSON 데이터 경로를 Jackson XtrmJsonNode로 통합, Gson 경계 API 유지, "
        "브릿지·위임 golden 테스트 추가. G3 P0+P1 통과.",
    ),
    "feat(TB-005): Phase 005e-1 — XtrmJsonNode Jackson foundation": (
        "feat(TB-005): 005e-1 XtrmJsonNode Jackson 기반 구축",
        "XtrmJSON wire format을 반영한 Jackson XtrmJsonNode 도입, 005e sub-PR 분할 계획 문서화.",
    ),
    "feat(TB-005): Phase 005d — remove Gson from aichat v2": (
        "feat(TB-005): 005d aichat v2 Gson 제거",
        "@SerializedName·Gson을 Jackson @JsonProperty·JsonAdapter로 교체, "
        "ChatLogService·ChatStreamServiceImpl 포함.",
    ),
    "feat(TB-005): Phase 005c — jjwt 0.12 migration": (
        "feat(TB-005): 005c jjwt 0.12 마이그레이션",
        "jjwt 0.12.6 업그레이드, HyobeeJwtTokenServiceImpl·HyobeeSSOServiceImpl 및 "
        "auth 테스트 stub을 신규 builder/parser API로 이전, JWT wire 호환 유지.",
    ),
    "feat(TB-005): Phase 005b — JDK 17 and record pilot DTOs": (
        "feat(TB-005): 005b JDK 17·record 파일럿 DTO",
        "java.version 17, JwtClaims·VobLoginResult record 전환, JwtClaimsTest 추가, "
        "HyobeeThumbnailService UTF-8 인코딩(JDK 17 빌드).",
    ),
    "feat(TB-005): Phase 005a — unused deps removal and patch version bumps": (
        "feat(TB-005): 005a 미사용 의존성 제거·패치 버전 상향",
        "org.json·guava·ibatis-sqlmap 제거, Jackson SB BOM 2.13.5 정렬, "
        "패치 라이브러리 bump, TB-005 harness 문서 추가.",
    ),
    "fix(harness): P0+P1 auth gate green and project skills": (
        "fix(harness): P0+P1 인증 게이트 통과 및 프로젝트 skill 추가",
        "LoginServiceImplTest loginHyobeeSSO·AuthPagePreloadTest JSP 게이트 수정, "
        "한글 skill 17개·qa-registry·harness-status 문서 추가.",
    ),
    "refactor(TB-004): extract aichat010 Phase 1a IIFE modules": (
        "refactor(TB-004): aichat010 Phase 1a IIFE 모듈 분리",
        "hyobee-constants·hyobee-i18n·hyobee-api 추가, aichat010 facade 위임, "
        "main.jsp 로드 순서 갱신.",
    ),
    "feat(TB-003): Hyobee naming, canonical JSP paths, and auth regression tests": (
        "feat(TB-003): Hyobee 네이밍·canonical JSP·인증 회귀 테스트",
        "Aichat* → Hyobee* 리네이밍, login.jsp/main.jsp·HyobeePagePaths, P0+P1 테스트 갱신.",
    ),
    "merge(TB-005): include HyobeeChatApiClient unused import cleanup": (
        "merge(TB-005): HyobeeChatApiClient 미사용 import 정리 포함",
        None,
    ),
    "merge(TB-005): promote dependency modernization to harness integration line": (
        "merge(TB-005): 의존성 현대화를 harness 통합 라인에 승격",
        None,
    ),
}


def main() -> None:
    raw = sys.stdin.read()
    lines = raw.splitlines()
    cleaned = [ln for ln in lines if ln.strip() != CURSOR_TRAILER]

    subject = next((ln for ln in cleaned if ln.strip()), "")
    rewrite = REWRITES.get(subject)

    if rewrite:
        new_subject, new_body = rewrite if isinstance(rewrite, tuple) else (rewrite, None)
        out = [new_subject]
        if new_body:
            out.append("")
            out.append(new_body)
        # Jeremy Kim 등 다른 Co-authored-by는 유지
        for ln in cleaned:
            if ln.startswith("Co-authored-by:") and ln.strip() != CURSOR_TRAILER:
                if out and out[-1] != "":
                    out.append("")
                out.append(ln)
        sys.stdout.write("\n".join(out).rstrip() + "\n")
        return

    # 제목만 한글화되지 않은 경우: Cursor trailer만 제거
    while cleaned and cleaned[-1].strip() == "":
        cleaned.pop()
    sys.stdout.write("\n".join(cleaned).rstrip() + "\n")


if __name__ == "__main__":
    main()
