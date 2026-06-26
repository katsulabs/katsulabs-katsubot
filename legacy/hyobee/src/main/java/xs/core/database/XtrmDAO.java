package xs.core.database;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;

import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.ParameterMapping;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.SqlSession;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.ReflectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtil;

@SuppressWarnings({"rawtypes", "unchecked"})
@Slf4j
@Repository
public class XtrmDAO extends XtrmDatasource {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	public <T> T selectOne(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName, Class<T> objDtoType, ResultHandler objHandler) throws Exception {
		T objResult										= (T)new Object();
		List<T> objResultList							= selectMap(strSqlNameSpace, strSqlId, objParams, strPoolName, objDtoType, objHandler);
		if (objResultList != null && objResultList.size() > 0) {
			objResult									= objResultList.get(0);
		} else {
	        objResult = objDtoType.getDeclaredConstructor().newInstance();
	    }
		return objResult;
	}

	public <T> T selectOne(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType, String strPoolName) throws Exception {
		return selectOne(strSqlNameSpace, strSqlId, objParams, strPoolName, objDtoType, null);
	}

	public <T> T selectOne(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType) throws Exception {
		return selectOne(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objDtoType, null);
	}

	public <T> T selectOne(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType, ResultHandler objHandler) throws Exception {
		return selectOne(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objDtoType, objHandler);
	}

	public ApiEnvelope selectJson(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName, ResultHandler objHandler) throws Exception {
		// 최종 반환객체 생성
		ApiEnvelope objXtrmResult						= new ApiEnvelope();
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		if (objHandler == null) {
			long s										= System.currentTimeMillis();
			List<HashMap<String, Object>> retMap		= getSqlSession(strPoolName).selectList(strSqlNameSpace + "." + strSqlId, objParameterMap);
			long e										= System.currentTimeMillis();
			if (objParameterMap.containsKey("xtrmRequestUuid")) {
				log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
			} else {
				log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
			}
			objXtrmResult.setDataArrayNode(getJsonArrayFromList(retMap));
			int intDataSize = objXtrmResult.getDataArrayNode().size();
			objXtrmResult.setHeader("COUNT"				, intDataSize);
			objXtrmResult.setHeader("TOT_COUNT"			, intDataSize);
			if (objXtrmResult.containsKey("xtrmDataTotCount")) {
				objXtrmResult.setHeader("TOT_COUNT"		, objXtrmResult.getInt("xtrmDataTotCount"));
			}
			if (objParams instanceof ApiEnvelope) {
				objXtrmResult.setHeader("PAGE_NO"		, ((ApiEnvelope)objParams).getHeaderInt("PAGE_NO"));
				objXtrmResult.setHeader("ROW_PER_PAGE"	, ((ApiEnvelope)objParams).getHeaderInt("ROW_PER_PAGE"));
			}
		} else {
			getSqlSession(strPoolName).select(strSqlNameSpace + "." + strSqlId, objParameterMap, objHandler);
		}
		objXtrmResult.setHeader("sqlNameSpace"			, strSqlNameSpace);
		objXtrmResult.setHeader("sqlId"					, strSqlId);
		objXtrmResult.setHeader("connPoolName"			, strPoolName);
		objXtrmResult.setResultHeader(false, XtrmEnum.SELECT_SUCCESS.getCodeName());
		return objXtrmResult;
	}

	public ApiEnvelope selectJson(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		return this.selectJson(strSqlNameSpace, strSqlId, objParams, strPoolName, null);
	}

	public ApiEnvelope selectJson(String strSqlNameSpace, String strSqlId, Object objParams, ResultHandler objHandler) throws Exception {
		return this.selectJson(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objHandler);
	}

	public ApiEnvelope selectJson(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return this.selectJson(strSqlNameSpace, strSqlId, objParams, "xtrmdb", null);
	}

	public ApiEnvelope selectJson(String strSqlNameSpace, String strSqlId) throws Exception {
		return this.selectJson(strSqlNameSpace, strSqlId, new ApiEnvelope(), "xtrmdb", null);
	}

	public <T> List<T> selectMap(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName, Class<T> objDtoType, ResultHandler objHandler) throws Exception {
		// 최종 반환객체 생성
		List<T> objResultList							= new ArrayList<>();
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		if (objHandler == null) {
			long s										= System.currentTimeMillis();
			List<HashMap<String, Object>> retMap		= getSqlSession(strPoolName).selectList(strSqlNameSpace + "." + strSqlId, objParameterMap);
			long e										= System.currentTimeMillis();
			if (objParameterMap.containsKey("xtrmRequestUuid")) {
				log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
			} else {
				log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
			}
			if (retMap.size() > 0) {
				for (int i = 0; i < retMap.size(); i++) {
					if (retMap.get(i) != null && objDtoType.isInstance(retMap.get(i))) {
						objResultList.add((T)retMap.get(i));
					} else {
						objResultList.add(convertMapToObject(retMap.get(i), objDtoType));
					}
				}
			}
		} else {
			getSqlSession(strPoolName).select(strSqlNameSpace + "." + strSqlId, objParameterMap, objHandler);
		}
		return objResultList;
	}

	public <T> List<T> selectMap(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType, String strPoolName) throws Exception {
		return selectMap(strSqlNameSpace, strSqlId, objParams, strPoolName, objDtoType, null);
	}

	public <T> List<T> selectMap(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType, ResultHandler objHandler) throws Exception {
		return selectMap(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objDtoType, objHandler);
	}

	public <T> List<T> selectMap(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType) throws Exception {
		return selectMap(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objDtoType, null);
	}

	public <T> List<T> selectMap(String strSqlNameSpace, String strSqlId, Class<T> objDtoType) throws Exception {
		return selectMap(strSqlNameSpace, strSqlId, new ApiEnvelope(), "xtrmdb", objDtoType, null);
	}

	public int insert(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		// 최종 반환객체 생성
		int intInsertCnt = 0;
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		long s											= System.currentTimeMillis();
		intInsertCnt									= getSqlSession(strPoolName).insert(strSqlNameSpace + "." + strSqlId, objParameterMap);
		long e											= System.currentTimeMillis();
		if (objParameterMap.containsKey("xtrmRequestUuid")) {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
		} else {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
		}
		if (objParams instanceof ApiEnvelope) {
			((ApiEnvelope)objParams).setDataObjectNode(convertMapToObject(objParameterMap, ObjectNode.class));
		} else {
			objParams	= convertMapToObject(objParameterMap, objParams.getClass());
		}
		return intInsertCnt;
	}

	public int insert(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return insert(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public int insertList(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		int intInsertCnt								= 0;
		if (objParams instanceof ApiEnvelope) {
			ArrayNode objData							= ((ApiEnvelope)objParams).getDataArrayNode();
			for (int i = 0; i < objData.size(); i++) {
				intInsertCnt							+= insert(strSqlNameSpace, strSqlId, ((ApiEnvelope)objParams).getDataObjectNode(i), strPoolName);
			}
		} else if (objParams instanceof ArrayNode) {
			for (int i = 0; i < ((ArrayNode)objParams).size(); i++) {
				intInsertCnt							+= insert(strSqlNameSpace, strSqlId, toObjectNode(((ArrayNode)objParams).get(i)), strPoolName);
			}
		} else {
			for (int i = 0; i < ((List)objParams).size(); i++) {
				intInsertCnt							+= insert(strSqlNameSpace, strSqlId, ((List)objParams).get(i), strPoolName);
			}
		}
		return intInsertCnt;
	}

	public int insertList(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return insertList(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public int update(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		// 최종 반환객체 생성
		int intInsertCnt								= 0;
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		long s											= System.currentTimeMillis();
		intInsertCnt									= getSqlSession(strPoolName).update(strSqlNameSpace + "." + strSqlId, objParameterMap);
		long e											= System.currentTimeMillis();
		if (objParameterMap.containsKey("xtrmRequestUuid")) {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
		} else {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
		}
		if (objParams instanceof ApiEnvelope) {
			((ApiEnvelope)objParams).setDataObjectNode(convertMapToObject(objParameterMap, ObjectNode.class));
		} else {
			objParams									= convertMapToObject(objParameterMap, objParams.getClass());
		}
		return intInsertCnt;
	}

	public int update(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return update(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public int updateList(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		int intUpdateCnt								= 0;
		if (objParams instanceof ApiEnvelope) {
			ArrayNode objData							= ((ApiEnvelope)objParams).getDataArrayNode();
			for (int i = 0; i < objData.size(); i++) {
				intUpdateCnt							+= update(strSqlNameSpace, strSqlId, ((ApiEnvelope)objParams).getDataObjectNode(i), strPoolName);
			}
		} else if (objParams instanceof ArrayNode) {
			for (int i = 0; i < ((ArrayNode)objParams).size(); i++) {
				intUpdateCnt							+= update(strSqlNameSpace, strSqlId, toObjectNode(((ArrayNode)objParams).get(i)), strPoolName);
			}
		} else {
			for (int i = 0; i < ((List)objParams).size(); i++) {
				intUpdateCnt							+= update(strSqlNameSpace, strSqlId, ((List)objParams).get(i), strPoolName);
			}
		}
		return intUpdateCnt;
	}

	public int updateList(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return updateList(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public int delete(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		//최종 반환객체 생성
		int intInsertCnt								= 0;
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		long s = System.currentTimeMillis();
		intInsertCnt = getSqlSession(strPoolName).delete(strSqlNameSpace + "." + strSqlId, objParameterMap);
		long e = System.currentTimeMillis();
		if (objParameterMap.containsKey("xtrmRequestUuid")) {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
		} else {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
		}
		return intInsertCnt;
	}

	public int delete(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return delete(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public int deleteList(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		int intDeleteCnt								= 0;
		if (objParams instanceof ApiEnvelope) {
			ArrayNode objData							= ((ApiEnvelope)objParams).getDataArrayNode();
			for (int i = 0; i < objData.size(); i++) {
				intDeleteCnt							+= delete(strSqlNameSpace, strSqlId, ((ApiEnvelope)objParams).getDataObjectNode(i), strPoolName);
			}
		} else if (objParams instanceof ArrayNode) {
			for (int i = 0; i < ((ArrayNode)objParams).size(); i++) {
				intDeleteCnt							+= delete(strSqlNameSpace, strSqlId, toObjectNode(((ArrayNode)objParams).get(i)), strPoolName);
			}
		} else {
			for (int i = 0; i < ((List)objParams).size(); i++) {
				intDeleteCnt							+= delete(strSqlNameSpace, strSqlId, ((List)objParams).get(i), strPoolName);
			}
		}
		return intDeleteCnt;
	}

	public int deleteList(String strSqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return deleteList(strSqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public ApiEnvelope executeJson(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName) throws Exception {
		// 최종 반환객체 생성
		ApiEnvelope objXtrmResult						= new ApiEnvelope();
		HashMap<String, Object> objParameterMap			= setParameterMap(objParams);
		long s = System.currentTimeMillis();
		List<HashMap<String, Object>> retMap			= new ArrayList<>();
		getSqlSession(strPoolName).selectList(strSqlNameSpace + "." + strSqlId, objParameterMap);
		retMap.add(objParameterMap);
		long e = System.currentTimeMillis();
		if (objParameterMap.containsKey("xtrmRequestUuid")) {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
		} else {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
		}
		objXtrmResult.setDataArrayNode(getJsonArrayFromList(retMap));
		int intDataSize = objXtrmResult.getDataArrayNode().size();
		objXtrmResult.setHeader("COUNT"					, intDataSize);
		objXtrmResult.setHeader("TOT_COUNT"				, intDataSize);
		if (objXtrmResult.containsKey("xtrmDataTotCount")) {
			objXtrmResult.setHeader("TOT_COUNT", objXtrmResult.getInt("xtrmDataTotCount"));
		}
		objXtrmResult.setHeader("PAGE_NO"				, ((ApiEnvelope)objParams).getHeaderInt("PAGE_NO"));
		objXtrmResult.setHeader("ROW_PER_PAGE"			, ((ApiEnvelope)objParams).getHeaderInt("ROW_PER_PAGE"));
		objXtrmResult.setHeader("sqlNameSpace"			, strSqlNameSpace);
		objXtrmResult.setHeader("sqlId"					, strSqlId);
		objXtrmResult.setHeader("connPoolName"			, strPoolName);
		objXtrmResult.setResultHeader(false, XtrmEnum.SELECT_SUCCESS.getCodeName());
		return objXtrmResult;
	}

	public ApiEnvelope executeJson(String sqlNameSpace, String strSqlId, Object objParams) throws Exception {
		return this.executeJson(sqlNameSpace, strSqlId, objParams, "xtrmdb");
	}

	public <T> List<T> executeMap(String strSqlNameSpace, String strSqlId, Object objParams, String strPoolName, Class<T> objDtoType) throws Exception {
		//최종 반환객체 생성
		List<T> objResultList							= new ArrayList<>();
		HashMap<String, Object> objParameterMap 		= setParameterMap(objParams);
		long s = System.currentTimeMillis();
		List<HashMap<String, Object>> retMap			= new ArrayList<>();
		getSqlSession(strPoolName).selectList(strSqlNameSpace + "." + strSqlId, objParameterMap);
		retMap.add(objParameterMap);
		long e = System.currentTimeMillis();
		if (objParameterMap.containsKey("xtrmRequestUuid")) {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId, (String)objParameterMap.get("xtrmRequestUuid"));
		} else {
			log.debug(getSqlStatement(strSqlNameSpace, strSqlId, objParameterMap, strPoolName), (e-s), MAPPER.writeValueAsString(objParameterMap), strSqlNameSpace, strSqlId);
		}
		for (int i = 0; i < retMap.size(); i++) {
			objResultList.add(convertMapToObject(retMap.get(i), objDtoType));
		}
		return objResultList;
	}

	public <T> List<T> executeMap(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType, String strPoolName) throws Exception {
		return executeMap(strSqlNameSpace, strSqlId, objParams, strPoolName, objDtoType);
	}

	public <T> List<T> executeMap(String strSqlNameSpace, String strSqlId, Object objParams, Class<T> objDtoType) throws Exception {
		return executeMap(strSqlNameSpace, strSqlId, objParams, "xtrmdb", objDtoType);
	}

	public HashMap<String, Object> setParameterMap(Object obj) throws Exception {
		return convertObjectToMap(obj);
	}

	public HashMap<String, Object> convertObjectToMap(Object obj) throws Exception {
		HashMap<String, Object> objConvertMap			= new HashMap<>();
		if (obj instanceof ApiEnvelope) {
			objConvertMap								= MAPPER.convertValue(((ApiEnvelope)obj).getDataObjectNode(), HashMap.class);
		} else if (obj instanceof HashMap) { // Map
		    HashMap<?, ?> nestedMap = (HashMap<?, ?>) obj;
		    for (Map.Entry<?, ?> entry : nestedMap.entrySet()) {
		        if (entry.getKey() instanceof String) {
		            objConvertMap.put((String) entry.getKey(), entry.getValue());
		        }
		    }
		} else {
			objConvertMap								= MAPPER.convertValue(obj, HashMap.class);
		}
		return objConvertMap;
	}

	private <T> T convertMapToObject(HashMap<String, Object> objMapParams, Class<T> objDtoType) throws Exception {
		return MAPPER.convertValue(objMapParams, objDtoType);
	}

	/**
	 * List<Map>을 json으로 변환한다.
	 * @param list List<Map<String, Object>>.
	 * @return ArrayNode.
	 * @throws Exception
	 */
	private ArrayNode getJsonArrayFromList(List<HashMap<String, Object>> list) throws Exception {
		ArrayNode jsonArray								= MAPPER.createArrayNode();
		for (HashMap<String, Object> map : list) {
			jsonArray.add(MAPPER.convertValue(map, ObjectNode.class));
		}
		return jsonArray;
	}

	private ObjectNode toObjectNode(Object obj) {
		if (obj instanceof ObjectNode) {
			return (ObjectNode)obj;
		}
		return MAPPER.convertValue(obj, ObjectNode.class);
	}

	/**
	 * sqlSession을  반환한다.
	 */
	private SqlSession getSqlSession(String strPoolName) {
		SqlSession sqlSession							= null;
		if ("xtrmdbSqlSession".equals(strPoolName + "SqlSession")) {
			sqlSession									= this.xtrmdbSqlSession;
		}
//		else if ("xtrmdwSqlSession".equals(strPoolName + "SqlSession")) {
//			sqlSession									= this.xtrmdwSqlSession;
//		}
		else {
			sqlSession									= (SqlSession)XtrmCmmnUtil.getBean(strPoolName + "SqlSession");
		}
		return sqlSession;
	}

	private DataSourceTransactionManager getTransactionManager(String strTxName) {
		DataSourceTransactionManager objTxManager		= null;
		if ("xtrmdbTx".equals(strTxName + "Tx")) {
			objTxManager								= (DataSourceTransactionManager)this.xtrmdbTx.getTransactionManager();
		}
//		else if ("xtrmdwTx".equals(strTxName + "Tx")) {
//			objTxManager								= (DataSourceTransactionManager)this.xtrmdwTx.getTransactionManager();
//		}
		else {
			objTxManager								= (DataSourceTransactionManager)((TransactionTemplate)XtrmCmmnUtil.getBean(strTxName + "Tx")).getTransactionManager();
		}
		return objTxManager;
	}

	public TransactionStatus beginTrans(String strPoolName, int txDefinitionPropagation) {
		DataSourceTransactionManager objTxManager		= getTransactionManager(strPoolName);
		DefaultTransactionDefinition def				= new DefaultTransactionDefinition();
		def.setPropagationBehavior(txDefinitionPropagation);
		return objTxManager.getTransaction(def);
	}

	public TransactionStatus beginTrans(String strPoolName) {
		return beginTrans(strPoolName, TransactionDefinition.PROPAGATION_REQUIRES_NEW);
	}

	public TransactionStatus beginTrans() {
		return beginTrans("xtrmdb", TransactionDefinition.PROPAGATION_REQUIRES_NEW);
	}

	public void commitTrans(String strPoolName, TransactionStatus objTxStatus) {
		if (objTxStatus != null) {
			DataSourceTransactionManager objTxManager	= getTransactionManager(strPoolName);
			objTxManager.commit(objTxStatus);
		}
	}

	public void commitTrans(TransactionStatus objTxStatus) {
		commitTrans("xtrmdb", objTxStatus);
	}

	public void rollbackTrans(String strPoolName, TransactionStatus objTxStatus) {
		if (objTxStatus != null) {
			DataSourceTransactionManager objTxManager	= getTransactionManager(strPoolName);
			objTxManager.rollback(objTxStatus);
		}
	}

	public void rollbackTrans(TransactionStatus objTxStatus) {
		rollbackTrans("xtrmdb", objTxStatus);
	}
	public String getSqlPrepared(String strSqlNameSpace, String strSqlId, HashMap<String, Object> objParameterMap, String strPoolName) {
		return getSqlSession(strPoolName).getConfiguration().getMappedStatement(strSqlNameSpace + "." + strSqlId).getBoundSql(objParameterMap).getSql();
	}
	public String getSqlPrepared(String sqlNameSpace, String strSqlId, HashMap<String, Object> objParameterMap) {
		return getSqlPrepared(sqlNameSpace, strSqlId, objParameterMap, "xtrmdb");
	}
	public String getSqlStatement(String sqlNameSpace, String strSqlId, HashMap<String, Object> objParameterMap) {
		return getSqlStatement(sqlNameSpace, strSqlId, objParameterMap, "xtrmdb");
	}
	public String getSqlStatement(String strSqlNameSpace, String strSqlId, HashMap<String, Object> objParameterMap, String strPoolName) {
		MappedStatement ms								= getSqlSession(strPoolName).getConfiguration().getMappedStatement(strSqlNameSpace + "." + strSqlId);
		BoundSql boundSql								= ms.getBoundSql(objParameterMap);
		Object params									= boundSql.getParameterObject();
		StringBuilder sqlStringBuilder					= new StringBuilder(boundSql.getSql());
		if (params != null) {
			BiConsumer<StringBuilder, Object> sqlObjectReplace = (sqlSb, value) -> {
				int questionIdx							= sqlSb.indexOf("?");
				if (questionIdx == -1) {
					return;
				}
				if (value == null) {
					sqlSb.replace(questionIdx, questionIdx + 1, "null");
				} else if (value instanceof String) {
					sqlSb.replace(questionIdx, questionIdx + 1, "'" + (value != null ? value.toString().replace("?", "&#63;") : "") + "'");
				} else if (value instanceof Integer || value instanceof Long || value instanceof Float || value instanceof Double) {
					sqlSb.replace(questionIdx, questionIdx + 1, value.toString());
				} else if (value instanceof LocalDate || value instanceof LocalDateTime || value instanceof Enum<?>) {
					sqlSb.replace(questionIdx, questionIdx + 1, "'" + (value != null ? value.toString() : "") + "'");
				} else {
					sqlSb.replace(questionIdx, questionIdx + 1, value.toString());
				}
			};
			if (params instanceof Integer || params instanceof Long || params instanceof Float || params instanceof Double || params instanceof String) {
				sqlObjectReplace.accept(sqlStringBuilder, params);
			} else if (params instanceof Map) {
				Map paramterObjectMap					= (Map)params;
				List<ParameterMapping> paramMappings	= boundSql.getParameterMappings();
				for (ParameterMapping parameterMapping : paramMappings) {
					String propertyKey					= parameterMapping.getProperty();
					try {
						Object paramValue = null;
						if (boundSql.hasAdditionalParameter(propertyKey)) {
							paramValue					= boundSql.getAdditionalParameter(propertyKey);
						} else {
							paramValue					= paramterObjectMap.get(propertyKey);
						}
						sqlObjectReplace.accept(sqlStringBuilder, paramValue);
					} catch(Exception e) {
						log.error("BiConsumer.accept ERROR", e);
						sqlObjectReplace.accept(sqlStringBuilder, "[cannot binding : " + propertyKey+ "]");
					}
				}
			} else {
				List<ParameterMapping> paramMappings	= boundSql.getParameterMappings();
				Class< ? extends Object> paramClass		= params.getClass();
				for (ParameterMapping parameterMapping : paramMappings) {
					String propertyKey					= parameterMapping.getProperty();
					try {
						Object paramValue				= null;
						if (boundSql.hasAdditionalParameter(propertyKey)) {
							paramValue					= boundSql.getAdditionalParameter(propertyKey);
						} else {
							Field field					= ReflectionUtils.findField(paramClass, propertyKey);
							field.setAccessible(true);
							paramValue					= field.get(params);
						}
						sqlObjectReplace.accept(sqlStringBuilder, paramValue);
					} catch(Exception e) {
						log.error("BiConsumer.accept ERROR", e);
						sqlObjectReplace.accept(sqlStringBuilder, "[cannot binding : " + propertyKey+ "]");
					}
				}
			}
		}
		return sqlStringBuilder.toString().replace("&#63;", "?");
	}

}
