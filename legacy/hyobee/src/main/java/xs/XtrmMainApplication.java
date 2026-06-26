package xs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Description;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * 스프링부트 메인 클래스
 *
 * @Project : 효성ITX AICC R&D팀
 * @Package : xs.core.main
 * @Class : XtrmMainApplication.java
 * @Description : SpringBoot Main Class
 * @Modification
 * @ Date       Modifier   Revision
 * @ ---------- ---------- -------------------------------
 * @ 2024.09.27 이태영     First created
 * @author
 * @since 2024.09.27 오전 09:00:00
 * @version 1.0
 */
@EnableAsync
@EnableScheduling
@EnableTransactionManagement
@EnableRetry
@SpringBootApplication(scanBasePackages = { "xs" })
public class XtrmMainApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(XtrmMainApplication.class);
	}

	@Description("SpringBoot Main Start")
	public static void main(String[] args) {
		SpringApplication.run(XtrmMainApplication.class, args);
	}
}
