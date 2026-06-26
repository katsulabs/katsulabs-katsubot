package xs.core.utility.extend;

import java.io.IOException;
import java.nio.file.FileVisitResult;
import java.nio.file.FileVisitor;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtil;

public class XtrmFileExplorer implements FileVisitor<Path> {

	private ArrayNode objFileDataArray					= null;
	private int intMinusCnt								= -1;
	private List<String> objValidFileExtensionList		= null;
	private int intValidMaxDept							= 30;

	public ApiEnvelope fileVisitor(String strStartDirPath, List<String> objValidFileExtensionList, boolean blnOnlyChild) throws Exception {
		ApiEnvelope objXtrmReturn						= new ApiEnvelope();
		this.objValidFileExtensionList					= objValidFileExtensionList;
		String[] objDirectoryList						= new String[]{};
		if(blnOnlyChild){
			if(strStartDirPath.indexOf("\\\\") >= 0){
				objDirectoryList						= strStartDirPath.split("\\\\\\\\");
			}else if(strStartDirPath.indexOf("\\") >= 0){
				objDirectoryList						= strStartDirPath.split("\\\\");
			}else{
				objDirectoryList						= strStartDirPath.split("/");
			}
			this.intValidMaxDept						= objDirectoryList.length;
		}
		try{
			if(this.objFileDataArray == null){
				this.objFileDataArray					= JsonNodeFactory.instance.arrayNode();
			}
			Path objStartPath							= Paths.get(strStartDirPath);
			Files.walkFileTree(objStartPath, this);
			objXtrmReturn.setDataArrayNode(this.objFileDataArray);
		}catch(Exception e){
			objXtrmReturn.setResultHeader(true			, e.getMessage());
		}finally{
			this.objFileDataArray						= null;
			this.objValidFileExtensionList				= null;
			this.intMinusCnt							= -1;
			this.intValidMaxDept						= 30;
		}
		return objXtrmReturn;
	}

	@Override
	public FileVisitResult postVisitDirectory(Path path, IOException ioe) throws IOException {
		return FileVisitResult.CONTINUE;
	}

	@Override
	public FileVisitResult preVisitDirectory(Path path, BasicFileAttributes attr) throws IOException {
		FileVisitResult returnValue						= FileVisitResult.CONTINUE;
		if(this.intValidMaxDept >= path.getNameCount()){
			String strFileName							= new String();
			String strFilePath							= new String();
			if(path.getFileName() != null){
				strFileName								= path.getFileName().toString();
			}else{
				strFileName								= path.toString();
			}
			strFileName									= strFileName.replace("\\", "/");
			strFilePath									= path.toString().replace("\\", "/");
			if(this.intMinusCnt == -1){
				this.intMinusCnt						= path.getNameCount() - 1;
			}
			ObjectNode objJson							= JsonNodeFactory.instance.objectNode();
			boolean isDirectory							= attr.isDirectory();
			objJson.put("nodeId"						, strFilePath);
			if(path.getParent() != null){
				objJson.put("parentNodeId"				, path.getParent().toString().replace("\\", "/"));
			}else{
				objJson.put("parentNodeId"				, "");
			}
			objJson.put("nodeTitle"						, strFileName);
			objJson.put("nodeLevel"						, path.getNameCount() - this.intMinusCnt);
			objJson.put("toolTip"						, strFileName);
			objJson.put("fileKey"						, strFilePath);
			objJson.put("filePath"						, strFilePath);
			objJson.put("fileName"						, strFileName);
			objJson.put("fileType"						, isDirectory ? "D" : "F");
			objJson.put("fileSize"						, attr.size());
			objJson.put("fileSizeHuman"					, convertFileSizeHumanReadable(attr.size(), false));
			objJson.put("fileExtension"					, "");
			objJson.put("createDt"						, XtrmCmmnUtil.getFormatDateTime(new Date(attr.creationTime().toMillis())));
			objJson.put("updateDt"						, XtrmCmmnUtil.getFormatDateTime(new Date(attr.lastModifiedTime().toMillis())));
			objJson.put("accessDt"						, XtrmCmmnUtil.getFormatDateTime(new Date(attr.lastAccessTime().toMillis())));
			this.objFileDataArray.add(objJson);
		}else{
			returnValue									= FileVisitResult.SKIP_SIBLINGS;
		}
		return returnValue;
	}

	@Override
	public FileVisitResult visitFile(Path path, BasicFileAttributes attr) throws IOException {
		FileVisitResult returnValue						= FileVisitResult.CONTINUE;
		if(this.intValidMaxDept >= path.getNameCount()){
			String strFileName							= new String();
			String strFilePath							= new String();
			if(path.getFileName() != null){
				strFileName								= path.getFileName().toString();
			}else{
				strFileName								= path.toString();
			}
			strFileName									= strFileName.replace("\\", "/");
			strFilePath									= path.toString().replace("\\", "/");
			String strFileExtension						= strFileName.substring(strFileName.lastIndexOf(".") + 1);
			if("*".equals(objValidFileExtensionList.get(0)) || this.objValidFileExtensionList.contains(strFileExtension)){
				if(this.intMinusCnt == -1){
					this.intMinusCnt					= path.getNameCount() - 1;
				}
				ObjectNode objJson						= JsonNodeFactory.instance.objectNode();
				boolean isDirectory						= attr.isDirectory();
				objJson.put("nodeId"					, strFilePath);
				objJson.put("nodeId"					, strFilePath);
				if(path.getParent() != null){
					objJson.put("parentNodeId"			, path.getParent().toString().replace("\\", "/"));
				}else{
					objJson.put("parentNodeId"			, "");
				}
				objJson.put("nodeTitle"					, strFileName);
				objJson.put("nodeLevel"					, path.getNameCount() - this.intMinusCnt);
				objJson.put("toolTip"					, strFileName);
				objJson.put("fileKey"					, strFilePath);
				objJson.put("filePath"					, strFilePath);
				objJson.put("fileName"					, strFileName);
				objJson.put("fileType"					, isDirectory ? "D" : "F");
				objJson.put("fileSize"					, attr.size());
				objJson.put("fileSizeHuman"				, convertFileSizeHumanReadable(attr.size(), false));
				objJson.put("fileExtension"				, strFileExtension);
				objJson.put("createDt"					, XtrmCmmnUtil.getFormatDateTime(new Date(attr.creationTime().toMillis())));
				objJson.put("updateDt"					, XtrmCmmnUtil.getFormatDateTime(new Date(attr.lastModifiedTime().toMillis())));
				objJson.put("accessDt"					, XtrmCmmnUtil.getFormatDateTime(new Date(attr.lastAccessTime().toMillis())));
				this.objFileDataArray.add(objJson);
			}
		}else{
			returnValue									= FileVisitResult.SKIP_SIBLINGS;
		}
		return returnValue;
	}

	@Override
	public FileVisitResult visitFileFailed(Path path, IOException ioe) throws IOException {
		return FileVisitResult.CONTINUE;
	}

	private static String convertFileSizeHumanReadable(long longFileSize, boolean blnSi) {
		String strReturnValue							= new String();
		int intPower									= blnSi ? 1000 : 1024;
		if(longFileSize < intPower){
			strReturnValue								= String.valueOf(longFileSize) + "B";
		}else{
			int intExp									= (int)(Math.log(longFileSize) / Math.log(intPower));
			String strPre								= "KMGTPEZY".charAt(intExp-1) + "";
			strReturnValue								= String.format("%.2f %sB", longFileSize / Math.pow(intPower, intExp), strPre);
		}
		return strReturnValue;
	}
}
