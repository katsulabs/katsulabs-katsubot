package xs.core.handler.excel;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.poi.xssf.model.SharedStrings;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.util.ArrayList;
import java.util.List;

public class XtrmXSSFSheetHandler extends DefaultHandler {

	private SharedStrings objSst;
	private String strLastContents;
	private boolean blnNextIsString;
	private int intColumnRowIdx;
	private int intRowIdx;
	private int intColumnIdx;
	private List<String> objColumnList;
	private ArrayNode objExcelData;
	private ObjectNode objRowData;

	public XtrmXSSFSheetHandler(SharedStrings objSst, int intColumnRowIdx, ArrayNode objData) {
		this.objSst				= objSst;
		this.intColumnRowIdx	= intColumnRowIdx;
		this.intRowIdx			= 0;
		this.intColumnIdx		= 0;
		this.objColumnList		= new ArrayList<>();
		this.objExcelData		= objData;
		this.objRowData			= JsonNodeFactory.instance.objectNode();
	}

	@Override
	public void startElement(String strURI, String strLocalName, String strQName, Attributes objAttribute) throws SAXException {
		if ("c".equals(strQName)) {
			String strCellType	= objAttribute.getValue("t");
			if (strCellType != null && "s".equals(strCellType)) {
				this.blnNextIsString = true;
			}else{
				this.blnNextIsString = false;
			}
		}
		this.strLastContents = "";
	}

	@Override
	public void endElement(String strURI, String strLocalName, String strQName) throws SAXException {
		if (this.blnNextIsString) {
			int intIdx				= Integer.parseInt(this.strLastContents);
			this.strLastContents	= this.objSst.getItemAt(intIdx).getString();
			this.blnNextIsString	= false;
		}
		if ("c".equals(strQName)) {
			if (this.intRowIdx == this.intColumnRowIdx) {
				this.objColumnList.add(this.strLastContents);
			}else if (this.intRowIdx > this.intColumnRowIdx) {
				this.objRowData.put(this.objColumnList.get(this.intColumnIdx), this.strLastContents);
				this.intColumnIdx++;
			}
		}
		if ("row".equals(strQName)) {
			if (this.intRowIdx > this.intColumnRowIdx && !this.objRowData.isEmpty()) {
				this.objExcelData.add(this.objRowData);
				this.objRowData = JsonNodeFactory.instance.objectNode();
			}
			this.intRowIdx++;
			this.intColumnIdx = 0;
		}
	}

	@Override
	public void characters(char[] objChar, int intStart, int intLength) throws SAXException {
		this.strLastContents += new String(objChar, intStart, intLength);
	}

}
