package xs.core.interfaces.enumeration;

import java.io.Serializable;

import org.springframework.http.HttpMethod;

public class CallistoEnums implements Serializable {

	private static final long serialVersionUID = -656278850302533135L;

	public enum CALLISTO_ERROR_CODE {
		ERROR_1001					("1001"						, "not supported url"							),
		ERROR_1002					("1002"						, "json parse error"							),
		ERROR_1003					("1003"						, "expected json object not found"			),
		ERROR_1004					("1004"						, "requested domain not found"				),
		ERROR_1005					("1005"						, "requested group not found"					),
		ERROR_1006					("1006"						, "requested text not found"					),
		ERROR_1007					("1007"						, "group can't exist without domain"			),
		ERROR_1008					("1008"						, "config path not exists"					),
		ERROR_1009					("1009"						, "data format error"							),
		ERROR_2001					("2001"						, "failed to unzip file"						),
		ERROR_2002					("2002"						, "failed to write file"						),
		ERROR_2003					("2003"						, "failed to read file"						),
		ERROR_2004					("2004"						, "file not exists"							),
		ERROR_2005					("2005"						, "upload file size too large"				),
		ERROR_2006					("2006"						, "not mached file type"						),
		ERROR_3001					("3001"						, "mecab load error"							),
		ERROR_3002					("3002"						, "utagger load error"						),
		ERROR_3003					("3003"						, "previous request is still being processed"	),
		ERROR_3004					("3004"						, "not a valid tagger"						),
		ERROR_3005					("3005"						, "not a valid pattern"						),
		ERROR_3006					("3006"						, "redis request timeout"						),
		ERROR_3007					("3007"						, "script id is invalid"						),
		ERROR_3008					("3008"						,"not a valid tag"							),
		ERROR_3009					("3009"						,"get async request failed"					),
		ERROR_3010					("3010"						,"tagging error"								),
		ERROR_3011					("3011"						,"not a valid text"							),
		ERROR_3012					("3012"						,"base data set error"						),
		ERROR_3013					("3013"						,"folder exist or not exist error"			),
		ERROR_3014					("3014"						,"not valid mode"								),
		ERROR_3016					("3016"						,"all retry failed"							),
		ERROR_4001					("4001"						,"not support group name"						),
		ERROR_4002					("4002"						,"group not found"							),
		ERROR_4003					("4003"						,"domain exist error"							),
		ERROR_5001					("5001"						,"kiwi spacing error"							),
		ERROR_6001					("6001"						,"model create error"							),
		ERROR_6002					("6002"						,"gen ai error"								),
		ERROR_6003					("6003"						,"Undefined model in the config"				),
		ERROR_6004					("6004"						,"LLM connection error"						),
		ERROR_7001					("7001"						,"indexing error"								),
		ERROR_7002					("7002"						,"not support search type"					),
		ERROR_7003					("7003"						,"Embedding model connection error"			),
		ERROR_7004					("7004"						,"invalid request parameter"					),
		ERROR_7005					("7005"						,"error lexical/semantic search"				),
		ERROR_7006					("7006"						,"error contents/query/word completion search"),
		ERROR_7007					("7007"						,"error empty keyword"),
		ERROR_7008					("7008"						,"opensearch update error"),
		ERROR_7009					("7009"						,"page not found"),
		ERROR_7010					("7010"						,"size not found"),
		ERROR_7011					("7011"						,"dataAuthority not found"),
		ERROR_7012					("7012"						,"searchWordInfo not found"),
		ERROR_7013					("7013"						,"keywords end with operation search terms."),
		ERROR_7014					("7014"						,"invalid search word"),
		ERROR_8001					("8001"						,"api call error"								),	// api_r과 같은 callisto 외부에서 받는 값에 대한 오류 처리 코드
		ERROR_9999					("9999"						,"unknown error"								),

		SAMPLE						(""							, ""											);

		private String code;
		private String codeName;

		private CALLISTO_ERROR_CODE(String code, String codeName) {
			this.code = code;
			this.codeName = codeName;
		}

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getCodeName() {
			return codeName;
		}

		public void setCodeName(String codeName) {
			this.codeName = codeName;
		}
	}

	public enum CALLISTO_API{
		LOAD_CORRECTION_DATA		("correction/data"				, HttpMethod.PUT	),
		LOAD_PATTERN_MATCHING_DATA	("patternMatching/data"			, HttpMethod.PUT	),
		GET_PATTERN_MATCHING_DATA	("patternMatching/data"			, HttpMethod.POST	),
		FIND_PATTERN_MATCHING		("patternMatching"				, HttpMethod.POST	),
		FIND_GROUP_PATTERN_MATCHING	("patternMatching/group"			, HttpMethod.POST	),
		CHECK_CLASSIFICATOIN_SYNC	("classification"				, HttpMethod.POST	),
		MORPHEME_ANALYZE			("morphologicalAnalysis"			, HttpMethod.POST	),
		CLASSIFICATION_GET			("classification/data"			, HttpMethod.POST	),
		CLASSIFICATION_SIMULATION	("classification"				, HttpMethod.POST	),
		CREATE_EMOTION_DOMAIN		("emotionKeyword/domain/create"	, HttpMethod.POST	),
		KEYWORD						("keyword"						, HttpMethod.POST	),
		LEXICAL_SEARCH				("opensearch/lexical_search"		, HttpMethod.POST	),
		SEMANTIC_SEARCH				("opensearch/semantic_search"	, HttpMethod.POST	),
		HYBRID_SEARCH				("opensearch/hybrid_search"	, HttpMethod.POST	),
		WORD_COMPLETION				("opensearch/word_completion"	, HttpMethod.POST	),
		EMBEDDING					("genai/embedding"				, HttpMethod.POST	),
		LLM							("genai/llm"						, HttpMethod.POST	),
		OPENSEARCH_INDEX			("opensearch/index"				, HttpMethod.POST	),
		OPENSEARCH_INDEX_WORD		("opensearch/index_word"			, HttpMethod.POST	),
		OPENSEARCH_UPDATE			("opensearch/update"				, HttpMethod.POST	),
		ASSESMENT_SCORE				("etc/returnAssessmentScore"		, HttpMethod.POST	),


//		CORRECTION_GET				("correction/data"				, HttpMethod.POST	),
//		CORRECTION_CHECK			("correction"					, HttpMethod.POST	),
//		CLASSIFICATION_GET			("classification/data"			, HttpMethod.POST	),
//		CLASSIFICATOIN_SET			("classification/data"			, HttpMethod.PUT	),
//		PATTERN_MATCHING_GROUP		("patternMatching/group"		, HttpMethod.POST	),

		SAMPLE						(""								, HttpMethod.POST	);

		private String context;
		private HttpMethod methodType;

		private CALLISTO_API(String context, HttpMethod methodType) {
			this.context = context;
			this.methodType = methodType;
		}

		public String getContext() {
			return context;
		}

		public void setContext(String context) {
			this.context = context;
		}

		public HttpMethod getMethodType() {
			return methodType;
		}

		public void setMethodType(HttpMethod methodType) {
			this.methodType = methodType;
		}
	}

	public enum MORPHEME_ANALYZER{
		utagger,
		mecab;
	}

	public enum MORPHEME_RESULT_TYPE{
		line,
		list;
	}

	public enum CALLISTO_PROTOCOL{
		http,
		https;
	}
}
