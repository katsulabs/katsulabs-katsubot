# katsubot-api — Spring Boot 4.1 (JDK 25)
# Build context: repo root (see infra/poc-ec2/docker-compose.katsubot-ec2.yml)

FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /workspace
COPY gradlew settings.gradle.kts ./
COPY gradle ./gradle
COPY services/katsubot-api ./services/katsubot-api
RUN chmod +x gradlew && ./gradlew :services:katsubot-api:bootJar -x test --no-daemon

FROM eclipse-temurin:25-jre-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY --from=build /workspace/services/katsubot-api/build/libs/*.jar app.jar
EXPOSE 8081
HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=30s \
  CMD curl -sf http://127.0.0.1:8081/actuator/health | grep -q '"status":"UP"'
ENTRYPOINT ["java", "-jar", "app.jar"]
