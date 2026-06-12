
package xs.core.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;
import xs.vob.management.AuthPagePreload;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Collection;
import java.util.Objects;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity //(debug = true)
@EnableGlobalMethodSecurity(
		securedEnabled = true, // @Secured 활성화
		prePostEnabled = true  // @PreAuthorized 활성화, @PostAuthroized 활성화
)
public class XtrmSecurityConifg {

	@Autowired
	private XtrmProperty mobjXtrmConfig;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		log.info("HttpSecurity: {}", http);
		String serviceMode = mobjXtrmConfig.getString("SERVICE_MODE","REAL");
		// 20250114 JJH 웹취약점 점검 조치에 따른 운영 모드일 경우 http -> https 강제하도록 추가.
		if( "REAL".equals(serviceMode)){
			http
					.cors()
					.and()
					.csrf().disable()
					.formLogin().disable()
					.httpBasic().disable()
					.headers().frameOptions().disable()
					.and()
					.authorizeHttpRequests()
					.antMatchers("/**").permitAll()
					.anyRequest().authenticated()
					.and()
					.addFilterBefore(xtrmAuthenticationFilter(), BasicAuthenticationFilter.class)
					.sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
					;
			return http.build();


			// 2025 취약점에서 사용한 소스 주석 처리 //
//			http
////					.requiresChannel(channel -> channel
////							.anyRequest().requiresSecure() // 모든 요청을 HTTPS로 강제
////					)
//					//.rememberMe().useSecureCookie(true) // Remember-me 쿠키에 secure 속성 적용
//					//.and()
//					.headers(headers -> headers
//							.cacheControl(cache -> cache.disable()) // 기본 캐시 정책 비활성화
//					)
//					.cors()
//					.and()
//					.csrf().disable()
//					.formLogin().disable()
//					.httpBasic().disable()
//					.headers().frameOptions().disable()
//					.and()
//					.authorizeHttpRequests()
//					.antMatchers("/**").permitAll()
//					.anyRequest().authenticated()
//					.and()
//					.addFilterBefore(xtrmAuthenticationFilter(), BasicAuthenticationFilter.class)
//					.sessionManagement()
//					.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//
//					// 20250115 JJH 웹취약점 보안 조치에 따른 브라우저에 https 이동하도록 헤더 설정 START
//					// 응답헤더에 Content-Security-Policy 헤더 적용되도록 설정
//					.and()
//					.headers()
//						.httpStrictTransportSecurity()
//							.maxAgeInSeconds(31536000)  // 24시간 동안 HSTS 적용
//							.includeSubDomains(true)  // 서브도메인도 포함
//							.preload(true)  // Preload 설정: 이 옵션은 웹 브라우저의 리스트에 도메인을 포함시켜 브라우저가 처음부터 HTTPS로 접속하게 함
//					.and()
//					.addHeaderWriter((request, response) -> {
//						// 기존 Set-Cookie 헤더를 가져오기
//						Collection<String> cookies = response.getHeaders("Set-Cookie");
//						response.getHeaders("Set-Cookie").clear(); // 기존 쿠키 제거
//
//						for (String cookie : cookies) {
//							// JSESSIONID 쿠키에 SameSite 속성 추가
//							if (cookie.startsWith("JSESSIONID")) {
//								response.addHeader("Set-Cookie", cookie + "; SameSite=Strict");
//							} else {
//								// 다른 쿠키는 그대로 추가
//								response.addHeader("Set-Cookie", cookie);
//							}
//						}
//					})
//					//.contentSecurityPolicy("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';")
//					.contentSecurityPolicy("default-src 'self'; script-src 'self' 'sha256-N/yCRAIEfbgeRe2J3m+7Lqvyy2DkyFKSQaw16pViVLs=' 'sha256-a5bVQ/dUORMvD3uCkm7zqQ3WO9RoO7nHbMU+VSE5OxA='; style-src 'self' ; img-src 'self'; font-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';")
//					// sha256-a5bVQ/dUORMvD3uCkm7zqQ3WO9RoO7nHbMU+VSE5OxA=
//			        // 20250115 JJH 웹취약점 보안 조치에 따른 브라우저에 https 이동하도록 헤더 설정 END
//					;
//			return http.build();
			// 2025 취약점에서 사용한 소스 주석 처리 //

		}else{
			http
					.cors()
					.and()
					.csrf().disable()
					.formLogin().disable()
					.httpBasic().disable()
					.headers().frameOptions().disable()
					.and()
					.authorizeHttpRequests()
					.antMatchers("/**").permitAll()
					.anyRequest().authenticated()
					.and()
					.addFilterBefore(xtrmAuthenticationFilter(), BasicAuthenticationFilter.class)
					.sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
			return http.build();
		}
	}

	@Bean
	protected InMemoryUserDetailsManager userDetailsManager() {
		UserDetails user = User.builder()
				.username("customUser")
				.password("{noop}password") // {noop}은 비밀번호 암호화 비활성화
				.roles("USER")
				.build();

		return new InMemoryUserDetailsManager(user);
	}

	@Bean
	protected XtrmAuthenticationFilter xtrmAuthenticationFilter() {
		return new XtrmAuthenticationFilter();
	}

}

/**
 * 인증이 필요한 회원 API 요청 시, jwt 인증 용도의 필터
 * 인증 마다 SecurityContext 생성 후 저장
 **/
@Getter
@RequiredArgsConstructor
@Slf4j
class XtrmAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private AuthPagePreload objAuthPagePreload;

	// 추가
	@Autowired
	private XtrmProperty mobjXtrmConfig;

	@Override
	protected void doFilterInternal(HttpServletRequest request,  HttpServletResponse response,  FilterChain filterChain)
			throws ServletException, IOException {
		log.debug("REQUEST_URI: {}", request.getRequestURI());
		String url = request.getRequestURI();
		// (2025.03) 팝업 경로에 속한 페이지에 한해 검증을 건너뛰도록 수정함
		String popupPagePath = mobjXtrmConfig.getString("POPUP_PAGE_PATH");

		String aiChatPagePath = mobjXtrmConfig.getString("AI_CHAT_PAGE_PATH");
		// requestURL이 팝업일 경우 validation 타지 않도록 함
		if ("JSP".equalsIgnoreCase(url.substring(url.lastIndexOf(".") + 1))
				&& !(url.contains(popupPagePath) || url.contains(aiChatPagePath))) {
			HttpSession session = request.getSession(false);
			objAuthPagePreload.checkValidationBeforePageLoad(request, response, session);
		}
		filterChain.doFilter(request, response);
	}

}
