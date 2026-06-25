package xs.core.factory;

import java.util.Properties;

import org.springframework.core.io.Resource;

import xs.core.property.XtrmPropertyLoader;

/**
 * 어플리케이션에서 Config 정보를 관리 및 생성하는 클래스
 */
public class XtrmPropertyFactory {
	private Resource[] locations;
	private Properties config = new Properties();

	public XtrmPropertyFactory() {

	}

	public final void init() throws Exception {
		if (this.locations != null) {
			XtrmPropertyLoader props = new XtrmPropertyLoader();
			for (Resource resource : this.locations) {
				props.load(resource.getInputStream());
			}
			props.fromProperties(System.getProperties());
			props.expandVariables();
			this.config = props.toProperties();
		}
	}

	public final Properties createInstance() {
		return this.config;
	}

	public final Class<Properties> getObjectType() {
		return Properties.class;
	}

	public final void setLocations(final Resource[] locations) {
		this.locations = locations;
	}

}
