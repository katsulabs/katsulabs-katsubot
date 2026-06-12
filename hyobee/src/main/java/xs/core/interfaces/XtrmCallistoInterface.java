package xs.core.interfaces;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import xs.core.interfaces.enumeration.CallistoEnums.CALLISTO_API;
import xs.core.interfaces.enumeration.CallistoEnums.CALLISTO_ERROR_CODE;
import xs.core.interfaces.enumeration.CallistoEnums.MORPHEME_ANALYZER;
import xs.core.interfaces.enumeration.CallistoEnums.MORPHEME_RESULT_TYPE;
import xs.core.module.XtrmRestComponent;
import xs.core.module.XtrmRestComponentDeep;
import xs.core.dto.ApiEnvelope;
import xs.core.property.XtrmProperty;
import xs.core.utility.XtrmCmmnUtil;

@Component
@SuppressWarnings("unchecked")
public class XtrmCallistoInterface{

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Autowired
	XtrmRestComponent restComponent;

	@Autowired
	XtrmRestComponentDeep restComponentDeep;

	@Autowired
	XtrmProperty xtrmConfig;

	private String protocol;

	private String url;

	@PostConstruct
	public void init() {
		this.protocol							= xtrmConfig.getString("CALLISTO_PROTOCOL");
		this.url								= xtrmConfig.getString("CALLISTO_URL");
	}

	/**
	 * 오탈자 사전 데이터 로드
	 */
	public ApiEnvelope loadCorrectionData(ObjectNode data, String domain, String group){
		ArrayNode requestArray					= JsonNodeFactory.instance.arrayNode();
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		ArrayNode groupArray					= JsonNodeFactory.instance.arrayNode();
		ObjectNode groupJson					= JsonNodeFactory.instance.objectNode();
		requestJson.put("domain"				, domain);
		groupJson.put("group"					, group);
		groupJson.set("data"					, data);
		groupArray.add(groupJson);
		requestJson.set("groups"				, groupArray);
		requestArray.add(requestJson);
		return request(CALLISTO_API.LOAD_CORRECTION_DATA, requestArray);
	}
	public ApiEnvelope loadCorrectionData(ObjectNode data, String domain){
		return loadCorrectionData(data, domain, "default");
	}
	public ApiEnvelope loadCorrectionData(ObjectNode data){
		return loadCorrectionData(data, XtrmCmmnUtil.getProperty("CALLISTO_DEFAULT_DOMAIN").toString(), "default");
	}

	/**
	 * 패턴 매칭 사전 데이터 로드
	 */
	public ApiEnvelope loadPatternMatchingGroup(ArrayNode groups, String domain){
		ArrayNode requestArray					= JsonNodeFactory.instance.arrayNode();
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.put("domain"				, domain);
		requestJson.set("groups", groups);
		requestArray.add(requestJson);
		return request(CALLISTO_API.LOAD_PATTERN_MATCHING_DATA, requestArray);
	}
	public ApiEnvelope loadPatternMatchingGroup(ArrayNode groups){
		return loadPatternMatchingGroup(groups, XtrmCmmnUtil.getProperty("CALLISTO_DEFAULT_DOMAIN").toString());
	}
	/**
	 *
	 */
	public ApiEnvelope loadPatternMatchingData(ObjectNode data, String group){
		ArrayNode groupArray					= JsonNodeFactory.instance.arrayNode();
		ObjectNode groupJson					= JsonNodeFactory.instance.objectNode();
		groupJson.put("group"					, group);
		groupJson.set("data"					, data);
		groupArray.add(groupJson);
		return loadPatternMatchingGroup(groupArray);
	}
	public ApiEnvelope loadPatternMatchingData(ObjectNode data){
		return loadPatternMatchingData(data, "default");
	}

	/**
	 * 패턴 매칭
	 */
	public ApiEnvelope findPatternMatching(Object text, String domain, Object group){
		ApiEnvelope xtrmReturn					= new ApiEnvelope();
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.put("domain"				, domain);
		requestJson.set("text"					, collectList(text));
		if(group instanceof String){
			requestJson.put("group"				, (String)group);
			xtrmReturn							= request(CALLISTO_API.FIND_PATTERN_MATCHING, requestJson);
		}else if(group != null){
			requestJson.set("groups"			, collectList(group));
			xtrmReturn							= request(CALLISTO_API.FIND_GROUP_PATTERN_MATCHING, requestJson);
		}else{
			xtrmReturn							= request(CALLISTO_API.FIND_PATTERN_MATCHING, requestJson);
		}
		return xtrmReturn;
	}
	public ApiEnvelope findPatternMatching(Object text, String domain){
		return findPatternMatching(text, domain, null);
	}
	public ApiEnvelope findPatternMatching(Object text){
		return findPatternMatching(text, XtrmCmmnUtil.getProperty("CALLISTO_DEFAULT_DOMAIN").toString(), null);
	}
	/**
	 *
	 */
	public ApiEnvelope findPatternMatchingWithPatterns(Object text, ObjectNode patterns){
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.set("text"					, collectList(text));
		requestJson.set("patterns"				, patterns);
		return request(CALLISTO_API.FIND_PATTERN_MATCHING, requestJson);
	}

	/**
	 * 문장 분류
	 */
	public ApiEnvelope checkClassificationSync(Object text, String domain, String group, double threshold, int limit){
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.put("domain"				, domain);
		requestJson.set("text"					, collectList(text));
		requestJson.put("group"					, group);
		requestJson.put("threshold"				, threshold);
		requestJson.put("limit"					, limit);
		return request(CALLISTO_API.CHECK_CLASSIFICATOIN_SYNC, requestJson);
	}
	public ApiEnvelope checkClassificationSync(Object text, String domain, String group, double threshold){
		return checkClassificationSync(text, domain, group, threshold, 99999);
	}
	public ApiEnvelope checkClassificationSync(Object text, String domain, String group, int limit){
		return checkClassificationSync(text, domain, group, 0, limit);
	}
	public ApiEnvelope checkClassificationSync(Object text, String domain, String group){
		return checkClassificationSync(text, domain, group, 0, 99999);
	}
	public ApiEnvelope checkClassificationSync(Object text, String domain){
		return checkClassificationSync(text, domain, "default", 0, 99999);
	}
	public ApiEnvelope checkClassificationSync(Object text){
		return checkClassificationSync(text, XtrmCmmnUtil.getProperty("CALLISTO_DEFAULT_DOMAIN").toString(), "default", 0, 99999);
	}

	/**
	 * 형태소 분석
	 */
	public ApiEnvelope divideMorpheme(Object text, MORPHEME_ANALYZER analyzerType, MORPHEME_RESULT_TYPE resultType){
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.set("text"					, collectList(text));
		requestJson.put("type"					, resultType.name());
		requestJson.put("tagger"				, analyzerType.name());
		requestJson.put("withEng"				, false);
		return request(CALLISTO_API.MORPHEME_ANALYZE, requestJson);
	}
	public ApiEnvelope divideMorpheme(Object text, MORPHEME_ANALYZER analyzerType){
		return divideMorpheme(text, analyzerType, MORPHEME_RESULT_TYPE.line);
	}
	public ApiEnvelope divideMorpheme(Object text){
		return divideMorpheme(text, MORPHEME_ANALYZER.utagger, MORPHEME_RESULT_TYPE.line);
	}
	
	/**
	 * 문장분류 조회
	 */
	public ApiEnvelope checkClassification(String domain, String groups){
		ArrayNode requestArray = JsonNodeFactory.instance.arrayNode();
		ObjectNode requestJson = JsonNodeFactory.instance.objectNode();
		ArrayNode jsonArray    = JsonNodeFactory.instance.arrayNode();
		jsonArray.add(groups);
		requestJson.put("domain", domain);
		requestJson.set("groups", jsonArray);
		requestArray.add(requestJson);
		return request(CALLISTO_API.CLASSIFICATION_GET, requestArray);
	}
	
	/**
	 * 문장분류 test
	 */
	public ApiEnvelope simulationClassification(ObjectNode requestJson){
		return request(CALLISTO_API.CLASSIFICATION_SIMULATION, requestJson);
	}
	
	/**
	 * 감정분석 도메인 등록
	 */
	public ApiEnvelope createEmotionDomain(String domain){
		ObjectNode requestJson = JsonNodeFactory.instance.objectNode();
		requestJson.put("domain", domain);
		return request(CALLISTO_API.CREATE_EMOTION_DOMAIN, requestJson);
	}
	
	/**
	 * 키워드 추출
	 */
	public ApiEnvelope keyword(Object text, String tagger, int limit, int minNearWord){
		ObjectNode requestJson					= JsonNodeFactory.instance.objectNode();
		requestJson.set("text"					, collectList(text));
		if(tagger != null && !"".equals(tagger)) {
			requestJson.put("tagger"			, tagger);
		}
		if(limit != 0) {
			requestJson.put("limit"				, limit);
		}
		if(minNearWord != 0) {
			requestJson.put("minNearWord"		, minNearWord);
		}
		return request(CALLISTO_API.KEYWORD		, requestJson);
	}
	public ApiEnvelope keyword(Object text, String tagger, int limit){
		return keyword(text, tagger, limit, 0);
	}
	public ApiEnvelope keyword(Object text, String tagger){
		return keyword(text, tagger, 0, 0);
	}
	public ApiEnvelope keyword(Object text){
		return keyword(text, null, 0, 0);
	}
	
	/**
	 *
	 */
	public ApiEnvelope request(CALLISTO_API api, Object requestParam){
		if(api == null){
			return null;
		}
		HttpMethod method						= api.getMethodType();
		String context							= api.getContext();
		String URL								= this.protocol + "://" + this.url + "/" + context;
		long s									= System.currentTimeMillis();
		String response							= restComponent.request(URL, writeRequestPayload(requestParam), method);
		long e									= System.currentTimeMillis();
		ApiEnvelope xtrmReturnData				= parseStandardResponse(response);
		xtrmReturnData.setHeader("took", String.valueOf(e - s));
		return xtrmReturnData;
	}

	/**
	 * TIMEOUT 시간을 별도로 지정할 경우 해당 값을 함께 요청하기 위해 분리 (120 -> 600)
	 * @param api
	 * @param requestParam
	 * @param isDeep
	 * @return
	 */
	public ApiEnvelope request(CALLISTO_API api, Object requestParam, boolean isDeep){
		if(api == null){
			return null;
		}
		HttpMethod method						= api.getMethodType();
		String context							= api.getContext();
		String URL								= this.protocol + "://" + this.url + "/" + context;
		long s									= System.currentTimeMillis();
		String response							= restComponentDeep.request(URL, writeRequestPayload(requestParam), method);
		long e									= System.currentTimeMillis();
		ApiEnvelope xtrmReturnData				= parseStandardResponse(response);
		xtrmReturnData.setHeader("took", String.valueOf(e - s));
		return xtrmReturnData;
	}

	/**
	 * 콜백 방식 적용을 위한 request 메서드 분리 (단건요약 배치용)
	 * @param api
	 * @param requestParam
	 * @return
	 */
	public ApiEnvelope request2(CALLISTO_API api, Object requestParam){
		ApiEnvelope xtrmReturnData				= null;
		if(api != null){
			xtrmReturnData						= new ApiEnvelope();
			HttpMethod method					= api.getMethodType();
			String context						= api.getContext();
			String URL							= this.protocol + "://" + this.url + "/" + context;
			long s								= System.currentTimeMillis();
			String response						= restComponentDeep.request(URL, writeRequestPayload(requestParam), method);
			long e								= System.currentTimeMillis();
			try {
				if(response != null && !"".equals(response)){
					JsonNode parsedNode			= MAPPER.readTree(response);
					if(parsedNode instanceof ObjectNode){
						ObjectNode requestBody = (ObjectNode) parsedNode;

						boolean errorFlag		= !requestBody.path("success").asBoolean();
						String errorCode		= requestBody.path("code").asText("");
						String errorMessage		= resolveErrorMessage(errorCode, requestBody.path("detail").asText(""));
						xtrmReturnData.setResultHeader(errorFlag, errorMessage, errorCode);

						JsonNode bizReqNode		= requestBody.get("biz_req");
						if(bizReqNode instanceof ObjectNode){
							Iterator<String> fieldNames = bizReqNode.fieldNames();
							while(fieldNames.hasNext()){
								String key = fieldNames.next();
								xtrmReturnData.setObject(key, bizReqNode.get(key));
							}
						}

						if(!errorFlag){
							JsonNode resultNode = requestBody.get("result");
							if(resultNode instanceof ObjectNode){
								ObjectNode result = (ObjectNode) resultNode;

								if(result.has("ai_response")){
									String aiResponse = result.path("ai_response").asText("");
									if(!aiResponse.equals("")){
										int startIndex = aiResponse.indexOf("{");
										int endIndex = aiResponse.lastIndexOf("}");
										if (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
											aiResponse = aiResponse.substring(startIndex, endIndex + 1);
											JsonNode aiJsonObject = MAPPER.readTree(aiResponse);
											if(aiJsonObject instanceof ObjectNode){
												ArrayNode jsonArr = JsonNodeFactory.instance.arrayNode();
												jsonArr.add(aiJsonObject);
												xtrmReturnData.setDataArrayNode(jsonArr, "AI_RESPONSE");
											}
										}
									}
								}

								JsonNode vectorNode = result.get("vector");
								if(vectorNode instanceof ArrayNode){
									xtrmReturnData.setDataArrayNode(((ArrayNode) vectorNode).deepCopy(), "VECTOR");
								}
							}
						}
					}
				}else{
					xtrmReturnData.setResultHeader(true, "RESPONSE IS NULL : Callisto Connection Error", "0000");
				}
			} catch (Exception ex) {
				xtrmReturnData.setResultHeader(true, ex.getMessage(), "0000");
			} finally {
				xtrmReturnData.setString("requestBody", response);
			}
			xtrmReturnData.setHeader("took", String.valueOf(e - s));
		}
		return xtrmReturnData;
	}

	private ArrayNode collectList(Object data){
		List<String> dataList					= new ArrayList<>();
		if(data instanceof String){
			dataList.add((String)data);
		}else if(data instanceof String[]){
			dataList							= Arrays.asList((String[])data);
		}else if(data instanceof ArrayList){
			dataList							= (ArrayList<String>)data;
		}else if(data instanceof List) {
			dataList							= (List<String>)data;
		}
		return MAPPER.valueToTree(dataList);
	}

	private String writeRequestPayload(Object requestParam) {
		if(requestParam == null){
			return "";
		}
		if(requestParam instanceof String){
			return requestParam.toString();
		}
		if(requestParam instanceof JsonNode){
			return requestParam.toString();
		}
		try {
			return MAPPER.writeValueAsString(requestParam);
		} catch (Exception e) {
			return "";
		}
	}

	private ApiEnvelope parseStandardResponse(String response) {
		ApiEnvelope xtrmReturnData = new ApiEnvelope();
		if(response == null || "".equals(response)){
			xtrmReturnData.setResultHeader(true, "RESPONSE IS NULL : Callisto Connection Error", "0000");
			return xtrmReturnData;
		}
		ApiEnvelope xtrmResponse = new ApiEnvelope(response);
		boolean errorFlag = !xtrmResponse.getBoolean("success");
		String errorCode = errorFlag ? xtrmResponse.getString("code") : "";
		String errorMessage = resolveErrorMessage(errorCode, xtrmResponse.getString("detail"));
		xtrmReturnData.setResultHeader(errorFlag, errorMessage, errorCode);
		if(!errorFlag){
			applyResultNode(xtrmReturnData, (JsonNode)xtrmResponse.getObject("result", 0, null));
		}
		return xtrmReturnData;
	}

	private void applyResultNode(ApiEnvelope xtrmReturnData, JsonNode resultNode) {
		if(resultNode == null || resultNode.isNull()){
			return;
		}
		if(resultNode.isTextual()){
			xtrmReturnData.setString("data", resultNode.asText());
		}else if(resultNode instanceof ArrayNode){
			ArrayNode dataArray = (ArrayNode) resultNode;
			if(dataArray.size() > 0){
				JsonNode checkData = dataArray.get(0);
				if(checkData instanceof ObjectNode){
					xtrmReturnData.setDataArrayNode(dataArray.deepCopy());
					xtrmReturnData.setHeader("COUNT", dataArray.size());
				}else{
					for(int i = 0; i < dataArray.size(); i++){
						xtrmReturnData.setObject("data", dataArray.get(i), i);
					}
					xtrmReturnData.setHeader("COUNT", dataArray.size());
				}
			}
		}else if(resultNode instanceof ObjectNode){
			xtrmReturnData.setDataObjectNode(((ObjectNode) resultNode).deepCopy());
		}
	}

	private String resolveErrorMessage(String errorCode, String detail) {
		String errorMessage = "";
		if(errorCode != null && !"".equals(errorCode)){
			try{
				errorMessage = CALLISTO_ERROR_CODE.valueOf("ERROR_" + errorCode).getCodeName();
			}catch(Exception ignored){
				errorMessage = "";
			}
		}
		if(detail != null && !"".equals(detail)){
			if(detail.length() > 3990){
				detail = detail.substring(0, 3990);
			}
			errorMessage = detail;
		}
		return errorMessage;
	}
}
