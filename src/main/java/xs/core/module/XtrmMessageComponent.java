package xs.core.module;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;
import xs.core.enumeration.XtrmEnum;
import xs.core.dto.ApiEnvelope;
import xs.core.utility.XtrmCmmnUtilWeb;
import xs.vob.management.dto.ComMessage;

@Slf4j
@Component
@DependsOn(value = {"XtrmApplicationContextProvider"})
public class XtrmMessageComponent {

	static private Map<String, List<ComMessage>> messages;

	//@Autowired
	//private MessageService messageService;

	// 초기 WAS LOAD시 메모리에 적재할 다국어 데이터 조회, 사용여부가 Y인 다국어 데이터만 가지고 온다.
	@SuppressWarnings("static-access")
	@PostConstruct
	private void initMessage() throws Exception{
		//List<ComMessage> messageData                = messageService.selectAllMessage();
		//Map<String, List<ComMessage>> objMessageMap = messageData.stream().collect(Collectors.groupingBy(c -> c.getMessageId()));
		//log.info("초기 메모리에 LOAD한 다국어 데이터(MESSAGE_ID 그룹핑 기준) 건수 : " + objMessageMap.size() );
		//this.messages                               = objMessageMap;
	}

	// 다국어 데이터 등록 및 수정시 서버에 다국어 변경 목록을 전송한다.
	public int memoryMessageDataUpdate(ApiEnvelope objXtrmParams, String strTxFlag) throws Exception {
		int intReturnValue           = 0;
		String messageId             = objXtrmParams.getString("messageId");
		String languageCode          = objXtrmParams.getString("languageCode");
		String messageSectionCode    = objXtrmParams.getString("messageSectionCode");
		String messageContents       = objXtrmParams.getString("messageContents");
		String useAt                 = objXtrmParams.getString("useAt");
		List<ComMessage> messageData = messages.get(objXtrmParams.getString("messageId"));
		if(XtrmEnum.TRANSACTION_INSERT.getCode().equals(strTxFlag)){
			String message = getMessage(messageId, languageCode);
			log.debug(message);

			// 메모리상에 messageVO가 존재할경우 또는 사용여부가 미사용으로 전달된 경우 메모리에 데이터를 로드하지 않는다.
			if( ! "".equals(getMessage(messageId, languageCode)) || ! "Y".equals(useAt) ) return 0;

			// 메모리에 해당 KEY에 해당하는 객체가 없을경우( 사용여부가 미사용이어서 생성이 안되느 경우 ) 객체를 생성한다.
			if(messageData==null) messageData = new ArrayList<>();
			ComMessage comMessage             = new ComMessage(languageCode, messageId, messageContents, messageSectionCode, useAt);
			messageData.add(comMessage);

			messages.put(messageId, messageData);
			intReturnValue += 1;
		}else if(XtrmEnum.TRANSACTION_UPDATE.getCode().equals(strTxFlag)){
			// 메모리에 해당 KEY에 해당하는 객체가 없을경우 List 객체 생성
			if(messageData==null){ messageData           = new ArrayList<>(); }

			// List내 MessageVO 객체가 없을경우 또는 languageCode에 해당하는 MessageVO 객체가 없을경우
			if(messageData.isEmpty() || ( messageData.stream().noneMatch(item -> languageCode.equals(item.getLanguageCode()))) ){
				ComMessage comMessage = new ComMessage(languageCode, messageId, messageContents, messageSectionCode, useAt);
				messageData.add(comMessage);

				messages.put(messageId, messageData);
				intReturnValue += 1;
				return intReturnValue;
			}

			// 메모리에 등록된 MessageId에 해당하는 List를 순회한다.
			for(ComMessage serverData : messageData ){
				if(serverData.getMessageId().equals(messageId)&&serverData.getLanguageCode().equals(languageCode)){
					// 사용여부가 미사용일경우 메모리에서 다국어 데이터를 제거한다.
					if(!"Y".equals(useAt)){
						messageData.remove(serverData);
					}else{
						serverData.setMessageSectionCode(messageSectionCode);
						serverData.setMessageContents(messageContents);
						serverData.setUseAt(useAt);
						intReturnValue += 1;
					}
					// 메모리에 등록된 MessageId에 해당하는 List가 비어있을경우 메모리에서 제거한다.
					if(messageData.isEmpty()){ messages.remove(messageId); }
					break;
				}
			}

		}else if(XtrmEnum.TRANSACTION_DELETE.getCode().equals(strTxFlag)){
			if(messageData!=null){
				// 메모리에 등록된 MessageId에 해당하는 List를 순회한다.
				for(ComMessage serverData : messageData ){
					if(serverData.getMessageId().equals(messageId)&&serverData.getLanguageCode().equals(languageCode)){
						messageData.remove(serverData);
						intReturnValue += 1;
						// 메모리에 등록된 MessageId에 해당하는 List가 비어있을경우 메모리에서 제거한다.
						if(messageData.isEmpty()){ messages.remove(messageId); }
						break;
					}
				}
			}
		}

		return intReturnValue;
	}

	static public String getMessage(String messageId, String languageCode){
		String returnValue = "";

		if(messages != null && messages.containsKey(messageId) ){
			Optional<ComMessage> result = messages.get(messageId)
					.stream()
					.filter(message -> message.getLanguageCode().equals(languageCode))
					.findFirst();
			if (result.isPresent()) {
				returnValue = result.get().getMessageContents();
			}
		}

		return returnValue;
	}

	static public String getMessage(String messageId){
		String languageCode = "ko";

		HttpServletRequest request = XtrmCmmnUtilWeb.getServletRequest();

		if(request != null){
			HttpSession session = request.getSession();
			if(session != null){
				Object objSessionLang = session.getAttribute("LANGUAGE_CODE");
				if(objSessionLang != null){
					languageCode = objSessionLang.toString();
				}else{
					languageCode = request.getLocale().getLanguage();
				}
			}else{
				languageCode = request.getLocale().getLanguage();
			}
		}
		return getMessage(messageId, languageCode);
	}
}
