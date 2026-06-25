package xs.core.handler.app;

import java.util.Iterator;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmCryptoUtil;

@Aspect
public class XtrmAspect {

	@Pointcut("execution(* xs..controller.*Controller.*(..))")
	public void targetPointcut() {

	}

	@AfterReturning(pointcut = "targetPointcut()", returning = "xtrmReturn")
	public void resultXssFilter(JoinPoint jp, Object xtrmReturn) {
		ApiEnvelope xtrmHandleData = null;
		if (xtrmReturn instanceof ApiEnvelope) {
			xtrmHandleData = (ApiEnvelope) xtrmReturn;
		}
		if (xtrmHandleData != null) {
			ObjectNode jsonData = xtrmHandleData.getRoot();
			Iterator<String> iter = jsonData.fieldNames();
			String keyName = new String();
			while (iter.hasNext()) {
				keyName = iter.next();
				jsonData.set(keyName, recursiveData(keyName, jsonData.get(keyName)));
			}
			xtrmHandleData.setRoot(jsonData);
			xtrmHandleData.setHeader("CURRENT_DT", XtrmCmmnUtil.getFormatDateTime());
			getRequestId(xtrmHandleData); // 데이터 위변조 확인위해 추가 by 2021.04.06
		}
	}

	private JsonNode recursiveData(String keyName, JsonNode data) {
		if (data == null || data.isNull()) {
			return JsonNodeFactory.instance.textNode("");
		}
		if (data.isArray()) {
			ArrayNode arrayNode = (ArrayNode) data;
			for (int i = 0; i < arrayNode.size(); i++) {
				arrayNode.set(i, recursiveData("", arrayNode.get(i)));
			}
		} else if (data.isObject()) {
			ObjectNode objectNode = (ObjectNode) data;
			Iterator<String> iter = objectNode.fieldNames();
			String dataKey = new String();
			while (iter.hasNext()) {
				dataKey = iter.next();
				objectNode.set(dataKey, recursiveData(dataKey, objectNode.get(dataKey)));
			}
		} else if (data.isTextual()) {
			return JsonNodeFactory.instance.textNode(XtrmCmmnUtil.simpleFilterXSSConst(data.asText()));
		}
		return data;
	}

	/*
	 * 서버 -> view 간 데이터 위변조 체크하기 위해 추가
	 */
	private ApiEnvelope getRequestId(ApiEnvelope xtrmJson) {
		ApiEnvelope xtrmHandleData = xtrmJson;
		try {
			String strEncryptKey = "";
			String strRequestId = "";
			String strHeaderKey = "";
			ObjectNode header = xtrmHandleData.getHeaderObjectNode();
			Iterator<String> iterator = header.fieldNames();
			while (iterator.hasNext()) {
				String key = iterator.next();
				strHeaderKey += key;
				strRequestId += header.path(key).asText();
			}
			strRequestId = strRequestId.replace(" ", "+");
			for (int i = 0; i < 5; i++) {
				strEncryptKey += strHeaderKey;
			}
			if (strEncryptKey.length() > 32)
				strEncryptKey = strEncryptKey.substring(0, 32);
			strRequestId = XtrmCryptoUtil.encryptAES(strRequestId, strEncryptKey);
			xtrmHandleData.setHeader("REQUEST_ID", strRequestId);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return xtrmHandleData;
	}

}
