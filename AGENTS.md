# AGENTS.md

## 모노레포 (KC-007-modernization)

| 모듈 | 경로 | JDK | 명령 |
|------|------|-----|------|
| chat-api | `services/chat-api` | **25** | `./gradlew :services:chat-api:test` |
| chat-web | `apps/chat-web` | Node 22 | `npm ci && npm test && npm run build` |
| legacy hyobee | `legacy/hyobee` | **21** | `mvn test` (P0 세트는 legacy-ci.yml 참고) |

상세: [README-MONOREPO.md](./README-MONOREPO.md)

---

## Legacy Hyobee (`legacy/hyobee`)

### 제품 개요

Spring Boot 2.7 WAR (Hyobee / 효성 AI 챗봇 BFF). 메인 클래스: `xs.XtrmMainApplication`. 기본 포트: **8080**.

### 시스템 의존성

- **JDK 21** — `legacy/hyobee/pom.xml` (`java.version` 21). JDK 25로 레거시를 빌드하지 마세요.
- **Maven 3**
- **PostgreSQL** — `spring-boot:run` 시 필요 (아래 JVM 오버라이드 참고)

### 표준 명령 (`legacy/hyobee/`)

| 작업 | 명령 |
|------|------|
| P0 인증 테스트 | `mvn test -Dtest=HyobeePagePathsTest,AuthPagePreloadTest,HyobeeSSOControllerTest,HyobeeSSOServiceImplTest,LoginServiceImplTest,HyobeeApiInterceptorTest,ApiServiceImplTest,XtrmHandlerInterceptorAuthTest` |
| 패키징 | `mvn -DskipTests package` |
| 개발 서버 | `mvn spring-boot:run` + JVM 오버라이드 (아래) |

### 로컬 PostgreSQL (VM당 1회)

```bash
sudo service postgresql start
sudo -u postgres psql -c "CREATE USER xtrmdev WITH PASSWORD 'xtrmdev' SUPERUSER;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE xtrmvob OWNER xtrmdev;" 2>/dev/null || true
sudo -u postgres psql -d xtrmvob -c "CREATE TABLE IF NOT EXISTS com_message_lang (message_id VARCHAR(100), language_code VARCHAR(10), message_contents TEXT, use_at CHAR(1) DEFAULT 'Y');"
for f in src/main/resources/sql/aichat/*.sql; do sudo -u postgres psql -d xtrmvob -f "$f"; done
```

### 개발 서버 (레거시)

```bash
mkdir -p /tmp/hyobee/{upload,clob,files,temp,download}
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
cd legacy/hyobee
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXTRMDB_JDBC_URL=jdbc:postgresql://localhost:5432/xtrmvob -DXTRMDB_JDBC_USER_ID=xtrmdev -DXTRMDB_JDBC_USER_PW=xtrmdev -DCLOB_FILE_ROOT_PATH=/tmp/hyobee/clob/ -DFILE_UPLOAD_ROOT_PATH=/tmp/hyobee/files/ -DFILE_UPLOAD_TEMP_PATH=/tmp/hyobee/files/temp/ -DFILE_DOWNLOAD_TEMP_ROOT_PATH=/tmp/hyobee/files/download/ -DAI_CHAT_UPLOAD_PATH=/tmp/hyobee/upload/"
```

확인: `curl -s http://localhost:8080/actuator/health`

### chat-api (신규)

```bash
./gradlew :services:chat-api:bootRun
curl -s http://localhost:8081/actuator/health
```

### infra

```bash
cd infra && docker compose up -d
curl -s http://localhost:8090/_health
```
