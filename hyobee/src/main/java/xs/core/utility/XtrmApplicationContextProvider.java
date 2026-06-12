package xs.core.utility;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component("XtrmApplicationContextProvider")
public class XtrmApplicationContextProvider implements ApplicationContextAware {

	private static ApplicationContext applicationContext;

	@Override
	public void setApplicationContext(ApplicationContext ctx) throws BeansException {
		applicationContext = ctx;
	}

	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}
}
