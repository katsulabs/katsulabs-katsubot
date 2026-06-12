package xs.core.config;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.i18n.LocaleChangeInterceptor;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;
import org.thymeleaf.extras.springsecurity5.dialect.SpringSecurityDialect;

import lombok.extern.slf4j.Slf4j;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import xs.aichat.service.HyobeeJwtTokenService;
import xs.core.handler.app.XtrmAspect;
import xs.core.property.XtrmProperty;
import xs.core.view.XtrmExcelExportView;
import xs.webbase.view.FileDownloadView;
import xs.webbase.view.FileStreamView;

@Slf4j
@Configuration
@EnableAspectJAutoProxy
@ComponentScan(
		basePackages = "xs.*",
		useDefaultFilters = false,
		includeFilters = {
				@ComponentScan.Filter(Controller.class),
				@ComponentScan.Filter(Service.class),
				@ComponentScan.Filter(Repository.class),
				@ComponentScan.Filter(ControllerAdvice.class)
		})
@EnableWebMvc
public class XtrmWebMvcConfig implements WebMvcConfigurer {

	@Autowired
	private XtrmArgumentResolver xtrmArgumentResolver;

	@Resource(name = "xtrmProperty")
	private XtrmProperty objXtrmConfig;

    @Autowired
    private HyobeeJwtTokenService hyobeeJwtTokenService;

	@Override
	public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
		log.info("=============================================== configureDefaultServletHandling");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**")
				.addResourceLocations("classpath:/static/")
				.setCachePeriod(60 * 60 * 24 * 365);
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(xtrmArgumentResolver);
	}

	@Override
	public void configureMessageConverters(List<HttpMessageConverter<?>> messageConverters) {
		MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
		messageConverters.add(mappingJackson2HttpMessageConverter);
		StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter();
		stringHttpMessageConverter.setDefaultCharset(StandardCharsets.UTF_8);
		messageConverters.add(stringHttpMessageConverter);
		// PDF? ?? ByteArray ??? ?? + ??? ????? ?? MediaType ??(2025.03)
		ByteArrayHttpMessageConverter byteArrayHttpMessageConverter = new ByteArrayHttpMessageConverter();
		byteArrayHttpMessageConverter.setSupportedMediaTypes(Arrays.asList(
				MediaType.APPLICATION_PDF,
				MediaType.IMAGE_JPEG,
				MediaType.IMAGE_PNG,
				MediaType.IMAGE_GIF,
				MediaType.APPLICATION_OCTET_STREAM
		));
		messageConverters.add(byteArrayHttpMessageConverter);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LocaleChangeInterceptor())
				.order(0);
		registry.addInterceptor(this.XtrmHandlerInterceptor())
				.order(1)
				.addPathPatterns("/**")
				.excludePathPatterns("/",
						"/login",
						"/favicon.ico",
						"/error",
						"/version",
						"/xs/batch/api/**",
						"/xs/vob/sso/**",
						"/xs/vob/interfaces/**",
						"/webjars/**",
						"/sign-api/exception",
						"/actuator/**",
						"/html/**",
						"/resources/**",
						"/xs/vob/aichat/**",
						"/xs/aichat/**",
						"/static/**",
						"/public/**",
						"/**/*.js", "/**/*.css", "/**/*.png", "/**/*.jpg", "/**/*.jpeg", "/**/*.gif");
		// /xs/aichat/** ? ??? XtrmHandlerInterceptor ?? ?? ????? ??.
		registry.addInterceptor(new HyobeeApiInterceptor(hyobeeJwtTokenService))
				.order(3)
				.addPathPatterns("/xs/aichat/**");
	}

	@Bean
	public ViewResolver beanViewResolver() {
		BeanNameViewResolver viewResolver = new BeanNameViewResolver();
		viewResolver.setOrder(2);
		return viewResolver;
	}

	@Bean
	public ViewResolver jspViewResolver() {
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setViewClass(JstlView.class);
		viewResolver.setPrefix("/WEB-INF/views");
		viewResolver.setSuffix(".jsp");
		viewResolver.setOrder(3);
		return viewResolver;
	}

	@Bean
	public SpringSecurityDialect springSecurityDialect(){
		return new SpringSecurityDialect();
	}

	@Bean
	public LayoutDialect layoutDialect() {
		return new LayoutDialect();
	}

	@Bean
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setDefaultEncoding("UTF-8");
		messageSource.setBasename("classpath:messages");
//		messageSource.setUseCodeAsDefaultMessage(true);
		messageSource.setFallbackToSystemLocale(false);
		return messageSource;
	}

	@Bean
	public XtrmHandlerInterceptor XtrmHandlerInterceptor() {
		return new XtrmHandlerInterceptor();
	}

	@Bean
	public XtrmExcelExportView xtrmExportExcel() {
		return new XtrmExcelExportView();
	}

	@Bean
	public HyobeeApiInterceptor hyobeeApiInterceptor(HyobeeJwtTokenService hyobeeJwtTokenService) {
		return new HyobeeApiInterceptor(hyobeeJwtTokenService);
	}

	@Bean
	public XtrmAspect xtrmAspect() {
		return new XtrmAspect();
	}

	@Bean
	public View xtrmDownloadFile() {
		return new FileDownloadView();
	}

	@Bean
	public View xtrmFileStream() {
		return new FileStreamView();
	}

	@Bean
	@ConditionalOnMissingBean
	public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
		DefaultAdvisorAutoProxyCreator defaultAAP = new DefaultAdvisorAutoProxyCreator();
		defaultAAP.setProxyTargetClass(true);
		return defaultAAP;
	}

	@Bean
	public ThreadPoolTaskExecutor taskExecutor() {
		ThreadPoolTaskExecutor threadPoolTaskExecutor = new ThreadPoolTaskExecutor();
		threadPoolTaskExecutor.setCorePoolSize(20);
		threadPoolTaskExecutor.setMaxPoolSize(20);
		threadPoolTaskExecutor.setQueueCapacity(0);
		threadPoolTaskExecutor.setWaitForTasksToCompleteOnShutdown(true);
		return threadPoolTaskExecutor;
	}

	@Bean
	public CommonsMultipartResolver multipartResolver() {
		CommonsMultipartResolver commonsMultipartResolver = new CommonsMultipartResolver();
		commonsMultipartResolver.setMaxUploadSize(2147483647);
		commonsMultipartResolver.setMaxUploadSizePerFile(524288000);
		commonsMultipartResolver.setMaxInMemorySize(31457280);
		return commonsMultipartResolver;
	}

}
