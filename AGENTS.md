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
# DB: hyobee-admin-db → localhost:53254 (XtrmConfig.properties 기본)
# WRTN: 로컬 AI Gateway → http://127.0.0.1:8090 (XtrmConfig.properties WRTN_BASEURL)
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-DXTRMDB_JDBC_URL=jdbc:postgresql://localhost:53254/xtrmvob?tcpKeepAlive=true&applicationName=xtrmVOB -DXTRMDB_JDBC_USER_ID=XtrmSalesDev -DXTRMDB_JDBC_USER_PW=Xtrm-Sales#Dev#86 -DCLOB_FILE_ROOT_PATH=/tmp/hyobee/clob/ -DFILE_UPLOAD_ROOT_PATH=/tmp/hyobee/files/ -DFILE_UPLOAD_TEMP_PATH=/tmp/hyobee/files/temp/ -DFILE_DOWNLOAD_TEMP_ROOT_PATH=/tmp/hyobee/files/download/ -DAI_CHAT_UPLOAD_PATH=/tmp/hyobee/upload/"
```

확인: `curl -s http://localhost:8080/actuator/health`

**Gateway JWT:** `/xs/aichat/v2/**` → Gateway WRTN API 는 **레거시 로그인 JWT** 필요 (`dev-token` 거절). `GATEWAY_JWT_SECRET` = `SECRET_KEY`.

### chat-api (신규)

```bash
# 1) AI Gateway — WRTN + completions (:8090)
cp infra/.env.example infra/.env   # hyobee-rag-db 비밀번호 등 채우기
./scripts/up-ai-gateway.sh

# 2) chat-api — infra/.env 의 JWT·RAG 설정 적용
./scripts/boot-chat-api.sh   # :8081
curl -s http://localhost:8081/actuator/health
```

### infra (Gateway만, katsubot compose)

```bash
cp infra/.env.example infra/.env
cd infra && docker compose -f docker-compose.ai-gateway.yml --env-file .env up --build -d
curl -s http://localhost:8090/_health
```
