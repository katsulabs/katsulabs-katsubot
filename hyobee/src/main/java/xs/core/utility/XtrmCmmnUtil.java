/********************************************************************************
* @classDescription 업무 서비스 Util
* @author HyosungITX Corp.
* @version 1.0
* -------------------------------------------------------------------------------
* Modification Information
* Date				Developer			Content
* -------			-------------		-------------------------
* 2017/11/11		이정원				신규생성
* -------------------------------------------------------------------------------
* Copyright (C) 2017 by HyosungITX Corp. All rights reserved.
*********************************************************************************/

package xs.core.utility;

import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;
import xs.core.enumeration.XtrmEnum;
import xs.core.log.XtrmLogger;
import xs.core.property.XtrmProperty;
import xs.core.utility.extend.XtrmDateUtil;

@SuppressWarnings("unused")
@Slf4j
public class XtrmCmmnUtil extends XtrmDateUtil {

	private static final AtomicInteger atomic 					= new AtomicInteger(0);

	private static final String M_SERVER_IP_ADDR				= getServerIPv4HostAddress();

	private static final String YEAR							= "^((?:19|20|21)[0-9]{2})$";
	private static final String MONTH							= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$";
	private static final String DATE							= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$";
	private static final String DATETIME						= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
	private static final String DATETIME_SECOND					= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$";
	private static final String TIME							= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
	private static final String TIME_SECOND						= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$";
	private static final String CURRENCY						= "\\B(?=([0-9]{3})+(?![0-9]))";
	private static final String BIZ								= "^([0-9]{3})([0-9]{2})([0-9]{0,5})$";
	private static final String JURI							= "^([0-9]{6})([0-9]{0,7})$";
	private static final String IHID							= "^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$";
	private static final String PHONE_REGULAR					= "^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$";
	private static final String PHONE_MOBILE					= "^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$";
	private static final String PHONE_BIZ						= "^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$";
	private static final String PHONE_ZEROSEVENZERO				= "^(070)([2-9]{1}[0-9]{3})([0-9]{4})$";
	private static final String CARD_BC							= "^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_VISA						= "^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$";
	private static final String CARD_MASTER						= "^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_DISCOVER					= "^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_AMEX						= "^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$";
	private static final String CARD_DINERS						= "^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$";
	private static final String CARD_JCB						= "^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_REGULAR					= "^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String IP								= "^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))$";
	private static final String POST							= "^([0-9]{3})([0-9]{3})$";
	private static final String CAR								= "^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$";
	private static final String IHID_MASKING					= "^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$";
	private static final String PHONE_REGULAR_MASKING			= "^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$";
	private static final String PHONE_MOBILE_MASKING			= "^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$";
	private static final String PHONE_BIZ_MASKING				= "^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$";
	private static final String PHONE_ZEROSEVENZERO_MASKING		= "^(070)([2-9]{1}[0-9]{3})([0-9]{4})$";
	private static final String CARD_BC_MASKING					= "^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_VISA_MASKING				= "^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$";
	private static final String CARD_MASTER_MASKING				= "^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_DISCOVER_MASKING			= "^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_AMEX_MASKING				= "^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$";
	private static final String CARD_DINERS_MASKING				= "^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$";
	private static final String CARD_JCB_MASKING				= "^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$";
	private static final String CARD_REGULAR_MASKING			= "^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$";
	private static final String EMAIL_MASKING					= "^([\\w.]{3})(?:[\\w.]*)(@.*)$";
	private static final String CAR_MASKING						= "^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$";

	/*
	"YEAR"																	: {pattern:"$1"																			,regexp:"/^((?:19|20|21)[0-9]{2})$/"
	"MONTH"																	: {pattern:"$1" + xuic.__DATE_DELIMITER + "$2"											,regexp:"/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$/"
	"DATE"																	: {pattern:"$1" + xuic.__DATE_DELIMITER + "$2" + xuic.__DATE_DELIMITER + "$3"			,regexp:"/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$/"
	"DATETIME"																: {pattern:"$1" + xuic.__DATE_DELIMITER + "$2" + xuic.__DATE_DELIMITER + "$3 $4:$5"		,regexp:"/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/"
	"DATETIME_SECOND"														: {pattern:"$1" + xuic.__DATE_DELIMITER + "$2" + xuic.__DATE_DELIMITER + "$3 $4:$5:$6"	,regexp:"/^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$/"
	"TIME"																	: {pattern:"$1:$2"																		,regexp:"/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$/"
	"TIME_SECOND"															: {pattern:"$1:$2:$3"																	,regexp:"/^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$/"
	"CURRENCY"																: {pattern:","																			,regexp:"/\B(?=([0-9]{3})+(?![0-9]))/g"
	"BIZ"																	: {pattern:"$1-$2-$3"																	,regexp:"/^([0-9]{3})([0-9]{2})([0-9]{0,5})$/"
	"JURI"																	: {pattern:"$1-$2"																		,regexp:"/^([0-9]{6})([0-9]{0,7})$/"
	"IHID"																	: {pattern:"$1-$2$3"																	,regexp:"/^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$/"
	"PHONE_REGULAR"															: {pattern:"$1-$2-$3"																	,regexp:"/^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$/"
	"PHONE_MOBILE"															: {pattern:"$1-$2-$3"																	,regexp:"/^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$/"
	"PHONE_BIZ"																: {pattern:"$1-$2"																		,regexp:"/^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$/"
	"PHONE_ZEROSEVENZERO"													: {pattern:"$1-$2-$3"																	,regexp:"/^(070)([2-9]{1}[0-9]{3})([0-9]{4})$/"
	"CARD_BC"																: {pattern:"$1-$2-$3-$4"																,regexp:"/^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_VISA"																: {pattern:"$1-$2-$3-$4"																,regexp:"/^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$/"
	"CARD_MASTER"															: {pattern:"$1-$2-$3-$4"																,regexp:"/^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_DISCOVER"															: {pattern:"$1-$2-$3-$4"																,regexp:"/^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_AMEX"																: {pattern:"$1-$2-$3"																	,regexp:"/^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$/"
	"CARD_DINERS"															: {pattern:"$1-$2-$3"																	,regexp:"/^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$/"
	"CARD_JCB"																: {pattern:"$1-$2-$3-$4"																,regexp:"/^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$/"
	"CARD_REGULAR"															: {pattern:"$1-$2-$3-$4"																,regexp:"/^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"IP"																	: {pattern:"$1.$2.$3.$4"																,regexp:"/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))$/"
	"POST"																	: {pattern:"$1-$2"																		,regexp:"/^([0-9]{3})([0-9]{3})$/"
	"CAR"																	: {pattern:"$1$2$3$4"																	,regexp:"/^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$/"
	"IHID_MASKING"															: {pattern:"$1-$2******"																,regexp:"/^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$/"
	"PHONE_REGULAR_MASKING"													: {pattern:"$1-****-$3"																	,regexp:"/^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$/"
	"PHONE_MOBILE_MASKING"													: {pattern:"$1-****-$3"																	,regexp:"/^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$/"
	"PHONE_BIZ_MASKING"														: {pattern:"$1-****"																	,regexp:"/^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$/"
	"PHONE_ZEROSEVENZERO_MASKING"											: {pattern:"$1-****-$3"																	,regexp:"/^(070)([2-9]{1}[0-9]{3})([0-9]{4})$/"
	"CARD_BC_MASKING"														: {pattern:"$1-****-****-$4"															,regexp:"/^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_VISA_MASKING"														: {pattern:"$1-****-****-$4"															,regexp:"/^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$/"
	"CARD_MASTER_MASKING"													: {pattern:"$1-****-****-$4"															,regexp:"/^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_DISCOVER_MASKING"													: {pattern:"$1-****-****-$4"															,regexp:"/^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"CARD_AMEX_MASKING"														: {pattern:"$1-******-$3"																,regexp:"/^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$/"
	"CARD_DINERS_MASKING"													: {pattern:"$1-******-$3"																,regexp:"/^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$/"
	"CARD_JCB_MASKING"														: {pattern:"$1-****-****-$4"															,regexp:"/^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$/"
	"CARD_REGULAR_MASKING"													: {pattern:"$1-****-****-$4"															,regexp:"/^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$/"
	"EMAIL_MASKING"															: {pattern:"$1****$2"																	,regexp:"/^([\w.]{3})(?:[\w.]*)(@.*)$/"
	"CAR_MASKING"															: {pattern:"$1$2$3***"																	,regexp:"/^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$/"
	*/

	/**
	 * 문자열이 숫자로만 구성되어있는지 체크
	 * @param s
	 * @return
	 */
	public static boolean isNumeric(String strValue) {
		return strValue != null && strValue.matches("[-+]?\\d*\\.?\\d+");
	}

	/**
	 * 특정 자릿수만큼 알파벳 + 숫자 난수를 생성한다.
	 * @param intLen 자릿수
	 * @return
	 */
	public static String getRandomChar(int intLen){
		String strReturnValue	= "";
		Random objRandom		= new SecureRandom();
		for(int i = 0; i < intLen; i++){
		    if(objRandom.nextBoolean()){
		    	strReturnValue += (char)((objRandom.nextInt(26)) + 65);
		    }else{
		    	strReturnValue += (objRandom.nextInt(10));
		    }
		}
		return strReturnValue.toLowerCase();
	}

	/**
	 * 완성형문자(한글)여부 체크
	 * @param strValue
	 * @return
	 */
	public static boolean isWansungChar(String strValue){
		for(int i = 0; i < strValue.length() ; i++){
			String unicode = String.format("%04X", strValue.codePointAt(i));
			if( (unicode.compareTo("3130") >= 0) && (unicode.compareTo("318F") <= 0 )){
				return false;
			}
		}
		return true;
	}

	/**
	 * 한글,영문,숫자만 추출
	 * @param strValue
	 * @return
	 */
	public static String removeSpecialChar(String strValue){
		return strValue.replaceAll("[^가-힣a-zA-Z0-9\\s]", "").replaceAll("\\s+", " ").trim();
	}

	/**
	 * 문자열중 가장 마지막에 매칭되는 문자열을 치환
	 * @param strTextValue
	 * @param strRegex
	 * @param strReplaceTextValue
	 * @return
	 */
	public static String replaceLast(String strTextValue, String strRegex, String strReplaceTextValue) {
		return strTextValue.replaceFirst("(?s)" + strRegex + "(?!.*?" + strRegex + ")", strReplaceTextValue);
	}

	/**
	 * 메세지포맷을 이용하여 인덱스를 찾아서 문자열을 변경한다.
	 * @param strMsgPattern 메시지 패턴
	 * @param objMsgParams 배열 or
	 * @return
	 */
	public static String getPatternMsgFormat(String strMsgPattern, Object objMsgParams){
		String[] objParams = null;
		if(objMsgParams instanceof String) {
			objParams = objMsgParams.toString().split("\\|");
		}else{
			objParams = (String[])objMsgParams;
		}
		MessageFormat objFormat = new MessageFormat(strMsgPattern);
		return objFormat.format(objParams);
	}

	/**
	 * 특정 자릿수만큼 오른쪽 혹은 왼쪽으로 특정 문자열을 채워서 리턴해준다.
	 * @return
	 */
	private static String characterPad(String strTextValue, int intLength, String strPaddingText, boolean blnIsLeft){
		String strReturnValue 	= new String();
		int intTextLength		= strTextValue.length();
		if(intLength <= intTextLength || strPaddingText.equals("") || strPaddingText.length() > 1){
			strReturnValue		= strTextValue;
		}else{
			for(int i = 0; i < intLength-intTextLength; i++){
				strReturnValue	+= strPaddingText;
			}
			if(blnIsLeft){
				strReturnValue	+= strTextValue;
			}else{
				strReturnValue	= strTextValue + strReturnValue;
			}
		}
		return strReturnValue;
	}
	public static String lpad(String strTextValue, int intLength, String strPaddingText){
		return characterPad(strTextValue, intLength, strPaddingText, true);
	}
	public static String rpad(String strTextValue, int intLength, String strPaddingText){
		return characterPad(strTextValue, intLength, strPaddingText, false);
	}

	/**
	 * 특정 바이트길이만큼 오른쪽 혹은 왼쪽으로 특정 문자열을 채워서 리턴해준다.
	 * @return
	 * @throws Exception
	 */
	private static String bytePad(String strTextValue, int intLen, String strPaddingText, boolean blnIsLeft, String strEncoding) throws Exception{
		String returnValue		= "";
		int intByteSize			= strTextValue.getBytes(strEncoding).length;
		if(intLen <= intByteSize || "".equals(strPaddingText) || strPaddingText.length() > 1){
			returnValue			= strTextValue;
		}else{
			for(int i = 0; i < intLen-intByteSize; i++){
				returnValue		+= strPaddingText;
			}
			returnValue			= blnIsLeft ? (returnValue + strTextValue) : (strTextValue + returnValue);
		}
		return returnValue;
	}
	public static String byteLpad(String strTextValue, int intLen, String strPaddingText, String strEncoding) throws Exception{
		return bytePad(strTextValue, intLen, strPaddingText, true, strEncoding);
	}
	public static String byteLpad(String strTextValue, int intLen, String strPaddingText) throws Exception{
		return bytePad(strTextValue, intLen, strPaddingText, true, "UTF-8");
	}
	public static String byteRpad(String strTextValue, int intLen, String strPaddingText, String strEncoding) throws Exception{
		return bytePad(strTextValue, intLen, strPaddingText, false, strEncoding);
	}
	public static String byteRpad(String strTextValue, int intLen, String strPaddingText) throws Exception{
		return bytePad(strTextValue, intLen, strPaddingText, false, "UTF-8");
	}

	/**
	 * 입력받은 String에서 숫자만 발췌한다.
	 */
	public static String getNumberText(String strTextValue){
        String strReturnValue	= "";
        String strTempValue		= strTextValue.trim();
        char objCharacter;
        for (int i = 0; i < strTempValue.length(); i ++){
        	objCharacter = strTempValue.charAt(i);
	        if(Character.isDigit(objCharacter)){
	        	strReturnValue += objCharacter;
	        }
		}
		return strReturnValue;
    }

	public static String getFormatText(String strTextValue, String strType){
		String strReturnValue	= strTextValue;
		String strPattern		= new String();
		boolean blnMatchFind	= false;
		if(XtrmEnum.RESIDENT_REGISTRATION_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
			strPattern			= IHID;
			Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
			blnMatchFind		= matcher.find();
			if(blnMatchFind){
				strReturnValue	= strTextValue.replaceAll(strPattern, "$1-$2");
			}
		}else if(XtrmEnum.PHONE_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
			strPattern			= PHONE_MOBILE;
			Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
			blnMatchFind		= matcher.find();
			if(!blnMatchFind){
				strPattern		= PHONE_REGULAR;
				matcher			= Pattern.compile(strPattern).matcher(strTextValue);
				blnMatchFind	= matcher.find();
			}
			if(blnMatchFind){
				strReturnValue	= strTextValue.replaceAll(strPattern, "$1-$2-$3");
			}
		}else if(XtrmEnum.CARD_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
			strPattern			= CARD_REGULAR;
			Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
			blnMatchFind		= matcher.find();
			if(blnMatchFind){
				strReturnValue	= strTextValue.replaceAll(strPattern, "$1-$2-$3-$4");
			}
		}else if(XtrmEnum.ACCOUNT_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
		}else if(XtrmEnum.EMAIL_PATTERN.getCode().equals(strType)){

		}else if(XtrmEnum.NAME_PATTERN.getCode().equals(strType)){

		}else if(XtrmEnum.ADDRESS_PATTERN.getCode().equals(strType)){

		}

		return strReturnValue;
	}

	public static String getMaskingText(String strTextValue, String strType){
		String strReturnValue	= strTextValue;
		String strPattern		= new String();
		boolean blnMatchFind	= false;
		if(XtrmEnum.RESIDENT_REGISTRATION_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
			strPattern			= IHID;
			Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
			blnMatchFind		= matcher.find();
			if(blnMatchFind){
				String strReplaceTarget = matcher.group(2);
				strReturnValue	= matcher.group(1) + "-" + strReplaceTarget.substring(0,1) + "******";
			}
		}else if(XtrmEnum.PHONE_PATTERN.getCode().equals(strType)){
			// strTextValue 유효성 체크
			if(strTextValue == null || strTextValue.length() == 0 || strTextValue.isEmpty()) {
				strReturnValue = "";
			}else {
				strTextValue		= getNumberText(strTextValue);
				strPattern			= PHONE_MOBILE;
				Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
				blnMatchFind		= matcher.find();
				if(!blnMatchFind){
					strPattern		= PHONE_REGULAR;
					matcher			= Pattern.compile(strPattern).matcher(strTextValue);
					blnMatchFind	= matcher.find();
				}
				if(blnMatchFind){
					String strReplaceTarget = matcher.group(2);
					char[] c = new char[strReplaceTarget.length()];
					Arrays.fill(c, '*');
					strReturnValue	= strTextValue.replaceAll(strPattern, "$1-" + String.valueOf(c) + "-$3");
				}
			}
		}else if(XtrmEnum.CARD_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
			strPattern			= CARD_REGULAR;
			Matcher matcher 	= Pattern.compile(strPattern).matcher(strTextValue);
			blnMatchFind		= matcher.find();
			if(blnMatchFind){
				strReturnValue	= strTextValue.replaceAll(strPattern, "$1-****-****-$4");
			}
		}else if(XtrmEnum.ACCOUNT_PATTERN.getCode().equals(strType)){
			strTextValue		= getNumberText(strTextValue);
		}else if(XtrmEnum.EMAIL_PATTERN.getCode().equals(strType)){
			// strTextValue 유효성 체크
			if(strTextValue == null || strTextValue.length() == 0 || strTextValue.isEmpty()) {
				strReturnValue = "";
			}else {
				String first = null;
				if(strTextValue.indexOf("@")<3) {
					first = strTextValue.substring(0, strTextValue.indexOf("@"));
				}else {
					first = strTextValue.substring(0,3);
				}
				String last = strTextValue.substring(strTextValue.indexOf("@"));
				strReturnValue = first + "****" + last;
			}
		}else if(XtrmEnum.NAME_PATTERN.getCode().equals(strType)){

		}else if(XtrmEnum.ADDRESS_PATTERN.getCode().equals(strType)){

		}

		return strReturnValue;
	}

	/**
	 * Convert underscore to camelcase text
	 */
	public static String getCamelCase(String strTextValue){
		String[] parts					= strTextValue.split("_");
        StringBuilder camelCaseString	= new StringBuilder();
        for(int i = 0; i < parts.length ; i++) {
            String part					= parts[i];
            if(i != 0){
            	camelCaseString.append(part.substring(0,1).toUpperCase() + part.substring(1).toLowerCase());
            }else{
            	camelCaseString.append(part.toLowerCase());
            }
        }
        return camelCaseString.toString();
	}

	/**
	 * XSS을 방지하기 위해서 문자열에 있는 위험 특수문자를 치환한다.
	 * JSP에서 직접 파라메터를 찍을 때 해당 메서드를 이용하여 필터처리한다.
	 * @param key
	 * @return
	 */
	public static String filterXSSConst(String strData){
		strData = strData.replaceAll("&"		, "&amp;"	);
		strData = strData.replaceAll("<"		, "&lt;"	);
		strData = strData.replaceAll(">"		, "&gt;"	);
		strData = strData.replaceAll("%00"		, null		);
		strData = strData.replaceAll("\\("		, "&#40;"	);
		strData = strData.replaceAll("\\)"		, "&#41;"	);
		strData = strData.replaceAll("\""		, "&#34;"	);
		strData = strData.replaceAll("\'"		, "&#39;"	);
		strData = strData.replaceAll("%"		, "&#37;"	);
		strData = strData.replaceAll("../"		, ""		);
		strData = strData.replaceAll("..\\\\"	, ""		);
		strData = strData.replaceAll("./"		, ""		);
		strData = strData.replaceAll("%2F"		, ""		);
		strData = strData.replaceAll("eval\\((.*)\\)"								,""		);
		strData = strData.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']"	,"\"\""	);
		strData = strData.replaceAll("&lt;script"									, ""	);
		return strData;
	}
	public static String simpleFilterXSSConst(String strData){
		strData = strData.replaceAll("<"		,"&lt;"		);
		strData = strData.replaceAll(">"		,"&gt;"		);
		strData = strData.replaceAll("eval\\((.*)\\)"								,""		);
		strData = strData.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']"	,"\"\""	);
		strData = strData.replaceAll("&lt;script"									,""		);
		return strData;
	}
	public static String restoreXSSConst(String strData){
		strData = strData.replaceAll("&lt;"		,"<"		);
		strData = strData.replaceAll("&gt;"		,">"		);
		strData = strData.replaceAll("&#40;"	,"("		);
		strData = strData.replaceAll("&#41;"	,")"		);
		strData = strData.replaceAll("&#34;"	,"\""		);
		strData = strData.replaceAll("&#39;"	,"\'"		);
		strData = strData.replaceAll("&#37;"	,"%"		);
		strData = strData.replaceAll("&amp;"	,"&"		);
		return strData;
	}
	public static String restoreSimpleXSSConst(String strData){
		strData = strData.replaceAll("&lt;"		,"<"		);
		strData = strData.replaceAll("&gt;"		,">"		);
		return strData;
	}
	// XSS 공격 복원 로직 추가 (김정환)
	public static String recoverXSSConst(String strData){
		strData = strData.replaceAll("&"		, "&amp;"	);
		strData = strData.replaceAll("<"		, "&lt;"	);
		strData = strData.replaceAll(">"		, "&gt;"	);
		strData = strData.replaceAll("%00"		, null		);
		strData = strData.replaceAll("\\("		, "&#40;"	);
		strData = strData.replaceAll("\\)"		, "&#41;"	);
		strData = strData.replaceAll("\""		, "&#34;"	);
		strData = strData.replaceAll("\'"		, "&#39;"	);
		strData = strData.replaceAll("%"		, "&#37;"	);
//		strData = strData.replaceAll("../"		, ""		);
		strData = strData.replaceAll("..\\\\"	, ""		);
//		strData = strData.replaceAll("./"		, ""		);
		strData = strData.replaceAll("%2F"		, ""		);
		strData = strData.replaceAll("eval\\((.*)\\)"								,""		);
		strData = strData.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']"	,"\"\""	);
		strData = strData.replaceAll("&lt;script"									, ""	);
		return strData;
	}

	/**
	 * 현재 서버의 IPv4기반의 IP주소 가져오기
	 * @return {String} strRtnVal IP주소
	 * @throws Exception
	 */
	public static String getServerIPv4HostAddress(){
		if(M_SERVER_IP_ADDR == null){
			String strRtnVal = new String();
			try{
				Enumeration<NetworkInterface> nienum	= NetworkInterface.getNetworkInterfaces();
				while(nienum.hasMoreElements()){
					NetworkInterface ni					= nienum.nextElement();
					Enumeration<InetAddress> iaenum		= ni.getInetAddresses();
					while(iaenum.hasMoreElements()){
						InetAddress inetAddress			= iaenum.nextElement();
						if(!inetAddress.isLoopbackAddress() && !inetAddress.isLinkLocalAddress() && inetAddress.isSiteLocalAddress()){
							 strRtnVal					= inetAddress.toString().substring(1);
						}
					}
				}
			}catch(Exception e){
				log.error("NETWORK_INTERFACE_ERROR", e);
				strRtnVal	= "";
			}
			return strRtnVal;
		}else{
			return M_SERVER_IP_ADDR;
		}
	}

	/**
	 * 쿼리 문자열을 ObjectNode로 convert한다
	 */
	public static ObjectNode convertQueryStringToJson(String queryString) {
		ObjectNode convertJson							= JsonNodeFactory.instance.objectNode();
		if(queryString != null){
			String[] objParams							= queryString.split("&");
			String[] objQuerySet						= null;
			for(int i = 0; i < objParams.length; i++) {
				objQuerySet								= objParams[i].split("=");
				if(objQuerySet.length == 2){
					if(!"".equals(objQuerySet[0])){
						convertJson.put(objQuerySet[0], objQuerySet[1]);
					}
				}
			}
		}
		return convertJson;
	}

	/**
	 * 오브젝트 값을 Timestamp 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param tsDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return String 타입의 값
	 */
	public static Timestamp convertTimestamp(Object objValue, Timestamp tsDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return tsDefault;
		}else{
			return Timestamp.valueOf(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 String 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param strDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return String 타입의 값
	 */
	public static String convertString(Object objValue, String strDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return strDefault;
		}else{
			return objValue.toString();
		}
	}

	/**
	 * 오브젝트 값을 int 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param intDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return int 타입의 값
	 */
	public static int convertInteger(Object objValue, int intDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return intDefault;
		}else{
			return Integer.parseInt(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 boolean 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param blnDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return boolean 타입의 값
	 */
	public static boolean convertBoolean(Object objValue, boolean blnDefault) {
		if(objValue == null || objValue.toString().equals("") || (!objValue.toString().toUpperCase().equals("TRUE") && !objValue.toString().toUpperCase().equals("FALSE"))){
			return blnDefault;
		}else{
			return Boolean.parseBoolean(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 float 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param fltDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return float 타입의 값
	 */
	public static float convertFloat(Object objValue, float fltDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return fltDefault;
		}else{
			return Float.parseFloat(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 double 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param dblDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return double 타입의 값
	 */
	public static double convertDouble(Object objValue, double dblDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return dblDefault;
		}else{
			return Double.parseDouble(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 short 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param shtDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return short 타입의 값
	 */
	public static short convertShort(Object objValue, short shtDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return shtDefault;
		}else{
			return Short.parseShort(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 long 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param lngDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return long 타입의 값
	 */
	public static long convertLong(Object objValue, long lngDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return lngDefault;
		}else{
			return Long.parseLong(objValue.toString());
		}
	}

	/**
	 * 오브젝트 값을 BigDecimal 타입으로 변경하여 반환한다.
	 * @param objValue 오브젝트 값
	 * @param bigDefault 값이 없거나 빈문자일 경우 디폴트로 반환할 값
	 * @return BigDecimal 타입의 값
	 */
	public static BigDecimal convertBigDecimal(Object objValue, BigDecimal bigDefault) {
		if(objValue == null || objValue.toString().equals("")){
			return bigDefault;
		}else{
			if(objValue instanceof Double){
				return BigDecimal.valueOf((double)objValue);
			}else{
				return BigDecimal.valueOf(Long.parseLong(objValue.toString()));
			}
		 }
	 }

	public static String convertFormatDate(Date dateData, String format){
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(dateData);
	}

	/**
	 *
	 * @param strBeanId
	 * @return
	 */
	public static Object getBean(String strBeanId) {
		ApplicationContext applicationContext = XtrmApplicationContextProvider.getApplicationContext();
		if(applicationContext != null){
			return applicationContext.getBean(strBeanId);
		}else{
			return null;
		}
	}

	public static Object getProperty(String strPropertyKey, Object objDefaultValue) {
		XtrmProperty objXtrmConfig = (XtrmProperty)XtrmCmmnUtil.getBean("xtrmProperty");
		Object objReturnValue = objXtrmConfig.getObject(strPropertyKey);
		if(objReturnValue == null){objReturnValue = objDefaultValue;}
		return objReturnValue;
	}

	public static Object getProperty(String strPropertyKey) {
		return getProperty(strPropertyKey, null);
	}

	public static String getUUID() {
		return UUID.randomUUID().toString();
	}

	public static String getDbmsUniqueKey() {
		//기존 DB를 통해 키를 생성했던 기능은 Domain Api로 이동하고 Util에서는 App레벨에서 키를 생성하는 기능만 제공한다.
		//기존 함수명은 getAppUniqueKey()을 호출하는 형태로 유지 한다.
		return getAppUniqueKey();
	}

	public static String getAppUniqueKey() {
		int newValue = 1;
		while(true){
			int existingValue = atomic.get();
			newValue = existingValue + 1;
			if(newValue > 9999) newValue = 1;
			if(atomic.compareAndSet(existingValue,newValue)){
				return getFormatDateTimeMilli("", "") + String.format("%05d",newValue);
			}
		}
	}

}
