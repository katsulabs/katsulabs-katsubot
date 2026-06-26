package xs.webbase.view;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.util.FileCopyUtils;
import org.springframework.web.servlet.view.AbstractView;

import lombok.extern.slf4j.Slf4j;
import xs.core.database.XtrmDAOWeb;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.property.XtrmProperty;

@Slf4j
public class FileStreamView extends AbstractView {
	@Override
	protected void renderMergedOutputModel(Map<String, Object> objMav, HttpServletRequest objRequest, HttpServletResponse objResponse) throws Exception {

		//DAO객체 및 파라미터 추출
		XtrmProperty objXtrmConfig				= (XtrmProperty)objMav.get("objXtrmConfig");
		XtrmDAOWeb objXtrmDao					= (XtrmDAOWeb)objMav.get("objXtrmDao");
		ApiEnvelope objXtrmParams					= (ApiEnvelope)objMav.get("objXtrmParams");

		//예외 발생 시 해당 반환객체 생성
		ApiEnvelope objXtrmReturn					= new ApiEnvelope();
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());

		//다운로드 파일정보
		File objFile							= null;
		String strFileName						= new String();

		List<String> fileGroupKeyList			= new ArrayList<>();
		List<String> fileKeyList				= new ArrayList<>();
		List<String> filePathInfoList			= new ArrayList<>();
		String fileGroupKey						= new String();
		String fileKey							= new String();
		String filePathInfo						= new String();
		int size								= objXtrmParams.getCount();
		String extAt                   = "N";
		for(int i = 0; i < size; i++){
			fileGroupKey						= objXtrmParams.getString("fileGroupKey"	, i);
			fileKey								= objXtrmParams.getString("fileKey"			, i);
			filePathInfo						= objXtrmParams.getString("filePathInfo"	, i);
			extAt								= objXtrmParams.getString("extAt"		, i);
			if(!"".equals(fileGroupKey) && fileGroupKeyList.indexOf(fileGroupKey) < 0){
				fileGroupKeyList.add(fileGroupKey);
			}
			if(!"".equals(fileKey) && fileKeyList.indexOf(fileKey) < 0){
				fileKeyList.add(fileKey);
			}
			if(!"".equals(filePathInfo) && filePathInfoList.indexOf(filePathInfo) < 0){
				filePathInfoList.add(filePathInfo);
			}
		}
		objXtrmParams.setObject("fileGroupKeyList"	, fileGroupKeyList);
		objXtrmParams.setObject("fileKeyList"		, fileKeyList);
		objXtrmParams.setObject("filePathInfoList"	, filePathInfoList);

		//DB에 저장되어있는 파일정보 조회
		ApiEnvelope objXtrmFileData				= new ApiEnvelope();
		if(extAt.equals("Y")) {
			objXtrmFileData						= ApiEnvelopes.selectJson(objXtrmDao, "xs.core.api.ApiMapper", "getUploadFileExtGroupList", objXtrmParams);
		} else {
			objXtrmFileData						= ApiEnvelopes.selectJson(objXtrmDao, "xs.core.api.ApiMapper", "getUploadFileGroupList", objXtrmParams);
		}

		int intFileCount						= objXtrmFileData.getCount();

		//파일정보가 존재할 시
		if(intFileCount > 0){
			objFile								= new File(objXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmFileData.getString("filePathInfo"));
			strFileName							= objXtrmFileData.getString("originalFileSubject");
		}else if(filePathInfoList.size() > 0){
			objFile								= new File(filePathInfoList.get(0));
			if(objFile.isFile()){
				strFileName						= filePathInfoList.get(0);
				strFileName						= strFileName.replace("\\", "/").substring(strFileName.lastIndexOf("/") + 1);
			}
		}

		if(objFile == null || !objFile.isFile()) {
			objXtrmReturn.setResultHeader(true, XtrmEnum.NONE_EXIST_FILE.getCodeName());
			objResponse.setCharacterEncoding(objXtrmConfig.getString("CHARACTER_SET"));
			objResponse.getWriter().print(objXtrmReturn.toString());
		}else{
			setContentType("application/octet-stream; charset=UTF-8");
			objResponse.setContentType(getContentType());
			objResponse.setContentLength((int)objFile.length());
			objResponse.setHeader("Accept-Ranges", "bytes");
			String strUserAgent					= objRequest.getHeader("User-Agent");
			if(strUserAgent.indexOf("MSIE 5.5") >= 0){
				objResponse.setHeader("Content-Disposition", "filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
			}else if(strUserAgent.indexOf("MSIE") >= 0){
				objResponse.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
			}else if(strUserAgent.indexOf("Trident") >= 0){
				objResponse.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(strFileName, "UTF-8").replaceAll("\\+", "\\ ") + ";");
			}else{
				objResponse.setHeader("Content-Disposition", "attachment; filename=" + new String(strFileName.getBytes("EUC-KR"), "latin1").replaceAll("\\+", "\\ ") + ";");
			}
			OutputStream out					= objResponse.getOutputStream();
			FileInputStream fis					= null;
			try{
				fis								= new FileInputStream(objFile);
				FileCopyUtils.copy(fis, out);
			}catch(Exception e){
				log.error("FILE_COPY_UTILS.COPY ERROR", e);
			}finally{
				if(fis != null){
					try{
						fis.close();
					}catch(Exception ex){
						log.error("FILE_INPUT_STREAM.CLOSE ERROR", ex);
					}
				}
				out.flush();
			}
		}
	}

	@Override
	public void render(Map<String, ?> objMav, HttpServletRequest objRequest, HttpServletResponse objResponse) throws Exception {
		super.render(objMav, objRequest, objResponse);
	}
}
