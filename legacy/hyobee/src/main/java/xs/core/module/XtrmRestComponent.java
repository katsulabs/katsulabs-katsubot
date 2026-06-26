package xs.core.module;

import java.io.IOException;
import java.nio.charset.Charset;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.net.ssl.SSLContext;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.config.SocketConfig;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.ssl.SSLContexts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.dto.ApiEnvelope;
import xs.core.property.XtrmProperty;

@Slf4j
@Component(value="XtrmRestComponent")
@Primary
@SuppressWarnings("deprecation")
public class XtrmRestComponent {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	@Autowired
	XtrmProperty objXtrmConfig;

	private static RestTemplate restTemplate = null;

	@PostConstruct
	public void init() throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException {
		if(restTemplate == null){

			int CONN_REQ_TIMEOUT					= objXtrmConfig.getInt("REST_CONN_REQ_TIMEOUT");
			int CONN_TIMEOUT						= objXtrmConfig.getInt("REST_CONN_TIMEOUT");
			int SOCKET_TIMEOUT						= objXtrmConfig.getInt("REST_SOCKET_TIMEOUT");
			int POOL_MAX_TOTAL						= objXtrmConfig.getInt("REST_CONN_POOL_MAX_TOTAL");
			int POOL_MAX_PER_ROUTE					= objXtrmConfig.getInt("REST_CONN_POOL_MAX_PER_ROUTE");

			TrustStrategy acceptingTrustStrategy	= (X509Certificate[] chain, String authType) -> true;
			SSLContext sslContext					= SSLContexts.custom()
					.loadTrustMaterial(null, acceptingTrustStrategy)
					.build();
			SSLConnectionSocketFactory csf			= new SSLConnectionSocketFactory(sslContext);
			HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
			RequestConfig requestConfig				= RequestConfig.custom()
					.setConnectionRequestTimeout(CONN_REQ_TIMEOUT)
					.setConnectTimeout(CONN_TIMEOUT)
					.setSocketTimeout(SOCKET_TIMEOUT)
					.setExpectContinueEnabled(true)
					.setStaleConnectionCheckEnabled(true)
					.build();
			SocketConfig socketConfig				= SocketConfig.custom()
					.setSoKeepAlive(true)
					.setTcpNoDelay(true)
					.setSoReuseAddress(true)
					.setSoTimeout(SOCKET_TIMEOUT)
					.build();
			Registry<ConnectionSocketFactory> socketFactoryRegistry = RegistryBuilder.<ConnectionSocketFactory> create()
					.register("https", csf)
					.register("http",  PlainConnectionSocketFactory.getSocketFactory())
					.build();
			PoolingHttpClientConnectionManager connectionManager	= new PoolingHttpClientConnectionManager(socketFactoryRegistry);
			connectionManager.setMaxTotal(POOL_MAX_TOTAL);
			connectionManager.setDefaultMaxPerRoute(POOL_MAX_PER_ROUTE);
			CloseableHttpClient httpClientBuilder	= HttpClientBuilder.create()
					.setConnectionManager(connectionManager)
					.setDefaultRequestConfig(requestConfig)
					.setDefaultSocketConfig(socketConfig)
					.build();
			requestFactory.setHttpClient(httpClientBuilder);
			restTemplate = new RestTemplate(requestFactory);
			List<HttpMessageConverter<?>> messageConverterList		= new ArrayList<>();
			messageConverterList.add(new StringHttpMessageConverter(Charset.forName("UTF-8")));
			restTemplate.setMessageConverters(messageConverterList);
		}
	}

	@PreDestroy
	public void destroy() throws Exception {
		if(restTemplate != null){
			HttpComponentsClientHttpRequestFactory requestFactory = (HttpComponentsClientHttpRequestFactory) restTemplate.getRequestFactory();
			requestFactory.destroy();
			restTemplate = null;
		}
	}

	public String request(String strUrl, HttpMethod objMethod, String strRequestType, String strRequestSubtype, Object objCharset, Object objParams, Map<String, String> headers){
		String strReturnValue	= null;
		String strException		= null;
		String strURL			= createRequestURL(strUrl, objMethod, objParams);
		Charset objCharacterSet;
		if(objCharset instanceof String){
			objCharacterSet		= Charset.forName((String)objCharset);
		}else{
			objCharacterSet		= (Charset)objCharset;
		}

		MediaType objMediaType	= new MediaType(strRequestType, strRequestSubtype, objCharacterSet);
		HttpHeaders objHeaders	= new HttpHeaders();
		objHeaders.setContentType(objMediaType);
		if (headers != null) {
			for (Map.Entry<String, String> entry : headers.entrySet()) {
			    objHeaders.add(entry.getKey(), entry.getValue());
			}
		}
		String strRequestBody	= HttpMethod.GET != objMethod ? createRequestBody(objParams) : "";
		HttpEntity<String> objHttpEntity = new HttpEntity<String>(strRequestBody, objHeaders);
		try{
			// 400, 500 에러 Exception이 발생한 경우, 인터페이스에서 전달하는 메세지를 알기위해 에러 핸들러 추가
			restTemplate.setErrorHandler(new ResponseErrorHandler() {
				@Override
				public boolean hasError(ClientHttpResponse arg0) throws IOException {
					return false;
				}
				@Override
				public void handleError(ClientHttpResponse arg0) throws IOException {
				}
			});
			strReturnValue		= restTemplate.exchange(strURL, objMethod, objHttpEntity, String.class).getBody();
		}catch(Exception ex){
			strReturnValue		= null;
			strException		= ex.getMessage();
		}finally{
			selectPrintLog(strUrl, objMethod, strRequestBody, strReturnValue, strException);
		}
		return strReturnValue;
	}

	public String request(String strUrl, HttpMethod objMethod, String strRequestType, String strRequestSubtype, Object objCharset, Object objParams){
		return request(strUrl, objMethod, strRequestType, strRequestSubtype, objCharset, objParams, null);
	}

	public String request(String strUrl, Object param, HttpMethod method){
		return request(strUrl, method, "application", "json", Charset.forName("UTF-8"), param);
	}

	public String request(String strUrl, Object param){
		return request(strUrl, HttpMethod.POST, "application", "json", Charset.forName("UTF-8"), param);
	}

	public ApiEnvelope requestApiEnvelope(String strUrl, HttpMethod objMethod, String strRequestType, String strRequestSubtype, Object objCharset, Object objParams, Map<String, String> headers){
		ApiEnvelope xtrmReturn						= new ApiEnvelope();
		ResponseEntity<String> response				= null;
		String strResponse							= null;
		String strException							= null;
		String strURL								= createRequestURL(strUrl, objMethod, objParams);
		Charset objCharacterSet;
		if(objCharset instanceof String){
			objCharacterSet							= Charset.forName((String)objCharset);
		}else{
			objCharacterSet							= (Charset)objCharset;
		}
		MediaType objMediaType						= new MediaType(strRequestType, strRequestSubtype, objCharacterSet);
		HttpHeaders objHeaders						= new HttpHeaders();
		objHeaders.setContentType(objMediaType);
		if (headers != null) {
			for (Map.Entry<String, String> entry : headers.entrySet()) {
				objHeaders.add(entry.getKey(), entry.getValue());
			}
		}
		String strRequestBody						= HttpMethod.GET != objMethod ? createRequestBody(objParams) : "";
		HttpEntity<String> objHttpEntity			= new HttpEntity<String>(strRequestBody, objHeaders);
		long s										= 0;
		long e										= 0;
		try{
			s										= System.currentTimeMillis();
			response								= restTemplate.exchange(strURL, objMethod, objHttpEntity, String.class);
			e										= System.currentTimeMillis();
			strResponse								= response.getBody();
			JsonNode responseBody					= parseResponseBody(strResponse);
			if(responseBody instanceof ArrayNode){
				xtrmReturn.setDataArrayNode((ArrayNode) responseBody);
				xtrmReturn.setHeader("responseType", "JsonArray");
			}else if(responseBody instanceof ObjectNode){
				xtrmReturn.setDataObjectNode((ObjectNode) responseBody);
				xtrmReturn.setHeader("responseType", "JsonObject");
			}
		}catch(Exception ex){
			strException							= ex.getMessage();
			xtrmReturn.setResultHeader(true, strException);
		}finally{
			xtrmReturn.setHeader("statusCode", (response != null ? String.valueOf(response.getStatusCodeValue()) : ""));
			xtrmReturn.setHeader("took", String.valueOf(e - s));
			selectPrintLog(strUrl, objMethod, strRequestBody, strResponse, strException);
		}
		return xtrmReturn;
	}

	public ApiEnvelope requestApiEnvelope(String strUrl, Object param, HttpMethod method) {
		return requestApiEnvelope(strUrl, method, "application", "json", Charset.forName("UTF-8"), param, null);
	}

	public ApiEnvelope requestApiEnvelope(String strUrl, Object param) {
		return requestApiEnvelope(strUrl, HttpMethod.POST, "application", "json", Charset.forName("UTF-8"), param, null);
	}

	private String createRequestURL(String url, HttpMethod method, Object queryParam){
		UriComponentsBuilder objBuilder 			= UriComponentsBuilder.fromHttpUrl(url);
		ObjectNode objJsonParams					= MAPPER.createObjectNode();
		if(method == HttpMethod.GET){
			if(queryParam instanceof ApiEnvelope){
				ObjectNode requestData = ((ApiEnvelope)queryParam).getDataObjectNode();
				objJsonParams						= requestData == null ? MAPPER.createObjectNode() : requestData;
			}else if(queryParam instanceof HashMap){
				JsonNode jsonNode					= MAPPER.valueToTree(queryParam);
				if(jsonNode instanceof ObjectNode){
					objJsonParams					= (ObjectNode)jsonNode;
				}
			}else if(queryParam instanceof String){
				String[] objParamSet				= queryParam.toString().split("&");
				String[] objKeyValue				= null;
				for(int i = 0; i < objParamSet.length; i++){
					objKeyValue						= objParamSet[i].split("=");
					if(objKeyValue.length == 2){
						objJsonParams.put(objKeyValue[0], java.util.regex.Matcher.quoteReplacement(objKeyValue[1]));
					}
				}
			}else if(queryParam instanceof ObjectNode){
				objJsonParams						= ((ObjectNode)queryParam).deepCopy();
			}else if(queryParam instanceof ArrayNode && ((ArrayNode)queryParam).size() > 0 && ((ArrayNode)queryParam).get(0).isObject()){
				objJsonParams						= ((ObjectNode)((ArrayNode)queryParam).get(0)).deepCopy();
			}
			if(objJsonParams.size() > 0){
				Iterator<String> objIterator 		= objJsonParams.fieldNames();
				String strKey						= "";
				while(objIterator.hasNext()){
					strKey = objIterator.next();
					objBuilder.queryParam(strKey, objJsonParams.path(strKey).asText());
				}
			}
		}
		return objBuilder.build().encode().toUriString();
	}

	private String createRequestBody(Object queryParam){
		String strReturnValue						= "";
		if(queryParam instanceof ApiEnvelope){
			ObjectNode requestData = ((ApiEnvelope)queryParam).getDataObjectNode();
			strReturnValue							= requestData == null ? "" : requestData.toString();
		}else if(queryParam instanceof HashMap){
			try{
				strReturnValue						= MAPPER.writeValueAsString(queryParam);
			}catch(JsonProcessingException e){
				strReturnValue						= "";
			}
		}else if(queryParam instanceof String){
			strReturnValue							= (String)queryParam;
		}else if(queryParam instanceof ObjectNode){
			strReturnValue							= queryParam.toString();
		}else if(queryParam instanceof ArrayNode && ((ArrayNode)queryParam).size() > 0 && ((ArrayNode)queryParam).get(0).isObject()){
			strReturnValue							= ((ArrayNode)queryParam).get(0).toString();
		}
		return strReturnValue;
	}

	private JsonNode parseResponseBody(String responseBody) throws JsonProcessingException {
		if(responseBody == null || responseBody.isBlank()){
			return null;
		}
		return MAPPER.readTree(responseBody);
	}

	public void selectPrintLog(String strUrl, HttpMethod objMethod, String strRequestBody, String strResponse, String strException) {
		log.info("URL: {}, HTTP_METHOD: {}, REQUEST_BODY: {}, RESPONSE: {}, EXCEPTION: {}", strUrl, objMethod.name(), strRequestBody, strResponse, strException);
	}
}
