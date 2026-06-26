package xs.aichat.v2.config;

import java.time.Duration;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.netty.http.client.HttpClient;
import reactor.netty.resources.ConnectionProvider;
import xs.core.property.XtrmProperty;

/**
 * TB-005f — shared WRTN {@link WebClient} pool and optional virtual-thread executor.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class HyobeeHttpClientConfig {

	private final XtrmProperty xtrmConfig;

	@Bean(destroyMethod = "dispose")
	public ConnectionProvider wrtnConnectionProvider() {
		int maxTotal = xtrmConfig.getInt("REST_CONN_POOL_MAX_TOTAL", 100);
		return ConnectionProvider.builder("wrtn-http")
				.maxConnections(maxTotal)
				.maxIdleTime(Duration.ofSeconds(30))
				.evictInBackground(Duration.ofSeconds(60))
				.build();
	}

	@Bean
	public WebClient wrtnWebClient(ConnectionProvider wrtnConnectionProvider) {
		int socketTimeoutMs = xtrmConfig.getInt("REST_SOCKET_TIMEOUT", 120_000);
		HttpClient httpClient = HttpClient.create(wrtnConnectionProvider)
				.responseTimeout(Duration.ofMillis(socketTimeoutMs));

		if ("LOCAL".equalsIgnoreCase(xtrmConfig.getString("SERVICE_MODE"))) {
			try {
				io.netty.handler.ssl.SslContext sslContext = SslContextBuilder.forClient()
						.trustManager(InsecureTrustManagerFactory.INSTANCE)
						.build();
				httpClient = httpClient.secure(spec -> spec.sslContext(sslContext));
			} catch (Exception e) {
				log.warn("WRTN WebClient LOCAL SSL trust-all setup failed; using default TLS", e);
			}
		}

		return WebClient.builder()
				.baseUrl(xtrmConfig.getString("WRTN_BASEURL"))
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.build();
	}

	/**
	 * Offloads blocking WRTN REST calls from Tomcat worker threads when enabled.
	 * When disabled, runs synchronously on the caller thread.
	 */
	@Bean(name = "blockingIoExecutor")
	public Executor blockingIoExecutor() {
		if (xtrmConfig.getBoolean("HYOBEE_VIRTUAL_THREADS_ENABLED", false)) {
			log.info("HYOBEE_VIRTUAL_THREADS_ENABLED=true — using virtual-thread per task executor for blocking I/O");
			return Executors.newVirtualThreadPerTaskExecutor();
		}
		return Runnable::run;
	}
}
