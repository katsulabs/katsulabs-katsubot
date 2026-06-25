package xs.core.property;

import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.text.StrSubstitutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("deprecation")
public class XtrmPropertyLoader extends HashMap<String, String> {

	private static final Logger LOG = LoggerFactory.getLogger(XtrmPropertyLoader.class);
	private static final long serialVersionUID = 2211405016738281987L;

	public XtrmPropertyLoader(){
		LOG.info(XtrmPropertyLoader.class.getName());
	}
	public XtrmPropertyLoader(final URL url) throws Exception {
		load(url);
		expandVariables();
	}
	public XtrmPropertyLoader(final Properties props) {
		fromProperties(props);
		expandVariables();
	}
	public XtrmPropertyLoader(final Map<String, String> map) {
		putAll(map);
		expandVariables();
	}
	public final List<String> getGroupKeys(final String groupKey) {
		List<String> result = new ArrayList<>();
		for (String key : keySet()) {
			if (key.startsWith(groupKey)) {
				result.add(key);
			}
		}
		return result;
	}
	public final String getString(final String key) throws Exception {
		return get(key);
	}
	public final String getString(final String key, final String def) {
		String result = get(key);
		if (result == null) {
			result = def;
		}
		return result;
	}
	public final int getInt(final String key) throws Exception {
		String val = getString(key);
		int ret = Integer.parseInt(val);
		return ret;
	}
	public final int getInt(final String key, final int def) {
		String val = getString(key, "" + def);
		int ret = Integer.parseInt(val);
		return ret;
	}
	public final boolean getBoolean(final String key) throws Exception {
		String val = getString(key);
		return Boolean.parseBoolean(val);
	}
	public final boolean getBoolean(final String key, final boolean def) {
		String val = getString(key, "" + def);
		return Boolean.parseBoolean(val);
	}
	public final long getLong(final String key) throws Exception {
		String val = getString(key);
		long ret = Long.parseLong(val);
		return ret;
	}
	public final long getLong(final String key, final long def) {
		String val = getString(key, "" + def);
		long ret = Long.parseLong(val);
		return ret;
	}
	public final double getDouble(final String key) throws Exception {
		String val = getString(key);
		double ret = Double.parseDouble(val);
		return ret;
	}
	public final double getDouble(final String key, final double def) {
		String val = getString(key, "" + def);
		double ret = Double.parseDouble(val);
		return ret;
	}
	public final void load(final URL url) throws Exception {
		load(url.openStream()); // load() should call close on stream.
	}
	public final void load(final InputStream inStream) throws Exception {
		Properties props = null;
		try{
			props = new Properties();
			props.load(inStream);
		}finally{
			if(inStream != null){IOUtils.closeQuietly(inStream);}
		}
		fromProperties(props);
	}
	public final void expandVariables() {
		StrSubstitutor substitutor = new StrSubstitutor(this);
		for (Entry<String, String> entry : entrySet()) {
			String name = entry.getKey();
			String val = entry.getValue();
			if (val == null) {
				continue;
			}
			String newVal = substitutor.replace(val);
			if (!newVal.equals(val)) {
				this.put(name, newVal);
			}
		}
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public final void fromProperties(final Properties props) {
		Map<String, String> map = (Map)props;
		super.putAll(map);
	}
	@SuppressWarnings({ "rawtypes" })
	public final Properties toProperties() {
		Properties properties = new Properties();
		properties.putAll((Map)this.clone());
		return properties;
	}
}
