package xs.core.view;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.web.servlet.view.document.AbstractXlsxStreamingView;

import com.fasterxml.jackson.databind.node.ArrayNode;

import xs.core.database.XtrmDAO;
import xs.core.handler.excel.XtrmExportExcelResultHandler;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmExcelUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

public class XtrmExcelExportView extends AbstractXlsxStreamingView {

	@Override
	protected SXSSFWorkbook createWorkbook(Map<String, Object> objMav, HttpServletRequest objRequest) {
		return (SXSSFWorkbook) XtrmExcelUtil.createWorkbook(XtrmExcelUtil.EXCELTYPE_SXSSF);
	}

	@Override
	protected void buildExcelDocument(Map<String, Object> objMav, Workbook objWorkbook, HttpServletRequest objRequest, HttpServletResponse objResponse) throws Exception {
		XtrmDAO objXtrmDao = (XtrmDAO) objMav.get("objXtrmDao");
		ApiEnvelope objXtrmParams = (ApiEnvelope) objMav.get("objXtrmParams");
		String strFileName = XtrmCmmnUtil.restoreXSSConst((String) objMav.get("filename")) + ".xlsx";
		String strTitle = XtrmCmmnUtil.restoreXSSConst(objXtrmParams.getString("title"));
		String strSubTitle = XtrmCmmnUtil.restoreXSSConst(objXtrmParams.getString("subTitle"));
		String strColNames = objXtrmParams.getString("COL_NAMES");
		ArrayNode objColModel = objXtrmParams.getDataArrayNode("COL_MODEL");
		ArrayNode objGridData = objXtrmParams.getDataArrayNode("GRID_DATA");
		ArrayNode objFooterInfo = null;
		if (objXtrmParams.isExistGroupKey("FOOTER_INFO")) {
			objFooterInfo = objXtrmParams.getDataArrayNode("FOOTER_INFO");
		}
		XtrmExportExcelResultHandler objHandler = new XtrmExportExcelResultHandler(objWorkbook, strColNames, objColModel,
				objGridData, objFooterInfo, strTitle, strSubTitle,
				objXtrmParams.getInt("rowIdx", 0, 0), objXtrmParams.getInt("cellIdx", 0, 0),
				objXtrmParams.getBoolean("excelVisibleKey"));
		if (objGridData == null) {
			ApiEnvelopes.selectJson(objXtrmDao, objXtrmParams.getString("sqlNameSpace"), objXtrmParams.getString("sqlId"),
					objXtrmParams, objXtrmParams.getString("connPoolName"), objHandler);
		}
		objResponse.setContentType("application/msexcel");
		String strUserAgent = objRequest.getHeader("User-Agent");
		if (strUserAgent.indexOf("MSIE 5.5") >= 0) {
			objResponse.setHeader("Content-Disposition", "filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		} else if (strUserAgent.indexOf("MSIE") >= 0) {
			objResponse.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		} else if (strUserAgent.indexOf("Trident") >= 0) {
			objResponse.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		} else {
			objResponse.setHeader("Content-Disposition", "attachment; filename=" + new String(strFileName.getBytes("EUC-KR"), "latin1").replaceAll("\\+", "\\ ") + ";");
		}
	}

	@Override
	protected void renderWorkbook(Workbook objWorkbook, HttpServletResponse objResponse) throws IOException {
		super.renderWorkbook(objWorkbook, objResponse);
		((SXSSFWorkbook) objWorkbook).dispose();
		objWorkbook.close();
		objResponse.setHeader("Set-Cookie", "downloadFileToken=true; Secure; path=/");
	}
}
