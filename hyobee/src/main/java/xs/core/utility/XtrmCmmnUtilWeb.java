/********************************************************************************
* @classDescription 업무 서비스 Util
* @author HyosungITX Corp.
* @version 1.0
* -------------------------------------------------------------------------------
* Modification Information
* Date				Developer			Content
* -------			-------------		-------------------------
* 2017/11/11		이정원				신규생성
* -------------------------------------------------------------------------------
* Copyright (C) 2017 by HyosungITX Corp. All rights reserved.
*********************************************************************************/

package xs.core.utility;

import java.math.BigDecimal;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Enumeration;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import xs.core.enumeration.XtrmEnum;
import xs.core.log.XtrmLogger;
import xs.core.property.XtrmProperty;
import xs.core.utility.extend.XtrmDateUtil;


@SuppressWarnings("unused")
public class XtrmCmmnUtilWeb extends XtrmDateUtil {

	/**
	 * 현재 요청의 HttpservletRequest객체를 반환한다.
	 */
	public static HttpServletRequest getServletRequest(){
		ServletRequestAttributes objServletRequestAttr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if(objServletRequestAttr != null){
			return objServletRequestAttr.getRequest();
		}else{
			return null;
		}
	}

	/**
	 * 현재 요청의 HttpservletRequest객체를 반환한다.
	 */
	public static HttpServletResponse getServletResponse(){
		ServletRequestAttributes objServletRequestAttr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
		if(objServletRequestAttr != null){
			return objServletRequestAttr.getResponse();
		}else{
			return null;
		}
	}

}
