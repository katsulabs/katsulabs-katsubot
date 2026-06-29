package xs.core.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import xs.core.api.service.ApiService;
import xs.core.handler.app.XtrmArgumentResolveMap;
import xs.core.dto.ApiEnvelope;
import xs.core.property.XtrmProperty;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RequestMapping("/xs/core/api")
@RestController
public class ApiController {

	/** Config Property Object */
	@Resource(name = "xtrmProperty")
	public XtrmProperty mobjXtrmConfig;

	@Autowired
	ApiService objXtrmService;

	//****** API 공통 관련 인터페이스  ************************************************************************//

	// 조회중인 회사를 변경한다. ( 세션 변경 방식 )
	@PostMapping(value = "sessionSwitch.json")
	public ApiEnvelope sessionSwitch(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.sessionSwitch(inRequestMap.getParams(), inRequestMap.getRequest(), inRequestMap.getSession());
	}

	//****** API 공통 관련 인터페이스  ************************************************************************//

	//****** API 관리  ************************************************************************//
	/**
	 * 특정 서버 에러 발생 시 공통 에러페이지 반환
	 */
	@PostMapping(value = "redirectErrorPage.json")
	public ModelAndView redirectErrorPage(XtrmArgumentResolveMap inRequestMap) throws Exception {
		HttpServletResponse response	= inRequestMap.getResponse();
		ApiEnvelope xtrmParams				= inRequestMap.getParams();
		xtrmParams.setResultHeader(false, xtrmParams.getString("errorMsg"), xtrmParams.getString("errorCode"));
		xtrmParams.setString("ERROR_MSG_SUB", xtrmParams.getString("errorMsgSub"));
//		response.setHeader("XTRM_ERROR_DATA", xtrmParams.toString());
		response.setHeader("XTRM_ERROR_DATA", URLEncoder.encode((xtrmParams.toString()), StandardCharsets.UTF_8));
		response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
//		ModelAndView mav				= new ModelAndView("/" + mobjXtrmConfig.getString("ERROR_PAGE_URL"));
//		ModelAndView mav				= new ModelAndView("redirect:/" + mobjXtrmConfig.getString("ERROR_PAGE_URL"));
		ModelAndView mav				= new ModelAndView("forward:/" + mobjXtrmConfig.getString("ERROR_PAGE_URL"));
		return mav;
	}


	/**
	 * groupCode리스트를 파라미터로 공통코드 조회한다.
	 */
	@PostMapping(value = "getCmmnCodeDataByGroupCodeList.json")
	public ApiEnvelope getCmmnCodeDataByGroupCodeList(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getCmmnCodeDataByGroupCodeList(inRequestMap.getParams());
	}


	/**
	 * 페이지 최초 로드 시 호출되는 함수(공통코드 조회, 패턴별 기준일자 조회, 기본 프로퍼티 값 조회, 페이지 권한정보 조회 등)
	 */
	@PostMapping(value = "initClientPageLoad.json")
	public ApiEnvelope initClientPageLoad(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.initClientPageLoad(inRequestMap.getParams(), inRequestMap.getSession());
	}

	/**
	 * 로그인 페이지 최초 로드 시 호출되는 함수(다국어 메시지 정보)
	 */
	@PostMapping(value = "initLoginPageLoad.json")
	public ApiEnvelope initLoginPageLoad(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.initLoginPageLoad(inRequestMap.getParams(), inRequestMap.getSession());
	}

	/**
	 * Hyobee aichat·로그인 — 다국어 메시지만 반환(VIEW_COM_CODE 등 VOB 전역 로드 생략)
	 */
	@PostMapping(value = "initAichatPageLoad.json")
	public ApiEnvelope initAichatPageLoad(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.initAichatPageLoad(inRequestMap.getParams(), inRequestMap.getSession());
	}

	/**
	 * 공통코드 데이터를 조회한다.
	 */
	@PostMapping(value = "getCmmnCodeData.json")
	public ApiEnvelope getCmmnCodeData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getCmmnCodeData(inRequestMap.getParams());
	}

	/**
	 * 시스템코드 데이터를 조회한다.
	 */
	@PostMapping(value = "getSysCodeData.json")
	public ApiEnvelope getSysCodeData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getSysCodeData(inRequestMap.getParams());
	}

	/**
	 * 계산된 날짜 데이터셋 조회
	 */
	@PostMapping(value = "getPatternDateData.json")
	public ApiEnvelope getPatternDateData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getPatternDateData(inRequestMap.getParams());
	}
	/**
	 * 접속한 사용자의 권한정보에 따른 인가된 메뉴 데이터 조회
	 */
	@PostMapping(value = "getAuthMenuData.json")
	public ApiEnvelope getAuthMenuData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getAuthMenuData(inRequestMap.getParams(), inRequestMap.getSession());
	}

	/**
	 * 사용자 즐겨찾기 메뉴 등록 및 추가
	 */
	@PostMapping(value = "saveUserBookmarkMenu.json")
	public ApiEnvelope saveUserBookmarkMenu(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.saveUserBookmarkMenu(inRequestMap.getParams());
	}

	/**
	 * 사용자 즐겨찾기 메뉴 순서 변경
	 */
	@PostMapping(value = "updateUserBookmarkMenu.json")
	public ApiEnvelope updateUserBookmarkMenu(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.updateUserBookmarkMenu(inRequestMap.getParams());
	}

	/**
	 * XtrmConfig.properties에 있는 특정 키의 값을 반환한다.
	 */
	@PostMapping(value = "getProperty.json")
	public ApiEnvelope getProperty(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getProperty(inRequestMap.getParams());
	}

	/**
	 * 서버 현재일시 정보를 반환한다.
	 */
	@PostMapping(value = "getDateTimeNow.json")
	public ApiEnvelope getDateTimeNow(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getDateTimeNow();
	}

	/**
	 * 특정월의 마지막일자를 반환한다.
	 */
	@PostMapping(value = "getLastDayOfMonth.json")
	public ApiEnvelope getLastDayOfMonth(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getLastDayOfMonth(inRequestMap.getParams());
	}

	
	/**
	 * 두 날짜(시간)사이의 계산 정보를 반환한다.
	 */
	@PostMapping(value = "getDateTimeDiff.json")
	public ApiEnvelope getDateTimeDiff(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getDateTimeDiff(inRequestMap.getParams());
	}

	/**
	 * 기준 시간에서 특정 일자(시간)만큼의 계산 정보를 반환한다.
	 */
	@PostMapping(value = "getAddDate.json")
	public ApiEnvelope getAddDate(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getAddDate(inRequestMap.getParams());
	}

	/**
	 * 특정 키의 세션 정보를 반환한다.
	 */
	@PostMapping(value = "getSessionInfo.json")
	public ApiEnvelope getSessionInfo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getSessionInfo(inRequestMap.getParams(), inRequestMap.getRequest());
	}

	/**
	 * DB Sequence를 이용한 Unique Key Generation
	 */
	@PostMapping(value = "getUniqueKey.json")
	public ApiEnvelope getUniqueKey(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getUniqueKey();
	}

	/**
	 * 그리드 데이터 엑셀 내려받기
	 */
	@PostMapping(value = "exportExcelGridData.json")
	public ModelAndView exportExcelGridData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.exportExcelGridData(inRequestMap.getParams());
	}

	/**
	 * 엑셀 데이터 그리드 변환
	 */
	@PostMapping(value = "importExcelGridData.json")
	public ApiEnvelope importExcelGridData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.importExcelGridData(inRequestMap.getParams());
	}

	/**
	 * 텍스트파일로드
	 */
	@RequestMapping(value="readTextFile.json" , method = {RequestMethod.GET, RequestMethod.POST})
	public ApiEnvelope readTextFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.readTextFile(inRequestMap.getParams());
	}

	/**
	 * 파일정보 조회
	 */
	@PostMapping(value = "getUploadedFileData.json")
	public ApiEnvelope getUploadedFileData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getUploadedFileData(inRequestMap.getParams());
	}

	/**
	 * 파일업로드
	 */
	@PostMapping(value = "uploadFile.json")
	public ApiEnvelope uploadFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.uploadFile(inRequestMap.getMultipart(), inRequestMap.getParams());
	}

	/**
	 * 파일다운로드
	 */
	@RequestMapping(value="downloadFile.json" , method = {RequestMethod.GET, RequestMethod.POST})
	public ModelAndView downloadFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.downloadFile(inRequestMap.getParams());
	}

	/**
	 * 파일삭제
	 */
	@PostMapping(value = "deleteFile.json")
	public ApiEnvelope deleteFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.deleteFile(inRequestMap.getParams());
	}

	/**
	 * 파일 stream servlet view
	 */
	@GetMapping(value = "getFileStream.json")
	public ModelAndView getFileStream(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getFileStream(inRequestMap.getParams());
	}
	
	/**
	 * 파일EXT정보 조회
	 */
	@PostMapping(value = "getUploadedFileExtData.json")
	public ApiEnvelope getUploadedFileExtData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getUploadedFileExtData(inRequestMap.getParams());
	}

	/**
	 * 파일EXT임시업로드(상태 T) 
	 */
	@PostMapping(value = "tempUploadFileExt.json")
	public ApiEnvelope tempUploadFileExt(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.tempUploadFileExt(inRequestMap.getMultipart(), inRequestMap.getParams());
	}
	/**
	 * 파일EXT업로드 
	 */
	@PostMapping(value = "uploadFileExt.json")
	public ApiEnvelope uploadFileExt(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.uploadFileExt(inRequestMap.getParams());
	}



	/**
	 * 파일EXT상태를 삭제(D)로 업데이트
	 */
	@PostMapping(value = "tempDeleteFileExt.json")
	public ApiEnvelope tempDeleteFileExt(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.tempDeleteFileExt(inRequestMap.getParams());
	}
	/**
	 * 파일상태 업데이트
	 */
	@PostMapping(value = "updateFileStatusExt.json")
	public ApiEnvelope updateFileStatusExt(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.updateFileStatusExt(inRequestMap.getParams());
	}
	/**
	 * 파일EXT삭제
	 */
	@PostMapping(value = "deleteFileExt.json")
	public ApiEnvelope deleteFileExt(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.deleteFileExt(inRequestMap.getParams());
	}

	/**
	 * 이미지  servlet view
	 */
	@RequestMapping(value = "getImageFile.json", method = {RequestMethod.GET, RequestMethod.POST})
	public void getImageFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		HttpServletResponse response	= inRequestMap.getResponse();
		ApiEnvelope xtrmParams				= inRequestMap.getParams();
		
		response.setContentType("image/gif");
		ServletOutputStream bout = response.getOutputStream();
		
		// ex) filePath = /data/xtrmKms/upload/20210818/bf68c17b-a713-46ca-b16e-6023592e0178.png
		// 로컬은 D:/Workspace/XS/Source/upload/20210818/bf68c17b-a713-46ca-b16e-6023592e0178.png 경로에 파일 존재
		// 로컬 테스트를 위해 "/" split
		String filePath[]	 = xtrmParams.getString("filePath").split("/");
		String imgPath		 = mobjXtrmConfig.getString("KMS_UPLOAD_FILE_PATH");	// /data/xtrmKms/upload
		String imgFileNm	 = filePath[filePath.length - 1];						// bf68c17b-a713-46ca-b16e-6023592e0178.png
		
		File f = new File(imgPath + "/" + filePath[filePath.length - 2] + "/" + imgFileNm);
		if(f.exists()) {
			FileInputStream input = new FileInputStream(imgPath + "/" + filePath[filePath.length - 2] + "/" + imgFileNm);
			int length;
			byte[] buffer = new byte[10];
			while((length = input.read( buffer )) != -1 ) {
				bout.write(buffer, 0, length);
			}
			
			input.close();
			bout.close();
		} else {
			// 파일이 없는 경우 체크하여 이후 로직 실행
		}
	}

	/**
	 * 조직정보 조회
	 */
	@PostMapping(value = "selectDeptData.json")
	public ApiEnvelope selectDeptData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectDeptData(inRequestMap.getParams());
	}

	/**
	 * 사용자정보 조회
	 */
	@PostMapping(value = "selectUserData.json")
	public ApiEnvelope selectUserData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectUserData(inRequestMap.getParams());
	}

	/**
	 * 고객정보 조회
	 */
	@PostMapping(value = "selectCustomerData.json")
	public ApiEnvelope selectCustomerData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectCustomerData(inRequestMap.getParams());
	}

	// 팀정보 조회
	@PostMapping(value = "selectTeamData.json")
	public ApiEnvelope selectTeamData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectTeamData(inRequestMap.getParams());
	}

	/**
	 * RabbitMQ를 통해 서버와 client간의 통신하기 위한 접속 User에 대한 큐 선언
	 */
	@PostMapping(value = "declareRMQ.json")
	public ApiEnvelope declareRMQ(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.declareRMQ(inRequestMap.getParams(), inRequestMap.getSession());
	}

	/**
	 * RabbitMQ 생성된 큐 삭제
	 */
	@PostMapping(value = "deleteRMQ.json")
	public ApiEnvelope deleteRMQ(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.deleteRMQ(inRequestMap.getParams());
	}

	/**
	 * RabbitMQ 큐 메시지 삽입
	 */
	@PostMapping(value = "offerDataRMQ.json")
	public ApiEnvelope offerDataRMQ(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.offerDataRMQ(inRequestMap.getParams());
	}
	/*
	@GetMapping(value = "readRecordFile.json")
	@ExcludeAspect
	public ModelAndView readRecordFile(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.readRecordFile(inRequestMap.getParams());
	}
	*/

	// Pu Combo List조회
	@PostMapping(value = "selectPuPgInfo.json")
	public ApiEnvelope selectPuPgInfo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectPuPgInfo(inRequestMap.getParams());
	}

	// (마케팅) Pu Combo List조회 (권한과 무관)
	@PostMapping(value = "selectPuPgMarketingInfo.json")
	public ApiEnvelope selectPuPgMarketingInfo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectPuPgMarketingInfo(inRequestMap.getParams());
	}

	// Pu Code에 해당하는 Combo List 조회
	// Category, CorpCode List
	@PostMapping(value = "selectSearchCombo.json")
	public ApiEnvelope selectSearchCombo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectSearchCombo(inRequestMap.getParams());
	}
	
	// (마케팅) Pu Code에 해당하는 Combo List 조회 (Category, CorpCode List, 권한과 무관)
	@PostMapping(value = "selectSearchComboMarketing.json")
	public ApiEnvelope selectSearchComboMarketing(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectSearchComboMarketing(inRequestMap.getParams());
	}

	// Management 화면 내 Combo 목록을 조회
	@PostMapping(value = "selectManagementCombo.json")
	public ApiEnvelope selectManagementCombo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.selectManagementCombo(inRequestMap.getParams());
	}

	// 공통에서 다국어 데이터를 조회한다.
	@PostMapping(value = "getMessageData.json")
	public ApiEnvelope getMessageData(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return objXtrmService.getMessageData(inRequestMap.getParams());
	}

	//****** API 관리  ************************************************************************//
}
