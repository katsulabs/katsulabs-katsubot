/********************************************************************************
* @classDescription 엑셀 export/import관련 util
* @author HyosungITX Corp.
* @version 1.0
* -------------------------------------------------------------------------------
* Modification Information
* Date				Developer			Content
* -------			-------------		-------------------------
* 2019/01/15		이정원				신규생성
* -------------------------------------------------------------------------------
* Copyright (C) 2019 by HyosungITX Corp. All rights reserved.
*********************************************************************************/

package xs.core.utility;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import xs.core.dto.ApiEnvelope;

import java.io.File;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("unused")
public class XtrmExcelUtil {

	private static final ObjectMapper MAPPER						= new ObjectMapper();

	public static final int EXCELTYPE_SXSSF							= 0;
	public static final int EXCELTYPE_XSSF							= 1;
	public static final int EXCELTYPE_HSSF							= 2;
	public static final DecimalFormat DECIMAL_FORMATTER				= new DecimalFormat("###,###");
	public static Map<String, CellStyle> DEFAULT_EXCEL_STYLE		= null;

	public static ApiEnvelope cnvtExcelToApiEnvelope(File objFile, int intColumnRowIdx) throws Exception {
		ApiEnvelope objXtrmReturn = new ApiEnvelope();
		if(objFile.exists()){
			XtrmExcelSAXParser objExcelParser	= new XtrmExcelSAXParser(objFile, intColumnRowIdx);
			objXtrmReturn						= objExcelParser.parseExcel();
		}else{
			objXtrmReturn.setResultHeader(true, "파일이 존재하지 않습니다.");
		}
		return objXtrmReturn;
	}

	public static ApiEnvelope cnvtExcelToApiEnvelope(String strFilePath, int intColumnRowIdx) throws Exception {
		return cnvtExcelToApiEnvelope(Paths.get(strFilePath).toFile(), intColumnRowIdx);
	}

	@Deprecated
	public static ApiEnvelope cnvtExcelToXtrmJSON(File objFile, int intColumnRowIdx) throws Exception {
		return cnvtExcelToApiEnvelope(objFile, intColumnRowIdx);
	}

	@Deprecated
	public static ApiEnvelope cnvtExcelToXtrmJSON(String strFilePath, int intColumnRowIdx) throws Exception {
		return cnvtExcelToApiEnvelope(strFilePath, intColumnRowIdx);
	}

	public static void defineDefaultCellStyle(Workbook objWorkbook) {
		DEFAULT_EXCEL_STYLE = new HashMap<>();
		CellStyle style1 = objWorkbook.createCellStyle();
		style1.setVerticalAlignment(VerticalAlignment.CENTER);
		style1.setBorderBottom(BorderStyle.THIN);
		style1.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderLeft(BorderStyle.THIN);
		style1.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderRight(BorderStyle.THIN);
		style1.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style1.setBorderTop(BorderStyle.THIN);
		style1.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style1.setAlignment(HorizontalAlignment.LEFT);
		DEFAULT_EXCEL_STYLE.put("body_left", style1);

		CellStyle style2 = objWorkbook.createCellStyle();
		style2.setVerticalAlignment(VerticalAlignment.CENTER);
		style2.setBorderBottom(BorderStyle.THIN);
		style2.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderLeft(BorderStyle.THIN);
		style2.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderRight(BorderStyle.THIN);
		style2.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style2.setBorderTop(BorderStyle.THIN);
		style2.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style2.setAlignment(HorizontalAlignment.CENTER);
		DEFAULT_EXCEL_STYLE.put("body_center", style2);

		CellStyle style3 = objWorkbook.createCellStyle();
		style3.setVerticalAlignment(VerticalAlignment.CENTER);
		style3.setBorderBottom(BorderStyle.THIN);
		style3.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style3.setBorderLeft(BorderStyle.THIN);
		style3.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style3.setBorderRight(BorderStyle.THIN);
		style3.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style3.setBorderTop(BorderStyle.THIN);
		style3.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style3.setAlignment(HorizontalAlignment.RIGHT);
		DEFAULT_EXCEL_STYLE.put("body_right", style3);

		CellStyle style4	= objWorkbook.createCellStyle();
		Font style4Font		= objWorkbook.createFont();
		style4Font.setBold(true);
		style4Font.setColor(IndexedColors.BLACK.index);
		style4.setVerticalAlignment(VerticalAlignment.CENTER);
		style4.setBorderBottom(BorderStyle.THIN);
		style4.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style4.setBorderLeft(BorderStyle.THIN);
		style4.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style4.setBorderRight(BorderStyle.THIN);
		style4.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style4.setBorderTop(BorderStyle.THIN);
		style4.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style4.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style4.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
		style4.setFont(style4Font);
		style4.setWrapText(true);
		style4.setAlignment(HorizontalAlignment.CENTER);
		DEFAULT_EXCEL_STYLE.put("header", style4);

		CellStyle style5	= objWorkbook.createCellStyle();
		style5.setVerticalAlignment(VerticalAlignment.CENTER);
		style5.setBorderBottom(BorderStyle.THIN);
		style5.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style5.setBorderLeft(BorderStyle.THIN);
		style5.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style5.setBorderRight(BorderStyle.THIN);
		style5.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style5.setBorderTop(BorderStyle.THIN);
		style5.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style5.setAlignment(HorizontalAlignment.CENTER);
		DEFAULT_EXCEL_STYLE.put("rownumbers", style5);

		CellStyle style6	= objWorkbook.createCellStyle();
		Font style6Font		= objWorkbook.createFont();
		style6Font.setBold(true);
		style6Font.setColor(IndexedColors.BLACK.index);
		style6.setVerticalAlignment(VerticalAlignment.CENTER);
		style6.setBorderBottom(BorderStyle.THIN);
		style6.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style6.setBorderLeft(BorderStyle.THIN);
		style6.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style6.setBorderRight(BorderStyle.THIN);
		style6.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style6.setBorderTop(BorderStyle.THIN);
		style6.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style6.setAlignment(HorizontalAlignment.CENTER);
		style6.setFont(style6Font);
		style6.setWrapText(false);
		DEFAULT_EXCEL_STYLE.put("title", style6);

		CellStyle style7	= objWorkbook.createCellStyle();
		Font style7Font		= objWorkbook.createFont();
		style7Font.setBold(true);
		style7Font.setColor(IndexedColors.BLACK.index);
		style7.setVerticalAlignment(VerticalAlignment.CENTER);
		style7.setBorderBottom(BorderStyle.THIN);
		style7.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style7.setBorderLeft(BorderStyle.THIN);
		style7.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style7.setBorderRight(BorderStyle.THIN);
		style7.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style7.setBorderTop(BorderStyle.THIN);
		style7.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style7.setAlignment(HorizontalAlignment.RIGHT);
		style7.setFont(style7Font);
		style7.setWrapText(false);
		DEFAULT_EXCEL_STYLE.put("sub_title", style7);

		CellStyle style8	= objWorkbook.createCellStyle();
		Font style8Font		= objWorkbook.createFont();
		style8Font.setBold(true);
		style8Font.setColor(IndexedColors.BLACK.index);
		style8.setVerticalAlignment(VerticalAlignment.CENTER);
		style8.setBorderBottom(BorderStyle.THIN);
		style8.setBottomBorderColor(IndexedColors.BLACK.getIndex());
		style8.setBorderLeft(BorderStyle.THIN);
		style8.setLeftBorderColor(IndexedColors.BLACK.getIndex());
		style8.setBorderRight(BorderStyle.THIN);
		style8.setRightBorderColor(IndexedColors.BLACK.getIndex());
		style8.setBorderTop(BorderStyle.THIN);
		style8.setTopBorderColor(IndexedColors.BLACK.getIndex());
		style8.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		style8.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.index);
		style8.setFont(style8Font);
		style8.setWrapText(true);
		style8.setAlignment(HorizontalAlignment.RIGHT);
		DEFAULT_EXCEL_STYLE.put("footer", style8);

		CellStyle styleHidden	= objWorkbook.createCellStyle();
		styleHidden.setHidden(true);
		DEFAULT_EXCEL_STYLE.put("hidden_row", styleHidden);
	}

	public static Workbook createWorkbook(int intExcelType, int intFlushRowCount) {
		Workbook objWorkbook = null;
		if(intExcelType == EXCELTYPE_SXSSF){
			objWorkbook = new SXSSFWorkbook(intFlushRowCount);
		}else if(intExcelType == EXCELTYPE_XSSF){
			objWorkbook = new XSSFWorkbook();
		}else if(intExcelType == EXCELTYPE_HSSF){
			objWorkbook = new HSSFWorkbook();
		}
		defineDefaultCellStyle(objWorkbook);
		return objWorkbook;
	}

	public static Workbook createWorkbook(int intExcelType) {
		return createWorkbook(intExcelType, 100);
	}

	public static Workbook createWorkbook() {
		return createWorkbook(EXCELTYPE_SXSSF, 100);
	}

	public static Sheet createSheet(Workbook objWorkbook, String strSheetName) {
		Sheet objSheet = objWorkbook.createSheet(strSheetName);
		objSheet.setDisplayGridlines(true);
		objSheet.setPrintGridlines(true);
		objSheet.setFitToPage(true);
		objSheet.setHorizontallyCenter(true);
		objSheet.setAutobreaks(true);
		return objSheet;
	}

	public static Sheet createSheet(Workbook objWorkbook) {
		return objWorkbook.createSheet();
	}

	public static Row createRow(Sheet objSheet, int intRowIdx) {
		return objSheet.createRow(intRowIdx);
	}

	public static void removeRow(Sheet objSheet, int intRowIdx){
		objSheet.shiftRows(intRowIdx, intRowIdx + 1, -1);
		objSheet.removeRow(objSheet.getRow(intRowIdx + 1));
	}

	public static void setRowVisible(Row objRow, boolean blnVisible){
		objRow.setZeroHeight(!blnVisible);
	}

	public static Cell createCell(Row objRow, int intCellIdx) {
		return objRow.createCell(intCellIdx);
	}

	public static void writeCell(Cell objCell, Object objContents) {
		if(objContents instanceof Boolean){
			objCell.setCellValue((boolean)objContents);
		}else if(objContents instanceof Calendar){
			objCell.setCellValue((Calendar)objContents);
		}else if(objContents instanceof Date){
			objCell.setCellValue((Date)objContents);
		}else if(objContents instanceof Double){
			objCell.setCellValue((double)objContents);
		}else if(objContents instanceof RichTextString){
			objCell.setCellValue((RichTextString)objContents);
		}else if(objContents instanceof String){
			objCell.setCellValue((String)objContents);
		}else if(objContents instanceof Integer){
			objCell.setCellValue((int)objContents);
		}
	}

	public static void mergeCell(Sheet objSheet, int intBeginRowIdx, int intEndRowIdx, int intBeginCellIdx, int intEndCellIdx) {
		objSheet.addMergedRegion(new CellRangeAddress(intBeginRowIdx, intEndRowIdx, intBeginCellIdx, intEndCellIdx));
	}

	public static void setCellStyle(Cell objCell, CellStyle objCellStyle) {
		objCell.setCellStyle(objCellStyle);
	}

	public static void setCellType(Cell objCell, CellType objCellType) {
		objCell.setCellType(objCellType);
	}

	public static void setCellWidth(Sheet objSheet, int intCellIdx, int intWidth) {
		objSheet.setColumnWidth(intCellIdx, calculateCellWidthByPixel(intWidth * 1000));
	}

	public static void setRowHeight(Row objRow, int intHeight) {
		objRow.setHeight(Short.parseShort(String.valueOf(calculateCellWidthByPixel(intHeight * 1000))));
	}

	public static boolean isMergedCell(Sheet objSheet, int intBeginRowIdx, int intBeginCellIdx){
		for(int i = 0; i < objSheet.getNumMergedRegions(); i++){
			CellRangeAddress range = objSheet.getMergedRegion(i);
			if(intBeginRowIdx >= range.getFirstRow() && intBeginRowIdx <= range.getLastRow() && intBeginCellIdx >= range.getFirstColumn() && intBeginCellIdx <= range.getLastColumn()){
				return true;
			}
		}
		return false;
	}

	public static String getCellString(Cell objCell) {
		return objCell.getStringCellValue();
	}

	public static boolean getCellBoolean(Cell objCell) {
		return objCell.getBooleanCellValue();
	}

	public static Date getCellDate(Cell objCell) {
		return objCell.getDateCellValue();
	}

	public static double getCellDouble(Cell objCell) {
		return objCell.getNumericCellValue();
	}

	private static int calculateCellWidthByPixel(int intPixelWidth) {
		return Math.round(intPixelWidth * 9 / 256);
	}

	private static ObjectNode getFormatRegexp(String format, boolean controlSecond, boolean isMasking, String value, String bankCode){
		ObjectNode returnValue						= null;
		String regexp								= null;
		String pattern								= null;
		String oneChar								= new String();
		String twoChar								= new String();
		String threeChar							= new String();
		String fourChar 							= new String();

		String FORMAT_YEAR							= "^((?:19|20|21)[0-9]{2})$";
		String FORMAT_MONTH							= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])$";
		String FORMAT_DATE							= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])$";
		String FORMAT_DATETIME						= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
		String FORMAT_DATETIME_SECOND				= "^((?:19|20|21)[0-9]{2})(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])?$";
		String FORMAT_TIME							= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])$";
		String FORMAT_TIME_SECOND					= "^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$";
		String FORMAT_BIZ							= "^([0-9]{3})([0-9]{2})([0-9]{0,5})$";
		String FORMAT_JURI							= "^([0-9]{6})([0-9]{0,7})$/"	;
		String FORMAT_IHID							= "^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$";
		String FORMAT_PHONE_REGULAR					= "^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$";
		String FORMAT_PHONE_MOBILE					= "^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$";
		String FORMAT_PHONE_BIZ						= "^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$";
		String FORMAT_PHONE_ZEROSEVENZERO			= "^(070)([2-9]{1}[0-9]{3})([0-9]{4})$";
		String FORMAT_PHONE_LOCAL_EXTENTION			= "^([0-9]{4,5})$";
		String FORMAT_CARD_BC						= "^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_VISA						= "^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$";
		String FORMAT_CARD_MASTER					= "^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_DISCOVER					= "^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_AMEX						= "^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$";
		String FORMAT_CARD_DINERS					= "^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$";
		String FORMAT_CARD_JCB						= "^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_REGULAR					= "^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_IP							= "^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)))$";
		String FORMAT_POST							= "^([0-9]{3})([0-9]{3})$";
		String FORMAT_CAR							= "^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$";
		String FORMAT_IHID_MASKING					= "^([0-9]{2}(?:0[1-9]|1[012])(?:0[1-9]|[12][0-9]|3[0-1]))([0-9]{1})([0-9]{6})$";
		String FORMAT_PHONE_REGULAR_MASKING			= "^(02|03[1-3]|04[1-4]|05[1-5]|06[1-4]|050[0-9]{1}|060|070|080)([0-9]{3,4})([0-9]{4})$";
		String FORMAT_PHONE_MOBILE_MASKING			= "^(01[0|1|2|5|6|7|8|9])([0-9]{3,4})([0-9]{4})$";
		String FORMAT_PHONE_BIZ_MASKING				= "^(1588|1577|1899|1544|1644|1661|1566|1600|1670|1688|1666|1599|1877|1855|1800)([0-9]{0,4})$";
		String FORMAT_PHONE_ZEROSEVENZERO_MASKING	= "^(070)([2-9]{1}[0-9]{3})([0-9]{4})$";
		String FORMAT_CARD_BC_MASKING				= "^(9[0|4|5]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_VISA_MASKING				= "^(4[0-9]{3})([0-9]{4})([0-9]{4})([0-9]{1}(?:[0-9]{3}))$";
		String FORMAT_CARD_MASTER_MASKING			= "^(5[1-5][0-9]{2})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_DISCOVER_MASKING			= "^(6(?:011|44[0-9]|560|561|564|565))([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_AMEX_MASKING				= "^(3[47][0-9]{2})([0-9]{6})([0-9]{5})$";
		String FORMAT_CARD_DINERS_MASKING			= "^(3(?:0[0-5]|[68][0-9])[0-9]{1})([0-9]{6})([0-9]{4})$";
		String FORMAT_CARD_JCB_MASKING				= "^(?:2131|1800|35[0-9]{2})([0-9]{3,4})([0-9]{4})([0-9]{4})$";
		String FORMAT_CARD_REGULAR_MASKING			= "^([0-9]{4})([0-9]{4})([0-9]{4})([0-9]{4})$";
		String FORMAT_EMAIL_MASKING					= "^([\\w.]{3})(?:[\\w.]*)(@.*)$";
		String FORMAT_CAR_MASKING					= "^([가-힣]{2}[0-9]{2}|[0-9]{2,3})([가-힣]{1})([0-9]{1})([0-9]{3})$";

		switch(format){
			case "xuiform_year"		:
				regexp				= FORMAT_YEAR;
				pattern				= "$1";
				break;
			case "xuiform_month"	:
				regexp				= FORMAT_MONTH;
				pattern				= "$1-$2";
				break;
			case "xuiform_date"		:
				regexp				= FORMAT_DATE;
				pattern				= "$1-$2-$3";
				break;
			case "xuiform_datetime"	:
				if(controlSecond){
					regexp			= FORMAT_DATETIME_SECOND;
					pattern			= "$1-$2-$3 $4:$5:$6";
				}else{
					regexp			= FORMAT_DATETIME;
					pattern			= "$1-$2-$3 $4:$5";
				}
				break;
			case "xuiform_time"		:
				if(controlSecond){
					regexp			= FORMAT_TIME_SECOND;
					pattern			= "$1:$2:$3";
				}else{
					regexp			= FORMAT_TIME;
					pattern			= "$1:$2";
				}
				break;
			case "xuiform_biz"		:
				regexp				= FORMAT_BIZ;
				pattern				= "$1-$2-$3";
				break;
			case "xuiform_juri"		:
				regexp				= FORMAT_JURI;
				pattern				= "$1-$2";
				break;
			case "xuiform_ihid"		:
				regexp				= (isMasking ? FORMAT_IHID_MASKING : FORMAT_IHID);
				pattern				= (isMasking ? "$1-$2******" : "$1-$2$3");
				break;
			case "xuiform_phone"	:
				if(value != null && !"".equals(value) && value.length() >= 4){
					oneChar			= value.substring(0,1);
					twoChar			= value.substring(0,2);
					threeChar		= value.substring(0,3);
					fourChar 		= value.substring(0,4);
					if("1".equals(oneChar)){
						regexp		= (isMasking ? FORMAT_PHONE_BIZ_MASKING : FORMAT_PHONE_BIZ);
						pattern		= (isMasking ? "$1-****" : "$1-$2");
					}else if("01".equals(twoChar)){
						regexp		= (isMasking ? FORMAT_PHONE_MOBILE_MASKING : FORMAT_PHONE_MOBILE);
						pattern		= (isMasking ? "$1-****-$3" : "$1-$2-$3");
					}else if("070".equals(threeChar)){
						regexp		= (isMasking ? FORMAT_PHONE_ZEROSEVENZERO_MASKING : FORMAT_PHONE_ZEROSEVENZERO);
						pattern		= (isMasking ? "$1-****-$3" : "$1-$2-$3");
					}else if(value.length() == 4 || value.length() == 5){
						regexp		= FORMAT_PHONE_LOCAL_EXTENTION;
						pattern		= "$1";
					}else{
						regexp		= (isMasking ? FORMAT_PHONE_REGULAR_MASKING : FORMAT_PHONE_REGULAR);
						pattern		= (isMasking ? "$1-****-$3" : "$1-$2-$3");
					}
				}else{
					regexp			= (isMasking ? FORMAT_PHONE_REGULAR_MASKING : FORMAT_PHONE_REGULAR);
					pattern			= (isMasking ? "$1-****-$3" : "$1-$2-$3");
				}
				break;
			case "xuiform_card"		:
				if(value != null && !"".equals(value) && value.length() >= 4){
					oneChar			= value.substring(0,1);
					twoChar			= value.substring(0,2);
					threeChar		= value.substring(0,3);
					fourChar 		= value.substring(0,4);
					if("2131".equals(fourChar) || "1800".equals(fourChar) || "35".equals(twoChar)){
						regexp		= (isMasking ? FORMAT_CARD_JCB_MASKING : FORMAT_CARD_JCB);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}else if("34".equals(twoChar) || "37".equals(twoChar)){
						regexp		= (isMasking ? FORMAT_CARD_AMEX_MASKING : FORMAT_CARD_AMEX);
						pattern		= (isMasking ? "$1-******-$3" : "$1-$2-$3");
					}else if("30".equals(twoChar) || "36".equals(twoChar) || "38".equals(twoChar)){
						regexp		= (isMasking ? FORMAT_CARD_DINERS_MASKING : FORMAT_CARD_DINERS);
						pattern		= (isMasking ? "$1-******-$3" : "$1-$2-$3");
					}else if("9".equals(oneChar)){
						regexp		= (isMasking ? FORMAT_CARD_BC_MASKING : FORMAT_CARD_BC);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}else if("4".equals(oneChar)){
						regexp		= (isMasking ? FORMAT_CARD_VISA_MASKING : FORMAT_CARD_VISA);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}else if("5".equals(oneChar)){
						regexp		= (isMasking ? FORMAT_CARD_MASTER_MASKING : FORMAT_CARD_MASTER);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}else if("6011".equals(fourChar) || "6560".equals(fourChar) || "6561".equals(fourChar) || "6564".equals(fourChar) || "6565".equals(fourChar) || "644".equals(threeChar)){
						regexp		= (isMasking ? FORMAT_CARD_DISCOVER_MASKING : FORMAT_CARD_DISCOVER);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}else{
						regexp		= (isMasking ? FORMAT_CARD_REGULAR_MASKING : FORMAT_CARD_REGULAR);
						pattern		= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
					}
				}else{
					regexp			= (isMasking ? FORMAT_CARD_REGULAR_MASKING : FORMAT_CARD_REGULAR);
					pattern			= (isMasking ? "$1-****-****-$4" : "$1-$2-$3-$4");
				}
				break;
			case "xuiform_email"	:
				regexp				= FORMAT_EMAIL_MASKING;
				pattern				= (isMasking ? "$1****$3" : "$1$2$3");
				break;
			case "xuiform_ip"		:
				regexp				= FORMAT_IP;
				pattern				= (isMasking ? "$1.***.***.$4" : "$1.$2.$3.$4");
				break;
			case "xuiform_post"		:
				regexp				= FORMAT_POST;
				pattern				= (isMasking ? "$1-***" : "$1-$2");
				break;
			case "xuiform_car"		:
				regexp				= (isMasking ? FORMAT_CAR_MASKING : FORMAT_CAR);
				pattern				= (isMasking ? "$1$2$3***" : "$1$2$3$4");
				break;
			case "xuiform_account"	:
				if(bankCode != null && !"".equals(bankCode)){

				}
				break;
			case "xuiform_addr"		:
				break;
			default	:
				break;
		}
		if(regexp != null && pattern != null){
			returnValue				= MAPPER.createObjectNode();
			returnValue.put("regexp", regexp);
			returnValue.put("pattern", pattern);
		}
		return returnValue;
	}

	/**
	 * 데이터의 포맷팅을 위한 메소드
	 * @param gubun
	 * @param value
	 * @return
	 */
	public static String getFormatData(String format, String value, boolean controlSecond, boolean isMasking, Object arg01){
		value								= (value == null ? "" : value);
		String returnValue					= value;
		if(!"".equals(value)) {
			ObjectNode regexp				= getFormatRegexp(format, controlSecond, isMasking, value, (arg01 == null ? null : arg01.toString()));
			if(regexp != null){
				returnValue					= value.replaceAll(regexp.path("regexp").asText(), regexp.path("pattern").asText());
			}else{
				switch(format){
					case "xuiform_number"	:
						if(isNumeric(value)){
							boolean blnMinus			= false;
							blnMinus		= ("-".equals(value.substring(0,1)));
							value			= XtrmCmmnUtil.getNumberText(value);
							while(value.length() >= 2 && "0".equals(value.substring(0,1))){
								value		= value.substring(1);
							}
							returnValue		= DECIMAL_FORMATTER.format(Integer.parseInt(value));
							if(blnMinus && "0".equals(returnValue)){
								returnValue	= "";
							}
							if(!"".equals(returnValue)){
								returnValue	= (blnMinus ? "-" : "") + returnValue;
							}
						}else{
							returnValue		= value;
						}
						break;
					case "xuiform_decimal"	:
						if(isNumeric(value)){
							boolean blnMinus			= false;
							// int round		= 2;	우아한형제들로 변경 ktk
							int round		= 1;
							if(arg01 != null){
								round		= ((int)arg01);
							}
							blnMinus		= ("-".equals(value.substring(0,1)));
							boolean blnDot	= (value.indexOf(".") >= 0);
							value			= value.replaceAll("/[-]/g", "");
							String[] split	= value.split("\\.");
							int len			= split.length;
							String integer	= new String();
							String decimal	= new String();
							for(int i = 0; i < len; i++){
								if(i == 0){
									integer	= XtrmCmmnUtil.getNumberText(split[i] + "");
								}else{
									decimal	+= XtrmCmmnUtil.getNumberText((split[i] + ""));
								}
							}
							if("".equals(integer)){
								integer		= "0";
							}
							if(decimal.length() > round){
								decimal		= decimal.substring(0, round);
							}
							for(int j = round - decimal.length(); j > 0; j--){
								decimal		+= "0";
							}
							integer			= DECIMAL_FORMATTER.format(Integer.parseInt(integer));
							value			= (integer + "." + decimal);
							if(value.length() >= 2){
								while("0".equals(value.substring(0,1)) && !".".equals(value.substring(1,1)) && value.length() >= 2){
									value	= value.substring(1);
								}
							}
							if(".".equals(value)){
								value		= "";
							}
							if(!"".equals(value)){
								returnValue	= (blnMinus ? "-" : "") + value;
							}
						}else{
							returnValue		= value;
						}
						break;
					case "xuiform_filesize"	:
						value				= XtrmCmmnUtil.getNumberText(value);
						if(!"".equals(value)){
							long filesize	= Long.parseLong(value);
							if(filesize < 1024){
								returnValue	= String.valueOf(filesize) + "B";
							}else{
								int exp		= (int)(Math.log(filesize) / Math.log(1024));
								String pre	= "KMGTPEZY".charAt(exp-1) + "";
								returnValue	= String.format("%.2f %sB", filesize / Math.pow(1024, exp), pre);
							}
						}
						break;
					case "xuiform_addr"		:
						if(value.length() > 0){
							int sIdx		= -1;
							int sIdx2		= -1;
							int eIdx		= -1;
							int eIdx2		= -1;
							String strMask	= "";
							String strMask2	= "";
							if(value.indexOf("읍 ") >= 0){
								eIdx		= value.indexOf("읍 ");
							}else if(value.indexOf("면 ") >= 0){
								eIdx		= value.indexOf("면 ");
							}else if(value.indexOf("동 ") >= 0){
								eIdx		= value.indexOf("동 ");
							}else if(value.indexOf("로 ") >= 0){
								eIdx		= value.indexOf("로 ");
								if(value.indexOf("동) ") >= 0){
									eIdx2	= value.indexOf("동) ");
								}else if(value.indexOf("동&#41; ") >= 0){
									eIdx2	= value.indexOf("동&#41; ");
								}else if(value.indexOf("읍) ") >= 0){
									eIdx2	= value.indexOf("읍) ");
								}else if(value.indexOf("읍&#41; ") >= 0){
									eIdx2	= value.indexOf("읍&#41; ");
								}else if(value.indexOf("면) ") >= 0){
									eIdx2	= value.indexOf("면) ");
								}else if(value.indexOf("면&#41; ") >= 0){
									eIdx2	= value.indexOf("면&#41; ");
								}
							}else if(value.indexOf("길 ") >= 0){
								eIdx		= value.indexOf("길 ");
								if(value.indexOf("동) ") >= 0){
									eIdx2	= value.indexOf("동) ");
								}else if(value.indexOf("동&#41; ") >= 0){
									eIdx2	= value.indexOf("동&#41; ");
								}else if(value.indexOf("읍) ") >= 0){
									eIdx2	= value.indexOf("읍) ");
								}else if(value.indexOf("읍&#41; ") >= 0){
									eIdx2	= value.indexOf("읍&#41; ");
								}else if(value.indexOf("면) ") >= 0){
									eIdx2	= value.indexOf("면) ");
								}else if(value.indexOf("면&#41; ") >= 0){
									eIdx2	= value.indexOf("면&#41; ");
								}
							}
							for(int i = eIdx; i >= 0; i--){
								if(" ".equals(value.substring(i-1, i))){
									sIdx	= i;
									break;
								}else if(i - 1 < 0){
									sIdx	= i;
									break;
								}
								strMask		+= "*";
							}
							for(int j = eIdx2; j >= 0; j--){
								if("(".equals(value.substring(j-1, j))){
									sIdx2	= j;
									break;
								}else if("&#40;".equals(value.substring(j-5, j))){
									sIdx2	= j;
									break;
								}else if(j-1 < 0){
									sIdx2	= j;
									break;
								}
								strMask2	+= "*";
							}
							if(sIdx >= 0 && eIdx >= 0){
								if(sIdx2 >= 0 && eIdx2 >= 0){
									returnValue = value.substring(0, sIdx) + strMask + value.substring(eIdx, sIdx2) + strMask2 + value.substring(eIdx2);
								}else{
									returnValue = value.substring(0, sIdx) + strMask + value.substring(eIdx);
								}
							}
						}
						break;
					default	:
						break;
				}
			}
		}
		return returnValue;
	}

	/**
	 * 숫자만 가지고온다.
	 * @param data
	 * @return
	 */
	private static String exceptMask(String data)
	{
		String lsReturn = "", lsTemp = data.trim();
		char lcChar;

		for( int i = 0; i < lsTemp.length(); i++){
			lcChar = lsTemp.charAt(i);
			if(Character.isDigit(lcChar)){
				lsReturn += lcChar ;
			}
		}
		return lsReturn;
	}

	/**
	 * Numeric check
	 */
	private static boolean isNumeric(String data){
		boolean isNumeric	= false;
		try{
			if(data.indexOf(".") >= 0){
				Float.parseFloat(data);
			}else{
				Integer.parseInt(data);
			}
			isNumeric		= true;
		}catch(Exception e){}
		return isNumeric;
	}
}
