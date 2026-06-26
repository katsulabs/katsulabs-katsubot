package xs.core.utility.extend;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import xs.core.utility.XtrmCmmnUtil;

/**
 * Date 관련 유틸리티 클래스 .
 */
@SuppressWarnings("unused")
public class XtrmDateUtil{

	private static final String YEAR			= "^((?:19|20|21)[0-9]{2})$";
	private static final String MONTH			= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$";
	private static final String DATE			= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$";
	private static final String DATETIME		= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
	private static final String DATETIME_SECOND	= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$";
	private static final String TIME			= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
	private static final String TIME_SECOND		= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$";

	private static String setFormatDateTime(Object objDateTimeValue, String strFormat){
		String strReturnValue = new String();
		if(objDateTimeValue != null && !"".equals(objDateTimeValue.toString())){
			if(objDateTimeValue instanceof String){
				LocalDateTime objDateTimeNow	= LocalDateTime.now();
				String strBaseDateValue			= XtrmCmmnUtil.getNumberText(objDateTimeValue.toString());
				String strRealDateValue			= new String();
				strBaseDateValue.replaceAll("[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]", "");
				strBaseDateValue.replaceAll("\\p{Z}", "");
				String strBaseFormatter			= strFormat.replaceAll("[^\uAC00-\uD7A3xfe0-9a-zA-Z\\s]", "");
				strBaseFormatter				= strBaseFormatter.replaceAll("\\p{Z}", "");
				if(strBaseFormatter.indexOf("yyyy") >= 0) {
					strRealDateValue += strBaseDateValue.substring(0, 4);
					strBaseDateValue = strBaseDateValue.substring(4);
				}else if(strBaseFormatter.indexOf("yy") >= 0) {
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("yyyy"));
				}
				if(strBaseFormatter.indexOf("MM") >= 0) {
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("MM"));
				}
				if(strBaseFormatter.indexOf("dd") >= 0) {
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("dd"));
				}
				if(strBaseFormatter.indexOf("HH") >= 0){
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("HH"));
				}
				if(strBaseFormatter.indexOf("mm") >= 0){
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("mm"));
				}
				if(strBaseFormatter.indexOf("ss") >= 0){
					strRealDateValue += strBaseDateValue.substring(0, 2);
					strBaseDateValue = strBaseDateValue.substring(2);
				}else{
					strRealDateValue += objDateTimeNow.format(DateTimeFormatter.ofPattern("ss"));
				}
				if(strBaseFormatter.indexOf("SSS") >= 0){
					strRealDateValue += ".";
					strRealDateValue += strBaseDateValue.substring(0, 3);
					strBaseDateValue = strBaseDateValue.substring(3);
				}else{
					strRealDateValue += "." + objDateTimeNow.format(DateTimeFormatter.ofPattern("SSS"));
				}
				strReturnValue = LocalDateTime.parse(strRealDateValue, DateTimeFormatter.ofPattern("yyyyMMddHHmmss.SSS")).format(DateTimeFormatter.ofPattern(strFormat));
			}else if(objDateTimeValue instanceof LocalDate){
				strReturnValue = ((LocalDate)objDateTimeValue).format(DateTimeFormatter.ofPattern(strFormat));
			}else if(objDateTimeValue instanceof LocalDateTime){
				strReturnValue = ((LocalDateTime)objDateTimeValue).format(DateTimeFormatter.ofPattern(strFormat));
			}else if(objDateTimeValue instanceof Date){
				strReturnValue = LocalDateTime.ofInstant(((Date)objDateTimeValue).toInstant(), ZoneId.systemDefault()).format(DateTimeFormatter.ofPattern(strFormat));
			}else if(objDateTimeValue instanceof java.sql.Date){
				strReturnValue = ((java.sql.Date)objDateTimeValue).toLocalDate().format(DateTimeFormatter.ofPattern(strFormat));
			}else if(objDateTimeValue instanceof Timestamp){
				strReturnValue = ((Timestamp)objDateTimeValue).toLocalDateTime().format(DateTimeFormatter.ofPattern(strFormat));
			}
		}
		return strReturnValue;
	}

	private static String getDateTimeMilliFormatterString(String strDateDelimiter, String strTimeDelimiter){
		String strSpace = "";
		String strMilli	= "";
		if(!"".equals(strDateDelimiter) || !"".equals(strTimeDelimiter)){strSpace = " ";strMilli = ".";}
		return "yyyy" + strDateDelimiter + "MM" + strDateDelimiter + "dd" + strSpace + "HH" + strTimeDelimiter + "mm" + strTimeDelimiter + "ss" + strMilli + "SSS";
	}
	private static String getDateTimeMilliFormatterString() {
		return getDateTimeMilliFormatterString("", "");
	}
	private static String getDateTimeFormatterString(String strDateDelimiter, String strTimeDelimiter){
		String strSpace = "";
		if(!"".equals(strDateDelimiter) || !"".equals(strTimeDelimiter)){strSpace = " ";}
		return "yyyy" + strDateDelimiter + "MM" + strDateDelimiter + "dd" + strSpace + "HH" + strTimeDelimiter + "mm" + strTimeDelimiter + "ss";
	}
	private static String getDateTimeFormatterString() {
		return getDateTimeFormatterString("", "");
	}
	private static String getYearFormatterString(){
		return "yyyy";
	}
	private static String getMonthFormatterString(String strDateDelimiter){
		return "yyyy" + strDateDelimiter + "MM";
	}
	private static String getMonthFormatterString(){
		return getMonthFormatterString("");
	}
	private static String getDateFormatterString(String strDateDelimiter){
		return "yyyy" + strDateDelimiter + "MM" + strDateDelimiter + "dd";
	}
	private static String getDateFormatterString(){
		return getDateFormatterString("");
	}
	private static String getTimeFormatterString(String strTimeDelimiter){
		return "HH" + strTimeDelimiter + "mm" + strTimeDelimiter + "ss";
	}
	private static String getTimeFormatterString(){
		return getTimeFormatterString("");
	}


	/**
	 * 포맷에 맞는 날짜일시 반환
	 * @param objDateTimeValue 날짜일시
	 * @param strDateDelimiter 년월일 구분자
	 * @param strTimeDelimiter 시분초 구분자
	 * @return
	 */
	public static String getFormatDateTimeMilli(Object objDateTimeMilliValue, String strDateDelimiter, String strTimeDelimiter){
		return setFormatDateTime(objDateTimeMilliValue, getDateTimeMilliFormatterString(strDateDelimiter, strTimeDelimiter));
	}
	public static String getFormatDateTimeMilli(String strDateDelimiter, String strTimeDelimiter){
		return getFormatDateTimeMilli(LocalDateTime.now(), strDateDelimiter, strTimeDelimiter);
	}
	public static String getFormatDateTimeMilli(Object objDateTimeMilliValue){
		return getFormatDateTimeMilli(objDateTimeMilliValue, "", "");
	}
	public static String getFormatDateTimeMilli(){
		return getFormatDateTimeMilli(LocalDateTime.now(), "", "");
	}
	public static String getFormatDateTime(Object objDateTimeValue, String strDateDelimiter, String strTimeDelimiter){
		return setFormatDateTime(objDateTimeValue, getDateTimeFormatterString(strDateDelimiter, strTimeDelimiter));
	}
	public static String getFormatDateTime(String strDateDelimiter, String strTimeDelimiter){
		return getFormatDateTime(LocalDateTime.now(), strDateDelimiter, strTimeDelimiter);
	}
	public static String getFormatDateTime(Object objDateTimeValue){
		return getFormatDateTime(objDateTimeValue, "", "");
	}
	public static String getFormatDateTime(){
		return getFormatDateTime(LocalDateTime.now(), "", "");
	}
	public static String getFormatTime(Object objTimeValue, String strTimeDelimiter){
		return setFormatDateTime(objTimeValue, getTimeFormatterString(strTimeDelimiter));
	}
	public static String getFormatTime(String strTimeDelimiter){
		return getFormatTime(LocalDateTime.now(), strTimeDelimiter);
	}
	public static String getFormatTime(Object objTimeValue){
		return getFormatTime(objTimeValue, "");
	}
	public static String getFormatTime(){
		return getFormatTime(LocalDateTime.now(), "");
	}
	public static String getFormatDate(Object objDateValue, String strDateDelimiter){
		return setFormatDateTime(objDateValue, getDateFormatterString(strDateDelimiter));
	}
	public static String getFormatDate(String strDateDelimiter){
		return getFormatDate(LocalDateTime.now(), strDateDelimiter);
	}
	public static String getFormatDate(Object objDateValue){
		return getFormatDate(objDateValue, "");
	}
	public static String getFormatDate(){
		return getFormatDate(LocalDateTime.now(), "");
	}
	public static int getDateDiff(Object objBeginDateValue, Object objEndDateValue, String strDiffType){
		int intDiff					= 0;
		String strFormat			= null;
		String strBeginDate			= null;
		String strEndDate			= null;
		if("y".equals(strDiffType) || "M".equals(strDiffType) || "d".equals(strDiffType)){
			strFormat				= getDateFormatterString();
			strBeginDate			= setFormatDateTime(objBeginDateValue	, strFormat);
			strEndDate				= setFormatDateTime(objEndDateValue		, strFormat);
		}else if("H".equals(strDiffType) || "m".equals(strDiffType) || "s".equals(strDiffType)){
			strFormat				= getDateTimeFormatterString();
			strBeginDate			= setFormatDateTime(objBeginDateValue	, strFormat);
			strEndDate				= setFormatDateTime(objEndDateValue		, strFormat);
		}
		if(!"".equals(strBeginDate) && !"".equals(strEndDate)) {
			switch(strDiffType) {
				case "y" 	:
					intDiff = Integer.parseInt(String.valueOf(ChronoUnit.YEARS.between(LocalDate.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMdd")), LocalDate.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMdd")))));
					break;
				case "M" 	:
					intDiff = Integer.parseInt(String.valueOf(ChronoUnit.MONTHS.between(LocalDate.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMdd")), LocalDate.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMdd")))));
					break;
				case "d" 	:
					intDiff = Integer.parseInt(String.valueOf(ChronoUnit.DAYS.between(LocalDate.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMdd")), LocalDate.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMdd")))));
					break;
				case "H" 	:
					intDiff	= Integer.parseInt(String.valueOf(ChronoUnit.HOURS.between(LocalDateTime.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")), LocalDateTime.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))));
					break;
				case "m" 	:
					intDiff	= Integer.parseInt(String.valueOf(ChronoUnit.MINUTES.between(LocalDateTime.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")), LocalDateTime.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))));
					break;
				case "s" 	:
					intDiff	= Integer.parseInt(String.valueOf(ChronoUnit.SECONDS.between(LocalDateTime.parse(strBeginDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")), LocalDateTime.parse(strEndDate, DateTimeFormatter.ofPattern("yyyyMMddHHmmss")))));
					break;
			}
		}
		return intDiff;
	}
	public static long getTimeDiff(Object objBeginTimeValue, Object objEndTimeValue, String strDiffType){
		long longDiff				= 0;
		String strFormat			= getDateTimeFormatterString();
		String strBeginTime			= setFormatDateTime(objBeginTimeValue	, strFormat);
		String strEndTime			= setFormatDateTime(objEndTimeValue		, strFormat);
		if(!"".equals(strBeginTime) && !"".equals(strEndTime)){
			String strBeginDate 	= strBeginTime.substring(0,8);
			String strEndDate		= strEndTime.substring(0,8);
			String strBeginOnlyTime = strBeginTime.substring(8);
			String strEndOnlyTime	= strEndTime.substring(8);
			int intBeginHour		= Integer.parseInt(strBeginOnlyTime.substring(0,2));
			int intBeginMinute		= Integer.parseInt(strBeginOnlyTime.substring(2,4));
			int intBeginSecond		= Integer.parseInt(strBeginOnlyTime.substring(4));
			int intEndHour			= Integer.parseInt(strEndOnlyTime.substring(0,2));
			int intEndMinute		= Integer.parseInt(strEndOnlyTime.substring(2,4));
			int intEndSecond		= Integer.parseInt(strEndOnlyTime.substring(4));
			int intDateDiff			= getDateDiff(strBeginDate, strEndDate, "d");
			longDiff				= Duration.between(LocalTime.of(intBeginHour, intBeginMinute, intBeginSecond), LocalTime.of(intEndHour, intEndMinute, intEndSecond)).getSeconds()*1000;
			if(intDateDiff > 0){
				longDiff			= intDateDiff*24*60*60*1000 + longDiff;
			}
		}
		return longDiff;
	}
	public static String getAddDate(Object objDateValue, String strAddType, int intAddCount){
		return getAddDate(objDateValue, "", strAddType, intAddCount);
	}
	public static String getAddDate(Object objDateValue, String strDateDelimiter, String strAddType, int intAddCount){
		String strReturnDateValue	= "";
		String strFormat			= getDateFormatterString(strDateDelimiter);
		if("y".equals(strAddType)){
			strReturnDateValue = LocalDate.parse(setFormatDateTime(objDateValue, "yyyyMMdd"), DateTimeFormatter.BASIC_ISO_DATE).plusYears(intAddCount).format(DateTimeFormatter.ofPattern(strFormat));
		}else if("M".equals(strAddType)){
			strReturnDateValue = LocalDate.parse(setFormatDateTime(objDateValue, "yyyyMMdd"), DateTimeFormatter.BASIC_ISO_DATE).plusMonths(intAddCount).format(DateTimeFormatter.ofPattern(strFormat));
		}else if("d".equals(strAddType)){
			strReturnDateValue = LocalDate.parse(setFormatDateTime(objDateValue, "yyyyMMdd"), DateTimeFormatter.BASIC_ISO_DATE).plusDays(intAddCount).format(DateTimeFormatter.ofPattern(strFormat));
		}
		return strReturnDateValue;
	}
	public static String getFirstDayOfWeek(Object objDateValue, String strDateDelimiter){
		String strFormat = getDateFormatterString(strDateDelimiter);
		return LocalDate.parse(setFormatDateTime(objDateValue, strFormat), DateTimeFormatter.ofPattern(strFormat)).with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).format(DateTimeFormatter.ofPattern(strFormat));
	}
	public static String getLastDayOfWeek(Object objDateValue, String strDateDelimiter){
		String strFormat = getDateFormatterString(strDateDelimiter);
		return LocalDate.parse(setFormatDateTime(objDateValue, strFormat), DateTimeFormatter.ofPattern(strFormat)).with(TemporalAdjusters.next(DayOfWeek.SUNDAY)).format(DateTimeFormatter.ofPattern(strFormat));
	}
	public static String getFirstDayOfMonth(Object objDateValue, String strDateDelimiter){
		String strFormat = getDateFormatterString(strDateDelimiter);
		return LocalDate.parse(setFormatDateTime(objDateValue, strFormat), DateTimeFormatter.ofPattern(strFormat)).with(TemporalAdjusters.firstDayOfMonth()).format(DateTimeFormatter.ofPattern(strFormat));
	}
	public static String getLastDayOfMonth(Object objDateValue, String strDateDelimiter){
		String strFormat = getDateFormatterString(strDateDelimiter);
		return LocalDate.parse(setFormatDateTime(objDateValue, strFormat), DateTimeFormatter.ofPattern(strFormat)).with(TemporalAdjusters.lastDayOfMonth()).format(DateTimeFormatter.ofPattern(strFormat));
	}
	public static List<String> getPeriodDaysOfWeek(Object objDateValue, String strDateDelimiter){
		List<String> objDateList	= new ArrayList<>();
		String strFormat			= getMonthFormatterString(strDateDelimiter);
		String strBeginDate			= setFormatDateTime(getFirstDayOfWeek(objDateValue, strDateDelimiter), strFormat);
		String strEndDate			= setFormatDateTime(getLastDayOfWeek(objDateValue, strDateDelimiter), strFormat);
		String strIndexDate			= new String();
		int intLoopIdx				= 1;
		objDateList.add(strBeginDate);
		while(!strIndexDate.equals(strEndDate)){
			strIndexDate			= LocalDate.parse(strBeginDate).plusMonths(intLoopIdx).format(DateTimeFormatter.ofPattern(strFormat));
			objDateList.add(strIndexDate);
			intLoopIdx++;
		}
		objDateList.add(strEndDate);
		return objDateList;
	}
	public static List<String> getPeriodDaysOfMonth(Object objDateValue, String strDateDelimiter){
		List<String> objDateList	= new ArrayList<>();
		String strFormat			= getMonthFormatterString(strDateDelimiter);
		String strBeginDate			= setFormatDateTime(getFirstDayOfMonth(objDateValue, strDateDelimiter), strFormat);
		String strEndDate			= setFormatDateTime(getLastDayOfMonth(objDateValue, strDateDelimiter), strFormat);
		String strIndexDate			= new String();
		int intLoopIdx				= 1;
		objDateList.add(strBeginDate);
		while(!strIndexDate.equals(strEndDate)){
			strIndexDate			= LocalDate.parse(strBeginDate).plusMonths(intLoopIdx).format(DateTimeFormatter.ofPattern(strFormat));
			objDateList.add(strIndexDate);
			intLoopIdx++;
		}
		objDateList.add(strEndDate);
		return objDateList;
	}
	public static boolean validDateText(String strDateValue, String strType){
		boolean isValid				= false;
		if(strDateValue != null && strType != null){
			String temp				= XtrmCmmnUtil.getNumberText(strDateValue);
			switch(strType){
				case "yyyy"				:
					isValid			= strDateValue.matches(YEAR);
					break;
				case "yyyyMM"			:
					isValid			= strDateValue.matches(MONTH);
					break;
				case "yyyyMMdd"			:
					isValid			= strDateValue.matches(DATE);
					break;
				case "yyyyMMddHHmm"		:
					isValid			= strDateValue.matches(DATETIME);
					break;
				case "yyyyMMddHHmmss"	:
					isValid			= strDateValue.matches(DATETIME_SECOND);
					break;
				case "HHmm"				:
					isValid			= strDateValue.matches(TIME);
					break;
				case "HHmmss"			:
					isValid			= strDateValue.matches(TIME_SECOND);
					break;
				default					:
					break;
			}
		}
		return isValid;
	}
}

