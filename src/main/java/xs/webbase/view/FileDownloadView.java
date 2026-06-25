package xs.webbase.view;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
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
import xs.core.utility.XtrmCmmnUtil;
import xs.core.utility.XtrmNIOFileUtil;

@Slf4j
public class FileDownloadView extends AbstractView {

	public FileDownloadView() {
		setContentType("application/download; charset=UTF-8");
	}

	private void setDownloadFileName(String filename, HttpServletRequest request, HttpServletResponse response) throws UnsupportedEncodingException{

		// 20220624 오승현 XSS 적용에 따른 파일명의 세미콜론 영향으로 텍스트 잘림 현상을 방지하기 위해 restoreXSSConst 한다.
		filename =  XtrmCmmnUtil.restoreXSSConst(filename);

		String strUserAgent					= request.getHeader("User-Agent");
		if(strUserAgent.indexOf("MSIE 5.5") >= 0){
			response.setHeader("Content-Disposition", "filename=" + URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		}else if(strUserAgent.indexOf("MSIE") >= 0){
			response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		}else if(strUserAgent.indexOf("Trident") >= 0){
			response.setHeader("Content-Disposition", "attachment; filename=" + URLEncoder.encode(filename, "UTF-8").replaceAll("\\+", "\\ ") + ";");
		}else{
			// 20220624 오승현 크롬 관련 브라우저에서 헤더 정보에 파일 속성의 파일 명을 쌍따옴표로 묶지 않은 경우, 쉼표에 의해서 잘리는 현상을 방지하기 위해 파일 속성을 쌍따옴표로 묶어야 한다.
			response.setHeader("Content-Disposition", "attachment; filename=\"" + new String(filename.getBytes("EUC-KR"), "latin1").replaceAll("\\+", "\\ ") + "\";");
		}
	}

	private void downloadFile(File file, HttpServletRequest request, HttpServletResponse response) throws Exception{
		OutputStream out					= response.getOutputStream();
		FileInputStream fis					= new FileInputStream(file);
		try{
			FileCopyUtils.copy(fis, out);
			out.flush();
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
			if(out != null){
				try{
					out.close();
				}catch(Exception ex){
					log.error("OUTPUT_STREAM.CLOSE ERROR", ex);
				}
			}
		}
	}

	@Override
	protected void renderMergedOutputModel(Map<String, Object> objMav, HttpServletRequest objRequest, HttpServletResponse objResponse) throws Exception {

		//DAO객체 및 파라미터 추출
		XtrmProperty objXtrmConfig			= (XtrmProperty)objMav.get("objXtrmConfig");
		XtrmDAOWeb objXtrmDao				= (XtrmDAOWeb)objMav.get("objXtrmDao");
		ApiEnvelope objXtrmParams				= (ApiEnvelope)objMav.get("objXtrmParams");

		//파일 다운로드 임시폴더 경로
		String strDownloadTempPath			= objXtrmConfig.getString("FILE_DOWNLOAD_TEMP_ROOT_PATH");

		//로그인 사용자 세션정보
		String strRequestUserId				= objXtrmParams.getString("sessionUserId", 0, "UNKNOWN");

		//예외 발생 시 해당 반환객체 생성
		ApiEnvelope objXtrmReturn				= new ApiEnvelope();
		objXtrmReturn.setResultHeader(false, XtrmEnum.PROCESS_SUCCESS.getCodeName());

		//다운로드 파일정보
		File objFile						= null;
		String strFileName					= objXtrmParams.getString("fileName", 0, "");

		List<String> fileGroupKeyList		= new ArrayList<>();
		List<String> fileKeyList			= new ArrayList<>();
		List<String> filePathInfoList		= new ArrayList<>();
		String fileGroupKey					= new String();
		String fileKey						= new String();
		String filePathInfo					= new String();
		String extAt						= new String();
		Boolean blnDoUpdate					= false;
		int size							= objXtrmParams.getCount();
		for(int i = 0; i < size; i++){
			fileGroupKey					= objXtrmParams.getString("fileGroupKey"	, i);
			fileKey							= objXtrmParams.getString("fileKey"			, i);
			filePathInfo					= objXtrmParams.getString("filePathInfo"	, i);
			extAt							= objXtrmParams.getString("extAt"			, i);
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
		ApiEnvelope objXtrmFileData			= new ApiEnvelope();
		if("".equals(extAt) || "N".equals(extAt)) {
			objXtrmFileData						= ApiEnvelopes.selectJson(objXtrmDao, "xs.core.api.ApiMapper", "getUploadFileGroupList", objXtrmParams);
		}else if("Y".equals(extAt)){
			objXtrmFileData						= ApiEnvelopes.selectJson(objXtrmDao, "xs.core.api.ApiMapper", "getUploadFileExtGroupList", objXtrmParams);
		}
		int intFileCount					= objXtrmFileData.getCount();
		File[] objDownFileList				= null;
		String[] objCurrentDate				= XtrmCmmnUtil.getFormatDate("/").split("/");
		strDownloadTempPath					= strDownloadTempPath + "/" + objCurrentDate[0] + "/" + objCurrentDate[1] + "/" + objCurrentDate[2] + "/" + strRequestUserId + "/" + XtrmNIOFileUtil.getSafetyFileName();

		//파일정보가 존재할 시
		if(intFileCount > 0){
			blnDoUpdate						= true;
			//다중 파일일 시(압축 후 일괄 내려받기)
			if(intFileCount > 1){
				for(int i = 0; i < intFileCount; i++){
					XtrmNIOFileUtil.copyFile(objXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmFileData.getString("filePathInfo", i), strDownloadTempPath + "/" + objXtrmFileData.getString("originalFileName", i));
				}
				objDownFileList				= new File(strDownloadTempPath).listFiles();
				if(objDownFileList != null && objDownFileList.length > 0){
					if("".equals(strFileName)){
						strFileName			= XtrmCmmnUtil.getFormatDateTimeMilli() + "_DOWNLOAD.zip";
					}else if(strFileName.lastIndexOf(".") > 0){
						strFileName			= strFileName.substring(0, strFileName.lastIndexOf(".") - 1) + ".zip";
					}else{
						strFileName			= strFileName + ".zip";
					}
					objFile					= new File(strDownloadTempPath + "/", strFileName);
					XtrmNIOFileUtil.zip(objDownFileList, new FileOutputStream(objFile));
				}
			//단일 파일일 시
			}else{
				objFile						= new File(objXtrmConfig.getString("FILE_UPLOAD_ROOT_PATH") + objXtrmFileData.getString("filePathInfo"));
				if("".equals(strFileName)){
					strFileName				= objXtrmFileData.getString("originalFileName");
				}
			}
		}else if(filePathInfoList.size() > 0){
			intFileCount					= filePathInfoList.size();
			if(intFileCount > 1){
				for(int i = 0; i < intFileCount; i++){
					strFileName				= filePathInfoList.get(i);
					if(XtrmNIOFileUtil.existFile(strFileName)){
						XtrmNIOFileUtil.copyFile(strFileName, strDownloadTempPath + "/" + strFileName.substring(strFileName.lastIndexOf("/") + 1));
					}
				}
				objDownFileList				= new File(strDownloadTempPath).listFiles();
				if(objDownFileList != null && objDownFileList.length > 0){
					//다중 파일일 시(압축 후 일괄 내려받기)
					if(objDownFileList.length > 1){
						if("".equals(strFileName)){
							strFileName		= XtrmCmmnUtil.getFormatDateTimeMilli() + "_DOWNLOAD.zip";
						}else if(strFileName.lastIndexOf(".") > 0){
							strFileName		= strFileName.substring(0, strFileName.lastIndexOf(".") - 1) + ".zip";
						}else{
							strFileName		= strFileName + ".zip";
						}
						objFile				= new File(strDownloadTempPath + "/", strFileName);
						XtrmNIOFileUtil.zip(objDownFileList, new FileOutputStream(objFile));
					//단일 파일일 시
					}else{
						objFile				= objDownFileList[0];
						if("".equals(strFileName)){
							strFileName		= XtrmNIOFileUtil.getFileInfo(objFile).getString("fileName");
						}
					}
				}
			}else{
				if(XtrmNIOFileUtil.existFile(filePathInfoList.get(0))){
					objFile					= new File(filePathInfoList.get(0));
					if("".equals(strFileName)){
						strFileName			= strFileName.replace("\\", "/").substring(strFileName.lastIndexOf("/") + 1);
					}
				}
			}
		}

		if(objFile == null || !objFile.isFile()){
			objXtrmReturn.setResultHeader(true, XtrmEnum.NONE_EXIST_FILE.getCodeName());
			objResponse.setCharacterEncoding(objXtrmConfig.getString("CHARACTER_SET"));
			objResponse.getWriter().print(objXtrmReturn.toString());
		}else{
			//공통 첨부파일 데이터 관련일 시 download 횟수 update처리
				if(blnDoUpdate){
				if("".equals(extAt) || "N".equals(extAt))
					ApiEnvelopes.update(objXtrmDao, "xs.core.api.ApiMapper", "updateFileDownloadCount", objXtrmParams);
				else if("Y".equals(extAt))
					ApiEnvelopes.update(objXtrmDao, "xs.core.api.ApiMapper", "updateFileExtDownloadCount", objXtrmParams);
			}
			this.setResponseContentType(objRequest, objResponse);
			this.setDownloadFileName(strFileName, objRequest, objResponse);
			objResponse.setContentLength((int)objFile.length());
			this.downloadFile(objFile, objRequest, objResponse);
		}
	}

	@Override
	public void render(Map<String, ?> objMav, HttpServletRequest objRequest, HttpServletResponse objResponse) throws Exception {
		super.render(objMav, objRequest, objResponse);
	}
}
