package xs.aichat.v2.service;

import org.springframework.web.multipart.MultipartFile;
import xs.aichat.dto.AttachFileInfo;
import xs.aichat.v2.dto.internal.response.UploadFileItem;
import xs.aichat.v2.dto.internal.response.UploadFileResponse;
import xs.aichat.v2.dto.internal.response.UploadFilesResponse;

import java.util.List;
import java.util.Map;

// 파일 업로드 서비스 인터페이스
public interface ChatFileService {

    // 단일 파일 업로드
    UploadFileItem uploadFile(MultipartFile multipartFile, Map<String, Object> params) throws Exception;

    // 다중 파일 업로드
    UploadFilesResponse uploadFiles(MultipartFile[] multipartFiles, Map<String, Object> params) throws Exception;

    // HiCloud 파일 다운로드
    Map<String, Object> downloadHiCloudFiles(Map<String, Object> params) throws Exception;

    // 파일 첨부 Payload 셋팅
    List<AttachFileInfo> attachFilesPayload(List<String> fileIds);
    
    // UUID로 이미지 파일 조회 (Base64 인코딩된 바이너리 반환)
    String getImageByThumbnailId(String thumbnailId);
    
    // 원본 파일만 삭제 (썸네일은 유지)
    void deleteOriginalFiles(List<String> fileIds);
}

