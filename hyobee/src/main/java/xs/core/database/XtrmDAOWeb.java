package xs.core.database;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtilWeb;

@SuppressWarnings({"rawtypes"})
@Repository
@Slf4j
public class XtrmDAOWeb extends XtrmDAO {

	@Override
	public HashMap<String, Object> setParameterMap(Object obj) throws Exception {
		//20250114 취약점 보완에 따른 null값 삽입시 공백처리 로직 추가
		if( obj instanceof ApiEnvelope ){
			obj = new ApiEnvelope( obj.toString().replace("\\u0000", "") );
		}
		HashMap<String, Object> objParameterMap 		= convertObjectToMap(obj);
		HttpServletRequest objRequest					= XtrmCmmnUtilWeb.getServletRequest();

		//2021.12.22 김정환 수정 VOC Light에 맞게 원천 회사코드 추가 후 Session Company Code 값 변경
		if(objRequest != null){
			HttpSession objSession						= objRequest.getSession(false);
			Object strRequestUUID						= objRequest.getAttribute("REQUEST_UUID");
			Object strSessionUserId						= null;
			Object strSessionCompanyCode				= null;
			Object strOriginCompanyCode					= null;
			Object strLanguageCode						= null;
			Object strSessionVobAuthDataList            = null;
			Object strCorpCode                          = null;
			Object strPgCode                            = null;
			Object strPuCode                            = null;
			Object strGbisPuCode                        = null;
			Object strCorpGroup                         = null;
			Object strGbisCorpCode                      = null;
			Object strAuthGroupInfo                     = null;
			Object strDeptCode                          = null;

			if(objSession != null){
				strSessionUserId						= objSession.getAttribute("USER_ID");
				strSessionCompanyCode					= objSession.getAttribute("TARGET_COMPANY_CODE");	// voc light하고 충돌이 나는 부분으로 다시 확인 필요 ktk
				strSessionCompanyCode					= objSession.getAttribute("COMPANY_CODE");
				strOriginCompanyCode					= objSession.getAttribute("COMPANY_CODE");
				strLanguageCode							= objSession.getAttribute("LANGUAGE_CODE");
				strSessionVobAuthDataList               = objSession.getAttribute("VOB_AUTH_DATA_LIST");
				strCorpCode				                = objSession.getAttribute("CORP_CODE");
				strPgCode                               = objSession.getAttribute("PG_CODE");
				strPuCode                               = objSession.getAttribute("PU_CODE");
				strGbisPuCode                           = objSession.getAttribute("GBIS_PU_CODE");
				strCorpGroup                            = objSession.getAttribute("CORP_GROUP");
				strGbisCorpCode                         = objSession.getAttribute("GBIS_CORP_CODE");
				strAuthGroupInfo                        = objSession.getAttribute("AUTH_GROUP_INFO");
				strDeptCode                             = objSession.getAttribute("DEPT_CODE");
			}

//			log.info("SSO callback - AFTER set - sessionId={}, attributes={}", objSession.getId(), Collections.list(objSession.getAttributeNames()));
			if(strRequestUUID				== null){strRequestUUID			= new String();	}
			if(strSessionUserId				== null){strSessionUserId		= new String();	}
			if(strSessionCompanyCode		== null){strSessionCompanyCode	= new String();	}
			if(strOriginCompanyCode			== null){strOriginCompanyCode	= new String();	}
			if(strLanguageCode				== null){strLanguageCode		= objRequest.getLocale().getLanguage();	}
			if(strLanguageCode				== null){strLanguageCode		= "en";         }
			if(strSessionVobAuthDataList	== null){strSessionVobAuthDataList	= new ArrayList();	}
			if(strCorpCode		        	== null){strCorpCode         	= new String();	}
			if(strPgCode		        	== null){strPgCode           	= new String();	}
			if(strPuCode		        	== null){strPuCode           	= new String();	}
			if(strGbisPuCode	        	== null){strGbisPuCode       	= new String();	}
			if(strCorpGroup	            	== null){strCorpGroup       	= new String();	}
			if(strGbisCorpCode	            == null){strGbisCorpCode    	= new String();	}
			if(strAuthGroupInfo	            == null){strAuthGroupInfo    	= new String();	}
			if(strDeptCode	                == null){strDeptCode        	= new String();	}

			if(!objParameterMap.containsKey("xtrmRequestUuid")){
				objParameterMap.put("xtrmRequestUuid"			, strRequestUUID);
			}
			if(!objParameterMap.containsKey("sessionUserId")){
				objParameterMap.put("sessionUserId"				, strSessionUserId);
			}
			if(!objParameterMap.containsKey("sessionCompanyCode")){
				objParameterMap.put("sessionCompanyCode"		, strSessionCompanyCode);
			}
			if(!objParameterMap.containsKey("sessionTargetCompanyCode")){
				objParameterMap.put("sessionOriginCompanyCode"	, strOriginCompanyCode);
			}
			if(!objParameterMap.containsKey("sessionLanguageCode")){
				objParameterMap.put("sessionLanguageCode"	, strLanguageCode);
			}
			if(!objParameterMap.containsKey("sessionVobAuthDataList")){
				objParameterMap.put("sessionVobAuthDataList"	, strSessionVobAuthDataList);
			}
			if(!objParameterMap.containsKey("sessionCorpCode")){
				objParameterMap.put("sessionCorpCode"		, strCorpCode);
			}
			if(!objParameterMap.containsKey("sessionPgCode")){
				objParameterMap.put("sessionPgCode"		, strPgCode);
			}
			if(!objParameterMap.containsKey("sessionPuCode")){
				objParameterMap.put("sessionPuCode"		, strPuCode);
			}
			if(!objParameterMap.containsKey("sessionGbisCode")){
				objParameterMap.put("sessionGbisCode"		, strGbisPuCode);
			}
			if(!objParameterMap.containsKey("sessionCorpGroup")){
				objParameterMap.put("sessionCorpGroup"		, strCorpGroup);
			}
			if(!objParameterMap.containsKey("sessionGbisCorpCode")){
				objParameterMap.put("sessionGbisCorpCode"		, strGbisCorpCode);
			}
			if(!objParameterMap.containsKey("sessionAuthGroupInfo")){
				objParameterMap.put("sessionAuthGroupInfo"		, strAuthGroupInfo);
			}
			if(!objParameterMap.containsKey("sessionDeptCode")){
				objParameterMap.put("sessionDeptCode"		, strDeptCode);
			}

		}
		if(obj instanceof ApiEnvelope){
			if(((ApiEnvelope) obj).getHeaderInt("PAGE_NO") != 0){
				objParameterMap.put("xtrmPageNo"	, ((ApiEnvelope) obj).getHeaderInt("PAGE_NO"));
			}
			if(((ApiEnvelope) obj).getHeaderInt("ROW_PER_PAGE") != 0){
				objParameterMap.put("xtrmRowPerPage", ((ApiEnvelope) obj).getHeaderInt("ROW_PER_PAGE"));
			}
		}

		return objParameterMap;
	}

}

