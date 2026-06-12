package xs.aichat.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.regex.Pattern;

/**
 * 파일 검증 서비스
 */
@Slf4j
@Component
public class FileValidator {

    // 파일 정책 (확장자/용량 등 업로드·다운로드 공통 제한)
    private static final String[] ALLOWED_EXTENSIONS = {
        "jpg", "jpeg", "png",   // 이미지
        "pdf",                  // PDF
        "doc", "docx",          // Word
        "hwp", "hwpx"           // Hwp
    };

    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

    private static final Pattern INVALID_FILENAME_PATTERN = Pattern.compile(".*[<>:\"/\\\\|?*].*");

    /**
     * 파일 유효성 검사 (크기, 확장자, 파일명)
     * @param file 검증할 파일
     * @throws IllegalArgumentException 검증 실패 시
     */
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }

        // 파일 크기 검증 (20MB 제한)
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("파일 크기가 %dMB를 초과합니다. ",  MAX_FILE_SIZE / 1024 / 1024)
            );
        }

        String filename = file.getOriginalFilename();
        String extension = FileUtils.getFileExtension(filename);
        
        // 허용 확장자 검증
        if (!isAllowedExtension(extension)) {
            throw new IllegalArgumentException(
                "허용되지 않은 파일 형식입니다: " + extension
            );
        }

        if (filename != null) {
            // 경로 탐색 공격 방지 (.., /, \ 제거)
            if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
                throw new IllegalArgumentException("파일명에 경로 구분자나 상위 디렉터리 참조가 포함되어 있습니다.");
            }
            
            // 특수문자 검증 (<>:"/\|?* 등)
            if (INVALID_FILENAME_PATTERN.matcher(filename).matches()) {
                throw new IllegalArgumentException("파일명에 허용되지 않은 특수문자가 포함되어 있습니다.");
            }
        }
    }

    /**
     * 허용 확장자인지 확인
     * @param extension 확장자
     * @return 허용된 확장자이면 true
     */
    public boolean isAllowedExtension(String extension) {
        for (String allowed : ALLOWED_EXTENSIONS) {
            if (allowed.equalsIgnoreCase(extension)) {
                return true;
            }
        }
//        return false;
        return true; // TODO: 추후 해제해야. 임시 해제 처리 - 2026.01.27
    }

    /**
     * 파일명 정제 (경로 탐색 공격 방지)
     * @param fileName 원본 파일명
     * @return 정제된 파일명
     */
    public String sanitizeFileName(String fileName) {
        if (fileName == null) {
            return "";
        }
        
        // 경로 구분자 제거 및 정제
        String sanitized = fileName
            .replaceAll("[/\\\\]", "_")  // 경로 구분자 제거
            .replaceAll("\\.\\.", "_")   // 상위 디렉터리 참조 제거
            .replaceAll(".*[<>:\"|?*].*", "_"); // 위험한 특수문자 제거
        
        // 파일명 길이 제한 (255자)
        if (sanitized.length() > 255) {
            String extension = FileUtils.getFileExtension(sanitized);
            int maxNameLength = 255 - extension.length() - 1;
            sanitized = sanitized.substring(0, Math.max(maxNameLength, 1)) + "." + extension;
        }
        
        return sanitized;
    }

    /**
     * 최대 파일 크기 반환
     * @return 최대 파일 크기 (bytes)
     */
    public long getMaxFileSize() {
        return MAX_FILE_SIZE;
    }
}

