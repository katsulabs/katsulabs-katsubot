package xs.core.handler.excel;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmExcelUtil;

@SuppressWarnings({ "rawtypes", "unchecked" })
public class XtrmExportExcelResultHandler implements ResultHandler {

	private static final Logger log = LoggerFactory.getLogger(XtrmExportExcelResultHandler.class);
	private static final ObjectMapper MAPPER = new ObjectMapper();

	private Workbook objWorkbook;
	private List<String> objColumnNames;
	private ArrayNode objColumnModel;
	private ArrayNode objFooterInfo;
	private ObjectNode objFooterData;
	private int intColumnSize;
	private ArrayList<Integer> objExceptIdxList;
	private String excelTitle;
	private String excelSubTitle;
	private Sheet objSheet;
	private int intStartRowIdx;
	private int intStartCellIdx;
	private int intPlusIdx;
	private int intCurrentRowIdx;
	private int intCurrentCellIdx;
	private boolean excelVisibleKey;

	private int intCount						= 0;

	public XtrmExportExcelResultHandler(Workbook workbook, String columnNames, ArrayNode columnInfo, ArrayNode objGridData, ArrayNode objGridFooterInfo, String title, String subTitle, int startRowIdx, int startCellIdx, boolean excelVisibleKey) throws Exception {
		this.objWorkbook						= workbook;
		this.objColumnNames						= Arrays.asList(columnNames.split("\\|\\|"));
		this.objColumnModel						= columnInfo;
		this.objFooterInfo						= objGridFooterInfo;
		this.objFooterData						= null;
		this.excelTitle							= title;
		this.excelSubTitle						= subTitle;
		this.objSheet							= XtrmExcelUtil.createSheet(this.objWorkbook);
		this.intStartRowIdx						= startRowIdx;
		this.intStartCellIdx					= startCellIdx;
		this.intPlusIdx							= this.intStartRowIdx;
		this.intCurrentRowIdx					= this.intStartRowIdx;
		this.intCurrentCellIdx					= this.intStartCellIdx;
		this.excelVisibleKey					= excelVisibleKey;
		// Excel Index 목록
		setExceptIndexList();
		// Excel Title 생성
		createTitle();
		// 그리드 헤더부 데이터 생성
		createHeader();
		// 쿼리 execute가 아닌 데이터셋 존재할 시.
		if (objGridData != null) {
			createBodyByJsonArray(objGridData);
		}
	}

	@Override
	public void handleResult(ResultContext objResultContext) {
		try {
			createBodyByResultContext(objResultContext);
		} catch(Exception e) {
			log.error("CREATE_BODY_BY_RESULT_CONTEXT ERROR", e);
		}
	}

	public int getCount() {
		return this.intCount;
	}

	public void setExceptIndexList() {
		List<String> objColumnNamesList			= Arrays.asList(this.objColumnNames.get(0).split(","));
		this.intColumnSize						= objColumnNamesList.size();
		this.objExceptIdxList					= new ArrayList<>();
		for (int j = 0; j < this.intColumnSize; j++) {
			if (!this.objColumnModel.get(j).path("excel").asBoolean()) {
				this.objExceptIdxList.add(j);
			}
		}
	}

	private void createTitle() {
		if (!"".equals(this.excelTitle)) {
			ObjectNode objColModelJson = null;
			boolean blnExcel = true;
			Row objRow = XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);

			// 1. 첫 번째 셀 생성 (제목 작성)
			Cell objCell = XtrmExcelUtil.createCell(objRow, this.intStartCellIdx); // 시작 인덱스(0번)부터 생성
			XtrmExcelUtil.setRowHeight(objRow, 25); // 제목 행 높이를 조금 더 높게 설정
			XtrmExcelUtil.setCellType(objCell, CellType.STRING);
			XtrmExcelUtil.writeCell(objCell, this.excelTitle);
			XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("title"));

			// 제목 셀 이후의 인덱스를 관리하기 위한 변수
			int lastTitleCellIdx = this.intStartCellIdx;

			// 2. 엑셀에 출력될 컬럼 개수만큼 빈 셀을 생성하고 스타일 적용 (병합을 위해 테두리 등을 입히는 과정)
			// 제목 옆에 '순번' 컬럼 자리가 있으므로 +1을 고려하거나 전체 루프를 돕니다.
			lastTitleCellIdx++; // 순번 자리 확보

			for (int i = 0; i < this.intColumnSize; i++) {
				objColModelJson = (ObjectNode) this.objColumnModel.get(i);
				blnExcel = objColModelJson.path("excel").asBoolean();
				if (blnExcel) {
					objCell = XtrmExcelUtil.createCell(objRow, lastTitleCellIdx);
					XtrmExcelUtil.setCellType(objCell, CellType.STRING);
					XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("title"));
					lastTitleCellIdx++;
				}
			}

			// 3. [핵심] 셀 병합 실행
			// 시작열(intStartCellIdx)부터 마지막 생성된 열(lastTitleCellIdx - 1)까지 병합
			XtrmExcelUtil.mergeCell(this.objSheet, this.intCurrentRowIdx, this.intCurrentRowIdx, this.intStartCellIdx, lastTitleCellIdx - 1);

			// 다음 행으로 이동
			this.intCurrentCellIdx = this.intStartCellIdx;
			this.intCurrentRowIdx = this.intCurrentRowIdx + 2;
			this.intPlusIdx = this.intCurrentRowIdx;

			// --- SubTitle(부제목) 로직도 동일하게 보정 ---
			if (!"".equals(this.excelSubTitle)) {
				objRow = XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);
				objCell = XtrmExcelUtil.createCell(objRow, this.intStartCellIdx);
				XtrmExcelUtil.setCellType(objCell, CellType.STRING);
				XtrmExcelUtil.writeCell(objCell, this.excelSubTitle);
				XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("sub_title"));

				int lastSubCellIdx = this.intStartCellIdx;
				lastSubCellIdx++; // 순번 자리

				for (int i = 0; i < this.intColumnSize; i++) {
					objColModelJson = (ObjectNode) this.objColumnModel.get(i);
					blnExcel = objColModelJson.path("excel").asBoolean();
					if (blnExcel) {
						objCell = XtrmExcelUtil.createCell(objRow, lastSubCellIdx);
						XtrmExcelUtil.setCellType(objCell, CellType.STRING);
						XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("sub_title"));
						lastSubCellIdx++;
					}
				}
				XtrmExcelUtil.mergeCell(this.objSheet, this.intCurrentRowIdx, this.intCurrentRowIdx, this.intStartCellIdx, lastSubCellIdx - 1);

				this.intCurrentCellIdx = this.intStartCellIdx;
				this.intCurrentRowIdx = this.intCurrentRowIdx + 2;
				this.intPlusIdx = this.intCurrentRowIdx;
			}
		}
	}

	private void createHeader() {
		List<String> objColumnNamesList			= new ArrayList<>();
		ObjectNode objColModelJson				= MAPPER.createObjectNode();
		Row objRow								= null;
		Row objSubRow							= null;
		Cell objCell							= null;
		Cell objSubCell							= null;
		int intHeaderRowCount					= this.objColumnNames.size();
		this.intCurrentRowIdx					= (this.intCurrentRowIdx + intHeaderRowCount - 1);
		this.intCurrentCellIdx					= this.intStartCellIdx;
		boolean blnExcel						= true;
		boolean blnFixedColumn					= false;
		int intFixedCellIdx						= 0;

		// 헤더부
		for (int i = intHeaderRowCount-1; i >= 0; i--) {
			objRow	= XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);
			objCell = XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
			XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("header"));
			XtrmExcelUtil.setCellType(objCell, CellType.STRING);
			XtrmExcelUtil.setCellWidth(this.objSheet, this.intCurrentCellIdx, 40);
			XtrmExcelUtil.setRowHeight(objRow, 20);
			XtrmExcelUtil.writeCell(objCell, "순번");
			this.intCurrentCellIdx++;
			objColumnNamesList					= Arrays.asList(this.objColumnNames.get(i).split(","));
			for (int j = 0; j < this.intColumnSize; j++) {
				objColModelJson					= (ObjectNode) this.objColumnModel.get(j);
				blnExcel						= objColModelJson.path("excel").asBoolean();
				blnFixedColumn					= objColModelJson.path("freezeColumn").asBoolean();
				if (blnFixedColumn) {
					intFixedCellIdx				= j;
				}
				if (blnExcel) {
					objCell						= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
					XtrmExcelUtil.setCellStyle(objCell	,XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("header"));
					XtrmExcelUtil.setCellType(objCell	,CellType.STRING);
					XtrmExcelUtil.setCellWidth(this.objSheet, this.intCurrentCellIdx, objColModelJson.path("width").asInt());
					XtrmExcelUtil.writeCell(objCell		,XtrmCmmnUtil.restoreXSSConst(objColumnNamesList.get(j)));
					this.intCurrentCellIdx++;
				}
			}
			this.intCurrentCellIdx				= this.intStartCellIdx;
			this.intCurrentRowIdx--;
		}

		//현재 열, 행 인덱스 초기화
		this.intCurrentRowIdx					= this.intPlusIdx + intHeaderRowCount;
		this.intCurrentCellIdx					= this.intStartCellIdx;

		//헤더부 ROW가 1ROW 이상일 시 merge작업.
		if (intHeaderRowCount > 1) {
			int intColSpan						= 0;
			int intRowSpan						= 0;
			String strCellValue					= "";
			String strCompareCellValue			= "";
			String strSubCellValue				= "";
			String strSubCompareCellValue		= "";
			int intRowMergeStratIdx				= -1;
			// COLSPAN 병합
			for (int y = this.intPlusIdx; y <= (this.intPlusIdx + intHeaderRowCount - 1); y++) {
				// 행
				objRow							= this.objSheet.getRow(y);
				for (int z = 1; z <= this.intColumnSize - (this.objExceptIdxList.size()-1); z++) {
					objCell						= objRow.getCell(z);
					strCellValue				= XtrmExcelUtil.getCellString(objCell);
					strSubCellValue				= strCellValue;
					intColSpan					= 0;
					intRowSpan					= 0;
					if (!XtrmExcelUtil.isMergedCell(this.objSheet, y, z)) {
						for (int zz = (z+1); zz <= this.intColumnSize - (this.objExceptIdxList.size()-1); zz++) {
							objCell				= objRow.getCell(zz);
							strCompareCellValue	= XtrmExcelUtil.getCellString(objCell);
							if (strCellValue.equals(strCompareCellValue)) {
								intColSpan++;
								strCellValue	= strCompareCellValue;
							} else {
								break;
							}
						}
						for (int zzz = y+1; zzz <= (this.intPlusIdx + intHeaderRowCount - 1); zzz++) {
							objSubRow			= this.objSheet.getRow(zzz);
							objSubCell			= objSubRow.getCell(z);
							strSubCompareCellValue	= XtrmExcelUtil.getCellString(objSubCell);
							if (strSubCellValue.equals(strSubCompareCellValue)) {
								intRowSpan++;
								strSubCellValue	= strSubCompareCellValue;
							} else {
								break;
							}
						}
					}
					if (intColSpan > 0) {
						XtrmExcelUtil.mergeCell(this.objSheet, y, (y + intRowSpan), z, (z + intColSpan));
					}
				}
			}

			// ROWSPAN 병합
			for (int x = 1; x <= this.intColumnSize - (this.objExceptIdxList.size()-1); x++) {
				objRow							= this.objSheet.getRow(this.intPlusIdx);
				objCell							= objRow.getCell(x);
				strCellValue					= XtrmExcelUtil.getCellString(objCell);
				intRowSpan						= 0;
				intRowMergeStratIdx				= 0;
				for (int n = this.intPlusIdx + 1; n <= (this.intPlusIdx + intHeaderRowCount - 1); n++) {
					objRow						= this.objSheet.getRow(n);
					objCell						= objRow.getCell(x);
					strCompareCellValue			= XtrmExcelUtil.getCellString(objCell);
					if (strCellValue.equals(strCompareCellValue)) {
						if (intRowMergeStratIdx == 0) {intRowMergeStratIdx = n-1;}
						intRowSpan++;
					}
					strCellValue				= strCompareCellValue;
				}
				if (intRowSpan > 0) {
					if (intRowMergeStratIdx == 0) {intRowMergeStratIdx = 1;}
					if (!XtrmExcelUtil.isMergedCell(this.objSheet, intRowMergeStratIdx, x)) {
						XtrmExcelUtil.mergeCell(this.objSheet, intRowMergeStratIdx, (intRowMergeStratIdx + intRowSpan), x, x);
					}
				}
			}
		}
		if (!excelVisibleKey) {
			// 헤더 컬럼 key 정보 ROW 추가처리(숨김)
			objRow									= XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);
			objCell									= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
			XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("header"));
			XtrmExcelUtil.setCellType(objCell, CellType.STRING);
			XtrmExcelUtil.setRowHeight(objRow, 20);
			XtrmExcelUtil.writeCell(objCell, "xtrmRowNumber");
			this.intCurrentCellIdx++;
			for (int z = 0; z < this.intColumnSize; z++) {
				objColModelJson						= (ObjectNode) this.objColumnModel.get(z);
				blnExcel							= objColModelJson.path("excel").asBoolean();
				if (blnExcel) {
					objCell							= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
					XtrmExcelUtil.setCellStyle(objCell	,XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("header"));
					XtrmExcelUtil.setCellType(objCell	,CellType.STRING);
					XtrmExcelUtil.writeCell(objCell		,objColModelJson.path("name").asText());
					this.intCurrentCellIdx++;
				}
			}
			XtrmExcelUtil.setRowVisible(objRow, false);			// 우아한 형제들 키컬럼 히든처리 막음 by ktk
			this.intCurrentRowIdx++;
			this.intCurrentCellIdx					= this.intStartCellIdx;
			// 틀고정
			if (intFixedCellIdx > 0) {intFixedCellIdx = intFixedCellIdx+2;}
			this.objSheet.createFreezePane(intFixedCellIdx, this.intCurrentRowIdx);
		}
	}

	private void createBodyByResultContext(ResultContext objResultContext) throws Exception {
		// 데이터 처리갯수 증가
		this.intCount							= objResultContext.getResultCount();
		//ROW 데이터 추출
		HashMap<String, Object> objResultMap	= (HashMap<String, Object>)objResultContext.getResultObject();
		ObjectNode objJsonRowData				= MAPPER.convertValue(objResultMap, ObjectNode.class);
		createBody(objJsonRowData);
	}

	private void createBodyByJsonArray(ArrayNode objJsonData) throws Exception {
		int size								= objJsonData.size();
		if (this.objFooterInfo != null && this.objFooterInfo.size() > 0) {
			size								= size - 1;
			this.objFooterData					= (ObjectNode) objJsonData.get(size);
		}
		for (int i = 0; i < size; i++) {
			this.intCount = (i+1);
			createBody((ObjectNode) objJsonData.get(i));
		}
		adjustFooterCell();
	}

	private void createBody(ObjectNode objJsonRowData) {
		ObjectNode objColModelJson				= MAPPER.createObjectNode();
		String strKey							= "";
		String strValue							= "";
		String strFormat						= "";
		String strAlign							= "";
		boolean blnExcel						= true;
		boolean arg01							= true;
		Row objRow								= XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);
		Cell objCell							= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
		XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("rownumbers"));
		XtrmExcelUtil.setCellType(objCell, CellType.STRING);
		XtrmExcelUtil.writeCell(objCell, String.valueOf(this.intCount));
		this.intCurrentCellIdx++;
		for (int i = 0; i < this.objColumnModel.size(); i++) {
			arg01								= true;
			objColModelJson						= (ObjectNode) this.objColumnModel.get(i);
			strKey								= objColModelJson.path("name").asText();
			strFormat							= objColModelJson.path("format").asText();
			if (objJsonRowData.has(strKey)) {
				strValue						= objJsonRowData.get(strKey).isNull() ? "" : objJsonRowData.path(objColModelJson.path("name").asText()).asText();
				if ("xuiform_datetime".equals(strFormat)) {
					strValue					= XtrmCmmnUtil.getNumberText(strValue);
					if (strValue.length() == 12) {
						arg01					= false;
					}
				} else if ("xuiform_time".equals(strFormat)) {
					strValue					= XtrmCmmnUtil.getNumberText(strValue);
					if (strValue.length() == 4) {
						arg01					= false;
					}
				}
				strValue						= XtrmExcelUtil.getFormatData(strFormat, strValue, arg01, false, null);
				strAlign						= objColModelJson.path("align").asText();
				blnExcel						= objColModelJson.path("excel").asBoolean();
				if (blnExcel == true) {
					objCell						= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
					if ("left".equals(strAlign)) {
						XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("body_left"));
					} else if ("right".equals(strAlign)) {
						XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("body_right"));
					} else if ("center".equals(strAlign)) {
						XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("body_center"));
					}
					if ("xuiform_number".equals(strFormat)) {
						strValue = XtrmCmmnUtil.restoreXSSConst(strValue);
						strValue = strValue.replaceAll(",", "");
						int intValue = 0;
						if (XtrmCmmnUtil.isNumeric(strValue)) {
							intValue = XtrmCmmnUtil.convertInteger(strValue, 0);
						}
						XtrmExcelUtil.writeCell(objCell, intValue);
					} else if ("xuiform_decimal".equals(strFormat)) {
						strValue = XtrmCmmnUtil.restoreXSSConst(strValue);
						strValue = strValue.replaceAll(",", "");
						Object objValue = strValue;
						Double dleValue = 0.0;
						dleValue = XtrmCmmnUtil.convertDouble(objValue, 0.0);
						XtrmExcelUtil.writeCell(objCell, dleValue);
					} else {
						XtrmExcelUtil.writeCell(objCell, XtrmCmmnUtil.restoreXSSConst(strValue));
					}
					this.intCurrentCellIdx++;
				}
			}
		}
		this.intCurrentCellIdx					= this.intStartCellIdx;
		this.intCurrentRowIdx++;
	}

	private void createFooter(ObjectNode objJsonRowData) {
		ObjectNode objColModelJson				= MAPPER.createObjectNode();
		String strKey							= "";
		String strValue							= "";
		boolean blnExcel						= true;
		Row objRow								= XtrmExcelUtil.createRow(this.objSheet, this.intCurrentRowIdx);
		Cell objCell							= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
		XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("footer"));
		XtrmExcelUtil.setCellType(objCell, CellType.STRING);
		XtrmExcelUtil.setRowHeight(objRow, 20);
		this.intCurrentCellIdx++;
		for (int i = 0; i < this.objColumnModel.size(); i++) {
			objColModelJson						= (ObjectNode) this.objColumnModel.get(i);
			strKey								= objColModelJson.path("name").asText();
			if (objJsonRowData.has(strKey)) {
				strValue						= objJsonRowData.get(strKey).isNull() ? "" : objJsonRowData.path(objColModelJson.path("name").asText()).asText();
				blnExcel						= objColModelJson.path("excel").asBoolean();
				if (blnExcel == true) {
					objCell						= XtrmExcelUtil.createCell(objRow, this.intCurrentCellIdx);
					XtrmExcelUtil.setCellType(objCell, CellType.STRING);
					XtrmExcelUtil.setCellStyle(objCell, XtrmExcelUtil.DEFAULT_EXCEL_STYLE.get("footer"));
					XtrmExcelUtil.writeCell(objCell, XtrmCmmnUtil.restoreXSSConst(strValue));
					this.intCurrentCellIdx++;
				}
			}
		}
		XtrmExcelUtil.writeCell(objRow.getCell(this.intStartCellIdx), XtrmExcelUtil.getCellString(objRow.getCell(this.intStartCellIdx + 1)));
		this.intCurrentCellIdx					= this.intStartCellIdx;
	}

	private void adjustFooterCell() {
		if (this.objFooterData != null) {
			createFooter(this.objFooterData);
			List<Integer> colspanInfo			= MAPPER.convertValue(objFooterInfo.get(0).path("footerColspan"), new TypeReference<List<Integer>>() {});
			if (colspanInfo.size() > 0) {
				int colspan						= 1;
				for (int j = 0; j < colspanInfo.size(); j++) {
					colspan						= colspanInfo.get(j);
					if (colspan > 1) {
						XtrmExcelUtil.mergeCell(this.objSheet, this.intCurrentRowIdx, this.intCurrentRowIdx, (j + 1), (j + 1 + colspan - 1));
						j						= j + colspan;
					}
				}
			}
		}
	}
}
