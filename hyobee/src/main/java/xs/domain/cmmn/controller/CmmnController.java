package xs.domain.cmmn.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import xs.core.handler.app.XtrmArgumentResolveMap;
import xs.core.dto.ApiEnvelope;
import xs.domain.cmmn.service.CmmnService;

@RestController
@RequestMapping("/xs/domain/cmmn")
public class CmmnController {

	@Autowired
	CmmnService cmmnService;

	@PostMapping(value = "getMenuKeyByPath.json")
	public ApiEnvelope getRecordFilePlayInfo(XtrmArgumentResolveMap inRequestMap) throws Exception {
		return cmmnService.getMenuKeyByPath(inRequestMap.getParams());
	}

}
