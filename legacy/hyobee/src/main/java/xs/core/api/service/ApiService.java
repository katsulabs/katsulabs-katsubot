package xs.core.api.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import xs.core.dto.ApiEnvelope;
import xs.vob.management.dto.ComUser;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

public interface ApiService {

	//****** API 공통 관련 인터페이스  ************************************************************************//
	public ApiEnvelope sessionSwitch(ApiEnvelope objXtrmParams, HttpServletRequest objRequest, HttpSession objSession) throws Exception;
	public void createSessionAndUpdate(ComUser objUser, HttpServletRequest objRequest) throws Exception;
	public void createSessionAndUpdate(ComUser objUser, HttpServletRequest objRequest, ApiEnvelope objXtrmParams) throws Exception;
	//****** API 공통 관련 인터페이스  ************************************************************************//

	//****** API 관리  ************************************************************************//
	//기 존재 세션 정보 반환
	public ApiEnvelope getAlreadySessionData(HttpSession session, ApiEnvelope objXtrmParams) throws Exception;
	//client페이지 로드 시점에 필수 전역데이터 및 코드데이터 정보, 기타 세션정보 등을 조회하여 반환.
	public ApiEnvelope initClientPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	//login페이지 로드 시점에 필수 전역데이터 로드(다국어 메시지 정보)
	public ApiEnvelope initLoginPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	// Hyobee aichat·로그인 전용 — com_message_lang만 조회(VIEW_COM_CODE 등 VOB 뷰 불필요)
	public ApiEnvelope initAichatPageLoad(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	//공통코드 데이터 반환
	public ApiEnvelope getCmmnCodeData(ApiEnvelope objXtrmParams) throws Exception;
	//시스템코드 데이터 반환
	public ApiEnvelope getSysCodeData(ApiEnvelope objXtrmParams) throws Exception;
	//계산된 날짜 데이터셋 반환
	public ApiEnvelope getPatternDateData(ApiEnvelope objXtrmParams) throws Exception;
	//공통코드 데이터 반환
	public ApiEnvelope getCmmnCodeDataByGroupCodeList(ApiEnvelope objXtrmParams) throws Exception;
	//접속한 사용자의 권한정보에 따른 인가된 메뉴 데이터 반환
	public ApiEnvelope getAuthMenuData(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	//사용자 즐겨찾기 메뉴 등록 및 삭제
	public ApiEnvelope saveUserBookmarkMenu(ApiEnvelope objXtrmParams) throws Exception;
	//사용자 즐겨찾기 메뉴 순서 변경
	public ApiEnvelope updateUserBookmarkMenu(ApiEnvelope objXtrmParams) throws Exception;
	//환경설정정보의 특정 키 값을 반환.
	public ApiEnvelope getProperty(ApiEnvelope objXtrmParams);
	//현재 서버 일시 반환
	public ApiEnvelope getDateTimeNow();
	//특정일의 마지막 일 반환
	public ApiEnvelope getLastDayOfMonth(ApiEnvelope objXtrmParams);
	//날짜 및 시간의 차이 정보를 반환.
	public ApiEnvelope getDateTimeDiff(ApiEnvelope objXtrmParams);
	//특정 날짜 및 시간 기준으로 계산하고자 하는 차이만큼 가감된 날짜 및 시간 정보를 반환.
	public ApiEnvelope getAddDate(ApiEnvelope objXtrmParams);
	//세션정보의 특정 속성정보의 값을 반환.
	public ApiEnvelope getSessionInfo(ApiEnvelope objXtrmParams, HttpServletRequest objRequest);
	public String getSessionInfo(String strAttributeKey);
	//DB의 Sequence를 이용한 Unique Key정보 생성 및 반환
	public ApiEnvelope getUniqueKey() throws Exception;
	//그리드 데이터 엑셀파일 내려받기
	public ModelAndView exportExcelGridData(ApiEnvelope objXtrmPararms) throws Exception;
	//엑셀 데이터 그리드 변환
	public ApiEnvelope importExcelGridData(ApiEnvelope objXtrmPararms) throws Exception;
	//텍스트파일로드
	public ApiEnvelope readTextFile(ApiEnvelope objXtrmParams) throws Exception;

	//파일정보 조회
	public ApiEnvelope getUploadedFileData(ApiEnvelope objXtrmParams) throws Exception;
	//파일업로드
	public ApiEnvelope uploadFile(List<MultipartFile> objFileList, ApiEnvelope objXtrmParams) throws Exception;
	//파일다운로드
	public ModelAndView downloadFile(ApiEnvelope objXtrmParams) throws Exception;
	//파일삭제
	public ApiEnvelope deleteFile(ApiEnvelope objXtrmParams) throws Exception;
	//파일 stream servlet view
	public ModelAndView getFileStream(ApiEnvelope objXtrmParams) throws Exception;
	
	//파일EXT정보 조회
	public ApiEnvelope getUploadedFileExtData(ApiEnvelope objXtrmParams) throws Exception;
	//파일EXT임시업로드(상태 T)
	public ApiEnvelope tempUploadFileExt(List<MultipartFile> objFileList, ApiEnvelope objXtrmParams) throws Exception;
	//파일EXT업로드
	public ApiEnvelope uploadFileExt(ApiEnvelope objXtrmParams) throws Exception;
	//파일EXT다운로드
//	public ModelAndView downloadFile(ApiEnvelope objXtrmParams) throws Exception;
	//파일EXT상태를 삭제(D)로 업데이트
	public ApiEnvelope tempDeleteFileExt(ApiEnvelope objXtrmParams) throws Exception;
	//파일의 상태 업데이트
	public ApiEnvelope updateFileStatusExt(ApiEnvelope objXtrmParams) throws Exception;
//	//파일EXT삭제
	public ApiEnvelope deleteFileExt(ApiEnvelope objXtrmParams) throws Exception;
//	//파일EXT stream servlet view
//	public ModelAndView getFileStream(ApiEnvelope objXtrmParams) throws Exception;
	
	//조직정보 조회
	public ApiEnvelope selectDeptData(ApiEnvelope objXtrmParams) throws Exception;
	//사용자정보 조회
	public ApiEnvelope selectUserData(ApiEnvelope objXtrmParams) throws Exception;
	// 고객정보 조회
	public ApiEnvelope selectCustomerData(ApiEnvelope objXtrmParams) throws Exception;
	// 팀정보 조회
	public ApiEnvelope selectTeamData(ApiEnvelope objXtrmParams) throws Exception;
	//RabbitMQ의 큐 정보를 생성한다.
	public ApiEnvelope declareRMQ(ApiEnvelope objXtrmParams, HttpSession objSession) throws Exception;
	//RabbitMQ의 큐 정보를 삭제한다.
	public ApiEnvelope deleteRMQ(ApiEnvelope objXtrmParams) throws Exception;
	//RabbitMQ의 큐 정보를 삭제한다.
	public ApiEnvelope offerDataRMQ(ApiEnvelope objXtrmParams) throws Exception;
	//CLOB 파일 데이터 읽기
	public ApiEnvelope readClobFile(ApiEnvelope objXtrmParams) throws Exception;
	//녹취파일 데이터 읽기
	public ModelAndView readRecordFile(ApiEnvelope objXtrmParams) throws Exception;

	//Pu Combo List 조회
	public ApiEnvelope selectPuPgInfo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPuPgMarketingInfo(ApiEnvelope objXtrmParams) throws Exception;

	// Pu Code에 해당하는 Combo List 조회
	// Category, CorpCode List
	public ApiEnvelope selectSearchCombo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectSearchComboMarketing(ApiEnvelope objXtrmParams) throws Exception;
	// Management 화면 내 Combo 목록을 조회
	public ApiEnvelope selectManagementCombo(ApiEnvelope objXtrmParams) throws Exception;
	//다국어 데이터 반환
	public ApiEnvelope getMessageData(ApiEnvelope objXtrmParams) throws Exception;

	// Domain에 따른 CompanyCode 조회
	String getCompanyCodeByDomain(ApiEnvelope objXtrmParam) throws Exception;
	//****** API 관리  ************************************************************************//
}
