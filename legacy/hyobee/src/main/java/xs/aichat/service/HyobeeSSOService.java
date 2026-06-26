package xs.aichat.service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface HyobeeSSOService {

	//****** 뤼튼 ?�동 AI 챗봇 ************************************************************************//
    void ssoLogin(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
