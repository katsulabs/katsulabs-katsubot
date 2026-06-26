/**
 * 레거시 API wire format DTO — {@code {HEADER, DATA[]}} (TB-006).
 * 서비스·DAO 경계의 공통 envelope; typed row는 {@link ApiEnvelopes#selectMap} 등으로 분리한다.
 */
package xs.core.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

@SuppressWarnings("unchecked")
public class ApiEnvelope {

	public static final String GROUP_HEADER = "HEADER";
	public static final String GROUP_DATA = "DATA";

	private static final ObjectMapper MAPPER = new ObjectMapper();

	private ObjectNode root;

	public ApiEnvelope() {
		initEmpty();
	}

	public ApiEnvelope(String json) {
		this();
		if (json != null && !json.isBlank()) {
			try {
				applyParsedNode(MAPPER.readTree(json));
			} catch (JsonProcessingException e) {
				initEmpty();
			}
		}
	}

	public ApiEnvelope(Object objData) {
		this();
		if (objData == null) {
			return;
		}
		try {
			JsonNode parsed;
			if (objData instanceof String) {
				parsed = MAPPER.readTree(objData.toString());
			} else if (objData instanceof JsonNode) {
				parsed = (JsonNode) objData;
			} else {
				parsed = MAPPER.valueToTree(objData);
			}
			applyParsedNode(parsed);
		} catch (Exception e) {
			initEmpty();
		}
		ensureDefaultHeaderKeys();
	}

	public static ApiEnvelope parse(String json) {
		return new ApiEnvelope(json);
	}

	public ObjectNode getRoot() {
		return root;
	}

	public void setRoot(ObjectNode rootNode) {
		root = rootNode == null ? emptyRoot() : rootNode;
	}

	public boolean containsKey(String strKey, String strDataGroupName, int intIndex) {
		if (!isExistIndex(strDataGroupName, intIndex)) {
			return false;
		}
		JsonNode row = groupArray(strDataGroupName).get(intIndex);
		return row != null && row.isObject() && row.has(strKey);
	}

	public boolean containsKey(String strKey, String strDataGroupName) {
		return containsKey(strKey, strDataGroupName, 0);
	}

	public boolean containsKey(String strKey, int intIndex) {
		return containsKey(strKey, GROUP_DATA, intIndex);
	}

	public boolean containsKey(String strKey) {
		return containsKey(strKey, GROUP_DATA);
	}

	public boolean containsHeaderKey(String strKey) {
		return root.has(GROUP_HEADER) && headerNode().has(strKey);
	}

	public void setHeader(String strKey, String strValue) {
		headerNode().put(strKey, strValue);
	}

	public void setHeader(String strKey, boolean blnValue) {
		headerNode().put(strKey, blnValue);
	}

	public void setHeader(String strKey, int intValue) {
		headerNode().put(strKey, intValue);
	}

	public String getHeaderString(String strKey) {
		if (!containsHeaderKey(strKey)) {
			return "";
		}
		JsonNode node = headerNode().get(strKey);
		if (node == null || node.isNull()) {
			return "";
		}
		return node.isTextual() ? node.asText() : node.asText();
	}

	public boolean getHeaderBoolean(String strKey) {
		if (!containsHeaderKey(strKey)) {
			return false;
		}
		JsonNode node = headerNode().get(strKey);
		return node != null && !node.isNull() && node.isBoolean() && node.asBoolean();
	}

	public int getHeaderInt(String strKey) {
		if (!containsHeaderKey(strKey)) {
			return 0;
		}
		JsonNode node = headerNode().get(strKey);
		if (node == null || node.isNull() || !node.isNumber()) {
			return 0;
		}
		return node.asInt();
	}

	public void setInt(String strKey, int intValue, int intIndex, String strGroupName) {
		setObject(strKey, intValue, intIndex, strGroupName);
	}

	public void setInt(String strKey, int intValue, int intIndex) {
		setInt(strKey, intValue, intIndex, GROUP_DATA);
	}

	public void setInt(String strKey, int intValue, String strGroupName) {
		setInt(strKey, intValue, 0, strGroupName);
	}

	public void setInt(String strKey, int intValue) {
		setInt(strKey, intValue, 0, GROUP_DATA);
	}

	public void setBoolean(String strKey, boolean blnValue, int intIndex, String strDataGroupName) {
		setObject(strKey, blnValue, intIndex, strDataGroupName);
	}

	public void setBoolean(String strKey, boolean blnValue, int intIndex) {
		setBoolean(strKey, blnValue, intIndex, GROUP_DATA);
	}

	public void setBoolean(String strKey, boolean blnValue, String strGroupName) {
		setBoolean(strKey, blnValue, 0, strGroupName);
	}

	public void setBoolean(String strKey, boolean blnValue) {
		setBoolean(strKey, blnValue, 0, GROUP_DATA);
	}

	public void setLong(String strKey, Long longValue, int intIndex, String strDataGroupName) {
		setObject(strKey, longValue, intIndex, strDataGroupName);
	}

	public void setLong(String strKey, Long longValue, int intIndex) {
		setLong(strKey, longValue, intIndex, GROUP_DATA);
	}

	public void setLong(String strKey, Long longValue, String strGroupName) {
		setLong(strKey, longValue, 0, strGroupName);
	}

	public void setLong(String strKey, Long longValue) {
		setLong(strKey, longValue, 0, GROUP_DATA);
	}

	public void setDouble(String strKey, Double dblValue, int intIndex, String strDataGroupName) {
		setObject(strKey, dblValue, intIndex, strDataGroupName);
	}

	public void setDouble(String strKey, Double dblValue, int intIndex) {
		setDouble(strKey, dblValue, intIndex, GROUP_DATA);
	}

	public void setDouble(String strKey, Double dblValue, String strGroupName) {
		setDouble(strKey, dblValue, 0, strGroupName);
	}

	public void setDouble(String strKey, Double dblValue) {
		setDouble(strKey, dblValue, 0, GROUP_DATA);
	}

	public void setString(String strKey, String strValue, int intIndex, String strDataGroupName) {
		setObject(strKey, strValue, intIndex, strDataGroupName);
	}

	public void setString(String strKey, String strValue, int intIndex) {
		setString(strKey, strValue, intIndex, GROUP_DATA);
	}

	public void setString(String strKey, String strValue, String strGroupName) {
		setString(strKey, strValue, 0, strGroupName);
	}

	public void setString(String strKey, String strValue) {
		setString(strKey, strValue, 0, GROUP_DATA);
	}

	public void setObject(String strKey, Object objValue, int intIndex, String strDataGroupName) {
		ObjectNode row = ensureRow(strDataGroupName, intIndex);
		if (objValue == null) {
			row.putNull(strKey);
			return;
		}
		if (objValue instanceof String) {
			row.put(strKey, (String) objValue);
		} else if (objValue instanceof Boolean) {
			row.put(strKey, (Boolean) objValue);
		} else if (objValue instanceof Integer) {
			row.put(strKey, (Integer) objValue);
		} else if (objValue instanceof Double) {
			row.put(strKey, (Double) objValue);
		} else if (objValue instanceof Float) {
			row.put(strKey, (Float) objValue);
		} else if (objValue instanceof Long) {
			row.put(strKey, (Long) objValue);
		} else if (objValue instanceof Short) {
			row.put(strKey, (Short) objValue);
		} else if (objValue instanceof BigDecimal) {
			row.put(strKey, (BigDecimal) objValue);
		} else if (objValue instanceof JsonNode) {
			row.set(strKey, (JsonNode) objValue);
		} else {
			row.set(strKey, MAPPER.valueToTree(objValue));
		}
	}

	public void setObject(String strKey, Object objValue, int intIndex) {
		setObject(strKey, objValue, intIndex, GROUP_DATA);
	}

	public void setObject(String strKey, Object objValue, String strGroupName) {
		setObject(strKey, objValue, 0, strGroupName);
	}

	public void setObject(String strKey, Object objValue) {
		setObject(strKey, objValue, 0, GROUP_DATA);
	}

	public boolean getErrorFlag() {
		return getHeaderBoolean("ERROR_FLAG");
	}

	public String getErrorMsg() {
		return getHeaderString("ERROR_MSG");
	}

	public String getErrorCode() {
		return getHeaderString("ERROR_CODE");
	}

	public int getCount(String strDataGroupName) {
		int intReturnValue = 0;
		if (isExistGroupKey(strDataGroupName)) {
			ArrayNode targetJson = groupArray(strDataGroupName);
			intReturnValue = targetJson.size();
			if (intReturnValue == 1) {
				JsonNode jsonElement = targetJson.get(0);
				if (jsonElement == null || jsonElement.isNull()) {
					intReturnValue = 0;
				} else if (jsonElement.isObject() && jsonElement.size() == 0) {
					intReturnValue = 0;
				}
			}
			if (intReturnValue == 0) {
				String tempKeyName = GROUP_DATA.equals(strDataGroupName) ? "COUNT" : strDataGroupName + "_COUNT";
				if (containsHeaderKey(tempKeyName)) {
					intReturnValue = getHeaderInt(tempKeyName);
				}
			}
		}
		return intReturnValue;
	}

	public int getCount() {
		return getCount(GROUP_DATA);
	}

	public int getTotalCount(String strDataGroupName) {
		if (!isExistGroupKey(strDataGroupName)) {
			return 0;
		}
		String tempKeyName = GROUP_DATA.equals(strDataGroupName) ? "TOT_COUNT" : strDataGroupName + "_TOT_COUNT";
		if (containsHeaderKey(tempKeyName)) {
			return getHeaderInt(tempKeyName);
		}
		return getCount(strDataGroupName);
	}

	public int getTotalCount() {
		return getTotalCount(GROUP_DATA);
	}

	public String getString(String strDataGroupName, String strKey, int intIndex, String strValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, strValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isNull()) {
				return strValue;
			}
			if (jsonElement.isTextual()) {
				return jsonElement.asText();
			}
			if (jsonElement.isValueNode()) {
				return jsonElement.asText();
			}
			return jsonElement.toString();
		}
		return strValue;
	}

	public String getString(String strDataGroupName, String strKey, int intIndex) {
		return getString(strDataGroupName, strKey, intIndex, "");
	}

	public String getString(String strDataGroupName, String strKey) {
		return getString(strDataGroupName, strKey, 0, "");
	}

	public String getString(String strKey, int intIndex, String strValue) {
		return getString(GROUP_DATA, strKey, intIndex, strValue);
	}

	public String getString(String strKey, int intIndex) {
		return getString(GROUP_DATA, strKey, intIndex, "");
	}

	public String getString(String strKey) {
		return getString(GROUP_DATA, strKey, 0, "");
	}

	public int getInt(String strDataGroupName, String strKey, int intIndex, int intValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, intValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isNumber()) {
				return jsonElement.asInt();
			}
			if (jsonElement.isTextual()) {
				try {
					return Integer.parseInt(jsonElement.asText());
				} catch (NumberFormatException ignored) {
					return intValue;
				}
			}
		}
		return intValue;
	}

	public int getInt(String strDataGroupName, String strKey, int intIndex) {
		return getInt(strDataGroupName, strKey, intIndex, 0);
	}

	public int getInt(String strDataGroupName, String strKey) {
		return getInt(strDataGroupName, strKey, 0, 0);
	}

	public int getInt(String strKey, int intIndex, int intValue) {
		return getInt(GROUP_DATA, strKey, intIndex, intValue);
	}

	public int getInt(String strKey, int intIndex) {
		return getInt(GROUP_DATA, strKey, intIndex, 0);
	}

	public int getInt(String strKey) {
		return getInt(GROUP_DATA, strKey, 0, 0);
	}

	public long getLong(String strDataGroupName, String strKey, int intIndex, long longValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, longValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isNumber()) {
				return jsonElement.asLong();
			}
			if (jsonElement.isTextual()) {
				try {
					return Long.parseLong(jsonElement.asText());
				} catch (NumberFormatException ignored) {
					return longValue;
				}
			}
		}
		return longValue;
	}

	public long getLong(String strDataGroupName, String strKey, int intIndex) {
		return getLong(strDataGroupName, strKey, intIndex, 0L);
	}

	public long getLong(String strDataGroupName, String strKey) {
		return getLong(strDataGroupName, strKey, 0, 0L);
	}

	public long getLong(String strKey, int intIndex, long longValue) {
		return getLong(GROUP_DATA, strKey, intIndex, longValue);
	}

	public long getLong(String strKey, int intIndex) {
		return getLong(GROUP_DATA, strKey, intIndex, 0L);
	}

	public long getLong(String strKey) {
		return getLong(GROUP_DATA, strKey, 0, 0L);
	}

	public boolean getBoolean(String strDataGroupName, String strKey, int intIndex, boolean blnValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, blnValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isBoolean()) {
				return jsonElement.asBoolean();
			}
			if (jsonElement.isTextual()) {
				String strValue = jsonElement.asText().toLowerCase();
				if ("true".equals(strValue)) {
					return true;
				}
				if ("false".equals(strValue)) {
					return false;
				}
			}
		}
		return blnValue;
	}

	public boolean getBoolean(String strDataGroupName, String strKey, int intIndex) {
		return getBoolean(strDataGroupName, strKey, intIndex, false);
	}

	public boolean getBoolean(String strDataGroupName, String strKey) {
		return getBoolean(strDataGroupName, strKey, 0, false);
	}

	public boolean getBoolean(String strKey, int intIndex, boolean blnValue) {
		return getBoolean(GROUP_DATA, strKey, intIndex, blnValue);
	}

	public boolean getBoolean(String strKey, int intIndex) {
		return getBoolean(GROUP_DATA, strKey, intIndex, false);
	}

	public boolean getBoolean(String strKey) {
		return getBoolean(GROUP_DATA, strKey, 0, false);
	}

	public Object getObject(String strDataGroupName, String strKey, int intIndex, Object objValue) {
		if (containsKey(strKey, strDataGroupName, intIndex)) {
			return groupArray(strDataGroupName).get(intIndex).get(strKey);
		}
		return objValue;
	}

	public Object getObject(String strDataGroupName, String strKey, int intIndex) {
		return getObject(strDataGroupName, strKey, intIndex, "");
	}

	public Object getObject(String strDataGroupName, String strKey) {
		return getObject(strDataGroupName, strKey, 0, "");
	}

	public Object getObject(String strKey, int intIndex, Object objValue) {
		return getObject(GROUP_DATA, strKey, intIndex, objValue);
	}

	public Object getObject(String strKey, int intIndex) {
		return getObject(GROUP_DATA, strKey, intIndex, "");
	}

	public Object getObject(String strKey) {
		return getObject(GROUP_DATA, strKey, 0, "");
	}

	public void setResultHeader(boolean blnErrorFlag, String strMessage, String strErrorCode) {
		setHeader("ERROR_FLAG", blnErrorFlag);
		setHeader("ERROR_CODE", strErrorCode);
		setHeader("ERROR_MSG", strMessage);
	}

	public void setResultHeader(boolean blnErrorFlag, String strMessage) {
		setResultHeader(blnErrorFlag, strMessage, "");
	}

	public void setResultHeader(boolean blnErrorFlag) {
		setResultHeader(blnErrorFlag, "", "");
	}

	public void setValueAll(String strDataGroupName, Object keyNames, Object values) {
		if (keyNames == null || !isExistGroupKey(strDataGroupName)) {
			return;
		}
		List<String> keyList = toKeyList(keyNames);
		List<Object> valueList = toValueList(values);
		if (keyList.size() != valueList.size()) {
			return;
		}
		int size = groupArray(strDataGroupName).size();
		for (int i = 0; i < size; i++) {
			for (int j = 0; j < keyList.size(); j++) {
				setObject(keyList.get(j), valueList.get(j), i, strDataGroupName);
			}
		}
	}

	public void setValueAll(Object keyNames, Object value) {
		setValueAll(GROUP_DATA, keyNames, value);
	}

	public void setValueToNull(String strDataGroupName, Object keyNames, int intIndex, Object compareValue) {
		if (compareValue == null || !isExistIndex(strDataGroupName, intIndex)) {
			return;
		}
		JsonNode row = groupArray(strDataGroupName).get(intIndex);
		if (!(row instanceof ObjectNode)) {
			return;
		}
		ObjectNode objectNode = (ObjectNode) row;
		List<String> keyList = keyNames == null ? null : toKeyList(keyNames);
		List<String> fieldNames = new ArrayList<>();
		objectNode.fieldNames().forEachRemaining(fieldNames::add);
		for (String fieldName : fieldNames) {
			if (keyList != null && !keyList.contains(fieldName)) {
				continue;
			}
			JsonNode element = objectNode.get(fieldName);
			if (matchesCompareValue(element, compareValue)) {
				objectNode.putNull(fieldName);
			}
		}
	}

	public void setValueToNull(String strDataGroupName, String strColNames, String strCompareValue) {
		setValueToNull(strDataGroupName, strColNames, 0, strCompareValue);
	}

	public void setValueToNull(String strDataGroupName, String strColNames) {
		setValueToNull(strDataGroupName, strColNames, 0, "");
	}

	public void setValueToNull(String strDataGroupName, int intIndex, String strCompareValue) {
		setValueToNull(strDataGroupName, null, intIndex, strCompareValue);
	}

	public void setValueToNull(String strDataGroupName, int intIndex) {
		setValueToNull(strDataGroupName, null, intIndex, "");
	}

	public void setValueToNull(String strDataGroupName) {
		setValueToNull(strDataGroupName, null, 0, "");
	}

	public void setValueToNull(int intIndex) {
		setValueToNull(GROUP_DATA, null, intIndex, "");
	}

	public void setValueToNull() {
		setValueToNull(GROUP_DATA, null, 0, "");
	}

	public void setValueAllToNull(String strDataGroupName, Object keyNames, Object compareValue) {
		if (compareValue == null || !isExistGroupKey(strDataGroupName)) {
			return;
		}
		int size = groupArray(strDataGroupName).size();
		for (int i = 0; i < size; i++) {
			setValueToNull(strDataGroupName, keyNames, i, compareValue);
		}
	}

	public void setValueAllToNull(String strDataGroupName, String strColNames) {
		setValueAllToNull(strDataGroupName, strColNames, "");
	}

	public void setValueAllToNull(String strDataGroupName) {
		setValueAllToNull(strDataGroupName, null, "");
	}

	public void setValueAllToNull() {
		setValueAllToNull(GROUP_DATA, null, "");
	}

	public boolean isExistGroupKey(String strDataGroupName) {
		return root.has(strDataGroupName) && !GROUP_HEADER.equals(strDataGroupName);
	}

	public boolean isExistIndex(String strDataGroupName, int intIndex) {
		if (!isExistGroupKey(strDataGroupName)) {
			return false;
		}
		ArrayNode targetJson = groupArray(strDataGroupName);
		return targetJson.size() > 0 && intIndex < targetJson.size();
	}

	public boolean isExistIndex(int intIndex) {
		return isExistIndex(GROUP_DATA, intIndex);
	}

	public ObjectNode getHeaderObjectNode() {
		return headerNode();
	}

	public ArrayNode getDataArrayNode(String strDataGroupName) {
		if (!isExistGroupKey(strDataGroupName)) {
			return null;
		}
		return groupArray(strDataGroupName).deepCopy();
	}

	public ArrayNode getDataArrayNode() {
		return getDataArrayNode(GROUP_DATA);
	}

	public ObjectNode getDataObjectNode(String strDataGroupName, int intIndex) {
		if (!isExistIndex(strDataGroupName, intIndex)) {
			return null;
		}
		JsonNode row = groupArray(strDataGroupName).get(intIndex);
		if (row == null || row.isNull() || !row.isObject()) {
			return null;
		}
		return ((ObjectNode) row).deepCopy();
	}

	public ObjectNode getDataObjectNode(int intIndex) {
		return getDataObjectNode(GROUP_DATA, intIndex);
	}

	public ObjectNode getDataObjectNode() {
		return getDataObjectNode(GROUP_DATA, 0);
	}

	public ObjectNode getDataObjectNode(String strDataGroupName) {
		return getDataObjectNode(strDataGroupName, 0);
	}

	public void setDataArrayNode(ArrayNode arrayNode, String strDataGroupName) {
		root.remove(strDataGroupName);
		root.set(strDataGroupName, arrayNode == null ? MAPPER.createArrayNode() : arrayNode.deepCopy());
	}

	public void setDataArrayNode(ArrayNode arrayNode) {
		setDataArrayNode(arrayNode, GROUP_DATA);
	}

	public void setDataObjectNode(ObjectNode objectNode, String strDataGroupName, int intIndex) {
		if (!isExistGroupKey(strDataGroupName)) {
			return;
		}
		ArrayNode array = groupArray(strDataGroupName);
		ObjectNode copy = objectNode == null ? MAPPER.createObjectNode() : objectNode.deepCopy();
		if (!isExistIndex(strDataGroupName, intIndex)) {
			array.add(copy);
		} else {
			array.set(intIndex, copy);
		}
	}

	public void setDataObjectNode(ObjectNode objectNode, int intIndex) {
		setDataObjectNode(objectNode, GROUP_DATA, intIndex);
	}

	public void setDataObjectNode(ObjectNode objectNode) {
		setDataObjectNode(objectNode, GROUP_DATA, 0);
	}

	public void setDataArrayNode(ApiEnvelope source, String strGetDataGroupName, String strPutDataGroupName) {
		setDataArrayNode(source.getDataArrayNode(strGetDataGroupName), strPutDataGroupName);
	}

	public void setDataArrayNode(ApiEnvelope source, String strGetDataGroupName) {
		setDataArrayNode(source, strGetDataGroupName, GROUP_DATA);
	}

	public void setDataArrayNode(ApiEnvelope source) {
		setDataArrayNode(source, GROUP_DATA, GROUP_DATA);
	}

	public void removeKey(String strDataGroupName, String strKey, int intIndex) {
		if (containsKey(strKey, strDataGroupName, intIndex)) {
			((ObjectNode) groupArray(strDataGroupName).get(intIndex)).remove(strKey);
		}
	}

	public void removeKey(String strDataGroupName, String strKey) {
		removeKey(strDataGroupName, strKey, 0);
	}

	public void removeKey(String strKey) {
		removeKey(GROUP_DATA, strKey, 0);
	}

	public void removeKeyAll(String strDataGroupName, String strKey) {
		if (isExistGroupKey(strDataGroupName)) {
			int size = groupArray(strDataGroupName).size();
			for (int i = 0; i < size; i++) {
				removeKey(strDataGroupName, strKey, i);
			}
		}
	}

	public void removeKeyAll(String strKey) {
		removeKeyAll(GROUP_DATA, strKey);
	}

	public void removeGroup(String strDataGroupName) {
		if (!GROUP_HEADER.equals(strDataGroupName) && !GROUP_DATA.equals(strDataGroupName)
				&& isExistGroupKey(strDataGroupName)) {
			root.remove(strDataGroupName);
		}
	}

	public void removeHeader(String strKey) {
		if (containsHeaderKey(strKey)) {
			headerNode().remove(strKey);
		}
	}

	public void setHeaderObjectNode(ObjectNode header) {
		root.set(GROUP_HEADER, header == null ? MAPPER.createObjectNode() : header.deepCopy());
	}

	public float getFloat(String strDataGroupName, String strKey, int intIndex, float floatValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, floatValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isNumber()) {
				return (float) jsonElement.asDouble();
			}
			if (jsonElement.isTextual()) {
				try {
					return Float.parseFloat(jsonElement.asText());
				} catch (NumberFormatException ignored) {
					return floatValue;
				}
			}
		}
		return floatValue;
	}

	public float getFloat(String strDataGroupName, String strKey, int intIndex) {
		return getFloat(strDataGroupName, strKey, intIndex, 0);
	}

	public float getFloat(String strDataGroupName, String strKey) {
		return getFloat(strDataGroupName, strKey, 0, 0);
	}

	public float getFloat(String strKey, int intIndex, float floatValue) {
		return getFloat(GROUP_DATA, strKey, intIndex, floatValue);
	}

	public float getFloat(String strKey, int intIndex) {
		return getFloat(GROUP_DATA, strKey, intIndex, 0);
	}

	public float getFloat(String strKey) {
		return getFloat(GROUP_DATA, strKey, 0, 0);
	}

	public double getDouble(String strDataGroupName, String strKey, int intIndex, double dblValue) {
		Object objValue = getObject(strDataGroupName, strKey, intIndex, dblValue);
		if (objValue instanceof JsonNode) {
			JsonNode jsonElement = (JsonNode) objValue;
			if (jsonElement.isNumber()) {
				return jsonElement.asDouble();
			}
			if (jsonElement.isTextual()) {
				try {
					return Double.parseDouble(jsonElement.asText());
				} catch (NumberFormatException ignored) {
					return dblValue;
				}
			}
		}
		return dblValue;
	}

	public double getDouble(String strDataGroupName, String strKey, int intIndex) {
		return getDouble(strDataGroupName, strKey, intIndex, 0);
	}

	public double getDouble(String strDataGroupName, String strKey) {
		return getDouble(strDataGroupName, strKey, 0, 0);
	}

	public double getDouble(String strKey, int intIndex, double dblValue) {
		return getDouble(GROUP_DATA, strKey, intIndex, dblValue);
	}

	public double getDouble(String strKey, int intIndex) {
		return getDouble(GROUP_DATA, strKey, intIndex, 0);
	}

	public double getDouble(String strKey) {
		return getDouble(GROUP_DATA, strKey, 0, 0);
	}

	@Override
	@JsonValue
	public String toString() {
		try {
			return MAPPER.writeValueAsString(root);
		} catch (JsonProcessingException e) {
			return root.toString();
		}
	}

	private void initEmpty() {
		root = emptyRoot();
	}

	private static ObjectNode emptyRoot() {
		ObjectNode empty = JsonNodeFactory.instance.objectNode();
		ObjectNode header = JsonNodeFactory.instance.objectNode();
		header.put("ERROR_FLAG", false);
		header.put("ERROR_CODE", "");
		header.put("ERROR_MSG", "");
		ArrayNode data = JsonNodeFactory.instance.arrayNode();
		data.add(JsonNodeFactory.instance.objectNode());
		empty.set(GROUP_HEADER, header);
		empty.set(GROUP_DATA, data);
		return empty;
	}

	private void applyParsedNode(JsonNode parsed) {
		if (parsed == null || parsed.isNull()) {
			initEmpty();
			return;
		}
		if (parsed.isObject()) {
			ObjectNode obj = (ObjectNode) parsed;
			if (obj.has("jsonData") && obj.get("jsonData").isObject()) {
				root = (ObjectNode) obj.get("jsonData").deepCopy();
			} else if (obj.has(GROUP_HEADER) && obj.has(GROUP_DATA)) {
				root = obj.deepCopy();
			} else {
				initEmpty();
				setDataObjectNode(obj.deepCopy(), GROUP_DATA, 0);
			}
		} else if (parsed.isArray()) {
			initEmpty();
			setDataArrayNode((ArrayNode) parsed.deepCopy(), GROUP_DATA);
		} else {
			initEmpty();
		}
		ensureDefaultHeaderKeys();
	}

	private void ensureDefaultHeaderKeys() {
		if (!containsHeaderKey("ERROR_FLAG")) {
			setHeader("ERROR_FLAG", false);
		}
		if (!containsHeaderKey("ERROR_MSG")) {
			setHeader("ERROR_MSG", "");
		}
	}

	private ObjectNode headerNode() {
		JsonNode header = root.get(GROUP_HEADER);
		if (header == null || !header.isObject()) {
			ObjectNode created = MAPPER.createObjectNode();
			root.set(GROUP_HEADER, created);
			return created;
		}
		return (ObjectNode) header;
	}

	private ArrayNode groupArray(String strDataGroupName) {
		JsonNode node = root.get(strDataGroupName);
		if (node != null && node.isArray()) {
			return (ArrayNode) node;
		}
		ArrayNode created = MAPPER.createArrayNode();
		root.set(strDataGroupName, created);
		return created;
	}

	private ObjectNode ensureRow(String strDataGroupName, int intIndex) {
		ArrayNode array = groupArray(strDataGroupName);
		while (array.size() <= intIndex) {
			array.add(MAPPER.createObjectNode());
		}
		JsonNode row = array.get(intIndex);
		if (row == null || !row.isObject()) {
			ObjectNode created = MAPPER.createObjectNode();
			array.set(intIndex, created);
			return created;
		}
		return (ObjectNode) row;
	}

	private static List<String> toKeyList(Object keyNames) {
		if (keyNames == null) {
			return null;
		}
		List<String> keyList = new ArrayList<>();
		if (keyNames instanceof String) {
			keyList.add((String) keyNames);
		} else if (keyNames instanceof String[]) {
			keyList = Arrays.asList((String[]) keyNames);
		} else if (keyNames instanceof ArrayList) {
			keyList = (ArrayList<String>) keyNames;
		} else if (keyNames instanceof List) {
			keyList = (List<String>) keyNames;
		}
		return keyList;
	}

	private static List<Object> toValueList(Object values) {
		List<Object> valueList = new ArrayList<>();
		if (values instanceof String) {
			valueList.add(values);
		} else if (values instanceof Object[]) {
			valueList = Arrays.asList((Object[]) values);
		} else if (values instanceof ArrayList) {
			valueList = (ArrayList<Object>) values;
		} else if (values instanceof List) {
			valueList = (List<Object>) values;
		} else {
			valueList.add(values);
		}
		return valueList;
	}

	private static boolean matchesCompareValue(JsonNode element, Object compareValue) {
		if (element == null || element.isNull() || !element.isValueNode()) {
			return false;
		}
		if (element.isTextual() && compareValue instanceof String) {
			return element.asText().equals(compareValue.toString());
		}
		if (element.isNumber() && compareValue instanceof Number) {
			return element.asDouble() == ((Number) compareValue).doubleValue();
		}
		if (element.isBoolean() && compareValue instanceof Boolean) {
			return element.asBoolean() == (Boolean) compareValue;
		}
		return false;
	}
}
