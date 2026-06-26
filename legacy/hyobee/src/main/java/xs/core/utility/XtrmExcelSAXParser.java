package xs.core.utility;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.apache.poi.ooxml.util.SAXHelper;
import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStrings;
import org.xml.sax.ContentHandler;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import xs.core.handler.excel.XtrmXSSFSheetHandler;
import xs.core.dto.ApiEnvelope;

import java.io.File;
import java.io.InputStream;
import java.util.Iterator;

public class XtrmExcelSAXParser {

	private static final ObjectMapper MAPPER = new ObjectMapper();

	private OPCPackage objOpcPackage;

	private int intColumnRowIdx;

	private ArrayNode objExcelData;

	public XtrmExcelSAXParser(File objFile, int intColumnRowIdx) throws Exception {
		this.objOpcPackage				= OPCPackage.open(objFile);
		this.intColumnRowIdx			= intColumnRowIdx;
		this.objExcelData				= MAPPER.createArrayNode();
	}

	public ApiEnvelope parseExcel() throws Exception {
		ApiEnvelope objXtrmReturn		= new ApiEnvelope();
		try {
			XSSFReader objReader			= new XSSFReader(this.objOpcPackage);
			SharedStrings objSst			= objReader.getSharedStringsTable();
			XMLReader objParser				= fetchSheetParser(objSst);
			Iterator<InputStream> objSheets = objReader.getSheetsData();
			while(objSheets.hasNext()){
				try (InputStream objSheet = objSheets.next()) {
					InputSource objSheetSource	= new InputSource(objSheet);
					objParser.parse(objSheetSource);
				}
			}
		} finally {
			this.objOpcPackage.close();
		}
		objXtrmReturn.setDataArrayNode(this.objExcelData);
		objXtrmReturn.setHeader("COUNT"		,this.objExcelData.size());
		objXtrmReturn.setHeader("TOT_COUNT"	,this.objExcelData.size());
		return objXtrmReturn;
	}

	private XMLReader fetchSheetParser(SharedStrings objSst) throws Exception {
		XMLReader objParser				= SAXHelper.newXMLReader();
		ContentHandler objHandler		= new XtrmXSSFSheetHandler(objSst, this.intColumnRowIdx, this.objExcelData);
		objParser.setContentHandler(objHandler);
		return objParser;
	}
}
