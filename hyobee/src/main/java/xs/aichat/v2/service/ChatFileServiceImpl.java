package xs.aichat.v2.service;

import com.fasterxml.jackson.core.type.TypeReference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import xs.aichat.dto.AttachFileInfo;
import xs.aichat.dto.HiCloudFileInfo;
import xs.aichat.dto.HiCloudFileResult;
import xs.aichat.dto.ThumbnailResult;
import xs.aichat.service.HyobeeThumbnailService;
import xs.aichat.util.FileUtils;
import xs.aichat.util.FileValidator;
import xs.aichat.util.JsonAdapter;
import xs.aichat.v2.dto.internal.response.UploadFileItem;
import xs.aichat.v2.dto.internal.response.UploadFilesResponse;
import xs.aichat.v2.service.ChatFileService;
import xs.aichat.v2.service.ChatLogService;
import xs.core.property.XtrmProperty;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI 비서 파일 처리 서비스.
 * 로컬·클라우드 파일 업로드와 삭제를 담당한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ChatFileServiceImpl implements ChatFileService {

    private final XtrmProperty xtrmConfig;

    private final JsonAdapter jsonAdapter;

    private final FileValidator fileValidator;

    private final HyobeeThumbnailService hyobeeThumbnailService;

    private final ChatLogService chatLogService;

    private static final int CONNECT_TIMEOUT_MS = 15_000; // 15초

    private static final int READ_TIMEOUT_MS = 60_000; // 60초

    private static final int BUFFER_SIZE = 8192; // 8KB

    private static final int RETRY_BASE_DELAY_MS = 1000; // 재시도 기본 대기시간 (1초)

    /**
     * 단일 파일 업로드 처리
     * - 파일 유효성 검사 (크기, 확장자, 파일명)
     * - UUID 폴더 생성 후 로컬 저장소에 저장
     * - 이미지 파일인 경우 썸네일 생성 (48x48, Base64 인코딩)
     * @param multipartFile 업로드할 파일
     * @param params 요청 파라미터
     * @return 업로드 결과 (fileUrl, thumbnailUrl, folderUuid 등)
     * @throws Exception 업로드 중 예외 발생 시
     */
    @Override
    public UploadFileItem uploadFile(MultipartFile multipartFile, Map<String, Object> params) throws Exception {
//        Map<String, Object> result = new HashMap<>();
        var result = UploadFileItem.of();
        String fileLogKey = null;
        String companyCode = xtrmConfig.getString("COMPANY_CODE", "1000");

        try {
            // 파일 정보 추출 (시도 시점에 먼저 추출)
            String originalFilename = multipartFile.getOriginalFilename();
            String extension = FileUtils.getFileExtension(originalFilename);
            String contentType = multipartFile.getContentType();
            long fileSize = multipartFile.getSize();

            // UUID 생성 (폴더명으로 사용) -> 각 파일마다 고유한 UUID 폴더 생성하여 저장
            String folderUuid = UUID.randomUUID().toString();
            fileLogKey = folderUuid; // folderUuid를 fileLogKey로 사용

            // 파일 업로드 시점에 로그 INSERT (LOG_KEY = '', successYn = 'N')
            // 채팅 실행 시 chat_api_log INSERT 후 생성된 log_key로 LOG_KEY UPDATE
            try {
                Map<String, Object> fileInfo = new HashMap<>();
                fileInfo.put("fileLogKey", fileLogKey);
                fileInfo.put("fileName", originalFilename);
                fileInfo.put("fileSize", fileSize);
                fileInfo.put("fileType", !extension.isEmpty() ? extension : "unknown");
                fileInfo.put("mimeType", getMimeType(contentType, extension));
                fileInfo.put("successYn", "N"); // 시도 시점에는 'N'
                fileInfo.put("errorMessage", null);

                List<Map<String, Object>> fileInfoList = Collections.singletonList(fileInfo);
                chatLogService.saveFileLogs(StringUtils.EMPTY, fileInfoList); // LOG_KEY = ''로 INSERT
            } catch (Exception logException) {
                // 로그 저장 실패해도 비즈니스 로직에 영향 없도록
                log.warn("파일 업로드 시도 로그 저장 중 오류 발생", logException);
            }

            // 파일 유효성 검사 (크기, 확장자, 파일명)
            fileValidator.validateFile(multipartFile);

            // 로컬 서버 업로드 (UUID 폴더 하위에 원본 파일명으로 저장)
            String fileUrl = uploadToLocalStorage(multipartFile, originalFilename, folderUuid);

            result.setFileUrl(fileUrl);
            result.setOriginalFilename(originalFilename);
            result.setSavedFilename(originalFilename); // 원본 파일명으로 저장
            result.setFilePath(folderUuid + "/" + originalFilename); // UUID 폴더 경로 포함 파일 경로
            result.setExtension(extension);
            result.setContentType(contentType);
            result.setFileSize(fileSize);
            result.setFolderUuid(folderUuid);
            result.setFileUrl(fileUrl); // UUID 반환


            // 이미지 파일인 경우 썸네일 생성 (48x48, Base64 인코딩) -> 썸네일 생성 실패해도 파일 업로드는 성공으로 처리
            if (FileUtils.isImageFile(extension)) {
                try {
                    Path uploadPath = getUploadPath();
                    ThumbnailResult thumbnailResult = hyobeeThumbnailService.generateThumbnailWithBase64(
                            multipartFile.getBytes(), originalFilename, folderUuid, uploadPath);
                    result.setThumbnailId(thumbnailResult.getThumbnailId());
                    result.setThumbnailUrl(thumbnailResult.getThumbnailUrl());
                    result.setThumbnailBase64(thumbnailResult.getThumbnailBase64());
                    log.info("썸네일 생성 성공: {} -> {}", originalFilename, thumbnailResult.getThumbnailUrl());
                } catch (IOException e) {
                    log.warn("썸네일 생성 실패(파일 업로드는 성공): {} - {}", originalFilename, e.getMessage());
                }
            }

            result.setSuccess(true);
            result.setMessage("파일 업로드 성공");
            log.info("파일 업로드 성공: {} -> {} (UUID: {})", originalFilename, fileUrl, folderUuid);

            // 파일 업로드 성공 시 로그 UPDATE (successYn = 'Y')
            if (fileLogKey != null) {
                try {
                    chatLogService.updateFileLog(companyCode, fileLogKey, "Y", null);
                } catch (Exception logException) {
                    // 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
                    log.warn("파일 업로드 성공 로그 업데이트 중 오류 발생", logException);
                }
            }

        } catch (Exception e) {
            log.error("파일 업로드 실패", e);
            result.setSuccess(false);
            result.setMessage(e.getMessage());

            // 파일 업로드 실패 시 로그 UPDATE (successYn = 'N', errorMessage 설정)
            if (fileLogKey != null) {
                try {
                    chatLogService.updateFileLog(companyCode, fileLogKey, "N", e.getMessage());
                } catch (Exception logException) {
                    // 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
                    log.warn("파일 업로드 실패 로그 업데이트 중 오류 발생", logException);
                }
            } else {
                // fileLogKey가 없는 경우 (시도 로그 INSERT 전에 실패한 경우) INSERT
                try {
                    String originalFilename = Objects.nonNull(multipartFile) ? multipartFile.getOriginalFilename() : "unknown";
                    String extension = FileUtils.getFileExtension(originalFilename);
                    String contentType = Objects.nonNull(multipartFile) ? multipartFile.getContentType() : null;
                    long fileSize = Objects.nonNull(multipartFile) ? multipartFile.getSize() : 0;

                    Map<String, Object> fileInfo = new HashMap<>();
                    fileInfo.put("fileLogKey", UUID.randomUUID().toString());
                    fileInfo.put("fileName", originalFilename);
                    fileInfo.put("fileSize", fileSize);
                    fileInfo.put("fileType", !extension.isEmpty() ? extension : "unknown");
                    fileInfo.put("mimeType", getMimeType(contentType, extension));
                    fileInfo.put("successYn", "N");
                    fileInfo.put("errorMessage", e.getMessage());

                    List<Map<String, Object>> fileInfoList = Collections.singletonList(fileInfo);
                    chatLogService.saveFileLogs(StringUtils.EMPTY, fileInfoList); // LOG_KEY = ''로 INSERT
                } catch (Exception logException) {
                    // 로그 저장 실패해도 비즈니스 로직에 영향 없도록
                    log.warn("파일 업로드 실패 로그 저장 중 오류 발생", logException);
                }
            }
        }

        return result;
    }

    /**
     * 여러 파일 일괄 업로드 처리
     * @param multipartFiles 업로드할 파일 배열
     * @param params 요청 파라미터
     * @return 업로드 결과 (totalCount, successCount, failCount, fileInfo 배열 등)
     */
    // 여러 파일 업로드 (각 파일별로 uploadFile 호출 결과를 취합)
    @Override
    public UploadFilesResponse uploadFiles(MultipartFile[] multipartFiles, Map<String, Object> params) {
        List<UploadFileItem> uploadedFiles = new ArrayList<>();
        List<String> errors = new ArrayList<>();

        var response = UploadFilesResponse.initialize();
        try {
            // 각 파일을 순회하며 개별 업로드 처리
            for (MultipartFile multipartFile : multipartFiles) {
                try {
                    var fileResult = uploadFile(multipartFile, params);
                    if (fileResult.getSuccess()) {
                        uploadedFiles.add(fileResult);
                    } else {
                        errors.add(multipartFile.getOriginalFilename() + ": " + Objects.toString(fileResult.getMessage(), ""));
                        // uploadFile 내부에서 이미 로그를 기록하므로 여기서는 추가 기록 불필요
                    }
                } catch (Exception e) {
                    errors.add(multipartFile.getOriginalFilename() + ": " + e.getMessage());
                    // uploadFile 내부에서 이미 로그를 기록하므로 여기서는 추가 기록 불필요
                }
            }

            // 업로드 결과 집계 (성공/실패 개수)
            response.setSuccess(errors.isEmpty());
            response.setTotalCount(multipartFiles.length);
            response.setSuccessCount(uploadedFiles.size());
            response.setFailCount(errors.size());
            response.setFileInfo(uploadedFiles);


            if (!errors.isEmpty()) {
                response.setErrors(errors);
                response.setMessage("일부 파일 업로드 실패");
            } else {
                response.setMessage("모든 파일 업로드 성공");
            }

        } catch (Exception e) {
//            log.error("파일 일괄 업로드 실패", e);
            response.setSuccess(false);
            response.setMessage(e.getMessage());
        }

        return response;
    }

    /**
     * HiCloud 파일 다운로드 처리
     * - HiCloud에서 파일을 다운로드하여 로컬 저장소에 저장
     * - UUID 폴더 구조로 저장 (folderUuid/filename 형식)
     * - 이미지 파일인 경우 썸네일 자동 생성
     * - 재시도 로직 포함 (최대 재시도 횟수 설정 가능)
     * @param params 요청 파라미터 (hiCloudFileInfos: JSON 배열 형태의 파일 정보)
     * @return 다운로드 결과 (totalCount, successCount, failedCount 등)
     */
    // HiCloud 파일 다운로드, 현재는 스크립트 쪽에서 브라우저로 직접 내려받도록 구현된 상태.
    @Override
    public Map<String, Object> downloadHiCloudFiles(Map<String, Object> params) {
        // JSON 파라미터에서 파일 정보 목록 파싱
        List<HiCloudFileInfo> attachedCloudFiles = Collections.emptyList();
        Object hiCloudFileInfosRaw = params != null ? params.get("hiCloudFileInfos") : null;
        if (hiCloudFileInfosRaw instanceof String) {
            attachedCloudFiles = jsonAdapter.fromJson(
                    (String) hiCloudFileInfosRaw,
                    new TypeReference<List<HiCloudFileInfo>>() {}
            );
        } else if (hiCloudFileInfosRaw != null) {
            attachedCloudFiles = jsonAdapter.fromJson(
                    jsonAdapter.toJson(hiCloudFileInfosRaw),
                    new TypeReference<List<HiCloudFileInfo>>() {}
            );
        }

        try {
            // 파일 목록 유효성 검증
            if (attachedCloudFiles == null || attachedCloudFiles.isEmpty()) {
                Map<String, Object> errorResult = new HashMap<>();
                Map<String, Object> header = new HashMap<>();
                header.put("ERROR_FLAG", true);
                header.put("ERROR_MSG", "다운로드할 파일이 없습니다.");
                errorResult.put("HEADER", header);
                return errorResult;
            }

            // 업로드 경로 확인 (없으면 생성)
            Path uploadPath = getUploadPath();
            String companyCode = xtrmConfig.getString("COMPANY_CODE", "1000");

//            log.info("HiCloud 파일 다운로드 요청: {} 개 파일", attachedCloudFiles.size());

            List<HiCloudFileResult> downloadedFiles = new ArrayList<>();
            List<HiCloudFileResult> failedFiles = new ArrayList<>();

            // 각 파일별 다운로드 처리 (순차 처리)
            for (HiCloudFileInfo fileInfo : attachedCloudFiles) {
                // 파일명 검증
                String originFileName = URLDecoder.decode(fileInfo.getFileName(), StandardCharsets.UTF_8);
                // HiCloud 원본 fileId와 분리된 내부 UUID를 사용해 키 충돌을 방지한다.
                String sourceFileId = fileInfo.getFileId();
                String fileKey = UUID.randomUUID().toString();
                String folderUuid = fileKey;
                String fileLogKey = fileKey;

                try {
                    // 파일 확장자 확인
                    String extension = FileUtils.getFileExtension(originFileName);

                    // 파일 업로드 시점과 동일하게, HiCloud 파일 다운로드 시도 시에도 파일 로그 INSERT (LOG_KEY = '', successYn = 'N')
                    try {
                        Map<String, Object> fileLogInfo = new HashMap<>();
                        fileLogInfo.put("fileLogKey", fileLogKey);
                        fileLogInfo.put("fileName", originFileName);
                        fileLogInfo.put("fileSize", fileInfo.getFileSize());
                        fileLogInfo.put("fileType", !extension.isEmpty() ? extension : "unknown");
                        fileLogInfo.put("mimeType", getMimeType(null, extension));
                        fileLogInfo.put("successYn", "N"); // 시도 시점에는 항상 'N'
                        fileLogInfo.put("errorMessage", null);

                        List<Map<String, Object>> fileInfoList = Collections.singletonList(fileLogInfo);
                        chatLogService.saveFileLogs(StringUtils.EMPTY, fileInfoList); // LOG_KEY = ''로 INSERT
                    } catch (Exception logException) {
                        // 로그 저장 실패해도 비즈니스 로직에 영향 없도록
                        log.warn("HiCloud 파일 다운로드 시도 로그 저장 중 오류 발생: fileId={}, fileName={}",
                                sourceFileId, originFileName, logException);
                    }

                    // HiCloud 파일 다운로드 (fileId를 폴더명으로 사용하여 저장)
                    int maxRetryCount = xtrmConfig.getInt("MAX_RETRY_COUNT", 3);
                    String savedPath = downloadHiCloudFileToUuidFolder(
                            fileInfo.getDownLoadUrl(),
                            originFileName,
                            folderUuid,
                            uploadPath,
                            maxRetryCount
                    );

                    // 이미지 파일인 경우 썸네일 생성
                    if (FileUtils.isImageFile(extension)) {
                        try {
                            Path filePath = uploadPath.resolve(folderUuid).resolve(originFileName);
                            byte[] fileBytes = Files.readAllBytes(filePath);
                            hyobeeThumbnailService.generateThumbnailWithBase64(fileBytes, originFileName, folderUuid, uploadPath);
//                            log.info("HiCloud 이미지 썸네일 생성 완료: {}", originFileName);
                        } catch (IOException e) {
                            log.warn("HiCloud 썸네일 생성 실패(다운로드는 성공): {} - {}", originFileName, e.getMessage());
                        }
                    }

                    // 다운로드 성공 시 파일 로그 UPDATE (successYn = 'Y')
                    try {
                        chatLogService.updateFileLog(companyCode, fileLogKey, "Y", null);
                    } catch (Exception logException) {
                        // 로그 업데이트 실패해도 비즈니스 로직에 영향 없도록
                        log.warn("HiCloud 파일 다운로드 성공 로그 업데이트 중 오류 발생: fileId={}, fileName={}",
                                sourceFileId, originFileName, logException);
                    }

                    downloadedFiles.add(HiCloudFileResult.of(
                            fileInfo.getDownLoadUrl(),
                            savedPath,
                            "성공",
                            folderUuid,
                            fileInfo.getFileName(),
                            fileInfo.getFileSize()
                    ));

//                    log.info("HiCloud 파일 다운로드 성공: {} -> {} ({} bytes)", originFileName, savedPath, fileInfo.getFileSize());

                } catch (Exception e) {
//                    log.error("HiCloud 파일 다운로드 실패: {}", originFileName, e);
                    // 다운로드 실패 시 파일 로그 UPDATE (successYn = 'N', errorMessage 설정)
                    try {
                        chatLogService.updateFileLog(companyCode, fileLogKey, "N", e.getMessage());
                    } catch (Exception logException) {
                        log.warn("HiCloud 파일 다운로드 실패 로그 업데이트 중 오류 발생: fileId={}, fileName={}",
                                sourceFileId, originFileName, logException);
                    }

                    failedFiles.add(HiCloudFileResult.of(
                            fileInfo.getDownLoadUrl(),
                            null,
                            e.getMessage(),
                            folderUuid,
                            fileInfo.getFileName(),
                            0L
                    ));
                }
            }

            // 실패한 파일이 있으면 ERROR_FLAG를 true로 설정
            boolean hasFailures = !failedFiles.isEmpty();
            Map<String, Object> result = new HashMap<>();
            Map<String, Object> header = new HashMap<>();
            header.put("ERROR_FLAG", hasFailures);
            header.put("ERROR_MSG", hasFailures ?
                    String.format("일부 파일 다운로드 실패: 성공 %d/%d", downloadedFiles.size(), attachedCloudFiles.size()) :
                    "파일 다운로드 완료");
            result.put("HEADER", header);
            result.put("totalCount", attachedCloudFiles.size());
            result.put("successCount", downloadedFiles.size());
            result.put("failedCount", failedFiles.size());
            if (!downloadedFiles.isEmpty()) {
                result.put("downloadedFiles", downloadedFiles);
            }
            if (!failedFiles.isEmpty()) {
                result.put("failedFiles", failedFiles);
            }
            return result;

        } catch (Exception e) {
//            log.error("HiCloud 파일 다운로드 중 오류 발생", e);
            Map<String, Object> errorResult = new HashMap<>();
            Map<String, Object> header = new HashMap<>();
            header.put("ERROR_FLAG", true);
            header.put("ERROR_MSG", "파일 다운로드 중 오류가 발생했습니다: " + e.getMessage());
            errorResult.put("HEADER", header);
            return errorResult;
        }
    }

    /**
     * 파일 첨부 정보 구성
     * - 업로드된 파일 ID 목록을 기반으로 뤼튼 API에 전달할 첨부파일 정보(JSON 배열)를 구성
     * - 파일을 읽어 바이너리 데이터를 Base64 인코딩 후 AttachFileInfo 객체로 변환
     * - UUID 폴더 구조 지원: "folderUuid/filename" 또는 "folderUuid" 형식
     * @param fileIds 파일 ID 목록 (URL 인코딩된 파일명 또는 UUID)
     */
    @Override
    public List<AttachFileInfo> attachFilesPayload(List<String> fileIds) {
        // 파일 ID 목록이 비어있으면 처리 생략
        if (fileIds.isEmpty()) {
            return Collections.emptyList();
        }

        // 각 파일 ID를 AttachFileInfo 객체로 변환
        return fileIds.stream()
                .map(this::buildAttachFileInfo)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * 원본 파일 삭제 처리
     * - 메시지 전송 완료 후 원본 파일만 삭제 (썸네일은 유지)
     * - UUID 폴더 구조 지원: "folderUuid/filename" 또는 "folderUuid" 형식
     * - 이미지가 아닌 파일의 경우, 폴더가 비어있으면 폴더도 삭제
     * - 경로 탐색 공격 방지 로직 포함
     * @param fileIds 삭제할 파일 ID 목록 (URL 인코딩된 파일명 또는 UUID)
     */
    @Override
    public void deleteOriginalFiles(List<String> fileIds) {
        // 파일 ID 목록 유효성 검증
        if (fileIds == null || fileIds.isEmpty()) {
            return;
        }

        // 각 파일별 삭제 처리
        for (String encodedFileName : fileIds) {
            try {
                // URL 디코딩
                String originFileName = URLDecoder.decode(encodedFileName, StandardCharsets.UTF_8);

                Path uploadPath = getUploadPath();
                Path filePath;

                // UUID 폴더 구조: "folderUuid/filename" 또는 "folderUuid" (폴더만 전달된 경우)
                if (originFileName.contains("/")) {
                    // "folderUuid/filename" 형식
                    filePath = uploadPath.resolve(originFileName).normalize();
                } else {
                    // UUID만 전달된 경우: 폴더 내 첫 번째 파일 찾기
                    if (originFileName.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")) {
                        Path folderPath = uploadPath.resolve(originFileName).normalize();

                        // 경로 탐색 공격 방지
                        if (!folderPath.startsWith(uploadPath.normalize())) {
//                            log.warn("잘못된 폴더 경로입니다. folderUuid={}", originFileName);
                            continue;
                        }

                        if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
//                            log.warn("요청한 폴더가 존재하지 않습니다. folderUuid={}", originFileName);
                            continue;
                        }

                        // 폴더 내 thumb_로 시작하지 않는 모든 파일 삭제 (썸네일은 유지)
                        try (java.util.stream.Stream<Path> files = Files.list(folderPath)) {
                            List<Path> filesToDelete = files
                                    .filter(Files::isRegularFile)
                                    .filter(path -> {
                                        String fileName = path.getFileName().toString().toLowerCase();
                                        // thumb_로 시작하는 파일은 제외
                                        return !fileName.startsWith("thumb_");
                                    })
                                    .collect(Collectors.toList());

                            if (filesToDelete.isEmpty()) {
//                                log.info("폴더 내 삭제할 파일이 없습니다 (thumb_ 파일만 존재). folderUuid={}", originFileName);
                                continue;
                            }

                            // thumb_로 시작하지 않는 모든 파일 삭제
                            for (Path fileToDelete : filesToDelete) {
                                try {
                                    Files.delete(fileToDelete);
//                                    log.info("원본 파일 삭제 완료: {}", fileToDelete.getFileName());
                                } catch (IOException e) {
//                                    log.warn("파일 삭제 실패: {}", fileToDelete.getFileName(), e);
                                }
                            }

                            // 폴더가 비어있으면 폴더도 삭제 (thumb_ 파일만 남아있어도 삭제하지 않음)
                            try (java.util.stream.Stream<Path> remainingFiles = Files.list(folderPath)) {
                                boolean hasNonThumbFiles = remainingFiles
                                        .filter(Files::isRegularFile)
                                        .anyMatch(path -> {
                                            String fileName = path.getFileName().toString().toLowerCase();
                                            return !fileName.startsWith("thumb_");
                                        });

                                if (!hasNonThumbFiles) {
                                    // thumb_ 파일만 남아있거나 폴더가 비어있으면 폴더 삭제
                                    try (java.util.stream.Stream<Path> checkEmpty = Files.list(folderPath)) {
                                        boolean isEmpty = !checkEmpty.findAny().isPresent();
                                        if (isEmpty) {
                                            Files.delete(folderPath);
//                                            log.info("빈 폴더 삭제 완료: {}", folderPath);
                                        }
                                    }
                                }
                            }

                            // 다음 파일 처리로 계속
                            continue;
                        }
                    } else {
//                        log.warn("UUID 폴더 구조가 아닌 파일은 건너뜁니다: {}", originFileName);
                        continue;
                    }
                }

                // 경로 탐색 공격 방지
                if (!filePath.startsWith(uploadPath.normalize())) {
//                    log.warn("잘못된 파일 경로입니다. filename={}", originFileName);
                    continue;
                }

                // 원본 파일 삭제 (썸네일은 유지)
                if (Files.exists(filePath) && Files.isRegularFile(filePath)) {
                    // 파일 확장자 확인 (이미지 파일 여부)
                    String extension = FileUtils.getFileExtension(filePath.getFileName().toString());
                    boolean isImage = FileUtils.isImageFile(extension);

                    Files.delete(filePath);
//                    log.info("원본 파일 삭제 완료: {}", filePath);

                    // 이미지 파일이 아닌 경우, 폴더가 비어있으면 폴더도 삭제
                    if (!isImage) {
                        Path folderPath = filePath.getParent();
                        if (folderPath != null && Files.exists(folderPath) && Files.isDirectory(folderPath)) {
                            try (java.util.stream.Stream<Path> files = Files.list(folderPath)) {
                                boolean isEmpty = !files.findAny().isPresent();
                                if (isEmpty) {
                                    Files.delete(folderPath);
//                                    log.info("빈 폴더 삭제 완료: {}", folderPath);
                                }
                            }
                        }
                    }
                } else {
                    log.warn("삭제할 원본 파일이 존재하지 않습니다: {}", originFileName);
                }

            } catch (Exception e) {
                log.error("원본 파일 삭제 중 오류 발생: {}", encodedFileName, e);
                // 개별 파일 삭제 실패해도 계속 진행
            }
        }
    }


    // 공통 업로드 경로 조회 (필요 시 디렉터리 생성까지 처리)
    private Path getUploadPath() throws IOException {
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        String basePath = (isWindows ? "D:" : "") + "/xtrmData/appData/aiChat/upload";

        String uploadDir = xtrmConfig.getString("AI_CHAT_UPLOAD_PATH", basePath);
        Path directory = Paths.get(uploadDir);
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }
        return directory;
    }

    // 로컬 저장소 저장 (MultipartFile 기준, 업로드 경로는 AI_CHAT_UPLOAD_PATH 사용)
    private String uploadToLocalStorage(MultipartFile file, String originalFilename, String folderUuid) throws IOException {
        return uploadToLocalStorage(file.getBytes(), originalFilename, folderUuid);
    }

    // 로컬 저장소 저장 (byte[] 기준, UUID 폴더 하위에 원본 파일명으로 저장)
    private String uploadToLocalStorage(byte[] fileBytes, String originalFilename, String folderUuid) throws IOException {
        // 업로드 경로 조회 (없으면 생성)
        Path uploadPath = getUploadPath();

        // UUID 폴더 생성
        Path folderPath = uploadPath.resolve(folderUuid);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        // 원본 파일명으로 저장 (동일 파일명이 있을 경우 덮어쓰기)
        Path filePath = folderPath.resolve(originalFilename);

        // 파일 저장
        Files.write(filePath, fileBytes);

//        log.info("로컬 저장 완료: {} (UUID: {})", filePath, folderUuid);

        return filePath.toString();
    }

    // 로컬 파일 삭제
    private void deleteLocalFile(String filename) throws IOException {
        // 경로 탐색 공격 방지
        if (filename == null || filename.isEmpty()) {
            throw new IllegalArgumentException("파일명이 비어있습니다.");
        }

        Path uploadPath = getUploadPath();
        Path resolvedPath = uploadPath.resolve(filename).normalize();

        // 경로 탐색 공격 방지: 업로드 디렉터리 밖으로 나가는지 확인
        if (!resolvedPath.startsWith(uploadPath.normalize())) {
            throw new SecurityException("잘못된 파일 경로입니다: " + filename);
        }

        if (Files.exists(resolvedPath)) {
            Files.delete(resolvedPath);
//            log.info("로컬 파일 삭제 완료: {}", resolvedPath);
        } else {
//            log.warn("삭제할 파일이 존재하지 않습니다: {}", resolvedPath);
        }
    }

    // 클라우드 파일 다운로드 재시도
    private String downloadCloudFileWithRetry(String downloadUrl, String fileName, Path uploadPath, int maxRetries)
            throws IOException {
        int attempt = 0;
        IOException lastException = null;

        while (attempt < maxRetries) {
            try {
                attempt++;
//                log.info("파일 다운로드 시도 {}/{}: {}", attempt, maxRetries, fileName);

                return downloadHiCloudFile(downloadUrl, fileName, uploadPath);

            } catch (IOException e) {
                lastException = e;
//                log.warn("파일 다운로드 실패 (시도 {}/{}): {}", attempt, maxRetries, e.getMessage());

                if (attempt < maxRetries) {
                    try {
                        // 재시도 전 대기 (지수 백오프: 1초, 2초, 4초...)
                        long waitTime = (long) (Math.pow(2, attempt - 1) * RETRY_BASE_DELAY_MS);
                        Thread.sleep(waitTime);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new IOException("재시도 대기 중 인터럽트 발생", ie);
                    }
                }
            }
        }

        throw new IOException("파일 다운로드 실패 (" + maxRetries + "회 재시도)", lastException);
    }

    // 클라우드 파일 다운로드 (UUID 폴더 하위에 저장)
    private String downloadHiCloudFileToUuidFolder(String downloadUrl, String fileName, String folderUuid, Path uploadPath, int maxRetryCount) throws IOException {
        // 파일명 검증 및 경로 탐색 공격 방지
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("파일명이 비어있습니다.");
        }

        // 파일명에서 위험한 문자 제거
        String sanitizedFileName = fileValidator.sanitizeFileName(fileName);

        // UUID 폴더 생성
        Path folderPath = uploadPath.resolve(folderUuid);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        HttpURLConnection conn = null;
        int retryCount = 0;
        IOException lastException = null;

        while (retryCount < maxRetryCount) {
            try {
                URL url = new URL(downloadUrl);
                conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod(HttpMethod.GET.name());
                conn.setRequestProperty(HttpHeaders.ACCEPT, MediaType.APPLICATION_OCTET_STREAM_VALUE);
                conn.setRequestProperty(HttpHeaders.USER_AGENT, "Mozilla/5.0");
                conn.setConnectTimeout(CONNECT_TIMEOUT_MS);
                conn.setReadTimeout(READ_TIMEOUT_MS);

                int responseCode = conn.getResponseCode();
                if (responseCode != HttpURLConnection.HTTP_OK) {
                    throw new IOException("HTTP 오류 코드: " + responseCode + " - " + conn.getResponseMessage());
                }

                // UUID 폴더 하위에 파일 저장
                Path resolvedPath = folderPath.resolve(sanitizedFileName).normalize();

                // 경로 탐색 공격 방지: normalize 후 업로드 경로 내부인지 확인
                if (!resolvedPath.startsWith(uploadPath.normalize())) {
                    throw new SecurityException("잘못된 파일 경로입니다: " + fileName);
                }

                try (InputStream is = conn.getInputStream();
                     OutputStream os = Files.newOutputStream(resolvedPath)) {

                    byte[] buffer = new byte[BUFFER_SIZE];
                    int bytesRead;

                    while ((bytesRead = is.read(buffer)) != -1) {
                        os.write(buffer, 0, bytesRead);
                    }
                }

//                log.info("HiCloud 파일 다운로드 완료: {} bytes, 경로: {}", downloadedBytes, resolvedPath);
                // UUID 폴더 경로 포함 파일 경로 반환 (folderUuid/filename 형식)
                return folderUuid + "/" + sanitizedFileName;

            } catch (IOException e) {
                lastException = e;
                retryCount++;
                if (retryCount < maxRetryCount) {
                    try {
                        Thread.sleep(RETRY_BASE_DELAY_MS * retryCount);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new IOException("재시도 중 인터럽트 발생", ie);
                    }
//                    log.warn("HiCloud 파일 다운로드 재시도: {}/{}", retryCount, maxRetryCount);
                }
            } finally {
                if (conn != null) {
                    conn.disconnect();
                }
            }
        }

        throw new IOException("HiCloud 파일 다운로드 실패 (최대 재시도 횟수 초과)", lastException);
    }

    // 클라우드 파일 다운로드 (기존 메서드 - 하위 호환성 유지)
    private String downloadHiCloudFile(String downloadUrl, String fileName, Path uploadPath) throws IOException {
        // UUID 생성하여 UUID 폴더 하위에 저장
        String folderUuid = UUID.randomUUID().toString();
        return downloadHiCloudFileToUuidFolder(downloadUrl, fileName, folderUuid, uploadPath, 1);
    }

    /**
     * 업로드 파일 정보를 조회하여 JSON 바디에 포함시키기 위한 헬퍼
     * - AI_CHAT_UPLOAD_PATH/UUID 폴더에서 실제 파일을 읽어 Base64로 인코딩한 뒤, 뤼튼 API 규격에 맞는 AttachFileInfo 를 생성한다.
     */
    private AttachFileInfo buildAttachFileInfo(String encodedFileName) {
        // URL 디코딩 (프론트에서 인코딩된 파일명)
        String originFileName = URLDecoder.decode(encodedFileName, StandardCharsets.UTF_8);
        try {
            Path uploadPath = getUploadPath();
            Path filePath;
            String folderUuid = null;
            String actualFileName = null;

            // UUID 폴더 구조 지원: "folderUuid/filename" 또는 "folderUuid" (폴더만 전달된 경우)
            if (originFileName.contains("/")) {
                // UUID 폴더 하위 파일: "folderUuid/filename" 형식
                filePath = uploadPath.resolve(originFileName).normalize();
                folderUuid = originFileName.substring(0, originFileName.indexOf("/"));
                actualFileName = originFileName.substring(originFileName.indexOf("/") + 1);
            } else {
                // UUID만 전달된 경우: 폴더 내 첫 번째 파일 찾기
                if (originFileName.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")) {
                    folderUuid = originFileName;
                    Path folderPath = uploadPath.resolve(folderUuid).normalize();

                    // 경로 탐색 공격 방지
                    if (!folderPath.startsWith(uploadPath.normalize())) {
//                        log.warn("잘못된 폴더 경로입니다. folderUuid={}", folderUuid);
                        return null;
                    }

                    if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
//                        log.warn("요청한 폴더가 존재하지 않습니다. folderUuid={}", folderUuid);
                        return null;
                    }

                    // 폴더 내 thumb_로 시작하지 않는 첫 번째 파일 찾기
                    try (java.util.stream.Stream<Path> files = Files.list(folderPath)) {
                        Optional<Path> firstFile = files
                                .filter(Files::isRegularFile)
                                .filter(path -> {
                                    String fileName = path.getFileName().toString().toLowerCase();
                                    // thumb_로 시작하는 파일은 제외
                                    return !fileName.startsWith("thumb_");
                                })
                                .findFirst();

                        if (firstFile.isPresent()) {
                            filePath = firstFile.get();
                            actualFileName = filePath.getFileName().toString();
//                            log.info("UUID 폴더 내 첫 번째 파일 찾음: {} -> {}", folderUuid, actualFileName);
                        } else {
//                            log.warn("폴더 내 파일이 없습니다 (thumb_ 파일만 존재). folderUuid={}", folderUuid);
                            return null;
                        }
                    }
                } else {
                    // 기존 형식 지원 (하위 호환성)
                    filePath = uploadPath.resolve(originFileName).normalize();
                    actualFileName = originFileName;
                }
            }

            // 경로 탐색 공격 방지
            if (!filePath.startsWith(uploadPath.normalize())) {
//                log.warn("잘못된 파일 경로입니다. filename={}", originFileName);
                return null;
            }

            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
//                log.warn("요청한 파일이 존재하지 않습니다. filename={}", originFileName);
                return null;
            }

            // MIME 타입 자동 감지 (실패 시 application/octet-stream)
            String mimeType = Optional.ofNullable(Files.probeContentType(filePath)).orElse(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            byte[] fileBytes = Files.readAllBytes(filePath);

            // UUID 폴더에서 thumbnail_id 추출
            // 이미지 파일인 경우 thumbnail_id로 사용되고, 이미지가 아닌 경우에도 file_log_key로 사용됨
            String thumbnailId = null;
            if (folderUuid != null && folderUuid.matches("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")) {
                thumbnailId = folderUuid;
            }

            // 뤼튼 API 규격에 맞는 AttachFileInfo 생성 (파일명, MIME 타입, Base64 인코딩된 파일 바이너리 데이터, 크기, thumbnail_id)
            // 외부 API로 전달할 때는 파일명만 전달 (UUID 경로 제거)
            String filenameForApi = actualFileName != null ? actualFileName : originFileName;

            return AttachFileInfo.of(
                    filenameForApi,
                    mimeType,
                    Base64.getEncoder().encodeToString(fileBytes),
                    fileBytes.length,
                    thumbnailId
            );
        } catch (IOException e) {
//            log.error("파일 정보 조회 중 오류가 발생했습니다. filename={}", originFileName, e);
            return null;
        }
    }

    @Override
    public String getImageByThumbnailId(String thumbnailId) {
        try {
            Path uploadPath = getUploadPath();
            return hyobeeThumbnailService.getImageByThumbnailId(thumbnailId, uploadPath);
        } catch (IOException e) {
//            log.error("업로드 경로 조회 중 오류가 발생했습니다.", e);
            return null;
        }
    }

    /**
     * MIME 타입 결정 (contentType 우선, 없으면 확장자 기반)
     * @param contentType Content-Type 헤더 값 (있을 경우)
     * @param extension 파일 확장자 (소문자, 점 제외)
     * @return MIME 타입 문자열
     */
    private String getMimeType(String contentType, String extension) {
        // contentType이 있으면 MediaType.valueOf()로 검증 및 표준화
        if (contentType != null && !contentType.isEmpty()) {
            try {
                // MediaType.valueOf()로 파싱하여 표준화 (예: "image/jpeg; charset=utf-8" -> "image/jpeg")
                MediaType mediaType = MediaType.valueOf(contentType);
                return mediaType.toString();
            } catch (IllegalArgumentException e) {
                // 잘못된 MIME 타입이면 확장자 기반으로 대체 방법 사용
                log.debug("잘못된 MIME 타입: {}, 확장자 기반으로 추정", contentType);
                return getMimeTypeFromExtension(extension);
            }
        }

        // contentType이 없으면 확장자 기반으로 추정
        return getMimeTypeFromExtension(extension);
    }

    /**
     * 확장자로부터 MIME 타입 추정 (Spring MediaType 상수 사용)
     * @param extension 파일 확장자 (소문자, 점 제외)
     * @return MIME 타입 문자열
     */
    private String getMimeTypeFromExtension(String extension) {
        if (extension == null || extension.isEmpty()) {
            return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        String lowerExt = extension.toLowerCase();
        switch (lowerExt) {
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG_VALUE;
            case "png":
                return MediaType.IMAGE_PNG_VALUE;
            case "gif":
                return MediaType.IMAGE_GIF_VALUE;
            case "pdf":
                return MediaType.APPLICATION_PDF_VALUE;
            case "txt":
                return MediaType.TEXT_PLAIN_VALUE;
            case "html":
                return MediaType.TEXT_HTML_VALUE;
            case "xml":
                return MediaType.APPLICATION_XML_VALUE;
            case "json":
                return MediaType.APPLICATION_JSON_VALUE;
            case "doc":
                return "application/msword";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls":
                return "application/vnd.ms-excel";
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "zip":
                return "application/zip";
            default:
                return MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
    }
}

