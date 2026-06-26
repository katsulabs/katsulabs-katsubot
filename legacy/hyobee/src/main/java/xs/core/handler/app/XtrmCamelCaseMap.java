package xs.core.handler.app;

import java.io.BufferedReader;
import java.io.StringWriter;
import java.util.HashMap;

import org.apache.commons.io.IOUtils;

public class XtrmCamelCaseMap extends HashMap<String, Object> {

	private static final long serialVersionUID = 1L;

	@Override
	public Object put(String strKey, Object objValue) {
		if (objValue instanceof java.sql.Clob) {
			return super.put(toCamelCase(strKey), convertClobToString((java.sql.Clob) objValue));
		} else {
			return super.put(toCamelCase(strKey), objValue);
		}
	}

	@SuppressWarnings("unused")
	private String toProperCase(String s, boolean isCapital) {
		String strReturnValue = "";
		if (isCapital) {
			strReturnValue = s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
		} else {
			strReturnValue = s.toLowerCase();
		}
		return strReturnValue;
	}

	private String toCamelCase(String s) {
		String[] parts = s.split("_");
		StringBuilder camelCaseString = new StringBuilder();
		for (int i = 0; i < parts.length; i++) {
			String part = parts[i];
			if (i != 0) {
				camelCaseString.append(part.substring(0, 1).toUpperCase() + part.substring(1).toLowerCase());
			} else {
				camelCaseString.append(part.toLowerCase());
			}
		}
		return camelCaseString.toString();
	}

	private String convertClobToString(java.sql.Clob objClob) {
		StringWriter writer = new StringWriter();
		try {
			BufferedReader objBr = new BufferedReader(objClob.getCharacterStream());
			IOUtils.copy(objBr, writer);
		} catch (Exception e) {
		}
		return writer.toString();
	}

}
