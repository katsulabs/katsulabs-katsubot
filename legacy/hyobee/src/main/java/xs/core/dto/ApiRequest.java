package xs.core.dto;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpMethod;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import xs.core.enumeration.XtrmEnum;
import xs.core.utility.XtrmCmmnUtil;

@SuppressWarnings("unused")
@Slf4j
public class ApiRequest extends ApiEnvelope {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	public ApiRequest() {
		super();
	}

	public ApiRequest(Object objData) {
		super(objData);
	}

	/** application/x-www-form-urlencoded */
	public void bindFromRequest(HttpServletRequest objRequest) throws Exception {
		HttpMethod method = HttpMethod.valueOf(objRequest.getMethod());
		StringBuffer objBuffer = null;
		boolean isWriteLog = true;

		String[] consoleLogExcludeList = XtrmEnum.CONSOL_LOG_EXCLUDE_LIST.getCode().split(",");
		String strRequestURI = objRequest.getRequestURI();
		for (int i = 0; i < consoleLogExcludeList.length; i++) {
			if (strRequestURI.indexOf(consoleLogExcludeList[i]) >= 0) {
				isWriteLog = false;
				break;
			}
		}
		objBuffer = new StringBuffer();
		objBuffer.append("\n[" + XtrmCmmnUtil.getFormatDateTimeMilli("-", ":") + "]");
		objBuffer.append("\n┏" + XtrmCmmnUtil.lpad("", 10, "━"));
		objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
		objBuffer.append("REQUEST INFO [UUID=" + String.valueOf(objRequest.getAttribute("REQUEST_UUID")) + "]");
		objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
		objBuffer.append(XtrmCmmnUtil.lpad("", 77, "━") + "┓");

		Enumeration<String> objHeadereNames = objRequest.getHeaderNames();
		while (objHeadereNames.hasMoreElements()) {
			String name = objHeadereNames.nextElement();
			String value = objRequest.getHeader(name);
			objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[HEADER]", 10, " ")
					+ XtrmCmmnUtil.rpad(name, 30, " ") + ": "
					+ XtrmCmmnUtil.rpad(value, 120, " ") + "┃");
		}

		Enumeration<String> objParamNames = objRequest.getParameterNames();
		if (HttpMethod.POST == method) {
			while (objParamNames.hasMoreElements()) {
				String key = objParamNames.nextElement();
				String[] paramValues = objRequest.getParameterValues(key);
				if (paramValues != null) {
					for (int i = 0; i < paramValues.length; i++) {
						String paramValue = paramValues[i];
						objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[PARAMS]", 10, " ")
								+ XtrmCmmnUtil.rpad(key, 30, " ") + ": "
								+ XtrmCmmnUtil.rpad(paramValue, 120, " ") + "┃");
						applyParameterValue(key, paramValue);
					}
				} else {
					objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[PARAMS]", 10, " ")
							+ XtrmCmmnUtil.rpad(key, 30, " ") + ": "
							+ XtrmCmmnUtil.rpad("null", 120, " ") + "┃");
				}
			}
		} else {
			while (objParamNames.hasMoreElements()) {
				String key = objParamNames.nextElement();
				String[] paramValues = objRequest.getParameterValues(key);
				if (paramValues != null) {
					for (int i = 0; i < paramValues.length; i++) {
						objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[PARAMS]", 10, " ")
								+ XtrmCmmnUtil.rpad(key, 30, " ") + ": "
								+ XtrmCmmnUtil.rpad(paramValues[i], 120, " ") + "┃");
						setString(key, paramValues[i]);
					}
				} else {
					objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[PARAMS]", 10, " ")
							+ XtrmCmmnUtil.rpad(key, 30, " ") + ": "
							+ XtrmCmmnUtil.rpad("null", 120, " ") + "┃");
				}
			}
		}
		objBuffer.append("\n┗" + XtrmCmmnUtil.lpad("", 163, "━") + "┛");

		if (isWriteLog) {
			log.debug(objBuffer.toString());
		}
	}

	private void applyParameterValue(String key, String paramValue) {
		JsonNode jsonNode = parseValue(paramValue);
		if (jsonNode == null || jsonNode.isNull()) {
			setObject(key, paramValue);
			return;
		}
		if (jsonNode.isTextual()) {
			setString(key, jsonNode.asText());
			return;
		}
		if (jsonNode.isNumber()) {
			setObject(key, jsonNode.numberValue());
			return;
		}
		if (jsonNode.isBoolean()) {
			setBoolean(key, jsonNode.asBoolean());
			return;
		}
		if (jsonNode.isArray()) {
			setObject(key, jsonNode);
			return;
		}
		if (jsonNode.isObject()) {
			if ("jsonData".equals(key)) {
				setRoot(new ApiEnvelope(paramValue).getRoot().deepCopy());
			} else {
				setObject(key, jsonNode);
			}
			return;
		}
		setObject(key, paramValue);
	}

	private JsonNode parseValue(String paramValue) {
		try {
			return MAPPER.readTree(paramValue);
		} catch (Exception e) {
			setResultHeader(true, e.getMessage());
			return null;
		}
	}
}
