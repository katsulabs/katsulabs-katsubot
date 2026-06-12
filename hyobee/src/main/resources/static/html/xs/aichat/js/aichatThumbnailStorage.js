/***************************************************************************************************************************************************************
* @classDescription 썸네일 localStorage 모듈
* @author HyosungITX Corp.
* @version 1.0
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2025/12/11        AI서비스팀             신규생성
* --------------------------------------------------------------------------------------------------------------------------------------------------------------
* Copyright (C) 2018 by HyosungITX Corp. All rights reserved.
****************************************************************************************************************************************************************/
"use strict";
/***************************************************************************************************************************************************************
 * Global Variable : 스크립트 영역에서 모두 접근할 수 있는 전역변수를 해당 영역에 모두 정의한다.
 ***************************************************************************************************************************************************************/
/**
 * 클래스 구조의 스크립트 구조체 오브젝트 명을 정의한다.
 * 스크립트를 클래스 기반의 구조체로 정의하기 위해 해당 JavaScript의 클래스명은 파일명으로 정의한다.
 * @classDescription 썸네일 localStorage 모듈 - 브라우저 localStorage를 사용하여 썸네일 이미지를 캐싱
 */
var aichatThumbnailStorage = {
/***************************************************************************************************************************************************************
 * generateThumbnailKeys Function : localStorage 키 생성
 * - conversation_id와 message_id를 조합하여 고유 키 생성
 * - Fallback 키 목록도 함께 반환 (다양한 조합 시도 가능)
 * @param {Object} fileInfo - 파일 정보 객체 (conversation_id, message_id 포함)
 * @param {string} fileName - 파일명
 * @returns {Object} {primary: string, fallbacks: Array<string>} - 메인 키와 Fallback 키 목록
 ***************************************************************************************************************************************************************/
	generateThumbnailKeys : function(fileInfo, fileName) {
		var conversationId = fileInfo.conversation_id || (typeof mobjConversationId !== 'undefined' ? mobjConversationId : '') || '';
		var messageId = fileInfo.message_id || '';
		var keys = { primary: '', fallbacks: [] };

		if (conversationId && messageId) {
			keys.primary = conversationId + '_' + messageId + '_' + fileName;
			keys.fallbacks = [
				messageId + '_' + fileName,
				conversationId + '_' + fileName,
				fileName
			];
		} else if (messageId) {
			keys.primary = messageId + '_' + fileName;
			keys.fallbacks = [fileName];
		} else if (conversationId) {
			keys.primary = conversationId + '_' + fileName;
			keys.fallbacks = [fileName];
		} else {
			keys.primary = fileName;
		}

		return keys;
	},
/***************************************************************************************************************************************************************
 * getThumbnailFromStorage Function : localStorage에서 썸네일 가져오기
 * @param {Object} fileInfo - 파일 정보 객체 (name, filename, url 등)
 * @returns {string|null} Base64 인코딩된 썸네일 이미지 또는 null (없는 경우)
 ***************************************************************************************************************************************************************/
	getThumbnailFromStorage : function(fileInfo) {
		var fileKey = fileInfo.name || fileInfo.filename || fileInfo.originalName ||
		             fileInfo.url || fileInfo.fileUrl || fileInfo.id;
		
		if (!fileKey) return null;

		try {
			var fileNameOnly = fileKey.split('/').pop().split('\\').pop();
			var keys = aichatThumbnailStorage.generateThumbnailKeys(fileInfo, fileNameOnly);
			
			// 메인 키 시도
			var thumbnail = localStorage.getItem(keys.primary);
			if (thumbnail) return thumbnail;

			// Fallback 키들 시도
			for (var i = 0; i < keys.fallbacks.length; i++) {
				thumbnail = localStorage.getItem(keys.fallbacks[i]);
				if (thumbnail) return thumbnail;
			}
		} catch (e) {
			console.warn('썸네일 localStorage 조회 실패:', e);
		}

		return null;
	},
/***************************************************************************************************************************************************************
 * saveThumbnailToStorage Function : 썸네일을 localStorage에 저장
 * - Base64 인코딩된 썸네일 이미지를 localStorage에 저장
 * - 파일명도 함께 저장 (키 + "_name" 형태)
 * @param {Object} meta - 메타데이터 (thumbnailBase64, originalFilename 포함)
 * @param {Object} fileInfo - 파일 정보 객체 (conversation_id, message_id 등)
 * @returns {void}
 ***************************************************************************************************************************************************************/
	saveThumbnailToStorage : function(meta, fileInfo) {
		var fileName = meta.originalFilename || fileInfo.name || '';
		if (!fileName) return;

		var fileNameOnly = fileName.split('/').pop().split('\\').pop();
		var keys = aichatThumbnailStorage.generateThumbnailKeys(fileInfo, fileNameOnly);

		try {
			// localStorage에 썸네일 Base64와 파일명 저장
			localStorage.setItem(keys.primary, meta.thumbnailBase64);
			localStorage.setItem(keys.primary + '_name', fileNameOnly);
		} catch (e) {
			console.warn('썸네일 localStorage 저장 실패:', e);
		}
	},
/***************************************************************************************************************************************************************
 * updateThumbnailKeysWithMessageId Function : message_id 업데이트 시 localStorage 키 업데이트
 * - 파일 업로드 시점에는 message_id가 없어 임시 키로 저장
 * - 메시지 전송 후 message_id가 생성되면 새로운 키로 업데이트
 * - 기존 키에서 썸네일을 가져와 새 키로 저장
 * @param {Array} uploadedFiles - 업로드된 파일 목록
 * @param {string} userMessageId - 사용자 메시지 ID
 * @param {string} conversationId - 대화 ID
 * @returns {void}
 ***************************************************************************************************************************************************************/
	updateThumbnailKeysWithMessageId : function(uploadedFiles, userMessageId, conversationId) {
		if (!uploadedFiles || uploadedFiles.length === 0 || !userMessageId) {
			return;
		}

		uploadedFiles.forEach(function(fileInfo) {
			if (fileInfo.thumbnailBase64 && !fileInfo.message_id) {
				fileInfo.message_id = userMessageId;
				
				var fileName = fileInfo.name || fileInfo.filename || fileInfo.originalName || '';
				if (!fileName) return;

				var fileNameOnly = fileName.split('/').pop().split('\\').pop();
				var convId = conversationId || (typeof mobjConversationId !== 'undefined' ? mobjConversationId : '') || fileInfo.conversation_id || '';

				// 새로운 키로 저장
				var newThumbnailKey = '';
				if (convId && userMessageId) {
					newThumbnailKey = convId + '_' + userMessageId + '_' + fileNameOnly;
				} else if (userMessageId) {
					newThumbnailKey = userMessageId + '_' + fileNameOnly;
				} else if (convId) {
					newThumbnailKey = convId + '_' + fileNameOnly;
				} else {
					newThumbnailKey = fileNameOnly;
				}

				// 기존 키에서 썸네일 가져와서 새 키로 저장
				var oldKeys = [];
				if (convId) {
					oldKeys.push(convId + '_' + fileNameOnly);
				}
				oldKeys.push(fileNameOnly);

				var thumbnailBase64 = null;
				for (var k = 0; k < oldKeys.length; k++) {
					thumbnailBase64 = localStorage.getItem(oldKeys[k]);
					if (thumbnailBase64) {
						break;
					}
				}

				if (thumbnailBase64 || fileInfo.thumbnailBase64) {
					var base64ToStore = thumbnailBase64 || fileInfo.thumbnailBase64;
					try {
						localStorage.setItem(newThumbnailKey, base64ToStore);
						console.log('✅ 썸네일 localStorage 업데이트 (message_id 추가):', newThumbnailKey);
					} catch (e) {
						console.warn('썸네일 localStorage 업데이트 실패:', e);
					}
				}
			}
		});
	},
/***************************************************************************************************************************************************************
 * Sample Function : 해당 함수는 삭제하지 말고 그대로
 ***************************************************************************************************************************************************************/
	sample : function(){
	}
};
