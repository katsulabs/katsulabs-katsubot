# AGENTS.md

## Cursor Cloud 전용 안내

### 제품 개요

`hyobee/` 아래 단일 Spring Boot WAR 앱(Hyobee / 효성 AI 챗봇 BFF). 메인 클래스: `xs.XtrmMainApplication`. 기본 포트: **8080**.

### 시스템 의존성(Maven 밖)

- **JDK 11** (`openjdk-11-jdk`) — `pom.xml`의 `java.version`은 11입니다. JDK 21로 빌드하지 마세요.
- **Maven 3** (`maven` 패키지).
- **PostgreSQL** — `spring-boot:run`에 필요합니다. 커밋된 `XtrmConfig.properties`는 효성 내부 호스트를 가리킵니다. 런타임에 JVM 시스템 프로퍼티로 덮어쓸 수 있습니다(아래 참고). 로컬 개발에는 최소 `com_message_lang` 테이블(비어 있어도 됨)과 선택적으로 `sql/aichat/*.sql` DDL이 필요합니다.

### 표준 명령(`hyobee/`에서 실행)

| 작업 | 명령 |
|------|------|
| 단위 테스트 | `mvn test` (`ComUserTest` 제외 — 내부 DB 접속; 이 브랜치에서 `RequestDataArgumentResolverTest`는 실패할 수 있음) |
| 패키징 | `mvn -DskipTests package` |
| 개발 서버 | JVM 오버라이드와 함께 `mvn spring-boot:run` (아래) |

저장소에 lint 플러그인 없음(`pom.xml`에 Checkstyle/SpotBugs 없음). pre-commit 훅 없음.

### 로컬 PostgreSQL 초기 설정(VM당 1회)

```bash
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER xtrmdev WITH PASSWORD 'xtrmdev' SUPERUSER;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE xtrmvob OWNER xtrmdev;" 2>/dev/null || true
sudo -u postgres psql -d xtrmvob -c "CREATE TABLE IF NOT EXISTS com_message_lang (message_id VARCHAR(100), language_code VARCHAR(10), message_contents TEXT, use_at CHAR(1) DEFAULT 'Y');"
for f in src/main/resources/sql/aichat/*.sql; do sudo -u postgres psql -d xtrmvob -f "$f"; done
```

### 개발 서버 실행(tmux 권장)

`XtrmPropertyFactory`가 `System.getProperties()`를 `XtrmConfig.properties`에 병합하므로, 커밋된 설정 파일을 수정하지 않고 JDBC·파일 경로를 덮어쓸 수 있습니다.

```bash
mkdir -p /tmp/hyobee/{upload,clob,files,temp,download}
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
cd hyobee
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXTRMDB_JDBC_URL=jdbc:postgresql://localhost:5432/xtrmvob -DXTRMDB_JDBC_USER_ID=xtrmdev -DXTRMDB_JDBC_USER_PW=xtrmdev -DCLOB_FILE_ROOT_PATH=/tmp/hyobee/clob/ -DFILE_UPLOAD_ROOT_PATH=/tmp/hyobee/files/ -DFILE_UPLOAD_TEMP_PATH=/tmp/hyobee/files/temp/ -DFILE_DOWNLOAD_TEMP_ROOT_PATH=/tmp/hyobee/files/download/ -DAI_CHAT_UPLOAD_PATH=/tmp/hyobee/upload/"
```

로그에 `Started XtrmMainApplication`이 보이면 확인: `curl -s http://localhost:8080/actuator/health`.

### 외부 서비스(전체 E2E 시 선택)

- **WRTN API** — 채팅/SSE(설정의 `WRTN_BASEURL`). 외부 연동 테스트: `RUN_EXTERNAL_API_TESTS=true mvn test -Dtest=WrtnExternalApiHealthCheckTest`.
- **ADFS SSO**, **HiCloud**, 전체 **VOB** `com_user` / `com_company` 스키마 — 운영과 유사한 로그인·채팅은 사내망과 DB 덤프가 필요하며, 로컬 Postgres 스텁만으로는 불가합니다.

### 주의사항

- `com_message_lang`이 없으면 기동 실패(`MessageDataLoader` @PostConstruct).
- `/xs/aichat/**` JSON API는 세션/JWT 필요(`HyobeeApiInterceptor`). DB 사용자 없이 인증 스모크 테스트는 `/xs/vob/aichat/auth/verify`에 `Authorization: Bearer <JWT>` 사용.
- 정적 UI(`/webapps/xs/.../*.jsp`)는 HTTP 200이어도 세션이 없으면 클라이언트 JS에서 로그인 오류가 뜰 수 있습니다.
