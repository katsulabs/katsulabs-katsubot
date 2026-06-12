package xs.vob.management.service;

import org.springframework.web.multipart.MultipartFile;
import xs.core.dto.ApiEnvelope;
import xs.vob.management.dto.ComMessage;

import java.util.List;

public interface ManagementService {

	//****** Oversea Pu 관리  ************************************************************************//
	public ApiEnvelope retrieveOverseaPuList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope retrieveOverseaPuUpdate(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope retrieveOverseaPuCodeList(ApiEnvelope objXtrmParams) throws Exception;
	//****** Oversea Pu 관리  ************************************************************************//

	//****** 공통 관련 인터페이스  ************************************************************************//
	public ApiEnvelope excelTemplateDownload(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectManagementCombo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectCorpComboByPu(ApiEnvelope objXtrmParams) throws Exception;
	//****** 공통 관련 인터페이스  ************************************************************************//

	//****** 사용자관리  ************************************************************************//
	public ApiEnvelope selectUser010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectUserDetail010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveUser(ApiEnvelope objXtrmParams) throws Exception;
	//public ApiEnvelope deleteUser(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope unlockUserAccount(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope initUserPass(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveImportUserData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope importUserExcelTemplateFile(List<MultipartFile> fileList, ApiEnvelope xtrmParams) throws Exception;
	//****** 사용자관리  ************************************************************************//

	//****** 조직관리  ************************************************************************//
	public ApiEnvelope selectDeptData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDeptData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope importDeptExcelTemplateFile(List<MultipartFile> fileList, ApiEnvelope xtrmParams) throws Exception;
	public ApiEnvelope saveImportDeptData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 조직관리  ************************************************************************//

	//****** 공통코드관리  ************************************************************************//
	public ApiEnvelope selectCodeData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectCodeDetailData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveCodeData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope configureCodeUseAt(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteCodeData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 공통코드관리  ************************************************************************//

	//****** 시스템코드관리  ************************************************************************//
	public ApiEnvelope selectSysCodeData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectSysCodeDetailData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveSysCodeData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope configureSysCodeUseAt(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteSysCodeData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 시스템코드관리  ************************************************************************//

	//****** 다국어관리  ************************************************************************//
	public List<ComMessage> selectAllMessage() throws Exception;
	public ApiEnvelope selectData010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataDetail010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveMessage(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteMessage(ApiEnvelope objXtrmParams) throws Exception;
	//****** 다국어관리  ************************************************************************//

	//****** 분류관리  ************************************************************************//
	public ApiEnvelope selectClsfPuCombo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectClsfData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveClsfData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 분류관리  ************************************************************************//

	//****** 사전관리  ************************************************************************//
	public ApiEnvelope selectDictPuCombo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDictionaryData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectKeywordAllData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDictionaryData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 사전관리  ************************************************************************//

	//****** 치환특화사전관리  ************************************************************************//
	//****** 치환특화사전관리  ************************************************************************//

	//****** 알림그룹별 대상자 ************************************************************************//
	public ApiEnvelope selectDataEmail010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataEmail010User(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataEmail010Batch(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataDeptTreeUser(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDataEmail010(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDataEmail010User(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteTargetUser(ApiEnvelope objXtrmParams) throws Exception;
	//****** 알림그룹별 대상자 ************************************************************************//

	//****** 알림발송현황  ************************************************************************//
	public ApiEnvelope selectDataEmail020(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataEmail020Detail(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope sendMail(ApiEnvelope objXtrmParams) throws Exception;
	//****** 알림발송현황  ************************************************************************//

	//****** VOC피드백현황  ************************************************************************//
	//****** VOC피드백현황  ************************************************************************//

	//****** 리포트피드백 현황  ************************************************************************//
	//****** 리포트피드백 현황  ************************************************************************//

	//****** 접속로그현황  ************************************************************************//
	public ApiEnvelope selectMenuListCombo() throws Exception;
	public ApiEnvelope selectAccessLogList(ApiEnvelope objXtrmParams) throws Exception;
	//****** 접속로그현황  ************************************************************************//

	//****** 접속로그현황(그래프)  ************************************************************************//
	public ApiEnvelope selectUserAccessLog(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectUserAccessLogDetail(ApiEnvelope objXtrmParams) throws Exception;
	//****** 접속로그현황(그래프)  ************************************************************************//

	//****** 다운로드현황  ************************************************************************//
	public ApiEnvelope selectExcelLogList(ApiEnvelope objXtrmParams) throws Exception;
	//****** 다운로드현황  ************************************************************************//

	//****** 송수신로그현황  ************************************************************************//
	public ApiEnvelope selectLog030(ApiEnvelope objXtrmParams) throws Exception;
	//****** 송수신로그현황  ************************************************************************//

	//****** 메뉴 관리  ************************************************************************//
	public ApiEnvelope selectUserMenuData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectMenuData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveMenuData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 메뉴 관리  ************************************************************************//

	//****** 권한그룹별 메뉴관리  ************************************************************************//
	public ApiEnvelope selectAuthGroupData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectAuthGroupMenuData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveAuthGroupData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveAuthGroupMenuData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 권한그룹별 메뉴관리  ************************************************************************//

	//****** 권한그룹별 사용자관리  ************************************************************************//
	public ApiEnvelope selectAuthGroupUserData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveAuthGroupUserData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 권한그룹별 사용자관리  ************************************************************************//

	//****** 사용자별 데이터권한관리  ************************************************************************//
	public ApiEnvelope selectMenu040(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectMenu040PuList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveAuthUserData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 사용자별 데이터권한관리  ************************************************************************//

	//****** 사용자별 권한현황  ************************************************************************//
	public ApiEnvelope selectDataUser050(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataAuthGroup(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataMenu(ApiEnvelope objXtrmParams) throws Exception;
	//****** 사용자별 권한현황  ************************************************************************//

	//****** 설문권한관리 ************************************************************************//
	public ApiEnvelope selectSurvey(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveSurvey(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteSurvey(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectSurveyAccount(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveSurveyAccount(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteSurveyAccount(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectMySurvey(ApiEnvelope objXtrmParams) throws Exception;
	//****** 설문권한관리 ************************************************************************//

//	//****** 배치모니터링  ************************************************************************//
//	public ApiEnvelope selectBatchList(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope getBatchExecutionCycleName(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope saveBatchSchedule(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope deleteBatchSchedule(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope executeBatch(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope selectBatchLog(ApiEnvelope objXtrmParams) throws Exception;
//	public ApiEnvelope selectBatchProcedureLog(ApiEnvelope objXtrmParams) throws Exception;
//	//****** 배치모니터링  ************************************************************************//

	//****** 연계모니터링  ************************************************************************//
	public ApiEnvelope selectLinkageList(ApiEnvelope objXtrmParams) throws Exception;
	//****** 연계모니터링  ************************************************************************//

	//****** 요약모니터링  ************************************************************************//
	public ApiEnvelope selectSummaryList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectProcessList(ApiEnvelope objXtrmParams) throws Exception;
	//****** 요약모니터링  ************************************************************************//

	//****** RAG모니터링  ************************************************************************//
	public ApiEnvelope selectRagstatList(ApiEnvelope objXtrmParams) throws Exception;
	//****** RAG모니터링  ************************************************************************//

	//****** 사용자프롬프트  ************************************************************************//
	public ApiEnvelope selectPromptData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptRequest(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope savePromptRequest(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteVobPromptRequest(ApiEnvelope objXtrmParams) throws Exception;
	//****** 사용자프롬프트  ************************************************************************//

	//****** 시스템프롬프트  ************************************************************************//
	public ApiEnvelope selectPromptPuCombo(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptPuList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectEvlItemList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptPuDetail(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope savePromptPuDetail(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptPuHistoryList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope executePromptData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptCountByPu(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveCopyPromptData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 시스템프롬프트  ************************************************************************//


	//****** 리포트목차관리  ************************************************************************//
	public ApiEnvelope selectPromptJobData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptJobTask(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectPromptJobTaskAction(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectConditionCorpList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectActionPromptList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectActionTargetPromptList(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveVobPromptJob(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveVobPromptJobTask(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveVobPromptJobTaskAction(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveTaskCorpData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveActionPromptData(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveActionTargetPromptData(ApiEnvelope objXtrmParams) throws Exception;
	//****** 리포트목차관리  ************************************************************************//

	//****** 용어사전관리  ************************************************************************//
	public ApiEnvelope selectDataWord(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataWordDelete(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope selectDataWordDetail(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDataWord(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope saveDataWordRestore(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteDataWordStatus(ApiEnvelope objXtrmParams) throws Exception;
	public ApiEnvelope deleteDataWord(ApiEnvelope objXtrmParams) throws Exception;
	//****** 용어사전관리  ************************************************************************//

	//****** 읽은 VOC 현황 ************************************************************************//
	public ApiEnvelope selectActivity010(ApiEnvelope objXtrmParams) throws Exception;
	//****** 읽은 VOC 현황 ************************************************************************//

	//****** 관심 VOC 현황 ************************************************************************//
	public ApiEnvelope selectActivity020(ApiEnvelope objXtrmParams) throws Exception;
	//****** 관심 VOC 현황 ************************************************************************//

	//****** VOC 피드백 현황  ************************************************************************//
	public ApiEnvelope selectActivity030(ApiEnvelope objXtrmParams) throws Exception;
	//****** VOC 피드백 현황  ************************************************************************//

	//****** Report 피드백 현황  ************************************************************************//
	public ApiEnvelope selectActivity040(ApiEnvelope objXtrmParams) throws Exception;
	//****** Report 피드백 현황  ************************************************************************//

	//****** 검색 키워드 현황  ************************************************************************//
	public ApiEnvelope selectActivity050(ApiEnvelope objXtrmParams) throws Exception;
	//****** 검색 키워드 현황  ************************************************************************//

	//****** AI 질의어 현황  ************************************************************************//
	public ApiEnvelope selectActivity060(ApiEnvelope objXtrmParams) throws Exception;
	//****** AI 질의어 현황  ************************************************************************//


}
