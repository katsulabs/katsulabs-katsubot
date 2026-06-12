package xs.domain.cmmn.service;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import xs.core.extend.XtrmDefaultResource;
import xs.core.dto.ApiEnvelope;
import xs.core.dto.ApiEnvelopes;
import xs.core.utility.XtrmCryptoUtil;

@Service("xs.domain.cmmn.service.CmmnService")
public class CmmnServiceImpl extends XtrmDefaultResource implements CmmnService {

	@Override
	public ApiEnvelope getMenuKeyByPath(ApiEnvelope params) throws Exception {
		return ApiEnvelopes.selectJson(mobjXtrmDao, "xs.domain.cmmn.CmmnMapper", "getMenuKeyByPath", params);
	}

	@Override
	public String getAesKey(String companyCode, String keyInfo) throws Exception {
		return XtrmCryptoUtil.encryptSHA256(companyCode + keyInfo, "").substring(0, 32);
	}

	@Override
	public void setSolutionInfo(ApiEnvelope params) throws Exception {
		setSolutionInfo(params, null);
	}

	@Override
	public void setSolutionInfo(ApiEnvelope params, HttpServletRequest request) throws Exception {
		String isManageCompany = "N";
		if (request != null && (request.getServerName().equals(mobjXtrmConfig.getString("ADMIN_OUTER_URL_INFO"))
				|| request.getServerName().equals(mobjXtrmConfig.getString("ADMIN_INNER_URL_INFO")))) {
			isManageCompany = "Y";
		}
		params.setString("isManageCompany", isManageCompany);
		params.setString("solutionSectionCode", mobjXtrmConfig.getString("SOLUTION_SECTION_CODE"));
	}
}
