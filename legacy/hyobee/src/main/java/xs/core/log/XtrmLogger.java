package xs.core.log;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import xs.core.utility.XtrmCmmnUtil;
//
public class XtrmLogger {
//
//	/**
//	 * The constant LOGGER.
//	 */
//	private static final org.slf4j.Logger REQUEST_LOGGER		  = LoggerFactory.getLogger("requestLogger");
//	private static final org.slf4j.Logger SQL_LOGGER			  = LoggerFactory.getLogger("sqlLogger");
//	private static final org.slf4j.Logger SQL_DELAY_LOGGER		  = LoggerFactory.getLogger("sqlDelayLogger");
//	private static final org.slf4j.Logger EXCEPTION_LOGGER		  = LoggerFactory.getLogger("exceptionLogger");
//	private static final org.slf4j.Logger RMQ_LOGGER			  = LoggerFactory.getLogger("rmqLogger");
//	private static final org.slf4j.Logger ES_LOGGER				  = LoggerFactory.getLogger("esLogger");
//	private static final org.slf4j.Logger CLIENT_LOGGER			  = LoggerFactory.getLogger("clientLogger");
//	private static final org.slf4j.Logger INTERFACE_LOGGER		  = LoggerFactory.getLogger("interfaceLogger");
//	private static final org.slf4j.Logger TOOLS_INTERFACE_LOGGER  = LoggerFactory.getLogger("toolsInterfaceLogger");
//	private static final org.slf4j.Logger REST_LOGGER			  = LoggerFactory.getLogger("restLogger");
//	private static final org.slf4j.Logger USER_LOGGER			  = LoggerFactory.getLogger("userLogger");
//	private static final org.slf4j.Logger DEBUG_LOGGER			  = LoggerFactory.getLogger("debugLogger");
//
//	/**
//	 * 요청정보를 로그파일에 출력한다.
//	 * @param objRequest Servlet 요청정보
//	 * @throws Exception
//	 */
//	public static void printRequest(String strRequest){
//		SystemOutPrint(strRequest);
//		if(Boolean.parseBoolean(XtrmCmmnUtil.getProperty("FILE_LOG_WRITE").toString())){
//			if(REQUEST_LOGGER.isInfoEnabled()){
//				REQUEST_LOGGER.info(strRequest);
//			}
//		}
//	}
//
//	/**
//	 * 인터페이스 요청정보를 로그파일에 출력한다.
//	 * @param objRequest Servlet 요청정보
//	 * @throws Exception
//	 */
//	public static void printInterfaceRequest(String strRequest){
//		SystemOutPrint(strRequest);
//		if(Boolean.parseBoolean(XtrmCmmnUtil.getProperty("FILE_LOG_WRITE").toString())){
//			if(INTERFACE_LOGGER.isInfoEnabled()){
//				INTERFACE_LOGGER.info(strRequest);
//			}
//		}
//	}
//
//	/**
//	 * TOOLS 인터페이스 요청정보를 로그파일에 출력한다.
//	 * @param objRequest Servlet 요청정보
//	 * @throws Exception
//	 */
//
//	public static void printToolsInterfaceRequest(String strRequest){
//		SystemOutPrint(strRequest);
//		if(Boolean.parseBoolean(XtrmCmmnUtil.getProperty("FILE_LOG_WRITE").toString())){
//			if(TOOLS_INTERFACE_LOGGER.isInfoEnabled()){
//				TOOLS_INTERFACE_LOGGER.info(strRequest);
//			}
//		}
//	}
//
//	/**
//	 * sql query 로그를 로그파일에 출력한다.
//	 * @param strQueryString SQL문자열
//	 * @param longRunTime 실행시간
//	 * @param strParameter 파라미터
//	 * @param sqlMapperNamespace SQL매퍼 네임스페이스
//	 * @param strSqlQueryId SQL ID
//	 */
//	public static void printSql(String strQueryString, long longRunTime, String strParameter, String sqlMapperNamespace, String strSqlQueryId, String strRequestUUID){
//		StringBuffer objBuffer	= new StringBuffer();
//		String[] objQueryString	= strQueryString.split("\\n");
//		strQueryString			= new String();
//		for(int i = 0; i < objQueryString.length; i++){
//			if(!"".equals(objQueryString[i].trim())){
//				strQueryString += objQueryString[i] + "\n";
//			}
//		}
//		setLogStringHeader(objBuffer, "SQL INFO", strRequestUUID);
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[RUN_MS]", 10, " ") + ": " + XtrmCmmnUtil.rpad(String.valueOf(longRunTime)	, 150, " ")	+ "┃");
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[MAPPER]", 10, " ") + ": " + XtrmCmmnUtil.rpad(sqlMapperNamespace			, 150, " ")	+ "┃");
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[SQL_ID]", 10, " ") + ": " + XtrmCmmnUtil.rpad(strSqlQueryId				, 150, " ")	+ "┃");
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[PARAMS]", 10, " ") + ": " + XtrmCmmnUtil.rpad(strParameter				, 150, " ")	+ "┃");
//		objBuffer.append("\n\n" + strQueryString);
//		setLogStringFooter(objBuffer);
//		SystemOutPrint(objBuffer);
//		if(Boolean.parseBoolean(XtrmCmmnUtil.getProperty("FILE_LOG_WRITE").toString())){
//			if(SQL_LOGGER.isInfoEnabled()){
//				SQL_LOGGER.info(objBuffer.toString());
//			}
//			if(longRunTime >= Long.parseLong(XtrmCmmnUtil.getProperty("QUERY_DELAY_TIME").toString())){
//				if(SQL_DELAY_LOGGER.isInfoEnabled()){
//					SQL_DELAY_LOGGER.info(objBuffer.toString());
//				}
//			}
//		}
//	}
//
//	public static void printSql(String strQueryString, long longRunTime, String strParameter, String sqlMapperNamespace, String strSqlQueryId){
//		printSql(strQueryString, longRunTime, strParameter, sqlMapperNamespace, strSqlQueryId, null);
//	}
//
//	/**
//	 * RabbitMQ 관련 로그를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printRmqLog(String strLog) {
//		SystemOutPrint(strLog);
//		if(RMQ_LOGGER.isInfoEnabled()){
//			RMQ_LOGGER.info(strLog);
//		}
//	}
//
//	/**
//	 * Elastic Search 관련 로그를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printEsLog(String strLog) {
//		SystemOutPrint(strLog);
//		if(ES_LOGGER.isInfoEnabled()){
//			ES_LOGGER.info(strLog);
//		}
//	}
//
//	/**
//	 * Client에서 별도 정의한 로그정보를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printClientLog(String strLog) {
//		SystemOutPrint(strLog);
//		if(CLIENT_LOGGER.isInfoEnabled()){
//			CLIENT_LOGGER.info(strLog);
//		}
//	}
//
//	/**
//	 * 인터페이스 관련 로그를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printInterfaceLog(String strLog) {
//		SystemOutPrint(strLog);
//		if(INTERFACE_LOGGER.isInfoEnabled()){
//			INTERFACE_LOGGER.info(strLog);
//		}
//	}
//	/**
//	 * 툴즈인터페이스 관련 로그를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printToolsInterfaceLog(String strLog) {
//		SystemOutPrint(strLog);
//		if(TOOLS_INTERFACE_LOGGER.isInfoEnabled()){
//			TOOLS_INTERFACE_LOGGER.info(strLog);
//		}
//	}
//
//	/**
//	 * REST API 통신 관련 로그를 로그파일에 출력한다.
//	 * @param strLog 로그 문자열 정보
//	 */
//	public static void printRestLog(String strURL, String strMethodType, String strRequestBody, String strResponse, String strException, String strRequestUUID) {
//		StringBuffer objBuffer	= new StringBuffer();
//		if(strResponse == null){
//			setLogStringHeader(objBuffer, "RESPONSE INFO", strRequestUUID);
//		}else{
//			setLogStringHeader(objBuffer, "REQUEST INFO", strRequestUUID);
//		}
//		//Request 객체 정보 출력
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[URL	  ]", 12, " ") + ": " + strURL);
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[METHOD   ]", 12, " ") + ": " + strMethodType);
//		objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[REQUEST  ]", 12, " ") + ": " + strRequestBody);
//		if(strResponse != null){
//			objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[RESPONSE ]", 12, " ") + ": " + strResponse);
//		}else if(strException != null){
//			objBuffer.append("\n┃ " + XtrmCmmnUtil.rpad("[EXCEPTION]", 12, " ") + ": " + strException);
//		}
//		setLogStringFooter(objBuffer);
//		SystemOutPrint(objBuffer.toString());
//		if(REST_LOGGER.isInfoEnabled()){
//			REST_LOGGER.info(objBuffer.toString());
//		}
//	}
//
//	public static void printRestLog(String strURL, String strMethodType, String strRequestBody, String strResponse, String strException) {
//		printRestLog(strURL, strMethodType, strRequestBody, strResponse, strException, null);
//	}
//
//	/**
//	 * 사용자 정의 로그를 로그파일에 출력한다.
//	 * @param objLog 로그 정보
//	 */
//	public static void printUserLog(String objLog) {
//		SystemOutPrint(objLog);
//		if(USER_LOGGER.isInfoEnabled()){
//			USER_LOGGER.info(objLog.toString());
//		}
//	}
//
//	/**
//	 * 개발자 디버그용 로그를 로그파일에 출력한다.
//	 * @param objLog 로그 정보
//	 * @param blnWriteLog 로그 출력 여부
//	 */
//	public static void printDebugLog(Object objLog, boolean blnWriteLog) {
//		if(blnWriteLog){
//			SystemOutPrint(objLog);
//			if(DEBUG_LOGGER.isInfoEnabled()){
//				DEBUG_LOGGER.info(objLog.toString());
//			}
//		}
//	}
//
//	/**
//	 * 로거를 지정하여 로그를 로그파일에 출력한다.
//	 * @param loggerName	로거명
//	 * @param objLog		로그 정보
//	 */
//	public static void printLog(String loggerName, Object objLog) {
//		SystemOutPrint(objLog);
//		Logger logger = LoggerFactory.getLogger( loggerName + "Logger" );
//		if(logger.isInfoEnabled()) {
//			logger.info(objLog.toString());
//		}
//	}
//
//	/**
//	 * Exception 로그를 로그파일에 출력한다.
//	 * @param objException Exception정보
//	 * @param strRequestUUID 요청정보UUID
//	 */
//	public static void printException(Exception objException, String strRequestUUID){
//		StringBuffer objBuffer	= new StringBuffer();
//		setLogStringHeader(objBuffer, "EXCEPTION INFO", strRequestUUID);
//		objBuffer.append("\n" + getExceptionLog(objException));
//		setLogStringFooter(objBuffer);
//		EXCEPTION_LOGGER.error(objBuffer.toString());
//		objException.printStackTrace();
//	}
//
//	public static void printException(Exception objException){
//		printException(objException, null);
//	}
//
//	/**
//	 * Exception 에서 로그 정보를 세팅하여 리턴한다.
//	 * @param e Exception정보
//	 * @return
//	 */
//	public static String getExceptionLog(Exception e){
//		StackTraceElement[] elements	= e.getStackTrace();
//		StackTraceElement	element		= null;
//		StringBuffer objBuffer			= new StringBuffer();
//		objBuffer.append(e.getMessage()).append("\n");
//		for(int i = 0; i < elements.length; i++){
//			element = elements[i];
//			objBuffer.append(element.getClassName() + ".");
//			objBuffer.append(element.getMethodName());
//			objBuffer.append("(" + element.getFileName());
//			objBuffer.append(":" + element.getLineNumber() + ")");
//			objBuffer.append("\n");
//		}
//		return objBuffer.toString();
//	}
//
//	/**
//	 * console 로그를 출력한다.
//	 * @param objBuffer
//	 */
//	public static void SystemOutPrint(Object objLog){
//		if(Boolean.parseBoolean(XtrmCmmnUtil.getProperty("SYSTEM_OUT_PRINT").toString())){
//			log.info(objLog);
//		}
//	}
//	private static void SystemOutPrint(StringBuffer objBuffer){
//		SystemOutPrint(objBuffer.toString());
//	}
//
//	public static void setLogStringHeader(StringBuffer objBuffer, String strLogSection, Object objRequestUUID){
//		objBuffer.append("\n[" + XtrmCmmnUtil.getFormatDateTimeMilli("-", ":") + "]");
//		objBuffer.append("\n┏" + XtrmCmmnUtil.lpad("", 10, "━"));
//		if(objRequestUUID != null && !"".equals(objRequestUUID.toString())){
//			objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//			if(strLogSection != null && !"".equals(strLogSection)){
//				objBuffer.append(XtrmCmmnUtil.rpad(strLogSection, 15, " ") + "[UUID=" + objRequestUUID.toString() + "]");
//				objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//				objBuffer.append(XtrmCmmnUtil.lpad("", 75, "━") + "┓");
//			}else{
//				objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//				objBuffer.append(XtrmCmmnUtil.lpad("", 143, "━") + "┓");
//			}
//		}else{
//			objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//			if(strLogSection != null && !"".equals(strLogSection)){
//				objBuffer.append(XtrmCmmnUtil.rpad(strLogSection, 15, " "));
//				objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//				objBuffer.append(XtrmCmmnUtil.lpad("", 128, "━") + "┓");
//			}else{
//				objBuffer.append(XtrmCmmnUtil.lpad("", 10, " "));
//				objBuffer.append(XtrmCmmnUtil.lpad("", 143, "━") + "┓");
//			}
//		}
//	}
//
//	@SuppressWarnings("unused")
//	private static void setLogStringHeader(StringBuffer objBuffer, String strLogSection){
//		setLogStringHeader(objBuffer, strLogSection, null);
//	}
//
//	public static void setLogStringFooter(StringBuffer objBuffer){
//		objBuffer.append("\n┗" + XtrmCmmnUtil.lpad("", 163, "━") + "┛");
//	}
//
}
