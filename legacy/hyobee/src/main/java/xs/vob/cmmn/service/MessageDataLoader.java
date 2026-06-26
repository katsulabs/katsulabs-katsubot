package xs.vob.cmmn.service;

import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import xs.aichat.v2.mapper.CommonMapper;
import xs.vob.management.dto.ComMessage;

@Slf4j
@RequiredArgsConstructor
@Service
public class MessageDataLoader {

	private final CmmnService cmmnService;

	private final CommonMapper commonMapper;

	@PostConstruct
	private void initMessage() {
		var allMessages = commonMapper.findAllMessages();
		var immutableMessageMap = allMessages.stream()
				.map(message -> new ComMessage(
						message.getLanguageCode(),
						message.getMessageId(),
						message.getMessageContents()))
				.collect(Collectors.collectingAndThen(
						Collectors.groupingBy(
                                ComMessage::getMessageId,
								Collectors.toUnmodifiableList()),
						Map::copyOf));

		log.info("초기 메모리에 LOAD한 다국어 데이터(MESSAGE_ID 그룹핑 기준) 건수 : {}", immutableMessageMap.size());
		cmmnService.setInitMessageData(immutableMessageMap);
	}
}
