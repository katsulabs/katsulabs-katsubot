package xs.core.interfaces;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import xs.core.interfaces.enumeration.FileMGEnums.FILE_MG_API;
import xs.core.module.XtrmRestComponent;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtil;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

@Component
@SuppressWarnings({"rawtypes", "unused"})
public class XtrmFileMGInterface {

	@Autowired
	XtrmRestComponent restComponent;

	public ApiEnvelope checkFile(Object path){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= createPathArray(path);
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.CHECK_FILE, xtrmRequestParam);
	}
	public ApiEnvelope readFile(Object params){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= createPathArray(params);
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.READ_FILE, xtrmRequestParam);
	}
	public ApiEnvelope writeFile(Object path, Object data){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= JsonNodeFactory.instance.arrayNode();
		int size					= 0;
		if(path instanceof String){
			ObjectNode sendJson		= JsonNodeFactory.instance.objectNode();
			sendJson.put("path"		, path.toString());
			sendJson.put("data"		, data.toString());
			paramJson.add(sendJson);
		}else if(path instanceof String[]){
			size					= ((String[])path).length;
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((String[])path)[i]);
				sendJson.put("data"	, ((String[])data)[i]);
				paramJson.add(sendJson);
			}
		}else if(path instanceof ArrayList){
			size					= ((ArrayList)path).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((ArrayList)path).get(i).toString());
				sendJson.put("data"	, ((ArrayList)data).get(i).toString());
				paramJson.add(sendJson);
			}
		}else if(path instanceof List){
			size					= ((List)path).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((List)path).get(i).toString());
				sendJson.put("data"	, ((List)data).get(i).toString());
				paramJson.add(sendJson);
			}
		}
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.WRITE_FILE, xtrmRequestParam);
	}
	public ApiEnvelope deleteFile(Object params){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= createPathArray(params);
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.DELETE_FILE, xtrmRequestParam);
	}
	public ApiEnvelope moveFile(Object source, Object desc){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= JsonNodeFactory.instance.arrayNode();
		int size					= 0;
		if(source instanceof String){
			ObjectNode sendJson		= JsonNodeFactory.instance.objectNode();
			sendJson.put("src"		, source.toString());
			sendJson.put("dest"		, desc.toString());
			paramJson.add(sendJson);
		}else if(source instanceof String[]){
			size					= ((String[])source).length;
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((String[])source)[i]);
				sendJson.put("dest"	, ((String[])desc)[i]);
				paramJson.add(sendJson);
			}
		}else if(source instanceof ArrayList){
			size					= ((ArrayList)source).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((ArrayList)source).get(i).toString());
				sendJson.put("dest"	, ((ArrayList)desc).get(i).toString());
				paramJson.add(sendJson);
			}
		}else if(source instanceof List){
			size					= ((List)source).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((List)source).get(i).toString());
				sendJson.put("dest"	, ((List)desc).get(i).toString());
				paramJson.add(sendJson);
			}
		}
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.MOVE_FILE, xtrmRequestParam);
	}
	public ApiEnvelope moveToWaveConvert(Object source, Object desc){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= JsonNodeFactory.instance.arrayNode();
		int size					= 0;
		if(source instanceof String){
			ObjectNode sendJson		= JsonNodeFactory.instance.objectNode();
			sendJson.put("src"		, source.toString());
			sendJson.put("dest"		, desc.toString());
			paramJson.add(sendJson);
		}else if(source instanceof String[]){
			size					= ((String[])source).length;
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((String[])source)[i]);
				sendJson.put("dest"	, ((String[])desc)[i]);
				paramJson.add(sendJson);
			}
		}else if(source instanceof ArrayList){
			size					= ((ArrayList)source).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((ArrayList)source).get(i).toString());
				sendJson.put("dest"	, ((ArrayList)desc).get(i).toString());
				paramJson.add(sendJson);
			}
		}else if(source instanceof List){
			size					= ((List)source).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("src"	, ((List)source).get(i).toString());
				sendJson.put("dest"	, ((List)desc).get(i).toString());
				paramJson.add(sendJson);
			}
		}
		xtrmRequestParam.setObject("requestData", paramJson);
		return requestApiEnvelope(FILE_MG_API.MOVE_TO_WAVCONVERT, xtrmRequestParam);
	}
	public ApiEnvelope syncFile(Object path){
		return syncFile(path, false);
	}
	public ApiEnvelope syncFile(Object path, Object blnFileSync){
		ApiEnvelope xtrmRequestParam	= new ApiEnvelope();
		ArrayNode paramJson				= createPathArray(path);
		xtrmRequestParam.setObject("requestData", paramJson);
		xtrmRequestParam.setObject("fileSync"	, blnFileSync);	//파일 동기화 플래그(파일 동기화 처리)
		return requestApiEnvelope(FILE_MG_API.SYNC_FILE, xtrmRequestParam);
	}
	
	private String request(FILE_MG_API apiCode, Object params){
		String url					= apiCode.getProtocol() + "://" + XtrmCmmnUtil.getProperty("FILE_MG_URL").toString() + "/" + apiCode.getContext();
		return restComponent.request(url, apiCode.getMethodType(), "application", "json", Charset.forName("UTF-8"), params);
	}
	
	private ApiEnvelope requestApiEnvelope(FILE_MG_API apiCode, Object params){
		ApiEnvelope xtrmResponse	= new ApiEnvelope();
		String url					= apiCode.getProtocol() + "://" + XtrmCmmnUtil.getProperty("FILE_MG_URL").toString() + "/" + apiCode.getContext();
		xtrmResponse 				= restComponent.requestApiEnvelope(url, apiCode.getMethodType(), "application", "json", Charset.forName("UTF-8"), params, null);
		ObjectNode response 		= xtrmResponse.getDataObjectNode();
		boolean success				= response != null && response.path("success").asBoolean(false);
		xtrmResponse.setHeader("ERROR_FLAG", !success);
		return xtrmResponse;
	}

	private ArrayNode createPathArray(Object path) {
		ArrayNode paramJson			= JsonNodeFactory.instance.arrayNode();
		int size					= 0;
		if(path instanceof String){
			ObjectNode sendJson		= JsonNodeFactory.instance.objectNode();
			sendJson.put("path"		, path.toString());
			paramJson.add(sendJson);
		}else if(path instanceof String[]){
			size					= ((String[])path).length;
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((String[])path)[i]);
				paramJson.add(sendJson);
			}
		}else if(path instanceof ArrayList){
			size					= ((ArrayList)path).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((ArrayList)path).get(i).toString());
				paramJson.add(sendJson);
			}
		}else if(path instanceof List){
			size					= ((List)path).size();
			for(int i = 0; i < size; i++){
				ObjectNode sendJson	= JsonNodeFactory.instance.objectNode();
				sendJson.put("path"	, ((List)path).get(i).toString());
				paramJson.add(sendJson);
			}
		}
		return paramJson;
	}
}
