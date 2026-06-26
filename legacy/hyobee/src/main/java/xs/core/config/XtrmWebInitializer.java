package xs.core.config;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.SessionCookieConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletContextInitializer;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import lombok.extern.slf4j.Slf4j;
import xs.core.factory.XtrmPropertyFactory;
import xs.core.property.XtrmProperty;

@Slf4j
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class XtrmWebInitializer implements ServletContextInitializer {

	@Autowired
	private ApplicationContext applicationContext;

	@Override
	public void onStartup(ServletContext servletContext) throws ServletException {

		// 2025 취약점에서 사용한 소스 주석 처리 //

//		// 20250115 JJH 웹취약점 보안 조치에 따른 브라우저에 https 이동하도록 헤더 설정 START
//		SessionCookieConfig sessionCookieConfig = servletContext.getSessionCookieConfig();
//
//		// SameSite 속성 추가
//		sessionCookieConfig.setName("JSESSIONID");
//		sessionCookieConfig.setHttpOnly(true);
//		sessionCookieConfig.setSecure(true); // HTTPS 연결에서만 전송

		// 2025 취약점에서 사용한 소스 주석 처리 //



		log.debug("=============================================== onStartup");
		StringBuilder sb = new StringBuilder();
		sb.append("\n");
		sb.append("\n                                                                .         .                                                                          .         .                                                                                                     ");
		sb.append("\n`8.`8888.      ,8' 8888888 8888888888 8 888888888o.            ,8.       ,8.          8 8888888888   8 888888888o.            .8.                   ,8.       ,8.          8 8888888888 `8.`888b                 ,8'  ,o888888o.     8 888888888o.   8 8888     ,88' ");
		sb.append("\n `8.`8888.    ,8'        8 8888       8 8888    `88.          ,888.     ,888.         8 8888         8 8888    `88.          .888.                 ,888.     ,888.         8 8888        `8.`888b               ,8'. 8888     `88.   8 8888    `88.  8 8888    ,88'  ");
		sb.append("\n  `8.`8888.  ,8'         8 8888       8 8888     `88         .`8888.   .`8888.        8 8888         8 8888     `88         :88888.               .`8888.   .`8888.        8 8888         `8.`888b             ,8',8 8888       `8b  8 8888     `88  8 8888   ,88'   ");
		sb.append("\n   `8.`8888.,8'          8 8888       8 8888     ,88        ,8.`8888. ,8.`8888.       8 8888         8 8888     ,88        . `88888.             ,8.`8888. ,8.`8888.       8 8888          `8.`888b     .b    ,8' 88 8888        `8b 8 8888     ,88  8 8888  ,88'    ");
		sb.append("\n    `8.`88888'           8 8888       8 8888.   ,88'       ,8'8.`8888,8^8.`8888.      8 888888888888 8 8888.   ,88'       .8. `88888.           ,8'8.`8888,8^8.`8888.      8 888888888888   `8.`888b    88b  ,8'  88 8888         88 8 8888.   ,88'  8 8888 ,88'     ");
		sb.append("\n    .88.`8888.           8 8888       8 888888888P'       ,8' `8.`8888' `8.`8888.     8 8888         8 888888888P'       .8`8. `88888.         ,8' `8.`8888' `8.`8888.     8 8888            `8.`888b .`888b,8'   88 8888         88 8 888888888P'   8 8888 88'      ");
		sb.append("\n   .8'`8.`8888.          8 8888       8 8888`8b          ,8'   `8.`88'   `8.`8888.    8 8888         8 8888`8b          .8' `8. `88888.       ,8'   `8.`88'   `8.`8888.    8 8888             `8.`888b8.`8888'    88 8888        ,8P 8 8888`8b       8 888888<       ");
		sb.append("\n  .8'  `8.`8888.         8 8888       8 8888 `8b.       ,8'     `8.`'     `8.`8888.   8 8888         8 8888 `8b.       .8'   `8. `88888.     ,8'     `8.`'     `8.`8888.   8 8888              `8.`888`8.`88'     `8 8888       ,8P  8 8888 `8b.     8 8888 `Y8.     ");
		sb.append("\n .8'    `8.`8888.        8 8888       8 8888   `8b.    ,8'       `8        `8.`8888.  8 8888         8 8888   `8b.    .888888888. `88888.   ,8'       `8        `8.`8888.  8 8888               `8.`8' `8,`'       ` 8888     ,88'   8 8888   `8b.   8 8888   `Y8.   ");
		sb.append("\n.8'      `8.`8888.       8 8888       8 8888     `88. ,8'         `         `8.`8888. 8 8888         8 8888     `88. .8'       `8. `88888. ,8'         `         `8.`8888. 8 888888888888        `8.`   `8'           `8888888P'     8 8888     `88. 8 8888     `Y8. ");
		sb.append("\n");
		log.info(sb.toString());
	}

//	@Bean(name = "xtrmPropertyFactory", initMethod = "init")
//	XtrmPropertyFactory xtrmPropertyFactory(String serviceMode) throws IOException {
//		XtrmPropertyFactory xtrmPropertyFactory = new XtrmPropertyFactory();
//		if ("real".equals(serviceMode)) {
//			xtrmPropertyFactory.setLocations(
//					applicationContext.getResources("classpath:/properties/xs/config/XtrmConfig_real.properties"));
//		} else {
//			xtrmPropertyFactory.setLocations(
//					applicationContext.getResources("classpath:/properties/xs/config/XtrmConfig.properties"));
//		}
//		return xtrmPropertyFactory;
//	}
//
//	@Bean
//	XtrmProperty xtrmProperty(@Value("${spring.profiles.active}") String serviceMode) throws IOException {
//		log.info("SERVICE_MODE: {}", serviceMode);
//		XtrmProperty xtrmProperty = new XtrmProperty();
//		xtrmProperty.setProperties(this.xtrmPropertyFactory(serviceMode).createInstance());
//		return xtrmProperty;
//	}

	@Bean(name = "xtrmPropertyFactory", initMethod = "init")
	public XtrmPropertyFactory xtrmPropertyFactory() throws IOException {
		XtrmPropertyFactory xtrmPropertyFactory = new XtrmPropertyFactory();
		xtrmPropertyFactory.setLocations(applicationContext.getResources("classpath:/properties/xs/config/XtrmConfig.properties"));
		return xtrmPropertyFactory;
	}
	
	@Bean(name = "xtrmProperty")
	public XtrmProperty xtrmProperty() throws IOException {
		XtrmProperty xtrmProperty = new XtrmProperty();
		xtrmProperty.setProperties(this.xtrmPropertyFactory().createInstance());
		return xtrmProperty;
	}

}
