package xs.core.module;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import xs.core.utility.XtrmCmmnUtilWeb;

@Slf4j
@Component(value="XtrmRestComponentWeb")
public class XtrmRestComponentWeb extends XtrmRestComponent {

	@Override
	public void selectPrintLog(String strUrl, HttpMethod objMethod, String strRequestBody, String strResponse, String strException) {
		log.info("URL: {}, HTTP_METHOD: {}, REQUEST_BODY: {}, RESPONSE: {}, EXCEPTION: {}, REQUEST_UUID: {}", strUrl, objMethod.name(), strRequestBody, strResponse, strException,
				XtrmCmmnUtilWeb.getServletRequest().getAttribute("REQUEST_UUID").toString());
	}
}
